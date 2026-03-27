# audit-log — Bilesen Spesifikasyonlari

> Her bilesen icin Alpine.js x-data, HTMX attribute'lari ve Flowbite Pro referanslari.

---

## 1. AuditFilterBar

Tarih araligi, aktor, aksiyon tipi, kaynak tipi ve metin arama filtreleri.

```html
<!-- templates/modules/audit/partials/audit-filters.html -->
<div id="audit-filters"
     x-data="auditFilters()"
     class="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">

  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">

    <!-- Aksiyon Filtresi -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Aksiyon
      </label>
      <select name="action"
              hx-get="/api/v1/partials/audit-table"
              hx-target="#audit-table-container"
              hx-swap="innerHTML"
              hx-include="#audit-filters"
              class="flowbite-select text-sm w-full">
        <option value="">Tumumu</option>
        <optgroup label="Kimlik Dogrulama">
          <option value="auth.login">Giris</option>
          <option value="auth.logout">Cikis</option>
          <option value="auth.register">Kayit</option>
          <option value="auth.password_change">Parola Degistirme</option>
          <option value="auth.2fa_enable">2FA Aktif</option>
        </optgroup>
        <optgroup label="Workspace">
          <option value="workspace.create">Olusturma</option>
          <option value="workspace.update">Guncelleme</option>
          <option value="workspace.delete">Silme</option>
        </optgroup>
        <optgroup label="Plugin">
          <option value="plugin.activate">Aktif</option>
          <option value="plugin.deactivate">Pasif</option>
        </optgroup>
        <optgroup label="Ayarlar">
          <option value="settings.api_key_create">API Key Olustur</option>
          <option value="settings.api_key_delete">API Key Sil</option>
          <option value="settings.webhook_create">Webhook Olustur</option>
        </optgroup>
      </select>
    </div>

    <!-- Kullanici Filtresi -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Kullanici
      </label>
      <select name="actor_id"
              hx-get="/api/v1/partials/audit-table"
              hx-target="#audit-table-container"
              hx-swap="innerHTML"
              hx-include="#audit-filters"
              class="flowbite-select text-sm w-full">
        <option value="">Tumumu</option>
        <option value="__system__">Sistem</option>
        {% for user in tenant_users %}
        <option value="{{ user.uid }}">{{ user.email }}</option>
        {% endfor %}
      </select>
    </div>

    <!-- Kaynak Tipi Filtresi -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Kaynak Tipi
      </label>
      <select name="resource_type"
              hx-get="/api/v1/partials/audit-table"
              hx-target="#audit-table-container"
              hx-swap="innerHTML"
              hx-include="#audit-filters"
              class="flowbite-select text-sm w-full">
        <option value="">Tumumu</option>
        <option value="workspace">Workspace</option>
        <option value="plugin">Plugin</option>
        <option value="api_key">API Anahtari</option>
        <option value="webhook">Webhook</option>
        <option value="user">Kullanici</option>
        <option value="tenant">Tenant</option>
      </select>
    </div>

    <!-- Baslangic Tarihi -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Baslangic
      </label>
      <input type="date" name="date_from"
             hx-get="/api/v1/partials/audit-table"
             hx-target="#audit-table-container"
             hx-swap="innerHTML"
             hx-include="#audit-filters"
             hx-trigger="change"
             class="flowbite-input text-sm w-full">
    </div>

    <!-- Bitis Tarihi -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Bitis
      </label>
      <input type="date" name="date_to"
             hx-get="/api/v1/partials/audit-table"
             hx-target="#audit-table-container"
             hx-swap="innerHTML"
             hx-include="#audit-filters"
             hx-trigger="change"
             class="flowbite-input text-sm w-full">
    </div>

    <!-- Metin Arama -->
    <div>
      <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        Ara
      </label>
      <div class="relative">
        <input type="text" name="q"
               placeholder="Aksiyon, kaynak, IP..."
               hx-get="/api/v1/partials/audit-table"
               hx-target="#audit-table-container"
               hx-swap="innerHTML"
               hx-include="#audit-filters"
               hx-trigger="keyup changed delay:500ms"
               class="flowbite-input text-sm w-full pr-8">
        <i class="ph ph-magnifying-glass absolute right-2.5 top-2.5 text-gray-400"></i>
      </div>
    </div>

  </div>

  <!-- Sonuc Filtresi + Temizle -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="result" value="" checked
               hx-get="/api/v1/partials/audit-table"
               hx-target="#audit-table-container"
               hx-swap="innerHTML"
               hx-include="#audit-filters"
               class="w-4 h-4 text-primary-600">
        Tumumu
      </label>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="result" value="success"
               hx-get="/api/v1/partials/audit-table"
               hx-target="#audit-table-container"
               hx-swap="innerHTML"
               hx-include="#audit-filters"
               class="w-4 h-4 text-primary-600">
        <span class="text-green-600">Basarili</span>
      </label>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="result" value="failure"
               hx-get="/api/v1/partials/audit-table"
               hx-target="#audit-table-container"
               hx-swap="innerHTML"
               hx-include="#audit-filters"
               class="w-4 h-4 text-primary-600">
        <span class="text-red-600">Basarisiz</span>
      </label>
    </div>

    <button type="button" @click="clearFilters()"
            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
      <i class="ph ph-x mr-1"></i> Filtreleri Temizle
    </button>
  </div>

</div>

<script>
function auditFilters() {
  return {
    clearFilters() {
      const selects = this.$el.querySelectorAll('select');
      selects.forEach(s => s.value = '');
      const inputs = this.$el.querySelectorAll('input[type="text"], input[type="date"]');
      inputs.forEach(i => i.value = '');
      const radios = this.$el.querySelectorAll('input[type="radio"][value=""]');
      radios.forEach(r => r.checked = true);
      // Tabloyu yenile
      htmx.ajax('GET', '/api/v1/partials/audit-table', {
        target: '#audit-table-container',
        swap: 'innerHTML'
      });
    }
  };
}
</script>
```

