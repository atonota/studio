# tenant-manager — Wireframe'ler

> Tenant listesi, detay sayfasi (tabli), olusturma sihirbazi.
> Shell layout icinde, dark tema.

---

## 1. Tenant Listesi (`/tenants`) — SA Gorunumu

```
┌─ SHELL ─────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Content Area:                                                               │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Tenant'lar                                            [+ Yeni Tenant]   ││
│  │  ^h1, text-2xl                                         ^btn-primary      ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── FİLTRE CUBUGU ────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  [🔍 Tenant ara...              ]  [Plan: Tumu ▼]  [Siralama: Yeni ▼]   ││
│  │   ^arama input                     ^plan filtre     ^sort dropdown       ││
│  │   hx-trigger="keyup delay:300ms"                                         ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── TENANT TABLOSU ───────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ┌─────┬──────────────┬────────┬───────────┬────────┬──────┬─────────┐  ││
│  │  │     │ Tenant       │ Plan   │ Workspace │ Saglik │Durum │ Islem   │  ││
│  │  ├─────┼──────────────┼────────┼───────────┼────────┼──────┼─────────┤  ││
│  │  │ ┌─┐ │ Acme Corp.   │ Pro    │ 3         │ 🟢 92  │Aktif │ [···]   │  ││
│  │  │ └─┘ │ acme-corp    │        │           │        │      │         │  ││
│  │  │     │ 15 Mar 2026  │        │           │        │      │         │  ││
│  │  ├─────┼──────────────┼────────┼───────────┼────────┼──────┼─────────┤  ││
│  │  │ ┌─┐ │ Beta Ltd.    │ Free   │ 1         │ 🟡 65  │Aktif │ [···]   │  ││
│  │  │ └─┘ │ beta-ltd     │        │           │        │      │         │  ││
│  │  │     │ 20 Mar 2026  │        │           │        │      │         │  ││
│  │  ├─────┼──────────────┼────────┼───────────┼────────┼──────┼─────────┤  ││
│  │  │ ┌─┐ │ Gamma Inc.   │ Enterp.│ 8         │ 🔴 35  │Aktif │ [···]   │  ││
│  │  │ └─┘ │ gamma-inc    │        │           │        │      │         │  ││
│  │  │     │ 10 Mar 2026  │        │           │        │      │         │  ││
│  │  ├─────┼──────────────┼────────┼───────────┼────────┼──────┼─────────┤  ││
│  │  │ ┌─┐ │ Delta Co.    │ Pro    │ 2         │ 🟢 88  │Aktif │ [···]   │  ││
│  │  │ └─┘ │ delta-co     │        │           │        │      │         │  ││
│  │  │     │ 05 Mar 2026  │        │           │        │      │         │  ││
│  │  └─────┴──────────────┴────────┴───────────┴────────┴──────┴─────────┘  ││
│  │                                                                          ││
│  │  4 tenant gosteriliyor                      [< Onceki] [Sonraki >]       ││
│  │                                             ^cursor-based pagination     ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [···] Islem Dropdown:                                                       │
│  ┌────────────────────┐                                                      │
│  │ 👁 Detay Gor       │                                                      │
│  │ ✏️ Duzenle         │                                                      │
│  │ 👥 Kullanicilar    │                                                      │
│  │ ─────────────────  │                                                      │
│  │ 🗑️ Sil (kirmizi)  │                                                      │
│  └────────────────────┘                                                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tablo Notlari
- Checkbox: toplu islem icin (gelecek)
- Tenant adi: link, tiklaninca detay sayfasina gider
- Slug: text-gray-500, adi altinda
- Saglik badge: renk kodlu (92=yesil, 65=sari, 35=kirmizi)
- Islem butonu: Flowbite dropdown

---

## 2. Tenant Detay (`/tenants/{uid}`) — Tabli Gorunum

```
┌─ SHELL ─────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Breadcrumb: Dashboard > Tenant'lar > Acme Corp.                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ┌──────┐  Acme Corp.                    Saglik: 🟢 92/100              ││
│  │  │  AC  │  acme-corp · Pro Plan                                          ││
│  │  │      │  Olusturulma: 15 Mart 2026     [✏️ Duzenle]  [🗑️ Sil]        ││
│  │  └──────┘  ^initials avatar               ^aksiyon butonlari            ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── ONBOARDING ILERLEME (yeni tenant ise) ────────────────────────────────┐│
│  │                                                                          ││
│  │  Kurulum Ilerlemeniz: 3/5 adim tamamlandi                               ││
│  │                                                                          ││
│  │  ✅ Tenant olusturuldu                                                   ││
│  │  ✅ Yonetici hesabi atandi                                               ││
│  │  ✅ Ilk workspace eklendi                                                ││
│  │  ⬜ Adapter baglantisi yapilmadi         [Adapter Bagla ->]              ││
│  │  ⬜ Ilk SEO denetimi baslatilmadi        [Denetim Baslat ->]            ││
│  │                                                                          ││
│  │  [████████████████████░░░░░░░]  %60                                      ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── TAB NAVİGASYONU ──────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  [ Genel Bakis ]  [ Kullanicilar (5) ]  [ Ayarlar ]                     ││
│  │   ^aktif tab       ^badge ile sayi       ^tab                            ││
│  │   bg-gray-700                                                            ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── TAB ICERIGI (dinamik — HTMX ile yuklenir) ───────────────────────────┐│
│  │                                                                          ││
│  │  GENEL BAKIS:                                                            ││
│  │                                                                          ││
│  │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               ││
│  │  │ Workspace      │ │ Kullanicilar   │ │ Adapter        │               ││
│  │  │     3          │ │     5          │ │    2/3 aktif   │               ││
│  │  └────────────────┘ └────────────────┘ └────────────────┘               ││
│  │                                                                          ││
│  │  Son Aktiviteler                                                         ││
│  │  ──────────────────────                                                  ││
│  │  🟢 10:32 · Ahmet Karaca giris yapti                                     ││
│  │  🔵 09:15 · Yeni workspace eklendi: beta.com                             ││
│  │  🟡 Dun   · Adapter baglanti hatasi: shopify                             ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Kullanicilar Tab Icerigi

