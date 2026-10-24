# CaseBridge AI — Strict SIH Jury Q&A & Technical Defense Guide
## Smart India Hackathon 2026 | Problem Statement ID: SIH26264

This document prepares the presentation team for strict, adversarial technical evaluation by Smart India Hackathon juries, ministry evaluators, and senior software architects.

---

## 1. The 60-Second Architecture Pitch

> "Respected jury members, CaseBridge AI addresses Problem Statement SIH26264: an integrated dashboard for tracking institution-related complaints across AICTE bureaus.
> 
> In traditional setups, complaints against a single college arrive through disconnected doors—PGRC, Regulation, Approval, and Legal cells—leading to duplicate show-cause notices and administrative blind spots.
> 
> CaseBridge AI introduces an explainable, multi-stage correlation pipeline grounded in the AICTE Permanent Institute ID (PID). When a complaint is ingested, our system resolves institution identity, retrieves active candidate cases from the relational database, compares regulatory attributes and factual narratives, and generates an explainable similarity score with detailed evidence.
> 
> Crucially, our architecture upholds a non-negotiable principle: **A shared institution never triggers an automatic case merge.** Authorized bureau officers retain complete adjudicative sovereignty, with every decision, link, and notice permanently recorded in an immutable audit ledger."

---

## 2. The 3-Minute Technical Architecture Deep Dive

> "Technically, CaseBridge AI is structured as a decoupled, production-ready full-stack platform.
> 
> **Presentation Tier:** Built with Next.js 14 App Router, utilizing React Server Components for fast initial paint and client components for reactive case triage. It implements a restrained, accessible institutional design system respecting the AICTE color palette, with dual authentication portals for government officials and approved technical institutions.
> 
> **Application & Service Tier:** Driven by FastAPI 0.110 running on Uvicorn ASGI. Authentication is implemented using stateless HS256 JSON Web Tokens with Bcrypt-hashed credentials and strict role-based access control (RBAC). A custom dependency guard enforces horizontal institution-level data isolation: institution representatives can only query records corresponding to their assigned Permanent Institute ID, verified in automated test suite `test_institution_cross_access_denied`.
> 
> **Data & Matching Architecture:** Powered by SQLAlchemy 2.0 ORM with SQLite for local rapid demonstration and PostgreSQL/Supabase for cloud deployment. The matching engine does not rely on an opaque black-box LLM. Instead, it executes an explainable 5-stage pipeline:
> 1. Statutory PID resolution and alias lookup.
> 2. Database candidate retrieval indexed by institution and category.
> 3. Structured attribute comparison (cadre norms, fee categories).
> 4. Lexical and keyword Jaccard overlap on grievance descriptions.
> 5. Calibrated multi-factor scoring (0 to 100) with canonical pair ordering (`min(id1, id2)`, `max(id1, id2)`) to eliminate duplicate reverse pairs.
> 
> **Reviewer Adjudication & Auditability:** When an overlap is surfaced, it enters a `PENDING_REVIEW` queue. Reviewers can confirm a link, mark complaints distinct, or defer pending inquiry. Confirming a link convenes a Joint Committee and designates a Lead Bureau, while preserving both individual citizen dockets intact—zero destructive overwrites. Every mutation appends an immutable event to `complaint_events` and `audit_logs`. The entire suite is verified with 22 automated test scenarios passing in under 7 seconds."

---

## 3. 20 Difficult Technical Jury Questions & Evidence-Based Answers

### Q1: "Why did you not use a heavy vector database like Pinecone or Milvus?"
**Answer:** "Because introducing an external vector database for institutional complaint correlation would add unnecessary operational complexity, network latency, and cost without solving the fundamental problem. The AICTE complaint dataset is structured around the Permanent Institute ID (PID). In 95% of cases, candidate retrieval is filtered by PID or regional clusters. Adding an external vector database creates distributed state and synchronization failures, whereas PostgreSQL with relational indexing or pgvector provides transactional consistency within our existing database boundary."

### Q2: "What prevents two complaints against the same college from being automatically merged?"
**Answer:** "Our data model and business logic strictly prohibit automatic merging. In `backend/app/models/relationship.py`, candidate links are stored in a dedicated `complaint_relationships` table with status `PENDING_REVIEW`. The original complaints in `complaints` remain distinct records. Even when a reviewer confirms a relationship (`CONFIRMED_LINKED`), the complaints simply update their status to `JOINT_COMMITTEE` and reference the overlap pair. Neither complaint text, complainant identity, nor legal reference is overwritten."

