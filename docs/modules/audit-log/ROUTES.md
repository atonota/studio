# audit-log — Route Haritasi

> Tum sayfa ve API endpoint tanimlari. FastAPI router: `app/api/v1/modules/audit/routes.py`

---

## Sayfa Route'lari (HTML)

Jinja2 ile render edilen tam sayfa route'lari. Studio layout kullanir (sidebar'li).

```
GET  /audit
  Template  : templates/modules/audit/pages/audit-list.html
  Layout    : templates/layouts/studio.html
  Auth      : tenant_owner, studio_admin
  Query     : ?action=&actor=&resource_type=&date_from=&date_to=&q=  (tumu opsiyonel)
  Not       : Filtre bar + tablo + aktivite zaman cizgisi + AI ozet karti

GET  /audit/{event_uid}
  Davranis  : Tam sayfa degil — modal overlay olarak acilir
  Yonlendir : /audit sayfasinda iken hx-get ile modal partial yuklenir
  Auth      : tenant_owner, studio_admin
  Not       : Dogrudan URL ile erisimde /audit sayfasina yonlendirilir,
              modal otomatik acilir (query param: ?detail={event_uid})
```

---

## HTMX Partial Endpoint'leri

```
GET  /api/v1/partials/audit-table
  Trigger  : Sayfa yuklenme + filtre degisikligi + cursor pagination
  Query    : ?action=&actor_id=&resource_type=&date_from=&date_to=&q=&cursor=&limit=25
  Response : partials/audit-table.html
  Auth     : tenant_owner, studio_admin
  Not      : Cursor-based pagination (created_at, id)

GET  /api/v1/partials/audit-detail/{uid}
  Trigger  : Tablo satirinda "Detay" linki tiklamasi (hx-get)
  Response : partials/audit-detail-modal.html
  Auth     : tenant_owner, studio_admin
  Not      : Modal/overlay icine yuklenir (#audit-detail-overlay)

GET  /api/v1/partials/audit-timeline
  Trigger  : Sayfa yuklenme (hx-trigger="load")
  Query    : ?days=30  (varsayilan son 30 gun)
  Response : partials/activity-timeline.html
  Auth     : tenant_owner, studio_admin
  Not      : ECharts bar chart verisi iceren partial

GET  /api/v1/partials/audit-summary
  Trigger  : Sayfa yuklenme (hx-trigger="load")
  Query    : ?period=24h  (varsayilan son 24 saat)
  Response : partials/audit-summary-card.html
  Auth     : tenant_owner, studio_admin
  Not      : AI tarafindan olusturulan dogal dil ozeti

POST /api/v1/partials/audit-natural-query
  Trigger  : Dogal dil arama formu submit (hx-post)
  Request  : form data (query: string)
  Response : partials/audit-table.html (filtrelenmis sonuclar)
  Auth     : tenant_owner, studio_admin
  Not      : AI sorguyu filtre parametrelerine cevirir, sonuclari doner
```

---

## API Endpoint'leri (JSON)

```
ENDPOINT   : GET /api/v1/audit/summary
AUTH       : Bearer JWT (tenant_owner, studio_admin)
RATE       : 5 req/min per tenant

REQUEST (query params)
  period   : string (optional, default: "24h") — "1h", "6h", "24h", "7d", "30d"

RESPONSE 200
  period         : string
  summary_text   : string (AI dogal dil ozeti)
  stats          : object
    total_count  : int
    unique_actors: int
    by_action    : object  ({ "auth.login": 45, "workspace.update": 23, ... })
    by_result    : object  ({ "success": 120, "failure": 7 })
    top_actor    : object  ({ "actor_id": UUID, "email": string, "count": int })
    anomalies    : array   ([{ "type": string, "description": string, "risk": string }])

ERRORS
  403  FORBIDDEN    : yetki yok
  429  RATE_LIMITED  : rate limit asildi

AUDIT      : yok (audit okuma islemi audit'e yazilmaz — dongusel bagimliligi onler)
IDEMPOTENT : evet (cache: 5 dk)
```

---

