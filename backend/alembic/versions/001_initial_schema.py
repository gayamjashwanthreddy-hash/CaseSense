"""Initial CaseBridge AI Schema Migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-21 16:50:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Bureaus
    op.create_table(
        "bureaus",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), default=True),
    )

    # 2. Institutions
    op.create_table(
        "institutions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("district", sa.String(length=100), nullable=False),
        sa.Column("region", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=100), default="Technical / Engineering"),
        sa.Column("approval_status", sa.String(length=100), default="Approved"),
        sa.Column("accreditation", sa.String(length=100), default="NBA / NAAC"),
        sa.Column("affiliated_university", sa.String(length=255), nullable=True),
        sa.Column("head_of_institution", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("risk_level", sa.String(length=50), default="LOW"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_institutions_name", "institutions", ["name"])
    op.create_index("ix_institutions_state", "institutions", ["state"])
    op.create_index("ix_institutions_region", "institutions", ["region"])

    # 3. Users
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=64), nullable=False),
        sa.Column("bureau_id", sa.String(length=64), sa.ForeignKey("bureaus.id", ondelete="SET NULL"), nullable=True),
        sa.Column("institution_id", sa.String(length=64), sa.ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("last_login_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"])
    op.create_index("ix_users_institution_id", "users", ["institution_id"])

    # 4. Complaints
    op.create_table(
        "complaints",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("ref_number", sa.String(length=64), nullable=False),
        sa.Column("tracking_code", sa.String(length=64), nullable=False),
        sa.Column("institution_id", sa.String(length=64), sa.ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("bureau_id", sa.String(length=64), sa.ForeignKey("bureaus.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("priority", sa.String(length=50), default="MEDIUM"),
        sa.Column("status", sa.String(length=50), default="NEW_INTAKE"),
        sa.Column("complainant_name", sa.String(length=255), nullable=False),
        sa.Column("complainant_type", sa.String(length=50), default="STUDENT"),
        sa.Column("complainant_email", sa.String(length=255), nullable=True),
        sa.Column("complainant_phone", sa.String(length=50), nullable=True),
        sa.Column("is_anonymous", sa.Boolean(), default=False),
        sa.Column("is_confidential", sa.Boolean(), default=False),
        sa.Column("received_date", sa.String(length=20), nullable=False),
        sa.Column("sla_deadline", sa.String(length=20), nullable=False),
        sa.Column("days_open", sa.Integer(), default=1),
        sa.Column("last_action_summary", sa.Text(), nullable=True),
        sa.Column("last_action_date", sa.String(length=20), nullable=True),
        sa.Column("next_action_required", sa.Text(), nullable=True),
        sa.Column("next_action_deadline", sa.String(length=20), nullable=True),
        sa.Column("assigned_officer", sa.String(length=255), nullable=True),
        sa.Column("assigned_officer_role", sa.String(length=255), nullable=True),
        sa.Column("has_overlap", sa.Boolean(), default=False),
        sa.Column("overlap_pair_id", sa.String(length=64), nullable=True),
        sa.Column("relevant_clauses_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_complaints_ref_number", "complaints", ["ref_number"], unique=True)
    op.create_index("ix_complaints_tracking_code", "complaints", ["tracking_code"])
    op.create_index("ix_complaints_institution_id", "complaints", ["institution_id"])
    op.create_index("ix_complaints_bureau_id", "complaints", ["bureau_id"])
    op.create_index("ix_complaints_category", "complaints", ["category"])
    op.create_index("ix_complaints_priority", "complaints", ["priority"])
    op.create_index("ix_complaints_status", "complaints", ["status"])
    op.create_index("ix_complaints_has_overlap", "complaints", ["has_overlap"])

    # 5. Complaint Events
    op.create_table(
        "complaint_events",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("complaint_id", sa.String(length=64), sa.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False),
        sa.Column("event_type", sa.String(length=100), nullable=False),
        sa.Column("previous_status", sa.String(length=50), nullable=True),
        sa.Column("new_status", sa.String(length=50), nullable=True),
        sa.Column("actor_name", sa.String(length=255), nullable=False),
        sa.Column("actor_role", sa.String(length=100), nullable=True),
        sa.Column("bureau", sa.String(length=64), nullable=True),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("timestamp", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_complaint_events_complaint_id", "complaint_events", ["complaint_id"])

    # 6. Complaint Relationships
    op.create_table(
        "complaint_relationships",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("case_a_id", sa.String(length=64), sa.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False),
        sa.Column("case_b_id", sa.String(length=64), sa.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False),
        sa.Column("institution_id", sa.String(length=64), sa.ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("institution_name", sa.String(length=255), nullable=False),
        sa.Column("similarity_score", sa.Integer(), default=75),
        sa.Column("urgency", sa.String(length=50), default="MEDIUM"),
        sa.Column("detected_at", sa.String(length=50), nullable=False),
        sa.Column("rationale_json", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=50), default="PENDING_REVIEW"),
        sa.Column("lead_bureau", sa.String(length=64), nullable=True),
        sa.Column("reviewer_name", sa.String(length=255), nullable=True),
        sa.Column("reviewer_notes", sa.Text(), nullable=True),
        sa.Column("reviewed_at", sa.String(length=50), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("case_a_id", "case_b_id", name="uq_case_pair"),
    )
    op.create_index("ix_complaint_relationships_case_a_id", "complaint_relationships", ["case_a_id"])
    op.create_index("ix_complaint_relationships_case_b_id", "complaint_relationships", ["case_b_id"])
    op.create_index("ix_complaint_relationships_status", "complaint_relationships", ["status"])

    # 7. Complaint Responses
    op.create_table(
        "complaint_responses",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("complaint_id", sa.String(length=64), sa.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False),
        sa.Column("institution_id", sa.String(length=64), sa.ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("submitted_by", sa.String(length=255), nullable=False),
        sa.Column("official_designation", sa.String(length=255), nullable=False),
        sa.Column("statement", sa.Text(), nullable=False),
        sa.Column("compliance_documents_json", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), default="SUBMITTED"),
        sa.Column("submitted_at", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_complaint_responses_complaint_id", "complaint_responses", ["complaint_id"])
    op.create_index("ix_complaint_responses_institution_id", "complaint_responses", ["institution_id"])

    # 8. Attachments
    op.create_table(
        "attachments",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("complaint_id", sa.String(length=64), sa.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("file_key", sa.String(length=255), nullable=False),
        sa.Column("file_size", sa.Integer(), default=0),
        sa.Column("mime_type", sa.String(length=100), default="application/pdf"),
        sa.Column("uploader_name", sa.String(length=255), default="System"),
        sa.Column("uploader_role", sa.String(length=100), default="COMPLAINANT"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_attachments_complaint_id", "attachments", ["complaint_id"])

    # 9. Audit Logs
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("case_id", sa.String(length=64), nullable=True),
        sa.Column("timestamp", sa.String(length=50), nullable=False),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("performed_by", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=100), nullable=True),
        sa.Column("bureau", sa.String(length=64), nullable=True),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_audit_logs_case_id", "audit_logs", ["case_id"])
    op.create_index("ix_audit_logs_action", "audit_logs", ["action"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("attachments")
    op.drop_table("complaint_responses")
    op.drop_table("complaint_relationships")
    op.drop_table("complaint_events")
    op.drop_table("complaints")
    op.drop_table("users")
    op.drop_table("institutions")
    op.drop_table("bureaus")
