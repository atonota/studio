# Module 08: content-intelligence — COMPONENTS

> Her component Jinja2 macro + Alpine.js x-data ile tanimlanir.
> ECharts 5 CDN grafik component'leri icin kullanilir. Bundler YOK.

---

## 1. ContentScoreGauge

Tekil icerik sayfasi veya pano ortalama skoru icin ECharts gauge widget.

```
Dosya     : templates/modules/content/components/content-score-gauge.html
Jinja2    : {% macro content_score_gauge(chart_id, score, previous_score=None, size="lg") %}
Boyut     : sm: 80x80, md: 160x160, lg: 240x240
```

### ECharts Konfigurasyonu

```javascript
const gauge = echarts.init(document.getElementById('{{ chart_id }}'));
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
                    [0.3, '#EF4444'],     // red-500 (zayif)
                    [0.5, '#F59E0B'],     // amber-500 (orta-alt)
                    [0.7, '#3B82F6'],     // blue-500 (orta-ust)
                    [0.85, '#10B981'],    // emerald-500 (iyi)
                    [1.0, '#059669']      // emerald-600 (mukemmel)
                ]
            }
        },
        pointer: { width: 5, length: '60%' },
        detail: {
            fontSize: {{ {'sm': 16, 'md': 28, 'lg': 36}[size] }},
            fontWeight: 'bold',
            formatter: '{value}',
            offsetCenter: [0, '60%']
        },
        title: {
            show: true,
            offsetCenter: [0, '80%'],
            text: '/ 100',
            fontSize: {{ {'sm': 8, 'md': 12, 'lg': 14}[size] }},
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
    {% set diff = score - previous_score %}
    {% if diff > 0 %}
        <span class="text-green-600">
            <i class="ph ph-trend-up"></i> +{{ diff }} onceki doneme gore
        </span>
    {% elif diff < 0 %}
        <span class="text-red-600">
            <i class="ph ph-trend-down"></i> {{ diff }} onceki doneme gore
        </span>
    {% else %}
        <span class="text-gray-500">Degisim yok</span>
    {% endif %}
</div>
{% endif %}
```

---

## 2. ScoreBreakdownRadar

6 boyutlu icerik skor radar chart.

```
Dosya     : templates/modules/content/components/score-breakdown-radar.html
Jinja2    : {% macro score_breakdown_radar(chart_id, breakdown) %}
Boyut     : w-full max-w-md h-80 (320px)
```

### Jinja2 Parametreleri

```python
breakdown: ScoreBreakdown
  .readability   : int (0-100)
  .seo           : int (0-100)
  .intent        : int (0-100)  # niyet eslesmesi
  .technical     : int (0-100)
  .ux            : int (0-100)
  .freshness     : int (0-100)
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));

chart.setOption({
    tooltip: {
        trigger: 'item'
    },
    radar: {
        indicator: [
            { name: 'Okunabilirlik', max: 100 },
            { name: 'SEO Uyumu',     max: 100 },
            { name: 'Niyet Eslesmesi', max: 100 },
            { name: 'Teknik Yapi',   max: 100 },
            { name: 'Kullanici Den.', max: 100 },
            { name: 'Guncellik',     max: 100 }
        ],
        shape: 'polygon',
        splitArea: {
            areaStyle: {
                color: ['rgba(59,130,246,0.05)', 'rgba(59,130,246,0.1)',
                         'rgba(59,130,246,0.05)', 'rgba(59,130,246,0.1)',
                         'rgba(59,130,246,0.05)']
            }
        }
    },
    series: [{
        type: 'radar',
        data: [{
            value: [
                {{ breakdown.readability }},
                {{ breakdown.seo }},
                {{ breakdown.intent }},
                {{ breakdown.technical }},
                {{ breakdown.ux }},
                {{ breakdown.freshness }}
            ],
            name: 'Icerik Skoru',
            areaStyle: {
                color: 'rgba(59, 130, 246, 0.2)'
            },
            lineStyle: {
                color: '#3B82F6',
                width: 2
            },
            itemStyle: {
                color: '#3B82F6'
            }
        }]
    }]
});
window.addEventListener('resize', () => chart.resize());
```

