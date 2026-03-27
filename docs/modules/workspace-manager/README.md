# Module 05: workspace-manager

> Workspace (yonetilen site) CRUD islemleri, platform secimi, adaptor baglantisi tetikleme ve workspace saglik skoru.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `workspace-manager` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager` |
| Roller | `studio_admin`, `studio_editor` |
| ECharts | HealthScoreGauge (gauge), OnboardingProgress (bar) |

## Amac

`workspace-manager` modulu, tenant'a ait yonetilen sitelerin (workspace) tum yasam dongusunu yonetir.
Bir workspace, atonota platformuna baglanan tek bir web sitesini temsil eder. Her workspace'in
bir platform tipi (WordPress, Shopify, Drupal vb.), bir adaptor baglantisi ve bir saglik skoru vardir.

Bu modul, Intelligence Core API'ye gonderilen tum veri toplama islemlerinin baslangic noktasidir.
Workspace olusturulmadan hicbir zeka modulu calistirilmaz.

## AI Yetenegi

- **Platform oto-tespiti**: Kullanici URL girdiginde, HTTP header analizi + HTML meta tag taramasi
  ile platform otomatik tespit edilir (WordPress, Shopify, Drupal, Magento, Webflow, custom vb.).
  `instructor` ile yapilandirilmis cikti: `{platform: str, confidence: float, version: str | None}`.

- **Workspace saglik skoru**: Tum zeka modullerinden (SEO, icerik, performans, guvenlik) gelen
  metrikleri tek bir 0-100 skora birlestiren agirlikli ortalama. Agirliklar tenant tarafindan
  ayarlanabilir. ECharts gauge widget ile gosterilir.

- **Onboarding checklist**: Yeni workspace icin tamamlanmasi gereken adimlari AI ile onceliklendirir.
  Platform tipine gore dinamik adim listesi olusturur (ornek: WordPress icin "REST API erisimi ac",
  Shopify icin "API key olustur").

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Workspace Listesi | `/workspaces` | Tum workspace'lerin kart/grid gorunumu |
| Workspace Olustur | `/workspaces/create` | URL girisi + platform tespiti + adaptor secimi |
| Workspace Detay | `/workspaces/{uid}` | Tekil workspace ozeti, saglik skoru, adaptor durumu |

## Temel Kurallar

- Her workspace tek bir `tenant_id`'ye aittir (RLS zorunlu).
- Workspace silme soft delete (`deleted_at`) ile yapilir.
- Platform tespiti basarisiz olursa kullanici manuel secer.
- Adaptor baglantisi workspace olusturma sonrasi ayri bir adimda yapilir.
- Saglik skoru her 6 saatte bir Celery task ile guncellenir.
- Workspace UID'si `UUID v7` formatindadir (URL-safe, siralama uyumlu).

## Veri Modeli (Ozet)

```
core.workspaces
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  name            VARCHAR(255) NOT NULL
  url             TEXT NOT NULL
  platform_id     VARCHAR(50) NOT NULL
  platform_version VARCHAR(20)
  health_score    SMALLINT (0-100, nullable)
  status          VARCHAR(20) DEFAULT 'pending'  -- pending | active | paused | error
  onboarding_json JSONB
  favicon_url     TEXT
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, created_at)
  INDEX (tenant_id, status)
  INDEX (url)  -- tekil kontrol icin
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/workspace/
    __init__.py
    routes.py              <- sayfa + API endpoint'leri
    schemas.py             <- WorkspaceCreate, WorkspaceResponse, PlatformDetectResult
  app/models/workspace/
    workspace.py           <- Workspace modeli
  app/services/workspace/
    workspace_service.py   <- CRUD + soft delete
    platform_detector.py   <- URL'den platform tespiti (instructor)
    health_scorer.py       <- agirlikli saglik skoru hesaplama
    onboarding_service.py  <- platform bazli checklist olusturma
  app/tasks/workspace/
    health_refresh.py      <- 6 saatlik saglik skoru guncelleme
    platform_recheck.py    <- platform degisiklik kontrolu
  templates/modules/workspace/
    pages/
      workspace-list.html
      workspace-create.html
      workspace-detail.html
    partials/
      workspace-cards.html
      workspace-grid.html
      workspace-adapters.html
      workspace-health-gauge.html
      onboarding-checklist.html
    components/
      workspace-card.html
      platform-badge.html
      health-score-gauge.html
      create-form.html
```

## Guvenlik Notlari

- URL inputu sanitize edilir (XSS, SSRF korunmasi).
- Platform tespiti icin yapilan HTTP istekleri timeout: 5sn, sadece HEAD + GET.
- Workspace URL'si tenant icinde unique olmalidir.
- Adaptor credential'lari bu modulde saklanmaz (adapter-registry sorumludur).
- Rate limit: workspace olusturma 10 req/dk per tenant.
- Audit log: workspace CRUD islemleri `audit.events` tablosuna yazilir.
