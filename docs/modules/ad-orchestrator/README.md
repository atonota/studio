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

## Sosyal Medya Reklam Platformlari

### Platform Karsilastirma Tablosu

| Platform | Complexity | Auth | Rate Limit | Token Suresi | MVP Oncelik |
|---|---|---|---|---|---|
| Meta (FB+IG+WhatsApp) | Hard | OAuth 2.0 + System User | Score: 9K pts/300s (Standard) | System User: suresiz; User: 60 gun | #1 |
| TikTok | Medium-Hard | OAuth 2.0 | ~10 QPS (app-level) | Advertiser: suresiz; Creator: 24 saat | #2 |
| LinkedIn | Hard | OAuth 2.0 (RestLi) | Yayinlanmamis; gunluk reset | 60 gun; refresh: 365 gun | #3 |
| Pinterest | Easy-Medium | OAuth 2.0 | 100/s; analytics: 300/min | 30 gun | #4 |
| Snapchat | Medium | OAuth 2.0 | App: 20/s; Token: 10/s | 1 saat (kisa!) | #5 |
| Twitter/X | Medium-Hard | OAuth 1.0a (!) | 15-dk pencere | Oturum bazli | #6 |
| Reddit | Medium | OAuth 2.0 | ~100 QPM (tahmini) | 1 saat | #7 |
| YouTube (Google Ads) | Hard | OAuth 2.0 + gRPC | Token bucket QPS | 1 saat; refresh: uzun omurlu | #8 |

### Kampanya Hiyerarsi Esleme

| Platform | Seviye 1 | Seviye 2 | Seviye 3 | Ozel Fark |
|---|---|---|---|---|
| Meta | Campaign | Ad Set | Ad + Creative | CBO + Advantage+ otomasyon |
| TikTok | Campaign | Ad Group | Ad | Spark Ads + Smart+ moduler |
| LinkedIn | Campaign Group > Campaign | Campaign | Creative | B2B hedefleme; RestLi framework |
| Pinterest | Campaign | Ad Group | Pin Promotion | Organik pin tanitimi; katalog |
| Snapchat | Campaign | Ad Squad | Ad + Creative | AR Lens reklamlari |
| Twitter/X | Campaign | Line Item | Promoted Tweet | Organik tweet tanitimi |
| Reddit | Campaign | Ad Group | Ad | Subreddit hedefleme |
| Google/YouTube | Campaign | Ad Group | Ad | Video kampanyalari API read-only |

### Token Yonetimi Mimarisi

- **Unified Token Management Service**: Tum platform tokenlarini tek bir servis uzerinden yonetir.
  Platform bazli farkli token omurlerini ve yenileme stratejilerini soyutlar.
- **Platform Bazli Token Omurleri**:
  - Meta System User: suresiz (en guvenilir)
  - Meta User Token: 60 gun — 55. gunde proaktif refresh
  - TikTok Advertiser: suresiz; Creator: 24 saat — gunluk refresh
  - LinkedIn: 60 gun; refresh token: 365 gun
  - Pinterest: 30 gun — 25. gunde refresh
  - Snapchat: 1 saat — her 50 dakikada refresh (en agresif)
  - Twitter/X: oturum bazli — her istekte imzalama (OAuth 1.0a)
  - Reddit: 1 saat — her 50 dakikada refresh
  - YouTube/Google: 1 saat; refresh token uzun omurlu
- **Proaktif Refresh Zamanlama**: Celery Beat ile platform bazli refresh schedule.
  Token suresi dolmadan once yenileme islemi tetiklenir. Basarisiz refresh'lerde
  kullaniciya otomatik bildirim gonderilir.
- **AES-256 Sifrelenmis Credential Store**: Tum tokenlar, refresh tokenlar ve
  platform credential'lari AES-256 ile sifrelenmis olarak PostgreSQL'de saklanir.
  Plain text saklama YASAK. Sifreleme anahtari /etc/app/secrets/.env'de tutulur.
- **Redis-Backed Rate Limit Tracking**: Her platform icin ayri Redis counter'lari
  ile rate limit izleme. Sliding window algoritmasi ile platform bazli QPS/QPM
  limitlerine uyum saglanir. Limit asildiginda kuyruga geri itme (backpressure).

### Turkiye Sosyal Medya Pazari

- **58.5M sosyal medya kullanicisi** — Turkiye nufusunun %68'i aktif sosyal medya kullanicisi.
- **Platform penetrasyonu**:
  - Instagram: 58.5M kullanici
  - TikTok: 40.2M kullanici
  - YouTube: 57.5M kullanici
  - WhatsApp: %88.6 penetrasyon (neredeyse her akilli telefonda)
