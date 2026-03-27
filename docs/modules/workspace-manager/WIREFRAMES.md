# Module 05: workspace-manager — WIREFRAMES

> ASCII wireframe'ler. Gercek UI layout'u Flowbite Pro + Tailwind CDN ile render edilir.
> Olculer Tailwind spacing birimleri iledir (1 birim = 0.25rem = 4px).

---

## 1. Workspace Listesi — Grid Gorunumu (`/workspaces`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Shell Header (layout/base.html)                                        │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Workspace'ler                                │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Page Header ─────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Workspace'ler                    [+ Yeni Workspace]  │  │
│          │  │  Toplam: 24 aktif site                                │  │
│          │  │                                                       │  │
│          │  │  ┌─────────┐ ┌─────────┐  ┌──────────────────────┐   │  │
│          │  │  │ ▦ Grid  │ │ ☰ Liste │  │ 🔍 Site ara...       │   │  │
│          │  │  └─────────┘ └─────────┘  └──────────────────────┘   │  │
│          │  │                                                       │  │
│          │  │  Platform: [Tumu ▾]   Durum: [Tumu ▾]                │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Grid Container (3 kolon, gap-6) ─────────────────────┐ │
│          │  │                                                        │ │
│          │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│          │  │  │ WorkspaceCard│ │ WorkspaceCard│ │ WorkspaceCard│  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │  🌐 favicon  │ │  🌐 favicon  │ │  🌐 favicon  │  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │  Site Adi    │ │  Site Adi    │ │  Site Adi    │  │ │
│          │  │  │  example.com │ │  shop.co     │ │  blog.net    │  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │  │ │
│          │  │  │ │ WP 6.4  │ │ │ │ Shopify  │ │ │ │ Drupal   │ │  │ │
│          │  │  │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │  Skor: ██░ 78│ │  Skor: ███ 92│ │  Skor: █░░ 45│  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │ [● Aktif]    │ │ [● Aktif]    │ │ [○ Bekliyor] │  │ │
│          │  │  │              │ │              │ │              │  │ │
│          │  │  │  ··· Detay   │ │  ··· Detay   │ │  ··· Detay   │  │ │
│          │  │  └──────────────┘ └──────────────┘ └──────────────┘  │ │
│          │  │                                                        │ │
│          │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│          │  │  │ WorkspaceCard│ │ WorkspaceCard│ │ WorkspaceCard│  │ │
│          │  │  │  ...         │ │  ...         │ │  ...         │  │ │
│          │  │  └──────────────┘ └──────────────┘ └──────────────┘  │ │
│          │  │                                                        │ │
│          │  │           [Daha Fazla Yukle]                           │ │
│          │  │                                                        │ │
│          │  └────────────────────────────────────────────────────────┘ │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### WorkspaceCard Detay

```
┌────────────────────────────────────────┐
│                                        │
│   ┌────┐                    [⋯]       │  <- 3-dot menu (duzenle, sil, duraklat)
│   │ 🌐 │  32x32 favicon               │
│   └────┘                               │
│                                        │
│   Acme E-Ticaret                       │  <- font: text-lg font-semibold text-gray-900
│   acme-shop.com                        │  <- font: text-sm text-gray-500
│                                        │
│   ┌────────────────┐                   │
│   │ ⬡ WordPress    │  <- PlatformBadge │  <- bg-blue-100 text-blue-800 rounded-full px-3
│   │   v6.4.2       │                   │
│   └────────────────┘                   │
│                                        │
│   Saglik Skoru                         │
│   ████████░░  78/100                   │  <- progress bar, renk: score >= 70 green, >= 40 yellow, < 40 red
│                                        │
│   ┌────────────┐                       │
│   │ ● Aktif    │  <- StatusBadge       │  <- aktif: green, bekliyor: yellow, hata: red, duraklatildi: gray
│   └────────────┘                       │
│                                        │
│   Son guncelleme: 2 saat once          │  <- text-xs text-gray-400
│                                        │
└────────────────────────────────────────┘
   w: max-w-sm (384px)
   h: auto (~240px)
   border: border border-gray-200 rounded-lg
   shadow: shadow-sm hover:shadow-md transition
   padding: p-5
```

---

