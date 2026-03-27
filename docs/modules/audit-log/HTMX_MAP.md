# audit-log — HTMX Partial Haritasi

> HTMX endpoint -> partial HTML eslesmesi. Her satir bir HTMX etkilesimini tanimlar.

---

## Sayfa Yuklenme

Audit ana sayfasi yuklendiginde 3 bagimsiz HTMX istegi paralel olarak calisir:

```html
<!-- templates/modules/audit/pages/audit-list.html -->

<!-- 1. AI Ozet Karti -->
<div id="audit-summary-container"
     hx-get="/api/v1/partials/audit-summary?period=24h"
     hx-trigger="load"
     hx-swap="innerHTML"
     hx-indicator="#summary-spinner">
  <div id="summary-spinner" class="htmx-indicator py-4 text-center">
    <svg class="animate-spin h-6 w-6 text-primary-600 mx-auto">...</svg>
  </div>
</div>

<!-- 2. Aktivite Zaman Cizgisi -->
<div id="activity-timeline-container"
     hx-get="/api/v1/partials/audit-timeline?days=30"
     hx-trigger="load"
     hx-swap="innerHTML">
</div>

<!-- 3. Audit Tablosu -->
<div id="audit-table-container"
     hx-get="/api/v1/partials/audit-table"
     hx-trigger="load"
     hx-swap="innerHTML"
     hx-indicator="#table-spinner">
  <div id="table-spinner" class="htmx-indicator py-8 text-center">
    <svg class="animate-spin h-6 w-6 text-primary-600 mx-auto">...</svg>
  </div>
</div>

<!-- 4. Detay Modal Overlay (bos, gerektiginde doldurulur) -->
<div id="audit-detail-overlay"></div>
```

---

## Filtre Islemleri

Tum filtre degisiklikleri ayni tablo endpoint'ini cagrir. `hx-include` ile tum filtre
degerleri otomatik olarak gonderilir.

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Aksiyon dropdown degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-include="#audit-filters"` |
| Kullanici dropdown degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-include="#audit-filters"` |
| Kaynak tipi degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-include="#audit-filters"` |
| Baslangic tarihi degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-trigger="change"` |
| Bitis tarihi degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-trigger="change"` |
| Metin arama | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-trigger="keyup changed delay:500ms"` |
| Sonuc radio degisimi | `hx-get` | `/api/v1/partials/audit-table` | `#audit-table-container` | `innerHTML` | `hx-include="#audit-filters"` |

**Filtre mekanizmasi ornegi:**
```html
<select name="action"
        hx-get="/api/v1/partials/audit-table"
        hx-target="#audit-table-container"
        hx-swap="innerHTML"
        hx-include="#audit-filters"
        hx-push-url="true"
        hx-indicator="#table-spinner">
  <option value="">Tumumu</option>
  <option value="auth.login">Giris</option>
  ...
</select>
```

`hx-push-url="true"` ile filtre degerleri URL'ye yansitilir. Bu sayede:
- Sayfa yenileme filtreleri korur
- Filtrelenmis gorunum link olarak paylasilabilir
- Tarayici geri butonu filtre gecmisinde gezinme saglar

**Metin arama debounce:**
```html
<input type="text" name="q"
       hx-get="/api/v1/partials/audit-table"
       hx-target="#audit-table-container"
       hx-swap="innerHTML"
       hx-include="#audit-filters"
       hx-trigger="keyup changed delay:500ms"
       hx-indicator="#search-spinner">
```

500ms gecikme ile arama istegi gonderilir. Bu sayede her tus vurusunda istek atilmaz.

---

## Cursor Pagination

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Daha fazla yukle | `hx-get` | `/api/v1/partials/audit-table?cursor=X` | `#audit-table-container tbody` | `beforeend` | Mevcut tablonun altina ekler |

```html
<!-- partials/audit-table.html icerisinde tablo sonuna eklenir -->
{% if next_cursor %}
<tr id="load-more-row">
  <td colspan="6" class="py-4 text-center">
    <button hx-get="/api/v1/partials/audit-table?cursor={{ next_cursor }}"
            hx-target="#load-more-row"
            hx-swap="outerHTML"
            hx-include="#audit-filters"
            hx-indicator="#load-more-spinner"
            class="text-sm text-primary-600 hover:text-primary-800
                   dark:text-primary-400 font-medium">
      <span id="load-more-spinner" class="htmx-indicator mr-2">
        <svg class="animate-spin h-4 w-4 inline">...</svg>
      </span>
      Daha Fazla Yukle ({{ remaining_count }} kayit daha)
    </button>
  </td>
</tr>
{% endif %}
```

