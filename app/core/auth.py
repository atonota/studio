"""FastAPI-Users auth konfigürasyonu.

JWT tabanlı kimlik doğrulama.
CLAUDE.md §9: JWT flow -> middleware -> SET app.current_tenant_id -> RESET ALL
"""

import uuid
from collections.abc import AsyncGenerator
from typing import Any

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.db.auth_models import OAuthAccount, UserDB
from app.db.session import get_async_session

settings = get_settings()
logger = get_logger(__name__)


# --- User Database ---


async def get_user_db(
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> AsyncGenerator[SQLAlchemyUserDatabase[UserDB, uuid.UUID], None]:
    yield SQLAlchemyUserDatabase(session, UserDB, OAuthAccount)


# --- User Manager ---


class UserManager(UUIDIDMixin, BaseUserManager[UserDB, uuid.UUID]):
    reset_password_token_secret = settings.JWT_SECRET
    verification_token_secret = settings.JWT_SECRET

    async def on_after_register(self, user: UserDB, request: Request | None = None) -> None:
        logger.info("user_registered", user_id=str(user.id), email=user.email)

    async def on_after_login(
        self,
        user: UserDB,
        request: Request | None = None,
        response: Any | None = None,
    ) -> None:
        logger.info("user_logged_in", user_id=str(user.id), email=user.email)

    async def on_after_forgot_password(self, user: UserDB, token: str, request: Request | None = None) -> None:
        logger.info("password_reset_requested", user_id=str(user.id))


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase[UserDB, uuid.UUID] = Depends(get_user_db),  # noqa: B008
) -> AsyncGenerator[UserManager, None]:
    yield UserManager(user_db)


# --- Auth Backend ---


bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/login")


def get_jwt_strategy() -> JWTStrategy[UserDB, uuid.UUID]:
    return JWTStrategy(
        secret=settings.JWT_SECRET,
        lifetime_seconds=settings.JWT_LIFETIME_SECONDS,
        algorithm=settings.JWT_ALGORITHM,
    )


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


# --- FastAPI Users instance ---

fastapi_users = FastAPIUsers[UserDB, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
