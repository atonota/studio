# Module 07: seo-intelligence — HTMX_MAP

> HTMX 2 endpoint -> partial HTML eslemesi.
> Bu modul en fazla etkilesime sahip olan birincil deger moduludur.

---

## 1. Anahtar Kelime Arama / Filtreleme (Debounced)

```html
<!-- Arama input -->
<input
    type="search"
    name="q"
    placeholder="Anahtar kelime ara..."
    class="..."
    hx-get="/api/v1/partials/seo/keyword-table"
    hx-trigger="input changed delay:400ms, search"
    hx-target="#keyword-table-body"
    hx-swap="innerHTML"
    hx-include="[name='intent'], [name='workspace'], [name='sort'], [name='cluster_id']"
    hx-indicator="#keyword-search-spinner"
    hx-push-url="true"
/>

<!-- Niyet filtre chip'leri -->
<div class="flex gap-2">
    {% for intent_opt in ["", "informational", "commercial", "transactional", "navigational"] %}
    <button
        class="..."
        hx-get="/api/v1/partials/seo/keyword-table?intent={{ intent_opt }}"
        hx-target="#keyword-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='workspace'], [name='sort']"
        hx-indicator="#keyword-search-spinner"
    >
        {{ intent_label_map[intent_opt] }} ({{ intent_counts[intent_opt] }})
    </button>
    {% endfor %}
</div>

<!-- Tablo container -->
<div id="keyword-table-body">
    {% include "modules/seo/partials/keyword-table.html" %}
</div>

<span id="keyword-search-spinner" class="htmx-indicator">
    <i class="ph ph-spinner animate-spin"></i>
</span>
```

**Detaylar:**
- `delay:400ms`: Debounce — her tuslama sonrasi 400ms beklenir.
- `hx-include`: Tum filtreler birlikte gonderilir.
- `hx-push-url="true"`: URL'ye filtre parametreleri yansir (bookmarkable, paylasılabilir).

---

## 2. Niyet Siniflandirma Butonu (Toplu AI Islemi)

```html
<!-- Toplu islem toolbar'dan tetiklenir -->
<button
    class="btn-sm btn-secondary"
    hx-post="/api/v1/seo/keywords/classify"
    hx-target="#keyword-table-body"
    hx-swap="innerHTML"
    hx-vals='js:{
        "keyword_ids": JSON.parse(
            document.querySelector("[x-data]").__x.$data.selectedIds
                ? JSON.stringify(document.querySelector("[x-data]").__x.$data.selectedIds)
                : "[]"
        )
    }'
    hx-headers='{"Content-Type": "application/json"}'
    hx-ext="json-enc"
    hx-indicator="#classify-spinner"
    hx-confirm="Secili anahtar kelimelerin niyetini AI ile siniflandirilsin mi?"
    hx-on::after-request="
        if (event.detail.successful) {
            // Basarili oldugunda tablo yenilenir
            htmx.trigger('#keyword-table-body', 'htmx:load');
        }
    "
>
    <span id="classify-spinner" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-brain mr-1"></i>
    Niyet Siniflandir
</button>
```

**Akis:**
1. Kullanici tabloda anahtar kelimeleri secer (checkbox).
2. Toolbar gorunur olur.
3. "Niyet Siniflandir" butonuna tiklar.
4. `hx-confirm` ile onay istenir.
5. HTMX POST gonderir, sunucu Celery task tetikler.
6. Sunucu guncellenmis tabloyu partial olarak doner.
7. IntentBadge'ler yeni niyet degerlerini gosterir.

**Onemli**: Buyuk batch'lerde (50+ kelime) islem birkaç saniye surebilir.
`hx-indicator` spinner gosterir. Sunucu tum siniflandirmalar tamamlandiginda
guncellenmis tablo HTML'ini doner.

---

## 3. Kume Olusturma (Asenkron Celery Task)

