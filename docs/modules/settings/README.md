# Module 09: settings

> Kullanici profili, tenant ayarlari, bildirim tercihleri, API anahtar yonetimi, dil secimi, tema tercihi, webhook yonetimi.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `settings` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager` |
| Roller | `studio_admin`, `studio_editor`, `studio_viewer` (kendi profili) |
| ECharts | Yok |

## Amac

`settings` modulu, Developer Studio kullanicilarinin kisisel tercihlerini, guvenlik ayarlarini
ve tenant capinda yapilandirmalari tek bir arayuzden yonetmesini saglar. Tab-tabanli bir layout
ile her ayar kategorisi ayri bir partial olarak yuklenir.

Modul iki katmanda calisir:
- **Kullanici katmani**: Profil, parola, 2FA, bildirim tercihleri, gorunum — her kullanici
  kendi ayarlarini yonetir.
- **Tenant katmani**: Tenant adi, logo, zaman dilimi, varsayilan dil, webhook endpoint'leri,
  API anahtar yonetimi — yalnizca `studio_admin` ve `tenant_owner` rolleri erisir.

## AI Yetenegi

- **Akilli bildirim onceliklendirme**: Kullanicinin gecmis etkilesim verisine gore hangi
  bildirim kanallarinin en etkili oldugunu onerir. Ornek: "E-posta bildirimlerini hic
  acmiyorsunuz, in-app bildirimlere gecmenizi oneriyoruz."
- **API kullanim analizi**: API anahtarlarinin kullanim pattern'ini analiz eder, kullanilmayan
  anahtarlar icin "son 90 gunde kullanilmadi, silmeyi dusunun" onerisi uretir.
- **Guvenlik skoru**: Kullanicinin guvenlik durusunu degerlendirir (2FA aktif mi, parola
  yasi, aktif oturum sayisi) ve 0-100 arasi bir skor verir.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Ayarlar Ana | `/settings` | Profil sekmesine yonlendirir |
| Profil | `/settings/profile` | Ad, e-posta, avatar, bio |
| Guvenlik | `/settings/security` | Parola degistirme, 2FA, aktif oturumlar |
| Bildirimler | `/settings/notifications` | Kanal x olay tipi matris toggle'lari |
| API Anahtarlari | `/settings/api-keys` | Maskelenmis anahtar listesi, olustur/sil |
| Gorunum | `/settings/appearance` | Tema (dark/light), dil, zaman dilimi |
| Tenant | `/settings/tenant` | Tenant adi, logo, genel yapilandirma (TO/TA only) |
| Webhook'lar | `/settings/webhooks` | Webhook endpoint listesi, test gonder |

## Temel Kurallar

- Profil, guvenlik, bildirim ve gorunum ayarlari kullaniciya ozeldir (`user_id` bazli).
- Tenant ve webhook ayarlari `tenant_id` bazlidir, yalnizca `studio_admin` erisir.
- API anahtarlari olusturuldugunda tam deger yalnizca bir kez gosterilir (modal).
- API anahtari silme soft delete ile yapilir (`deleted_at`).
- Parola degisikligi mevcut parolayi dogrulama gerektirir.
- 2FA aktiflestirildiginde recovery code'lar bir kez gosterilir.
- Tema tercihi `localStorage` + DB sync (sayfa yuklenirken flash onleme).
- Webhook test gonderimleri rate limit'e tabidir (5 req/dk per tenant).

## Veri Modeli (Ozet)

```
core.user_preferences
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  user_id         UUID NOT NULL REFERENCES core.users(uid)
  tenant_id       UUID NOT NULL (RLS)
  theme           VARCHAR(10) DEFAULT 'dark'     -- dark | light | system
  locale          VARCHAR(10) DEFAULT 'tr'       -- tr | en
  timezone        VARCHAR(50) DEFAULT 'Europe/Istanbul'
  notification_prefs  JSONB DEFAULT '{}'
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL

  INDEX (user_id)
  INDEX (tenant_id, user_id)

core.api_keys
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  user_id         UUID NOT NULL
  name            VARCHAR(100) NOT NULL
  prefix          VARCHAR(8) NOT NULL            -- gosterim icin ilk 8 karakter
  key_hash        VARCHAR(255) NOT NULL          -- bcrypt hash
  scopes          TEXT[] DEFAULT '{}'             -- izin verilen scope'lar
  last_used_at    TIMESTAMPTZ
  expires_at      TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, created_at)
  INDEX (prefix)                                  -- arama icin

core.webhooks
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  name            VARCHAR(100) NOT NULL
  url             TEXT NOT NULL
  secret          VARCHAR(255) NOT NULL           -- HMAC signing key
  events          TEXT[] NOT NULL                  -- dinlenen olay tipleri
  is_active       BOOLEAN DEFAULT true
  last_triggered_at TIMESTAMPTZ
  failure_count   SMALLINT DEFAULT 0
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, is_active)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/settings/
    __init__.py
    routes.py              <- sayfa + API endpoint'leri
    schemas.py             <- ProfileUpdate, APIKeyCreate, WebhookCreate
  app/models/settings/
    user_preference.py     <- UserPreference modeli
    api_key.py             <- APIKey modeli
    webhook.py             <- Webhook modeli
  app/services/settings/
    profile_service.py     <- profil CRUD + avatar upload
    security_service.py    <- parola degistirme, 2FA yonetimi
    api_key_service.py     <- anahtar olustur/sil/listele
    webhook_service.py     <- webhook CRUD + test gonderimi
    preference_service.py  <- tema, dil, bildirim tercihleri
    security_scorer.py     <- guvenlik skoru hesaplama
  app/tasks/settings/
    api_key_cleanup.py     <- suresi dolmus anahtarlari soft delete
    webhook_health.py      <- basarisiz webhook'lari devre disi birak
  templates/modules/settings/
    pages/
      settings.html
    partials/
      profile-form.html
      security-form.html
      notification-prefs.html
      api-keys.html
      appearance.html
      tenant-settings.html
      webhook-list.html
    components/
      settings-tabs.html
      avatar-upload.html
      api-key-row.html
      webhook-row.html
      two-factor-setup.html
      session-row.html
      security-score-badge.html
```

## Guvenlik Notlari

- API anahtarlari bcrypt hash ile saklanir, ham deger DB'de tutulmaz.
- Webhook secret'lari AES-256 ile sifrelenir.
- Parola degisikligi mevcut parola dogrulamasi + rate limit (5 req/dk).
- 2FA recovery code'lari tek seferlik gosterilir, hash'lenerek saklanir.
- Tenant ayarlarina yalnizca `studio_admin` ve `tenant_owner` erisir.
- Avatar upload: max 2MB, sadece JPEG/PNG/WebP, S3-compatible storage.
- Webhook URL validasyonu: HTTPS zorunlu (localhost haric dev modda).
- Audit log: API key olusturma/silme, webhook CRUD, parola degisikligi, 2FA toggle.
