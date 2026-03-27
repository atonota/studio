# shell — Wireframe'ler

> Tam uygulama kabugu layout'u. Dark tema (bg-gray-900).
> Sidebar + Topbar + Content Area + Command Palette.

---

## 1. Tam Desktop Layout (>= 1280px)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ┌────────────┐ ┌──────────────────────────────────────────────────────────────┐  │
│ │            │ │  TOPBAR (h-16, bg-gray-800, border-b border-gray-700)       │  │
│ │  SIDEBAR   │ │                                                             │  │
│ │  (w-64)    │ │  [☰]  Dashboard > Tenant'lar           [🔍 Cmd+K]  [🔔 3]  [👤]│
│ │  bg-gray   │ │       ^breadcrumb                       ^arama  ^badge ^user│  │
│ │  -800      │ ├──────────────────────────────────────────────────────────────┤  │
│ │            │ │                                                             │  │
│ │ ┌────────┐ │ │  CONTENT AREA                                              │  │
│ │ │◆atonota│ │ │  (bg-gray-900, p-6)                                        │  │
│ │ │ Studio │ │ │                                                             │  │
│ │ └────────┘ │ │  {% block content %}                                        │  │
│ │            │ │                                                             │  │
│ │ Workspace  │ │  Modul sayfa icerigi buraya gelir.                          │  │
│ │ ┌────────┐ │ │  Her modul kendi pages/ klasorundeki                        │  │
│ │ │▼ Acme  │ │ │  Jinja2 template'ini burada render eder.                   │  │
│ │ │  Corp. │ │ │                                                             │  │
│ │ └────────┘ │ │                                                             │  │
│ │            │ │                                                             │  │
│ │ NAVİGASYON │ │                                                             │  │
│ │ ────────── │ │                                                             │  │
│ │            │ │                                                             │  │
│ │ 🏠 Dashboard│ │                                                             │  │
│ │ 🏢 Tenant'lar│ │                                                            │  │
│ │ 🌐 Workspace│ │                                                             │  │
│ │ 🔌 Adaptorler│ │                                                            │  │
│ │            │ │                                                             │  │
│ │ ANALİZ     │ │                                                             │  │
│ │ ────────── │ │                                                             │  │
│ │ 📊 SEO      │ │                                                             │  │
│ │ 📝 Icerik   │ │                                                             │  │
│ │ 📈 Analitik │ │                                                             │  │
│ │ ⚡ Performans│ │                                                            │  │
│ │            │ │                                                             │  │
│ │ SİSTEM     │ │                                                             │  │
│ │ ────────── │ │                                                             │  │
│ │ ⚙️ Ayarlar  │ │                                                             │  │
│ │ 📋 Audit Log│ │                                                             │  │
│ │ 🔔 Bildirim │ │                                                             │  │
│ │            │ │                                                             │  │
│ │ ────────── │ │                                                             │  │
│ │ [TR ▼]     │ │  ┌──────────────────────────────────────────────────────┐   │  │
│ │ v2.1.0     │ │  │ FOOTER (opsiyonel) — v2.1.0 · Destek · Dokumantasyon│   │  │
│ │            │ │  └──────────────────────────────────────────────────────┘   │  │
│ └────────────┘ └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sidebar Detay

```
┌──────────────────────┐
│                      │
│  ◆ atonota           │  <- logo, h-8, text-xl font-bold text-white
│  Developer Studio    │  <- text-xs text-gray-500
│                      │
│  ┌──────────────────┐│
│  │ ▼ Acme Corp.     ││  <- workspace switcher dropdown
│  │   acme.com       ││     bg-gray-700, rounded-lg, p-2
│  └──────────────────┘│     click -> workspace listesi acilir
│                      │
│  GENEL               │  <- nav-group label, text-xs text-gray-500 uppercase
│  ─────────────────── │     tracking-wider, mt-6 mb-2
│                      │
│  ┌──────────────────┐│
│  │ 🏠 Dashboard      ││  <- aktif: bg-gray-700 text-white
│  └──────────────────┘│     rounded-lg, px-3 py-2
│  ┌──────────────────┐│
│  │ 🏢 Tenant'lar     ││  <- normal: text-gray-400 hover:bg-gray-700
│  └──────────────────┘│
│  ┌──────────────────┐│
│  │ 🌐 Workspace'ler  ││
│  └──────────────────┘│
│  ┌──────────────────┐│
│  │ 🔌 Adaptorler     ││
│  └──────────────────┘│
│                      │
│  ANALİZ              │
│  ─────────────────── │
│                      │
│  ┌──────────────────┐│
│  │ 📊 SEO        [5]││  <- badge: bg-blue-600 text-white text-xs
│  └──────────────────┘│     rounded-full px-2 py-0.5
│  ┌──────────────────┐│
│  │ 📝 Icerik         ││
│  │   ├─ Sayfalar     ││  <- alt menu: pl-8, text-sm
│  │   ├─ Gap Analizi  ││
│  │   └─ Bozunma      ││
│  └──────────────────┘│
│  ┌──────────────────┐│
│  │ 📈 Web Analitik   ││
│  └──────────────────┘│
│                      │
│  SİSTEM              │
│  ─────────────────── │
│                      │
│  ┌──────────────────┐│
│  │ ⚙️ Ayarlar        ││
│  └──────────────────┘│
│  ┌──────────────────┐│
│  │ 📋 Audit Log      ││
│  └──────────────────┘│
│                      │
│  ─────────────────── │
│  ┌──────────────────┐│
│  │ [TR ▼] Turkce    ││  <- locale selector, bg-gray-700
│  └──────────────────┘│
│  v2.1.0              │  <- versiyon, text-xs text-gray-600
│                      │
└──────────────────────┘
```

