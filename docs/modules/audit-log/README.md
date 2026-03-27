# Module 11: audit-log

> Append-only kritik islem log goruntuleyici, filtreleme, arama. Uyumluluk gereksinimi.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `audit-log` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 2 (Core Moduller) |
| Bagimlillik | `auth`, `tenant-manager` |
| Roller | `tenant_owner`, `studio_admin` (salt okunur erisim) |
| ECharts | ActivityTimelineChart (bar — gunluk islem sayisi) |

## Amac

`audit-log` modulu, tenant icindeki tum kritik islemlerin kayit altina alinmasini ve
goruntulenmesini saglar. `audit.events` tablosu append-only olarak tasarlanmistir —
kayitlar asla guncellenmez veya silinmez. Bu modul uyumluluk (compliance), guvenlik
denetimi ve operasyonel seffaflik icin temel gereksinimdir.

Tum kritik aksiyonlar (tenant.create, plugin.activate, user.invite, settings.password_change,
api_key.create vb.) otomatik olarak bu tabloya yazilir. Audit modulu yalnizca okuma
ve raporlama saglar — yazma islemi diger moduller tarafindan yapilir.

## AI Yetenegi

- **Davranissal anomali tespiti**: Olagan disi kullanici aktivite pattern'lerini tespit eder.
  Ornek: "kullanici X normalde 09:00-18:00 arasi aktifken, bugun 03:00'te 47 islem yapmis."
  `instructor` ile yapilandirilmis cikti:
  `{anomaly_type: str, actor_id: UUID, normal_pattern: str, detected_pattern: str, risk_level: str}`.

- **Log ozeti olusturma**: Belirli bir zaman araligi icin dogal dil ozeti uretir.
  Ornek: "Son 24 saatte 5 kullanici toplam 127 islem yapti. En aktif kullanici: ahmet@atonota.com
  (68 islem). En sik aksiyon: workspace.update (42 kez). Dikkat: 3 basarisiz API key silme denemesi."

- **Dogal dil sorgusu**: Kullanicinin "dun kimler yeni workspace olusturdur?" gibi sorularini
  yapilandirilmis filtreye cevirir. `instructor` ile sorgulari
  `{action_filter: str, actor_filter: str, date_range: tuple, resource_filter: str}` formatina donusturur.

- **Trend analizi**: Haftalar arasi islem hacmi degisimini analiz eder, anormal artis/azalislari raporlar.

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Audit Listesi | `/audit` | Filtrelenebilir tablo + aktivite zaman cizgisi |
| Audit Detay | `/audit/{event_uid}` | Modal overlay — tam metadata gorunumu |

## Audit Olay Kategorileri

| Kategori | Ornek Aksiyonlar |
|----------|------------------|
| auth | login, logout, register, 2fa_enable, 2fa_disable, password_change |
| tenant | create, update, delete, member_invite, member_remove, role_change |
| workspace | create, update, delete, adaptor_connect, adaptor_disconnect |
| plugin | activate, deactivate, update, install, uninstall |
| settings | profile_update, api_key_create, api_key_delete, webhook_create |
| notification | rule_create, rule_delete, mark_all_read |
| billing | subscription_create, subscription_cancel, invoice_paid |
| security | ip_block, brute_force_detect, suspicious_login |

## Temel Kurallar

- Audit tablosu append-only: UPDATE ve DELETE SQL komutlari DB seviyesinde engellidir.
- Her kayit immutable: olusturulduktan sonra degistirilemez.
- Audit kayitlari RLS ile tenant bazli filtrelenir.
- Audit verisi asla hard delete edilmez (uyumluluk gereksinimi).
- Retention policy: varsayilan 2 yil (tenant bazli yapilandirma mumkun).
- Arama full-text search (PostgreSQL tsvector) ile yapilir.
- Detay modali tam sayfa degil, overlay/modal olarak acilir (hx-get ile).
- AI ozet olusturma istek basina rate limit: 5 req/dk per tenant.

## Veri Modeli (Ozet)

