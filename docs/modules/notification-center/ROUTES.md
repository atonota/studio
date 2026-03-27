# notification-center — Route Haritasi

> Tum sayfa ve API endpoint tanimlari. FastAPI router: `app/api/v1/modules/notification/routes.py`

---

## Sayfa Route'lari (HTML)

Jinja2 ile render edilen tam sayfa route'lari. Studio layout kullanir (sidebar'li).

```
GET  /notifications
  Template  : templates/modules/notification/pages/notification-list.html
  Layout    : templates/layouts/studio.html
  Auth      : Tum roller (kendi bildirimleri)
  Query     : ?type=seo.anomaly&severity=high  (opsiyonel filtre)
  Not       : Varsayilan siralama: created_at DESC

GET  /notifications/rules
  Template  : templates/modules/notification/pages/notification-rules.html
  Layout    : templates/layouts/studio.html
  Auth      : studio_admin, studio_editor
  Not       : Kural listesi, olustur butonu

GET  /notifications/rules/create
  Template  : templates/modules/notification/pages/rule-create.html
  Layout    : templates/layouts/studio.html
  Auth      : studio_admin, studio_editor
  Not       : Kural olusturma formu (kosul builder + aksiyon secimi)
```

---

## SSE Endpoint

```
ENDPOINT   : GET /api/v1/notifications/stream
AUTH       : JWT token (query param: ?token=xxx)
RATE       : 1 baglanti per user (eski baglanti otomatik kapanir)

RESPONSE   : text/event-stream
  event: notification
  data: {
    uid       : UUID,
    type      : string,
    severity  : string,
    title     : string,
    body      : string,
    metadata  : object,
    created_at: ISO8601
  }

  event: badge-update
  data: {
    unread_count: int
  }

  (her 30 sn)
  : keepalive

ERRORS
  401  UNAUTHORIZED     : JWT gecersiz veya suresi dolmus
  429  RATE_LIMITED      : cok fazla baglanti denemesi
```

---

## HTMX Partial Endpoint'leri

```
GET  /api/v1/partials/notification-list
  Trigger  : Sayfa yuklenme + filtre degisikligi + cursor pagination
  Query    : ?type=&severity=&read=&cursor=&limit=20
  Response : partials/notification-cards.html
  Auth     : Tum roller (kendi bildirimleri)
  Not      : Cursor-based pagination, her kart icinde read/unread toggle

GET  /api/v1/partials/notification-dropdown
  Trigger  : Topbar bildirim ikonu tiklamasi (hx-get)
  Response : partials/notification-dropdown.html
  Auth     : Tum roller
  Not      : Son 5 bildirim, "Tumunu Gor" linki, okunmamis sayisi

GET  /api/v1/partials/notification-badge
  Trigger  : hx-trigger="every 30s" (polling) + SSE badge-update eventi
  Response : partials/badge.html
  Auth     : Tum roller
  Not      : Sadece okunmamis sayisi iceren kucuk HTML fragmenti

PATCH /api/v1/partials/notification/{uid}/read
  Trigger  : Bildirim kartinda "okundu isaretle" tiklamasi (hx-patch)
  Response : Guncellenmis bildirim karti HTML (read durumu yansitilmis)
  Auth     : Tum roller (kendi bildirimi)
  Not      : read_at = now() set edilir

POST /api/v1/partials/notification/mark-all-read
  Trigger  : "Tumunu Okundu Isaretle" butonu (hx-post)
  Response : partials/notification-cards.html (tum kartlar okunmus gorunumde)
  Auth     : Tum roller
  Not      : Yalnizca o kullanicinin okunmamis bildirimleri guncellenir

GET  /api/v1/partials/notification-rules
  Trigger  : Kural listesi sayfasi yuklenme
  Response : partials/rule-table.html
  Auth     : studio_admin, studio_editor

POST /api/v1/partials/notification-rules
  Trigger  : Kural olusturma formu submit (hx-post)
  Request  : form data (name, conditions JSON, actions JSON, cooldown)
  Success  : HX-Redirect: /notifications/rules
  Error    : partials/rule-form.html (hata mesajli)
  Auth     : studio_admin, studio_editor

DELETE /api/v1/partials/notification-rules/{uid}
  Trigger  : Kural sil butonu (hx-delete)
  Confirm  : hx-confirm="Bu kurali silmek istediginizden emin misiniz?"
  Success  : Satir DOM'dan kaldirilir (hx-swap="outerHTML swap:500ms")
  Auth     : studio_admin

PATCH /api/v1/partials/notification-rules/{uid}/toggle
  Trigger  : Kural aktif/pasif toggle (hx-patch)
  Response : Guncellenmis kural satiri HTML
  Auth     : studio_admin, studio_editor
```

