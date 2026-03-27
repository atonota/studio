# Module 08: content-intelligence — HTMX_MAP

> HTMX 2 endpoint -> partial HTML eslemesi.
> SSE (Server-Sent Events) entegrasyonu AI oneri streaming icin kullanilir.

---

## 1. Icerik Tablosu Arama / Filtreleme (Debounced)

```html
<!-- Arama input -->
<input
    type="search"
    name="q"
    placeholder="URL veya baslik ara..."
    class="flowbite-input"
    hx-get="/api/v1/partials/content/page-table"
    hx-trigger="input changed delay:400ms, search"
    hx-target="#content-table-body"
    hx-swap="innerHTML"
    hx-include="[name='content_type'], [name='workspace'], [name='sort'], [name='is_decaying'], [name='score_min'], [name='score_max']"
    hx-indicator="#content-search-spinner"
    hx-push-url="true"
/>

<!-- Icerik tipi filtre chip'leri -->
<div class="flex gap-2">
    {% for type_opt in ["", "page", "post", "product", "category", "landing"] %}
    <button
        class="btn-sm {{ 'btn-primary' if current_type == type_opt else 'btn-ghost' }}"
        hx-get="/api/v1/partials/content/page-table?content_type={{ type_opt }}"
        hx-target="#content-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='workspace'], [name='sort'], [name='is_decaying'], [name='score_min'], [name='score_max']"
        hx-indicator="#content-search-spinner"
    >
        {{ type_label_map[type_opt] }}
        {% if type_opt %}({{ type_counts[type_opt] }}){% endif %}
    </button>
    {% endfor %}
</div>

<!-- Skor araligi filtresi -->
<div class="flex items-center gap-2">
    <label class="text-xs text-gray-500">Skor:</label>
    <input type="number" name="score_min" min="0" max="100" placeholder="Min"
           class="w-16 text-sm"
           hx-get="/api/v1/partials/content/page-table"
           hx-trigger="change"
           hx-target="#content-table-body"
           hx-swap="innerHTML"
           hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='sort'], [name='is_decaying'], [name='score_max']"
    />
    <span class="text-gray-300">—</span>
    <input type="number" name="score_max" min="0" max="100" placeholder="Max"
           class="w-16 text-sm"
           hx-get="/api/v1/partials/content/page-table"
           hx-trigger="change"
           hx-target="#content-table-body"
           hx-swap="innerHTML"
           hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='sort'], [name='is_decaying'], [name='score_min']"
    />
</div>

<!-- Curus filtresi toggle -->
<label class="inline-flex items-center gap-1.5 text-sm cursor-pointer">
    <input type="checkbox" name="is_decaying" value="true"
           class="flowbite-checkbox"
           hx-get="/api/v1/partials/content/page-table"
           hx-trigger="change"
           hx-target="#content-table-body"
           hx-swap="innerHTML"
           hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='sort'], [name='score_min'], [name='score_max']"
    />
    <span class="text-gray-700 dark:text-gray-300">
        <i class="ph ph-warning text-amber-500"></i> Sadece curuyen
    </span>
</label>

<!-- Tablo container -->
<div id="content-table-body">
    {% include "modules/content/partials/page-table.html" %}
</div>

<span id="content-search-spinner" class="htmx-indicator">
    <i class="ph ph-spinner animate-spin"></i>
</span>
```

**Detaylar:**
- `delay:400ms`: Debounce — her tuslama sonrasi 400ms beklenir.
- `hx-include`: Tum filtreler birlikte gonderilir.
- `hx-push-url="true"`: URL'ye filtre parametreleri yansir (bookmarkable).

---

## 2. Icerik Tablosu Kolon Siralama

```html
<!-- Skor kolonu ornegi -->
<th>
    <button
        class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
        hx-get="/api/v1/partials/content/page-table?sort=score_asc"
        hx-target="#content-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='is_decaying'], [name='score_min'], [name='score_max']"
    >
        Skor
        <i class="ph ph-caret-up-down text-gray-400"></i>
    </button>
</th>

<!-- Curus riski kolonu -->
<th>
    <button
        class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
        hx-get="/api/v1/partials/content/page-table?sort=decay_risk_desc"
        hx-target="#content-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='is_decaying'], [name='score_min'], [name='score_max']"
    >
        Curus Riski
        <i class="ph ph-caret-up-down text-gray-400"></i>
    </button>
</th>
```

