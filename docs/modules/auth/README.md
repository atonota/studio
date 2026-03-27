# Module 01: auth

> Kimlik doğrulama, oturum yönetimi, parola sıfırlama, iki faktörlü doğrulama (2FA).

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `auth` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 1 (Cerceve) |
| Bagimlillik | Yok (temel modul) |
| Roller | Public (giris oncesi sayfalar) |
| ECharts | Yok |

## Amac

`auth` modulu, Developer Studio'ya erisim icin gereken tum kimlik dogrulama akislarini yonetir.
FastAPI-Users uzerinde insa edilir. JWT tabanli oturum yonetimi, guvenli parola sifirlama,
TOTP tabanli 2FA ve gelecekte Enterprise SSO/SAML/OAuth provider destegi saglar.

## AI Yetenegi

- **Oturum anomali tespiti**: Olagan disi konum, cihaz veya saat diliminden yapilan giris
  denemelerini tespit eder ve kullaniciya uyari gonderir.
- **Brute-force pattern tespiti**: Belirli bir IP veya kullanici icin ardisik basarisiz giris
  denemelerini izler, otomatik kilit mekanizmasini tetikler.
- **Risk skoru**: Her giris denemesi icin IP, User-Agent, geo-lokasyon ve zaman bilgisine
  gore risk skoru hesaplar (dusuk / orta / yuksek).

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Giris | `/auth/login` | E-posta + parola formu, sosyal giris butonlari |
| Kayit | `/auth/register` | Kayit formu + davet kodu (opsiyonel) |
| Parola unuttum | `/auth/forgot-password` | E-posta ile sifirlama linki gonderimi |
| Parola sifirla | `/auth/reset-password/{token}` | Yeni parola belirleme |
| Iki faktor | `/auth/two-factor` | TOTP kodu giris ekrani |

## Gelecek Plan (Enterprise)

- SAML 2.0 SSO entegrasyonu (Okta, Azure AD, OneLogin)
- OAuth2 provider destegi (Google Workspace, GitHub)
- Magic link (parolasiz giris)
- Passkey / WebAuthn destegi
- IP whitelist per tenant
- Oturum suresi tenant bazli yapilandirma

## Dosya Yapisi

```
studio/
  app/api/v1/modules/auth/
    __init__.py
    routes.py              <- sayfa + API endpoint'leri
    schemas.py             <- Pydantic v2 request/response
  app/models/auth/
    user.py                <- User, UserSession modelleri
    two_factor.py          <- TwoFactorSecret modeli
  app/services/auth/
    session_service.py     <- oturum yonetimi + anomali tespiti
    two_factor_service.py  <- TOTP uretim + dogrulama
    risk_scorer.py         <- giris risk skoru hesaplama
  app/tasks/auth/
    session_cleanup.py     <- suresi dolmus oturumlari temizle
    anomaly_alert.py       <- anomali bildirimi gonder
  templates/modules/auth/
    pages/
      login.html
      register.html
      forgot-password.html
      reset-password.html
      two-factor.html
    partials/
      login-form.html
      register-form.html
      password-strength.html
      social-login-buttons.html
      two-factor-input.html
    components/
      alert-banner.html    <- hata/basari mesaji
      password-field.html  <- goster/gizle toggle
```

## Guvenlik Notlari

- Parola hash: `bcrypt` (FastAPI-Users default)
- JWT token suresi: access 15 dk, refresh 7 gun
- Rate limit: 5 giris denemesi / dk / IP (slowapi)
- TOTP secret: sifrelenmis saklama (AES-256)
- CSRF korunmasi: SameSite=Lax cookie + HTMX hx-headers
- Audit log: her basarili/basarisiz giris `audit.events` tablosuna yazilir
