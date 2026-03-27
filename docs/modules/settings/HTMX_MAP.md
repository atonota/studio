# settings — HTMX Partial Haritasi

> HTMX endpoint -> partial HTML eslesmesi. Her satir bir HTMX etkilesimini tanimlar.

---

## Tab Gecisleri

Tum tab gecisleri ayni pattern'i kullanir: sol menude tiklanan link sag icerik panelini gunceller.

| Trigger | HTMX Attr | Endpoint | Target | Swap | Push URL |
|---------|-----------|----------|--------|------|----------|
| Profil tab tik | `hx-get` | `/api/v1/partials/settings/profile-form` | `#settings-content` | `innerHTML` | `/settings/profile` |
| Guvenlik tab tik | `hx-get` | `/api/v1/partials/settings/security-form` | `#settings-content` | `innerHTML` | `/settings/security` |
| Bildirimler tab tik | `hx-get` | `/api/v1/partials/settings/notification-prefs` | `#settings-content` | `innerHTML` | `/settings/notifications` |
| API Anahtarlari tab tik | `hx-get` | `/api/v1/partials/settings/api-keys` | `#settings-content` | `innerHTML` | `/settings/api-keys` |
| Gorunum tab tik | `hx-get` | `/api/v1/partials/settings/appearance` | `#settings-content` | `innerHTML` | `/settings/appearance` |
| Kurum tab tik | `hx-get` | `/api/v1/partials/settings/tenant` | `#settings-content` | `innerHTML` | `/settings/tenant` |
| Webhook'lar tab tik | `hx-get` | `/api/v1/partials/settings/webhooks` | `#settings-content` | `innerHTML` | `/settings/webhooks` |

**Ornek HTML:**
```html
<a hx-get="/api/v1/partials/settings/profile-form"
   hx-target="#settings-content"
   hx-swap="innerHTML"
   hx-push-url="/settings/profile"
   hx-indicator="#tab-spinner">
  <i class="ph ph-user"></i> Profil
</a>
```

**Sunucu tarafinda:**
```python
@router.get("/api/v1/partials/settings/profile-form")
async def get_profile_form(
    request: Request,
    current_user: User = Depends(current_active_user),
) -> HTMLResponse:
    return templates.TemplateResponse(
        "modules/settings/partials/profile-form.html",
        {"request": request, "user": current_user}
    )
```

---

## Profil Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Profil form kaydet | `hx-patch` | `/api/v1/partials/settings/profile` | `#settings-content` | `innerHTML` | Form data: display_name, bio |
| Avatar yukle | `hx-post` | `/api/v1/partials/settings/avatar` | `#avatar-container` | `outerHTML` | `hx-encoding="multipart/form-data"` |

**Avatar upload ornegi:**
```html
<form hx-post="/api/v1/partials/settings/avatar"
      hx-target="#avatar-container"
      hx-swap="outerHTML"
      hx-encoding="multipart/form-data"
      hx-indicator="#avatar-spinner">
  <input type="file" name="avatar" accept="image/jpeg,image/png,image/webp">
</form>
```

---

## Guvenlik Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Parola degistir | `hx-post` | `/api/v1/partials/settings/password` | `#password-section` | `outerHTML` | current_password + new_password + confirm |
| 2FA aktiflestir | `hx-post` | `/api/v1/partials/settings/2fa/enable` | `#two-factor-section` | `innerHTML` | QR + recovery codes modal doner |
| 2FA TOTP dogrula | `hx-post` | `/api/v1/partials/settings/2fa/confirm` | `#two-factor-section` | `innerHTML` | 6 haneli kod, basarida guvenlik formu doner |
| 2FA devre disi | `hx-delete` | `/api/v1/partials/settings/2fa` | `#two-factor-section` | `innerHTML` | current_password gerekli |
| Oturum sonlandir | `hx-delete` | `/api/v1/partials/settings/sessions/{uid}` | `#session-{uid}` | `outerHTML swap:500ms` | `hx-confirm` ile onay |
| Tum oturumlari kapat | `hx-post` | `/api/v1/partials/settings/sessions/revoke-all` | `#sessions-list` | `innerHTML` | `hx-confirm` ile onay |

**Oturum silme ornegi:**
```html
<button hx-delete="/api/v1/partials/settings/sessions/{{ session.uid }}"
        hx-target="#session-{{ session.uid }}"
        hx-swap="outerHTML swap:500ms"
        hx-confirm="Bu oturumu sonlandirmak istediginizden emin misiniz?">
  Sonlandir
</button>
```

Basarili silme durumunda sunucu bos HTML doner, boylece satir 500ms fade-out ile kaybolur.

---

## Bildirim Tercihleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Toggle switch degisimi | `hx-patch` | `/api/v1/partials/settings/notification-toggle` | `closest label` | `outerHTML` | channel + event_type + enabled |
| Ozet sikligi kaydet | `hx-patch` | `/api/v1/partials/settings/notification-digest` | `#digest-section` | `outerHTML` | frequency: daily/weekly/monthly/off |