---

## 3. Icerik Tablosu Cursor Pagination (Infinite Scroll)

```html
{% if next_cursor %}
<div
    id="content-load-more"
    hx-get="/api/v1/partials/content/page-table?cursor={{ next_cursor }}&limit=25"
    hx-trigger="revealed"
    hx-target="this"
    hx-swap="outerHTML"
    hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='sort'], [name='is_decaying'], [name='score_min'], [name='score_max']"
    hx-indicator="#content-load-spinner"
>
    <div class="flex justify-center p-4">
        <span id="content-load-spinner" class="htmx-indicator">
            <i class="ph ph-spinner animate-spin mr-2"></i>
        </span>
        <span class="text-sm text-gray-500">Daha fazla yukle</span>
    </div>
</div>
{% endif %}
```

**Not**: `hx-trigger="revealed"` ile infinite scroll. Sunucu yeni satirlar +
(varsa) yeni load-more div'i doner.

---

## 4. Icerik Puanlama Istegi (Tekil Sayfa)

```html
<!-- Detay sayfasindaki puanlama butonu -->
<button
    class="btn-primary"
    hx-post="/api/v1/content/pages/{{ page.uid }}/score"
    hx-target="#score-breakdown-container"
    hx-swap="innerHTML"
    hx-indicator="#score-spinner"
    hx-headers='{"Content-Type": "application/json"}'
    hx-confirm="Bu icerik icin AI puanlama calistirilsin mi?"
    hx-on::after-request="
        if (event.detail.successful) {
            htmx.trigger('#content-score-gauge', 'score-updated');
        }
    "
>
    <span id="score-spinner" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-chart-bar mr-1"></i>
    Puanla
</button>

<!-- Skor ayrinti container -->
<div id="score-breakdown-container"
     hx-get="/api/v1/partials/content/score-breakdown?page_uid={{ page.uid }}"
     hx-trigger="load"
     hx-swap="innerHTML">
    <div class="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
</div>

<!-- Gauge guncelleme (puanlama sonrasi) -->
<div id="content-score-gauge"
     hx-get="/api/v1/partials/content/score-breakdown?page_uid={{ page.uid }}"
     hx-trigger="score-updated from:body"
     hx-target="#score-breakdown-container"
     hx-swap="innerHTML">
</div>
```

**Akis:**
1. Kullanici "Puanla" butonuna tiklar.
2. `hx-confirm` ile onay istenir.
3. POST istegi gonderilir, sunucu `instructor` + LLM ile puanlama yapar.
4. Sonuc: skor ayrinti partial'i guncellenir.
5. `hx-on::after-request` ile gauge da tetiklenir.

---

## 5. AI Oneri Streaming (SSE — hx-ext="sse")

```html
<!-- AI Oneri paneli — SSE streaming -->
<div id="suggestion-panel"
     x-data="{
         streaming: false,
         error: null,
         startStream() {
             this.streaming = true;
             this.error = null;
         }
     }">

    <!-- Baslatma butonu -->
    <button
        class="btn-sm btn-primary"
        :disabled="streaming"
        @click="startStream()"
    >
        <template x-if="!streaming">
            <span><i class="ph ph-sparkle mr-1"></i> Oneri Olustur</span>
        </template>
        <template x-if="streaming">
            <span><i class="ph ph-spinner animate-spin mr-1"></i> Olusturuluyor...</span>
        </template>
    </button>

    <!-- SSE streaming container -->
    <div id="suggestion-stream"
         x-show="streaming"
         hx-ext="sse"
         sse-connect="/api/v1/content/pages/{{ page.uid }}/suggestions/stream"
         sse-swap="suggestion"
         hx-target="#suggestion-items"
         hx-swap="beforeend"
         sse-close="complete"
         @sse:complete="streaming = false"
         @sse:error="streaming = false; error = 'Oneri olusturma sirasinda hata'"
    >
    </div>

    <!-- Oneri kartlari buraya eklenir -->
    <div id="suggestion-items" class="space-y-3 mt-4">
        {% for suggestion in existing_suggestions %}
            {% include "modules/content/components/suggestion-card.html" %}
        {% endfor %}
    </div>
</div>
```

