# Module 06: adapter-registry — WIREFRAMES

> ASCII wireframe'ler. Flowbite Pro + Tailwind CDN ile render edilir.

---

## 1. Adaptor Katalogu (`/adapters`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Adaptorler                                   │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Page Header ─────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Platform Adaptorleri              [+ Yeni Baglanti]  │  │
│          │  │  104 platform destekleniyor · 7 bagli                 │  │
│          │  │                                                       │  │
│          │  │  ┌──────────────────────┐  Kategori: [Tumu ▾]        │  │
│          │  │  │ 🔍 Platform ara...   │  Durum:    [Tumu ▾]        │  │
│          │  │  └──────────────────────┘  Baglanti: [Tumu ▾]        │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Kategori Tab Bar ───────────────────────────────────┐  │
│          │  │ [Tumu (104)] [CMS (83)] [Analitik (8)] [Reklam (7)] │  │
│          │  │ [CRM (3)] [E-Ticaret (3)]                            │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Adaptor Grid (4 kolon, gap-4) ──────────────────────┐ │
│          │  │                                                        │ │
│          │  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐│ │
│          │  │ │AdapterCard│ │AdapterCard│ │AdapterCard│ │Adapter  ││ │
│          │  │ │           │ │           │ │           │ │Card     ││ │
│          │  │ │  [WP]     │ │  [SH]     │ │  [DR]     │ │ [MG]   ││ │
│          │  │ │WordPress  │ │ Shopify   │ │ Drupal    │ │Magento  ││ │
│          │  │ │           │ │           │ │           │ │         ││ │
│          │  │ │ CMS       │ │ E-Ticaret │ │ CMS       │ │E-Ticare││ │
│          │  │ │ API Key   │ │ OAuth2    │ │ API Key   │ │API Key  ││ │
│          │  │ │           │ │           │ │           │ │         ││ │
│          │  │ │ ● Bagli   │ │ ○ Degil   │ │ ● Bagli   │ │○ Degil  ││ │
│          │  │ │           │ │           │ │           │ │         ││ │
│          │  │ │[Detay]    │ │ [Baglan]  │ │[Detay]    │ │[Baglan] ││ │
│          │  │ └───────────┘ └───────────┘ └───────────┘ └─────────┘│ │
│          │  │                                                        │ │
│          │  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐│ │
│          │  │ │  [GA]     │ │  [GSC]    │ │  [GTM]    │ │ [FB]   ││ │
│          │  │ │ Google    │ │ Search    │ │ Tag       │ │Facebook ││ │
│          │  │ │ Analytics │ │ Console   │ │ Manager   │ │ Ads    ││ │
│          │  │ │ Analitik  │ │ Analitik  │ │ Analitik  │ │Reklam  ││ │
│          │  │ │ OAuth2    │ │ OAuth2    │ │ OAuth2    │ │OAuth2  ││ │
│          │  │ │ ● Bagli   │ │ ○ Degil   │ │ ○ Degil   │ │○ Degil ││ │
│          │  │ └───────────┘ └───────────┘ └───────────┘ └─────────┘│ │
│          │  │                                                        │ │
│          │  └────────────────────────────────────────────────────────┘ │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### AdapterCard Detay

```
┌────────────────────────────────────┐
│                                    │
│   ┌──────┐               [BETA]   │  <- status badge (opsiyonel)
│   │ ICON │  48x48 platform icon    │
│   └──────┘                         │
│                                    │
│   WordPress                        │  <- text-base font-semibold
│                                    │
│   ┌──────────┐  ┌──────────────┐  │
│   │ 🏷 CMS   │  │ 🔑 API Key   │  │  <- kategori badge + auth tipi badge
│   └──────────┘  └──────────────┘  │
│                                    │
│   Desteklenen: SEO, Icerik,        │  <- text-xs text-gray-500
│   Performans, Guvenlik             │
│                                    │
│   ┌─────────────────────────────┐  │
│   │  ● Bagli (3 workspace)     │   │  <- bagli: green, degil: gray
│   └─────────────────────────────┘  │
│                                    │
│   [Detay]  veya  [Baglan]         │  <- bagli ise "Detay", degilse "Baglan"
│                                    │
└────────────────────────────────────┘
   w: ~220px (grid-cols-4 responsive)
   border: border border-gray-200 rounded-lg
   hover: hover:border-primary-300 hover:shadow-sm
   padding: p-4
```

