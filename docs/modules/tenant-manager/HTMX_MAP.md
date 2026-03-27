# tenant-manager — HTMX Partial Haritasi

> Tenant yonetimi HTMX etkilesimleri. Cursor pagination, tab switching,
> inline arama, sihirbaz adim navigasyonu, davet modal.

---

## Genel Prensipler

- Tenant tablosu cursor-based pagination kullanir (offset yasak)
- Tab icerikleri `hx-trigger="click once"` ile lazy load edilir
- Arama ve filtre degisiklikleri tabloyu yeniden yukler
- Sihirbaz adimlari HTMX partial olarak swap edilir
- Modal icerikleri HTMX ile yuklenir, Alpine.js ile gorunurluk yonetilir
- Tum partial'lar authenticated + yetki kontrollu

---

## 1. Tenant Tablosu Yuklemesi (Ilk Yukleme)

```
Sayfa       : /tenants
Element     : <div id="tenant-table-body">
Trigger     : hx-trigger="load"
Method      : hx-get="/api/v1/partials/tenant-list"
Target      : hx-target="#tenant-table-body"
Swap        : hx-swap="innerHTML"

Server Response:
  Status    : 200
  Body      :
    <tbody>
        {% for tenant in tenants %}
        <tr class="border-b border-gray-700 hover:bg-gray-750"
            data-tenant-uid="{{ tenant.uid }}">
            <td class="px-4 py-3">
                <input type="checkbox" class="...">
            </td>
            <td class="px-4 py-3">
                <a href="/tenants/{{ tenant.uid }}" class="text-blue-400 hover:text-blue-300 font-medium">
                    {{ tenant.name }}
                </a>
                <p class="text-xs text-gray-500">{{ tenant.slug }} · {{ tenant.created_at | timeago }}</p>
            </td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full
                    {{ 'bg-purple-900/30 text-purple-400' if tenant.plan == 'enterprise'
                       else 'bg-blue-900/30 text-blue-400' if tenant.plan == 'pro'
                       else 'bg-gray-700 text-gray-400' }}">
                    {{ tenant.plan | title }}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-400">{{ tenant.workspace_count }}</td>
            <td class="px-4 py-3">
                {% include 'modules/tenant_manager/components/health-badge.html' %}
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-xs
                    {{ 'text-green-400' if tenant.is_active else 'text-gray-500' }}">
                    <span class="w-1.5 h-1.5 rounded-full
                        {{ 'bg-green-400' if tenant.is_active else 'bg-gray-500' }}"></span>
                    {{ 'Aktif' if tenant.is_active else 'Pasif' }}
                </span>
            </td>
            <td class="px-4 py-3">
                <!-- Islem dropdown -->
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open" class="p-1 text-gray-400 hover:text-white rounded">
                        <i class="ph ph-dots-three-outline-vertical"></i>
                    </button>
                    <div x-show="open" @click.outside="open = false" x-transition
                         class="absolute right-0 mt-1 w-40 bg-gray-700 rounded-lg shadow-xl
                                border border-gray-600 z-50 py-1">
                        <a href="/tenants/{{ tenant.uid }}"
                           class="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-600">
                            <i class="ph ph-eye"></i> Detay
                        </a>
                        <a href="/tenants/{{ tenant.uid }}/users"
                           class="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-600">
                            <i class="ph ph-users"></i> Kullanicilar
                        </a>
                        <div class="border-t border-gray-600 my-1"></div>
                        <button hx-delete="/api/v1/tenants/{{ tenant.uid }}"
                                hx-confirm="Bu tenant'i silmek istediginizden emin misiniz?"
                                hx-target="closest tr"
                                hx-swap="outerHTML swap:500ms"
                                class="flex items-center gap-2 w-full px-3 py-2 text-sm
                                       text-red-400 hover:bg-gray-600">
                            <i class="ph ph-trash"></i> Sil
                        </button>
                    </div>
                </div>
            </td>
        </tr>
        {% endfor %}
    </tbody>

    <!-- Cursor Pagination -->
    {% if next_cursor %}
    <tfoot>
        <tr>
            <td colspan="7" class="px-4 py-3 text-center">
                <button hx-get="/api/v1/partials/tenant-list?cursor={{ next_cursor }}"
                        hx-target="#tenant-table-body"
                        hx-swap="innerHTML"
                        hx-include="[name='search'], [name='plan'], [name='sort']"
                        class="text-sm text-blue-400 hover:text-blue-300">
                    Daha fazla yukle <i class="ph ph-arrow-down"></i>
                </button>
            </td>
        </tr>
    </tfoot>
    {% endif %}
```