### Boyut Listesi (Radar Altinda)

```html
<div class="grid grid-cols-3 gap-3 mt-4">
    {% for dim in [
        ('Okunabilirlik', breakdown.readability, 'ph-book-open'),
        ('SEO Uyumu', breakdown.seo, 'ph-magnifying-glass'),
        ('Niyet Eslesmesi', breakdown.intent, 'ph-target'),
        ('Teknik Yapi', breakdown.technical, 'ph-code'),
        ('Kullanici Den.', breakdown.ux, 'ph-user'),
        ('Guncellik', breakdown.freshness, 'ph-clock-countdown')
    ] %}
    {% set label, value, icon = dim %}
    {% set color = 'text-green-600' if value >= 70 else 'text-yellow-600' if value >= 40 else 'text-red-600' %}
    <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <i class="ph {{ icon }} text-lg text-gray-400"></i>
        <p class="text-xs text-gray-500 mt-1">{{ label }}</p>
        <p class="text-lg font-bold {{ color }}">{{ value }}</p>
    </div>
    {% endfor %}
</div>
```

---

## 3. ContentTable

Icerik listesi tablosu. Siralama, filtreleme ve cursor pagination destekler.

```
Dosya     : templates/modules/content/components/content-table.html
Jinja2    : {% macro content_table(pages, next_cursor, total_count) %}
```

### Alpine.js State

```javascript
x-data="{
    sortField: 'score',
    sortDir: 'asc',
    expandedRow: null,
    toggleExpand(uid) {
        this.expandedRow = this.expandedRow === uid ? null : uid;
    }
}"
```

### Kolon Yapisi

| Kolon | Genislik | Component | Siralama |
|-------|----------|-----------|----------|
| URL / Baslik | flex-1 | Truncated URL + baslik (iki satir) | title_asc / title_desc |
| Tip | w-20 | ContentTypeBadge | content_type |
| Skor | w-24 | ScoreBar (renk kodlu) | score_asc / score_desc |
| Kelime | w-16 | Sayi (formatted) | word_count_desc |
| Curus | w-20 | DecayIndicator + risk | decay_risk_desc |
| Guncelleme | w-24 | Relative tarih | updated_desc |

### Kolon Baslik Siralama

```html
<th>
    <button
        class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
        hx-get="/api/v1/partials/content/page-table?sort={{ new_sort }}"
        hx-target="#content-table-body"
        hx-swap="innerHTML"
        hx-include="[name='q'], [name='content_type'], [name='workspace'], [name='is_decaying'], [name='score_min'], [name='score_max']"
    >
        Skor
        <i class="ph ph-caret-up-down text-gray-400"
           :class="sortField === 'score' ? 'text-primary-500' : ''"></i>
    </button>
</th>
```

### Skor Gosterim (ScoreBar inline)

```html
{% set score_color = 'bg-red-500' if page.overall_score < 30
    else 'bg-yellow-500' if page.overall_score < 50
    else 'bg-blue-500' if page.overall_score < 70
    else 'bg-green-500' %}
<div class="flex items-center gap-2">
    <div class="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div class="h-2 rounded-full {{ score_color }}"
             style="width: {{ page.overall_score }}%"></div>
    </div>
    <span class="text-xs font-medium text-gray-600 w-6 text-right">
        {{ page.overall_score }}
    </span>
</div>
```

### Icerik Tipi Badge

```html
{% set type_map = {
    'page': ('Sayfa', 'ph-file', 'bg-blue-100 text-blue-800'),
    'post': ('Yazi', 'ph-article', 'bg-purple-100 text-purple-800'),
    'product': ('Urun', 'ph-package', 'bg-green-100 text-green-800'),
    'category': ('Kategori', 'ph-folder', 'bg-orange-100 text-orange-800'),
    'landing': ('Landing', 'ph-rocket-launch', 'bg-pink-100 text-pink-800')
} %}
{% set label, icon, cls = type_map.get(page.content_type, ('Diger', 'ph-file', 'bg-gray-100 text-gray-600')) %}
<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full {{ cls }}">
    <i class="ph {{ icon }}"></i>
    {{ label }}
</span>
```

