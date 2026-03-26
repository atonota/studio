# CLAUDE.md — atonota Platform Talimatnamesi

> Tek kaynak gerçek. Her AI oturumunda okunur. Hiçbir kural tartışmaya açık değildir.
> Bu dosyayı değiştiren her geliştirici tarih ve değişiklik özeti ekler.
> Son güncelleme: 2026-03

---

## 1. PROJE KİMLİĞİ

```
Ad             : atonota
Domain         : atonota.com
Repo           : https://github.com/atonota
Lokal path     : /Users/karaca/Documents/atonota
Geliştirme     : macOS M4 (Apple Silicon, arm64)
Production     : Hetzner · Debian · AMD EPYC (amd64)
Ekip           : 12 kişi — vibecoding metodolojisi
Vizyon ufku    : 2030–2035
```

---

## 2. PLATFORM TANIMI

atonota, **WordPress öncelikli** başlayan ve **83+ web platformuna** (Shopify, Drupal,
Magento, Webflow ve diğerleri) açılan çok platformlu bir **pazarlama zekası platformudur.**

Platform; SEO analitiği, içerik optimizasyonu, web analitiği, performans, güvenlik, reklam
pikselleri, sosyal medya, CRM ve e-ticaret pazarlamasını tek ekosistemde birleştirir.
Analiz üretir — kampanya icra etmez.

**21 ek "walled garden" platformu** SaaS API adaptörleri üzerinden desteklenir.

---

## 3. MİMARİ: ÜÇ KATMAN

```
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 1 — Developer Studio (Harici SaaS Panel)                  │
│  FastAPI · HTMX 2 · Alpine.js · Flowbite Pro · Jinja2           │
│  Geliştirici ekibinin operasyon merkezi                          │
│  Tüm tenant'ları, lisansları, adaptörleri ve telemetriyi yönetir │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2 — Intelligence Core (Platform-agnostik API)             │
│  FastAPI · SQLAlchemy 2.x async · Celery · pgvector             │
│  Headless SEO Intelligence API — platform ne olursa olsun çalışır│
│  Platform adaptor sistemi, multi-tenant şema, SDK'lar burada     │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Platform Adaptörleri + Client Panel                   │
│                                                                  │
│  WordPress (öncelik)          Shopify / Drupal / diğerleri       │
│  PHP 8.1+ OOP plugin    <-->  SaaS API adaptörü                  │
│  Client Panel (Vanilla JS                                        │
│  + Flowbite Pro CDN)                                             │
└──────────────────────────────────────────────────────────────────┘
```

### Teslimat Yüzeyleri

| # | Yüzey | Teknoloji | Hedef |
|---|---|---|---|
| 1 | Website entegre eklentiler/modüller | Platform adaptor sistemi | Kurulum yapılan site |
| 2 | Developer Studio (SaaS paneli) | FastAPI + HTMX + Flowbite Pro | Geliştirici ekibi |
| 3 | Chrome uzantısı | Manifest V3 | Analist kullanıcı |

### İnşa Öncelik Sırası (Değiştirilemez)

```
1. Intelligence Core API      <- adaptor sözleşmesi önce tanımlanır
2. PostgreSQL şema + RLS      <- multi-tenant altyapı
3. Developer Studio           <- HTMX partial map'e göre
4. WordPress Adaptörü         <- ilk platform
5. Client Panel               <- WordPress admin embed
6. Chrome Uzantısı            <- Manifest V3
7. Plugin Marketplace         <- iki taraflı topluluk modülü
8. Diğer platform adaptörleri <- Shopify, Drupal, Magento...
```

Core olmadan SaaS panelinin yönetecek bir şeyi yoktur. Bu sıra katıdır.

---

## 4. TEKNİK YIĞIN (SAPMAZ)

### 4.1 Backend — Intelligence Core & Developer Studio API

