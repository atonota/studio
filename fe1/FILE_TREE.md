# atonota Studio — FE1 Dosya Agaci

> Tarih: 2026-03-30
> Toplam HTML: 175 dosya (1 index + 1 template + 173 sayfa)
> Toplam satir: ~23,680
> Konum: studio/fe1/

---

## Varlik Ozeti

| Tur | Adet | Konum |
|-----|------|-------|
| HTML sayfa | 173 | `pages/` |
| HTML index | 1 | `index.html` |
| HTML template | 1 | `pages/_template.html` |
| TypeScript kaynak | 39 | `src/` (app/, features/, shared/) |
| SCSS kaynak | 45 | `src/scss/` (core/, tokens/, shared/, features/) |
| JS cikti (esbuild) | 8 | `js/` (IIFE bundle, HTML referansi) |
| CSS cikti (Dart Sass) | 4 | `css/` (tokens, primitives, theme-options, stub) |

---

## Dosya Agaci

```
fe1/
├── index.html                              252 satir
├── css/
│   ├── tokens.css
│   └── components.css
├── js/
│   ├── shell.js
│   ├── components.js
│   ├── charts.js
│   ├── utils.js
│   └── mock-data.js
└── pages/
    ├── _template.html                       33 satir
    │
    ├── AUTH (4 sayfa)
    │   ├── auth-login.html                  66
    │   ├── auth-register.html               76
    │   ├── auth-forgot.html                 46
    │   ├── auth-reset-password.html         50
    │   └── auth-two-factor.html             80
    │
    ├── DASHBOARD (1 sayfa)
    │   └── dashboard-workspace.html        149
    │
    ├── TENANT YONETIM (3 sayfa)
    │   ├── tenants.html                     98
    │   ├── tenant-detail.html              205
    │   └── tenant-create.html              165
    │
    ├── WORKSPACE (3 sayfa)
    │   ├── workspaces.html                  81
    │   ├── workspace-detail.html           111
    │   └── workspace-create.html            70
    │
    ├── ADAPTER (4 sayfa)
    │   ├── adapters.html                    95
    │   ├── adapter-detail.html             112
    │   ├── adapter-connect.html            227
    │   └── adapter-health.html             177
    │
    ├── SEO (21 sayfa)
    │   ├── seo.html                        242
    │   ├── seo-keywords.html               174
    │   ├── seo-keyword-magic.html          397
    │   ├── seo-rankings.html               128
    │   ├── seo-organic-research.html       393
    │   ├── seo-position-tracker.html       390
    │   ├── seo-onpage-checker.html         191
    │   ├── seo-serp.html                   129
    │   ├── seo-batch-analysis.html         158
    │   ├── seo-cluster.html                 79
    │   ├── seo-backlinks.html              182
    │   ├── seo-backlink-audit.html         240
    │   ├── seo-backlink-gap.html           232
    │   ├── seo-link-intersect.html         209
    │   ├── seo-entities.html               119
    │   ├── seo-entities-graph.html         125
    │   ├── seo-audit.html                  107
    │   ├── seo-audit-detail.html           257
    │   ├── seo-geo.html                    147
    │   ├── seo-geo-mentions.html           178
    │   ├── seo-geo-prompts.html            114
    │   └── seo-geo-citability.html         106
    │
    ├── GEO / AI ARAMA (8 sayfa)
    │   ├── geo.html                        131
    │   ├── geo-sentiment.html              128
    │   ├── geo-competitors.html             80
    │   ├── geo-mentions.html               160
    │   ├── geo-platforms.html              187
    │   ├── geo-queries.html                106
    │   ├── geo-recommendations.html        127
    │   └── geo-citation-widget.html        100
    │
    ├── CONTENT (15 sayfa)
    │   ├── content.html                    174
    │   ├── content-pages.html              124
    │   ├── content-detail.html             174
    │   ├── content-explorer.html           249
    │   ├── content-topic-research.html     324
    │   ├── content-writing-assistant.html  270
    │   ├── content-template.html           171
    │   ├── content-readability.html        112
    │   ├── content-ai-detection.html       125
    │   ├── content-orphaned.html           102
    │   ├── content-gaps.html                98
    │   ├── content-decay.html              136
    │   ├── content-semantic.html           114
    │   ├── content-llmstxt.html            110
    │   ├── content-schema.html             162
    │   ├── content-schema-generator.html    99
    │   └── content-schema-aggregation.html  92
    │
    ├── ENTITIES (6 sayfa)
    │   ├── entities.html                   114
    │   ├── entities-detail.html            122
    │   ├── entities-extract.html           152
    │   ├── entities-gaps.html              117
    │   ├── entities-graph.html              77
    │   └── entities-knowledge-panel.html   135
    │
    ├── SCHEMA (7 sayfa)
    │   ├── schema.html                     128
    │   ├── schema-detail.html              107
    │   ├── schema-generator.html           119
    │   ├── schema-templates.html           123
    │   ├── schema-validate.html             96
    │   ├── schema-import.html               95
    │   └── schema-aggregation.html          97
    │
    ├── ANALYTICS (6 sayfa)
    │   ├── analytics.html                  171
    │   ├── analytics-traffic.html          116
    │   ├── analytics-realtime.html         118
    │   ├── analytics-funnels.html           99
    │   ├── analytics-segments.html         152
    │   └── analytics-query.html            134
    │
    ├── COMPETITOR (8 sayfa)
    │   ├── competitors.html                 98
    │   ├── competitor-detail.html          164
    │   ├── competitor-compare.html         107
    │   ├── competitor-marketshare.html     112
    │   ├── competitor-techstack.html       177
    │   ├── competitor-strategy.html        154
    │   ├── competitor-swot.html            135
    │   └── competitor-alerts.html           79
    │
    ├── ADS / REKLAM (25 sayfa)
    │   ├── ads.html                        195
    │   ├── ads-platforms.html              149
    │   ├── ads-accounts.html               131
    │   ├── ads-campaigns.html              127
    │   ├── ads-campaign-detail.html        177
    │   ├── ads-campaign-create.html        168
    │   ├── ads-adgroups.html               123
    │   ├── ads-creatives.html              153
    │   ├── ads-audiences.html              117
    │   ├── ads-budgets.html                195
    │   ├── ads-budget-optimizer.html       101
    │   ├── ads-attribution.html            136
    │   ├── ads-rules.html                  147
    │   ├── ads-rules-create.html           131
    │   ├── ads-rule-detail.html            120
    │   ├── ads-alerts.html                 139
    │   ├── ads-tokens.html                 137
    │   ├── ads-competitor-research.html    249
    │   ├── ads-meta.html                   110
    │   ├── ads-tiktok.html                 104
    │   ├── ads-linkedin.html               120
    │   ├── ads-pinterest.html               68
    │   ├── ads-snapchat.html                68
    │   ├── ads-whatsapp.html                97
    │   ├── ads-reports.html                144
    │   ├── ads-report-detail.html          139
    │   ├── ads-report-create.html          156
    │   ├── ads-report-templates.html       105
    │   └── ads-report-schedule.html        116
    │
    ├── LOCAL SEO (7 sayfa)
    │   ├── local.html                      119
    │   ├── local-detail.html               145
    │   ├── local-locations.html             99
    │   ├── local-rankings.html             110
    │   ├── local-reviews.html              127
    │   ├── local-gbp.html                  130
    │   └── local-directories.html           79
    │
    ├── MARKETPLACE (6 sayfa)
    │   ├── marketplace.html                105
    │   ├── marketplace-detail.html         108
    │   ├── marketplace-products.html        86
    │   ├── marketplace-keywords.html        97
    │   ├── marketplace-competitors.html    123
    │   └── marketplace-optimization.html   109
    │
    ├── PERFORMANCE (5 sayfa)
    │   ├── performance.html                143
    │   ├── performance-vitals.html         185
    │   ├── performance-speed.html          128
    │   ├── performance-uptime.html         137
    │   └── performance-recommendations.html 116
    │
    ├── SECURITY (5 sayfa)
    │   ├── security.html                   150
    │   ├── security-headers.html           150
    │   ├── security-ssl.html                87
    │   ├── security-vulnerabilities.html   102
    │   └── security-compliance.html        113
    │
    ├── AI / INSIGHTS (8 sayfa)
    │   ├── ai.html                         107
    │   ├── ai-brand-radar.html             214
    │   ├── ai-digests.html                 125
    │   ├── insights.html                   140
    │   ├── insights-feed.html              148
    │   ├── insights-detail.html            115
    │   ├── insights-digests.html           149
    │   └── insights-preferences.html       111
    │
    ├── REPORTS (5 sayfa)
    │   ├── reports.html                     81
    │   ├── report-detail.html              154
    │   ├── report-create.html              105
    │   ├── report-templates.html           132
    │   └── report-schedule.html            108
    │
    ├── NOTIFICATIONS (3 sayfa)
    │   ├── notifications.html              108
    │   ├── notification-rules.html         144
    │   └── notification-rule-create.html   154
    │
    ├── AUDIT (2 sayfa)
    │   ├── audit.html                      108
    │   └── audit-detail.html               129
    │
    ├── BILLING (5 sayfa)
    │   ├── billing.html                     98
    │   ├── billing-plans.html              127
    │   ├── billing-invoices.html            78
    │   ├── billing-payment-methods.html     80
    │   └── billing-usage.html              101
    │
    └── SETTINGS (8 sayfa)
        ├── settings.html                    86
        ├── settings-profile.html            80
        ├── settings-security.html          135
        ├── settings-appearance.html        167
        ├── settings-apikeys.html            76
        ├── settings-webhooks.html           99
        ├── settings-notifications-prefs.html 107
        └── settings-tenant-settings.html   101
```