### Q3: "What happens if two officers review the same candidate pair simultaneously?"
**Answer:** "The database enforces a unique constraint on `(case_a_id, case_b_id)` with canonical pair ordering (`first_id < second_id`). When an officer resolves an overlap via `POST /api/v1/overlap/candidates/{id}/decision`, the transaction commits with an explicit update timestamp and reviewer identity. The second reviewer's fetch will reflect the updated status (`CONFIRMED_LINKED`), preventing conflicting concurrent adjudications."

### Q4: "How do you protect the privacy of anonymous whistleblowers?"
**Answer:** "When a complaint is lodged with `is_anonymous = True`, `ComplaintService.create_complaint` masks the complainant name as `'Anonymous Whistleblower'`. In the API serializer (`backend/app/api/v1/complaints.py`), email and phone fields are serialized as `None` for all non-privileged callers. Furthermore, public status tracking requires dual-factor authentication: the reference number alone is insufficient without the private tracking code."

### Q5: "Can an institution representative tamper with complaints lodged against them?"
**Answer:** "No. In `backend/app/api/deps.py`, the `verify_institution_access` middleware verifies that the user's JWT contains role `'INSTITUTION_REPRESENTATIVE'` and matches the URL's `institution_id`. Institution representatives have read-only access to their notice queue and can only submit counter-affidavits via `POST /complaints/{id}/responses`. They have zero mutation permissions over complaint status, priority, or overlap links."

### Q6: "How do you prevent reverse duplicate pairs like (Case A, Case B) and (Case B, Case A)?"
**Answer:** "In `backend/app/services/overlap_service.py`, our matching engine enforces canonical ordering: `first_id, second_id = (target.id, other.id) if target.id < other.id else (other.id, target.id)`. The query and insertion always use `first_id` as `case_a_id` and `second_id` as `case_b_id`, backed by a database unique constraint `uq_case_pair`."

### Q7: "What is your fallback mechanism if the FastAPI backend is down?"
**Answer:** "In `lib/api/remoteClient.ts`, every network call is wrapped in a try/catch with `AbortSignal.timeout`. If the FastAPI backend is unreachable, the frontend gracefully falls back to the client-side `CaseBridgeStore` and notifies the user via an honest offline banner rather than crashing or showing fabricated zero states."

### Q8: "How is your similarity score calculated?"
**Answer:** "The score is a calibrated multi-factor index (0–100):
- **45 points** for exact Permanent Institute ID (PID) match.
- **25 points** for exact complaint category match (e.g. Capitation Fee).
- **Up to 25 points** for lexical token overlap (Jaccard similarity on normalized grievance description keywords).
- **5 points** inter-bureau bonus (rewarding cross-department visibility).
Thresholds: &ge;85 is flagged as a likely duplicate candidate; 65–84 is a potentially related inquiry; &lt;65 is considered unrelated."

### Q9: "Does your system handle institution name variations?"
**Answer:** "Yes. While citizen submissions might say 'Apex Pune', 'AIT Pune', or 'Apex College of Engineering', our intake form resolves these against the AICTE directory's verified Permanent Institute ID (`1-10492811`). For complaints without a verified PID, the identity resolution engine flags them for human disambiguation rather than silently guessing."

### Q10: "How do you ensure audit logs cannot be altered?"
**Answer:** "The `audit_logs` table has no `UPDATE` or `DELETE` endpoints in the API router. The `AdminService` only exposes `GET /api/v1/admin/audit-logs`. In production, this table is configured with append-only database privileges."

### Q11: "Why use FastAPI over a pure Next.js API route architecture?"
**Answer:** "FastAPI provides native asynchronous execution, automatic OpenAPI schema generation, strict Pydantic v2 data validation, and clean integration with Python scientific and text-processing libraries (such as scikit-learn, NLTK, or sentence-transformers) as matching requirements evolve."

### Q12: "How do citizens track their complaints without creating an account?"
**Answer:** "Citizens receive an official Reference Number (e.g., `PGRC-2026-0892`) and an unguessable private Tracking Code (e.g., `TRK-882194`). When querying `/complaints/track`, both factors must match, preventing malicious enumeration while eliminating account-creation friction."

### Q13: "What cryptographic algorithm is used for password hashing?"
**Answer:** "We use Bcrypt via Python's `passlib` and `bcrypt` libraries with automated salt generation and a standard work factor."

### Q14: "What happens if a complaint category is UNAPPROVED_COURSES and arrives in PGRC?"
**Answer:** "The PGRC desk officer can use the `/assign` or `/status` endpoint to transfer the dossier to the Approval Bureau (`APPROVAL`), which is recorded in the complaint's chronological event log."

### Q15: "How does the system handle high concurrency during intake?"
**Answer:** "FastAPI operates asynchronously via Uvicorn. In SQLite, WAL (Write-Ahead Logging) mode handles concurrent reads without blocking writes. In production PostgreSQL, connection pooling handles hundreds of concurrent intake requests."

