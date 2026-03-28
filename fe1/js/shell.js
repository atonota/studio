/* ═══════════════════════════════════════════
   atonota Studio — Shell Component
   Master navigation: topbar, rail, sidebar, footer, spotlight, dropdown
   Her sayfa bu dosyayi yukler ve initShell() cagirir
═══════════════════════════════════════════ */

const MENU = [
  {group:'GENEL', items:[
    {key:'dashboard',  icon:'ph-squares-four',    title:'Dashboard',    href:'index.html'},
    {key:'yonetim',    icon:'ph-buildings',        title:'Yonetim',      href:'pages/tenants.html'},
  ]},
  {group:'ANALIZ', items:[
    {key:'seo',        icon:'ph-chart-line-up',    title:'SEO',          href:'pages/seo.html'},
    {key:'content',    icon:'ph-article',          title:'Icerik',       href:'pages/content.html'},
    {key:'ads',        icon:'ph-megaphone',         title:'Reklamlar',    href:'pages/ads.html'},
    {key:'analytics',  icon:'ph-chart-bar',         title:'Analitik',     href:'pages/analytics.html'},
  ]},
  {group:'SISTEM', items:[
    {key:'ai',         icon:'ph-robot',             title:'AI & Rapor',   href:'pages/ai.html'},
    {key:'settings',   icon:'ph-gear',              title:'Ayarlar',      href:'pages/settings.html'},
  ]},
];

/* Sidebar data: 8 keys matching MENU. Format: "Label|badge|href" */
const SIDEBAR_DATA = {
  dashboard: [
    {l:'Genel Bakis',ch:['Platform Ozeti||index.html','KPI Takibi||dashboard-workspace.html']},
    {l:'Aktivite',ch:['Son Degisiklikler||audit.html','Bildirimler|7|notifications.html']},
  ],
  yonetim: [
    {l:'Tenant',ch:['Tum Tenantlar|12|tenants.html','Yeni Olustur||tenant-create.html']},
    {l:'Workspace',ch:['Tum Workspaceler||workspaces.html','Yeni Ekle||workspace-create.html']},
    {l:'Adaptorler',ch:['Tum Platformlar|83+|adapters.html','Health Dashboard||adapter-health.html']},
  ],
  seo: [
    {l:'Anahtar Kelime',ch:['Keyword Magic||seo-keyword-magic.html','Arastirma||seo-keywords.html','Cluster||seo-cluster.html']},
    {l:'Siralama',ch:['Pozisyon Takibi||seo-position-tracker.html','SERP Ozellikleri||seo-serp.html','Organik Arastirma||seo-organic-research.html']},
    {l:'GEO (AI Gorunurluk)',ch:['GEO Dashboard||seo-geo.html','AI Mention||seo-geo-mentions.html','Prompt Arastirma||seo-geo-prompts.html','Citability||seo-geo-citability.html']},
    {l:'Teknik SEO',ch:['Site Denetimi||seo-audit.html','On-Page Checker||seo-onpage-checker.html','Backlink|47|seo-backlinks.html','Backlink Denetimi||seo-backlink-audit.html','Backlink Gap||seo-backlink-gap.html','Link Kesisim||seo-link-intersect.html','Toplu Analiz||seo-batch-analysis.html']},
    {l:'Entity SEO',ch:['Entity Hub||entities.html','Knowledge Graph||seo-entities.html']},
    {l:'Marketplace SEO',ch:['Marketplace Hub||marketplace.html']},
    {l:'Local SEO',ch:['Local Dashboard||local.html']},
  ],
  content: [
    {l:'Analiz',ch:['Sayfa Listesi||content-pages.html','Content Explorer||content-explorer.html','Gap Analizi||content-gaps.html','Bozunma||content-decay.html']},
    {l:'Schema Markup',ch:['Schema Hub||schema.html','Schema Yonetimi||content-schema.html']},
    {l:'Uretim',ch:['SEO Yazim Asistani||content-writing-assistant.html','Konu Arastirma||content-topic-research.html','Icerik Sablonu||content-template.html','llms.txt||content-llmstxt.html']},
    {l:'Harita',ch:['Semantik Harita||content-semantic.html','Orphaned Icerik||content-orphaned.html','Readability||content-readability.html']},
  ],
  ads: [
    {l:'Kampanyalar',ch:['Tum Kampanyalar|8|ads.html','Reklam Gruplari||ads-adgroups.html','Kreatifler||ads-creatives.html']},
    {l:'Platformlar',ch:['Meta (FB+IG)|3|ads-meta.html','TikTok|2|ads-tiktok.html','LinkedIn||ads-linkedin.html']},
    {l:'Otomasyon',ch:['Kural Motoru||ads-rules.html','Butce Yonetimi||ads-budgets.html','AI Optimizer||ads-budget-optimizer.html','Uyarilar|1|ads-alerts.html']},
    {l:'Raporlar',ch:['Performans||ads-reports.html','Attribution||ads-attribution.html','Rakip Reklam||ads-competitor-research.html']},
    {l:'Hesap',ch:['Bagli Hesaplar||ads-accounts.html','Token Durumu||ads-tokens.html']},
  ],
  analytics: [
    {l:'Trafik',ch:['Genel Bakis||analytics.html','Trafik Detay||analytics-traffic.html','Huni Analizi||analytics-funnels.html','Segmentler||analytics-segments.html']},
    {l:'Performans',ch:['CWV Dashboard||performance.html','LCP / INP / CLS||performance-vitals.html','Uptime||performance-uptime.html','Hiz Testi||performance-speed.html']},
    {l:'Guvenlik',ch:['Guvenlik Dashboard||security.html','Zafiyet Raporu||security-vulnerabilities.html','SSL Sertifika||security-ssl.html']},
    {l:'Rakip Analizi',ch:['Rakip Listesi||competitors.html','Karsilastirma||competitor-compare.html','SWOT (AI)||competitor-swot.html','Pazar Payi||competitor-marketshare.html']},
    {l:'AI Sorgu',ch:['Dogal Dil Sorgu||analytics-query.html','Gercek Zamanli||analytics-realtime.html']},
  ],
  ai: [
    {l:'AI Chat',ch:['Yeni Sohbet||ai.html','Brand Radar||ai-brand-radar.html']},
    {l:'Insight Feed',ch:['Tum Insightlar||insights.html','Anomaliler||insights-feed.html','Digest Arsivi||insights-digests.html']},
    {l:'Raporlar',ch:['Tum Raporlar||reports.html','Sablonlar||report-templates.html','Zamanlama||report-schedule.html']},
  ],
  settings: [
    {l:'Hesap',ch:['Profil||settings-profile.html','Guvenlik||settings-security.html','Bildirim Tercihleri||settings-notifications-prefs.html','Gorunum||settings-appearance.html']},
    {l:'Sistem',ch:['API Anahtarlari||settings-apikeys.html','Webhook||settings-webhooks.html']},
    {l:'Faturalandirma',ch:['Planlar||billing-plans.html']},
    {l:'Bildirimler',ch:['Tum Bildirimler|7|notifications.html','Bildirim Kurallari||notification-rules.html']},
    {l:'Audit Log',ch:['Tum Olaylar||audit.html']},
  ],
};

