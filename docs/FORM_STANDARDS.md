# atonota Studio — Form Element & Cross-Platform Standardizasyon

> Cross-platform UI tutarsizliklarini onleyen kural seti.
> CLAUDE.md stack kurali: Tailwind CDN + Flowbite Pro + Alpine.js (bundler YOK).
> Son guncelleme: 2026-03

---

## 1. Platforma Gore Farklilaisan Elementler

### Tier 1 — Tamamen Farkli Gorunen (Kontrol Zorunlu)

| Element | macOS | Windows | Android | iOS |
|---|---|---|---|---|
| `<select>` | Native acilir, chevron yok | Dropdown ok, border | Material dropdown | Wheel picker |
| `<select multiple>` | Liste kutusu | Farkli scroll | Farkli | Desteklemez |
| `<input type="date">` | Native date picker | Farkli takvim UI | Keyboard+picker | Wheel picker |
| `<input type="time">` | Text benzeri | Spinner | Clock UI | Wheel |
| `<input type="color">` | macOS color wheel | Windows palet | Basit hex | Basit |
| `<input type="range">` | Thin track | Thick track | Material | iOS style |
| `<input type="checkbox">` | Rounded, mavi tick | Square, farkli tick | Material | Rounded |
| `<input type="radio">` | Circle + fill | Circle + dot | Material | iOS |
| `<input type="file">` | "Dosya Sec" butonu | "Gozat" butonu | Browser bazli | — |
| `<progress>` | macOS striped | Windows flat | — | — |
| `scrollbar` | Overlay, kaybolur | Her zaman gorunur | — | Overlay |
| `focus ring` | macOS mavi glow | Windows dotted/rect | — | — |
| `placeholder` renk | Daha acik | Farkli opacity | — | — |

### Tier 2 — Tolere Edilebilir

- `<button>` default padding/font
- `<fieldset>/<legend>` border ve gap
- `<hr>` renk ve kalinlik
- `<table>` border-collapse default

---

## 2. Global CSS Reset Katmani

Bu kurallar `base.html` veya ayri `globals.css` icinde uygulanir.
Tailwind CDN ile calisir — bundler gerektirmez.

```css
/* ── Select — en kritik ── */
select {
  appearance: none;
  -webkit-appearance: none;
  background-image: none;
  cursor: pointer;
}

/* ── Input spinners kaldir ── */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* ── Date/time native UI engelle ── */
input[type="date"],
input[type="time"],
input[type="datetime-local"],
input[type="month"],
input[type="week"] {
  appearance: none;
  -webkit-appearance: none;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
}

/* ── Color input ── */
input[type="color"] {
  appearance: none;
  -webkit-appearance: none;
  padding: 0;
  border: 0;
  cursor: pointer;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

/* ── Range ── */
input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

/* ── Checkbox & Radio sifirla ── */
input[type="checkbox"],
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
}

/* ── File input ── */
input[type="file"] {
  cursor: pointer;
}
input[type="file"]::file-selector-button {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

/* ── Scrollbar ── */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
*::-webkit-scrollbar { width: 4px; height: 4px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ── Focus ring standardize ── */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent), 0 0 0 4px var(--accent-soft);
}
*:focus:not(:focus-visible) {
  outline: none;
}

/* ── Placeholder renk ── */
::placeholder {
  color: var(--muted);
  opacity: 1; /* Firefox fix */
}

/* ── Progress ── */
progress {
  appearance: none;
  -webkit-appearance: none;
}

/* ── Details marker ── */
details > summary {
  list-style: none;
  cursor: pointer;
}
details > summary::-webkit-details-marker {
  display: none;
}
```

---

## 3. Bilesen Stratejisi: Native vs Custom

### Kural: "Native Birakma Esigi"

```
Native birak  ->  performans kritik + gorsel fark onemsiz
                  (basit checkbox, radio — Flowbite form class'lari ile)

Custom yap    ->  Select/Combobox, Date Picker, Color Picker,
                  Range Slider, File Upload, Multi-select
```

### atonota Stack ile Uyumlu Cozumler

> CLAUDE.md kurali: React YASAK, bundler YASAK. Flowbite Pro + Alpine.js kullan.

| Ihtiyac | Cozum | Not |
|---|---|---|
| Select / Combobox | Flowbite Pro Dropdown + Alpine.js | Custom dropdown, WAI-ARIA |
| Date Picker | Flowbite Pro Datepicker | CDN, vanilla JS |
| Range Slider | Custom CSS + Alpine.js | `input[type=range]` reset + custom track/thumb |
| Multi-select | Alpine.js x-data + Flowbite dropdown | Chip pattern |
| Checkbox/Radio | Flowbite form components | Reset + accent renk |
| Color Picker | Alpine.js custom + `input[type=color]` | Swatch grid pattern (layout spec'teki gibi) |
| File Upload | Flowbite dropzone + label trick | Gorunmez input + ozel UI |

---

## 4. Form Element Kurallari (Vibecoding)

```
KURAL                                   UYGULAMA
------------------------------------------------------------------------
Native <select> YASAK                   Flowbite Pro Dropdown + Alpine.js
Native <input type="date"> YASAK        Flowbite Pro Datepicker kullan
Checkbox/Radio                          Flowbite form class + appearance:none reset
Focus stili                             box-shadow: 0 0 0 2px var(--accent) pattern
Scrollbar                               scrollbar-width:thin + webkit reset (globals)
Number spinners                         Globals'de kaldirilmis, tekrar ekleme
Placeholder rengi                       var(--muted), opacity:1 (Firefox fix)
File input                              Gorunmez input + label trick
Select acilir menü                      Alpine.js dropdown, ust uste blur YASAK
```

---

## 5. Cross-Platform Test Matrisi

| # | Platform | Kontrol |
|---|----------|---------|
| 1 | Chrome/macOS | Tum form elementleri, scrollbar |
| 2 | Chrome/Windows | Select, checkbox, scrollbar genislik |
| 3 | Firefox/Windows | Placeholder opacity, number spinner, scrollbar |
| 4 | Safari/macOS | Date input, focus ring, file button |
| 5 | Safari/iOS | Select (wheel), date (wheel), tap highlight |
| 6 | Chrome/Android | Select dropdown, date picker |
| 7 | Firefox/Linux | Progress, range, details/summary |
| 8 | 320px viewport | Tum form elementleri tek sutun |

---

## 6. Uyumluluk Notu

Bu dokuman `LAYOUT_SPEC.md` ve `CROSS_PLATFORM_COMPAT.md` ile birlikte calisir.
`base.html`'deki global CSS reset'ler bu dosyadaki kurallari icerir.
Flowbite Pro component'leri bu reset'lerin uzerinde calisir — cakisma olmaz.
