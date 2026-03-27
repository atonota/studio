# dashboard — HTMX Partial Haritasi

> Dashboard HTMX etkilesimleri. KPI kartlari yuklemesi, periyodik yenileme,
> aktivite feed polling, date range filtreleme, ECharts veri cekimi.

---

## Genel Prensipler

- Dashboard partial'lari sayfa yuklemesinde `hx-trigger="load"` ile cekilir
- KPI kartlari 5 dakikada bir yenilenir
- Aktivite feed 60 saniyede bir polling yapar
- AI brief gunluk uretilir, polling gerektirmez
- Date range degistiginde tum partial'lar CustomEvent ile yeniden tetiklenir
- ECharts grafikleri JSON endpoint'lerinden veri alir (HTML partial degil)
- Skeleton loading ilk yukleme sirasinda gosterilir

---

## 1. KPI Kartlari Yuklemesi

```
Konum       : templates/modules/dashboard/pages/dashboard.html
Element     : <div id="stats-container">
Trigger     : hx-trigger="load, every 300s, date-range-changed from:window"
Method      : hx-get="/api/v1/partials/dashboard-stats"
Target      : hx-target="#stats-container"
Swap        : hx-swap="innerHTML transition:true"
Indicator   : (yok — skeleton zaten icerde)
Params      : Dinamik (Alpine.js ile set edilir)

Dinamik Params Mekanizmasi:
  <div id="stats-container"
       x-data="{ dateFrom: '', dateTo: '', period: '7d' }"
       @date-range-changed.window="
           period = $event.detail.period || '';
           dateFrom = $event.detail.from || '';
           dateTo = $event.detail.to || '';
           htmx.trigger($el, 'date-range-changed');
       "
       :hx-vals="JSON.stringify({
           workspace_uid: '{{ active_workspace.uid }}',
           date_from: dateFrom,
           date_to: dateTo,
           period: period
       })"
       hx-get="/api/v1/partials/dashboard-stats"
       hx-trigger="load, every 300s, date-range-changed"
       hx-target="#stats-container"
       hx-swap="innerHTML transition:true">

      <!-- Skeleton (ilk yukleme) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {% for _ in range(4) %}
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
              <div class="h-4 bg-gray-700 rounded w-32 mb-3"></div>
              <div class="h-8 bg-gray-700 rounded w-20 mb-2"></div>
              <div class="h-3 bg-gray-700 rounded w-24"></div>
          </div>
          {% endfor %}
      </div>
  </div>

Server Response:
  Status    : 200
  Body      :
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {% for kpi in kpis %}
        {% include 'modules/dashboard/components/kpi-card.html' %}
        {% endfor %}
    </div>
```

---

## 2. Aktivite Feed Yuklemesi + Polling

```
Konum       : templates/modules/dashboard/pages/dashboard.html
Element     : <div id="activity-feed">
Trigger     : hx-trigger="load, every 60s"
Method      : hx-get="/api/v1/partials/recent-activity"
Target      : hx-target="#activity-feed"
Swap        : hx-swap="innerHTML"
Vals        : hx-vals='{"workspace_uid": "{{ active_workspace.uid }}", "limit": 10}'

Server Response:
  <div class="space-y-0">
      {% for item in activities %}
      {% include 'modules/dashboard/components/activity-item.html' %}
      {% endfor %}

      {% if next_cursor %}
      <div hx-get="/api/v1/partials/recent-activity?cursor={{ next_cursor }}&limit=10"
           hx-trigger="click"
           hx-target="this"
           hx-swap="outerHTML"
           class="py-3 text-center">
          <button class="text-sm text-blue-400 hover:text-blue-300">
              <i class="ph ph-arrow-down"></i> Daha fazla yukle
          </button>
      </div>
      {% endif %}
  </div>
```

### Aktivite Feed "Daha Fazla Yukle" (Cursor Pagination)

```
Element     : <div> (next_cursor container)
Trigger     : hx-trigger="click"
Method      : hx-get="/api/v1/partials/recent-activity?cursor={{ next_cursor }}&limit=10"
Target      : hx-target="this"
Swap        : hx-swap="outerHTML"

NOT: Her "daha fazla yukle" tiklamasi, kendini sonraki sayfa ile degistirir.
     Sonraki sayfada yeni bir "daha fazla yukle" butonu olabilir (veya son sayfaysa olmaz).
     Bu pattern sonsuz kaydirma simulasyonu saglar.
```

---

## 3. AI Brief Yuklemesi

```
Konum       : templates/modules/dashboard/pages/dashboard.html
Element     : <div id="ai-brief-container">
Trigger     : hx-trigger="load"
Method      : hx-get="/api/v1/partials/ai-daily-brief"
Target      : hx-target="#ai-brief-container"
Swap        : hx-swap="innerHTML transition:true"
Vals        : hx-vals='{"workspace_uid": "{{ active_workspace.uid }}"}'

Server Response (brief hazir):
  Status    : 200
  Body      : ai-brief.html partial (tam brief karti)

Server Response (brief henuz uretilmemis):
  Status    : 200
  Body      :
    <div class="bg-gradient-to-br from-blue-900/30 to-purple-900/30
                border border-blue-800/40 rounded-xl p-6 animate-pulse"
         hx-get="/api/v1/partials/ai-daily-brief"
         hx-trigger="load delay:30s"
         hx-target="#ai-brief-container"
         hx-swap="innerHTML">
        <div class="flex items-center gap-3 mb-5">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1
                         bg-blue-600/30 text-blue-300 text-xs rounded-full">
                <i class="ph ph-lightning"></i> AI
            </span>
            <span class="text-gray-400 text-sm">Gunluk brief hazirlaniyor...</span>
        </div>
        <div class="space-y-3">
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-700 rounded w-1/2"></div>
            <div class="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
    </div>

NOT: Brief hazir degilse skeleton gosterir ve 30 saniye sonra tekrar dener.
     Brief uretildikten sonra gercek icerik gelir ve polling durur.
```

