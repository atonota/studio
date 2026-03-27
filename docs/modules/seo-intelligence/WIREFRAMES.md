# Module 07: seo-intelligence — WIREFRAMES

> ASCII wireframe'ler. Flowbite Pro + Tailwind CDN + ECharts 5 ile render edilir.
> Bu modul platformun birincil deger moduludur — en detayli wireframe'lere sahiptir.

---

## 1. SEO Panosu (`/seo`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > SEO Zekasi                                   │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  SEO Zekasi               Workspace: [Acme Shop ▾]   │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ KPI Row (grid-cols-5 gap-4) ────────────────────────┐  │
│          │  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│  │
│          │  │ │Anahtar │ │ Ort.   │ │Denetim │ │ Back-  │ │SERP  ││  │
│          │  │ │Kelime  │ │Pozisyon│ │ Skoru  │ │ link   │ │Ozel. ││  │
│          │  │ │        │ │        │ │        │ │        │ │      ││  │
│          │  │ │ 1,247  │ │  18.4  │ │  72    │ │  342   │ │  23  ││  │
│          │  │ │ +45 ↑  │ │ -2.1 ↑ │ │ +5 ↑   │ │ +12 ↑  │ │ +3 ↑ ││  │
│          │  │ └────────┘ └────────┘ └────────┘ └────────┘ └──────┘│  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Ana Icerik (grid-cols-2 gap-6) ─────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ┌─ SEO Radar Chart ──────────┐  ┌─ Siralama ──────┐│  │
│          │  │  │                             │  │  Degisiklikleri  ││  │
│          │  │  │        Teknik SEO           │  │                  ││  │
│          │  │  │           85                │  │  En Cok Yukselen ││  │
│          │  │  │          ╱╲                 │  │  ─────────────── ││  │
│          │  │  │    SERP ╱  ╲ Icerik        │  │  ↑ "atonota"     ││  │
│          │  │  │    67  ╱    ╲  74           │  │    12 → 5 (+7)  ││  │
│          │  │  │       ╱  ██  ╲              │  │  ↑ "seo araci"  ││  │
│          │  │  │      ╱  ████  ╲             │  │    24 → 15 (+9) ││  │
│          │  │  │     ╱   ████   ╲            │  │  ↑ "site audit" ││  │
│          │  │  │    ╱    ████    ╲           │  │    35 → 28 (+7) ││  │
│          │  │  │   ╱     ████     ╲          │  │                  ││  │
│          │  │  │  Backlink ──── Siralama     │  │  En Cok Dusen   ││  │
│          │  │  │    58          71            │  │  ─────────────── ││  │
│          │  │  │                             │  │  ↓ "keyword"     ││  │
│          │  │  │  (5 boyut: Teknik,          │  │    8 → 14 (-6)  ││  │
│          │  │  │   Icerik, Backlink,         │  │  ↓ "analytics"  ││  │
│          │  │  │   Siralama, SERP)           │  │    5 → 9 (-4)   ││  │
│          │  │  │                             │  │                  ││  │
│          │  │  └─────────────────────────────┘  └──────────────────┘│  │
│          │  │                                                       │  │
│          │  │  ┌─ En Onemli Sorunlar ───────────────────────────────┐│ │
│          │  │  │                                                    ││ │
│          │  │  │  # Sorun                    Oncelik  Efor  Durum  ││ │
│          │  │  │  ──────────────────────────────────────────────── ││ │
│          │  │  │  1  Meta description eksik    9/10   Dusuk  Acik  ││ │
│          │  │  │     45 sayfada tespit edildi                       ││ │
│          │  │  │                                                    ││ │
│          │  │  │  2  H1 etiketi yok            8/10   Dusuk  Acik  ││ │
│          │  │  │     12 sayfada tespit edildi                       ││ │
│          │  │  │                                                    ││ │
│          │  │  │  3  Resim alt text eksik       7/10   Orta   Acik  ││ │
│          │  │  │     89 resimde tespit edildi                       ││ │
│          │  │  │                                                    ││ │
│          │  │  │  4  Yavas sayfa yuklemesi      8/10   Yuksek Acik  ││ │
│          │  │  │     LCP > 4sn, 3 sayfada                          ││ │
│          │  │  │                                                    ││ │
│          │  │  │  5  Kirik linkler              6/10   Dusuk  Acik  ││ │
│          │  │  │     7 adet 404 linki                              ││ │
│          │  │  │                                                    ││ │
│          │  │  │                [Tum Sorunlari Gor →]              ││ │
│          │  │  └────────────────────────────────────────────────────┘│ │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### SEO Radar Chart (ECharts)

