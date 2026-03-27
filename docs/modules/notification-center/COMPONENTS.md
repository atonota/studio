# notification-center — Bilesen Spesifikasyonlari

> Her bilesen icin Alpine.js x-data, HTMX attribute'lari ve Flowbite Pro referanslari.

---

## 1. NotificationCard

Tek bir bildirim kartinin gosterimi. Okunmamis/okunmus durumu, ciddiyet ikonu, zaman damgasi.

```html
<!-- templates/modules/notification/components/notification-card.html -->
<div id="notification-{{ notification.uid }}"
     class="p-4 rounded-lg border transition-all duration-300
            {% if not notification.read_at %}
              bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500
              border-gray-200 dark:border-gray-700
            {% else %}
              bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
            {% endif %}"
     x-data="{ expanded: false }">

  <div class="flex items-start gap-3">

    <!-- Ciddiyet Ikonu -->
    <div class="flex-shrink-0 mt-0.5">
      {% if notification.severity == 'critical' %}
        <i class="ph-fill ph-warning-octagon text-xl text-red-500"></i>
      {% elif notification.severity == 'high' %}
        <i class="ph-fill ph-warning-circle text-xl text-orange-500"></i>
      {% elif notification.severity == 'medium' %}
        <i class="ph-fill ph-warning text-xl text-yellow-500"></i>
      {% elif notification.severity == 'low' %}
        <i class="ph-fill ph-info text-xl text-blue-500"></i>
      {% else %}
        <i class="ph-fill ph-bell text-xl text-gray-400"></i>
      {% endif %}
    </div>

    <!-- Icerik -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ notification.title }}
        </h3>
        <time class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
              title="{{ notification.created_at }}">
          {{ notification.created_at | timeago }}
        </time>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
         :class="expanded ? 'line-clamp-none' : 'line-clamp-2'">
        {{ notification.body }}
      </p>

      <!-- Genisletilmis Metadata -->
      <div x-show="expanded" x-cloak x-collapse class="mt-3">
        {% if notification.metadata %}
        <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded">
          {% for key, value in notification.metadata.items() %}
          <div>
            <span class="font-medium text-gray-500">{{ key | humanize }}:</span>
            <span class="text-gray-900 dark:text-white">{{ value }}</span>
          </div>
          {% endfor %}
        </div>
        {% endif %}
      </div>

      <!-- Aksiyonlar -->
      <div class="flex items-center gap-3 mt-2">
        <button @click="expanded = !expanded"
                class="text-xs text-primary-600 hover:text-primary-800
                       dark:text-primary-400 font-medium">
          <span x-text="expanded ? 'Gizle' : 'Detay'"></span>
        </button>

        {% if not notification.read_at %}
        <button hx-patch="/api/v1/partials/notification/{{ notification.uid }}/read"
                hx-target="#notification-{{ notification.uid }}"
                hx-swap="outerHTML"
                class="text-xs text-gray-500 hover:text-gray-700
                       dark:text-gray-400 dark:hover:text-gray-300 font-medium">
          <i class="ph ph-check mr-1"></i> Okundu Isaretle
        </button>
        {% endif %}

        {% if notification.source_module and notification.source_id %}
        <a href="/{{ notification.source_module }}/{{ notification.source_id }}"
           class="text-xs text-primary-600 hover:text-primary-800
                  dark:text-primary-400 font-medium">
          <i class="ph ph-arrow-right mr-1"></i> Git
        </a>
        {% endif %}
      </div>
    </div>

  </div>
</div>
```

---

## 2. NotificationDropdown

Topbar'da acilan bildirim dropdown'u. Son 5 bildirim + toplu islem.

