from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def mock_session() -> AsyncMock:
    session = AsyncMock()
    result = MagicMock()
    session.execute.return_value = result
    return session


@pytest.fixture
def app(mock_session: AsyncMock):  # type: ignore[no-untyped-def]
    async def override_get_session() -> AsyncGenerator:  # type: ignore[type-arg]
        yield mock_session

    with (
        patch("app.main.engine") as mock_engine,
        patch("app.db.session.engine", mock_engine),
    ):
        mock_conn = AsyncMock()
        mock_engine.begin.return_value.__aenter__ = AsyncMock(return_value=mock_conn)
        mock_engine.begin.return_value.__aexit__ = AsyncMock(return_value=False)
        mock_engine.dispose = AsyncMock()

        from app.db.session import get_async_session
        from app.main import create_app

        application = create_app()
        application.dependency_overrides[get_async_session] = override_get_session
        yield application
        application.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_healthz_returns_ok(app: object, mock_session: AsyncMock) -> None:
    async with AsyncClient(
        transport=ASGITransport(app=app),  # type: ignore[arg-type]
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/healthz")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "environment" in data


@pytest.mark.asyncio
async def test_healthz_returns_version(app: object, mock_session: AsyncMock) -> None:
    async with AsyncClient(
        transport=ASGITransport(app=app),  # type: ignore[arg-type]
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/healthz")

    assert response.json()["version"] == "0.1.0"
