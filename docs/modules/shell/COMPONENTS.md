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

## 4. SpotlightSearch (Cmd+K / Ctrl+K)

**Amac**: macOS Spotlight benzeri global arama. Paneldeki HER SEYI arayabilir:
tenant, workspace, plugin, SEO keyword, icerik sayfasi, ayarlar, kullanici,
audit log, bildirim, adaptor, rapor — tum moduller. Tam ekran overlay olarak acilir.

**Tetikleme**: `Cmd+K` (macOS) veya `Ctrl+K` (Windows/Linux)
**Konum**: `templates/modules/shell/partials/spotlight-search.html`

**Aranabilir Kapsamlar (Paneldeki Her Sey)**:

| Kategori | Kaynak | Ikon | Ornek |
|----------|--------|------|-------|
| Tenant'lar | core.tenants | ph-buildings | "Acme Corp" |
| Workspace'ler | core.workspaces | ph-globe | "acme.com" |
| Plugin'ler | core.plugins | ph-puzzle-piece | "SEO Analyzer" |
| Kullanicilar | core.auth_users | ph-user | "admin@acme.com" |
| Adaptorler | core.adapters | ph-plugs-connected | "WordPress REST API" |
| SEO Keywords | analytics.keywords | ph-magnifying-glass | "organic seo tools" |
| Icerik Sayfalari | analytics.content_pages | ph-file-text | "/blog/seo-rehberi" |
| Audit Log | audit.events | ph-clock-counter-clockwise | "tenant.create" |
| Bildirimler | notifications | ph-bell | "Trafik anomalisi" |
| Raporlar | reports | ph-chart-bar | "Haftalik SEO Raporu" |
| Sayfalar (navigasyon) | statik | ph-browsers | "SEO Dashboard" |
| Ayarlar | statik | ph-gear | "API Anahtarlari" |
| Komutlar (hizli aksiyon) | statik | ph-lightning | "Yeni Tenant Olustur" |

**Alpine.js State**:
```javascript
x-data="{
    open: false,
    query: '',
    selectedIndex: 0,
    activeScope: 'all',
    results: [],
    resultCount: 0,
    loading: false,
    recentSearches: JSON.parse(localStorage.getItem('atonota_recent_searches') || '[]'),

    scopes: [
        { id: 'all',         label: 'Tumu',         icon: 'ph-magnifying-glass', shortcut: null },
        { id: 'tenants',     label: 'Tenant',       icon: 'ph-buildings',        shortcut: null },
        { id: 'workspaces',  label: 'Workspace',    icon: 'ph-globe',            shortcut: null },
        { id: 'plugins',     label: 'Plugin',       icon: 'ph-puzzle-piece',     shortcut: null },
        { id: 'seo',         label: 'SEO',          icon: 'ph-chart-line-up',    shortcut: null },
        { id: 'content',     label: 'Icerik',       icon: 'ph-file-text',        shortcut: null },
        { id: 'users',       label: 'Kullanici',    icon: 'ph-user',             shortcut: null },
        { id: 'audit',       label: 'Audit Log',    icon: 'ph-clock-counter-clockwise', shortcut: null },
        { id: 'pages',       label: 'Sayfalar',     icon: 'ph-browsers',         shortcut: null },
        { id: 'commands',    label: 'Komutlar',     icon: 'ph-lightning',        shortcut: null },
    ],

    quickCommands: [
        { label: 'Dashboard',         icon: 'ph-house',            href: '/',                  shortcut: 'Ctrl+D' },
        { label: 'Ayarlar',           icon: 'ph-gear',             href: '/settings',          shortcut: 'Ctrl+,' },
        { label: 'Yeni Tenant',       icon: 'ph-plus',             href: '/tenants/create',    shortcut: 'Ctrl+N' },
        { label: 'Yeni Workspace',    icon: 'ph-plus-circle',      href: '/workspaces/create', shortcut: null },
        { label: 'SEO Denetimi',      icon: 'ph-magnifying-glass', href: '/seo/audit',         shortcut: null },
        { label: 'Icerik Analizi',    icon: 'ph-file-text',        href: '/content',           shortcut: null },
        { label: 'Bildirimler',       icon: 'ph-bell',             href: '/notifications',     shortcut: null },
        { label: 'AI Asistan',        icon: 'ph-robot',            href: '/ai',                shortcut: 'Ctrl+J' },
    ],

    toggle() {
        this.open = !this.open;
        if (this.open) {
            this.$nextTick(() => this.$refs.searchInput.focus());
            this.query = '';
            this.selectedIndex = 0;
            this.activeScope = 'all';
            this.results = [];
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },

    close() {
        this.open = false;
        document.body.style.overflow = '';
    },

    setScope(scopeId) {
        this.activeScope = scopeId;
        this.selectedIndex = 0;
        if (this.query.length >= 2) {
            this.$refs.searchInput.dispatchEvent(new Event('input'));
        }
    },

    handleKeydown(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.totalResults - 1);
            this.scrollToSelected();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.scrollToSelected();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            this.navigateToSelected();
        } else if (event.key === 'Escape') {
            this.close();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            // Tab ile scope degistir
            const currentIdx = this.scopes.findIndex(s => s.id === this.activeScope);
            const nextIdx = event.shiftKey
                ? (currentIdx - 1 + this.scopes.length) % this.scopes.length
                : (currentIdx + 1) % this.scopes.length;
            this.setScope(this.scopes[nextIdx].id);
        }
    },

    get totalResults() {
        return this.query.length >= 2 ? this.resultCount : this.quickCommands.length;
    },

    navigateToSelected() {
        const items = this.query.length >= 2 ? this.results : this.quickCommands;
        if (items[this.selectedIndex]) {
            this.saveRecentSearch(this.query || items[this.selectedIndex].label);
            window.location.href = items[this.selectedIndex].href;
        }
    },

    scrollToSelected() {
        const el = document.querySelector('[data-spotlight-index=\"' + this.selectedIndex + '\"]');
        if (el) el.scrollIntoView({ block: 'nearest' });
    },

    saveRecentSearch(term) {
        if (!term || term.length < 2) return;
        let recent = this.recentSearches.filter(r => r !== term);
        recent.unshift(term);
        this.recentSearches = recent.slice(0, 5);
        localStorage.setItem('atonota_recent_searches', JSON.stringify(this.recentSearches));
    },

    clearRecent() {
        this.recentSearches = [];
        localStorage.removeItem('atonota_recent_searches');
    }
}"

x-init="
    // Cmd+K (macOS) veya Ctrl+K (Windows/Linux) ile tetikle
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggle();
        }
    });
    // Custom event ile de tetiklenebilir
    $el.addEventListener('open-spotlight', () => toggle());
"
```

