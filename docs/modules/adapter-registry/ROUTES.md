# Module 06: adapter-registry — ROUTES

> Tum sayfa ve API endpoint tanimlari. FastAPI server-side routing.

---

## Sayfa Route'lari (HTML Response)

### GET /adapters

```
ENDPOINT   : GET /adapters
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/adapter/pages/adapter-catalog.html

QUERY PARAMS
  category   : string (query, optional)     -- "cms" | "analytics" | "ads" | "crm" | "ecommerce"
  status     : string (query, optional)     -- "active" | "beta" | "deprecated"
  connected  : boolean (query, optional)    -- tenant'in baglantisi var mi
  q          : string (query, optional)     -- platform adi arama

CONTEXT
  adapters        : list[AdapterCatalogResponse]
  categories      : list[CategorySummary]    -- filtre icin
  total_count     : int
  connected_count : int                      -- tenant'in bagli adaptor sayisi

ACIKLAMA
  Desteklenen tum platformlarin grid katalogu. Her kart platform ikonu, ad, kategori,
  auth tipi ve baglanti durumu gosterir. Tenant'in workspace'ine bagli olanlara
  "Bagli" badge'i eklenir.
```

### GET /adapters/{uid}

```
ENDPOINT   : GET /adapters/{uid}
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/adapter/pages/adapter-detail.html

PATH PARAMS
  uid        : UUID (path, required)

CONTEXT
  adapter         : AdapterDetailResponse
  connections     : list[ConnectionStatusResponse]  -- bu tenant icin
  health_history  : list[HealthLogEntry]            -- son 7 gun
  latency_stats   : LatencyStats                    -- avg, p50, p95, p99
  pattern_analysis: PatternAnalysis | None          -- AI kopma analizi
  compatible_modules: list[str]                     -- ["seo", "content", ...]

ERRORS
  404  NOT_FOUND         : adaptor bulunamadi
```

### GET /adapters/connect

```
ENDPOINT   : GET /adapters/connect
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/adapter/pages/adapter-connect.html

QUERY PARAMS
  platform   : string (query, optional)     -- on secili platform_id
  workspace  : UUID (query, optional)       -- on secili workspace uid

CONTEXT
  platforms       : list[AdapterCatalogResponse]   -- dropdown icin
  workspaces      : list[WorkspaceSummary]          -- dropdown icin

ACIKLAMA
  Baglanti sihirbazi (wizard). Adimlar:
  1. Workspace sec (veya URL'den on secili gelir)
  2. Platform sec (adaptor katalogundan)
  3. Credential gir (platform'a gore dinamik form)
  4. Baglanti testi yap
  5. Onayla
```

### GET /adapters/health

```
ENDPOINT   : GET /adapters/health
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/adapter/pages/adapter-health.html

CONTEXT
  connections     : list[ConnectionHealthSummary]   -- tum bagli adaptorler
  overall_status  : OverallHealthStatus             -- healthy / degraded / critical
  health_heatmap  : list[HeatmapEntry]              -- son 24 saat, saat bazli
  alerts          : list[HealthAlert]               -- credential expiry, pattern uyarilari

ACIKLAMA
  Toplu saglik panosu. Tum bagli adaptorlerin durum ozeti, 24 saatlik heatmap,
  acik uyarilar ve toplam saglik durumu.
```

---

## Partial Route'lari (HTMX Fragment Response)

### GET /api/v1/partials/adapter-catalog

```
ENDPOINT   : GET /api/v1/partials/adapter-catalog
AUTH       : Bearer JWT (studio_admin)
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/adapter/partials/adapter-grid.html

QUERY PARAMS
  category   : string (query, optional)
  status     : string (query, optional)
  connected  : boolean (query, optional)
  q          : string (query, optional)

ACIKLAMA
  Adaptor katalogu grid partial. Filtreleme sonucu HTML fragment olarak doner.
  Her kart: platform ikonu, ad, kategori badge, auth tipi, baglanti durumu.
```

### GET /api/v1/partials/adapter-health-timeline/{uid}

