# shell — HTMX Partial Haritasi

> Shell modulu HTMX etkilesimleri. Sidebar, topbar, workspace switcher,
> bildirim polling, global arama debounce, dil degisimi.

---

## Genel Prensipler

- Shell partial'lari her sayfa yuklemesinde aktiftir (layout seviyesi)
- Bildirim badge'i periyodik polling kullanir (SSE notification-center modulune gecinceye kadar)
- Workspace degisimi tam sayfa yenileme tetikler (HX-Redirect)
- Dil degisimi tam sayfa yenileme tetikler (HX-Refresh)
- Tum partial'lar authenticated kullanici gerektirir

---

## 1. Sidebar Navigasyon Yuklemesi

```
Konum       : templates/layouts/shell.html (layout icerisinde)
Element     : <nav id="sidebar-nav">
Trigger     : hx-trigger="load"
Method      : hx-get="/api/v1/partials/shell/sidebar-nav"
Target      : hx-target="#sidebar-nav"
Swap        : hx-swap="innerHTML"

Server Response:
  Status    : 200
  Body      : sidebar-nav.html partial
  Icerik    : Rol bazli filtrelenmis menu ogeleri

  {% for group in menu_groups %}
  <div class="mb-6">
      <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ group.label }}
      </h3>
      <ul class="space-y-1">
          {% for item in group.items %}
          <li>
              <a href="{{ item.href }}"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                        {{ 'bg-gray-700 text-white' if item.active else 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' }}">
                  <i class="ph {{ item.icon }} text-lg"></i>
                  <span>{{ item.label }}</span>
                  {% if item.badge %}
                  <span class="ms-auto bg-blue-600 text-white text-xs font-medium
                               px-2 py-0.5 rounded-full">{{ item.badge }}</span>
                  {% endif %}
              </a>
              {% if item.children and item.active %}
              <ul class="mt-1 ml-8 space-y-1">
                  {% for child in item.children %}
                  <li>
                      <a href="{{ child.href }}"
                         class="block px-3 py-1.5 text-sm rounded
                                {{ 'text-white' if child.active else 'text-gray-500 hover:text-gray-300' }}">
                          {{ child.label }}
                      </a>
                  </li>
                  {% endfor %}
              </ul>
              {% endif %}
          </li>
          {% endfor %}
      </ul>
  </div>
  {% endfor %}

Cache       : ETag bazli, 5 dk (rol degismedikce ayni partial doner)
```

---

## 2. Bildirim Badge Polling

```
Konum       : templates/modules/shell/partials/topbar.html
Element     : <div id="notification-badge-container">
Trigger     : hx-trigger="load, every 30s"
Method      : hx-get="/api/v1/partials/shell/notification-badge"
Target      : hx-target="#notification-badge-container"
Swap        : hx-swap="innerHTML"

Server Response (bildirim var):
  <a href="/notifications" class="relative p-2 text-gray-400 hover:text-white rounded-lg
     hover:bg-gray-700">
      <i class="ph ph-bell text-xl"></i>
      <span class="absolute -top-0.5 -right-0.5 flex items-center justify-center
                   w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
          {{ count if count <= 99 else '99+' }}
      </span>
  </a>

Server Response (bildirim yok):
  <a href="/notifications" class="relative p-2 text-gray-400 hover:text-white rounded-lg
     hover:bg-gray-700">
      <i class="ph ph-bell text-xl"></i>
  </a>

NOT: 30 saniye aralikla polling yapilir.
     notification-center modulu aktif olunca SSE'ye gecilebilir.
```

---

## 3. Spotlight Search (Cmd+K / Ctrl+K)

```
Konum       : templates/modules/shell/partials/command-palette.html
Element     : <input x-ref="searchInput" name="q">
Trigger     : hx-trigger="keyup changed delay:200ms"
Method      : hx-get="/api/v1/partials/shell/spotlight-search"
Target      : hx-target="#search-results"
Swap        : hx-swap="innerHTML"
Params      : hx-params="q"
Condition   : Query min 2 karakter olmali (server-side kontrol)

Server Response:
  <div id="search-results">
      {% if results.tenants %}
      <div class="px-3 py-2">
          <h4 class="text-xs font-semibold text-gray-500 uppercase">Tenant'lar</h4>
          {% for tenant in results.tenants %}
          <a href="/tenants/{{ tenant.uid }}"
             class="flex items-center gap-3 px-3 py-2 rounded-lg
                    hover:bg-gray-600 text-gray-300 cursor-pointer"
             @mouseenter="selectedIndex = {{ loop.index0 }}">
              <i class="ph ph-buildings text-gray-500"></i>
              <div>
                  <span class="text-sm">{{ tenant.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">/tenants/{{ tenant.uid }}</span>
              </div>
          </a>
          {% endfor %}
      </div>
      {% endif %}

      {% if results.workspaces %}
      <div class="px-3 py-2">
          <h4 class="text-xs font-semibold text-gray-500 uppercase">Workspace'ler</h4>
          {% for ws in results.workspaces %}
          <a href="/workspaces/{{ ws.uid }}" ...>
              <i class="ph ph-globe text-gray-500"></i>
              <span>{{ ws.name }} ({{ ws.domain }})</span>
          </a>
          {% endfor %}
      </div>
      {% endif %}

      {% if results.pages %}
      <div class="px-3 py-2">
          <h4 class="text-xs font-semibold text-gray-500 uppercase">Sayfalar</h4>
          {% for page in results.pages %}
          <a href="{{ page.href }}" ...>
              <i class="ph {{ page.icon }} text-gray-500"></i>
              <span>{{ page.label }}</span>
          </a>
          {% endfor %}
      </div>
      {% endif %}

      {% if not results.tenants and not results.workspaces and not results.pages %}
      <div class="px-3 py-6 text-center text-gray-500">
          <i class="ph ph-magnifying-glass text-3xl mb-2"></i>
          <p class="text-sm">Sonuc bulunamadi</p>
      </div>
      {% endif %}
  </div>

NOT: Sonuclar kategorize gruplanir (tenants, workspaces, pages).
     Klavye navigasyonu Alpine.js ile yonetilir (ok tuslari + Enter).
```