### Curus Gostergesi (DecayIndicator inline)

```html
{% if page.is_decaying %}
<div class="flex items-center gap-1.5">
    <span class="inline-flex items-center px-1.5 py-0.5 text-xs rounded
        {{ 'bg-red-100 text-red-700' if page.decay_risk >= 70
           else 'bg-yellow-100 text-yellow-700' if page.decay_risk >= 40
           else 'bg-orange-100 text-orange-700' }}">
        <i class="ph ph-warning mr-0.5"></i>
        %{{ page.decay_risk }}
    </span>
    {% if page.decay_action %}
    <span class="text-xs text-gray-400">
        {{ {'refresh': 'Yenile', 'merge': 'Birlestir', 'redirect': 'Yonlendir', 'remove': 'Kaldir'}[page.decay_action] }}
    </span>
    {% endif %}
</div>
{% else %}
<span class="text-xs text-gray-300">—</span>
{% endif %}
```

---

## 4. AISuggestionPanel

SSE ile streaming AI iyilestirme onerileri paneli.

```
Dosya     : templates/modules/content/components/ai-suggestion-panel.html
Jinja2    : {% macro ai_suggestion_panel(page_uid, existing_suggestions=[]) %}
```

### Alpine.js State

```javascript
x-data="{
    streaming: false,
    suggestions: {{ existing_suggestions | tojson }},
    error: null,
    startStream() {
        this.streaming = true;
        this.error = null;
    },
    onSuggestion(event) {
        const data = JSON.parse(event.data);
        this.suggestions.push(data);
    },
    onComplete(event) {
        this.streaming = false;
    },
    onError(event) {
        this.streaming = false;
        this.error = JSON.parse(event.data).message;
    },
    get hasPending() {
        return this.suggestions.filter(s => s.status === 'pending').length;
    }
}"
```

### SSE Baglantisi (hx-ext="sse")

```html
<div id="suggestion-panel" class="space-y-4">
    <!-- Baslatma butonu -->
    <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            <i class="ph ph-sparkle text-primary-500 mr-1"></i>
            AI Iyilestirme Onerileri
        </h3>
        <button
            class="btn-sm btn-primary"
            :disabled="streaming"
            @click="startStream()"
            hx-get="/api/v1/content/pages/{{ page_uid }}/suggestions/stream"
            hx-ext="sse"
            sse-connect="/api/v1/content/pages/{{ page_uid }}/suggestions/stream"
            sse-swap="suggestion"
            hx-target="#suggestion-stream-container"
            hx-swap="beforeend"
        >
            <template x-if="!streaming">
                <span><i class="ph ph-sparkle mr-1"></i> Oneri Olustur</span>
            </template>
            <template x-if="streaming">
                <span><i class="ph ph-spinner animate-spin mr-1"></i> Olusturuluyor...</span>
            </template>
        </button>
    </div>

    <!-- SSE streaming container -->
    <div id="suggestion-stream-container"
         hx-ext="sse"
         sse-connect="/api/v1/content/pages/{{ page_uid }}/suggestions/stream"
         sse-close="complete"
         @sse-message:suggestion="onSuggestion($event)"
         @sse-message:complete="onComplete($event)"
         @sse-message:error="onError($event)"
         class="space-y-3">

        <!-- Mevcut oneriler -->
        {% for suggestion in existing_suggestions %}
            {{ suggestion_card(suggestion) }}
        {% endfor %}
    </div>

    <!-- Streaming sirasinda skeleton -->
    <template x-if="streaming">
        <div class="animate-pulse space-y-3">
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-24"></div>
        </div>
    </template>

    <!-- Hata durumu -->
    <template x-if="error">
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <i class="ph ph-warning mr-1"></i>
            <span x-text="error"></span>
        </div>
    </template>
</div>
```

### Oneri Karti (suggestion_card macro)

