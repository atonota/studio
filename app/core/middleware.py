"""CORS ve Rate Limiting middleware konfigürasyonu.

CORS: whitelist-only — wildcard (*) yasak (CLAUDE.md §9)
Rate limit: tenant bazlı + genel (CLAUDE.md §9)
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import get_settings

settings = get_settings()

# CORS whitelist — production'da .env'den okunur
ALLOWED_ORIGINS: list[str] = [
    "https://atonota.com",
    "https://studio.atonota.com",
    "https://api.atonota.com",
]

if settings.ENVIRONMENT == "development":
    ALLOWED_ORIGINS.extend(
        [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
    )


def _get_tenant_or_ip(request: Request) -> str:
    """Rate limit key: tenant_id varsa onu, yoksa IP kullan."""
    tenant_id = request.headers.get("X-Tenant-ID")
    if tenant_id:
        return f"tenant:{tenant_id}"
    return get_remote_address(request)


limiter = Limiter(key_func=_get_tenant_or_ip)


def setup_middleware(app: FastAPI) -> None:
    """Tüm middleware'leri FastAPI app'e ekler."""

    # CORS — whitelist only, wildcard yasak
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        max_age=600,
    )

    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
