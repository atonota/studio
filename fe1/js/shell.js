/* ═══════════════════════════════════════════
   atonota Studio — Shell Component
   Master navigation: topbar, rail, sidebar, footer, spotlight, dropdown
   Her sayfa bu dosyayi yukler ve initShell() cagirir
═══════════════════════════════════════════ */

const MENU = [
  {group:'GENEL', items:[
    {key:'dashboard',   icon:'ph-squares-four',       title:'Dashboard',   href:'index.html'},
    {key:'tenants',     icon:'ph-buildings',          title:'Tenant',      href:'pages/tenants.html'},
    {key:'workspaces',  icon:'ph-globe',              title:'Workspace',   href:'pages/workspaces.html'},
    {key:'adapters',    icon:'ph-plugs-connected',    title:'Adaptorler',  href:'pages/adapters.html'},
  ]},
  {group:'ANALIZ', items:[
    {key:'seo',         icon:'ph-chart-line-up',       title:'SEO',         href:'pages/seo.html'},
    {key:'content',     icon:'ph-article',            title:'Icerik',      href:'pages/content.html'},
    {key:'ads',         icon:'ph-megaphone',          title:'Reklamlar',   href:'pages/ads.html'},
    {key:'analytics',   icon:'ph-chart-bar',          title:'Analitik',    href:'pages/analytics.html'},
    {key:'security',    icon:'ph-shield-check',       title:'Guvenlik',    href:'pages/security.html'},
    {key:'competitors', icon:'ph-binoculars',         title:'Rekabet',     href:'pages/competitors.html'},
  ]},
  {group:'SISTEM', items:[
    {key:'reports',      icon:'ph-file-text',          title:'Raporlar',     href:'pages/reports.html'},
    {key:'ai',           icon:'ph-robot',              title:'AI',           href:'pages/ai.html'},
    {key:'settings',     icon:'ph-gear',               title:'Ayarlar',      href:'pages/settings.html'},
  ]},
];