---

## Kategori Ozeti

| Kategori | Sayfa | Toplam Satir |
|----------|-------|-------------|
| SEO | 21 | ~4,197 |
| Ads / Reklam | 29 | ~3,922 |
| Content | 17 | ~2,536 |
| GEO / AI Arama | 8 | ~1,019 |
| Competitor | 8 | ~1,026 |
| AI / Insights | 8 | ~1,109 |
| Schema | 7 | ~765 |
| Local SEO | 7 | ~809 |
| Entities | 6 | ~717 |
| Marketplace | 6 | ~628 |
| Analytics | 6 | ~790 |
| Performance | 5 | ~709 |
| Security | 5 | ~602 |
| Auth | 5 | ~318 |
| Settings | 8 | ~851 |
| Billing | 5 | ~484 |
| Reports | 5 | ~580 |
| Notifications | 3 | ~406 |
| Adapter | 4 | ~611 |
| Workspace | 3 | ~262 |
| Tenant | 3 | ~468 |
| Audit | 2 | ~237 |
| Dashboard | 1 | ~149 |
| Diger (index+template) | 2 | ~285 |

---

## Jinja2 Templates (Eski Yapi)

```
studio/templates/
├── layouts/
│   └── base.html
├── pages/
│   ├── dashboard.html
│   ├── tenants.html
│   ├── plugins.html
│   └── adapters.html
└── partials/
    ├── sidebar.html
    └── tenant_list.html
```

> Bu 7 dosya FastAPI Jinja2 template sistemi icindir.
> fe1/ ise statik HTML prototip katmanidir.
