# auth — Route Haritasi

> Tum sayfa ve API endpoint tanimlari. FastAPI router: `app/api/v1/modules/auth/routes.py`

---

## Sayfa Route'lari (HTML)

Jinja2 ile render edilen tam sayfa route'lari. Auth layout kullanir (sidebar yok).

```
GET  /auth/login
  Template  : templates/modules/auth/pages/login.html
  Layout    : templates/layouts/auth.html  (sidebar'siz, tek kolon)
  Auth      : Anonim (giris yapmamis)
  Redirect  : Zaten giris yapmissa -> /

GET  /auth/register
  Template  : templates/modules/auth/pages/register.html
  Layout    : templates/layouts/auth.html
  Auth      : Anonim
  Query     : ?invite={code}  (opsiyonel davet kodu)
  Redirect  : Zaten giris yapmissa -> /

GET  /auth/forgot-password
  Template  : templates/modules/auth/pages/forgot-password.html
  Layout    : templates/layouts/auth.html
  Auth      : Anonim

GET  /auth/reset-password/{token}
  Template  : templates/modules/auth/pages/reset-password.html
  Layout    : templates/layouts/auth.html
  Auth      : Anonim
  Validate  : Token gecerliligi kontrol edilir, gecersizse hata sayfasi

GET  /auth/two-factor
  Template  : templates/modules/auth/pages/two-factor.html
  Layout    : templates/layouts/auth.html
  Auth      : Yarim oturum (1. adim basarili, 2FA bekliyor)
  Session   : pending_2fa_user_id session'da saklanir
```

---

## API Endpoint'leri (JSON)

```
ENDPOINT   : POST /api/v1/auth/login
AUTH       : Anonim
RATE       : 5 req/min per IP

REQUEST
  email    : string (body, required, email format)
  password : string (body, required, min 8 karakter)

RESPONSE 200
  access_token   : string (JWT)
  refresh_token  : string (JWT)
  token_type     : "bearer"
  expires_in     : int (saniye)
  requires_2fa   : boolean
  user           : { uid: UUID, email: string, display_name: string }

RESPONSE 200 (2FA gerekli)
  requires_2fa   : true
  session_token  : string (gecici, 5 dk omurlu)

ERRORS
  400  INVALID_CREDENTIALS  : e-posta veya parola hatali
  403  ACCOUNT_LOCKED       : cok fazla basarisiz deneme
  403  ACCOUNT_DISABLED     : hesap devre disi
  422  VALIDATION_ERROR     : sema hatasi
  429  RATE_LIMITED          : rate limit asildi

AUDIT      : audit.events (action="auth.login", actor_ip, user_agent, result)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : POST /api/v1/auth/register
AUTH       : Anonim
RATE       : 3 req/min per IP

REQUEST
  email         : string (body, required, email format)
  password      : string (body, required, min 8, complexity rules)
  display_name  : string (body, required, min 2, max 100)
  invite_code   : string (body, optional)

RESPONSE 201
  uid            : UUID
  email          : string
  display_name   : string
  created_at     : ISO8601
  email_verified : false

ERRORS
  400  EMAIL_EXISTS         : e-posta zaten kayitli
  400  INVALID_INVITE       : davet kodu gecersiz veya suresi dolmus
  422  WEAK_PASSWORD        : parola guvenligi yetersiz
  422  VALIDATION_ERROR     : sema hatasi
  429  RATE_LIMITED          : rate limit asildi

AUDIT      : audit.events (action="auth.register", actor_ip)
IDEMPOTENT : hayir
```

---

```
ENDPOINT   : POST /api/v1/auth/forgot
AUTH       : Anonim
RATE       : 3 req/min per IP

REQUEST
  email    : string (body, required, email format)

RESPONSE 200
  message  : "Sifirlama linki gonderildi"

NOT: Kayitli olmayan e-posta icin de 200 doner (e-posta enumeration engeli).

ERRORS
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="auth.forgot_password", actor_ip)
IDEMPOTENT : evet (ayni e-posta icin tekrar gonderilebilir)
```

---

```
ENDPOINT   : POST /api/v1/auth/reset
AUTH       : Anonim (token ile dogrulama)
RATE       : 5 req/min per IP

REQUEST
  token        : string (body, required)
  new_password : string (body, required, min 8, complexity rules)

RESPONSE 200
  message  : "Parola basariyla degistirildi"

ERRORS
  400  INVALID_TOKEN     : token gecersiz veya suresi dolmus
  400  TOKEN_USED        : token zaten kullanildi
  422  WEAK_PASSWORD     : parola guvenligi yetersiz
  422  VALIDATION_ERROR  : sema hatasi
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="auth.reset_password", user_id)
IDEMPOTENT : hayir (token tek kullanimlik)
```

---

```
ENDPOINT   : POST /api/v1/auth/2fa/verify
AUTH       : Gecici session token (login'den donen)
RATE       : 5 req/min per session

REQUEST
  session_token : string (body, required)
  code          : string (body, required, 6 haneli TOTP)

RESPONSE 200
  access_token   : string (JWT)
  refresh_token  : string (JWT)
  token_type     : "bearer"
  expires_in     : int (saniye)

ERRORS
  400  INVALID_CODE      : TOTP kodu hatali
  400  CODE_EXPIRED      : kod suresi dolmus
  400  SESSION_EXPIRED   : gecici oturum suresi dolmus (5 dk)
  403  ACCOUNT_LOCKED    : cok fazla basarisiz deneme
  429  RATE_LIMITED       : rate limit asildi

AUDIT      : audit.events (action="auth.2fa_verify", user_id, result)
IDEMPOTENT : hayir
```

---

## HTMX Partial Endpoint'leri

```
POST /api/v1/partials/auth/login-form
  Trigger  : HTMX form submit
  Request  : form data (email, password)
  Success  : HX-Redirect: / header (tam sayfa yonlendirme)
  Error    : partials/login-form.html (hata mesajli)

POST /api/v1/partials/auth/register-form
  Trigger  : HTMX form submit
  Request  : form data (email, password, display_name, invite_code)
  Success  : partials/register-success.html (dogrulama e-postasi bilgisi)
  Error    : partials/register-form.html (hata mesajli)

POST /api/v1/partials/auth/forgot-form
  Trigger  : HTMX form submit
  Request  : form data (email)
  Success  : partials/forgot-success.html (e-posta gonderildi mesaji)
  Error    : partials/forgot-form.html (hata mesajli)

POST /api/v1/partials/auth/password-strength
  Trigger  : hx-trigger="keyup changed delay:300ms"
  Request  : form data (password)
  Response : partials/password-strength.html (guc gostergesi)
```
