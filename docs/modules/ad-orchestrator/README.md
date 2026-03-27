# Module: ad-orchestrator

> Cok kanalli reklam kampanya yonetimi. Google Ads, Meta Ads, Microsoft Ads, TikTok Ads, LinkedIn Ads API entegrasyonlari.
> Kampanya CRUD, butce yonetimi, hedefleme, bid strategy.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `ad-orchestrator` |
| Oncelik | P1 |
| Faz | Faz 8 (Reklam) |
| Bagimlillik | `workspace-manager`, `adapter-registry` |
| Roller | `studio_admin`, `studio_editor`, `studio_analyst` |
| ECharts | SpendAllocationTreemap (treemap), PlatformComparisonBar (bar), BudgetPacingGauge (gauge), CampaignPerformanceLine (line), AudienceOverlapVenn (scatter) |

## Amac

`ad-orchestrator` modulu, atonota platformunun reklam orkestrasyon katmaninin temel modulu olup
cok kanalli reklam kampanya yonetimini tek bir arayuzden saglar. Google Ads, Meta Ads, Microsoft Ads,
TikTok Ads ve LinkedIn Ads API entegrasyonlari uzerinden kampanya olusturma, duzenleme, butce yonetimi,
hedefleme ve teklif stratejisi islemlerini gerceklestirir.

Turkiye pazari icin Trendyol Ads ve Hepsiburada Ads marketplace reklam entegrasyonlari sunarak
hicbir rakipte bulunmayan yerel pazar avantaji saglar.

## AI Yetenekleri

### 1. Cross-Channel Butce Optimizasyonu
- AI, platformlar arasi spend shifting yapar (ROAS/CPA hedefine gore).
- Performans verilerini analiz ederek butceyi en verimli kanala kaydirma onerisi uretir.
- `instructor` + LLM ile butce dagitim plani olusturulur.
- Cikti: `{allocations: list[PlatformAllocation], expected_roas: float, reasoning: str}`

### 2. Performans Anomali Tespiti
- Harcama, CTR, CPC gibi metriklerdeki anormal degisimleri tespit eder ve alert uretir.
- Istatistiksel modeller (z-score, IQR) + LLM aciklama kombinasyonu.
- Gercek zamanli (15-30dk araliklarla) anomali taramasi.
- Cikti: `{anomaly_type: str, metric: str, deviation: float, explanation: str, severity: str}`

### 3. Bid Strategy Onerisi
- Kampanya hedefine gore optimal teklif stratejisi secimi onerisi uretir.
- Platform bazli desteklenen stratejileri analiz eder (Target CPA, Target ROAS, Maximize Conversions vb.).
- Kampanya gecmisi ve rakip benchmark verilerini kullanir.
- Cikti: `{recommended_strategy: str, platform: str, reasoning: str, expected_impact: str}`

### 4. Audience Overlap Analizi
- Platformlar arasi hedef kitle cakismasi tespiti yapar.
- Meta, Google ve LinkedIn kitle segmentlerini karsilastirir.
- Gereksiz harcamayi onlemek icin overlap azaltma onerileri sunar.
- Cikti: `{overlap_pairs: list[OverlapPair], waste_estimate: Decimal, recommendations: list[str]}`

### 5. Creative Fatigue Tespiti
- Reklam kreatiflerin yorgunluk seviyesini tespit eder.
- CTR dusus trendi, frequency artisi ve engagement azalmasini izler.
- Kreativ rotasyon zamanlama onerisi uretir.
- Cikti: `{creative_id: str, fatigue_score: int (0-100), days_active: int, rotation_urgency: str}`

### 6. Turkce Reklam Metin Onerisi
- AI ile Turkce reklam kopyasi iyilestirme onerileri uretir.
- Karakter limitleri (Google: 30/90, Meta: 40/125), Turkce dil bilgisi ve CTA optimizasyonu.
- Onemli not: Platform kreatif URETMEZ (NEVER_BUILD kurali), sadece metin onerisi verir.
- Cikti: `{suggestions: list[AdCopySuggestion], language: "tr", compliance_notes: list[str]}`

## Platform Entegrasyonlari

