# notification-center — HTMX Partial Haritasi

> HTMX endpoint -> partial HTML eslesmesi. Her satir bir HTMX etkilesimini tanimlar.

---

## SSE Baglantisi (Gercek Zamanli)

SSE baglantisi shell layout icinde kurulur ve tum sayfalarda aktiftir.

```html
<!-- templates/layouts/studio.html -->
<div hx-ext="sse"
     sse-connect="/api/v1/notifications/stream?token={{ jwt_token }}">

  <!-- Event: badge-update -> topbar badge'i guncelle -->
  <div sse-swap="badge-update"
       hx-target="#notification-badge-topbar"
       hx-swap="innerHTML">
  </div>

  <!-- Event: notification -> toast goster -->
  <div sse-swap="notification"
       hx-target="#toast-container"
       hx-swap="afterbegin settle:300ms">
  </div>
</div>
```

**Sunucu tarafinda SSE:**
```python
@router.get("/api/v1/notifications/stream")
async def notification_stream(
    token: str = Query(...),
    current_user: User = Depends(get_user_from_token),
) -> EventSourceResponse:
    async def event_generator():
        async for notification in listen_notifications(current_user.id):
            yield {
                "event": "notification",
                "data": render_template("components/toast.html", notification=notification)
            }
            yield {
                "event": "badge-update",
                "data": render_template("partials/badge.html", unread_count=get_count(current_user.id))
            }
    return EventSourceResponse(event_generator())
```

---

## Topbar Dropdown

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Dropdown acilinca | `hx-get` | `/api/v1/partials/notification-dropdown` | `#dropdown-notification-list` | `innerHTML` | `hx-trigger="revealed"` — gorunur olunca yukle |
| Badge polling | `hx-get` | `/api/v1/partials/notification-badge` | `#notification-badge-topbar` | `innerHTML` | `hx-trigger="every 30s"` |

**Badge polling ornegi:**
```html
<span id="notification-badge-topbar"
      hx-get="/api/v1/partials/notification-badge"
      hx-trigger="every 30s"
      hx-swap="innerHTML">
  <!-- Okunmamis sayisi veya bos -->
</span>
```

Not: SSE `badge-update` eventi de badge'i gunceller. Polling yalnizca SSE baglantisi
koptugundan yedek (fallback) mekanizmadir.

---

## Bildirim Listesi Sayfasi

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Sayfa yuklenme | `hx-get` | `/api/v1/partials/notification-list` | `#notification-list` | `innerHTML` | `hx-trigger="load"` |
| Filtre degisikligi | `hx-get` | `/api/v1/partials/notification-list` | `#notification-list` | `innerHTML` | Query params: type, severity, read |
| Cursor pagination | `hx-get` | `/api/v1/partials/notification-list?cursor=X` | `#notification-list` | `beforeend` | "Daha Fazla Yukle" butonu |
| Okundu isaretle | `hx-patch` | `/api/v1/partials/notification/{uid}/read` | `#notification-{uid}` | `outerHTML` | Kart stili guncellenir |
| Toplu okundu | `hx-post` | `/api/v1/partials/notification/mark-all-read` | `#notification-list` | `innerHTML` | Tum kartlar okunmus gorunumde |

### Filtre Mekanizmasi

```html
<div class="flex gap-3" id="notification-filters">
  <!-- Tip filtresi -->
  <select name="type"
          hx-get="/api/v1/partials/notification-list"
          hx-target="#notification-list"
          hx-swap="innerHTML"
          hx-include="#notification-filters"
          class="flowbite-select text-sm">
    <option value="">Tum Tipler</option>
    <option value="seo.anomaly">SEO Anomalisi</option>
    <option value="security.alert">Guvenlik Alarmi</option>
    <option value="perf.warning">Performans Uyarisi</option>
    <option value="plugin.update">Plugin Guncelleme</option>
    <option value="rule.triggered">Kural Tetikleme</option>
  </select>

  <!-- Ciddiyet filtresi -->
  <select name="severity"
          hx-get="/api/v1/partials/notification-list"
          hx-target="#notification-list"
          hx-swap="innerHTML"
          hx-include="#notification-filters"
          class="flowbite-select text-sm">
    <option value="">Tum Ciddiyetler</option>
    <option value="critical">Kritik</option>
    <option value="high">Yuksek</option>
    <option value="medium">Orta</option>
    <option value="low">Dusuk</option>
    <option value="info">Bilgi</option>
  </select>

  <!-- Durum filtresi -->
  <select name="read"
          hx-get="/api/v1/partials/notification-list"
          hx-target="#notification-list"
          hx-swap="innerHTML"
          hx-include="#notification-filters"
          class="flowbite-select text-sm">
    <option value="">Tumumu</option>
    <option value="false">Okunmamis</option>
    <option value="true">Okunmus</option>
  </select>
</div>
```

`hx-include="#notification-filters"` ile tum filtre degerleri otomatik olarak
query string'e eklenir.

### Cursor Pagination

```html
<!-- partials/notification-cards.html en altina eklenir -->
{% if next_cursor %}
<div id="load-more-trigger"
     hx-get="/api/v1/partials/notification-list?cursor={{ next_cursor }}"
     hx-target="this"
     hx-swap="outerHTML"
     hx-trigger="revealed"
     hx-include="#notification-filters"
     hx-indicator="#load-more-spinner"
     class="py-4 text-center">
  <span id="load-more-spinner" class="htmx-indicator">
    <svg class="animate-spin h-6 w-6 text-primary-600 mx-auto">...</svg>
  </span>
  <button class="text-sm text-primary-600 hover:text-primary-800 font-medium">
    Daha Fazla Yukle
  </button>
</div>
{% endif %}
```

