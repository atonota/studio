import os
from unittest.mock import patch

from app.core.config import Settings


def test_settings_defaults() -> None:
    with patch.dict(os.environ, {"ENVIRONMENT": "development"}, clear=False):
        settings = Settings(
            DATABASE_URL="postgresql+asyncpg://test:test@localhost/test",
            JWT_SECRET="test-secret",
            ENVIRONMENT="development",
        )
    assert settings.APP_NAME == "atonota-studio"
    assert settings.APP_VERSION == "0.1.0"
    assert settings.ENVIRONMENT == "development"
    assert settings.DEBUG is False


def test_settings_custom_values() -> None:
    settings = Settings(
        DATABASE_URL="postgresql+asyncpg://custom:custom@db:5432/custom",
        JWT_SECRET="custom-secret",
        ENVIRONMENT="production",
        DEBUG=True,
        APP_NAME="custom-studio",
    )
    assert settings.APP_NAME == "custom-studio"
    assert settings.ENVIRONMENT == "production"
    assert settings.DEBUG is True
    assert settings.JWT_SECRET == "custom-secret"
