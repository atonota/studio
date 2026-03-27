# Module 05: workspace-manager — ROUTES

> Tum sayfa ve API endpoint tanimlari. FastAPI server-side routing.

---

## Sayfa Route'lari (HTML Response)

### GET /workspaces

```
ENDPOINT   : GET /workspaces
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/workspace/pages/workspace-list.html

QUERY PARAMS
  view       : string (query, optional, default: "grid")  -- "grid" | "list"
  status     : string (query, optional)                    -- "active" | "pending" | "paused" | "error"
  platform   : string (query, optional)                    -- platform_id filtresi
  q          : string (query, optional)                    -- ad veya URL arama

CONTEXT
  workspaces      : list[WorkspaceResponse]
  total_count     : int
  platforms       : list[PlatformSummary]    -- filtre dropdown icin
  current_view    : "grid" | "list"
  cursor          : str | None               -- sonraki sayfa cursor

ACIKLAMA
  Tenant'a ait tum workspace'leri listeler. Default gorunum grid (kart) formati.
  Liste gorunumune Alpine.js ile gecis yapilir (server-side degil).
  Ilk yukleme full page, sonraki sayfalama HTMX partial ile.
```

### GET /workspaces/create

```
ENDPOINT   : GET /workspaces/create
AUTH       : Bearer JWT (studio_admin)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/workspace/pages/workspace-create.html

CONTEXT
  platforms       : list[PlatformOption]     -- desteklenen platform listesi
  recent_urls     : list[str]               -- son 5 eklenen URL (oneri icin)

ACIKLAMA
  Yeni workspace olusturma formu. URL alanina yazildiginda blur event ile
  platform oto-tespiti tetiklenir (HTMX hx-post).
```

### GET /workspaces/{uid}

```
ENDPOINT   : GET /workspaces/{uid}
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/workspace/pages/workspace-detail.html

PATH PARAMS
  uid        : UUID (path, required)

CONTEXT
  workspace       : WorkspaceDetailResponse
  adapters        : list[AdapterStatusResponse]
  health_history  : list[HealthScoreEntry]   -- son 30 gun
  onboarding      : OnboardingChecklist | None
  recent_events   : list[AuditEvent]         -- son 10 islem

ERRORS
  404  NOT_FOUND         : workspace bulunamadi
  403  FORBIDDEN         : baska tenant'a ait
```

---

## Partial Route'lari (HTMX Fragment Response)

### GET /api/v1/partials/workspace-list

```
ENDPOINT   : GET /api/v1/partials/workspace-list
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/workspace/partials/workspace-cards.html

QUERY PARAMS
  cursor     : string (query, optional)      -- cursor-based pagination
  limit      : int (query, optional, default: 12, max: 50)
  status     : string (query, optional)
  platform   : string (query, optional)
  q          : string (query, optional)

RESPONSE HEADERS
  HX-Trigger : workspace-count-updated       -- toplam sayi guncelleme icin

ACIKLAMA
  Workspace kartlarini partial HTML olarak doner. Infinite scroll veya
  "Daha Fazla Yukle" butonu ile tetiklenir. Her kart: favicon, site adi,
  URL, platform badge, saglik skoru, durum badge icerir.
```

### GET /api/v1/partials/workspace-grid

```
ENDPOINT   : GET /api/v1/partials/workspace-grid
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/workspace/partials/workspace-grid.html

QUERY PARAMS
  (workspace-list ile ayni)

ACIKLAMA
  Tablo (list) gorunumu icin partial. Satir bazli: ad, URL, platform,
  saglik skoru, durum, son guncelleme, aksiyonlar.
```

### GET /workspaces/{uid}/adapters

```
ENDPOINT   : GET /workspaces/{uid}/adapters
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/workspace/partials/workspace-adapters.html

PATH PARAMS
  uid        : UUID (path, required)

ACIKLAMA
  Workspace'e bagli adaptorlerin durum listesi. Her adaptor icin:
  platform ikonu, baglanti durumu (connected/disconnected/error),
  son health check zamani, "Baglan" veya "Yeniden Dene" butonu.
```

---

## API Route'lari (JSON Response)

### POST /api/v1/workspaces

```
ENDPOINT   : POST /api/v1/workspaces
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  name       : string (body, required, max: 255)
  url        : string (body, required, valid URL format)
  platform_id: string (body, required)       -- "wordpress" | "shopify" | "drupal" | ...
  platform_version: string (body, optional)

RESPONSE 201
  uid             : UUID
  name            : string
  url             : string
  platform_id     : string
  status          : "pending"
  health_score    : null
  created_at      : ISO8601

ERRORS
  400  INVALID_URL       : gecersiz URL formati
  403  FORBIDDEN         : yetki yok
  409  DUPLICATE_URL     : bu URL zaten kayitli
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="workspace.create", resource_id=uid)
IDEMPOTENT : evet (Idempotency-Key header ile)

SIDE EFFECTS
  - Celery task: platform_recheck (5sn delay ile)
  - Celery task: onboarding_generate (platform_id'ye gore)
```

### POST /api/v1/workspaces/detect-platform

```
ENDPOINT   : POST /api/v1/workspaces/detect-platform
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 20 req/min per tenant

REQUEST
  url        : string (body, required, valid URL format)

RESPONSE 200
  platform_id     : string              -- "wordpress" | "shopify" | "unknown"
  platform_name   : string              -- "WordPress" | "Shopify" | "Bilinmeyen"
  confidence      : float (0.0 - 1.0)
  version         : string | null       -- "6.4.2" gibi
  detected_signals: list[string]        -- ["wp-content path", "X-Powered-By header"]
  icon_url        : string | null       -- platform ikonu CDN URL

ERRORS
  400  INVALID_URL       : gecersiz URL formati
  408  TIMEOUT           : site erisim zaman asimi (5sn)
  422  UNREACHABLE       : site erisilemedi
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : yok (okuma islemi)
IDEMPOTENT : dogasi geregi (GET semantigi, POST cunku body var)

ACIKLAMA
  URL'ye HEAD + GET istegi gonderir. Response header'lari (X-Powered-By,
  X-Generator, Server), HTML meta tag'leri (generator), bilinen path'ler
  (/wp-admin, /wp-content, /cdn.shopify.com vb.) ve favicon analizi ile
  platformu tespit eder. Sonuc `instructor` ile yapilandirilmis LLM
  ciktisi olarak doner.
```

---

## Pydantic Semalari

```python
# schemas.py

class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    url: HttpUrl
    platform_id: str = Field(..., min_length=1, max_length=50)
    platform_version: str | None = Field(None, max_length=20)

class WorkspaceResponse(BaseModel):
    uid: UUID
    name: str
    url: str
    platform_id: str
    platform_version: str | None
    health_score: int | None
    status: Literal["pending", "active", "paused", "error"]
    favicon_url: str | None
    created_at: datetime
    updated_at: datetime

class WorkspaceDetailResponse(WorkspaceResponse):
    onboarding_json: dict | None
    adapter_count: int
    active_adapter_count: int

class PlatformDetectRequest(BaseModel):
    url: HttpUrl

class PlatformDetectResult(BaseModel):
    platform_id: str
    platform_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    version: str | None
    detected_signals: list[str]
    icon_url: str | None

class WorkspaceListResponse(BaseModel):
    items: list[WorkspaceResponse]
    next_cursor: str | None
    total_count: int
```