---

## 2. Inline Arama (Debounce)

```
Sayfa       : /tenants
Element     : <input name="search">
Trigger     : hx-trigger="keyup changed delay:300ms"
Method      : hx-get="/api/v1/partials/tenant-list"
Target      : hx-target="#tenant-table-body"
Swap        : hx-swap="innerHTML"
Include     : hx-include="[name='plan'], [name='sort']"

NOT: Her keystroke'da degil, 300ms duraklamadan sonra tetiklenir.
     Plan filtresi ve siralama da istek ile birlikte gonderilir.
     Bos arama tum sonuclari getirir.
```

---

## 3. Plan Filtre + Siralama Degisimi

```
Sayfa       : /tenants
Element     : <select name="plan">, <select name="sort">
Trigger     : hx-trigger="change"
Method      : hx-get="/api/v1/partials/tenant-list"
Target      : hx-target="#tenant-table-body"
Swap        : hx-swap="innerHTML"
Include     : hx-include="[name='search'], [name='plan'], [name='sort']"

NOT: Filtre veya siralama degistiginde tablo sifirdan yuklenir (cursor resetlenir).
```

---

## 4. Tab Gecisi (Tenant Detay)

```
Sayfa       : /tenants/{uid}
Element     : <button> (her tab butonu)
Trigger     : hx-trigger="click once"
Method      : hx-get dinamik (tab.id'ye gore)
Target      : hx-target="#tab-content"
Swap        : hx-swap="innerHTML transition:true"

Tab URL'leri:
  overview  : /tenants/{uid}          (server-side, varsayilan)
  users     : /tenants/{uid}/users    (HTMX partial)
  settings  : /tenants/{uid}/settings (HTMX partial)

NOT: "once" modifier — tab icerigi bir kez yuklenir.
     Tekrar tiklaninca HTMX istek gondermez (cache'den gosterir).
     Eger tab iceriginin guncellenmesi gerekiyorsa:
     htmx.trigger(tabButton, 'htmx:abort') ile once cache temizlenir.

Server Response (users tab):
  <div id="tab-content">
      <!-- Kullanici tablosu -->
      <div class="flex justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Kullanicilar ({{ user_count }})</h3>
          <button @click="$dispatch('open-invite-modal')"
                  class="...">
              <i class="ph ph-plus"></i> Davet Et
          </button>
      </div>
      <table>...</table>

      <!-- Bekleyen davetler -->
      {% if pending_invitations %}
      <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-400 mb-3">Bekleyen Davetler ({{ pending_count }})</h4>
          ...
      </div>
      {% endif %}
  </div>
```

---

## 5. Sihirbaz Adim Navigasyonu

```
Sayfa       : /tenants/create
Element     : <form id="wizard-form">
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/partials/tenant-create-wizard"
Target      : hx-target="#wizard-step-content"
Swap        : hx-swap="innerHTML transition:true"
Indicator   : hx-indicator="#wizard-spinner"

Request (her adimda):
  step           : int (mevcut adim numarasi)
  + o adima ait form alanlari

Server Response (adim basarili, devam):
  Status    : 200
  Body      : Sonraki adim partial HTML

Server Response (adim basarili, son adim):
  Status    : 200
  Header    : HX-Redirect: /tenants/{yeni_uid}

Server Response (validasyon hatasi):
  Status    : 200
  Body      : Mevcut adim partial (hata mesajlari dahil)

Adim Gecisi Akisi:
  1. Kullanici formu doldurur, "Sonraki" tiklar
  2. Alpine.js currentStep arttirir (adim gostergesi guncellenir)
  3. HTMX form'u submit eder (mevcut adim verileri gonderilir)
  4. Server validasyon yapar:
     - Basarili: sonraki adim HTML doner
     - Hata: mevcut adim + hata mesaji doner, Alpine.js currentStep geri alinir
  5. Son adimda "Tenant Olustur" tiklaninca:
     - Server tenant olusturur
     - HX-Redirect: /tenants/{uid} ile detay sayfasina yonlendirir

"Geri" butonu:
  - HTMX kullanmaz, sadece Alpine.js currentStep azaltir
  - Onceki adim formu zaten DOM'da (gizli), Alpine.js ile gosterilir
  - Veya: hx-get ile onceki adim partial'i cekilir (form verisi korunur)
```

---

## 6. Davet Modal (Submit)

