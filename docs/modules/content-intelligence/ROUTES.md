# Module 08: content-intelligence — ROUTES

> Tum sayfa ve API endpoint tanimlari. FastAPI server-side routing.
> SSE (Server-Sent Events) endpoint'leri AI oneri streaming icin kullanilir.

---

## Sayfa Route'lari (HTML Response)

### GET /content

```
ENDPOINT   : GET /content
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/content-dashboard.html

QUERY PARAMS
  workspace  : UUID (query, optional)

CONTEXT
  avg_score       : float                    -- tum iceriklerin ortalama skoru
  total_pages     : int
  decaying_count  : int                      -- curuyen icerik sayisi
  gap_count       : int                      -- acik bosluk sayisi
  score_distribution: ScoreDistribution      -- 0-40, 40-70, 70-100 aralikta sayilar
  top_decaying    : list[ContentPageSummary]  -- en cok curuyen 5 icerik
  recent_scores   : list[ContentPageSummary]  -- son puanlanan 5 icerik
  workspaces      : list[WorkspaceSummary]

ACIKLAMA
  Icerik zekasi ana panosu. Ortalama skor gauge, curuyen icerik sayisi, bosluk sayisi
  KPI satirinda. Altta: skor dagilimi bari + en cok curuyen icerikler.
```

### GET /content/pages

```
ENDPOINT   : GET /content/pages
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/content-list.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  content_type: string (query, optional)    -- page | post | product | category | landing
  score_min  : int (query, optional)        -- minimum skor filtresi
  score_max  : int (query, optional)        -- maximum skor filtresi
  is_decaying: boolean (query, optional)
  q          : string (query, optional)     -- baslik veya URL arama
  sort       : string (query, optional, default: "score_desc")
  cursor     : string (query, optional)

CONTEXT
  pages           : list[ContentPageResponse]
  total_count     : int
  type_counts     : dict[str, int]
  next_cursor     : str | None

ACIKLAMA
  Tum iceriklerin tablo gorunumu. Satir: baslik, URL, icerik tipi, genel skor
  (renk kodlu bar), kelime sayisi, curus gostergesi, son tarama.
```

### GET /content/pages/{id}

```
ENDPOINT   : GET /content/pages/{id}
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/content-detail.html

PATH PARAMS
  id         : UUID (path, required)

CONTEXT
  page            : ContentPageDetailResponse
  score_breakdown : ScoreBreakdown          -- 6 boyut
  traffic_trend   : TrafficTrendData        -- son 90 gun
  suggestions     : list[ContentSuggestion] -- onceki oneriler
  similar_pages   : list[SimilarPage]       -- embedding benzerligi ile

ERRORS
  404  NOT_FOUND : icerik bulunamadi

ACIKLAMA
  Tekil icerik detay sayfasi. Ustte skor gauge + breakdown radar chart.
  Tab'lar: Genel Bakis, AI Onerileri, Trafik, Benzer Icerikler.
```

### GET /content/gaps

```
ENDPOINT   : GET /content/gaps
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/content-gaps.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  status     : string (query, optional)     -- open | in_progress | covered | dismissed
  sort       : string (query, optional, default: "priority_desc")

CONTEXT
  gaps            : list[ContentGapResponse]
  total_open      : int
  sankey_data     : SankeyChartData         -- konu → alt konu → eksik icerik
  workspaces      : list[WorkspaceSummary]

ACIKLAMA
  Bosluk analizi sayfasi. Sankey diagram ile gorsel akis + tablo gorunumu.
  Her bosluk: konu, alt konu, eksik anahtar kelime, hacim, zorluk, oncelik.
```

### GET /content/decay

```
ENDPOINT   : GET /content/decay
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/content-decay.html

QUERY PARAMS
  workspace  : UUID (query, optional)
  decay_action: string (query, optional)    -- refresh | merge | redirect | remove
  sort       : string (query, optional, default: "risk_desc")
  cursor     : string (query, optional)

CONTEXT
  decaying_pages  : list[DecayingPageResponse]
  total_count     : int
  action_counts   : dict[str, int]
  next_cursor     : str | None

ACIKLAMA
  Curuyen icerikler listesi. Her satir: baslik, URL, trafik trend sparkline,
  curus riski, onerilen aksiyon badge. Son 90 gun trafik trendi mini grafik.
```

### GET /content/semantic-map

