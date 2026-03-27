# tenant-manager — Route Haritasi

> Sayfa, partial ve API endpoint tanimlari.
> FastAPI router: `app/api/v1/modules/tenant_manager/routes.py`

---

## Sayfa Route'lari (HTML)

```
GET  /tenants
  Template  : templates/modules/tenant_manager/pages/tenant-list.html
  Layout    : templates/layouts/shell.html
  Auth      : Bearer JWT (SA — tum tenant'lar, TO — kendi tenant'i)
  Context   : Bos (tablo HTMX ile yuklenir)

NOT: SA icin tum tenant listesi, TO icin tek tenant detayina yonlendirme.
     TO rolu /tenants adresine gelirse /tenants/{kendi_uid} adresine redirect edilir.
```

---

```
GET  /tenants/create
  Template  : templates/modules/tenant_manager/pages/tenant-create.html
  Layout    : templates/layouts/shell.html
  Auth      : Bearer JWT (SA only)
  Context   : Sektor listesi, plan listesi (sihirbaz icin)

ERRORS
  403  FORBIDDEN : sadece SA olusturabilir
```

---

```
GET  /tenants/{uid}
  Template  : templates/modules/tenant_manager/pages/tenant-detail.html
  Layout    : templates/layouts/shell.html
  Auth      : Bearer JWT (SA — herhangi tenant, TO — kendi tenant'i)
  Context   : Tenant temel bilgileri (server-side), tab icerikleri HTMX ile yuklenir
  Tabs      : Genel Bakis | Kullanicilar | Ayarlar

ERRORS
  403  FORBIDDEN   : bu tenant'a erisiniz yok
  404  NOT_FOUND   : tenant bulunamadi
```

---

## API Endpoint'leri (JSON)

```
ENDPOINT   : POST /api/v1/tenants
AUTH       : Bearer JWT (SA only)
RATE       : 5 req/min per user

REQUEST
  name           : string (body, required, min 2, max 255)
  slug           : string (body, optional — bossa name'den uretilir)
  sector         : string (body, optional)
  country        : string (body, optional, ISO 3166-1 alpha-2)
  locale         : string (body, optional, default: "tr")
  plan           : string (body, optional, default: "free")
  owner_email    : string (body, required, email — tenant owner olacak kisi)

RESPONSE 201
  uid            : UUID
  name           : string
  slug           : string
  plan           : string
  health_score   : 0
  created_at     : ISO8601

ERRORS
  400  SLUG_EXISTS       : bu slug zaten kullaniliyor
  400  INVALID_PLAN      : gecersiz plan
  403  FORBIDDEN         : sadece SA olusturabilir
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="tenant.create", resource_id=tenant_uid)
IDEMPOTENT : evet (Idempotency-Key header ile)
```

---

```
ENDPOINT   : PATCH /api/v1/tenants/{uid}
AUTH       : Bearer JWT (SA — herhangi tenant, TO — kendi tenant'i)
RATE       : 10 req/min per user

REQUEST (partial update)
  name           : string (body, optional)
  sector         : string (body, optional)
  country        : string (body, optional)
  locale         : string (body, optional)

RESPONSE 200
  uid            : UUID
  name           : string
  slug           : string
  sector         : string
  updated_at     : ISO8601

ERRORS
  403  FORBIDDEN         : bu tenant'i duzenleme yetkiniz yok
  404  NOT_FOUND         : tenant bulunamadi
  422  VALIDATION_ERROR  : sema hatasi

AUDIT      : audit.events (action="tenant.update", resource_id=tenant_uid, changes)
IDEMPOTENT : evet
```

---

```
ENDPOINT   : DELETE /api/v1/tenants/{uid}
AUTH       : Bearer JWT (SA only)
RATE       : 2 req/min per user

RESPONSE 204

ERRORS
  403  FORBIDDEN         : sadece SA silebilir
  404  NOT_FOUND         : tenant bulunamadi
  409  CONFLICT          : tenant'ta aktif workspace'ler var, once onlari silin

AUDIT      : audit.events (action="tenant.soft_delete", resource_id=tenant_uid)
IDEMPOTENT : evet
NOT        : Soft delete — deleted_at set edilir. 30 gun icinde geri alinabilir.
```

