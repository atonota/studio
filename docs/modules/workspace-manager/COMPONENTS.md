# Module 05: workspace-manager — COMPONENTS

> Her component Jinja2 macro + Alpine.js x-data ile tanimlanir.
> Flowbite Pro CDN + Tailwind CDN + Phosphor Icons CDN kullanilir.

---

## 1. WorkspaceCard

Workspace grid gorunumunde her site icin bir kart.

```
Dosya     : templates/modules/workspace/components/workspace-card.html
Jinja2    : {% macro workspace_card(workspace) %}
Boyut     : max-w-sm (384px) x auto (~240px)
```

### Jinja2 Macro Parametreleri

```python
workspace: WorkspaceResponse
  .uid             : UUID
  .name            : str
  .url             : str
  .platform_id     : str
  .platform_version: str | None
  .health_score    : int | None
  .status          : str           # "active" | "pending" | "paused" | "error"
  .favicon_url     : str | None
  .updated_at      : datetime
```

### Alpine.js State

```javascript
x-data="{
    showMenu: false,
    confirmDelete: false
}"
```

### Aksiyonlar

| Aksiyon | Tetikleyici | Davranis |
|---------|-------------|----------|
| Karta tikla | `@click` (kart body) | `window.location = '/workspaces/${uid}'` |
| Menu ac | `@click.stop` (3-dot icon) | `showMenu = !showMenu` |
| Duzenle | Menu item | `window.location = '/workspaces/${uid}?edit=true'` |
| Sil | Menu item | `confirmDelete = true` (modal tetikle) |
| Duraklat | Menu item | `hx-post` -> status degistir |

### Tailwind Siniflari

```
Kart container : bg-white border border-gray-200 rounded-lg shadow-sm
                 hover:shadow-md transition-shadow duration-200 p-5
                 dark:bg-gray-800 dark:border-gray-700 cursor-pointer
Favicon        : w-8 h-8 rounded-full object-cover
Site adi       : text-lg font-semibold text-gray-900 dark:text-white truncate
URL            : text-sm text-gray-500 dark:text-gray-400 truncate
Skor bar       : h-2 rounded-full bg-gray-200 dark:bg-gray-700
Skor dolgu     : h-2 rounded-full (renk: health_score'a gore)
3-dot menu     : p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
```

---

## 2. WorkspaceTable

Workspace liste gorunumunde satir bazli tablo.

```
Dosya     : templates/modules/workspace/components/workspace-table.html
Jinja2    : {% macro workspace_table(workspaces, cursor) %}
```

### Alpine.js State

```javascript
x-data="{
    selectedIds: [],
    selectAll: false,
    toggleAll() {
        if (this.selectAll) {
            this.selectedIds = [];
        } else {
            this.selectedIds = this.$refs.table
                .querySelectorAll('[data-uid]')
                .values()
                .map(el => el.dataset.uid);
        }
        this.selectAll = !this.selectAll;
    },
    isSelected(uid) {
        return this.selectedIds.includes(uid);
    },
    toggleRow(uid) {
        const idx = this.selectedIds.indexOf(uid);
        if (idx > -1) this.selectedIds.splice(idx, 1);
        else this.selectedIds.push(uid);
    }
}"
```

### Kolon Yapisi

| Kolon | Genislik | Icerik |
|-------|----------|--------|
| Checkbox | w-4 | `<input type="checkbox">` |
| Site | flex-1 | Favicon + ad + URL |
| Platform | w-32 | PlatformBadge component |
| Skor | w-20 | Sayi + renk gostergesi |
| Durum | w-24 | StatusBadge component |
| Son Guncelleme | w-32 | Relative zaman (Alpine.js) |
| Aksiyonlar | w-16 | 3-dot menu |

---

## 3. CreateForm

Workspace olusturma formu. URL girisinde platform oto-tespiti yapar.

```
Dosya     : templates/modules/workspace/components/create-form.html
Jinja2    : {% macro create_form(platforms) %}
```

### Alpine.js State

```javascript
x-data="{
    url: '',
    name: '',
    platformId: '',
    platformVersion: '',
    detecting: false,
    detected: null,
    error: null,
    async detectPlatform() {
        if (!this.url) return;
        this.detecting = true;
        this.detected = null;
        this.error = null;
        // HTMX handles the actual request, this tracks local state
    },
    acceptDetection() {
        if (this.detected) {
            this.platformId = this.detected.platform_id;
            this.platformVersion = this.detected.version || '';
        }
    }
}"
```

