/**
 * @module core/i18n/locales/tr
 * Turkish locale strings — default language.
 * Keys are dot-notation paths: 'nav.seo', 'shell.skipLink', etc.
 */

export const tr: Record<string, string> = {
  // ── Navigation: Rail menu groups ──
  'nav.group.analiz': 'ANALIZ',
  'nav.group.kesif': 'KESIF',
  'nav.group.zeka': 'ZEKA',

  // ── Navigation: Rail items ──
  'nav.seo': 'SEO',
  'nav.content': 'Icerik',
  'nav.ads': 'Reklamlar',
  'nav.analytics': 'Analitik',
  'nav.geo': 'GEO / AI',
  'nav.competitor': 'Rakip',
  'nav.local': 'Local',
  'nav.performance': 'Performans',
  'nav.insights': 'Insights',
  'nav.reports': 'Raporlar',

  // ── Sidebar: SEO section ──
  'sidebar.seo.keyword': 'Anahtar Kelime',
  'sidebar.seo.ranking': 'Siralama',
  'sidebar.seo.technical': 'Teknik SEO',
  'sidebar.seo.link': 'Baglanti',
  'sidebar.seo.entity': 'Entity SEO',
  'sidebar.seo.marketplace': 'Marketplace SEO',

  // ── Sidebar: Content section ──
  'sidebar.content.discovery': 'Kesif',
  'sidebar.content.analysis': 'Analiz',
  'sidebar.content.schema': 'Schema Markup',
  'sidebar.content.map': 'Harita',

  // ── Sidebar: Ads section ──
  'sidebar.ads.campaigns': 'Kampanyalar',
  'sidebar.ads.platforms': 'Platformlar',
  'sidebar.ads.optimization': 'Optimizasyon',
  'sidebar.ads.rules': 'Kurallar',
  'sidebar.ads.reports': 'Raporlar',
  'sidebar.ads.account': 'Hesap',

  // ── Sidebar: Analytics section ──
  'sidebar.analytics.traffic': 'Trafik',
  'sidebar.analytics.analysis': 'Analiz',

  // ── Sidebar: GEO section ──
  'sidebar.geo.geo': 'GEO',
  'sidebar.geo.ai': 'AI',

  // ── Sidebar: Other sections ──
  'sidebar.competitor.analysis': 'Analiz',
  'sidebar.local.location': 'Lokasyon',
  'sidebar.performance.tools': 'Araclar',
  'sidebar.performance.security': 'Guvenlik',
  'sidebar.insights.feed': 'Feed',
  'sidebar.insights.prefs': 'Tercihler',
  'sidebar.reports.reports': 'Raporlar',

  // ── Shell: Layout ──
  'shell.skipLink': 'Icerige atla',
  'shell.mainLabel': 'Sayfa icerigi',
  'shell.navLabel': 'Ana navigasyon',
  'shell.subNavLabel': 'Alt navigasyon',
  'shell.footerLabel': 'Sistem durumu',
  'shell.systemActive': 'Sistem aktif',
  'shell.tenant': 'tenant',
  'shell.workspace': 'workspace',
  'shell.adaptor': 'adaptor',
  'shell.dashboard': 'Dashboard',
  'shell.sidebarToggle': 'Alt navigasyonu ac/kapat',

  // ── Shell: Breadcrumb ──
  'breadcrumb.label': 'Breadcrumb',

  // ── Shell: Spotlight ──
  'spotlight.label': 'Spotlight arama',
  'spotlight.placeholder': 'Panelde ara...',
  'spotlight.quickAccess': 'Hizli Erisim',
  'spotlight.navigate': 'gezin',
  'spotlight.open': 'ac',
  'spotlight.close': 'kapat',

  // ── Shell: Notifications ──
  'notif.title': 'Bildirimler',
  'notif.close': 'Bildirimleri kapat',
  'notif.categories': 'Bildirim kategorileri',
  'notif.list': 'Bildirim listesi',
  'notif.markAllRead': 'Tumunu okundu isaretle',
  'notif.viewAll': 'Tumunu Gor',
  'notif.empty': 'Bu kategoride bildirim yok',
  'notif.cat.all': 'Tumu',
  'notif.cat.seo': 'SEO',
  'notif.cat.content': 'Icerik',
  'notif.cat.ads': 'Reklamlar',
  'notif.cat.system': 'Sistem',
  'notif.cat.ai': 'AI Raporlar',
  'notif.read': 'Okundu',
  'notif.dismiss': 'Kaldir',

  // ── Shell: Keyboard shortcuts ──
  'shortcuts.title': 'Klavye Kisayollari',
  'shortcuts.close': 'Kapat',
  'shortcuts.spotlightSearch': 'Spotlight Arama',
  'shortcuts.newCreate': 'Yeni Olustur',
  'shortcuts.shortcutHelp': 'Kisayol Yardimi',

  // ── Shell: Favorites ──
  'fav.add': 'Favorilere ekle: {{name}}',
  'fav.remove': 'Favorilerden kaldir: {{name}}',
  'fav.added': '{{name}} kisayollara eklendi',
  'fav.removed': '{{name}} kisayollardan kaldirildi',

  // ── Shell: Mobile menu ──
  'mobile.menuOpen': 'Menuyu ac',
  'mobile.menuClose': 'Menuyu kapat',
  'mobile.search': 'ARA',
  'mobile.tenant': 'TENANT',
  'mobile.notification': 'BILDIRIM',
  'mobile.menu': 'MENU',

  // ── Toast ──
  'toast.saved': 'Ayarlar kaydedildi',
  'toast.confirm': 'Onayla',
  'toast.cancel': 'Iptal',

  // ── Time ──
  'time.now': 'Az once',
  'time.minutesAgo': '{{n}} dk once',
  'time.hoursAgo': '{{n}} saat once',
  'time.daysAgo': '{{n}} gun once',

  // ── Empty states ──
  'empty.workspace': 'Workspace Ekle',
  'empty.competitor': 'Rakip Ekle',
  'empty.systemUsage': 'Sistem kullanildikca burada gorunecek',

  // ── Settings ──
  'settings.title': 'Ayarlar',
  'settings.theme': 'Tema Secenekleri',
  'settings.accessibility': 'Erisilebilirlik',
  'settings.profile': 'Profil',

  // ── Tenant ──
  'tenant.switch': 'Tenant Degistir',
  'tenant.allTenants': 'Tum Tenant\'lar',

  // ── User ──
  'user.profile': 'Profil',
  'user.settings': 'Ayarlar',
  'user.logout': 'Cikis Yap',
};