```html
<button
    class="btn-sm btn-secondary"
    hx-post="/api/v1/seo/keywords/cluster"
    hx-target="#cluster-result"
    hx-swap="innerHTML"
    hx-vals='js:{ "workspace_uid": "{{ workspace.uid }}" }'
    hx-headers='{"Content-Type": "application/json"}'
    hx-ext="json-enc"
    hx-indicator="#cluster-spinner"
>
    <span id="cluster-spinner" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-graph mr-1"></i>
    Kumele
</button>

<!-- Kumeleme sonucu (sunucu task_id + polling talimatini doner) -->
<div id="cluster-result">
</div>
```

### Kumeleme Ilerleme Polling

Sunucu 202 Accepted yaniti sonrasi, donen partial polling baslatir:

```html
<!-- Sunucu bu partial'i doner (cluster-result icine) -->
<div
    hx-get="/api/v1/seo/keywords/cluster/status/{{ task_id }}"
    hx-trigger="every 3s"
    hx-target="this"
    hx-swap="innerHTML"
>
    <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
        <i class="ph ph-spinner animate-spin text-blue-500"></i>
        <span class="text-sm text-blue-800">Kumeleme isleniyor...</span>
    </div>
</div>

<!-- Tamamlandiginda sunucu bu partial'i doner -->
<div class="p-4 bg-green-50 rounded-lg">
    <i class="ph ph-check-circle text-green-500"></i>
    <span class="text-sm text-green-800">{{ cluster_count }} kume olusturuldu.</span>
    <a href="/seo/keywords?view=clusters" class="text-sm text-primary-600 underline ml-2">
        Kumeleri Gor
    </a>
</div>
```

---

## 4. Siralama Grafigi Tarih Araligi Degisimi

```html
<div class="flex gap-2">
    {% for range_opt in ["7d", "30d", "90d"] %}
    <button
        class="btn-sm {{ 'btn-primary' if current_range == range_opt else 'btn-secondary' }}"
        hx-get="/api/v1/partials/seo/ranking-chart?range={{ range_opt }}"
        hx-target="#ranking-chart-container"
        hx-swap="innerHTML transition:true"
        hx-include="[name='keyword_ids'], [name='workspace'], [name='device']"
        hx-indicator="#ranking-chart-spinner"
    >
        {{ {"7d": "7 Gun", "30d": "30 Gun", "90d": "90 Gun"}[range_opt] }}
    </button>
    {% endfor %}
</div>

<!-- Cihaz secimi -->
<div class="flex gap-2">
    <button
        hx-get="/api/v1/partials/seo/ranking-chart?device=desktop"
        hx-target="#ranking-chart-container"
        hx-swap="innerHTML"
        hx-include="[name='keyword_ids'], [name='workspace'], [name='range']"
        class="btn-sm"
    >
        <i class="ph ph-desktop mr-1"></i> Masaustu
    </button>
    <button
        hx-get="/api/v1/partials/seo/ranking-chart?device=mobile"
        hx-target="#ranking-chart-container"
        hx-swap="innerHTML"
        hx-include="[name='keyword_ids'], [name='workspace'], [name='range']"
        class="btn-sm"
    >
        <i class="ph ph-device-mobile mr-1"></i> Mobil
    </button>
</div>

<div id="ranking-chart-container" class="relative">
    <div id="ranking-chart-spinner" class="htmx-indicator absolute inset-0 bg-white/60 flex items-center justify-center z-10">
        <i class="ph ph-spinner animate-spin text-2xl text-primary-500"></i>
    </div>
    {% include "modules/seo/partials/ranking-chart.html" %}
</div>
```

---

## 5. Denetim Tarami Baslat + Ilerleme Polling

