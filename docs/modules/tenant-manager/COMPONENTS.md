# tenant-manager — Component Spesifikasyonu

> Tenant yonetimi componentleri. Tablo, detay tabs, olusturma sihirbazi,
> davet modal, rol secici, saglik badge.

---

## 1. TenantTable

**Amac**: Tenant listesini gosteren tablo. Cursor-based pagination, inline arama, filtre.

**Konum**: `templates/modules/tenant_manager/partials/tenant-table.html`

**Alpine.js State** (sayfa seviyesinde):
```javascript
x-data="{
    searchQuery: '',
    selectedPlan: '',
    sortBy: 'created_at_desc',
    selectedTenants: [],
    allSelected: false,

    toggleSelectAll() {
        if (this.allSelected) {
            this.selectedTenants = [];
        } else {
            this.selectedTenants = [...document.querySelectorAll('[data-tenant-uid]')]
                .map(el => el.dataset.tenantUid);
        }
        this.allSelected = !this.allSelected;
    },

    get hasSelection() { return this.selectedTenants.length > 0; }
}"
```

**HTMX Arama + Filtre**:
```html
<div class="flex flex-col sm:flex-row gap-3 mb-4">
    <!-- Arama -->
    <div class="relative flex-1">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3">
            <i class="ph ph-magnifying-glass text-gray-500"></i>
        </div>
        <input type="search" name="search" x-model="searchQuery"
               placeholder="Tenant ara..."
               hx-get="/api/v1/partials/tenant-list"
               hx-trigger="keyup changed delay:300ms"
               hx-target="#tenant-table-body"
               hx-swap="innerHTML"
               hx-include="[name='plan'], [name='sort']"
               class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                      ps-10 p-2.5 w-full focus:ring-blue-500 focus:border-blue-500">
    </div>

    <!-- Plan filtre -->
    <select name="plan" x-model="selectedPlan"
            hx-get="/api/v1/partials/tenant-list"
            hx-trigger="change"
            hx-target="#tenant-table-body"
            hx-swap="innerHTML"
            hx-include="[name='search'], [name='sort']"
            class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                   p-2.5 w-40">
        <option value="">Tum Planlar</option>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
    </select>

    <!-- Siralama -->
    <select name="sort" x-model="sortBy"
            hx-get="/api/v1/partials/tenant-list"
            hx-trigger="change"
            hx-target="#tenant-table-body"
            hx-swap="innerHTML"
            hx-include="[name='search'], [name='plan']"
            class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                   p-2.5 w-48">
        <option value="created_at_desc">En yeni</option>
        <option value="created_at_asc">En eski</option>
        <option value="name_asc">A-Z</option>
        <option value="name_desc">Z-A</option>
        <option value="health_score_desc">Saglik (yuksek)</option>
        <option value="health_score_asc">Saglik (dusuk)</option>
    </select>
</div>
```

**Flowbite Ref**: Tables > Advanced table with actions

---

## 2. TenantDetailTabs

**Amac**: Tenant detay sayfasinda tab navigasyonu. Tab icerikleri HTMX ile yuklenir.

**Konum**: `templates/modules/tenant_manager/pages/tenant-detail.html` (icerisinde)

**Alpine.js State**:
```javascript
x-data="{
    activeTab: 'overview',
    tabs: [
        { id: 'overview',  label: 'Genel Bakis', icon: 'ph-eye', badge: null },
        { id: 'users',     label: 'Kullanicilar', icon: 'ph-users', badge: {{ user_count }} },
        { id: 'settings',  label: 'Ayarlar', icon: 'ph-gear', badge: null }
    ]
}"
```

**Yapi**:
```html
<div class="border-b border-gray-700 mb-6">
    <nav class="flex gap-0 -mb-px" role="tablist">
        <template x-for="tab in tabs" :key="tab.id">
            <button @click="activeTab = tab.id"
                    :class="activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'"
                    class="flex items-center gap-2 px-4 py-3 text-sm font-medium
                           border-b-2 transition-colors"
                    :hx-get="'/tenants/{{ tenant.uid }}/' + tab.id"
                    hx-target="#tab-content"
                    hx-swap="innerHTML"
                    hx-trigger="click once"
                    role="tab">
                <i class="ph" :class="tab.icon"></i>
                <span x-text="tab.label"></span>
                <span x-show="tab.badge !== null"
                      class="ml-1 px-2 py-0.5 bg-gray-700 text-xs rounded-full"
                      x-text="tab.badge"></span>
            </button>
        </template>
    </nav>
</div>

<div id="tab-content">
    <!-- Varsayilan olarak "Genel Bakis" server-side render edilir -->
    {% include 'modules/tenant_manager/partials/tenant-overview.html' %}
</div>
```