---

## API Endpoint'leri (JSON)

```
ENDPOINT   : PATCH /api/v1/notifications/{uid}/read
AUTH       : Bearer JWT (tum roller, kendi bildirimi)
RATE       : 60 req/min per user

REQUEST
  uid  : UUID (path, required)

RESPONSE 200
  uid       : UUID
  read_at   : ISO8601

ERRORS
  404  NOT_FOUND    : bildirim bulunamadi
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : yok (okuma islemi audit log'a yazilmaz)
IDEMPOTENT : evet (zaten okunmussa ayni read_at doner)
```

---

```
ENDPOINT   : POST /api/v1/notifications/mark-all-read
AUTH       : Bearer JWT (tum roller)
RATE       : 5 req/min per user

REQUEST
  (bos govde)

RESPONSE 200
  updated_count  : int (guncellenen bildirim sayisi)

ERRORS
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : audit.events (action="notification.mark_all_read", actor_id, count)
IDEMPOTENT : evet (hicbir okunmamis yoksa updated_count=0 doner)
```

---

```
ENDPOINT   : POST /api/v1/notification-rules
AUTH       : Bearer JWT (studio_admin, studio_editor)
RATE       : 10 req/min per tenant

REQUEST
  name             : string (body, required, min 2, max 100)
  description      : string (body, optional, max 500)
  conditions       : array (body, required, min 1 eleman)
    [].metric      : string (required) — "organic_traffic", "keyword_rank", "page_speed", vb.
    [].operator    : string (required) — "gt", "lt", "gte", "lte", "eq", "change_pct"
    [].threshold   : float (required)
    [].window      : string (optional) — "1h", "6h", "24h", "7d" (degerlendirme penceresi)
  actions          : array (body, required, min 1 eleman)
    [].channel     : string (required) — "in_app", "email", "webhook"
    [].config      : object (optional) — kanal bazli yapilandirma
  cooldown_minutes : int (body, optional, default: 60)

RESPONSE 201
  uid              : UUID
  name             : string
  conditions       : array
  actions          : array
  is_active        : true
  cooldown_minutes : int
  created_at       : ISO8601

ERRORS
  400  INVALID_METRIC     : tanimsiz metrik adi
  400  INVALID_OPERATOR   : gecersiz operator
  403  FORBIDDEN          : yetki yok
  422  VALIDATION_ERROR   : sema hatasi
  429  RATE_LIMITED        : rate limit asildi

AUDIT      : audit.events (action="notification.rule_create", actor_id, rule_uid)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : DELETE /api/v1/notification-rules/{uid}
AUTH       : Bearer JWT (studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  uid  : UUID (path, required)

RESPONSE 204
  (bos govde)

ERRORS
  403  FORBIDDEN    : yetki yok
  404  NOT_FOUND    : kural bulunamadi
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : audit.events (action="notification.rule_delete", actor_id, rule_uid)
IDEMPOTENT : evet (zaten silinmisse 204 doner)
```

---

```
ENDPOINT   : GET /api/v1/audit/summary
AUTH       : Bearer JWT (studio_admin)
RATE       : 5 req/min per tenant

REQUEST
  (query params)
  period  : string (optional, default: "24h") — "24h", "7d", "30d"

RESPONSE 200
  period         : string
  summary_text   : string (AI tarafindan olusturulan dogal dil ozeti)
  stats          : object
    total_count  : int
    by_type      : object (tip bazli sayi)
    by_severity  : object (ciddiyet bazli sayi)

ERRORS
  403  FORBIDDEN    : yetki yok
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : yok
IDEMPOTENT : evet (ayni periyot icin cache'lenmis sonuc donebilir)
```
