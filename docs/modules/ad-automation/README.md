# Module: ad-automation

> Kural bazli reklam otomasyon motoru. IF/THEN tetikleyiciler, otomatik butce kaydirma, smart pause/enable, alert sistemi.
> **NOT**: Bu modul CLAUDE.md'deki eski "Otomasyon workflow motoru" yasakindan FARKLIDIR. O yasak Klaviyo/ActiveCampaign tarzi e-posta/nurturing otomasyonunu hedefliyordu. Bu modul reklam platform API'leri uzerinden kampanya optimizasyon otomasyonu yapar.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `ad-automation` |
| Oncelik | P1 |
| Faz | Faz 8 (Reklam) |
| Bagimlillik | `ad-orchestrator`, `ad-reporting` |
| Roller | `studio_admin`, `studio_editor` |
| ECharts | RuleActivityTimeline (line+scatter — kural tetiklenme gecmisi), BudgetFlowChart (sankey — butce akisi), PacingGaugeChart (gauge — butce pacing), RuleImpactChart (bar — kural etkisi oncesi/sonrasi), AlertVolumeChart (heatmap — alert yogunlugu) |

## Amac

`ad-automation` modulu, reklam kampanyalarinin kural bazli otomatik optimizasyonunu saglar.
Kullanici tanimli IF/THEN kurallariyla performans kosullarina gore otomatik aksiyon alinir:
butce kaydirma, kampanya durdurma/etkinlestirme, bid ayarlama ve alert gonderimi.

AI destekli predictive butce dagitimi, dusuk performansli reklam tespiti ve smart bidding
onerileriyle manuel mudahale ihtiyacini azaltir. Kural motoru `ad-orchestrator` uzerinden
platform API'lerine write islemleri yapar, `ad-reporting` metriklerini tetikleyici olarak kullanir.

**Kapsam notu**: Bu modul Klaviyo/ActiveCampaign tarzi e-posta/nurturing otomasyonu DEGILDIR.
Reklam platform API'leri uzerinden kampanya butce ve performans optimizasyon otomasyonudur.
NEVER_BUILD'deki "Otomasyon workflow motoru" yasagi bu modulu KAPSAMAZ.

## AI Yetenekleri

### 1. Predictive Budget Allocation
- AI gelecek performansi tahmin ederek butceyi platformlar arasi dagitir.
- Gecmis performans trendi + mevsimsellik + gercek zamanli pacing verisi girislerine dayanir.
- Otomatik veya onay-bazli (kullanici tercihine gore) butce kaydirma.
- Cikti: `{allocations: list[PlatformAllocation], predicted_roas: float, reasoning: str}`

### 2. Auto-Pause Underperforming
- Dusuk performansli reklamlari ve kampanyalari otomatik durdurma.
- Performans esik degerleri kullanici tanimli (CPA limiti, minimum ROAS, CTR alt siniri).
- Grace period: ani dalgalanmalara karsi bekleme suresi (varsayilan: 24 saat).
- Durdurma oncesi kullaniciya bildirim gonderilir (yapilandirilabilir: otomatik veya onay-bazli).
- Cikti: `{paused_items: list[PausedItem], reason: str, potential_savings: float}`

### 3. Smart Bidding Onerisi
- Platform ve hedef bazli optimal teklif stratejisi secimi.
- Kampanya olgunluguna gore strateji gecis onerisi (ornegin: manual CPC -> target CPA).
- Platform API destegine gore uygulanabilir strateji filtresi.
- Cikti: `{current_strategy: str, recommended_strategy: str, expected_improvement: str, confidence: float}`

### 4. A/B Test Onerisi
- Hangi degiskenlerin test edilmesi gerektigini AI ile tespit eder.
- Reklam metni, gorsel, hedefleme, bid strategy, landing page varyantlari analizi.
- Test onceliklendirme: beklenen etki x efor matrisi.
- Cikti: `{test_suggestions: list[TestSuggestion], priority_order: list[int], expected_lift: str}`

### 5. Budget Pacing Alert
- Butce tukenmesi veya dusuk harcama erken uyari sistemi.
- Gunluk/haftalik/aylik butce pacing takibi.
- Trend bazli tahmin: "Bu harcama hiziyla butce X gun once tukenecek" veya "Aylik butcenin %40'i kullanilmadi".
- Cikti: `{alert_type: str, severity: str, current_pace: float, projected_end: str, recommendation: str}`

## Kural Motoru

### Yapi

```
IF [metrik] [operator] [esik] THEN [aksiyon]
```

### Metrikler