```
Runtime        : Python 3.12.x  (3.13 ML ekosistemi henüz hazır değil)
Framework      : FastAPI >= 0.133  (async-native, OpenAPI yerleşik)
ORM            : SQLAlchemy 2.x async  (Core + ORM hybrid)
Migration      : Alembic  (populated downgrade zorunlu, boş bırakılamaz)
Auth           : FastAPI-Users
Task Queue     : Celery + Celery Beat  (SaaS/Core)
Scheduler      : APScheduler  (tek kullanıcı pipeline aracı — Redis gereksiz)
Cache          : Redis
HTTP           : httpx >= 0.28  (async, HTTP/2)
GraphQL        : Strawberry  (FastAPI entegre, karmaşık sorgular için)
AI/LLM         : instructor >= 1.14 + anthropic + openai + google-generativeai
Embeddings     : pgvector (ayrı vektör DB yasak)
SSE            : sse-starlette >= 2.0
Email          : Resend
Storage        : boto3  (S3-compatible)
Rate Limit     : slowapi
Monitoring     : Sentry + structlog
```

### 4.2 Developer Studio Frontend

```
Template       : Jinja2 >= 3.1
Interaktivite  : HTMX >= 2.0  (form, list, partial refresh)
Reaktivite     : Alpine.js  (local state, toggle, dropdown)
UI Kit         : Flowbite Pro  (lisanslı, CDN üzerinden)
CSS            : Tailwind CDN  (Flowbite içinde)
Grafikler      : ECharts 5 CDN  (radar, heatmap, funnel, treemap)
Icons          : Phosphor Icons CDN  (SVG, birinci öncelik)
Bundler        : YOK  (build tool yasak — vibecoding prensibi)
Routing        : Server-side (FastAPI route'ları)
```

### 4.3 Client Panel (WordPress Admin Embed)

```
Stack          : Vanilla JS (ES6 modül pattern) + Flowbite Pro CDN
Bundler        : YOK
Routing        : History API
Theme          : Dark shell  (default)
Icons          : Phosphor Icons CDN
Design         : CSS custom properties  (token sistemi)
```

### 4.4 WordPress PHP Plugin (Core Adaptor)

```
Min WordPress  : 6.0+
Min PHP        : 8.1+
Namespace      : Atonota\Core\...
Pattern        : Singleton + DI container
declare        : strict_types=1  (her dosyada)
DB             : $wpdb->prepare()  (her sorguda, istisnasız)
Security       : nonce + current_user_can() + sanitize/escape (ayrı fonksiyon)
i18n           : .pot / .po / .mo  (languages/ klasörü)
Test           : PHPUnit + WP_UnitTestCase + WP-CLI
```

### 4.5 Veritabanı

```
Engine         : PostgreSQL 17+  (CVE-2024-10976 zorunlu)
Extension      : pgvector >= 0.4.2, TimescaleDB
RLS            : tüm multi-tenant tablolarda zorunlu

Logical schema bölümü:
  core         — tenant, plugin, lisans, workspace, adaptor
  crm          — müşteri, iletişim, pipeline
  tickets      — destek talepleri, öncelik, SLA
  analytics    — SEO metrikleri, performans, funnel
  billing      — abonelik, fatura, ödeme geçmişi
  audit        — değişiklik logu (append-only)
  telemetry    — plugin check-in, platform sinyal verileri
  vector       — pgvector embedding'leri
```

### 4.6 Altyapı

```
CI/CD          : GitHub Actions
Registry       : GHCR (GitHub Container Registry)
Reverse Proxy  : nginx
Container      : Docker  ->  SADECE linux/amd64, GitHub Actions'da build
Secrets (prod) : /etc/app/secrets/.env  (izin 600, deploy script dokunmaz)
Secrets (CI)   : GitHub Actions Secrets
Staging        : Hetzner (ayrı instance)
```

---

## 5. YASAKLAR (ASLA ÖNERME)

```
YASAK                   GEREKÇE
----------------------------------------------------------------------
Next.js                 App Router Server/Client belirsizliği vibecoding anti-pattern
React (standalone SPA)  HTMX + Alpine.js yeterli, bundler istemiyoruz
Supabase                PostgreSQL + SQLAlchemy kullan
SQLModel                SQLAlchemy 2.x async tercih edildi
Tortoise ORM            Düşük AI eğitim verisi, vibecoding uyumsuz
Dramatiq                Celery tercih edildi
Beanie                  MongoDB ORM, stack dışı
Pinecone / Weaviate     pgvector yeterli, ayrı vektör DB yasak
sentence-transformers   PyTorch ~2GB ek yük, OpenAI embedding API kullan
offset pagination       cursor-based zorunlu
hard delete             soft delete (deleted_at) zorunlu
global PHP fonk.        namespace + class zorunlu
Secrets koda yazma      /etc/app/secrets/.env dışında saklanmaz
Docker local build      GitHub Actions -> linux/amd64 -> GHCR -> deploy
wildcard import         exact import path zorunlu
```