---

## 3. Topbar Detay

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [☰]    Dashboard > Tenant'lar > Acme Corp.     [🔍 Ara... Cmd+K] [🔔3] [👤▼]│
│  ^hamb   ^breadcrumb (clickable links)           ^arama     ^badge ^user │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Hamburger [☰]:
  - Desktop: gizli
  - Tablet/Mobil: gorunur, sidebar overlay acar

Breadcrumb:
  - Her segment clickable link
  - Son segment bold, tiklanamasiz
  - Separator: ph-caret-right (text-gray-600)
  - Uzun yollar icin truncate (...) uygulanir

Arama [🔍]:
  - Desktop: w-72 input gorunur, placeholder "Ara... Cmd+K"
  - Mobil: sadece icon, tiklaninca command palette acar
  - ph-magnifying-glass icon

Bildirim Badge [🔔]:
  - ph-bell icon
  - Badge: absolute, -top-1 -right-1, bg-red-500, text-white, text-xs
  - 0 bildirim: badge gizli
  - > 99: "99+" gosterir
  - Click: /notifications sayfasina gider

User Dropdown [👤▼]:
  - Avatar (32x32, rounded-full) + isim + ph-caret-down
  - Dropdown icerigi:
    ┌─────────────────────┐
    │ Ahmet Karaca         │  <- display_name, font-medium
    │ ahmet@acme.com       │  <- email, text-sm text-gray-400
    │ SA · Acme Corp.      │  <- rol + tenant
    │ ─────────────────── │
    │ 👤 Profilim          │
    │ ⚙️ Ayarlar           │
    │ 🔑 API Anahtarlari   │
    │ ─────────────────── │
    │ 🚪 Cikis Yap         │  <- text-red-400
    └─────────────────────┘
```

---

## 4. Command Palette / Global Arama (Cmd+K)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        OVERLAY (bg-gray-900/80)                          │
│                                                                          │
│            ┌─────────────────────────────────────────────┐               │
│            │                                             │               │
│            │  🔍 ┌─────────────────────────────────────┐ │               │
│            │     │ Arama yapın...                      │ │               │
│            │     └─────────────────────────────────────┘ │               │
│            │                                             │               │
│            │  SON ARADIKLARINIZ                           │               │
│            │  ┌─────────────────────────────────────────┐│               │
│            │  │ 🕐 acme corp tenant ayarlari            ││               │
│            │  │ 🕐 seo audit raporu                     ││               │
│            │  └─────────────────────────────────────────┘│               │
│            │                                             │               │
│            │  HIZLI ERISIM                               │               │
│            │  ┌─────────────────────────────────────────┐│               │
│            │  │ 🏠 Dashboard                  Ctrl+D    ││               │
│            │  │ ⚙️ Ayarlar                    Ctrl+,    ││               │
│            │  │ 🏢 Yeni Tenant               Ctrl+N    ││               │
│            │  └─────────────────────────────────────────┘│               │
│            │                                             │               │
│            │  Arama yazarken (debounce 200ms):           │               │
│            │  ┌─────────────────────────────────────────┐│               │
│            │  │ TENANT'LAR                              ││               │
│            │  │   🏢 Acme Corp.        /tenants/abc-123 ││               │
│            │  │   🏢 Beta Ltd.         /tenants/def-456 ││               │
│            │  │                                         ││               │
│            │  │ WORKSPACE'LER                           ││               │
│            │  │   🌐 acme.com          /workspaces/w-1  ││               │
│            │  │                                         ││               │
│            │  │ SAYFALAR                                ││               │
│            │  │   📊 SEO Dashboard      /seo            ││               │
│            │  │   ⚙️ Guvenlik Ayarlari  /settings/sec.  ││               │
│            │  └─────────────────────────────────────────┘│               │
│            │                                             │               │
│            │  ESC ile kapat  ·  ↑↓ ile gezin  ·  Enter  │               │
│            │                                             │               │
│            └─────────────────────────────────────────────┘               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Olculer**: `max-w-xl mx-auto mt-[20vh]`, `bg-gray-800 rounded-xl shadow-2xl border border-gray-700`

---

## 5. Daraltilmis Sidebar (1024-1279px)

```
┌──────┐
│      │
│  ◆   │  <- sadece logo iconu
│      │
│ ┌──┐ │
│ │AC│ │  <- workspace initials badge
│ └──┘ │
│      │
│  🏠  │  <- sadece icon, hover: tooltip "Dashboard"
│  🏢  │
│  🌐  │
│  🔌  │
│      │
│ ─── │
│      │
│  📊  │
│  📝  │
│  📈  │
│  ⚡  │
│      │
│ ─── │
│      │
│  ⚙️  │
│  📋  │
│  🔔  │
│      │
│ ─── │
│ [TR] │
│      │
└──────┘
 w-16