---

## 2. AuditTable

Siralama destekli, detay linki iceren audit tablo bileseni.

```html
<!-- templates/modules/audit/partials/audit-table.html -->
<div id="audit-table-container">
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left">
      <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700
                    text-gray-700 dark:text-gray-300">
        <tr>
          <th class="px-4 py-3 w-36">Zaman</th>
          <th class="px-4 py-3">Kullanici</th>
          <th class="px-4 py-3">Aksiyon</th>
          <th class="px-4 py-3">Kaynak</th>
          <th class="px-4 py-3 w-20 text-center">Sonuc</th>
          <th class="px-4 py-3 w-16"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        {% for event in events %}
        {% include 'modules/audit/components/audit-row.html' %}
        {% endfor %}
      </tbody>
    </table>
  </div>

  <!-- Cursor Pagination -->
  {% if next_cursor %}
  <div class="py-4 text-center">
    <button hx-get="/api/v1/partials/audit-table?cursor={{ next_cursor }}"
            hx-target="#audit-table-container tbody"
            hx-swap="beforeend"
            hx-include="#audit-filters"
            hx-indicator="#load-more-spinner"
            class="text-sm text-primary-600 hover:text-primary-800
                   dark:text-primary-400 font-medium">
      <span id="load-more-spinner" class="htmx-indicator mr-2">
        <svg class="animate-spin h-4 w-4 inline">...</svg>
      </span>
      Daha Fazla Yukle
    </button>
  </div>
  {% endif %}

  {% if not events %}
  <div class="py-12 text-center text-gray-500 dark:text-gray-400">
    <i class="ph ph-clipboard-text text-4xl mb-2"></i>
    <p>Filtre kriterlerine uygun kayit bulunamadi.</p>
  </div>
  {% endif %}
</div>
```

---

## 3. AuditRow

Tek bir audit olay satiri.

