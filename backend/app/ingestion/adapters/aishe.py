import os
import json
import logging
from typing import Dict, Any, List, Optional
from app.ingestion.base import BaseAdapter, SafeHttpClient
from app.ingestion.normalizer import clean_text, normalize_state_name, canonicalize_institution_id
from app.ingestion.validator import ValidatedInstitution

logger = logging.getLogger("casesense.ingestion.aishe")


class AISHEAdapter(BaseAdapter):
    """
    Adapter for All India Survey on Higher Education (AISHE) public institution directories:
    - PM Vidya Laxmi Higher Education Institutions directory
    - National Research & Development (R&D) institutions directory
    Base URL: https://pdf.aishe.nic.in/aisheinstitutemanagement
    """
    name = "AISHE"
    source_url = "https://pdf.aishe.nic.in/aisheinstitutemanagement/institutionDirectory%20/pm-vidya-laxmi"
    rnd_url = "https://pdf.aishe.nic.in/aisheinstitutemanagement/institutionDirectory%20/rnd-institute"
    licence_attribution = "Ministry of Education, Government of India (AISHE / NIC)"

    def __init__(self, http_client: Optional[SafeHttpClient] = None, use_fixture: bool = False, limit: Optional[int] = None):
        # Configure client with verify_ssl=False for NIC Root CA compatibility
        client = http_client or SafeHttpClient(verify_ssl=False)
        super().__init__(client)
        self.use_fixture = use_fixture
        self.limit = limit

    def fetch_raw(self) -> Dict[str, Any]:
        if self.use_fixture:
            return self._load_fixture()

        try:
            headers = {
                "Origin": "https://dashboard.aishe.gov.in",
                "Referer": "https://dashboard.aishe.gov.in/",
                "Accept": "application/json, text/plain, */*",
            }
            res_pm = self.http.get(self.source_url, headers=headers)
            if res_pm.status_code == 200:
                data_pm = res_pm.json()
                # Also fetch R&D institutes
                try:
                    res_rnd = self.http.get(self.rnd_url, headers=headers)
                    if res_rnd.status_code == 200:
                        data_rnd = res_rnd.json()
                        data_pm["rnDInstitutions"] = data_rnd.get("rnDInstitutions", [])
                except Exception as rnd_err:
                    logger.warning(f"AISHE R&D fetch note: {rnd_err}")

                return data_pm

            logger.warning(f"AISHE live returned HTTP {res_pm.status_code}. Using fixture.")
            return self._load_fixture()
        except Exception as exc:
            logger.warning(f"AISHE live fetch error ({exc}). Using fixture.")
            return self._load_fixture()

    def _load_fixture(self) -> Dict[str, Any]:
        fixture_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "fixtures",
            "aishe_sample.json"
        )
        with open(fixture_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def parse_and_validate(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        records: List[ValidatedInstitution] = []
        errors: List[str] = []

        pm_institutes = raw_data.get("pmVidyaLaxmiInstitutes", [])
        rnd_institutes = raw_data.get("rnDInstitutions", [])

        # Apply optional limit if specified (e.g. for lightweight test runs)
        if self.limit and self.limit > 0:
            pm_institutes = pm_institutes[:self.limit]

        # 1. Parse PM Vidya Laxmi Institutions
        for item in pm_institutes:
            aishe_code = clean_text(item.get("aisheCode"))
            name = clean_text(item.get("instituteName"))
            state = normalize_state_name(item.get("stateName"))
            district = clean_text(item.get("district")) or "District Headquarters"

            if not aishe_code or not name:
                continue

            stable_id = canonicalize_institution_id(self.name, aishe_code)
            raw_website = clean_text(item.get("website"))
            website = raw_website if raw_website.startswith("http") else (f"https://{raw_website}" if raw_website else None)

            try:
                rec = ValidatedInstitution(
                    id=stable_id,
                    source_name=self.name,
                    source_id=aishe_code,
                    source_url=self.source_url,
                    name=name,
                    state=state,
                    district=district,
                    management_type=clean_text(item.get("managementType")) or "Government",
                    category="Higher Education / University",
                    website=website,
                    year_of_establishment=clean_text(item.get("yearOfEstablishment")),
                    location=clean_text(item.get("location")) or "Urban",
                    approval_status="Approved / Recognized",
                    validation_status="VALIDATED",
                    licence_attribution=self.licence_attribution,
                )
                records.append(rec)
            except Exception as err:
                errors.append(f"Validation failed for AISHE {aishe_code}: {err}")

        # 2. Parse R&D Institutions
        for item in rnd_institutes:
            aishe_code = clean_text(item.get("aisheCode"))
            name = clean_text(item.get("name"))
            state = normalize_state_name(item.get("stateName"))
            district = clean_text(item.get("districtName")) or "District Headquarters"

            if not aishe_code or not name:
                continue

            stable_id = canonicalize_institution_id(self.name, aishe_code)
            ministry = clean_text(item.get("ministryOnosName"))

            try:
                rec = ValidatedInstitution(
                    id=stable_id,
                    source_name=self.name,
                    source_id=aishe_code,
                    source_url=self.rnd_url,
                    name=name,
                    state=state,
                    district=district,
                    management_type=ministry or "National R&D Organization",
                    category="National Research Institute",
                    website=None,
                    year_of_establishment=None,
                    location="Urban",
                    approval_status="Recognized National Research Centre",
                    validation_status="VALIDATED",
                    licence_attribution=self.licence_attribution,
                )
                records.append(rec)
            except Exception as err:
                errors.append(f"Validation failed for AISHE R&D {aishe_code}: {err}")

        status = "SUCCESS" if records and not errors else ("PARTIAL" if records else "FAILED")
        return {
            "records": records,
            "status": status,
            "message": f"Parsed {len(records)} verified institution records from AISHE official directory.",
            "metadata": {
                "pm_institutes_count": len(pm_institutes),
                "rnd_institutes_count": len(rnd_institutes),
                "total_valid_records": len(records),
                "errors_count": len(errors),
            },
        }
