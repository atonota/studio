"""initial core schema

Revision ID: 0001
Revises:
Create Date: 2026-03-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import INET, JSONB, TIMESTAMP, UUID

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- core.tenants ---
    op.create_table(
        "tenants",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("domain", sa.String(255), nullable=True),
        sa.Column("plan", sa.String(50), server_default="free", nullable=False),
        sa.Column("settings", JSONB, server_default="{}", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default="true", nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )

    # --- core.users ---
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("hashed_password", sa.String(1024), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("role", sa.String(50), server_default="member", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default="true", nullable=False),
        sa.Column("last_login_at", TIMESTAMP(timezone=True), nullable=True),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )
    op.create_index(
        "ix_users_tenant_created", "users", ["tenant_id", "created_at"], schema="core"
    )

    # --- core.workspaces ---
    op.create_table(
        "workspaces",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("url", sa.String(2048), nullable=True),
        sa.Column("platform", sa.String(50), nullable=True),
        sa.Column("is_active", sa.Boolean, server_default="true", nullable=False),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )
    op.create_index(
        "ix_workspaces_tenant_created", "workspaces", ["tenant_id", "created_at"], schema="core"
    )

    # --- core.plugins ---
    op.create_table(
        "plugins",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("version", sa.String(50), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("is_public", sa.Boolean, server_default="false", nullable=False),
        sa.Column("metadata", JSONB, server_default="{}", nullable=False),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )

    # --- core.licenses ---
    op.create_table(
        "licenses",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("plugin_uid", UUID(as_uuid=True), nullable=False),
        sa.Column("license_key", sa.String(255), unique=True, nullable=False),
        sa.Column("status", sa.String(50), server_default="active", nullable=False),
        sa.Column("activated_at", TIMESTAMP(timezone=True), nullable=True),
        sa.Column("expires_at", TIMESTAMP(timezone=True), nullable=True),
        sa.Column("max_sites", sa.Integer, server_default="1", nullable=False),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )
    op.create_index(
        "ix_licenses_tenant_created", "licenses", ["tenant_id", "created_at"], schema="core"
    )

    # --- core.adapters ---
    op.create_table(
        "adapters",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("workspace_uid", UUID(as_uuid=True), nullable=False),
        sa.Column("platform", sa.String(50), nullable=False),
        sa.Column("adapter_version", sa.String(50), nullable=True),
        sa.Column("credentials", JSONB, server_default="{}", nullable=False),
        sa.Column("status", sa.String(50), server_default="disconnected", nullable=False),
        sa.Column("last_health_check_at", TIMESTAMP(timezone=True), nullable=True),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", TIMESTAMP(timezone=True), nullable=True, index=True),
        schema="core",
    )
    op.create_index(
        "ix_adapters_workspace_created", "adapters", ["workspace_uid", "created_at"], schema="core"
    )

    # --- audit.events ---
    op.create_table(
        "events",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("uid", UUID(as_uuid=True), unique=True, nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("actor_id", UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(255), nullable=False),
        sa.Column("resource_type", sa.String(100), nullable=True),
        sa.Column("resource_id", UUID(as_uuid=True), nullable=True),
        sa.Column("metadata", JSONB, server_default="{}", nullable=False),
        sa.Column("ip_address", INET, nullable=True),
        sa.Column("created_at", TIMESTAMP(timezone=True), server_default=sa.func.now(), nullable=False),
        schema="audit",
    )
    op.create_index(
        "ix_audit_events_tenant_created", "events", ["tenant_id", "created_at"], schema="audit"
    )

    # --- RLS policies ---
    for table, schema in [
        ("users", "core"),
        ("workspaces", "core"),
        ("licenses", "core"),
    ]:
        op.execute(f"ALTER TABLE {schema}.{table} ENABLE ROW LEVEL SECURITY")
        op.execute(
            f"CREATE POLICY tenant_isolation ON {schema}.{table} "
            f"USING (tenant_id = current_setting('app.current_tenant_id')::uuid)"
        )


def downgrade() -> None:
    # Drop RLS policies
    for table, schema in [
        ("licenses", "core"),
        ("workspaces", "core"),
        ("users", "core"),
    ]:
        op.execute(f"DROP POLICY IF EXISTS tenant_isolation ON {schema}.{table}")
        op.execute(f"ALTER TABLE {schema}.{table} DISABLE ROW LEVEL SECURITY")

    # Drop tables in reverse order
    op.drop_table("events", schema="audit")
    op.drop_table("adapters", schema="core")
    op.drop_table("licenses", schema="core")
    op.drop_table("plugins", schema="core")
    op.drop_table("workspaces", schema="core")
    op.drop_table("users", schema="core")
    op.drop_table("tenants", schema="core")
