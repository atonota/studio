# Module 07: seo-intelligence — ROUTES

> Tum sayfa ve API endpoint tanimlari. FastAPI server-side routing.
> Bu modul platformun birincil deger modulu oldugu icin en fazla endpoint'e sahiptir.

---

## Sayfa Route'lari (HTML Response)

### GET /seo

```
ENDPOINT   : GET /seo
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/seo-dashboard.html

QUERY PARAMS
  workspace  : UUID (query, optional)        -- workspace filtresi (yoksa tum workspace'ler)

CONTEXT
  radar_data      : SEORadarData             -- 5 boyut: teknik, icerik, backlink, siralama, SERP
  kpi_row         : SEODashboardKPI          -- toplam anahtar kelime, ort. pozisyon, denetim skoru, backlink
  top_issues      : list[AuditIssueResponse] -- en kritik 5 sorun
  movers          : RankingMovers            -- en cok yukselen/dusen 5 anahtar kelime
  recent_scans    : list[AuditScanSummary]   -- son 3 denetim
  workspaces      : list[WorkspaceSummary]   -- workspace filtre dropdown

ACIKLAMA
  SEO ana panosu. 5 boyutlu radar chart merkeze yerlestirilir. KPI satiri ustte.
  Altta: en onemli sorunlar + siralama degisiklikleri yan yana.
```

### GET /seo/keywords

```
ENDPOINT   : GET /seo/keywords
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/keywords.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  intent     : string (query, optional)      -- informational | commercial | transactional | navigational
  cluster_id : int (query, optional)
  q          : string (query, optional)      -- anahtar kelime arama
  sort       : string (query, optional, default: "volume_desc") -- volume_asc | volume_desc | difficulty_asc | ...
  cursor     : string (query, optional)

CONTEXT
  keywords        : list[KeywordResponse]
  total_count     : int
  intent_counts   : dict[str, int]           -- niyet bazli sayilar
  next_cursor     : str | None

ACIKLAMA
  Anahtar kelime listesi. Tablo: anahtar kelime, niyet badge, hacim, zorluk (bar),
  CPC, trend sparkline. Toplu islemler: secili kelimeleri siniflandir, kumele.
```

### GET /seo/keywords/{id}/cluster

```
ENDPOINT   : GET /seo/keywords/{id}/cluster
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/keyword-cluster.html

PATH PARAMS
  id         : int (path, required)          -- cluster_id

CONTEXT
  cluster         : KeywordClusterDetail
  keywords        : list[KeywordResponse]    -- kumedeki anahtar kelimeler
  bubble_data     : BubbleChartData          -- x: hacim, y: zorluk, size: CPC, color: niyet

ERRORS
  404  NOT_FOUND : kume bulunamadi
```

### GET /seo/rankings

```
ENDPOINT   : GET /seo/rankings
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/rankings.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  keyword_ids: string (query, optional)      -- virgul ayirmali keyword ID listesi (max 10)
  range      : string (query, optional, default: "30d")  -- 7d | 30d | 90d
  device     : string (query, optional, default: "desktop") -- desktop | mobile

CONTEXT
  ranking_chart   : RankingChartData         -- coklu cizgi grafik verisi
  heatmap_data    : PositionHeatmapData      -- pozisyon dagilim heatmap
  top_keywords    : list[KeywordRankingSummary]
  movers_up       : list[RankingMover]       -- en cok yukselen
  movers_down     : list[RankingMover]       -- en cok dusen
```

### GET /seo/audit

```
ENDPOINT   : GET /seo/audit
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/site-audit.html

QUERY PARAMS
  workspace  : UUID (query, optional)

CONTEXT
  recent_scans    : list[AuditScanSummary]   -- onceki denetimler
  latest_score    : int | None               -- en son denetim skoru
  workspace_list  : list[WorkspaceSummary]   -- denetim baslatmak icin

ACIKLAMA
  Site denetimi ana sayfasi. Onceki denetimlerin listesi, en son skor,
  "Yeni Denetim Baslat" butonu.
```

### GET /seo/audit/{scan_id}

```
ENDPOINT   : GET /seo/audit/{scan_id}
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/audit-detail.html

PATH PARAMS
  scan_id    : UUID (path, required)

CONTEXT
  scan            : AuditScanDetailResponse
  issues          : list[AuditIssueResponse]  -- kategoriye gore gruplanmis
  score_breakdown : ScoreBreakdown            -- kategori bazli skorlar
  comparison      : AuditComparison | None    -- onceki denetimle karsilastirma

ERRORS
  404  NOT_FOUND : denetim bulunamadi
```

### GET /seo/backlinks

