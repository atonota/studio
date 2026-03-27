# settings — Bilesen Spesifikasyonlari

> Her bilesen icin Alpine.js x-data, HTMX attribute'lari ve Flowbite Pro referanslari.

---

## 1. SettingsLayout

Sol tab menusu + sag icerik panelinden olusan ana layout.

```html
<!-- templates/modules/settings/pages/settings.html -->
<div class="flex flex-col md:flex-row gap-6">

  <!-- Sol Tab Menusu -->
  <nav class="w-full md:w-56 flex-shrink-0">
    <!-- Mobilde yatay scroll -->
    <ul class="flex md:flex-col overflow-x-auto md:overflow-visible
               gap-1 border-b md:border-b-0 md:border-r
               border-gray-200 dark:border-gray-700">

      <li>
        <a href="/settings/profile"
           hx-get="/api/v1/partials/settings/profile-form"
           hx-target="#settings-content"
           hx-push-url="/settings/profile"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'profile' %}settings-tab--active{% endif %}">
          <i class="ph ph-user text-lg"></i>
          <span>Profil</span>
        </a>
      </li>

      <li>
        <a href="/settings/security"
           hx-get="/api/v1/partials/settings/security-form"
           hx-target="#settings-content"
           hx-push-url="/settings/security"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'security' %}settings-tab--active{% endif %}">
          <i class="ph ph-shield-check text-lg"></i>
          <span>Guvenlik</span>
        </a>
      </li>

      <li>
        <a href="/settings/notifications"
           hx-get="/api/v1/partials/settings/notification-prefs"
           hx-target="#settings-content"
           hx-push-url="/settings/notifications"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'notifications' %}settings-tab--active{% endif %}">
          <i class="ph ph-bell text-lg"></i>
          <span>Bildirimler</span>
        </a>
      </li>

      <li>
        <a href="/settings/api-keys"
           hx-get="/api/v1/partials/settings/api-keys"
           hx-target="#settings-content"
           hx-push-url="/settings/api-keys"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'api-keys' %}settings-tab--active{% endif %}">
          <i class="ph ph-key text-lg"></i>
          <span>API Anahtarlari</span>
        </a>
      </li>

      <li>
        <a href="/settings/appearance"
           hx-get="/api/v1/partials/settings/appearance"
           hx-target="#settings-content"
           hx-push-url="/settings/appearance"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'appearance' %}settings-tab--active{% endif %}">
          <i class="ph ph-palette text-lg"></i>
          <span>Gorunum</span>
        </a>
      </li>

      {% if current_user.role in ['tenant_owner', 'studio_admin'] %}
      <li>
        <a href="/settings/tenant"
           hx-get="/api/v1/partials/settings/tenant"
           hx-target="#settings-content"
           hx-push-url="/settings/tenant"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'tenant' %}settings-tab--active{% endif %}">
          <i class="ph ph-buildings text-lg"></i>
          <span>Kurum Ayarlari</span>
        </a>
      </li>

      <li>
        <a href="/settings/webhooks"
           hx-get="/api/v1/partials/settings/webhooks"
           hx-target="#settings-content"
           hx-push-url="/settings/webhooks"
           hx-swap="innerHTML"
           class="settings-tab {% if active_tab == 'webhooks' %}settings-tab--active{% endif %}">
          <i class="ph ph-webhooks-logo text-lg"></i>
          <span>Webhook'lar</span>
        </a>
      </li>
      {% endif %}

    </ul>
  </nav>

  <!-- Sag Icerik Alani -->
  <div id="settings-content" class="flex-1 min-w-0">
    {% include active_partial %}
  </div>

</div>
```

