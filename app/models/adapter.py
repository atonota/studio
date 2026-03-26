import uuid
from datetime import datetime

from sqlalchemy import Index, String
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, BasePKMixin, TimestampMixin


class Adapter(BasePKMixin, TimestampMixin, Base):
    __tablename__ = "adapters"
    __table_args__ = (
        Index("ix_adapters_workspace_created", "workspace_uid", "created_at"),
        {"schema": "core"},
    )

    workspace_uid: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        nullable=False,
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    adapter_version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    credentials: Mapped[dict] = mapped_column(JSONB, server_default="{}", nullable=False)  # type: ignore[assignment]
    status: Mapped[str] = mapped_column(String(50), server_default="disconnected", nullable=False)
    last_health_check_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