```html
{% macro suggestion_card(suggestion) %}
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
     x-data="{ expanded: false }">

    <!-- Baslik satiri -->
    <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
            {% set type_config = {
                'title': ('Baslik Onerisi', 'ph-text-h-one', 'text-blue-600'),
                'meta_description': ('Meta Description', 'ph-article', 'text-purple-600'),
                'keyword': ('Anahtar Kelime', 'ph-hash', 'text-green-600'),
                'structure': ('Yapi Onerisi', 'ph-tree-structure', 'text-orange-600'),
                'schema': ('Schema Markup', 'ph-code', 'text-pink-600')
            } %}
            {% set label, icon, color = type_config.get(suggestion.suggestion_type, ('Oneri', 'ph-lightbulb', 'text-gray-600')) %}
            <i class="ph {{ icon }} {{ color }}"></i>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ label }}</span>
            <span class="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                Etki: {{ suggestion.impact_score }}/10
            </span>
        </div>

        <!-- Durum aksiyonlari -->
        {% if suggestion.status == 'pending' %}
        <div class="flex gap-1">
            <button class="btn-xs btn-ghost text-green-600"
                    hx-patch="/api/v1/content/suggestions/{{ suggestion.id }}/status"
                    hx-vals='{"status": "accepted"}'
                    hx-target="closest div"
                    hx-swap="outerHTML"
                    hx-headers='{"Content-Type": "application/json"}'
                    hx-ext="json-enc">
                <i class="ph ph-check"></i>
            </button>
            <button class="btn-xs btn-ghost text-red-600"
                    hx-patch="/api/v1/content/suggestions/{{ suggestion.id }}/status"
                    hx-vals='{"status": "dismissed"}'
                    hx-target="closest div"
                    hx-swap="outerHTML"
                    hx-headers='{"Content-Type": "application/json"}'
                    hx-ext="json-enc">
                <i class="ph ph-x"></i>
            </button>
        </div>
        {% elif suggestion.status == 'accepted' %}
        <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            <i class="ph ph-check-circle mr-0.5"></i> Kabul Edildi
        </span>
        {% elif suggestion.status == 'dismissed' %}
        <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            Reddedildi
        </span>
        {% endif %}
    </div>

    <!-- Mevcut deger vs onerilen -->
    {% if suggestion.current_value %}
    <div class="mb-2">
        <p class="text-xs text-gray-400 mb-0.5">Mevcut:</p>
        <p class="text-sm text-gray-500 line-through">{{ suggestion.current_value | truncate(120) }}</p>
    </div>
    {% endif %}
    <div class="mb-2">
        <p class="text-xs text-gray-400 mb-0.5">Onerilen:</p>
        <p class="text-sm text-gray-900 dark:text-white font-medium">{{ suggestion.suggested_value | truncate(200) }}</p>
    </div>

    <!-- Genis aciklama -->
    <button @click="expanded = !expanded"
            class="text-xs text-primary-600 hover:text-primary-800">
        <span x-show="!expanded">Neden? <i class="ph ph-caret-down"></i></span>
        <span x-show="expanded">Gizle <i class="ph ph-caret-up"></i></span>
    </button>
    <div x-show="expanded" x-collapse
         class="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        {{ suggestion.reasoning }}
    </div>
</div>
{% endmacro %}
```

---

## 5. GapSankeyChart

Bosluk analizi Sankey diagram. Konu -> alt konu -> eksik icerik akisini gosterir.

```
Dosya     : templates/modules/content/components/gap-sankey-chart.html
Jinja2    : {% macro gap_sankey_chart(chart_id, sankey_data) %}
Boyut     : w-full h-[500px]
```

### Jinja2 Parametreleri

