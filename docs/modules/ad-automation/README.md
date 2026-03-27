# Module 27: ad-automation

> Kural bazli reklam otomasyon motoru — IF/THEN tetikleyiciler, otomatik butce
> kaydirma, smart pause/enable, cross-channel budget optimizer, alert sistemi.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `ad-automation` |
| Oncelik | P1 |
| Faz | Faz 8 (Reklam) |
| Bagimlillik | ad-orchestrator, ad-reporting |
| Roller | SA/TO/TA→tam, AN→salt okunur, VW→yok |
| ECharts | Timeline (kural tetiklenme gecmisi), before/after bar (optimizasyon etkisi) |

## Amac

`ad-automation` modulu, reklam platformlari uzerinde kural bazli otomasyon saglar.
Kullanici IF/THEN kurallari tanimlar, sistem metrikleri izler ve kosullar
saglandiginda otomatik aksiyon alir. AI destekli predictive budget allocation
ile platformlar arasi butce dagitimini optimize eder.

**NOT**: Bu modul CLAUDE.md'deki eski "Otomasyon workflow motoru" yasakindan
FARKLIDIR. O yasak Klaviyo/ActiveCampaign tarzi e-posta/nurturing otomasyonunu
hedefliyordu. Bu modul reklam platform API'leri uzerinden kampanya optimizasyon
otomasyonu yapar — aksiyon yalnizca reklam platformlarinda gerceklesir.

## AI Yetenekleri

| # | Yetenek | Aciklama |
|---|---------|---------|
| 1 | **Predictive Budget Allocation** | AI gelecek performansi tahmin ederek butceyi platformlar arasi dagitir. ROAS/CPA hedefine gore optimal split. |
| 2 | **Auto-Pause Underperforming** | Dusuk performansli reklam/kampanyalari otomatik durdurma. Cooldown suresi ile false positive onleme. |
| 3 | **Smart Bidding Onerisi** | Platform ve hedef bazli optimal teklif stratejisi secimi. Google Target CPA ≈ Meta Cost Cap ≈ TikTok Cost Cap esleme. |
| 4 | **A/B Test Onerisi** | Hangi degiskenlerin (baslik, gorsel, hedef kitle, teklif) test edilmesi gerektigini AI ile tespit. |
| 5 | **Budget Pacing Alert** | Butce tukenmesi veya dusuk harcama erken uyari. Gunluk/haftalik pacing tahmin. |
| 6 | **Anomali Bazli Tetikleme** | Normal performans araligini ogrenip, sapma oldugunda otomatik kural tetikleme. |

## Kural Motoru

### Kural Yapisi

```
KURAL: [Ad] [Aciklama]

EGER (IF):
  [metrik] [operator] [esik] [pencere]
  VE/VEYA
  [metrik] [operator] [esik] [pencere]

O ZAMAN (THEN):
  [aksiyon] [parametreler]

BEKLEME (COOLDOWN):
  [sure] dakika (tekrar tetiklenme bekleme)
```

### Desteklenen Metrikler

| Metrik | Aciklama | Birim |
|--------|---------|-------|
| `cpc` | Cost Per Click | para birimi |
| `cpa` | Cost Per Acquisition | para birimi |
| `roas` | Return on Ad Spend | oran (x.xx) |
| `ctr` | Click-Through Rate | yuzde (%) |
| `impression_share` | Gosterim Payi | yuzde (%) |
| `spend` | Toplam Harcama | para birimi |
| `spend_pacing` | Butce Kullanim Hizi | yuzde (%) |
| `conversion_rate` | Donusum Orani | yuzde (%) |
| `frequency` | Ortalama Gosterim Sikligi | sayi |
| `quality_score` | Kalite Skoru (Google) | 1-10 |

### Desteklenen Operatorler

`>` (buyuk), `<` (kucuk), `>=` (buyuk esit), `<=` (kucuk esit), `=` (esit), `change_pct` (degisim %)

### Desteklenen Aksiyonlar

| Aksiyon | Parametreler | Aciklama |
|---------|-------------|---------|
| `pause_campaign` | campaign_id | Kampanyayi durdur |
| `enable_campaign` | campaign_id | Kampanyayi baslat |
| `pause_ad` | ad_id | Reklami durdur |
| `adjust_budget` | +/-% veya +/-miktar | Butce ayarla |
| `adjust_bid` | +/-% veya +/-miktar | Teklif ayarla |
| `shift_budget` | from_platform, to_platform, miktar/% | Butceyi platformlar arasi kaydir |
| `send_alert` | kanal (in_app, email, webhook) | Bildirim gonder |
| `create_report` | template_id | Otomatik rapor olustur |

### Ornek Kurallar

```
Kural: CPC Cok Yuksek
  EGER: cpc > 5.00 TRY (son 24 saat)
  O ZAMAN: adjust_bid(-10%)
  BEKLEME: 120 dakika

Kural: ROAS Dusuk Platform Kaydirma
  EGER: roas < 2.0 (son 7 gun) VE spend > 1000 TRY
  O ZAMAN: shift_budget(from=meta, to=google, 20%)
  BEKLEME: 1440 dakika (24 saat)

Kural: Butce Tukeniyor
  EGER: spend_pacing > 120% (bugun)
  O ZAMAN: send_alert(in_app, email) VE adjust_budget(-15%)
  BEKLEME: 60 dakika
```

## Sayfalar

| Sayfa | URL | Aciklama |
|-------|-----|---------|
| Kural Listesi | /ads/rules | Tum kurallar, aktif/pasif durumu, son tetiklenme |
| Kural Olustur | /ads/rules/create | IF/THEN builder, metrik/operator/aksiyon secimi |
| Kural Detay | /ads/rules/{id} | Tetiklenme gecmisi, performans etkisi, duzenleme |
| Alert Listesi | /ads/alerts | Kural tetiklenme bildirimleri, onay/red |
| Budget Optimizer | /ads/budget-optimizer | AI cross-channel butce dagitim onerisi |

## Dosya Yapisi

```
app/api/v1/modules/ads/
  automation_routes.py       <- kural CRUD endpoint'leri
  automation_schemas.py      <- Pydantic kural/aksiyon semalari
app/services/ads/
  rule_engine.py             <- kural degerlendirme motoru
  budget_optimizer.py        <- AI butce dagitim
  alert_service.py           <- bildirim gonderimleri
app/tasks/ads/
  evaluate_rules.py          <- Celery Beat: periyodik kural kontrolu
  budget_rebalance.py        <- Celery: AI butce rebalance
templates/modules/ads/
  pages/
    rule-list.html
    rule-create.html
    rule-detail.html
    alert-list.html
    budget-optimizer.html
  partials/
    rule-table.html
    rule-form.html
    rule-history.html
    alert-card.html
    budget-chart.html
```

## Veritabani Tablolari

```
ads.automation_rules
  id, uid, tenant_id, name, description,
  conditions (JSONB), actions (JSONB),
  cooldown_minutes, is_active, last_triggered_at,
  trigger_count, created_at, updated_at, deleted_at

ads.rule_executions (append-only log)
  id, uid, rule_id, tenant_id,
  trigger_reason (JSONB), actions_taken (JSONB),
  status (success/failed/skipped), error_message,
  before_state (JSONB), after_state (JSONB),
  created_at

ads.budget_recommendations
  id, uid, tenant_id, workspace_uid,
  recommendation_type (shift/increase/decrease),
  from_platform, to_platform, amount, currency,
  confidence_score, reasoning (TEXT),
  status (pending/accepted/rejected/expired),
  created_at, updated_at, deleted_at
```
