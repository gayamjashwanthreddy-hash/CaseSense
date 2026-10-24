import os
import re
import logging
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
from app.ingestion.base import BaseAdapter, SafeHttpClient
from app.ingestion.normalizer import clean_text, parse_int_safe, parse_float_safe, normalize_state_name
from app.ingestion.validator import ValidatedGrievanceStat

logger = logging.getLogger("casesense.ingestion.cpgrams")


class CPGRAMSAdapter(BaseAdapter):
    """
    Adapter for CPGRAMS Public Grievances Dashboard (https://pgportal.gov.in/darpgdashboard).
    Collects aggregate grievance receipts, disposal counts, percentages, and ageing distributions.
    Does NOT access individual complaints, citizen identities, or private notes.
    """
    name = "CPGRAMS"
    source_url = "https://pgportal.gov.in/darpgdashboard"
    licence_attribution = "Department of Administrative Reforms and Public Grievances (DARPG), Government of India"

    def __init__(self, http_client: Optional[SafeHttpClient] = None, use_fixture: bool = False):
        super().__init__(http_client)
        self.use_fixture = use_fixture

    def fetch_raw(self) -> str:
        if self.use_fixture:
            return self._load_fixture()

        try:
            response = self.http.get(self.source_url)
            if response.status_code == 200:
                return response.text
            logger.warning(f"CPGRAMS live returned HTTP {response.status_code}. Falling back to fixture.")
            return self._load_fixture()
        except Exception as exc:
            logger.warning(f"CPGRAMS live fetch error ({exc}). Falling back to deterministic fixture.")
            return self._load_fixture()

    def _load_fixture(self) -> str:
        fixture_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "fixtures",
            "cpgrams_sample.html"
        )
        with open(fixture_path, "r", encoding="utf-8") as f:
            return f.read()

    def parse_and_validate(self, raw_html: str) -> Dict[str, Any]:
        soup = BeautifulSoup(raw_html, "html.parser")
        tables = soup.find_all("table")

        date_input = soup.find("input", {"id": "ReportDate"})
        raw_date = date_input.get("value") if date_input else None
        report_date = clean_text(raw_date) or "2026-10-24"

        records: List[ValidatedGrievanceStat] = []
        errors: List[str] = []

        if not tables:
            return {
                "records": [],
                "status": "FAILED",
                "message": "No data tables found in CPGRAMS dashboard HTML.",
                "metadata": {"tables_found": 0, "report_date": report_date},
            }

        # Table 0: Central Ministries & Departments
        if len(tables) >= 1:
            central_rows = tables[0].find_all("tr")[1:]  # skip header
            for row in central_rows:
                cells = [clean_text(td.get_text()) for td in row.find_all("td")]
                if len(cells) >= 8:
                    org_name = cells[0]
                    # Generate stable deterministic key
                    slug = re.sub(r"[^a-zA-Z0-9]+", "-", org_name).strip("-").lower()
                    date_slug = re.sub(r"[^a-zA-Z0-9]+", "-", report_date).strip("-")
                    stable_id = f"cpgrams:central:{slug}:{date_slug}"

                    try:
                        record = ValidatedGrievanceStat(
                            id=stable_id,
                            source_name=self.name,
                            source_url=self.source_url,
                            category_type="CENTRAL_MINISTRY",
                            organization_name=org_name,
                            received_count=parse_int_safe(cells[1]),
                            disposed_count=parse_int_safe(cells[2]),
                            disposed_percentage=parse_float_safe(cells[3]),
                            pending_0_to_60=parse_int_safe(cells[4]),
                            pending_60_to_180=parse_int_safe(cells[5]),
                            pending_180_to_365=parse_int_safe(cells[6]),
                            pending_over_1_year=parse_int_safe(cells[7]),
                            report_date=report_date,
                            licence_attribution=self.licence_attribution,
                        )
                        records.append(record)
                    except Exception as err:
                        errors.append(f"Row validation failed for {org_name}: {err}")

        # Table 1: States & Union Territories
        if len(tables) >= 2:
            state_rows = tables[1].find_all("tr")[1:]
            for row in state_rows:
                cells = [clean_text(td.get_text()) for td in row.find_all("td")]
                if len(cells) >= 8:
                    raw_state = cells[0]
                    norm_state = normalize_state_name(raw_state)
                    slug = re.sub(r"[^a-zA-Z0-9]+", "-", norm_state).strip("-").lower()
                    date_slug = re.sub(r"[^a-zA-Z0-9]+", "-", report_date).strip("-")
                    stable_id = f"cpgrams:state:{slug}:{date_slug}"

                    try:
                        record = ValidatedGrievanceStat(
                            id=stable_id,
                            source_name=self.name,
                            source_url=self.source_url,
                            category_type="STATE_UT",
                            organization_name=norm_state,
                            received_count=parse_int_safe(cells[1]),
                            disposed_count=parse_int_safe(cells[2]),
                            disposed_percentage=parse_float_safe(cells[3]),
                            pending_0_to_60=parse_int_safe(cells[4]),
                            pending_60_to_180=parse_int_safe(cells[5]),
                            pending_180_to_365=parse_int_safe(cells[6]),
                            pending_over_1_year=parse_int_safe(cells[7]),
                            report_date=report_date,
                            licence_attribution=self.licence_attribution,
                        )
                        records.append(record)
                    except Exception as err:
                        errors.append(f"Row validation failed for state {raw_state}: {err}")

        status = "SUCCESS" if records and not errors else ("PARTIAL" if records else "FAILED")
        return {
            "records": records,
            "status": status,
            "message": f"Parsed {len(records)} aggregate grievance records from CPGRAMS (date: {report_date}).",
            "metadata": {
                "report_date": report_date,
                "central_ministries_count": len([r for r in records if r.category_type == "CENTRAL_MINISTRY"]),
                "states_count": len([r for r in records if r.category_type == "STATE_UT"]),
                "errors_count": len(errors),
            },
        }
