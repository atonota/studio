# Module 06: adapter-registry — COMPONENTS

> Her component Jinja2 macro + Alpine.js x-data ile tanimlanir.
> Flowbite Pro CDN + Tailwind CDN + Phosphor Icons CDN kullanilir.

---

## 1. AdapterCard

Adaptor katalogu grid gorunumunde her platform icin bir kart.

```
Dosya     : templates/modules/adapter/components/adapter-card.html
Jinja2    : {% macro adapter_card(adapter) %}
Boyut     : ~220px x auto (~200px), grid-cols-4 responsive
```

### Jinja2 Macro Parametreleri

```python
adapter: AdapterCatalogResponse
  .uid              : UUID
  .platform_id      : str
  .platform_name    : str
  .category         : str           # "cms" | "analytics" | "ads" | "crm" | "ecommerce"
  .icon_url         : str | None
  .auth_type        : str           # "oauth2" | "api_key" | "basic" | "webhook"
  .supported_modules: list[str]
  .status           : str           # "active" | "beta" | "deprecated"
  .is_connected     : bool
  .connection_count : int | None    # bagli workspace sayisi
```

### Alpine.js State

```javascript
x-data="{
    hover: false
}"
```

### Tailwind Siniflari

```
Container   : bg-white border border-gray-200 rounded-lg p-4
              hover:border-primary-300 hover:shadow-sm transition-all duration-200
              dark:bg-gray-800 dark:border-gray-700
Icon        : w-12 h-12 rounded-lg object-contain
Platform ad : text-base font-semibold text-gray-900 dark:text-white mt-3
Kategori    : inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
              cms:       bg-blue-100 text-blue-800
              analytics: bg-purple-100 text-purple-800
              ads:       bg-orange-100 text-orange-800
              crm:       bg-teal-100 text-teal-800
              ecommerce: bg-pink-100 text-pink-800
Auth tipi   : inline-flex items-center px-2 py-0.5 text-xs rounded-full
              bg-gray-100 text-gray-600
Status badge: (beta) bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded
              (deprecated) bg-red-100 text-red-800
Baglanti    : connected: text-green-600 · not: text-gray-400
CTA buton   : connected: btn-secondary "Detay" · not: btn-primary "Baglan"
```

---

## 2. HealthTimeline

ECharts line chart ile health check gecmisi gosterimi.

```
Dosya     : templates/modules/adapter/components/health-timeline-chart.html
Jinja2    : {% macro health_timeline(connection_uid, health_data, range) %}
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('health-timeline-{{ connection_uid }}'));
chart.setOption({
    tooltip: {
        trigger: 'axis',
        formatter: function(params) {
            const d = params[0];
            return `${d.axisValue}<br/>
                    Latency: ${d.value}ms<br/>
                    Durum: ${d.data.status === 'ok' ? '✓ OK' : '✗ Hata'}`;
        }
    },
    xAxis: {
        type: 'time',
        axisLabel: { formatter: '{HH}:{mm}' }
    },
    yAxis: {
        type: 'value',
        name: 'Latency (ms)',
        min: 0
    },
    visualMap: {
        show: false,
        pieces: [
            { lte: 200, color: '#10B981' },   // emerald-500 (iyi)
            { gt: 200, lte: 500, color: '#F59E0B' }, // amber-500 (orta)
            { gt: 500, color: '#EF4444' }      // red-500 (kotu)
        ]
    },
    series: [{
        type: 'line',
        data: {{ health_data | tojson }},
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: { opacity: 0.1 },
        markLine: {
            data: [
                { yAxis: 200, name: 'Hedef (200ms)', lineStyle: { color: '#9CA3AF', type: 'dashed' } }
            ]
        }
    }]
});
window.addEventListener('resize', () => chart.resize());
```

### Boyut

```
Container : w-full h-80 (320px yukseklik)
Responsive: chart.resize() window resize event'inde
```

---

## 3. LatencyChart

Son 24 saat / 7 gun / 30 gun icin latency dagilimi bar chart.

```
Dosya     : templates/modules/adapter/components/latency-chart.html
Jinja2    : {% macro latency_chart(connection_uid, latency_data) %}
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('latency-chart-{{ connection_uid }}'));
chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
        type: 'category',
        data: {{ latency_data.labels | tojson }}  // saat veya gun etiketleri
    },
    yAxis: {
        type: 'value',
        name: 'ms'
    },
    series: [
        {
            name: 'p50',
            type: 'bar',
            data: {{ latency_data.p50 | tojson }},
            itemStyle: { color: '#10B981' }
        },
        {
            name: 'p95',
            type: 'bar',
            data: {{ latency_data.p95 | tojson }},
            itemStyle: { color: '#F59E0B' }
        },
        {
            name: 'p99',
            type: 'bar',
            data: {{ latency_data.p99 | tojson }},
            itemStyle: { color: '#EF4444' }
        }
    ]
});
```

---

## 4. CredentialForm (Dinamik, Platform Bazli)

Platform'a gore dinamik olusturulan credential giris formu.