**CSS class'lari** (Tailwind):
- `.settings-tab`: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap`
- `.settings-tab--active`: `bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400`

---

## 2. ProfileForm

Kullanici profil bilgilerini duzenleyen form.

```html
<!-- templates/modules/settings/partials/profile-form.html -->
<form hx-patch="/api/v1/partials/settings/profile"
      hx-target="#settings-content"
      hx-swap="innerHTML"
      x-data="{ submitting: false }"
      @htmx:before-request="submitting = true"
      @htmx:after-request="submitting = false"
      class="max-w-2xl space-y-6">

  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
    Profil Bilgileri
  </h2>

  <!-- Avatar -->
  {% include 'modules/settings/components/avatar-upload.html' %}

  <!-- Ad Soyad -->
  <div>
    <label for="display_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Ad Soyad
    </label>
    <input type="text" id="display_name" name="display_name"
           value="{{ user.display_name }}"
           minlength="2" maxlength="100" required
           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
  </div>

  <!-- E-posta (salt okunur) -->
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      E-posta
    </label>
    <input type="email" value="{{ user.email }}" disabled
           class="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg
                  block w-full p-2.5 cursor-not-allowed
                  dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400">
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      E-posta degisikligi icin destek ekibiyle iletisime gecin.
    </p>
  </div>

  <!-- Biyografi -->
  <div>
    <label for="bio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Biyografi
    </label>
    <textarea id="bio" name="bio" rows="3" maxlength="500"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >{{ user.bio or '' }}</textarea>
    <p class="mt-1 text-xs text-gray-500" x-data="{ count: '{{ (user.bio or '')|length }}' }">
      <span x-text="count"></span>/500 karakter
    </p>
  </div>

  <!-- Gonder -->
  <div class="flex justify-end">
    <button type="submit" :disabled="submitting"
            class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4
                   focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5
                   dark:bg-primary-600 dark:hover:bg-primary-700
                   disabled:opacity-50 disabled:cursor-not-allowed">
      <span x-show="!submitting">Kaydet</span>
      <span x-show="submitting" class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">...</svg>
        Kaydediliyor...
      </span>
    </button>
  </div>

  {% if message %}
  <div class="p-4 text-sm rounded-lg
              {% if message_type == 'success' %}text-green-800 bg-green-50 dark:bg-green-900/20 dark:text-green-400
              {% else %}text-red-800 bg-red-50 dark:bg-red-900/20 dark:text-red-400{% endif %}">
    {{ message }}
  </div>
  {% endif %}

</form>
```

---

## 3. AvatarUpload

Avatar yukleme ve onizleme bileseni.

```html
<!-- templates/modules/settings/components/avatar-upload.html -->
<div x-data="avatarUpload()" class="flex items-center gap-4">

  <!-- Avatar Onizleme -->
  <div class="relative">
    <img :src="previewUrl || '{{ user.avatar_url or '/static/img/default-avatar.svg' }}'"
         alt="Avatar" class="w-20 h-20 rounded-full object-cover border-2
                             border-gray-200 dark:border-gray-600">
    <div x-show="uploading"
         class="absolute inset-0 flex items-center justify-center
                bg-black/50 rounded-full">
      <svg class="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">...</svg>
    </div>
  </div>

  <!-- Upload -->
  <div>
    <input type="file" id="avatar-input" accept="image/jpeg,image/png,image/webp"
           class="hidden" @change="uploadAvatar($event)">
    <label for="avatar-input"
           class="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-500
                  dark:text-primary-400 dark:hover:text-primary-300">
      <i class="ph ph-upload-simple mr-1"></i>
      Fotograf Degistir
    </label>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
      JPEG, PNG veya WebP. Maks. 2MB.
    </p>
  </div>

</div>

