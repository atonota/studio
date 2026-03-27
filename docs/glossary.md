# Domain Glossary — atonota

> Ubiquitous language. Tum ekip bu terimleri ayni anlamda kullanir.

| Terim | Tanim | Ornek |
|-------|-------|-------|
| **Tenant** | Platform uzerindeki bir musteri organizasyonu. Multi-tenant izolasyonun birimi. | "Acme Corp" tenant'i |
| **Workspace** | Bir tenant'a ait, yonetilen tek bir web sitesi/uygulama. | acme.com sitesi |
| **Platform** | Workspace'in uzerinde calistigi web teknolojisi. | WordPress, Shopify, Drupal |
| **Adapter** | Bir platform ile Intelligence Core arasindaki baglanti katmani. PlatformAdapter Protocol'unu implement eder. | WordPressAdapter |
| **Plugin** | atonota ekosistemine eklenen moduldur. Marketplace'te yayinlanabilir. | "SEO Analyzer" plugin'i |
| **License** | Bir tenant'in bir plugin'i kullanma hakki. Site sayisi sinirli olabilir. | Pro plan, 5 site |
| **Intelligence Core** | Platform-agnostik analiz motoru. Tum adaptorler buraya veri gonderir. | SEO skoru hesaplama |
| **Developer Studio** | Gelistirici ekibinin kullandigi SaaS yonetim paneli. FastAPI + HTMX. | studio.atonota.com |
| **Client Panel** | Son kullanicinin (tenant musterisi) gordugu panel. WordPress admin'e embed edilir. | WP admin icindeki atonota sekmesi |
| **Metric** | Platformdan toplanan olcum birimi. | page_speed_score, organic_keywords |
| **Check-in** | Bir adapter'in periyodik saglik kontrolu. | 5dk'da bir health_check() |
| **Cursor** | Sayfalama icin kullanilan (created_at, uid) cifti. Offset yasak. | `eyJjIjoiMjAyNi0wMy0yNy4uLiJ9` |
| **Soft Delete** | Kayit silinmez, `deleted_at` alani set edilir. | `deleted_at = '2026-03-27T...'` |
| **RLS** | Row Level Security. Her sorgu sadece aktif tenant'in verilerini gorur. | `SET LOCAL app.current_tenant_id` |
| **Audit Event** | Kritik islemlerin append-only logu. Silinemez, degistirilemez. | `action="tenant.create"` |
| **Idempotency Key** | Tekrarlanan isteklerin ayni sonucu vermesini saglayan benzersiz anahtar. | `Idempotency-Key: abc-123` |
| **Walled Garden** | Dogrudan web crawl edilemeyen, API gerektiren platform. | Google Ads, Meta Ads |
