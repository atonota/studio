from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import text

from app.api.v1 import health, tenants
from app.core.auth import auth_backend, fastapi_users
from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.core.middleware import setup_middleware
from app.core.sentry import setup_sentry
from app.db.session import engine
from app.schemas.user import UserCreate, UserRead, UserUpdate

BASE_DIR = Path(__file__).resolve().parent.parent
settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):  # type: ignore[no-untyped-def]
    setup_logging()
    setup_sentry()
    logger.info("starting_up", version=settings.APP_VERSION, environment=settings.ENVIRONMENT)

    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("database_connected")
    except Exception:
        logger.exception("database_connection_failed")
        raise

    yield

    logger.info("shutting_down")
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
    )

    app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

    templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
    app.state.templates = templates

    setup_middleware(app)

    app.include_router(health.router, prefix="/api/v1", tags=["health"])
    app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["tenants"])

    # Auth routes
    app.include_router(
        fastapi_users.get_auth_router(auth_backend),
        prefix="/api/v1/auth",
        tags=["auth"],
    )
    app.include_router(
        fastapi_users.get_register_router(UserRead, UserCreate),
        prefix="/api/v1/auth",
        tags=["auth"],
    )
    app.include_router(
        fastapi_users.get_users_router(UserRead, UserUpdate),
        prefix="/api/v1/users",
        tags=["users"],
    )

    return app


app = create_app()
