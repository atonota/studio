# Module 05: workspace-manager — HTMX_MAP

> HTMX 2 endpoint -> partial HTML eslemesi. Her etkilesim icin hx-* attribute spesifikasyonu.

---

## 1. Grid / List Gorunum Gecisi

**Yontem**: Tamamen Alpine.js (server round-trip yok).

```html
<!-- Gorunum toggle butonlari -->
<div x-data="{ view: '{{ current_view }}' }">

    <button
        @click="view = 'grid'"
        :class="view === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'"
        class="p-2 rounded-lg"
    >
        <i class="ph ph-squares-four text-lg"></i>
    </button>

    <button
        @click="view = 'list'"
        :class="view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'"
        class="p-2 rounded-lg"
    >
        <i class="ph ph-list text-lg"></i>
    </button>

    <!-- Grid container -->
    <div x-show="view === 'grid'" id="workspace-grid-container">
        {% include "modules/workspace/partials/workspace-cards.html" %}
    </div>

    <!-- List container -->
    <div x-show="view === 'list'" id="workspace-list-container">
        {% include "modules/workspace/partials/workspace-grid.html" %}
    </div>
</div>
```

**Not**: Her iki partial da ilk sayfa yuklemesinde renderlanir. Alpine.js sadece `x-show` ile
gorunurlugu degistirir. Buyuk veri setlerinde sunucu tarafli gecis dusunulebilir.

---

## 2. Platform Oto-Tespiti (URL blur)

```html
<!-- URL input alani -->
<input
    type="url"
    name="url"
    x-model="url"
    placeholder="https://example.com"
    class="..."
    hx-post="/api/v1/workspaces/detect-platform"
    hx-trigger="blur changed delay:300ms"
    hx-target="#platform-detect-result"
    hx-swap="innerHTML"
    hx-indicator="#detect-spinner"
    hx-vals='js:{ "url": document.querySelector("[name=url]").value }'
    hx-headers='{"Content-Type": "application/json"}'
    hx-ext="json-enc"
/>

<!-- Loading indicator -->
<div id="detect-spinner" class="htmx-indicator">
    <i class="ph ph-spinner animate-spin text-primary-500"></i>
    Platform tespit ediliyor...
</div>

<!-- Sonuc container -->
<div id="platform-detect-result">
    <!-- Sunucu partials/platform-detect-result.html doner -->
</div>
```

### Sunucu Yaniti (Partial)

```
Endpoint  : POST /api/v1/workspaces/detect-platform
Response  : HTML fragment (platform-detect-result.html partial)
Headers   : HX-Trigger: platform-detected (Alpine event'i tetikler)

Basarili durumda partial icerigi:
  - Platform adi + versiyon
  - Guven orani (progress bar)
  - Tespit sinyalleri (liste)
  - "Onayla" + "Degistir" butonlari

Basarisiz durumda:
  - Uyari mesaji
  - Manuel secim yonlendirmesi
```

### Alpine.js Event Dinleyici

```html
<div
    x-data="{ ... }"
    @platform-detected.window="
        const event = $event.detail;
        if (event.platform_id) {
            platformId = event.platform_id;
            platformVersion = event.version || '';
        }
    "
>
```

---

## 3. Workspace Olusturma (Form Submit)

```html
<form
    hx-post="/api/v1/workspaces"
    hx-target="body"
    hx-swap="none"
    hx-headers='{"Content-Type": "application/json", "Idempotency-Key": "{{ idempotency_key }}"}'
    hx-ext="json-enc"
    hx-indicator="#create-spinner"
    hx-on::after-request="
        if (event.detail.successful) {
            const data = JSON.parse(event.detail.xhr.response);
            window.location.href = '/workspaces/' + data.uid;
        }
    "
    hx-on::response-error="
        const err = JSON.parse(event.detail.xhr.response);
        document.getElementById('form-error').textContent = err.detail;
        document.getElementById('form-error').classList.remove('hidden');
    "
>
    <!-- Form alanlari -->
    <input type="hidden" name="platform_id" x-model="platformId" />
    <input type="hidden" name="platform_version" x-model="platformVersion" />

    <button type="submit" class="w-full btn-primary">
        <span class="htmx-indicator" id="create-spinner">
            <i class="ph ph-spinner animate-spin"></i>
        </span>
        Workspace Olustur
    </button>
</form>

<!-- Hata mesaji -->
<div id="form-error" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
</div>
```

---

## 4. Adaptor Durum Listesi (Polling)

```html
<!-- Workspace detay sayfasinda adaptor durum listesi -->
<div
    id="adapter-status-list"
    hx-get="/workspaces/{{ workspace.uid }}/adapters"
    hx-trigger="load, every 60s"
    hx-target="this"
    hx-swap="innerHTML"
    hx-indicator="#adapter-refresh-spinner"
>
    {% include "modules/workspace/partials/workspace-adapters.html" %}
</div>

<span id="adapter-refresh-spinner" class="htmx-indicator text-xs text-gray-400">
    <i class="ph ph-arrows-clockwise animate-spin"></i> Guncelleniyor...
</span>
```

**Polling kurallari:**
- Varsayilan aralik: 60 saniye (`every 60s`)
- Sayfa gorunur degilken duraklar (HTMX default davranisi)
- Hata durumunda retry: 3 kez, sonra dur
- Basarili response: `HX-Trigger: adapter-status-refreshed` header'i gonderir