```
Dosya     : templates/modules/adapter/components/credential-form-dynamic.html
Jinja2    : {% macro credential_form(platform_id, config_schema) %}
```

### Alpine.js State

```javascript
x-data="{
    formData: {},
    authMethod: 'api_key',
    showPassword: false,
    testing: false,
    testResult: null,
    init() {
        // config_schema'dan default degerleri set et
        const schema = {{ config_schema | tojson }};
        Object.keys(schema.properties || {}).forEach(key => {
            this.formData[key] = schema.properties[key].default || '';
        });
    },
    togglePassword() {
        this.showPassword = !this.showPassword;
    }
}"
```

### Dinamik Form Olusturma

```
config_schema ornek (WordPress):
{
    "type": "object",
    "properties": {
        "auth_method": {
            "type": "string",
            "enum": ["application_password", "jwt"],
            "title": "Kimlik Dogrulama Yontemi",
            "default": "application_password"
        },
        "username": {
            "type": "string",
            "title": "Kullanici Adi",
            "required": true
        },
        "password": {
            "type": "string",
            "title": "Application Password",
            "format": "password",
            "required": true
        }
    }
}

Jinja2 dongusu ile form alanlari olusturulur:
  string          -> <input type="text">
  string+password -> <input type="password"> + goster/gizle toggle
  string+enum     -> <select> veya radio group
  boolean         -> <input type="checkbox">
  string+oauth2   -> OAuth yetkilendirme butonu
```

---

## 5. ConnectionTestButton

Baglanti testi baslatan ve sonucu gosteren buton + inline feedback.

```
Dosya     : templates/modules/adapter/components/connection-test-button.html
Jinja2    : {% macro connection_test_button(connection_uid) %}
```

### Alpine.js State

```javascript
x-data="{
    testing: false,
    result: null,
    async runTest() {
        this.testing = true;
        this.result = null;
        // HTMX post tetikler, sonuc Alpine state'e yazilir
    }
}"
```

### HTMX Entegrasyonu

```html
<button
    class="btn-secondary"
    hx-post="/api/v1/adapters/{{ connection_uid }}/test"
    hx-target="#test-result-{{ connection_uid }}"
    hx-swap="innerHTML"
    hx-indicator="#test-spinner-{{ connection_uid }}"
    :disabled="testing"
>
    <span id="test-spinner-{{ connection_uid }}" class="htmx-indicator">
        <i class="ph ph-spinner animate-spin"></i>
    </span>
    <i class="ph ph-plugs-connected" x-show="!testing"></i>
    Baglanti Testi
</button>

<div id="test-result-{{ connection_uid }}" class="mt-2">
    <!-- Sunucu partial doner: basarili (yesil) veya hata (kirmizi) -->
</div>
```

### Sonuc Durumlari

| Durum | Gorunum |
|-------|---------|
| ok | `bg-green-50 border-green-200`: "Baglanti basarili (142ms)" + check ikonu |
| error | `bg-red-50 border-red-200`: Hata kodu + detay + "Credential'lari Guncelle" linki |
| timeout | `bg-yellow-50 border-yellow-200`: "Zaman asimi (10sn)" + "Tekrar Dene" butonu |

---

## 6. PlatformIcon

Platform ikonu gosterimi (CDN veya fallback).

```
Dosya     : templates/modules/adapter/components/platform-icon.html
Jinja2    : {% macro platform_icon(platform_id, icon_url, size="md") %}
```

### Boyut Varyantlari

| Varyant | size | Tailwind |
|---------|------|----------|
| sm | "sm" | w-6 h-6 |
| md | "md" | w-10 h-10 |
| lg | "lg" | w-16 h-16 |

### Fallback

```html
{% if icon_url %}
    <img src="{{ icon_url }}" alt="{{ platform_id }}" class="w-{{ size_map[size] }} h-{{ size_map[size] }} rounded-lg object-contain" />
{% else %}
    <!-- Fallback: platform_id'nin ilk 2 harfi -->
    <div class="w-{{ size_map[size] }} h-{{ size_map[size] }} rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
        <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
            {{ platform_id[:2] }}
        </span>
    </div>
{% endif %}
```

---

## 7. StatusBadge

Adaptor baglanti durumu badge'i (genel amacli, baska modullerde de kullanilabilir).

```
Dosya     : templates/modules/adapter/components/status-badge.html
Jinja2    : {% macro status_badge(status, label=None) %}
```

### Varyantlar

| Status | Label | Tailwind |
|--------|-------|----------|
| connected / ok | Bagli | `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400` |
| pending | Bekliyor | `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400` |
| error | Hata | `bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400` |
| expired | Suresi Doldu | `bg-orange-100 text-orange-800` |
| disconnected | Bagli Degil | `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400` |
| timeout | Zaman Asimi | `bg-purple-100 text-purple-800` |

### Ortak Yapisi

```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full {{ color_classes }}">
    <span class="w-1.5 h-1.5 rounded-full {{ dot_color }}"></span>
    {{ label or status_label_map[status] }}
</span>
```
