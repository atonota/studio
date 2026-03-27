# Ad Orchestration Blueprint — Teknik Referans

> Bu dosya reklam orkestrasyon katmanının teknik blueprint'idir.
> Kaynak: Product gap analizi, Mart 2026.
> Detaylı içerik için orijinal raporu inceleyin.

---

## Platform API Öncelik Sırası

| # | Platform | Karmaşıklık | Auth | Webhook | MVP Öncelik |
|---|----------|-------------|------|---------|-------------|
| 1 | Google Ads | Orta-Zor | OAuth 2.0 + Dev Token | ❌ | **#1** |
| 2 | Meta Ads | Orta | OAuth 2.0 (FB Login) | ✅ | **#2** |
| 3 | Microsoft Ads | Kolay-Orta | OAuth 2.0 (Azure AD) | ❌ | **#3** |
| 4 | TikTok Ads | Orta | OAuth 2.0 | ✅ | **#4** |
| 5 | LinkedIn Ads | Zor | OAuth 2.0 (3-legged) | ❌ | **#5 (B2B)** |
| 6 | Amazon Ads | Zor | OAuth 2.0 (LWA) | ❌ | Yüksek (e-ticaret) |
| 7 | Trendyol Ads | ? | ? | ? | **Yüksek (Türkiye)** |
| 8 | Hepsiburada Ads | ? | ? | ? | **Yüksek (Türkiye)** |

## Entegrasyon Stratejisi (Fazlı Hibrit)

```
Faz 1 (MVP):     Unified.to (write) + Windsor.ai/Airbyte (read) → hızlı pazara çıkış
Faz 2 (6-18 ay): Google Ads + Meta Ads direkt API entegrasyonu
Faz 3 (18+ ay):  Top 5-6 platform direkt; aggregator long-tail için
```

## Teknik Mimari Kararları

- Token Management Service: tüm OAuth token'ları AES-256 şifreli
- Queue-first: platform başına ayrı BullMQ/Celery kuyruğu
- Unified Data Model: Organization → Campaign → AdGroup → Ad → Creative
- Platform-spesifik veri: JSONB kolonlarında saklanır
- Sync katmanları: real-time (15-30dk), near-real-time (1-3 saat), daily (tam rapor)

## Türkiye Pazarı Avantajı

- Türkçe dil desteği olan çok kanallı reklam yönetim platformu YOK
- Trendyol/Hepsiburada reklam entegrasyonu hiçbir global rakipte YOK
- KVKK uyumu (72 saat ihlal bildirimi, VERBIS kaydı, açık rıza)
- TRY fiyatlandırma, yerel ödeme yöntemleri
- $3.1B reklam pazarı, 2033'e kadar $8.47B projeksiyon

## Rekabet Boşluğu

- Enterprise ($3K+/ay): Skai, Smartly.io, Marin Software
- SMB ($49-179/ay): Adzooma, AdEspresso, Madgicx
- **Boşluk: $100-500/ay genuine multi-channel + AI optimization**
- Hiçbir rakip Türkçe desteklemiyor
