# Module 07: seo-intelligence — COMPONENTS

> Her component Jinja2 macro + Alpine.js x-data ile tanimlanir.
> ECharts 5 CDN grafik component'leri icin kullanilir. Bundler YOK.

---

## 1. KeywordTable

Anahtar kelime listesi tablosu. Siralama, filtreleme, toplu secim ve sayfalama destekler.

```
Dosya     : templates/modules/seo/components/keyword-table.html
Jinja2    : {% macro keyword_table(keywords, next_cursor, total_count) %}
```

### Alpine.js State

```javascript
x-data="{
    selectedIds: [],
    selectAll: false,
    sortField: 'volume',
    sortDir: 'desc',
    get hasSelection() { return this.selectedIds.length > 0; },
    toggleAll() {
        if (this.selectAll) {
            this.selectedIds = [];
        } else {
            this.selectedIds = [...document.querySelectorAll('[data-keyword-id]')]
                .map(el => parseInt(el.dataset.keywordId));
        }
        this.selectAll = !this.selectAll;
    },
    toggleRow(id) {
        const idx = this.selectedIds.indexOf(id);
        if (idx > -1) this.selectedIds.splice(idx, 1);
        else this.selectedIds.push(id);
    }
}"
```

### Kolon Yapisi

| Kolon | Genislik | Component | Siralama |
|-------|----------|-----------|----------|
| Checkbox | w-4 | `<input type="checkbox">` | - |
| Anahtar Kelime | flex-1 | Text + kume linki | keyword_asc / keyword_desc |
| Niyet | w-24 | IntentBadge | intent |
| Hacim | w-20 | Sayi (formatted) | volume_asc / volume_desc |
| Zorluk | w-28 | DifficultyBar | difficulty_asc / difficulty_desc |
| CPC | w-16 | Para birimi | cpc_asc / cpc_desc |
| Trend | w-16 | TrendSparkline | - |

### Kolon Baslik Siralama

```html
<th>
    <button
        class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
        hx-get="/api/v1/partials/seo/keyword-table?sort={{ new_sort }}"
        hx-target="#keyword-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='intent'], [name='workspace']"
    >
        Hacim
        <i class="ph ph-caret-up-down text-gray-400"
           :class="sortField === 'volume' ? 'text-primary-500' : ''"></i>
    </button>
</th>
```

---

## 2. IntentBadge

Anahtar kelime arama niyeti badge'i.

```
Dosya     : templates/modules/seo/components/intent-badge.html
Jinja2    : {% macro intent_badge(intent, confidence=None) %}
```

### Varyantlar

| Niyet | Label | Ikon | Tailwind Sinifi |
|-------|-------|------|-----------------|
| informational | Bilgi | `ph-info` | `bg-blue-100 text-blue-800 dark:bg-blue-900/30` |
| commercial | Ticari | `ph-shopping-cart` | `bg-purple-100 text-purple-800 dark:bg-purple-900/30` |
| transactional | Islem | `ph-credit-card` | `bg-green-100 text-green-800 dark:bg-green-900/30` |
| navigational | Gezinme | `ph-compass` | `bg-orange-100 text-orange-800 dark:bg-orange-900/30` |
| null | Belirsiz | `ph-question` | `bg-gray-100 text-gray-500` |

### HTML Yapisi

```html
<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full {{ color_class }}">
    <i class="ph {{ icon_class }}"></i>
    {{ label }}
    {% if confidence %}
    <span class="text-xs opacity-60">%{{ (confidence * 100) | int }}</span>
    {% endif %}
</span>
```

---

## 3. ClusterBubbleChart

ECharts scatter/bubble chart ile konu kumesi gorsellemesi.