<script>
function avatarUpload() {
  return {
    previewUrl: null,
    uploading: false,

    async uploadAvatar(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Dosya boyutu 2MB\'dan kucuk olmalidir.');
        return;
      }

      this.previewUrl = URL.createObjectURL(file);
      this.uploading = true;

      const formData = new FormData();
      formData.append('avatar', file);

      htmx.ajax('POST', '/api/v1/partials/settings/avatar', {
        target: '#avatar-container',
        swap: 'outerHTML',
        values: formData
      });

      this.uploading = false;
    }
  };
}
</script>
```

---

## 4. PasswordChangeForm

Parola degistirme formu (guvenlik sekmesi icerisinde).

```html
<!-- templates/modules/settings/partials/security-form.html icinde -->
<form hx-post="/api/v1/partials/settings/password"
      hx-target="#password-section"
      hx-swap="outerHTML"
      x-data="passwordForm()"
      class="space-y-4 max-w-md">

  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
    Parola Degistir
  </h3>

  <div>
    <label class="block mb-2 text-sm font-medium">Mevcut Parola</label>
    <div class="relative">
      <input :type="showCurrent ? 'text' : 'password'"
             name="current_password" required
             class="flowbite-input w-full pr-10">
      <button type="button" @click="showCurrent = !showCurrent"
              class="absolute right-2.5 top-2.5 text-gray-500">
        <i class="ph" :class="showCurrent ? 'ph-eye-slash' : 'ph-eye'"></i>
      </button>
    </div>
  </div>

  <div>
    <label class="block mb-2 text-sm font-medium">Yeni Parola</label>
    <div class="relative">
      <input :type="showNew ? 'text' : 'password'"
             name="new_password" required minlength="8"
             @input="checkStrength($event.target.value)"
             class="flowbite-input w-full pr-10">
      <button type="button" @click="showNew = !showNew"
              class="absolute right-2.5 top-2.5 text-gray-500">
        <i class="ph" :class="showNew ? 'ph-eye-slash' : 'ph-eye'"></i>
      </button>
    </div>
    <!-- Parola guc gostergesi -->
    <div class="mt-2 flex gap-1">
      <template x-for="i in 4">
        <div class="h-1 flex-1 rounded"
             :class="i <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'">
        </div>
      </template>
    </div>
    <p class="text-xs mt-1" :class="strengthTextColor" x-text="strengthText"></p>
  </div>

  <div>
    <label class="block mb-2 text-sm font-medium">Yeni Parola (Tekrar)</label>
    <input type="password" name="confirm_password" required
           class="flowbite-input w-full">
  </div>

  <button type="submit"
          class="text-white bg-primary-700 hover:bg-primary-800
                 font-medium rounded-lg text-sm px-5 py-2.5">
    Parolayi Degistir
  </button>

</form>

<script>
function passwordForm() {
  return {
    showCurrent: false,
    showNew: false,
    strength: 0,
    strengthText: '',
    strengthColor: 'bg-gray-200',
    strengthTextColor: 'text-gray-500',

    checkStrength(password) {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      this.strength = score;
      const levels = [
        { text: '', color: 'bg-gray-200', tc: 'text-gray-500' },
        { text: 'Zayif', color: 'bg-red-500', tc: 'text-red-500' },
        { text: 'Orta', color: 'bg-yellow-500', tc: 'text-yellow-500' },
        { text: 'Iyi', color: 'bg-blue-500', tc: 'text-blue-500' },
        { text: 'Guclu', color: 'bg-green-500', tc: 'text-green-500' }
      ];
      this.strengthText = levels[score].text;
      this.strengthColor = levels[score].color;
      this.strengthTextColor = levels[score].tc;
    }
  };
}
</script>
```

---

## 5. TwoFactorToggle

2FA aktif/pasif toggle ve kurulum arayuzu.

```html
<!-- templates/modules/settings/components/two-factor-setup.html -->
<div x-data="twoFactorSetup()" class="space-y-4">

  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Iki Faktorlu Dogrulama
      </h3>
      <p class="text-sm text-gray-500">
        Hesabinizi ek bir guvenlik katmani ile koruyun.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-sm"
            :class="enabled ? 'text-green-500' : 'text-gray-500'"
            x-text="enabled ? 'Aktif' : 'Pasif'"></span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" :checked="enabled"
               @change="toggle()"
               class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300
                    rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                    peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px]
                    after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5
                    after:transition-all"></div>
      </label>
    </div>
  </div>

  <!-- Kurulum Modali -->
  <div x-show="showSetup" x-cloak
       class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
       @keydown.escape.window="showSetup = false">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
         @click.away="showSetup = false">
      <!-- QR kodu, TOTP input, recovery codes burada -->
    </div>
  </div>

</div>