```
ENDPOINT   : GET /content/semantic-map
AUTH       : Bearer JWT (studio_admin, studio_editor, studio_analyst)
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/pages/semantic-map.html

QUERY PARAMS
  workspace  : UUID (query, optional)

CONTEXT
  scatter_data    : SemanticScatterData     -- 2D koordinat + metadata
  cluster_labels  : list[ClusterLabel]      -- kume adi + merkez koordinat
  total_pages     : int
  cannibalization_pairs: list[CannibalPair] -- potansiyel kanibalizasyon

ACIKLAMA
  Anlam haritasi sayfasi. 2D scatter plot ile tum icerikler gorsellenir.
  Her nokta bir sayfa. Renk: kume aidiyeti. Boyut: trafik miktari.
  Yakin noktalar kanibalizasyon riski tasiyor olabilir.
```

---

## Partial Route'lari (HTMX Fragment Response)

### GET /api/v1/partials/content/page-table

```
ENDPOINT   : GET /api/v1/partials/content/page-table
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/content/partials/page-table.html

QUERY PARAMS
  workspace  : UUID (optional)
  content_type: string (optional)
  score_min  : int (optional)
  score_max  : int (optional)
  is_decaying: boolean (optional)
  q          : string (optional)
  sort       : string (optional, default: "score_desc")
  cursor     : string (optional)
  limit      : int (optional, default: 25, max: 100)

ACIKLAMA
  Icerik tablosu partial. Cursor pagination. ContentTable component.
```

### GET /api/v1/partials/content/score-detail

```
ENDPOINT   : GET /api/v1/partials/content/score-detail
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/content/partials/score-breakdown.html

QUERY PARAMS
  page_id    : UUID (required)

ACIKLAMA
  Tekil icerik icin skor kirilim partial. 6 boyutlu radar chart + boyut bazli
  aciklamalar + AI ozeti.
```

### GET /api/v1/partials/content/decay-list

```
ENDPOINT   : GET /api/v1/partials/content/decay-list
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/content/partials/decay-list.html

QUERY PARAMS
  workspace  : UUID (optional)
  decay_action: string (optional)
  sort       : string (optional, default: "risk_desc")
  cursor     : string (optional)
  limit      : int (optional, default: 25)

ACIKLAMA
  Curuyen icerik listesi partial. Cursor pagination. DecaySparkline component.
```

### GET /api/v1/partials/content/semantic-scatter

```
ENDPOINT   : GET /api/v1/partials/content/semantic-scatter
AUTH       : Bearer JWT
RATE       : 30 req/min per tenant
TEMPLATE   : templates/modules/content/partials/semantic-chart.html

QUERY PARAMS
  workspace  : UUID (optional)

ACIKLAMA
  Anlam haritasi scatter plot partial. ECharts scatter chart. Buyuk veri setlerinde
  (1000+ sayfa) backend'de down-sampling yapilir.
```

### GET /api/v1/partials/content/gap-report

```
ENDPOINT   : GET /api/v1/partials/content/gap-report
AUTH       : Bearer JWT
RATE       : 60 req/min per tenant
TEMPLATE   : templates/modules/content/partials/gap-report.html

QUERY PARAMS
  workspace  : UUID (optional)
  status     : string (optional)
  sort       : string (optional, default: "priority_desc")

ACIKLAMA
  Bosluk raporu tablo partial. Her satir: konu, alt konu, eksik anahtar kelime,
  hacim, zorluk, oncelik, durum badge.
```

---

## API Route'lari (JSON + SSE Response)

### POST /api/v1/content/score

```
ENDPOINT   : POST /api/v1/content/score
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 15 req/min per tenant

REQUEST
  page_ids   : list[UUID] (body, required, max: 20)

RESPONSE 200
  results    : list[ContentScoreResult]
    page_uid     : UUID
    overall_score: int (0-100)
    readability  : int (0-100)
    seo          : int (0-100)
    intent_match : int (0-100)
    technical    : int (0-100)
    ux           : int (0-100)
    freshness    : int (0-100)
    summary      : string

ERRORS
  400  EMPTY_LIST        : bos liste
  403  FORBIDDEN         : yetki yok
  422  TOO_MANY          : 20'den fazla sayfa
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="content.score", metadata={count: N})
IDEMPOTENT : hayir (LLM ciktisi degisken)

ACIKLAMA
  Secili sayfalarin 6 boyutlu icerik puanlamasini `instructor` ile yapar.
  Her boyut icin LLM analiz yapar, skor ve ozet uretir.
  Sonuc DB'ye yazilir ve guncellenmis tablo partial donus gonderilir.
```

### POST /api/v1/content/suggest

