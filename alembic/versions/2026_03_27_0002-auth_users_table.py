"""auth users table

Revision ID: 0002
Revises: 0001
Create Date: 2026-03-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import TIMESTAMP, UUID

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- core.auth_users (FastAPI-Users) ---
    op.create_table(
        "auth_users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(320), unique=True, index=True, nullable=False),
        sa.Column("hashed_password", sa.String(1024), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default="true", nullable=False),
        sa.Column("is_superuser", sa.Boolean, server_default="false", nullable=False),
        sa.Column("is_verified", sa.Boolean, server_default="false", nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("tenant_id", sa.String(36), nullable=True, index=True),
        sa.Column("role", sa.String(50), server_default="member", nullable=False),
        schema="core",
    )

    # --- core.oauth_accounts ---
    op.create_table(
        "oauth_accounts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("core.auth_users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("oauth_name", sa.String(100), nullable=False, index=True),
        sa.Column("access_token", sa.String(1024), nullable=False),
        sa.Column("expires_at", sa.Integer, nullable=True),
        sa.Column("refresh_token", sa.String(1024), nullable=True),
        sa.Column("account_id", sa.String(320), nullable=False, index=True),
        sa.Column("account_email", sa.String(320), nullable=False),
        schema="core",
    )


def downgrade() -> None:
    op.drop_table("oauth_accounts", schema="core")
    op.drop_table("auth_users", schema="core")
