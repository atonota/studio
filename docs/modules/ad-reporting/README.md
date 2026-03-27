# Module: ad-reporting

> Cross-platform reklam performans raporlama. Birlesmis metrikler, attribution, white-label PDF/HTML rapor, zamanlanmis rapor.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `ad-reporting` |
| Oncelik | P1 |
| Faz | Faz 8 (Reklam) |
| Bagimlillik | `ad-orchestrator` |
| Roller | `studio_admin`, `studio_editor`, `studio_analyst` |
| ECharts | SpendHeatmap (heatmap), CampaignTreemap (treemap), PlatformComparisonLine (multi-line), ConversionFunnel (funnel), CumulativeSpendArea (stacked area), AttributionSankey (sankey) |

## Amac

`ad-reporting` modulu, tum reklam platformlarindan gelen performans verilerini birlestirerek
tek bir raporlama katmani sunar. Cross-platform metrik karsilastirmasi, attribution modelleme,
white-label PDF/HTML rapor uretimi ve zamanlanmis rapor gonderimi saglar.

Ajans modu ile musteri bazli white-label raporlar olusturulabilir. AI destekli performans
ozetleri dogal dil ile haftalik/aylik analiz sunar.

## AI Yetenekleri

### 1. AI Performans Ozeti
- Dogal dil ile haftalik/aylik performans analizi uretir.
- `instructor` + LLM ile metrik verilerinden insan-okunabilir ozet olusturulur.
- Trend tespiti, onemli degisimler ve oncelikli aksiyonlar vurgulanir.
- Cikti: `{summary: str, highlights: list[str], action_items: list[str], period: str}`

### 2. Anomali Aciklama
- Harcama artisi, CTR dususu gibi anomalilerin nedenini AI ile aciklar.
- `ad-orchestrator` anomali tespitini alir, raporlama katmaninda derinlemesine analiz yapar.
- Platform degisiklikleri, mevsimsellik, rekabet etkisi gibi olasi nedenleri siralar.
- Cikti: `{anomaly: str, root_causes: list[RootCause], confidence: float, recommendation: str}`

### 3. ROAS/CPA Tahminleme
- Gelecek 7/30 gun performans forecast uretir.
- Gecmis veri + mevsimsellik + butce plani girislerini kullanir.
- Guven araligi ile gosterim (ECharts area chart).
- Cikti: `{metric: str, forecast_7d: ForecastPoint, forecast_30d: ForecastPoint, confidence_interval: float}`

### 4. Cross-Channel Karsilastirma
- Platformlar arasi benchmark ve oneri uretir.
- Ayni kampanya hedefi icin farkli platformlarin performansini karsilastirir.
- Hangi platform hangi hedef icin daha etkili oldugunu analiz eder.
- Cikti: `{comparisons: list[ChannelComparison], winner_by_metric: dict, recommendations: list[str]}`

