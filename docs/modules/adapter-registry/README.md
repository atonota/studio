# Module 06: adapter-registry

> 83+ platform adaptor katalogu, baglanti durumu izleme, health check sonuclari ve credential yonetimi.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `adapter-registry` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager`, `workspace-manager` |
| Roller | `studio_admin` |
| ECharts | HealthTimeline (line), LatencyChart (bar), ConnectionHeatmap (heatmap) |

## Amac

`adapter-registry` modulu, atonota'nin destekledigi tum platform adaptorlerinin merkezi
katalogu ve yonetim noktasidir. 83+ web platformu (WordPress, Shopify, Drupal, Magento,
Webflow, Wix, Squarespace, vb.) ve 21 walled garden platformu (Google Analytics, Search Console,
Google Ads, Facebook Ads, vb.) icin adaptor kayitlarini, baglanti durumlarini, credential'lari
ve health check sonuclarini yonetir.

Her adaptor `PlatformAdapter` Protocol'unu (`docs/ADAPTER_CONTRACT.md`) eksiksiz implement eder.
Bu modul adaptorler hakkinda bilgi verir ve baglanti yonetimini saglar — veri toplama islemi
adaptorun kendisine aittir.

## AI Yetenegi

- **Baglanti kopma pattern tespiti**: Son 30 gunluk health check verilerini analiz ederek
  tekrarlayan kopma pattern'lerini tespit eder. Ornek: "Her Sali 03:00-05:00 arasi WordPress
  REST API zaman asimi veriyor — sunucu bakimi olabilir." `instructor` ile yapilandirilmis cikti.

- **Credential suresi uyarisi**: OAuth token'larin, API key'lerin ve sertifikalarin son kullanim
  tarihlerini izler. 7/3/1 gun oncesinden uyari gonderir. Otomatik yenileme mumkun degilse
  kullanici aksiyonu ister.

- **Platform uyumluluk matrisi**: Hangi platformun hangi zeka modulleriyle (SEO, icerik, performans,
  guvenlik) uyumlu oldugunu gosterir. Platform versiyonuna gore uyumluluk kontrol eder.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Adaptor Katalogu | `/adapters` | Tum desteklenen platformlarin grid gorunumu |
| Adaptor Detay | `/adapters/{uid}` | Tekil adaptor saglik gecmisi, latency, credential |
| Adaptor Baglama | `/adapters/connect` | Baglanti sihirbazi (wizard) |
| Saglik Panosu | `/adapters/health` | Toplu health check durumu |

## Temel Kurallar

- Credential'lar sifrelenerek saklanir (AES-256-GCM, key: `/etc/app/secrets/.env`).
- OAuth token refresh otomatik yapilir (Celery task).
- Health check her 5 dakikada bir Celery task ile yapilir.
- Adaptor katalogu tenant-agnostik'tir (tum tenant'lar ayni katalogu gorur).
- Baglanti (connection instance) tenant + workspace bazlidir (RLS zorunlu).
- Credential silme soft delete ile yapilir, audit log'a yazilir.
- Adaptor UID'si `UUID v7` formatindadir.

## Platform Kategorileri

```
CMS & Web Siteleri (83+):
  WordPress, Shopify, Drupal, Magento, Webflow, Wix, Squarespace,
  Joomla, PrestaShop, BigCommerce, Ghost, Hugo, Jekyll, Gatsby,
  Next.js (static export), Nuxt, Contentful, Strapi, Sanity ...

Analitik & Reklam (Walled Garden — 21):
  Google Analytics, Google Search Console, Google Ads,
  Google Tag Manager, Facebook Ads, Instagram Insights,
  LinkedIn Ads, Twitter/X Ads, Pinterest Ads, TikTok Ads,
  Microsoft Ads, Apple Search Ads, Amazon Ads,
  Hotjar, Mixpanel, Amplitude, Segment,
  Mailchimp, Klaviyo, HubSpot (read-only), Salesforce (read-only)
