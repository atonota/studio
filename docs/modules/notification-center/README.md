# Module 10: notification-center

> In-app bildirim paneli, e-posta bildirimleri, SSE gercek zamanli uyarilar, anomali alarmlari, ozel kural tanimlama.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `notification-center` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `settings` (bildirim tercihleri), `tenant-manager` |
| Roller | Tum roller (kendi bildirimleri) |
| ECharts | NotificationTrendChart (bar — gunluk bildirim sayisi) |

## Amac

`notification-center` modulu, Developer Studio'daki tum bildirim akisini yonetir. Uc teslimat
kanali desteklenir: in-app (topbar dropdown + tam sayfa liste), e-posta (Resend API), ve webhook
(settings modulunde tanimlanan endpoint'lere). Gercek zamanli bildirimler SSE uzerinden iletilir.

Modul ayni zamanda kullanicilarin kendi bildirim kurallarini tanimlamasina imkan tanir:
"Eger X metrigi Y esigini asarsa, beni Z kanalinda bilgilendir" seklinde ozel alarm kurallari.

## AI Yetenegi

- **Anomali tespiti**: Trafik dususu, siralama kaybi, site erisim sorunu gibi anormal
  durumlari otomatik tespit eder ve bildirim olusturur. `instructor` ile yapilandirilmis
  cikti: `{anomaly_type: str, severity: str, metric: str, expected: float, actual: float}`.

- **Kural onerisi**: Kullanicinin workspace verilerine bakarak "Bu workspace icin su kurali
  tanimlamanizi oneriyoruz" seklinde proaktif oneriler uretir. Ornek: "Organik trafik
  %20'den fazla duserse bildirim al".

- **Ozet olusturma (digest)**: Gunluk veya haftalik bildirim ozetini dogal dil ile olusturur.
  Ornek: "Bu hafta 3 SEO anomalisi, 1 performans uyarisi ve 2 guvenlik alarmi olustu.
  En kritik: example.com'da organik trafik %35 dustu."

- **Onceliklendirme**: Bildirimleri AI ile onceliklendirir. Kritik anomaliler en uste,
  bilgilendirme mesajlari alta. Kullanicinin gecmis etkilesim pattern'ine gore siralama.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Bildirim Listesi | `/notifications` | Tum bildirimler, filtreleme, toplu islem |
| Bildirim Kurallari | `/notifications/rules` | Mevcut kural listesi |
| Kural Olustur | `/notifications/rules/create` | Yeni bildirim kurali tanimlama |

## Bildirim Tipleri

| Tip | Slug | Ciddiyet | Varsayilan Kanal |
|-----|------|----------|------------------|
| SEO Anomalisi | `seo.anomaly` | high | in-app + email |
| Performans Uyarisi | `perf.warning` | medium | in-app |
| Guvenlik Alarmi | `security.alert` | critical | in-app + email + webhook |
| Plugin Guncelleme | `plugin.update` | low | in-app |
| Workspace Durumu | `workspace.status` | medium | in-app |
| Haftalik Ozet | `digest.weekly` | info | email |
| Yeni Kullanici | `user.joined` | low | in-app + email |
| Fatura Bildirimi | `billing.notice` | medium | in-app + email |
| API Limiti | `api.rate_limit` | high | in-app + email + webhook |
| Ozel Kural Tetikleme | `rule.triggered` | degisken | kullanici tercihi |

## Temel Kurallar

- Bildirimler `notification_id` (UUID v7) ile benzersizdir.
- Her bildirim tek bir `user_id` ve `tenant_id` ciftiyle iliskilendirilir (RLS).
- Okunmus/okunmamis durumu `read_at TIMESTAMPTZ` ile takip edilir.
- Bildirimler soft delete ile silinir (`deleted_at`).
- SSE baglantisi `EventSource` ile kurulur, JWT token query param ile iletilir.
- Bildirim kurallari tenant bazlidir, olusturan kullanici kaydedilir.
- Kural degerlendirmesi Celery Beat ile periyodik olarak yapilir (5 dk aralik).
- E-posta bildirimleri Resend API uzerinden gonderilir, rate limit tenant bazli.

## Veri Modeli (Ozet)

```
core.notifications
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  user_id         UUID NOT NULL
  type            VARCHAR(50) NOT NULL           -- seo.anomaly, security.alert, vb.
  severity        VARCHAR(20) NOT NULL           -- critical | high | medium | low | info
  title           VARCHAR(255) NOT NULL
  body            TEXT
  metadata        JSONB DEFAULT '{}'             -- tip-bazli ek veri
  source_module   VARCHAR(50)                    -- bildirimi ureten modul slug'i
  source_id       UUID                           -- kaynak entity UID
  read_at         TIMESTAMPTZ                    -- NULL = okunmamis
  created_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, user_id, created_at DESC)
  INDEX (tenant_id, user_id, read_at)            -- okunmamis sorgusu icin
  INDEX (type)

core.notification_rules
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  created_by      UUID NOT NULL                  -- kuralı olusturan kullanici
  name            VARCHAR(100) NOT NULL
  description     TEXT
  conditions      JSONB NOT NULL                 -- [{metric, operator, threshold}]
  actions         JSONB NOT NULL                 -- [{channel, config}]
  is_active       BOOLEAN DEFAULT true
  cooldown_minutes INT DEFAULT 60                -- ayni kural icin tekrar tetikleme suresi
  last_triggered_at TIMESTAMPTZ
  trigger_count   INT DEFAULT 0
  created_at      TIMESTAMPTZ NOT NULL
  updated_at      TIMESTAMPTZ NOT NULL
  deleted_at      TIMESTAMPTZ

  INDEX (tenant_id, is_active)
  INDEX (tenant_id, created_at)
```

## Dosya Yapisi

```
studio/
  app/api/v1/modules/notification/
    __init__.py
    routes.py              <- sayfa + API + SSE endpoint'leri
    schemas.py             <- NotificationResponse, RuleCreate, RuleCondition
    sse.py                 <- SSE stream handler
  app/models/notification/
    notification.py        <- Notification modeli
    notification_rule.py   <- NotificationRule modeli
  app/services/notification/
    notification_service.py   <- bildirim CRUD + toplu islem
    rule_service.py           <- kural CRUD + degerlendirme
    rule_evaluator.py         <- kural kosul motoru
    digest_service.py         <- gunluk/haftalik ozet olusturma (AI)
    anomaly_detector.py       <- AI anomali tespit servisi
    channel_dispatcher.py     <- kanal bazli gonderim (in-app, email, webhook)
    priority_scorer.py        <- AI bildirim onceliklendirme
  app/tasks/notification/
    rule_evaluation.py     <- Celery Beat: kural degerlendirme (5 dk)
    digest_generation.py   <- Celery Beat: gunluk/haftalik ozet
    email_dispatch.py      <- e-posta gonderim task'i
    webhook_dispatch.py    <- webhook gonderim task'i
    cleanup.py             <- 90 gunluk eski bildirimleri soft delete
  templates/modules/notification/
    pages/
      notification-list.html
      notification-rules.html
      rule-create.html
    partials/
      notification-cards.html
      notification-dropdown.html
      badge.html
      rule-table.html
      rule-form.html
    components/
      notification-card.html
      notification-badge.html
      rule-condition-row.html
      rule-action-row.html
      severity-badge.html
```

## SSE Entegrasyonu

```
Endpoint     : GET /api/v1/notifications/stream
Auth         : JWT token (query param: ?token=xxx)
Content-Type : text/event-stream
Heartbeat    : 30 saniyede bir ":keepalive" yorum satiri

Event Format:
  event: notification
  data: {"uid": "...", "type": "seo.anomaly", "severity": "high",
         "title": "...", "body": "...", "created_at": "..."}

  event: badge-update
  data: {"unread_count": 5}
```

SSE baglantisi sayfa yuklenirken `hx-ext="sse"` ile kurulur:

```html
<div hx-ext="sse"
     sse-connect="/api/v1/notifications/stream?token={{ jwt_token }}"
     sse-swap="notification"
     hx-target="#notification-live-area">
</div>
```

## Guvenlik Notlari

- SSE endpoint'i JWT dogrulamasi gerektirir (query param, cunku EventSource header gonderemez).
- JWT token SSE icin kisa omurlu olabilir (15 dk), sunucu tarafinda yenileme mekanizmasi.
- Bildirim kurallari tenant bazli, kullanici yalnizca kendi tenant'inin kurallarini gorebilir.
- Kural kosul degerleri sanitize edilir (SQL injection onleme — degerler parametrik sorguya alinir).
- E-posta gonderim hizi: tenant bazli 100 email/saat limiti.
- Webhook gonderimi HMAC-SHA256 ile imzalanir (secret, settings modulunde tanimlanan).
- Audit log: kural olusturma/silme, toplu okundu isareti.