/* Sidebar data: each child = "Label|badge|href" (href optional, defaults to section page) */
const SIDEBAR_DATA = {
  dashboard:    [{l:'Overview',ch:['Platform Ozeti||index.html','KPI Takibi||dashboard-workspace.html','Hedefler & OKR||dashboard-workspace.html']},{l:'Raporlar',ch:['Haftalik Ozet||report-detail.html','Aylik Rapor|3|report-detail.html','Ozel Rapor||report-create.html']},{l:'Aktivite',ch:['Son Degisiklikler||audit.html','Uyari Gecmisi||notifications.html']}],
  tenants:      [{l:'Yonetim',ch:['Tum Tenantlar|12|tenants.html','Yeni Olustur||tenant-create.html','Detay||tenant-detail.html']},{l:'Izleme',ch:['Saglik Skoru||tenant-detail.html','Onboarding||tenant-detail.html','Churn Riski||tenant-detail.html']}],
  workspaces:   [{l:'Siteler',ch:['Tum Workspaceler||workspaces.html','Yeni Ekle||workspace-create.html','Detay||workspace-detail.html']},{l:'Adaptorler',ch:['Bagli Platformlar||adapters.html','Saglik Durumu|2|adapter-health.html']}],
  adapters:     [{l:'Katalog',ch:['Tum Platformlar|83+|adapters.html','Bagli|5|adapters.html','Hata|1|adapters.html']},{l:'Saglik',ch:['Health Dashboard||adapter-health.html','Uptime Gecmisi||adapter-health.html']},{l:'Baglanti',ch:['Yeni Bagla||adapter-connect.html','Credential Yonetimi||adapter-detail.html']}],
  seo:          [{l:'Anahtar Kelime',ch:['Arastirma||seo-keywords.html','Keyword Magic||seo-keyword-magic.html','Cluster||seo-cluster.html','Intent Analizi||seo-keywords.html']},{l:'Siralama',ch:['Pozisyon Takibi||seo-position-tracker.html','SERP Ozellikleri||seo-serp.html']},{l:'Rakip Arastirma',ch:['Organik Arastirma||seo-organic-research.html']},{l:'GEO (AI Gorunurluk)',ch:['GEO Dashboard||seo-geo.html','AI Mention||seo-geo-mentions.html','Prompt Arastirma||seo-geo-prompts.html','Citability||seo-geo-citability.html','GEO Detay||geo.html','Sorgu Analizi||geo-queries.html','Mention Detay||geo-mentions.html','Platform Analizi||geo-platforms.html','Sentiment||geo-sentiment.html','Citation Widget||geo-citation-widget.html','Rakip GEO||geo-competitors.html','Oneriler||geo-recommendations.html']},{l:'Teknik',ch:['Site Denetimi||seo-audit.html','Denetim Detay||seo-audit-detail.html','On-Page Checker||seo-onpage-checker.html','Backlink|47|seo-backlinks.html','Backlink Denetimi||seo-backlink-audit.html','Backlink Gap||seo-backlink-gap.html','Link Kesisim||seo-link-intersect.html','Toplu Analiz||seo-batch-analysis.html']},{l:'Entity SEO',ch:['Entity Hub||entities.html','Entity Detay||entities-detail.html','Entity Cikarma||entities-extract.html','Entity Gap||entities-gaps.html','Knowledge Panel||entities-knowledge-panel.html','Knowledge Graph||seo-entities.html','Entity Graph||seo-entities-graph.html','Entity Graph (Detay)||entities-graph.html']}],
  content:      [{l:'Analiz',ch:['Sayfa Listesi||content-pages.html','Sayfa Skorlari||content.html','Sayfa Detay||content-detail.html','Content Explorer||content-explorer.html','Gap Analizi||content-gaps.html','Bozunma||content-decay.html']},{l:'Schema Markup',ch:['Schema Hub||schema.html','Schema Markup||content-schema.html','Schema Editoru||content-schema-generator.html','Schema Uretici||schema-generator.html','Schema Duzenle||schema-detail.html','Schema Sablonlari||schema-templates.html','Schema Import||schema-import.html','Schema Dogrulama||schema-validate.html','Schema API||content-schema-aggregation.html','Aggregation||schema-aggregation.html']},{l:'Uretim',ch:['SEO Yazim Asistani||content-writing-assistant.html','Konu Arastirma||content-topic-research.html','Icerik Sablonu||content-template.html','llms.txt||content-llmstxt.html','AI Tespit||content-ai-detection.html']},{l:'Harita',ch:['Semantik Harita||content-semantic.html','Orphaned Icerik||content-orphaned.html','Readability||content-readability.html']}],
  ads:          [{l:'Kampanyalar',ch:['Tum Kampanyalar|8|ads-campaigns.html','Kampanya Detay||ads-campaign-detail.html','Yeni Olustur||ads-campaign-create.html','Reklam Gruplari||ads-adgroups.html','Kreatifler||ads-creatives.html','Hedef Kitle||ads-audiences.html']},{l:'Platformlar',ch:['Genel Bakis||ads-platforms.html','Meta (FB+IG)|3|ads-meta.html','TikTok|2|ads-tiktok.html','LinkedIn||ads-linkedin.html','Pinterest||ads-pinterest.html','Snapchat||ads-snapchat.html','WhatsApp||ads-whatsapp.html']},{l:'Otomasyon',ch:['Kural Motoru||ads-rules.html','Kural Olustur||ads-rules-create.html','Kural Detay||ads-rule-detail.html','Butce Yonetimi||ads-budgets.html','AI Optimizer||ads-budget-optimizer.html','Uyarilar|1|ads-alerts.html']},{l:'Raporlar',ch:['Performans||ads-reports.html','Rapor Olustur||ads-report-create.html','Rapor Detay||ads-report-detail.html','Zamanlama||ads-report-schedule.html','Sablonlar||ads-report-templates.html','Attribution||ads-attribution.html']},{l:'Rakip',ch:['Rakip Reklam Analizi||ads-competitor-research.html']},{l:'Hesap',ch:['Bagli Hesaplar||ads-accounts.html','Token Durumu||ads-tokens.html']}],
  analytics:    [{l:'Trafik',ch:['Genel Bakis||analytics.html','Trafik Detay||analytics-traffic.html','Huni Analizi||analytics-funnels.html','Segmentler||analytics-segments.html']},{l:'AI',ch:['Dogal Dil Sorgu||analytics-query.html','Gercek Zamanli||analytics-realtime.html']},{l:'Performans',ch:['CWV Dashboard||performance.html','LCP / INP / CLS||performance-vitals.html','Uptime||performance-uptime.html','Hiz Testi||performance-speed.html','Oneriler|5|performance-recommendations.html']}],
  security:     [{l:'Tarama',ch:['Zafiyet Raporu||security-vulnerabilities.html','SSL Sertifika||security-ssl.html','Header Analizi||security-headers.html']},{l:'Uyumluluk',ch:['KVKK / GDPR||security-compliance.html','Politika Uretici||security-compliance.html']}],
  competitors:  [{l:'Rakip Analizi',ch:['Rakip Listesi||competitors.html','Rakip Detay||competitor-detail.html','Karsilastirma||competitor-compare.html','SWOT (AI)||competitor-swot.html','Strateji||competitor-strategy.html']},{l:'Izleme',ch:['Uyarilar||competitor-alerts.html','Tech Stack||competitor-techstack.html','Pazar Payi||competitor-marketshare.html']},{l:'Marketplace SEO',ch:['Marketplace||marketplace.html','Urunler||marketplace-products.html','Urun Detay||marketplace-detail.html','Keyword||marketplace-keywords.html','Rakipler||marketplace-competitors.html','Optimizasyon||marketplace-optimization.html']},{l:'Local SEO',ch:['Local Dashboard||local.html','Konumlar||local-locations.html','Konum Detay||local-detail.html','Siralama||local-rankings.html','Google Business||local-gbp.html','Rehberler||local-directories.html','Yorumlar||local-reviews.html']}],
  reports:      [{l:'Raporlar',ch:['Tum Raporlar||reports.html','Yeni Olustur||report-create.html','Rapor Detay||report-detail.html','Sablonlar||report-templates.html']},{l:'Zamanlama',ch:['Zamanlama||report-schedule.html']}],
  notifications:[{l:'Bildirimler',ch:['Tumu|7|notifications.html','Okunmamis|3|notifications.html','Onemli||notifications.html']},{l:'Kurallar',ch:['Kural Listesi||notification-rules.html','Yeni Kural||notification-rule-create.html']}],
  audit:        [{l:'Olaylar',ch:['Tum Olaylar||audit.html','Olay Detay||audit-detail.html']},{l:'AI',ch:['Dogal Dil Sorgu||analytics-query.html','Anomali Tespiti||audit-detail.html']}],
  insights:     [{l:'Feed',ch:['Tum Insightlar||insights.html','Insight Detay||insights-detail.html']},{l:'Digest',ch:['Digest Arsivi||insights-digests.html','Tercihler||insights-preferences.html']}],
  ai:           [{l:'Chat',ch:['Yeni Sohbet||ai.html','Gecmis||ai.html']},{l:'Brand Radar',ch:['AI Brand Radar||ai-brand-radar.html']},{l:'Insight Feed',ch:['Tum Insightlar||insights.html','Insight Detay||insights-detail.html','Gunluk Digest||ai-digests.html','Haftalik Ozet||ai-digests.html','Digest Arsivi||insights-digests.html','Tercihler||insights-preferences.html','Anomaliler||insights-feed.html']}],
  settings:     [{l:'Hesap',ch:['Profil||settings-profile.html','Guvenlik||settings-security.html','Bildirim Tercihleri||settings-notifications-prefs.html']},{l:'Sistem',ch:['API Anahtarlari||settings-apikeys.html','Webhook||settings-webhooks.html','Gorunum||settings-appearance.html']},{l:'Bildirimler',ch:['Tum Bildirimler|7|notifications.html','Bildirim Kurallari||notification-rules.html','Yeni Kural||notification-rule-create.html']},{l:'Audit Log',ch:['Tum Olaylar||audit.html','Olay Detay||audit-detail.html']},{l:'Faturalandirma',ch:['Genel Bakis||billing.html','Planlar||billing-plans.html','Faturalar||billing-invoices.html','Kullanim||billing-usage.html','Odeme||billing-payment-methods.html']},{l:'Tenant',ch:['Tenant Ayarlari||settings-tenant-settings.html']}],
};

