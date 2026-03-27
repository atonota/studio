# settings — Route Haritasi

> Tum sayfa ve API endpoint tanimlari. FastAPI router: `app/api/v1/modules/settings/routes.py`

---

## Sayfa Route'lari (HTML)

Jinja2 ile render edilen tam sayfa route'lari. Studio layout kullanir (sidebar'li).

```
GET  /settings
  Template  : templates/modules/settings/pages/settings.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller (kendi profili)
  Redirect  : /settings/profile (varsayilan tab)

GET  /settings/profile
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/profile-form.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller
  Not       : Tab aktif: "Profil"

GET  /settings/security
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/security-form.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller
  Not       : Tab aktif: "Guvenlik"

GET  /settings/notifications
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/notification-prefs.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller
  Not       : Tab aktif: "Bildirimler"

GET  /settings/api-keys
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/api-keys.html
  Layout    : templates/layouts/studio.html
  Auth      : studio_admin, studio_editor
  Not       : Tab aktif: "API Anahtarlari"

GET  /settings/appearance
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/appearance.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller
  Not       : Tab aktif: "Gorunum"

GET  /settings/tenant
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/tenant-settings.html
  Layout    : templates/layouts/studio.html
  Auth      : tenant_owner, studio_admin
  Not       : Tab aktif: "Kurum Ayarlari". Yetkisiz kullanici icin tab gorunmez.

GET  /settings/webhooks
  Template  : templates/modules/settings/pages/settings.html
  Partial   : templates/modules/settings/partials/webhook-list.html
  Layout    : templates/layouts/studio.html
  Auth      : studio_admin
  Not       : Tab aktif: "Webhook'lar"
```

---

## HTMX Partial Endpoint'leri

```
GET  /api/v1/partials/settings/profile-form
  Trigger  : Tab tiklamasi (hx-get)
  Response : partials/profile-form.html
  Auth     : Tum roller
  Not      : Mevcut profil verileri form'a doldurulur

PATCH /api/v1/partials/settings/profile
  Trigger  : HTMX form submit (hx-patch)
  Request  : form data (display_name, bio, avatar_url)
  Success  : partials/profile-form.html (basari mesajli)
  Error    : partials/profile-form.html (hata mesajli)
  Auth     : Tum roller (kendi profili)

POST /api/v1/partials/settings/avatar
  Trigger  : Dosya secimi (hx-post, hx-encoding="multipart/form-data")
  Request  : multipart form data (avatar file)
  Success  : components/avatar-upload.html (yeni avatar onizlemeli)
  Error    : components/avatar-upload.html (hata mesajli)
  Auth     : Tum roller
  Limit    : Max 2MB, JPEG/PNG/WebP

GET  /api/v1/partials/settings/security-form
  Trigger  : Tab tiklamasi
  Response : partials/security-form.html
  Auth     : Tum roller

POST /api/v1/partials/settings/password
  Trigger  : HTMX form submit
  Request  : form data (current_password, new_password, confirm_password)
  Success  : partials/security-form.html (basari mesajli)
  Error    : partials/security-form.html (hata mesajli)
  Auth     : Tum roller (kendi profili)

POST /api/v1/partials/settings/2fa/enable
  Trigger  : 2FA toggle butonu
  Response : components/two-factor-setup.html (QR kodu + recovery codes modal)
  Auth     : Tum roller

POST /api/v1/partials/settings/2fa/confirm
  Trigger  : TOTP kodu dogrulama
  Request  : form data (totp_code)
  Success  : partials/security-form.html (2FA aktif gosterimi)
  Error    : components/two-factor-setup.html (hata mesajli)

DELETE /api/v1/partials/settings/2fa
  Trigger  : 2FA devre disi butonu
  Request  : form data (current_password — dogrulama icin)
  Success  : partials/security-form.html (2FA pasif gosterimi)
  Auth     : Tum roller

GET  /api/v1/partials/settings/sessions
  Trigger  : Guvenlik tab'inda sayfa yuklenirken
  Response : partials icindeki oturum listesi blogu
  Auth     : Tum roller

DELETE /api/v1/partials/settings/sessions/{session_id}
  Trigger  : Oturum sonlandir butonu (hx-delete)
  Confirm  : hx-confirm="Bu oturumu sonlandirmak istediginizden emin misiniz?"
  Success  : Satir DOM'dan kaldirilir (hx-swap="outerHTML swap:1s")
  Auth     : Tum roller (kendi oturumu)

GET  /api/v1/partials/settings/notification-prefs
  Trigger  : Tab tiklamasi
  Response : partials/notification-prefs.html
  Auth     : Tum roller

PATCH /api/v1/partials/settings/notification-toggle
  Trigger  : Toggle switch degisikligi (hx-patch)
  Request  : form data (channel, event_type, enabled)
  Response : Guncellenmis toggle HTML fragmenti
  Auth     : Tum roller

GET  /api/v1/partials/settings/api-keys
  Trigger  : Tab tiklamasi
  Response : partials/api-keys.html
  Auth     : studio_admin, studio_editor

POST /api/v1/partials/settings/api-keys
  Trigger  : "Yeni Anahtar Olustur" butonu
  Request  : form data (name, scopes[], expires_in_days)
  Success  : Modal ile tam anahtar gosterimi + guncellenmis liste
  Error    : partials/api-keys.html (hata mesajli)
  Auth     : studio_admin

DELETE /api/v1/partials/settings/api-keys/{uid}
  Trigger  : Sil butonu (hx-delete)
  Confirm  : hx-confirm="API anahtarini silmek istediginizden emin misiniz?"
  Success  : Satir DOM'dan kaldirilir
  Auth     : studio_admin

GET  /api/v1/partials/settings/appearance
  Trigger  : Tab tiklamasi
  Response : partials/appearance.html
  Auth     : Tum roller

PATCH /api/v1/partials/settings/appearance
  Trigger  : Tema/dil/zaman dilimi degisikligi (hx-patch)
  Request  : form data (theme | locale | timezone)
  Success  : partials/appearance.html (guncellenmis)
  Header   : HX-Trigger: theme-changed (tema degistiginde body class guncelle)
  Auth     : Tum roller

GET  /api/v1/partials/settings/tenant
  Trigger  : Tab tiklamasi
  Response : partials/tenant-settings.html
  Auth     : tenant_owner, studio_admin

PATCH /api/v1/partials/settings/tenant
  Trigger  : HTMX form submit
  Request  : form data (tenant_name, logo_url, default_locale, default_timezone)
  Success  : partials/tenant-settings.html (basari mesajli)
  Error    : partials/tenant-settings.html (hata mesajli)
  Auth     : tenant_owner, studio_admin

GET  /api/v1/partials/settings/webhooks
  Trigger  : Tab tiklamasi
  Response : partials/webhook-list.html
  Auth     : studio_admin

POST /api/v1/partials/settings/webhooks
  Trigger  : "Webhook Ekle" butonu
  Request  : form data (name, url, events[])
  Success  : partials/webhook-list.html (yeni satir eklenmis)
  Error    : partials/webhook-list.html (hata mesajli)
  Auth     : studio_admin

DELETE /api/v1/partials/settings/webhooks/{uid}
  Trigger  : Sil butonu (hx-delete)
  Confirm  : hx-confirm
  Success  : Satir DOM'dan kaldirilir
  Auth     : studio_admin

POST /api/v1/partials/settings/webhooks/{uid}/test
  Trigger  : "Test Gonder" butonu (hx-post)
  Response : components/webhook-row.html (test sonucu gosterimli)
  Auth     : studio_admin
  Rate     : 5 req/dk per tenant
```