```
┌── TAB ICERIGI: KULLANICILAR ───────────────────────────────────────────────┐
│                                                                            │
│  Kullanicilar (5)                                        [+ Davet Et]     │
│                                                           ^modal acar     │
│                                                                            │
│  ┌─────────────────┬───────────────────┬────────┬───────────┬───────────┐  │
│  │ Kullanici       │ E-posta           │ Rol    │ Katilim   │ Islem     │  │
│  ├─────────────────┼───────────────────┼────────┼───────────┼───────────┤  │
│  │ 👤 Ahmet Karaca │ ahmet@acme.com    │ TO     │ 15 Mar    │ [···]     │  │
│  │ 👤 Zeynep Yilmaz│ zeynep@acme.com   │ TA     │ 16 Mar    │ [···]     │  │
│  │ 👤 Mehmet Demir │ mehmet@acme.com   │ AN     │ 18 Mar    │ [···]     │  │
│  │ 👤 Elif Ozturk  │ elif@acme.com     │ AN     │ 20 Mar    │ [···]     │  │
│  │ 👤 Burak Kaya   │ burak@acme.com    │ VW     │ 22 Mar    │ [···]     │  │
│  └─────────────────┴───────────────────┴────────┴───────────┴───────────┘  │
│                                                                            │
│  Bekleyen Davetler (2)                                                     │
│  ──────────────────────                                                    │
│  ┌───────────────────┬────────┬───────────┬───────────────────┐            │
│  │ E-posta           │ Rol    │ Tarih     │ Islem             │            │
│  ├───────────────────┼────────┼───────────┼───────────────────┤            │
│  │ can@acme.com      │ AN     │ 25 Mar    │ [Tekrar Gonder]   │            │
│  │                   │        │           │ [Iptal Et]        │            │
│  │ deniz@acme.com    │ VW     │ 26 Mar    │ [Tekrar Gonder]   │            │
│  │                   │        │           │ [Iptal Et]        │            │
│  └───────────────────┴────────┴───────────┴───────────────────┘            │
│                                                                            │
│  [···] Islem Dropdown:                                                     │
│  ┌─────────────────────┐                                                   │
│  │ 🔄 Rol Degistir  ▶  │ -> alt dropdown: TO, TA, AN, VW                   │
│  │ ─────────────────── │                                                   │
│  │ 🚫 Cikart (kirmizi) │                                                   │
│  └─────────────────────┘                                                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kullanici Davet Modal

```
┌──────────────────────────────────────────────────────────────┐
│                    OVERLAY (bg-gray-900/80)                    │
│                                                                │
│      ┌────────────────────────────────────────────────┐       │
│      │                                          [X]   │       │
│      │  Kullanici Davet Et                            │       │
│      │  Acme Corp. tenant'ina yeni kullanici ekleyin  │       │
│      │                                                │       │
│      │  ┌──────────────────────────────────────────┐  │       │
│      │  │ E-posta adresi                           │  │       │
│      │  │ ┌────────────────────────────────────────┐│  │       │
│      │  │ │ kullanici@sirket.com                   ││  │       │
│      │  │ └────────────────────────────────────────┘│  │       │
│      │  └──────────────────────────────────────────┘  │       │
│      │                                                │       │
│      │  ┌──────────────────────────────────────────┐  │       │
│      │  │ Rol                                      │  │       │
│      │  │ ┌────────────────────────────────────────┐│  │       │
│      │  │ │ ▼ Analyst (AN)                         ││  │       │
│      │  │ │   ────────────────────                 ││  │       │
│      │  │ │   Tenant Owner (TO) — Tam yetki        ││  │       │
│      │  │ │   Tenant Admin (TA) — Yonetim          ││  │       │
│      │  │ │ ▶ Analyst (AN) — Analiz, rapor         ││  │       │
│      │  │ │   Viewer (VW) — Salt okunur            ││  │       │
│      │  │ └────────────────────────────────────────┘│  │       │
│      │  └──────────────────────────────────────────┘  │       │
│      │                                                │       │
│      │  ┌──────────────────────────────────────────┐  │       │
│      │  │ Mesaj (opsiyonel)                        │  │       │
│      │  │ ┌────────────────────────────────────────┐│  │       │
│      │  │ │ Merhaba, sizi atonota platformuna     ││  │       │
│      │  │ │ davet ediyorum...                     ││  │       │
│      │  │ └────────────────────────────────────────┘│  │       │
│      │  └──────────────────────────────────────────┘  │       │
│      │                                                │       │
│      │  ┌──────────────────┐ ┌─────────────────────┐ │       │
│      │  │     Iptal        │ │   Davet Gonder      │ │       │
│      │  │  (btn-secondary) │ │   (btn-primary)     │ │       │
│      │  └──────────────────┘ └─────────────────────┘ │       │
│      │                                                │       │
│      └────────────────────────────────────────────────┘       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Tenant Olusturma Sihirbazi (`/tenants/create`)

