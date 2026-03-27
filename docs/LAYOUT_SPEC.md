# atonota Studio — Master Layout Spesifikasyonu

> Referans: admin-panel-final (2).html
> Bu dosya codebase kurallarini OVERRIDE etmez — codebase (CLAUDE.md) her zaman onceliklidir.
> Son guncelleme: 2026-03

---

## 1. Layout Tokenlar (CSS Custom Properties)

```css
:root {
  /* Layout boyutlari */
  --rail-w:    96px;    /* dar sol rail — her zaman gorunur, 320px dahil */
  --wide-w:   280px;    /* genis context sidebar */
  --top-h:     96px;    /* topbar yuksekligi */
  --foot-h:    96px;    /* sticky footer yuksekligi — topbar ile ayni */

  /* Light tema */
  --base:      #F8F5EC;
  --surface:   #F0EDE3;
  --surface-2: #E8E4D8;
  --border:    #D6D1C2;
  --muted:     #9B9485;
  --text-soft: #5C5649;
  --text:      #1E1A14;
  --shadow:    rgba(0,0,0,0.07);

  /* Accent */
  --accent:       #C2410C;
  --accent-h:     #9A3412;
  --accent-soft:  rgba(194,65,12,0.1);
  --accent-muted: rgba(194,65,12,0.2);

  /* Glassmorphism */
  --glass-bg:      rgba(255,255,255,0.06);
  --glass-blur:    blur(18px) saturate(160%);
  --glass-border:  rgba(255,255,255,0.10);
}

.dark {
  --base:      #161412;
  --surface:   #201C18;
  --surface-2: #2A2420;
  --border:    #3C342C;
  --muted:     #7B7269;
  --text-soft: #BDB4A9;
  --text:      #F2EDE5;
  --shadow:    rgba(0,0,0,0.4);
  --glass-bg:      rgba(255,255,255,0.04);
  --glass-border:  rgba(255,255,255,0.07);
}
```

---

## 2. Ana Layout Yapisi (5 Bolge)

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOPBAR (fixed, z:200, h: 96px, glass-blur)                         │
│  [Logo 96px] [Brand 280px] [Search — Cmd+K] [Notif] [Avatar]        │
├──────┬───────────┬───────────────────────────────────────────────────┤
│      │           │                                                   │
│ RAIL │  WIDE     │  MAIN CONTENT                                     │
│ 96px │  SIDEBAR  │  (scroll-y, padding: 40px 36px)                   │
│      │  280px    │                                                   │
│ fixed│  fixed    │  fixed, left offset = rail + wide                 │
│ z:150│  z:140    │                                                   │
│      │           │                                                   │
│ glass│  glass    │  solid --base background                          │
│ blur │  blur     │                                                   │
│      │           │                                                   │
│      │  User     │                                                   │
│      │  Card     │                                                   │
│      │  (bottom) │                                                   │
├──────┴───────────┴───────────────────────────────────────────────────┤
│  FOOTER (fixed, z:200, h: 96px, glass-blur)                         │
│  [Stats] [Separators] [Indicators]                                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Topbar (96px)

| Alan | Genislik | Icerik | Sinir |
|------|----------|--------|-------|
| Logo cell | `var(--rail-w)` = 96px | SVG logo, center | `border-right: 1px solid var(--border)` |
| Brand cell | `var(--wide-w)` = 280px | Marka adi + badge | `border-right: 1px solid var(--border)` |
| Mid (search) | `flex: 1` | Cmd+K arama bar, max-w 520px | — |
| Right actions | auto | Bildirim butonu (48x48), Avatar (30x30) | padding: 0 24px |

### Topbar Kurallar
- `position: fixed; top: 0; left: 0; right: 0;`
- `background: var(--glass-bg); backdrop-filter: var(--glass-blur);`
- `border-bottom: 1px solid var(--glass-border);`
- `z-index: 200;`
- Logo cell ve Brand cell HER ZAMAN gorunur — sidebar collapse durumunda bile
- Wide-toggle butonu topbar'a tasinacak (Brand cell icine, `margin-left: auto`)

