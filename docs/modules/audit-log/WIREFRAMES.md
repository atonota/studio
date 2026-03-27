# audit-log — Wireframe'ler

> ASCII wireframe'ler. Gercek implementasyonda Flowbite Pro + Tailwind CDN kullanilir.

---

## 1. Audit Log Ana Sayfa (/audit)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Shell Header]                                                             │
├────────────┬────────────────────────────────────────────────────────────────┤
│  [Sidebar] │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  Audit Log                            [CSV Indir]       │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ── AI Ozet Karti ──────────────────────────────────────────── │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  ✦ Son 24 Saat Ozeti                                     │  │
│            │  │                                                          │  │
│            │  │  6 kullanici toplam 184 islem yapti. En aktif:           │  │
│            │  │  ahmet@atonota.com (72 islem). En sik aksiyon:          │  │
│            │  │  workspace.update (48 kez). 2 basarisiz API key silme   │  │
│            │  │  denemesi tespit edildi.                                  │  │
│            │  │                                                          │  │
│            │  │  Periyot: [24 saat v]                                    │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ── Aktivite Zaman Cizgisi (ECharts) ───────────────────────── │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │                                                          │  │
│            │  │  ██                                                      │  │
│            │  │  ██ ██                           ██                      │  │
│            │  │  ██ ██    ██          ██    ██    ██ ██                   │  │
│            │  │  ██ ██ ██ ██ ██    ██ ██ ██ ██ ██ ██ ██ ██               │  │
│            │  │  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██        │  │
│            │  │  ─────────────────────────────────────────────────       │  │
│            │  │  28  01  02  03  04  05  06  07  08  09  10  ... 27     │  │
│            │  │                     Mart 2026                            │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ── Filtreler ──────────────────────────────────────────────── │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │  ┌─────────────┐ ┌──────────┐ ┌──────────┐             │  │
│            │  │  │Aksiyon   [v]│ │Kullanici│ │Kaynak [v]│             │  │
│            │  │  │ Tumumu     │ │  [v]     │ │ Tumumu  │             │  │
│            │  │  └─────────────┘ └──────────┘ └──────────┘             │  │
│            │  │                                                          │  │
│            │  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │  │
│            │  │  │Baslangic    │ │Bitis         │ │ Ara...          │  │  │
│            │  │  │ [takvim]    │ │ [takvim]     │ │                  │  │  │
│            │  │  └──────────────┘ └──────────────┘ └────────────────┘  │  │
│            │  │                                                          │  │
│            │  │  ┌──────────────────────────────────────────────────┐   │  │
│            │  │  │ ✦ Dogal dil ile ara: "dun kimler giris yapti?" │   │  │
│            │  │  └──────────────────────────────────────────────────┘   │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ── Audit Tablosu ──────────────────────────────────────────── │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │ Zaman       │Kullanici     │Aksiyon          │Kaynak    │  │
│            │  │             │              │                 │          │  │
│            │  │ IP          │              │Sonuc            │Detay     │  │
│            │  ├──────────────────────────────────────────────────────────┤  │
│            │  │ 14:32:05    │ahmet@aton... │workspace.update │example   │  │
│            │  │ 85.42.1.xx  │              │● basarili       │ [->]     │  │
│            │  │─────────────────────────────────────────────────────────│  │
│            │  │ 14:28:11    │zeynep@aton.. │auth.login       │—         │  │
│            │  │ 92.38.2.xx  │              │● basarili       │ [->]     │  │
│            │  │─────────────────────────────────────────────────────────│  │
│            │  │ 14:15:44    │sistem        │plugin.update    │atonota-  │  │
│            │  │ —           │              │● basarili       │seo [->]  │  │
│            │  │─────────────────────────────────────────────────────────│  │
│            │  │ 13:58:02    │ahmet@aton... │api_key.delete   │atnt_a1b2 │  │
│            │  │ 85.42.1.xx  │              │✗ basarisiz      │ [->]     │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
│            │  ┌──────────────────────────────────────────────────────────┐  │
│            │  │                   [Daha Fazla Yukle]                     │  │
│            │  └──────────────────────────────────────────────────────────┘  │
│            │                                                                │
└────────────┴────────────────────────────────────────────────────────────────┘
```

Tablo satirlarinda:
- Zaman: `HH:MM:SS` formati + satir altinda IP adresi
- Kullanici: e-posta (truncated) veya "sistem" (actor_id NULL ise)
- Aksiyon: `category.action` formati + badge rengi
- Kaynak: resource_label (truncated) + detay linki
- Sonuc: `●` yesil (basarili) veya `✗` kirmizi (basarisiz)
- `[->]` detay butonu: modal acar

---

## 2. Audit Detay Modal (/audit/{event_uid})

```
┌────────────────────────────────────────────────────────────┐
│  Audit Olay Detayi                                  [X]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ── Genel Bilgiler ──────────────────────────────────────  │
│                                                            │
│  Olay ID       : a1b2c3d4-e5f6-7890-abcd-ef1234567890     │
│  Zaman         : 2026-03-27 14:32:05 UTC+3                │
│  Aksiyon       : [workspace.update]                        │
│  Sonuc         : ● Basarili                                │
│                                                            │
│  ── Aktor ───────────────────────────────────────────────  │
│                                                            │
│  Kullanici     : ahmet@atonota.com                         │
│  Kullanici ID  : f1e2d3c4-b5a6-7890-1234-567890abcdef     │
│  IP Adresi     : 85.42.1.123                               │
│  User Agent    : Chrome/123.0 macOS 15.3                   │
│                                                            │
│  ── Kaynak ──────────────────────────────────────────────  │
│                                                            │
│  Tip           : workspace                                 │
│  ID            : 98765432-1abc-def0-1234-567890abcdef      │
│  Etiket        : example.com                               │
│                                                            │
│  ── Metadata (JSON) ─────────────────────────────────────  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  {                                                    │  │
│  │    "field_changes": {                                 │  │
│  │      "name": {                                        │  │
│  │        "old": "Example Site",                         │  │
│  │        "new": "Example Commerce"                      │  │
│  │      },                                               │  │
│  │      "platform_id": {                                 │  │
│  │        "old": "wordpress",                            │  │
│  │        "new": "shopify"                               │  │
│  │      }                                                │  │
│  │    }                                                  │  │
│  │  }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ── Iliskili Olaylar ────────────────────────────────────  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  14:32:05  workspace.update    ahmet@...   basarili  │  │
│  │  14:30:12  workspace.update    ahmet@...   basarili  │  │
│  │  10:15:44  workspace.create    ahmet@...   basarili  │  │
│  │  10:15:40  adaptor.connect     sistem      basarili  │  │
│  └──────────────────────────────────────────────────────┘  │
│  (Ayni kaynak uzerindeki son 10 islem)                     │
│                                                            │
│                         ┌──────────────┐                   │
│                         │  Kapat       │                   │
│                         └──────────────┘                   │
└────────────────────────────────────────────────────────────┘
```

Metadata JSON goruntuleme: Katlanabilir agac (tree) yapisi. Ust seviye anahtarlar
gorunur, tiklandiginda acilir. Syntax highlighting (renklendirme) uygulanir.

Iliskili olaylar: Ayni `resource_type` ve `resource_id`'ye sahip son 10 olay
zaman sirasina gore listelenir (mevcut olay haric).

---

## 3. Aktivite Zaman Cizgisi (ECharts Bar Chart)

```
┌──────────────────────────────────────────────────────────────┐
│  Aktivite Zaman Cizgisi                  Son: [30 gun v]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  250 ─┤                                                      │
│       │                                                      │
│  200 ─┤     ██                                               │
│       │     ██                                               │
│  150 ─┤  ██ ██                              ██               │
│       │  ██ ██ ██                     ██    ██               │
│  100 ─┤  ██ ██ ██ ██          ██ ██ ██ ██ ██ ██             │
│       │  ██ ██ ██ ██    ██ ██ ██ ██ ██ ██ ██ ██ ██          │
│   50 ─┤  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██      │
│       │  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██   │
│    0 ─┼──────────────────────────────────────────────────    │
│       28 01 02 03 04 05 06 07 08 09 10 11 ... 26 27         │
│                          Mart 2026                           │
│                                                              │
│  Renk kodlari:                                               │
│  ██ basarili (yesil)   ██ basarisiz (kirmizi)               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

