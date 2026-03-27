"""Adapter Protocol ve error class testleri."""

from uuid import UUID

from app.core.adapters import (
    AdapterAuthError,
    AdapterConfig,
    AdapterConnectionError,
    AdapterCredentials,
    AdapterHealth,
    AdapterRateLimitError,
    AdapterStatus,
    MetricType,
    PlatformMetric,
)


def test_adapter_credentials_creation() -> None:
    creds = AdapterCredentials(
        platform_id="wordpress",
        api_key="test-key",
        base_url="https://example.com",
    )
    assert creds.platform_id == "wordpress"
    assert creds.api_key == "test-key"
    assert creds.extra == {}


def test_adapter_health_status() -> None:
    health = AdapterHealth(status=AdapterStatus.CONNECTED, latency_ms=45.2, message="OK")
    assert health.status == AdapterStatus.CONNECTED
    assert health.latency_ms == 45.2


def test_platform_metric() -> None:
    metric = PlatformMetric(
        workspace_id=UUID("01234567-89ab-cdef-0123-456789abcdef"),
        metric_type=MetricType.SEO,
        key="organic_keywords",
        value=1234.0,
        dimensions={"url": "/about"},
    )
    assert metric.metric_type == MetricType.SEO
    assert metric.dimensions["url"] == "/about"


def test_adapter_config() -> None:
    config = AdapterConfig(settings={"key": "value"}, version="1.0.0")
    assert config.settings["key"] == "value"


def test_adapter_connection_error() -> None:
    err = AdapterConnectionError("Connection failed", platform_id="shopify")
    assert err.platform_id == "shopify"
    assert str(err) == "Connection failed"


def test_adapter_auth_error() -> None:
    err = AdapterAuthError("Invalid token", platform_id="wordpress", details={"code": 401})
    assert err.details["code"] == 401


def test_adapter_rate_limit_error() -> None:
    err = AdapterRateLimitError("Rate limited", platform_id="drupal", retry_after=60)
    assert err.retry_after == 60


def test_metric_types() -> None:
    assert MetricType.SEO == "seo"
    assert MetricType.PERFORMANCE == "performance"
    assert MetricType.SECURITY == "security"
    assert MetricType.ANALYTICS == "analytics"
    assert MetricType.CONTENT == "content"