```python
sankey_data: SankeyChartData
  .nodes  : list[dict]   # [{"name": "SEO"}, {"name": "Teknik SEO"}, {"name": "site audit"}, ...]
  .links  : list[dict]   # [{"source": "SEO", "target": "Teknik SEO", "value": 5}, ...]
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));

chart.setOption({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function(params) {
            if (params.dataType === 'edge') {
                return `${params.data.source} → ${params.data.target}<br/>
                        ${params.data.value} eksik icerik`;
            }
            return params.name;
        }
    },
    series: [{
        type: 'sankey',
        data: {{ sankey_data.nodes | tojson }},
        links: {{ sankey_data.links | tojson }},
        orient: 'horizontal',
        nodeAlign: 'left',
        layoutIterations: 32,
        emphasis: {
            focus: 'adjacency'
        },
        lineStyle: {
            color: 'gradient',
            curveness: 0.5
        },
        itemStyle: {
            color: '#3B82F6',
            borderColor: '#1E40AF'
        },
        label: {
            color: '#374151',
            fontSize: 11,
            fontWeight: 500
        },
        levels: [
            {
                depth: 0,
                itemStyle: { color: '#3B82F6' },    // blue-500 (ana konular)
                lineStyle: { color: 'source', opacity: 0.4 }
            },
            {
                depth: 1,
                itemStyle: { color: '#8B5CF6' },    // violet-500 (alt konular)
                lineStyle: { color: 'source', opacity: 0.3 }
            },
            {
                depth: 2,
                itemStyle: { color: '#F59E0B' },    // amber-500 (eksik icerikler)
                lineStyle: { color: 'source', opacity: 0.2 }
            }
        ]
    }]
});
window.addEventListener('resize', () => chart.resize());
```

### Sankey Altinda Ozet

```html
<div class="mt-4 grid grid-cols-3 gap-4 text-center">
    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p class="text-2xl font-bold text-blue-600">{{ sankey_data.nodes | selectattr('depth', 'eq', 0) | list | length }}</p>
        <p class="text-xs text-blue-500">Ana Konu</p>
    </div>
    <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <p class="text-2xl font-bold text-violet-600">{{ sankey_data.nodes | selectattr('depth', 'eq', 1) | list | length }}</p>
        <p class="text-xs text-violet-500">Alt Konu</p>
    </div>
    <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p class="text-2xl font-bold text-amber-600">{{ sankey_data.nodes | selectattr('depth', 'eq', 2) | list | length }}</p>
        <p class="text-xs text-amber-500">Eksik Icerik</p>
    </div>
</div>
```

---

## 6. DecaySparkline

Curuyen icerik trafik trend mini grafigi (inline SVG).

```
Dosya     : templates/modules/content/components/decay-sparkline.html
Jinja2    : {% macro decay_sparkline(traffic_data, decay_risk) %}
Boyut     : w-20 h-5 (80x20px)
```

### HTML / SVG Yapisi

```html
{% if traffic_data and traffic_data | length > 1 %}
{% set max_val = traffic_data | max if traffic_data | max > 0 else 1 %}
{% set points = [] %}
{% for val in traffic_data %}
    {% set x = (loop.index0 / (traffic_data | length - 1)) * 76 + 2 %}
    {% set y = 18 - ((val / max_val) * 16) %}
    {% set _ = points.append('%s,%s' % (x | round(1), y | round(1))) %}
{% endfor %}

{# Renk: curuyor ise kirmizi, stabil ise gri #}
{% set is_declining = traffic_data[-1] < traffic_data[0] * 0.8 %}
{% set stroke_color = '#EF4444' if is_declining else '#9CA3AF' %}

<div class="inline-flex items-center gap-1.5">
    <svg width="80" height="20" class="inline-block">
        {# Dusus alani (kirmizi gradient) #}
        {% if is_declining %}
        <defs>
            <linearGradient id="decay-grad-{{ loop.index }}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#EF4444" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <polygon
            points="2,18 {{ points | join(' ') }} 78,18"
            fill="url(#decay-grad-{{ loop.index }})"
        />
        {% endif %}
        <polyline
            points="{{ points | join(' ') }}"
            fill="none"
            stroke="{{ stroke_color }}"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
    {% if decay_risk is not none %}
    <span class="text-xs font-medium
        {{ 'text-red-600' if decay_risk >= 70
           else 'text-yellow-600' if decay_risk >= 40
           else 'text-gray-400' }}">
        {{ decay_risk }}%
    </span>
    {% endif %}
</div>
{% else %}
<span class="text-xs text-gray-300">—</span>
{% endif %}
```

---

## 7. SemanticScatterPlot

Anlam haritasi 2D scatter plot. t-SNE/UMAP ile boyut azaltilmis icerik noktalarini gosterir.