**SSE Event Formati:**

```
event: suggestion
data: {"type": "title", "suggested_value": "...", "reasoning": "...", "impact_score": 8}

event: suggestion
data: {"type": "meta_description", "suggested_value": "...", "reasoning": "...", "impact_score": 7}

event: complete
data: {"total_suggestions": 5, "completed_at": "2026-03-27T14:00:00Z"}
```

**Her SSE event geldiginde:**
1. `sse-swap="suggestion"` — sunucudan gelen HTML partial `#suggestion-items` icine `beforeend` ile eklenir.
2. Sunucu her `suggestion` event'inde render edilmis `suggestion-card.html` component'ini doner.
3. `complete` event'inde `sse-close` aktif olur, baglanti kesilir.
4. Alpine.js `streaming` state'i `false` olur.

---

## 6. Oneri Durum Guncelleme (Accept / Dismiss)

```html
<!-- Her oneri kartindaki aksiyon butonlari -->
<div class="flex gap-1">
    <!-- Kabul Et -->
    <button
        class="btn-xs btn-ghost text-green-600"
        hx-patch="/api/v1/content/suggestions/{{ suggestion.id }}/status"
        hx-vals='{"status": "accepted"}'
        hx-target="closest .suggestion-card"
        hx-swap="outerHTML"
        hx-headers='{"Content-Type": "application/json"}'
        hx-ext="json-enc"
        title="Kabul Et"
    >
        <i class="ph ph-check"></i>
    </button>

    <!-- Reddet -->
    <button
        class="btn-xs btn-ghost text-red-600"
        hx-patch="/api/v1/content/suggestions/{{ suggestion.id }}/status"
        hx-vals='{"status": "dismissed"}'
        hx-target="closest .suggestion-card"
        hx-swap="outerHTML"
        hx-headers='{"Content-Type": "application/json"}'
        hx-ext="json-enc"
        title="Reddet"
    >
        <i class="ph ph-x"></i>
    </button>
</div>
```

**Not**: Sunucu, durum guncellendikten sonra guncellenmis oneri kartini HTML olarak doner.
Kart yerinde degistirilir (`outerHTML`). Kabul edilmis kart yesil border + check ikonu gosterir.

---

## 7. Bosluk Analizi Baslat + Ilerleme Polling

```html
<!-- Bosluk analizi baslat -->
<button
    class="btn-primary"
    hx-post="/api/v1/content/gaps/analyze"
    hx-target="#gap-analysis-progress"
    hx-swap="innerHTML"
    hx-vals='js:{ "workspace_uid": "{{ workspace.uid }}" }'
    hx-headers='{"Content-Type": "application/json", "Idempotency-Key": "{{ idempotency_key }}"}'
    hx-ext="json-enc"
    hx-indicator="#gap-start-spinner"
    hx-confirm="Bosluk analizi baslatilsin mi? seo-intelligence verileriniz kullanilacak."
>
    <span id="gap-start-spinner" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-magnifying-glass mr-1"></i>
    Bosluk Analizi Baslat
</button>

<!-- Ilerleme container -->
<div id="gap-analysis-progress">
    <!-- Sunucu 202 dondukten sonra polling partial yukler -->
</div>
```

### Ilerleme Polling

