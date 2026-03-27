"""Tenant API integration testleri.

Gerçek PostgreSQL + gerçek FastAPI app.
docker compose up gerektirir.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_tenant(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/tenants",
        json={"name": "Test Tenant", "slug": "test-tenant", "plan": "free"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Tenant"
    assert data["slug"] == "test-tenant"
    assert data["plan"] == "free"
    assert data["is_active"] is True
    assert "uid" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_tenant_duplicate_slug(client: AsyncClient) -> None:
    await client.post(
        "/api/v1/tenants",
        json={"name": "First", "slug": "unique-slug"},
    )
    response = await client.post(
        "/api/v1/tenants",
        json={"name": "Second", "slug": "unique-slug"},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "SLUG_ALREADY_EXISTS"


@pytest.mark.asyncio
async def test_list_tenants_empty(client: AsyncClient) -> None:
    response = await client.get("/api/v1/tenants")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "cursor" in data
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_get_tenant_not_found(client: AsyncClient) -> None:
    response = await client.get("/api/v1/tenants/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "NOT_FOUND"


@pytest.mark.asyncio
async def test_create_and_get_tenant(client: AsyncClient) -> None:
    create_resp = await client.post(
        "/api/v1/tenants",
        json={"name": "Get Test", "slug": "get-test"},
    )
    uid = create_resp.json()["uid"]

    get_resp = await client.get(f"/api/v1/tenants/{uid}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Get Test"


@pytest.mark.asyncio
async def test_update_tenant(client: AsyncClient) -> None:
    create_resp = await client.post(
        "/api/v1/tenants",
        json={"name": "Update Test", "slug": "update-test"},
    )
    uid = create_resp.json()["uid"]

    patch_resp = await client.patch(
        f"/api/v1/tenants/{uid}",
        json={"name": "Updated Name", "plan": "pro"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["name"] == "Updated Name"
    assert patch_resp.json()["plan"] == "pro"


@pytest.mark.asyncio
async def test_delete_tenant(client: AsyncClient) -> None:
    create_resp = await client.post(
        "/api/v1/tenants",
        json={"name": "Delete Test", "slug": "delete-test"},
    )
    uid = create_resp.json()["uid"]

    delete_resp = await client.delete(f"/api/v1/tenants/{uid}")
    assert delete_resp.status_code == 204

    # Soft deleted — should not be found
    get_resp = await client.get(f"/api/v1/tenants/{uid}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_healthz_with_real_db(client: AsyncClient) -> None:
    response = await client.get("/api/v1/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"


@pytest.mark.asyncio
async def test_tenant_validation_error(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/tenants",
        json={"name": "", "slug": "INVALID SLUG!"},
    )
    assert response.status_code == 422
