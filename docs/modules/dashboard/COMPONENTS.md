# dashboard — Component Spesifikasyonu

> Dashboard componentleri. KPI kartlari, aktivite feed, AI brief,
> date range selector, sparkline chart.

---

## 1. KPICard

**Amac**: Tekil KPI metrigini gostermek icin kart. Baslik, deger, trend oku, sparkline.

**Konum**: `templates/modules/dashboard/components/kpi-card.html`

**Jinja2 Macro**:
```jinja2
{% macro kpi_card(title, value, trend_value, trend_percent, trend_direction, sparkline_data, icon, unit="") %}
{#
  title           : "Toplam Workspace"
  value           : "12" veya "4,521"
  trend_value     : "+2" veya "-1"
  trend_percent   : "20" veya "10"
  trend_direction : "up" | "down" | "neutral"
  sparkline_data  : [10, 12, 11, 13, 12, 14, 12]  (son 7 gun)
  icon            : "ph-globe"
  unit            : "" | "%" | "/10" vb.
#}
{% set trend_colors = {
    'up': 'text-green-400',
    'down': 'text-red-400',
    'neutral': 'text-gray-500'
} %}
{% set trend_arrows = {
    'up': 'ph-trend-up',
    'down': 'ph-trend-down',
    'neutral': 'ph-minus'
} %}

<div class="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
    <!-- Baslik -->
    <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-400">{{ title }}</span>
        <i class="ph {{ icon }} text-gray-600 text-lg"></i>
    </div>

    <!-- Deger -->
    <div class="flex items-end justify-between">
        <div>
            <span class="text-3xl font-bold text-white">{{ value }}</span>
            <span class="text-lg text-gray-500">{{ unit }}</span>
        </div>

        <!-- Sparkline -->
        <div id="sparkline-{{ title | slugify }}"
             x-data="{ chart: null }"
             x-init="
                chart = echarts.init($el, null, { width: 80, height: 24 });
                chart.setOption({
                    grid: { top: 0, right: 0, bottom: 0, left: 0 },
                    xAxis: { show: false, data: {{ sparkline_data | tojson }} },
                    yAxis: { show: false },
                    series: [{
                        type: 'line',
                        data: {{ sparkline_data | tojson }},
                        smooth: true,
                        showSymbol: false,
                        lineStyle: { width: 2, color: '{{ '#4ade80' if trend_direction == 'up' else '#f87171' if trend_direction == 'down' else '#6b7280' }}' },
                        areaStyle: { opacity: 0.1 }
                    }]
                });
             "
             class="w-20 h-6">
        </div>
    </div>

    <!-- Trend -->
    <div class="mt-2 flex items-center gap-1 {{ trend_colors[trend_direction] }}">
        <i class="ph {{ trend_arrows[trend_direction] }} text-sm"></i>
        <span class="text-xs font-medium">{{ trend_value }} ({{ trend_percent }}%)</span>
        <span class="text-xs text-gray-600 ml-1">onceki doneme gore</span>
    </div>
</div>
{% endmacro %}
```

**Flowbite Ref**: Cards > Statistics card

---

## 2. ActivityFeed

**Amac**: Son aktivitelerin kronolojik listesi. Cursor-based pagination, polling.

**Konum**: `templates/modules/dashboard/partials/activity-feed.html`

**Alpine.js State**:
```javascript
x-data="{
    expanded: {}
}"
```

**Yapi**:
```html
<div class="bg-gray-800 border border-gray-700 rounded-xl p-5">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Son Aktiviteler</h3>
        <a href="/audit" class="text-sm text-blue-400 hover:text-blue-300">
            Tumu <i class="ph ph-arrow-right"></i>
        </a>
    </div>

    <div id="activity-list"
         hx-get="/api/v1/partials/recent-activity"
         hx-trigger="load, every 60s"
         hx-swap="innerHTML"
         hx-indicator="#activity-skeleton">

        <!-- Skeleton placeholder (ilk yukleme) -->
        <div id="activity-skeleton" class="space-y-4">
            {% for _ in range(5) %}
            <div class="animate-pulse flex gap-3">
                <div class="w-2 h-2 bg-gray-700 rounded-full mt-2"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-3 bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>
```