```html
<!-- Denetim baslat butonu -->
<button
    class="btn-primary"
    hx-post="/api/v1/seo/audit/scan"
    hx-target="#audit-progress-container"
    hx-swap="innerHTML"
    hx-vals='js:{ "workspace_uid": "{{ workspace.uid }}", "max_pages": 100 }'
    hx-headers='{"Content-Type": "application/json", "Idempotency-Key": "{{ idempotency_key }}"}'
    hx-ext="json-enc"
    hx-indicator="#scan-start-spinner"
    hx-confirm="Site denetimi baslatilsin mi? Bu islem birkaç dakika surebilir."
>
    <span id="scan-start-spinner" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-magnifying-glass mr-1"></i>
    Denetim Baslat
</button>

<!-- Ilerleme container -->
<div id="audit-progress-container">
    <!-- Sunucu 202 dondukten sonra polling partial yukler -->
</div>
```

### Ilerleme Polling (Tarama Sirasinda)

```html
<!-- Sunucu bu partial'i doner -->
<div
    id="audit-polling"
    hx-get="/api/v1/seo/audit/{{ scan_uid }}/status"
    hx-trigger="every 2s"
    hx-target="this"
    hx-swap="innerHTML"
>
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-blue-800">Taraniyor...</span>
            <span class="text-sm text-blue-600">{{ pages_scanned }} / {{ total_pages }}</span>
        </div>
        <div class="w-full h-2 bg-blue-200 rounded-full">
            <div class="h-2 bg-blue-600 rounded-full transition-all duration-300"
                 style="width: {{ progress_pct }}%"></div>
        </div>
        <p class="mt-2 text-xs text-blue-500">
            Son taranan: {{ last_scanned_url }}
        </p>
    </div>
</div>

<!-- Tamamlandiginda sunucu bu partial'i doner (polling durur) -->
<div class="bg-green-50 border border-green-200 rounded-lg p-4">
    <div class="flex items-center gap-3">
        <i class="ph ph-check-circle text-green-600 text-xl"></i>
        <div>
            <p class="font-medium text-green-800">Denetim tamamlandi</p>
            <p class="text-sm text-green-600">
                {{ pages_scanned }} sayfa tarandi · Skor: {{ overall_score }}/100
            </p>
        </div>
        <a href="/seo/audit/{{ scan_uid }}" class="ml-auto btn-sm btn-primary">
            Sonuclari Gor
        </a>
    </div>
</div>
```