```html
<!-- templates/modules/audit/components/audit-row.html -->
<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
           {% if event.result == 'failure' %}bg-red-50/30 dark:bg-red-900/5{% endif %}">

  <!-- Zaman + IP -->
  <td class="px-4 py-3">
    <div class="text-sm font-mono text-gray-900 dark:text-white">
      {{ event.created_at | format_time }}
    </div>
    <div class="text-xs text-gray-400 font-mono mt-0.5">
      {% if event.actor_ip %}{{ event.actor_ip }}{% else %}&mdash;{% endif %}
    </div>
  </td>

  <!-- Kullanici -->
  <td class="px-4 py-3">
    {% if event.actor_id %}
    <span class="text-sm text-gray-900 dark:text-white truncate max-w-[150px] inline-block"
          title="{{ event.actor_email }}">
      {{ event.actor_email }}
    </span>
    {% else %}
    <span class="text-sm text-gray-400 italic">sistem</span>
    {% endif %}
  </td>

  <!-- Aksiyon -->
  <td class="px-4 py-3">
    {% include 'modules/audit/components/action-badge.html' %}
  </td>

  <!-- Kaynak -->
  <td class="px-4 py-3">
    {% if event.resource_label %}
    <span class="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] inline-block"
          title="{{ event.resource_label }}">
      {{ event.resource_label }}
    </span>
    {% else %}
    <span class="text-gray-400">&mdash;</span>
    {% endif %}
  </td>

  <!-- Sonuc -->
  <td class="px-4 py-3 text-center">
    {% include 'modules/audit/components/result-badge.html' %}
  </td>

  <!-- Detay -->
  <td class="px-4 py-3">
    <button hx-get="/api/v1/partials/audit-detail/{{ event.uid }}"
            hx-target="#audit-detail-overlay"
            hx-swap="innerHTML"
            @click="$dispatch('open-audit-modal')"
            class="text-primary-600 hover:text-primary-800
                   dark:text-primary-400 text-sm"
            title="Detay">
      <i class="ph ph-arrow-right"></i>
    </button>
  </td>

</tr>
```

---

## 4. AuditDetailModal

Tam metadata JSON goruntuleyici ve iliskili olaylar listesi.

```html
<!-- templates/modules/audit/partials/audit-detail-modal.html -->
<div x-data="{ open: true }"
     x-show="open"
     x-transition
     @open-audit-modal.window="open = true"
     @keydown.escape.window="open = false"
     class="fixed inset-0 z-50 flex items-center justify-center p-4"
     x-cloak>

  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/50" @click="open = false"></div>

  <!-- Modal -->
  <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl
              max-w-2xl w-full max-h-[85vh] overflow-y-auto" @click.away="open = false">

    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b
                border-gray-200 dark:border-gray-700 sticky top-0
                bg-white dark:bg-gray-800 z-10">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Audit Olay Detayi
      </h2>
      <button @click="open = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <i class="ph ph-x text-xl"></i>
      </button>
    </div>

    <!-- Icerik -->
    <div class="p-4 space-y-6">

      <!-- Genel Bilgiler -->
      <section>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Genel Bilgiler
        </h3>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-gray-500 dark:text-gray-400">Olay ID</dt>
          <dd class="text-gray-900 dark:text-white font-mono text-xs break-all">
            {{ event.uid }}
          </dd>

          <dt class="text-gray-500 dark:text-gray-400">Zaman</dt>
          <dd class="text-gray-900 dark:text-white">
            {{ event.created_at | format_datetime }}
          </dd>

          <dt class="text-gray-500 dark:text-gray-400">Aksiyon</dt>
          <dd>{% include 'modules/audit/components/action-badge.html' %}</dd>

          <dt class="text-gray-500 dark:text-gray-400">Sonuc</dt>
          <dd>{% include 'modules/audit/components/result-badge.html' %}</dd>
        </dl>
      </section>

      <!-- Aktor -->
      <section>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Aktor
        </h3>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-gray-500">Kullanici</dt>
          <dd class="text-gray-900 dark:text-white">
            {{ event.actor_email or 'Sistem' }}
          </dd>

          {% if event.actor_id %}
          <dt class="text-gray-500">Kullanici ID</dt>
          <dd class="text-gray-900 dark:text-white font-mono text-xs">
            {{ event.actor_id }}
          </dd>
          {% endif %}

          <dt class="text-gray-500">IP Adresi</dt>
          <dd class="text-gray-900 dark:text-white font-mono">
            {{ event.actor_ip or '—' }}
          </dd>

          {% if event.actor_user_agent %}
          <dt class="text-gray-500">User Agent</dt>
          <dd class="text-gray-900 dark:text-white text-xs truncate"
              title="{{ event.actor_user_agent }}">
            {{ event.actor_user_agent | truncate(60) }}
          </dd>
          {% endif %}
        </dl>
      </section>

      <!-- Kaynak -->
      {% if event.resource_type %}
      <section>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Kaynak
        </h3>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-gray-500">Tip</dt>
          <dd class="text-gray-900 dark:text-white">{{ event.resource_type }}</dd>

          <dt class="text-gray-500">ID</dt>
          <dd class="text-gray-900 dark:text-white font-mono text-xs">
            {{ event.resource_id }}
          </dd>

          <dt class="text-gray-500">Etiket</dt>
          <dd class="text-gray-900 dark:text-white">
            {{ event.resource_label or '—' }}
          </dd>
        </dl>
      </section>
      {% endif %}

      <!-- Metadata JSON Viewer -->
      {% if event.metadata %}
      <section>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Metadata
        </h3>
        {% include 'modules/audit/components/metadata-viewer.html' %}
      </section>
      {% endif %}

      <!-- Iliskili Olaylar -->
      {% if related_events %}
      <section>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Iliskili Olaylar ({{ related_events|length }})
        </h3>
        <div class="space-y-1">
          {% for rel in related_events %}
          <div class="flex items-center justify-between py-2 px-3 rounded
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm cursor-pointer"
               hx-get="/api/v1/partials/audit-detail/{{ rel.uid }}"
               hx-target="#audit-detail-overlay"
               hx-swap="innerHTML">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-gray-400">{{ rel.created_at | format_time }}</span>
              <span class="text-gray-900 dark:text-white">{{ rel.action }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ rel.actor_email or 'sistem' }}</span>
              {% if rel.result == 'success' %}
              <i class="ph-fill ph-check-circle text-green-500 text-xs"></i>
              {% else %}
              <i class="ph-fill ph-x-circle text-red-500 text-xs"></i>
              {% endif %}
            </div>
          </div>
          {% endfor %}
        </div>
      </section>
      {% endif %}

    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end
                sticky bottom-0 bg-white dark:bg-gray-800">
      <button @click="open = false"
              class="text-gray-500 bg-white border border-gray-300 rounded-lg
                     text-sm font-medium px-5 py-2.5 dark:bg-gray-700
                     dark:text-gray-300 dark:border-gray-500
                     hover:bg-gray-100 dark:hover:bg-gray-600">
        Kapat
      </button>
    </div>

  </div>
</div>
```

