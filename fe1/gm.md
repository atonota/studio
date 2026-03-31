# Navigasyon Mimarisi — Developer Yönergesi

> Bu belge, atonota/studio (fe1) ön yüzündeki 175 HTML sayfasının navigasyon yerleşimlerini tanımlar.
> Gerekçeler UX standartları ve kullanım sıklığı (frekansı) kriterlerine dayanmaktadır.

---

## Navigasyon Bölgeleri ve Genel Kural Seti

```text
┌─────────────────────────────────────────────────────┐
│  TOPBAR                              [search] [+] [notif] [avatar▼]  │
├────────┬────────────────────────────────────────────┤
│        │                                            │
│  SB-1  │  SB-2 (aktif modülün alt menüsü)          │
│ (Rail) │                                            │
│        │  SAYFA İÇERİĞİ                             │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

Platform **4 ana navigasyon bölgesi**ne ayrılmıştır:

1. **Sidebar 1 (SB-1 / Rail):** Sadece ikonlardan oluşan dar menü. Bağımsız iş akışlarını temsil eden ana modüller.
2. **Sidebar 2 (SB-2 / Geniş):** SB-1'de seçilen ana modülün detaylı alt sayfalarını (kategori yapısıyla) içerir.
3. **Topbar:** Sayfa bağlamından bağımsız, global erişim gerektiren araçlar (Arama, Hızlı Oluştur, Bildirim, Çalışma Alanı/Workspace Değiştirici).
4. **Profile Menu (Avatar Dropdown):** Kişisel tercihler ve hızlı hesap erişimi.
5. **Settings Menu:** Kurumsal, teknik ve genel yapılandırma sayfaları (Sekmeli bir sayfa yapısıdır).

---

## 1. Sidebar 1 (Rail) — Ana Modüller

> **Kriter:** Günlük kullanılan, ana iş akışı sağlayan, altında birden çok özellik barındıran çekirdek modüller. Maksimum 10-12 adet olmalıdır.

| Seçenek | İlgili Sayfa (Ana) | Gerekçe |
| :--- | :--- | :--- |
| **Dashboard** | `dashboard-workspace.html` | Her oturumun başlangıç noktası, tüm modüllerin özeti. |
| **SEO** | `seo.html` | Ürünün omurgası. En sık ziyaret edilen performans takip modülü. |
| **Ads** | `ads.html` | Kampanya yönetimi süreci, SEO kadar sık ve düzenli işlem gerektirir. |
| **Analytics** | `analytics.html` | Trafik ve kullanıcı davranışını izleme, karar alma süreçlerinin temeli. |
| **Content** | `content.html` | İçerik üretimi ve yönetimi düzenli bir operasyondur. |
| **Competitor** | `competitors.html` | Rekabet takibi, özellikle raporlama ve strateji dönemlerinde kritik. |
| **GEO / AI** | `geo.html` (ve `ai.html`) | Yeni nesil arama (AI arama) optimizasyonu ana odaklardan biri olacak. |
| **Local** | `local.html` | Yerel işletmeler veya şubeli yapılar için günlük kontrol noktası. |
| **Reports** | `reports.html` | Özeti bir araya getirme ve çıkarma (paydaşlarla paylaşım) eylemi. |
| **Insights** | `insights.html` | Akıllı asistan öngörüleri; güne başlarken fikir verici akış (feed). |
| *(Ayırıcı Çizgi)*| | |
| **Adapters** | `adapters.html` | Veri kaynaklarının sağlık (health) durumu sık kontrol edilmese de görünür olmalı. |

*(Not: Bu öğelere tıklanınca **Sidebar 2 (SB-2)** açılır ve o modülün alt menüsü gelir.)*

---

## 2. Sidebar 2 — Modül İçi Alt Menüler (Grup Grup Listeleme)

> **Kriter:** SB-1'deki bir ana eylemin altında yer alan görev bazlı veya nesne bazlı detay sayfaları.

Aşağıdaki liste modül bazlı gruplamayı gösterir (menü içindeki klasörleme mantığı):

### SEO
- İlk satır: Overview (seo.html)
- **Anahtar Kelimeler:** Keywords, Keyword Magic, Organic Research, Cluster
- **Sıralamalar:** Rankings, Position Tracker, SERP
- **Bağlantılar:** Backlinks, Backlink Audit, Backlink Gap, Link Intersect
- **Sayfalar & Denetim:** Audit, Onpage Checker, Batch Analysis
- **Varlıklar:** Entities, Entities Graph, GEO özellikleri

### Ads
- İlk satır: Overview (ads.html)
- **Kampanyalar:** Campaigns, Ad Groups
- **Platformlar:** Meta, LinkedIn, TikTok, Snapchat, Pinterest, vs.
- **Optimizasyon:** Budget Optimizer, Audiences, Creatives, Attribution
- **Kurallar & İzleme:** Rules, Alerts
- **Araştırma:** Competitor Research, Tokens, Accounts

### Analytics
- İlk satır: Overview (analytics.html)
- **Araçlar:** Traffic, Realtime, Funnels, Segments, Query

### Content
- İlk satır: Overview (content.html)
- **Araştırma & Üretim:** Explorer, Topic Research, Writing Assistant, Template
- **Analiz & Bakım:** Pages, Decay, Gaps, Readability, Semantic, Orphaned, AI Detection
- **Teknik İçerik:** Schema (Aggregation, Generator), llms.txt

---

## 3. Settings (Ayarlar) — Sekmeli Sayfa İçeriği

> **Kriter:** Bir kez ayarlayıp bırakılan, günlük isleyisten ziyade "kurulum" ve "şirket/site geneli politika" gerektiren işler. Bu sayfalar SB-1 veya SB-2'de **YERALMAZ**. Profil menüsünden veya doğrudan URL'den `settings.html` altına gider.

| Sayfa/Konu | Dosyalar | Gerekçe |
| :--- | :--- | :--- |
| **Tenant Yönetimi** | `settings-tenant-settings.html` | Şirket seviyesi hesap ayarları. Sadece adminler bakar. |
| **Güvenlik (Security)** | `security.html`, `security-*.html` | SSL, Header ve zaafiyetler. DevOps/Teknik roller için olup sürekli izlenmez, alarm verince bakılır. |
| **Performans** | `performance.html`, `performance-*.html` | Core Web Vitals, Uptime işleri; yine SEO/Teknik ekip ara sıra kontrol eder. (Büyük sitelerde Dashboard'da özet bulunur, detay buradadır). |
| **Denetimler (Audit)** | `audit.html`, `audit-detail.html` | Site geneli sistem/uyumluluk denetimleri. |
| **Webhooks** | `settings-webhooks.html` | DIş sistem entegrasyonu (Zapier, vs.). Teknik bir "kurulum" ekranı. |
| **Yapısal Veri Kurulumu** | `schema.html`, `schema-*.html` | Düzenli kullanım değil, sitenin altyapısını kurarken ayarlanan JSON-LD kalıpları ve şablonlardır. (İçerik üretimindeki sayfa bazlı schema editöründen farklıdır). |

---

## 4. Topbar Menü (Global Araçlar)

> **Kriter:** Her modülden (sayfadan) bağımsız olarak her an erişilmesi veya değiştirilmesi gereken, "bağlam" veya "durum" belirten eklentiler.

| Konum | Eylem | İlgili Dosya/Yapı | Gerekçe |
| :--- | :--- | :--- | :--- |
| **Sol Üst** | **Workspace Switcher (Proje/Site Seçici)** | `workspaces.html` (Modal ya da Dropdown) | Bütün veriyi belirleyen (context) alandır. Sürekli göz önünde ve kolay değiştirilebilir olmalı. |
| **Orta** | **Global Arama (Search)** | Modal arama sonuçları | Herhangi bir anahtar kelime, kampanya veya raporu hızlıca bulmak için (Command+K kısayoluyla çalışmalı). |
| **Sağ** | **+ Oluştur (Hızlı Eylem)** | `*-create.html` sayfalarına link veren dropdown | "Yeni Kampanya, Yeni Rapor, Yeni Proje" gibi yaratım süreçlerini hızlandırmak için. |
| **Sağ** | **Bildirimler (Notifications)** | `notifications.html` veya panel | Sistemin ürettiği anlık uyarılar; sayfadan bağımsız bir pop-up veya çekmece (drawer) açmalıdır. |

---

## 5. Profile Menu (Avatar Dropdown)

> **Kriter:** Doğrudan kullanıcı kimliği ile ilişkili olan, kişinin arayüz veya hesap tercihlerini yansıtan ve ayarlar sayfasına girmeden hızlı geçiş istenen öğeler.

Kullanıcı Topbar'daki Avatar'a tıkladığında açılan listedir:

```text
Avatar (Kullanıcı Adı)
├── Profil Bilgilerim         -> settings-profile.html (Kişisel ayarlar)
├── Görünüm (Dark/Light)      -> settings-appearance.html veya "inline switch"
├── Bildirim Tercihlerim      -> settings-notifications-prefs.html (Sessize alma vs.)
├── -------------------
├── Fatura ve Plan            -> billing.html (Abonelik yükseltme)
├── API Anahtarlarım          -> settings-apikeys.html (Geliştirici kısa yolu)
├── Müşteri/Tenant Yönetimi   -> tenants.html (Sadece Owner/Hakim rol görür)
├── -------------------
└── Çıkış Yap (Log Out)       -> auth-login.html'e yönlendirir.
```

**Neden `settings-appearance.html` veya `settings-notifications-prefs.html` doğrudan profil menüsünde?**
Kullanıcı karanlık mod kapatma ya da sürekli gelen e-posta bildirimlerini durdurma eylemini çok canı sıkıldığında/hızlıca yapmak ister; Ayarlar > Ortak menüsünde aramamalıdır.

---

## İstisnalar

*   **Auth Sayfaları (Login, Register vb.):** `auth-*.html` sayfalarında Topbar, SB-1 veya SB-2 gösterilmez. Sadece ortalanmış bir kart vardır.
*   **Marketplace Modülü:** `marketplace-*.html` sayfaları, **sadece** seçili Workspace bir E-ticaret entegrasyonuna sahipse SB-1'de "Marketplace" olarak belirir. Aksi halde gizlidir. Dinamik bir yapı ile yönetilmelidir.