```
Dosya     : templates/modules/seo/components/cluster-bubble-chart.html
Jinja2    : {% macro cluster_bubble_chart(chart_id, bubble_data) %}
Boyut     : w-full h-96 (384px)
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));

// Niyet renk haritasi
const intentColors = {
    informational: '#3B82F6',  // blue-500
    commercial: '#8B5CF6',     // violet-500
    transactional: '#10B981',  // emerald-500
    navigational: '#F97316'    // orange-500
};

chart.setOption({
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            return `<b>${params.data[3]}</b><br/>
                    Hacim: ${params.data[0].toLocaleString()}<br/>
                    Zorluk: ${params.data[1]}<br/>
                    CPC: $${params.data[2]}<br/>
                    Niyet: ${params.data[4]}`;
        }
    },
    xAxis: {
        name: 'Arama Hacmi',
        type: 'value',
        nameLocation: 'center',
        nameGap: 30
    },
    yAxis: {
        name: 'Zorluk',
        type: 'value',
        max: 100,
        nameLocation: 'center',
        nameGap: 40
    },
    series: [{
        type: 'scatter',
        symbolSize: function(data) {
            return Math.max(8, Math.sqrt(data[2] * 100));  // CPC bazli boyut
        },
        data: {{ bubble_data | tojson }},
        // data format: [volume, difficulty, cpc, keyword, intent]
        itemStyle: {
            color: function(params) {
                return intentColors[params.data[4]] || '#9CA3AF';
            },
            opacity: 0.8
        },
        emphasis: {
            itemStyle: { opacity: 1, borderColor: '#1F2937', borderWidth: 2 }
        }
    }]
});
window.addEventListener('resize', () => chart.resize());
```

---

## 4. RankingLineChart

Coklu anahtar kelime siralama takibi cizgi grafigi.

```
Dosya     : templates/modules/seo/components/ranking-line-chart.html
Jinja2    : {% macro ranking_line_chart(chart_id, ranking_data) %}
Boyut     : w-full h-80 (320px)
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));

const colors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#EF4444',
                '#14B8A6', '#F59E0B', '#EC4899', '#6366F1', '#84CC16'];

chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
        data: {{ ranking_data.keywords | tojson }},
        bottom: 0
    },
    xAxis: {
        type: 'time',
        axisLabel: { formatter: '{d} {MMM}' }
    },
    yAxis: {
        type: 'value',
        name: 'Pozisyon',
        inverse: true,       // 1 ustte (en iyi pozisyon)
        min: 1,
        max: function(value) { return Math.max(value.max + 5, 30); }
    },
    series: {{ ranking_data.series | tojson }}
    // Her serie: { name: keyword, type: 'line', data: [[date, position], ...], smooth: true }
});
window.addEventListener('resize', () => chart.resize());
```

**Onemli**: Y-ekseni `inverse: true` ile ters cevirilir cunku pozisyon 1 en iyisidir.

---

## 5. PositionHeatmap

Pozisyon dagilim heatmap'i (haftalik).

```
Dosya     : templates/modules/seo/components/position-heatmap.html
Jinja2    : {% macro position_heatmap(chart_id, heatmap_data) %}
Boyut     : w-full h-48 (192px)
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));
chart.setOption({
    tooltip: {
        position: 'top',
        formatter: function(params) {
            return `${params.data[1]} hafta: ${params.data[0]} araliginda ${params.data[2]} kelime`;
        }
    },
    xAxis: {
        type: 'category',
        data: ['1-3', '4-10', '11-20', '21-50', '50+'],
        name: 'Pozisyon Araligi'
    },
    yAxis: {
        type: 'category',
        data: {{ heatmap_data.weeks | tojson }},    // ['Hafta 1', 'Hafta 2', ...]
        name: 'Hafta'
    },
    visualMap: {
        min: 0,
        max: {{ heatmap_data.max_value }},
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
            color: ['#FEF3C7', '#F59E0B', '#D97706', '#92400E']  // amber skalasi
        }
    },
    series: [{
        type: 'heatmap',
        data: {{ heatmap_data.values | tojson }},
        label: { show: true, fontSize: 10 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
});
```

---

## 6. AuditScoreGauge

Site denetim skoru gauge widget (HealthScoreGauge'a benzer ama SEO'ya ozel).

```
Dosya     : templates/modules/seo/components/audit-score-gauge.html
Jinja2    : {% macro audit_score_gauge(score, previous_score=None, size="lg") %}
Boyut     : sm: 80x80, md: 160x160, lg: 240x240
```

### ECharts Konfigurasyonu

