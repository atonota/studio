# shell — Component Spesifikasyonu

> Uygulama kabugu componentleri. Alpine.js x-data, HTMX attribute'leri,
> Phosphor icon kullanimi, Flowbite Pro referanslari.

---

## 1. Sidebar

**Amac**: Rol bazli navigasyon menusu. Acik/kapali/daraltilmis modlar. Responsive.

**Konum**: `templates/modules/shell/partials/sidebar-nav.html`

**Alpine.js State** (shell layout seviyesinde):
```javascript
x-data="{
    sidebarOpen: window.innerWidth >= 1280,
    sidebarCollapsed: window.innerWidth >= 1024 && window.innerWidth < 1280,
    mobileMenuOpen: false,
    activeGroup: null,

    toggleSidebar() {
        if (window.innerWidth < 1024) {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    },

    toggleGroup(group) {
        this.activeGroup = this.activeGroup === group ? null : group;
    },

    init() {
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1280) {
                this.sidebarOpen = true;
                this.sidebarCollapsed = false;
                this.mobileMenuOpen = false;
            } else if (window.innerWidth >= 1024) {
                this.sidebarCollapsed = true;
                this.mobileMenuOpen = false;
            }
        });
    }
}"
```

**Menu Ogeleri Veri Yapisi** (server-side, Jinja2 context):
```python
# menu_builder.py ciktisi
menu_items = [
    {
        "group": "GENEL",
        "items": [
            {"label": "Dashboard", "icon": "ph-house", "href": "/", "badge": None, "min_role": "VW"},
            {"label": "Tenant'lar", "icon": "ph-buildings", "href": "/tenants", "badge": None, "min_role": "SA"},
            {"label": "Workspace'ler", "icon": "ph-globe", "href": "/workspaces", "badge": None, "min_role": "TA"},
            {"label": "Adaptorler", "icon": "ph-plugs-connected", "href": "/adapters", "badge": None, "min_role": "TA"},
        ]
    },
    {
        "group": "ANALİZ",
        "items": [
            {"label": "SEO", "icon": "ph-chart-line-up", "href": "/seo", "badge": 5, "min_role": "AN",
             "children": [
                {"label": "Anahtar Kelimeler", "href": "/seo/keywords"},
                {"label": "Siralamalar", "href": "/seo/rankings"},
                {"label": "Site Denetim", "href": "/seo/audit"},
             ]},
            {"label": "Icerik", "icon": "ph-article", "href": "/content", "badge": None, "min_role": "AN"},
            {"label": "Web Analitik", "icon": "ph-chart-bar", "href": "/analytics", "badge": None, "min_role": "AN"},
        ]
    },
    {
        "group": "SİSTEM",
        "items": [
            {"label": "Ayarlar", "icon": "ph-gear", "href": "/settings", "badge": None, "min_role": "VW"},
            {"label": "Audit Log", "icon": "ph-clipboard-text", "href": "/audit", "badge": None, "min_role": "SA"},
            {"label": "Bildirimler", "icon": "ph-bell", "href": "/notifications", "badge": 3, "min_role": "AN"},
        ]
    }
]
```

**Flowbite Ref**: Sidebar > Multi-level dropdown, Collapsible

---

## 2. Topbar

**Amac**: Ust navigasyon cubugu. Arama, bildirimler, kullanici dropdown.

**Konum**: `templates/modules/shell/partials/topbar.html`

**Alpine.js State**:
```javascript
x-data="{
    userDropdownOpen: false,
    searchFocused: false
}"
```

**Yapi**:
```html
<header class="sticky top-0 z-30 h-16 bg-gray-800 border-b border-gray-700
               flex items-center justify-between px-4 lg:px-6">

    <!-- Sol: Hamburger + Breadcrumb -->
    <div class="flex items-center gap-4">
        <button @click="toggleSidebar()" class="lg:hidden text-gray-400 hover:text-white">
            <i class="ph ph-list text-xl"></i>
        </button>
        <div id="breadcrumb-container"
             hx-get="/api/v1/partials/shell/breadcrumb?path={{ request.path }}"
             hx-trigger="load"
             hx-swap="innerHTML">
        </div>
    </div>

    <!-- Sag: Arama + Bildirim + User -->
    <div class="flex items-center gap-3">
        <!-- Arama -->
        <button @click="$dispatch('open-command-palette')"
                class="hidden sm:flex items-center gap-2 px-3 py-1.5
                       bg-gray-700 rounded-lg text-sm text-gray-400
                       hover:bg-gray-600 border border-gray-600">
            <i class="ph ph-magnifying-glass"></i>
            <span>Ara...</span>
            <kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Cmd+K</kbd>
        </button>

        <!-- Bildirim Badge -->
        <div hx-get="/api/v1/partials/shell/notification-badge"
             hx-trigger="load, every 30s"
             hx-swap="innerHTML"
             id="notification-badge-container">
        </div>

        <!-- User Dropdown -->
        <div id="user-dropdown-container"
             hx-get="/api/v1/partials/shell/user-dropdown"
             hx-trigger="load"
             hx-swap="innerHTML">
        </div>
    </div>
</header>
```