```
ENDPOINT   : GET /seo/backlinks
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/backlinks.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  rel_type   : string (query, optional)      -- follow | nofollow
  is_lost    : boolean (query, optional)
  sort       : string (query, optional, default: "dr_desc")
  cursor     : string (query, optional)

CONTEXT
  backlinks       : list[BacklinkResponse]
  total_count     : int
  ref_domains     : int                      -- benzersiz referring domain sayisi
  domain_chart    : DomainTrendData          -- son 6 ay referring domain trendi
  next_cursor     : str | None
```

### GET /seo/serp

```
ENDPOINT   : GET /seo/serp
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/seo/pages/serp-features.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  feature    : string (query, optional)      -- featured_snippet | paa | local_pack | ...

CONTEXT
  serp_features   : list[SERPFeatureResponse]
  feature_counts  : dict[str, int]           -- ozellik tipi bazli sayilar
  opportunities   : list[SERPOpportunity]    -- kazanilabilir ozellikler
```

---

## Partial Route'lari (HTMX Fragment Response)

### GET /api/v1/partials/seo/keyword-table

```
ENDPOINT   : GET /api/v1/partials/seo/keyword-table
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/keyword-table.html

QUERY PARAMS
  workspace  : UUID (optional)
  intent     : string (optional)
  cluster_id : int (optional)
  q          : string (optional)
  sort       : string (optional, default: "volume_desc")
  cursor     : string (optional)
  limit      : int (optional, default: 25, max: 100)

ACIKLAMA
  Anahtar kelime tablosu partial. Satir: anahtar kelime, IntentBadge,
  hacim, DifficultyBar, CPC, TrendSparkline, checkbox.
```

### GET /api/v1/partials/seo/ranking-chart

```
ENDPOINT   : GET /api/v1/partials/seo/ranking-chart
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/ranking-chart.html

QUERY PARAMS
  workspace   : UUID (optional)
  keyword_ids : string (optional, virgul ayirmali)
  range       : string (optional, default: "30d")
  device      : string (optional, default: "desktop")

ACIKLAMA
  Siralama cizgi grafigi partial. ECharts multi-line chart.
  Her anahtar kelime ayri renkte cizgi. Y-ekseni ters (1 ustte).
```

### GET /api/v1/partials/seo/audit-issues

```
ENDPOINT   : GET /api/v1/partials/seo/audit-issues
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/audit-issues.html

QUERY PARAMS
  scan_id    : UUID (required)
  category   : string (optional)
  severity   : string (optional)
  cursor     : string (optional)

ACIKLAMA
  Denetim sorunlari listesi partial. AuditIssueCard component'leri.
  Her kart: baslik, aciklama, AI oncelik skoru, efor tahmini, cozum onerisi.
```

### GET /api/v1/partials/seo/backlink-table

```
ENDPOINT   : GET /api/v1/partials/seo/backlink-table
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/backlink-table.html

QUERY PARAMS
  workspace  : UUID (optional)
  rel_type   : string (optional)
  is_lost    : boolean (optional)
  sort       : string (optional, default: "dr_desc")
  cursor     : string (optional)
  limit      : int (optional, default: 25, max: 100)

ACIKLAMA
  Backlink tablosu partial. Cursor pagination. Satir: kaynak URL,
  hedef URL, anchor text, rel tipi, domain rating, ilk/son gorulen.
```

### GET /api/v1/partials/seo/serp-features

```
ENDPOINT   : GET /api/v1/partials/seo/serp-features
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/serp-grid.html

QUERY PARAMS
  workspace  : UUID (optional)
  feature    : string (optional)

ACIKLAMA
  SERP ozellik grid partial. Her kart: ozellik tipi, anahtar kelime,
  mevcut URL, firsatlar.
```

### GET /api/v1/partials/seo/cluster-bubble

```
ENDPOINT   : GET /api/v1/partials/seo/cluster-bubble
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/seo/partials/cluster-chart.html

QUERY PARAMS
  workspace  : UUID (optional)

ACIKLAMA
  Konu kumesi bubble chart partial. ECharts scatter chart.
  Tum kumeleri tek gorselde gosterir.
```

---

## API Route'lari (JSON Response)

### POST /api/v1/seo/keywords/classify

```
ENDPOINT   : POST /api/v1/seo/keywords/classify
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 20 req/min per tenant

REQUEST
  keyword_ids : list[int] (body, required, max: 100)

RESPONSE 200
  results     : list[IntentClassification]
    keyword_id  : int
    intent      : "informational" | "commercial" | "transactional" | "navigational"
    confidence  : float (0.0 - 1.0)
    reasoning   : string

ERRORS
  400  EMPTY_LIST        : bos liste gonderildi
  403  FORBIDDEN         : yetki yok
  422  TOO_MANY          : 100'den fazla anahtar kelime
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="seo.keywords.classify", metadata={count: N})
IDEMPOTENT : hayir (LLM ciktisi deterministik degil)

ACIKLAMA
  Secili anahtar kelimelerin arama niyetini `instructor` + LLM ile siniflandirir.
  Celery task olarak asenkron calisir, sonuc dogrudan DB'ye yazilir.
  Partial update tetiklemek icin `HX-Trigger: keywords-classified` header gonderilir.
```

