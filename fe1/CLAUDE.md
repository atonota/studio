# CLAUDE.md — atonota Studio Admin Panel
## Vibecoding Yönergesi · TypeScript + SCSS Mimari Rehberi

> Bu dosya her AI oturumunun başında okunmalı. Codebase bağlamı, mimari kararlar,
> ve AI çalışma protokolünü içerir.
> Son güncelleme: 2026-03-30 — TS + SCSS migration tamamlandı

---

## 0. Proje Özeti

**Ürün:** atonota Studio — SEO/Ads/Analytics admin panel
**Stack:** Tailwind CDN · Alpine.js 3.x · ECharts 5 · Phosphor Icons 2.1.1 · GSAP 3.12.5
**Build:** esbuild (TS → IIFE JS) + Dart Sass (SCSS → CSS)
**Deploy:** Hetzner AMD EPYC Debian/Docker → GitHub Actions CI
**Durum:** TypeScript migration tamamlandı (39 modül, strict 0 hata) · SCSS migration tamamlandı (45 modül)

### Flowbite Pro Durumu
CLAUDE.md'de lisanslı olarak geçiyor ama codebase'de **hiçbir Flowbite CSS/JS referansı yok**.
Flowbite class'ları YAZMA. Tailwind utility class'ları kullan.

---

## 1. Mimari: MVVM + Functional Core

```
View         →  HTML + Tailwind (x-bind, x-on, x-show)
ViewModel    →  Alpine component/store  (UI state, event, binding, orchestration)
Service      →  Saf TS fonksiyonlar     (business logic, transform, pure)
Repository   →  localStorage wrapper + fetch  (veri erişim katmanı)
Config       →  Sabitler, preset'ler, map'ler (kod değil, veri)
```

### Zorunlu Katman Akışı
```
View → ViewModel → Service → Repository → API/Storage
```
- Katmanlar birbirini **atlayamaz**
- Yukarı: yalnızca event/command
- Aşağı: yalnızca state/data
- Alpine component içine business logic **gömme**

---

## 2. TypeScript Kuralları (Bu Proje İçin)

```typescript
// ✓ Named export zorunlu
export function formatCurrency(n: number): string {}

// ✗ Default export yasak
export default function formatCurrency() {}
```

```typescript
// ✓ Branded type — yanlış alana yanlış değer giremez
type PageKey    = string & { readonly _brand: 'PageKey' }
type TenantId   = string & { readonly _brand: 'TenantId' }
type AccentKey  = 'cyan' | 'magenta' | 'yellow' | 'red' | 'green' | 'blue' | 'violet' | 'orange'
```

```typescript
// ✓ Discriminated union — async state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   message: string }
```

```typescript
// ✓ Result tipi — hata yönetimi
type Result<T, E = AppError> =
  | { ok: true;  value: T }
  | { ok: false; error: E }
```

```typescript
// ✓ Max 3 parametre, fazlası options object
function createChart(el: HTMLElement, options: Partial<ChartConfig>): ECharts {}

// ✗ 4+ parametre
function createChart(el, type, data, theme, animated) {}
```

```typescript
// ✓ Guard clause — early return
function processUser(user: User | null): void {
  if (!user) return
  if (!user.isActive) return
  if (user.role !== 'admin') return
  // happy path
}
```

```typescript
// ✓ Object dispatch — switch yerine
const handlers: Record<AccentKey, () => void> = {
  cyan:    () => applyAccent(ACCENTS.cyan),
  magenta: () => applyAccent(ACCENTS.magenta),
  // ...
}
handlers[key]?.()
```

### Yasak Listesi
- `any` — açıklamasız kullanım yasak; `unknown` tercih et
- `var` — `const` default, `let` sadece yeniden atamada
- boş `catch` block — ya logla ya rethrow ya kullanıcı bildirimi
- `export default`
- `// TODO` olmayan yarım implementasyon
- 3+ seviye nesting — 3. seviyede fonksiyon çıkar
- `window.someGlobal = ...` — yeni global atama yasak (migrasyon sırasında eskiler korunabilir)

### Zorunlu Kurallar
- Dosya başına sorumluluk `@module` JSDoc
- Her `public` fonksiyona kısa JSDoc (ne yaptığı + parametreler)
- "Why" comment — obvious olmayan kararlar için satır üstü yorum
- `const` default, `let` sadece zorunluysa
- Named export only
- AbortController — her `fetch` çağrısına

### UI Direction Contracts (DEGİSTİRME)
Aşağıdaki yön/ikon kararları birçok kez düzeltilmiştir. Bir daha değiştirilmemeli:

**Sidebar Toggle Butonu** (`#wide-toggle-tb`):
- İkon: `ph-caret-right` (her zaman)
- Sidebar **kapalı** → ok sağa gösterir → "aç" anlamı
- Sidebar **açık** → CSS `rotate(180deg)` → ok sola döner → "kapat" anlamı
- Dosyalar: `sidebar.ts` (ensureToggleButton) + `_sidebar.scss` (body.wide-open)

**Sidebar Accordion Chevron** (`.ws-l1 .chevron`):
- İkon: `ph-caret-right` (her zaman)
- Grup **kapalı** → ok sağa
- Grup **açık** → CSS `rotate(90deg)` → ok aşağı
- Dosya: `sidebar.ts` (renderSidebar) + `_sidebar.scss` (.ws-l1.open .chevron)

