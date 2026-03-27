# notification-center — Wireframe'ler

> ASCII wireframe'ler. Gercek implementasyonda Flowbite Pro + Tailwind CDN kullanilir.

---

## 1. Topbar Bildirim Dropdown

Shell header icinde her sayfada gorunen bildirim ikonu ve dropdown.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  SEO  Icerik  ...    [🔔 3]  [Avatar]               │
│                                           │                             │
│                                           v                             │
│                              ┌──────────────────────────┐               │
│                              │  Bildirimler              │               │
│                              ├──────────────────────────┤               │
│                              │                          │               │
│                              │  ● SEO Anomalisi         │               │
│                              │    example.com organik    │               │
│                              │    trafik %35 dustu       │               │
│                              │    2 dk once              │               │
│                              │                          │               │
│                              │  ● Guvenlik Alarmi       │               │
│                              │    Bilinmeyen IP'den     │               │
│                              │    giris denemesi         │               │
│                              │    15 dk once             │               │
│                              │                          │               │
│                              │  ○ Plugin Guncelleme     │               │
│                              │    atonota-seo v2.1.0    │               │
│                              │    kullanilabilir         │               │
│                              │    1 saat once            │               │
│                              │                          │               │
│                              ├──────────────────────────┤               │
│                              │  [Tumunu Okundu Isaretle]│               │
│                              │  Tumunu Gor ->            │               │
│                              └──────────────────────────┘               │
│                                                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

- `●` = okunmamis (sol kenarda mavi nokta)
- `○` = okunmus (nokta yok veya gri)
- Badge (3) = okunmamis bildirim sayisi
- Badge 0 ise gizlenir
- Dropdown en fazla 5 bildirim gosterir

---