---

```
ENDPOINT   : POST /api/v1/tenants/{uid}/invite
AUTH       : Bearer JWT (SA — herhangi tenant, TO — kendi tenant'i)
RATE       : 10 req/min per tenant

REQUEST
  email    : string (body, required, email format)
  role     : string (body, required: "TO" | "TA" | "AN" | "VW")
  message  : string (body, optional, davet mesaji)

RESPONSE 200
  invitation_uid : UUID
  email          : string
  role           : string
  expires_at     : ISO8601
  status         : "pending"

ERRORS
  400  ALREADY_MEMBER    : bu kullanici zaten tenant'ta
  400  ALREADY_INVITED   : bu e-postaya davet zaten gonderildi
  400  INVALID_ROLE      : gecersiz rol
  403  FORBIDDEN         : davet etme yetkiniz yok
  404  NOT_FOUND         : tenant bulunamadi
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="tenant.invite_user", email, role)
IDEMPOTENT : evet (Idempotency-Key header ile)
```

---

## Partial Endpoint'leri (HTMX)

```
ENDPOINT   : GET /api/v1/partials/tenant-list
AUTH       : Bearer JWT (SA)
RATE       : 20 req/min per user

QUERY
  cursor   : string (optional, cursor-based pagination)
  limit    : int (optional, default: 20, max: 50)
  search   : string (optional, tenant adi arama)
  plan     : string (optional, plan filtresi: "free" | "pro" | "enterprise")
  sort     : string (optional, default: "created_at_desc")

RESPONSE 200
  Content-Type : text/html
  Body         : partials/tenant-table.html
  Icerik       : Tenant tablosu satirlari + pagination kontrolleri
```

---

```
ENDPOINT   : GET /tenants/{uid}/users
AUTH       : Bearer JWT (SA, TO)
RATE       : 20 req/min per user

RESPONSE 200
  Content-Type : text/html
  Body         : partials/tenant-users.html
  Icerik       : Kullanici listesi + davet butonu + bekleyen davetler
```

---

```
ENDPOINT   : GET /tenants/{uid}/settings
AUTH       : Bearer JWT (SA, TO)
RATE       : 10 req/min per user

RESPONSE 200
  Content-Type : text/html
  Body         : partials/tenant-settings.html
  Icerik       : Tenant yapilandirma formu (isim, sektor, ulke, dil, plan)
```

---

```
ENDPOINT   : POST /api/v1/partials/tenant-create-wizard
AUTH       : Bearer JWT (SA)
RATE       : 10 req/min per user

REQUEST (adim bazli form data)
  step     : int (1-4)
  ...      : adima gore alanlar

RESPONSE 200
  Content-Type : text/html
  Body         : create-wizard-step.html (sonraki adim)
  Veya         : tenant-detail.html'e redirect (son adim basarili)
```

---

## Ozet Tablo

| Endpoint | Method | Amac | Auth |
|----------|--------|------|------|
| /tenants | GET | Tenant listesi sayfasi | SA, TO |
| /tenants/create | GET | Olusturma sihirbazi sayfasi | SA |
| /tenants/{uid} | GET | Tenant detay sayfasi | SA, TO |
| /tenants/{uid}/users | GET | Kullanicilar tab (partial) | SA, TO |
| /tenants/{uid}/settings | GET | Ayarlar tab (partial) | SA, TO |
| /api/v1/tenants | POST | Tenant olustur (JSON) | SA |
| /api/v1/tenants/{uid} | PATCH | Tenant guncelle (JSON) | SA, TO |
| /api/v1/tenants/{uid} | DELETE | Tenant sil (JSON) | SA |
| /api/v1/tenants/{uid}/invite | POST | Kullanici davet (JSON) | SA, TO |
| /api/v1/partials/tenant-list | GET | Tablo partial (HTMX) | SA |
| /api/v1/partials/tenant-create-wizard | POST | Sihirbaz adim partial | SA |
