# auth — Wireframe'ler

> ASCII mockup'lar. Tum auth sayfalari sidebar'siz tek kolon layout kullanir.
> Dark tema (bg-gray-900). Flowbite Pro form componentleri.

---

## 1. Login Sayfasi (`/auth/login`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        bg-gray-900 (tam ekran)                      │
│                                                                     │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │        ◆ atonota            │                    │
│                  │      Developer Studio        │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ E-posta adresi           ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │ ornek@sirket.com       │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Parola                   ││                    │
│                  │  │ ┌──────────────────┐ [👁] ││                   │
│                  │  │ │ ••••••••         │     ││                    │
│                  │  │ └──────────────────┘     ││                    │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌─┐ Beni hatirla           │                    │
│                  │  └─┘                        │                    │
│                  │            Parolami unuttum ──>                   │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │       Giris Yap           ││                   │
│                  │  │    (btn-primary, w-full)  ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ─────── veya ───────        │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │  [G] Google ile giris yap ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │  [GH] GitHub ile giris    ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  Hesabiniz yok mu? Kayit ol ──>                   │
│                  │                              │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │ [!] Hatali e-posta veya      │ <- hata banner    │
│                  │     parola. Tekrar deneyin.   │    (gizli, HTMX   │
│                  └─────────────────────────────┘     ile gosterilir) │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Layout Notlari
- Kart: `max-w-md mx-auto mt-20 p-8 bg-gray-800 rounded-xl shadow-xl`
- Logo: SVG, ortalanmis, `mb-6`
- Hata banner: `bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-4`
- Basarili banner: `bg-green-900/50 border border-green-500 text-green-300`

---

## 2. Register Sayfasi (`/auth/register`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        bg-gray-900 (tam ekran)                      │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │        ◆ atonota            │                    │
│                  │     Hesap Olusturun          │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Ad Soyad                 ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ E-posta adresi           ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Parola                   ││                    │
│                  │  │ ┌──────────────────┐ [👁] ││                   │
│                  │  │ │                  │     ││                    │
│                  │  │ └──────────────────┘     ││                    │
│                  │  │                          ││                    │
│                  │  │  ┌─────────────────────┐ ││ <- password       │
│                  │  │  │ ████░░░░░░ Orta     │ ││    strength       │
│                  │  │  └─────────────────────┘ ││    indicator      │
│                  │  │  Min 8 karakter, 1 buyuk, ││                   │
│                  │  │  1 rakam, 1 ozel karakter ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Parola Tekrar            ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Davet kodu (opsiyonel)   ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌─┐ Kullanim Kosullarini   │                    │
│                  │  └─┘ kabul ediyorum          │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │      Hesap Olustur        ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  Zaten hesabiniz var mi?      │                    │
│                  │  Giris yapin ──>              │                    │
│                  │                              │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Parola Unuttum (`/auth/forgot-password`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        bg-gray-900 (tam ekran)                      │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │        ◆ atonota            │                    │
│                  │    Parolanizi Sifirlayin     │                    │
│                  │                              │                    │
│                  │  Kayitli e-posta adresinizi  │                    │
│                  │  girin. Size sifirlama       │                    │
│                  │  linki gonderecegiz.         │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ E-posta adresi           ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │   Sifirlama Linki Gonder  ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  <── Giris sayfasina don     │                    │
│                  │                              │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
│         Basarili gonderim sonrasi (HTMX swap):                      │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │  [✓] E-posta gonderildi!     │                   │
│                  │                              │                    │
│                  │  ornek@sirket.com adresine   │                    │
│                  │  sifirlama linki gonderdik.  │                    │
│                  │  Lutfen gelen kutunuzu       │                    │
│                  │  kontrol edin.               │                    │
│                  │                              │                    │
│                  │  E-posta gelmediyse spam     │                    │
│                  │  klasorunu kontrol edin.     │                    │
│                  │                              │                    │
│                  │  [Tekrar Gonder]  (60 sn)    │                   │
│                  └─────────────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Parola Sifirla (`/auth/reset-password/{token}`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        bg-gray-900 (tam ekran)                      │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │        ◆ atonota            │                    │
│                  │    Yeni Parola Belirleyin    │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Yeni Parola              ││                    │
│                  │  │ ┌──────────────────┐ [👁] ││                   │
│                  │  │ │                  │     ││                    │
│                  │  │ └──────────────────┘     ││                    │
│                  │  │  ┌─────────────────────┐ ││                    │
│                  │  │  │ ░░░░░░░░░░ Zayif   │ ││                    │
│                  │  │  └─────────────────────┘ ││                    │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │ Yeni Parola Tekrar       ││                    │
│                  │  │ ┌────────────────────────┐││                   │
│                  │  │ │                        │││                   │
│                  │  │ └────────────────────────┘││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │     Parolayi Degistir     ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
│         Token gecersiz durumu:                                       │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │  [!] Bu sifirlama linki      │                   │
│                  │  gecersiz veya suresi dolmus. │                   │
│                  │                              │                    │
│                  │  [Yeni Link Iste]            │                   │
│                  └─────────────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Iki Faktor Dogrulama (`/auth/two-factor`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        bg-gray-900 (tam ekran)                      │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │        ◆ atonota            │                    │
│                  │   Iki Faktorlu Dogrulama     │                    │
│                  │                              │                    │
│                  │  Dogrulama uygulamanizdan     │                    │
│                  │  (Google Authenticator vb.)   │                    │
│                  │  6 haneli kodu girin.         │                    │
│                  │                              │                    │
│                  │  ┌───┐ ┌───┐ ┌───┐  ┌───┐ ┌───┐ ┌───┐         │
│                  │  │   │ │   │ │   │  │   │ │   │ │   │         │
│                  │  │ _ │ │ _ │ │ _ │  │ _ │ │ _ │ │ _ │         │
│                  │  │   │ │   │ │   │  │   │ │   │ │   │         │
│                  │  └───┘ └───┘ └───┘  └───┘ └───┘ └───┘         │
│                  │                              │                    │
│                  │  6 haneli kod (otomatik       │                    │
│                  │  submit — son hane girilince) │                    │
│                  │                              │                    │
│                  │  ┌──────────────────────────┐│                    │
│                  │  │        Dogrula            ││                   │
│                  │  └──────────────────────────┘│                    │
│                  │                              │                    │
│                  │  Kodunuza erisenmiyor        │                    │
│                  │  musunuz?                    │                    │
│                  │  Kurtarma kodu kullan ──>    │                    │
│                  │                              │                    │
│                  │  <── Farkli hesapla giris    │                    │
│                  │                              │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
│         Hatali kod durumu:                                           │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │  [!] Gecersiz kod. Kalan     │                   │
│                  │  deneme hakki: 4             │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Davranis

```
Desktop (>= 1024px)  : Kart max-w-md, ortalanmis
Tablet  (768-1023px) : Kart max-w-md, ortalanmis, padding azaltilmis
Mobil   (< 768px)    : Kart tam genislik, padding p-4, logo kucuk

Tum formlarda:
- Input'lar w-full
- Butonlar w-full
- Sosyal giris butonlari yigilib (vertical stack)
```