## 2. Workspace Listesi — Tablo Gorunumu

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─ Tablo ──────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ☐  Site              URL                Platform    Skor   Durum    │   │
│  │  ─────────────────────────────────────────────────────────────────── │   │
│  │  ☐  🌐 Acme Shop     acme-shop.com      ⬡ WP 6.4    78    ● Aktif  │   │
│  │  ☐  🌐 Blog TR       blog-tr.com        ⬡ WP 6.3    92    ● Aktif  │   │
│  │  ☐  🌐 Moda Store    moda.store          ◆ Shopify   45    ○ Hata   │   │
│  │  ☐  🌐 Tekno Hub     teknohub.net        ◇ Drupal    --    ◑ Bekle  │   │
│  │                                                                      │   │
│  │  Secili: 0                                    ‹ Onceki  Sonraki ›   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Workspace Olustur (`/workspaces/create`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Shell Header                                                           │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Workspace'ler > Yeni Workspace               │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Form Card (max-w-2xl mx-auto) ──────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Yeni Workspace Olustur                               │  │
│          │  │  ────────────────────────                             │  │
│          │  │                                                       │  │
│          │  │  Site URL'si *                                        │  │
│          │  │  ┌────────────────────────────────────────────────┐   │  │
│          │  │  │ https://                                       │   │  │
│          │  │  └────────────────────────────────────────────────┘   │  │
│          │  │                                                       │  │
│          │  │  ┌─ Platform Tespit Sonucu (blur sonrasi) ────────┐  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  ✓ WordPress 6.4.2 tespit edildi                │  │  │
│          │  │  │  Guven: %94                                     │  │  │
│          │  │  │  Sinyaller: wp-content, X-Powered-By, meta      │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  [Onayla]  [Degistir ▾]                        │  │  │
│          │  │  │                                                 │  │  │
│          │  │  └─────────────────────────────────────────────────┘  │  │
│          │  │                                                       │  │
│          │  │  Site Adi *                                           │  │
│          │  │  ┌────────────────────────────────────────────────┐   │  │
│          │  │  │ Acme E-Ticaret                                 │   │  │
│          │  │  └────────────────────────────────────────────────┘   │  │
│          │  │  (URL'den otomatik onerilir)                          │  │
│          │  │                                                       │  │
│          │  │  Platform *                                           │  │
│          │  │  ┌────────────────────────────────────────────────┐   │  │
│          │  │  │ ⬡ WordPress 6.4.2                        ▾    │   │  │
│          │  │  └────────────────────────────────────────────────┘   │  │
│          │  │  (oto-tespit sonucu on secili gelir)                  │  │
│          │  │                                                       │  │
│          │  │                                                       │  │
│          │  │  ┌─────────────────────────────────────────────┐     │  │
│          │  │  │         [Workspace Olustur]                 │     │  │
│          │  │  └─────────────────────────────────────────────┘     │  │
│          │  │                                                       │  │
│          │  │  [< Vazgec]                                          │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### Platform Tespit Durumu — Loading

```
┌─ Platform Tespit Sonucu ─────────────────────────┐
│                                                   │
│  ◌ Platform tespit ediliyor...                    │
│  ████░░░░░░  (progress indicator)                 │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Platform Tespit Durumu — Basarisiz

```
┌─ Platform Tespit Sonucu ─────────────────────────┐
│                                                   │
│  ⚠ Platform otomatik tespit edilemedi             │
│  Lutfen asagidan manuel secim yapin.              │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 4. Workspace Detay (`/workspaces/{uid}`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Workspace'ler > Acme E-Ticaret               │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  🌐 Acme E-Ticaret          [Duzenle] [⋯]            │  │
│          │  │  acme-shop.com  ⬡ WordPress 6.4.2   ● Aktif          │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ KPI Row (grid-cols-4 gap-4) ────────────────────────┐  │
│          │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│          │  │ │ Saglik   │ │ Adaptor  │ │ Son      │ │ Acik     │ │  │
│          │  │ │ Skoru    │ │ Sayisi   │ │ Tarama   │ │ Sorunlar │ │  │
│          │  │ │          │ │          │ │          │ │          │ │  │
│          │  │ │  [GAUGE] │ │   3/5    │ │ 2 saat   │ │   12     │ │  │
│          │  │ │   78     │ │ bagli    │ │  once    │ │ sorun    │ │  │
│          │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Tab Nav ────────────────────────────────────────────┐  │
│          │  │  [Genel Bakis]  [Adaptorler]  [Saglik Gecmisi]       │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Adaptor Durum Listesi ──────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ⬡ WordPress REST API     ● Bagli      2dk once     │  │
│          │  │  📊 Google Analytics       ● Bagli      5dk once     │  │
│          │  │  🔍 Search Console         ○ Bagli Degil [Baglan]    │  │
│          │  │  📈 Google Ads             ○ Bagli Degil [Baglan]    │  │
│          │  │  🛡 Cloudflare             ● Bagli      10dk once    │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Onboarding Checklist (eger tamamlanmamissa) ────────┐  │
│          │  │                                                       │  │
│          │  │  Baslangic Rehberi   3/5 tamamlandi                  │  │
│          │  │  ████████████░░░░░░░  %60                            │  │
│          │  │                                                       │  │
│          │  │  ✓ Workspace olusturuldu                              │  │
│          │  │  ✓ Platform tespit edildi                              │  │
│          │  │  ✓ WordPress REST API baglandi                        │  │
│          │  │  ○ Google Analytics baglansin                          │  │
│          │  │  ○ Ilk SEO taramasi baslatilsin                       │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### HealthScoreGauge (ECharts Gauge)

```
ECharts konfigurasyonu:
  type     : 'gauge'
  min      : 0
  max      : 100
  splitNum : 5
  renk skalalari:
    0-39   : #EF4444 (red-500)
    40-69  : #F59E0B (amber-500)
    70-100 : #10B981 (emerald-500)
  boyut    : 160x160px
  pointer  : show: true
  detail   : fontSize: 28, fontWeight: 'bold'
```
