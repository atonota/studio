# API Contract — atonota Studio v1

> Tüm endpoint'ler `/api/v1` prefix'i altında.
> Auth: Bearer JWT (FastAPI-Users)
> Rate limit: slowapi (tenant bazlı)
> Pagination: cursor-based (offset yasak)

---

## Auth

```
ENDPOINT   : POST /api/v1/auth/login
AUTH       : Public
RATE       : 10 req/min per IP

REQUEST (form-data)
  username : string (email)
  password : string

RESPONSE 200
  access_token  : string (JWT)
  token_type    : "bearer"

ERRORS
  400  LOGIN_BAD_CREDENTIALS
  422  VALIDATION_ERROR
```

```
ENDPOINT   : POST /api/v1/auth/register
AUTH       : Public
RATE       : 5 req/min per IP

REQUEST
  email        : string (required)
  password     : string (required, min 8)
  full_name    : string (optional)
  tenant_id    : string (optional)

RESPONSE 201
  id           : UUID
  email        : string
  is_active    : boolean
  full_name    : string | null

ERRORS
  400  REGISTER_USER_ALREADY_EXISTS
  422  VALIDATION_ERROR
```

---

## Health

```
ENDPOINT   : GET /api/v1/healthz
AUTH       : Public
RATE       : Unlimited

RESPONSE 200
  status       : "ok"
  version      : string
  environment  : string
```

---

## Tenants

```
ENDPOINT   : POST /api/v1/tenants
AUTH       : Bearer JWT (superuser)
RATE       : 30 req/min per tenant

REQUEST
  name        : string (required, max 255)
  slug        : string (required, pattern: ^[a-z0-9-]+$)
  domain      : string (optional)
  plan        : string (default: "free")
  description : string (optional)

RESPONSE 201  -> TenantResponse
ERRORS
  409  SLUG_ALREADY_EXISTS
  422  VALIDATION_ERROR

AUDIT  : audit.events (action="tenant.create")
```

```
ENDPOINT   : GET /api/v1/tenants
AUTH       : Bearer JWT
RATE       : 60 req/min

QUERY
  cursor : string (optional)
  limit  : int (1-100, default 20)

RESPONSE 200
  items   : TenantResponse[]
  cursor  : { next_cursor: string | null, has_more: boolean }
```

```
ENDPOINT   : GET /api/v1/tenants/{tenant_uid}
AUTH       : Bearer JWT
RESPONSE 200  -> TenantResponse
ERRORS     : 404 NOT_FOUND
```

```
ENDPOINT   : PATCH /api/v1/tenants/{tenant_uid}
AUTH       : Bearer JWT (superuser)

REQUEST (partial)
  name / slug / domain / plan / description / settings / is_active

RESPONSE 200  -> TenantResponse
ERRORS     : 404 NOT_FOUND, 422 VALIDATION_ERROR
AUDIT      : audit.events (action="tenant.update")
```

```
ENDPOINT   : DELETE /api/v1/tenants/{tenant_uid}
AUTH       : Bearer JWT (superuser)
RESPONSE 204
ERRORS     : 404 NOT_FOUND
AUDIT      : audit.events (action="tenant.delete")
NOTE       : Soft delete (deleted_at set)
```

---

## Workspaces

```
ENDPOINT   : POST /api/v1/workspaces?tenant_uid={uuid}
AUTH       : Bearer JWT
RATE       : 30 req/min

REQUEST
  name      : string (required, max 255)
  url       : string (optional, max 2048)
  platform  : string (optional — "wordpress", "shopify", etc.)

RESPONSE 201  -> WorkspaceResponse
```

```
ENDPOINT   : GET /api/v1/workspaces?tenant_uid={uuid}
ENDPOINT   : GET /api/v1/workspaces/{workspace_uid}?tenant_uid={uuid}
ENDPOINT   : PATCH /api/v1/workspaces/{workspace_uid}?tenant_uid={uuid}
ENDPOINT   : DELETE /api/v1/workspaces/{workspace_uid}?tenant_uid={uuid}

NOTE: Tüm workspace endpoint'leri tenant-scoped (tenant_uid zorunlu query param)
```

---

## Plugins

```
ENDPOINT   : POST /api/v1/plugins
AUTH       : Bearer JWT (superuser)

REQUEST
  slug       : string (required, pattern: ^[a-z0-9-]+$)
  name       : string (required)
  description: string (optional)
  version    : string (optional, semver)
  category   : string (optional)
  is_public  : boolean (default false)

RESPONSE 201  -> PluginResponse
```

```
ENDPOINT   : GET /api/v1/plugins
QUERY      : cursor, limit, category, is_public

ENDPOINT   : GET /api/v1/plugins/{plugin_uid}
ENDPOINT   : GET /api/v1/plugins/by-slug/{slug}
ENDPOINT   : PATCH /api/v1/plugins/{plugin_uid}
ENDPOINT   : DELETE /api/v1/plugins/{plugin_uid}
```

---

## Users (FastAPI-Users)

```
ENDPOINT   : GET /api/v1/users/me
AUTH       : Bearer JWT
RESPONSE 200  -> UserRead

ENDPOINT   : PATCH /api/v1/users/me
AUTH       : Bearer JWT
REQUEST    : UserUpdate (partial)
RESPONSE 200  -> UserRead
```

---

## Response Modelleri

### TenantResponse
```json
{
  "uid": "UUID v7",
  "name": "string",
  "slug": "string",
  "domain": "string | null",
  "plan": "string",
  "settings": {},
  "is_active": true,
  "description": "string | null",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### WorkspaceResponse
```json
{
  "uid": "UUID v7",
  "name": "string",
  "url": "string | null",
  "platform": "string | null",
  "is_active": true,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### PluginResponse
```json
{
  "uid": "UUID v7",
  "slug": "string",
  "name": "string",
  "description": "string | null",
  "version": "string | null",
  "category": "string | null",
  "is_public": false,
  "metadata": {},
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

---

## Genel Hata Formatı

```json
{
  "detail": "ERROR_CODE"
}
```

| HTTP | Kod | Anlam |
|------|-----|-------|
| 400 | BAD_REQUEST | Geçersiz istek |
| 401 | UNAUTHORIZED | JWT eksik veya geçersiz |
| 403 | FORBIDDEN | Yetki yok |
| 404 | NOT_FOUND | Kaynak bulunamadı |
| 409 | CONFLICT | Çakışma (unique ihlali) |
| 422 | VALIDATION_ERROR | Pydantic validasyon hatası |
| 429 | RATE_LIMITED | Rate limit aşıldı |
