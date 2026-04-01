/**
 * navigation-config.ts
 * Responsibility: Static navigation data constants — MENU groups, SIDEBAR_DATA tree,
 * KEY_MAP for legacy key remapping. These are the single source of truth for all
 * shell navigation rendering (rail, sidebar, spotlight, mobile menu).
 */

import type { MenuGroup, SidebarSection } from '../../shared/types';

// ── Rail + Topbar menu groups ──────────────────────────

export const MENU: readonly MenuGroup[] = [
  { group: 'SEO & GEO', items: [
    { key: 'seo',         icon: 'ph-trend-up',              title: 'SEO',        href: 'pages/seo.html' },
    { key: 'geo',         icon: 'ph-globe-hemisphere-west', title: 'GEO / AI',   href: 'pages/geo.html' },
  ]},
  { group: 'ANALIZ', items: [
    { key: 'content',     icon: 'ph-article',               title: 'Icerik',     href: 'pages/content.html' },
    { key: 'ads',         icon: 'ph-broadcast',             title: 'Reklamlar',  href: 'pages/ads.html' },
    { key: 'analytics',   icon: 'ph-chart-line',            title: 'Analitik',   href: 'pages/analytics.html' },
  ]},
  { group: 'KESIF', items: [
    { key: 'competitor',  icon: 'ph-binoculars',            title: 'Rakip',      href: 'pages/competitors.html' },
    { key: 'local',       icon: 'ph-map-pin',               title: 'Local',      href: 'pages/local.html' },
    { key: 'performance', icon: 'ph-gauge',                 title: 'Performans', href: 'pages/performance.html' },
  ]},
  { group: 'ZEKA', items: [
    { key: 'insights',    icon: 'ph-lightbulb',             title: 'Insights',   href: 'pages/insights.html' },
    { key: 'reports',     icon: 'ph-clipboard-text',        title: 'Raporlar',   href: 'pages/reports.html' },
  ]},
] as const;

// ── Sidebar data: keys match MENU items ──────────────────────────
// Format per child string: "Label|badge|href"

