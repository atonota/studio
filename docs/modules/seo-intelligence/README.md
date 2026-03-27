# Module 07: seo-intelligence

> Anahtar kelime arastirmasi, niyet siniflandirmasi, siralama takibi, site denetimi, backlink analizi ve SERP gorunurlugu.
> **Bu, platformun birincil deger modulu (PRIMARY VALUE MODULE) olup en yuksek oncelikle gelistirilir.**

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `seo-intelligence` |
| Oncelik | P0 — MVP zorunlu · BIRINCIL DEGER MODULU |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager`, `workspace-manager`, `adapter-registry` |
| Roller | `studio_admin`, `studio_editor`, `studio_analyst` |
| ECharts | SEORadarChart (radar), RankingLineChart (line), PositionHeatmap (heatmap), ClusterBubbleChart (scatter/bubble), AuditScoreGauge (gauge), BacklinkTrendChart (line), SERPFeatureChart (pie), RankingForecastChart (line+area) |

## Amac

`seo-intelligence` modulu, atonota platformunun temel deger onerisidir. Bir workspace'e ait
tum SEO metriklerini toplar, analiz eder ve uygulanabilir icgoruler sunar. Teknik SEO denetimi,
anahtar kelime arastirmasi, siralama takibi, backlink profili ve SERP ozellik analizi tek bir
panoda birlestirilir.

Bu modul **analiz uretir, aksiyon icra etmez**. Kullaniciya ne yapmasi gerektigini soyler ama
otomatik degisiklik yapmaz (NEVER_BUILD kurali).

## AI Yetenekleri

### 1. Anahtar Kelime Niyet Siniflandirmasi
- `instructor` + LLM ile anahtar kelimenin arama niyetini siniflandirir.
- Kategoriler: `informational` | `commercial` | `transactional` | `navigational`
- Cikti: `{intent: str, confidence: float, reasoning: str}`
- Toplu siniflandirma destekler (batch: max 100 anahtar kelime).

### 2. Konu Kumeleme (Topic Clustering)
- `pgvector` embedding'leri ile anlam benzerligi hesaplanir.
- Benzer anahtar kelimeler kumelere ayrilir (DBSCAN veya HDBSCAN algoritmasi).
- Her kume icin `instructor` ile kume adi ve ozeti olusturulur.
- Sonuc: ECharts bubble chart (x: arama hacmi, y: zorluk, boyut: kume buyuklugu, renk: niyet).

### 3. Siralama Tahmini (Ranking Forecast)
- Son 90 gunluk siralama verisinden 30/60/90 gunluk tahmin uretir.
- Lineer regresyon + mevsimsellik faktoru.
- Guven araligi ile gosterim (ECharts area chart).
- Onemli not: Tahmin, asil siralama degil trend gostergesidir. Kullaniciya bu uyari gosterilir.

### 4. Teknik SEO Onceliklendirme
- Site denetim sonuclarini LLM ile onceliklendirir.
- Her sorun icin: etki skoru (1-10), cozum onerisi, tahmini efor (dusuk/orta/yuksek).
- Sirasi: etki * (1/efor) formuluyle hesaplanir (kolay+etkili isler once).

### 5. Rekabet Analizi Ozeti
- Benzer sitelerin SERP gorunurluk verilerini karsilastirir.
- LLM ile "kuvvetli yonler / zayif yonler / firsatlar" ozeti olusturur.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| SEO Panosu | `/seo` | 5-boyutlu radar chart, KPI satiri, en onemli sorunlar, siralama degisiklikleri |
| Anahtar Kelimeler | `/seo/keywords` | Anahtar kelime tablosu, niyet badge'leri, toplu islemler |
| Kume Gorunumu | `/seo/keywords/{id}/cluster` | Bubble chart ile konu kumesi detayi |
| Siralamalar | `/seo/rankings` | Coklu anahtar kelime cizgi grafigi, pozisyon dagilim heatmap'i |
| Site Denetimi | `/seo/audit` | Denetim skoru, oncelikli sorun listesi |
| Denetim Detay | `/seo/audit/{scan_id}` | Tekil denetim sonucu detayi |
| Backlink'ler | `/seo/backlinks` | Backlink tablosu, referring domain grafigi |
| SERP Ozellikleri | `/seo/serp` | SERP ozellik analizi (featured snippet, PAA vb.) |

## Temel Kurallar

- Tum SEO verileri `analytics` schemasinda saklanir.
- Anahtar kelime ve siralama verileri workspace + tenant bazli (RLS zorunlu).
- Denetim tarami asenkron Celery task olarak calisir, SSE ile ilerleme bildirilir.
- Embedding'ler `vector` schemasinda `pgvector` ile saklanir (ayri vektor DB yasak).
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Siralama verisi gunluk snapshot olarak saklanir (TimescaleDB hypertable).
- Backlink verisi haftalik snapshot.

## Veri Modeli (Ozet)

```
analytics.keywords
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  keyword         TEXT NOT NULL
  intent          VARCHAR(20)           -- informational | commercial | transactional | navigational
  intent_confidence FLOAT
  search_volume   INTEGER
  difficulty      SMALLINT (0-100)
  cpc             DECIMAL(10,2)
  trend_data      JSONB                 -- son 12 ay arama hacmi trendi
  cluster_id      BIGINT                -- kume referansi
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, keyword)
  INDEX (tenant_id, cluster_id)
  INDEX (tenant_id, intent)

analytics.keyword_clusters
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  name            VARCHAR(255)
  summary         TEXT
  keyword_count   INTEGER
  avg_volume      INTEGER
  avg_difficulty  SMALLINT
  primary_intent  VARCHAR(20)
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, workspace_id)