```
Dosya     : templates/modules/content/components/semantic-scatter-plot.html
Jinja2    : {% macro semantic_scatter_plot(chart_id, scatter_data) %}
Boyut     : w-full h-[500px]
```

### Jinja2 Parametreleri

```python
scatter_data: SemanticScatterData
  .points   : list[dict]   # [{x, y, uid, url, title, cluster, traffic}]
  .clusters : list[dict]   # [{id, name, color, count}]
```

### ECharts Konfigurasyonu

```javascript
const chart = echarts.init(document.getElementById('{{ chart_id }}'));

// Kume renk haritasi
const clusterColors = {};
{{ scatter_data.clusters | tojson }}.forEach(c => {
    clusterColors[c.id] = c.color;
});

// Noktalari kumelere gore grupla
const seriesMap = {};
{{ scatter_data.points | tojson }}.forEach(p => {
    if (!seriesMap[p.cluster]) {
        const cluster = {{ scatter_data.clusters | tojson }}.find(c => c.id === p.cluster);
        seriesMap[p.cluster] = {
            name: cluster ? cluster.name : 'Diger',
            type: 'scatter',
            data: [],
            itemStyle: { color: cluster ? cluster.color : '#9CA3AF' },
            emphasis: {
                itemStyle: { borderColor: '#1F2937', borderWidth: 3 }
            }
        };
    }
    seriesMap[p.cluster].data.push({
        value: [p.x, p.y],
        uid: p.uid,
        url: p.url,
        title: p.title,
        traffic: p.traffic,
        symbolSize: Math.max(6, Math.min(30, Math.sqrt(p.traffic / 10)))
    });
});

chart.setOption({
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            const d = params.data;
            return `<b>${d.title || d.url}</b><br/>
                    Trafik: ${d.traffic.toLocaleString()} oturum<br/>
                    Kume: ${params.seriesName}`;
        }
    },
    legend: {
        data: Object.values(seriesMap).map(s => s.name),
        bottom: 0,
        type: 'scroll'
    },
    xAxis: {
        type: 'value',
        show: false          // t-SNE eksenleri anlamli degil
    },
    yAxis: {
        type: 'value',
        show: false
    },
    grid: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 60
    },
    series: Object.values(seriesMap)
});

// Tiklandiginda icerik detay sayfasina git
chart.on('click', function(params) {
    if (params.data && params.data.uid) {
        window.location.href = '/content/pages/' + params.data.uid;
    }
});

window.addEventListener('resize', () => chart.resize());
```

### Kanibalizasyon Uyari Listesi

```html
{% if cannibalization and cannibalization | length > 0 %}
<div class="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
    <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
        <i class="ph ph-warning mr-1"></i>
        Potansiyel Icerik Kanibalizasyonu ({{ cannibalization | length }} cift)
    </h4>
    <div class="space-y-2">
        {% for pair in cannibalization[:5] %}
        <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                {{ pair.page_a_title or pair.page_a_url }}
            </span>
            <i class="ph ph-arrows-horizontal text-amber-500"></i>
            <span class="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                {{ pair.page_b_title or pair.page_b_url }}
            </span>
            <span class="text-xs text-amber-600 ml-auto">
                %{{ (pair.similarity * 100) | int }} benzer
            </span>
        </div>
        {% endfor %}
    </div>
</div>
{% endif %}
```

---

## 8. ContentDetailTabs

Icerik detay sayfasindaki tab yapisi. Her tab icerigi HTMX ile lazy load edilir.

```
Dosya     : templates/modules/content/components/content-detail-tabs.html
Jinja2    : {% macro content_detail_tabs(page_uid) %}
```

### Alpine.js State

```javascript
x-data="{
    activeTab: 'suggestions'
}"
```

### Tab Yapisi