---

## 5. Cursor-Based Pagination (Daha Fazla Yukle)

```html
<!-- Workspace kartlari container -->
<div id="workspace-card-container">
    {% for workspace in workspaces %}
        {% include "modules/workspace/components/workspace-card.html" %}
    {% endfor %}

    <!-- Son karttan sonra "Daha Fazla Yukle" butonu -->
    {% if next_cursor %}
    <div id="load-more-trigger"
        hx-get="/api/v1/partials/workspace-list?cursor={{ next_cursor }}&limit=12"
        hx-trigger="revealed"
        hx-target="this"
        hx-swap="outerHTML"
        hx-indicator="#load-more-spinner"
    >
        <div class="flex justify-center p-8">
            <button class="btn-secondary">
                <span id="load-more-spinner" class="htmx-indicator">
                    <i class="ph ph-spinner animate-spin"></i>
                </span>
                Daha Fazla Yukle
            </button>
        </div>
    </div>
    {% endif %}
</div>
```

**Not**: `hx-trigger="revealed"` kullanici scroll ile butona ulastiginda otomatik tetikler
(infinite scroll). Sunucu yeni kartlar + (varsa) yeni `load-more-trigger` div'i doner.

---

## 6. Arama ve Filtreleme (Debounced)

```html
<!-- Arama input -->
<input
    type="search"
    name="q"
    placeholder="Site ara..."
    class="..."
    hx-get="/api/v1/partials/workspace-list"
    hx-trigger="input changed delay:400ms, search"
    hx-target="#workspace-card-container"
    hx-swap="innerHTML"
    hx-include="[name='status'], [name='platform']"
    hx-indicator="#search-spinner"
    hx-push-url="true"
/>

<!-- Platform filtresi -->
<select
    name="platform"
    class="..."
    hx-get="/api/v1/partials/workspace-list"
    hx-trigger="change"
    hx-target="#workspace-card-container"
    hx-swap="innerHTML"
    hx-include="[name='q'], [name='status']"
>
    <option value="">Tum Platformlar</option>
    {% for p in platforms %}
    <option value="{{ p.id }}">{{ p.name }}</option>
    {% endfor %}
</select>

<!-- Durum filtresi -->
<select
    name="status"
    class="..."
    hx-get="/api/v1/partials/workspace-list"
    hx-trigger="change"
    hx-target="#workspace-card-container"
    hx-swap="innerHTML"
    hx-include="[name='q'], [name='platform']"
>
    <option value="">Tum Durumlar</option>
    <option value="active">Aktif</option>
    <option value="pending">Bekliyor</option>
    <option value="paused">Duraklatildi</option>
    <option value="error">Hata</option>
</select>
```

**Onemli HTMX detaylari:**
- `hx-include`: Birden fazla filtre birlikte gonderilir.
- `delay:400ms`: Arama input'unda debounce (gereksiz istek onleme).
- `hx-push-url="true"`: Filtre parametreleri URL'ye yansir (bookmarkable).

---

## 7. Workspace Silme (Soft Delete)

```html
<!-- Silme onay modali -->
<div x-show="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900">Workspace'i Sil</h3>
        <p class="mt-2 text-sm text-gray-500">
            Bu islemi geri alamazsiniz. Workspace ve tum bagli veriler kaldirilacak.
        </p>
        <div class="mt-4 flex gap-3">
            <button
                @click="confirmDelete = false"
                class="btn-secondary flex-1"
            >
                Vazgec
            </button>
            <button
                class="btn-danger flex-1"
                hx-delete="/api/v1/workspaces/{{ workspace.uid }}"
                hx-target="closest .workspace-card"
                hx-swap="outerHTML swap:300ms"
                hx-confirm="skip"
                hx-headers='{"Content-Type": "application/json"}'
                @click="confirmDelete = false"
            >
                Sil
            </button>
        </div>
    </div>
</div>
```

**Not**: `hx-swap="outerHTML swap:300ms"` silinen karti fade-out animasyonu ile kaldirir.
Sunucu `204 No Content` + bos body doner. Soft delete: sunucu `deleted_at` gunceller.

---

## Endpoint -> Partial Ozet Tablosu

| Tetikleyici | HTTP | Endpoint | Partial Template | hx-target |
|-------------|------|----------|-----------------|-----------|
| Sayfa yukleme | GET | `/workspaces` | Full page | - |
| Grid pagination | GET | `/api/v1/partials/workspace-list` | workspace-cards.html | `#workspace-card-container` |
| Liste pagination | GET | `/api/v1/partials/workspace-grid` | workspace-grid.html | `#workspace-list-container` |
| URL blur | POST | `/api/v1/workspaces/detect-platform` | platform-detect-result.html | `#platform-detect-result` |
| Adaptor polling | GET | `/workspaces/{uid}/adapters` | workspace-adapters.html | `#adapter-status-list` |
| Form submit | POST | `/api/v1/workspaces` | JSON (redirect) | `body` |
| Arama/filtre | GET | `/api/v1/partials/workspace-list` | workspace-cards.html | `#workspace-card-container` |
| Silme | DELETE | `/api/v1/workspaces/{uid}` | bos (204) | `.workspace-card` |