```
┌─ SHELL ─────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Breadcrumb: Dashboard > Tenant'lar > Yeni Tenant                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Yeni Tenant Olustur                                                     ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── ADIM GOSTERGESI ──────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  (1)────────(2)────────(3)────────(4)                                   ││
│  │ Temel     Yonetici    Plan      Onay                                    ││
│  │ Bilgiler  Hesabi     Secimi                                              ││
│  │  ^aktif    ^bekleyen  ^bekleyen  ^bekleyen                              ││
│  │  bg-blue   text-gray  text-gray  text-gray                              ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌── ADIM 1: TEMEL BİLGİLER ──────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ┌──────────────────────────────────────────────────────────────────┐    ││
│  │  │ Tenant Adi *                                                     │    ││
│  │  │ ┌────────────────────────────────────────────────────────────────┐│    ││
│  │  │ │ Acme Corporation                                              ││    ││
│  │  │ └────────────────────────────────────────────────────────────────┘│    ││
│  │  └──────────────────────────────────────────────────────────────────┘    ││
│  │                                                                          ││
│  │  ┌──────────────────────────────────────────────────────────────────┐    ││
│  │  │ Slug (URL dostu)                                                 │    ││
│  │  │ ┌────────────────────────────────────────────────────────────────┐│    ││
│  │  │ │ acme-corporation                                              ││    ││
│  │  │ └────────────────────────────────────────────────────────────────┘│    ││
│  │  │ Otomatik uretildi. Olusturulduktan sonra degistirilemez.         │    ││
│  │  └──────────────────────────────────────────────────────────────────┘    ││
│  │                                                                          ││
│  │  ┌─────────────────────────┐ ┌─────────────────────────┐                ││
│  │  │ Sektor                  │ │ Ulke                    │                ││
│  │  │ ┌───────────────────────┐│ │ ┌───────────────────────┐│               ││
│  │  │ │ ▼ E-Ticaret          ││ │ │ ▼ Turkiye             ││               ││
│  │  │ └───────────────────────┘│ │ └───────────────────────┘│               ││
│  │  └─────────────────────────┘ └─────────────────────────┘                ││
│  │                                                                          ││
│  │                                                [Sonraki Adim ->]         ││
│  │                                                ^hx-post wizard           ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ADIM 4: ONAY EKRANI                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  Ozet                                                                    ││
│  │  ─────────────────────────                                               ││
│  │  Tenant Adi    : Acme Corporation                                        ││
│  │  Slug          : acme-corporation                                        ││
│  │  Sektor        : E-Ticaret                                               ││
│  │  Ulke          : Turkiye                                                 ││
│  │  Yonetici      : admin@acme.com (Yeni davet)                            ││
│  │  Plan          : Pro (Aylik)                                             ││
│  │                                                                          ││
│  │  [<- Geri]                                        [Tenant Olustur]       ││
│  │                                                    ^btn-primary, hx-post ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Saglik Skoru Badge Detay

```
Saglik Skoru Gostergesi (tablo satirlarinda ve detay sayfasinda):