**Flowbite Ref**: Navbar > With search and user dropdown

---

## 3. Breadcrumb

**Amac**: Sayfa hiyerarsisi gostergesi. Server-side path'ten uretilir.

**Konum**: `templates/modules/shell/partials/breadcrumb.html`

**Jinja2 Macro**:
```jinja2
{% macro breadcrumb(segments) %}
{# segments: [{"label": "Dashboard", "href": "/"}, {"label": "Tenant'lar", "href": "/tenants"}, ...] #}
<nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
        {% for segment in segments %}
        <li class="inline-flex items-center">
            {% if not loop.first %}
            <i class="ph ph-caret-right text-gray-500 mx-1"></i>
            {% endif %}

            {% if loop.last %}
            <span class="text-sm font-medium text-gray-300">{{ segment.label }}</span>
            {% else %}
            <a href="{{ segment.href }}"
               class="text-sm text-gray-400 hover:text-white">
                {% if loop.first %}
                <i class="ph ph-house me-1"></i>
                {% endif %}
                {{ segment.label }}
            </a>
            {% endif %}
        </li>
        {% endfor %}
    </ol>
</nav>
{% endmacro %}
```

**Flowbite Ref**: Breadcrumb > Default

---

## 4. CommandPalette (Cmd+K)

**Amac**: Global arama ve hizli erisim paleti. Overlay modal, debounce arama.

**Konum**: `templates/modules/shell/partials/command-palette.html`

**Alpine.js State**:
```javascript
x-data="{
    open: false,
    query: '',
    selectedIndex: 0,
    results: [],
    recentSearches: [],
    quickActions: [
        { label: 'Dashboard', icon: 'ph-house', href: '/', shortcut: 'Ctrl+D' },
        { label: 'Ayarlar', icon: 'ph-gear', href: '/settings', shortcut: 'Ctrl+,' },
        { label: 'Yeni Tenant', icon: 'ph-plus', href: '/tenants/create', shortcut: 'Ctrl+N' },
    ],

    toggle() {
        this.open = !this.open;
        if (this.open) {
            this.$nextTick(() => this.$refs.searchInput.focus());
            this.query = '';
            this.selectedIndex = 0;
        }
    },

    handleKeydown(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.totalResults - 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            this.navigateToSelected();
        } else if (event.key === 'Escape') {
            this.open = false;
        }
    },

    get totalResults() {
        return this.query ? this.results.length : this.quickActions.length;
    },

    navigateToSelected() {
        const items = this.query ? this.results : this.quickActions;
        if (items[this.selectedIndex]) {
            window.location.href = items[this.selectedIndex].href;
        }
    }
}"

x-init="
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggle();
        }
    });
    $el.addEventListener('open-command-palette', () => toggle());
"
```

**HTMX Arama**:
```html
<input x-ref="searchInput"
       x-model="query"
       hx-get="/api/v1/partials/shell/global-search"
       hx-trigger="keyup changed delay:200ms"
       hx-target="#search-results"
       hx-swap="innerHTML"
       hx-params="q"
       name="q"
       placeholder="Arama yapin..."
       class="w-full bg-transparent border-0 text-white text-lg
              placeholder-gray-500 focus:ring-0 focus:outline-none">
```

**Flowbite Ref**: Modal > Search modal

---

## 5. WorkspaceSwitcher

**Amac**: Aktif workspace'i degistirmek icin dropdown. Sidebar'da yer alir.

**Konum**: `templates/modules/shell/partials/workspace-selector.html`

**Alpine.js State**:
```javascript
x-data="{
    open: false,
    searchQuery: '',
    activeWorkspace: {
        uid: '{{ active_workspace.uid }}',
        name: '{{ active_workspace.name }}',
        domain: '{{ active_workspace.domain }}'
    }
}"
```

**HTMX**:
```html
<!-- Dropdown icerik yuklemesi -->
<div x-show="open" x-transition
     hx-get="/api/v1/partials/shell/workspace-selector"
     hx-trigger="intersect once"
     hx-swap="innerHTML"
     class="absolute left-0 top-full mt-1 w-64 bg-gray-700 rounded-lg
            shadow-xl border border-gray-600 z-50">
</div>

<!-- Workspace arama -->
<input hx-get="/api/v1/partials/shell/workspace-selector"
       hx-trigger="keyup changed delay:300ms"
       hx-target="#workspace-list"
       hx-swap="innerHTML"
       hx-params="search"
       name="search"
       placeholder="Workspace ara...">

<!-- Workspace secim -->
<button hx-post="/api/v1/partials/shell/workspace-switch"
        hx-vals='{"workspace_uid": "{{ ws.uid }}"}'
        class="w-full text-left px-3 py-2 hover:bg-gray-600 rounded">
    {{ ws.name }}
</button>
```