### 5. White-Label AI Rapor
- Musteri icin AI-generated raporlar olusturur (ajans modu).
- Ozellestirilmis logo, renk semasi ve marka kimligi ile PDF/HTML cikti.
- AI, raporun yonetici ozeti ve sonuc bolumlerini dogal dil ile yazar.
- Cikti: PDF veya HTML dosyasi (S3-compatible storage'a kaydedilir).

## Sync Katmanlari

| Katman | Aralik | Amac |
|--------|--------|------|
| Real-time | 15-30 dk | Spend pacing alert'leri — butce tukenmesi erken uyari |
| Near-real-time | 1-3 saat | Aktif kampanya metrikleri — gunluk optimizasyon kararlari |
| Daily | 1/gun | Tam raporlama reconciliation — kesin rakamlar, attribution |

- Real-time katman yalnizca kritik spend metrikleri icin kullanilir (maliyet etkinligi).
- Daily reconciliation, platform API'lerinin 24-48 saat gecikmeli kesinlestirdigi metrikler icin zorunludur.

## Attribution Modelleri

| Model | Aciklama |
|-------|----------|
| Son Tiklama | Donusumu son tiklanan kanala atar |
| Ilk Tiklama | Donusumu ilk tiklanan kanala atar |
| Linear | Donusumu tum temas noktalarina esit dagitir |
| Zaman Bazli | Donusume yakin temas noktalarina daha fazla agirlik verir |
| Data-Driven | Platform API destegi olcusunde ML-bazli attribution |

- Attribution modeli rapor bazinda secilir.
- Data-driven attribution yalnizca yeterli donusum hacmi olan kampanyalarda aktif olur.

## ECharts Gorsellestirme

| Chart | Tip | Kullanim |
|-------|-----|----------|
| SpendHeatmap | heatmap (saat x gun) | Hangi saat/gun kombinasyonunda en cok harcama yapildigi |
| CampaignTreemap | treemap | Kampanya agaci — butce ve performans buyukluk orani |
| PlatformComparisonLine | multi-line | Platformlar arasi metrik karsilastirmasi (CPC, CTR, ROAS) |
| ConversionFunnel | funnel | Gosterim -> tiklama -> donusum funnel'i |
| CumulativeSpendArea | stacked area | Kumulatif harcama — platform bazli yigilmali alan grafigi |
| AttributionSankey | sankey | Attribution akisi — kanal -> donusum yolu gorsellestirmesi |

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Rapor Panosu | `/ads/reports` | Aktif raporlar, son olusturulan raporlar, hizli metrik ozeti |
| Rapor Olustur | `/ads/reports/create` | Metrik secimi, tarih araligi, platform filtresi, sablon secimi |
| Rapor Detay | `/ads/reports/{id}` | Tekil rapor goruntuleme, PDF/HTML indirme, paylasim |
| Zamanlanmis Raporlar | `/ads/reports/schedule` | Periyodik rapor zamanlama (gunluk/haftalik/aylik) |
| Attribution | `/ads/attribution` | Attribution model secimi, kanal bazli donusum analizi |
| Rapor Sablonlari | `/ads/reports/templates` | Yeniden kullanilabilir rapor sablonlari (white-label dahil) |

## Veri Modeli (Ozet)

```
ads.report_templates
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  name            VARCHAR(255) NOT NULL
  description     TEXT
  template_type   VARCHAR(20) NOT NULL       -- standard | white_label
  config          JSONB NOT NULL             -- metrik secimi, layout, branding
  branding        JSONB                      -- logo_url, colors, company_name
  is_default      BOOLEAN DEFAULT false
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, template_type)

ads.reports
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  template_id     BIGINT REFERENCES ads.report_templates(id)
  name            VARCHAR(255) NOT NULL
  status          VARCHAR(20) NOT NULL       -- pending | generating | completed | failed
  date_from       DATE NOT NULL
  date_to         DATE NOT NULL
  platforms       JSONB NOT NULL             -- secili platformlar listesi
  metrics         JSONB NOT NULL             -- secili metrikler listesi
  attribution_model VARCHAR(20)              -- last_click | first_click | linear | time_decay | data_driven
  ai_summary      TEXT                       -- AI tarafindan uretilmis ozet
  file_url        TEXT                       -- S3 URL (PDF/HTML)
  file_format     VARCHAR(10)                -- pdf | html
  generated_at    TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, created_at)
  INDEX (tenant_id, status)

ads.report_schedules
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  template_id     BIGINT NOT NULL REFERENCES ads.report_templates(id)
  name            VARCHAR(255) NOT NULL
  frequency       VARCHAR(20) NOT NULL       -- daily | weekly | monthly
  day_of_week     SMALLINT                   -- 0-6 (haftalik icin)
  day_of_month    SMALLINT                   -- 1-28 (aylik icin)
  hour            SMALLINT NOT NULL           -- 0-23
  recipients      JSONB                      -- e-posta alicilari
  is_active       BOOLEAN DEFAULT true
  last_run_at     TIMESTAMPTZ
  next_run_at     TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, is_active)
  INDEX (next_run_at) WHERE is_active = true

ads.campaign_metrics (TimescaleDB hypertable)
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  campaign_id     BIGINT NOT NULL REFERENCES ads.campaigns(id)
  platform        VARCHAR(30) NOT NULL
  recorded_at     TIMESTAMPTZ NOT NULL       -- metrik snapshot zamani
  impressions     BIGINT DEFAULT 0
  clicks          BIGINT DEFAULT 0
  conversions     INTEGER DEFAULT 0
  spend           DECIMAL(12,2) DEFAULT 0
  revenue         DECIMAL(12,2) DEFAULT 0
  ctr             DECIMAL(8,6)
  cpc             DECIMAL(10,4)
  cpa             DECIMAL(10,2)
  roas            DECIMAL(10,4)
  impression_share DECIMAL(5,4)
  quality_score   SMALLINT
  platform_data   JSONB                      -- platform-spesifik ek metrikler

  INDEX (tenant_id, campaign_id, recorded_at)
  INDEX (tenant_id, workspace_id, recorded_at)
  INDEX (tenant_id, platform, recorded_at)

ads.attribution_events
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  conversion_id   VARCHAR(100) NOT NULL
  touchpoint_platform VARCHAR(30) NOT NULL
  touchpoint_campaign_id BIGINT
  touchpoint_type VARCHAR(20) NOT NULL       -- impression | click
  touchpoint_at   TIMESTAMPTZ NOT NULL
  conversion_at   TIMESTAMPTZ
  conversion_value DECIMAL(12,2)
  attribution_model VARCHAR(20) NOT NULL
  attributed_value DECIMAL(12,2)
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, workspace_id, conversion_at)
  INDEX (tenant_id, attribution_model, conversion_at)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/ads/
    reporting_routes.py      <- rapor sayfa + API endpoint'leri
    reporting_schemas.py     <- ReportResponse, MetricResponse, ScheduleResponse
  app/models/ads/
    report.py                <- Report, ReportTemplate, ReportSchedule modelleri
    campaign_metric.py       <- CampaignMetric modeli (hypertable)
    attribution.py           <- AttributionEvent modeli
  app/services/ads/
    reporting_service.py     <- rapor CRUD + uretim
    metric_service.py        <- metrik aggregasyon + cross-platform birlestirme
    attribution_service.py   <- attribution model hesaplama
    forecast_service.py      <- ROAS/CPA tahminleme
    ai_summary_service.py    <- AI performans ozeti uretimi
    pdf_generator.py         <- white-label PDF uretimi
    schedule_service.py      <- zamanlanmis rapor yonetimi
  app/tasks/ads/
    metric_sync.py           <- periyodik metrik cekme (real-time / near-real-time / daily)
    report_generate.py       <- asenkron rapor uretimi
    scheduled_report.py      <- zamanlanmis rapor tetikleme (Celery Beat)
    spend_pacing_alert.py    <- real-time spend pacing alert
  templates/modules/ads/
    pages/
      reports.html
      report-create.html
      report-detail.html
      report-schedules.html
      attribution.html
      report-templates.html
    partials/
      report-table.html
      metric-summary.html
      attribution-chart.html
      schedule-list.html
      ai-summary-card.html
    components/
      spend-heatmap.html
      campaign-treemap.html
      platform-comparison-line.html
      conversion-funnel.html
      cumulative-spend-area.html
      attribution-sankey.html
      metric-kpi-card.html
      date-range-picker.html
```

## Temel Kurallar

- Tum rapor verileri `ads` schemasinda saklanir.
- Metrik verileri workspace + tenant bazli (RLS zorunlu).
- `campaign_metrics` tablosu TimescaleDB hypertable olarak olusturulur (zaman serisi optimizasyonu).
- Rapor uretimi asenkron Celery task olarak calisir, SSE ile ilerleme bildirilir.
- PDF/HTML dosyalari S3-compatible storage'a kaydedilir (boto3).
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Daily reconciliation, platform API gecikmelerini tolere eder (24-48 saat).
- Zamanlanmis raporlar Celery Beat ile tetiklenir, e-posta gonderimi Resend uzerinden yapilir.

## Guvenlik Notlari

- Tum rapor verileri tenant-scoped (RLS zorunlu).
- White-label raporlardaki musteri bilgileri tenant izolasyonuna tabi.
- Rapor PDF/HTML dosyalari pre-signed URL ile sunulur (sureli erisim).
- Zamanlanmis rapor alicilari tenant admin tarafindan yonetilir.
- Metrik sync islemleri audit log'a yazilir.
- AI ozet uretimi rate limited (instructor cagrilari: 20 req/dk per tenant).
- Rapor olustur/guncelle/sil islemleri audit log'a yazilir.
