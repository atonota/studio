# Entity Relationship Diagram — atonota Core Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                        core schema                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐    │
│  │   tenants     │       │  auth_users   │       │   plugins     │    │
│  ├──────────────┤       ├──────────────┤       ├──────────────┤    │
│  │ id     BIGSER│       │ id       UUID│       │ id     BIGSER│    │
│  │ uid    UUID7 │◄──┐   │ email   STR  │       │ uid    UUID7 │    │
│  │ name   STR   │   │   │ hashed_pw    │       │ slug   STR ◄─┐   │
│  │ slug   STR U │   │   │ full_name    │       │ name   STR   │   │
│  │ domain STR   │   │   │ tenant_id ──►│───┘   │ version STR  │   │
│  │ plan   STR   │   │   │ role    STR  │       │ category STR │   │
│  │ settings JSONB│   │   │ is_active    │       │ is_public    │   │
│  │ is_active    │   │   │ is_superuser │       │ metadata JSONB│   │
│  │ timestamps   │   │   └──────────────┘       │ timestamps   │   │
│  └──────────────┘   │                           └──────────────┘   │
│        │            │                                  │           │
│        │ 1:N        │ tenant_id                        │           │
│        ▼            │                                  │           │
│  ┌──────────────┐   │   ┌──────────────┐              │           │
│  │  workspaces   │   │   │   licenses    │              │           │
│  ├──────────────┤   │   ├──────────────┤              │           │
│  │ id     BIGSER│   │   │ id     BIGSER│              │           │
│  │ uid    UUID7 │   │   │ uid    UUID7 │              │           │
│  │ tenant_id ──►│───┘   │ tenant_id ──►│──────────────┘           │
│  │ name   STR   │       │ plugin_uid ──►───────────────┘           │
│  │ url    STR   │       │ license_key U│                           │
│  │ platform STR │       │ status  STR  │                           │
│  │ is_active    │       │ activated_at │                           │
│  │ timestamps   │       │ expires_at   │                           │
│  └──────────────┘       │ max_sites INT│                           │
│        │                │ timestamps   │                           │
│        │ 1:N            └──────────────┘                           │
│        ▼                                                           │
│  ┌──────────────┐                                                  │
│  │   adapters    │                                                  │
│  ├──────────────┤                                                  │
│  │ id     BIGSER│                                                  │
│  │ uid    UUID7 │                                                  │
│  │ workspace_uid│                                                  │
│  │ platform STR │                                                  │
│  │ adapter_ver  │                                                  │
│  │ credentials  │  (JSONB, encrypted)                              │
│  │ status  STR  │                                                  │
│  │ last_health  │                                                  │
│  │ timestamps   │                                                  │
│  └──────────────┘                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        audit schema                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐                                                  │
│  │   events      │  (append-only, NO soft delete)                   │
│  ├──────────────┤                                                  │
│  │ id     BIGSER│                                                  │
│  │ uid    UUID7 │                                                  │
│  │ tenant_id    │                                                  │
│  │ actor_id     │                                                  │
│  │ action  STR  │  ("tenant.create", "plugin.activate", ...)       │
│  │ resource_type│                                                  │
│  │ resource_id  │                                                  │
│  │ metadata JSONB│                                                 │
│  │ ip_address   │                                                  │
│  │ created_at   │  (only timestamp, no update/delete)              │
│  └──────────────┘                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Kararlar

| Karar | Gerekce |
|-------|---------|
| Dual PK (BIGSERIAL + UUID v7) | BIGSERIAL: join performansi. UUID v7: external API, siralama |
| JSONB settings/metadata | Esnek config, schema migration gerektirmez |
| RLS per tenant | `SET LOCAL app.current_tenant_id` ile row-level isolation |
| Soft delete (deleted_at) | Hard delete yasak, veri kaybi onlenir |
| Append-only audit | events tablosunda UPDATE/DELETE yok |
| credentials JSONB | Platform bazli farkli credential yapilari |

## Index Stratejisi

| Tablo | Index | Tip |
|-------|-------|-----|
| Tum tenant-scoped | (tenant_id, created_at) | Composite |
| users | (tenant_id, email) WHERE deleted_at IS NULL | Partial unique |
| plugins | (slug) WHERE deleted_at IS NULL | Partial unique |
| adapters | (workspace_uid, created_at) | Composite |
| audit.events | (tenant_id, created_at) | Composite |

## Gelecek Schemalar (henuz implement edilmedi)

| Schema | Amac | Tablolar |
|--------|------|----------|
| crm | Musteri yonetimi | contacts, companies, pipelines, deals |
| tickets | Destek talepleri | tickets, comments, sla_policies |
| analytics | SEO metrikleri | metrics, reports, funnels |
| billing | Abonelik/fatura | subscriptions, invoices, payments |
| telemetry | Plugin check-in | checkins, signals, platform_events |
| vector | Embedding'ler | embeddings (pgvector) |
