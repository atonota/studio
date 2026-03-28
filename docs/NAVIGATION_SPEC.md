# NAVIGATION_SPEC.md — atonota Studio Navigation Restructuring

> Tek kaynak: Navigasyon yapisi. Rail + Sidebar + Content-Area kurallari.
> Son guncelleme: 2026-03-28

---

## 1. Rail (Ana Navigasyon - 8 Ogesi)

| # | Key | Icon | Label | Href |
|---|-----|------|-------|------|
| 1 | dashboard | ph-squares-four | Dashboard | index.html |
| 2 | yonetim | ph-buildings | Yonetim | pages/tenants.html |
| 3 | seo | ph-chart-line-up | SEO | pages/seo.html |
| 4 | content | ph-article | Icerik | pages/content.html |
| 5 | ads | ph-megaphone | Reklamlar | pages/ads.html |
| 6 | analytics | ph-chart-bar | Analitik | pages/analytics.html |
| 7 | ai | ph-robot | AI & Rapor | pages/ai.html |
| 8 | settings | ph-gear | Ayarlar | pages/settings.html |

---

## 2. Sidebar Yapisi (Rail Key Bazinda)

Her rail key icin L1 gruplari ve L2 ogeleri asagida tanimlanmistir.
Format: `Label | Badge | Href`

---

### 2.1 dashboard

**Overview**
- Platform Ozeti | | index.html
- KPI Takibi | | index.html

**Aktivite**
- Son Degisiklikler | | audit.html
- Bildirimler | 7 | notifications.html

---

### 2.2 yonetim

**Tenant**
- Tum Tenantlar | 12 | tenants.html
- Yeni Olustur | | tenant-create.html

**Workspace**
- Tum Workspaceler | | workspaces.html
- Yeni Ekle | | workspace-create.html

**Adaptorler**
- Tum Platformlar | 83+ | adapters.html
- Health Dashboard | | adapter-health.html

---

### 2.3 seo

**Anahtar Kelime**
- Arastirma | | seo-keywords.html
- Keyword Magic | | seo-keyword-magic.html
- Cluster | | seo-cluster.html

**Siralama**
- Pozisyon Takibi | | seo-position-tracker.html
- SERP Ozellikleri | | seo-serp.html
- Organik Arastirma | | seo-organic-research.html

**GEO**
- GEO Dashboard | | seo-geo.html
- AI Mention | | seo-geo-mentions.html
- Prompt Arastirma | | seo-geo-prompts.html
- Citability | | seo-geo-citability.html

**Teknik**
- Site Denetimi | | seo-audit.html
- On-Page Checker | | seo-onpage-checker.html
- Backlink | 47 | seo-backlinks.html
- Toplu Analiz | | seo-batch-analysis.html

**Entity SEO**
- Entity Hub | | entities.html
- Knowledge Graph | | seo-entities.html

**Marketplace SEO**
- Marketplace Hub | | marketplace.html

**Local SEO**
- Local Dashboard | | local.html

---

### 2.4 content

**Analiz**
- Sayfa Listesi | | content-pages.html
- Content Explorer | | content-explorer.html
- Gap Analizi | | content-gaps.html
- Bozunma | | content-decay.html

**Schema Markup**
- Schema Hub | | schema.html
- Schema Markup | | content-schema.html

**Uretim**
- SEO Yazim Asistani | | content-writing-assistant.html
- Konu Arastirma | | content-topic-research.html
- llms.txt | | content-llmstxt.html

**Harita**
- Semantik Harita | | content-semantic.html
- Orphaned Icerik | | content-orphaned.html
- Readability | | content-readability.html

---

### 2.5 ads

**Kampanyalar**
- Tum Kampanyalar | 8 | ads.html
- Reklam Gruplari | | ads-adgroups.html
- Kreatifler | | ads-creatives.html

**Platformlar**
- Meta (FB+IG) | 3 | ads-meta.html
- TikTok | 2 | ads-tiktok.html
- LinkedIn | | ads-linkedin.html

