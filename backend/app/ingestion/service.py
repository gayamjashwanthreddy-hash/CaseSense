import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.ingestion import (
    DataIngestionRun,
    PublicGrievanceStatistic,
    PublicInstitutionRecord,
    PublicRegulatoryDocument,
)
from app.models.institution import Institution
from app.ingestion.adapters.cpgrams import CPGRAMSAdapter
from app.ingestion.adapters.aishe import AISHEAdapter
from app.ingestion.adapters.aicte import AICTEAdapter
from app.ingestion.adapters.data_gov import DataGovAdapter

logger = logging.getLogger("casesense.ingestion.service")


class IngestionService:
    """
    Orchestration service for regulatory data acquisition, normalization, schema validation,
    and idempotent persistence into the CaseSense repository database.
    """

    ADAPTERS = {
        "cpgrams": CPGRAMSAdapter,
        "aishe": AISHEAdapter,
        "aicte": AICTEAdapter,
        "data_gov": DataGovAdapter,
    }

    def __init__(self, db: Session):
        self.db = db

    def run_source(
        self,
        source_name: str,
        use_fixture: bool = False,
        limit: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Executes a single source ingestion pipeline with full provenance and rollback safety.
        """
        source_key = source_name.lower().strip()
        adapter_cls = self.ADAPTERS.get(source_key)
        if not adapter_cls:
            raise ValueError(f"Unknown source '{source_name}'. Supported sources: {', '.join(self.ADAPTERS.keys())}")

        run_id = str(uuid.uuid4())
        adapter = adapter_cls(use_fixture=use_fixture)
        if hasattr(adapter, "limit") and limit:
            adapter.limit = limit

        run = DataIngestionRun(
            id=run_id,
            source_name=source_key,
            source_url=adapter.source_url,
            retrieval_status="RUNNING",
            retrieval_timestamp=datetime.now(timezone.utc),
            licence_or_attribution=adapter.licence_attribution,
        )
        self.db.add(run)
        self.db.commit()

        try:
            raw_data = adapter.fetch_raw()
            parsed = adapter.parse_and_validate(raw_data)
            records = parsed.get("records", [])
            status = parsed.get("status", "SUCCESS")
            message = parsed.get("message", "")

            inserted = 0
            updated = 0
            skipped = 0
            failed = 0

            # 1. CPGRAMS Grievance Statistics Persistence
            if source_key == "cpgrams":
                seen_stat_ids = set()
                for rec in records:
                    if rec.id in seen_stat_ids:
                        skipped += 1
                        continue
                    seen_stat_ids.add(rec.id)

                    try:
                        existing = self.db.query(PublicGrievanceStatistic).filter_by(id=rec.id).first()
                        if existing:
                            existing.received_count = rec.received_count
                            existing.disposed_count = rec.disposed_count
                            existing.disposed_percentage = rec.disposed_percentage
                            existing.pending_0_to_60 = rec.pending_0_to_60
                            existing.pending_60_to_180 = rec.pending_60_to_180
                            existing.pending_180_to_365 = rec.pending_180_to_365
                            existing.pending_over_1_year = rec.pending_over_1_year
                            existing.report_date = rec.report_date
                            existing.retrieved_at = datetime.now(timezone.utc)
                            updated += 1
                        else:
                            db_rec = PublicGrievanceStatistic(
                                id=rec.id,
                                source_name=rec.source_name,
                                source_url=rec.source_url,
                                category_type=rec.category_type,
                                organization_name=rec.organization_name,
                                received_count=rec.received_count,
                                disposed_count=rec.disposed_count,
                                disposed_percentage=rec.disposed_percentage,
                                pending_0_to_60=rec.pending_0_to_60,
                                pending_60_to_180=rec.pending_60_to_180,
                                pending_180_to_365=rec.pending_180_to_365,
                                pending_over_1_year=rec.pending_over_1_year,
                                report_date=rec.report_date,
                                retrieved_at=datetime.now(timezone.utc),
                                licence_attribution=rec.licence_attribution,
                            )
                            self.db.add(db_rec)
                            inserted += 1
                        self.db.flush()
                    except Exception as e:
                        logger.error(f"Failed to upsert CPGRAMS record {rec.id}: {e}")
                        failed += 1

            # 2. AISHE / AICTE Institution Records Persistence
            elif source_key in ("aishe", "aicte"):
                seen_pub_ids = set()
                seen_inst_ids = set()
                for rec in records:
                    if rec.id in seen_pub_ids:
                        skipped += 1
                        continue
                    seen_pub_ids.add(rec.id)

                    try:
                        # Upsert into public_institution_records (provenance archive)
                        existing_pub = self.db.query(PublicInstitutionRecord).filter_by(id=rec.id).first()
                        if existing_pub:
                            existing_pub.name = rec.name
                            existing_pub.state = rec.state
                            existing_pub.district = rec.district
                            existing_pub.management_type = rec.management_type
                            existing_pub.category = rec.category
                            existing_pub.website = rec.website
                            existing_pub.retrieved_at = datetime.now(timezone.utc)
                            updated += 1
                        else:
                            db_pub = PublicInstitutionRecord(
                                id=rec.id,
                                source_name=rec.source_name,
                                source_id=rec.source_id,
                                source_url=rec.source_url,
                                name=rec.name,
                                state=rec.state,
                                district=rec.district,
                                management_type=rec.management_type,
                                category=rec.category,
                                website=rec.website,
                                year_of_establishment=rec.year_of_establishment,
                                location=rec.location,
                                approval_status=rec.approval_status,
                                validation_status=rec.validation_status,
                                retrieved_at=datetime.now(timezone.utc),
                                licence_attribution=rec.licence_attribution,
                            )
                            self.db.add(db_pub)
                            inserted += 1
                        self.db.flush()

                        # Also sync into main institutions table for operational dashboard & directory lookup
                        inst_id = rec.source_id  # e.g. "1-10492811" or "U-0456"
                        if inst_id not in seen_inst_ids:
                            seen_inst_ids.add(inst_id)
                            existing_inst = self.db.query(Institution).filter_by(id=inst_id).first()
                            if existing_inst:
                                # Update fields without overwriting user associations or existing complaints
                                existing_inst.name = rec.name
                                existing_inst.state = rec.state
                                existing_inst.district = rec.district
                                existing_inst.category = rec.category or existing_inst.category
                                existing_inst.approval_status = rec.approval_status or existing_inst.approval_status
                            else:
                                # Insert new institution
                                region = "Northern"
                                if rec.state in ("Maharashtra", "Gujarat", "Goa"):
                                    region = "Western"
                                elif rec.state in ("Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana"):
                                    region = "Southern"
                                elif rec.state in ("West Bengal", "Odisha", "Bihar", "Jharkhand"):
                                    region = "Eastern"

                                new_inst = Institution(
                                    id=inst_id,
                                    name=rec.name,
                                    state=rec.state,
                                    district=rec.district,
                                    region=region,
                                    category=rec.category or "Higher Education",
                                    approval_status=rec.approval_status or "Approved",
                                    accreditation="NBA / NAAC Accredited",
                                    affiliated_university=rec.management_type or "State University",
                                    head_of_institution=None,
                                    email=None,
                                    phone=None,
                                    risk_level="LOW",
                                )
                                self.db.add(new_inst)
                            self.db.flush()

                    except Exception as e:
                        logger.error(f"Failed to upsert institution record {rec.id}: {e}")
                        failed += 1

            # 3. data.gov.in Regulatory Documents Persistence
            elif source_key == "data_gov":
                seen_doc_ids = set()
                for rec in records:
                    if rec.id in seen_doc_ids:
                        skipped += 1
                        continue
                    seen_doc_ids.add(rec.id)

                    try:
                        existing_doc = self.db.query(PublicRegulatoryDocument).filter_by(id=rec.id).first()
                        if existing_doc:
                            existing_doc.title = rec.title
                            existing_doc.source_url = rec.source_url
                            existing_doc.publication_date = rec.publication_date
                            existing_doc.summary = rec.summary
                            existing_doc.retrieved_at = datetime.now(timezone.utc)
                            updated += 1
                        else:
                            db_doc = PublicRegulatoryDocument(
                                id=rec.id,
                                source_name=rec.source_name,
                                source_url=rec.source_url,
                                title=rec.title,
                                document_type=rec.document_type,
                                publication_date=rec.publication_date,
                                summary=rec.summary,
                                retrieved_at=datetime.now(timezone.utc),
                                licence_attribution=rec.licence_attribution,
                            )
                            self.db.add(db_doc)
                            inserted += 1
                        self.db.flush()
                    except Exception as e:
                        logger.error(f"Failed to upsert regulatory document {rec.id}: {e}")
                        failed += 1

            # Update run record
            run.retrieval_status = status
            run.records_fetched = len(records)
            run.records_inserted = inserted
            run.records_updated = updated
            run.records_skipped = skipped
            run.records_failed = failed
            run.message = message
            self.db.commit()

            return {
                "run_id": run_id,
                "source": source_key,
                "status": status,
                "records_fetched": len(records),
                "records_inserted": inserted,
                "records_updated": updated,
                "records_skipped": skipped,
                "records_failed": failed,
                "licence_or_attribution": adapter.licence_attribution,
                "message": message,
            }

        except Exception as exc:
            self.db.rollback()
            logger.exception(f"Unhandled error during ingestion for {source_name}: {exc}")
            run.retrieval_status = "FAILED"
            run.message = f"Ingestion error: {str(exc)}"
            self.db.commit()
            return {
                "run_id": run_id,
                "source": source_key,
                "status": "FAILED",
                "records_fetched": 0,
                "records_inserted": 0,
                "records_updated": 0,
                "records_skipped": 0,
                "records_failed": 0,
                "licence_or_attribution": adapter.licence_attribution,
                "message": str(exc),
            }

    def run_all(
        self,
        use_fixture: bool = False,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Executes ingestion sequentially across all approved sources with error isolation.
        """
        results = []
        for src in self.ADAPTERS.keys():
            res = self.run_source(src, use_fixture=use_fixture, limit=limit)
            results.append(res)
        return results
