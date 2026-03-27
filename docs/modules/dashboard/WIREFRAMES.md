# dashboard — Wireframe'ler

> Ana dashboard layout'u. Shell layout icinde render edilir.
> Dark tema, responsive grid, KPI kartlari, aktivite feed, AI brief.

---

## 1. Ana Dashboard — Desktop (>= 1280px)

```
┌─ SHELL (sidebar + topbar) ──────────────────────────────────────────────────┐
│                                                                              │
│  Content Area (p-6):                                                         │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Hosgeldin, Ahmet                     [  Son 7 gun  ▼ ]   [⟳ Yenile]   ││
│  │  Acme Corp. · acme.com                 ^DateRangeSelector               ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── KPI KARTLARI (grid cols-4 gap-4) ─────────────────────────────────────┐│
│  │                                                                          ││
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     ││
│  │ │ Toplam       │ │ Aktif        │ │ SEO Skor     │ │ Organik      │     ││
│  │ │ Workspace    │ │ Adapter      │ │              │ │ Trafik       │     ││
│  │ │              │ │              │ │              │ │              │     ││
│  │ │    12        │ │    8/10      │ │    78        │ │   4,521      │     ││
│  │ │              │ │              │ │              │ │              │     ││
│  │ │ ▲ +2 (%20)  │ │ ▼ -1 (%10)  │ │ ▲ +5 (%7)   │ │ ▲ +312 (%7) │     ││
│  │ │ ~~~~~~~~    │ │ ~~~~~~~~    │ │ ~~~~~~~~    │ │ ~~~~~~~~    │     ││
│  │ │ ^sparkline  │ │ ^sparkline  │ │ ^sparkline  │ │ ^sparkline  │     ││
│  │ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── ANA ICERIK (grid cols-3 gap-4) ───────────────────────────────────────┐│
│  │                                                                          ││
│  │ ┌────────────────────────────────────────────┐ ┌──────────────────────┐  ││
│  │ │ AI GUNLUK BRIEF                 [⚡ AI]    │ │ SON AKTİVİTELER      │  ││
│  │ │ (col-span-2)                               │ │                      │  ││
│  │ │                                            │ │ 🟢 10:32             │  ││
│  │ │ Bugun Dikkat Edilecek 3 Sey                │ │ Ahmet Karaca         │  ││
│  │ │ ─────────────────────────────              │ │ giris yapti          │  ││
│  │ │                                            │ │                      │  ││
│  │ │ 1. ⚠️ acme.com organik trafiginde          │ │ 🔵 10:15             │  ││
│  │ │    son 3 gunde %15 dusus var.              │ │ SEO denetimi         │  ││
│  │ │    Google algoritma guncellemesi           │ │ tamamlandi           │  ││
│  │ │    etkisi olabilir.                        │ │ acme.com             │  ││
│  │ │                                            │ │                      │  ││
│  │ │ 2. 📈 blog/yazilar kategorisi              │ │ 🟡 09:45             │  ││
│  │ │    son haftada %23 organik buyume          │ │ Adapter baglanti     │  ││
│  │ │    gosteriyor. Basarili icerikler          │ │ hatasi: shopify      │  ││
│  │ │    analiz edilmeli.                        │ │                      │  ││
│  │ │                                            │ │ 🟢 09:30             │  ││
│  │ │ 3. 🔧 3 sayfa Core Web Vitals              │ │ Yeni workspace       │  ││
│  │ │    esiklerini asiyor. LCP                  │ │ eklendi: beta.com    │  ││
│  │ │    optimizasyonu oncelikli.                │ │                      │  ││
│  │ │                                            │ │ 🟢 09:00             │  ││
│  │ │ ──────────────────────                     │ │ Platform v2.1.1      │  ││
│  │ │ 🤖 AI tarafindan uretildi · 08:00          │ │ guncellendi          │  ││
│  │ │                                            │ │                      │  ││
│  │ │ [Detayli Analiz ->]                        │ │ [Tumu ->]            │  ││
│  │ │                                            │ │                      │  ││
│  │ └────────────────────────────────────────────┘ └──────────────────────┘  ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── ALT SATIRLAR (grid cols-2 gap-4) ─────────────────────────────────────┐│
│  │                                                                          ││
│  │ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐││
│  │ │ TRAFİK OZETI                     │ │ ADAPTER DURUMU                   │││
│  │ │ (Stacked Area — ECharts)         │ │ (Doughnut — ECharts)             │││
│  │ │                                  │ │                                  │││
│  │ │        .·*·.                     │ │       ┌─────────┐               │││
│  │ │      .·     ·.    Organik        │ │      ╱    8      ╲  Aktif       │││
│  │ │    .·  .·*·.  ·.  Direct         │ │     │   -----    │  Inaktif     │││
│  │ │ ──·──·─────·──·── Referral       │ │      ╲   10     ╱  Hata        │││
│  │ │ Mar 1   Mar 15   Mar 27          │ │       └─────────┘               │││
│  │ │                                  │ │                                  │││
│  │ │ [7 gun] [30 gun] [90 gun]        │ │  ● 8 Aktif  ● 1 Inaktif        │││
│  │ │                                  │ │  ● 1 Hata                       │││
│  │ └──────────────────────────────────┘ └──────────────────────────────────┘││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. KPI Karti Detay

```
┌──────────────────────────────────────┐
│  bg-gray-800 rounded-xl p-5          │
│  border border-gray-700              │
│                                      │
│  Toplam Workspace                    │  <- text-sm text-gray-400
│                                      │
│        12                            │  <- text-3xl font-bold text-white
│                                      │
│  ▲ +2 (%20)            ~~~~~~~~     │  <- trend: text-green-400 (yukselis)
│                         ^sparkline   │     veya text-red-400 (dusus)
│                         (ECharts     │     sparkline: 80x24px inline
│                          mini)       │
└──────────────────────────────────────┘