```html
<!-- templates/modules/notification/partials/notification-dropdown.html -->
<!-- Shell header icinde cagrilir -->
<div x-data="notificationDropdown()" class="relative" @click.away="open = false">

  <!-- Trigger Butonu -->
  <button @click="toggle()" class="relative p-2 text-gray-500 hover:text-gray-700
                                    dark:text-gray-400 dark:hover:text-gray-200">
    <i class="ph ph-bell text-xl"></i>

    <!-- Badge -->
    <span id="notification-badge-topbar"
          hx-get="/api/v1/partials/notification-badge"
          hx-trigger="every 30s"
          hx-swap="innerHTML">
      {% if unread_count > 0 %}
      <span class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center
                   w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
        {{ unread_count if unread_count < 100 else '99+' }}
      </span>
      {% endif %}
    </span>
  </button>

  <!-- Dropdown Panel -->
  <div x-show="open" x-cloak
       x-transition:enter="transition ease-out duration-200"
       x-transition:enter-start="opacity-0 scale-95"
       x-transition:enter-end="opacity-100 scale-100"
       x-transition:leave="transition ease-in duration-150"
       x-transition:leave-start="opacity-100 scale-100"
       x-transition:leave-end="opacity-0 scale-95"
       class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800
              rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">

    <!-- Baslik -->
    <div class="flex items-center justify-between px-4 py-3 border-b
                border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        Bildirimler
      </h3>
      {% if unread_count > 0 %}
      <button hx-post="/api/v1/partials/notification/mark-all-read"
              hx-target="#dropdown-notification-list"
              hx-swap="innerHTML"
              class="text-xs text-primary-600 hover:text-primary-800
                     dark:text-primary-400 font-medium">
        Tumunu Okundu Isaretle
      </button>
      {% endif %}
    </div>

    <!-- Bildirim Listesi -->
    <div id="dropdown-notification-list"
         hx-get="/api/v1/partials/notification-dropdown"
         hx-trigger="revealed"
         hx-swap="innerHTML"
         class="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
      <!-- Partial ile yuklenir -->
    </div>

    <!-- Alt Bar -->
    <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <a href="/notifications"
         class="block text-center text-sm text-primary-600 hover:text-primary-800
                dark:text-primary-400 font-medium">
        Tum Bildirimleri Gor
      </a>
    </div>

  </div>
</div>

<script>
function notificationDropdown() {
  return {
    open: false,
    toggle() {
      this.open = !this.open;
    }
  };
}
</script>
```

---

## 3. NotificationBadge

Okunmamis bildirim sayisi gostergesi. Polling + SSE ile guncellenir.

```html
<!-- templates/modules/notification/partials/badge.html -->
<!-- Bu partial yalnizca badge icerigini doner (tam eleman degil) -->
{% if unread_count > 0 %}
<span class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center
             w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full
             {% if has_critical %}animate-pulse{% endif %}">
  {{ unread_count if unread_count < 100 else '99+' }}
</span>
{% endif %}
```

Polling mekanizmasi (topbar butonunda):
```html
<span hx-get="/api/v1/partials/notification-badge"
      hx-trigger="every 30s, sse:badge-update"
      hx-swap="innerHTML">
  <!-- badge.html icerigi buraya yuklenir -->
</span>
```

SSE ile aninda guncelleme: SSE `badge-update` eventi geldiginde HTMX otomatik olarak
badge'i yeniler (polling'i beklemeden).

---

## 4. RuleBuilder

Kosul satirlari ekleme/cikarma, metrik secici, operator ve esik degeri.

