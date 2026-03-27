# atonota Frontend Modül Planı — Master Blueprint

> Enterprise-grade, modüler monolit mimari. Her modül bağımsız olarak aktif/pasif yapılabilir,
> ileride ayrı paket olarak çıkarılabilir (Drupal modülü, WP plugin, Shopify app gibi).
> Tek panel, rol bazlı görünürlük. Çoklu dil (TR, EN, DE, FR, ES).
> **Mobile-first design & coding.** Spotlight Search (Cmd+K / Ctrl+K).

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

### Mobile-First Tasarım Kuralları (Zorunlu)

```
0. MIN VIEWPORT: 320px (iPhone 5s/SE1). Yatay scroll ASLA olmaz.
   base.html'de html { min-width: 320px; overflow-x: hidden; } enforce edilir.

1. CSS: mobile-first yazılır — min-width media query (Tailwind default)
   DOGRU:  class="block md:flex lg:grid-cols-3"  (mobilden başla, büyüt)
   YANLIS: class="grid-cols-3 md:grid-cols-2 sm:block"  (desktop'tan küçült)

2. Layout: tek kolon mobile default, md: 2 kolon, lg: 3+ kolon
3. Touch target: min 44x44px (tüm tıklanabilir alanlar, WCAG 2.5.8)
4. Font-size: min 15px (base.html'de enforce). 320px'de 14px'e düşer.
5. Sidebar: mobile'da gizli, hamburger ile overlay açılır
6. Tablolar: mobile'da kart görünümüne dönüşür (.responsive-table class)
7. Modal/Overlay: mobile'da tam ekran (max-w yerine inset-0)
8. Formlar: input'lar w-full, butonlar w-full (mobile), inline (desktop)
9. Spacing: 320px p-2, mobile p-4, tablet p-6, desktop p-8
10. Spotlight Search: mobile'da tam ekran overlay, input auto-focus
11. Test: her modül 320px + 375px + 768px + 1280px viewport'ta test edilmeli
12. Overflow: img, video, iframe, table, pre, code → max-width: 100%
13. Grid: 320-374px arası grid TEK kolon zorunlu (grid-template-columns: 1fr)

BREAKPOINT HARİTASI (genişletilmiş — docs/CROSS_PLATFORM_COMPAT.md):
  xs:  320px  — iPhone 5s/SE1 (minimum)
  sm:  360px  — Galaxy S, Pixel, Redmi Note
  md:  480px  — iPhone Plus, Galaxy Ultra
  lg:  768px  — Tablet (iPad Mini)
  xl:  1024px — Tablet landscape / küçük laptop
  2xl: 1280px — Desktop (tam deneyim)
  3xl: 1536px — Wide desktop (16" Laptop)
  4xl: 1920px — Ultra-wide (27"+ Monitör)
```

### Cross-Platform Uyumluluk (Zorunlu)

> Detay: `docs/CROSS_PLATFORM_COMPAT.md`

- **Tarayıcı**: Tier 1 (Chrome 110+, Safari 16+, Firefox 115+, Edge 110+), Tier 2 (Chrome 90+, Safari 14+)
- **Viewport**: viewport-fit=cover, 100dvh, safe-area-inset-*, iOS input 16px zoom fix
- **PWA**: manifest.json, Service Worker, apple-mobile-web-app-capable, Capacitor-ready
- **A11y**: WCAG 2.1 AA, kontrast 4.5:1, focus outline korunur, prefers-reduced-motion
- **Performans**: 4G < 3s TTI, 3G < 5s, offline Service Worker cache
- **Görsel**: SVG ikon zorunlu, srcset+sizes, WebP, font-display: swap

### Ortak Pattern'ler