const TOP_MENU = [
  { key: 'dashboard', label: 'Dashboard', hasDropdown: false },
  { key: 'seo', label: 'SEO', hasDropdown: true, columns: [
    { head: 'Arastirma', items: [
      { icon: 'ph-magic-wand', label: 'Keyword Magic', href: 'seo-keyword-magic.html' },
      { icon: 'ph-chart-line-up', label: 'Pozisyon Takibi', href: 'seo-position-tracker.html' },
      { icon: 'ph-bug', label: 'Site Denetimi', href: 'seo-audit.html' },
    ]},
    { head: 'Otorite', items: [
      { icon: 'ph-link-simple', label: 'Backlink Analizi', href: 'seo-backlinks.html' },
      { icon: 'ph-globe-hemisphere-west', label: 'GEO & Local', href: 'seo-geo.html' },
      { icon: 'ph-graph', label: 'Entity Graph', href: 'seo-entities.html' },
    ]},
    { head: 'Ticaret', items: [
      { icon: 'ph-storefront', label: 'Marketplace SEO', href: 'marketplace.html' },
      { icon: 'ph-map-pin', label: 'Local SEO', href: 'local.html' },
    ]},
  ]},
  { key: 'content', label: 'Icerik', hasDropdown: true, columns: [
    { head: 'Analiz', items: [
      { icon: 'ph-file-text', label: 'Sayfa Analizi', href: 'content-pages.html' },
      { icon: 'ph-compass', label: 'Content Explorer', href: 'content-explorer.html' },
    ]},
    { head: 'Uretim', items: [
      { icon: 'ph-pencil-simple', label: 'Yazim Asistani', href: 'content-writing-assistant.html' },
      { icon: 'ph-code', label: 'Schema Generator', href: 'schema-generator.html' },
      { icon: 'ph-tree-structure', label: 'Konu Arastirma', href: 'content-topic-research.html' },
    ]},
  ]},
  { key: 'ads', label: 'Reklamlar', hasDropdown: true, columns: [
    { head: 'Yonetim', items: [
      { icon: 'ph-tag-chevron', label: 'Kampanyalar', href: 'ads.html' },
      { icon: 'ph-robot', label: 'Otomasyon', href: 'ads-rules.html' },
      { icon: 'ph-arrows-merge', label: 'Attribution', href: 'ads-attribution.html' },
    ]},
    { head: 'Platformlar', items: [
      { icon: 'ph-facebook-logo', label: 'Meta Ads', href: 'ads-meta.html' },
      { icon: 'ph-tiktok-logo', label: 'TikTok Ads', href: 'ads-tiktok.html' },
      { icon: 'ph-linkedin-logo', label: 'LinkedIn Ads', href: 'ads-linkedin.html' },
    ]},
  ]},
  { key: 'analytics', label: 'Analitik', hasDropdown: true, columns: [
    { head: 'Performans', items: [
      { icon: 'ph-users-three', label: 'Trafik', href: 'analytics-traffic.html' },
      { icon: 'ph-trend-up', label: 'Performans', href: 'performance.html' },
      { icon: 'ph-shield-check', label: 'Guvenlik', href: 'security.html' },
    ]},
    { head: 'Zeka', items: [
      { icon: 'ph-flag', label: 'Rakipler', href: 'competitors.html' },
      { icon: 'ph-brain', label: 'AI Sorgu', href: 'analytics-query.html' },
    ]},
  ]},
  { key: 'ai', label: 'AI', hasDropdown: true, columns: [
    { head: 'Araclar', items: [
      { icon: 'ph-chat-teardrop-dots', label: 'AI Chat', href: 'ai.html' },
      { icon: 'ph-broadcast', label: 'Brand Radar', href: 'ai-brand-radar.html', badge: 'Yeni' },
      { icon: 'ph-lightning', label: 'Insight Feed', href: 'insights.html' },
    ]},
    { head: 'Raporlar', items: [
      { icon: 'ph-newspaper', label: 'Raporlar', href: 'reports.html' },
      { icon: 'ph-chart-pie', label: 'Ozetler', href: 'insights-digests.html' },
    ]},
  ]},
];

