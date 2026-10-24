import pytest
from unittest.mock import patch, MagicMock
from pydantic import ValidationError
import httpx

from app.ingestion.base import validate_url_domain, SSRFProtectionError, SourceRateLimitError, SafeHttpClient
from app.ingestion.normalizer import clean_text, parse_int_safe, parse_float_safe, normalize_state_name
from app.ingestion.validator import ValidatedGrievanceStat, ValidatedInstitution, ValidatedRegulatoryDoc
from app.ingestion.adapters.cpgrams import CPGRAMSAdapter
from app.ingestion.adapters.aishe import AISHEAdapter
from app.ingestion.adapters.aicte import AICTEAdapter
from app.ingestion.adapters.data_gov import DataGovAdapter
from app.ingestion.service import IngestionService
from app.models.ingestion import PublicGrievanceStatistic, PublicInstitutionRecord, PublicRegulatoryDocument, DataIngestionRun
from app.models.user import User


# 1. SSRF Protection & Domain Allowlist Tests
def test_ssrf_domain_allowlist_approved():
    approved_urls = [
        "https://pgportal.gov.in/darpgdashboard",
        "https://pdf.aishe.nic.in/aisheinstitutemanagement/institutionDirectory%20/pm-vidya-laxmi",
        "https://www.aicte.gov.in/",
        "https://data.gov.in/backend/dms/v1/rss.xml",
    ]
    for url in approved_urls:
        validate_url_domain(url)  # Must not raise


def test_ssrf_domain_allowlist_blocked():
    blocked_urls = [
        "http://evil-tracker.com/steal-data",
        "http://169.254.169.254/latest/meta-data",
        "http://localhost:8000/internal",
        "ftp://data.gov.in/file",
        "file:///etc/passwd",
        "https://unauthorized-domain.org/data",
    ]
    for url in blocked_urls:
        with pytest.raises(SSRFProtectionError):
            validate_url_domain(url)


# 2. Field Normalization Tests
def test_normalizers():
    assert clean_text("   Indian   Institute of Technology  \n ") == "Indian Institute of Technology"
    assert clean_text(None) == ""
    assert parse_int_safe("36,160") == 36160
    assert parse_int_safe(None, default=0) == 0
    assert parse_int_safe("invalid", default=5) == 5
    assert parse_float_safe("93.60%") == 93.60
    assert parse_float_safe(None) == 0.0
    assert normalize_state_name("NCT of Delhi") == "Delhi"
    assert normalize_state_name("orissa") == "Odisha"
    assert normalize_state_name("Karnataka") == "Karnataka"


# 3. Schema Validation & Guardrail Tests
def test_validated_grievance_stat_valid():
    stat = ValidatedGrievanceStat(
        id="cpgrams:central:higher-education:2026-10-24",
        source_name="CPGRAMS",
        source_url="https://pgportal.gov.in/darpgdashboard",
        category_type="CENTRAL_MINISTRY",
        organization_name="Higher Education",
        received_count=36160,
        disposed_count=33847,
        disposed_percentage=93.6,
        pending_0_to_60=1901,
        pending_60_to_180=388,
        pending_180_to_365=24,
        pending_over_1_year=0,
        report_date="2026-10-24",
    )
    assert stat.received_count == 36160
    assert stat.disposed_percentage == 93.6


def test_validated_grievance_stat_clamping():
    stat = ValidatedGrievanceStat(
        id="test:1",
        source_name="CPGRAMS",
        source_url="https://pgportal.gov.in/darpgdashboard",
        category_type="CENTRAL_MINISTRY",
        organization_name="Test",
        received_count=10,
        disposed_count=15,
        disposed_percentage=150.0,  # Clamped to 100.0
        report_date="2026-10-24",
    )
    assert stat.disposed_percentage == 100.0


def test_validated_grievance_stat_negative_invalid():
    with pytest.raises(ValidationError):
        ValidatedGrievanceStat(
            id="test:2",
            source_name="CPGRAMS",
            source_url="https://pgportal.gov.in/darpgdashboard",
            category_type="CENTRAL_MINISTRY",
            organization_name="Test",
            received_count=-5,  # Invalid
            disposed_count=0,
            disposed_percentage=0.0,
            report_date="2026-10-24",
        )


