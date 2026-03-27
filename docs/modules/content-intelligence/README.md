# Module 08: content-intelligence

> Icerik puanlama motoru, curus (decay) tespiti, anlam haritasi, bosluk analizi ve AI iyilestirme onerileri.
> **Bu modul SEO Intelligence ile birlikte platformun ikincil deger moduludur.**

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `content-intelligence` |
| Oncelik | P0 — MVP zorunlu · IKINCIL DEGER MODULU |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager`, `workspace-manager`, `adapter-registry`, `seo-intelligence` |
| Roller | `studio_admin`, `studio_editor`, `studio_analyst` |
| ECharts | ContentScoreGauge (gauge), ScoreBreakdownRadar (radar), GapSankeyChart (sankey), DecaySparkline (line-mini), SemanticScatterPlot (scatter) |

## Amac

`content-intelligence` modulu, bir workspace'teki tum iceriklerin (sayfalar, blog yazilari,
urun aciklamalari) kalitesini olcer, curusunu tespit eder ve iyilestirme onerileri sunar.
Her icerik parcasi icin okunabilirlik, SEO uyumu, niyet eslesmesi, teknik yapi ve kullanici
deneyimi boyutlarini birlestiren tek bir skor uretir.

Bu modul `seo-intelligence` ile yakin calısır — anahtar kelime verisi ve siralama bilgisi
oradan alinir. Ancak odak noktasi "sayfa icerigi" dir, "anahtar kelime" degil.

**Analiz uretir, icerik degisikligi yapmaz** (NEVER_BUILD kurali).

## AI Yetenekleri

### 1. Icerik Puanlama (Content Scoring)
- 6 boyutlu skor: okunabilirlik (Flesch-Kincaid TR adaptasyonu), SEO uyumu (meta, baslik, keyword
  yogunlugu), niyet eslesmesi (hedef anahtar kelime niyeti vs icerik tonu), teknik yapi (heading
  hierarsisi, schema markup, internal link), kullanici deneyimi (CLS, LCP metriklerinden), guncellik
  (son guncelleme tarihi + icerik yaslanmasi).
- Cikti: `{overall_score: int, dimensions: dict[str, int], summary: str}`
- `instructor` ile yapilandirilmis LLM ciktisi.

### 2. Curus Tahmini (Decay Prediction)
- Son 90 gunluk trafik verisinden trend analizi yapar.
- Trafik dusus trendi tespit edildginde "curuyor" bayragi kaldirilir.
- Tahmin: 30 gun icinde beklenen trafik degisimi.
- Oneri: yenile, birlestir, yonlendir veya kaldir.
- Risk skoruna gore onceliklendirme.

### 3. Anlam Benzerligi Haritasi (Semantic Map)
- Tum sayfa iceriklerinin embedding'leri `pgvector` ile saklanir (OpenAI text-embedding-3-small).
- 2D scatter plot: t-SNE veya UMAP ile boyut azaltma (Python backend'de hesaplanir).
- Her nokta bir sayfa, renk kume aidiyeti, boyut trafik miktari.
- Yakin noktalar: potansiyel icerik kanibalizasyonu veya birlestirme firsati.

### 4. Bosluk Analizi (Gap Analysis)
- Hedef anahtar kelimeler (seo-intelligence'dan) vs mevcut icerikler karsilastirilir.
- Kapsanmayan konular tespit edilir.
- `instructor` ile "konu → alt konu → eksik icerik" Sankey diagram verisi olusturulur.

### 5. AI Iyilestirme Onerileri (Streaming)
- Tekil sayfa icin LLM tabanli iyilestirme onerileri.
- SSE ile streaming: baslik onerisi, meta description onerisi, anahtar kelime ekleme onerileri,
  icerik yapilandirma onerileri, schema markup onerisi.
- `sse-starlette` ile server-sent events.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Icerik Panosu | `/content` | Ortalama skor, curuyen icerik sayisi, bosluk sayisi |
| Icerik Listesi | `/content/pages` | Tum sayfalarin tablo gorunumu, skor kolonu |
| Icerik Detay | `/content/pages/{id}` | Tekil sayfa skor ayrinti, AI oneri paneli |
| Bosluk Analizi | `/content/gaps` | Sankey diagram: konu → alt konu → eksik |
| Curus Izleme | `/content/decay` | Curuyen iceriklerin listesi, trafik trend |
| Anlam Haritasi | `/content/semantic-map` | 2D scatter plot, kume renkleri |

## Temel Kurallar

- Icerik verileri `analytics` schemasinda saklanir.
- Embedding'ler `vector` schemasinda `pgvector` ile saklanir.
- Icerik puanlama LLM cagirisi gerektirir — rate limit: 15 req/dk per tenant.
- AI oneri streaming SSE ile yapilir (`sse-starlette`, `hx-ext="sse"`).
- Pagination: cursor-based — offset yasak.
- Icerik verisi workspace + tenant bazli (RLS zorunlu).
- Curus tespiti gunluk Celery task ile yapilir.

## Veri Modeli (Ozet)

```
analytics.content_pages
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  url             TEXT NOT NULL
  title           TEXT
  word_count      INTEGER
  content_type    VARCHAR(30)             -- page | post | product | category | landing
  overall_score   SMALLINT (0-100)
  score_readability SMALLINT (0-100)
  score_seo       SMALLINT (0-100)
  score_intent    SMALLINT (0-100)
  score_technical SMALLINT (0-100)
  score_ux        SMALLINT (0-100)
  score_freshness SMALLINT (0-100)
  ai_summary      TEXT                    -- LLM puanlama ozeti
  is_decaying     BOOLEAN DEFAULT false
  decay_risk      SMALLINT (0-100)        -- curus riski
  decay_action    VARCHAR(20)             -- refresh | merge | redirect | remove | null
  last_crawled_at TIMESTAMPTZ
  published_at    TIMESTAMPTZ
  updated_at      TIMESTAMPTZ NOT NULL
  created_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, overall_score)
  INDEX (tenant_id, is_decaying)
  INDEX (tenant_id, content_type)
  INDEX (url)