function tmResolveHref(href, prefix) {
  if (!href) return '#';
  const inPages = window.location.pathname.includes('/pages/');
  if (href === 'index.html') {
    return inPages ? '../index.html' : 'index.html';
  }
  return inPages ? href : 'pages/' + href;
}

function tmCloseAll() {
  document.querySelectorAll('.tm-item.open').forEach(el => el.classList.remove('open'));
  const bd = document.getElementById('tm-backdrop');
  if (bd) bd.classList.remove('show');
}

function tmToggle(itemEl) {
  const wasOpen = itemEl.classList.contains('open');
  tmCloseAll();
  if (!wasOpen) {
    itemEl.classList.add('open');
    document.getElementById('tm-backdrop').classList.add('show');
  }
}

function tmSelect(btn, key) {
  document.querySelectorAll('.tm-btn.active').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function tmLink(href) {
  tmCloseAll();
  window.location.href = href;
}

function buildTopMenu(activeKey) {
  let nav = document.getElementById('topmenu');
  if (!nav) {
    // Auto-create topmenu + backdrop if not in HTML
    const topbar = document.getElementById('topbar');
    if (topbar) {
      nav = document.createElement('nav');
      nav.id = 'topmenu';
      topbar.insertAdjacentElement('afterend', nav);
      if (!document.getElementById('tm-backdrop')) {
        const bd = document.createElement('div');
        bd.id = 'tm-backdrop';
        nav.insertAdjacentElement('afterend', bd);
      }
    } else return;
  }
  let html = '';

  TOP_MENU.forEach(item => {
    const isActive = item.key === activeKey ? ' active' : '';
    if (!item.hasDropdown) {
      const href = tmResolveHref(item.key === 'dashboard' ? 'index.html' : 'pages/' + item.key + '.html');
      html += `<div class="tm-item"><button class="tm-btn${isActive}" onclick="tmLink('${href}')">${item.label}</button></div>`;
    } else {
      html += `<div class="tm-item" id="tm-${item.key}"><button class="tm-btn${isActive}" onclick="tmToggle(this.parentElement)">${item.label} <i class="ph ph-caret-down tm-caret"></i></button>`;
      html += `<div class="tm-dropdown">`;
      // Desktop columns
      item.columns.forEach(col => {
        html += `<div class="tm-col"><div class="tm-col-head">${col.head}</div>`;
        col.items.forEach(link => {
          const resolved = tmResolveHref(link.href);
          const badgeHTML = link.badge ? `<span class="tm-link-badge">${link.badge}</span>` : '';
          html += `<a class="tm-link" href="${resolved}" onclick="tmCloseAll()"><i class="ph ${link.icon}"></i>${link.label}${badgeHTML}</a>`;
        });
        html += `</div>`;
      });
      // Mobile flat list
      item.columns.forEach((col, ci) => {
        if (ci > 0) html += `<div class="tm-divider"></div>`;
        html += `<div class="tm-section-label">${col.head}</div>`;
        col.items.forEach(link => {
          const resolved = tmResolveHref(link.href);
          const badgeHTML = link.badge ? `<span class="tm-link-badge">${link.badge}</span>` : '';
          html += `<a class="tm-link" href="${resolved}" onclick="tmCloseAll()"><i class="ph ${link.icon}"></i>${link.label}${badgeHTML}</a>`;
        });
      });
      html += `</div></div>`;
    }
  });

  nav.innerHTML = html;

  // Backdrop click closes
  const bd = document.getElementById('tm-backdrop');
  if (bd) bd.onclick = () => tmCloseAll();
}

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

function showToast(msg, duration) {
  duration = duration || 2500;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = 'padding:10px 20px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:10px;font-size:0.8125rem;font-weight:500;box-shadow:0 4px 24px rgba(0,0,0,0.25);pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity 0.2s,transform 0.2s;';
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

function initShell(pageKey) {
  const key = pageKey || getCurrentKey();
  window.__SHELL_KEY = key; // For empty state auto-detection
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
    <div class="tb-right"><button class="tb-btn" title="Bildirimler" onclick="location.href='${base}pages/notifications.html'" style="position:relative"><i class="ph ph-bell" style="font-size:1.25rem"></i><span id="notif-badge" style="position:absolute;top:6px;right:6px;background:var(--accent);color:white;font-size:0.625rem;font-weight:700;min-width:16px;height:16px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 4px;"></span></button><button class="tb-btn" id="theme-toggle-btn" title="Tema"><i class="ph ${theme==='dark'?'ph-sun':'ph-moon'}" style="font-size:1.25rem"></i></button><div class="avatar" id="avatar-btn">IK</div></div>`;

  // Top Menu
  buildTopMenu(key);

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
    // Refresh charts for new theme colors instead of full reload
    if (typeof refreshAllCharts === 'function') refreshAllCharts();
    // Update theme toggle icon
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.querySelector('i').className = 'ph ' + (theme==='dark'?'ph-sun':'ph-moon');
    const ddBtn = document.getElementById('dd-theme-btn');
    if (ddBtn) {
      ddBtn.querySelector('i').className = 'ph ' + (theme==='dark'?'ph-sun':'ph-moon');
      ddBtn.childNodes[1].textContent = theme==='dark'?' Light Tema':' Dark Tema';
    }
  }
  document.getElementById('theme-toggle-btn').onclick = toggleTheme;
  const ddBtn = document.getElementById('dd-theme-btn');
  if(ddBtn) ddBtn.onclick = toggleTheme;

  window.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if(mod && e.key==='k') { e.preventDefault(); spotBd.classList.add('open'); document.getElementById('sp-input').focus(); }
    if(e.key==='Escape') { spotBd.classList.remove('open'); udBd.classList.remove('show'); tmCloseAll(); const hm = document.getElementById('shortcuts-help-modal'); if(hm) hm.remove(); }

    // Cmd/Ctrl+N — new (navigate to create page based on current section)
    if (mod && e.key === 'n') {
      e.preventDefault();
      const skey = window.__SHELL_KEY;
      const createPages = {
        yonetim: 'tenant-create.html',
        seo: 'seo-keyword-magic.html',
        content: 'content-writing-assistant.html',
        ads: 'ads-campaign-create.html',
      };
      if (createPages[skey]) window.location.href = base + 'pages/' + createPages[skey];
    }

    // ? — show shortcuts help modal
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      showShortcutsHelp();
    }
  });

  function showShortcutsHelp() {
    if (document.getElementById('shortcuts-help-modal')) return;
    const mac = /mac/i.test(navigator.platform);
    const modLabel = mac ? '\u2318' : 'Ctrl+';
    const overlay = document.createElement('div');
    overlay.id = 'shortcuts-help-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);';
    overlay.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px 32px;min-width:340px;max-width:420px;box-shadow:0 24px 48px rgba(0,0,0,0.4);"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><h3 style="font-size:1rem;font-weight:700;color:var(--text);margin:0">Klavye Kisayollari</h3><button id="shortcuts-close" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.25rem;padding:4px"><i class="ph ph-x"></i></button></div><div style="display:flex;flex-direction:column;gap:12px">${[
      [modLabel + 'K', 'Spotlight Arama'],
      [modLabel + 'N', 'Yeni Olustur'],
      ['?', 'Kisayol Yardimi'],
      ['ESC', 'Kapat'],
    ].map(([k,v]) => `<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:0.8125rem;color:var(--text)">${v}</span><kbd style="font-size:0.75rem;font-weight:600;color:var(--muted);background:var(--surface-2);border:1px solid var(--border);padding:3px 10px;border-radius:6px;font-family:monospace;min-width:48px;text-align:center">${k}</kbd></div>`).join('')}</div></div>`;
    document.body.appendChild(overlay);
    overlay.onclick = (ev) => { if (ev.target === overlay) overlay.remove(); };
    document.getElementById('shortcuts-close').onclick = () => overlay.remove();
  }

  // PWA manifest injection
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = base + 'manifest.json';
    document.head.appendChild(manifestLink);
  }

  // Favicon injection (prevents 404)
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = base + 'favicon.svg';
    document.head.appendChild(favicon);
  }

  // --- Notification Badge Polling (every 30s) ---
  function updateNotifBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const count = Math.floor(Math.random() * 13); // 0-12
    if (count === 0) {
      badge.style.display = 'none';
      badge.textContent = '';
    } else {
      badge.style.display = 'flex';
      badge.textContent = count > 99 ? '99+' : String(count);
    }
  }
  updateNotifBadge();
  setInterval(updateNotifBadge, 30000);

  // --- Workspace Switcher in Sidebar ---
  const WORKSPACES = ['acme.com', 'shop.beta.com', 'gamma.io'];
  let currentWorkspace = WORKSPACES[0];
  const wsHeader = document.querySelector('#sidebar-wide .ws-header');
  if (wsHeader) {
    const wsSwitcher = document.createElement('div');
    wsSwitcher.id = 'ws-switcher';
    wsSwitcher.style.cssText = 'padding:12px 20px;background:var(--surface-2);border-radius:10px;margin:12px 16px;cursor:pointer;position:relative;';
    function renderSwitcher() {
      wsSwitcher.innerHTML = `<div id="ws-switcher-trigger" style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:0.8125rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${currentWorkspace}</span><i class="ph ph-caret-down" style="font-size:0.75rem;color:var(--muted);flex-shrink:0;transition:transform 0.2s"></i></div><div id="ws-switcher-list" style="display:none;margin-top:8px;border-top:1px solid var(--border);padding-top:8px"></div>`;
      const list = wsSwitcher.querySelector('#ws-switcher-list');
      WORKSPACES.forEach(ws => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:6px 0;font-size:0.8125rem;cursor:pointer;border-radius:6px;';
        item.style.color = ws === currentWorkspace ? 'var(--accent)' : 'var(--text)';
        item.style.fontWeight = ws === currentWorkspace ? '700' : '400';
        item.textContent = ws;
        item.onmouseenter = () => { if (ws !== currentWorkspace) item.style.color = 'var(--accent)'; };
        item.onmouseleave = () => { if (ws !== currentWorkspace) item.style.color = 'var(--text)'; };
        item.onclick = (e) => {
          e.stopPropagation();
          currentWorkspace = ws;
          list.style.display = 'none';
          wsSwitcher.querySelector('#ws-switcher-trigger .ph-caret-down').style.transform = '';
          renderSwitcher();
          showToast('Workspace degistirildi: ' + ws);
        };
        list.appendChild(item);
      });
    }
    renderSwitcher();
    wsSwitcher.querySelector('#ws-switcher-trigger').onclick = () => {
      const list = wsSwitcher.querySelector('#ws-switcher-list');
      const caret = wsSwitcher.querySelector('#ws-switcher-trigger .ph-caret-down');
      const isOpen = list.style.display !== 'none';
      list.style.display = isOpen ? 'none' : 'block';
      caret.style.transform = isOpen ? '' : 'rotate(180deg)';
    };
    wsHeader.insertAdjacentElement('afterend', wsSwitcher);
  }
}