**NOT**: `hx-trigger="click once"` — tab icerigi bir kez yuklenir, tekrar tiklaninca
cache'den gelir. `hx-swap="innerHTML"` ile tab container'i guncellenir.

**Flowbite Ref**: Tabs > Underline tabs

---

## 3. CreateWizard

**Amac**: Cok adimli tenant olusturma sihirbazi. Her adim HTMX partial olarak yuklenir.

**Konum**: `templates/modules/tenant_manager/pages/tenant-create.html`

**Alpine.js State**:
```javascript
x-data="{
    currentStep: 1,
    totalSteps: 4,
    formData: {
        // Adim 1
        name: '',
        slug: '',
        sector: '',
        country: 'TR',
        locale: 'tr',
        // Adim 2
        ownerEmail: '',
        ownerIsExisting: false,
        // Adim 3
        plan: 'free',
        billingPeriod: 'monthly'
    },

    get progress() {
        return (this.currentStep / this.totalSteps) * 100;
    },

    generateSlug() {
        this.formData.slug = this.formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    },

    get stepValid() {
        switch (this.currentStep) {
            case 1: return this.formData.name.length >= 2;
            case 2: return this.formData.ownerEmail.includes('@');
            case 3: return true;
            case 4: return true;
            default: return false;
        }
    }
}"
```

**Adim Gostergesi Component**:
```html
<div class="flex items-center justify-center mb-8">
    <template x-for="step in totalSteps" :key="step">
        <div class="flex items-center">
            <!-- Step circle -->
            <div :class="step < currentStep ? 'bg-blue-600 text-white' :
                          step === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' :
                          'bg-gray-700 text-gray-400'"
                 class="w-10 h-10 rounded-full flex items-center justify-center
                        text-sm font-medium transition-all">
                <i x-show="step < currentStep" class="ph ph-check"></i>
                <span x-show="step >= currentStep" x-text="step"></span>
            </div>
            <!-- Connector line -->
            <div x-show="step < totalSteps"
                 :class="step < currentStep ? 'bg-blue-600' : 'bg-gray-700'"
                 class="w-20 h-0.5 transition-all"></div>
        </div>
    </template>
</div>
```

**HTMX Adim Gecisi**:
```html
<form id="wizard-form"
      hx-post="/api/v1/partials/tenant-create-wizard"
      hx-target="#wizard-step-content"
      hx-swap="innerHTML"
      hx-indicator="#wizard-spinner">

    <input type="hidden" name="step" :value="currentStep">
    <!-- formData Alpine.js state'inden hidden input'lar -->

    <div id="wizard-step-content">
        {% include 'modules/tenant_manager/partials/create-wizard-step.html' %}
    </div>

    <div class="flex justify-between mt-8">
        <button type="button" x-show="currentStep > 1"
                @click="currentStep--"
                class="px-6 py-2.5 text-sm text-gray-400 border border-gray-600
                       rounded-lg hover:bg-gray-700">
            <i class="ph ph-arrow-left me-1"></i> Geri
        </button>

        <button type="submit" :disabled="!stepValid"
                @click="if (currentStep < totalSteps) currentStep++"
                class="px-6 py-2.5 text-sm text-white bg-blue-600 rounded-lg
                       hover:bg-blue-700 disabled:opacity-50 ms-auto">
            <span x-show="currentStep < totalSteps">Sonraki <i class="ph ph-arrow-right ms-1"></i></span>
            <span x-show="currentStep === totalSteps">Tenant Olustur <i class="ph ph-check ms-1"></i></span>
        </button>
    </div>
</form>
```

**Flowbite Ref**: Stepper > Detailed stepper

---

## 4. InviteUserModal

**Amac**: Tenant'a kullanici davet etmek icin modal. E-posta, rol secimi, opsiyonel mesaj.

**Konum**: `templates/modules/tenant_manager/partials/invite-modal.html`

**Alpine.js State**:
```javascript
x-data="{
    open: false,
    email: '',
    role: 'AN',
    message: '',
    loading: false,
    error: '',
    success: false,

    get formValid() {
        return this.email.includes('@') && this.role;
    },

    reset() {
        this.email = '';
        this.role = 'AN';
        this.message = '';
        this.error = '';
        this.success = false;
    }
}"
```