```
ECharts konfigurasyonu:
  type       : 'radar'
  indicator  : [
    { name: 'Teknik SEO',  max: 100 },
    { name: 'Icerik',      max: 100 },
    { name: 'Backlink',    max: 100 },
    { name: 'Siralama',    max: 100 },
    { name: 'SERP',        max: 100 }
  ]
  series     : 2 veri seti (mevcut + onceki donem karsilastirma)
  renk       : mevcut: #3B82F6 (blue-500), onceki: #D1D5DB (gray-300)
  boyut      : 360x360px
  areaStyle  : opacity: 0.2
```

---

## 2. Anahtar Kelimeler (`/seo/keywords`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Anahtar Kelimeler         Workspace: [Acme Shop ▾]  │  │
│          │  │  Toplam: 1,247            [+ Anahtar Kelime Ekle]    │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Filtre Bar ─────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ┌──────────────────────┐                             │  │
│          │  │  │ 🔍 Anahtar kelime... │  Niyet: [Tumu ▾]           │  │
│          │  │  └──────────────────────┘                             │  │
│          │  │                                                       │  │
│          │  │  Niyet filtre chip'leri:                               │  │
│          │  │  [Tumu: 1247] [ℹ Bilgi: 524] [🛒 Ticari: 312]       │  │
│          │  │  [💳 Islem: 287] [📍 Gezinme: 124]                   │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Toplu Islem Bar (secim varsa gorunur) ──────────────┐  │
│          │  │                                                       │  │
│          │  │  ☑ 3 anahtar kelime secildi                          │  │
│          │  │  [🤖 Niyet Siniflandir]  [📊 Kumele]  [🗑 Sil]      │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Keyword Table ──────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │ ☐  Anahtar Kelime     Niyet    Hacim  Zorluk  CPC  Trend│
│          │  │ ──────────────────────────────────────────────────────── │
│          │  │ ☐  seo araci          ℹ Bilgi  2,400  ██░ 45  $1.2  ╱╲│
│          │  │ ☐  site audit         🛒 Ticari 1,800  ███ 62  $2.4  ╱─│
│          │  │ ☐  anahtar kelime     💳 Islem   980  █░░ 28  $0.8  ─╲│
│          │  │ ☐  backlink kontrol   ℹ Bilgi  1,200  ██░ 51  $1.5  ╱─│
│          │  │ ☐  wordpress seo      🛒 Ticari 3,200  ████ 78 $3.1  ╱╱│
│          │  │ ☐  meta description   ℹ Bilgi    890  █░░ 22  $0.6  ──│
│          │  │ ☐  serp analizi       📍 Gezin   450  █░░ 35  $1.0  ╲╱│
│          │  │ ☐  siralama takibi    💳 Islem  1,500  ██░ 55  $2.0  ╱╱│
│          │  │                                                       │  │
│          │  │  Gosterilen: 25 / 1,247       [Daha Fazla Yukle]     │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### Zorluk Bara (DifficultyBar) Detay

```
Zorluk degeri 0-100 arasi renk gecimleri:
  0-30   : bg-green-500   (Kolay)
  31-60  : bg-yellow-500  (Orta)
  61-80  : bg-orange-500  (Zor)
  81-100 : bg-red-500     (Cok Zor)

Gosterim:
  ████░░░░░░  45/100
  w-24 h-2 rounded-full bg-gray-200
  Dolgu: style="width: 45%" + renk sinifi
```

### Trend Sparkline Detay

```
12 deger icin mini cizgi grafik (inline SVG veya ECharts mini):
  Boyut    : 60x20px
  Veri     : son 12 ay arama hacmi
  Renk     : trend yukselis: green, dusus: red, stabil: gray
  Stil     : stroke-width: 1.5, fill: none
```

---

