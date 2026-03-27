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
| ECharts | SpendHeatmapChart (heatmap — saat x gun), CampaignTreemapChart (treemap — kampanya agaci), PlatformCompareLineChart (multi-line — platform karsilastirma), ConversionFunnelChart (funnel — donusum), CumulativeSpendChart (stacked area — kumulatif harcama), AttributionSankeyChart (sankey — attribution akisi) |

## Amac

`ad-reporting` modulu, `ad-orchestrator` tarafindan yonetilen tum platformlardaki reklam
performansini birlesmis bir gorunumde sunar. Cross-platform metrik birlestirme, attribution
modelleme, white-label rapor uretimi ve zamanlanmis rapor gonderimiyle reklam performansinin
tek kaynagi olur.

Ajans modu ile white-label PDF/HTML raporlar uretilir — musteriye sunulmaya hazir formatta.
AI destekli performans ozeti, anomali aciklama ve tahminleme yetenekleri icerir.

## AI Yetenekleri

### 1. AI Performans Ozeti
- Dogal dil ile haftalik/aylik performans analizi olusturur.
- `instructor` + LLM ile KPI degisimlerini anlamli cumlelerle ozetler.
- Yoneticiye yonelik "executive summary" formati.
- Cikti: `{summary: str, highlights: list[str], concerns: list[str], period: str}`

### 2. Anomali Aciklama
- Neden harcama artti, CTR dustu vb. metriklerdeki degisimi AI ile aciklar.
- Korelasyon analizi (mevsimsellik, rakip aksiyonu, platform algoritmasi degisikligi).
- Her anomali icin olasi nedenler ve onerilen aksiyonlar.
- Cikti: `{anomaly: str, explanation: str, probable_causes: list[str], recommended_actions: list[str]}`

### 3. ROAS/CPA Tahminleme
- Gelecek 7/30 gun icin performans forecast uretir.
- Gecmis veri trendi + mevsimsellik + butce degisiklik plani girislerine dayanir.
- Guven araligi ile gosterim (ECharts area chart).
- Cikti: `{metric: str, forecast_7d: float, forecast_30d: float, confidence_interval: tuple[float, float]}`

### 4. Cross-Channel Karsilastirma
- Platformlar arasi benchmark ve oneri uretir.
- Ayni kampanya hedefine sahip farkli platformlardaki performans karsilastirmasi.
- En iyi performans gosteren platform/kampanya/ad group onerileri.
- Cikti: `{benchmarks: list[PlatformBenchmark], recommendations: list[str], best_performer: str}`

### 5. White-Label AI Rapor
- Musteri icin AI-generated raporlar (ajans modu).
- Kisisellestirilebilir sablon: logo, renk, metin tonu.
- PDF ve HTML cikti formati.
- LLM ile rapor yorumlari ve onerileri otomatik olusturulur.
- Cikti: PDF/HTML dosyasi + `{report_id: UUID, format: str, generated_at: ISO8601}`

## Sync Katmanlari

| Katman | Aralik | Amac |
|--------|--------|------|
| Real-time | 15-30 dakika | Spend pacing alerts — butce tukenmesi erken uyari |
| Near-real-time | 1-3 saat | Aktif kampanya metrikleri — guncel performans gorunumu |
| Daily | Gunde 1 (gece) | Tam raporlama reconciliation — kesinlesmis veriler |

Her katman ayri Celery task olarak calisir. Sync sonuclari SSE ile bildirilir.

## Attribution Modelleri

| Model | Aciklama |
|-------|----------|
| Son Tiklama | Donusumun tamami son tiklanan kanala atanir |
| Ilk Tiklama | Donusumun tamami ilk temas noktasina atanir |
| Linear | Tum temas noktalarina esit dagitim |
| Zaman Bazli | Donusume yakin temas noktalarina daha fazla agirlik |
| Data-Driven | Platform API destegi olcusunde ML bazli attribution |

Kullanici attribution modelini rapor bazinda secebilir. Varsayilan: son tiklama.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Raporlar | `/ads/reports` | Rapor listesi, son olusturulan raporlar, hizli filtreler |
| Rapor Olustur | `/ads/reports/create` | Yeni rapor olusturma (metrik secimi, tarih, platform, sablon) |
| Rapor Detay | `/ads/reports/{id}` | Tekil rapor gorunumu (PDF/HTML onizleme, paylasim) |
| Zamanlanmis Raporlar | `/ads/reports/schedule` | Otomatik rapor zamanlama (gunluk/haftalik/aylik) |
| Attribution | `/ads/attribution` | Attribution modeli secimi ve cross-channel donusum analizi |
| Rapor Sablonlari | `/ads/reports/templates` | White-label sablon yonetimi (logo, renk, metin tonu) |

## Veri Modeli (Ozet)