Sunucu response olarak ek `<tr>` satirlari + yeni "Daha Fazla" satiri doner.
"Daha Fazla" satiri kendisini `outerHTML` ile degistirerek yeni satirlari ekler.

**Sunucu tarafinda cursor:**
```python
@router.get("/api/v1/partials/audit-table")
async def audit_table_partial(
    request: Request,
    cursor: str | None = Query(None),
    limit: int = Query(25, le=100),
    # ... diger filtre parametreleri
) -> HTMLResponse:
    if cursor:
        # Cursor decode: "2026-03-27T14:32:05Z|12345" -> (datetime, bigint)
        cursor_dt, cursor_id = decode_cursor(cursor)
        query = query.where(
            or_(
                AuditEvent.created_at < cursor_dt,
                and_(AuditEvent.created_at == cursor_dt, AuditEvent.id < cursor_id),
            )
        )
    events = await session.execute(query.limit(limit + 1))  # +1 ile sonraki sayfa var mi kontrol
    has_next = len(events) > limit
    if has_next:
        events = events[:limit]
        next_cursor = encode_cursor(events[-1].created_at, events[-1].id)
    else:
        next_cursor = None

    return templates.TemplateResponse(
        "modules/audit/partials/audit-table.html",
        {"request": request, "events": events, "next_cursor": next_cursor}
    )
```

---

## Detay Modal

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Detay butonu tik | `hx-get` | `/api/v1/partials/audit-detail/{uid}` | `#audit-detail-overlay` | `innerHTML` | Alpine.js modal acilir |
| Iliskili olay tik | `hx-get` | `/api/v1/partials/audit-detail/{uid}` | `#audit-detail-overlay` | `innerHTML` | Modal icerigi degisir |

```html
<!-- Tablo satirindaki detay butonu -->
<button hx-get="/api/v1/partials/audit-detail/{{ event.uid }}"
        hx-target="#audit-detail-overlay"
        hx-swap="innerHTML"
        class="text-primary-600 hover:text-primary-800">
  <i class="ph ph-arrow-right"></i>
</button>
```

Modal icinde iliskili olaya tiklandiginda ayni overlay hedef alinir, boylece modal
icerigi degisir (sayfa degismez):

```html
<!-- Modal icindeki iliskili olay -->
<div hx-get="/api/v1/partials/audit-detail/{{ rel.uid }}"
     hx-target="#audit-detail-overlay"
     hx-swap="innerHTML"
     class="cursor-pointer hover:bg-gray-50">
  {{ rel.action }} — {{ rel.created_at | format_time }}
</div>
```

Modal kapatma: ESC tusu veya overlay tiklamasi ile Alpine.js `open = false` set eder.
`#audit-detail-overlay` icindeki HTML kalir ama gorunmez olur.

---

## AI Ozet Karti

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Sayfa yuklenme | `hx-get` | `/api/v1/partials/audit-summary?period=24h` | `#audit-summary-container` | `innerHTML` | `hx-trigger="load"` |
| Periyot degisimi | `hx-get` | `/api/v1/partials/audit-summary` | `closest div[hx-trigger]` | `innerHTML` | select degisimi |

```html
<select hx-get="/api/v1/partials/audit-summary"
        hx-target="closest div[hx-trigger]"
        hx-swap="innerHTML"
        name="period"
        class="flowbite-select text-xs">
  <option value="1h">1 saat</option>
  <option value="24h" selected>24 saat</option>
  <option value="7d">7 gun</option>
</select>
```

AI ozet endpoint'i asenkron calisir (LLM cagrisi). Loading state gosterimi:

```html
<div id="summary-spinner" class="htmx-indicator">
  <div class="flex items-center gap-2 py-4">
    <svg class="animate-spin h-5 w-5 text-primary-600">...</svg>
    <span class="text-sm text-gray-500">AI ozet hazirlaniyor...</span>
  </div>
</div>
```

---

