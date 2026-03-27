# dashboard — Route Haritasi

> Sayfa ve partial endpoint tanimlari. FastAPI router: `app/api/v1/modules/dashboard/routes.py`

---

## Sayfa Route'lari (HTML)

```
GET  /
  Template  : templates/modules/dashboard/pages/dashboard.html
  Layout    : templates/layouts/shell.html
  Auth      : Bearer JWT (tum roller)
  Context   : Aktif workspace'in temel KPI verileri (server-side pre-render)
  Redirect  : Oturum yoksa -> /auth/login

NOT: Ana sayfa route'u. Shell layout icinde render edilir.
     KPI kartlari, aktivite feed ve AI brief partial olarak yuklenir.
```

---

```
GET  /dashboard/workspace/{uid}
  Template  : templates/modules/dashboard/pages/workspace-dashboard.html
  Layout    : templates/layouts/shell.html
  Auth      : Bearer JWT (SA, TO, TA, AN)
  Validate  : uid gecerli ve erisim yetkisi kontrolu
  Context   : Secilen workspace'in detayli KPI verileri

ERRORS
  403  FORBIDDEN   : bu workspace'e erisiniz yok
  404  NOT_FOUND   : workspace bulunamadi
```

---

## Partial Endpoint'leri (HTMX)

```
ENDPOINT   : GET /api/v1/partials/dashboard-stats
AUTH       : Bearer JWT (tum roller)
RATE       : 20 req/min per user

QUERY
  workspace_uid : UUID (optional — bos ise aktif workspace)
  date_from     : ISO8601 date (optional, default: 7 gun once)
  date_to       : ISO8601 date (optional, default: bugun)

RESPONSE 200
  Content-Type : text/html
  Body         : partials/stats-cards.html
  Icerik       : 4-6 adet KPI karti grid (role gore filtrelenmis)

KPI Kartlari (SA rolu):
  - Toplam Tenant        (trend: onceki ay)
  - Toplam Workspace     (trend: onceki ay)
  - Aktif Adapter        (trend: onceki hafta)
  - Platform Saglik Skoru (gauge: 0-100)
  - Gunluk API Istegi    (sparkline: son 7 gun)
  - Aktif Kullanici      (trend: onceki hafta)

KPI Kartlari (TO/TA rolu):
  - Workspace Sayisi     (trend: onceki ay)
  - Aktif Kullanici      (trend: onceki hafta)
  - Adapter Durumu       (aktif/toplam)
  - SEO Skor Ortalamasi  (gauge: 0-100)
  - Kullanim Kotasi      (progress: kullanilan/limit)
  - Son Crawl Tarihi     (tarih + durum)

KPI Kartlari (AN rolu):
  - SEO Skor             (gauge: 0-100)
  - Organik Trafik       (sparkline: son 7 gun)
  - Icerik Puani         (trend: onceki hafta)
  - Teknik Hata Sayisi   (sayi + trend)

CACHE      : 5 dk (workspace_uid + date range + role bazli)
```

---

```
ENDPOINT   : GET /api/v1/partials/recent-activity
AUTH       : Bearer JWT (tum roller)
RATE       : 30 req/min per user

QUERY
  workspace_uid : UUID (optional)
  cursor        : string (optional, cursor-based pagination)
  limit         : int (optional, default: 10, max: 50)

RESPONSE 200
  Content-Type : text/html
  Body         : partials/activity-feed.html
  Icerik       : Son aktiviteler listesi (zaman damgali)

Aktivite Tipleri:
  - user.login           : "Ahmet Karaca giris yapti"
  - tenant.created       : "Yeni tenant olusturuldu: Beta Ltd."
  - workspace.connected  : "acme.com WordPress adaptoru baglandi"
  - adapter.error        : "shopify.beta.com baglanti hatasi"
  - seo.audit_complete   : "acme.com SEO denetimi tamamlandi"
  - content.score_change : "ana-sayfa icerik skoru 72 -> 85"
  - system.update        : "Platform v2.1.1 guncellendi"

PAGINATION : Cursor-based (created_at, id)
             next_cursor partial icerisinde hx-get attribute olarak doner
```

---

```
ENDPOINT   : GET /api/v1/partials/ai-daily-brief
AUTH       : Bearer JWT (SA, TO, TA, AN — VW erisemez)
RATE       : 10 req/min per user

QUERY
  workspace_uid : UUID (optional)
  date          : ISO8601 date (optional, default: bugun)

RESPONSE 200
  Content-Type : text/html
  Body         : partials/ai-brief.html
  Icerik       : AI tarafindan uretilmis gunluk brief karti

Brief Yapisi:
  - Baslik: "Bugun Dikkat Edilecek 3 Sey"
  - 3 adet insight bullet:
    1. Anomali/uyari (varsa)
    2. Trend degisimi
    3. Oneri/aksiyon
  - Uretim zamani + "AI tarafindan uretildi" etiketi
  - "Detayli Analiz" butonu -> /insights

Server Response (brief henuz uretilmemis):
  Body: "Brief hazirlaniyor..." skeleton + hx-trigger="load delay:30s" (tekrar dene)

CACHE      : 1 saat (brief gunluk uretilir, gun icinde degismez)
```

---

```
ENDPOINT   : GET /api/v1/partials/dashboard-traffic-overview
AUTH       : Bearer JWT (TO, TA, AN)
RATE       : 10 req/min per user

QUERY
  workspace_uid : UUID (optional)
  period        : string (optional: "7d" | "30d" | "90d", default: "30d")

RESPONSE 200
  Content-Type : application/json
  Body         : ECharts option JSON (stacked area chart)

NOT: Bu endpoint JSON doner (HTML degil). Client-side ECharts instance'i
     bu JSON'i alip render eder. Partial degil, chart data endpoint'i.
```

---

```
ENDPOINT   : GET /api/v1/partials/dashboard-adapter-status
AUTH       : Bearer JWT (SA, TO, TA)
RATE       : 10 req/min per user

QUERY
  workspace_uid : UUID (optional)

RESPONSE 200
  Content-Type : application/json
  Body         : ECharts option JSON (doughnut chart — aktif/inaktif/hata)
```

---

## Date Range Filtreleme

```
ENDPOINT   : Tum dashboard partial'larini etkiler
Element    : DateRangeSelector component
Trigger    : hx-trigger="change"
Method     : Tum partial'lari yeniden tetikler

Mekanizma:
  DateRangeSelector Alpine.js state'i degistiginde:
  1. window.dispatchEvent(new CustomEvent('date-range-changed', { detail: { from, to } }))
  2. Tum partial container'lar bu event'i dinler:
     hx-trigger="date-range-changed from:window"
  3. hx-vals dinamik olarak guncellenir (Alpine.js x-bind:hx-vals)
```

---

## Ozet Tablo

| Endpoint | Method | Amac | Polling | Cache |
|----------|--------|------|---------|-------|
| / | GET | Ana dashboard sayfasi | — | — |
| /dashboard/workspace/{uid} | GET | Workspace dashboard | — | — |
| /api/v1/partials/dashboard-stats | GET | KPI kartlari | 5 dk | 5 dk |
| /api/v1/partials/recent-activity | GET | Aktivite feed | 60 sn | — |
| /api/v1/partials/ai-daily-brief | GET | AI brief karti | — | 1 saat |
| /api/v1/partials/dashboard-traffic-overview | GET | Trafik grafigi (JSON) | — | 5 dk |
| /api/v1/partials/dashboard-adapter-status | GET | Adapter durumu (JSON) | — | 5 dk |
