"""Plugin iş mantığı servisi."""

import base64
import json
from datetime import datetime
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.plugin import Plugin
from app.schemas.base import CursorInfo
from app.schemas.plugin import PluginCreate, PluginListResponse, PluginResponse, PluginUpdate

logger = get_logger(__name__)


def _encode_cursor(created_at: datetime, uid: UUID) -> str:
    data = {"c": created_at.isoformat(), "i": str(uid)}
    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode()


def _decode_cursor(cursor: str) -> tuple[datetime, UUID]:
    data = json.loads(base64.urlsafe_b64decode(cursor))
    return datetime.fromisoformat(data["c"]), UUID(data["i"])


async def create_plugin(
    session: AsyncSession,
    data: PluginCreate,
) -> PluginResponse:
    plugin = Plugin(
        slug=data.slug,
        name=data.name,
        description=data.description,
        version=data.version,
        category=data.category,
        is_public=data.is_public,
    )
    session.add(plugin)
    await session.commit()
    await session.refresh(plugin)
    logger.info("plugin_created", plugin_uid=str(plugin.uid), slug=data.slug)
    return PluginResponse.model_validate(plugin)


async def get_plugin(
    session: AsyncSession,
    plugin_uid: UUID,
) -> PluginResponse | None:
    result = await session.execute(
        select(Plugin).where(
            Plugin.uid == plugin_uid,
            Plugin.deleted_at.is_(None),
        )
    )
    plugin = result.scalar_one_or_none()
    if not plugin:
        return None
    return PluginResponse.model_validate(plugin)


async def get_plugin_by_slug(
    session: AsyncSession,
    slug: str,
) -> PluginResponse | None:
    result = await session.execute(
        select(Plugin).where(
            Plugin.slug == slug,
            Plugin.deleted_at.is_(None),
        )
    )
    plugin = result.scalar_one_or_none()
    if not plugin:
        return None
    return PluginResponse.model_validate(plugin)


async def update_plugin(
    session: AsyncSession,
    plugin_uid: UUID,
    data: PluginUpdate,
) -> PluginResponse | None:
    result = await session.execute(
        select(Plugin).where(
            Plugin.uid == plugin_uid,
            Plugin.deleted_at.is_(None),
        )
    )
    plugin = result.scalar_one_or_none()
    if not plugin:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "metadata":
            plugin.metadata_ = value
        else:
            setattr(plugin, field, value)

    await session.commit()
    await session.refresh(plugin)
    logger.info("plugin_updated", plugin_uid=str(plugin_uid))
    return PluginResponse.model_validate(plugin)


async def soft_delete_plugin(
    session: AsyncSession,
    plugin_uid: UUID,
) -> bool:
    result = await session.execute(
        select(Plugin).where(
            Plugin.uid == plugin_uid,
            Plugin.deleted_at.is_(None),
        )
    )
    plugin = result.scalar_one_or_none()
    if not plugin:
        return False

    plugin.deleted_at = func.now()  # type: ignore[assignment]
    await session.commit()
    logger.info("plugin_soft_deleted", plugin_uid=str(plugin_uid))
    return True


async def list_plugins(
    session: AsyncSession,
    cursor: str | None = None,
    limit: int = 20,
    category: str | None = None,
    is_public: bool | None = None,
) -> PluginListResponse:
    query = select(Plugin).where(Plugin.deleted_at.is_(None))

    if category:
        query = query.where(Plugin.category == category)
    if is_public is not None:
        query = query.where(Plugin.is_public == is_public)

    if cursor:
        cursor_dt, cursor_uid = _decode_cursor(cursor)
        query = query.where(
            or_(
                Plugin.created_at < cursor_dt,
                and_(Plugin.created_at == cursor_dt, Plugin.uid < cursor_uid),
            )
        )

    query = query.order_by(Plugin.created_at.desc(), Plugin.uid.desc()).limit(limit + 1)

    result = await session.execute(query)
    plugins = list(result.scalars().all())

    has_more = len(plugins) > limit
    if has_more:
        plugins = plugins[:limit]

    items = [PluginResponse.model_validate(p) for p in plugins]

    next_cursor = None
    if has_more and plugins:
        last = plugins[-1]
        next_cursor = _encode_cursor(last.created_at, last.uid)

    return PluginListResponse(
        items=items,
        cursor=CursorInfo(next_cursor=next_cursor, has_more=has_more),
    )