---

## 6. ZORUNLU GELİŞTİRME SIRASI

Her yeni özellik veya modül için sıra değişmez:

```
1. TEST PLANI
   +-- unit · integration · E2E · performance · security kapsamı
   +-- coverage hedefi belirlenir

2. DB ŞEMASI
   +-- tablo tasarımı + index stratejisi
   +-- Alembic migration dosyası
   +-- populated downgrade() zorunlu

3. API KONTRATI
   +-- endpoint URI + HTTP method
   +-- request / response Pydantic şeması
   +-- hata kodları + audit log notu
   +-- idempotency gereksinimleri

4. UYGULAMA
   +-- yukarıdaki plan çerçevesinde kod yazılır

5. REVIEW
   +-- lint · type check · coverage kontrolü -> CI geçmeden merge yok
```

---

## 7. VERİTABANI STANDARTLARI

| Kural | Detay |
|---|---|
| Primary Key | `UUID v7` (sıralı, user-facing) · `BIGSERIAL` (internal join performansı) |
| Timestamp | `created_at TIMESTAMPTZ` · `updated_at TIMESTAMPTZ` (trigger) · `deleted_at TIMESTAMPTZ` |
| Soft delete | `deleted_at IS NULL` filtresi zorunlu, hard delete yasak |
| Multi-tenant | `tenant_id UUID NOT NULL` + RLS politikası her tabloda |
| Composite index | `(tenant_id, created_at)` minimum |
| Pagination | Cursor-based (`(created_at, id)` çifti) — offset yasak |
| Idempotency | Kritik mutation'larda `Idempotency-Key` header zorunlu |
| N+1 sorgu | `selectinload` veya explicit join — lazy load yasak |
| Migration | `downgrade()` boş bırakılamaz, her migration'da populated |
| RLS middleware | `SET app.current_tenant_id = :tid` -> `RESET ALL` (finally bloğu) |

---

## 8. DEPLOYMENT AKIŞI

```
localhost
  |  git push
  v
GitHub (private repo)
  |  GitHub Actions tetiklenir
  v
CI Pipeline
  +-- ruff check + ruff format --check  (Python lint)
  +-- mypy app/  (strict type check)
  +-- phpcs + phpstan  (PHP lint)
  +-- pytest --cov=app --cov-fail-under=80
  +-- bandit + semgrep  (güvenlik taraması)
  +-- Docker buildx --platform linux/amd64 -> push GHCR
  |
  v
Staging (Hetzner)
  +-- docker pull + compose up -d
  +-- alembic upgrade head
  +-- GET /healthz  ->  başarısız ise otomatik rollback
  |
  v  [MANUEL ONAY KAPISI — burada dur, onay bekle]
  |
  v
Production (Hetzner)
  +-- pg_dump (snapshot — önce)
  +-- docker pull + compose up -d
  +-- alembic upgrade head
  +-- GET /healthz  ->  başarısız ise otomatik rollback + restore
  +-- sentry-cli releases finalize $VERSION
```

---

## 9. GÜVENLİK KURALLARI

```
RLS            : uygulama DB kullanıcısı asla superuser değil
JWT flow       : token -> middleware -> SET app.current_tenant_id -> RESET ALL
PgBouncer      : transaction mode + her bağlantıda DISCARD ALL
Plugin scope   : plugin'ler tenant context'ini devralamaz (ayrı OAuth scope)
CORS           : whitelist only — wildcard (*) yasak
Rate limit     : tenant bazlı + plugin bazlı (çift katman, slowapi)
Audit log      : her kritik işlem audit.events tablosuna yazılır (append-only)
Validation     : Pydantic v2 (Python) · sanitize_text_field + esc_html (PHP)
Secrets        : asla koda gömme, asla .env commit etme
```

---

## 10. TEST STRATEJİSİ

### Python