<script>
function twoFactorSetup() {
  return {
    enabled: {{ 'true' if user.two_factor_enabled else 'false' }},
    showSetup: false,
    qrCode: null,
    recoveryCodes: [],

    async toggle() {
      if (!this.enabled) {
        // Aktifleştirme — QR kodu al ve modali ac
        htmx.ajax('POST', '/api/v1/partials/settings/2fa/enable', {
          target: '#two-factor-section',
          swap: 'innerHTML'
        });
      } else {
        // Devre disi birakma — parola dogrulama gerektirir
        this.showDisableConfirm = true;
      }
    }
  };
}
</script>
```

---

## 6. SessionList

Aktif oturumlarin listesi. Her satir icin oturum sonlandirma butonu.

```html
<!-- templates/modules/settings/partials/security-form.html icinde -->
<div id="sessions-list" class="space-y-3">
  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
    Aktif Oturumlar
  </h3>

  {% for session in sessions %}
  <div id="session-{{ session.uid }}"
       class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div class="flex items-center gap-3">
      <i class="ph ph-{{ session.device_icon }} text-xl text-gray-500"></i>
      <div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ session.browser }} / {{ session.os }}
          {% if session.is_current %}
          <span class="ml-2 text-xs text-green-500 font-normal">(bu oturum)</span>
          {% endif %}
        </p>
        <p class="text-xs text-gray-500">
          {{ session.location }} &middot; {{ session.last_active | timeago }}
        </p>
      </div>
    </div>

    {% if not session.is_current %}
    <button hx-delete="/api/v1/partials/settings/sessions/{{ session.uid }}"
            hx-target="#session-{{ session.uid }}"
            hx-swap="outerHTML swap:500ms"
            hx-confirm="Bu oturumu sonlandirmak istediginizden emin misiniz?"
            class="text-red-600 hover:text-red-800 text-sm font-medium
                   dark:text-red-400 dark:hover:text-red-300">
      Sonlandir
    </button>
    {% endif %}
  </div>
  {% endfor %}

  {% if sessions|length > 1 %}
  <button hx-post="/api/v1/partials/settings/sessions/revoke-all"
          hx-target="#sessions-list"
          hx-swap="innerHTML"
          hx-confirm="Mevcut oturum haric tum oturumlar kapatilacak. Devam etmek istiyor musunuz?"
          class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 font-medium">
    Tum Diger Oturumlari Kapat
  </button>
  {% endif %}
</div>
```

---

## 7. NotificationPrefsGrid

Kanal x olay tipi matris toggle tablosi.

```html
<!-- templates/modules/settings/partials/notification-prefs.html -->
<div class="space-y-6">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
    Bildirim Tercihleri
  </h2>

  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left">
      <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-3">Olay Tipi</th>
          <th class="px-4 py-3 text-center">In-App</th>
          <th class="px-4 py-3 text-center">E-posta</th>
          <th class="px-4 py-3 text-center">Webhook</th>
        </tr>
      </thead>
      <tbody>
        {% for event in notification_events %}
        <tr class="border-b dark:border-gray-700">
          <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
            <i class="ph ph-{{ event.icon }} mr-2"></i>
            {{ event.label }}
          </td>
          {% for channel in ['in_app', 'email', 'webhook'] %}
          <td class="px-4 py-3 text-center">
            {% if event.slug == 'security_alert' and channel == 'in_app' %}
            <!-- Guvenlik alarmi in-app zorunlu, devre disi birakilamaz -->
            <label class="relative inline-flex items-center cursor-not-allowed opacity-60">
              <input type="checkbox" checked disabled class="sr-only peer">
              <div class="w-9 h-5 bg-primary-600 rounded-full after:content-['']
                          after:absolute after:top-[2px] after:start-[2px] after:bg-white
                          after:rounded-full after:h-4 after:w-4 after:translate-x-full"></div>
            </label>
            {% else %}
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox"
                     {% if prefs[event.slug][channel] %}checked{% endif %}
                     hx-patch="/api/v1/partials/settings/notification-toggle"
                     hx-vals='{"channel": "{{ channel }}", "event_type": "{{ event.slug }}", "enabled": {{ "false" if prefs[event.slug][channel] else "true" }}}'
                     hx-target="closest label"
                     hx-swap="outerHTML"
                     class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-checked:bg-primary-600 rounded-full
                          peer after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                          after:bg-white after:rounded-full after:h-4 after:w-4
                          after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
            {% endif %}
          </td>
          {% endfor %}
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>
```

---

## 8. APIKeyTable

API anahtar listesi: maskelenmis anahtarlar, kopyala butonu, sil butonu.

```html
<!-- templates/modules/settings/partials/api-keys.html -->
<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
      API Anahtarlari
    </h2>
    <button @click="$dispatch('open-modal', { id: 'create-api-key' })"
            class="text-white bg-primary-700 hover:bg-primary-800
                   font-medium rounded-lg text-sm px-4 py-2">
      <i class="ph ph-plus mr-1"></i> Yeni Anahtar
    </button>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left">
      <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-3">Ad</th>
          <th class="px-4 py-3">Anahtar</th>
          <th class="px-4 py-3">Kapsam</th>
          <th class="px-4 py-3">Son Kullanim</th>
          <th class="px-4 py-3">Bitis</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody id="api-key-rows">
        {% for key in api_keys %}
        {% include 'modules/settings/components/api-key-row.html' %}
        {% endfor %}
      </tbody>
    </table>
  </div>

  <p class="text-sm text-gray-500">
    Toplam: {{ api_keys|length }} aktif anahtar (maksimum 10)
  </p>