```
ENDPOINT   : GET /api/v1/partials/adapter-health-timeline/{uid}
AUTH       : Bearer JWT (studio_admin)
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/adapter/partials/health-timeline.html

PATH PARAMS
  uid        : UUID (path, required)        -- connection uid

QUERY PARAMS
  range      : string (query, optional, default: "7d")  -- "1d" | "7d" | "30d"

ACIKLAMA
  Tekil baglanti icin health check gecmisi. ECharts line chart iceren partial.
  x-ekseni: zaman, y-ekseni: latency (ms), renk: durum (ok=green, error=red).
```

### GET /api/v1/partials/adapter-credential-form/{platform}

```
ENDPOINT   : GET /api/v1/partials/adapter-credential-form/{platform}
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/adapter/partials/credential-form.html

PATH PARAMS
  platform   : string (path, required)      -- platform_id (ornek: "wordpress", "google_analytics")

ACIKLAMA
  Platform'a ozel credential form partial. Her platform farkli form alanlari gerektirir:
  - WordPress: site URL, application password veya JWT secret
  - Google Analytics: OAuth2 redirect (buton)
  - Shopify: API key + secret + store URL
  - Facebook Ads: OAuth2 redirect (buton) + ad account seçimi

  Form yapisi `core.adapters.config_schema` JSONB alanindaki JSON Schema'dan
  dinamik olarak olusturulur.
```

---

## API Route'lari (JSON Response)

### POST /api/v1/adapters/{uid}/test

```
ENDPOINT   : POST /api/v1/adapters/{uid}/test
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

PATH PARAMS
  uid        : UUID (path, required)        -- connection uid

RESPONSE 200
  status          : "ok" | "error" | "timeout"
  latency_ms      : int
  platform_name   : string
  platform_version: string | null
  error_code      : string | null
  error_detail    : string | null
  tested_at       : ISO8601

ERRORS
  404  NOT_FOUND         : baglanti bulunamadi
  403  FORBIDDEN         : baska tenant'a ait
  408  TIMEOUT           : baglanti zaman asimi (10sn)
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="adapter.test", resource_id=uid)
IDEMPOTENT : dogasi geregi (test tekrar edilebilir)

ACIKLAMA
  Mevcut credential'lar ile baglanti testi yapar. Adaptorun `health_check()` metodunu
  cagirarak platform'a erisimi dogrular. Sonuc `adapter_health_logs` tablosuna yazilir.
```

---

## Pydantic Semalari

```python
# schemas.py

class AdapterCatalogResponse(BaseModel):
    uid: UUID
    platform_id: str
    platform_name: str
    category: Literal["cms", "analytics", "ads", "crm", "ecommerce"]
    icon_url: str | None
    auth_type: Literal["oauth2", "api_key", "basic", "webhook"]
    supported_modules: list[str]
    status: Literal["active", "beta", "deprecated"]
    is_connected: bool             # tenant bazli

class AdapterDetailResponse(AdapterCatalogResponse):
    config_schema: dict            # credential form JSON schema
    documentation_url: str | None
    max_rate_limit: int | None     # platform'un kendi rate limit'i

class ConnectionStatusResponse(BaseModel):
    uid: UUID
    workspace_uid: UUID
    workspace_name: str
    adapter_platform_id: str
    status: Literal["pending", "connected", "error", "expired"]
    last_health_at: datetime | None
    last_health_ok: bool | None
    latency_ms: int | None
    error_message: str | None
    token_expires_at: datetime | None

class ConnectionTestResult(BaseModel):
    status: Literal["ok", "error", "timeout"]
    latency_ms: int
    platform_name: str
    platform_version: str | None
    error_code: str | None
    error_detail: str | None
    tested_at: datetime

class HealthLogEntry(BaseModel):
    status: Literal["ok", "error", "timeout"]
    latency_ms: int | None
    error_code: str | None
    checked_at: datetime

class ConnectionCreateRequest(BaseModel):
    workspace_uid: UUID
    adapter_uid: UUID
    credentials: dict              # platform'a gore degisken

class ConnectionHealthSummary(BaseModel):
    connection_uid: UUID
    workspace_name: str
    platform_name: str
    platform_icon: str | None
    status: Literal["ok", "error", "timeout", "unknown"]
    uptime_7d: float               # son 7 gun uptime yuzdesi
    avg_latency_ms: int | None
    last_check: datetime | None
```