**HTMX Submit**:
```html
<form hx-post="/api/v1/tenants/{{ tenant.uid }}/invite"
      hx-target="#invite-result"
      hx-swap="innerHTML"
      hx-indicator="#invite-spinner"
      @htmx:after-request="
          if (event.detail.successful) {
              success = true;
              setTimeout(() => { open = false; reset(); }, 2000);
              htmx.trigger('#tenant-users-tab', 'click');
          }
      ">
```

**Flowbite Ref**: Modal > Form modal

---

## 5. RoleSelector

**Amac**: Rol secimi dropdown. Her rolun aciklamasi tooltip ile gosterilir.

**Konum**: `templates/modules/tenant_manager/components/role-selector.html`

**Jinja2 Macro**:
```jinja2
{% macro role_selector(name="role", selected="AN", exclude_roles=[]) %}
{% set roles = [
    {'value': 'TO', 'label': 'Tenant Owner', 'desc': 'Tam yetki — tenant sahibi', 'icon': 'ph-crown'},
    {'value': 'TA', 'label': 'Tenant Admin', 'desc': 'Yonetim — konfig + kullanici', 'icon': 'ph-shield-check'},
    {'value': 'AN', 'label': 'Analyst', 'desc': 'Analiz + rapor — yazma sinirli', 'icon': 'ph-chart-bar'},
    {'value': 'VW', 'label': 'Viewer', 'desc': 'Salt okunur — sadece gorunum', 'icon': 'ph-eye'}
] %}

<div x-data="{ open: false, selected: '{{ selected }}' }" class="relative">
    <button @click="open = !open" type="button"
            class="flex items-center justify-between w-full px-4 py-2.5
                   bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300
                   hover:bg-gray-600">
        <span x-text="document.querySelector('[data-role-value=&quot;' + selected + '&quot;]')?.dataset.roleLabel || 'Rol secin'"></span>
        <i class="ph ph-caret-down text-xs"></i>
    </button>
    <input type="hidden" :name="'{{ name }}'" :value="selected">

    <div x-show="open" @click.outside="open = false" x-transition
         class="absolute left-0 top-full mt-1 w-full bg-gray-700 rounded-lg
                shadow-xl border border-gray-600 z-50 py-1">
        {% for role in roles %}
        {% if role.value not in exclude_roles %}
        <button type="button"
                data-role-value="{{ role.value }}"
                data-role-label="{{ role.label }}"
                @click="selected = '{{ role.value }}'; open = false"
                class="flex items-start gap-3 w-full px-4 py-3 text-left
                       hover:bg-gray-600 transition-colors"
                :class="selected === '{{ role.value }}' ? 'bg-gray-600' : ''">
            <i class="ph {{ role.icon }} text-lg text-gray-400 mt-0.5"></i>
            <div>
                <span class="text-sm font-medium text-gray-200">{{ role.label }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ role.value }})</span>
                <p class="text-xs text-gray-500 mt-0.5">{{ role.desc }}</p>
            </div>
            <i class="ph ph-check ms-auto text-blue-400"
               x-show="selected === '{{ role.value }}'"></i>
        </button>
        {% endif %}
        {% endfor %}
    </div>
</div>
{% endmacro %}
```

---

## 6. TenantHealthBadge

**Amac**: Tenant saglik skoru gorsel gostergesi. Tooltip ile detay.

**Konum**: `templates/modules/tenant_manager/components/health-badge.html`