</div>
```

---

## 9. AppearanceForm

Tema, dil ve zaman dilimi secim formu.

```html
<!-- templates/modules/settings/partials/appearance.html -->
<div x-data="appearanceForm()" class="space-y-8 max-w-lg">

  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
    Gorunum Tercihleri
  </h2>

  <!-- Tema Secimi -->
  <fieldset>
    <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Tema</legend>
    <div class="flex gap-3">
      <template x-for="option in themeOptions">
        <button type="button"
                @click="selectTheme(option.value)"
                :class="theme === option.value
                  ? 'ring-2 ring-primary-500 border-primary-500'
                  : 'border-gray-300 dark:border-gray-600'"
                class="flex flex-col items-center gap-2 p-4 border rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <i class="ph text-2xl" :class="option.icon"></i>
          <span class="text-sm" x-text="option.label"></span>
        </button>
      </template>
    </div>
  </fieldset>

  <!-- Dil -->
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dil</label>
    <select x-model="locale"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <option value="tr">Turkce</option>
      <option value="en">English</option>
    </select>
  </div>

  <!-- Zaman Dilimi -->
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zaman Dilimi</label>
    <select x-model="timezone"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {% for tz in timezones %}
      <option value="{{ tz.value }}" {% if tz.value == user_prefs.timezone %}selected{% endif %}>
        {{ tz.label }}
      </option>
      {% endfor %}
    </select>
  </div>

  <button type="button" @click="save()"
          class="text-white bg-primary-700 hover:bg-primary-800
                 font-medium rounded-lg text-sm px-5 py-2.5">
    Kaydet
  </button>

</div>