**HTMX Arama**:
```html
<!-- Spotlight overlay -->
<div x-show="open"
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     @click.self="close()"
     class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm
            flex items-start justify-center pt-[15vh]">

    <!-- Spotlight card -->
    <div class="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl
                border border-gray-700 overflow-hidden"
         @click.outside="close()"
         @keydown="handleKeydown($event)">

        <!-- Arama input -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
            <i class="ph ph-magnifying-glass text-xl text-gray-400"></i>
            <input x-ref="searchInput"
                   x-model="query"
                   hx-get="/api/v1/partials/shell/spotlight-search"
                   hx-trigger="keyup changed delay:150ms"
                   hx-target="#spotlight-results"
                   hx-swap="innerHTML"
                   hx-params="q,scope"
                   hx-vals="js:{scope: activeScope}"
                   hx-indicator="#spotlight-spinner"
                   name="q"
                   type="text"
                   autocomplete="off"
                   placeholder="Panelde ara... tenant, workspace, SEO, icerik, ayarlar..."
                   class="w-full bg-transparent border-0 text-white text-lg
                          placeholder-gray-500 focus:ring-0 focus:outline-none">
            <div id="spotlight-spinner" class="htmx-indicator">
                <svg class="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                            stroke-width="4" fill="none" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
            </div>
            <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1
                        bg-gray-700 text-gray-400 text-xs rounded border border-gray-600">
                ESC
            </kbd>
        </div>

        <!-- Scope tabs (kategori filtreleri) -->
        <div class="flex items-center gap-1 px-4 py-2 border-b border-gray-700
                    overflow-x-auto scrollbar-hide">
            <template x-for="scope in scopes" :key="scope.id">
                <button @click="setScope(scope.id)"
                        :class="activeScope === scope.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-400 hover:text-gray-200'"
                        class="flex items-center gap-1.5 px-3 py-1 rounded-full
                               text-sm whitespace-nowrap transition-colors">
                    <i class="ph" :class="scope.icon"></i>
                    <span x-text="scope.label"></span>
                </button>
            </template>
        </div>

        <!-- Sonuclar alani -->
        <div id="spotlight-results"
             class="max-h-[50vh] overflow-y-auto overscroll-contain">
            <!-- HTMX ile doldurulur -->
            <!-- Bos durum: son aramalar + hizli komutlar gosterilir -->
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-2
                    border-t border-gray-700 text-sm text-gray-500">
            <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-gray-700 rounded text-xs">↑↓</kbd> gezin
                </span>
                <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> ac
                </span>
                <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Tab</kbd> kapsam
                </span>
            </div>
            <span x-show="resultCount > 0"
                  x-text="resultCount + ' sonuc'"
                  class="text-gray-500"></span>
        </div>
    </div>
</div>
```
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