### Form Alanlari

| Alan | Tip | Validasyon | HTMX |
|------|-----|-----------|------|
| URL | `input[type=url]` | required, valid URL | `@blur -> detectPlatform()` |
| Ad | `input[type=text]` | required, max 255 | - |
| Platform | `select` | required | oto-tespit sonrasi on secili |
| Platform Versiyon | `input[type=text]` | optional | oto-tespit ile dolabilir |

---

## 4. PlatformDetector

URL'den platform tespit sonucunu gosteren inline feedback bileşeni.

```
Dosya     : templates/modules/workspace/components/platform-detector.html
Jinja2    : {% macro platform_detector() %}
```

### Durumlar

| Durum | Gorunum |
|-------|---------|
| idle | Goruntulenmez (`x-show="false"`) |
| detecting | Spinner + "Platform tespit ediliyor..." |
| success | Yesil kutu: platform adi + versiyon + guven orani + sinyaller |
| error | Sari kutu: uyari mesaji + "Manuel secin" linki |
| timeout | Kirmizi kutu: "Site erisilemedi" |

### Tailwind Durum Siniflari

```
success : bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20
error   : bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20
timeout : bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20
```

---

## 5. AdapterStatusBadge

Tek bir adaptorun baglanti durumunu gosteren badge.

```
Dosya     : templates/modules/workspace/components/adapter-status-badge.html
Jinja2    : {% macro adapter_status_badge(adapter) %}
```

### Varyantlar

| Durum | Renk | Ikon | Label |
|-------|------|------|-------|
| connected | green-100/green-800 | `ph-check-circle` | Bagli |
| disconnected | gray-100/gray-800 | `ph-x-circle` | Bagli Degil |
| error | red-100/red-800 | `ph-warning` | Hata |
| checking | blue-100/blue-800 | `ph-spinner` (animate-spin) | Kontrol |

---

## 6. HealthScoreGauge

ECharts gauge widget ile saglik skoru gosterimi.

```
Dosya     : templates/modules/workspace/components/health-score-gauge.html
Jinja2    : {% macro health_score_gauge(score, size="md") %}
```

### Boyut Varyantlari

| Varyant | size param | Container | ECharts |
|---------|------------|-----------|---------|
| sm | "sm" | w-20 h-20 | 80x80px |
| md | "md" | w-40 h-40 | 160x160px |
| lg | "lg" | w-60 h-60 | 240x240px |

### ECharts Konfigurasyonu

```javascript
// Inline <script> tag icinde (bundler yok)
const gauge = echarts.init(document.getElementById('health-gauge-{{ uid }}'));
gauge.setOption({
    series: [{
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
            lineStyle: {
                width: 12,
                color: [
                    [0.4, '#EF4444'],   // red-500
                    [0.7, '#F59E0B'],   // amber-500
                    [1.0, '#10B981']    // emerald-500
                ]
            }
        },
        pointer: { width: 4 },
        detail: {
            fontSize: {{ '16' if size == 'sm' else '28' if size == 'md' else '36' }},
            fontWeight: 'bold',
            formatter: '{value}'
        },
        data: [{ value: {{ score if score is not none else 0 }} }]
    }]
});
// Responsive
window.addEventListener('resize', () => gauge.resize());
```

---

## 7. OnboardingChecklist

Yeni workspace icin tamamlanmasi gereken adim listesi.

```
Dosya     : templates/modules/workspace/components/onboarding-checklist.html
Jinja2    : {% macro onboarding_checklist(checklist) %}
```

### Jinja2 Parametreleri

```python
checklist: OnboardingChecklist
  .total_steps    : int
  .completed      : int
  .steps          : list[OnboardingStep]

OnboardingStep:
  .id             : str
  .title          : str
  .description    : str
  .completed      : bool
  .action_url     : str | None   # tamamlama icin yonlendirme
  .action_label   : str | None   # buton metni
```

### Alpine.js State

```javascript
x-data="{
    expanded: true,
    get progress() {
        return Math.round(({{ checklist.completed }} / {{ checklist.total_steps }}) * 100);
    }
}"
```

### Gorunum

```
Tamamlanmis adim  : line-through text-gray-400 + ph-check-circle (green)
Bekleyen adim     : text-gray-900 + ph-circle (gray) + [Aksiyon Butonu]
Progress bar      : h-2 bg-gray-200 rounded-full, dolgu bg-primary-600
                    genislik: style="width: {{ progress }}%"
```