| Platform | API | Auth | Rate Limit | Write | Webhook |
|----------|-----|------|------------|-------|---------|
| Google Ads | v23.2 gRPC+REST | OAuth 2.0 + Dev Token | 15K ops/gun (basic) | Tam CRUD | Yok |
| Meta Ads | v25.0 REST | OAuth 2.0 (FB Login) | 9K puan (score-based) | Tam CRUD | Var |
| Microsoft Ads | v13 REST | OAuth 2.0 (Azure AD) | Lenient | Tam CRUD + Google Import | Yok |
| TikTok Ads | REST | OAuth 2.0 (24h token) | Per-endpoint | Tam CRUD | Var |
| LinkedIn Ads | REST | OAuth 2.0 (3-legged) | Gunluk limit | Tam CRUD | Yok |
| Trendyol Ads | TBD | TBD | TBD | TBD | TBD |
| Hepsiburada Ads | TBD | TBD | TBD | TBD | TBD |

## Entegrasyon Stratejisi

```
Faz 1: Unified.to middleware (write) + read adaptorleri
Faz 2: Google Ads + Meta direkt API
Faz 3: Top 5-6 direkt, aggregator long-tail
```

- Faz 1'de hizli MVP icin Unified.to uzerinden write islemleri gerceklestirilir, read icin ozel adaptorler yazilir.
- Faz 2'de en yuksek hacimli iki platform (Google Ads, Meta Ads) icin direkt API entegrasyonuna gecilir.
- Faz 3'te LinkedIn, TikTok, Microsoft direkt API'ye tasinir; Trendyol/Hepsiburada gibi long-tail platformlar aggregator uzerinden desteklenir.

## Unified Data Model

```
Organization
  +-- Campaign
       +-- AdGroup
            +-- Ad
                 +-- Creative
                      +-- platform_specific: JSONB
```

- Her seviye `platform_id` ve `external_id` tasiir (platform-agnostik mapping).
- Platform-spesifik alanlar `JSONB` kolonlarinda saklanir (ornegin Google Ads match type, Meta Ads placement).
- Iki yonlu sync: atonota -> platform (push) ve platform -> atonota (pull/webhook).

## Token Management

- Tum platform token'lari `AES-256` ile sifrelenerek saklanir.
- Proaktif token refresh mekanizmasi:
  - TikTok: gunluk refresh (24 saat omur)
  - Meta: 55. gunde refresh (60 gun omur)
  - LinkedIn: 55. gunde refresh (60 gun omur)
  - Google: otomatik refresh (refresh_token ile)
  - Microsoft: otomatik refresh (refresh_token ile)
- Token refresh basarisizliklari alert uretir ve ilgili kampanyalar askiya alinir.

## Queue Architecture

- Platform basina ayri Celery kuyrugu tanimlanir (rate limit izolasyonu).
- Bir platformun rate limit asimi diger platformlarin islemlerini engellemez.

```
celery_queue_google_ads     -> Google Ads API islemleri
celery_queue_meta_ads       -> Meta Ads API islemleri
celery_queue_microsoft_ads  -> Microsoft Ads API islemleri
celery_queue_tiktok_ads     -> TikTok Ads API islemleri
celery_queue_linkedin_ads   -> LinkedIn Ads API islemleri
celery_queue_ads_sync       -> Genel sync ve reconciliation
```

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Reklam Panosu | `/ads` | Cross-platform KPI ozeti, spend allocation treemap, anomali alert'leri |
| Kampanyalar | `/ads/campaigns` | Tum platformlardan birlesmis kampanya listesi, filtre, toplu islem |
| Kampanya Detay | `/ads/campaigns/{id}` | Tekil kampanya metrikleri, ad group'lar, butce gecmisi |
| Kampanya Olustur | `/ads/campaigns/create` | Coklu platform secimi ile kampanya olusturma wizard |
| Platform Baglantilari | `/ads/connections` | Platform OAuth baglantilari, token durumu, sync status |
| Butce Yonetimi | `/ads/budget` | Cross-platform butce dagitimi, AI optimizasyon onerileri |
| Hedef Kitleler | `/ads/audiences` | Platform bazli kitle segmentleri, overlap analizi |

## Veri Modeli (Ozet)

