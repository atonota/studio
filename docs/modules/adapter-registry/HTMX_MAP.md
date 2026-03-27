# Module 06: adapter-registry — HTMX_MAP

> HTMX 2 endpoint -> partial HTML eslemesi. Her etkilesim icin hx-* attribute spesifikasyonu.

---

## 1. Katalog Filtreleme (Kategori, Durum, Arama)

```html
<!-- Kategori tab bar -->
<div class="flex gap-2 border-b border-gray-200">
    {% for cat in categories %}
    <button
        class="tab-button"
        hx-get="/api/v1/partials/adapter-catalog?category={{ cat.id }}"
        hx-target="#adapter-grid-container"
        hx-swap="innerHTML"
        hx-indicator="#catalog-spinner"
        hx-include="[name='q'], [name='connected']"
    >
        {{ cat.name }} ({{ cat.count }})
    </button>
    {% endfor %}
</div>

<!-- Arama input -->
<input
    type="search"
    name="q"
    placeholder="Platform ara..."
    class="..."
    hx-get="/api/v1/partials/adapter-catalog"
    hx-trigger="input changed delay:300ms, search"
    hx-target="#adapter-grid-container"
    hx-swap="innerHTML"
    hx-indicator="#catalog-spinner"
    hx-include="[name='category'], [name='connected']"
/>

<!-- Baglanti filtresi -->
<select
    name="connected"
    class="..."
    hx-get="/api/v1/partials/adapter-catalog"
    hx-trigger="change"
    hx-target="#adapter-grid-container"
    hx-swap="innerHTML"
    hx-include="[name='q'], [name='category']"
>
    <option value="">Tum Adaptorler</option>
    <option value="true">Sadece Bagli</option>
    <option value="false">Sadece Bagli Degil</option>
</select>

<!-- Grid container -->
<div id="adapter-grid-container">
    {% include "modules/adapter/partials/adapter-grid.html" %}
</div>

<!-- Loading spinner -->
<div id="catalog-spinner" class="htmx-indicator text-center py-8">
    <i class="ph ph-spinner animate-spin text-2xl text-primary-500"></i>
</div>
```

**Onemli**: `hx-include` ile tum filtreler birlikte gonderilir. `delay:300ms` arama debounce'u.

---

## 2. Health Status Polling (30 saniye aralik)

```html
<!-- Saglik panosu sayfasinda tum adaptorler icin durum -->
<div
    id="health-status-container"
    hx-get="/adapters/health"
    hx-trigger="every 30s"
    hx-target="#health-table-body"
    hx-swap="innerHTML"
    hx-select="#health-table-body-content"
    hx-indicator="#health-refresh-indicator"
>
    <!-- KPI satirlari -->
    <div
        id="health-kpi-row"
        hx-get="/api/v1/partials/adapter-health-kpi"
        hx-trigger="every 30s"
        hx-target="this"
        hx-swap="innerHTML"
    >
        {% include "modules/adapter/partials/health-kpi.html" %}
    </div>

    <!-- Durum tablosu -->
    <table>
        <thead>...</thead>
        <tbody id="health-table-body">
            <div id="health-table-body-content">
                {% for conn in connections %}
                <tr>
                    <td>{{ conn.platform_name }}</td>
                    <td>{{ conn.workspace_name }}</td>
                    <td>{% include "modules/adapter/components/status-badge.html" %}</td>
                    <td>{{ conn.uptime_7d }}%</td>
                    <td>{{ conn.avg_latency_ms }}ms</td>
                </tr>
                {% endfor %}
            </div>
        </tbody>
    </table>
</div>

<span id="health-refresh-indicator" class="htmx-indicator text-xs text-gray-400">
    <i class="ph ph-arrows-clockwise animate-spin"></i>
</span>
```

**Polling kurallari:**
- Aralik: 30 saniye (`every 30s`)
- Sayfa gorunur degilken duraklar (HTMX 2 default)
- Sunucu `304 Not Modified` donebilir (cache header)
- Kritik durum degisikliginde `HX-Trigger: health-alert` header'i tetiklenir