# 4. Source Adapter Unit Tests (Using Fixtures)
def test_cpgrams_adapter_fixture():
    adapter = CPGRAMSAdapter(use_fixture=True)
    raw = adapter.fetch_raw()
    result = adapter.parse_and_validate(raw)

    assert result["status"] == "SUCCESS"
    assert len(result["records"]) == 7
    edu = next(r for r in result["records"] if r.organization_name == "Higher Education")
    assert edu.received_count == 36160
    assert edu.disposed_count == 33847
    assert edu.pending_0_to_60 == 1901


def test_aishe_adapter_fixture():
    adapter = AISHEAdapter(use_fixture=True)
    raw = adapter.fetch_raw()
    result = adapter.parse_and_validate(raw)

    assert result["status"] == "SUCCESS"
    assert len(result["records"]) == 5
    iitm = next(r for r in result["records"] if "Madras" in r.name)
    assert iitm.source_id == "U-0456"
    assert iitm.state == "Tamil Nadu"
    assert iitm.district == "Chennai"


def test_aicte_adapter_fixture():
    adapter = AICTEAdapter(use_fixture=True)
    raw = adapter.fetch_raw()
    result = adapter.parse_and_validate(raw)

    assert result["status"] == "SUCCESS"
    assert len(result["records"]) == 6
    apex = next(r for r in result["records"] if "Apex" in r.name)
    assert apex.source_id == "1-10492811"
    assert apex.state == "Uttar Pradesh"


def test_data_gov_adapter_fixture():
    adapter = DataGovAdapter(use_fixture=True)
    raw = adapter.fetch_raw()
    result = adapter.parse_and_validate(raw)

    assert result["status"] == "SUCCESS"
    assert len(result["records"]) == 3
    doc = result["records"][0]
    assert "AICTE" in doc.title or "All India Council" in doc.title


# 5. Service Idempotence & Deduplication Tests
def test_ingestion_service_idempotence(db_session):
    service = IngestionService(db_session)

    # First Run (all sources via fixture)
    res1 = service.run_all(use_fixture=True)
    for r in res1:
        assert r["status"] in ("SUCCESS", "MAINTENANCE_BLOCKED")
        assert r["records_inserted"] > 0
        assert r["records_failed"] == 0

    total_stats_1 = db_session.query(PublicGrievanceStatistic).count()
    total_inst_1 = db_session.query(PublicInstitutionRecord).count()
    total_docs_1 = db_session.query(PublicRegulatoryDocument).count()

    # Second Run (must be idempotent: 0 inserted, all updated)
    res2 = service.run_all(use_fixture=True)
    for r in res2:
        assert r["records_inserted"] == 0
        assert r["records_updated"] > 0
        assert r["records_failed"] == 0

    total_stats_2 = db_session.query(PublicGrievanceStatistic).count()
    total_inst_2 = db_session.query(PublicInstitutionRecord).count()
    total_docs_2 = db_session.query(PublicRegulatoryDocument).count()

    # Counts must be identical (no duplicate rows created)
    assert total_stats_1 == total_stats_2
    assert total_inst_1 == total_inst_2
    assert total_docs_1 == total_docs_2


# 6. API Route Security & Authorization Tests
def test_unauthenticated_ingestion_trigger_blocked(client):
    res = client.post("/api/v1/ingestion/run", json={"source": "cpgrams"})
    assert res.status_code == 401


def test_unauthorized_role_ingestion_trigger_blocked(client, apex_inst_token):
    res = client.post(
        "/api/v1/ingestion/run",
        json={"source": "cpgrams"},
        headers={"Authorization": f"Bearer {apex_inst_token}"},
    )
    assert res.status_code == 403


def test_admin_authorized_ingestion_trigger_success(client, admin_token):
    res = client.post(
        "/api/v1/ingestion/run",
        json={"source": "cpgrams", "use_fixture": True},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["source"] == "cpgrams"
    assert data[0]["status"] == "SUCCESS"


def test_public_statistics_endpoint_accessible(client, db_session):
    # Ingest fixture data first
    service = IngestionService(db_session)
    service.run_source("cpgrams", use_fixture=True)

    res = client.get("/api/v1/ingestion/statistics")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 7
    # Verify no PII fields exist
    first = data[0]
    assert "complainant" not in first
    assert "email" not in first
    assert "received_count" in first
    assert "disposed_count" in first


def test_public_documents_endpoint_accessible(client, db_session):
    service = IngestionService(db_session)
    service.run_source("data_gov", use_fixture=True)

    res = client.get("/api/v1/ingestion/documents")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