---

## 2. Adaptor Detay (`/adapters/{uid}`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Breadcrumb ──────────────────────────────────────────┐  │
│          │  │  Studio > Adaptorler > WordPress                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  [WP] WordPress                    [Baglanti Testi]  │  │
│          │  │  CMS · API Key / OAuth2 · v6.4+ destekli             │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ KPI Row (grid-cols-4) ──────────────────────────────┐  │
│          │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│          │  │ │ Baglanti │ │ Uptime   │ │ Ort.     │ │ Son      │ │  │
│          │  │ │ Sayisi   │ │ (7 gun)  │ │ Latency  │ │ Kontrol  │ │  │
│          │  │ │          │ │          │ │          │ │          │ │  │
│          │  │ │    3     │ │  99.2%   │ │  142ms   │ │  2 dk    │ │  │
│          │  │ │          │ │          │ │          │ │  once    │ │  │
│          │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Tab Nav ────────────────────────────────────────────┐  │
│          │  │  [Saglik Gecmisi]  [Baglantilar]  [Uyumluluk]        │  │
│          │  └──────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Health Timeline (ECharts) ──────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Zaman Araligi: [1 Gun] [7 Gun] [30 Gun]             │  │
│          │  │                                                       │  │
│          │  │  ms                                                   │  │
│          │  │  300 ┤                                                │  │
│          │  │  250 ┤              ·                                 │  │
│          │  │  200 ┤    ·  · ·  ·   ·                              │  │
│          │  │  150 ┤ · ·  ·  ·  · ·  · · ·  ·  · ·                │  │
│          │  │  100 ┤·  ·        ·        · ·  ·· ··· · ·           │  │
│          │  │   50 ┤                                 ·    ·         │  │
│          │  │    0 ┼────────────────────────────────────────        │  │
│          │  │      Pts  Sal  Car  Per  Cum  Cts  Paz               │  │
│          │  │                                                       │  │
│          │  │  ● OK (842)   ● Hata (3)   ● Timeout (1)            │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ AI Pattern Analizi ─────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  🤖 Kopma Pattern Tespiti                             │  │
│          │  │  ──────────────────────                               │  │
│          │  │  Son 30 gunde 3 tekrarlayan kopma tespit edildi:      │  │
│          │  │  - Her Sali 03:00-04:30 arasi timeout (sunucu bakimi?)│  │
│          │  │  - Latency Cuma 17:00-19:00 arasi %40 artiyor        │  │
│          │  │                                                       │  │
│          │  │  Oneri: Bakim penceresi disinda veri toplama          │  │
│          │  │  zamanlayicisini ayarlayin.                           │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Baglanti Listesi ───────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Workspace          Durum       Son Kontrol  Aksiyon  │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  Acme Shop          ● Bagli     2 dk once    [Test]  │  │
│          │  │  Blog TR            ● Bagli     3 dk once    [Test]  │  │
│          │  │  Demo Site          ○ Hata      1 saat once  [Onar]  │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Adaptor Baglama Sihirbazi (`/adapters/connect`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Wizard Steps Bar ───────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ① Workspace  ─→  ② Platform  ─→  ③ Kimlik  ─→  ④ Test│  │
│          │  │  ✓ Tamamlandi     ● Aktif         ○ Bekliyor  ○ Bekle │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Adim 2: Platform Secimi ────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Hangi platformu baglamak istiyorsunuz?               │  │
│          │  │                                                       │  │
│          │  │  ┌──────────────────────────────────────────────┐     │  │
│          │  │  │ 🔍 Platform ara...                           │     │  │
│          │  │  └──────────────────────────────────────────────┘     │  │
│          │  │                                                       │  │
│          │  │  CMS Platformlari                                    │  │
│          │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │  │
│          │  │  │  [WP]  │ │  [SH]  │ │  [DR]  │ │  [MG]  │       │  │
│          │  │  │Wordpres│ │Shopify │ │Drupal  │ │Magento │       │  │
│          │  │  └────────┘ └────────┘ └────────┘ └────────┘       │  │
│          │  │                                                       │  │
│          │  │  Analitik & Reklam                                   │  │
│          │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │  │
│          │  │  │  [GA]  │ │  [GSC] │ │  [GAd] │ │  [FB]  │       │  │
│          │  │  │Google  │ │Search  │ │Google  │ │Facebook│       │  │
│          │  │  │Analyti │ │Console │ │  Ads   │ │  Ads   │       │  │
│          │  │  └────────┘ └────────┘ └────────┘ └────────┘       │  │
│          │  │                                                       │  │
│          │  │  [< Geri]                          [Devam Et >]      │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### Adim 3: Credential Formu (platform'a gore dinamik)

```
WordPress Credential Formu:
┌───────────────────────────────────────────────────┐
│                                                   │
│  WordPress Baglanti Bilgileri                     │
│                                                   │
│  Site URL *                                       │
│  ┌───────────────────────────────────────────┐    │
│  │ https://acme-shop.com                     │    │
│  └───────────────────────────────────────────┘    │
│                                                   │
│  Kimlik Dogrulama Yontemi                        │
│  ○ Application Password (onerilen)                │
│  ○ JWT Secret                                     │
│                                                   │
│  Kullanici Adi *                                  │
│  ┌───────────────────────────────────────────┐    │
│  │ admin                                     │    │
│  └───────────────────────────────────────────┘    │
│                                                   │
│  Application Password *                           │
│  ┌───────────────────────────────────────────┐    │
│  │ ••••••••••••••••••••                      │    │
│  └───────────────────────────────────────────┘    │
│                                                   │
└───────────────────────────────────────────────────┘

Google Analytics Credential Formu (OAuth2):
┌───────────────────────────────────────────────────┐
│                                                   │
│  Google Analytics Baglantisi                      │
│                                                   │
│  Google hesabinizla yetkilendirme yapin:          │
│                                                   │
│  ┌─────────────────────────────────────────┐      │
│  │  [G] Google ile Yetkilendir             │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Yetkilendirme sonrasi otomatik olarak geri       │
│  yonlendirileceksiniz.                            │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 4. Toplu Saglik Panosu (`/adapters/health`)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │                                                              │
│  Sidebar │  ┌─ Header ─────────────────────────────────────────────┐  │
│          │  │  Adaptor Saglik Durumu        Genel: ● Saglikli       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ KPI Row ───────────────────────────────────────────┐   │
│          │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│          │  │  │ Bagli  │ │ Saglik │ │ Ort.   │ │ Uyari  │       │   │
│          │  │  │   7    │ │ %99.1  │ │ 156ms  │ │   2    │       │   │
│          │  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│          │  └─────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌─ 24 Saat Heatmap (ECharts) ──────────────────────────┐ │
│          │  │                                                        │ │
│          │  │    00 01 02 03 04 05 06 07 08 09 10 11 12 ... 23     │ │
│          │  │  WP ■  ■  ■  □  □  ■  ■  ■  ■  ■  ■  ■  ■      ■  │ │
│          │  │  GA ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■      ■  │ │
│          │  │  SC ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■      ■  │ │
│          │  │  CF ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■      ■  │ │
│          │  │                                                        │ │
│          │  │  ■ OK   □ Hata   ░ Timeout                            │ │
│          │  │                                                        │ │
│          │  └────────────────────────────────────────────────────────┘ │
│          │                                                              │
│          │  ┌─ Uyarilar ───────────────────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  ⚠ Google Analytics OAuth token 3 gune sona eriyor   │  │
│          │  │    [Yenile]                                           │  │
│          │  │                                                       │  │
│          │  │  ⚠ WordPress (Demo Site) son 2 saattir erisilemez    │  │
│          │  │    [Testi Tekrarla]                                   │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │  ┌─ Baglanti Durumu Tablosu ────────────────────────────┐  │
│          │  │                                                       │  │
│          │  │  Platform     Workspace     Durum   Uptime  Latency  │  │
│          │  │  ──────────────────────────────────────────────────── │  │
│          │  │  WordPress    Acme Shop     ● OK    99.8%   120ms    │  │
│          │  │  WordPress    Blog TR       ● OK    99.5%   145ms    │  │
│          │  │  WordPress    Demo Site     ● Hata  94.2%   --       │  │
│          │  │  Google Ana.  Acme Shop     ● OK    100%    89ms     │  │
│          │  │  Search Con.  Acme Shop     ● OK    100%    112ms    │  │
│          │  │  Cloudflare   Acme Shop     ● OK    99.9%   45ms     │  │
│          │  │  Cloudflare   Blog TR       ● OK    99.9%   52ms     │  │
│          │  │                                                       │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```
