# Module 03: dashboard

> Ana panel — KPI kartlari, son aktiviteler, AI gunluk brief, trend oklari.

---

## Genel Bakis

| Alan | Deger |
|------|-------|
| Slug | `dashboard` |
| Oncelik | P0 — MVP zorunlu |
| Faz | Faz 1 (Cerceve) |
| Bagimlillik | shell, workspace-manager |
| Roller | Tumu (icerik role gore degisir) |
| ECharts | Mini sparkline, doughnut, stacked area |

## Amac

`dashboard` modulu, Studio'ya giris yapan kullanicinin ilk gordugu sayfadir.
Aktif workspace'in temel KPI'larini, son aktiviteleri ve AI tarafindan uretilen
gunluk brief'i gosterir. Her rol icin farkli veri seti ve gorunum saglar.

## AI Yetenegi

- **Gunluk Brief ("Bugun dikkat edilecek 3 sey")**: Her sabah otomatik uretilen,
  aktif workspace'in metriklerini analiz eden 3 maddeli insight karti.
- **Anomali Ozeti**: Son 24 saatte tespit edilen metrik anomalilerinin kisa ozeti.
- **Trend Oklari**: KPI kartlarinda onceki doneme gore yukselis/dusus oklari ve
  yuzdesel degisim. Anormal degisimler kirmizi vurgulanir.
- **Oncelik Sirasi**: AI, mevcut metriklere bakarak "once suna bak" onerisi yapar.

## Rol Bazli Gorunum

| Rol | Gorunum |
|-----|---------|
| SA (Studio Admin) | Platform geneli: toplam tenant, toplam workspace, aktif adapter, genel saglik |
| TO (Tenant Owner) | Tenant KPI: workspace sayisi, aktif kullanici, adapter durumu, kullanim kotasi |
| TA (Tenant Admin) | Tenant KPI (TO ile ayni, fatura goruntuleme yok) |
| AN (Analyst) | Analiz KPI: SEO skor, icerik performansi, trafik ozeti |
| VW (Viewer) | Sinirli: sadece temel KPI'lar, AI brief yok |

## Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Ana Dashboard | `/` | Varsayilan landing, aktif workspace'in ozeti |
| Workspace Dashboard | `/dashboard/workspace/{uid}` | Belirli bir workspace'in detayli dashboard'u |

## ECharts Kullanimi

| Grafik | Konum | Veri |
|--------|-------|------|
| Mini Sparkline | KPI kartlari icinde | Son 7 gun trend cizgisi (32x16px) |
| Doughnut | Adapter durumu karti | Aktif / Inaktif / Hata oranlari |
| Stacked Area | Trafik ozet karti | Son 30 gun organik / direct / referral |

## Dosya Yapisi

```
studio/
  app/api/v1/modules/dashboard/
    __init__.py
    routes.py              <- sayfa + partial endpoint'ler
    schemas.py             <- KPI, activity, brief sema
  app/models/dashboard/
    (yok — diger modullerin modelleri kullanilir)
  app/services/dashboard/
    kpi_service.py         <- KPI hesaplama + trend
    activity_service.py    <- son aktiviteler toplama
    ai_brief_service.py    <- AI gunluk brief uretimi
    anomaly_service.py     <- anomali tespit + ozet
  app/tasks/dashboard/
    daily_brief.py         <- her sabah brief olustur (Celery Beat)
    anomaly_scan.py        <- periyodik anomali taramasi
  templates/modules/dashboard/
    pages/
      dashboard.html       <- ana dashboard
      workspace-dashboard.html
    partials/
      stats-cards.html     <- KPI kartlari grid
      activity-feed.html   <- son aktiviteler listesi
      ai-brief.html        <- AI gunluk brief karti
      sparkline-chart.html <- mini sparkline ECharts
      traffic-overview.html <- trafik ozet grafigi
    components/
      kpi-card.html        <- tekil KPI karti macro
      trend-arrow.html     <- trend ok gostergesi macro
      activity-item.html   <- tekil aktivite ogesi macro
```

## Yenileme Stratejisi

- KPI kartlari: Sayfa yuklemesinde + her 5 dakikada periyodik yenileme
- Aktivite feed: Sayfa yuklemesinde + her 60 saniyede polling
- AI Brief: Gunluk uretilir, sayfa yuklemesinde gosterilir (polling yok)
- Date range degistiginde tum partial'lar yeniden cekilir