<script>
function appearanceForm() {
  return {
    theme: '{{ user_prefs.theme }}',
    locale: '{{ user_prefs.locale }}',
    timezone: '{{ user_prefs.timezone }}',
    themeOptions: [
      { value: 'light', label: 'Acik', icon: 'ph-sun' },
      { value: 'dark', label: 'Koyu', icon: 'ph-moon' },
      { value: 'system', label: 'Sistem', icon: 'ph-circle-half' }
    ],

    selectTheme(value) {
      this.theme = value;
      // Aninda uygula
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (value === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
      localStorage.setItem('theme', value);
    },

    save() {
      htmx.ajax('PATCH', '/api/v1/partials/settings/appearance', {
        target: '#settings-content',
        swap: 'innerHTML',
        values: { theme: this.theme, locale: this.locale, timezone: this.timezone }
      });
    }
  };
}
</script>
```

---

## 10. WebhookForm

Webhook olusturma formu.

```html
<!-- templates/modules/settings/components/webhook-form.html -->
<form hx-post="/api/v1/partials/settings/webhooks"
      hx-target="#webhook-list"
      hx-swap="innerHTML"
      x-data="webhookForm()"
      class="space-y-4">

  <div>
    <label class="block mb-2 text-sm font-medium">Webhook Adi</label>
    <input type="text" name="name" required minlength="2" maxlength="100"
           placeholder="ornek: Slack Bildirim"
           class="flowbite-input w-full">
  </div>

  <div>
    <label class="block mb-2 text-sm font-medium">URL (HTTPS)</label>
    <input type="url" name="url" required
           pattern="https://.*"
           placeholder="https://hooks.example.com/webhook"
           class="flowbite-input w-full">
  </div>

  <div>
    <label class="block mb-2 text-sm font-medium">Dinlenecek Olaylar</label>
    <div class="space-y-2 max-h-48 overflow-y-auto p-3 border rounded-lg
                dark:border-gray-600">
      {% for event in webhook_events %}
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="events" value="{{ event.slug }}"
               class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500
                      dark:bg-gray-700 dark:border-gray-600">
        <span class="text-sm text-gray-900 dark:text-white">{{ event.label }}</span>
      </label>
      {% endfor %}
    </div>
  </div>

  <div class="flex justify-end gap-3">
    <button type="button" @click="$dispatch('close-modal')"
            class="text-gray-500 bg-white border border-gray-300 rounded-lg
                   text-sm font-medium px-5 py-2.5 dark:bg-gray-700 dark:text-gray-300
                   dark:border-gray-500">
      Iptal
    </button>
    <button type="submit"
            class="text-white bg-primary-700 hover:bg-primary-800
                   font-medium rounded-lg text-sm px-5 py-2.5">
      Olustur
    </button>
  </div>

</form>

<script>
function webhookForm() {
  return {
    // Minimum 1 olay secimi zorunlu — form validation
    init() {
      this.$el.addEventListener('submit', (e) => {
        const checked = this.$el.querySelectorAll('input[name="events"]:checked');
        if (checked.length === 0) {
          e.preventDefault();
          alert('En az bir olay secmelisiniz.');
        }
      });
    }
  };
}
</script>
```

---

## 11. WebhookTestButton

Webhook test gonderimi butonu (satir icinde).

```html
<!-- templates/modules/settings/components/webhook-row.html -->
<tr id="webhook-{{ webhook.uid }}" class="border-b dark:border-gray-700">
  <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
    {{ webhook.name }}
  </td>
  <td class="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[200px]"
      title="{{ webhook.url }}">
    {{ webhook.url }}
  </td>
  <td class="px-4 py-3">
    <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
      {{ webhook.events|length }} olay
    </span>
  </td>
  <td class="px-4 py-3">
    {% if webhook.is_active %}
    <span class="flex items-center gap-1 text-green-500 text-sm">
      <i class="ph ph-check-circle"></i> OK
    </span>
    {% else %}
    <span class="flex items-center gap-1 text-red-500 text-sm">
      <i class="ph ph-x-circle"></i> Hata
    </span>
    {% endif %}
  </td>
  <td class="px-4 py-3 flex gap-2">
    <button hx-post="/api/v1/partials/settings/webhooks/{{ webhook.uid }}/test"
            hx-target="#webhook-{{ webhook.uid }}"
            hx-swap="outerHTML"
            class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
            title="Test Gonder">
      <i class="ph ph-paper-plane-tilt"></i>
    </button>
    <button hx-delete="/api/v1/partials/settings/webhooks/{{ webhook.uid }}"
            hx-target="#webhook-{{ webhook.uid }}"
            hx-swap="outerHTML swap:500ms"
            hx-confirm="Bu webhook'u silmek istediginizden emin misiniz?"
            class="text-red-600 hover:text-red-800 dark:text-red-400"
            title="Sil">
      <i class="ph ph-trash"></i>
    </button>
  </td>
</tr>
```

---

## 12. SecurityScoreBadge

Guvenlik skoru gostergesi.

```html
<!-- templates/modules/settings/components/security-score-badge.html -->
<div x-data="{ score: {{ security_score }} }" class="flex items-center gap-2">
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Guvenlik Skoru:</span>
  <div class="flex items-center gap-2">
    <div class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all duration-500"
           :class="{
             'bg-red-500': score < 40,
             'bg-yellow-500': score >= 40 && score < 70,
             'bg-green-500': score >= 70
           }"
           :style="'width: ' + score + '%'"></div>
    </div>
    <span class="text-sm font-bold"
          :class="{
            'text-red-500': score < 40,
            'text-yellow-500': score >= 40 && score < 70,
            'text-green-500': score >= 70
          }"
          x-text="score"></span>
  </div>
</div>
```

Skor hesaplama kriterleri:
- 2FA aktif: +30 puan
- Guclu parola (90 gunden yeni): +25 puan
- Tek aktif oturum: +15 puan
- API anahtarlari sureli: +15 puan
- Recovery code'lar olusturulmus: +15 puan
