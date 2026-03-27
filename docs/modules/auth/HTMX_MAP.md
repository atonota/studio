# auth — HTMX Partial Haritasi

> Her HTMX etkilesimi: trigger, source element, target, swap stratejisi, indicator,
> server response header'lari ve hata yonetimi.

---

## Genel Prensipler

- Auth modulu sidebar'siz layout kullanir — shell modulu yuklu degildir
- Form submit'lerde partial HTML donusur, basariliysa `HX-Redirect` header ile yonlendirilir
- Hata durumlarinda form yeniden render edilir, hata mesaji eklenmis halde
- `hx-indicator` ile loading spinner gosterilir
- CSRF korunmasi: `hx-headers='{"X-CSRF-Token": "{{ csrf_token }}"}'`

---

## 1. Login Form Submit

```
Sayfa       : /auth/login
Element     : <form id="login-form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/auth/login-form"
Target      : hx-target="#login-form"
Swap        : hx-swap="outerHTML"
Indicator   : hx-indicator="#login-spinner"
Headers     : hx-headers='{"X-CSRF-Token": "{{ csrf_token }}"}'

Server Response (basarili):
  Status    : 200
  Header    : HX-Redirect: /
  Body      : (bos — redirect tetiklenir)

Server Response (2FA gerekli):
  Status    : 200
  Header    : HX-Redirect: /auth/two-factor
  Cookie    : pending_2fa_session={session_token}; HttpOnly; Secure; SameSite=Lax; Max-Age=300

Server Response (hata):
  Status    : 200 (HTMX icin — 4xx HTMX swap'i kirar)
  Body      : login-form.html partial (hata mesaji iceren AlertBanner dahil)
  Icerik    :
    <form id="login-form" hx-post="..." ...>
        {% include 'modules/auth/components/alert-banner.html'
           with type='error', message='Hatali e-posta veya parola.' %}
        <!-- form alanlari -->
    </form>
```

---

## 2. Register Form Submit

```
Sayfa       : /auth/register
Element     : <form id="register-form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/auth/register-form"
Target      : hx-target="#register-form"
Swap        : hx-swap="outerHTML"
Indicator   : hx-indicator="#register-spinner"

Server Response (basarili):
  Status    : 200
  Body      : register-success.html partial
  Icerik    :
    <div class="text-center">
        <i class="ph ph-check-circle text-green-400 text-5xl mb-4"></i>
        <h3>Hesabiniz olusturuldu!</h3>
        <p>{{ email }} adresine dogrulama e-postasi gonderdik.</p>
        <a href="/auth/login">Giris sayfasina don</a>
    </div>

Server Response (hata):
  Status    : 200
  Body      : register-form.html partial (alan bazli hata mesajlari dahil)
  Icerik    :
    <form id="register-form" ...>
        {% if errors.email %}
        <p class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
        {% endif %}
        <!-- diger alanlar -->
    </form>
```

---

## 3. Password Strength Check (Realtime)

```
Sayfa       : /auth/register, /auth/reset-password/{token}
Element     : <input name="password">
Trigger     : hx-trigger="keyup changed delay:300ms"
Method      : hx-post="/api/v1/partials/auth/password-strength"
Target      : hx-target="#password-strength-meter"
Swap        : hx-swap="innerHTML"
Indicator   : (yok — gorunmez, hizli)

Request     : form data { password: "..." }

Server Response:
  Status    : 200
  Body      : password-strength.html partial
  Icerik    :
    <div id="password-strength-meter">
        <div class="flex gap-1 mb-2">
            <div class="h-1.5 flex-1 rounded-full {{ 'bg-green-400' if score >= 1 else 'bg-gray-600' }}"></div>
            <div class="h-1.5 flex-1 rounded-full {{ 'bg-green-400' if score >= 2 else 'bg-gray-600' }}"></div>
            <div class="h-1.5 flex-1 rounded-full {{ 'bg-green-400' if score >= 3 else 'bg-gray-600' }}"></div>
            <div class="h-1.5 flex-1 rounded-full {{ 'bg-green-400' if score >= 4 else 'bg-gray-600' }}"></div>
            <div class="h-1.5 flex-1 rounded-full {{ 'bg-green-400' if score >= 5 else 'bg-gray-600' }}"></div>
        </div>
        <span class="text-xs {{ strength_color }}">{{ strength_label }}</span>
    </div>

NOT: Client-side Alpine.js ile anlik onizleme de yapilir (sunucu gecikmesi
olmadan). HTMX server-side dogrulama ekstra guvenlik saglar.
```

---

## 4. Forgot Password Form Submit