```
Araç           : pytest + pytest-asyncio
Coverage       : %80 branch minimum (CI enforce)
Unit           : her servis fonksiyonu izole
Integration    : gerçek PostgreSQL (testcontainers) + httpx AsyncClient
E2E            : Playwright (kritik Studio akışları)
Performance    : p95 < 200ms kritik endpointlerde
Security       : bandit + semgrep (CI'da otomatik)
Contract       : OpenAPI schema validasyonu (provider-side)
```

### PHP

```
Araç           : PHPUnit + WP_UnitTestCase
Unit           : her class metodu
Integration    : WordPress test suite
E2E            : Cypress (admin panel)
Coverage       : %70 minimum
```

### CI Sırası

```
1. ruff + mypy           <- Python lint/type
2. phpcs + phpstan       <- PHP lint/type
3. pytest                <- unit + integration
4. bandit + semgrep      <- güvenlik taraması
5. Docker build check    <- linux/amd64
6. Playwright/Cypress    <- staging sonrası E2E
```

---

## 11. API KONTRATI ŞABLONU

Yeni endpoint eklerken bu format zorunlu:

```
ENDPOINT   : POST /api/v1/plugins/{slug}/activate
AUTH       : Bearer JWT  (studio_admin role)
RATE       : 10 req/min per tenant

REQUEST
  slug     : string (path, required)
  force    : boolean (body, optional, default: false)

RESPONSE 200
  plugin_id     : UUID
  status        : "active"
  activated_at  : ISO8601

ERRORS
  400  ALREADY_ACTIVE    : zaten aktif
  403  FORBIDDEN         : yetki yok
  404  NOT_FOUND         : plugin bulunamadı
  409  CONFLICT          : başka işlem devam ediyor
  422  VALIDATION_ERROR  : şema hatası
  429  RATE_LIMITED      : rate limit aşıldı

AUDIT      : audit.events  (actor_id, action="plugin.activate", resource_id)
IDEMPOTENT : evet  (Idempotency-Key header ile)
```

---

## 12. KOD KALİTE KURALLARI

### Genel

```
- Fonksiyon başına tek sorumluluk (SRP)
- Tip annotasyonu her yerde (Python: strict mypy · PHP: strict_types=1)
- Magic number yasak — named constant (constants.py veya config.py)
- TODO/FIXME bırakma — ya hemen çöz ya GitHub issue aç
- 120 karakter satır limiti
- Her async fonksiyon için try/except + structlog
```

### Python / FastAPI

```python
# DOGRU — async, typed, response_model explicit
@router.get("/plugins/{plugin_id}", response_model=PluginResponse)
async def get_plugin(
    plugin_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
) -> PluginResponse:
    result = await session.execute(
        select(Plugin).where(Plugin.id == plugin_id)
    )
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return plugin

# YANLIS — sync, tip yok, session sizdiyor
def get_plugin(id):
    return db.query(Plugin).filter(Plugin.id == id).first()
```

### SQLAlchemy 2.x

```python
# DOGRU — async session, 2.x API
result = await session.execute(
    select(Plugin)
    .where(Plugin.tenant_id == tenant_id, Plugin.deleted_at.is_(None))
    .options(selectinload(Plugin.metadata))
    .order_by(Plugin.created_at.desc())
)
plugins = result.scalars().all()

# YANLIS — 1.x API (yasak)
session.query(Plugin).filter(...).all()
```

### PHP / WordPress

```php
<?php
declare(strict_types=1);

namespace Atonota\Core\Admin;

final class PluginManager {
    public function activate(int $plugin_id): bool {
        if (!current_user_can('manage_options')) {
            return false;
        }
        check_admin_referer('atonota_activate_' . $plugin_id);

        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'atonota_plugins',
            ['status' => 'active'],
            ['id'     => $plugin_id],
            ['%s'],
            ['%d']
        );
        return $result !== false;
    }
}
```

### Cursor-Based Pagination

```python
# DOGRU
async def list_plugins(
    cursor: str | None = None,
    limit: int = 20,
    session: AsyncSession = ...,
) -> PluginListResponse:
    query = select(Plugin).where(Plugin.deleted_at.is_(None))
    if cursor:
        cursor_dt, cursor_id = decode_cursor(cursor)
        query = query.where(
            or_(
                Plugin.created_at < cursor_dt,
                and_(Plugin.created_at == cursor_dt, Plugin.id < cursor_id),
            )
        )
    ...

# YANLIS — offset yasak
.offset(page * 20).limit(20)
```