```
ENDPOINT   : POST /api/v1/content/suggest
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 10 req/min per tenant
RESPONSE   : SSE (text/event-stream)

REQUEST
  page_uid   : UUID (body, required)

SSE EVENTS
  event: suggestion
  data: {
      "type": "title",
      "current_value": "Hakkimizda",
      "suggested_value": "Hakkimizda — atonota SEO Platformu",
      "reasoning": "Marka adi ve ana anahtar kelime basliga eklenmeli",
      "impact_score": 8
  }

  event: suggestion
  data: {
      "type": "meta_description",
      "current_value": "",
      "suggested_value": "atonota ile sitenizin SEO performansini...",
      "reasoning": "Meta description eksik...",
      "impact_score": 9
  }

  event: suggestion
  data: {
      "type": "keyword",
      ...
  }

  event: suggestion
  data: {
      "type": "structure",
      ...
  }

  event: suggestion
  data: {
      "type": "schema",
      ...
  }

  event: done
  data: {"total_suggestions": 5, "avg_impact": 7.2}

ERRORS
  404  NOT_FOUND : sayfa bulunamadi
  429  RATE_LIMITED : rate limit asildi

AUDIT      : audit.events (actor_id, action="content.suggest", resource_id=page_uid)

ACIKLAMA
  SSE streaming ile AI iyilestirme onerileri. `sse-starlette` kullanilir.
  Her oneri tipi ayri bir SSE event olarak gonderilir. Frontend `hx-ext="sse"`
  ile dinler ve progressif olarak render eder.
```

### POST /api/v1/content/gaps/analyze

```
ENDPOINT   : POST /api/v1/content/gaps/analyze
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 5 req/min per tenant

REQUEST
  workspace_uid : UUID (body, required)

RESPONSE 202
  task_id       : UUID
  status        : "queued"
  message       : "Bosluk analizi baslatildi"

ERRORS
  400  NO_CONTENT        : workspace'te icerik yok
  400  NO_KEYWORDS       : workspace'te anahtar kelime yok (seo-intelligence bagimliligi)
  403  FORBIDDEN         : yetki yok
  429  RATE_LIMITED      : rate limit asildi

AUDIT      : audit.events (actor_id, action="content.gap_analyze")
IDEMPOTENT : hayir

SIDE EFFECTS
  - Celery task: gap_analysis (mevcut icerik vs hedef anahtar kelimeler karsilastirmasi)
  - Tamamlandiginda Sankey chart verisi olusturulur

ACIKLAMA
  Bosluk analizi Celery task olarak baslatilir. seo-intelligence modulundeki anahtar
  kelime verileri ile mevcut icerikler karsilastirilir. LLM ile konu → alt konu →
  eksik icerik hierarsisi olusturulur. Sonuc `analytics.content_gaps` tablosuna yazilir.
```

---

## Pydantic Semalari

```python
# schemas.py

class ContentPageResponse(BaseModel):
    uid: UUID
    url: str
    title: str | None
    word_count: int | None
    content_type: Literal["page", "post", "product", "category", "landing"] | None
    overall_score: int | None
    is_decaying: bool
    decay_risk: int | None
    last_crawled_at: datetime | None
    published_at: datetime | None

class ContentPageDetailResponse(ContentPageResponse):
    score_readability: int | None
    score_seo: int | None
    score_intent: int | None
    score_technical: int | None
    score_ux: int | None
    score_freshness: int | None
    ai_summary: str | None
    decay_action: Literal["refresh", "merge", "redirect", "remove"] | None

class ContentScoreResult(BaseModel):
    page_uid: UUID
    overall_score: int = Field(..., ge=0, le=100)
    readability: int = Field(..., ge=0, le=100)
    seo: int = Field(..., ge=0, le=100)
    intent_match: int = Field(..., ge=0, le=100)
    technical: int = Field(..., ge=0, le=100)
    ux: int = Field(..., ge=0, le=100)
    freshness: int = Field(..., ge=0, le=100)
    summary: str

class ContentGapResponse(BaseModel):
    uid: UUID
    topic: str
    subtopic: str | None
    missing_keyword: str | None
    search_volume: int | None
    difficulty: int | None
    priority: int         # 1-10
    status: Literal["open", "in_progress", "covered", "dismissed"]

class DecayingPageResponse(ContentPageResponse):
    decay_action: str | None
    traffic_trend: list[int]       # son 12 hafta trafik (sparkline icin)
    traffic_change_pct: float      # son 30 gun degisim yuzdesi

class ContentSuggestion(BaseModel):
    id: int
    suggestion_type: Literal["title", "meta_description", "keyword", "structure", "schema"]
    current_value: str | None
    suggested_value: str
    reasoning: str
    impact_score: int              # 1-10
    status: Literal["pending", "accepted", "dismissed"]

class SimilarPage(BaseModel):
    uid: UUID
    url: str
    title: str | None
    similarity_score: float        # 0.0 - 1.0
    overall_score: int | None

class ContentPageListResponse(BaseModel):
    items: list[ContentPageResponse]
    next_cursor: str | None
    total_count: int

class ScoreBreakdown(BaseModel):
    readability: int
    seo: int
    intent_match: int
    technical: int
    ux: int
    freshness: int
```
