# auth — Component Spesifikasyonu

> Her component icin: amac, Alpine.js x-data, Tailwind class'lari, HTMX attribute'leri,
> Phosphor icon kullanimi ve Flowbite Pro referansi.

---

## 1. LoginForm

**Amac**: E-posta + parola ile giris formu. HTMX ile submit, hata mesajini inline gosterir.

**Konum**: `templates/modules/auth/partials/login-form.html`

**Alpine.js State**:
```javascript
x-data="{
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    loading: false,
    errorMessage: ''
}"
```

**Yapi**:
```html
<form id="login-form"
      hx-post="/api/v1/partials/auth/login-form"
      hx-target="#login-form"
      hx-swap="outerHTML"
      hx-indicator="#login-spinner"
      @htmx:before-request="loading = true"
      @htmx:after-request="loading = false"
      x-data="{ showPassword: false, loading: false }">

    <!-- E-posta input -->
    <div class="mb-4">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-300">
            E-posta adresi
        </label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3.5">
                <i class="ph ph-envelope text-gray-500"></i>
            </div>
            <input type="email" id="email" name="email" required
                   class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                          focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                   placeholder="ornek@sirket.com">
        </div>
    </div>

    <!-- Parola input + goster/gizle toggle -->
    <div class="mb-4">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-300">
            Parola
        </label>
        <div class="relative">
            <input :type="showPassword ? 'text' : 'password'"
                   id="password" name="password" required
                   class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pe-10">
            <button type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400
                           hover:text-gray-200">
                <i class="ph" :class="showPassword ? 'ph-eye-slash' : 'ph-eye'"></i>
            </button>
        </div>
    </div>

    <!-- Beni hatirla + Parolami unuttum -->
    <div class="flex items-center justify-between mb-6">
        <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" name="remember_me"
                   class="w-4 h-4 bg-gray-700 border-gray-600 rounded
                          focus:ring-blue-500 text-blue-600">
            Beni hatirla
        </label>
        <a href="/auth/forgot-password"
           class="text-sm text-blue-400 hover:text-blue-300">
            Parolami unuttum
        </a>
    </div>

    <!-- Submit -->
    <button type="submit" :disabled="loading"
            class="w-full text-white bg-blue-600 hover:bg-blue-700
                   focus:ring-4 focus:ring-blue-800 font-medium rounded-lg
                   text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
        <span x-show="!loading">Giris Yap</span>
        <span x-show="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" ...></svg>
            Giris yapiliyor...
        </span>
    </button>
</form>
```

**Flowbite Ref**: Forms > Input field with icon, Toggle password visibility

---

## 2. RegisterForm

**Amac**: Yeni hesap olusturma formu. Inline parola guc kontrolu, davet kodu destegi.

**Konum**: `templates/modules/auth/partials/register-form.html`

**Alpine.js State**:
```javascript
x-data="{
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    showPassword: false,
    inviteCode: '',
    acceptTerms: false,
    loading: false,
    get passwordsMatch() {
        return this.password === this.passwordConfirm || this.passwordConfirm === '';
    },
    get formValid() {
        return this.displayName.length >= 2
            && this.email.includes('@')
            && this.password.length >= 8
            && this.passwordsMatch
            && this.acceptTerms;
    }
}"
```

**HTMX**:
```
hx-post="/api/v1/partials/auth/register-form"
hx-target="#register-form"
hx-swap="outerHTML"
hx-indicator="#register-spinner"
```

**Flowbite Ref**: Forms > Registration form

---

## 3. PasswordStrengthMeter

**Amac**: Parola girilirken guc seviyesini gercek zamanli gosterir. HTMX ile server-side
dogrulama, Alpine.js ile client-side onizleme.

**Konum**: `templates/modules/auth/partials/password-strength.html`