```

Hover'da tooltip gosterilir: `Flowbite Tooltip`, placement="right"

---

## 6. Mobil Menu Overlay (< 768px)

```
┌──────────────────────────────────────┐
│ OVERLAY (bg-gray-900/90, z-50)       │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │                            [X]   │ │  <- kapatma butonu
│ │  ◆ atonota                       │ │
│ │  Developer Studio                │ │
│ │                                  │ │
│ │  ┌────────────────────────────┐  │ │
│ │  │ ▼ Acme Corp. · acme.com   │  │ │
│ │  └────────────────────────────┘  │ │
│ │                                  │ │
│ │  🏠 Dashboard                    │ │
│ │  🏢 Tenant'lar                   │ │
│ │  🌐 Workspace'ler               │ │
│ │  🔌 Adaptorler                   │ │
│ │  ─────────────────────────────  │ │
│ │  📊 SEO                          │ │
│ │  📝 Icerik                       │ │
│ │  📈 Web Analitik                 │ │
│ │  ─────────────────────────────  │ │
│ │  ⚙️ Ayarlar                      │ │
│ │  📋 Audit Log                    │ │
│ │  🔔 Bildirimler                  │ │
│ │  ─────────────────────────────  │ │
│ │  👤 Profilim                     │ │
│ │  🚪 Cikis Yap                   │ │
│ │                                  │ │
│ │  [TR ▼]  ·  v2.1.0              │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

Menu ogesi tiklaninca overlay otomatik kapanir.
ESC tusu ile de kapanir.

---

## 6b. Ultra-Kucuk Ekran (320px — iPhone 5s/SE1)

```
┌────────────────────────────┐
│ [=] ◆atonota  [🔍] [🔔] [👤]│  <- topbar: 44px yukseklik
├────────────────────────────┤   <- tum ikonlar 44x44 touch
│                            │
│  CONTENT AREA              │
│  (p-2, tek kolon)          │
│                            │
│  ┌────────────────────────┐│
│  │ KPI Kart (w-full)      ││  <- grid: 1fr (tek kolon)
│  └────────────────────────┘│
│  ┌────────────────────────┐│
│  │ KPI Kart (w-full)      ││
│  └────────────────────────┘│
│                            │
│  ┌────────────────────────┐│
│  │ Tablo -> Kart gorunum  ││  <- .responsive-table
│  │ Baslik: Acme Corp.     ││
│  │ Plan: Pro               ││
│  │ Durum: Aktif            ││
│  └────────────────────────┘│
│  ┌────────────────────────┐│
│  │ Baslik: Beta Ltd.      ││
│  │ Plan: Free              ││
│  │ Durum: Aktif            ││
│  └────────────────────────┘│
│                            │
│  [Daha Fazla Yukle]        │  <- w-full, h-44px
│                            │
└────────────────────────────┘
 w=320px
```

320px ozel kurallar:
- Topbar: breadcrumb GIZLI, sadece hamburger + logo + arama + badge + avatar
- Spacing: p-2 (8px), gap-2
- Font: body 14px (base.html @media max-width:374px)
- Grid: her sey tek kolon (grid-template-columns: 1fr !important)
- Butonlar: w-full, min-height 44px
- Spotlight: tam ekran (border-radius: 0, inset-0)
- Input'lar: font-size 16px (iOS zoom engelleme)
- Scroll: overflow-x hidden (yatay scroll ASLA)

---

## 7. Workspace Switcher Dropdown

```
Sidebar'daki workspace alani tiklaninca:

┌──────────────────────┐
│ ▼ Acme Corp.         │
│   acme.com           │
└──────────────────────┘
         |
         v
┌──────────────────────────┐
│ 🔍 Workspace ara...      │  <- hx-get ile filtreleme
│ ─────────────────────── │
│ ✓ Acme Corp.             │  <- aktif, bg-gray-700
│   acme.com               │
│                          │
│   Beta Ltd.              │
│   beta.com               │
│                          │
│   Gamma Inc.             │
│   gamma.io               │
│ ─────────────────────── │
│ + Yeni Workspace Ekle    │  <- link: /workspaces/create
└──────────────────────────┘
```
