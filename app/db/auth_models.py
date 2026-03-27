"""FastAPI-Users için SQLAlchemy modelleri.

FastAPI-Users kendi User tablosunu gerektirir.
Bu tablo core.users'ın auth katmanıdır.
"""

from fastapi_users.db import SQLAlchemyBaseOAuthAccountTableUUID, SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    __tablename__ = "oauth_accounts"
    __table_args__ = {"schema": "core"}


class UserDB(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "auth_users"
    __table_args__ = {"schema": "core"}

    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tenant_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    role: Mapped[str] = mapped_column(String(50), server_default="member", nullable=False)