```javascript
const gauge = echarts.init(document.getElementById('audit-gauge'));
gauge.setOption({
    series: [{
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
            lineStyle: {
                width: 16,
                color: [
                    [0.4, '#EF4444'],
                    [0.7, '#F59E0B'],
                    [0.9, '#10B981'],
                    [1.0, '#059669']    // emerald-600 (mukemmel)
                ]
            }
        },
        pointer: { width: 5, length: '60%' },
        detail: {
            fontSize: 36,
            fontWeight: 'bold',
            formatter: '{value}',
            offsetCenter: [0, '60%']
        },
        title: {
            show: true,
            offsetCenter: [0, '80%'],
            text: '/ 100',
            fontSize: 14,
            color: '#9CA3AF'
        },
        data: [{ value: {{ score if score is not none else 0 }} }]
    }]
});
```

### Onceki Donemle Karsilastirma

```html
{% if previous_score is not none %}
<div class="text-center mt-2 text-sm">
    {% if score > previous_score %}
        <span class="text-green-600">
            <i class="ph ph-trend-up"></i> +{{ score - previous_score }} onceki doneme gore
        </span>
    {% elif score < previous_score %}
        <span class="text-red-600">
            <i class="ph ph-trend-down"></i> {{ score - previous_score }} onceki doneme gore
        </span>
    {% else %}
        <span class="text-gray-500">Degisim yok</span>
    {% endif %}
</div>
{% endif %}
```

---

## 7. AuditIssueCard

Denetim sorunu kart component'i. AI aciklamasi ve onceliklendirme icerir.

```
Dosya     : templates/modules/seo/components/audit-issue-card.html
Jinja2    : {% macro audit_issue_card(issue) %}
```

### Jinja2 Parametreleri

```python
issue: AuditIssueResponse
  .id              : int
  .category        : str
  .severity        : str           # critical | warning | info
  .title           : str
  .description     : str | None
  .affected_url    : str | None
  .ai_explanation  : str | None
  .ai_priority     : int | None   # 1-10
  .ai_effort       : str | None   # low | medium | high
  .ai_suggestion   : str | None
```

### Alpine.js State

```javascript
x-data="{
    expanded: false
}"
```

### Tailwind Siniflari

```
Container (severity bazli sol border):
  critical : border-l-4 border-l-red-500 bg-white rounded-lg shadow-sm p-4 mb-3
  warning  : border-l-4 border-l-yellow-500 bg-white rounded-lg shadow-sm p-4 mb-3
  info     : border-l-4 border-l-blue-500 bg-white rounded-lg shadow-sm p-4 mb-3

Severity badge:
  critical : bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded
  warning  : bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded
  info     : bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded

Priority skor : text-sm font-semibold (renk: 8-10 red, 5-7 yellow, 1-4 green)
Efor badge    : low: bg-green-100, medium: bg-yellow-100, high: bg-red-100

AI aciklama   : mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100
                text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300
AI oneri      : mt-2 p-3 bg-primary-50 rounded-lg border border-primary-100
                text-sm text-primary-800
```

---

## 8. BacklinkTable

Backlink listesi tablosu.

```
Dosya     : templates/modules/seo/components/backlink-table.html
Jinja2    : {% macro backlink_table(backlinks, next_cursor) %}
```

### Kolon Yapisi

| Kolon | Genislik | Icerik |
|-------|----------|--------|
| Kaynak URL | flex-1 | Truncated URL + domain gorunumu |
| Hedef URL | w-40 | Hedef path |
| Anchor Text | w-32 | Anchor veya "--" (bos) |
| Tip | w-16 | Follow/Nofollow badge |
| DR | w-16 | Domain Rating (0-100, renk kodlu) |
| Ilk Gorulen | w-24 | Tarih |
| Durum | w-16 | Aktif / Kaybedilen |

### Kaybedilen Backlink Gosterimi

```html
{% if backlink.is_lost %}
<tr class="bg-red-50/50 dark:bg-red-900/10">
    <!-- satir icerigi -->
    <td>
        <span class="inline-flex items-center text-xs text-red-600">
            <i class="ph ph-warning mr-1"></i> Kaybedildi
        </span>
    </td>
</tr>
{% endif %}
```

