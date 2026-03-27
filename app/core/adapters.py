"""PlatformAdapter Protocol sözleşmesi ve ilgili tipler.

Her platform adaptörü bu modüldeki Protocol'ü implement etmek zorundadır.
Sözleşme versiyonu: 1.0.0
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any, Protocol
from uuid import UUID

# --- Enums ---


class AdapterStatus(StrEnum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    RATE_LIMITED = "rate_limited"


class MetricType(StrEnum):
    SEO = "seo"
    PERFORMANCE = "performance"
    SECURITY = "security"
    ANALYTICS = "analytics"
    CONTENT = "content"


# --- Data classes ---


@dataclass(frozen=True)
class AdapterCredentials:
    """Platform bağlantı bilgileri."""

    platform_id: str
    api_key: str | None = None
    api_secret: str | None = None
    access_token: str | None = None
    refresh_token: str | None = None
    base_url: str | None = None
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class AdapterHealth:
    """Adaptör sağlık durumu."""

    status: AdapterStatus
    latency_ms: float
    message: str | None = None
    checked_at: datetime | None = None


@dataclass(frozen=True)
class PlatformMetric:
    """Platform'dan toplanan tekil metrik."""

    workspace_id: UUID
    metric_type: MetricType
    key: str
    value: float
    dimensions: dict[str, str] = field(default_factory=dict)
    collected_at: datetime | None = None


@dataclass(frozen=True)
class AdapterConfig:
    """Adaptöre gönderilen konfigürasyon."""

    settings: dict[str, Any] = field(default_factory=dict)
    version: str | None = None


# --- Protocol ---


class PlatformAdapter(Protocol):
    """Tüm platform adaptörlerinin uyması gereken sözleşme."""

    platform_id: str
    platform_version: str

    async def connect(self, credentials: AdapterCredentials) -> None: ...

    async def disconnect(self) -> None: ...

    async def health_check(self) -> AdapterHealth: ...

    async def collect_metrics(
        self,
        workspace_id: UUID,
        since: datetime,
        metric_types: list[MetricType] | None = None,
    ) -> list[PlatformMetric]: ...

    async def push_config(self, config: AdapterConfig) -> None: ...


# --- Exceptions ---


class AdapterError(Exception):
    """Tüm adaptör hatalarının base class'ı."""

    def __init__(self, message: str, platform_id: str, details: dict[str, Any] | None = None) -> None:
        self.platform_id = platform_id
        self.details = details or {}
        super().__init__(message)


class AdapterConnectionError(AdapterError):
    """Bağlantı hatası."""


class AdapterAuthError(AdapterError):
    """Kimlik doğrulama hatası."""


class AdapterRateLimitError(AdapterError):
    """Rate limit aşıldı."""

    def __init__(
        self,
        message: str,
        platform_id: str,
        retry_after: int | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.retry_after = retry_after
        super().__init__(message, platform_id, details)


class AdapterConfigError(AdapterError):
    """Geçersiz konfigürasyon."""