---

## API Endpoint'leri (JSON)

```
ENDPOINT   : POST /api/v1/settings/profile
AUTH       : Bearer JWT (tum roller, kendi profili)
RATE       : 10 req/min per user

REQUEST
  display_name  : string (body, optional, min 2, max 100)
  bio           : string (body, optional, max 500)
  avatar_url    : string (body, optional, URL format)

RESPONSE 200
  uid            : UUID
  display_name   : string
  email          : string
  bio            : string | null
  avatar_url     : string | null
  updated_at     : ISO8601

ERRORS
  400  INVALID_INPUT     : gecersiz girdi
  401  UNAUTHORIZED      : oturum yok
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="settings.profile_update", actor_id, changes)
IDEMPOTENT : evet (ayni deger tekrar gonderildiginde degisiklik yapmaz)
```

---

```
ENDPOINT   : POST /api/v1/settings/password
AUTH       : Bearer JWT (tum roller, kendi profili)
RATE       : 5 req/min per user

REQUEST
  current_password  : string (body, required)
  new_password      : string (body, required, min 8, complexity rules)

RESPONSE 200
  message  : "Parola basariyla degistirildi"

ERRORS
  400  WRONG_PASSWORD    : mevcut parola hatali
  422  WEAK_PASSWORD     : yeni parola yeterince guclu degil
  422  SAME_PASSWORD     : yeni parola eskisiyle ayni
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="settings.password_change", actor_id)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : POST /api/v1/settings/api-keys
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  name           : string (body, required, min 2, max 100)
  scopes         : string[] (body, optional, default: [])
  expires_in_days : int (body, optional, null = never expires)

RESPONSE 201
  uid            : UUID
  name           : string
  prefix         : string (ilk 8 karakter)
  raw_key        : string (TAM ANAHTAR — yalnizca bu response'da gosterilir)
  scopes         : string[]
  expires_at     : ISO8601 | null
  created_at     : ISO8601

ERRORS
  400  DUPLICATE_NAME    : ayni isimde anahtar mevcut
  403  FORBIDDEN         : yetki yok
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="settings.api_key_create", actor_id, key_prefix)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : DELETE /api/v1/settings/api-keys/{uid}
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  uid  : UUID (path, required)

RESPONSE 204
  (bos govde)

ERRORS
  403  FORBIDDEN    : yetki yok
  404  NOT_FOUND    : anahtar bulunamadi
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : audit.events (action="settings.api_key_delete", actor_id, key_uid)
IDEMPOTENT : evet (zaten silinmisse 204 doner)
```

---

```
ENDPOINT   : POST /api/v1/settings/webhooks
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  name    : string (body, required, min 2, max 100)
  url     : string (body, required, HTTPS URL)
  events  : string[] (body, required, min 1 eleman)

RESPONSE 201
  uid            : UUID
  name           : string
  url            : string
  events         : string[]
  secret         : string (HMAC signing key — yalnizca bu response'da)
  is_active      : true
  created_at     : ISO8601

ERRORS
  400  INVALID_URL       : URL formati hatali veya HTTPS degil
  400  DUPLICATE_URL     : ayni URL'ye kayitli webhook mevcut
  403  FORBIDDEN         : yetki yok
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="settings.webhook_create", actor_id, webhook_uid)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : POST /api/v1/settings/webhooks/{uid}/test
AUTH       : Bearer JWT (studio_admin)
RATE       : 5 req/min per tenant

REQUEST
  uid  : UUID (path, required)

RESPONSE 200
  status         : "success" | "failed"
  http_status    : int (hedef sunucu response kodu)
  response_time  : float (milisaniye)
  error          : string | null

ERRORS
  404  NOT_FOUND    : webhook bulunamadi
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : audit.events (action="settings.webhook_test", actor_id, webhook_uid)
IDEMPOTENT : evet
```