**Otomasyon**
- Kural Motoru | | ads-rules.html
- Butce Yonetimi | | ads-budgets.html
- AI Optimizer | | ads-budget-optimizer.html
- Uyarilar | 1 | ads-alerts.html

**Raporlar**
- Performans | | ads-reports.html
- Attribution | | ads-attribution.html

**Hesap**
- Bagli Hesaplar | | ads-accounts.html
- Token Durumu | | ads-tokens.html

---

### 2.6 analytics

**Trafik**
- Genel Bakis | | analytics.html
- Trafik Detay | | analytics-traffic.html
- Huni Analizi | | analytics-funnels.html
- Segmentler | | analytics-segments.html

**Performans**
- CWV Dashboard | | performance.html
- LCP/INP/CLS | | performance-vitals.html
- Uptime | | performance-uptime.html
- Hiz Testi | | performance-speed.html

**Guvenlik**
- Guvenlik Dashboard | | security.html
- Zafiyet Raporu | | security-vulnerabilities.html
- SSL Sertifika | | security-ssl.html

**Rakip Analizi**
- Rakip Listesi | | competitors.html
- Karsilastirma | | competitor-compare.html
- SWOT (AI) | | competitor-swot.html
- Pazar Payi | | competitor-marketshare.html

**AI Sorgu**
- Dogal Dil Sorgu | | analytics-query.html
- Gercek Zamanli | | analytics-realtime.html

---

### 2.7 ai

**AI Chat**
- Yeni Sohbet | | ai.html
- Brand Radar | | ai-brand-radar.html

**Insight Feed**
- Tum Insightlar | | insights.html
- Anomaliler | | insights-feed.html
- Digest Arsivi | | insights-digests.html

**Raporlar**
- Tum Raporlar | | reports.html
- Sablonlar | | report-templates.html
- Zamanlama | | report-schedule.html

---

### 2.8 settings

**Hesap**
- Profil | | settings-profile.html
- Guvenlik | | settings-security.html
- Bildirim Tercihleri | | settings-notifications-prefs.html
- Gorunum | | settings-appearance.html

**Sistem**
- API Anahtarlari | | settings-apikeys.html
- Webhook | | settings-webhooks.html

**Faturalandirma**
- Planlar | | billing-plans.html

**Bildirimler**
- Tum Bildirimler | 7 | notifications.html
- Bildirim Kurallari | | notification-rules.html

**Audit Log**
- Tum Olaylar | | audit.html

---

## 3. Content-Area Links

Asagidaki sayfalar sidebar'da yer almaz; ust sayfalarin icerik alanindan erisilir.

