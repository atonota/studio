"""Sentry SDK konfigürasyonu."""

import sentry_sdk

from app.core.config import get_settings


def setup_sentry() -> None:
    """Sentry'yi başlat. DSN boşsa sessizce atlar."""
    settings = get_settings()

    if not settings.SENTRY_DSN:
        return

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=settings.APP_VERSION,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.05,
        send_default_pii=False,
    )