---

## 13. GİT KOMİT KURALLARI

Conventional Commits zorunlu:

```
feat(studio):     plugin bulk activation endpoint eklendi
feat(core):       platform adaptor abstract interface tanımlandı
fix(wp):          nonce validation bypass kapatıldı
test(billing):    subscription webhook idempotency testi eklendi
chore(ci):        GHCR push workflow linux/amd64 hedef güncellendi
docs(api):        plugin CRUD OpenAPI şeması tamamlandı
perf(telemetry):  check-in endpoint p95 200ms altına alındı
```

Branch stratejisi:

```
main      -> production  (doğrudan push yasak)
staging   -> staging ortamı
feat/...  -> özellik dalları
fix/...   -> hata düzeltme dalları
```

---

## 14. PLATFORM ADAPTOR KURALI

`PlatformAdapter` interface sözleşmesi (`docs/ADAPTER_CONTRACT.md`) tanımlanmadan
hiçbir platform adaptörü yazılmaz. Her adaptör bu interface'i eksiksiz implement etmek zorundadır.

```python
# docs/ADAPTER_CONTRACT.md'de tanımlı Python Protocol
class PlatformAdapter(Protocol):
    platform_id: str
    platform_version: str

    async def connect(self, credentials: AdapterCredentials) -> None: ...
    async def health_check(self) -> AdapterHealth: ...
    async def collect_metrics(self, since: datetime) -> list[PlatformMetric]: ...
    async def push_config(self, config: AdapterConfig) -> None: ...
    async def disconnect(self) -> None: ...
```

---

## 15. ASLA YAPILMAYACAKLAR (NEVER BUILD)

Platformun kimliği **zeka üretmek**tir — **aksiyon icra etmek** değil.

```
KAPSAM DISI                 GEREKCE
------------------------------------------------------
Kampanya oluşturma/gönderme HubSpot/Marketo kopyası değiliz
Otomasyon workflow motoru   Klaviyo/ActiveCampaign kopyası değiliz
E-posta altyapısı           SendGrid/Mailgun kopyası değiliz
SMS / WhatsApp gönderimi    TCPA riski: $500-$1,500/ihlal
A/B test icra motoru        Optimizely kopyası değiliz
Kişiselleştirme motoru      Dynamic Yield kopyası değiliz
Ödeme işleme                PCI DSS engeli
Envanter/sipariş yönetimi   ERP kapsam dışı
Canlı sohbet/helpdesk       Intercom kopyası değiliz
```

---

## 16. DOSYA HİYERARŞİSİ

