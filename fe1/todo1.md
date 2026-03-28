# fe1 — Multi-Page Frontend Prototype

> 16 sayfa + master shell + 3 CSS + 3 JS
> http://localhost:8002

---

## Dosya Yapisi ✅

```
fe1/
├── index.html           ← Dashboard (3 ECharts)
├── css/
│   ├── tokens.css       ← Master CSS (tokens, layout, shell, responsive, a11y)
│   └── components.css   ← Reusable component classes
├── js/
│   ├── shell.js         ← Master nav (topbar, rail, sidebar, footer, spotlight, dropdown)
│   ├── charts.js        ← ECharts factory (7 chart type builder)
│   └── utils.js         ← Helpers (format, badge, statCard)
└── pages/ (15 sayfa)
    ├── tenants.html      ├── seo.html         ├── performance.html
    ├── workspaces.html   ├── content.html     ├── security.html
    ├── adapters.html     ├── ads.html         ├── competitors.html
    ├── analytics.html    ├── reports.html     ├── audit.html
    ├── notifications.html├── ai.html          └── settings.html
```

## Tamamlanan (16/16 sayfa) ✅

### GENEL
- [x] Dashboard — 4 KPI, traffic line, sources doughnut, daily bar, AI brief, activity feed
- [x] Tenant — r-table (4 tenant, saglik skoru, plan badge)
- [x] Workspace — 3 kart (WordPress, Shopify, +yeni)
- [x] Adaptorler — 4 KPI + 6 platform kart

### ANALIZ
- [x] SEO — radar chart, ranking trend (ters Y), keyword tablosu
- [x] Icerik — skor tablosu + schema stats + llms.txt
- [x] Reklamlar — Meta/TikTok/LinkedIn kartlari + treemap butce
- [x] Analitik — 4 KPI + stacked area + top pages + AI sorgu
- [x] Performans — CWV kartlari + dual-Y trend chart
- [x] Guvenlik — SSL + header + KVKK grid
- [x] Rakipler — 3 rakip karti

### SISTEM
- [x] Raporlar — 3 rapor karti (PDF/HTML)
- [x] Bildirimler — 3 bildirim karti (oncelik renk kodlu)
- [x] Audit Log — filtre + olay tablosu
- [x] AI Asistan — chat UI (user + AI bubble)
- [x] Ayarlar — tema, dil, 2FA, API

## Shell (paylasilan) ✅
- [x] Topbar (logo, brand, wide-toggle, Cmd+K search, notif, tema, avatar)
- [x] Rail (3 grup: Genel/Analiz/Sistem, 16 link)
- [x] Wide Sidebar (dinamik L1/L2 menu)
- [x] Footer (stat bar)
- [x] Spotlight Search (Cmd+K / Ctrl+K)
- [x] User Dropdown (spotlight pattern blur)
- [x] Dark/Light tema (localStorage persist)

*Tum sayfalar tamamlandi. Navigasyon calisiyor.*