Yuksek (80-100):
  ┌──────────┐
  │ 🟢 92    │  bg-green-900/30 text-green-400 border-green-800
  └──────────┘

Orta (50-79):
  ┌──────────┐
  │ 🟡 65    │  bg-yellow-900/30 text-yellow-400 border-yellow-800
  └──────────┘

Dusuk (0-49):
  ┌──────────┐
  │ 🔴 35    │  bg-red-900/30 text-red-400 border-red-800
  └──────────┘

Tooltip (hover):
  ┌────────────────────────────┐
  │ Saglik Skoru Dagılımı      │
  │ ─────────────────────────  │
  │ Adapter Durumu    : 25/30  │
  │ API Kullanimi     : 20/25  │
  │ Odeme Durumu      : 25/25  │
  │ Kullanici Aktivite: 15/20  │
  │ ─────────────────────────  │
  │ Toplam            : 85/100 │
  └────────────────────────────┘
```

---

## Responsive Davranis

```
Desktop (>= 1280px):
  - Tablo tam genislik, tum kolonlar gorunur
  - Sihirbaz max-w-2xl ortalanmis
  - Detay sayfa tablar yatay

Tablet (768-1023px):
  - Tablo: Plan ve Workspace kolonlari gizlenir
  - Sihirbaz max-w-xl
  - Detay tablar yatay

Mobil (< 768px):
  - Tablo -> kart gorunumu (her tenant bir kart)
  - Sihirbaz tam genislik
  - Detay tablar yigilir (dikey tab listesi)
```