export const SIDEBAR_DATA: Readonly<Record<string, readonly SidebarSection[]>> = {
  seo: [
    { l: 'Anahtar Kelime', ch: ['Keyword Magic||seo-keyword-magic.html','Arastirma||seo-keywords.html','Cluster||seo-cluster.html','Organik Arastirma||seo-organic-research.html'] },
    { l: 'Siralama', ch: ['Pozisyon Takibi||seo-position-tracker.html','SERP Ozellikleri||seo-serp.html','Rankings||seo-rankings.html'] },
    { l: 'Teknik SEO', ch: ['Site Denetimi||seo-audit.html','On-Page Checker||seo-onpage-checker.html','Toplu Analiz||seo-batch-analysis.html','SEO Checklist||seo-checklist-manager.html'] },
    { l: 'Baglanti', ch: ['Backlink|47|seo-backlinks.html','Backlink Denetimi||seo-backlink-audit.html','Backlink Gap||seo-backlink-gap.html','Link Kesisim||seo-link-intersect.html'] },
    { l: 'Entity SEO', ch: ['Entity Hub||seo-entities.html','Entity Graph||seo-entities-graph.html','Entity Extract||entities-extract.html','Entity Gaps||entities-gaps.html','Knowledge Panel||entities-knowledge-panel.html'] },
    { l: 'Marketplace SEO', ch: ['Marketplace Hub||marketplace.html','Urunler||marketplace-products.html','Keyword||marketplace-keywords.html','Rakipler||marketplace-competitors.html','Optimizasyon||marketplace-optimization.html'] },
  ],
  content: [
    { l: 'Kesif', ch: ['Content Explorer||content-explorer.html','Konu Arastirma||content-topic-research.html','Yazim Asistani||content-writing-assistant.html','Icerik Sablonu||content-template.html'] },
    { l: 'Analiz', ch: ['Sayfa Listesi||content-pages.html','Bozunma||content-decay.html','Gap Analizi||content-gaps.html','Readability||content-readability.html','AI Detection||content-ai-detection.html'] },
    { l: 'Schema Markup', ch: ['Schema Hub||content-schema.html','Schema Aggregation||content-schema-aggregation.html','Generator||schema-generator.html','Sablonlar||schema-templates.html','Import||schema-import.html','Validate||schema-validate.html'] },
    { l: 'Harita', ch: ['Semantik Harita||content-semantic.html','Orphaned Icerik||content-orphaned.html','llms.txt||content-llmstxt.html'] },
  ],
  ads: [
    { l: 'Kampanyalar', ch: ['Tum Kampanyalar|8|ads-campaigns.html','Kampanya Olustur||ads-campaign-create.html','Reklam Gruplari||ads-adgroups.html'] },
    { l: 'Platformlar', ch: ['Meta (FB+IG)|3|ads-meta.html','TikTok|2|ads-tiktok.html','LinkedIn||ads-linkedin.html','Pinterest||ads-pinterest.html','Snapchat||ads-snapchat.html','WhatsApp||ads-whatsapp.html'] },
    { l: 'Optimizasyon', ch: ['Butce Yonetimi||ads-budgets.html','AI Optimizer||ads-budget-optimizer.html','Hedef Kitle||ads-audiences.html','Kreatifler||ads-creatives.html','Attribution||ads-attribution.html'] },
    { l: 'Kurallar', ch: ['Kural Motoru||ads-rules.html','Uyarilar|1|ads-alerts.html'] },
    { l: 'Raporlar', ch: ['Performans||ads-reports.html','Rapor Olustur||ads-report-create.html','Sablonlar||ads-report-templates.html','Zamanlama||ads-report-schedule.html','Rakip Reklam||ads-competitor-research.html'] },
    { l: 'Hesap', ch: ['Bagli Hesaplar||ads-accounts.html','Token Durumu||ads-tokens.html'] },
  ],
  analytics: [
    { l: 'Trafik', ch: ['Trafik Detay||analytics-traffic.html','Gercek Zamanli||analytics-realtime.html'] },
    { l: 'Analiz', ch: ['Huni Analizi||analytics-funnels.html','Segmentler||analytics-segments.html','AI Sorgu||analytics-query.html'] },
  ],
  geo: [
    { l: 'GEO', ch: ['GEO Dashboard||seo-geo.html','AI Mention||seo-geo-mentions.html','Prompt Arastirma||seo-geo-prompts.html','Citability||seo-geo-citability.html','Sorgular||geo-queries.html','Sentiment||geo-sentiment.html','Rakipler||geo-competitors.html','Platformlar||geo-platforms.html','Oneriler||geo-recommendations.html','Citation Widget||geo-citation-widget.html','AI Checklist||geo-ai-checklist.html'] },
    { l: 'GEO Araclar', ch: ['AI Yanit Simulatoru||geo-response-simulator.html','llms.txt Yonetici||geo-llmstxt.html','Schema Olusturucu||geo-schema-generator.html','FAQ Optimizatoru||geo-faq-optimizer.html','GEO A/B Test||geo-ab-testing.html'] },
    { l: 'GEO Analitik', ch: ['Bot Crawl Analitik||geo-bot-analytics.html','E-E-A-T Analizor||geo-eeat-score.html','Earned Media||geo-earned-media.html'] },
    { l: 'AI', ch: ['AI Chat||ai.html','Brand Radar||ai-brand-radar.html','AI Digests||ai-digests.html'] },
  ],
  competitor: [
    { l: 'Analiz', ch: ['Karsilastirma||competitor-compare.html','SWOT (AI)||competitor-swot.html','Strateji||competitor-strategy.html','Pazar Payi||competitor-marketshare.html','Tech Stack||competitor-techstack.html','Uyarilar||competitor-alerts.html'] },
  ],
  local: [
    { l: 'Lokasyon', ch: ['Lokasyonlar||local-locations.html','GBP Yonetimi||local-gbp.html','Local Rankings||local-rankings.html','Yorum Yonetimi||local-reviews.html','Dizin Listesi||local-directories.html'] },
  ],
  performance: [
    { l: 'Araclar', ch: ['LCP / INP / CLS||performance-vitals.html','Hiz Testi||performance-speed.html','Uptime||performance-uptime.html','Oneriler||performance-recommendations.html'] },
    { l: 'Guvenlik', ch: ['Guvenlik Dashboard||security.html','Zafiyet Raporu||security-vulnerabilities.html','SSL Sertifika||security-ssl.html','HTTP Headers||security-headers.html','Compliance||security-compliance.html'] },
  ],
  insights: [
    { l: 'Feed', ch: ['AI Feed||insights-feed.html','Digest Arsivi||insights-digests.html'] },
    { l: 'Tercihler', ch: ['Insight Tercihleri||insights-preferences.html'] },
  ],
  reports: [
    { l: 'Raporlar', ch: ['Yeni Rapor||report-create.html','Rapor Detay||report-detail.html'] },
    { l: 'Yonetim', ch: ['Sablonlar||report-templates.html','Zamanlama||report-schedule.html'] },
  ],
  settings: [
    { l: 'Tema', ch: ['Tema Secenekleri||settings-theme-options.html'] },
    { l: 'Erisim', ch: ['Erisilebilirlik||settings-accessibility.html'] },
    { l: 'Hesap', ch: ['Profil||settings-profile.html','Guvenlik||settings-security.html','Bildirim Tercihleri||settings-notifications-prefs.html'] },
    { l: 'Sistem', ch: ['API Anahtarlari||settings-apikeys.html','Webhook||settings-webhooks.html','Tenant Ayarlari||settings-tenant-settings.html'] },
    { l: 'Altyapi', ch: ['Adaptorler||adapters.html','Adaptor Baglanti||adapter-connect.html','Adaptor Health||adapter-health.html','Tenantlar||tenants.html','Tenant Olustur||tenant-create.html','Workspaceler||workspaces.html','Workspace Olustur||workspace-create.html'] },
    { l: 'Faturalandirma', ch: ['Planlar||billing-plans.html','Faturalar||billing-invoices.html','Odeme Yontemleri||billing-payment-methods.html','Kullanim||billing-usage.html'] },
    { l: 'Bildirimler', ch: ['Tum Bildirimler|7|notifications.html','Bildirim Kurallari||notification-rules.html','Kural Olustur||notification-rule-create.html'] },
    { l: 'Audit Log', ch: ['Tum Olaylar||audit.html'] },
  ],
};

// ── Legacy key remapping ──────────────────────────

export const KEY_MAP: Readonly<Record<string, string>> = {
  yonetim: 'settings',
  ai: 'geo',
};

// ── Sidebar sections hidden from sidebar rendering ──────────────────────────

export const SIDEBAR_HIDDEN: readonly string[] = ['dashboard'];
