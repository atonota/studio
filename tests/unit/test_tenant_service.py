"""Tenant service unit testleri."""

from datetime import UTC

import pytest

from app.schemas.tenant import TenantCreate


@pytest.mark.asyncio
async def test_encode_decode_cursor() -> None:
    from datetime import datetime
    from uuid import UUID

    from app.services.tenant import _decode_cursor, _encode_cursor

    dt = datetime(2026, 3, 27, 12, 0, 0, tzinfo=UTC)
    uid = UUID("01234567-89ab-cdef-0123-456789abcdef")

    encoded = _encode_cursor(dt, uid)
    decoded_dt, decoded_uid = _decode_cursor(encoded)

    assert decoded_dt == dt
    assert decoded_uid == uid


@pytest.mark.asyncio
async def test_create_tenant_schema_validation() -> None:
    tenant = TenantCreate(name="Test Tenant", slug="test-tenant")
    assert tenant.name == "Test Tenant"
    assert tenant.slug == "test-tenant"
    assert tenant.plan == "free"
    assert tenant.domain is None


@pytest.mark.asyncio
async def test_create_tenant_slug_pattern() -> None:
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        TenantCreate(name="Bad", slug="INVALID SLUG!")


@pytest.mark.asyncio
async def test_create_tenant_name_required() -> None:
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        TenantCreate(name="", slug="valid-slug")
