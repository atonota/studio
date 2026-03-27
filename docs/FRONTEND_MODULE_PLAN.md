# atonota Frontend Modül Planı — Master Blueprint

> Enterprise-grade, modüler monolit mimari. Her modül bağımsız olarak aktif/pasif yapılabilir,
> ileride ayrı paket olarak çıkarılabilir (Drupal modülü, WP plugin, Shopify app gibi).
> Tek panel, rol bazlı görünürlük. Çoklu dil (TR, EN, DE, FR, ES).

---

## Mimari Temeller

### Dosya Konvansiyonu (Her Modül)

```
studio/
  app/api/v1/modules/{slug}/
    __init__.py
    routes.py              <- FastAPI router (sayfa + partial endpoint)
    schemas.py             <- Pydantic v2 request/response
  app/models/{slug}/       <- SQLAlchemy modelleri
  app/services/{slug}/     <- İş mantığı
  app/tasks/{slug}/        <- Celery task'ları
  templates/modules/{slug}/
    pages/                 <- Tam sayfa Jinja2
    partials/              <- HTMX partial HTML
    components/            <- Yeniden kullanılabilir UI
```

### Rol Matrisi

| Kod | Rol | Açıklama |
|-----|-----|----------|
| SA | Studio Admin | Platform sahibi, her şeyi görür |
| TO | Tenant Owner | Tenant sahibi, kendi tenant'ının her şeyini görür |
| TA | Tenant Admin | Yönetici, konfig + kullanıcı yönetimi |
| AN | Analyst | Analiz + rapor, yazma sınırlı |
| VW | Viewer | Salt okunur |

### Ortak Pattern'ler

**HTMX**: Skeleton loading, cursor pagination, inline validation, periyodik yenileme, SSE streaming
**Alpine.js**: Modal, tab, dropdown, form state, toggle
**ECharts**: CDN, server'dan JSON config döner client render eder

---

## P0 — MVP ZORUNLU (11 Modül)

### 01. auth
- **Amaç**: Kimlik doğrulama, oturum, 2FA
- **AI**: Oturum anomali tespiti
- **Sayfalar**: login, register, forgot-password, reset-password, two-factor
- **ECharts**: —
- **Roller**: Public
- **Bağımlılık**: —

### 02. shell
- **Amaç**: Uygulama kabuğu — sidebar, topbar, breadcrumb, Cmd+K global arama
- **AI**: Rol bazlı dinamik menü
- **Sayfalar**: Sidebar nav, workspace switcher, bildirim badge, dil seçici
- **ECharts**: —
- **Roller**: Tümü (menü içeriği role göre değişir)
- **Bağımlılık**: auth

### 03. dashboard
- **Amaç**: Ana panel — KPI, son aktiviteler, AI günlük brief
- **AI**: "Bugün dikkat edilecek 3 şey" insight kartı, anomali özeti, trend okları
- **Sayfalar**: / (ana dashboard), /dashboard/workspace/{uid}
- **ECharts**: Mini sparkline, doughnut, stacked area
- **Roller**: SA→platform KPI, TO/TA/AN→tenant KPI, VW→sınırlı
- **Bağımlılık**: shell, workspace-manager

### 04. tenant-manager
- **Amaç**: Tenant CRUD, kullanıcı davet, rol atama
- **AI**: Tenant sağlık skoru, onboarding takibi
- **Sayfalar**: /tenants, /tenants/{uid}, /tenants/{uid}/users, /tenants/create
- **ECharts**: —
- **Roller**: SA→tümü, TO→kendi tenant, TA→sınırlı, AN/VW→yok
- **Bağımlılık**: auth, shell

### 05. workspace-manager
- **Amaç**: Workspace (site) CRUD, platform seçimi, adaptör bağlantısı
- **AI**: Platform otomatik algılama (URL analizi), workspace sağlık skoru
- **Sayfalar**: /workspaces, /workspaces/{uid}, /workspaces/create
- **ECharts**: —
- **Roller**: SA/TO/TA→CRUD, AN/VW→salt okunur
- **Bağımlılık**: tenant-manager

### 06. adapter-registry
- **Amaç**: 83+ platform adaptör kataloğu, bağlantı durumu, health check
- **AI**: Bağlantı kesinti pattern tespiti, credential süre uyarısı
- **Sayfalar**: /adapters, /adapters/{uid}, /adapters/connect, /adapters/health
- **ECharts**: Status timeline, latency chart
- **Roller**: SA/TO/TA→bağlantı yönetimi, AN→salt okunur, VW→yok
- **Bağımlılık**: workspace-manager