ECharts bar chart:
- X ekseni: tarih (gun bazli)
- Y ekseni: islem sayisi
- Renk: yesil (basarili) / kirmizi (basarisiz) stacked bar
- Tooltip: "27 Mart: 184 islem (178 basarili, 6 basarisiz)"
- Tiklanabilir: bir gune tiklandiginda o gunun filtrelenmis tablosu gosterilir

---

## 4. Dogal Dil Sorgu Alani

```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✦  Dogal dil ile ara...                            [>] │  │
│  │    Ornek: "dun kimler workspace olusturdu?"            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Sorgu gonderdikten sonra:                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✦ "dun kimler workspace olusturdu?"                   │  │
│  │                                                        │  │
│  │  Yorumlama:                                            │  │
│  │    Aksiyon  : workspace.create                          │  │
│  │    Tarih    : 2026-03-26 00:00 — 2026-03-26 23:59      │  │
│  │                                                        │  │
│  │  Cevap: Dun 2 kullanici toplam 3 workspace olusturdu.  │  │
│  │  ahmet@atonota.com (2 workspace), zeynep@atonota.com   │  │
│  │  (1 workspace).                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  (Altinda filtrelenmis tablo gosterilir)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Filtre Bar Detay

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │ Aksiyon       [v]│  │ Kullanici     [v]│                  │
│  │ ○ Tumumu        │  │ ○ Tumumu        │                  │
│  │ ─────────────── │  │ ─────────────── │                  │
│  │ □ auth.*        │  │ □ ahmet@aton... │                  │
│  │ □ workspace.*   │  │ □ zeynep@aton.. │                  │
│  │ □ plugin.*      │  │ □ mehmet@aton.. │                  │
│  │ □ settings.*    │  │ □ Sistem        │                  │
│  │ □ billing.*     │  └──────────────────┘                  │
│  │ □ security.*    │                                        │
│  └─────────────────┘  ┌──────────────────┐                  │
│                       │ Kaynak Tipi   [v]│                  │
│  ┌─────────────────┐  │ ○ Tumumu        │                  │
│  │ Baslangic [📅]  │  │ □ workspace     │                  │
│  │ 2026-03-20      │  │ □ plugin        │                  │
│  └─────────────────┘  │ □ api_key       │                  │
│  ┌─────────────────┐  │ □ webhook       │                  │
│  │ Bitis     [📅]  │  │ □ user          │                  │
│  │ 2026-03-27      │  └──────────────────┘                  │
│  └─────────────────┘                                        │
│                       ┌──────────────────────────────────┐  │
│  ┌─────────────────┐  │ Metin ara...                     │  │
│  │ Sonuc        [v]│  └──────────────────────────────────┘  │
│  │ ○ Tumumu       │                                        │
│  │ □ Basarili     │  [Filtreleri Temizle]                   │
│  │ □ Basarisiz    │                                        │
│  └─────────────────┘                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Her filtre degisikliginde tablo HTMX ile guncellenir. Filtreler URL query param olarak
da yansitilir (`hx-push-url` ile) — sayfanin link olarak paylasilabilmesi icin.

---

## 6. Mobil Gorunum (< 768px)

```
┌──────────────────────────────────┐
│  [=]  Audit Log         [CSV]    │
├──────────────────────────────────┤
│                                  │
│  ┌──────────────────────────────┐│
│  │ ✦ Son 24 Saat: 184 islem,   ││
│  │   6 kullanici, 2 basarisiz. ││
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │ [Filtrele v]  [Ara...]       ││
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │  14:32  ahmet@...            ││
│  │  workspace.update  ● basarili││
│  │  example.com          [->]   ││
│  │──────────────────────────────││
│  │  14:28  zeynep@...           ││
│  │  auth.login        ● basarili││
│  │  —                    [->]   ││
│  │──────────────────────────────││
│  │  14:15  sistem               ││
│  │  plugin.update     ● basarili││
│  │  atonota-seo          [->]   ││
│  └──────────────────────────────┘│
│                                  │
│  [Daha Fazla Yukle]              │
│                                  │
└──────────────────────────────────┘
```

Mobilde:
- AI ozet karti kisaltilmis gorunumde
- Zaman cizgisi grafigi gizlenir (veya cok kucuk sparkline)
- Filtreler tek bir "Filtrele" butonuna toplanir (tiklandiginda acilir)
- Tablo kartlara donusur (her islem bir kart)
- Detay butonu tiklandiginda tam ekran modal acilir