**Jinja2 Macro**:
```jinja2
{% macro health_badge(score, size="md", show_tooltip=true) %}
{#
  score : 0-100 arasi int
  size  : "sm" | "md" | "lg"
#}
{% if score >= 80 %}
  {% set color = 'green' %}
  {% set dot = 'bg-green-400' %}
{% elif score >= 50 %}
  {% set color = 'yellow' %}
  {% set dot = 'bg-yellow-400' %}
{% else %}
  {% set color = 'red' %}
  {% set dot = 'bg-red-400' %}
{% endif %}

{% set sizes = {
    'sm': 'text-xs px-2 py-0.5',
    'md': 'text-sm px-2.5 py-1',
    'lg': 'text-base px-3 py-1.5'
} %}

<div class="relative inline-flex" x-data="{ showTooltip: false }">
    <span @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
          class="inline-flex items-center gap-1.5 {{ sizes[size] }}
                 bg-{{ color }}-900/30 text-{{ color }}-400
                 border border-{{ color }}-800/50 rounded-full font-medium cursor-default">
        <span class="w-1.5 h-1.5 {{ dot }} rounded-full"></span>
        {{ score }}
    </span>

    {% if show_tooltip %}
    <div x-show="showTooltip" x-transition
         class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56
                bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-3 z-50">
        <p class="text-xs font-medium text-gray-300 mb-2">Saglik Skoru Dagilimi</p>
        <div class="space-y-1.5 text-xs">
            <div class="flex justify-between">
                <span class="text-gray-400">Adapter Durumu</span>
                <span class="text-gray-300">{{ breakdown.adapter }}/30</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">API Kullanimi</span>
                <span class="text-gray-300">{{ breakdown.api }}/25</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Odeme Durumu</span>
                <span class="text-gray-300">{{ breakdown.payment }}/25</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Kullanici Aktivite</span>
                <span class="text-gray-300">{{ breakdown.activity }}/20</span>
            </div>
        </div>
        <!-- Arrow -->
        <div class="absolute top-full left-1/2 -translate-x-1/2
                    border-4 border-transparent border-t-gray-700"></div>
    </div>
    {% endif %}
</div>
{% endmacro %}
```

**Flowbite Ref**: Badge > Notification badge + Tooltip

---

## 7. OnboardingProgress

**Amac**: Yeni tenant icin onboarding adim takibi. Tamamlanan adimlar isaretlenir.

**Konum**: `templates/modules/tenant_manager/components/onboarding-progress.html`

**Jinja2 Macro**:
```jinja2
{% macro onboarding_progress(steps, completed_count, total_count) %}
{#
  steps: [
    {"label": "Tenant olusturuldu", "completed": true, "href": null},
    {"label": "Yonetici hesabi atandi", "completed": true, "href": null},
    {"label": "Ilk workspace eklendi", "completed": true, "href": "/workspaces/create"},
    {"label": "Adapter baglantisi yapildi", "completed": false, "href": "/adapters/connect"},
    {"label": "Ilk SEO denetimi baslatildi", "completed": false, "href": "/seo/audit"}
  ]
#}
<div class="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6"
     x-data="{ collapsed: false }">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-300">
            Kurulum Ilerlemeniz: {{ completed_count }}/{{ total_count }} adim
        </h3>
        <button @click="collapsed = !collapsed" class="text-gray-500 hover:text-gray-300">
            <i class="ph" :class="collapsed ? 'ph-caret-down' : 'ph-caret-up'"></i>
        </button>
    </div>

    <div x-show="!collapsed" x-transition>
        <!-- Progress bar -->
        <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                 style="width: {{ (completed_count / total_count * 100) | int }}%"></div>
        </div>

        <!-- Steps -->
        <ul class="space-y-2">
            {% for step in steps %}
            <li class="flex items-center gap-3 text-sm">
                {% if step.completed %}
                <i class="ph ph-check-circle text-green-400"></i>
                <span class="text-gray-400 line-through">{{ step.label }}</span>
                {% else %}
                <i class="ph ph-circle-dashed text-gray-600"></i>
                <span class="text-gray-300">{{ step.label }}</span>
                {% if step.href %}
                <a href="{{ step.href }}" class="text-xs text-blue-400 hover:text-blue-300 ml-auto">
                    Tamamla <i class="ph ph-arrow-right"></i>
                </a>
                {% endif %}
                {% endif %}
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endmacro %}
```

---

## Component Bagimliliklari

```
TenantListPage (pages/tenant-list.html)
  +-- TenantTable
  |   +-- TenantRow (tekrarlanir)
  |   |   +-- TenantHealthBadge
  |   +-- CursorPagination
  +-- SearchInput + Filters

TenantDetailPage (pages/tenant-detail.html)
  +-- TenantHeader (adi, slug, plan, saglik skoru)
  |   +-- TenantHealthBadge
  +-- OnboardingProgress (yeni tenant ise)
  +-- TenantDetailTabs
      +-- OverviewTab (varsayilan, server-side)
      +-- UsersTab (HTMX ile)
      |   +-- UserTable
      |   +-- InviteUserModal
      |   |   +-- RoleSelector
      |   +-- PendingInvitations
      +-- SettingsTab (HTMX ile)

TenantCreatePage (pages/tenant-create.html)
  +-- CreateWizard
      +-- StepIndicator
      +-- WizardStep1 (temel bilgiler)
      +-- WizardStep2 (yonetici hesabi)
      +-- WizardStep3 (plan secimi)
      +-- WizardStep4 (onay ozet)
```