## 3. Kume Gorunumu (Bubble Chart) (`/seo/keywords/{id}/cluster`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  ← Geri   Kume: "SEO Araclari"    (24 anahtar kelime)│  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Kume Ozeti ─────────────────────────────────────────┐  │
│          │  │  Ort. Hacim: 1,850  |  Ort. Zorluk: 52  |  Niyet: 🛒 │ │
│          │  │  AI Ozet: Bu kume SEO arac karsilastirmasi ve         │  │
│          │  │  degerlendirme iceriklerine odaklanir.                │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Bubble Chart (ECharts) ─────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Zorluk                                               │  │
│          │  │  100 ┤                                                │  │
│          │  │      │                                                │  │
│          │  │   80 ┤                    ◉ wordpress seo (3200)      │  │
│          │  │      │                                                │  │
│          │  │   60 ┤         ◎ site audit    ○ siralama             │  │
│          │  │      │         (1800)          takibi (1500)          │  │
│          │  │   40 ┤    ◎ seo araci (2400)                         │  │
│          │  │      │                    ○ backlink (1200)           │  │
│          │  │   20 ┤  ○ meta desc (890)                            │  │
│          │  │      │         ○ serp (450)                          │  │
│          │  │    0 ┼────────────────────────────────────────        │  │
│          │  │      0      1000     2000     3000     4000          │  │
│          │  │                    Arama Hacmi                        │  │
│          │  │                                                       │  │
│          │  │  Balon boyutu: CPC   Renk: ℹ Bilgi  🛒 Ticari       │  │
│          │  │                       💳 Islem  📍 Gezinme            │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Kumedeki Anahtar Kelimeler (tablo) ─────────────────┐  │
│          │  │  (keyword-table ile ayni yapi)                        │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 4. Siralamalar (`/seo/rankings`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Siralama Takibi          Aralik: [7g] [30g] [90g]   │  │
│          │  │                           Cihaz:  [Masaustu] [Mobil] │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Ranking Line Chart (ECharts) ───────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Pozisyon (ters: 1 ustte)                             │  │
│          │  │   1 ┤       ·                                        │  │
│          │  │   3 ┤      · ·                                       │  │
│          │  │   5 ┤  ···    ··── "atonota" (mavi)                  │  │
│          │  │   7 ┤                                                │  │
│          │  │  10 ┤                                                │  │
│          │  │  12 ┤                  ·                              │  │
│          │  │  15 ┤  ···     ··  ··  ·── "seo araci" (yesil)       │  │
│          │  │  18 ┤     ···                                        │  │
│          │  │  20 ┤                                                │  │
│          │  │  25 ┤  ·     ·     ·    ·── "site audit" (turuncu)   │  │
│          │  │  30 ┤   ···    ···   ···                              │  │
│          │  │     ┼────────────────────────────────────────         │  │
│          │  │     1 Mar      8 Mar      15 Mar      22 Mar         │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Position Distribution Heatmap ──────────────────────┐  │
│          │  │                                                       │  │
│          │  │              1-3    4-10   11-20  21-50   50+         │  │
│          │  │  Hafta 1     ██     ████   ███    ██      █          │  │
│          │  │  Hafta 2     ███    ████   ██     ██      █          │  │
│          │  │  Hafta 3     ███    █████  ██     █       █          │  │
│          │  │  Hafta 4     ████   █████  █      █       ░          │  │
│          │  │                                                       │  │
│          │  │  Koyu = daha fazla anahtar kelime bu aralikta         │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Tahmin (Forecast) ──────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  30/60/90 Gun Siralama Tahmini  Kelime: [atonota ▾]  │  │
│          │  │                                                       │  │
│          │  │  Pozisyon                                             │  │
│          │  │   1 ┤                                                │  │
│          │  │   3 ┤           ·····          ░░░░░  tahmin          │  │
│          │  │   5 ┤  ···  ···     ···── ░░░░░░░░░  (guven araligi) │  │
│          │  │   7 ┤                    ░░░░░                       │  │
│          │  │  10 ┤               ░░░░░                            │  │
│          │  │     ┼────────────────────────────────────────         │  │
│          │  │     Gecmis (90g)    │  Tahmin (30/60/90g)            │  │
│          │  │                                                       │  │
│          │  │  ⚠ Tahminler trend gostergesidir, kesin siralama     │  │
│          │  │    garantisi degildir.                                │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 5. Site Denetimi — Detay (`/seo/audit/{scan_id}`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Site Denetimi — Acme Shop      27 Mart 2026         │  │
│          │  │  142 sayfa taranmis             [Yeni Denetim Baslat]│  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Skor + KPI (grid-cols-5) ───────────────────────────┐  │
│          │  │ ┌──────────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │  │
│          │  │ │              │ │ Kritik │ │ Uyari  │ │ Bilgi  │   │  │
│          │  │ │   [GAUGE]    │ │        │ │        │ │        │   │  │
│          │  │ │     72       │ │   5    │ │  18    │ │  34    │   │  │
│          │  │ │   /100       │ │ sorun  │ │ sorun  │ │ sorun  │   │  │
│          │  │ │              │ │        │ │        │ │        │   │  │
│          │  │ │  +5 oncekine │ │ -2 ↓   │ │ -3 ↓   │ │ +1 ↑   │   │  │
│          │  │ │  gore        │ │        │ │        │ │        │   │  │
│          │  │ └──────────────┘ └────────┘ └────────┘ └────────┘   │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Kategori Filtre Tab ────────────────────────────────┐  │
│          │  │ [Tumu] [Meta (12)] [Baslik (8)] [Resim (15)]        │  │
│          │  │ [Link (7)] [Hiz (5)] [Sema (6)] [Guvenlik (4)]      │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Sorun Listesi (AuditIssueCard'lar) ─────────────────┐ │
│          │  │                                                        │ │
│          │  │  ┌─ AuditIssueCard ────────────────────────────────┐  │ │
│          │  │  │                                                  │  │ │
│          │  │  │  🔴 Kritik  |  Oncelik: 9/10  |  Efor: Dusuk    │  │ │
│          │  │  │                                                  │  │ │
│          │  │  │  Meta Description Eksik                          │  │ │
│          │  │  │  45 sayfada meta description tanimlanmamis.      │  │ │
│          │  │  │                                                  │  │ │
│          │  │  │  🤖 AI Aciklamasi:                               │  │ │
│          │  │  │  Meta description arama sonuclarinda gorunen     │  │ │
│          │  │  │  ozet metindir. Eksik olmasi tiklanma oranini    │  │ │
│          │  │  │  %30'a kadar dusurur. Her sayfaya ozgun,         │  │ │
│          │  │  │  150-160 karakter uzunlugunda aciklama ekleyin.  │  │ │
│          │  │  │                                                  │  │ │
│          │  │  │  Etkilenen: /hakkimizda, /urunler, /blog/...     │  │ │
│          │  │  │  [Tum Etkilenen Sayfalari Gor ▾]                 │  │ │
│          │  │  │                                                  │  │ │
│          │  │  └──────────────────────────────────────────────────┘  │ │
│          │  │                                                        │ │
│          │  │  ┌─ AuditIssueCard ────────────────────────────────┐  │ │
│          │  │  │  🟡 Uyari  |  Oncelik: 7/10  |  Efor: Orta      │  │ │
│          │  │  │  Resim Alt Text Eksik                            │  │ │
│          │  │  │  89 resimde alt text tanimlanmamis...            │  │ │
│          │  │  │  🤖 AI Aciklamasi: ...                           │  │ │
│          │  │  └──────────────────────────────────────────────────┘  │ │
│          │  │                                                        │ │
│          │  │  [Daha Fazla Yukle]                                    │ │
│          │  │                                                        │ │
│          │  └────────────────────────────────────────────────────────┘ │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### Denetim Ilerleme Gosterimi (Tarama Sirasinda)

```
┌─ Denetim Ilerliyor ──────────────────────────────────────┐
│                                                          │
│  Taraniyor...    42 / 142 sayfa tamamlandi               │
│  ██████████████░░░░░░░░░░░░░░░░░░  %30                  │
│                                                          │
│  Son taranan: /urunler/kategori-3                        │
│  Gecen sure: 2 dk 14 sn                                  │
│                                                          │
│  Bu islem biraz zaman alabilir. Sayfayi                  │
│  kapatabilirsiniz, sonuc hazir oldugunda                 │
│  bildirim gonderilecektir.                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Backlink'ler (`/seo/backlinks`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header + KPI ───────────────────────────────────────┐  │
│          │  │  Backlink Analizi                                     │  │
│          │  │  Toplam: 342  |  Ref. Domain: 87  |  Kaybedilen: 5   │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Referring Domains Trend (ECharts Line) ─────────────┐  │
│          │  │                                                       │  │
│          │  │  Domain                                               │  │
│          │  │  100 ┤                                    ·           │  │
│          │  │   80 ┤                      ·   ·   ··  ·  ·  87     │  │
│          │  │   60 ┤          · ··  ···  ·                         │  │
│          │  │   40 ┤  ·  · ·                                       │  │
│          │  │   20 ┤                                                │  │
│          │  │    0 ┼────────────────────────────────────────        │  │
│          │  │      Eki   Kas   Ara   Oca   Sub   Mar               │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Filtre Bar ─────────────────────────────────────────┐  │
│          │  │  Tip: [Tumu ▾]  Durum: [Tumu ▾]   🔍 URL ara...     │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Backlink Tablosu ───────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Kaynak URL          Hedef      Anchor  Tip   DR     │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  blog.ornek.com/..   /urunler   "seo"   ✓ FL  72    │  │
│          │  │  forum.xyz.net/..    /blog/..    "ara"   ✗ NF  45    │  │
│          │  │  haber.com/..        /           "aton"  ✓ FL  89    │  │
│          │  │  eski-site.org/..    /hakkimiz   --      ✓ FL  31    │  │
│          │  │  ⚠ kayip-site.co/..  /urunler   "link"  ✓ FL  28    │  │
│          │  │                                                       │  │
│          │  │  FL = Follow, NF = Nofollow                          │  │
│          │  │  ⚠ = Kaybedilen backlink (son 30 gunde)              │  │
│          │  │                                                       │  │
│          │  │  [Daha Fazla Yukle]                                  │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```