```html
<!-- templates/modules/notification/pages/rule-create.html icinde -->
<form hx-post="/api/v1/partials/notification-rules"
      hx-target="#rule-form-container"
      hx-swap="innerHTML"
      x-data="ruleBuilder()">

  <!-- Kural Adi -->
  <div class="mb-6">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Kural Adi
    </label>
    <input type="text" name="name" required minlength="2" maxlength="100"
           placeholder="ornek: Organik Trafik Dususu"
           class="flowbite-input w-full">
  </div>

  <!-- Aciklama -->
  <div class="mb-6">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Aciklama <span class="text-gray-400 font-normal">(opsiyonel)</span>
    </label>
    <textarea name="description" rows="2" maxlength="500"
              class="flowbite-input w-full"></textarea>
  </div>

  <!-- Kosullar -->
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
      <i class="ph ph-funnel mr-1"></i> Eger
    </h3>

    <div class="space-y-3">
      <template x-for="(condition, index) in conditions" :key="index">
        <div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">

          <!-- Metrik -->
          <select x-model="condition.metric"
                  class="flowbite-select text-sm flex-1">
            <option value="">Metrik sec...</option>
            <template x-for="m in metrics">
              <option :value="m.value" x-text="m.label"></option>
            </template>
          </select>

          <!-- Operator -->
          <select x-model="condition.operator"
                  class="flowbite-select text-sm w-36">
            <template x-for="op in operators">
              <option :value="op.value" x-text="op.label"></option>
            </template>
          </select>

          <!-- Esik -->
          <input type="number" x-model="condition.threshold"
                 step="any" required
                 placeholder="Esik"
                 class="flowbite-input text-sm w-24">

          <!-- Pencere -->
          <select x-model="condition.window"
                  class="flowbite-select text-sm w-28">
            <option value="1h">1 saat</option>
            <option value="6h">6 saat</option>
            <option value="24h">24 saat</option>
            <option value="7d">7 gun</option>
            <option value="30d">30 gun</option>
          </select>

          <!-- Kaldir -->
          <button type="button" @click="removeCondition(index)"
                  x-show="conditions.length > 1"
                  class="text-red-500 hover:text-red-700 p-1">
            <i class="ph ph-minus-circle text-lg"></i>
          </button>

        </div>
      </template>
    </div>

    <button type="button" @click="addCondition()"
            class="mt-3 text-sm text-primary-600 hover:text-primary-800
                   dark:text-primary-400 font-medium flex items-center gap-1">
      <i class="ph ph-plus-circle"></i> Kosul Ekle
    </button>

    <!-- Kosul Mantigi -->
    <div class="mt-4 flex items-center gap-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" x-model="logic" value="and" name="logic"
               class="w-4 h-4 text-primary-600">
        <span class="text-sm">TUM kosullar saglansin (VE)</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" x-model="logic" value="or" name="logic"
               class="w-4 h-4 text-primary-600">
        <span class="text-sm">HERHANGI birisi saglansin (VEYA)</span>
      </label>
    </div>
  </div>

  <!-- Aksiyonlar -->
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
      <i class="ph ph-paper-plane-tilt mr-1"></i> O Zaman
    </h3>

    <div class="space-y-2">
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" x-model="actions.in_app"
               class="w-4 h-4 text-primary-600 rounded">
        <i class="ph ph-bell text-lg text-gray-500"></i>
        <span class="text-sm">In-App Bildirim</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" x-model="actions.email"
               class="w-4 h-4 text-primary-600 rounded">
        <i class="ph ph-envelope text-lg text-gray-500"></i>
        <span class="text-sm">E-posta Gonder</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" x-model="actions.webhook"
               class="w-4 h-4 text-primary-600 rounded">
        <i class="ph ph-webhooks-logo text-lg text-gray-500"></i>
        <span class="text-sm">Webhook Tetikle</span>
      </label>
    </div>
  </div>

  <!-- Bekleme Suresi -->
  <div class="mb-6">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Bekleme Suresi (tekrar tetikleme araligi)
    </label>
    <select name="cooldown_minutes" class="flowbite-select w-48">
      <option value="15">15 dakika</option>
      <option value="30">30 dakika</option>
      <option value="60" selected>1 saat</option>
      <option value="360">6 saat</option>
      <option value="1440">24 saat</option>
    </select>
  </div>

  <!-- Hidden: JSON olarak kosullar ve aksiyonlar -->
  <input type="hidden" name="conditions" :value="JSON.stringify(conditions)">
  <input type="hidden" name="actions" :value="JSON.stringify(getActionsList())">

  <!-- Butonlar -->
  <div class="flex justify-end gap-3">
    <a href="/notifications/rules"
       class="text-gray-500 bg-white border border-gray-300 rounded-lg
              text-sm font-medium px-5 py-2.5 dark:bg-gray-700 dark:text-gray-300
              dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600">
      Iptal
    </a>
    <button type="submit"
            class="text-white bg-primary-700 hover:bg-primary-800
                   font-medium rounded-lg text-sm px-5 py-2.5">
      Kurali Kaydet
    </button>
  </div>

</form>

<script>
function ruleBuilder() {
  return {
    conditions: [{ metric: '', operator: 'lt', threshold: '', window: '24h' }],
    logic: 'and',
    actions: { in_app: true, email: false, webhook: false },

    metrics: [
      { value: 'organic_traffic', label: 'Organik Trafik' },
      { value: 'keyword_rank', label: 'Anahtar Kelime Sirasi' },
      { value: 'page_speed', label: 'Sayfa Hizi (ms)' },
      { value: 'uptime_check', label: 'Site Erisim Durumu' },
      { value: 'domain_authority', label: 'Domain Otoritesi' },
      { value: 'backlink_count', label: 'Backlink Sayisi' },
      { value: 'core_web_vitals_lcp', label: 'LCP (ms)' },
      { value: 'core_web_vitals_cls', label: 'CLS' },
      { value: 'error_rate_4xx', label: '4xx Hata Orani (%)' },
      { value: 'error_rate_5xx', label: '5xx Hata Orani (%)' }
    ],

    operators: [
      { value: 'gt', label: 'buyuk (>)' },
      { value: 'lt', label: 'kucuk (<)' },
      { value: 'gte', label: 'buyuk esit (>=)' },
      { value: 'lte', label: 'kucuk esit (<=)' },
      { value: 'eq', label: 'esit (=)' },
      { value: 'change_pct', label: 'degisim % (%)' }
    ],

    addCondition() {
      this.conditions.push({ metric: '', operator: 'lt', threshold: '', window: '24h' });
    },

    removeCondition(index) {
      if (this.conditions.length > 1) {
        this.conditions.splice(index, 1);
      }
    },

    getActionsList() {
      const list = [];
      if (this.actions.in_app) list.push({ channel: 'in_app' });
      if (this.actions.email) list.push({ channel: 'email' });
      if (this.actions.webhook) list.push({ channel: 'webhook' });
      return list;
    }
  };
}
</script>
```

