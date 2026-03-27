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
| ECharts | SpendAllocationChart (treemap), PlatformCompareChart (bar), BudgetPacingChart (line+area), AudienceOverlapChart (venn/scatter), CreativeFatigueChart (heatmap), CrossChannelFunnelChart (funnel) |

## Amac

`ad-orchestrator` modulu, atonota platformunun cok kanalli reklam orkestrasyon katmanidir.
Google Ads, Meta Ads, Microsoft Ads, TikTok Ads ve LinkedIn Ads basliyor; Trendyol ve
Hepsiburada marketplace reklamlariyla genisler. Kampanya olusturma, duzenleme, butce
yonetimi, hedefleme ve teklif stratejisi islemlerini tek bir arayuzden yonetir.

Platform API'leri uzerinden kampanya CRUD islemleri yapar — kreatif uretimi YAPMAZ
(NEVER_BUILD kurali). AI destekli cross-channel butce optimizasyonu ve performans
anomali tespiti saglar.

## AI Yetenekleri

### 1. Cross-Channel Butce Optimizasyonu
- AI, platformlar arasi spend shifting yapar (ROAS/CPA hedefine gore).
- Gercek zamanli harcama verileriyle butceyi dusuk performansli kanaldan yuksek performansli kanala kaydirma onerisi uretir.
- `instructor` + LLM ile optimizasyon gerekcesi dogal dilde aciklanir.
- Cikti: `{shifts: list[BudgetShift], total_impact: float, reasoning: str}`

### 2. Performans Anomali Tespiti
- Harcama, CTR, CPC, CPA metriklerindeki anormal degisimleri tespit eder ve alert uretir.
- Istatistiksel anomali tespiti (z-score + mevsimsellik faktoru).
- Her anomali icin LLM ile olasi neden analizi ve aksiyon onerisi.
- Cikti: `{metric: str, deviation: float, direction: str, possible_causes: list[str], suggested_actions: list[str]}`

### 3. Bid Strategy Onerisi
- Kampanya hedefine gore optimal teklif stratejisi secimi.
- Platform ve kampanya tipine ozel strateji haritasi (Target CPA, Target ROAS, Maximize Conversions vb.).
- Gecmis performans verilerine dayanarak strateji degisikligi zamanlama onerisi.
- Cikti: `{recommended_strategy: str, confidence: float, reasoning: str, expected_impact: str}`

### 4. Audience Overlap Analizi
- Platformlar arasi hedef kitle cakismasi tespiti.
- Demografi, ilgi alani ve davranis segmentleri uzerinden cross-platform overlap hesaplama.
- Cakisma yuksekse butce israfi uyarisi + kitle ayristirma onerisi.
- Cikti: `{overlap_rate: float, platforms: list[str], recommendation: str}`

### 5. Creative Fatigue Tespiti
- Reklam yorgunlugu tespit eder: CTR dususu + frequency artisi korelasyonu.
- Reklam bazinda yasam dongusu analizi (lansman -> tepe -> dusus fazlari).
- Rotasyon onerisi: hangi reklamlarin durdurulmasi ve yeni kreatif gerektigi.
- Cikti: `{ad_id: str, fatigue_score: int(0-100), phase: str, action: str}`

### 6. Turkce Reklam Metin Onerisi
- AI ile Turkce reklam kopyasi iyilestirme (headline, description).
- Karakter limiti uyumlulugu (platform bazli: Google 30/90, Meta 40/125 vb.).
- Turkce dilbilgisi ve tonlama kontrolu.
- Cikti: `{suggestions: list[AdCopy], quality_score: int(0-100), issues: list[str]}`

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
       -> Hizli MVP, coklu platform destegi
Faz 2: Google Ads + Meta direkt API
       -> En yuksek hacimli platformlarda tam kontrol
Faz 3: Top 5-6 direkt, aggregator long-tail
       -> Performans-kritik platformlar direkt, nicler aggregator uzerinden
```

## Unified Data Model

```
Organization
  +-- Campaign
        +-- AdGroup
              +-- Ad
                    +-- Creative
                          +-- platform_data (JSONB)  <- platform-spesifik alanlar
