# Module 04: tenant-manager

> Tenant CRUD, kullanici davet, rol atama, tenant saglik skoru, olusturma sihirbazi.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `tenant-manager` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Yonetim) |
| Bagimlillik | auth, shell |
| Roller | SA (tam), TO (kendi tenant), TA (sinirli), AN/VW (erisim yok) |
| ECharts | Yok |

## Amac

`tenant-manager` modulu, platformun multi-tenant mimarisinin yonetim arayuzunu saglar.
Tenant olusturma, duzenleme, kullanici davet etme, rol atama ve tenant saglik skoru izleme
bu modulde gerceklesir.

Multi-tenant izolasyon PostgreSQL RLS ile uygulanir. Her tenant'in kendi workspace'leri,
kullanicilari, adapterleri ve verileri vardir. Studio Admin (SA) tum tenant'lari gorur,
Tenant Owner (TO) sadece kendi tenant'ini yonetir.

## AI Yetenegi

- **Tenant Saglik Skoru**: Adapter durumlari + API kullanimi + odeme durumu + kullanici
  aktivitesini birlesik bir skor (0-100) olarak hesaplar. Saglik dusukse otomatik uyari.
- **Onboarding Ilerleme Takibi**: Yeni tenant icin "yapilmasi gerekenler" listesi olusturur.
  Workspace ekleme, adapter baglama, ilk crawl baslатma gibi adimlari izler.
- **Churn Risk Tespiti** (gelecek): Dusuk aktivite, azalan kullanim, geciken odemeleri
  analiz ederek churn riski tahminler.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Tenant Listesi | `/tenants` | Tum tenant'larin listesi (SA) veya kendi tenant'i (TO) |
| Tenant Olustur | `/tenants/create` | Cok adimli olusturma sihirbazi |
| Tenant Detay | `/tenants/{uid}` | Tenant bilgileri, tabli gorunum |
| Kullanicilar Tab | `/tenants/{uid}/users` | Tenant kullanicilari (tab icerigi) |
| Ayarlar Tab | `/tenants/{uid}/settings` | Tenant yapilandirmasi (tab icerigi) |

## Sihirbaz Adimlari (Tenant Olusturma)

```
Adim 1: Temel Bilgiler
  - Tenant adi (zorunlu)
  - Slug (otomatik uretim, duzenlenebilir)
  - Sektor (dropdown)
  - Ulke + dil

Adim 2: Yonetici Hesabi
  - Tenant Owner e-posta
  - Mevcut kullanici mi, yeni davet mi?
  - Rol atama (TO varsayilan)

Adim 3: Plan Secimi
  - Fiyat plani (Free / Pro / Enterprise)
  - Fatura donemi (aylik / yillik)

Adim 4: Onay
  - Ozet ekrani
  - Olustur butonu
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/tenant_manager/
    __init__.py
    routes.py              <- sayfa + partial + API endpoint'ler
    schemas.py             <- Pydantic v2 tenant, invite sema
  app/models/tenant_manager/
    tenant.py              <- Tenant modeli
    tenant_user.py         <- TenantUser pivot modeli
    invitation.py          <- Invitation modeli
  app/services/tenant_manager/
    tenant_service.py      <- Tenant CRUD + validasyon
    invite_service.py      <- Davet gonderme + kabul
    health_score.py        <- AI saglik skoru hesaplama
    onboarding_service.py  <- Onboarding ilerleme izleme
  app/tasks/tenant_manager/
    health_check.py        <- Periyodik saglik skoru hesaplama (Celery Beat)
    invite_reminder.py     <- Bekleyen davetlere hatirlatma
  templates/modules/tenant_manager/
    pages/
      tenant-list.html
      tenant-create.html   <- sihirbaz
      tenant-detail.html   <- tabli detay
    partials/
      tenant-table.html    <- tablo (cursor pagination)
      tenant-users.html    <- kullanicilar tab icerigi
      tenant-settings.html <- ayarlar tab icerigi
      create-wizard-step.html <- sihirbaz adim partial
      invite-modal.html    <- davet modal icerigi
      tenant-health.html   <- saglik skoru badge
    components/
      tenant-row.html      <- tablo satir macro
      health-badge.html    <- saglik skoru badge macro
      role-selector.html   <- rol secici macro
      onboarding-progress.html <- onboarding ilerleme macro
```

## Veritabani Tablolari

```
core.tenants
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  name            VARCHAR(255) NOT NULL
  slug            VARCHAR(100) UNIQUE NOT NULL
  sector          VARCHAR(100)
  country         VARCHAR(2)
  locale          VARCHAR(5)
  plan            VARCHAR(50) DEFAULT 'free'
  health_score    SMALLINT DEFAULT 0
  onboarding_step SMALLINT DEFAULT 0
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  deleted_at      TIMESTAMPTZ

core.tenant_users
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL REFERENCES core.tenants(uid)
  user_id         UUID NOT NULL REFERENCES auth.users(uid)
  role            VARCHAR(10) NOT NULL  -- SA, TO, TA, AN, VW
  invited_by      UUID REFERENCES auth.users(uid)
  joined_at       TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  deleted_at      TIMESTAMPTZ
  UNIQUE(tenant_id, user_id, deleted_at)

core.invitations
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL REFERENCES core.tenants(uid)
  email           VARCHAR(255) NOT NULL
  role            VARCHAR(10) NOT NULL
  token           VARCHAR(255) UNIQUE NOT NULL
  invited_by      UUID NOT NULL REFERENCES auth.users(uid)
  accepted_at     TIMESTAMPTZ
  expires_at      TIMESTAMPTZ NOT NULL
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  deleted_at      TIMESTAMPTZ

RLS: Tum tablolarda tenant_id bazli Row Level Security zorunlu.
Index: (tenant_id, created_at) composite index her tabloda.
```

## Guvenlik Notlari

- SA: Tum tenant'larda tam CRUD
- TO: Sadece kendi tenant'inda CRUD + kullanici yonetimi
- TA: Kendi tenant'inda kullanici goruntuleme (davet edemez)
- AN/VW: tenant-manager modulune erisim yok (403)
- Davet tokeni: cryptographically secure random, 48 saat gecerlilik
- Tenant silme: soft delete (deleted_at), kurtarma 30 gun icinde mumkun
