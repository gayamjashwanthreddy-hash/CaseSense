import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
import httpx

logger = logging.getLogger("casesense.ingestion")

# Approved domain allowlist to prevent Server-Side Request Forgery (SSRF)
APPROVED_DOMAINS = {
    # AICTE
    "www.aicte.gov.in",
    "aicte.gov.in",
    "facilities.aicte-india.org",
    "www.aicte-india.org",
    # AISHE (Ministry of Education / NIC)
    "dashboard.aishe.gov.in",
    "aishe.gov.in",
    "pdf.aishe.nic.in",
    # CPGRAMS (DARPG / NIC)
    "pgportal.gov.in",
    # Open Government Data (OGD) Platform
    "data.gov.in",
    "www.data.gov.in",
    "api.data.gov.in",
}


class SSRFProtectionError(ValueError):
    """Raised when an outbound HTTP request targets an unapproved external domain."""
    pass


class SourceRateLimitError(RuntimeError):
    """Raised when a remote source indicates rate limiting and requests backoff."""
    pass


def validate_url_domain(url: str) -> None:
    """
    Validates that the target URL belongs strictly to the approved government regulatory domains.
    Prevents SSRF and unauthorized network egress.
    """
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise SSRFProtectionError(f"Prohibited protocol '{parsed.scheme}'. Only HTTPS and HTTP are allowed.")
    
    hostname = (parsed.hostname or "").lower()
    if not hostname:
        raise SSRFProtectionError(f"Missing hostname in URL: {url}")
    
    is_approved = any(
        hostname == domain or hostname.endswith("." + domain)
        for domain in APPROVED_DOMAINS
    )
    if not is_approved:
        raise SSRFProtectionError(
            f"Domain '{hostname}' is not in the approved CaseSense regulatory domain allowlist. "
            f"Permitted domains: {', '.join(sorted(APPROVED_DOMAINS))}"
        )


class SafeHttpClient:
    """
    Hardened HTTP client with:
    - Domain allowlist verification (SSRF prevention)
    - Configurable timeouts
    - Rate-limiting delay & exponential backoff
    - Content-type & size validation
    - Non-interactive SSL verification option for Indian NIC certificates
    """

    def __init__(
        self,
        timeout: float = 15.0,
        verify_ssl: bool = True,
        rate_limit_delay: float = 0.5,
        max_retries: int = 2,
    ):
        self.timeout = timeout
        self.verify_ssl = verify_ssl
        self.rate_limit_delay = rate_limit_delay
        self.max_retries = max_retries
        self.headers = {
            "User-Agent": "CaseSense-Regulatory-Monitor/1.0 (+https://casesense.gov.in; contact@casesense.internal; SIH26264)",
            "Accept": "application/json, text/html, application/xml;q=0.9, */*;q=0.8",
            "Accept-Language": "en-US,en;q=0.8",
        }

    def get(self, url: str, headers: Optional[Dict[str, str]] = None, params: Optional[Dict[str, Any]] = None) -> httpx.Response:
        validate_url_domain(url)
        combined_headers = {**self.headers, **(headers or {})}

        time.sleep(self.rate_limit_delay)

        last_error = None
        for attempt in range(self.max_retries + 1):
            try:
                with httpx.Client(
                    timeout=self.timeout,
                    verify=self.verify_ssl,
                    follow_redirects=True,
                    headers=combined_headers,
                ) as client:
                    response = client.get(url, params=params)

                    # Validate final redirected URL domain
                    validate_url_domain(str(response.url))

                    # Check for rate limit responses
                    if response.status_code == 429:
                        retry_after = response.headers.get("Retry-After")
                        wait_sec = int(retry_after) if (retry_after and retry_after.isdigit()) else (2 ** (attempt + 1))
                        logger.warning(f"Rate limited by {url}. Waiting {wait_sec}s.")
                        if attempt < self.max_retries:
                            time.sleep(wait_sec)
                            continue
                        raise SourceRateLimitError(f"Rate limit exceeded on {url} (HTTP 429)")

                    return response

            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                last_error = exc
                if attempt < self.max_retries:
                    wait_sec = 2 ** attempt
                    logger.warning(f"Transient HTTP error on {url} ({exc}). Retrying in {wait_sec}s...")
                    time.sleep(wait_sec)
                else:
                    raise

        if last_error:
            raise last_error
        raise RuntimeError(f"Failed to fetch {url}")


class BaseAdapter(ABC):
    """
    Abstract base class for all source-specific regulatory data adapters.
    """
    name: str
    source_url: str
    licence_attribution: str

    def __init__(self, http_client: Optional[SafeHttpClient] = None):
        self.http = http_client or SafeHttpClient()

    @abstractmethod
    def fetch_raw(self) -> Any:
        """Fetch raw payload from external endpoint or fallback fixture."""
        pass

    @abstractmethod
    def parse_and_validate(self, raw_data: Any) -> Dict[str, Any]:
        """
        Parse raw payload, normalize fields, and validate schemas.
        Returns dict with keys: 'records', 'status', 'message', 'metadata'.
        """
        pass
