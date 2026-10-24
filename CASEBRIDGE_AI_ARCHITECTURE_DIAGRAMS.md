# CaseBridge AI — Presentation-Ready Architecture Diagrams
## Smart India Hackathon 2026 | Problem Statement ID: SIH26264

This document contains the complete collection of presentation-ready Mermaid architectural diagrams for **CaseBridge AI**, derived from the audited codebase of Team Code Ninja's.

---

## 1. System Context Diagram

```mermaid
flowchart TB
    subgraph ExternalActors["External Actors & Stakeholders"]
        Citizen["Citizen / Student / Whistleblower<br/>(Public Intake & Status Tracking)"]
        BureauOfficer["AICTE Bureau Official / Reviewer<br/>(PGRC, Regulation, Approval, Legal)"]
        InstRep["Technical Institution Representative<br/>(Principal / Dean / Registrar)"]
    end

    subgraph CaseBridgeSystem["CaseBridge AI Platform Boundaries"]
        Frontend["Next.js 14 Web Application<br/>(App Router, SSR, Client Hydration)"]
        BackendAPI["FastAPI 0.110 Python Backend<br/>(REST API, JWT Auth, RBAC)"]
        MatchEngine["Explainable Matching Engine<br/>(Institution Resolution, Lexical Scoring)"]
    end

    subgraph DataStorage["Persistence Layer"]
        RelationalDB[("SQLite 3 / PostgreSQL 15<br/>(Relational Case Dockets & Links)")]
        AuditLedger[("Immutable Audit Log Store<br/>(Chronological Adjudication Ledger)")]
    end

    subgraph ExternalIntegrations["External & Upstream Services"]
        SupabaseCloud["Supabase Cloud Platform<br/>(Configured Remote Sync & Auth Engine)"]
        AICTE_APH["AICTE Approval Process Handbook (APH)<br/>(Statutory Clauses & Compliance Norms)"]
        NationalPortals["Upstream Portals (e.g., CPGRAMS)<br/>[Simulated / Proposed Ingestion]"]
    end

    Citizen -->|"Submit Grievance / Track Status (HTTPS)"| Frontend
    BureauOfficer -->|"Review Overlaps / Adjudicate (Bearer JWT)"| Frontend
    InstRep -->|"Inspect Notice / Submit Counter-Affidavit"| Frontend

    Frontend -->|"API Calls / JSON REST (Port 8000)"| BackendAPI
    BackendAPI -->|"Trigger Multi-Factor Scan"| MatchEngine
    BackendAPI -->|"SQLAlchemy ORM Read/Write"| RelationalDB
    BackendAPI -->|"Append Audit Events"| AuditLedger

    BackendAPI -.->|"Sync Database (Optional Cloud Sync)"| SupabaseCloud
    MatchEngine -.->|"Grounds Evidence In"| AICTE_APH
    NationalPortals -.->|"Proposed Batch Ingestion"| BackendAPI

    classDef live fill:#142C46,stroke:#1769AA,stroke-width:2px,color:#FFFFFF;
    classDef simulated fill:#2d1b00,stroke:#A96813,stroke-width:2px,color:#FFFFFF;
    classDef proposed fill:#1f1f1f,stroke:#657386,stroke-width:1px,stroke-dasharray: 5 5,color:#AEBBCD;

    class Frontend,BackendAPI,MatchEngine,RelationalDB,AuditLedger live;
    class AICTE_APH simulated;
    class SupabaseCloud,NationalPortals proposed;
```

---

## 2. High-Level Component Architecture