---

## 3. Dinamik Credential Form Yukleme (Platform Secimi)

```html
<!-- Connect wizard: platform secildikten sonra -->
<div
    x-data="{ selectedPlatform: '' }"
    class="..."
>
    <!-- Platform secim kartlari -->
    <div class="grid grid-cols-4 gap-4">
        {% for adapter in adapters %}
        <button
            type="button"
            class="..."
            :class="selectedPlatform === '{{ adapter.platform_id }}' ? 'border-primary-500 bg-primary-50' : ''"
            @click="selectedPlatform = '{{ adapter.platform_id }}'"
            hx-get="/api/v1/partials/adapter-credential-form/{{ adapter.platform_id }}"
            hx-target="#credential-form-container"
            hx-swap="innerHTML transition:true"
            hx-trigger="click"
            hx-indicator="#form-loading"
        >
            {% include "modules/adapter/components/platform-icon.html" %}
            <span>{{ adapter.platform_name }}</span>
        </button>
        {% endfor %}
    </div>

    <!-- Loading -->
    <div id="form-loading" class="htmx-indicator py-8 text-center">
        <i class="ph ph-spinner animate-spin text-xl"></i>
        <p class="text-sm text-gray-500 mt-2">Form yukleniyor...</p>
    </div>

    <!-- Dinamik credential form alani -->
    <div id="credential-form-container" class="mt-6">
        <!-- Platform secilince sunucu dinamik form partial doner -->
        <p class="text-gray-400 text-sm text-center py-8">
            Baglanti bilgilerini girmek icin bir platform secin.
        </p>
    </div>
</div>
```

**Onemli**: Her platform seciminde sunucu `config_schema` JSONB alanindaki JSON Schema'ya gore
ozel bir form HTML'i render eder. OAuth2 platformlari icin yetkilendirme butonu, API key
platformlari icin input alanlari doner.

---

## 4. Baglanti Testi (Loading State)

```html
<!-- Her baglanti satiri icin test butonu -->
<button
    class="btn-secondary btn-sm"
    hx-post="/api/v1/adapters/{{ connection.uid }}/test"
    hx-target="#test-result-{{ connection.uid }}"
    hx-swap="innerHTML"
    hx-indicator="#test-spinner-{{ connection.uid }}"
    hx-disabled-elt="this"
>
    <span id="test-spinner-{{ connection.uid }}" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin mr-1"></i>
    </span>
    <i class="ph ph-plugs-connected mr-1"></i>
    Test
</button>

<!-- Sonuc alani (satir icinde) -->
<div id="test-result-{{ connection.uid }}" class="mt-1">
    <!-- Sunucu test sonucu partial doner -->
</div>
```

### Sunucu Test Sonucu Partial

```html
<!-- Basarili -->
<div class="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded px-3 py-1.5">
    <i class="ph ph-check-circle"></i>
    <span>Baglanti basarili — {{ latency_ms }}ms</span>
</div>

<!-- Hata -->
<div class="flex items-center gap-2 text-sm text-red-700 bg-red-50 rounded px-3 py-1.5">
    <i class="ph ph-warning-circle"></i>
    <span>{{ error_code }}: {{ error_detail }}</span>
    <a href="/adapters/{{ uid }}" class="underline ml-2">Credential'lari Guncelle</a>
</div>
```

**HTMX detaylari:**
- `hx-disabled-elt="this"`: Test calisirken buton disable olur.
- Sunucu `HX-Trigger: test-completed` header'i ile ilgili satirin durum badge'ini guncelleyebilir.

---

## 5. Health Timeline Zaman Araligi Degisimi