```
Sayfa       : /tenants/{uid} (Kullanicilar tab'i)
Element     : <form> (modal icerisinde)
Trigger     : hx-trigger="submit"
Method      : hx-post="/api/v1/tenants/{uid}/invite"
Target      : hx-target="#invite-result"
Swap        : hx-swap="innerHTML"
Indicator   : hx-indicator="#invite-spinner"

Server Response (basarili):
  Status    : 200
  Body      :
    <div class="text-center py-4">
        <i class="ph ph-check-circle text-green-400 text-4xl mb-3"></i>
        <p class="text-sm text-gray-300">
            <strong>{{ email }}</strong> adresine
            <strong>{{ role }}</strong> rolu ile davet gonderildi.
        </p>
    </div>

  Ek Islem:
    - 2 saniye sonra modal kapanir (Alpine.js setTimeout)
    - Kullanicilar tab'i yeniden yuklenir:
      @htmx:after-request="htmx.trigger(document.querySelector('[data-tab=users]'), 'htmx:abort');
                           htmx.trigger(document.querySelector('[data-tab=users]'), 'click')"

Server Response (hata):
  Status    : 200
  Body      :
    <div id="invite-result">
        {% include 'modules/auth/components/alert-banner.html'
           with type='error', message='Bu kullanici zaten tenant uyeleri arasinda.' %}
    </div>
```

---

## 7. Tenant Silme (Inline)

```
Sayfa       : /tenants (tablo satirinda) veya /tenants/{uid} (detay sayfasinda)
Element     : <button> (sil butonu)
Trigger     : hx-trigger="click"
Method      : hx-delete="/api/v1/tenants/{uid}"
Target      : hx-target="closest tr" (tabloda) veya body (detayda)
Swap        : hx-swap="outerHTML swap:500ms" (tabloda fade-out animasyon)
Confirm     : hx-confirm="Bu tenant'i silmek istediginizden emin misiniz?"

Tabloda:
  Satir 500ms icinde fade-out olur (CSS transition ile)
  hx-swap="outerHTML swap:500ms" + CSS: .htmx-swapping { opacity: 0; transition: opacity 500ms; }

Detay Sayfasinda:
  Server Response:
    Header    : HX-Redirect: /tenants
    NOT       : Detay sayfasindan tenant listesine yonlendirir

Server Response (conflict):
  Status    : 409
  Body      : (HTMX afterSwap event ile gosterilir)
    <div class="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-sm text-yellow-300">
        Bu tenant'ta aktif workspace'ler var. Once workspace'leri silin.
    </div>
```

---

## 8. Settings Tab Form Submit

```
Sayfa       : /tenants/{uid} (Ayarlar tab'i)
Element     : <form id="tenant-settings-form">
Trigger     : hx-trigger="submit"
Method      : hx-patch="/api/v1/tenants/{uid}"
Target      : hx-target="#settings-result"
Swap        : hx-swap="innerHTML"
Indicator   : hx-indicator="#settings-spinner"

Server Response (basarili):
  <div id="settings-result">
      <div class="flex items-center gap-2 p-3 bg-green-900/30 border border-green-700
                  rounded-lg text-sm text-green-300 mb-4"
           x-data="{ show: true }"
           x-init="setTimeout(() => show = false, 3000)"
           x-show="show" x-transition>
          <i class="ph ph-check-circle"></i>
          Ayarlar basariyla guncellendi.
      </div>
  </div>
```

---

## Ozet Tablo

| Akis | Trigger | Endpoint | Target | Swap | Polling |
|------|---------|----------|--------|------|---------|
| Tablo yukle | load | GET tenant-list | #tenant-table-body | innerHTML | Hayir |
| Arama | keyup delay:300ms | GET tenant-list?search= | #tenant-table-body | innerHTML | Hayir |
| Plan filtre | change | GET tenant-list?plan= | #tenant-table-body | innerHTML | Hayir |
| Siralama | change | GET tenant-list?sort= | #tenant-table-body | innerHTML | Hayir |
| Cursor sonraki | click | GET tenant-list?cursor= | #tenant-table-body | innerHTML | Hayir |
| Tab gecisi | click once | GET tenants/{uid}/{tab} | #tab-content | innerHTML | Hayir |
| Sihirbaz ileri | submit | POST tenant-create-wizard | #wizard-step-content | innerHTML | Hayir |
| Davet gonder | submit | POST tenants/{uid}/invite | #invite-result | innerHTML | Hayir |
| Tenant sil | click (confirm) | DELETE tenants/{uid} | closest tr | outerHTML | Hayir |
| Ayarlar kaydet | submit | PATCH tenants/{uid} | #settings-result | innerHTML | Hayir |