```
tenant-detail.html             — accessed from: tenants.html (tablo satirina tikla)
workspace-detail.html          — accessed from: workspaces.html (tablo satirina tikla)
workspace-create.html          — accessed from: workspaces.html (Yeni Ekle butonu)
adapter-detail.html            — accessed from: adapters.html (adaptor kartina tikla)
adapter-connect.html           — accessed from: adapter-detail.html (Baglanti Kur butonu)
dashboard-workspace.html       — accessed from: index.html (workspace kartina tikla)
seo-audit-detail.html          — accessed from: seo-audit.html (denetim satirina tikla)
seo-rankings.html              — accessed from: seo-position-tracker.html (detay butonu)
seo-backlink-audit.html        — accessed from: seo-backlinks.html (Backlink Audit butonu)
seo-backlink-gap.html          — accessed from: seo-backlinks.html (Gap Analizi butonu)
seo-link-intersect.html        — accessed from: seo-backlinks.html (Link Intersect butonu)
seo-entities-graph.html        — accessed from: seo-entities.html (Graf Gorsellestirme butonu)
entities-detail.html           — accessed from: entities.html (entity satirina tikla)
entities-graph.html            — accessed from: entities.html (Graf Gorunumu butonu)
entities-extract.html          — accessed from: entities.html (Entity Cikar butonu)
entities-gaps.html             — accessed from: entities.html (Entity Gap butonu)
entities-knowledge-panel.html  — accessed from: entities-detail.html (Knowledge Panel butonu)
marketplace-detail.html        — accessed from: marketplace.html (urun satirina tikla)
marketplace-products.html      — accessed from: marketplace.html (Urunler tab'i)
marketplace-keywords.html      — accessed from: marketplace.html (Anahtar Kelimeler tab'i)
marketplace-competitors.html   — accessed from: marketplace.html (Rakipler tab'i)
marketplace-optimization.html  — accessed from: marketplace.html (Optimizasyon tab'i)
local-detail.html              — accessed from: local.html (konum satirina tikla)
local-locations.html           — accessed from: local.html (Konumlar tab'i)
local-rankings.html            — accessed from: local.html (Siralamalar tab'i)
local-gbp.html                 — accessed from: local.html (Google Business tab'i)
local-directories.html         — accessed from: local.html (Dizinler tab'i)
local-reviews.html             — accessed from: local.html (Yorumlar tab'i)
geo.html                       — accessed from: seo-geo.html (GEO detay butonu)
geo-queries.html               — accessed from: geo.html (Sorgular tab'i)
geo-mentions.html              — accessed from: geo.html (Bahsetmeler tab'i)
geo-competitors.html           — accessed from: geo.html (Rakipler tab'i)
geo-recommendations.html       — accessed from: geo.html (Oneriler tab'i)
geo-platforms.html             — accessed from: geo.html (Platformlar tab'i)
geo-sentiment.html             — accessed from: geo.html (Duygu Analizi tab'i)
geo-citation-widget.html       — accessed from: seo-geo-citability.html (Widget Detay butonu)
content-detail.html            — accessed from: content-pages.html (sayfa satirina tikla)
content-template.html          — accessed from: content-writing-assistant.html (Sablon Sec butonu)
content-ai-detection.html      — accessed from: content-detail.html (AI Tespit butonu)
content-schema-generator.html  — accessed from: content-schema.html (Schema Olustur butonu)
content-schema-aggregation.html — accessed from: content-schema.html (Toplu Schema butonu)
schema-detail.html             — accessed from: schema.html (schema satirina tikla)
schema-aggregation.html        — accessed from: schema.html (Toplu Islem butonu)
schema-generator.html          — accessed from: schema.html (Yeni Olustur butonu)
schema-templates.html          — accessed from: schema.html (Sablonlar butonu)
schema-import.html             — accessed from: schema.html (Iceri Aktar butonu)
schema-validate.html           — accessed from: schema.html (Dogrula butonu)
ads-campaign-detail.html       — accessed from: ads.html (kampanya satirina tikla)
ads-campaign-create.html       — accessed from: ads.html (Yeni Kampanya butonu)
ads-campaigns.html             — accessed from: ads.html (Tum Kampanyalar filtre)
ads-rule-detail.html           — accessed from: ads-rules.html (kural satirina tikla)
ads-rules-create.html          — accessed from: ads-rules.html (Yeni Kural butonu)
ads-report-detail.html         — accessed from: ads-reports.html (rapor satirina tikla)
ads-report-create.html         — accessed from: ads-reports.html (Yeni Rapor butonu)
ads-report-templates.html      — accessed from: ads-reports.html (Sablonlar butonu)
ads-report-schedule.html       — accessed from: ads-reports.html (Zamanlama butonu)
ads-platforms.html             — accessed from: ads.html (Platform Detay butonu)
ads-audiences.html             — accessed from: ads-campaign-detail.html (Hedef Kitle butonu)
ads-competitor-research.html   — accessed from: ads.html (Rakip Arastirma butonu)
ads-pinterest.html             — accessed from: ads-platforms.html (Pinterest karti)
ads-snapchat.html              — accessed from: ads-platforms.html (Snapchat karti)
ads-whatsapp.html              — accessed from: ads-platforms.html (WhatsApp karti)
analytics-traffic.html         — accessed from: analytics.html (Trafik Detay butonu)
performance-vitals.html        — accessed from: performance.html (CWV detay butonu)
performance-recommendations.html — accessed from: performance.html (Oneriler butonu)
security-compliance.html       — accessed from: security.html (Uyumluluk butonu)
security-headers.html          — accessed from: security.html (Basliklar butonu)
competitor-detail.html         — accessed from: competitors.html (rakip satirina tikla)
competitor-alerts.html         — accessed from: competitors.html (Uyarilar butonu)
competitor-techstack.html      — accessed from: competitor-detail.html (Teknoloji Yigini tab'i)
competitor-strategy.html       — accessed from: competitor-detail.html (Strateji tab'i)
insights-detail.html           — accessed from: insights.html (insight satirina tikla)
insights-preferences.html      — accessed from: insights.html (Tercihler butonu)
report-detail.html             — accessed from: reports.html (rapor satirina tikla)
report-create.html             — accessed from: reports.html (Yeni Rapor butonu)
ai-digests.html                — accessed from: insights-digests.html (digest detay tikla)
audit-detail.html              — accessed from: audit.html (olay satirina tikla)
notification-rule-create.html  — accessed from: notification-rules.html (Yeni Kural butonu)
settings-tenant-settings.html  — accessed from: settings.html (Tenant Ayarlari butonu)
billing.html                   — accessed from: billing-plans.html (Faturalandirma genel)
billing-usage.html             — accessed from: billing.html (Kullanim tab'i)
billing-payment-methods.html   — accessed from: billing.html (Odeme Yontemleri tab'i)
billing-invoices.html          — accessed from: billing.html (Faturalar tab'i)
auth-login.html                — accessed from: — (giris sayfasi, shell yok)
auth-register.html             — accessed from: — (kayit sayfasi, shell yok)
auth-forgot.html               — accessed from: auth-login.html (Sifremi Unuttum linki)
auth-reset-password.html       — accessed from: auth-forgot.html (e-posta linki)
auth-two-factor.html           — accessed from: auth-login.html (2FA dogrulama adimi)
```