Trend Ok Renkleri:
  ▲ Yukselis : text-green-400   (pozitif metrikler icin)
  ▼ Dusus    : text-red-400     (negatif metrikler icin)
  ▲ Yukselis : text-red-400     (hata sayisi gibi ters metriklerde)
  ▼ Dusus    : text-green-400   (hata sayisi azaldiginda)
  ─ Degisim yok : text-gray-500
```

---

## 3. AI Brief Karti Detay

```
┌──────────────────────────────────────────────────────────────┐
│  bg-gradient-to-br from-blue-900/50 to-purple-900/50        │
│  border border-blue-800/50 rounded-xl p-6                   │
│                                                              │
│  ┌──────────┐                                               │
│  │ ⚡ AI     │  Bugun Dikkat Edilecek 3 Sey                  │
│  └──────────┘  ^badge: bg-blue-600 text-xs rounded-full     │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 1. ⚠️ UYARI                                              ││
│  │    acme.com organik trafiginde son 3 gunde %15 dusus.   ││
│  │    Google algoritma guncellemesi etkisi olabilir.        ││
│  │    [Trafik Analizi ->]                                   ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ 2. 📈 TREND                                              ││
│  │    blog/yazilar kategorisi son haftada %23 buyume.       ││
│  │    Basarili icerikler analiz edilmeli.                   ││
│  │    [Icerik Analizi ->]                                   ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ 3. 🔧 ONERİ                                              ││
│  │    3 sayfa CWV esiklerini asiyor. LCP                   ││
│  │    optimizasyonu oncelikli.                              ││
│  │    [Performans ->]                                       ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│  🤖 AI tarafindan uretildi · 27 Mart 2026, 08:00            │
│                                                              │
│  [Detayli Analiz ->]   [Gecmis Brief'ler]                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Aktivite Feed Detay

```
┌──────────────────────────────────────┐
│  bg-gray-800 rounded-xl p-5          │
│  border border-gray-700              │
│                                      │
│  Son Aktiviteler                     │
│  ─────────────────────────────────── │
│                                      │
│  🟢 10:32 · Bugun                    │  <- status dot + zaman
│  Ahmet Karaca giris yapti            │  <- aciklama
│  ···································│  <- ayirici (border-b border-gray-700)
│                                      │
│  🔵 10:15 · Bugun                    │
│  SEO denetimi tamamlandi             │
│  acme.com                            │  <- text-gray-500 (context)
│  ···································│
│                                      │
│  🟡 09:45 · Bugun                    │  <- sari: uyari
│  Adapter baglanti hatasi             │
│  shopify · beta.com                  │
│  ···································│
│                                      │
│  🟢 09:30 · Bugun                    │
│  Yeni workspace eklendi              │
│  beta.com                            │
│  ···································│
│                                      │
│  [Daha fazla yukle]                  │  <- cursor-based pagination
│  hx-get="...?cursor=..."            │     hx-swap="afterend"
│                                      │
└──────────────────────────────────────┘

Status Dot Renkleri:
  🟢 bg-green-400  : basarili islem (login, create, update)
  🔵 bg-blue-400   : bilgi (denetim tamamlandi, rapor hazir)
  🟡 bg-yellow-400 : uyari (baglanti hatasi, esik asildi)
  🔴 bg-red-400    : hata (adapter coktu, guvenlik ihlali)
```

---

## 5. Tablet Layout (768-1023px)

```
┌─ SHELL (collapsed sidebar + topbar) ─────────────────┐
│                                                       │
│  Content Area:                                        │
│                                                       │
│  KPI KARTLARI (grid cols-2)                           │
│  ┌──────────────┐ ┌──────────────┐                    │
│  │ Workspace: 12│ │ Adapter: 8/10│                    │
│  └──────────────┘ └──────────────┘                    │
│  ┌──────────────┐ ┌──────────────┐                    │
│  │ SEO Skor: 78 │ │ Trafik: 4521 │                    │
│  └──────────────┘ └──────────────┘                    │
│                                                       │
│  AI BRIEF (tam genislik)                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ...                                              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  AKTİVİTELER (tam genislik)                           │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ...                                              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  TRAFİK + ADAPTER (grid cols-2)                       │
│  ┌────────────────────┐ ┌────────────────────┐        │
│  │ Stacked Area       │ │ Doughnut           │        │
│  └────────────────────┘ └────────────────────┘        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 6. Mobil Layout (< 768px)

```
┌─ SHELL (hidden sidebar + compact topbar) ┐
│                                           │
│  KPI KARTLARI (grid cols-2, kucuk)        │
│  ┌─────────┐ ┌─────────┐                 │
│  │ WS: 12  │ │ AD: 8/10│                 │
│  └─────────┘ └─────────┘                 │
│  ┌─────────┐ ┌─────────┐                 │
│  │ SEO: 78 │ │ TR: 4521│                 │
│  └─────────┘ └─────────┘                 │
│                                           │
│  AI BRIEF (tam genislik, kompakt)         │
│  ┌───────────────────────────────────┐    │
│  │ Bugun: 3 sey                      │    │
│  │ 1. Trafik dususu %15             │    │
│  │ 2. Blog buyumesi %23             │    │
│  │ 3. CWV: 3 sayfa                  │    │
│  └───────────────────────────────────┘    │
│                                           │
│  AKTİVİTELER                              │
│  ┌───────────────────────────────────┐    │
│  │ ...                               │    │
│  └───────────────────────────────────┘    │
│                                           │
│  GRAFİKLER (tam genislik, yigilib)        │
│  ┌───────────────────────────────────┐    │
│  │ Trafik Ozeti                      │    │
│  └───────────────────────────────────┘    │
│  ┌───────────────────────────────────┐    │
│  │ Adapter Durumu                    │    │
│  └───────────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
```

---

## 7. Skeleton Loading State

```
┌──────────────────────────────────────┐
│  bg-gray-800 rounded-xl p-5          │
│  animate-pulse                       │
│                                      │
│  ┌─────────────────┐                 │  <- bg-gray-700 h-4 w-32 rounded
│  └─────────────────┘                 │
│                                      │
│  ┌───────────┐                       │  <- bg-gray-700 h-8 w-20 rounded
│  └───────────┘                       │
│                                      │
│  ┌──────────┐ ┌─────────────────┐    │  <- trend + sparkline placeholder
│  └──────────┘ └─────────────────┘    │
│                                      │
└──────────────────────────────────────┘

Skeleton partial, hx-trigger="load" oncesi gosterilir.
HTMX swap sonrasi gercek icerikle degistirilir.
```