```mermaid
flowchart LR
    subgraph UI_Layer["Presentation Layer (Next.js 14)"]
        PublicPages["Public Portal<br/>- Home (Scenes 00-08)<br/>- Register Grievance<br/>- Track Status"]
        AuthPages["Authentication<br/>- Official Login<br/>- Institution Login<br/>- Quick Personas"]
        AdminConsole["Bureau Console<br/>- Executive Overview<br/>- Cases Explorer<br/>- Overlap Review<br/>- Reports & Analytics"]
        InstDesk["Institution Desk<br/>- PID-Scoped Cases<br/>- Counter-Affidavits"]
    end

    subgraph API_Layer["Application & Service Layer (FastAPI)"]
        Router["APIRouter v1 (/api/v1)"]
        AuthService["AuthService<br/>(JWT, bcrypt, RBAC)"]
        ComplaintService["ComplaintService<br/>(Intake, Status, Events)"]
        OverlapService["OverlapService<br/>(Multi-Stage Matching Pipeline)"]
        DashboardService["DashboardService<br/>(SLA & Overlap Analytics)"]
    end

    subgraph Core_Engine["Explainable Matching Pipeline"]
        StageA["Stage A: Institution PID Resolution"]
        StageB["Stage B: Indexed Candidate Retrieval"]
        StageC["Stage C: Structured Attribute Comparison"]
        StageD["Stage D: Lexical & Keyword Similarity"]
        StageE["Stage E: Score Calibration (0-100)"]
    end

    subgraph DB_Layer["Database Layer (SQLAlchemy ORM)"]
        ComplaintsTab[("complaints")]
        InstitutionsTab[("institutions")]
        RelationshipsTab[("complaint_relationships")]
        AuditTab[("audit_logs")]
        EventsTab[("complaint_events")]
        UsersTab[("users")]
    end

    PublicPages --> Router
    AuthPages --> Router
    AdminConsole --> Router
    InstDesk --> Router

    Router --> AuthService
    Router --> ComplaintService
    Router --> OverlapService
    Router --> DashboardService

    ComplaintService --> OverlapService
    OverlapService --> StageA --> StageB --> StageC --> StageD --> StageE

    AuthService --> UsersTab
    ComplaintService --> ComplaintsTab
    ComplaintService --> EventsTab
    ComplaintService --> AuditTab
    OverlapService --> RelationshipsTab
    OverlapService --> InstitutionsTab
```

---

## 3. Backend Request Lifecycle & Security Middleware

```mermaid
sequenceDiagram
    autonumber
    actor Client as Browser / Client
    participant CORS as CORSMiddleware
    participant Router as APIRouter (/api/v1)
    participant DepAuth as get_current_user (deps.py)
    participant DepRBAC as require_roles / verify_access
    participant Service as Business Service
    participant DB as SQLAlchemy Session (DB)
    participant Audit as AuditLog Logger

    Client->>CORS: HTTP Request (Method, Path, Headers)
    Note over CORS: Validates Origin, Methods, Headers
    CORS->>Router: Forward Request to Handler

    alt Route requires Authentication
        Router->>DepAuth: Extract Bearer Token from Authorization Header
        alt Token Missing or Expired
            DepAuth-->>Client: 401 Unauthorized ("Invalid or expired access token")
        else Valid Token
            DepAuth->>DB: Query User by ID (from JWT sub)
            DB-->>DepAuth: User record
            DepAuth->>DepRBAC: Check Role & Bureau/Institution Scope
            alt Insufficient Privileges
                DepRBAC-->>Client: 403 Forbidden ("Access denied: Requires role...")
            else Authorized
                DepRBAC->>Service: Execute Business Logic with DB Session
            end
        end
    else Public Route (/health, /complaints/public, /complaints/track)
        Router->>Service: Forward Public Payload
    end

    Service->>DB: Execute Query / Mutation (Atomic Transaction)
    DB-->>Service: Return Entity Records
    opt State Mutated (Intake, Overlap Decision, Status Change)
        Service->>Audit: Append Chronological AuditLog Entry
        Audit->>DB: INSERT into audit_logs
    end
    Service->>DB: db.commit()
    Service-->>Router: Pydantic Schema Model
    Router-->>Client: JSON Response + HTTP 200/201
```

---