analytics.content_traffic (TimescaleDB hypertable)
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  content_page_id BIGINT NOT NULL REFERENCES analytics.content_pages(id)
  sessions        INTEGER
  pageviews       INTEGER
  avg_time_on_page FLOAT
  bounce_rate     FLOAT
  recorded_at     TIMESTAMPTZ NOT NULL

  INDEX (content_page_id, recorded_at)
  INDEX (tenant_id, recorded_at)

analytics.content_gaps
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  topic           VARCHAR(255) NOT NULL
  subtopic        VARCHAR(255)
  missing_keyword VARCHAR(255)
  search_volume   INTEGER
  difficulty      SMALLINT
  priority        SMALLINT (1-10)
  status          VARCHAR(20) DEFAULT 'open'   -- open | in_progress | covered | dismissed
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, status)
  INDEX (tenant_id, priority)

analytics.content_suggestions
  id              BIGSERIAL PRIMARY KEY
  content_page_id BIGINT NOT NULL REFERENCES analytics.content_pages(id)
  tenant_id       UUID NOT NULL (RLS)
  suggestion_type VARCHAR(30) NOT NULL         -- title | meta_description | keyword | structure | schema
  current_value   TEXT
  suggested_value TEXT
  reasoning       TEXT
  impact_score    SMALLINT (1-10)
  status          VARCHAR(20) DEFAULT 'pending' -- pending | accepted | dismissed
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (content_page_id, suggestion_type)
  INDEX (tenant_id, status)

vector.content_embeddings
  id              BIGSERIAL PRIMARY KEY
  content_page_id BIGINT NOT NULL REFERENCES analytics.content_pages(id)
  tenant_id       UUID NOT NULL (RLS)
  embedding       vector(1536)                  -- OpenAI text-embedding-3-small
  created_at      TIMESTAMPTZ NOT NULL

  INDEX USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/content/
    __init__.py
    routes.py                <- sayfa + API + SSE endpoint'leri
    schemas.py               <- ContentPageResponse, ContentScoreResult, GapResponse
  app/models/content/
    content_page.py          <- ContentPage modeli
    content_traffic.py       <- ContentTraffic modeli (hypertable)
    content_gap.py           <- ContentGap modeli
    content_suggestion.py    <- ContentSuggestion modeli
    content_embedding.py     <- ContentEmbedding modeli (pgvector)
  app/services/content/
    content_service.py       <- CRUD + arama + filtreleme
    scoring_service.py       <- 6 boyutlu icerik puanlama (instructor)
    decay_service.py         <- curus tespiti + tahmin
    semantic_service.py      <- embedding uretimi + 2D boyut azaltma
    gap_service.py           <- bosluk analizi (instructor)
    suggestion_service.py    <- AI iyilestirme onerileri (SSE streaming)
  app/tasks/content/
    daily_decay_check.py     <- gunluk curus kontrol
    score_recalculate.py     <- periyodik skor guncelleme
    embedding_refresh.py     <- yeni icerikler icin embedding uretimi
    gap_analysis.py          <- bosluk analizi Celery task
  templates/modules/content/
    pages/
      content-dashboard.html
      content-list.html
      content-detail.html
      content-gaps.html
      content-decay.html
      semantic-map.html
    partials/
      page-table.html
      score-breakdown.html
      decay-list.html
      semantic-chart.html
      gap-report.html
      suggestion-stream.html
    components/
      content-score-gauge.html
      score-breakdown-radar.html
      content-table.html
      ai-suggestion-panel.html
      gap-sankey-chart.html
      decay-sparkline.html
      semantic-scatter-plot.html
      schema-markup-preview.html
      content-detail-tabs.html
```

## Guvenlik Notlari

- Tum icerik verileri tenant-scoped (RLS zorunlu).
- LLM cagrilari rate limited: puanlama 15 req/dk, oneri 10 req/dk per tenant.
- SSE baglantisi JWT ile dogrulanir, tenant kontrolu yapilir.
- Embedding uretimi OpenAI API uzerinden (sentence-transformers YASAK).
- Icerik verisi sadece okuma icin toplanir — degisiklik yapilmaz (NEVER_BUILD).
- Audit log: puanlama, bosluk analizi, oneri olusturma islemleri loglanir.