**Toggle switch ornegi:**
```html
<input type="checkbox"
       hx-patch="/api/v1/partials/settings/notification-toggle"
       hx-vals='{"channel": "email", "event_type": "seo_anomaly", "enabled": true}'
       hx-target="closest label"
       hx-swap="outerHTML"
       hx-indicator="closest tr">
```

Her toggle tek basina bir HTMX istegi gonderir — "Kaydet" butonu gerektirmez.
Sunucu guncellenmis toggle HTML'i doner (checked/unchecked durumu dahil).

---

## API Anahtar Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Anahtar olustur | `hx-post` | `/api/v1/partials/settings/api-keys` | `#api-key-rows` | `afterbegin` | Modal icinde form, basarida yeni satir + raw key modali |
| Anahtar sil | `hx-delete` | `/api/v1/partials/settings/api-keys/{uid}` | `#api-key-{uid}` | `outerHTML swap:500ms` | `hx-confirm` ile onay |

**Anahtar olusturma akisi:**

1. Kullanici "Yeni Anahtar" butonuna tiklar -> Alpine.js modal acilir
2. Form doldurulur ve gonderilir (`hx-post`)
3. Sunucu iki sey doner:
   - `HX-Trigger: show-raw-key` eventi (raw key'i modal'da gosterir)
   - Yeni satir HTML'i (`afterbegin` ile tablonun basina eklenir)

```html
<!-- Sunucu response header'lari -->
HX-Trigger: {"showRawKey": {"key": "atnt_a1b2c3...", "name": "Production"}}
```

```html
<!-- Istemci tarafinda event dinleme -->
<div x-data="rawKeyModal()"
     @show-raw-key.window="showKey($event.detail)">
  <!-- raw key modal icerigi -->
</div>
```

---

## Gorunum Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Tema/dil/tz kaydet | `hx-patch` | `/api/v1/partials/settings/appearance` | `#settings-content` | `innerHTML` | theme + locale + timezone |

**Tema degisikligi ozel akisi:**

Tema secimi aninda uygulanir (Alpine.js) ama sunucuya da kaydedilir.
Sunucu `HX-Trigger: theme-changed` header'i doner:

```html
<!-- Sunucu response -->
HX-Trigger: theme-changed

<!-- Shell layout'da global listener -->
<body hx-on:theme-changed="document.documentElement.className = event.detail.theme">
```

---

## Tenant Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Tenant ayar kaydet | `hx-patch` | `/api/v1/partials/settings/tenant` | `#settings-content` | `innerHTML` | tenant_name, logo_url, locale, tz |

---

## Webhook Islemleri

| Trigger | HTMX Attr | Endpoint | Target | Swap | Not |
|---------|-----------|----------|--------|------|-----|
| Webhook olustur | `hx-post` | `/api/v1/partials/settings/webhooks` | `#webhook-list` | `innerHTML` | name, url, events[] |
| Webhook sil | `hx-delete` | `/api/v1/partials/settings/webhooks/{uid}` | `#webhook-{uid}` | `outerHTML swap:500ms` | `hx-confirm` |
| Webhook test | `hx-post` | `/api/v1/partials/settings/webhooks/{uid}/test` | `#webhook-{uid}` | `outerHTML` | Satir guncellenir (sonuc gosterimi) |

**Test gonderimi ornegi:**
```html
<button hx-post="/api/v1/partials/settings/webhooks/{{ uid }}/test"
        hx-target="#webhook-{{ uid }}"
        hx-swap="outerHTML"
        hx-indicator="#test-spinner-{{ uid }}">
  <i class="ph ph-paper-plane-tilt"></i> Test
</button>
```

Sunucu webhook satir HTML'ini guncellenmis durumla doner:
- Basarili: yesil "200 OK — 142ms" gosterimi
- Basarisiz: kirmizi "Timeout — hata mesaji" gosterimi

---

## Loading State'leri

Tum HTMX istekleri icin `hx-indicator` kullanilir:

```html
<!-- Global spinner (tab icerigi icin) -->
<div id="tab-spinner" class="htmx-indicator absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
  <svg class="animate-spin h-8 w-8 text-primary-600">...</svg>
</div>

<!-- Inline spinner (tek buton icin) -->
<span class="htmx-indicator inline-block">
  <svg class="animate-spin h-4 w-4">...</svg>
</span>
```

HTMX `htmx-indicator` class'i ile `.htmx-indicator { display: none; }` ve
`.htmx-request .htmx-indicator { display: inline-block; }` CSS kurallari kullanilir.

---

## Hata Yonetimi

Tum form submit'lerinde sunucu hata durumunda ayni partial'i hata mesaji ile doner:

```python
# Sunucu tarafinda
if error:
    return templates.TemplateResponse(
        "modules/settings/partials/profile-form.html",
        {"request": request, "user": user, "message": str(error), "message_type": "error"},
        status_code=422,
    )
```

HTMX varsayilan olarak 2xx disindaki response'lari swap etmez. Bunu degistirmek icin:

```html
<body hx-ext="response-targets">
  <!-- veya global ayar: -->
  <meta name="htmx-config" content='{"responseHandling": [{"code":"422", "swap": true}]}'>
</body>
```
