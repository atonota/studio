from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import text

from app.api.v1 import health
from app.core.config import get_settings
from app.db.session import engine

BASE_DIR = Path(__file__).resolve().parent.parent
settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):  # type: ignore[no-untyped-def]
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
    yield
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

    app.include_router(health.router, prefix="/api/v1", tags=["health"])

    return app


app = create_app()