---

## 5. MetadataViewer

JSON metadata icin katlanabilir agac (tree) gorunumu.

```html
<!-- templates/modules/audit/components/metadata-viewer.html -->
<div x-data="metadataViewer({{ event.metadata | tojson }})"
     class="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">

  <template x-for="(value, key) in data" :key="key">
    <div class="ml-0">
      <template x-if="typeof value === 'object' && value !== null">
        <div>
          <button @click="toggleKey(key)"
                  class="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            <i class="ph text-xs"
               :class="expanded[key] ? 'ph-caret-down' : 'ph-caret-right'"></i>
            <span class="text-purple-400" x-text="'\"' + key + '\"'"></span>
            <span class="text-white">:</span>
            <span class="text-gray-500" x-show="!expanded[key]"
                  x-text="Array.isArray(value) ? '[...]' : '{...}'"></span>
          </button>
          <div x-show="expanded[key]" x-collapse class="ml-4 border-l border-gray-700 pl-3 mt-1">
            <template x-for="(subVal, subKey) in value" :key="subKey">
              <div class="py-0.5">
                <span class="text-purple-400" x-text="'\"' + subKey + '\"'"></span>
                <span class="text-white">: </span>
                <span :class="{
                  'text-green-400': typeof subVal === 'string',
                  'text-yellow-400': typeof subVal === 'number',
                  'text-red-400': typeof subVal === 'boolean'
                }" x-text="typeof subVal === 'string' ? '\"' + subVal + '\"' : String(subVal)">
                </span>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template x-if="typeof value !== 'object' || value === null">
        <div class="py-0.5">
          <span class="text-purple-400" x-text="'\"' + key + '\"'"></span>
          <span class="text-white">: </span>
          <span :class="{
            'text-green-400': typeof value === 'string',
            'text-yellow-400': typeof value === 'number',
            'text-red-400': typeof value === 'boolean',
            'text-gray-500': value === null
          }" x-text="value === null ? 'null' : (typeof value === 'string' ? '\"' + value + '\"' : String(value))">
          </span>
        </div>
      </template>
    </div>
  </template>

</div>

<script>
function metadataViewer(data) {
  return {
    data: data,
    expanded: {},

    init() {
      // Ilk seviye anahtarlari varsayilan olarak ac
      Object.keys(this.data).forEach(key => {
        if (typeof this.data[key] === 'object' && this.data[key] !== null) {
          this.expanded[key] = true;
        }
      });
    },

    toggleKey(key) {
      this.expanded[key] = !this.expanded[key];
    }
  };
}
</script>
```