```html
<!-- Sunucu bu partial'i doner (gap-analysis-progress icine) -->
<div
    hx-get="/api/v1/content/gaps/analyze/status/{{ task_id }}"
    hx-trigger="every 3s"
    hx-target="this"
    hx-swap="innerHTML"
>
    <div class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <i class="ph ph-spinner animate-spin text-blue-500"></i>
        <div>
            <span class="text-sm font-medium text-blue-800 dark:text-blue-300">
                Bosluk analizi isleniyor...
            </span>
            <div class="w-48 h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full mt-1">
                <div class="h-1.5 bg-blue-600 rounded-full transition-all"
                     style="width: {{ progress_pct }}%"></div>
            </div>
        </div>
    </div>
</div>

<!-- Tamamlandiginda sunucu bu partial'i doner (polling durur) -->
<div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
    <div class="flex items-center gap-3">
        <i class="ph ph-check-circle text-green-600 text-xl"></i>
        <div>
            <p class="font-medium text-green-800 dark:text-green-300">Bosluk analizi tamamlandi</p>
            <p class="text-sm text-green-600 dark:text-green-400">
                {{ gaps_found }} bosluk tespit edildi
            </p>
        </div>
        <button
            class="ml-auto btn-sm btn-primary"
            hx-get="/api/v1/partials/content/gap-report"
            hx-target="#gap-table-container"
            hx-swap="innerHTML"
            hx-include="[name='workspace']"
        >
            Sonuclari Gor
        </button>
    </div>
</div>
```

**Polling kurallari:**
- Aralik: 3 saniye.
- Durum `completed` veya `failed` oldugunda polling durur.
- `failed` durumunda kirmizi hata mesaji gosterilir.

---

## 8. Bosluk Tablosu Filtre + Durum Guncelleme

```html
<!-- Durum filtre chip'leri -->
<div class="flex gap-2 mb-4">
    {% for status_opt in ["", "open", "in_progress", "covered", "dismissed"] %}
    <button
        class="btn-sm {{ 'btn-primary' if current_status == status_opt else 'btn-ghost' }}"
        hx-get="/api/v1/partials/content/gap-report?status={{ status_opt }}"
        hx-target="#gap-table-container"
        hx-swap="innerHTML transition:true"
        hx-include="[name='workspace'], [name='sort']"
    >
        {{ status_label_map[status_opt] }}
        {% if status_opt %}({{ status_counts[status_opt] }}){% endif %}
    </button>
    {% endfor %}
</div>

<div id="gap-table-container">
    {% include "modules/content/partials/gap-report.html" %}
</div>
```

### Bosluk Durum Guncelleme (Satir Icinde)

```html
<!-- Her bosluk satirindaki durum dropdown -->
<select
    class="text-xs border-gray-300 rounded"
    hx-patch="/api/v1/content/gaps/{{ gap.uid }}/status"
    hx-trigger="change"
    hx-target="closest tr"
    hx-swap="outerHTML"
    hx-headers='{"Content-Type": "application/json"}'
    hx-ext="json-enc"
    hx-vals='js:{"status": event.target.value}'
>
    <option value="open" {{ 'selected' if gap.status == 'open' }}>Acik</option>
    <option value="in_progress" {{ 'selected' if gap.status == 'in_progress' }}>Devam Ediyor</option>
    <option value="covered" {{ 'selected' if gap.status == 'covered' }}>Kapsandi</option>
    <option value="dismissed" {{ 'selected' if gap.status == 'dismissed' }}>Reddedildi</option>
</select>
```

---

## 9. Anlam Haritasi Yukleme

```html
<!-- Semantic map container — lazy load -->
<div id="semantic-map-container"
     hx-get="/api/v1/partials/content/semantic-chart?workspace={{ workspace.uid }}"
     hx-trigger="load"
     hx-swap="innerHTML"
     hx-indicator="#semantic-spinner"
>
    <div id="semantic-spinner" class="htmx-indicator flex items-center justify-center h-[500px]">
        <div class="text-center">
            <i class="ph ph-spinner animate-spin text-3xl text-primary-500"></i>
            <p class="text-sm text-gray-500 mt-2">Anlam haritasi hesaplaniyor...</p>
        </div>
    </div>
</div>
```

**Not**: t-SNE/UMAP hesaplamasi sunucu tarafinda yapilir ve zaman alabilir.
`hx-trigger="load"` ile sayfa yuklendiginde otomatik baslar. ECharts
chart partial icinde initialize edilir.

