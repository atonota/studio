# PlatformAdapter Protocol Sözleşmesi

> Her platform adaptörü bu sözleşmeyi eksiksiz implement etmek zorundadır.
> Sözleşme değişiklikleri semantic versioning ile yönetilir.
> Sürüm: 1.0.0

---

## Protocol Tanımı

```python
from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from typing import Any, Protocol
from uuid import UUID


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


@dataclass(frozen=True)
class AdapterCredentials:
    """Platform bağlantı bilgileri."""
    platform_id: str
    api_key: str | None = None
    api_secret: str | None = None
    access_token: str | None = None
    refresh_token: str | None = None
    base_url: str | None = None
    extra: dict[str, Any] | None = None


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
    key: str                          # örn: "page_speed_score", "organic_keywords"
    value: float
    dimensions: dict[str, str] | None = None  # örn: {"url": "/about", "device": "mobile"}
    collected_at: datetime | None = None


@dataclass(frozen=True)
class AdapterConfig:
    """Adaptöre gönderilen konfigürasyon."""
    settings: dict[str, Any]
    version: str | None = None


class PlatformAdapter(Protocol):
    """
    Tüm platform adaptörlerinin uyması gereken sözleşme.

    Her adaptör bu Protocol'ü implement eder.
    Intelligence Core bu interface üzerinden platform-agnostik çalışır.
    """

    platform_id: str          # "wordpress", "shopify", "drupal", ...
    platform_version: str     # "6.5", "2024.1", ...

    async def connect(self, credentials: AdapterCredentials) -> None:
        """
        Platforma bağlan.

        Raises:
            AdapterConnectionError: Bağlantı başarısız
            AdapterAuthError: Kimlik doğrulama hatası
        """
        ...

    async def disconnect(self) -> None:
        """Bağlantıyı güvenli şekilde kapat."""
        ...

    async def health_check(self) -> AdapterHealth:
        """
        Platform bağlantı durumunu kontrol et.

        Her 5 dakikada bir çağrılır (Celery Beat).
        p95 < 2000ms olmalı.
        """
        ...

    async def collect_metrics(
        self,
        workspace_id: UUID,
        since: datetime,
        metric_types: list[MetricType] | None = None,
    ) -> list[PlatformMetric]:
        """
        Belirtilen tarihten itibaren metrikleri topla.

        Args:
            workspace_id: Metriklerin ait olduğu workspace
            since: Bu tarihten sonraki metrikleri getir
            metric_types: Filtrelenecek metrik türleri (None = hepsi)

        Returns:
            Toplanan metrik listesi

        Raises:
            AdapterConnectionError: Bağlantı kopuk
            AdapterRateLimitError: Rate limit aşıldı
        """
        ...

    async def push_config(self, config: AdapterConfig) -> None:
        """
        Adaptöre konfigürasyon gönder.

        Raises:
            AdapterConnectionError: Bağlantı kopuk
            AdapterConfigError: Geçersiz konfigürasyon
        """
        ...
```

---

## Hata Sınıfları

```python
class AdapterError(Exception):
    """Tüm adaptör hatalarının base class'ı."""
    def __init__(self, message: str, platform_id: str, details: dict | None = None):
        self.platform_id = platform_id
        self.details = details or {}
        super().__init__(message)


class AdapterConnectionError(AdapterError):
    """Bağlantı hatası."""
    pass


class AdapterAuthError(AdapterError):
    """Kimlik doğrulama hatası."""
    pass


class AdapterRateLimitError(AdapterError):
    """Rate limit aşıldı."""
    def __init__(self, message: str, platform_id: str, retry_after: int | None = None):
        self.retry_after = retry_after
        super().__init__(message, platform_id)


class AdapterConfigError(AdapterError):
    """Geçersiz konfigürasyon."""
    pass
```

---

## Yaşam Döngüsü

```
1. connect(credentials)     <- ilk bağlantı
2. health_check()           <- 5dk aralıkla (Celery Beat)
3. collect_metrics(since)   <- zamanlanmış veri toplama
4. push_config(config)      <- konfigürasyon güncelleme (isteğe bağlı)
5. disconnect()             <- bağlantı kapatma
```

---

## Kurallar

1. **Stateless**: Adaptör instance'ı session state tutmamalı, her çağrı bağımsız
2. **Idempotent**: `collect_metrics` aynı `since` ile tekrar çağrılabilmeli
3. **Timeout**: Her dış çağrı max 30 saniye (httpx timeout)
4. **Retry**: Adaptör kendi retry mantığını barındırmalı (max 3, exponential backoff)
5. **Logging**: Her dış çağrı `structlog` ile loglanmalı
6. **Audit**: `connect`, `disconnect`, `push_config` işlemleri `audit.events`'e yazılmalı
7. **Rate limit**: Platform rate limit'lerine uyum adaptörün sorumluluğu
8. **Credentials**: `AdapterCredentials` DB'de JSONB olarak şifreli saklanır

---

## Test Gereksinimleri

Her adaptör için:
- Unit test: mock HTTP ile tüm Protocol metodları
- Integration test: sandbox/test API ile gerçek bağlantı
- Health check latency: p95 < 2000ms
- Coverage: %80 minimum