- **$1.5B+ dijital reklam pazari** — yillik %25 YoY buyume ile hizla genisliyor.
- **3.5M+ KOBI** — dijital donusum surecinde reklam yonetim araci arayan isletmeler.
- **Sifir yerel cok platformlu reklam araci** — Turkiye pazarinda Meta+TikTok+LinkedIn+Pinterest
  birlestiren hicbir yerel cozum mevcut degil.
- **Click-to-WhatsApp reklamlari kritik** — WhatsApp'in %88.6 penetrasyonu nedeniyle
  Meta Ads uzerinden Click-to-WhatsApp kampanyalari Turkiye'de en yuksek donusum oranina sahip
  reklam formati. Bu format icin ozel kampanya sablonu ve raporlama gerekli.

### Partner Programlari

| Program | Gereksinim | Fayda | Oncelik |
|---|---|---|---|
| Meta Business Partner | $5K (Member), $2.5M (Badged) | Yuksek rate limit, beta erisim | Zorunlu |
| TikTok Marketing Partner | 1000+ aktif reklamveren | Oncelikli API, beta | Yuksek |
| LinkedIn Marketing Partner | Kalite + kullanici kabulü | Ozel API'ler, yuksek limit | Orta |
| Pinterest Marketing Partner | Ekosistem katkisi | Beta, destek | Dusuk |

### Ucuncu Taraf Aggregator Stratejisi

- **Unified.to**: Tek read-write aggregator ($750-3K/ay), 13+ platform destegi.
  MVP fazinda hizli entegrasyon icin birincil middleware.
- **Supermetrics**: Raporlama + white-label ($29-499/ay). Cross-platform raporlama
  ve musteri raporlari icin veri cekim katmani.
- **Airbyte Embedded**: Acik kaynak ETL. Buyuk olcekli veri aktarimi ve
  warehouse entegrasyonu icin alternatif pipeline.
- **Windsor.ai**: Multi-touch attribution ($19/ay). Kanal bazli atif analizi
  ve ROAS hesaplamasi icin ek veri katmani.

**Fazli Gecis Plani**:

```
Faz 1: Unified.to (hizli MVP) + Supermetrics (raporlama)
       -> Tum platformlara tek API uzerinden erisim
       -> White-label raporlama altyapisi hazir
Faz 2: Direkt API entegrasyonu (Meta, TikTok)
       -> En yuksek hacimli 2 platform icin tam kontrol
       -> Rate limit ve ozellik kisitlamalarindan kurtulma
Faz 3: Tam direkt entegrasyon, aggregator sadece long-tail
       -> Top 5-6 platform direkt API
       -> Aggregator yalnizca dusuk hacimli/nis platformlar icin
```

### MVP Insaat Sirasi

```
1. Ay 1-3:  Meta (FB+IG+WhatsApp) + Raporlama temeli
            -> Click-to-WhatsApp kampanya destegiyle baslangic
            -> Cross-platform raporlama altyapisi
2. Ay 3-5:  TikTok (Smart+, Spark Ads)
            -> Organik icerigi reklama cevirme (Spark Ads)
            -> Smart+ otomatik optimizasyon entegrasyonu
3. Ay 5-7:  LinkedIn (B2B)
            -> RestLi framework adaptoru
            -> B2B hedefleme ve lead gen kampanyalari
4. Ay 7-9:  Pinterest + Snapchat
            -> Katalog entegrasyonu (Pinterest)
            -> AR Lens reklam destegi (Snapchat)
5. Ay 9-12: Reddit + X/Twitter + Kural motoru
            -> Subreddit hedefleme (Reddit)
            -> Cross-platform otomatik kural motoru tamamlama
```

### Rekabet Analizi — Missing Middle

- **Enterprise ($3K+/ay)**: Smartly.io, Sprinklr, Skai — buyuk ajanslara ve enterprise
  sirketlere yonelik. Yuksek fiyat, kompleks onboarding, minimum harcama gereksinimleri.
- **SMB ($39-179/ay)**: Madgicx, Revealbot, AdEspresso — genellikle 1-2 platform
  (cogunlukla sadece Meta). Sinirli cross-platform yetenek.
- **EKSIK SEGMENT**: $99-500/ay arasi cok platformlu yonetim + AI optimizasyon + white-label.
  Bu fiyat araliginda Meta+TikTok+LinkedIn+Pinterest birlestiren, AI destekli butce
  optimizasyonu yapan ve ajanslara white-label sunan hicbir urun mevcut degil.
- **Turkiye'de sifir yerel rakip**: Turkce arayuz, TRY butce yonetimi, KVKK uyumu
  ve Trendyol/Hepsiburada entegrasyonu sunan hicbir reklam yonetim platformu yok.

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