---

## 4. Narrow Rail (96px — HER ZAMAN GORUNUR)

```
Konum: fixed, top: --top-h, left: 0, bottom: --foot-h
Genislik: 96px
z-index: 150
Arka plan: glass-blur
Border: right 1px solid glass-border

KURAL: Hicbir breakpoint'te gizlenmez. 320px dahil her zaman gorunur.
```

### Rail Item (.ni)
- Boyut: 82x78px
- Ikon: `font-size: 2.25rem`
- Label: `clamp(0.625rem, 0.8vw, 0.75rem)`, font-weight 700, uppercase
- Aktif: `background: var(--accent-soft); color: var(--accent);`
- Aktif sol kenar: 3px x 28px cizgi, `var(--accent)`
- Divider (.ni-item-div): `width: 60%; height: 1px; opacity: 0.6;`
- Spacer (.ni-spacer): `flex: 1;` — alt kismi footer'a yaslama

---

## 5. Wide Context Sidebar (280px)

```
Konum: fixed, top: --top-h, left: --rail-w, bottom: --foot-h
Genislik: 280px
z-index: 140
Arka plan: glass-blur
Border: right 1px solid glass-border
```

### Responsive Davranis

| Breakpoint | Davranis |
|------------|----------|
| < 900px | Gizli (translateX negatif), overlay ile acilir |
| >= 900px | Varsayilan acik, `body.wide-collapsed` ile kapanir |

### Sidebar Hiyerarsisi (3 seviye)

**Baslik (.ws-header):**
- font-size: 0.6875rem (11px), weight 700, uppercase
- Ikon + metin, border-bottom

**L1 — Grup baslik (.ws-l1):**
- font-size: 0.6875rem (11px), weight 700, uppercase, letter-spacing 0.09em
- Chevron (sag, 90 derece donus), tiklanabilir collapse/expand
- `.ws-l1-body`: max-height animasyon (0 <-> 500px, 0.28s)

**L2 — Ana nav item (.ws-l2):**
- font-size: 0.875rem (14px), weight 400
- padding: 10px 20px 10px 28px
- Aktif: `color: --accent; border-left: 2px solid --accent; background: --accent-soft; font-weight: 600;`
- Badge (.ws-badge): font-size 0.75rem, weight 700, accent-soft bg

**L3 — Alt item (.ws-l3):**
- font-size: 0.8125rem (13px), weight 300
- padding: 8px 20px 8px 44px
- Sol daire indicator: 4px, currentColor

### User Card (Sidebar alti)
- Konum: sidebar'in en altinda, `border-top: 1px solid var(--border)`
- Trigger: Avatar (40x40) + isim + rol + caret-up ikon
- Dropdown: yukari acar (bottom: calc(100% + 6px)), glass-blur arka plan
- Icerik: Profile, My Account, Appearance (tema + renk), Upgrade

### Collapse Toggle
- **KURAL**: Topbar Brand cell icine tasinacak, `margin-left: auto`
- Desktop only (min-width 900px)
- Ikon: `ph-caret-left`, collapse'da 180 derece donus
- Collapsed durumda: sidebar `translateX(-100%)`, main `left: var(--rail-w)`

---

## 6. Main Content Area

```
Konum: fixed, top: --top-h, bottom: --foot-h
Left: var(--rail-w) (mobile) | calc(--rail-w + --wide-w) (desktop)
Right: 0
Background: var(--base) — solid, blur yok
Padding: 32px 24px (mobile) | 40px 36px (desktop)
Overflow-y: auto; overflow-x: hidden;
```

### Sayfa basligi pattern
```html
<h1 style="font-family:'Roboto'; font-size:2rem; font-weight:400;">Sayfa Adi</h1>
<p style="font-size:0.8125rem; color:var(--muted); text-transform:uppercase;">Tarih</p>
```