### 07. seo-intelligence ⭐
- **Amaç**: Keyword araştırma, sıralama takibi, site denetim, backlink, SERP
- **AI**: Keyword intent sınıflandırma, topic clustering (pgvector), sıralama tahminleme, teknik SEO önceliklendirme, rekabet analizi özeti
- **Sayfalar**: /seo, /seo/keywords, /seo/keywords/{id}/cluster, /seo/rankings, /seo/audit, /seo/backlinks, /seo/serp
- **ECharts**: Line (sıralama trendi), bubble/force (kümeler), radar (SEO sağlık), heatmap (pozisyon dağılımı), treemap (kaynak)
- **Roller**: SA/TO/TA/AN→tam, VW→salt okunur
- **Bağımlılık**: workspace-manager, adapter-registry

### 08. content-intelligence ⭐
- **Amaç**: İçerik skorlama, bozunma tespiti, semantik harita, gap analizi
- **AI**: İçerik puanlama motoru, bozunma tahmini, embedding similarity haritası, schema markup önerisi, AI iyileştirme önerileri
- **Sayfalar**: /content, /content/pages, /content/pages/{id}, /content/gaps, /content/decay, /content/semantic-map
- **ECharts**: Gauge (skor), scatter (semantik harita), line (bozunma trendi), sankey (gap akışı)
- **Roller**: SA/TO/TA/AN→tam, VW→salt okunur (AI öneri isteyemez)
- **Bağımlılık**: seo-intelligence

### 09. settings
- **Amaç**: Profil, güvenlik, bildirim tercihleri, API anahtarı, dil, tema, webhook
- **Sayfalar**: /settings/profile, /security, /notifications, /api-keys, /appearance, /tenant, /webhooks
- **ECharts**: —
- **Roller**: Tümü (bölüm bazlı kısıtlama)
- **Bağımlılık**: auth, shell

### 10. notification-center
- **Amaç**: In-app bildirim paneli, SSE real-time, anomali uyarıları, özel kural tanımlama
- **AI**: AI anomali algılama bildirimleri, kurala dayalı uyarılar, digest özetleri
- **Sayfalar**: /notifications, /notifications/rules, /notifications/rules/create
- **HTMX**: SSE bağlantısı `hx-ext="sse"`, periyodik badge yenileme
- **Roller**: SA/TO/TA/AN→tam, VW→salt okunur
- **Bağımlılık**: auth, shell

### 11. audit-log
- **Amaç**: Append-only kritik işlem logu, compliance
- **AI**: Davranış anomali tespiti, log özeti
- **Sayfalar**: /audit, /audit/{event_uid}
- **ECharts**: Timeline (işlem yoğunluğu), bar (action dağılımı)
- **Roller**: SA→tümü, TO/TA→kendi tenant, AN/VW→yok
- **Bağımlılık**: auth, shell

---

## P1 — ÖNEMLİ (9 Modül)

### 12. billing
- **Amaç**: Plan seçimi, fatura, ödeme yöntemi, upgrade/downgrade, kullanım kotası
- **AI**: Plan önerisi, kullanım tahmini, fatura anomali
- **Sayfalar**: /billing, /billing/plans, /billing/invoices, /billing/payment-methods, /billing/usage
- **ECharts**: Area (kullanım trendi), gauge (kota), bar (aylık fatura)
- **Bağımlılık**: tenant-manager

### 13. web-analytics
- **Amaç**: Trafik analizi, segment keşfi, dönüşüm hunisi, Text-to-SQL
- **AI**: Doğal dil sorgulama, AI segment keşfi, anomali açıklama, AI chatbot referral ayrıştırma
- **Sayfalar**: /analytics, /analytics/traffic, /analytics/funnels, /analytics/segments, /analytics/query, /analytics/realtime
- **ECharts**: Line/area (trafik), pie (kaynak), funnel, world map, sankey (akış)
- **Bağımlılık**: workspace-manager

### 14. performance-intelligence
- **Amaç**: Core Web Vitals, uptime, hız optimizasyon
- **AI**: CWV anomali tespiti, optimizasyon önceliklendirme, performans tahmin
- **Sayfalar**: /performance, /performance/vitals, /performance/uptime, /performance/speed, /performance/recommendations
- **ECharts**: Gauge (CWV skor), line (trend), stacked bar (yükleme aşamaları)
- **Bağımlılık**: workspace-manager

### 15. geo-intelligence ⭐
- **Amaç**: AI arama motorlarında görünürlük takibi (GEO)
- **AI**: TAMAMI AI — ChatGPT/Gemini/Perplexity/Copilot'ta marka izleme, duygu analizi, citation tracking
- **Sayfalar**: /geo, /geo/queries, /geo/mentions, /geo/competitors, /geo/recommendations
- **ECharts**: Radar (motor bazlı), line (trend), heatmap (sorgu×motor), bar (rakip)
- **Bağımlılık**: seo-intelligence