**Kural:** İkon adını değiştirme. Yönü CSS transform ile kontrol et. `ph-caret-left` KULLANMA.

---

## 3. Hedef Klasör Yapısı

> NOT: Mevcut yapı (`src/app/`, `src/features/`, `src/shared/`) çalışır durumdadır.
> Aşağıdaki hedef yapı gelecek oturumlarda kademeli olarak uygulanacaktır.

```
src/
  core/
    types.ts              ← Global branded types, utility types, Result<T,E>
    error.ts              ← AppError sınıf hiyerarşisi
    storage.ts            ← Typed localStorage wrapper
    event-bus.ts          ← EventBus<TEvents> generic implementation

  app/
    bootstrap/
      appearance-init.ts  ← FOUC önleme
    shell/
      shell.orchestrator.ts  ← initShell() — sadece wiring, max 80 satır
      shell.types.ts         ← ShellContext, PageKey, MenuItem tipi
    config/
      navigation.config.ts   ← MENU, SIDEBAR_DATA sabitler (readonly)

  features/
    navigation/
      navigation.service.ts   ← getBasePath, getCurrentKey, tmResolveHref
      favorites.repository.ts ← localStorage I/O
      favorites.service.ts    ← iş mantığı
    sidebar/
      sidebar.builder.ts
    topbar/
      topbar.builder.ts
    spotlight/
      spotlight.controller.ts
    notifications/
      notification-panel.controller.ts
    tenant-switcher/
      tenant-switcher.controller.ts
    shortcuts/
      shortcuts.controller.ts
    toast/
      toast.service.ts
    logo-animation/
      logo-animation.ts

  appearance/
    appearance.types.ts
    appearance.presets.ts
    appearance.store.ts

  theme/
    theme.types.ts
    theme.presets.ts
    theme.store.ts

  charts/
    chart.types.ts
    chart.theme.ts
    chart.registry.ts
    chart.factory.ts
    chart.helpers.ts

  ui/
    alpine/
      stores/
        toast.store.ts
        confirm.store.ts
      components/
        wizard.component.ts
        tabs.component.ts
        data-table.component.ts
        form.component.ts
      auto-features/
        grid-fix.ts
        skeleton.ts

  mock/
    mock.types.ts
    keywords.mock.ts
    traffic.mock.ts
    index.ts

  shared/
    formatting/
      number-format.ts
      date-format.ts
      ui-fragments.ts
    utils/
      pagination.ts
      csv-export.ts
    types/
      index.ts
```

---

## 4. Mevcut Durum (2026-03-30)

### Tamamlanan İşler
- **TS Migration (Faz 0-1):** 8 JS dosyası → 39 TS dosyası, esbuild IIFE build, tsc strict 0 hata
- **SCSS Migration:** 4 CSS dosyası → 45 SCSS dosyası, Dart Sass build, 3 çıktı dosyası
- **Build Pipeline:** `npm run build` → CSS + TS birlikte derler
- **179 HTML sayfası değişmedi** — geriye dönük uyumluluk korundu

### Mevcut Yapı (Çalışır Durumda)
```
src/             → TypeScript kaynaklar (39 dosya, 5087 satır)
  app/           → shell orchestrator, stores, bootstrap
  features/      → Alpine components, auto-features
  shared/        → formatting, types
src/scss/        → SCSS kaynaklar (45 dosya, 3918 satır)
  core/          → reset, typography, animations
  tokens/        → color maps, spacing, z-index, motion
  shared/        → mixins, functions, placeholders
  features/      → shell, ui, spotlight, notifications, appearance
js/              → esbuild çıktısı (8 IIFE bundle)
css/             → Sass çıktısı (3 dosya + 1 stub)
```

---

## 5. Önemli Global Bağımlılıklar (Dokunma Listesi)

| Global | Kullanan | Kaldırma Fazı |
|---|---|---|
| `window.AppearanceStore` | Tüm sayfalar | Faz 5 |
| `window.ThemeStore` | settings-theme-options.html | Faz 5 |
| `window.initShell` | Tüm sayfalar | Faz 4 |
| `window.MOCK` | 18+ sayfa | Faz 3 |
| `window.fixGrids` | sidebar toggle | Faz 4 |

---

## 6. AI Çalışma Protokolü

### Her Büyük Değişiklik Öncesi 5 Soru

1. Bu değişikliğin sorumluluk sınırı ne?
2. Hangi dosyalar etkileniyor?
3. Public API (window.X) değişiyor mu?
4. Risk nedir?
5. Test edilmesi gereken senaryolar neler?

### Modül Dönüşüm Prompt Şablonu

```
AMAÇ: [ne isteniyor — tek cümle]
BAĞLAM: [dosya yolu, katman, bağımlılıklar]
SINIRLAR: [public API, geriye uyumluluk]
ÇIKTI: [patch | yeni dosya | tip tanımı]
KABUL KRİTERLERİ: [test senaryoları]
YASAKLAR: [Flowbite, window.global, any]
```

---

## 7. Tek Cümle Özet

> Alpine tabanlı hafif MVVM + modüler functional core + TypeScript interface-first design +
> AI'yı serbest kod yazarı değil, kısıtlı yardımcı mühendis olarak kullanmak.
> Her modül tek sorumluluk taşır; global'ler sadece migrasyon geçiş döneminde korunur.