## 2. Bildirim Listesi Tam Sayfa (/notifications)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Shell Header]                                                             │
├────────────┬────────────────────────────────────────────────────────────────┤
│  [Sidebar] │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  Bildirimler                 [Tumunu Okundu Isaretle]    │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ── Filtreler ──────────────────────────────────────────────── │
│            │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│            │  │ Tip   [v]│ │Ciddiyet[v]│ │Durum  [v]│ │ Ara...          │  │
│            │  │ Tumumu  │ │ Tumumu   │ │ Tumumu  │ │                  │  │
│            │  └─────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│            │                                                                │
│            │  ── Bildirim Kartlari ──────────────────────────────────────── │
│            │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │ ● [!]  SEO Anomalisi                        2 dk once   │  │
│            │  │        example.com organik trafik %35 dustu.            │  │
│            │  │        Beklenen: 1,200 ziyaret/gun                      │  │
│            │  │        Gerceklesen: 780 ziyaret/gun                     │  │
│            │  │        [Detay]  [Okundu Isaretle]                       │  │
│            │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│            │  │ ● [!!] Guvenlik Alarmi                     15 dk once   │  │
│            │  │        Bilinmeyen IP 185.42.xxx.xxx adresinden          │  │
│            │  │        3 basarisiz giris denemesi tespit edildi.        │  │
│            │  │        [Detay]  [Okundu Isaretle]                       │  │
│            │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│            │  │ ○ [i]  Plugin Guncelleme                   1 saat once  │  │
│            │  │        atonota-seo v2.1.0 yeni surum mevcut.           │  │
│            │  │        Degisiklikler: performans iyilestirmeleri.       │  │
│            │  │        [Detay]                                          │  │
│            │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│            │  │ ○ [i]  Haftalik Ozet                         dun       │  │
│            │  │        Bu hafta: 12 SEO degisikligi, 3 anomali,        │  │
│            │  │        ortalama performans skoru 78/100.                │  │
│            │  │        [Detay]                                          │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │              [Daha Fazla Yukle]                          │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
└────────────┴────────────────────────────────────────────────────────────────┘
```

Ciddiyet ikonlari:
- `[!!]` = critical/high — kirmizi ikon (ph-warning-circle)
- `[!]`  = medium — turuncu ikon (ph-warning)
- `[i]`  = low/info — mavi ikon (ph-info)

Okunmamis kartlarda sol kenarda mavi dikey cizgi + hafif mavi arka plan.
Okunmus kartlar standart arka plan.

---

## 3. Bildirim Kartı Detay (Genisletilmis)

Kart tiklandiginda veya "Detay" butonuna basildiginda genisleme:

```
┌──────────────────────────────────────────────────────────────┐
│ ● [!]  SEO Anomalisi                            2 dk once   │
│        example.com organik trafik %35 dustu.                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Metrik         : Organik Trafik                       │  │
│  │  Beklenen       : 1,200 ziyaret/gun                    │  │
│  │  Gerceklesen    : 780 ziyaret/gun                      │  │
│  │  Degisim        : -35%                                 │  │
│  │  Tespit Zamani  : 2026-03-27 14:32 UTC+3               │  │
│  │  Workspace      : example.com                          │  │
│  │  Modul          : seo-intelligence                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [Workspace'e Git]  [Okundu Isaretle]                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. SSE Gercek Zamanli Bildirim Toast

Yeni bildirim geldiginde sag ust kosede toast gosterimi:

```
                                    ┌──────────────────────────┐
                                    │ [!] SEO Anomalisi    [X] │
                                    │ example.com organik      │
                                    │ trafik %35 dustu         │
                                    │                          │
                                    │ [Gor]          Simdi     │
                                    └──────────────────────────┘
```

Toast 8 saniye sonra otomatik kapanir. "Gor" tiklandiginda ilgili bildirim detayina gidilir.
Birden fazla toast varsa dikey olarak yigilir (max 3 gorunur, gerisi kuyrukta).

---

## 5. Bildirim Kurallari Listesi (/notifications/rules)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Shell Header]                                                             │
├────────────┬────────────────────────────────────────────────────────────────┤
│  [Sidebar] │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  Bildirim Kurallari              [+ Yeni Kural]          │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  Ad              │ Kosul              │ Tetik. │ Durum │  │  │
│            │  ├──────────────────────────────────────────────────────────┤  │
│            │  │  Trafik Dususu   │ organic_traffic    │   12   │[─●] ON│  │  │
│            │  │                  │ < -20% (24h)       │        │  [X]  │  │  │
│            │  │  Siralama Kaybi  │ keyword_rank       │    3   │[─●] ON│  │  │
│            │  │                  │ > 10 (7d)          │        │  [X]  │  │  │
│            │  │  Site Cokme      │ uptime_check       │    0   │[○─]OFF│  │  │
│            │  │                  │ = 0 (1h)           │        │  [X]  │  │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  Toplam: 3 kural (2 aktif, 1 pasif)                            │
│            │                                                                │
└────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 6. Kural Olusturma Formu (/notifications/rules/create)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Shell Header]                                                             │
├────────────┬────────────────────────────────────────────────────────────────┤
│  [Sidebar] │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  Yeni Bildirim Kurali                                    │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  Kural Adi                                                     │
│            │  ┌──────────────────────────────────────────────────────┐     │
│            │  │ ornek: Organik Trafik Dususu                        │     │
│            │  └──────────────────────────────────────────────────────┘     │
│            │                                                                │
│            │  Aciklama (opsiyonel)                                          │
│            │  ┌──────────────────────────────────────────────────────┐     │
│            │  │                                                      │     │
│            │  └──────────────────────────────────────────────────────┘     │
│            │                                                                │
│            │  ── EGER (Kosullar) ─────────────────────────────────────────  │
│            │                                                                │
│            │  ┌────────────────────────────────────────────────────────┐   │
│            │  │  Metrik            Operator      Esik      Pencere    │   │
│            │  │  ┌──────────────┐ ┌───────────┐ ┌───────┐ ┌────────┐ │   │
│            │  │  │organic_traff▼│ │degisim % <▼│ │ -20   │ │ 24 saat▼│ │   │
│            │  │  └──────────────┘ └───────────┘ └───────┘ └────────┘ │   │
│            │  │                                             [-] Kaldir│   │
│            │  └────────────────────────────────────────────────────────┘   │
│            │                                                                │
│            │  ┌────────────────────────────────────────────────────────┐   │
│            │  │  Metrik            Operator      Esik      Pencere    │   │
│            │  │  ┌──────────────┐ ┌───────────┐ ┌───────┐ ┌────────┐ │   │
│            │  │  │keyword_rank ▼│ │buyuk (>) ▼│ │  10   │ │  7 gun ▼│ │   │
│            │  │  └──────────────┘ └───────────┘ └───────┘ └────────┘ │   │
│            │  │                                             [-] Kaldir│   │
│            │  └────────────────────────────────────────────────────────┘   │
│            │                                                                │
│            │  [+ Kosul Ekle]                                                │
│            │                                                                │
│            │  Kosul Mantigi: (●) TUM kosullar saglansin (VE)                │
│            │                 ( ) HERHANGI birisi saglansin (VEYA)            │
│            │                                                                │
│            │  ── O ZAMAN (Aksiyonlar) ────────────────────────────────────  │
│            │                                                                │
│            │  ┌────────────────────────────────────────────────────────┐   │
│            │  │  [x] In-App Bildirim                                   │   │
│            │  │  [x] E-posta                                           │   │
│            │  │  [ ] Webhook                                           │   │
│            │  └────────────────────────────────────────────────────────┘   │
│            │                                                                │
│            │  ── Bekleme Suresi ──────────────────────────────────────────  │
│            │  ┌──────────────────────────┐                                 │
│            │  │  60 dakika            [v]│  (ayni kural tekrar tetikleme)   │
│            │  └──────────────────────────┘                                 │
│            │                                                                │
│            │  ┌────────────────┐  ┌────────────────┐                      │
│            │  │  Iptal         │  │  Kurali Kaydet  │                      │
│            │  └────────────────┘  └────────────────┘                      │
│            │                                                                │
└────────────┴────────────────────────────────────────────────────────────────┘
```

Metrik secenekleri dropdown:
- `organic_traffic` — Organik Trafik
- `keyword_rank` — Anahtar Kelime Sirasi
- `page_speed` — Sayfa Hizi (ms)
- `uptime_check` — Site Erisim Durumu
- `domain_authority` — Domain Otoritesi
- `backlink_count` — Backlink Sayisi
- `core_web_vitals_lcp` — LCP (ms)
- `core_web_vitals_cls` — CLS
- `error_rate_4xx` — 4xx Hata Orani (%)
- `error_rate_5xx` — 5xx Hata Orani (%)

Operator secenekleri:
- `gt` — buyuk (>)
- `lt` — kucuk (<)
- `gte` — buyuk esit (>=)
- `lte` — kucuk esit (<=)
- `eq` — esit (=)
- `change_pct` — degisim yuzde (%)

---

## 7. Bildirim Badge (Topbar)

Her sayfada gorunen kucuk okunmamis sayaci:

```
        Normal:          Bildirim var:        Kritik bildirim:
        ┌───┐            ┌───┐               ┌───┐
        │ 🔔│            │🔔 │               │🔔 │
        └───┘            │ 3 │               │ ! │  (kirmizi titresim)
                         └───┘               └───┘
```

Badge HTML (polling ile guncellenir):

```
┌─────────────────────┐
│  <span               │
│    hx-get="..."      │
│    hx-trigger=       │
│    "every 30s">      │
│    3                 │
│  </span>             │
└─────────────────────┘
```

---

## 8. Mobil Gorunum (< 768px)

```
┌──────────────────────────────────┐
│  [=]  Bildirimler    [Okundu]    │
├──────────────────────────────────┤
│                                  │
│  ┌──────────────────────────────┐│
│  │Tip [v]│Ciddiyet [v]│Durum[v]│ │
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │● [!] SEO Anomalisi           ││
│  │  example.com organik trafik  ││
│  │  %35 dustu.                  ││
│  │  2 dk once                   ││
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │● [!!] Guvenlik Alarmi        ││
│  │  Bilinmeyen IP'den giris     ││
│  │  denemesi tespit edildi.     ││
│  │  15 dk once                  ││
│  └──────────────────────────────┘│
│                                  │
│  [Daha Fazla Yukle]              │
│                                  │
└──────────────────────────────────┘
```

Mobilde filtre dropdown'lari yatay scroll bar seklinde gosterilir.
Kartlar tam genislikte, tek kolon layout.