function getBasePath() {
  const p = window.location.pathname;
  return p.includes('/pages/') ? '../' : '';
}

function getCurrentKey() {
  const p = window.location.pathname;
  if (p.endsWith('index.html') || p.endsWith('/') || p === '') return 'dashboard';
  const m = p.match(/\/([^\/]+)\.html$/);
  return m ? m[1] : 'dashboard';
}

function initShell(pageKey) {
  const key = pageKey || getCurrentKey();
  const base = getBasePath();
  let theme = localStorage.getItem('atonota-theme') || 'dark';
  if (theme === 'dark') document.documentElement.classList.add('dark');

  // Skip link
  document.body.insertAdjacentHTML('afterbegin', '<a href="#main" class="skip-link">Icerige atla</a>');

  // Topbar
  document.getElementById('topbar').innerHTML = `
    <div class="tb-logo"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" rx="3" fill="var(--accent)" opacity="0.9"/><rect x="13" y="2" width="9" height="9" rx="3" fill="var(--accent)" opacity="0.5"/><rect x="2" y="13" width="9" height="9" rx="3" fill="var(--accent)" opacity="0.5"/><rect x="13" y="13" width="9" height="9" rx="3" fill="var(--accent)" opacity="0.2"/></svg></div>
    <div class="tb-brand"><span style="font-size:1.125rem;font-weight:700;color:var(--text)">atonota</span><span style="font-size:0.625rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em">Studio</span><button id="wide-toggle-tb" title="Sidebar toggle"><span class="toggle-arrow"><i class="ph ph-caret-left" style="font-size:0.75rem"></i></span></button></div>
    <div class="tb-mid"><div class="tb-search" id="tb-search-btn" title="Ctrl+K / Cmd+K"><i class="ph ph-magnifying-glass" style="font-size:1.125rem;color:var(--muted);flex-shrink:0"></i><span style="flex:1;font-size:0.8125rem;color:var(--muted)">Ara...</span><span style="font-size:0.625rem;font-weight:700;color:var(--muted);background:var(--surface);border:1px solid var(--border);padding:1px 6px;border-radius:4px;font-family:monospace;flex-shrink:0">⌘K</span></div></div>
    <div class="tb-right"><button class="tb-btn notif-dot" title="Bildirimler" onclick="location.href='${base}pages/notifications.html'"><i class="ph ph-bell" style="font-size:1.25rem"></i></button><button class="tb-btn" id="theme-toggle-btn" title="Tema"><i class="ph ${theme==='dark'?'ph-sun':'ph-moon'}" style="font-size:1.25rem"></i></button><div class="avatar" id="avatar-btn">IK</div></div>`;

  // Rail
  let railHTML = '';
  MENU.forEach((g, gi) => {
    if (gi > 0) railHTML += `<div class="ni-group-label">${g.group}</div><div class="ni-div"></div>`;
    g.items.forEach(item => {
      const active = item.key === key ? ' active' : '';
      railHTML += `<a class="ni${active}" href="${base}${item.href}" title="${item.title}"><i class="ph ${item.icon}"></i><span class="ni-label">${item.title}</span></a>`;
    });
  });
  railHTML += '<div class="ni-spacer"></div>';
  document.getElementById('rail').innerHTML = railHTML;

  // Sidebar
  const sidebarData = SIDEBAR_DATA[key] || [];
  const secInfo = MENU.flatMap(g=>g.items).find(i=>i.key===key);
  let sideHTML = `<div class="ws-header"><i class="ph ${secInfo?secInfo.icon:'ph-squares-four'}" style="font-size:0.8125rem"></i><span>${secInfo?secInfo.title:'Dashboard'}</span></div><div style="flex:1;overflow-y:auto">`;
  sidebarData.forEach((group, gi) => {
    sideHTML += `<div class="ws-section"><div class="ws-l1${gi===0?' open':''}" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><span>${group.l}</span><i class="ph ph-caret-right chevron"></i></div><div class="ws-l1-body${gi===0?' open':''}">`;
    group.ch.forEach((ch, ci) => {
      const parts = ch.split('|');
      const label = parts[0];
      const badge = parts[1] || '';
      const href = parts[2] || '';
      const isFirst = gi===0 && ci===0;
      const currentFile = window.location.pathname.split('/').pop();
      const isActive = href && currentFile === href;
      const activeClass = (isFirst && !href) || isActive ? ' active' : '';
      if (href) {
        const inPages = window.location.pathname.includes('/pages/');
        let resolvedHref;
        if (href === 'index.html') {
          resolvedHref = inPages ? '../index.html' : 'index.html';
        } else {
          resolvedHref = inPages ? href : 'pages/' + href;
        }
        sideHTML += `<a class="ws-l2${activeClass}" href="${resolvedHref}"><span>${label}</span>${badge?`<span class="ws-badge">${badge}</span>`:''}</a>`;
      } else {
        sideHTML += `<div class="ws-l2${activeClass}"><span>${label}</span>${badge?`<span class="ws-badge">${badge}</span>`:''}</div>`;
      }
    });
    sideHTML += '</div></div>';
  });
  sideHTML += `</div><div class="user-card"><div class="ud-trigger" id="user-trigger"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--accent)"><span style="font-size:0.7rem;font-weight:700;color:var(--accent)">IK</span></div><div style="min-width:0;flex:1"><div style="font-size:0.8125rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Ismail Karaca</div><div style="font-size:0.625rem;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase">Super Admin</div></div><i class="ph ph-caret-up" style="color:var(--muted);font-size:0.75rem;flex-shrink:0"></i></div></div>`;
  document.getElementById('sidebar-wide').innerHTML = sideHTML;

  // Breadcrumb (auto-generated from current page)
  const mainEl = document.getElementById('main');
  if (mainEl) {
    const pageTitle = document.querySelector('.page-title');
    const titleText = pageTitle ? pageTitle.textContent : (secInfo ? secInfo.title : 'Dashboard');
    const bcHTML = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${base}index.html" style="color:var(--muted);text-decoration:none;font-size:0.75rem">Dashboard</a>${key !== 'dashboard' ? `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i><a href="${base}${secInfo?secInfo.href:'index.html'}" style="color:var(--muted);text-decoration:none;font-size:0.75rem">${secInfo?secInfo.title:''}</a>` : ''}${titleText !== (secInfo?secInfo.title:'Dashboard') ? `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i><span style="color:var(--text);font-size:0.75rem;font-weight:500">${titleText}</span>` : ''}</nav>`;
    mainEl.insertAdjacentHTML('afterbegin', bcHTML);
  }

  // Footer
  document.getElementById('footbar').innerHTML = `<span class="fb-dot"></span><span>Sistem aktif</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">12</strong> tenant</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">47</strong> workspace</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">5</strong> adaptor</span><span style="margin-left:auto;font-size:0.625rem;letter-spacing:0.05em">v0.1.0</span>`;

  // Spotlight
  document.getElementById('spotlight-backdrop').innerHTML = `<div id="spotlight"><div class="sp-input-wrap"><i class="ph ph-magnifying-glass" style="font-size:1.125rem;color:var(--muted)"></i><input id="sp-input" class="sp-input" type="text" placeholder="Panelde ara..." autocomplete="off"><span class="sp-kbd" id="sp-close">ESC</span></div><div class="sp-results"><div class="sp-section-label">Hizli Erisim</div>${MENU.flatMap(g=>g.items).slice(0,6).map(i=>`<a class="sp-item" href="${base}${i.href}"><div class="sp-item-icon"><i class="ph ${i.icon}"></i></div><div><div class="sp-item-title">${i.title}</div></div></a>`).join('')}</div><div class="sp-footer"><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">↑↓</span> gezin</span><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">↵</span> ac</span><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">ESC</span> kapat</span></div></div>`;

  // Dropdown
  document.getElementById('ud-backdrop').innerHTML = `<div id="user-dropdown"><a class="ud-item" href="${base}pages/settings.html"><i class="ph ph-user-circle"></i>Profil</a><a class="ud-item" href="${base}pages/settings.html"><i class="ph ph-gear"></i>Ayarlar</a><div class="ud-divider"></div><button class="ud-item" id="dd-theme-btn"><i class="ph ${theme==='dark'?'ph-sun':'ph-moon'}"></i>${theme==='dark'?'Light Tema':'Dark Tema'}</button><div class="ud-divider"></div><button class="ud-item" style="color:var(--accent);font-weight:600"><i class="ph ph-sign-out" style="color:var(--accent)"></i>Cikis Yap</button></div>`;

  // Events
  const spotBd = document.getElementById('spotlight-backdrop');
  const udBd = document.getElementById('ud-backdrop');

  document.getElementById('tb-search-btn').onclick = () => { spotBd.classList.add('open'); document.getElementById('sp-input').focus(); };
  spotBd.onclick = (e) => { if(e.target===spotBd) spotBd.classList.remove('open'); };
  document.getElementById('sp-close').onclick = () => spotBd.classList.remove('open');

  document.getElementById('avatar-btn').onclick = () => udBd.classList.toggle('show');
  document.getElementById('user-trigger').onclick = () => udBd.classList.toggle('show');
  udBd.onclick = (e) => { if(e.target===udBd) udBd.classList.remove('show'); };

  document.getElementById('wide-toggle-tb').onclick = () => {
    if(window.innerWidth >= 900) { document.body.classList.toggle('wide-collapsed'); }
    else { document.getElementById('sidebar-wide').classList.toggle('open'); document.getElementById('wide-overlay').classList.toggle('show'); }
  };
  document.getElementById('wide-overlay').onclick = () => { document.getElementById('sidebar-wide').classList.remove('open'); document.getElementById('wide-overlay').classList.remove('show'); };

  function toggleTheme() {
    theme = theme==='dark'?'light':'dark';
    document.documentElement.classList.toggle('dark', theme==='dark');
    localStorage.setItem('atonota-theme', theme);
    location.reload();
  }
  document.getElementById('theme-toggle-btn').onclick = toggleTheme;
  const ddBtn = document.getElementById('dd-theme-btn');
  if(ddBtn) ddBtn.onclick = toggleTheme;

  window.addEventListener('keydown', (e) => {
    if((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); spotBd.classList.add('open'); document.getElementById('sp-input').focus(); }
    if(e.key==='Escape') { spotBd.classList.remove('open'); udBd.classList.remove('show'); }
  });
}