| Metrik | Aciklama |
|--------|----------|
| `CPC` | Tiklama basina maliyet |
| `CPA` | Donusum basina maliyet |
| `ROAS` | Reklam harcamasi getirisi |
| `CTR` | Tiklama orani |
| `impression_share` | Gosterim payi |
| `spend` | Toplam harcama |
| `conversion_rate` | Donusum orani |
| `frequency` | Ortalama gosterim sikligi |
| `cost_per_mille` | 1000 gosterim basina maliyet |

### Operatorler

| Operator | Aciklama |
|----------|----------|
| `>` | Buyuktur |
| `<` | Kucuktur |
| `>=` | Buyuk esit |
| `<=` | Kucuk esit |
| `=` | Esit |
| `change_pct` | Degisim yuzdesi (onceki doneme gore) |

### Aksiyonlar

| Aksiyon | Aciklama |
|---------|----------|
| `pause` | Kampanya/ad group/reklam durdur |
| `enable` | Kampanya/ad group/reklam etkinlestir |
| `adjust_budget(+/-%)` | Butceyi yuzdesel artir/azalt |
| `adjust_bid(+/-%)` | Teklifi yuzdesel artir/azalt |
| `send_alert` | Kullaniciya bildirim gonder |
| `shift_budget_to(platform)` | Butceyi baska platforma kaydir |

### Cooldown

Her kuralda `cooldown_minutes` tanimlanir — ayni kural bu sure icinde tekrar tetiklenmez.
Varsayilan: 60 dakika. Kullanici kurala ozel ayarlayabilir. Minimum: 15 dakika (0 YASAK).

### Ornek Kurallar

```
IF CPA > 50 TRY AND period = last_7d THEN pause (cooldown: 1440 min)
IF ROAS < 2.0 AND spend > 1000 TRY THEN adjust_budget(-20%) (cooldown: 360 min)
IF CTR change_pct < -30% THEN send_alert (cooldown: 60 min)
IF spend > daily_budget * 0.8 AND hour < 18 THEN send_alert (cooldown: 120 min)
IF ROAS > 5.0 AND impression_share < 80% THEN adjust_budget(+15%) (cooldown: 360 min)
```

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Kurallar | `/ads/rules` | Aktif/pasif kural listesi, tetiklenme gecmisi, on/off toggle |
| Kural Olustur | `/ads/rules/create` | Yeni kural tanimlama (metrik, operator, esik, aksiyon, cooldown) |
| Kural Detay | `/ads/rules/{id}` | Tekil kural detayi, gecmis tetiklenmeler, etki analizi |
| Alertler | `/ads/alerts` | Tum alertlerin kronolojik listesi, filtreleme, okundu/okunmadi |
| Butce Optimizer | `/ads/budget-optimizer` | AI predictive butce dagitimi, platform bazli harcama onizleme |

## Veri Modeli (Ozet)