**Flowbite Ref**: Dropdown > With search

---

## 6. LocaleSelector

**Amac**: Dil secici. Sidebar alt kisiminda. 5 dil destegi.

**Konum**: `templates/modules/shell/partials/locale-selector.html`

**Alpine.js State**:
```javascript
x-data="{
    open: false,
    currentLocale: '{{ current_locale }}',
    locales: [
        { code: 'tr', label: 'Turkce',    flag: '🇹🇷' },
        { code: 'en', label: 'English',   flag: '🇬🇧' },
        { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
        { code: 'fr', label: 'Francais',  flag: '🇫🇷' },
        { code: 'es', label: 'Espanol',   flag: '🇪🇸' }
    ]
}"
```

**HTMX**:
```html
<button @click="open = !open"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm
               text-gray-400 hover:bg-gray-700 rounded-lg">
    <span x-text="locales.find(l => l.code === currentLocale)?.flag"></span>
    <span x-text="locales.find(l => l.code === currentLocale)?.label"
          x-show="!$store.sidebar?.collapsed"></span>
    <i class="ph ph-caret-up-down ms-auto" x-show="!$store.sidebar?.collapsed"></i>
</button>

<template x-for="locale in locales" :key="locale.code">
    <button @click="open = false"
            hx-post="/api/v1/partials/shell/locale-switch"
            :hx-vals="JSON.stringify({ locale: locale.code })"
            class="flex items-center gap-2 w-full px-3 py-2 text-sm
                   text-gray-300 hover:bg-gray-600 rounded">
        <span x-text="locale.flag"></span>
        <span x-text="locale.label"></span>
        <i class="ph ph-check ms-auto text-blue-400"
           x-show="locale.code === currentLocale"></i>
    </button>
</template>
```

**Flowbite Ref**: Dropdown > Simple

---

## 7. UserDropdown

**Amac**: Kullanici bilgileri, profil linki, cikis butonu.

**Konum**: `templates/modules/shell/partials/user-dropdown.html`

**Alpine.js State**:
```javascript
x-data="{ open: false }"
```

**Yapi**:
```html
<div class="relative">
    <button @click="open = !open" class="flex items-center gap-2">
        <img src="{{ user.avatar_url or '/static/img/default-avatar.svg' }}"
             alt="{{ user.display_name }}"
             class="w-8 h-8 rounded-full border-2 border-gray-600">
        <span class="hidden md:block text-sm text-gray-300">{{ user.display_name }}</span>
        <i class="ph ph-caret-down text-gray-400 text-xs"></i>
    </button>

    <div x-show="open" @click.outside="open = false" x-transition
         class="absolute right-0 top-full mt-2 w-56 bg-gray-700 rounded-lg
                shadow-xl border border-gray-600 z-50">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-600">
            <p class="text-sm font-medium text-white">{{ user.display_name }}</p>
            <p class="text-xs text-gray-400">{{ user.email }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 bg-blue-600/20 text-blue-400
                         text-xs rounded-full">{{ user.role_label }}</span>
        </div>

        <!-- Menu -->
        <ul class="py-1">
            <li><a href="/settings/profile" class="flex items-center gap-2 px-4 py-2
                   text-sm text-gray-300 hover:bg-gray-600">
                <i class="ph ph-user"></i> Profilim</a></li>
            <li><a href="/settings" class="flex items-center gap-2 px-4 py-2
                   text-sm text-gray-300 hover:bg-gray-600">
                <i class="ph ph-gear"></i> Ayarlar</a></li>
            <li><a href="/settings/api-keys" class="flex items-center gap-2 px-4 py-2
                   text-sm text-gray-300 hover:bg-gray-600">
                <i class="ph ph-key"></i> API Anahtarlari</a></li>
        </ul>

        <div class="border-t border-gray-600 py-1">
            <form method="POST" action="/api/v1/auth/logout">
                <button type="submit" class="flex items-center gap-2 w-full px-4 py-2
                        text-sm text-red-400 hover:bg-gray-600">
                    <i class="ph ph-sign-out"></i> Cikis Yap
                </button>
            </form>
        </div>
    </div>
</div>
```

**Flowbite Ref**: Navbar > User dropdown

---

## Component Bagimliliklari

```
ShellLayout (layouts/shell.html)
  +-- Sidebar
  |   +-- WorkspaceSwitcher
  |   +-- NavItem (macro, tekrarlanir)
  |   +-- NavGroup (macro, tekrarlanir)
  |   +-- NavBadge (macro, opsiyonel)
  |   +-- LocaleSelector
  +-- Topbar
  |   +-- Breadcrumb
  |   +-- NotificationBadge (partial, polling)
  |   +-- UserDropdown
  +-- CommandPalette (overlay)
  +-- MobileMenu (overlay, < 768px)
```