**Polling kurallari:**
- Aralik: 2 saniye (denetim aktifken hizli guncelleme).
- Durum `completed` veya `failed` oldugunda polling durur (sunucu `hx-trigger` gondermez, polling div'i yeni partial ile degistirilir).
- `failed` durumunda kirmizi hata mesaji gosterilir.

---

## 6. Backlink Tablosu Cursor Pagination

```html
<div id="backlink-table-container">
    <table>
        <thead>
            <tr>
                <th>Kaynak URL</th>
                <th>Hedef URL</th>
                <th>Anchor</th>
                <th>Tip</th>
                <th>DR</th>
                <th>Ilk Gorulen</th>
                <th>Durum</th>
            </tr>
        </thead>
        <tbody id="backlink-table-body">
            {% include "modules/seo/partials/backlink-table.html" %}
        </tbody>
    </table>

    {% if next_cursor %}
    <div
        id="backlink-load-more"
        hx-get="/api/v1/partials/seo/backlink-table?cursor={{ next_cursor }}&limit=25"
        hx-trigger="revealed"
        hx-target="this"
        hx-swap="outerHTML"
        hx-include="[name='rel_type'], [name='is_lost'], [name='workspace'], [name='sort']"
        hx-indicator="#backlink-load-spinner"
    >
        <div class="flex justify-center p-4">
            <span id="backlink-load-spinner" class="htmx-indicator">
                <i class="ph ph-spinner animate-spin mr-2"></i>
            </span>
            <span class="text-sm text-gray-500">Daha fazla yukle</span>
        </div>
    </div>
    {% endif %}
</div>
```

**Not**: `hx-trigger="revealed"` ile infinite scroll. Sunucu yeni satirlar + (varsa)
yeni `backlink-load-more` div'i doner.

---

## 7. SERP Ozellik Filtresi

```html
<div class="flex flex-wrap gap-2 mb-4">
    {% for feature_type in feature_types %}
    <button
        class="btn-sm {{ 'btn-primary' if current_feature == feature_type else 'btn-ghost' }}"
        hx-get="/api/v1/partials/seo/serp-features?feature={{ feature_type }}"
        hx-target="#serp-grid-container"
        hx-swap="innerHTML transition:true"
        hx-include="[name='workspace']"
    >
        <i class="ph {{ feature_icon_map[feature_type] }} mr-1"></i>
        {{ feature_label_map[feature_type] }}
        ({{ feature_counts[feature_type] }})
    </button>
    {% endfor %}
</div>

<div id="serp-grid-container">
    {% include "modules/seo/partials/serp-grid.html" %}
</div>
```

---

## 8. Denetim Sorunlari Kategori Filtre

```html
<div class="flex gap-2 border-b border-gray-200 mb-4">
    {% for cat in ["all", "meta", "heading", "image", "link", "speed", "schema", "security"] %}
    <button
        class="tab-button"
        hx-get="/api/v1/partials/seo/audit-issues?scan_id={{ scan.uid }}&category={{ cat }}"
        hx-target="#audit-issues-container"
        hx-swap="innerHTML"
        hx-include="[name='severity']"
        hx-indicator="#issues-spinner"
    >
        {{ category_label_map[cat] }}
        {% if cat != "all" %}({{ category_counts[cat] }}){% endif %}
    </button>
    {% endfor %}
</div>

<!-- Severity filtre -->
<div class="flex gap-2 mb-4">
    <label class="inline-flex items-center gap-1.5 text-sm">
        <input type="checkbox" name="severity" value="critical" checked
            hx-get="/api/v1/partials/seo/audit-issues?scan_id={{ scan.uid }}"
            hx-trigger="change"
            hx-target="#audit-issues-container"
            hx-swap="innerHTML"
            hx-include="[name='category'], [name='severity']"
        />
        <span class="text-red-600">Kritik</span>
    </label>
    <label class="inline-flex items-center gap-1.5 text-sm">
        <input type="checkbox" name="severity" value="warning" checked ... />
        <span class="text-yellow-600">Uyari</span>
    </label>
    <label class="inline-flex items-center gap-1.5 text-sm">
        <input type="checkbox" name="severity" value="info" checked ... />
        <span class="text-blue-600">Bilgi</span>
    </label>
</div>

<div id="audit-issues-container">
    {% include "modules/seo/partials/audit-issues.html" %}
</div>
```

---

## Endpoint -> Partial Ozet Tablosu

| Tetikleyici | HTTP | Endpoint | Partial | hx-target |
|-------------|------|----------|---------|-----------|
| Kelime arama/filtre | GET | `/api/v1/partials/seo/keyword-table` | keyword-table.html | `#keyword-table-body` |
| Niyet siniflandir | POST | `/api/v1/seo/keywords/classify` | keyword-table.html (guncellenmis) | `#keyword-table-body` |
| Kumele | POST | `/api/v1/seo/keywords/cluster` | cluster-progress.html | `#cluster-result` |
| Kume durumu | GET | `/api/v1/seo/keywords/cluster/status/{task_id}` | cluster-status.html | polling div |
| Siralama grafigi | GET | `/api/v1/partials/seo/ranking-chart` | ranking-chart.html | `#ranking-chart-container` |
| Denetim baslat | POST | `/api/v1/seo/audit/scan` | audit-progress.html | `#audit-progress-container` |
| Denetim durumu | GET | `/api/v1/seo/audit/{scan_id}/status` | audit-status.html | polling div |
| Denetim sorunlar | GET | `/api/v1/partials/seo/audit-issues` | audit-issues.html | `#audit-issues-container` |
| Backlink sayfalama | GET | `/api/v1/partials/seo/backlink-table` | backlink-table.html | `#backlink-load-more` |
| SERP filtre | GET | `/api/v1/partials/seo/serp-features` | serp-grid.html | `#serp-grid-container` |
| Kume bubble | GET | `/api/v1/partials/seo/cluster-bubble` | cluster-chart.html | `#cluster-chart-container` |