```
audit.events
  id              BIGSERIAL PRIMARY KEY
  uid             UUID v7 UNIQUE NOT NULL
  tenant_id       UUID NOT NULL (RLS)
  actor_id        UUID                           -- islemi yapan kullanici (NULL = sistem)
  actor_email     VARCHAR(255)                   -- denormalize — gecmis kayitlarda referans
  actor_ip        INET
  actor_user_agent TEXT
  action          VARCHAR(100) NOT NULL           -- "auth.login", "workspace.create" vb.
  resource_type   VARCHAR(50)                     -- "workspace", "plugin", "api_key" vb.
  resource_id     UUID                            -- etkilenen kaynak UID
  resource_label  VARCHAR(255)                    -- insan okunabilir etiket (denormalize)
  metadata        JSONB DEFAULT '{}'              -- aksiyon bazli ek veri
  result          VARCHAR(20) DEFAULT 'success'   -- success | failure | error
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

  -- Indeksler
  INDEX (tenant_id, created_at DESC)              -- ana listeleme sorgusu
  INDEX (tenant_id, action)                        -- aksiyon bazli filtre
  INDEX (tenant_id, actor_id, created_at DESC)     -- kullanici bazli filtre
  INDEX (tenant_id, resource_type, resource_id)    -- kaynak bazli filtre
  INDEX (created_at)                               -- retention policy icin

  -- Full-text search
  INDEX USING GIN (to_tsvector('turkish', action || ' ' || coalesce(resource_label, '')))

  -- Immutability constraint (DB seviyesinde)
  -- TRIGGER: BEFORE UPDATE OR DELETE -> RAISE EXCEPTION 'audit.events is append-only'
```

**Not**: `audit.events` tablosu diger moduller tarafindan yazilir. Bu modul yalnizca
okuma ve raporlama saglar. Yazma islemi `app/services/audit/audit_writer.py` servisi
tarafindan merkezi olarak yapilir (tum moduller bu servisi kullanir).

## Dosya Yapisi

```
studio/
  app/api/v1/modules/audit/
    __init__.py
    routes.py              <- sayfa + API endpoint'leri
    schemas.py             <- AuditEventResponse, AuditFilterParams, AuditSummary
  app/models/audit/
    audit_event.py         <- AuditEvent modeli (salt okunur)
  app/services/audit/
    audit_reader.py        <- listeleme, filtreleme, cursor pagination
    audit_writer.py        <- merkezi yazma servisi (diger moduller kullanir)
    audit_search.py        <- full-text arama
    audit_summarizer.py    <- AI ozet olusturma (instructor)
    anomaly_detector.py    <- davranissal anomali tespiti
    natural_query.py       <- dogal dil -> yapilandirilmis filtre cevirici
  app/tasks/audit/
    daily_summary.py       <- gunluk ozet olusturma (Celery Beat)
    anomaly_scan.py        <- saatlik anomali tarama (Celery Beat)
  templates/modules/audit/
    pages/
      audit-list.html
    partials/
      audit-table.html
      audit-detail-modal.html
      activity-timeline.html
      audit-summary-card.html
      audit-filters.html
    components/
      audit-row.html
      action-badge.html
      result-badge.html
      metadata-viewer.html
      natural-query-input.html
```

## Guvenlik Notlari

- Audit tablosuna yalnizca INSERT izni olan ayri bir DB rolu (`audit_writer`) kullanilir.
- Studio uygulamasi audit tablosunda UPDATE/DELETE yapamaz (DB trigger engeli).
- RLS politikasi: tenant yalnizca kendi kayitlarini gorebilir.
- Audit okuma erisimi yalnizca `tenant_owner` ve `studio_admin` rollerine aciktir.
- Actor IP adresi ve User-Agent her kayitta saklanir (forensic analiz icin).
- Metadata alaninda hassas veri (parola, token vb.) asla saklanmaz.
- AI ozet olusturma rate limited: 5 req/dk per tenant.
- Audit verileri export edilebilir (CSV), ancak rate limited: 1 export/saat per tenant.