```html
<!-- Adaptor detay sayfasi: timeline range butonlari -->
<div class="flex gap-2">
    {% for range_opt in ["1d", "7d", "30d"] %}
    <button
        class="btn-sm"
        hx-get="/api/v1/partials/adapter-health-timeline/{{ connection.uid }}?range={{ range_opt }}"
        hx-target="#health-timeline-container"
        hx-swap="innerHTML"
        hx-indicator="#timeline-loading"
    >
        {{ {"1d": "1 Gun", "7d": "7 Gun", "30d": "30 Gun"}[range_opt] }}
    </button>
    {% endfor %}
</div>

<div id="timeline-loading" class="htmx-indicator absolute inset-0 bg-white/50 flex items-center justify-center">
    <i class="ph ph-spinner animate-spin text-xl"></i>
</div>

<div id="health-timeline-container" class="relative">
    {% include "modules/adapter/partials/health-timeline.html" %}
</div>
```

---

## 6. Wizard Adim Gecisleri

```html
<!-- Connect wizard multi-step -->
<div x-data="{ step: 1, maxStep: 4 }">

    <!-- Adim 1: Workspace Secimi -->
    <div x-show="step === 1">
        <select
            name="workspace_uid"
            class="..."
            x-model="selectedWorkspace"
        >
            {% for ws in workspaces %}
            <option value="{{ ws.uid }}">{{ ws.name }} — {{ ws.url }}</option>
            {% endfor %}
        </select>

        <button @click="step = 2" :disabled="!selectedWorkspace" class="btn-primary">
            Devam Et <i class="ph ph-arrow-right ml-1"></i>
        </button>
    </div>

    <!-- Adim 2: Platform Secimi (HTMX ile credential form yukler) -->
    <div x-show="step === 2">
        <!-- Yukari bakini: "Dinamik Credential Form Yukleme" bolumleri -->
        <button @click="step = 1" class="btn-secondary">
            <i class="ph ph-arrow-left mr-1"></i> Geri
        </button>
        <button @click="step = 3" :disabled="!selectedPlatform" class="btn-primary">
            Devam Et <i class="ph ph-arrow-right ml-1"></i>
        </button>
    </div>

    <!-- Adim 3: Credential Giris (dinamik form, HTMX ile yuklendi) -->
    <div x-show="step === 3">
        <div id="credential-form-container">
            <!-- Platform secildiginde HTMX ile yuklenir -->
        </div>
        <button @click="step = 2" class="btn-secondary">Geri</button>
        <button @click="step = 4" class="btn-primary">Baglantiyi Test Et</button>
    </div>

    <!-- Adim 4: Test + Onay -->
    <div x-show="step === 4">
        <!-- ConnectionTestButton component kullanilir -->
        <button @click="step = 3" class="btn-secondary">Geri</button>
        <button
            class="btn-primary"
            hx-post="/api/v1/adapter-connections"
            hx-headers='{"Content-Type": "application/json"}'
            hx-ext="json-enc"
            hx-vals='js:getConnectionFormData()'
            hx-on::after-request="if(event.detail.successful) window.location.href='/adapters'"
        >
            Baglantiyi Kaydet
        </button>
    </div>
</div>
```

**Not**: Wizard adimlari Alpine.js ile kontrol edilir (client-side, server round-trip yok).
Sadece credential form yukleme ve baglanti testi HTMX ile yapilir.

---

## Endpoint -> Partial Ozet Tablosu

| Tetikleyici | HTTP | Endpoint | Partial Template | hx-target |
|-------------|------|----------|-----------------|-----------|
| Filtre/arama | GET | `/api/v1/partials/adapter-catalog` | adapter-grid.html | `#adapter-grid-container` |
| Timeline range | GET | `/api/v1/partials/adapter-health-timeline/{uid}` | health-timeline.html | `#health-timeline-container` |
| Platform sec | GET | `/api/v1/partials/adapter-credential-form/{platform}` | credential-form.html | `#credential-form-container` |
| Baglanti testi | POST | `/api/v1/adapters/{uid}/test` | connection-test-result.html | `#test-result-{uid}` |
| Health polling | GET | `/adapters/health` (select) | health table body | `#health-table-body` |
| Baglanti kaydet | POST | `/api/v1/adapter-connections` | JSON (redirect) | - |