**HTMX**: Skeleton loading, cursor pagination, inline validation, periyodik yenileme, SSE streaming
**Alpine.js**: Modal, tab, dropdown, form state, toggle
**ECharts**: CDN, server'dan JSON config döner client render eder, mobile'da responsive resize

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
- **Amaç**: Keyword araştırma, sıralama takibi, site denetim, backlink, SERP, GEO+SEO birleşik tracking
- **AI**: Keyword intent sınıflandırma, topic clustering (pgvector), sıralama tahminleme, teknik SEO önceliklendirme, rekabet analizi özeti, AI citability skoru, AI Overview prediction (ML modeli), Türkçe morfoloji zekası (bitişken yapı: otel→oteller/otele/otelde)
- **GEO+SEO Birleşik** (P0 seviyesinde, ayrı modül değil):
  - 6 LLM platformu izleme (ChatGPT, Gemini, Perplexity, Copilot, Claude, Meta AI)
  - AI citasyon takibi + cite edilme olasılık skoru
  - Prompt araştırma (90M+ prompt database, DataForSEO)
  - AI Overview prediction — hangi sorguların AIO tetikleyeceğini tahmin
  - SERP feature tracking (featured snippets, PAA, AIO, knowledge panel)
- **Entity SEO**: Entity extraction, Knowledge Graph araçları, NER tabanlı entity ilişkileri
- **Veri Omurgası**: DataForSEO API (birincil — keyword, SERP, backlink, on-page)
- **Sayfalar**: /seo, /seo/keywords, /seo/keywords/{id}/cluster, /seo/rankings, /seo/audit, /seo/backlinks, /seo/serp, /seo/geo, /seo/geo/mentions, /seo/geo/prompts, /seo/geo/citability, /seo/entities, /seo/entities/{id}/graph
- **ECharts**: Line (sıralama trendi), bubble/force (kümeler), radar (SEO sağlık + GEO motor bazlı), heatmap (pozisyon dağılımı + sorgu×motor), treemap (kaynak), network graph (entity ilişkileri)
- **Roller**: SA/TO/TA/AN→tam, VW→salt okunur
- **Bağımlılık**: workspace-manager, adapter-registry

### 08. content-intelligence ⭐
- **Amaç**: İçerik skorlama, bozunma tespiti, semantik harita, gap analizi, schema markup ölçekte üretim, AI içerik tespiti, readability analizi
- **AI**: İçerik puanlama motoru, bozunma tahmini, embedding similarity haritası, schema markup önerisi, AI iyileştirme önerileri, AI content detection + ranking korelasyonu, readability analizi (20+ dil, Türkçe dahil)
- **Schema & Structured Data**:
  - JSON-LD generator (20+ schema tipi, görsel editör)
  - Rakip schema import (URL crawl ile)
  - Schema Aggregation Endpoint (tüm site entity'leri tek API'de)
  - Schema validasyon + zengin sonuç önizleme
- **llms.txt Generator**: Crawl → trafik/backlink/freshness analizi → llms.txt üretimi
- **Content Decay & Refresh**: Bozunma tespiti + yenileme workflow, öncelik sıralama
- **Orphaned Content Tespiti**: Crawler tabanlı link graph analizi, iç link'i olmayan sayfa tespiti
- **Bot Blocker Önerisi**: AI crawler yönetimi, robots.txt/CDN rule üreteci (öneri motoru — icra değil)
- **Sayfalar**: /content, /content/pages, /content/pages/{id}, /content/gaps, /content/decay, /content/semantic-map, /content/schema, /content/schema/generator, /content/schema/aggregation, /content/llms-txt, /content/orphaned, /content/readability, /content/ai-detection
- **ECharts**: Gauge (skor + readability), scatter (semantik harita), line (bozunma trendi), sankey (gap akışı), bar (AI content % vs ranking korelasyonu)
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