**Alpine.js State**:
```javascript
x-data="{
    strength: 0,        // 0-4 arasi
    label: '',           // Cok Zayif, Zayif, Orta, Guclu, Cok Guclu
    color: 'bg-red-500',
    rules: {
        minLength: false,    // >= 8 karakter
        hasUpper: false,     // buyuk harf
        hasLower: false,     // kucuk harf
        hasNumber: false,    // rakam
        hasSpecial: false    // ozel karakter
    },
    check(password) {
        this.rules.minLength = password.length >= 8;
        this.rules.hasUpper = /[A-Z]/.test(password);
        this.rules.hasLower = /[a-z]/.test(password);
        this.rules.hasNumber = /[0-9]/.test(password);
        this.rules.hasSpecial = /[^A-Za-z0-9]/.test(password);

        const passed = Object.values(this.rules).filter(Boolean).length;
        this.strength = passed;
        const levels = [
            { label: 'Cok Zayif', color: 'bg-red-500' },
            { label: 'Zayif',     color: 'bg-orange-500' },
            { label: 'Orta',      color: 'bg-yellow-500' },
            { label: 'Guclu',     color: 'bg-green-400' },
            { label: 'Cok Guclu', color: 'bg-green-500' }
        ];
        const level = levels[Math.min(passed, 4)];
        this.label = level.label;
        this.color = level.color;
    }
}"
```

**Gorsel Yapi**:
```
┌──────────────────────────────────────┐
│ ████████████░░░░░░░░░  Orta          │  <- progress bar + label
│                                      │
│ [✓] 8+ karakter   [✓] Buyuk harf    │  <- kural kontrol listesi
│ [✓] Kucuk harf    [ ] Rakam          │
│ [ ] Ozel karakter                    │
└──────────────────────────────────────┘
```

**Tailwind**: Progress bar `h-2 rounded-full transition-all duration-300`

---

## 4. TwoFactorInput

**Amac**: 6 haneli TOTP kodu girisi. Her kutuya tek rakam, otomatik focus ilerlemesi,
son hane girilince otomatik submit.

**Konum**: `templates/modules/auth/partials/two-factor-input.html`

**Alpine.js State**:
```javascript
x-data="{
    digits: ['', '', '', '', '', ''],
    loading: false,
    error: '',

    handleInput(index, event) {
        const value = event.target.value.replace(/\D/g, '');
        this.digits[index] = value.slice(-1);

        if (value && index < 5) {
            this.$refs['digit' + (index + 1)].focus();
        }
        if (index === 5 && value) {
            this.submit();
        }
    },

    handleKeydown(index, event) {
        if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
            this.$refs['digit' + (index - 1)].focus();
        }
    },

    handlePaste(event) {
        const text = event.clipboardData.getData('text').replace(/\D/g, '');
        for (let i = 0; i < 6 && i < text.length; i++) {
            this.digits[i] = text[i];
        }
        if (text.length >= 6) this.submit();
    },

    get code() { return this.digits.join(''); },

    submit() {
        if (this.code.length === 6) {
            this.loading = true;
            this.$refs.form.requestSubmit();
        }
    }
}"
```

**Gorsel**: 6 adet `w-12 h-14 text-center text-2xl font-mono` input kutusu, aralarinda `gap-2`,
ortada `gap-4` (3+3 gruplama).

**HTMX**:
```
hx-post="/api/v1/auth/2fa/verify"
hx-target="#two-factor-result"
hx-swap="innerHTML"
```

---

## 5. SocialLoginButtons

**Amac**: OAuth provider'lari ile giris butonlari (Google, GitHub). Gelecekte SAML/SSO eklenecek.

**Konum**: `templates/modules/auth/partials/social-login-buttons.html`

**Alpine.js State**:
```javascript
x-data="{
    providers: [
        { id: 'google', label: 'Google ile giris yap', icon: 'ph-google-logo', color: 'hover:bg-red-600/10' },
        { id: 'github', label: 'GitHub ile giris yap', icon: 'ph-github-logo', color: 'hover:bg-gray-600/10' }
    ],
    redirecting: ''
}"
```