```
atonota/
+-- CLAUDE.md                     <- bu dosya (tek kaynak gerçek)
+-- AGENTS.md                     <- AI ajan talimatları (evrensel)
+-- LEARNINGS.md                  <- görev sonrası öğrenilenler
|
+-- docs/
|   +-- PLATFORM_BRIEF.md         <- tek bağlam dokümanı (AI araştırma)
|   +-- ADAPTER_CONTRACT.md       <- PlatformAdapter Protocol sözleşmesi
|   +-- ERD.md                    <- entity ilişki diyagramı
|   +-- SDK_STRATEGY.md           <- PHP / TS / Python SDK stratejisi
|   +-- HTMX_PARTIAL_MAP.md       <- HTMX endpoint -> partial HTML haritası
|   +-- API_CONTRACT.md           <- tüm endpoint kontratları
|   +-- NEVER_BUILD.md            <- kapsam dışı anayasa
|   +-- glossary.md               <- domain sözlüğü (ubiquitous language)
|
+-- studio/                       <- Developer Studio (FastAPI + HTMX)
|   +-- app/
|   |   +-- api/v1/               <- route handler'lar
|   |   +-- core/                 <- config · security · deps
|   |   +-- models/               <- SQLAlchemy modelleri
|   |   +-- schemas/              <- Pydantic v2 şemaları
|   |   +-- services/             <- iş mantığı
|   |   +-- tasks/                <- Celery task'ları
|   |   +-- graphql/              <- Strawberry schema
|   |   +-- db/                   <- session · base · migrations
|   +-- templates/                <- Jinja2 + HTMX partial'lar
|   +-- static/                   <- Flowbite Pro varlıkları
|   +-- alembic/
|   +-- tests/
|   |   +-- unit/
|   |   +-- integration/
|   |   +-- e2e/
|   +-- Dockerfile
|   +-- pyproject.toml
|
+-- core-plugin/                  <- WordPress PHP Adaptörü
|   +-- atonota-core.php          <- bootstrap only
|   +-- includes/
|   |   +-- class-core.php
|   |   +-- class-api.php         <- Studio REST bridge
|   |   +-- class-adapter.php     <- PlatformAdapter impl.
|   |   +-- class-license.php
|   |   +-- class-updater.php
|   +-- admin/
|   |   +-- views/                <- PHP template'lar
|   |   +-- assets/
|   +-- tests/
|
+-- client-panel/                 <- WordPress Admin Embed UI
|   +-- src/
|   |   +-- js/                   <- ES6 modül pattern, bundlersız
|   +-- assets/
|       +-- css/                  <- CSS custom properties (token sistemi)
|
+-- pipeline/                     <- AI ürün keşif (dahili, tek kullanıcı)
|   +-- app/
|   +-- tests/
|
+-- .github/
|   +-- workflows/
|       +-- ci.yml                <- lint + test + build
|       +-- deploy.yml            <- staging + prod
|
+-- docker/
|   +-- studio.Dockerfile
|   +-- nginx.conf
|
+-- docker-compose.yml            <- lokal dev only
+-- docker-compose.prod.yml
+-- .env.example
```

---

## 17. VİBECODİNG PROTOKOLÜ

AI'ın her oturumda uyması gereken davranış kuralları:

**Sor, tahmin etme**

```
YANLIS: "Bunu Supabase ile yapabiliriz—"
DOGRU : "DB bağlantısı gerekiyor. Stack'ten PostgreSQL + SQLAlchemy
         kullanıyorum, onaylıyor musun?"
```

**Sırayı koru**

```
YANLIS: "Hemen kodu yazayım—"
DOGRU : "Önce test planını çıkarayım, sonra Alembic migration, sonra kod."
```

**Platform farkındalığı**

```
Docker image üretirken:
  - linux/amd64 target — ZORUNLU
  - GitHub Actions workflow'a ekle
  - Local build asla önerme (arm64 != amd64)
```

**Tek sorumluluk**

```
Her PR tek bir şey yapmalı.
"hem X hem Y hem Z ekledim" -> refactor et, ayır.
```

**Yapı göster, dolgu üretme**

```
Şema, tablo, liste -> başlıklar + yapı yeterli, mock data doldurma.
Doğrudan implementasyon yerine -> mimari karar + pattern + edge case ver.
```

---

## 18. HIZLI BAŞLANGIÇ

```bash
# Studio API (lokal dev)
cd studio
cp .env.example .env                    # secrets buraya, asla commit etme
docker compose up -d db redis
uv run alembic upgrade head
uv run fastapi dev app/main.py

# WordPress Plugin
cd core-plugin
composer install
wp server --host=localhost --port=8080

# Testler
cd studio      && uv run pytest --cov=app
cd core-plugin && ./vendor/bin/phpunit

# Docker build dogru yol — local'de CALISTIRMA, CI yapar
# docker buildx build --platform linux/amd64 -t ghcr.io/atonota/studio:latest .
```

---

## 19. SENTRY ENTEGRASYONU

```python
sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    environment=settings.ENVIRONMENT,       # "production" | "staging"
    release=settings.APP_VERSION,
    traces_sample_rate=0.1,
    profiles_sample_rate=0.05,
)
# Deploy sonrasi (CI'da otomatik):
# sentry-cli releases finalize $VERSION
```

---

## 20. DEĞİŞİKLİK KAYDI

Bu dosyayı değiştiren her geliştirici aşağıya satır ekler:

| Tarih | Değişiklik | Geliştirici |
|---|---|---|
| 2026-03 | İlk sürüm — claude.md + CLAUDE2.md birleştirme + Flowbite Pro, HTMX 2, pgvector, multi-platform kapsam | karaca |