---

## 7. Footer (96px)

```
Konum: fixed, bottom: 0, left: 0, right: 0
Yukseklik: 96px (topbar ile ayni)
z-index: 200
Arka plan: glass-blur
Border: top 1px solid glass-border
Padding: 0 24px
```

### Footer Icerik
- `.fb-stat`: ikon + deger, font-size 0.8125rem
- `.fb-dot`: 6px yuvarlak indicator
- `.fb-sep`: 1px x 20px dikey ayirici

---

## 8. Glassmorphism Kurallari

Glassmorphism su elementlerde uygulanir:
- Topbar
- Narrow Rail
- Wide Sidebar
- Footer
- Spotlight Search backdrop
- User Dropdown backdrop
- Card component'leri

```css
/* Glass pattern */
background: var(--glass-bg);           /* rgba(255,255,255,0.06) */
backdrop-filter: var(--glass-blur);    /* blur(18px) saturate(160%) */
-webkit-backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border); /* rgba(255,255,255,0.10) */
```

### ONEMLI: Blur Katman Kurallari
1. Ust uste iki `backdrop-filter` KULLANMA — cift bulaniklik ve z-index karisikligi olusur
2. Overlay backdrop'un icinde child element olarak glass card koy (Spotlight pattern'i)
3. Dropdown, backdrop'in child'i olmali — sibling olarak yapma
4. Dropdown kendi `backdrop-filter`'ini KALDIRMALI, solid `var(--surface)` background kullanmali
5. Spotlight calisiyor cunku `#spotlight` backdrop'un icinde bir child element

---

## 9. Spotlight Search

```
z-index: 500
Backdrop: fixed inset, rgba(0,0,0,0.55), blur(4px)
Card: max-w 620px, var(--surface) bg, border-radius 18px
Animasyon: spotIn (translateY -12px, scale 0.97 -> 1, 0.2s)
Input: font-size 1.0625rem, weight 400
Results: max-height 360px, overflow-y auto
Footer: flex, gap 16px, var(--surface-2) bg
```

Tetikleme: `Cmd+K` (macOS) / `Ctrl+K` (Windows/Linux)
Kapatma: ESC tusu veya backdrop tiklama

---

## 10. User Dropdown — Blur Cozumu

### Root Cause
`#user-dropdown` backdrop ile DOM sibling olarak konumlaninca,
iki ayri `backdrop-filter` ust uste gelerek cift bulaniklik ve z-index karisikligi olusur.

### Cozum: Spotlight Pattern'ini Taklit Et
1. `#user-dropdown`'i `#ud-backdrop` icine child olarak tasi
2. Dropdown'in kendi `backdrop-filter`'ini kaldir
3. Dropdown'a solid glass background ver: `background: var(--surface)`
4. Backdrop: `position: fixed; inset: 0; backdrop-filter: blur(6px) brightness(0.7);`
5. JS toggle: sadece `bd.classList.add('show')` + GSAP child animate
6. JS'den `rect.left / top / width` hesaplamasini kaldir — gereksiz

### DOM Yapisi (Dogru)
```html
<!-- Backdrop — tam ekran blur -->
<div id="ud-backdrop">
  <!-- Dropdown — backdrop'un CHILD'i -->
  <div id="user-dropdown">
    <!-- icerik -->
  </div>
</div>
```

### CSS (Dogru)
```css
#ud-backdrop {
  display: none;
  position: fixed; inset: 0;
  z-index: 201;
  backdrop-filter: blur(6px) brightness(0.7);
  background: rgba(0,0,0,0.15);
  /* Dropdown konumlandirma */
  display: flex;
  align-items: flex-end;
  padding-bottom: calc(var(--foot-h) + 16px);
  padding-left: var(--rail-w);
}
#ud-backdrop.show { display: flex; }

#user-dropdown {
  /* backdrop-filter YOK — solid background */
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  position: relative; /* fixed DEGIL */
  max-height: 80vh;
  width: var(--wide-w);
}
```