**ActivityItem Macro** (`components/activity-item.html`):
```jinja2
{% macro activity_item(item) %}
{#
  item.type       : "user.login" | "tenant.created" | "adapter.error" | ...
  item.message    : "Ahmet Karaca giris yapti"
  item.context    : "acme.com" (opsiyonel)
  item.timestamp  : "10:32"
  item.date       : "Bugun" | "Dun" | "25 Mar"
  item.severity   : "success" | "info" | "warning" | "error"
  item.href       : "/audit/evt-123" (opsiyonel)
#}
{% set dot_colors = {
    'success': 'bg-green-400',
    'info': 'bg-blue-400',
    'warning': 'bg-yellow-400',
    'error': 'bg-red-400'
} %}

<div class="flex gap-3 py-3 border-b border-gray-700 last:border-0 group">
    <div class="w-2 h-2 {{ dot_colors[item.severity] }} rounded-full mt-2 flex-shrink-0"></div>
    <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-300 truncate">{{ item.message }}</p>
        {% if item.context %}
        <p class="text-xs text-gray-500 mt-0.5">{{ item.context }}</p>
        {% endif %}
    </div>
    <div class="text-xs text-gray-600 flex-shrink-0">
        <span>{{ item.timestamp }}</span>
        <span class="block">{{ item.date }}</span>
    </div>
</div>
{% endmacro %}
```

---

## 3. AIBriefCard

**Amac**: AI tarafindan uretilen gunluk brief karti. 3 insight maddesi.

**Konum**: `templates/modules/dashboard/partials/ai-brief.html`

**Alpine.js State**:
```javascript
x-data="{
    expandedItem: null,
    toggleItem(index) {
        this.expandedItem = this.expandedItem === index ? null : index;
    }
}"
```

**Yapi**:
```html
<div class="bg-gradient-to-br from-blue-900/30 to-purple-900/30
            border border-blue-800/40 rounded-xl p-6">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1
                     bg-blue-600/30 text-blue-300 text-xs font-medium rounded-full">
            <i class="ph ph-lightning"></i> AI
        </span>
        <h3 class="text-lg font-semibold text-white">Bugun Dikkat Edilecek 3 Sey</h3>
    </div>

    <!-- Brief Items -->
    <div class="space-y-3">
        {% for item in brief_items %}
        {% set type_icons = {'warning': 'ph-warning', 'trend': 'ph-trend-up', 'suggestion': 'ph-wrench'} %}
        {% set type_colors = {'warning': 'text-yellow-400', 'trend': 'text-green-400', 'suggestion': 'text-blue-400'} %}

        <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50
                    hover:border-gray-600 transition-colors cursor-pointer"
             @click="toggleItem({{ loop.index0 }})">
            <div class="flex items-start gap-3">
                <span class="text-lg font-bold text-gray-600">{{ loop.index }}.</span>
                <i class="ph {{ type_icons[item.type] }} {{ type_colors[item.type] }} text-lg mt-0.5"></i>
                <div class="flex-1">
                    <p class="text-sm text-gray-200 font-medium">{{ item.title }}</p>
                    <p class="text-sm text-gray-400 mt-1">{{ item.summary }}</p>
                    <div x-show="expandedItem === {{ loop.index0 }}" x-transition class="mt-3">
                        <p class="text-sm text-gray-400">{{ item.detail }}</p>
                        {% if item.action_href %}
                        <a href="{{ item.action_href }}"
                           class="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300">
                            {{ item.action_label }} <i class="ph ph-arrow-right"></i>
                        </a>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
        {% endfor %}
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-5 pt-4 border-t border-gray-700/50">
        <span class="text-xs text-gray-600 flex items-center gap-1">
            <i class="ph ph-robot"></i>
            AI tarafindan uretildi · {{ brief_generated_at }}
        </span>
        <a href="/insights" class="text-sm text-blue-400 hover:text-blue-300">
            Detayli Analiz <i class="ph ph-arrow-right"></i>
        </a>
    </div>
</div>
```

---

## 4. DateRangeSelector

**Amac**: Tarih araligi secici. Dashboard'daki tum verileri filtreler.

**Konum**: `templates/modules/dashboard/components/date-range-selector.html`