```
ads.platform_connections
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  platform        VARCHAR(30) NOT NULL       -- google_ads | meta_ads | microsoft_ads | tiktok_ads | linkedin_ads
  account_id      VARCHAR(100) NOT NULL      -- platform-spesifik hesap ID
  account_name    VARCHAR(255)
  access_token    BYTEA NOT NULL             -- AES-256 sifrelenmis
  refresh_token   BYTEA
  token_expires_at TIMESTAMPTZ
  status          VARCHAR(20) NOT NULL       -- active | expired | revoked | error
  last_sync_at    TIMESTAMPTZ
  sync_error      TEXT
  metadata        JSONB                      -- platform-spesifik ek bilgiler
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, platform)
  INDEX (tenant_id, status)
  UNIQUE (tenant_id, platform, account_id) WHERE deleted_at IS NULL

ads.campaigns
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  connection_id   BIGINT NOT NULL REFERENCES ads.platform_connections(id)
  external_id     VARCHAR(100)               -- platform tarafindaki kampanya ID
  name            VARCHAR(255) NOT NULL
  platform        VARCHAR(30) NOT NULL
  status          VARCHAR(20) NOT NULL       -- active | paused | draft | ended | error
  campaign_type   VARCHAR(30)                -- search | display | video | shopping | app
  objective       VARCHAR(30)                -- conversions | traffic | awareness | engagement
  daily_budget    DECIMAL(12,2)
  total_budget    DECIMAL(12,2)
  currency        VARCHAR(3) DEFAULT 'TRY'
  bid_strategy    VARCHAR(50)                -- target_cpa | target_roas | maximize_conversions | manual_cpc
  start_date      DATE
  end_date        DATE
  targeting       JSONB                      -- platform-spesifik hedefleme ayarlari
  platform_data   JSONB                      -- platform-spesifik ek alanlar
  last_sync_at    TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, platform)
  INDEX (tenant_id, status)
  INDEX (tenant_id, connection_id)
  INDEX (tenant_id, created_at)

ads.ad_groups
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  campaign_id     BIGINT NOT NULL REFERENCES ads.campaigns(id)
  external_id     VARCHAR(100)
  name            VARCHAR(255) NOT NULL
  status          VARCHAR(20) NOT NULL
  bid_amount      DECIMAL(12,4)
  targeting       JSONB
  platform_data   JSONB
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, campaign_id)

ads.ads
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  ad_group_id     BIGINT NOT NULL REFERENCES ads.ad_groups(id)
  external_id     VARCHAR(100)
  name            VARCHAR(255)
  status          VARCHAR(20) NOT NULL
  ad_type         VARCHAR(30)                -- text | image | video | carousel | responsive
  headlines       JSONB                      -- baslik varyantlari
  descriptions    JSONB                      -- aciklama varyantlari
  final_url       TEXT
  display_url     TEXT
  platform_data   JSONB
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, ad_group_id)

ads.sync_jobs
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  connection_id   BIGINT NOT NULL REFERENCES ads.platform_connections(id)
  job_type        VARCHAR(30) NOT NULL       -- full_sync | incremental | push | pull
  status          VARCHAR(20) NOT NULL       -- pending | running | completed | failed
  entities_synced INTEGER DEFAULT 0
  errors          JSONB
  started_at      TIMESTAMPTZ
  completed_at    TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, connection_id, created_at)
  INDEX (tenant_id, status)

ads.budget_rules
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  name            VARCHAR(255) NOT NULL
  rule_type       VARCHAR(30) NOT NULL       -- shift | cap | scale | alert
  source_platform VARCHAR(30)
  target_platform VARCHAR(30)
  conditions      JSONB NOT NULL             -- tetikleme kosullari
  actions         JSONB NOT NULL             -- uygulanacak aksiyonlar
  is_active       BOOLEAN DEFAULT true
  last_triggered_at TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, is_active)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/ads/
    __init__.py
    routes.py                <- sayfa + API endpoint'leri
    schemas.py               <- CampaignResponse, ConnectionResponse, BudgetRuleResponse
  app/models/ads/
    connection.py            <- PlatformConnection modeli
    campaign.py              <- Campaign, AdGroup, Ad modelleri
    sync_job.py              <- SyncJob modeli
    budget_rule.py           <- BudgetRule modeli
  app/services/ads/
    connection_service.py    <- OAuth baglanti + token yonetimi
    campaign_service.py      <- kampanya CRUD + sync
    budget_service.py        <- butce yonetimi + AI optimizasyon
    audience_service.py      <- hedef kitle analizi + overlap
    anomaly_service.py       <- performans anomali tespiti
    bid_service.py           <- teklif stratejisi onerisi
    creative_fatigue.py      <- kreativ yorgunluk tespiti
    ad_copy_service.py       <- Turkce reklam metin onerisi
    token_manager.py         <- AES-256 token sifreleme + proaktif refresh
  app/services/ads/adapters/
    base.py                  <- AdPlatformAdapter Protocol
    google_ads.py            <- Google Ads API adaptor
    meta_ads.py              <- Meta Ads API adaptor
    microsoft_ads.py         <- Microsoft Ads API adaptor
    tiktok_ads.py            <- TikTok Ads API adaptor
    linkedin_ads.py          <- LinkedIn Ads API adaptor
    unified_adapter.py       <- Unified.to middleware adaptor (Faz 1)
  app/tasks/ads/
    sync_campaigns.py        <- platform -> atonota sync
    push_changes.py          <- atonota -> platform push
    token_refresh.py         <- proaktif token refresh
    anomaly_scan.py          <- periyodik anomali taramasi
    budget_optimization.py   <- AI butce optimizasyon task
  templates/modules/ads/
    pages/
      ads-dashboard.html
      campaigns.html
      campaign-detail.html
      campaign-create.html
      connections.html
      budget.html
      audiences.html
    partials/
      campaign-table.html
      connection-card.html
      budget-allocation.html
      audience-overlap.html
      anomaly-alert.html
      spend-treemap.html
    components/
      campaign-status-badge.html
      platform-icon.html
      budget-gauge.html
      spend-allocation-treemap.html
      platform-comparison-bar.html
      campaign-performance-line.html
```