```
ads.automation_rules
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  name            VARCHAR(255) NOT NULL
  description     TEXT
  scope_type      VARCHAR(20) NOT NULL      -- campaign | ad_group | ad | platform
  scope_id        BIGINT                    -- hedef entity ID (NULL ise tum scope)
  platform        VARCHAR(30)               -- NULL ise tum platformlar
  condition_json  JSONB NOT NULL            -- {metric, operator, threshold, period}
  action_json     JSONB NOT NULL            -- {action, params}
  cooldown_minutes INTEGER NOT NULL DEFAULT 60
  is_active       BOOLEAN DEFAULT true
  priority        SMALLINT DEFAULT 0        -- yuksek = once degerlendirme
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, is_active)
  INDEX (tenant_id, scope_type, scope_id)

ads.rule_executions
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  rule_id         BIGINT NOT NULL REFERENCES ads.automation_rules(id)
  triggered_at    TIMESTAMPTZ NOT NULL
  condition_snapshot JSONB NOT NULL          -- tetiklenme anindaki metrik degerleri
  action_taken    JSONB NOT NULL            -- uygulanan aksiyon detaylari
  result          VARCHAR(20) NOT NULL      -- success | failed | skipped | pending_approval
  error_message   TEXT
  impact_before   JSONB                     -- aksiyon oncesi metrikler
  impact_after    JSONB                     -- aksiyon sonrasi metrikler (24h sonra)
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, rule_id, triggered_at)
  INDEX (tenant_id, result, created_at)

ads.alerts
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  rule_id         BIGINT REFERENCES ads.automation_rules(id)
  alert_type      VARCHAR(30) NOT NULL      -- rule_triggered | budget_pacing | anomaly | token_expiry | ai_recommendation
  severity        VARCHAR(10) NOT NULL      -- critical | warning | info
  title           VARCHAR(255) NOT NULL
  message         TEXT NOT NULL
  platform        VARCHAR(30)
  campaign_id     BIGINT REFERENCES ads.campaigns(id)
  is_read         BOOLEAN DEFAULT false
  is_dismissed    BOOLEAN DEFAULT false
  action_url      TEXT                      -- ilgili sayfaya yonlendirme
  created_at      TIMESTAMPTZ NOT NULL

  INDEX (tenant_id, workspace_id, is_read, created_at)
  INDEX (tenant_id, alert_type, created_at)
  INDEX (tenant_id, severity, created_at)

ads.budget_allocations
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  workspace_id    BIGINT NOT NULL
  allocation_type VARCHAR(20) NOT NULL      -- manual | ai_suggested | ai_auto
  status          VARCHAR(20) NOT NULL      -- proposed | approved | applied | rejected
  allocations_json JSONB NOT NULL           -- [{platform, campaign_id, amount, currency}]
  total_budget    DECIMAL(12,2) NOT NULL
  currency        VARCHAR(3) DEFAULT 'TRY'
  ai_reasoning    TEXT                      -- AI aciklamasi
  predicted_roas  DECIMAL(10,4)
  approved_by     UUID                      -- onaylayan kullanici
  applied_at      TIMESTAMPTZ
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, workspace_id, status)
  INDEX (tenant_id, created_at)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/ads/
    automation_routes.py      <- otomasyon sayfa + API endpoint'leri
    automation_schemas.py     <- RuleResponse, AlertResponse, AllocationResponse
  app/models/ads/
    automation_rule.py        <- AutomationRule modeli
    rule_execution.py         <- RuleExecution modeli
    alert.py                  <- Alert modeli
    budget_allocation.py      <- BudgetAllocation modeli
  app/services/ads/
    rule_engine.py            <- kural degerlendirme + tetikleme motoru
    rule_service.py           <- kural CRUD
    alert_service.py          <- alert CRUD + bildirim gonderimi
    allocation_service.py     <- butce dagitim yonetimi
    predictive_allocator.py   <- AI predictive butce dagitimi
    auto_pauser.py            <- dusuk performans otomatik durdurma
    smart_bidder.py           <- AI bid strategy onerisi
    ab_test_advisor.py        <- A/B test onerisi
    pacing_monitor.py         <- butce pacing takibi + alert
  app/tasks/ads/
    evaluate_rules.py         <- periyodik kural degerlendirme (Celery Beat)
    pacing_check.py           <- butce pacing kontrolu (15-30dk)
    predictive_allocation.py  <- AI butce dagitim hesaplama (gunluk)
    impact_measurement.py     <- kural etkisi olcum (24h sonra)
    send_alerts.py            <- alert bildirim gonderimi
  templates/modules/ads/
    pages/
      rules.html
      rule-create.html
      rule-detail.html
      alerts.html
      budget-optimizer.html
    partials/
      rule-list.html
      rule-form.html
      alert-list.html
      allocation-preview.html
      pacing-dashboard.html
    components/
      rule-activity-timeline.html
      budget-flow-sankey.html
      pacing-gauge.html
      rule-impact-bar.html
      alert-volume-heatmap.html
      rule-condition-builder.html
      action-selector.html
      cooldown-indicator.html
```

## Temel Kurallar

- Tum otomasyon verileri `ads` schemasinda saklanir (`ad-orchestrator` ile ayni schema).
- Kural ve alert verileri workspace + tenant bazli (RLS zorunlu).
- Kural degerlendirme periyodik Celery Beat task'i olarak calisir (varsayilan: 15 dakika).
- Kural tetiklenme ve aksiyon sonuclari `ads.rule_executions` tablosunda loglanir.
- Cooldown mekanizmasi zorunlu — sonsuz dongu onleme. Minimum 15 dakika.
- AI butce dagitimi varsayilan olarak "onerilen" modda calisir (kullanici onayi gerekir). "Otomatik" mod icin acik kullanici tercihi sarti aranir.
- Pagination: cursor-based (`created_at, id` cifti) — offset yasak.
- Write islemleri (pause, budget adjust vb.) `ad-orchestrator` servis katmani uzerinden yapilir.
- Audit log: kural olusturma, tetiklenme, butce degisikligi, otomatik aksiyon gibi islemler loglanir.

## Guvenlik Notlari

- Tum otomasyon verileri tenant-scoped (RLS zorunlu).
- Kural aksiyonlari tenant izolasyonlu — bir tenant baska tenant'in kampanyalarina aksiyon alamaz.
- Otomatik write islemleri (pause, budget adjust) icin rate limiting (tenant bazli, 100 aksiyon/saat).
- AI otomatik butce dagitimi icin kullanici onayi varsayilan (auto mod acik tercih gerektirir).
- Kural degisiklikleri (olusturma, guncelleme, silme) audit.events tablosuna yazilir (append-only).
- LLM API cagrilari rate limited (instructor cagrilari: 20 req/dk per tenant).
- Cooldown bypass YASAK — cooldown suresi 0 olamaz (minimum: 15 dakika).