---

## 10. Curuyen Icerik Listesi Filtre + Pagination

```html
<!-- Onerilen aksiyon filtresi -->
<div class="flex gap-2 mb-4">
    {% for action in ["", "refresh", "merge", "redirect", "remove"] %}
    <button
        class="btn-sm {{ 'btn-primary' if current_action == action else 'btn-ghost' }}"
        hx-get="/api/v1/partials/content/decay-list?decay_action={{ action }}"
        hx-target="#decay-list-container"
        hx-swap="innerHTML"
        hx-include="[name='workspace'], [name='sort']"
    >
        {% set action_labels = {'': 'Tumu', 'refresh': 'Yenile', 'merge': 'Birlestir', 'redirect': 'Yonlendir', 'remove': 'Kaldir'} %}
        {{ action_labels[action] }}
        {% if action %}({{ action_counts[action] }}){% endif %}
    </button>
    {% endfor %}
</div>

<div id="decay-list-container">
    {% include "modules/content/partials/decay-list.html" %}
</div>
```

### Decay Listesi Cursor Pagination

```html
{% if next_cursor %}
<div
    id="decay-load-more"
    hx-get="/api/v1/partials/content/decay-list?cursor={{ next_cursor }}&limit=25"
    hx-trigger="revealed"
    hx-target="this"
    hx-swap="outerHTML"
    hx-include="[name='decay_action'], [name='workspace'], [name='sort']"
    hx-indicator="#decay-load-spinner"
>
    <div class="flex justify-center p-4">
        <span id="decay-load-spinner" class="htmx-indicator">
            <i class="ph ph-spinner animate-spin mr-2"></i>
        </span>
        <span class="text-sm text-gray-500">Daha fazla yukle</span>
    </div>
</div>
{% endif %}
```

---

## 11. Detay Sayfasi Tab Lazy Loading

```html
<!-- Tab icerikleri HTMX ile lazy load -->

<!-- AI Onerileri tab (intersect once ile ilk gorunumde yukle) -->
<div x-show="activeTab === 'suggestions'" x-transition>
    <div id="tab-suggestions"
         hx-get="/api/v1/partials/content/suggestion-stream?page_uid={{ page.uid }}"
         hx-trigger="intersect once"
         hx-swap="innerHTML">
        <div class="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
</div>

<!-- Trafik Trendi tab -->
<div x-show="activeTab === 'traffic'" x-transition>
    <div id="tab-traffic"
         hx-get="/api/v1/partials/content/traffic-chart?page_uid={{ page.uid }}"
         hx-trigger="intersect once"
         hx-swap="innerHTML">
        <div class="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
</div>

<!-- Benzer Icerikler tab -->
<div x-show="activeTab === 'similar'" x-transition>
    <div id="tab-similar"
         hx-get="/api/v1/partials/content/similar-pages?page_uid={{ page.uid }}"
         hx-trigger="intersect once"
         hx-swap="innerHTML">
        <div class="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
</div>

<!-- Anahtar Kelimeler tab -->
<div x-show="activeTab === 'keywords'" x-transition>
    <div id="tab-keywords"
         hx-get="/api/v1/partials/content/related-keywords?page_uid={{ page.uid }}"
         hx-trigger="intersect once"
         hx-swap="innerHTML">
        <div class="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
</div>
```

**Not**: `hx-trigger="intersect once"` — tab ilk gorunur oldugunda bir kez
yukler, tekrar tab'a geciste sunucuya istek gitmez.

---

## Endpoint -> Partial Ozet Tablosu

