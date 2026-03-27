# Module 02: shell

> Uygulama kabugu — sidebar navigasyon, topbar, breadcrumb, Cmd+K global arama,
> workspace switcher, dil secici, bildirim badge.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `shell` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 1 (Cerceve) |
| Bagimlillik | auth |
| Roller | Tumu (menu icerigi role gore degisir) |
| ECharts | Yok |

## Amac

`shell` modulu, Developer Studio'nun tum sayfalari saran uygulama kabugunu saglar.
Sidebar navigasyon, topbar, breadcrumb, kullanici dropdown, workspace switcher,
bildirim badge ve Cmd+K global arama paleti bu modulde yasар.

Tum authenticated sayfalari `templates/layouts/shell.html` layout'unu extend eder.
Shell layout, `templates/layouts/base.html` uzerinde insa edilir.

## Rol Bazli Dinamik Menu

Sidebar menu icerigi oturum acmis kullanicinin rolune gore server-side filtrelenir.
Her menu ogesi `min_role` attribute'u tasir:

| Rol | Gorunur Menuler |
|-----|-----------------|
| SA (Studio Admin) | Tumu — tenant yonetimi, telemetri, audit log dahil |
| TO (Tenant Owner) | Tenant'a ait tum menuler, platform ayarlari |
| TA (Tenant Admin) | Analiz, konfig, kullanici yonetimi |
| AN (Analyst) | Analiz modulleri, raporlar (salt okunur) |
| VW (Viewer) | Dashboard, sinirli analiz (salt okunur) |

## Sayfalar / Alanlar

Shell bir sayfa degil, layout'tur. Asagidaki alanlari icerir:

| Alan | Konum | Aciklama |
|------|-------|----------|
| Sidebar | Sol kenar, 256px | Navigasyon menusu + workspace switcher |
| Topbar | Ust kenar, 64px | Arama, bildirimler, kullanici dropdown |
| Breadcrumb | Topbar altinda | Sayfa hiyerarsisi |
| Content Area | Ortada | Modullerin sayfa icerigi buraya gelir |
| Command Palette | Overlay | Cmd+K ile acilir, global arama |
| Footer | Alt kenar | Versiyon, destek linki (opsiyonel) |

## Responsive Davranis

| Genislik | Sidebar | Topbar | Davranis |
|----------|---------|--------|----------|
| >= 1280px | Acik (sabit) | Gorunur | Tam desktop deneyimi |
| 1024-1279px | Daraltilmis (icon-only, 64px) | Gorunur | Hover ile tooltip |
| 768-1023px | Gizli (overlay) | Gorunur + hamburger | Hamburger ile acilir |
| < 768px | Gizli (tam ekran overlay) | Kompakt | Tam ekran menu |

## Dosya Yapisi

```
studio/
  templates/layouts/
    shell.html               <- ana shell layout (sidebar + topbar + content)
    auth.html                <- auth sayfalari icin sidebar'siz layout
  templates/modules/shell/
    partials/
      sidebar-nav.html       <- navigasyon menusu (rol bazli)
      topbar.html            <- ust bar
      breadcrumb.html        <- sayfa hiyerarsisi
      user-dropdown.html     <- kullanici menu dropdown
      workspace-selector.html <- workspace secici
      notification-badge.html <- bildirim sayaci
      command-palette.html   <- Cmd+K arama
      locale-selector.html   <- dil secici (TR/EN/DE/FR/ES)
      mobile-menu.html       <- mobil hamburger menu overlay
    components/
      nav-item.html          <- tekil menu ogesi macro
      nav-group.html         <- gruplu menu ogesi macro
      nav-badge.html         <- menu ogesi badge (sayi gostergesi)
  app/api/v1/modules/shell/
    __init__.py
    routes.py                <- partial endpoint'ler
    schemas.py               <- menu item, workspace sema
  app/services/shell/
    menu_builder.py          <- rol bazli menu olusturucu
    search_service.py        <- global arama servisi
```

## Gelecek Plan

- Tema degistirme (dark / light / system)
- Sidebar menu sirasini surukle-birak ile kisisellestirme
- Klavye kisayollari paneli (? tusu)
- Pinned / favoriler bolumu
- Son ziyaret edilen sayfalar listesi