---

## 9. SERPFeatureGrid

SERP ozellik kartlari grid gorunumu.

```
Dosya     : templates/modules/seo/components/serp-feature-grid.html
Jinja2    : {% macro serp_feature_grid(features) %}
```

### Ozellik Tipleri ve Ikonlari

| Ozellik | Ikon | Label |
|---------|------|-------|
| featured_snippet | `ph-article` | One Cikan Snippet |
| people_also_ask | `ph-question` | Insanlar Bunu da Soruyor |
| local_pack | `ph-map-pin` | Yerel Paket |
| image_pack | `ph-images` | Gorsel Paketi |
| video | `ph-video-camera` | Video |
| knowledge_panel | `ph-book-open` | Bilgi Paneli |
| shopping | `ph-shopping-bag` | Alisveris |
| site_links | `ph-link` | Site Baglantilari |

### Kart Yapisi

```html
<div class="bg-white border rounded-lg p-4 {{ 'border-green-200 bg-green-50/30' if feature.is_owned else 'border-gray-200' }}">
    <div class="flex items-center gap-2 mb-2">
        <i class="ph {{ icon }} text-lg {{ 'text-green-600' if feature.is_owned else 'text-gray-400' }}"></i>
        <span class="text-sm font-medium">{{ feature_label }}</span>
        {% if feature.is_owned %}
        <span class="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Kazanildi</span>
        {% else %}
        <span class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Firsat</span>
        {% endif %}
    </div>
    <p class="text-sm text-gray-700">{{ feature.keyword }}</p>
    {% if feature.current_url %}
    <p class="text-xs text-gray-400 truncate mt-1">{{ feature.current_url }}</p>
    {% endif %}
</div>
```

---

## 10. RankingForecastChart

Siralama tahmin grafigi (gecmis + gelecek).

```
Dosya     : templates/modules/seo/components/ranking-forecast-chart.html
Jinja2    : {% macro ranking_forecast_chart(chart_id, forecast_data) %}
Boyut     : w-full h-72 (288px)
```

### ECharts Konfigurasyonu

```javascript
chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'time' },
    yAxis: { type: 'value', inverse: true, min: 1 },
    series: [
        {
            name: 'Gercek Pozisyon',
            type: 'line',
            data: {{ forecast_data.actual | tojson }},
            lineStyle: { color: '#3B82F6', width: 2 },
            itemStyle: { color: '#3B82F6' }
        },
        {
            name: 'Tahmin',
            type: 'line',
            data: {{ forecast_data.predicted | tojson }},
            lineStyle: { color: '#3B82F6', width: 2, type: 'dashed' },
            itemStyle: { color: '#3B82F6' }
        },
        {
            name: 'Guven Araligi',
            type: 'line',
            data: {{ forecast_data.upper_bound | tojson }},
            lineStyle: { opacity: 0 },
            stack: 'confidence',
            symbol: 'none'
        },
        {
            name: 'Guven Araligi (alt)',
            type: 'line',
            data: {{ forecast_data.lower_bound | tojson }},
            lineStyle: { opacity: 0 },
            areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
            stack: 'confidence',
            symbol: 'none'
        }
    ],
    // Bugunu isaretleyen dikey cizgi
    markLine: {
        data: [{ xAxis: new Date().toISOString() }],
        lineStyle: { color: '#9CA3AF', type: 'dashed' },
        label: { formatter: 'Bugun' }
    }
});
```

---

## 11. KeywordBulkActions

Secili anahtar kelimeler icin toplu islem toolbar.

```
Dosya     : templates/modules/seo/components/keyword-bulk-actions.html
Jinja2    : {% macro keyword_bulk_actions() %}
```

### Alpine.js State

```javascript
// Parent x-data'dan selectedIds alinir ($store veya parent scope)
x-data="{
    classifying: false,
    clustering: false,
    get count() { return this.selectedIds.length; }
}"
```

### Aksiyonlar