### POST /api/v1/seo/keywords/cluster

```
ENDPOINT   : POST /api/v1/seo/keywords/cluster
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 5 req/min per tenant

REQUEST
  workspace_uid : UUID (body, required)
  min_cluster   : int (body, optional, default: 3)    -- minimum kume buyuklugu

RESPONSE 202
  task_id       : UUID                      -- Celery task ID
  status        : "queued"
  message       : "Kumeleme islemi baslatildi"

ERRORS
  400  NO_KEYWORDS       : workspace'te anahtar kelime yok
  403  FORBIDDEN         : yetki yok
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="seo.keywords.cluster")
IDEMPOTENT : hayir (yeni kume olusturur)

ACIKLAMA
  Workspace'teki tum anahtar kelimelerin embedding'lerini hesaplar (yoksa OpenAI API),
  pgvector cosine similarity ile kume olusturur. Celery task.
  Tamamlandiginda SSE veya polling ile bildirilir.
```

### POST /api/v1/seo/audit/scan

```
ENDPOINT   : POST /api/v1/seo/audit/scan
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 3 req/min per tenant

REQUEST
  workspace_uid : UUID (body, required)
  max_pages     : int (body, optional, default: 100, max: 1000)

RESPONSE 202
  scan_uid      : UUID
  status        : "pending"
  message       : "Denetim tarami baslatildi"

ERRORS
  400  SCAN_RUNNING      : bu workspace icin zaten aktif bir tarama var
  403  FORBIDDEN         : yetki yok
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="seo.audit.scan", resource_id=workspace_uid)
IDEMPOTENT : evet (Idempotency-Key header ile)

SIDE EFFECTS
  - Celery task: audit_scan (async crawler + AI prioritization)
```

### GET /api/v1/seo/audit/{scan_id}/status

```
ENDPOINT   : GET /api/v1/seo/audit/{scan_id}/status
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant

RESPONSE 200
  scan_uid        : UUID
  status          : "pending" | "running" | "completed" | "failed"
  pages_scanned   : int
  total_pages     : int
  overall_score   : int | null
  progress_pct    : int (0-100)
  elapsed_seconds : int

ERRORS
  404  NOT_FOUND : denetim bulunamadi
```

---

## Pydantic Semalari

```python
# schemas.py

class KeywordResponse(BaseModel):
    uid: UUID
    keyword: str
    intent: Literal["informational", "commercial", "transactional", "navigational"] | None
    intent_confidence: float | None
    search_volume: int | None
    difficulty: int | None          # 0-100
    cpc: Decimal | None
    trend_data: list[int] | None    # son 12 ay
    cluster_id: int | None
    cluster_name: str | None
    created_at: datetime

class IntentClassification(BaseModel):
    keyword_id: int
    intent: Literal["informational", "commercial", "transactional", "navigational"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str

class KeywordClusterDetail(BaseModel):
    uid: UUID
    name: str
    summary: str
    keyword_count: int
    avg_volume: int
    avg_difficulty: int
    primary_intent: str

class AuditScanSummary(BaseModel):
    uid: UUID
    status: Literal["pending", "running", "completed", "failed"]
    overall_score: int | None
    total_issues: int | None
    critical_issues: int | None
    pages_scanned: int | None
    completed_at: datetime | None
    created_at: datetime

class AuditIssueResponse(BaseModel):
    id: int
    category: str
    severity: Literal["critical", "warning", "info"]
    title: str
    description: str | None
    affected_url: str | None
    ai_explanation: str | None
    ai_priority: int | None         # 1-10
    ai_effort: Literal["low", "medium", "high"] | None
    ai_suggestion: str | None

class BacklinkResponse(BaseModel):
    source_url: str
    target_url: str
    anchor_text: str | None
    rel_type: Literal["follow", "nofollow", "ugc", "sponsored"] | None
    domain_rating: int | None
    first_seen_at: datetime | None
    last_seen_at: datetime | None
    is_lost: bool

class SERPFeatureResponse(BaseModel):
    keyword: str
    feature_type: str               # featured_snippet | paa | local_pack | image_pack | video | ...
    current_url: str | None         # sitenin bu ozelligi kazanip kazanmadigi
    is_owned: bool
    position: int | None

class KeywordListResponse(BaseModel):
    items: list[KeywordResponse]
    next_cursor: str | None
    total_count: int

class BacklinkListResponse(BaseModel):
    items: list[BacklinkResponse]
    next_cursor: str | None
    total_count: int
    ref_domains: int
```
