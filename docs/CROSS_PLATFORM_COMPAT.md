# Frontend Cross-Platform Uyumluluk Cercevesi

> Durum: Yasayan dokuman · Surum: 1.0.0
> Kapsam: Web → PWA → Native Mobile hazirlik

---

## 1. Ekran Boyutu Breakpoint Haritasi

| Tier | Etiket | Genislik | Temsili Cihaz |
|------|--------|----------|---------------|
| `xs` | Micro Mobile | 320-359 px | iPhone SE1, Galaxy A3 |
| `sm` | Mobile | 360-479 px | Galaxy S, Pixel 6a, Redmi Note |
| `md` | Mobile-L / Phablet | 480-767 px | iPhone Plus, Galaxy Ultra |
| `lg` | Tablet | 768-1023 px | iPad Mini, Galaxy Tab |
| `xl` | Tablet-L / Small Desktop | 1024-1279 px | iPad Pro 11", Surface Pro |
| `2xl` | Desktop | 1280-1535 px | 13-15" Laptop |
| `3xl` | Wide Desktop | 1536-1919 px | 16" Laptop, 24" Monitor |
| `4xl` | Ultra-Wide | 1920 px+ | 27"+ Monitor, cift ekran |

> **Kural:** 320 px minimum genislik zorunlu. Hicbir layout bu sinirin altinda kirilmaz.

## 2. Tarayici Destek Matrisi

### Tier 1 — Tam Destek (test zorunlu)

| Tarayici | Motor | Mobil Esdegeri |
|----------|-------|---------------|
| Chrome 110+ | Blink | Chrome Android |
| Safari 16+ | WebKit | iOS Safari |
| Firefox 115+ | Gecko | Firefox Android |
| Edge 110+ | Blink | Edge Mobile |
| Samsung Internet 20+ | Blink | — |

### Tier 2 — Temel Destek (critical path calismali)

Chrome 90-109, Safari 14-15, Opera, Brave, Arc, UC Browser

### Tier 3 — Best-effort

IE 11: tamamen drop. Opera Mini: sunucu tarafli render.

## 3. Guvenli Kullanilabilir CSS/JS Ozellikler

```
Guvenli Kullan (Tier 1 tumunde)
- CSS Grid + Flexbox
- CSS Custom Properties (var())
- CSS clamp() / min() / max()
- Intersection Observer API
- ResizeObserver API
- ES2020 (optional chaining, nullish coalescing)
- Fetch API + AbortController
- Service Worker (HTTPS)

Polyfill / Fallback Gerekli
- :has() selector → Safari 15 fallback
- container queries → Safari 15 fallback
- @layer → Safari 15 fallback
- View Transitions API → progressive only

Kullanma
- IE-only ozellikler
- webkit-only prefix olmadan
- -moz- prefix gerektiren yeni ozellikler
```

## 4. Viewport Sorunlari ve Cozumleri

```
iOS Safari 100vh Bug    → height: 100dvh; fallback: -webkit-fill-available
Katlanabilir Ekran      → @media (spanning: single-fold-vertical)
Notch / Dynamic Island  → env(safe-area-inset-*) + viewport-fit=cover
On-screen Klavye        → visualViewport.height dinle
Landscape Mobile        → min-height kisiti, xs/sm'de test
```

## 5. Input Modlari

```
Touch:   min 44x44px target, touch-action: manipulation, pinch-zoom devre disi YASAK
Mouse:   hover state zorunlu, right-click, drag & drop
Klavye:  tab order, focus:visible, shortcut keys
Hybrid:  @media (pointer: coarse) → touch-first, @media (pointer: fine) → hover-rich
```

## 6. Performans — Ag Kosullari

| Baglanti | Hedef TTI | Strateji |
|----------|-----------|---------|
| 4G | < 3s | Standart |
| 3G | < 5s | Code split, lazy load |
| 2G | < 8s | Critical CSS inline, minimal JS |
| Offline | Temel icerik | Service Worker cache |

## 7. PWA + Native Mobile Hazirlik

### Strateji Secenekleri

```
A. PWA (Progressive Web App) — oncelikli
   HTTPS + manifest.json + Service Worker
   iOS Safari 16.4+ push notification destegi
   PWABuilder ile iOS/Android paket

B. Capacitor (onerilen mobile-native)
   Mevcut web kodu → iOS + Android native app
   Native plugin erisimi (kamera, GPS, push)

C. Tauri (Desktop)
   Web kodu → macOS/Windows/Linux app
```

### Capacitor Uyumluluk Kurallari

```
- window.location yerine Router push kullan
- localStorage → @capacitor/preferences plugin
- File API → @capacitor/filesystem
- Push → @capacitor/push-notifications
- Status bar rengi → CSS safe-area-inset ile hazirla
- Back button → Android hardware back → history.back()
```

## 8. Erisilebilirlik (A11y) — WCAG 2.1 AA

```
Zorunlu Kurallar
- Renk Kontrast: 4.5:1 (normal metin), 3:1 (buyuk metin/ikon)
- Focus gorunur: outline kaldirma YASAK
- Alt text: img zorunlu (dekoratif → alt="")
- Klavye: tum interaktif elementler klavye erisilebilir
- Heading hiyerarsisi: h1→h2→h3 sirali
- Form label: her input icin label zorunlu
```

## 9. Gorsel & Font Stratejisi

```
Gorsel: WebP (fallback JPEG/PNG), srcset + sizes zorunlu, loading="lazy"
Ikon: SVG zorunlu (Phosphor Icons CDN)
LCP gorsel: loading="eager" + fetchpriority="high"
Font: font-display: swap, Latin + Turkce subset, variable font tercih
Fallback: size-adjust, ascent-override ile CLS onle
```

## 10. Test Matrisi — Oncelikli Kombinasyonlar

| # | Cihaz / Viewport | OS | Tarayici | Oncelik |
|---|-------------------|-----|---------|---------|
| 1 | 320px | Herhangi | Chrome DevTools | Kritik |
| 2 | iPhone SE 2022 (375px) | iOS 16 | Safari | Kritik |
| 3 | Galaxy A54 (360px) | Android 13 | Chrome | Kritik |
| 4 | iPhone 14 Pro (393px) | iOS 17 | Safari | Kritik |
| 5 | iPad Mini (768px) | iPadOS 16 | Safari | Yuksek |
| 6 | MacBook (1280px) | macOS 14 | Chrome | Yuksek |
| 7 | Galaxy Fold (280→512px) | Android 13 | Chrome | Orta |
| 8 | Windows Desktop (1920px) | Win 11 | Edge | Orta |

## 11. 320px Uyumluluk Kontrol Listesi

```
[ ] Yatay scroll yok (overflow-x: hidden)
[ ] Metin okunabilir (min 14px)
[ ] Buton touch target min 44x44px
[ ] Input alanlari full-width
[ ] Tablo → responsive card veya yatay scroll
[ ] Gorsel tasmiyor (max-width: 100%)
[ ] Padding/margin kucultuldu
[ ] Navigasyon: hamburger veya bottom nav
[ ] Modal/drawer: full-screen
[ ] Form: tek sutun, label ustte
```

## 12. Renk Semasi & Kullanici Tercihleri

```css
@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { animation-duration: 0.01ms !important; }
@media (forced-colors: active) { }
@media (prefers-reduced-transparency: reduce) { }
@media (prefers-reduced-data: reduce) { /* bg gorsel, web font yukleme azalt */ }
```