## 4. Complaint Matching and Review Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Complainant as Complainant / Citizen
    participant API as Complaint Intake Endpoint
    participant CS as ComplaintService
    participant OS as OverlapService
    participant DB as Relational Database
    actor Reviewer as Authorized Bureau Reviewer

    Complainant->>API: POST /api/v1/complaints/public<br/>(PID, Category, Subject, Statement)
    API->>CS: create_public_complaint(payload)
    CS->>DB: INSERT Complaint (status="NEW_INTAKE", ref="PGRC-2026-0892")
    DB-->>CS: Persisted Complaint ID AICTE/PGRC/2026/0892

    CS->>OS: analyze_complaint(complaint_id)
    Note over OS: Stage A: Resolve PID 1-10492811<br/>Stage B: Retrieve Active Cases for PID<br/>Stage C: Attribute & Clause Matching<br/>Stage D: Token Set Overlap & Keyword Correlation<br/>Stage E: Calculate Score & Structured Rationale

    alt Score >= 60 (Candidate Overlap Identified)
        Note over OS: Enforce canonical pair order: min(id1, id2), max(id1, id2)
        OS->>DB: INSERT ComplaintRelationship (id="OVL-2026-001", status="PENDING_REVIEW")
        OS->>DB: UPDATE complaints SET has_overlap=TRUE, status="OVERLAP_FLAGGED"
    end
    DB-->>CS: Candidate Relationships Surfaced
    CS-->>API: Complaint Created + Tracking Code
    API-->>Complainant: Confirmation Receipt (Reference + Tracking Code)

    Note over Reviewer: Reviewer logs into Administrative Console
    Reviewer->>API: GET /api/v1/overlap/candidates (Bearer JWT)
    API->>OS: get_candidates(status_filter="PENDING_REVIEW")
    OS->>DB: SELECT * FROM complaint_relationships WHERE status='PENDING_REVIEW'
    DB-->>Reviewer: Overlap Pair with Detailed Evidence Breakdown

    Reviewer->>API: POST /api/v1/overlap/candidates/OVL-2026-001/decision<br/>{action: "CONFIRMED_LINKED", lead_bureau: "REGULATION"}
    API->>OS: resolve_overlap(pair_id, action, notes, reviewer_name)
    OS->>DB: UPDATE complaint_relationships SET status='CONFIRMED_LINKED'
    OS->>DB: UPDATE complaints SET status='JOINT_COMMITTEE'
    OS->>DB: INSERT AuditLog (Action="Overlap Resolution: CONFIRMED_LINKED")
    DB-->>OS: Transaction Committed
    OS-->>Reviewer: Updated Relationship Record (Zero Record Merging)
```

---

## 5. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    INSTITUTIONS ||--o{ COMPLAINTS : "targets"
    BUREAUS ||--o{ COMPLAINTS : "manages"
    COMPLAINTS ||--o{ COMPLAINT_EVENTS : "records"
    COMPLAINTS ||--o{ COMPLAINT_RESPONSES : "receives"
    COMPLAINTS ||--o{ ATTACHMENTS : "includes"
    COMPLAINTS ||--o{ AUDIT_LOGS : "audits"
    COMPLAINTS ||--o{ COMPLAINT_RELATIONSHIPS : "case_a"
    COMPLAINTS ||--o{ COMPLAINT_RELATIONSHIPS : "case_b"
    INSTITUTIONS ||--o{ COMPLAINT_RELATIONSHIPS : "involves"
    BUREAUS ||--o{ USERS : "employs"
    INSTITUTIONS ||--o{ USERS : "authorizes"

    INSTITUTIONS {
        string id PK "AICTE PID e.g. 1-10492811"
        string name "Official Registered Name"
        string state "State e.g. Maharashtra"
        string district "District"
        string region "Region e.g. Western"
        string category "Technical / Engineering"
        string approval_status "Approved / Under Review"
        string accreditation "NBA / NAAC"
        string affiliated_university "Affiliated University"
        int active_cases_count "Cached Active Cases"
        int total_historical_cases "Total Cases"
        string risk_level "LOW / MEDIUM / HIGH / CRITICAL"
        string email "Official Registrar Email"
        string head_of_institution "Principal / Dean Name"
    }

    BUREAUS {
        string id PK "PGRC, REGULATION, APPROVAL, LEGAL"
        string name "Full Bureau Name"
        string code "Short Code"
        string description "Statutory Jurisdiction"
        string head_name "Bureau Advisor Name"
        string email "Official Bureau Desk Email"
        boolean is_active "Active Status"
    }

    COMPLAINTS {
        string id PK "e.g. AICTE/PGRC/2026/0892"
        string ref_number UK "e.g. PGRC-2026-0892"
        string tracking_code "Dual Factor Code e.g. TRK-882194"
        string institution_id FK "References institutions.id"
        string bureau_id FK "References bureaus.id"
        string category "CAPITATION_FEE, FACULTY, etc."
        string subject "Summary Subject"
        text description "Factual Narrative"
        string priority "CRITICAL / HIGH / MEDIUM / LOW"
        string status "NEW_INTAKE / OVERLAP_FLAGGED / JOINT_COMMITTEE / RESOLVED"
        string complainant_name "Name or Confidential Complainant"
        string complainant_type "Student / Faculty / Parent / Whistleblower"
        string complainant_email "Complainant Email"
        boolean is_anonymous "Whistleblower Flag"
        string received_date "Intake Date"
        string sla_deadline "Statutory 30-Day SLA"
        boolean has_overlap "Active Correlation Flag"
        string overlap_pair_id "Active Overlap ID"
        text relevant_clauses_json "AICTE APH Clauses Array"
    }

    COMPLAINT_RELATIONSHIPS {
        string id PK "e.g. OVL-2026-001"
        string case_a_id FK "Canonical First Case ID"
        string case_b_id FK "Canonical Second Case ID"
        string institution_id FK "Target Institution PID"
        string institution_name "Target Institution Name"
        int similarity_score "0 to 100 Multi-Factor Score"
        string urgency "Urgency Level"
        string detected_at "Detection Timestamp"
        text rationale_json "Structured Explainable Evidence"
        string status "PENDING_REVIEW / CONFIRMED_LINKED / REJECTED_DISTINCT / DEFERRED"
        string lead_bureau "Designated Lead Desk"
        string reviewer_name "Adjudicating Officer"
        text reviewer_notes "Review Justification"
        string reviewed_at "Decision Timestamp"
    }

    AUDIT_LOGS {
        string id PK "e.g. AUD-1774390000"
        string case_id FK "Associated Case"
        string timestamp "IST Timestamp"
        string action "Event Description"
        string performed_by "Actor Full Name"
        string role "Actor Role"
        string bureau "Bureau Desk"
        text details "Full Contextual Details"
    }

    COMPLAINT_EVENTS {
        string id PK "EVT Identifier"
        string complaint_id FK "Case ID"
        string event_type "STATUS_CHANGE / NOTICE_ISSUED / INTAKE"
        string previous_status "Old Status"
        string new_status "New Status"
        string actor_name "Actor"
        string actor_role "Role"
        text explanation "Summary Rationale"
        string timestamp "Timestamp"
    }

    COMPLAINT_RESPONSES {
        string id PK "RESP Identifier"
        string complaint_id FK "Case ID"
        string institution_id FK "Institution PID"
        string submitted_by "Registrar Name"
        string official_designation "Designation"
        text statement "Official Counter-Affidavit"
        string submitted_at "Timestamp"
        string status "SUBMITTED / ACCEPTED / REJECTED"
    }

    USERS {
        string id PK "User UUID"
        string email UK "Official Login Email"
        string hashed_password "Bcrypt Password Hash"
        string full_name "Officer / Representative Name"
        string role "ADMIN / REVIEWER / BUREAU_OFFICER / INSTITUTION_REPRESENTATIVE"
        string bureau_id FK "Bureau Scope"
        string institution_id FK "Institution PID Scope"
        boolean is_active "Active Account Status"
    }
```