```html
<div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="flex gap-4 -mb-px" aria-label="Icerik Detay Tablari">
        {% for tab_id, tab_label, tab_icon in [
            ('suggestions', 'AI Onerileri', 'ph-sparkle'),
            ('traffic', 'Trafik Trendi', 'ph-chart-line-up'),
            ('similar', 'Benzer Icerikler', 'ph-intersect'),
            ('keywords', 'Anahtar Kelimeler', 'ph-hash')
        ] %}
        <button
            class="tab-button flex items-center gap-1.5 py-3 px-1 border-b-2 text-sm font-medium transition-colors"
            :class="activeTab === '{{ tab_id }}'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            @click="activeTab = '{{ tab_id }}'"
        >
            <i class="ph {{ tab_icon }}"></i>
            {{ tab_label }}
        </button>
        {% endfor %}
    </nav>
</div>

<!-- Tab icerikleri -->
<div class="mt-4">
    <!-- AI Onerileri -->
    <div x-show="activeTab === 'suggestions'" x-transition>
        <div hx-get="/api/v1/partials/content/suggestion-stream?page_uid={{ page_uid }}"
             hx-trigger="intersect once"
             hx-swap="innerHTML">
            <div class="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
        </div>
    </div>

    <!-- Trafik Trendi -->
    <div x-show="activeTab === 'traffic'" x-transition>
        <div hx-get="/api/v1/partials/content/traffic-chart?page_uid={{ page_uid }}"
             hx-trigger="intersect once"
             hx-swap="innerHTML">
            <div class="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
        </div>
    </div>

    <!-- Benzer Icerikler -->
    <div x-show="activeTab === 'similar'" x-transition>
        <div hx-get="/api/v1/partials/content/similar-pages?page_uid={{ page_uid }}"
             hx-trigger="intersect once"
             hx-swap="innerHTML">
            <div class="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
        </div>
    </div>

    <!-- Anahtar Kelimeler -->
    <div x-show="activeTab === 'keywords'" x-transition>
        <div hx-get="/api/v1/partials/content/related-keywords?page_uid={{ page_uid }}"
             hx-trigger="intersect once"
             hx-swap="innerHTML">
            <div class="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
        </div>
    </div>
</div>
```

---

## 9. SchemaMarkupPreview

Schema.org markup onizleme component'i. AI oneri panelindeki "schema" tipindeki oneriler icin kullanilir.

```
Dosya     : templates/modules/content/components/schema-markup-preview.html
Jinja2    : {% macro schema_markup_preview(current_schema, suggested_schema) %}
```

### Alpine.js State

```javascript
x-data="{
    showDiff: true,
    copied: false,
    copySchema() {
        navigator.clipboard.writeText(this.$refs.schemaCode.textContent);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
    }
}"
```

### HTML Yapisi

```html
<div class="bg-gray-900 rounded-lg overflow-hidden">
    <div class="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span class="text-xs text-gray-400">JSON-LD Schema Markup</span>
        <div class="flex items-center gap-2">
            <button @click="showDiff = !showDiff"
                    class="text-xs text-gray-400 hover:text-white">
                <i class="ph" :class="showDiff ? 'ph-eye' : 'ph-eye-slash'"></i>
                <span x-text="showDiff ? 'Diff' : 'Tam'"></span>
            </button>
            <button @click="copySchema()"
                    class="text-xs text-gray-400 hover:text-white">
                <i class="ph" :class="copied ? 'ph-check' : 'ph-copy'"></i>
                <span x-text="copied ? 'Kopyalandi' : 'Kopyala'"></span>
            </button>
        </div>
    </div>
    <pre class="p-4 text-sm text-gray-100 overflow-x-auto" x-ref="schemaCode"><code>{{ suggested_schema | tojson(indent=2) }}</code></pre>
</div>
```

---

## Tailwind Sinif Referansi (Tum Component'ler)

```
Kart container   : bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                   rounded-lg shadow-sm p-4
KPI karti        : bg-white dark:bg-gray-800 rounded-lg p-4 text-center
Tab aktif        : border-primary-500 text-primary-600
Tab pasif        : border-transparent text-gray-500 hover:text-gray-700
Badge (genel)    : inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
Skor iyi (70+)   : text-green-600 bg-green-100
Skor orta (40-69): text-yellow-600 bg-yellow-100
Skor kotu (<40)  : text-red-600 bg-red-100
AI icerik bg     : bg-primary-50 dark:bg-primary-900/20 border border-primary-100
Skeleton         : animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg
Dark mode        : dark: prefix ile tum component'lerde desteklenir
```