---

## 4. Workspace Switcher Dropdown

```
Konum       : templates/modules/shell/partials/workspace-selector.html

A) Dropdown acilma (liste yukleme):
Element     : <div id="workspace-dropdown">
Trigger     : hx-trigger="intersect once"
Method      : hx-get="/api/v1/partials/shell/workspace-selector"
Target      : hx-target="#workspace-list"
Swap        : hx-swap="innerHTML"

B) Workspace arama (dropdown icinde):
Element     : <input name="search" id="workspace-search">
Trigger     : hx-trigger="keyup changed delay:300ms"
Method      : hx-get="/api/v1/partials/shell/workspace-selector"
Target      : hx-target="#workspace-list"
Swap        : hx-swap="innerHTML"
Params      : hx-params="search"

C) Workspace secimi:
Element     : <button class="workspace-option">
Trigger     : hx-trigger="click"
Method      : hx-post="/api/v1/partials/shell/workspace-switch"
Vals        : hx-vals='{"workspace_uid": "{{ ws.uid }}"}'

Server Response (secim basarili):
  Status    : 200
  Header    : HX-Redirect: /
  NOT       : Tam sayfa yenileme — sidebar, topbar, content workspace'e gore degisir

Server Response (secim hatasi):
  Status    : 200
  Body      : Hata mesaji
```

---

## 5. Dil Degisimi

```
Konum       : templates/modules/shell/partials/locale-selector.html
Element     : <button> (her dil secenegi icin)
Trigger     : hx-trigger="click"
Method      : hx-post="/api/v1/partials/shell/locale-switch"
Vals        : hx-vals='{"locale": "tr"}'

Server Response:
  Status    : 200
  Header    : HX-Refresh: true
  Cookie    : locale=tr; Path=/; Max-Age=31536000

NOT        : HX-Refresh: true, HTMX'in tam sayfa yenilemesini tetikler.
             Tum Jinja2 template'lari yeni locale ile render edilir.
```

---

## 6. Breadcrumb Guncelleme

```
Konum       : templates/modules/shell/partials/topbar.html
Element     : <div id="breadcrumb-container">
Trigger     : hx-trigger="load"
Method      : hx-get="/api/v1/partials/shell/breadcrumb?path={{ request.path }}"
Target      : hx-target="#breadcrumb-container"
Swap        : hx-swap="innerHTML"

NOT        : Normal sayfa gecislerinde server-side render yeterli.
             HTMX tab gecislerinde (tenant detail tabs gibi) breadcrumb
             guncellemesi icin hx-trigger="htmx:afterSwap from:body" kullanilabilir.
```

---

## 7. Mobil Menu Toggle

```
Konum       : templates/modules/shell/partials/mobile-menu.html
Element     : Sidebar overlay

Alpine.js ile yonetilir (HTMX kullanmaz):
  - Hamburger click: @click="mobileMenuOpen = true"
  - Kapatma: @click="mobileMenuOpen = false"
  - ESC: @keydown.escape.window="mobileMenuOpen = false"
  - Overlay click: @click.self="mobileMenuOpen = false"
  - Menu item click: @click="mobileMenuOpen = false" (her link'te)
  - Transition: x-transition:enter="transition ease-out duration-200"

NOT: Mobil menu HTMX kullanmaz cunku sidebar icerigi zaten
     sayfa yuklemesinde render edilmistir. Alpine.js gorunurluk yonetir.
```

---

## Ozet Tablo

| Akis | Trigger | Endpoint | Target | Swap | Polling |
|------|---------|----------|--------|------|---------|
| Sidebar yukle | load | GET sidebar-nav | #sidebar-nav | innerHTML | Hayir |
| Bildirim badge | load + every 30s | GET notification-badge | #notification-badge-container | innerHTML | 30s |
| Spotlight Search | Cmd+K/Ctrl+K, keyup delay:150ms | GET spotlight-search?q=&scope= | #spotlight-results | innerHTML | Hayir |
| Workspace liste | intersect once | GET workspace-selector | #workspace-list | innerHTML | Hayir |
| Workspace ara | keyup delay:300ms | GET workspace-selector?search= | #workspace-list | innerHTML | Hayir |
| Workspace sec | click | POST workspace-switch | — | HX-Redirect | Hayir |
| Dil degistir | click | POST locale-switch | — | HX-Refresh | Hayir |
| Breadcrumb | load | GET breadcrumb?path= | #breadcrumb-container | innerHTML | Hayir |
| User dropdown | load | GET user-dropdown | #user-dropdown-container | innerHTML | Hayir |