---

## 4. Sidebar vs Content-Area Kurallari

### Sidebar'a Eklenir
- Hub sayfalari (listeleme/ana gorunum): `tenants.html`, `seo.html`, `ads.html`, vb.
- Liste sayfalari: `content-pages.html`, `competitors.html`, `reports.html`
- Arac sayfalari (sik erisilen): `seo-keyword-magic.html`, `analytics-query.html`, `ads-budget-optimizer.html`
- Olusturma kisa yollari: `tenant-create.html`, `workspace-create.html`

### Content-Area'dan Erisim
- Detay sayfalari: `tenant-detail.html`, `competitor-detail.html`, `ads-campaign-detail.html`
- Olusturma/duzenleme formlari: `ads-campaign-create.html`, `ads-rules-create.html`, `report-create.html`
- Drill-down gorunumleri: `seo-audit-detail.html`, `entities-knowledge-panel.html`
- Alt-araclar: `seo-backlink-audit.html`, `schema-validate.html`, `content-ai-detection.html`
- Tab-tabanli alt sayfalar: `marketplace-products.html`, `local-rankings.html`, `geo-queries.html`

### Genel Kurallar
1. Sidebar en fazla 3 seviye derinliginde olmalidir (Rail > L1 Grup > L2 Oge).
2. Bir sayfanin sidebar'da gorulmesi = sik erisim ihtiyaci anlamina gelir.
3. Content-area baglantilari her zaman bir parent sayfaya bagimlidir; breadcrumb ile geri donus saglanir.
4. Auth sayfalari (`auth-*`) shell disindadir, ne rail ne sidebar icerir.
5. Badge degerleri canli API verisinden beslenir; statik degerler sadece placeholder'dir.
6. `_template.html` navigasyona dahil degildir (gelistirici sablonu).