```
Sayfa       : /auth/forgot-password
Element     : <form id="forgot-form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/auth/forgot-form"
Target      : hx-target="#forgot-form"
Swap        : hx-swap="outerHTML"
Indicator   : hx-indicator="#forgot-spinner"

Server Response (basarili — her zaman, enumeration engeli):
  Status    : 200
  Body      : forgot-success.html partial
  Icerik    :
    <div id="forgot-form" class="text-center">
        <i class="ph ph-envelope-simple text-blue-400 text-5xl mb-4"></i>
        <h3>E-posta gonderildi</h3>
        <p>{{ masked_email }} adresine sifirlama linki gonderdik.</p>
        <div id="resend-timer" x-data="{ seconds: 60, canResend: false }"
             x-init="setInterval(() => { if(seconds > 0) seconds--; else canResend = true; }, 1000)">
            <button x-show="canResend"
                    hx-post="/api/v1/partials/auth/forgot-form"
                    hx-vals='{"email": "{{ email }}"}'
                    hx-target="#forgot-form"
                    hx-swap="outerHTML"
                    class="text-blue-400 hover:text-blue-300 text-sm">
                Tekrar gonder
            </button>
            <span x-show="!canResend" class="text-gray-500 text-sm">
                Tekrar gondermek icin <span x-text="seconds"></span> saniye bekleyin
            </span>
        </div>
    </div>
```

---

## 5. Reset Password Form Submit

```
Sayfa       : /auth/reset-password/{token}
Element     : <form id="reset-form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/auth/reset-form"
Target      : hx-target="#reset-form"
Swap        : hx-swap="outerHTML"
Indicator   : hx-indicator="#reset-spinner"
Hidden      : <input type="hidden" name="token" value="{{ token }}">

Server Response (basarili):
  Status    : 200
  Body      :
    <div class="text-center">
        <i class="ph ph-check-circle text-green-400 text-5xl mb-4"></i>
        <h3>Parolaniz degistirildi!</h3>
        <p>Yeni parolanizla giris yapabilirsiniz.</p>
        <a href="/auth/login" class="text-blue-400">Giris sayfasina git</a>
    </div>

Server Response (hata — token gecersiz):
  Status    : 200
  Body      :
    <div class="text-center">
        {% include 'modules/auth/components/alert-banner.html'
           with type='error', message='Bu sifirlama linki gecersiz veya suresi dolmus.' %}
        <a href="/auth/forgot-password" class="text-blue-400 mt-4 inline-block">
            Yeni sifirlama linki iste
        </a>
    </div>
```

---

## 6. Two-Factor Code Submit

```
Sayfa       : /auth/two-factor
Element     : <form id="2fa-form" x-ref="form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/auth/2fa-verify"
Target      : hx-target="#2fa-result"
Swap        : hx-swap="innerHTML"
Indicator   : hx-indicator="#2fa-spinner"

Request     : form data { code: "123456" }
Cookie      : pending_2fa_session (otomatik)

Server Response (basarili):
  Status    : 200
  Header    : HX-Redirect: /
  Cookie    : Set-Cookie: access_token=...; HttpOnly; Secure

Server Response (hata):
  Status    : 200
  Body      :
    <div id="2fa-result">
        {% include 'modules/auth/components/alert-banner.html'
           with type='error', message='Gecersiz kod. Kalan deneme: ' ~ remaining %}
    </div>
```

---

## E-posta Inline Validation (Register)

```
Sayfa       : /auth/register
Element     : <input name="email" id="register-email">
Trigger     : hx-trigger="blur changed delay:500ms"
Method      : hx-get="/api/v1/partials/auth/check-email"
Target      : hx-target="#email-feedback"
Swap        : hx-swap="innerHTML"
Params      : hx-params="email"

Server Response (musait):
  <span class="text-green-400 text-xs">
      <i class="ph ph-check-circle"></i> Bu e-posta kullanilabilir
  </span>

Server Response (kayitli):
  <span class="text-red-400 text-xs">
      <i class="ph ph-warning-circle"></i> Bu e-posta zaten kayitli
  </span>
```

---

## HTMX Event Dinleyicileri (Sayfa Seviyesinde)

```javascript
// base auth layout'unda
document.body.addEventListener('htmx:responseError', function(event) {
    // 429 Rate Limit durumunda ozel mesaj
    if (event.detail.xhr.status === 429) {
        // rate limit banner goster
    }
});

document.body.addEventListener('htmx:beforeSwap', function(event) {
    // 422 validation hatalarinda swap'e izin ver
    if (event.detail.xhr.status === 422) {
        event.detail.shouldSwap = true;
        event.detail.isError = false;
    }
});
```

---

## Ozet Tablo

| Akis | Trigger | Endpoint | Target | Swap |
|------|---------|----------|--------|------|
| Login submit | submit | POST /api/v1/partials/auth/login-form | #login-form | outerHTML |
| Register submit | submit | POST /api/v1/partials/auth/register-form | #register-form | outerHTML |
| Password strength | keyup delay:300ms | POST /api/v1/partials/auth/password-strength | #password-strength-meter | innerHTML |
| Forgot submit | submit | POST /api/v1/partials/auth/forgot-form | #forgot-form | outerHTML |
| Reset submit | submit | POST /api/v1/partials/auth/reset-form | #reset-form | outerHTML |
| 2FA verify | submit | POST /api/v1/partials/auth/2fa-verify | #2fa-result | innerHTML |
| Email check | blur delay:500ms | GET /api/v1/partials/auth/check-email | #email-feedback | innerHTML |
| Resend forgot | click | POST /api/v1/partials/auth/forgot-form | #forgot-form | outerHTML |
