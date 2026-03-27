"""Developer Studio sayfa route'ları — Jinja2 + HTMX."""

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.core.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/", response_class=HTMLResponse)
async def dashboard(request: Request) -> HTMLResponse:
    templates = request.app.state.templates
    return templates.TemplateResponse(request, "pages/dashboard.html", {
        "version": settings.APP_VERSION,
    })


@router.get("/tenants", response_class=HTMLResponse)
async def tenants_page(request: Request) -> HTMLResponse:
    templates = request.app.state.templates
    return templates.TemplateResponse(request, "pages/tenants.html")


@router.get("/plugins", response_class=HTMLResponse)
async def plugins_page(request: Request) -> HTMLResponse:
    templates = request.app.state.templates
    return templates.TemplateResponse(request, "pages/plugins.html")


@router.get("/adapters", response_class=HTMLResponse)
async def adapters_page(request: Request) -> HTMLResponse:
    templates = request.app.state.templates
    return templates.TemplateResponse(request, "pages/adapters.html")