```html
<div
    x-show="selectedIds.length > 0"
    x-transition
    class="sticky top-0 z-10 bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center gap-4"
>
    <span class="text-sm font-medium text-primary-800">
        <span x-text="selectedIds.length"></span> anahtar kelime secildi
    </span>

    <button
        class="btn-sm btn-secondary"
        :disabled="classifying"
        hx-post="/api/v1/seo/keywords/classify"
        hx-target="#keyword-table-body"
        hx-swap="innerHTML"
        hx-vals='js:{ "keyword_ids": Alpine.store("selectedIds") || [] }'
        hx-headers='{"Content-Type": "application/json"}'
        hx-ext="json-enc"
        hx-indicator="#classify-spinner"
    >
        <span id="classify-spinner" class="htmx-indicator">
            <i class="ph ph-spinner animate-spin mr-1"></i>
        </span>
        <i class="ph ph-brain mr-1"></i>
        Niyet Siniflandir
    </button>

    <button
        class="btn-sm btn-secondary"
        :disabled="clustering"
        hx-post="/api/v1/seo/keywords/cluster"
        hx-target="#cluster-result"
        hx-swap="innerHTML"
        hx-indicator="#cluster-spinner"
    >
        <span id="cluster-spinner" class="htmx-indicator">
            <i class="ph ph-spinner animate-spin mr-1"></i>
        </span>
        <i class="ph ph-graph mr-1"></i>
        Kumele
    </button>

    <button class="btn-sm btn-ghost text-red-600" @click="selectedIds = []">
        <i class="ph ph-x mr-1"></i> Secimi Temizle
    </button>
</div>
```

---

## 12. SEORadarChart

5 boyutlu SEO performans radar chart.

```
Dosya     : templates/modules/seo/components/seo-radar-chart.html
Jinja2    : {% macro seo_radar_chart(chart_id, radar_data) %}
Boyut     : w-full max-w-md h-80 (320px)
```

### Jinja2 Parametreleri

```python
radar_data: SEORadarData
  .current  : [85, 74, 58, 71, 67]   # [teknik, icerik, backlink, siralama, serp]
  .previous : [80, 70, 55, 68, 63]   # onceki donem
```

(ECharts konfigurasyonu README wireframes bolumunde tanimli.)

---

## 13. DifficultyBar

Anahtar kelime zorluk gosterge cubugu.

```
Dosya     : templates/modules/seo/components/difficulty-bar.html
Jinja2    : {% macro difficulty_bar(value) %}
```

```html
{% set color = 'bg-green-500' if value <= 30 else 'bg-yellow-500' if value <= 60 else 'bg-orange-500' if value <= 80 else 'bg-red-500' %}
<div class="flex items-center gap-2">
    <div class="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div class="h-2 rounded-full {{ color }}" style="width: {{ value }}%"></div>
    </div>
    <span class="text-xs text-gray-500 w-6 text-right">{{ value }}</span>
</div>
```

---

## 14. TrendSparkline

Son 12 ay arama hacmi mini grafigi (inline SVG).

```
Dosya     : templates/modules/seo/components/trend-sparkline.html
Jinja2    : {% macro trend_sparkline(trend_data) %}
Boyut     : w-16 h-5 (64x20px)
```

```html
{% if trend_data %}
{% set max_val = trend_data | max %}
{% set points = [] %}
{% for val in trend_data %}
    {% set x = (loop.index0 / (trend_data | length - 1)) * 60 %}
    {% set y = 18 - ((val / max_val) * 16) if max_val > 0 else 10 %}
    {% set _ = points.append('%s,%s' % (x | round(1), y | round(1))) %}
{% endfor %}
{% set trend_dir = 'up' if trend_data[-1] > trend_data[-3] else 'down' if trend_data[-1] < trend_data[-3] else 'flat' %}
{% set stroke_color = '#10B981' if trend_dir == 'up' else '#EF4444' if trend_dir == 'down' else '#9CA3AF' %}

<svg width="64" height="20" class="inline-block">
    <polyline
        points="{{ points | join(' ') }}"
        fill="none"
        stroke="{{ stroke_color }}"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
{% else %}
<span class="text-xs text-gray-300">—</span>
{% endif %}
```
