# shell — Route Haritasi

> Shell modulu sayfa route'u icermez — partial endpoint'ler saglar.
> Tum partial'lar authenticated kullanici gerektirir.

---

## Partial Endpoint'leri (HTMX)

```
ENDPOINT   : GET /api/v1/partials/shell/sidebar-nav
AUTH       : Bearer JWT (tum roller)
RATE       : 30 req/min per user

RESPONSE 200
  Content-Type : text/html
  Body         : sidebar-nav.html partial
  Icerik       : Rol bazli filtrelenmis navigasyon menusu

CACHE      : 5 dk (kullanici + rol bazli ETag)
NOT        : Sayfa yukleme sirasinda shell layout icinden hx-get ile cagirilir.
             Rol degisirse (ornegin SA tenant'a gecis yaparsa) yeniden cekilir.
```

---

```
ENDPOINT   : GET /api/v1/partials/shell/workspace-selector
AUTH       : Bearer JWT (SA, TO, TA)
RATE       : 10 req/min per user

QUERY
  search   : string (optional, workspace arama)

RESPONSE 200
  Content-Type : text/html
  Body         : workspace-selector.html partial
  Icerik       : Erisim yetkisi olan workspace listesi, aktif workspace isaretli

NOT        : Dropdown acildiginda hx-get ile yukler. Arama yaparken
             hx-trigger="keyup changed delay:300ms" ile filtreleme yapar.
```

---

```
ENDPOINT   : POST /api/v1/partials/shell/workspace-switch
AUTH       : Bearer JWT (SA, TO, TA)
RATE       : 10 req/min per user

REQUEST
  workspace_uid : UUID (body, required)

RESPONSE 200
  Header   : HX-Redirect: / (dashboard'a yonlendir)
  Cookie   : active_workspace={uid}; HttpOnly; Secure; SameSite=Lax

ERRORS
  403  FORBIDDEN   : bu workspace'e erisiniz yok
  404  NOT_FOUND   : workspace bulunamadi

AUDIT      : audit.events (action="shell.workspace_switch", workspace_uid)
```

---

```
ENDPOINT   : GET /api/v1/partials/shell/notification-badge
AUTH       : Bearer JWT (tum roller)
RATE       : 60 req/min per user

RESPONSE 200
  Content-Type : text/html
  Body         : notification-badge.html partial
  Icerik       : Okunmamis bildirim sayisi badge'i

NOT        : hx-trigger="every 30s" ile periyodik polling.
             Sayi 0 ise badge gizli, > 99 ise "99+" gosterir.
```

---

```
ENDPOINT   : GET /api/v1/partials/shell/spotlight-search
AUTH       : Bearer JWT (tum roller)
RATE       : 30 req/min per user
TETIKLEME  : Cmd+K (macOS) / Ctrl+K (Windows/Linux) — Spotlight overlay

QUERY
  q        : string (required, min 2 karakter)
  scope    : string (optional, default: "all")
             "all" | "tenants" | "workspaces" | "plugins" | "seo" |
             "content" | "users" | "audit" | "pages" | "commands"

RESPONSE 200
  Content-Type : text/html
  Body         : spotlight-results.html partial
  Icerik       : Paneldeki HER SEYI arar — tenant, workspace, plugin, keyword,
                 icerik sayfasi, kullanici, adaptor, audit log, bildirim, rapor,
                 navigasyon sayfasi, hizli komut.
                 Her kategori max 5 sonuc, relevance score ile sirali.
                 Full-text search (tsvector) + ILIKE fallback.

NOT        : hx-trigger="keyup changed delay:150ms" ile debounce.
             Tab tusu ile scope degistirme, ↑↓ ile gezinme, Enter ile navigasyon.
             Son 5 arama localStorage'da saklanir.

CACHE      : 30 sn (q + scope + user_id bazli)
```

---

```
ENDPOINT   : GET /api/v1/partials/shell/breadcrumb
AUTH       : Bearer JWT (tum roller)
RATE       : 30 req/min per user

QUERY
  path     : string (required, mevcut sayfa path'i: "/tenants/abc-123/users")

RESPONSE 200
  Content-Type : text/html
  Body         : breadcrumb.html partial
  Icerik       : Sayfa hiyerarsisi breadcrumb'i

NOT        : Genellikle server-side render edilir (Jinja2 macro).
             Ancak HTMX tab gecislerinde partial olarak guncellenebilir.
```

---

```
ENDPOINT   : POST /api/v1/partials/shell/locale-switch
AUTH       : Bearer JWT (tum roller)
RATE       : 5 req/min per user

REQUEST
  locale   : string (body, required: "tr" | "en" | "de" | "fr" | "es")

RESPONSE 200
  Header   : HX-Refresh: true (tam sayfa yenileme — dil degistigi icin)
  Cookie   : locale={code}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000

AUDIT      : audit.events (action="shell.locale_switch", locale)
```

---

```
ENDPOINT   : GET /api/v1/partials/shell/user-dropdown
AUTH       : Bearer JWT (tum roller)
RATE       : 10 req/min per user

RESPONSE 200
  Content-Type : text/html
  Body         : user-dropdown.html partial
  Icerik       : Kullanici adi, avatar, rol, tenant adi, cikis butonu, ayarlar linki
```

---

## Ozet Tablo

| Endpoint | Method | Amac | Polling |
|----------|--------|------|---------|
| /api/v1/partials/shell/sidebar-nav | GET | Rol bazli menu | Sayfa yuklemede |
| /api/v1/partials/shell/workspace-selector | GET | Workspace listesi | Dropdown acildiginda |
| /api/v1/partials/shell/workspace-switch | POST | Aktif workspace degistir | Tek seferlik |
| /api/v1/partials/shell/notification-badge | GET | Bildirim sayisi | Her 30 saniye |
| /api/v1/partials/shell/spotlight-search | GET | Spotlight arama (Cmd+K / Ctrl+K) | Keystroke debounce 150ms |
| /api/v1/partials/shell/breadcrumb | GET | Sayfa hiyerarsisi | Tab gecislerinde |
| /api/v1/partials/shell/locale-switch | POST | Dil degistir | Tek seferlik |
| /api/v1/partials/shell/user-dropdown | GET | Kullanici menusu | Sayfa yuklemede |
