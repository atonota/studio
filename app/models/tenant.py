from sqlalchemy import Boolean, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, BasePKMixin, TimestampMixin


class Tenant(BasePKMixin, TimestampMixin, Base):
    __tablename__ = "tenants"
    __table_args__ = {"schema": "core"}

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    domain: Mapped[str | None] = mapped_column(String(255), nullable=True)
    plan: Mapped[str] = mapped_column(String(50), server_default="free", nullable=False)
    settings: Mapped[dict] = mapped_column(JSONB, server_default="{}", nullable=False)  # type: ignore[type-arg]
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true", nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