**Alpine.js State**:
```javascript
x-data="{
    selectedRange: '7d',
    customFrom: '',
    customTo: '',
    showCustom: false,

    ranges: [
        { value: '7d',  label: 'Son 7 gun' },
        { value: '30d', label: 'Son 30 gun' },
        { value: '90d', label: 'Son 90 gun' },
        { value: 'custom', label: 'Ozel aralik' }
    ],

    selectRange(range) {
        this.selectedRange = range;
        this.showCustom = (range === 'custom');
        if (range !== 'custom') {
            this.dispatchChange();
        }
    },

    dispatchChange() {
        const detail = this.selectedRange === 'custom'
            ? { from: this.customFrom, to: this.customTo }
            : { period: this.selectedRange };
        window.dispatchEvent(new CustomEvent('date-range-changed', { detail }));
    }
}"
```

**Yapi**:
```html
<div class="relative">
    <button @click="$refs.dropdown.classList.toggle('hidden')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600
                   rounded-lg text-sm text-gray-300 hover:bg-gray-600">
        <i class="ph ph-calendar"></i>
        <span x-text="ranges.find(r => r.value === selectedRange)?.label"></span>
        <i class="ph ph-caret-down text-xs"></i>
    </button>

    <div x-ref="dropdown" class="hidden absolute right-0 mt-2 w-48 bg-gray-700
                                  rounded-lg shadow-xl border border-gray-600 z-20">
        <template x-for="range in ranges" :key="range.value">
            <button @click="selectRange(range.value)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600
                           first:rounded-t-lg last:rounded-b-lg"
                    :class="selectedRange === range.value ? 'bg-gray-600 text-white' : ''">
                <span x-text="range.label"></span>
            </button>
        </template>
    </div>
</div>
```

**Flowbite Ref**: Dropdown > Simple dropdown

---

## 5. SparklineChart

**Amac**: Kucuk inline trend grafigi. KPI kartlarinda kullanilir. ECharts mini instance.

**Konum**: `templates/modules/dashboard/components/sparkline-chart.html`

**Jinja2 Macro**:
```jinja2
{% macro sparkline(element_id, data, color="#4ade80", width=80, height=24) %}
<div id="{{ element_id }}"
     x-data
     x-init="
        const chart = echarts.init($el, null, {
            width: {{ width }},
            height: {{ height }},
            renderer: 'svg'
        });
        chart.setOption({
            grid: { top: 0, right: 0, bottom: 0, left: 0 },
            xAxis: { show: false, type: 'category' },
            yAxis: { show: false, type: 'value' },
            series: [{
                type: 'line',
                data: {{ data | tojson }},
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 1.5, color: '{{ color }}' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '{{ color }}33' },
                            { offset: 1, color: '{{ color }}05' }
                        ]
                    }
                }
            }]
        });
     "
     style="width: {{ width }}px; height: {{ height }}px;">
</div>
{% endmacro %}
```

---

## 6. WorkspaceFilter

**Amac**: Dashboard basliginda workspace secimi. Topbar'daki workspace switcher'dan bagimsiz,
sadece dashboard verilerini filtreler (tam gecis yapmaz).

**Konum**: `templates/modules/dashboard/components/workspace-filter.html`

**Alpine.js State**:
```javascript
x-data="{
    selectedWorkspace: '{{ active_workspace.uid }}',
    workspaces: {{ user_workspaces | tojson }},

    switchDashboard(uid) {
        this.selectedWorkspace = uid;
        window.location.href = '/dashboard/workspace/' + uid;
    }
}"
```

**Yapi**: Dropdown select, workspace listesi. Secim yapildiginda
`/dashboard/workspace/{uid}` sayfasina yonlendirir.

---

## Component Bagimliliklari

```
DashboardPage (pages/dashboard.html)
  +-- DateRangeSelector
  +-- KPICard (x4-6, grid)
  |   +-- SparklineChart (her kartta)
  |   +-- TrendArrow (her kartta)
  +-- AIBriefCard
  +-- ActivityFeed
  |   +-- ActivityItem (x10, tekrarlanir)
  +-- TrafficOverviewChart (ECharts stacked area)
  +-- AdapterStatusChart (ECharts doughnut)
  +-- WorkspaceFilter (opsiyonel, SA icin)
```