---

## 11. Tipografi

| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|---------------|
| Body default | Josefin Sans | max(0.9rem, 0.9375rem) | 300 | 0.02em |
| Sayfa basligi (h1) | Roboto | 2rem | 400 | -0.01em |
| Section label | Josefin Sans | 0.6875rem (11px) | 700 | 0.1em, uppercase |
| Nav L1 label | Josefin Sans | 0.6875rem (11px) | 700 | 0.09em, uppercase |
| Nav L2 item | Josefin Sans | 0.875rem (14px) | 400 | — |
| Nav L3 item | Josefin Sans | 0.8125rem (13px) | 300 | — |
| Rail label | Josefin Sans | clamp(0.625rem, 0.8vw, 0.75rem) | 700 | 0.07em, uppercase |
| Badge | Josefin Sans | 0.75rem (12px) | 700 | 0.04em, uppercase |
| Search input | Josefin Sans | max(0.9rem, 0.9375rem) | 300 | 0.02em |
| Button | Josefin Sans | 0.8125rem (13px) | 700 | 0.04em, uppercase |

> **NOT**: atonota projesi Josefin Sans yerine Tailwind CDN default (Inter/system) kullanir.
> Boyut ve weight oranlari korunur, font-family codebase kurallarina uyar.

---

## 12. Z-Index Haritasi

| z-index | Element |
|---------|---------|
| 500 | Spotlight Search backdrop + card |
| 202 | User dropdown (overlay icinde) |
| 201 | User dropdown backdrop (ud-backdrop) |
| 200 | Topbar + Footer |
| 160 | Wide-toggle butonu |
| 150 | Narrow Rail |
| 140 | Wide Sidebar |
| 130 | Mobile overlay (wide-overlay) |
| — | Main Content (z-index yok, varsayilan) |

---

## 13. Card Component

```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  padding: 28px;
}

/* Stat card — ust kenar renk serit */
.stat-card {
  /* card + */
  position: relative;
  overflow: hidden;
}
.stat-card::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--stripe, var(--accent));
}
```

---

## 14. Skeleton / Loading State

```css
@keyframes shimmer {
  0%   { background-position: -700px 0; }
  100% { background-position: 700px 0; }
}
.skel {
  animation: shimmer 1.7s infinite linear;
  background: linear-gradient(90deg,
    var(--surface) 25%,
    var(--surface-2) 50%,
    var(--surface) 75%);
  background-size: 1400px 100%;
  border-radius: 7px;
}
```

---

## 15. Responsive Breakpoint'ler

| Breakpoint | Rail | Wide Sidebar | Main left offset | Topbar |
|------------|------|-------------|-----------------|--------|
| 320-899px | 96px (gorunur) | Gizli (overlay) | 96px | Tam |
| >= 900px | 96px | 280px (acik) | 376px | Tam |
| >= 900px (collapsed) | 96px | Gizli | 96px | Tam |

> **ONEMLI**: Rail HIC gizlenmez. 320px'de bile gorunur. `display:none` asla uygulanmaz.

---

## 16. Animasyon Notlari

- Sidebar acilma/kapanma: GSAP (CSS transition override edildi)
- Spotlight: CSS `@keyframes spotIn` (0.2s, cubic-bezier)
- Dropdown: CSS `@keyframes dropUp` (0.18s, cubic-bezier)
- Skeleton shimmer: CSS `@keyframes shimmer` (1.7s, infinite linear)
- Fade in: CSS `@keyframes fadeUp` (0.4s, ease)
- Canvas/chart: transition YOK — `canvas { transition: none !important; }`
- `prefers-reduced-motion: reduce` icin tum animasyonlar 0.01ms'ye duser
