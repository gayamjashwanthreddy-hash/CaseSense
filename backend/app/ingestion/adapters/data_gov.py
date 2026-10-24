import os
import re
import logging
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
import warnings
from app.ingestion.base import BaseAdapter, SafeHttpClient
from app.ingestion.normalizer import clean_text
from app.ingestion.validator import ValidatedRegulatoryDoc

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)
logger = logging.getLogger("casesense.ingestion.data_gov")


class DataGovAdapter(BaseAdapter):
    """
    Adapter for Open Government Data Platform India (data.gov.in).
    Collects catalog RSS feeds, technical education dataset metadata, and published reports.
    Portal URL: https://data.gov.in/
    """
    name = "DATA_GOV"
    source_url = "https://www.data.gov.in/backend/dms/v1/rss.xml"
    licence_attribution = "Open Government Data (OGD) Platform India (NDSAP / data.gov.in)"

    def __init__(self, http_client: Optional[SafeHttpClient] = None, use_fixture: bool = False):
        super().__init__(http_client)
        self.use_fixture = use_fixture

    def fetch_raw(self) -> str:
        if self.use_fixture:
            return self._load_fixture()

        try:
            response = self.http.get(self.source_url)
            if response.status_code == 200 and len(response.text) > 100:
                return response.text
            logger.warning(f"data.gov.in live returned status {response.status_code}. Using fixture.")
            return self._load_fixture()
        except Exception as exc:
            logger.warning(f"data.gov.in live fetch note ({exc}). Using fixture.")
            return self._load_fixture()

    def _load_fixture(self) -> str:
        fixture_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "fixtures",
            "data_gov_sample.xml"
        )
        with open(fixture_path, "r", encoding="utf-8") as f:
            return f.read()

    def parse_and_validate(self, raw_xml: str) -> Dict[str, Any]:
        soup = BeautifulSoup(raw_xml, "html.parser")
        items = soup.find_all("item")

        records: List[ValidatedRegulatoryDoc] = []
        errors: List[str] = []

        for idx, item in enumerate(items):
            title_tag = item.find("title")
            raw_title = title_tag.get_text() if title_tag else f"Dataset Catalog Item {idx + 1}"
            title = clean_text(raw_title)

            # Strip HTML if title contained anchor tag
            title = re.sub(r"<[^>]+>", "", title).strip()

            link_tag = item.find("link")
            # If link is self-closing or next sibling text
            link = ""
            if link_tag:
                link = clean_text(link_tag.get_text())
                if not link and link_tag.next_sibling:
                    link = clean_text(str(link_tag.next_sibling))

            if not link.startswith("http"):
                link = f"https://data.gov.in/catalog/{idx + 1}"

            pub_date_tag = item.find("pubdate") or item.find("pubDate")
            pub_date = clean_text(pub_date_tag.get_text()) if pub_date_tag else None

            desc_tag = item.find("description")
            summary = clean_text(desc_tag.get_text()) if desc_tag else None
            if summary:
                summary = re.sub(r"<[^>]+>", "", summary).strip()

            slug = re.sub(r"[^a-zA-Z0-9]+", "-", title[:60]).strip("-").lower()
            stable_id = f"data_gov:{slug}"

            try:
                rec = ValidatedRegulatoryDoc(
                    id=stable_id,
                    source_name=self.name,
                    source_url=link,
                    title=title,
                    document_type="CATALOG_FEED",
                    publication_date=pub_date,
                    summary=summary,
                    licence_attribution=self.licence_attribution,
                )
                records.append(rec)
            except Exception as err:
                errors.append(f"Validation failed for data.gov.in item {title}: {err}")

        status = "SUCCESS" if records and not errors else ("PARTIAL" if records else "FAILED")
        return {
            "records": records,
            "status": status,
            "message": f"Parsed {len(records)} regulatory dataset metadata items from data.gov.in catalog.",
            "metadata": {
                "items_count": len(records),
                "errors_count": len(errors),
            },
        }