---

## 6. Authentication and Authorization Flow

```mermaid
flowchart TD
    Start([User Initiates Authentication]) --> PickTab{Select Login Portal}

    PickTab -->|Official Desk| OfficialForm["Enter Official Email & Password<br/>(e.g., admin@aicte-india.org)"]
    PickTab -->|Institution Desk| InstForm["Enter Institutional Email & Key<br/>(e.g., registrar@apextech-pune.ac.in)"]

    OfficialForm --> PostAuth["POST /api/v1/auth/login"]
    InstForm --> PostInstAuth["POST /api/v1/auth/institution-login"]

    PostAuth --> VerifyBcrypt{Verify Password Hash<br/>via bcrypt.checkpw}
    PostInstAuth --> VerifyKey{Verify Access Key<br/>& Check Active PID}

    VerifyBcrypt -->|Invalid| Return401["Return 401 Unauthorized<br/>'Incorrect email or password'"]
    VerifyKey -->|Invalid| Return401Inst["Return 401 Unauthorized<br/>'Invalid credentials'"]

    VerifyBcrypt -->|Valid| GenJWT["Generate Signed HS256 JWT Token<br/>Claims: sub=user_id, role, bureau_id"]
    VerifyKey -->|Valid| GenInstJWT["Generate Signed HS256 JWT Token<br/>Claims: sub=user_id, role, institution_id"]

    GenJWT --> SaveSession["Store in localStorage & Client Context<br/>Bearer Header configured for requests"]
    GenInstJWT --> SaveSession

    SaveSession --> RequestProtected["Access Protected Route<br/>(e.g., /overlap-review or /institution/complaints)"]

    RequestProtected --> ValidateRole{RBAC Role Check}
    ValidateRole -->|Role Permitted| CheckScope{Institution / Bureau Scope Match?}
    ValidateRole -->|Role Denied| Return403["Return 403 Forbidden<br/>'Access denied: Insufficient privileges'"]

    CheckScope -->|Scope Matches PID / Bureau| ServeData["Serve Case Dossier & Operations"]
    CheckScope -->|Scope Mismatch| ReturnCross403["Return 403 Forbidden<br/>'Cannot access other institution records'"]
```