| Tetikleyici | HTTP | Endpoint | Partial | hx-target |
|-------------|------|----------|---------|-----------|
| Icerik arama/filtre | GET | `/api/v1/partials/content/page-table` | page-table.html | `#content-table-body` |
| Kolon siralama | GET | `/api/v1/partials/content/page-table` | page-table.html | `#content-table-body` |
| Infinite scroll | GET | `/api/v1/partials/content/page-table?cursor=...` | page-table.html (append) | `#content-load-more` |
| Skor ayrinti | GET | `/api/v1/partials/content/score-breakdown` | score-breakdown.html | `#score-breakdown-container` |
| Puanlama istegi | POST | `/api/v1/content/pages/{uid}/score` | score-breakdown.html | `#score-breakdown-container` |
| AI oneri streaming | GET(SSE) | `/api/v1/content/pages/{uid}/suggestions/stream` | suggestion-card.html (per event) | `#suggestion-items` (beforeend) |
| Oneri kabul/red | PATCH | `/api/v1/content/suggestions/{id}/status` | suggestion-card.html (updated) | closest `.suggestion-card` |
| Bosluk analizi baslat | POST | `/api/v1/content/gaps/analyze` | gap-progress.html | `#gap-analysis-progress` |
| Bosluk analizi durum | GET | `/api/v1/content/gaps/analyze/status/{task_id}` | gap-status.html | polling div |
| Bosluk filtre | GET | `/api/v1/partials/content/gap-report` | gap-report.html | `#gap-table-container` |
| Bosluk durum guncelle | PATCH | `/api/v1/content/gaps/{uid}/status` | gap-row.html | closest `tr` |
| Anlam haritasi | GET | `/api/v1/partials/content/semantic-chart` | semantic-chart.html | `#semantic-map-container` |
| Curuyen icerik filtre | GET | `/api/v1/partials/content/decay-list` | decay-list.html | `#decay-list-container` |
| Curuyen icerik paginate | GET | `/api/v1/partials/content/decay-list?cursor=...` | decay-list.html (append) | `#decay-load-more` |
| Trafik grafigi (tab) | GET | `/api/v1/partials/content/traffic-chart` | traffic-chart.html | `#tab-traffic` |
| Benzer sayfalar (tab) | GET | `/api/v1/partials/content/similar-pages` | similar-pages.html | `#tab-similar` |
| Iliskili kelimeler (tab) | GET | `/api/v1/partials/content/related-keywords` | related-keywords.html | `#tab-keywords` |

---

## SSE Kurallari

```
1. SSE endpoint: GET (text/event-stream) — POST degil
2. JWT dogrulama: query param olarak token gonderilir (SSE header desteklemez)
   -> /api/v1/content/pages/{uid}/suggestions/stream?token=JWT_TOKEN
3. hx-ext="sse": HTMX SSE extension aktif olmali (<script src="sse.js">)
4. sse-connect: SSE baglanti URL'si
5. sse-swap: dinlenecek event adi (sunucudan gelen "event:" satiri ile eslesir)
6. sse-close: baglanti kapatma event adi (sunucu "complete" gonderdiginde)
7. Her SSE event'inde sunucu render edilmis HTML fragment doner (JSON degil)
8. Baglanti zaman asimi: 60 saniye (sunucu tarafinda)
9. Hata durumunda: sunucu "error" event gonderir, sse-close tetiklenmez
10. Rate limit: 10 SSE baglantisi/dk per tenant
```

---

## Hata Yonetimi

```html
<!-- Global HTMX hata yakalama -->
<body hx-on:htmx:response-error="
    const status = event.detail.xhr.status;
    if (status === 403) {
        alert('Bu islemi yapmak icin yetkiniz yok.');
    } else if (status === 429) {
        alert('Cok fazla istek gonderdiniz. Lutfen biraz bekleyin.');
    }
">
```

---

## Loading State Ozeti

| Bilesen | Indicator ID | Gorunum |
|---------|-------------|---------|
| Icerik tablosu arama | `#content-search-spinner` | Input yaninda spinner |
| Infinite scroll | `#content-load-spinner` | Ortada spinner |
| Puanlama butonu | `#score-spinner` | Buton icinde spinner |
| Bosluk analizi baslat | `#gap-start-spinner` | Buton icinde spinner |
| Anlam haritasi | `#semantic-spinner` | Tam alan spinner + mesaj |
| Curuyen icerik paginate | `#decay-load-spinner` | Ortada spinner |
| SSE streaming | Alpine.js `streaming` | Buton icinde spinner (JS kontrol) |
