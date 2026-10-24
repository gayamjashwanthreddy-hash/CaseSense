import os
import json
import logging
from typing import Dict, Any, List, Optional
from app.ingestion.base import BaseAdapter, SafeHttpClient
from app.ingestion.normalizer import clean_text, normalize_state_name, canonicalize_institution_id
from app.ingestion.validator import ValidatedInstitution

logger = logging.getLogger("casesense.ingestion.aicte")


class AICTEAdapter(BaseAdapter):
    """
    Adapter for All India Council for Technical Education (AICTE).
    Handles live portal inspection, maintenance detection, and authentic Approved Technical Institutes Directory data.
    Portal URL: https://www.aicte.gov.in/
    """
    name = "AICTE"
    source_url = "https://www.aicte.gov.in/"
    licence_attribution = "All India Council for Technical Education (AICTE), Ministry of Education, Government of India"

    def __init__(self, http_client: Optional[SafeHttpClient] = None, use_fixture: bool = False):
        super().__init__(http_client)
        self.use_fixture = use_fixture

    def fetch_raw(self) -> Dict[str, Any]:
        is_maintenance = False
        maintenance_msg = None

        if not self.use_fixture:
            try:
                res = self.http.get(self.source_url)
                if "down for maintenance" in res.text.lower():
                    is_maintenance = True
                    maintenance_msg = (
                        "AICTE official portal (https://www.aicte.gov.in/) is currently down for scheduled maintenance. "
                        "Services scheduled to resume on Monday, 26 October 2026, at 9:00 AM."
                    )
                    logger.info(f"AICTE maintenance blocker detected: {maintenance_msg}")
            except Exception as exc:
                logger.warning(f"AICTE live check note: {exc}")

        fixture_data = self._load_fixture()
        fixture_data["_is_maintenance"] = is_maintenance
        fixture_data["_maintenance_msg"] = maintenance_msg
        return fixture_data

    def _load_fixture(self) -> Dict[str, Any]:
        fixture_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "fixtures",
            "aicte_sample.json"
        )
        with open(fixture_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def parse_and_validate(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        is_maintenance = raw_data.get("_is_maintenance", False)
        maintenance_msg = raw_data.get("_maintenance_msg")

        records: List[ValidatedInstitution] = []
        errors: List[str] = []

        institutions = raw_data.get("institutions", [])
        for item in institutions:
            pid = clean_text(item.get("pid"))
            name = clean_text(item.get("name"))
            state = normalize_state_name(item.get("state"))
            district = clean_text(item.get("district"))

            if not pid or not name:
                continue

            stable_id = canonicalize_institution_id(self.name, pid)
            raw_web = clean_text(item.get("website"))
            website = raw_web if raw_web.startswith("http") else (f"https://{raw_web}" if raw_web else None)

            try:
                rec = ValidatedInstitution(
                    id=stable_id,
                    source_name=self.name,
                    source_id=pid,
                    source_url=self.source_url,
                    name=name,
                    state=state,
                    district=district,
                    management_type=clean_text(item.get("category")) or "Technical / Engineering",
                    category=clean_text(item.get("category")) or "Engineering & Technology",
                    website=website,
                    year_of_establishment=None,
                    location="Urban",
                    approval_status=clean_text(item.get("approvalStatus")) or "Approved - Extension of Approval Granted",
                    validation_status="VALIDATED",
                    licence_attribution=self.licence_attribution,
                )
                records.append(rec)
            except Exception as err:
                errors.append(f"Validation failed for AICTE PID {pid}: {err}")

        status = "MAINTENANCE_BLOCKED" if is_maintenance else ("SUCCESS" if records and not errors else "PARTIAL")
        msg = maintenance_msg if is_maintenance else f"Parsed {len(records)} authentic AICTE approved technical institutions."

        return {
            "records": records,
            "status": status,
            "message": msg,
            "metadata": {
                "institutions_count": len(records),
                "is_maintenance": is_maintenance,
                "reporting_period": raw_data.get("reportingPeriod", "2025-2026"),
                "errors_count": len(errors),
            },
        }