## Aktivite Zaman Cizgisi

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Sayfa yuklenme | `hx-get` | `/api/v1/partials/audit-timeline?days=30` | `#activity-timeline-container` | `innerHTML` | `hx-trigger="load"` |
| Periyot degisimi | Alpine.js | `/api/v1/partials/audit-timeline?days=X` | `#activity-timeline-container` | `innerHTML` | Select degisimi |

Zaman cizgisindeki bir bara tiklandiginda ilgili gunun filtrelenmis tablosu gosterilir:

```javascript
// ECharts click handler
chart.on('click', (params) => {
  const date = params.name; // 'YYYY-MM-DD' formati
  // HTMX ile tablo guncelle
  htmx.ajax('GET', `/api/v1/partials/audit-table?date_from=${date}&date_to=${date}`, {
    target: '#audit-table-container',
    swap: 'innerHTML'
  });
  // URL'yi de guncelle
  const url = new URL(window.location);
  url.searchParams.set('date_from', date);
  url.searchParams.set('date_to', date);
  history.pushState({}, '', url);
});
```

---

## Dogal Dil Sorgu

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Form submit | `hx-post` | `/api/v1/partials/audit-natural-query` | `#audit-table-container` | `innerHTML` | AI sorgu cevirisi + filtrelenmis sonuclar |

```html
<form hx-post="/api/v1/partials/audit-natural-query"
      hx-target="#audit-table-container"
      hx-swap="innerHTML"
      hx-indicator="#nq-spinner">
  <input type="text" name="query" placeholder="Dogal dil ile ara...">
  <button type="submit"><i class="ph ph-arrow-right"></i></button>
</form>
```

Sunucu response'u iki bolum icerir:
1. Sorgu yorumlama kartı (yorumlanan filtreler + dogal dil cevap)
2. Filtrelenmis audit tablosu

```html
<!-- Sunucu response ornegi -->
<div class="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
  <p class="font-medium text-primary-800 dark:text-primary-300">
    <i class="ph ph-sparkle mr-1"></i>
    "dun kimler workspace olusturdu?"
  </p>
  <p class="text-primary-700 dark:text-primary-400 mt-1">
    Yorumlama: aksiyon=workspace.create, tarih=2026-03-26
  </p>
  <p class="text-gray-700 dark:text-gray-300 mt-2">
    Dun 2 kullanici toplam 3 workspace olusturdu.
  </p>
</div>

<!-- Ardindan audit-table.html partial -->
<div class="overflow-x-auto">
  <table>...</table>
</div>
```

---

## CSV Export

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| CSV Indir butonu | standart link | `/api/v1/audit/export?format=csv` | — | — | Tarayici download |

CSV export HTMX kullanmaz, standart `<a>` linki ile tarayici download tetiklenir:

```html
<a href="/api/v1/audit/export?format=csv"
   class="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400
          dark:hover:text-gray-200 font-medium flex items-center gap-1"
   download>
  <i class="ph ph-download-simple"></i> CSV Indir
</a>
```

Filtre uygulanmissa query param'lar eklenir:
```javascript
// Alpine.js ile dinamik export URL olusturma
function exportUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('format', 'csv');
  return `/api/v1/audit/export?${params.toString()}`;
}
```

---

## Hata Yonetimi

```html
<!-- 422 response'lari swap edilir -->
<meta name="htmx-config" content='{"responseHandling": [
  {"code": "204", "swap": false},
  {"code": "[23]..", "swap": true},
  {"code": "422", "swap": true},
  {"code": "403", "swap": false, "error": true},
  {"code": "[45]..", "swap": false, "error": true}
]}'>
```

403 hatasi icin global event handler:
```html
<body hx-on:htmx:response-error="
  if (event.detail.xhr.status === 403) {
    alert('Bu islemi yapmak icin yetkiniz yok.');
  }
">
```

---

## Loading State Ozeti

| Bilesen | Indicator ID | Gorunum |
|---------|-------------|---------|
| AI ozet karti | `#summary-spinner` | Spinner + "AI ozet hazirlaniyor..." |
| Audit tablosu | `#table-spinner` | Ortada spinner |
| Daha fazla yukle | `#load-more-spinner` | Inline spinner (buton icinde) |
| Dogal dil sorgu | `#nq-spinner` | Input icinde spinner |
| Zaman cizgisi | ECharts loading | ECharts yerlesik loading animasyonu |