### 16. report-builder ⭐
- **Amaç**: AI destekli rapor oluşturma, şablon, PDF/HTML export, zamanlama, white-label
- **AI**: Doğal dil ile rapor tanımlama, AI otomatik yorum, şablon sistemi
- **Sayfalar**: /reports, /reports/create, /reports/{id}, /reports/templates, /reports/schedule
- **HTMX**: SSE ile rapor oluşturma streaming, drag-drop bölüm sırası
- **Bağımlılık**: tüm intelligence modülleri (veri kaynağı)

### 17. insight-feed ⭐
- **Amaç**: AI tarafından üretilen otomatik insight akışı — günlük/haftalık özetler, anomali açıklamaları
- **AI**: TAMAMI AI çıktısı — insan müdahalesi olmadan metrikler analiz edilir, kart halinde sunulur
- **Sayfalar**: /insights, /insights/{id}, /insights/digests, /insights/preferences
- **HTMX**: Infinite scroll, SSE streaming
- **Bağımlılık**: tüm intelligence modülleri

### 18. ai-command ⭐
- **Amaç**: AI sohbet arayüzü — doğal dil ile platform verilerine soru sorma, cross-module sorgu
- **AI**: Text-to-SQL, cross-module analiz, instructor + anthropic/openai backend
- **Sayfalar**: /ai (tam sayfa), Cmd+J slide-over panel (her sayfada)
- **HTMX**: SSE streaming AI yanıt, dinamik grafik render
- **Bağımlılık**: tüm modüller (veri erişimi)

### 19. security-intelligence
- **Amaç**: Güvenlik açığı tarama, uyumluluk kontrolü, SSL, HTTP header analizi
- **AI**: Risk önceliklendirme, uyumluluk raporu otomatik oluşturma, konfig önerisi
- **Sayfalar**: /security, /security/vulnerabilities, /security/compliance, /security/headers, /security/ssl
- **ECharts**: Gauge (güvenlik skor), doughnut (severity), timeline
- **Bağımlılık**: workspace-manager

### 20. competitive-intelligence
- **Amaç**: Rakip strateji analizi, pazar payı, erken uyarı
- **AI**: Haftalık rakip özeti, erken uyarı sistemi, SWOT otomatik üretimi
- **Sayfalar**: /competitors, /competitors/{id}, /competitors/compare, /competitors/alerts, /competitors/strategy
- **ECharts**: Radar (çoklu rakip), line (trend karşılaştırma), treemap
- **Bağımlılık**: seo-intelligence

---

## P2 — GÜZELLEŞTİRİCİ (8 Modül)

### 21. pixel-intelligence
- Piksel sağlık kontrolü, gizlilik uyumluluk taraması

### 22. social-intelligence
- Sosyal medya duygu analizi, trend tespiti, rakip sosyal izleme

### 23. crm-intelligence
- Müşteri segmentasyonu, churn tahmini, CLV hesaplama

### 24. ecommerce-intelligence
- Ürün performans skoru, fiyat analizi, mevsimsellik tespiti

### 25. embedding-explorer
- pgvector embedding görselleştirme, 2D/3D scatter, küme keşfi

### 26. plugin-marketplace
- Topluluk modül kataloğu, yükleme/kaldırma, değerlendirme

### 27. api-explorer
- İnteraktif API dokümantasyonu, webhook yönetimi, kullanım istatistikleri

### 28. telemetry-dashboard
- Plugin check-in, platform sinyal izleme, sistem sağlığı (SA only)

---

## Uygulama Sırası

```
Faz 1 (Çerçeve):     auth → shell → settings → dashboard
Faz 2 (Yönetim):     tenant-manager → workspace-manager → adapter-registry → audit-log → notification-center
Faz 3 (Birincil AI): seo-intelligence → content-intelligence → web-analytics
Faz 4 (İkincil AI):  performance → geo → competitive → security
Faz 5 (AI Katman):   ai-command → report-builder → insight-feed → embedding-explorer
Faz 6 (Ekosistem):   billing → plugin-marketplace → api-explorer → telemetry
Faz 7 (Dikey):       social → crm → ecommerce → pixel
```

---

## Modül Sayıları

| Öncelik | Modül Sayısı | Toplam Sayfa |
|---------|-------------|-------------|
| P0 | 11 | ~45 |
| P1 | 9 | ~40 |
| P2 | 8 | ~25 |
| **TOPLAM** | **28** | **~110** |
