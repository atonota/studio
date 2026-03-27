"""Plugin CRUD endpoint'leri."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.schemas.plugin import PluginCreate, PluginListResponse, PluginResponse, PluginUpdate
from app.services import plugin as plugin_service

router = APIRouter()


@router.post("", response_model=PluginResponse, status_code=201)
async def create_plugin(
    data: PluginCreate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> PluginResponse:
    return await plugin_service.create_plugin(session, data)


@router.get("", response_model=PluginListResponse)
async def list_plugins(
    cursor: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    category: str | None = Query(None),
    is_public: bool | None = Query(None),
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> PluginListResponse:
    return await plugin_service.list_plugins(
        session, cursor=cursor, limit=limit, category=category, is_public=is_public
    )


@router.get("/{plugin_uid}", response_model=PluginResponse)
async def get_plugin(
    plugin_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> PluginResponse:
    plugin = await plugin_service.get_plugin(session, plugin_uid)
    if not plugin:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return plugin


@router.get("/by-slug/{slug}", response_model=PluginResponse)
async def get_plugin_by_slug(
    slug: str,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> PluginResponse:
    plugin = await plugin_service.get_plugin_by_slug(session, slug)
    if not plugin:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return plugin


@router.patch("/{plugin_uid}", response_model=PluginResponse)
async def update_plugin(
    plugin_uid: UUID,
    data: PluginUpdate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> PluginResponse:
    plugin = await plugin_service.update_plugin(session, plugin_uid, data)
    if not plugin:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return plugin


@router.delete("/{plugin_uid}", status_code=204)
async def delete_plugin(
    plugin_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> None:
    deleted = await plugin_service.soft_delete_plugin(session, plugin_uid)
    if not deleted:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