```

## Veri Modeli (Ozet)

```
core.adapters (katalog — tenant-agnostik)
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  platform_id     VARCHAR(50) UNIQUE NOT NULL
  platform_name   VARCHAR(100) NOT NULL
  category        VARCHAR(30) NOT NULL        -- "cms" | "analytics" | "ads" | "crm" | "ecommerce"
  icon_url        TEXT
  auth_type       VARCHAR(20) NOT NULL        -- "oauth2" | "api_key" | "basic" | "webhook"
  config_schema   JSONB NOT NULL              -- credential form'u dinamik olusturmak icin
  supported_modules JSONB                     -- ["seo", "content", "performance", ...]
  status          VARCHAR(20) DEFAULT 'active' -- "active" | "deprecated" | "beta"
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL

  INDEX (platform_id)
  INDEX (category)

core.adapter_connections (tenant-bazli baglanti instance)
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL REFERENCES core.workspaces(id)
  adapter_id      BIGINT NOT NULL REFERENCES core.adapters(id)
  credentials_enc BYTEA                       -- AES-256-GCM sifrelenmis
  status          VARCHAR(20) DEFAULT 'pending' -- pending | connected | error | expired
  last_health_at  TIMESTAMPTZ
  last_health_ok  BOOLEAN
  latency_ms      INTEGER
  error_message   TEXT
  token_expires_at TIMESTAMPTZ               -- OAuth token suresi
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id)
  INDEX (tenant_id, status)
  INDEX (adapter_id)

core.adapter_health_logs (health check gecmisi)
  id              BIGSERIAL PRIMARY KEY
  connection_id   BIGINT NOT NULL REFERENCES core.adapter_connections(id)
  tenant_id       UUID NOT NULL (RLS)
  status          VARCHAR(10) NOT NULL         -- "ok" | "error" | "timeout"
  latency_ms      INTEGER
  error_code      VARCHAR(50)
  error_detail    TEXT
  checked_at      TIMESTAMPTZ NOT NULL

  INDEX (connection_id, checked_at)
  INDEX (tenant_id, checked_at)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/adapter/
    __init__.py
    routes.py              <- sayfa + API endpoint'leri
    schemas.py             <- AdapterCatalogResponse, ConnectionCreate, HealthLog
  app/models/adapter/
    adapter.py             <- Adapter, AdapterConnection, AdapterHealthLog modelleri
  app/services/adapter/
    adapter_service.py     <- katalog CRUD, baglanti yonetimi
    health_checker.py      <- health check calistirma
    credential_manager.py  <- sifreleme / cozumleme / yenileme
    pattern_detector.py    <- AI kopma pattern tespiti (instructor)
    compatibility_service.py <- platform uyumluluk matrisi
  app/tasks/adapter/
    health_check.py        <- 5 dakikalik health check gorevi
    token_refresh.py       <- OAuth token otomatik yenileme
    credential_expiry.py   <- suresi dolacak credential uyarisi
  templates/modules/adapter/
    pages/
      adapter-catalog.html
      adapter-detail.html
      adapter-connect.html
      adapter-health.html
    partials/
      adapter-grid.html
      health-timeline.html
      credential-form.html
      connection-test-result.html
    components/
      adapter-card.html
      health-timeline-chart.html
      latency-chart.html
      credential-form-dynamic.html
      connection-test-button.html
      platform-icon.html
      status-badge.html
```

## Guvenlik Notlari

- Credential'lar AES-256-GCM ile sifrelenir, encryption key `/etc/app/secrets/.env` icindedir.
- OAuth callback URL'leri whitelist'tir (CORS whitelist ile paralel).
- API key'ler loglarda maskelenir (ilk 4 + son 4 karakter haric).
- Health check endpoint'leri dis dunyaya kapalidir.
- Rate limit: adaptor baglama 5 req/dk per tenant, health check manual tetikleme 10 req/dk.
- Audit log: credential CRUD, baglanti kurma/koparma islemleri `audit.events` tablosuna yazilir.
- Credential gorme yetkisi sadece `studio_admin` rolunde.