---

## 6. ActivityTimelineChart

ECharts bar chart: gunluk islem sayisi.

```html
<!-- templates/modules/audit/partials/activity-timeline.html -->
<div x-data="activityTimeline()"
     x-init="initChart()"
     class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">

  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
      Aktivite Zaman Cizgisi
    </h3>
    <select x-model="period" @change="reloadChart()"
            class="flowbite-select text-xs w-28">
      <option value="7">Son 7 gun</option>
      <option value="30" selected>Son 30 gun</option>
      <option value="90">Son 90 gun</option>
    </select>
  </div>

  <div id="activity-timeline-chart" style="height: 200px;"></div>

</div>

<script>
function activityTimeline() {
  return {
    chart: null,
    period: '30',
    chartData: {{ timeline_data | tojson }},

    initChart() {
      const chartDom = document.getElementById('activity-timeline-chart');
      this.chart = echarts.init(chartDom, null, {
        renderer: 'canvas'
      });

      // Tema dinle
      const isDark = document.documentElement.classList.contains('dark');

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function(params) {
            const success = params[0]?.value || 0;
            const failure = params[1]?.value || 0;
            return `${params[0].axisValue}<br/>
                    Basarili: ${success}<br/>
                    Basarisiz: ${failure}<br/>
                    Toplam: ${success + failure}`;
          }
        },
        legend: {
          data: ['Basarili', 'Basarisiz'],
          textStyle: { color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 },
          bottom: 0
        },
        grid: {
          left: '3%', right: '3%', top: '10%', bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.dates,
          axisLabel: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            fontSize: 10,
            rotate: this.chartData.dates.length > 15 ? 45 : 0
          },
          axisLine: { lineStyle: { color: isDark ? '#374151' : '#E5E7EB' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 },
          splitLine: { lineStyle: { color: isDark ? '#1F2937' : '#F3F4F6' } }
        },
        series: [
          {
            name: 'Basarili',
            type: 'bar',
            stack: 'total',
            data: this.chartData.success,
            itemStyle: { color: '#10B981', borderRadius: [0, 0, 0, 0] }
          },
          {
            name: 'Basarisiz',
            type: 'bar',
            stack: 'total',
            data: this.chartData.failure,
            itemStyle: { color: '#EF4444', borderRadius: [4, 4, 0, 0] }
          }
        ]
      });

      // Responsive
      window.addEventListener('resize', () => this.chart.resize());

      // Bar tiklandiginda o gunun filtrelenmis tablosunu goster
      this.chart.on('click', (params) => {
        const date = params.name; // 'YYYY-MM-DD'
        htmx.ajax('GET', `/api/v1/partials/audit-table?date_from=${date}&date_to=${date}`, {
          target: '#audit-table-container',
          swap: 'innerHTML'
        });
      });
    },

    async reloadChart() {
      const response = await fetch(`/api/v1/partials/audit-timeline?days=${this.period}`);
      const html = await response.text();
      // Timeline partial'i yeniden yukle
      htmx.ajax('GET', `/api/v1/partials/audit-timeline?days=${this.period}`, {
        target: '#activity-timeline-container',
        swap: 'innerHTML'
      });
    }
  };
}
</script>
```

---

## 7. ActionBadge

Aksiyon tipine gore renkli badge.

```html
<!-- templates/modules/audit/components/action-badge.html -->
{% set action_category = event.action.split('.')[0] %}
{% set action_colors = {
  'auth': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'workspace': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'plugin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'settings': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'billing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'security': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'notification': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'tenant': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
} %}

<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
             {{ action_colors.get(action_category, 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300') }}">
  {{ event.action }}
</span>
```

---

## 8. ResultBadge

Islem sonuc gostergesi (basarili/basarisiz).