```

Her seviyede `platform_id`, `external_id` (platform tarafindaki ID) ve `platform_data` (JSONB)
alanlari bulunur. Platform-spesifik ozellikler JSONB icinde saklanir, ortak alanlar
(ad, butce, durum, tarih) normalize edilmis sutunlardadir.

## Token Management

- Tum platform tokenlari AES-256 ile sifrelenmis olarak saklanir.
- Proaktif token refresh stratejisi:
  - TikTok: gunluk (24h token omru)
  - Meta: 55. gunde refresh (60 gun omur)
  - LinkedIn: 55. gunde refresh (60 gun omur)
  - Google: otomatik refresh token (uzun omurlu)
  - Microsoft: otomatik refresh token
- Token durumu health check endpoint'i ile izlenir.
- Suresi gecen tokenlar icin otomatik alert + kullaniciya yeniden yetkilendirme bildirimi.

## Queue Architecture

- Platform basina ayri Celery kuyrugu (rate limit izolasyonu).
- `ads.google`, `ads.meta`, `ads.microsoft`, `ads.tiktok`, `ads.linkedin` kuyruklari.
- Her kuyrukta platform rate limit'ine uygun concurrency ve throttle ayarlari.
- Sync job'lari Celery Beat ile zamanlanir (platform bazli farkli araliklar).

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Reklam Panosu | `/ads` | Cross-platform KPI ozeti, spend allocation treemap, anomali uyarilari |
| Platformlar | `/ads/platforms` | Bagli platform listesi, baglanti durumu, token saglik |
| Platform Bagla | `/ads/platforms/connect` | OAuth akisi, yeni platform ekleme |
| Kampanyalar | `/ads/campaigns` | Tum platformlardaki kampanyalar, filtreleme, toplu islem |
| Kampanya Detay | `/ads/campaigns/{id}` | Tekil kampanya metrikleri, ad group listesi, butce |
| Kampanya Olustur | `/ads/campaigns/create` | Yeni kampanya olusturma (platform secimi, hedefleme, butce) |
| Ad Group Detay | `/ads/campaigns/{id}/groups/{group_id}` | Ad group metrikleri, reklam listesi |
| Butce Yonetimi | `/ads/budget` | Cross-channel butce gorunumu, AI optimizasyon onerileri |
| Audience Manager | `/ads/audiences` | Hedef kitle yonetimi, overlap analizi |

## Veri Modeli (Ozet)

```
ads.platform_connections
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  platform        VARCHAR(30) NOT NULL      -- google | meta | microsoft | tiktok | linkedin
  account_id      VARCHAR(255) NOT NULL     -- platform hesap ID
  account_name    VARCHAR(255)
  encrypted_token BYTEA NOT NULL            -- AES-256 sifreli
  token_expires_at TIMESTAMPTZ
  refresh_token   BYTEA                     -- AES-256 sifreli
  status          VARCHAR(20) NOT NULL      -- active | expired | revoked | error
  last_synced_at  TIMESTAMPTZ
  platform_data   JSONB                     -- platform-spesifik metadata
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, platform)
  INDEX (tenant_id, status)
  UNIQUE (tenant_id, platform, account_id)

ads.campaigns
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  connection_id   BIGINT NOT NULL REFERENCES ads.platform_connections(id)
  external_id     VARCHAR(255) NOT NULL     -- platform tarafindaki kampanya ID
  name            VARCHAR(255) NOT NULL
  status          VARCHAR(20) NOT NULL      -- active | paused | ended | draft | removed
  campaign_type   VARCHAR(30)               -- search | display | video | shopping | app | pmax
  objective       VARCHAR(30)               -- conversions | traffic | awareness | leads
  daily_budget    DECIMAL(12,2)
  total_budget    DECIMAL(12,2)
  currency        VARCHAR(3) DEFAULT 'TRY'
  bid_strategy    VARCHAR(50)               -- target_cpa | target_roas | maximize_conversions | manual_cpc
  start_date      DATE
  end_date        DATE
  platform_data   JSONB                     -- platform-spesifik kampanya ayarlari
  last_synced_at  TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, connection_id)
  INDEX (tenant_id, status)
  INDEX (tenant_id, external_id)

ads.ad_groups
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  campaign_id     BIGINT NOT NULL REFERENCES ads.campaigns(id)
  external_id     VARCHAR(255) NOT NULL
  name            VARCHAR(255) NOT NULL
  status          VARCHAR(20) NOT NULL
  bid_amount      DECIMAL(12,4)
  platform_data   JSONB
  last_synced_at  TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, campaign_id)
  INDEX (tenant_id, external_id)

ads.ads
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  ad_group_id     BIGINT NOT NULL REFERENCES ads.ad_groups(id)
  external_id     VARCHAR(255) NOT NULL
  name            VARCHAR(255)
  ad_type         VARCHAR(30)               -- text | image | video | responsive | carousel
  status          VARCHAR(20) NOT NULL
  headline        TEXT
  description     TEXT
  final_url       TEXT
  platform_data   JSONB                     -- platform-spesifik reklam alanlari
  fatigue_score   SMALLINT                  -- AI hesaplamali (0-100)
  last_synced_at  TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, ad_group_id)
  INDEX (tenant_id, external_id)
  INDEX (tenant_id, fatigue_score)

ads.sync_jobs
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  connection_id   BIGINT NOT NULL REFERENCES ads.platform_connections(id)
  job_type        VARCHAR(30) NOT NULL      -- full_sync | incremental | metrics | budget_update
  status          VARCHAR(20) NOT NULL      -- pending | running | completed | failed
  started_at      TIMESTAMPTZ
  completed_at    TIMESTAMPTZ
  error_message   TEXT
  items_synced    INTEGER DEFAULT 0
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, connection_id, created_at)
  INDEX (tenant_id, status)