## Turkiye Pazari Avantaji

- **Turkce UI**: Tam Turkce arayuz, Turkce reklam metin onerileri.
- **TRY butce yonetimi**: Turk Lirasi bazli butce takibi ve raporlama.
- **KVKK uyumu**: Kisisel veri isleme KVKK gereksinimlerine uygun.
- **Trendyol/Hepsiburada Ads**: Turkiye'ye ozel marketplace reklam entegrasyonlari — hicbir global rakipte mevcut degil.
- **Yerel benchmark verisi**: Turkiye pazarina ozel CPC/CPA/ROAS benchmark'lari.

## Stratejik Farklilastiriclar

1. **Cross-platform orkestrasyon**: Tek arayuzden 5+ reklam platformunu yonetme — kucuk/orta isletmeler icin kritik.
2. **AI butce dagitimi**: Platformlar arasi otomatik butce kaydirma, manuel optimizasyon yukunu ortadan kaldirir.
3. **Turkiye marketplace entegrasyonu**: Trendyol/Hepsiburada Ads destegi global rakiplerde yok.
4. **Unified data model**: Platform-agnostik veri katmani, karsilastirmali analizi kolaylastirir.
5. **Proaktif token yonetimi**: Token suresi dolmadan refresh, kesintisiz kampanya yonetimi.

## Temel Kurallar

- Tum reklam verileri `ads` schemasinda saklanir.
- Kampanya ve butce verileri workspace + tenant bazli (RLS zorunlu).
- Platform API cagrilari platform-spesifik Celery kuyruklarinda calisir (rate limit izolasyonu).
- Token'lar AES-256 ile sifrelenmis olarak saklanir (plaintext YASAK).
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Sync verileri append-only log olarak saklanir (audit izlenebilirligi).
- Her platform API hatasi structlog ile loglanir ve Sentry'e raporlanir.

## Guvenlik Notlari

- Tum reklam verileri tenant-scoped (RLS zorunlu).
- Platform OAuth token'lari AES-256 ile sifrelenmis saklanir.
- Token refresh islemleri audit log'a yazilir.
- Platform API cagrilari rate limited (platform bazli + tenant bazli cift katman).
- Kampanya olusturma/duzenleme islemleri Idempotency-Key header zorunlu.
- Butce degisiklikleri cift onay mekanizmasi (gunluk limit asiminda uyari).
- CORS: whitelist only — platform callback URL'leri ayri tanimlanir.
- Audit log: baglanti olustur, kampanya olustur/duzenle/sil, butce degistir islemleri loglanir.
