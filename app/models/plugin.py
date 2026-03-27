from sqlalchemy import Boolean, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, BasePKMixin, TimestampMixin


class Plugin(BasePKMixin, TimestampMixin, Base):
    __tablename__ = "plugins"
    __table_args__ = (
        Index(
            "uq_plugins_slug_active",
            "slug",
            unique=True,
            postgresql_where="deleted_at IS NULL",
        ),
        {"schema": "core"},
    )

    slug: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    metadata_: Mapped[dict] = mapped_column(  # type: ignore[type-arg]
        "metadata", JSONB, server_default="{}", nullable=False
    )
