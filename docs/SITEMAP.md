# SITEMAP.md — atonota Studio Tam Sayfa Haritasi

> Tum HTML sayfalari, rail key eslemesi, sidebar grubu ve erisim yontemi.
> Son guncelleme: 2026-03-28

---

## Erisim Aciklamasi

- **sidebar**: Sidebar'dan dogrudan erisilebilir
- **content-area**: Ust sayfanin icerik alanindan erisilebilir
- **no-shell**: Auth sayfalari, shell/navigasyon icermez

---

## Sayfa Tablosu (174 sayfa)

| # | Dosya | Rail Key | Sidebar Grubu | Erisim | Parent |
|---|-------|----------|--------------|--------|--------|
| 1 | index.html | dashboard | Overview | sidebar | — |
| 2 | dashboard-workspace.html | dashboard | — | content-area | index.html |
| 3 | tenants.html | yonetim | Tenant | sidebar | — |
| 4 | tenant-create.html | yonetim | Tenant | sidebar | — |
| 5 | tenant-detail.html | yonetim | — | content-area | tenants.html |
| 6 | workspaces.html | yonetim | Workspace | sidebar | — |
| 7 | workspace-create.html | yonetim | Workspace | sidebar | — |
| 8 | workspace-detail.html | yonetim | — | content-area | workspaces.html |
| 9 | adapters.html | yonetim | Adaptorler | sidebar | — |
| 10 | adapter-health.html | yonetim | Adaptorler | sidebar | — |
| 11 | adapter-detail.html | yonetim | — | content-area | adapters.html |
| 12 | adapter-connect.html | yonetim | — | content-area | adapter-detail.html |
| 13 | seo.html | seo | — | sidebar | — |
| 14 | seo-keywords.html | seo | Anahtar Kelime | sidebar | — |
| 15 | seo-keyword-magic.html | seo | Anahtar Kelime | sidebar | — |
| 16 | seo-cluster.html | seo | Anahtar Kelime | sidebar | — |
| 17 | seo-position-tracker.html | seo | Siralama | sidebar | — |
| 18 | seo-serp.html | seo | Siralama | sidebar | — |
| 19 | seo-organic-research.html | seo | Siralama | sidebar | — |
| 20 | seo-rankings.html | seo | — | content-area | seo-position-tracker.html |
| 21 | seo-geo.html | seo | GEO | sidebar | — |
| 22 | seo-geo-mentions.html | seo | GEO | sidebar | — |
| 23 | seo-geo-prompts.html | seo | GEO | sidebar | — |
| 24 | seo-geo-citability.html | seo | GEO | sidebar | — |
| 25 | seo-audit.html | seo | Teknik | sidebar | — |
| 26 | seo-audit-detail.html | seo | — | content-area | seo-audit.html |
| 27 | seo-onpage-checker.html | seo | Teknik | sidebar | — |
| 28 | seo-backlinks.html | seo | Teknik | sidebar | — |
| 29 | seo-backlink-audit.html | seo | — | content-area | seo-backlinks.html |
| 30 | seo-backlink-gap.html | seo | — | content-area | seo-backlinks.html |
| 31 | seo-link-intersect.html | seo | — | content-area | seo-backlinks.html |
| 32 | seo-batch-analysis.html | seo | Teknik | sidebar | — |
| 33 | seo-entities.html | seo | Entity SEO | sidebar | — |
| 34 | seo-entities-graph.html | seo | — | content-area | seo-entities.html |
| 35 | entities.html | seo | Entity SEO | sidebar | — |
| 36 | entities-detail.html | seo | — | content-area | entities.html |
| 37 | entities-graph.html | seo | — | content-area | entities.html |
| 38 | entities-extract.html | seo | — | content-area | entities.html |
| 39 | entities-gaps.html | seo | — | content-area | entities.html |
| 40 | entities-knowledge-panel.html | seo | — | content-area | entities-detail.html |
| 41 | marketplace.html | seo | Marketplace SEO | sidebar | — |
| 42 | marketplace-detail.html | seo | — | content-area | marketplace.html |
| 43 | marketplace-products.html | seo | — | content-area | marketplace.html |
| 44 | marketplace-keywords.html | seo | — | content-area | marketplace.html |
| 45 | marketplace-competitors.html | seo | — | content-area | marketplace.html |
| 46 | marketplace-optimization.html | seo | — | content-area | marketplace.html |
| 47 | local.html | seo | Local SEO | sidebar | — |
| 48 | local-detail.html | seo | — | content-area | local.html |
| 49 | local-locations.html | seo | — | content-area | local.html |
| 50 | local-rankings.html | seo | — | content-area | local.html |
| 51 | local-gbp.html | seo | — | content-area | local.html |
| 52 | local-directories.html | seo | — | content-area | local.html |
| 53 | local-reviews.html | seo | — | content-area | local.html |
| 54 | geo.html | seo | — | content-area | seo-geo.html |
| 55 | geo-queries.html | seo | — | content-area | geo.html |
| 56 | geo-mentions.html | seo | — | content-area | geo.html |
| 57 | geo-competitors.html | seo | — | content-area | geo.html |
| 58 | geo-recommendations.html | seo | — | content-area | geo.html |
| 59 | geo-platforms.html | seo | — | content-area | geo.html |
| 60 | geo-sentiment.html | seo | — | content-area | geo.html |
| 61 | geo-citation-widget.html | seo | — | content-area | seo-geo-citability.html |
| 62 | content.html | content | — | sidebar | — |
| 63 | content-pages.html | content | Analiz | sidebar | — |
| 64 | content-explorer.html | content | Analiz | sidebar | — |
| 65 | content-gaps.html | content | Analiz | sidebar | — |
| 66 | content-decay.html | content | Analiz | sidebar | — |
| 67 | content-detail.html | content | — | content-area | content-pages.html |
| 68 | content-ai-detection.html | content | — | content-area | content-detail.html |
| 69 | schema.html | content | Schema Markup | sidebar | — |
| 70 | content-schema.html | content | Schema Markup | sidebar | — |
| 71 | content-schema-generator.html | content | — | content-area | content-schema.html |
| 72 | content-schema-aggregation.html | content | — | content-area | content-schema.html |
| 73 | schema-detail.html | content | — | content-area | schema.html |
| 74 | schema-aggregation.html | content | — | content-area | schema.html |
| 75 | schema-generator.html | content | — | content-area | schema.html |
| 76 | schema-templates.html | content | — | content-area | schema.html |
| 77 | schema-import.html | content | — | content-area | schema.html |
| 78 | schema-validate.html | content | — | content-area | schema.html |
| 79 | content-writing-assistant.html | content | Uretim | sidebar | — |
| 80 | content-topic-research.html | content | Uretim | sidebar | — |
| 81 | content-llmstxt.html | content | Uretim | sidebar | — |
| 82 | content-template.html | content | — | content-area | content-writing-assistant.html |
| 83 | content-semantic.html | content | Harita | sidebar | — |
| 84 | content-orphaned.html | content | Harita | sidebar | — |
| 85 | content-readability.html | content | Harita | sidebar | — |
| 86 | ads.html | ads | Kampanyalar | sidebar | — |
| 87 | ads-adgroups.html | ads | Kampanyalar | sidebar | — |
| 88 | ads-creatives.html | ads | Kampanyalar | sidebar | — |
| 89 | ads-campaigns.html | ads | — | content-area | ads.html |
| 90 | ads-campaign-detail.html | ads | — | content-area | ads.html |
| 91 | ads-campaign-create.html | ads | — | content-area | ads.html |
| 92 | ads-meta.html | ads | Platformlar | sidebar | — |
| 93 | ads-tiktok.html | ads | Platformlar | sidebar | — |
| 94 | ads-linkedin.html | ads | Platformlar | sidebar | — |
| 95 | ads-pinterest.html | ads | — | content-area | ads-platforms.html |
| 96 | ads-snapchat.html | ads | — | content-area | ads-platforms.html |
| 97 | ads-whatsapp.html | ads | — | content-area | ads-platforms.html |
| 98 | ads-platforms.html | ads | — | content-area | ads.html |
| 99 | ads-rules.html | ads | Otomasyon | sidebar | — |
| 100 | ads-budgets.html | ads | Otomasyon | sidebar | — |
| 101 | ads-budget-optimizer.html | ads | Otomasyon | sidebar | — |
| 102 | ads-alerts.html | ads | Otomasyon | sidebar | — |
| 103 | ads-rule-detail.html | ads | — | content-area | ads-rules.html |
| 104 | ads-rules-create.html | ads | — | content-area | ads-rules.html |
| 105 | ads-reports.html | ads | Raporlar | sidebar | — |
| 106 | ads-attribution.html | ads | Raporlar | sidebar | — |
| 107 | ads-report-detail.html | ads | — | content-area | ads-reports.html |
| 108 | ads-report-create.html | ads | — | content-area | ads-reports.html |
| 109 | ads-report-templates.html | ads | — | content-area | ads-reports.html |
| 110 | ads-report-schedule.html | ads | — | content-area | ads-reports.html |
| 111 | ads-accounts.html | ads | Hesap | sidebar | — |
| 112 | ads-tokens.html | ads | Hesap | sidebar | — |
| 113 | ads-audiences.html | ads | — | content-area | ads-campaign-detail.html |
| 114 | ads-competitor-research.html | ads | — | content-area | ads.html |
| 115 | analytics.html | analytics | Trafik | sidebar | — |
| 116 | analytics-traffic.html | analytics | Trafik | sidebar | — |
| 117 | analytics-funnels.html | analytics | Trafik | sidebar | — |
| 118 | analytics-segments.html | analytics | Trafik | sidebar | — |
| 119 | performance.html | analytics | Performans | sidebar | — |
| 120 | performance-vitals.html | analytics | — | content-area | performance.html |
| 121 | performance-uptime.html | analytics | Performans | sidebar | — |
| 122 | performance-speed.html | analytics | Performans | sidebar | — |
| 123 | performance-recommendations.html | analytics | — | content-area | performance.html |
| 124 | security.html | analytics | Guvenlik | sidebar | — |
| 125 | security-vulnerabilities.html | analytics | Guvenlik | sidebar | — |
| 126 | security-ssl.html | analytics | Guvenlik | sidebar | — |
| 127 | security-compliance.html | analytics | — | content-area | security.html |
| 128 | security-headers.html | analytics | — | content-area | security.html |
| 129 | competitors.html | analytics | Rakip Analizi | sidebar | — |
| 130 | competitor-compare.html | analytics | Rakip Analizi | sidebar | — |
| 131 | competitor-swot.html | analytics | Rakip Analizi | sidebar | — |
| 132 | competitor-marketshare.html | analytics | Rakip Analizi | sidebar | — |
| 133 | competitor-detail.html | analytics | — | content-area | competitors.html |
| 134 | competitor-alerts.html | analytics | — | content-area | competitors.html |
| 135 | competitor-techstack.html | analytics | — | content-area | competitor-detail.html |
| 136 | competitor-strategy.html | analytics | — | content-area | competitor-detail.html |
| 137 | analytics-query.html | analytics | AI Sorgu | sidebar | — |
| 138 | analytics-realtime.html | analytics | AI Sorgu | sidebar | — |
| 139 | ai.html | ai | AI Chat | sidebar | — |
| 140 | ai-brand-radar.html | ai | AI Chat | sidebar | — |
| 141 | ai-digests.html | ai | — | content-area | insights-digests.html |
| 142 | insights.html | ai | Insight Feed | sidebar | — |
| 143 | insights-feed.html | ai | Insight Feed | sidebar | — |
| 144 | insights-digests.html | ai | Insight Feed | sidebar | — |
| 145 | insights-detail.html | ai | — | content-area | insights.html |
| 146 | insights-preferences.html | ai | — | content-area | insights.html |
| 147 | reports.html | ai | Raporlar | sidebar | — |
| 148 | report-templates.html | ai | Raporlar | sidebar | — |
| 149 | report-schedule.html | ai | Raporlar | sidebar | — |
| 150 | report-detail.html | ai | — | content-area | reports.html |
| 151 | report-create.html | ai | — | content-area | reports.html |
| 152 | settings.html | settings | — | sidebar | — |
| 153 | settings-profile.html | settings | Hesap | sidebar | — |
| 154 | settings-security.html | settings | Hesap | sidebar | — |
| 155 | settings-notifications-prefs.html | settings | Hesap | sidebar | — |
| 156 | settings-appearance.html | settings | Hesap | sidebar | — |
| 157 | settings-apikeys.html | settings | Sistem | sidebar | — |
| 158 | settings-webhooks.html | settings | Sistem | sidebar | — |
| 159 | settings-tenant-settings.html | settings | — | content-area | settings.html |
| 160 | billing-plans.html | settings | Faturalandirma | sidebar | — |
| 161 | billing.html | settings | — | content-area | billing-plans.html |
| 162 | billing-usage.html | settings | — | content-area | billing.html |
| 163 | billing-payment-methods.html | settings | — | content-area | billing.html |
| 164 | billing-invoices.html | settings | — | content-area | billing.html |
| 165 | notifications.html | settings | Bildirimler | sidebar | — |
| 166 | notification-rules.html | settings | Bildirimler | sidebar | — |
| 167 | notification-rule-create.html | settings | — | content-area | notification-rules.html |
| 168 | audit.html | settings | Audit Log | sidebar | — |
| 169 | audit-detail.html | settings | — | content-area | audit.html |
| 170 | auth-login.html | auth | — | no-shell | — |
| 171 | auth-register.html | auth | — | no-shell | — |
| 172 | auth-forgot.html | auth | — | no-shell | auth-login.html |
| 173 | auth-reset-password.html | auth | — | no-shell | auth-forgot.html |
| 174 | auth-two-factor.html | auth | — | no-shell | auth-login.html |

---

## Ozet Istatistikler

| Rail Key | Sidebar | Content-Area | No-Shell | Toplam |
|----------|---------|-------------|----------|--------|
| dashboard | 1 | 1 | — | 2 |
| yonetim | 7 | 5 | — | 12 |
| seo | 18 | 31 | — | 49 |
| content | 13 | 11 | — | 24 |
| ads | 12 | 17 | — | 29 |
| analytics | 16 | 8 | — | 24 |
| ai | 8 | 5 | — | 13 |
| settings | 10 | 6 | — | 16 |
| auth | — | — | 5 | 5 |
| **Toplam** | **85** | **84** | **5** | **174** |

---

## Notlar

- `_template.html` gelistirici sablonudur, sayfa haritasina dahil degildir.
- Tum `pages/` dizinindeki dosyalar tabloda dosya adi ile gosterilmistir (prefix `pages/` cikarilmistir).
- `index.html` root dizindedir (`fe1/index.html`), diger tum sayfalar `fe1/pages/` altindadir.
- Auth sayfalari (`auth-*`) shell/navigasyon icermez, bagimsiz layout kullanir.