---

## 5. RuleTable

Mevcut bildirim kurallarinin listesi. Toggle ve silme aksiyonlari.

```html
<!-- templates/modules/notification/partials/rule-table.html -->
<div class="overflow-x-auto">
  <table class="w-full text-sm text-left">
    <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700
                  text-gray-700 dark:text-gray-300">
      <tr>
        <th class="px-4 py-3">Kural Adi</th>
        <th class="px-4 py-3">Kosul</th>
        <th class="px-4 py-3 text-center">Tetiklenme</th>
        <th class="px-4 py-3 text-center">Durum</th>
        <th class="px-4 py-3"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      {% for rule in rules %}
      <tr id="rule-{{ rule.uid }}">
        <td class="px-4 py-3">
          <div class="font-medium text-gray-900 dark:text-white">{{ rule.name }}</div>
          {% if rule.description %}
          <div class="text-xs text-gray-500 mt-0.5">{{ rule.description | truncate(60) }}</div>
          {% endif %}
        </td>
        <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
          {% for cond in rule.conditions %}
          <div class="text-xs">
            <span class="font-mono">{{ cond.metric }}</span>
            {{ cond.operator }} {{ cond.threshold }}
            <span class="text-gray-400">({{ cond.window }})</span>
          </div>
          {% endfor %}
        </td>
        <td class="px-4 py-3 text-center">
          <span class="text-sm font-medium">{{ rule.trigger_count }}</span>
        </td>
        <td class="px-4 py-3 text-center">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox"
                   {% if rule.is_active %}checked{% endif %}
                   hx-patch="/api/v1/partials/notification-rules/{{ rule.uid }}/toggle"
                   hx-target="#rule-{{ rule.uid }}"
                   hx-swap="outerHTML"
                   class="sr-only peer">
            <div class="w-9 h-5 bg-gray-200 peer-checked:bg-primary-600 rounded-full
                        peer after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:rounded-full after:h-4 after:w-4
                        after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </td>
        <td class="px-4 py-3">
          <button hx-delete="/api/v1/partials/notification-rules/{{ rule.uid }}"
                  hx-target="#rule-{{ rule.uid }}"
                  hx-swap="outerHTML swap:500ms"
                  hx-confirm="Bu kurali silmek istediginizden emin misiniz?"
                  class="text-red-500 hover:text-red-700 dark:text-red-400">
            <i class="ph ph-trash"></i>
          </button>
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

---

## 6. SSEListener

HTMX SSE uzantisi ile gercek zamanli bildirim dinleyici + toast gosterici.

```html
<!-- templates/layouts/studio.html icinde (global) -->