```
ads.report_metrics (TimescaleDB hypertable)
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  connection_id   BIGINT NOT NULL REFERENCES ads.platform_connections(id)
  campaign_id     BIGINT REFERENCES ads.campaigns(id)
  ad_group_id     BIGINT REFERENCES ads.ad_groups(id)
  ad_id           BIGINT REFERENCES ads.ads(id)
  recorded_at     TIMESTAMPTZ NOT NULL      -- metrik zamani
  granularity     VARCHAR(10) NOT NULL      -- hourly | daily | weekly
  impressions     BIGINT DEFAULT 0
  clicks          BIGINT DEFAULT 0
  cost            DECIMAL(12,4) DEFAULT 0
  conversions     INTEGER DEFAULT 0
  conversion_value DECIMAL(12,4) DEFAULT 0
  ctr             DECIMAL(8,6)
  cpc             DECIMAL(10,4)
  cpa             DECIMAL(10,4)
  roas            DECIMAL(10,4)
  platform_data   JSONB                     -- platform-spesifik metrikler

  INDEX (tenant_id, workspace_id, recorded_at)
  INDEX (tenant_id, campaign_id, recorded_at)
  INDEX (tenant_id, connection_id, granularity, recorded_at)

ads.reports
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  name            VARCHAR(255) NOT NULL
  report_type     VARCHAR(30) NOT NULL      -- performance | attribution | comparison | custom
  template_id     BIGINT REFERENCES ads.report_templates(id)
  config_json     JSONB NOT NULL            -- metrik secimi, filtreler, tarih araligi
  status          VARCHAR(20) NOT NULL      -- draft | generating | ready | failed
  format          VARCHAR(10) NOT NULL      -- pdf | html
  file_url        TEXT                      -- S3 URL (olusturulduysa)
  ai_summary      TEXT                      -- LLM tarafindan uretilmis ozet
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
  report_id       BIGINT NOT NULL REFERENCES ads.reports(id)
  frequency       VARCHAR(10) NOT NULL      -- daily | weekly | monthly
  day_of_week     SMALLINT                  -- 0-6 (haftalik icin)
  day_of_month    SMALLINT                  -- 1-31 (aylik icin)
  time_of_day     TIME NOT NULL
  recipients      JSONB NOT NULL            -- e-posta listesi
  is_active       BOOLEAN DEFAULT true
  last_sent_at    TIMESTAMPTZ
  next_send_at    TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, is_active, next_send_at)

ads.report_templates
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  name            VARCHAR(255) NOT NULL
  logo_url        TEXT
  primary_color   VARCHAR(7)                -- hex renk kodu
  secondary_color VARCHAR(7)
  tone            VARCHAR(20) DEFAULT 'professional'  -- professional | casual | executive
  header_html     TEXT
  footer_html     TEXT
  is_default      BOOLEAN DEFAULT false
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, is_default)

ads.attribution_events
  id              BIGSERIAL PRIMARY KEY
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  conversion_id   VARCHAR(255) NOT NULL     -- platform donusum ID
  touchpoints     JSONB NOT NULL            -- [{platform, campaign_id, timestamp, channel}]
  model           VARCHAR(20) NOT NULL      -- last_click | first_click | linear | time_decay | data_driven
  attributed_value DECIMAL(12,4)
  recorded_at     TIMESTAMPTZ NOT NULL
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, workspace_id, recorded_at)
  INDEX (tenant_id, model, recorded_at)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/ads/
    reporting_routes.py       <- raporlama sayfa + API endpoint'leri
    reporting_schemas.py      <- ReportResponse, MetricResponse, AttributionResponse
  app/models/ads/
    report_metric.py          <- ReportMetric modeli (hypertable)
    report.py                 <- Report modeli
    report_schedule.py        <- ReportSchedule modeli
    report_template.py        <- ReportTemplate modeli
    attribution_event.py      <- AttributionEvent modeli
  app/services/ads/
    reporting_service.py      <- rapor CRUD + olusturma orkestrasyonu
    metric_aggregator.py      <- cross-platform metrik birlestirme
    attribution_service.py    <- attribution model hesaplama
    forecast_service.py       <- ROAS/CPA tahminleme
    report_generator.py       <- PDF/HTML rapor uretimi
    schedule_service.py       <- zamanlanmis rapor yonetimi
    template_service.py       <- white-label sablon yonetimi
    ai_summarizer.py          <- AI performans ozeti + anomali aciklama
  app/tasks/ads/
    sync_realtime.py          <- 15-30dk spend pacing sync
    sync_nearrealtime.py      <- 1-3 saat aktif kampanya metrikleri
    sync_daily.py             <- gunluk reconciliation
    generate_report.py        <- asenkron rapor uretimi
    send_scheduled.py         <- zamanlanmis rapor gonderimi
    run_forecast.py           <- periyodik tahmin guncelleme
  templates/modules/ads/
    pages/
      reports.html
      report-create.html
      report-detail.html
      report-schedule.html
      attribution.html
      report-templates.html
    partials/
      report-list.html
      metric-summary.html
      attribution-chart.html
      forecast-chart.html
      schedule-table.html
    components/
      spend-heatmap.html
      campaign-treemap.html
      platform-compare-line.html
      conversion-funnel.html
      cumulative-spend-area.html
      attribution-sankey.html
      report-preview-card.html
      metric-kpi-card.html
```

## Temel Kurallar

- Tum raporlama verileri `ads` schemasinda saklanir (`ad-orchestrator` ile ayni schema).
- Metrik verileri TimescaleDB hypertable olarak saklanir (zaman serisi optimizasyonu).
- Rapor verileri workspace + tenant bazli (RLS zorunlu).
- Rapor uretimi asenkron Celery task olarak calisir, SSE ile ilerleme bildirilir.
- PDF uretimi server-side (WeasyPrint veya benzeri — frontend JS yasak).
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Zamanlanmis raporlar Celery Beat ile tetiklenir, Resend ile gonderilir.
- Attribution hesaplamalari batch olarak calisir (real-time attribution hesaplama yok).
- Audit log: rapor olusturma, zamanlama, paylasim gibi islemler loglanir.

## Guvenlik Notlari

- Tum raporlama verileri tenant-scoped (RLS zorunlu).
- White-label sablonlardaki HTML icerik sanitize edilir (XSS korunmasi).
- Rapor PDF/HTML dosyalari S3'te tenant-scoped prefix ile saklanir.
- Zamanlanmis rapor alicilari tenant admin tarafindan yonetilir.
- LLM API cagrilari rate limited (instructor cagrilari: 20 req/dk per tenant).
- Audit log: tum rapor islemleri audit.events tablosuna yazilir (append-only).