---

## 4. ECharts Trafik Grafigi Veri Cekimi

```
Konum       : templates/modules/dashboard/pages/dashboard.html
Element     : <div id="traffic-chart"> (ECharts container)
Trigger     : Alpine.js x-init + date-range-changed event
Method      : fetch() ile JSON cekimi (HTMX degil — ECharts JSON gerektiriyor)

Alpine.js:
  <div id="traffic-chart"
       x-data="{
           chart: null,
           async loadData(period) {
               const res = await fetch('/api/v1/partials/dashboard-traffic-overview?period=' + period);
               const option = await res.json();
               if (!this.chart) {
                   this.chart = echarts.init(this.$el, 'dark', { height: 300 });
               }
               this.chart.setOption(option);
           }
       }"
       x-init="loadData('30d')"
       @date-range-changed.window="loadData($event.detail.period || '30d')"
       @resize.window.debounce.200ms="chart?.resize()"
       class="w-full h-[300px]">
  </div>

NOT: ECharts grafikleri HTMX partial degil, JSON API kullanir.
     Alpine.js fetch ile veri ceker, ECharts instance'ini gunceller.
     Pencere boyutu degistiginde chart.resize() cagirilir.
```

---

## 5. ECharts Adapter Durumu Grafigi

```
Konum       : templates/modules/dashboard/pages/dashboard.html
Element     : <div id="adapter-status-chart">
Trigger     : Alpine.js x-init
Method      : fetch() ile JSON cekimi

Alpine.js:
  <div id="adapter-status-chart"
       x-data="{
           chart: null,
           async loadData() {
               const res = await fetch('/api/v1/partials/dashboard-adapter-status?workspace_uid={{ active_workspace.uid }}');
               const option = await res.json();
               if (!this.chart) {
                   this.chart = echarts.init(this.$el, 'dark', { height: 250 });
               }
               this.chart.setOption(option);
           }
       }"
       x-init="loadData()"
       @resize.window.debounce.200ms="chart?.resize()"
       class="w-full h-[250px]">
  </div>
```

---

## 6. Date Range Degisimi — Tum Partial'lari Tetikleme

```
Mekanizma:
  1. DateRangeSelector componenti Alpine.js CustomEvent firer:
     window.dispatchEvent(new CustomEvent('date-range-changed', {
         detail: { period: '30d' }
     }));

  2. HTMX container'lar bu event'i dinler:
     hx-trigger="..., date-range-changed from:window"

  3. Etkilenen partial'lar:
     - #stats-container    (KPI kartlari)
     - #traffic-chart      (ECharts — Alpine.js dinler)
     - #adapter-status     (ECharts — Alpine.js dinler)

  4. Etkilenmeyen partial'lar:
     - #activity-feed      (tarih filtresiz, kronolojik)
     - #ai-brief-container (gunluk, tarih filtresiz)
```

---

## 7. Manuel Yenileme Butonu

```
Konum       : Dashboard baslik alani
Element     : <button id="refresh-btn">
Trigger     : hx-trigger="click"

Islem:
  <button @click="
      htmx.trigger('#stats-container', 'date-range-changed');
      htmx.trigger('#activity-feed', 'load');
  "
  class="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-400
         hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
      <i class="ph ph-arrows-clockwise"></i>
      Yenile
  </button>

NOT: Tum partial'lari tek tikla yeniler. ECharts grafikleri
     date-range-changed event ile guncellenir.
```

---

## Ozet Tablo

| Akis | Trigger | Endpoint | Target | Swap | Polling |
|------|---------|----------|--------|------|---------|
| KPI kartlari | load + every 300s + date-range-changed | GET dashboard-stats | #stats-container | innerHTML | 5 dk |
| Aktivite feed | load + every 60s | GET recent-activity | #activity-feed | innerHTML | 60 sn |
| Aktivite sayfalama | click | GET recent-activity?cursor= | self | outerHTML | Hayir |
| AI brief | load | GET ai-daily-brief | #ai-brief-container | innerHTML | Hayir |
| AI brief retry | load delay:30s | GET ai-daily-brief | #ai-brief-container | innerHTML | 30 sn (tek seferlik) |
| Trafik grafigi | x-init + date-range-changed | fetch() JSON | ECharts instance | — | Hayir |
| Adapter durumu | x-init | fetch() JSON | ECharts instance | — | Hayir |
| Manuel yenile | click | Tum partial'lar | Tum container'lar | — | Hayir |
| Date range degisimi | change (Alpine.js) | CustomEvent dispatch | — | — | Hayir |