---

## 7. Deployment Architecture

```mermaid
flowchart TB
    subgraph ClientEnvironment["Client Tier (Web Browser)"]
        UserBrowser["Modern Web Browser<br/>- React 18 SPA Hydration<br/>- LocalStorage Token Cache<br/>- Tailwind CSS Responsive UI"]
    end

    subgraph EdgeTier["Vercel Edge & Ingress Tier"]
        VercelCDN["Vercel Global CDN / Edge Network<br/>- Static Asset Hosting (.next/static)<br/>- Next.js 14 SSR Runtime (Port 3000)"]
    end

    subgraph BackendTier["Compute Tier (FastAPI Service)"]
        Uvicorn["Uvicorn ASGI Server (Port 8000)<br/>- 4 Worker Processes<br/>- CORS Security Headers<br/>- Request Rate Limiting"]
        FastAPIApp["FastAPI 0.110 Application Core<br/>- Pydantic v2 Request Validation<br/>- JWT Bearer Authentication<br/>- Multi-Stage Matching Service"]
    end

    subgraph StorageTier["Data & State Tier"]
        SQLiteLocal["SQLite 3 Database (Local Prototype)<br/>WAL Mode, Foreign Key Enforcement"]
        SupabasePostgres["Supabase Managed PostgreSQL 15<br/>Connection Pooler (PgBouncer: 5432)<br/>Row-Level Security (RLS) Policies"]
    end

    UserBrowser -->|"HTTPS (Port 443)"| VercelCDN
    VercelCDN -->|"API Reverse Proxy / Client Fetch"| Uvicorn
    Uvicorn --> FastAPIApp
    FastAPIApp -->|"SQLAlchemy ORM (Local Dev)"| SQLiteLocal
    FastAPIApp -.->|"PostgreSQL Wire Protocol (Cloud)"| SupabasePostgres
```

---

## 8. Actual vs. Proposed Architecture Comparison

```mermaid
flowchart TD
    subgraph ImplementedActual["CURRENT AUDITED REPOSITORY ARCHITECTURE"]
        direction TB
        A1["Next.js 14 Frontend<br/>(Client & Server Components, Tailwind CSS, Lucide)"]
        A2["FastAPI 0.110 Python Backend<br/>(Uvicorn, REST Endpoints, OAuth2 Bearer)"]
        A3["Real Authentication & RBAC<br/>(bcrypt Passwords, JWT Tokens, Role Verification)"]
        A4["Explainable Rule & Lexical Matching<br/>(PID Resolution + Category Match + Token Overlap)"]
        A5["Relational Database Storage<br/>(SQLite3 casebridge.db via SQLAlchemy ORM)"]
        A6["Audit Logging & Event Timeline<br/>(Permanent audit_logs & complaint_events)"]
        A7["Human Review Workspace<br/>(Candidate Pair Review: Link / Distinct / Defer)"]
        
        A1 <--> A2
        A2 <--> A3
        A2 <--> A4
        A2 <--> A5
        A2 <--> A6
        A2 <--> A7
    end

    subgraph ProposedIdeal["PROPOSED FUTURE EXTENSIONS (NOT IN REPOSITORY)"]
        direction TB
        P1["Heavy Dense Vector Database<br/>(pgvector / Pinecone / Milvus)"]
        P2["Local Sentence-Transformer LLM Server<br/>(e.g., all-MiniLM-L6-v2, BERT)"]
        P3["Asynchronous Celery / RabbitMQ Worker Queues"]
        P4["Live External AICTE SIS / CPGRAMS APIs"]
        P5["Digital Public Key Infrastructure (PKI) Emblems"]
    end

    ImplementedActual -.->|"Future Migration Path"| ProposedIdeal

    classDef actualStyle fill:#0B1C2D,stroke:#1769AA,stroke-width:2px,color:#FFFFFF;
    classDef propStyle fill:#1a140b,stroke:#A96813,stroke-width:1px,stroke-dasharray: 5 5,color:#F5F3ED;

    class A1,A2,A3,A4,A5,A6,A7 actualStyle;
    class P1,P2,P3,P4,P5 propStyle;
```