## P1 — ÖNEMLİ (16 Modül)

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
- **Amaç**: Derinlemesine GEO analizi — platform-spesifik optimizasyon, AI citasyon widget, prompt araştırma ileri seviye, sentiment analizi
- **Not**: Temel GEO+SEO birleşik tracking P0 seo-intelligence modülüne taşındı (gap analizindeki #1 fırsat). Bu modül ileri seviye GEO özellikleri için kalıyor.
- **AI**: TAMAMI AI — 6 LLM platformu derin analizi (ChatGPT, Gemini, Perplexity, Copilot, Claude, Meta AI), platform-spesifik optimizasyon (ChatGPT ansiklopedik, Perplexity güncellik), Brand Radar benzeri sentiment analizi, AI citasyon widget
- **Derinlik Özellikleri**:
  - Platform-spesifik content score (her LLM'in tercih ettiği içerik yapısına göre)
  - AI citasyon widget (site embed için)
  - Prompt araştırma ileri filtreler + trend analizi
  - GEO noktaçözüm konsolidasyonu (Profound, Evertune, Gauge, Otterly.ai gibi araçların sunduğu verileri tek panelde)
- **Sayfalar**: /geo, /geo/queries, /geo/mentions, /geo/competitors, /geo/recommendations, /geo/platforms, /geo/platforms/{id}, /geo/sentiment, /geo/citation-widget
- **ECharts**: Radar (motor bazlı), line (trend), heatmap (sorgu×motor), bar (rakip), gauge (platform-spesifik skor)
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
- **Amaç**: Rakip strateji analizi, pazar payı, erken uyarı, teknoloji profilleme
- **AI**: Haftalık rakip özeti, erken uyarı sistemi, AI SWOT otomatik üretimi, pazar payı tahmini
- **Ek Yetenekler**:
  - Teknoloji profilleme (BuiltWith API entegrasyonu — rakibin tech stack'i)
  - AI SWOT otomatik üretimi (SEO + GEO + içerik + teknik veriden)
  - Pazar payları tahmini (SimilarWeb benzeri clickstream analizi)
- **Sayfalar**: /competitors, /competitors/{id}, /competitors/compare, /competitors/alerts, /competitors/strategy, /competitors/{id}/tech-stack, /competitors/{id}/swot, /competitors/market-share
- **ECharts**: Radar (çoklu rakip), line (trend karşılaştırma), treemap, stacked bar (pazar payı), network (tech stack)
- **Bağımlılık**: seo-intelligence

### 21. entity-seo
- **Amaç**: Knowledge Graph araçları, entity extraction, entity ilişkileri, NER + graph DB
- **AI**: NER tabanlı entity çıkarma, entity ilişki haritası, Knowledge Graph optimizasyon önerileri, entity gap analizi
- **Sayfalar**: /entities, /entities/extract, /entities/{id}, /entities/graph, /entities/gaps, /entities/knowledge-panel
- **ECharts**: Network graph (entity ilişkileri), treemap (entity kategorileri), sankey (entity akışı)
- **Bağımlılık**: seo-intelligence, content-intelligence

### 22. schema-engine
- **Amaç**: Schema markup ölçekte üretim, 20+ schema tipi, JSON-LD editor, rakip schema import, Schema Aggregation Endpoint
- **AI**: URL crawl ile auto-populate, schema öneri motoru, rakip schema analizi, validasyon + zengin sonuç önizleme
- **Sayfalar**: /schema, /schema/generator, /schema/templates, /schema/{id}/edit, /schema/import, /schema/aggregation, /schema/validate
- **ECharts**: Bar (schema tipi dağılımı), gauge (schema sağlık skoru)
- **Bağımlılık**: content-intelligence

### 23. marketplace-seo
- **Amaç**: Trendyol/Hepsiburada/Amazon marketplace SEO (Turkiye ozel)
- **AI**: Marketplace keyword araştırma, ürün listeleme optimizasyonu, rakip ürün analizi, fiyat pozisyon önerisi
- **Sayfalar**: /marketplace, /marketplace/products, /marketplace/products/{id}, /marketplace/keywords, /marketplace/competitors, /marketplace/optimization
- **ECharts**: Line (ürün sıralama trendi), bar (kategori performans), radar (listeleme sağlık skoru)
- **Bağımlılık**: seo-intelligence

### 24. local-seo
- **Amaç**: Yerel dizin yönetimi, GBP monitor, map rank tracker, Türk dizinleri
- **AI**: Yerel sıralama tahmin, GBP optimizasyon önerileri, yerel rakip analizi, dizin tutarlılık skoru
- **Sayfalar**: /local, /local/locations, /local/locations/{id}, /local/rankings, /local/directories, /local/gbp, /local/reviews
- **ECharts**: Map (yerel sıralama grid), bar (dizin kapsam), line (review trend), gauge (NAP tutarlılık skoru)
- **Bağımlılık**: seo-intelligence

### 25. ad-orchestrator ⭐
- **Amaç**: Çok kanallı reklam kampanya yönetimi — Google Ads, Meta Ads, Microsoft Ads, TikTok Ads, LinkedIn Ads
- **AI**: Cross-channel bütçe optimizasyonu (AI spend shifting), performans anomali tespiti, bid strategy önerisi, audience overlap analizi
- **Sayfalar**: /ads, /ads/campaigns, /ads/campaigns/create, /ads/campaigns/{id}, /ads/adgroups, /ads/adgroups/{id}, /ads/creatives, /ads/budgets, /ads/connect
- **ECharts**: Line (spend/ROAS trend), stacked bar (platform bazlı harcama), sankey (conversion yolu), gauge (bütçe kullanımı)
- **Roller**: SA/TO/TA→tam, AN→salt okunur, VW→yok
- **Bağımlılık**: workspace-manager, adapter-registry
- **Veri Kaynağı**: Platform API'leri (Google Ads gRPC, Meta Marketing API, Microsoft Ads REST, TikTok Marketing API, LinkedIn Marketing API)
- **NOT**: MVP'de Unified.to middleware ile write, Faz 2'de direkt API. Queue-first mimari (platform başına ayrı kuyruk).

### 26. ad-reporting ⭐
- **Amaç**: Cross-platform reklam performans raporlama, attribution, white-label rapor
- **AI**: AI performans özeti, anomali açıklama, tahminleme (spend/ROAS forecast), doğal dil rapor
- **Sayfalar**: /ads/reports, /ads/reports/create, /ads/reports/{id}, /ads/reports/schedule, /ads/attribution
- **ECharts**: Heatmap (saat×gün performans), treemap (kampanya ağacı), multi-line (platform karşılaştırma), funnel (dönüşüm)
- **Roller**: SA/TO/TA/AN→tam, VW→sınırlı
- **Bağımlılık**: ad-orchestrator

### 27. ad-automation ⭐
- **Amaç**: Kural tabanlı reklam otomasyon motoru — if/then tetikleyiciler, otomatik bütçe kaydırma, alert
- **AI**: Predictive budget allocation, auto-pause underperforming ads, smart bidding önerisi, A/B test önerisi
- **Sayfalar**: /ads/rules, /ads/rules/create, /ads/rules/{id}, /ads/alerts, /ads/budget-optimizer
- **ECharts**: Timeline (kural tetiklenme geçmişi), before/after bar (optimizasyon etkisi)
- **Roller**: SA/TO/TA→tam, AN→salt okunur, VW→yok
- **Bağımlılık**: ad-orchestrator, ad-reporting

---

## P2 — GÜZELLEŞTİRİCİ (8 Modül)

### 28. pixel-intelligence
- Piksel sağlık kontrolü, gizlilik uyumluluk taraması

### 29. social-intelligence
- Sosyal medya duygu analizi, trend tespiti, rakip sosyal izleme

### 30. crm-intelligence
- Müşteri segmentasyonu, churn tahmini, CLV hesaplama

### 31. ecommerce-intelligence
- Ürün performans skoru, fiyat analizi, mevsimsellik tespiti

### 32. embedding-explorer
- pgvector embedding görselleştirme, 2D/3D scatter, küme keşfi

### 33. plugin-marketplace
- Topluluk modül kataloğu, yükleme/kaldırma, değerlendirme

### 34. api-explorer
- İnteraktif API dokümantasyonu, webhook yönetimi, kullanım istatistikleri

### 35. telemetry-dashboard
- Plugin check-in, platform sinyal izleme, sistem sağlığı (SA only)

---

## Uygulama Sırası

```
Faz 1 (Çerçeve):     auth → shell → settings → dashboard
Faz 2 (Yönetim):     tenant-manager → workspace-manager → adapter-registry → audit-log → notification-center
Faz 3 (Birincil AI): seo-intelligence (GEO+SEO dahil) → content-intelligence (schema+llms.txt dahil) → web-analytics
Faz 4 (İkincil AI):  performance → geo (ileri seviye) → competitive → security
Faz 5 (AI Katman):   ai-command → report-builder → insight-feed → embedding-explorer
Faz 6 (Ekosistem):   billing → plugin-marketplace → api-explorer → telemetry
Faz 7 (Dikey):       entity-seo → schema-engine → local-seo → marketplace-seo
Faz 8 (Reklam):      ad-orchestrator → ad-reporting → ad-automation
Faz 9 (Dikey 2):     social → crm → ecommerce → pixel
```

---

## Veri Sağlayıcı Katmanı (Data Provider Layer)

### Faz 1 — MVP Zorunlu

| Sağlayıcı | Rol | Maliyet |
|-----------|-----|---------|
| **DataForSEO API** | Birincil veri omurgası — keyword, SERP, backlink, on-page, prompt DB | Pay-as-you-go ($50 depozit) |
| **Google Search Console API** | Kullanıcının kendi performans verisi, BigQuery bulk export | Ucretsiz |
| **Google PageSpeed Insights API** | Core Web Vitals, Lighthouse verisi | Ucretsiz |

### Faz 2 — Rekabetcilik

| Sağlayıcı | Rol | Maliyet |
|-----------|-----|---------|
| **Moz API** | DA/PA metrikleri (sektor standardı) | $5/ay |
| **Majestic API** | Trust Flow/Citation Flow, 2006'ya kadar backlink gecmisi | $49.99/ay |
| **Google Natural Language API** | Entity extraction, sentiment analizi | Kullanıma gore |

### Faz 3+ — Ileri Aşama

| Sağlayıcı | Rol | Maliyet |
|-----------|-----|---------|
| **SimilarWeb API** | Rekabetci trafik analizi | $199/ay+ |
| **BuiltWith API** | Teknoloji profilleme (competitive-intelligence icin) | Ozel fiyat |
| **Common Crawl** | Ozel backlink indexi | $1K-10K+/ay compute |

### Reklam Platform API'leri

| Sağlayıcı | Rol | Not |
|-----------|-----|-----|
| **Google Ads API v23.2** | gRPC + REST, GAQL sorgu dili | Standard Access gerekli (Basic yetersiz) |
| **Meta Marketing API v25.0** | Kampanya CRUD, raporlama, webhook destekli | Score-based rate limit (BUC skoru) |
| **Microsoft Ads API v13** | REST, kampanya yönetimi | Google Ads Import API ile hızlı geçiş |
| **TikTok Marketing API** | Kampanya CRUD, raporlama, webhook destekli | 24 saat token ömrü, refresh zorunlu |
| **LinkedIn Marketing API** | Kampanya yönetimi, raporlama | Günlük limit, strict review süreci |
| **Unified.to** | Aggregator middleware — MVP faz | Read+write, zero data storage, Faz 2'de direkt API'ye geçiş |

### Tahmini Aylık Veri Maliyetleri

| Olcek | DataForSEO | Moz | Google APIs | Majestic | **Toplam** |
|-------|-----------|-----|------------|---------|------------|
| Startup (1K kullanıcı) | $200-500 | $20 | Ucretsiz | $100 | **$320-620** |
| Growth (10K kullanıcı) | $2,000-5,000 | $125 | Ucretsiz | $400 | **$2,525-5,525** |
| Scale (50K kullanıcı) | $10,000-25,000 | $500 | Ucretsiz | $400+ | **$10,900-25,900** |

---

## Stratejik Farklılastiriclar

| # | Farklılastirici | Neden Onemli |
|---|----------------|-------------|
| 1 | **Ilk AI-native GEO+SEO platform** | Rakipler (SEMrush, Ahrefs) GEO'yu eklenti olarak sunuyor — atonota'da P0 seviyesinde native |
| 2 | **Turkce/Arapca morfoloji zekası** | Hicbir global rakipte yok; bitisken dil yapisi (otel→oteller/otele/otelde) keyword gruplama ve icerik analizinde islenmiyor |
| 3 | **Yerel para birimi fiyatlandirma** | TRY/SAR/AED secenegi hicbir global rakipte yok; Turkiye/MENA satin alma gucuyle 3-5x fiyat avantaji |
| 4 | **White-label multi-tenant** | P0'da native mimari (tenant-manager + workspace-manager); rakiplerde ya yok ya Enterprise kilidi |
| 5 | **SEO-to-revenue atif zinciri** | HubSpot'un en guclu yani — CRM entegrasyonu (HubSpot, Salesforce, Pipedrive) ile organik arama→gelir native takibi |

---

## Modul Sayıları

| Oncelik | Modul Sayısı | Toplam Sayfa |
|---------|-------------|-------------|
| P0 | 11 (zenginlestirildi) | ~55 |
| P1 | 16 (+3 reklam modulu) | ~70 |
| P2 | 8 (yeniden numaralandirildi: 28-35) | ~25 |
| **TOPLAM** | **35** | **~150** |
