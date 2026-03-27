# Module 08: content-intelligence — WIREFRAMES

> ASCII wireframe'ler. Flowbite Pro + Tailwind CDN + ECharts 5 ile render edilir.

---

## 1. Icerik Panosu (`/content`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Icerik Zekasi                                │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Icerik Zekasi               Workspace: [Acme Shop ▾]│  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ KPI Row (grid-cols-4 gap-4) ────────────────────────┐  │
│          │  │ ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│          │  │ │            │ │ Toplam   │ │ Curuyen  │ │ Icerik │ │  │
│          │  │ │  [GAUGE]   │ │ Icerik   │ │ Icerik   │ │ Bosluk │ │  │
│          │  │ │   64       │ │          │ │          │ │        │ │  │
│          │  │ │  /100      │ │   142    │ │   18     │ │   23   │ │  │
│          │  │ │  Ort.Skor  │ │ sayfa    │ │ ↑ 3 yeni │ │ acik   │ │  │
│          │  │ │            │ │          │ │          │ │        │ │  │
│          │  │ └────────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Icerik (grid-cols-2 gap-6) ─────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ┌─ Skor Dagilimi ────────┐ ┌─ En Cok Curuyen ────┐ │  │
│          │  │  │                         │ │                      │ │  │
│          │  │  │  Skor Aralik Sayi       │ │  1. /blog/eski-yazi  │ │  │
│          │  │  │  ─────────────────      │ │     Skor: 32  ▼ %45  │ │  │
│          │  │  │  0-39  ████████  28     │ │     ╲__╲__╲         │ │  │
│          │  │  │  40-69 █████████████ 72 │ │                      │ │  │
│          │  │  │  70-100 ████████ 42     │ │  2. /urunler/eski    │ │  │
│          │  │  │                         │ │     Skor: 38  ▼ %32  │ │  │
│          │  │  │  Kirmizi: acil iyilestir│ │     ╲__╲_╲          │ │  │
│          │  │  │  Sari: gelisime acik    │ │                      │ │  │
│          │  │  │  Yesil: iyi durumda     │ │  3. /hakkimizda      │ │  │
│          │  │  │                         │ │     Skor: 41  ▼ %28  │ │  │
│          │  │  └─────────────────────────┘ │     ╲_╲__╲          │ │  │
│          │  │                               │                      │ │  │
│          │  │                               │  [Tum Curuyen →]    │ │  │
│          │  │                               │                      │ │  │
│          │  │                               └──────────────────────┘ │  │
│          │  │                                                       │  │
│          │  │  ┌─ Son Puanlanan Icerikler ──────────────────────────┐│ │
│          │  │  │                                                    ││ │
│          │  │  │  Baslik                URL           Skor  Tarih  ││ │
│          │  │  │  ──────────────────────────────────────────────── ││ │
│          │  │  │  Ana Sayfa             /              82    Bugun ││ │
│          │  │  │  Urunler               /urunler       71    Bugun ││ │
│          │  │  │  Blog: SEO 2026        /blog/seo-26   88    Dun  ││ │
│          │  │  │  Iletisim              /iletisim      56    Dun  ││ │
│          │  │  │  Hakkimizda            /hakkimizda    41    Dun  ││ │
│          │  │  │                                                    ││ │
│          │  │  └────────────────────────────────────────────────────┘│ │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 2. Icerik Listesi (`/content/pages`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Icerik Sayfalar      Toplam: 142    [Puanla]        │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Filtre Bar ─────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ┌──────────────────────┐  Tip: [Tumu ▾]             │  │
│          │  │  │ 🔍 Baslik/URL ara.. │  Skor: [0] - [100]         │  │
│          │  │  └──────────────────────┘  Curuyor: [Tumu ▾]         │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Content Table ──────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Baslik           URL         Tip    Skor  Kelime  ⚠  │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  Ana Sayfa        /           sayfa  ██░ 82  1,240   │  │
│          │  │  Blog: SEO 2026   /blog/seo   yazi   ███ 88  2,450   │  │
│          │  │  Urunler          /urunler    sayfa  ██░ 71    890   │  │
│          │  │  Iletisim         /iletisim   sayfa  █░░ 56    320   │  │
│          │  │  Eski Yazi        /blog/eski  yazi   █░░ 32  1,100  ⚠ │  │
│          │  │  Hakkimizda       /hakkimizda sayfa  █░░ 41    680  ⚠ │  │
│          │  │                                                       │  │
│          │  │  ⚠ = Curuyen icerik                                  │  │
│          │  │                                                       │  │
│          │  │  Skor renkleri:                                      │  │
│          │  │  ███ 70-100 yesil  ██░ 40-69 sari  █░░ 0-39 kirmizi │  │
│          │  │                                                       │  │
│          │  │  [Daha Fazla Yukle]                                  │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Icerik Detay (`/content/pages/{id}`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  ← Geri   Ana Sayfa                                  │  │
│          │  │  acme-shop.com/   ·   Sayfa   ·   1,240 kelime      │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Skor + Breakdown (grid-cols-2) ─────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ┌─ Skor Gauge ──────┐  ┌─ Breakdown Radar ────────┐│  │
│          │  │  │                    │  │                           ││  │
│          │  │  │    [GAUGE]         │  │      Okunabilirlik       ││  │
│          │  │  │      82            │  │          78              ││  │
│          │  │  │     /100           │  │         ╱╲               ││  │
│          │  │  │                    │  │   Gun ╱    ╲ SEO         ││  │
│          │  │  │  AI Ozet:          │  │   65 ╱  ██  ╲ 85        ││  │
│          │  │  │  Icerik genel      │  │     ╱  ████  ╲          ││  │
│          │  │  │  olarak iyi        │  │    ╱   ████   ╲         ││  │
│          │  │  │  durumda. Teknik   │  │   UX ────── Niyet       ││  │
│          │  │  │  yapi guclendirme  │  │   80         88          ││  │
│          │  │  │  onerilir.         │  │     Teknik               ││  │
│          │  │  │                    │  │       92                  ││  │
│          │  │  └────────────────────┘  │                           ││  │
│          │  │                           │  (6 boyut radar chart)  ││  │
│          │  │                           └─────────────────────────┘│  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Tab Nav ────────────────────────────────────────────┐  │
│          │  │  [Genel Bakis] [AI Onerileri] [Trafik] [Benzer]     │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ AI Oneri Paneli (Tab: AI Onerileri) ────────────────┐  │
│          │  │                                                       │  │
│          │  │  [🤖 Oneri Olustur]        ← SSE streaming baslatir │  │
│          │  │                                                       │  │
│          │  │  ┌─ Oneri 1: Baslik ──────────────────────────────┐  │  │
│          │  │  │  Etki: ████████░░ 8/10                         │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  Mevcut: "Hakkimizda"                          │  │  │
│          │  │  │  Onerilen: "Hakkimizda — atonota SEO Platformu"│  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  Gerekce: Marka adi ve ana anahtar kelime       │  │  │
│          │  │  │  basliga eklenerek CTR arttirilabilir.          │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  [✓ Kabul Et]  [✗ Reddet]                      │  │  │
│          │  │  └─────────────────────────────────────────────────┘  │  │
│          │  │                                                       │  │
│          │  │  ┌─ Oneri 2: Meta Description ────────────────────┐  │  │
│          │  │  │  Etki: █████████░ 9/10                         │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  Mevcut: (bos)                                 │  │  │
│          │  │  │  Onerilen: "atonota ile sitenizin SEO          │  │  │
│          │  │  │  performansini analiz edin. 83+ platform        │  │  │
│          │  │  │  destegi ile..."                                │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  Gerekce: Meta description eksik, SERP'te       │  │  │
│          │  │  │  Google otomatik olusturuyor.                   │  │  │
│          │  │  │                                                 │  │  │
│          │  │  │  [✓ Kabul Et]  [✗ Reddet]                      │  │  │
│          │  │  └─────────────────────────────────────────────────┘  │  │
│          │  │                                                       │  │
│          │  │  ┌─ Oneri 3: Schema Markup ── (streaming...) ────┐   │  │
│          │  │  │  ◌ Yukleniyor...                               │   │  │
│          │  │  │  █████░░░░░                                    │   │  │
│          │  │  └────────────────────────────────────────────────┘   │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 4. Bosluk Analizi (`/content/gaps`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Icerik Bosluk Analizi       [Analiz Baslat]         │  │
│          │  │  23 acik bosluk              Workspace: [Acme ▾]     │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Sankey Diagram (ECharts) ───────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  KONU            ALT KONU          EKSIK ICERIK       │  │
│          │  │  ──────          ────────          ────────────       │  │
│          │  │                                                       │  │
│          │  │  SEO ━━━━━━━┳━━ Teknik SEO ━━━┳━━ site hizi rehberi  │  │
│          │  │             ┃                  ┗━━ schema markup 101  │  │
│          │  │             ┗━━ Link Building ━━━━ backlink stratejisi│  │
│          │  │                                                       │  │
│          │  │  Icerik ━━━┳━━ Blog Yonetimi ━━━━ editorial takvim   │  │
│          │  │            ┗━━ Copywriting ━━━━━━ urun aciklama tips  │  │
│          │  │                                                       │  │
│          │  │  E-Ticaret ━━━ SEO ━━━━━━━━━━━━━━ urun SEO rehberi   │  │
│          │  │                                                       │  │
│          │  │  (Sankey: sol→sag akis, kalinlik = toplam hacim)      │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Filtre Bar ─────────────────────────────────────────┐  │
│          │  │  Durum: [Acik] [Devam Ediyor] [Kapali] [Reddedildi] │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Bosluk Tablosu ─────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Konu      Alt Konu       Kelime      Hacim  Pri Dur │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  SEO       Teknik SEO     site hizi    1200   9  Acik│  │
│          │  │  SEO       Teknik SEO     schema       890    8  Acik│  │
│          │  │  SEO       Link Build.    backlink     2400   9  Acik│  │
│          │  │  Icerik    Blog Yonetimi  takvim        650   6  Acik│  │
│          │  │  Icerik    Copywriting    urun tips     780   7  Acik│  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 5. Curus Izleme (`/content/decay`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Curuyen Icerikler         18 icerik risk altinda    │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Aksiyon Filtre ─────────────────────────────────────┐  │
│          │  │  [Tumu (18)] [Yenile (8)] [Birlestir (4)]           │  │
│          │  │  [Yonlendir (3)] [Kaldir (3)]                        │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Decay List ─────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Baslik          Skor  Risk  Trafik Trend  Aksiyon   │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  Eski Blog Yazi  32    92    ╲__╲__╲__     Yenile    │  │
│          │  │  Urun Sayfasi    38    85    ╲__╲_╲__      Yenile    │  │
│          │  │  Hakkimizda      41    78    ╲_╲__╲        Yenile    │  │
│          │  │  SSS Sayfasi     45    72    ╲_╲_╲_        Birlestir │  │
│          │  │  Eski Kampanya   28    95    ╲╲╲__╲__      Yonlendir │  │
│          │  │  Test Sayfasi    22    88    ╲╲╲╲__        Kaldir    │  │
│          │  │                                                       │  │
│          │  │  Trafik Trend: Son 12 hafta (sparkline)              │  │
│          │  │  ╲ = dusus trendi                                    │  │
│          │  │                                                       │  │
│          │  │  Aksiyon badge renkleri:                              │  │
│          │  │  Yenile: mavi  Birlestir: mor  Yonlendir: turuncu    │  │
│          │  │  Kaldir: kirmizi                                     │  │
│          │  │                                                       │  │
│          │  │  [Daha Fazla Yukle]                                  │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 6. Anlam Haritasi (`/content/semantic-map`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Anlam Haritasi         142 sayfa | 6 kume           │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Semantic Scatter Plot (ECharts) ────────────────────┐  │
│          │  │                                                       │  │
│          │  │                                                       │  │
│          │  │         ● ●                                          │  │
│          │  │        ● ●●●              [Urun]                     │  │
│          │  │         ●●                ● ●                        │  │
│          │  │   [Blog-SEO]             ● ●●                       │  │
│          │  │                           ● ●                        │  │
│          │  │                                                       │  │
│          │  │              ●●                                      │  │
│          │  │             ●●●                                      │  │
│          │  │              ●           ●                            │  │
│          │  │        [Blog-Teknik]    ●●                           │  │
│          │  │                        ●●●                           │  │
│          │  │                       [Destek]                       │  │
│          │  │                                                       │  │
│          │  │  ● kume rengi, boyut = trafik                        │  │
│          │  │                                                       │  │
│          │  │  ⚠ Kanibalizasyon riski: 3 cift tespit edildi        │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Kanibalizasyon Uyarilari ───────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ⚠ "seo rehberi" ve "seo kilavuzu"                   │  │
│          │  │    Benzerlik: %94 — birlestirme onerilir             │  │
│          │  │                                                       │  │
│          │  │  ⚠ "wordpress eklentileri" ve "wp plugin onerileri"  │  │
│          │  │    Benzerlik: %89 — birlestirme onerilir             │  │
│          │  │                                                       │  │
│          │  │  ⚠ "site hizi" ve "sayfa yukleme suresi"            │  │
│          │  │    Benzerlik: %87 — birlestirme onerilir             │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### Semantic Scatter Plot (ECharts)

```
ECharts konfigurasyonu:
  type       : 'scatter'
  xAxis/yAxis: t-SNE boyutlari (kullaniciya gizli)
  symbolSize : trafik miktarina oranli (min: 6, max: 30)
  renk       : kume bazli (6 farkli renk)
  tooltip    : sayfa basligi + URL + skor + trafik
  emphasis   : borderWidth: 3, borderColor: '#1F2937'
  grid       : eksenleri gizle (axis label yok, sadece scatter)
  boyut      : w-full h-[500px]
```