```html
<!-- templates/modules/audit/components/result-badge.html -->
{% if event.result == 'success' %}
<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
  <i class="ph-fill ph-check-circle"></i>
</span>
{% elif event.result == 'failure' %}
<span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-medium">
  <i class="ph-fill ph-x-circle"></i>
</span>
{% else %}
<span class="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
  <i class="ph-fill ph-warning"></i>
</span>
{% endif %}
```

---

## 9. AuditSummaryCard

AI tarafindan olusturulan dogal dil ozet karti.

```html
<!-- templates/modules/audit/partials/audit-summary-card.html -->
<div class="bg-gradient-to-r from-primary-50 to-blue-50
            dark:from-primary-900/20 dark:to-blue-900/20
            rounded-lg border border-primary-200 dark:border-primary-800 p-4"
     hx-get="/api/v1/partials/audit-summary?period=24h"
     hx-trigger="load"
     hx-swap="innerHTML"
     hx-indicator="#summary-spinner">

  <div class="flex items-start gap-3">
    <div class="flex-shrink-0 mt-0.5">
      <i class="ph ph-sparkle text-xl text-primary-600 dark:text-primary-400"></i>
    </div>
    <div class="flex-1">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Aktivite Ozeti
        </h3>
        <select hx-get="/api/v1/partials/audit-summary"
                hx-target="closest div[hx-trigger]"
                hx-swap="innerHTML"
                name="period"
                class="flowbite-select text-xs w-24">
          <option value="1h">1 saat</option>
          <option value="24h" selected>24 saat</option>
          <option value="7d">7 gun</option>
          <option value="30d">30 gun</option>
        </select>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ summary_text }}
      </p>

      {% if stats.anomalies %}
      <div class="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs
                  text-yellow-800 dark:text-yellow-300">
        <i class="ph ph-warning mr-1"></i>
        {% for anomaly in stats.anomalies %}
        <span>{{ anomaly.description }}</span>{% if not loop.last %} &middot; {% endif %}
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>

  <!-- Loading -->
  <div id="summary-spinner" class="htmx-indicator flex justify-center py-4">
    <svg class="animate-spin h-5 w-5 text-primary-600">...</svg>
    <span class="ml-2 text-sm text-gray-500">AI ozet hazirlaniyor...</span>
  </div>

</div>
```

---

## 10. NaturalQueryInput

Dogal dil ile audit log sorgulama bileseni.

```html
<!-- templates/modules/audit/components/natural-query-input.html -->
<div x-data="naturalQuery()" class="mt-3">

  <form hx-post="/api/v1/partials/audit-natural-query"
        hx-target="#audit-table-container"
        hx-swap="innerHTML"
        hx-indicator="#nq-spinner"
        class="relative">

    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <i class="ph ph-sparkle absolute left-3 top-2.5 text-primary-500"></i>
        <input type="text" name="query"
               x-model="query"
               placeholder="Dogal dil ile ara: 'dun kimler giris yapti?'"
               class="flowbite-input text-sm w-full pl-9 pr-20">
        <span id="nq-spinner" class="htmx-indicator absolute right-3 top-2.5">
          <svg class="animate-spin h-4 w-4 text-primary-600">...</svg>
        </span>
      </div>
      <button type="submit" :disabled="!query.trim()"
              class="text-white bg-primary-700 hover:bg-primary-800
                     font-medium rounded-lg text-sm px-4 py-2.5
                     disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="ph ph-arrow-right"></i>
      </button>
    </div>

    <div class="flex gap-2 mt-2">
      <button type="button" @click="setQuery('dun kimler giris yapti?')"
              class="text-xs text-gray-400 hover:text-gray-600
                     dark:hover:text-gray-300 underline">
        dun kimler giris yapti?
      </button>
      <button type="button" @click="setQuery('son 1 haftada basarisiz islemler')"
              class="text-xs text-gray-400 hover:text-gray-600
                     dark:hover:text-gray-300 underline">
        basarisiz islemler
      </button>
      <button type="button" @click="setQuery('bu ay workspace degisiklikleri')"
              class="text-xs text-gray-400 hover:text-gray-600
                     dark:hover:text-gray-300 underline">
        workspace degisiklikleri
      </button>
    </div>
  </form>

</div>

<script>
function naturalQuery() {
  return {
    query: '',
    setQuery(q) {
      this.query = q;
    }
  };
}
</script>
```
