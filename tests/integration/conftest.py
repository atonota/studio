"""Integration test fixture'ları.

Gerçek PostgreSQL'e bağlanır (docker compose up gerektirir).
"""

import os
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://atonota:atonota_dev@localhost:5433/atonota_dev",
)


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Her test icin taze engine + session + client."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False, pool_size=2, max_overflow=0)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    # Cleanup before test
    async with engine.begin() as conn:
        await conn.execute(
            text(
                "TRUNCATE TABLE core.adapters, core.licenses, core.workspaces, "
                "core.users, core.oauth_accounts, core.auth_users, core.plugins, "
                "core.tenants, audit.events CASCADE"
            )
        )

    from app.db.session import get_async_session
    from app.main import create_app

    app = create_app()

    async def override_session() -> AsyncGenerator[AsyncSession, None]:
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_async_session] = override_session

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
    await engine.dispose()