**Yapi**:
```html
<div class="space-y-3">
    <template x-for="provider in providers" :key="provider.id">
        <a :href="'/api/v1/auth/oauth/' + provider.id"
           @click="redirecting = provider.id"
           class="flex items-center justify-center gap-3 w-full py-2.5 px-5
                  border border-gray-600 rounded-lg text-gray-300
                  hover:bg-gray-700 transition-colors"
           :class="provider.color">
            <i class="ph text-xl" :class="provider.icon"></i>
            <span x-text="provider.label"></span>
        </a>
    </template>
</div>
```

**Flowbite Ref**: Buttons > Social login buttons

---

## 6. AlertBanner

**Amac**: Hata ve basari mesajlarini gostermek icin yeniden kullanilabilir banner.
HTMX partial donuslerinde server tarafindan set edilir.

**Konum**: `templates/modules/auth/components/alert-banner.html`

**Jinja2 Parametreleri**:
```jinja2
{% macro alert_banner(type, message, dismissible=true) %}
{# type: "error" | "success" | "warning" | "info" #}
{% set styles = {
    'error':   'bg-red-900/50 border-red-500 text-red-300',
    'success': 'bg-green-900/50 border-green-500 text-green-300',
    'warning': 'bg-yellow-900/50 border-yellow-500 text-yellow-300',
    'info':    'bg-blue-900/50 border-blue-500 text-blue-300'
} %}
{% set icons = {
    'error':   'ph-warning-circle',
    'success': 'ph-check-circle',
    'warning': 'ph-warning',
    'info':    'ph-info'
} %}

<div x-data="{ show: true }" x-show="show" x-transition
     class="flex items-center gap-3 p-4 mb-4 border rounded-lg {{ styles[type] }}"
     role="alert">
    <i class="ph {{ icons[type] }} text-xl flex-shrink-0"></i>
    <span class="text-sm">{{ message }}</span>
    {% if dismissible %}
    <button @click="show = false" class="ms-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg
            hover:bg-white/10 inline-flex items-center justify-center h-8 w-8">
        <i class="ph ph-x"></i>
    </button>
    {% endif %}
</div>
{% endmacro %}
```

**Flowbite Ref**: Alerts > Alert with icon + dismiss

---

## 7. PasswordField

**Amac**: Goster/gizle toggle'li parola input'u. Tum parola alanlari bu componenti kullanir.

**Konum**: `templates/modules/auth/components/password-field.html`

**Jinja2 Macro**:
```jinja2
{% macro password_field(name, label, placeholder="", required=true, autocomplete="current-password") %}
<div x-data="{ show: false }" class="mb-4">
    <label for="{{ name }}" class="block mb-2 text-sm font-medium text-gray-300">
        {{ label }}
    </label>
    <div class="relative">
        <input :type="show ? 'text' : 'password'"
               id="{{ name }}" name="{{ name }}"
               placeholder="{{ placeholder }}"
               autocomplete="{{ autocomplete }}"
               {% if required %}required{% endif %}
               class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pe-10">
        <button type="button" @click="show = !show" tabindex="-1"
                class="absolute inset-y-0 end-0 flex items-center pe-3.5
                       text-gray-400 hover:text-gray-200">
            <i class="ph" :class="show ? 'ph-eye-slash' : 'ph-eye'"></i>
        </button>
    </div>
</div>
{% endmacro %}
```

---

## Component Bagimliliklari

```
LoginForm
  +-- PasswordField
  +-- SocialLoginButtons
  +-- AlertBanner

RegisterForm
  +-- PasswordField
  +-- PasswordStrengthMeter
  +-- AlertBanner

ForgotPasswordForm
  +-- AlertBanner

ResetPasswordForm
  +-- PasswordField
  +-- PasswordStrengthMeter
  +-- AlertBanner

TwoFactorPage
  +-- TwoFactorInput
  +-- AlertBanner
```