ads.budget_rules
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  name            VARCHAR(255) NOT NULL
  rule_type       VARCHAR(30) NOT NULL      -- shift | cap | alert | schedule
  source_platform VARCHAR(30)
  target_platform VARCHAR(30)
  condition_json  JSONB NOT NULL            -- kural kosullari
  action_json     JSONB NOT NULL            -- tetiklenen aksiyon
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
    routes.py                 <- sayfa + API endpoint'leri
    schemas.py                <- CampaignResponse, PlatformConnectionResponse, BudgetRuleResponse
  app/models/ads/
    connection.py             <- PlatformConnection modeli
    campaign.py               <- Campaign modeli
    ad_group.py               <- AdGroup modeli
    ad.py                     <- Ad modeli
    sync_job.py               <- SyncJob modeli
    budget_rule.py            <- BudgetRule modeli
  app/services/ads/
    connection_service.py     <- platform baglanti CRUD + token yonetimi
    campaign_service.py       <- kampanya CRUD + senkronizasyon
    ad_group_service.py       <- ad group CRUD
    ad_service.py             <- reklam CRUD
    sync_service.py           <- platform senkronizasyon orkestrasyonu
    budget_optimizer.py       <- AI cross-channel butce optimizasyonu
    anomaly_detector.py       <- performans anomali tespiti
    bid_advisor.py            <- AI bid strategy onerisi
    audience_analyzer.py      <- audience overlap analizi
    fatigue_detector.py       <- creative fatigue tespiti
    copy_advisor.py           <- Turkce reklam metin onerisi
    token_manager.py          <- AES-256 sifreleme + proaktif refresh
  app/services/ads/adapters/
    base.py                   <- AdPlatformAdapter abstract
    google_adapter.py         <- Google Ads API adaptoru
    meta_adapter.py           <- Meta Ads API adaptoru
    microsoft_adapter.py      <- Microsoft Ads API adaptoru
    tiktok_adapter.py         <- TikTok Ads API adaptoru
    linkedin_adapter.py       <- LinkedIn Ads API adaptoru
    unified_adapter.py        <- Unified.to middleware adaptoru
  app/tasks/ads/
    sync_campaigns.py         <- platform senkronizasyon task'lari
    sync_metrics.py           <- metrik cekim task'lari
    token_refresh.py          <- proaktif token refresh
    anomaly_check.py          <- periyodik anomali tarami
    fatigue_scan.py           <- creative fatigue tarama
  templates/modules/ads/
    pages/
      ads-dashboard.html
      platforms.html
      platform-connect.html
      campaigns.html
      campaign-detail.html
      campaign-create.html
      ad-group-detail.html
      budget-manager.html
      audiences.html
    partials/
      campaign-table.html
      platform-card.html
      budget-treemap.html
      anomaly-alert.html
      spend-chart.html
    components/
      campaign-status-badge.html
      platform-health-indicator.html
      budget-pacing-bar.html
      bid-strategy-selector.html
      audience-overlap-chart.html
      creative-fatigue-gauge.html
      ad-copy-editor.html
```

## Turkiye Pazari Avantaji

- **Turkce UI**: Tam Turkce arayuz ve Turkce reklam metin onerileri.
- **TRY butce yonetimi**: Turk Lirasi bazli butce planlama ve raporlama.
- **KVKK uyumu**: Kisisel Verilerin Korunmasi Kanunu'na uygun veri isleme.
- **Trendyol / Hepsiburada entegrasyonu**: Turkiye'nin en buyuk marketplace'lerinin reklam API'leri — hicbir global rakipte mevcut degil.
- **Yerel marketplace avantaji**: Turkiye e-ticaret pazarinda rakiplerin hicbirinin sunmadigi yerli platform destegiyle genis kapsam.

## Temel Kurallar

- Tum reklam verileri `ads` schemasinda saklanir.
- Kampanya ve platform verileri workspace + tenant bazli (RLS zorunlu).
- Platform senkronizasyonu asenkron Celery task olarak calisir, SSE ile ilerleme bildirilir.
- Token'lar AES-256 ile sifrelenir, plain text saklama YASAK.
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Platform API rate limit'leri platform bazli ayri Celery kuyrugu ile yonetilir.
- Kreatif uretimi YASAK — AI oneri verir, gorsel/video uretmez (NEVER_BUILD kurali).
- Audit log: platform baglama, kampanya olusturma, butce degistirme gibi islemler loglanir.

## Guvenlik Notlari

- Tum reklam verileri tenant-scoped (RLS zorunlu).
- Platform tokenlari AES-256 ile sifrelenmis saklama + proaktif refresh.
- OAuth akislari server-side (client secret asla frontend'e gonderilmez).
- Sync job'lari tenant izolasyonlu (bir tenant baska tenant'in verilerine erisemez).
- LLM API cagrilari rate limited (instructor cagrilari: 20 req/dk per tenant).
- Audit log: tum write islemleri audit.events tablosuna yazilir (append-only).