analytics.rankings (TimescaleDB hypertable)
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  keyword_id      BIGINT NOT NULL
  position        SMALLINT              -- 1-100+, NULL: siralama yok
  url             TEXT                   -- siralanan URL
  search_engine   VARCHAR(10) DEFAULT 'google'
  device          VARCHAR(10) DEFAULT 'desktop'  -- desktop | mobile
  recorded_at     TIMESTAMPTZ NOT NULL   -- snapshot zamani (gunluk)

  INDEX (tenant_id, keyword_id, recorded_at)
  INDEX (tenant_id, workspace_id, recorded_at)

analytics.audit_scans
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  status          VARCHAR(20) NOT NULL   -- pending | running | completed | failed
  overall_score   SMALLINT (0-100)
  total_issues    INTEGER
  critical_issues INTEGER
  pages_scanned   INTEGER
  started_at      TIMESTAMPTZ
  completed_at    TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, workspace_id, created_at)

analytics.audit_issues
  id              BIGSERIAL PRIMARY KEY
  scan_id         BIGINT NOT NULL REFERENCES analytics.audit_scans(id)
  tenant_id       UUID NOT NULL (RLS)
  category        VARCHAR(50) NOT NULL   -- meta | heading | image | link | speed | schema | security
  severity        VARCHAR(10) NOT NULL   -- critical | warning | info
  title           VARCHAR(255) NOT NULL
  description     TEXT
  affected_url    TEXT
  ai_explanation  TEXT                   -- LLM tarafindan uretilmis aciklama
  ai_priority     SMALLINT (1-10)       -- LLM onceliklendirme skoru
  ai_effort       VARCHAR(10)           -- low | medium | high
  ai_suggestion   TEXT                  -- LLM cozum onerisi
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (scan_id, severity)
  INDEX (tenant_id, category)

analytics.backlinks
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  source_url      TEXT NOT NULL
  target_url      TEXT NOT NULL
  anchor_text     TEXT
  rel_type        VARCHAR(20)           -- follow | nofollow | ugc | sponsored
  domain_rating   SMALLINT (0-100)
  first_seen_at   TIMESTAMPTZ
  last_seen_at    TIMESTAMPTZ
  is_lost         BOOLEAN DEFAULT false
  created_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, source_url)
  INDEX (tenant_id, domain_rating)

vector.keyword_embeddings
  id              BIGSERIAL PRIMARY KEY
  keyword_id      BIGINT NOT NULL REFERENCES analytics.keywords(id)
  tenant_id       UUID NOT NULL (RLS)
  embedding       vector(1536)          -- OpenAI text-embedding-3-small
  created_at      TIMESTAMPTZ NOT NULL

  INDEX USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/seo/
    __init__.py
    routes.py                <- sayfa + API endpoint'leri
    schemas.py               <- KeywordResponse, AuditScanResponse, BacklinkResponse
  app/models/seo/
    keyword.py               <- Keyword, KeywordCluster modelleri
    ranking.py               <- Ranking modeli (hypertable)
    audit.py                 <- AuditScan, AuditIssue modelleri
    backlink.py              <- Backlink modeli
    embedding.py             <- KeywordEmbedding modeli (pgvector)
  app/services/seo/
    keyword_service.py       <- CRUD + arama + filtreleme
    intent_classifier.py     <- instructor ile niyet siniflandirmasi
    cluster_service.py       <- pgvector + DBSCAN kumeleme
    ranking_service.py       <- siralama takibi + tahmin
    audit_service.py         <- site denetimi calistirma + sonuc isleme
    audit_prioritizer.py     <- LLM ile sorun onceliklendirme
    backlink_service.py      <- backlink analizi
    serp_service.py          <- SERP ozellik analizi
    competition_service.py   <- rekabet analizi ozeti
  app/tasks/seo/
    daily_ranking.py         <- gunluk siralama snapshot
    weekly_backlink.py       <- haftalik backlink snapshot
    audit_scan.py            <- asenkron denetim tarami
    intent_batch.py          <- toplu niyet siniflandirmasi
    cluster_rebuild.py       <- kume yeniden hesaplama
  templates/modules/seo/
    pages/
      seo-dashboard.html
      keywords.html
      keyword-cluster.html
      rankings.html
      site-audit.html
      audit-detail.html
      backlinks.html
      serp-features.html
    partials/
      keyword-table.html
      ranking-chart.html
      audit-issues.html
      backlink-table.html
      serp-grid.html
      cluster-chart.html
      ranking-forecast.html
      audit-progress.html
    components/
      keyword-table.html
      intent-badge.html
      cluster-bubble-chart.html
      ranking-line-chart.html
      position-heatmap.html
      audit-score-gauge.html
      audit-issue-card.html
      backlink-table.html
      serp-feature-grid.html
      ranking-forecast-chart.html
      keyword-bulk-actions.html
      seo-radar-chart.html
      difficulty-bar.html
      trend-sparkline.html
```

## Guvenlik Notlari

- Tum SEO verileri tenant-scoped (RLS zorunlu).
- LLM API cagrilari rate limited (instructor cagrilari: 20 req/dk per tenant).
- Denetim tarami sadece tenant'in kendi workspace'ine yonelik (SSRF korunmasi).
- Embedding uretimi OpenAI API uzerinden (sentence-transformers YASAK — PyTorch yuku).
- Siralama verisi append-only (guncelleme yok, her gun yeni snapshot).
- Audit log: denetim baslat, toplu siniflandirma gibi islemler loglanir.
