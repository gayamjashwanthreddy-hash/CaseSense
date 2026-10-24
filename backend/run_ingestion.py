#!/usr/bin/env python3
"""
CaseSense Public Regulatory Data Ingestion CLI
Usage:
    python backend/run_ingestion.py --source all
    python backend/run_ingestion.py --source cpgrams
    python backend/run_ingestion.py --source aishe --limit 20
    python backend/run_ingestion.py --source all --fixture
"""

import sys
import argparse
import logging
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.ingestion.service import IngestionService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def main():
    parser = argparse.ArgumentParser(description="CaseSense Regulatory Data Ingestion Pipeline")
    parser.add_argument(
        "--source",
        choices=["all", "cpgrams", "aishe", "aicte", "data_gov"],
        default="all",
        help="Source adapter to run (default: all)",
    )
    parser.add_argument(
        "--fixture",
        action="store_true",
        help="Use deterministic offline fixtures instead of live network calls",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Maximum records to process per source (useful for testing or initial sync)",
    )

    args = parser.parse_args()

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = IngestionService(db)
        print("=" * 70)
        print("  CASESENSE REGULATORY DATA ACQUISITION & INGESTION")
        print("  Target Sources: AICTE | AISHE | CPGRAMS | data.gov.in")
        print(f"  Mode: {'Deterministic Fixture' if args.fixture else 'Live Network Probe & Ingestion'}")
        print("=" * 70)

        if args.source == "all":
            results = service.run_all(use_fixture=args.fixture, limit=args.limit)
        else:
            results = [service.run_source(args.source, use_fixture=args.fixture, limit=args.limit)]

        print("\n" + "=" * 70)
        print(f"{'SOURCE':<12} | {'STATUS':<20} | {'FETCHED':<7} | {'INSERTED':<8} | {'UPDATED':<7}")
        print("-" * 70)
        for r in results:
            print(f"{r['source'].upper():<12} | {r['status']:<20} | {r['records_fetched']:<7} | {r['records_inserted']:<8} | {r['records_updated']:<7}")
        print("=" * 70)
        for r in results:
            print(f"\n[{r['source'].upper()}] {r['message']}")
            print(f"  Licence: {r['licence_or_attribution']}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