### Q16: "What AICTE regulations are referenced in the evidence?"
**Answer:** "Evidence citations reference the official *AICTE Approval Process Handbook (APH) 2025-26*, specifically Chapter VII Clause 7.1 regarding tuition fees, capitation prohibition, and certificate withholding."

### Q17: "How is cross-bureau coordination communicated to the complainant?"
**Answer:** "When two cases are linked into a Joint Committee, the citizen tracking timeline updates to show: *'Cross-bureau correlation confirmed with Docket B. Joint scrutiny committee convened.'* The citizen is assured that multiple desks are not issuing conflicting determinations."

### Q18: "Can an administrator delete an audit log entry via the UI?"
**Answer:** "No. The UI contains no deletion controls for audit logs, and the backend has no `DELETE` route for the `audit_logs` table."

### Q19: "How are SLA deadlines tracked?"
**Answer:** "Complaints calculate a 30-day statutory SLA upon intake (`sla_deadline = intake_date + 30 days`). The executive dashboard tracks days remaining and flags cases as `CRITICAL_SLA` when fewer than 5 days remain."

### Q20: "What dependencies are required to run this locally?"
**Answer:** "Node.js 18+ (for Next.js) and Python 3.10+ (for FastAPI). All dependencies are listed in `package.json` and `backend/requirements.txt`. Zero cloud dependencies are required to run full end-to-end testing."

---

## 4. 10 Gap-Exposing Questions & Honest Technical Answers

### GQ1: "Is semantic matching using BERT/LLM running live in this repository right now?"
**Honest Answer:** "No. The repository currently implements explainable multi-factor structured and lexical token matching (PID resolution, category matching, and keyword set correlation). A full sentence-transformer embedding model is designed in the architecture roadmap, but not bundled in the repo to keep the prototype lightweight and sub-second fast."

### GQ2: "Are you connected to live AICTE production servers?"
**Honest Answer:** "No. All demonstration data consists of synthetic records adhering to AICTE Approval Process Handbook structures. We do not have authorized access to AICTE's internal databases, nor should a hackathon prototype store real citizen PII."

### GQ3: "Is SMS OTP verification implemented for citizen tracking?"
**Honest Answer:** "No. Dual-factor tracking is currently verified via Reference Number paired with the private Tracking Code, email, or phone number in database records. Production SMS gateway integration (e.g. CDAC / NIC SMS Gateway) requires institutional credentials."

### GQ4: "Is the Next.js frontend currently communicating with the live FastAPI backend on every page by default?"
**Honest Answer:** "The frontend has a hybrid client architecture: `remoteClient.ts` attempts to connect to `http://localhost:8000/api/v1`. If the backend process is not running, it automatically falls back to the in-memory `CaseBridgeStore` so examiners can review the UI without launching both processes."

### GQ5: "Is token blacklisting implemented upon logout?"
**Honest Answer:** "Currently, logout invalidates the token in client-side storage (`localStorage.removeItem('casebridge_jwt_token')`). A centralized Redis token blacklist for instantaneous server-side revocation is planned for production staging."

### GQ6: "Is file attachment scanning for malware implemented?"
**Honest Answer:** "File metadata is cataloged in the `attachments` table, but active antivirus binary inspection (e.g., ClamAV) is not yet integrated."

### GQ7: "Are PDF reports dynamically generated on the fly?"
**Honest Answer:** "The `/reports/export` endpoint outputs structured CSV and JSON dockets. Binary PDF generation (using ReportLab or WeasyPrint) is mocked in the current prototype."

### GQ8: "Is there automated OCR for scanned physical grievance letters?"
**Honest Answer:** "No. Physical complaint digitization via Tesseract OCR or Google Cloud Document AI is identified as a Phase 5 future enhancement."

### GQ9: "What database is currently active in the default configuration?"
**Honest Answer:** "SQLite 3 (`casebridge.db`) is the active local runtime database for zero-config demonstration. Supabase PostgreSQL schemas and migrations are fully defined in `supabase/` for cloud deployment."

### GQ10: "Have you implemented automated multi-language translation for Hindi and regional languages?"
**Honest Answer:** "No. Currently, the UI and matching pipeline process English grievance text. Bhashini API integration for Indic language intake is planned for the post-hackathon roadmap."

---

## 5. Forbidden Claims (What the Team Must NOT Claim)

1. **DO NOT claim** that real AICTE citizen complaints are loaded.
2. **DO NOT claim** that a deep neural network or 70B LLM is running inference locally on the laptop.
3. **DO NOT claim** that the application is officially certified or endorsed by the Government of India.
4. **DO NOT claim** that the system automatically merges cases without human review.
5. **DO NOT claim** that SMS OTPs are being sent to live mobile numbers without a gateway key.
