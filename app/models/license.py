import uuid
from datetime import datetime

from sqlalchemy import Index, Integer, String
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, BasePKMixin, TenantMixin, TimestampMixin


class License(BasePKMixin, TenantMixin, TimestampMixin, Base):
    __tablename__ = "licenses"
    __table_args__ = (
        Index("ix_licenses_tenant_created", "tenant_id", "created_at"),
        {"schema": "core"},
    )

    plugin_uid: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        nullable=False,
    )
    license_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), server_default="active", nullable=False)
    activated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    max_sites: Mapped[int] = mapped_column(Integer, server_default="1", nullable=False)
