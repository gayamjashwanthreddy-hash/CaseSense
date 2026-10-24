import re
from typing import Optional, Union


def clean_text(val: Optional[str]) -> str:
    """Strip whitespace and collapse multiple whitespace characters."""
    if not val:
        return ""
    return re.sub(r"\s+", " ", str(val)).strip()


def parse_int_safe(val: Union[str, int, float, None], default: int = 0) -> int:
    """Safely parse integer from string containing commas, whitespace, or percentages."""
    if val is None:
        return default
    if isinstance(val, int):
        return val
    try:
        clean = re.sub(r"[^\d\-]", "", str(val))
        return int(clean) if clean else default
    except (ValueError, TypeError):
        return default


def parse_float_safe(val: Union[str, int, float, None], default: float = 0.0) -> float:
    """Safely parse float from string containing commas or percentages."""
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    try:
        clean = re.sub(r"[^\d\.\-]", "", str(val))
        return float(clean) if clean else default
    except (ValueError, TypeError):
        return default


STATE_NORMALIZATION_MAP = {
    "nct of delhi": "Delhi",
    "delhi": "Delhi",
    "union territory of andaman & nicobar": "Andaman and Nicobar Islands",
    "andaman and nicobar": "Andaman and Nicobar Islands",
    "jammu and kashmir": "Jammu & Kashmir",
    "orissa": "Odisha",
    "pondicherry": "Puducherry",
    "uttaranchal": "Uttarakhand",
}


def normalize_state_name(raw_state: Optional[str]) -> str:
    """Standardize state and UT names across diverse government sources."""
    clean = clean_text(raw_state)
    lower = clean.lower()
    return STATE_NORMALIZATION_MAP.get(lower, clean)


def canonicalize_institution_id(source_name: str, raw_id: str) -> str:
    """
    Returns deterministic, stable primary key for an institution.
    E.g. aishe:U-0456 or aicte:1-10492811.
    """
    cleaned_source = source_name.lower().strip()
    cleaned_id = clean_text(raw_id).upper()
    return f"{cleaned_source}:{cleaned_id}"