```
ENDPOINT   : GET /api/v1/audit/export
AUTH       : Bearer JWT (tenant_owner, studio_admin)
RATE       : 1 req/hour per tenant

REQUEST (query params)
  format       : string (required) — "csv"
  date_from    : ISO8601 (optional)
  date_to      : ISO8601 (optional)
  action       : string (optional)
  actor_id     : UUID (optional)

RESPONSE 200
  Content-Type        : text/csv
  Content-Disposition : attachment; filename="audit-export-2026-03-27.csv"

ERRORS
  400  INVALID_DATE_RANGE  : tarih araligi 90 gunden uzun olamaz
  403  FORBIDDEN           : yetki yok
  429  RATE_LIMITED         : export limiti asildi (saatlik 1)

AUDIT      : audit.events (action="audit.export", actor_id, date_range)
IDEMPOTENT : evet
```

---

```
ENDPOINT   : POST /api/v1/audit/natural-query
AUTH       : Bearer JWT (tenant_owner, studio_admin)
RATE       : 10 req/min per tenant

REQUEST
  query  : string (body, required, max 500 karakter)
           Ornek: "dun kimler workspace olusturdu?"
           Ornek: "son 1 haftada basarisiz giris denemeleri"
           Ornek: "ahmet@atonota.com bu ay neler yapti?"

RESPONSE 200
  interpreted_query  : object
    action_filter    : string | null
    actor_filter     : string | null
    date_from        : ISO8601 | null
    date_to          : ISO8601 | null
    resource_filter  : string | null
    result_filter    : string | null
  results            : array (AuditEventResponse[])
  total_count        : int
  natural_response   : string (AI dogal dil cevap ozeti)

ERRORS
  400  UNPARSEABLE_QUERY : sorgu anlasilamadi
  403  FORBIDDEN         : yetki yok
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : yok
IDEMPOTENT : evet (ayni sorgu icin cache: 1 dk)
```

---

## Sunucu Tarafinda Route Ornekleri

```python
@router.get("/audit")
async def audit_list_page(
    request: Request,
    detail: str | None = Query(None),  # modal acilacak event UID
    current_user: User = Depends(current_active_user),
) -> HTMLResponse:
    if current_user.role not in ("tenant_owner", "studio_admin"):
        raise HTTPException(status_code=403, detail="FORBIDDEN")
    return templates.TemplateResponse(
        "modules/audit/pages/audit-list.html",
        {"request": request, "user": current_user, "detail_uid": detail}
    )


@router.get("/api/v1/partials/audit-table")
async def audit_table_partial(
    request: Request,
    action: str | None = Query(None),
    actor_id: UUID | None = Query(None),
    resource_type: str | None = Query(None),
    date_from: datetime | None = Query(None),
    date_to: datetime | None = Query(None),
    q: str | None = Query(None),
    cursor: str | None = Query(None),
    limit: int = Query(25, le=100),
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> HTMLResponse:
    events, next_cursor = await audit_reader.list_events(
        session=session,
        tenant_id=current_user.tenant_id,
        action=action,
        actor_id=actor_id,
        resource_type=resource_type,
        date_from=date_from,
        date_to=date_to,
        search_query=q,
        cursor=cursor,
        limit=limit,
    )
    return templates.TemplateResponse(
        "modules/audit/partials/audit-table.html",
        {"request": request, "events": events, "next_cursor": next_cursor}
    )


@router.get("/api/v1/partials/audit-detail/{uid}")
async def audit_detail_partial(
    request: Request,
    uid: UUID,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> HTMLResponse:
    event = await audit_reader.get_event(
        session=session,
        tenant_id=current_user.tenant_id,
        uid=uid,
    )
    if not event:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    related = await audit_reader.get_related_events(
        session=session,
        tenant_id=current_user.tenant_id,
        resource_type=event.resource_type,
        resource_id=event.resource_id,
        exclude_uid=uid,
        limit=10,
    )
    return templates.TemplateResponse(
        "modules/audit/partials/audit-detail-modal.html",
        {"request": request, "event": event, "related_events": related}
    )
```