`hx-trigger="revealed"` ile kullanici sayfanin altina scroll ettiginde otomatik yukleme
yapilir (infinite scroll). Alternatif olarak `hx-trigger="click"` ile butona tiklamaya
da baglanabilir.

**Sunucu tarafinda cursor:**
```python
@router.get("/api/v1/partials/notification-list")
async def list_notifications(
    request: Request,
    cursor: str | None = Query(None),
    type: str | None = Query(None),
    severity: str | None = Query(None),
    read: str | None = Query(None),
    limit: int = Query(20, le=50),
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> HTMLResponse:
    notifications, next_cursor = await notification_service.list_for_user(
        session=session,
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        cursor=cursor,
        type_filter=type,
        severity_filter=severity,
        read_filter=read,
        limit=limit,
    )
    return templates.TemplateResponse(
        "modules/notification/partials/notification-cards.html",
        {"request": request, "notifications": notifications, "next_cursor": next_cursor}
    )
```

---

## Bildirim Okundu Isareti

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Tek bildirim okundu | `hx-patch` | `/api/v1/partials/notification/{uid}/read` | `#notification-{uid}` | `outerHTML` | Kart stili: mavi -> beyaz |

```html
<button hx-patch="/api/v1/partials/notification/{{ notification.uid }}/read"
        hx-target="#notification-{{ notification.uid }}"
        hx-swap="outerHTML settle:300ms">
  <i class="ph ph-check"></i> Okundu Isaretle
</button>
```

Sunucu, ayni `notification-card.html` component'ini `read_at` dolu olarak doner.
Bu durumda kart sol kenar cizgisi ve arka plan rengi degisir (mavi -> varsayilan).

---

## Bildirim Kurallari

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Kural listesi yukle | `hx-get` | `/api/v1/partials/notification-rules` | `#rule-table` | `innerHTML` | Sayfa yuklenme |
| Kural olustur | `hx-post` | `/api/v1/partials/notification-rules` | `#rule-form-container` | `innerHTML` | Basarida HX-Redirect |
| Kural toggle | `hx-patch` | `/api/v1/partials/notification-rules/{uid}/toggle` | `#rule-{uid}` | `outerHTML` | Toggle switch |
| Kural sil | `hx-delete` | `/api/v1/partials/notification-rules/{uid}` | `#rule-{uid}` | `outerHTML swap:500ms` | `hx-confirm` |

### Kural Olusturma Akisi

```
1. Kullanici /notifications/rules/create sayfasina gider
2. Kosul satirlari ekler (Alpine.js — tamamen client-side)
3. Aksiyon kanallarini secer
4. Form submit edilir (hx-post)
5. Sunucu dogrulama yapar
   - Basari: HX-Redirect: /notifications/rules (302)
   - Hata: rule-form.html (hata mesajli) doner
```

```python
# Sunucu tarafinda
@router.post("/api/v1/partials/notification-rules")
async def create_rule(
    request: Request,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> HTMLResponse:
    form = await request.form()
    try:
        rule = await rule_service.create(
            session=session,
            tenant_id=current_user.tenant_id,
            created_by=current_user.id,
            name=form["name"],
            conditions=json.loads(form["conditions"]),
            actions=json.loads(form["actions"]),
            cooldown_minutes=int(form.get("cooldown_minutes", 60)),
        )
        response = HTMLResponse("")
        response.headers["HX-Redirect"] = "/notifications/rules"
        return response
    except ValidationError as e:
        return templates.TemplateResponse(
            "modules/notification/partials/rule-form.html",
            {"request": request, "error": str(e)},
            status_code=422,
        )
```

---

## Hata Yonetimi

HTMX 4xx/5xx response handling:

```html
<!-- Global: 422 response'larini swap et -->
<meta name="htmx-config" content='{"responseHandling": [
  {"code": "204", "swap": false},
  {"code": "[23]..", "swap": true},
  {"code": "422", "swap": true},
  {"code": "[45]..", "swap": false, "error": true}
]}'>
```

SSE baglanti kopma durumunda:
```html
<!-- SSE kopunca yeniden baglan (ussel geri cekilme) -->
<div hx-ext="sse"
     sse-connect="/api/v1/notifications/stream?token={{ jwt_token }}"
     hx-on:htmx:sse-error="setTimeout(() => htmx.trigger(this, 'htmx:load'), 5000)">
</div>
```

---

## Loading State'leri

```html
<!-- Bildirim listesi yukleme -->
<div id="notification-list">
  <div class="htmx-indicator flex justify-center py-8">
    <svg class="animate-spin h-8 w-8 text-primary-600">...</svg>
    <span class="ml-2 text-gray-500">Bildirimler yukleniyor...</span>
  </div>
</div>

<!-- Okundu isareti buton spinner -->
<button hx-patch="..." hx-indicator="this">
  <span class="htmx-indicator">
    <svg class="animate-spin h-3 w-3">...</svg>
  </span>
  <span>Okundu Isaretle</span>
</button>
```