<!-- SSE Baglantisi -->
<div hx-ext="sse"
     sse-connect="/api/v1/notifications/stream?token={{ jwt_token }}"
     class="hidden">

  <!-- Badge guncelleme -->
  <div sse-swap="badge-update"
       hx-target="#notification-badge-topbar"
       hx-swap="innerHTML">
  </div>

  <!-- Yeni bildirim geldiginde toast goster -->
  <div sse-swap="notification"
       hx-target="#toast-container"
       hx-swap="afterbegin">
  </div>
</div>

<!-- Toast Container (sag ust kose) -->
<div id="toast-container"
     class="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
     x-data="toastManager()">
</div>

<!-- Toast Template (SSE'den gelen her bildirim icin sunucu bu HTML'i doner) -->
<!--
  templates/modules/notification/components/toast.html
-->
<div x-data="{ show: true }"
     x-init="setTimeout(() => { show = false; $nextTick(() => $el.remove()) }, 8000)"
     x-show="show"
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0 translate-x-4"
     x-transition:enter-end="opacity-100 translate-x-0"
     x-transition:leave="transition ease-in duration-200"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border
            border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3">

  <!-- Ciddiyet Ikonu -->
  <i class="ph-fill ph-{{ severity_icon }} text-xl text-{{ severity_color }}"></i>

  <!-- Icerik -->
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
      {{ body }}
    </p>
    <a href="/notifications" class="text-xs text-primary-600 hover:text-primary-800
                                    dark:text-primary-400 mt-1 inline-block font-medium">
      Gor
    </a>
  </div>

  <!-- Kapat -->
  <button @click="show = false; $nextTick(() => $el.remove())"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1">
    <i class="ph ph-x text-sm"></i>
  </button>

</div>

<script>
function toastManager() {
  return {
    // Maksimum 3 toast gorunur, gerisi kuyrukta bekler
    init() {
      const observer = new MutationObserver(() => {
        const toasts = this.$el.children;
        for (let i = 3; i < toasts.length; i++) {
          toasts[i].style.display = 'none';
        }
      });
      observer.observe(this.$el, { childList: true });
    }
  };
}
</script>
```

---

## 7. SeverityBadge

Ciddiyet seviyesi gosterge bileseni. Tablolarda ve kartlarda kullanilir.

```html
<!-- templates/modules/notification/components/severity-badge.html -->
{% macro severity_badge(severity) %}
<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
  {% if severity == 'critical' %}
    bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400
  {% elif severity == 'high' %}
    bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400
  {% elif severity == 'medium' %}
    bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400
  {% elif severity == 'low' %}
    bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400
  {% else %}
    bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300
  {% endif %}">
  {% if severity == 'critical' %}<i class="ph-fill ph-warning-octagon"></i>{% endif %}
  {% if severity == 'high' %}<i class="ph-fill ph-warning-circle"></i>{% endif %}
  {% if severity == 'medium' %}<i class="ph-fill ph-warning"></i>{% endif %}
  {% if severity == 'low' %}<i class="ph-fill ph-info"></i>{% endif %}
  {{ severity | capitalize }}
</span>
{% endmacro %}
```
