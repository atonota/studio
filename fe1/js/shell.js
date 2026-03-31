"use strict";
(() => {
  // src/app/shell/navigation-config.ts
  var MENU = [
    { group: "ANALIZ", items: [
      { key: "seo", icon: "ph-trend-up", title: "SEO", href: "pages/seo.html" },
      { key: "content", icon: "ph-article", title: "Icerik", href: "pages/content.html" },
      { key: "ads", icon: "ph-broadcast", title: "Reklamlar", href: "pages/ads.html" },
      { key: "analytics", icon: "ph-chart-line", title: "Analitik", href: "pages/analytics.html" }
    ] },
    { group: "KESIF", items: [
      { key: "geo", icon: "ph-globe-hemisphere-west", title: "GEO / AI", href: "pages/geo.html" },
      { key: "competitor", icon: "ph-binoculars", title: "Rakip", href: "pages/competitors.html" },
      { key: "local", icon: "ph-map-pin", title: "Local", href: "pages/local.html" },
      { key: "performance", icon: "ph-gauge", title: "Performans", href: "pages/performance.html" }
    ] },
    { group: "ZEKA", items: [
      { key: "insights", icon: "ph-lightbulb", title: "Insights", href: "pages/insights.html" },
      { key: "reports", icon: "ph-clipboard-text", title: "Raporlar", href: "pages/reports.html" }
    ] }
  ];
  var SIDEBAR_DATA = {
    seo: [
      { l: "Anahtar Kelime", ch: ["Keyword Magic||seo-keyword-magic.html", "Arastirma||seo-keywords.html", "Cluster||seo-cluster.html", "Organik Arastirma||seo-organic-research.html"] },
      { l: "Siralama", ch: ["Pozisyon Takibi||seo-position-tracker.html", "SERP Ozellikleri||seo-serp.html", "Rankings||seo-rankings.html"] },
      { l: "Teknik SEO", ch: ["Site Denetimi||seo-audit.html", "On-Page Checker||seo-onpage-checker.html", "Toplu Analiz||seo-batch-analysis.html"] },
      { l: "Baglanti", ch: ["Backlink|47|seo-backlinks.html", "Backlink Denetimi||seo-backlink-audit.html", "Backlink Gap||seo-backlink-gap.html", "Link Kesisim||seo-link-intersect.html"] },
      { l: "Entity SEO", ch: ["Entity Hub||seo-entities.html", "Entity Graph||seo-entities-graph.html", "Entity Extract||entities-extract.html", "Entity Gaps||entities-gaps.html", "Knowledge Panel||entities-knowledge-panel.html"] },
      { l: "Marketplace SEO", ch: ["Marketplace Hub||marketplace.html", "Urunler||marketplace-products.html", "Keyword||marketplace-keywords.html", "Rakipler||marketplace-competitors.html", "Optimizasyon||marketplace-optimization.html"] }
    ],
    content: [
      { l: "Kesif", ch: ["Content Explorer||content-explorer.html", "Konu Arastirma||content-topic-research.html", "Yazim Asistani||content-writing-assistant.html", "Icerik Sablonu||content-template.html"] },
      { l: "Analiz", ch: ["Sayfa Listesi||content-pages.html", "Bozunma||content-decay.html", "Gap Analizi||content-gaps.html", "Readability||content-readability.html", "AI Detection||content-ai-detection.html"] },
      { l: "Schema Markup", ch: ["Schema Hub||content-schema.html", "Schema Aggregation||content-schema-aggregation.html", "Generator||schema-generator.html", "Sablonlar||schema-templates.html", "Import||schema-import.html", "Validate||schema-validate.html"] },
      { l: "Harita", ch: ["Semantik Harita||content-semantic.html", "Orphaned Icerik||content-orphaned.html", "llms.txt||content-llmstxt.html"] }
    ],
    ads: [
      { l: "Kampanyalar", ch: ["Tum Kampanyalar|8|ads-campaigns.html", "Kampanya Olustur||ads-campaign-create.html", "Reklam Gruplari||ads-adgroups.html"] },
      { l: "Platformlar", ch: ["Meta (FB+IG)|3|ads-meta.html", "TikTok|2|ads-tiktok.html", "LinkedIn||ads-linkedin.html", "Pinterest||ads-pinterest.html", "Snapchat||ads-snapchat.html", "WhatsApp||ads-whatsapp.html"] },
      { l: "Optimizasyon", ch: ["Butce Yonetimi||ads-budgets.html", "AI Optimizer||ads-budget-optimizer.html", "Hedef Kitle||ads-audiences.html", "Kreatifler||ads-creatives.html", "Attribution||ads-attribution.html"] },
      { l: "Kurallar", ch: ["Kural Motoru||ads-rules.html", "Uyarilar|1|ads-alerts.html"] },
      { l: "Raporlar", ch: ["Performans||ads-reports.html", "Rapor Olustur||ads-report-create.html", "Sablonlar||ads-report-templates.html", "Zamanlama||ads-report-schedule.html", "Rakip Reklam||ads-competitor-research.html"] },
      { l: "Hesap", ch: ["Bagli Hesaplar||ads-accounts.html", "Token Durumu||ads-tokens.html"] }
    ],
    analytics: [
      { l: "Trafik", ch: ["Trafik Detay||analytics-traffic.html", "Gercek Zamanli||analytics-realtime.html"] },
      { l: "Analiz", ch: ["Huni Analizi||analytics-funnels.html", "Segmentler||analytics-segments.html", "AI Sorgu||analytics-query.html"] }
    ],
    geo: [
      { l: "GEO", ch: ["GEO Dashboard||seo-geo.html", "AI Mention||seo-geo-mentions.html", "Prompt Arastirma||seo-geo-prompts.html", "Citability||seo-geo-citability.html", "Sorgular||geo-queries.html", "Sentiment||geo-sentiment.html", "Rakipler||geo-competitors.html", "Platformlar||geo-platforms.html", "Oneriler||geo-recommendations.html", "Citation Widget||geo-citation-widget.html"] },
      { l: "AI", ch: ["AI Chat||ai.html", "Brand Radar||ai-brand-radar.html", "AI Digests||ai-digests.html"] }
    ],
    competitor: [
      { l: "Analiz", ch: ["Karsilastirma||competitor-compare.html", "SWOT (AI)||competitor-swot.html", "Strateji||competitor-strategy.html", "Pazar Payi||competitor-marketshare.html", "Tech Stack||competitor-techstack.html", "Uyarilar||competitor-alerts.html"] }
    ],
    local: [
      { l: "Lokasyon", ch: ["Lokasyonlar||local-locations.html", "GBP Yonetimi||local-gbp.html", "Local Rankings||local-rankings.html", "Yorum Yonetimi||local-reviews.html", "Dizin Listesi||local-directories.html"] }
    ],
    performance: [
      { l: "Araclar", ch: ["LCP / INP / CLS||performance-vitals.html", "Hiz Testi||performance-speed.html", "Uptime||performance-uptime.html", "Oneriler||performance-recommendations.html"] },
      { l: "Guvenlik", ch: ["Guvenlik Dashboard||security.html", "Zafiyet Raporu||security-vulnerabilities.html", "SSL Sertifika||security-ssl.html", "HTTP Headers||security-headers.html", "Compliance||security-compliance.html"] }
    ],
    insights: [
      { l: "Feed", ch: ["AI Feed||insights-feed.html", "Digest Arsivi||insights-digests.html"] },
      { l: "Tercihler", ch: ["Insight Tercihleri||insights-preferences.html"] }
    ],
    reports: [
      { l: "Raporlar", ch: ["Yeni Rapor||report-create.html", "Rapor Detay||report-detail.html"] },
      { l: "Yonetim", ch: ["Sablonlar||report-templates.html", "Zamanlama||report-schedule.html"] }
    ],
    settings: [
      { l: "Tema", ch: ["Tema Secenekleri||settings-theme-options.html"] },
      { l: "Erisim", ch: ["Erisilebilirlik||settings-accessibility.html"] },
      { l: "Hesap", ch: ["Profil||settings-profile.html", "Guvenlik||settings-security.html", "Bildirim Tercihleri||settings-notifications-prefs.html"] },
      { l: "Sistem", ch: ["API Anahtarlari||settings-apikeys.html", "Webhook||settings-webhooks.html", "Tenant Ayarlari||settings-tenant-settings.html"] },
      { l: "Altyapi", ch: ["Adaptorler||adapters.html", "Adaptor Baglanti||adapter-connect.html", "Adaptor Health||adapter-health.html", "Tenantlar||tenants.html", "Tenant Olustur||tenant-create.html", "Workspaceler||workspaces.html", "Workspace Olustur||workspace-create.html"] },
      { l: "Faturalandirma", ch: ["Planlar||billing-plans.html", "Faturalar||billing-invoices.html", "Odeme Yontemleri||billing-payment-methods.html", "Kullanim||billing-usage.html"] },
      { l: "Bildirimler", ch: ["Tum Bildirimler|7|notifications.html", "Bildirim Kurallari||notification-rules.html", "Kural Olustur||notification-rule-create.html"] },
      { l: "Audit Log", ch: ["Tum Olaylar||audit.html"] }
    ]
  };
  var KEY_MAP = {
    yonetim: "settings",
    ai: "geo"
  };
  var SIDEBAR_HIDDEN = ["dashboard"];

  // src/app/shell/favorites.ts
  var FAV_KEY = "ap_fav_shortcuts";
  var FAV_MAX = 5;
  function isFavoriteArray(val) {
    if (!Array.isArray(val)) return false;
    return val.every(
      (item) => typeof item === "object" && item !== null && typeof item.label === "string" && typeof item.href === "string"
    );
  }
  function getFavorites() {
    try {
      const raw = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
      return isFavoriteArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }
  function saveFavorites(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs.slice(0, FAV_MAX)));
  }
  function addFavorite(label, href) {
    const favs = getFavorites();
    if (favs.some((f) => f.href === href)) return;
    favs.unshift({ label, href });
    if (favs.length > FAV_MAX) favs.pop();
    saveFavorites(favs);
    renderFavorites();
  }
  function removeFavorite(href) {
    const favs = getFavorites().filter((f) => f.href !== href);
    saveFavorites(favs);
    renderFavorites();
  }
  function isFavorite(href) {
    return getFavorites().some((f) => f.href === href);
  }
  function renderFavorites() {
  }
  function togglePageFav() {
    const href = window.location.pathname.split("/").pop() ?? "";
    const titleEl = document.querySelector(".page-title");
    const label = titleEl ? titleEl.textContent ?? "" : (document.title.split("\u2014")[0] ?? "").trim();
    const btn = document.getElementById("bc-star-btn");
    if (isFavorite(href)) {
      removeFavorite(href);
      if (btn) {
        btn.classList.remove("bc-star-active");
        const icon2 = btn.querySelector("i");
        if (icon2) icon2.className = "ph ph-star";
        btn.title = "Kisayollara ekle";
      }
      document.querySelectorAll(`.ws-star[data-fav-href="${href}"]`).forEach((s) => {
        s.classList.remove("active");
      });
      if (window.Alpine && Alpine.store("toast")) {
        Alpine.store("toast").show(label + " kisayollardan kaldirildi", "info", 2e3);
      }
      return;
    }
    addFavorite(label, href);
    if (btn) {
      btn.classList.add("bc-star-active");
      const icon2 = btn.querySelector("i");
      if (icon2) icon2.className = "ph ph-star-fill";
      btn.title = "Kisayollardan kaldir";
    }
    document.querySelectorAll(`.ws-star[data-fav-href="${href}"]`).forEach((s) => {
      s.classList.add("active");
    });
    if (window.Alpine && Alpine.store("toast")) {
      Alpine.store("toast").show(label + " kisayollara eklendi", "success", 2e3);
    }
  }
  function toggleFav(btn) {
    const href = btn.dataset.favHref ?? "";
    const label = btn.dataset.favLabel ?? "";
    if (isFavorite(href)) {
      removeFavorite(href);
      btn.classList.remove("active");
      const bcStar2 = document.getElementById("bc-star-btn");
      if (bcStar2 && window.location.pathname.split("/").pop() === href) {
        bcStar2.classList.remove("bc-star-active");
        const icon2 = bcStar2.querySelector("i");
        if (icon2) icon2.className = "ph ph-star";
      }
      if (window.Alpine && Alpine.store("toast")) {
        Alpine.store("toast").show(label + " kisayollardan kaldirildi", "info", 2e3);
      }
      return;
    }
    addFavorite(label, href);
    btn.classList.add("active");
    const bcStar = document.getElementById("bc-star-btn");
    if (bcStar && window.location.pathname.split("/").pop() === href) {
      bcStar.classList.add("bc-star-active");
      const icon2 = bcStar.querySelector("i");
      if (icon2) icon2.className = "ph ph-star-fill";
    }
    if (window.Alpine && Alpine.store("toast")) {
      Alpine.store("toast").show(label + " kisayollara eklendi", "success", 2e3);
    }
  }

  // src/app/shell/topbar.ts
  function renderTopbar(base) {
    const topbarEl = document.getElementById("topbar");
    if (!topbarEl) return;
    const logoSVG = "";
    topbarEl.innerHTML = `
    <div class="tb-tenant-wrap desktop-only">
      <div class="tb-tenant-trigger" id="tb-tenant-area">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--accent)">
          <i class="ph ph-buildings" style="font-size:0.875rem;color:var(--accent)"></i>
        </div>
        <div style="min-width:0;flex:1">
          <div class="tb-tenant-label">acme.com</div>
          <div style="font-size:0.625rem;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase">Workspace</div>
        </div>
        <i class="ph ph-caret-up-down" style="color:var(--muted);font-size:0.75rem;flex-shrink:0"></i>
      </div>
    </div>
    <a class="tb-logo" href="${base}index.html" title="Dashboard" style="text-decoration:none">${logoSVG}</a>
    <div class="tb-menu desktop-only" id="tb-menu"></div>
    <div class="tb-right desktop-only">
      <button class="tb-btn" id="tb-search-btn" title="Ara... (\u2318K)">
        <i class="ph ph-magnifying-glass" style="font-size:1.25rem"></i>
      </button>
      <button class="tb-btn" title="AI Chat" onclick="location.href='${base}pages/ai.html'" style="position:relative">
        <i class="ph ph-robot" style="font-size:1.25rem;color:var(--accent)"></i>
      </button>
      <button class="tb-btn" title="Bildirimler" onclick="toggleNotifPanel()" style="position:relative">
        <i class="ph ph-bell" style="font-size:1.25rem"></i>
        <span id="notif-badge" style="position:absolute;top:6px;right:6px;background:var(--accent);color:white;font-size:0.625rem;font-weight:700;min-width:16px;height:16px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 4px;"></span>
      </button>
    </div>
    <div id="menu-popup" class="menu-popup"></div>`;
  }

  // src/app/shell/helpers.ts
  function getBasePath() {
    const p = window.location.pathname;
    return p.includes("/pages/") ? "../" : "";
  }
  function getCurrentKey() {
    const p = window.location.pathname;
    if (p.endsWith("index.html") || p.endsWith("/") || p === "") return "dashboard";
    const m = p.match(/\/([^/]+)\.html$/);
    return m ? m[1] ?? "dashboard" : "dashboard";
  }
  function getCurrentFile() {
    return window.location.pathname.split("/").pop() ?? "";
  }
  function isInPages() {
    return window.location.pathname.includes("/pages/");
  }
  function showToast(msg, duration) {
    const dur = duration ?? 2500;
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.style.cssText = "padding:10px 20px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:10px;font-size:0.8125rem;font-weight:500;box-shadow:0 4px 24px rgba(0,0,0,0.25);pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity 0.2s,transform 0.2s;";
    toast.textContent = msg;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 200);
    }, dur);
  }
  function tmCloseAll() {
  }
  function buildTopMenu() {
  }

  // src/app/shell/sidebar.ts
  function findSectionInfo(key) {
    return MENU.flatMap((g) => g.items).find((i) => i.key === key);
  }
  function renderSidebar(base, key) {
    const sidebarEl = document.getElementById("sidebar-wide");
    if (!sidebarEl) return;
    sidebarEl.setAttribute("role", "navigation");
    sidebarEl.setAttribute("aria-label", "Alt navigasyon");
    const sidebarData = SIDEBAR_DATA[key] ?? [];
    const secInfo = findSectionInfo(key);
    const currentFile = getCurrentFile();
    const inPages = isInPages();
    let html = SIDEBAR_HIDDEN.includes(key) ? "" : `<div class="ws-header"><i class="ph ${secInfo ? secInfo.icon : "ph-squares-four"}" style="font-size:0.8125rem" aria-hidden="true"></i><span>${secInfo ? secInfo.title : "Dashboard"}</span></div>`;
    html += '<div style="flex:1;overflow-y:auto">';
    if (secInfo && !SIDEBAR_HIDDEN.includes(key)) {
      const dashHref = secInfo.href.replace("pages/", "");
      const resolvedDash = inPages ? dashHref : "pages/" + dashHref;
      const dashActive = currentFile === dashHref ? " active" : "";
      const dashAriaCurrent = dashActive ? ' aria-current="page"' : "";
      html += `<a class="ws-dash${dashActive}" href="${resolvedDash}"${dashAriaCurrent}><i class="ph ph-squares-four" aria-hidden="true"></i><span>Dashboard</span></a>`;
    }
    sidebarData.forEach((group) => {
      const groupHasActive = group.ch.some((ch) => {
        const h2 = ch.split("|")[2];
        return h2 !== void 0 && h2 !== "" && currentFile === h2;
      });
      const openClass = groupHasActive ? " open" : "";
      const expanded = groupHasActive ? "true" : "false";
      html += `<div class="ws-section"><button class="ws-l1${openClass}" aria-expanded="${expanded}" onclick="const o=this.classList.toggle('open');this.setAttribute('aria-expanded',o);this.nextElementSibling.classList.toggle('open')"><span>${group.l}</span><i class="ph ph-caret-right chevron" aria-hidden="true"></i></button><div class="ws-l1-body${openClass}" role="group" aria-label="${group.l}">`;
      group.ch.forEach((ch) => {
        const parts = ch.split("|");
        const label = parts[0];
        const badge = parts[1] ?? "";
        const href = parts[2] ?? "";
        const isActive = href !== "" && currentFile === href;
        const activeClass = isActive ? " active" : "";
        if (href) {
          const resolvedHref = resolveChildHref(href, inPages);
          const isFav = isFavorite(href);
          const starClass = isFav ? "ws-star active" : "ws-star";
          const ariaCurrent = isActive ? ' aria-current="page"' : "";
          html += `<a class="ws-l2${activeClass}" href="${resolvedHref}"${ariaCurrent}><span>${label}</span>` + (badge ? `<span class="ws-badge">${badge}</span>` : "") + `<button class="${starClass}" data-fav-href="${href}" data-fav-label="${label}" aria-label="${isFav ? "Favorilerden kaldir" : "Favorilere ekle"}: ${label}" aria-pressed="${isFav}" onclick="event.preventDefault();event.stopPropagation();toggleFav(this)"><i class="ph ph-star" aria-hidden="true"></i></button></a>`;
        } else {
          html += `<div class="ws-l2${activeClass}"><span>${label}</span>` + (badge ? `<span class="ws-badge">${badge}</span>` : "") + "</div>";
        }
      });
      html += "</div></div>";
    });
    html += "</div>";
    html += renderUserCard();
    sidebarEl.innerHTML = html;
    sidebarEl.querySelectorAll("a.ws-l2, a.ws-dash").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("wide-open");
      });
    });
    ensureToggleButton();
  }
  function resolveChildHref(href, inPages) {
    if (href === "index.html") {
      return inPages ? "../index.html" : "index.html";
    }
    return inPages ? href : "pages/" + href;
  }
  function renderUserCard() {
    return '<div class="sidebar-bottom"><div class="user-card"><div class="ud-trigger" id="user-trigger"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--accent)"><span style="font-size:0.7rem;font-weight:700;color:var(--accent)">IK</span></div><div style="min-width:0;flex:1"><div style="font-size:0.8125rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Ismail Karaca</div><div style="font-size:0.625rem;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase">Super Admin</div></div><i class="ph ph-caret-up" style="color:var(--muted);font-size:0.75rem;flex-shrink:0"></i></div></div></div>';
  }
  function ensureToggleButton() {
    if (document.getElementById("wide-toggle-tb")) return;
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "wide-toggle-tb";
    toggleBtn.title = "Sidebar toggle";
    toggleBtn.setAttribute("aria-label", "Alt navigasyonu ac/kapat");
    toggleBtn.setAttribute("aria-expanded", document.body.classList.contains("wide-open") ? "true" : "false");
    toggleBtn.innerHTML = '<span class="toggle-arrow"><i class="ph ph-caret-left" aria-hidden="true"></i></span>';
    document.body.appendChild(toggleBtn);
  }

  // src/app/shell/breadcrumb.ts
  function findSectionInfo2(key) {
    return MENU.flatMap((g) => g.items).find((i) => i.key === key);
  }
  function renderBreadcrumb(base, key) {
    const mainEl = document.getElementById("main");
    if (!mainEl) return;
    const secInfo = findSectionInfo2(key);
    const pageTitle = document.querySelector(".page-title");
    const titleText = pageTitle ? pageTitle.textContent ?? "" : secInfo ? secInfo.title : "Dashboard";
    const currentPageFile = getCurrentFile();
    const isFav = isFavorite(currentPageFile);
    const starIcon = isFav ? "ph-star-fill" : "ph-star";
    const starActiveClass = isFav ? " bc-star-active" : "";
    let crumbs = `<a href="${base}index.html" style="color:var(--muted);text-decoration:none;font-size:0.75rem">Dashboard</a>`;
    if (key !== "dashboard") {
      crumbs += `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i><a href="${base}${secInfo ? secInfo.href : "index.html"}" style="color:var(--muted);text-decoration:none;font-size:0.75rem">${secInfo ? secInfo.title : ""}</a>`;
    }
    const sectionTitle = secInfo ? secInfo.title : "Dashboard";
    if (titleText !== sectionTitle) {
      crumbs += `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i><span style="color:var(--text);font-size:0.75rem;font-weight:500">${titleText}</span>`;
    }
    const bcHTML = `<div class="bc-row"><nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav><button class="bc-star${starActiveClass}" id="bc-star-btn" title="${isFav ? "Kisayollardan kaldir" : "Kisayollara ekle"}" onclick="togglePageFav()"><i class="ph ${starIcon}"></i></button></div>`;
    mainEl.insertAdjacentHTML("afterbegin", bcHTML);
  }

  // src/app/shell/spotlight.ts
  function renderSpotlight(base) {
    const spotBd = document.getElementById("spotlight-backdrop");
    if (!spotBd) return;
    const quickItems = MENU.flatMap((g) => g.items).slice(0, 6).map(
      (i) => `<a class="sp-item" href="${base}${i.href}"><div class="sp-item-icon"><i class="ph ${i.icon}"></i></div><div><div class="sp-item-title">${i.title}</div></div></a>`
    ).join("");
    spotBd.innerHTML = `<div id="spotlight" role="dialog" aria-modal="true" aria-label="Spotlight arama"><div class="sp-input-wrap"><i class="ph ph-magnifying-glass" style="font-size:1.125rem;color:var(--muted)" aria-hidden="true"></i><input id="sp-input" class="sp-input" type="text" placeholder="Panelde ara..." autocomplete="off" role="combobox" aria-expanded="true" aria-controls="sp-results-list" aria-autocomplete="list"><span class="sp-kbd" id="sp-close" role="button" tabindex="0" aria-label="Kapat">ESC</span></div><div class="sp-results" id="sp-results-list" role="listbox"><div class="sp-section-label" id="sp-quick-label">Hizli Erisim</div>${quickItems}</div><div class="sp-footer" aria-hidden="true"><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">\u2191\u2193</span> gezin</span><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">\u21B5</span> ac</span><span style="display:flex;align-items:center;gap:4px"><span class="sp-key">ESC</span> kapat</span></div></div>`;
  }
  function initSpotlightNav(base) {
    const spotBd = document.getElementById("spotlight-backdrop");
    if (!spotBd) return;
    const spInput = document.getElementById("sp-input");
    if (!spInput) return;
    let spIdx = -1;
    const inPages = isInPages();
    const allSpItems = [];
    MENU.flatMap((g) => g.items).forEach((i) => {
      allSpItems.push({ title: i.title, icon: i.icon, href: base + i.href });
    });
    const menuItems = MENU.flatMap((g) => g.items);
    Object.keys(SIDEBAR_DATA).forEach((sk) => {
      const sec = menuItems.find((i) => i.key === sk);
      const sections = SIDEBAR_DATA[sk];
      if (!sections) return;
      sections.forEach((group) => {
        group.ch.forEach((ch) => {
          const p = ch.split("|");
          if (!p[2]) return;
          const href = p[2] === "index.html" ? inPages ? "../index.html" : "index.html" : inPages ? p[2] : "pages/" + p[2];
          allSpItems.push({
            title: p[0] ?? "",
            icon: sec ? sec.icon : "ph-file-text",
            href,
            parent: sec ? sec.title : ""
          });
        });
      });
    });
    function renderSpItems(items, label) {
      const resultsEl = spotBd.querySelector(".sp-results");
      if (!resultsEl) return;
      resultsEl.innerHTML = '<div class="sp-section-label">' + label + "</div>" + items.map(
        (i) => `<a class="sp-item" href="${i.href}"><div class="sp-item-icon"><i class="ph ${i.icon}"></i></div><div><div class="sp-item-title">${i.title}</div>` + (i.parent ? `<div style="font-size:0.625rem;color:var(--muted)">${i.parent}</div>` : "") + `</div></a>`
      ).join("");
    }
    function updateActive() {
      const items = spotBd.querySelectorAll(".sp-item");
      items.forEach((el, i) => el.classList.toggle("active", i === spIdx));
      const activeItem = items[spIdx];
      if (activeItem) activeItem.scrollIntoView({ block: "nearest" });
    }
    spInput.addEventListener("keydown", (e) => {
      const items = spotBd.querySelectorAll(".sp-item");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        spIdx = Math.min(spIdx + 1, items.length - 1);
        updateActive();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        spIdx = Math.max(spIdx - 1, -1);
        updateActive();
        return;
      }
      if (e.key === "Enter" && spIdx >= 0) {
        const target = items[spIdx];
        if (target) {
          e.preventDefault();
          target.click();
        }
      }
    });
    spInput.addEventListener("input", () => {
      spIdx = -1;
      const q = spInput.value.toLowerCase().trim();
      if (!q) {
        renderSpItems(allSpItems.slice(0, 6), "Hizli Erisim");
        return;
      }
      const filtered = allSpItems.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 8);
      if (filtered.length) {
        renderSpItems(filtered, filtered.length + " sonuc");
        return;
      }
      const resultsEl = spotBd.querySelector(".sp-results");
      if (resultsEl) {
        resultsEl.innerHTML = '<div class="sp-section-label" style="text-align:center;padding:24px 0;opacity:0.5">Sonuc bulunamadi</div>';
      }
    });
    spotBd.addEventListener("transitionend", () => {
      if (spotBd.classList.contains("open")) {
        spInput.value = "";
        spIdx = -1;
      }
    });
  }
  function bindSpotlightEvents() {
    const spotBd = document.getElementById("spotlight-backdrop");
    if (!spotBd) return;
    const tbSearch = document.getElementById("tb-search-btn");
    if (tbSearch) {
      tbSearch.onclick = () => {
        spotBd.classList.add("open");
        document.getElementById("sp-input")?.focus();
      };
    }
    const bnSearch = document.getElementById("bn-search-btn");
    if (bnSearch) {
      bnSearch.onclick = () => {
        spotBd.classList.add("open");
        document.getElementById("sp-input")?.focus();
      };
    }
    spotBd.onclick = (e) => {
      if (e.target === spotBd) spotBd.classList.remove("open");
    };
    const spClose = document.getElementById("sp-close");
    if (spClose) {
      spClose.onclick = () => spotBd.classList.remove("open");
    }
  }

  // src/core/event-bus.ts
  function createEventBus() {
    const listeners = {};
    return {
      on(event, cb) {
        (listeners[event] = listeners[event] || []).push(cb);
      },
      off(event, cb) {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((f) => f !== cb);
        }
      },
      emit(event, payload) {
        (listeners[event] || []).forEach((cb) => {
          try {
            cb(payload);
          } catch (e) {
            console.error(`EventBus[${event}]:`, e);
          }
        });
      }
    };
  }

  // src/domain/notification/NotificationStore.ts
  var NotificationStore = class {
    items;
    bus = createEventBus();
    static CATEGORIES = [
      { key: "tumu", label: "Tumu" },
      { key: "seo", label: "SEO" },
      { key: "icerik", label: "Icerik" },
      { key: "reklamlar", label: "Reklamlar" },
      { key: "sistem", label: "Sistem" },
      { key: "ai", label: "AI Raporlar" }
    ];
    constructor(initialItems) {
      this.items = [...initialItems];
    }
    /** Get items filtered by category. 'tumu' returns all. */
    getFiltered(cat) {
      return cat === "tumu" ? this.items : this.items.filter((n) => n.cat === cat);
    }
    /** Get unread count. */
    get unreadCount() {
      return this.items.filter((n) => !n.read).length;
    }
    /** Mark a single item as read. */
    markAsRead(id) {
      const item = this.items.find((n) => n.id === id);
      if (item) {
        item.read = true;
        this.bus.emit("change", {});
      }
    }
    /** Remove an item. */
    dismiss(id) {
      this.items = this.items.filter((n) => n.id !== id);
      this.bus.emit("change", {});
    }
    /** Mark all as read. */
    markAllAsRead() {
      this.items.forEach((n) => {
        n.read = true;
      });
      this.bus.emit("change", {});
    }
    on(event, cb) {
      this.bus.on(event, cb);
    }
    off(event, cb) {
      this.bus.off(event, cb);
    }
  };

  // src/app/shell/notification-panel.ts
  var NP_CATS = NotificationStore.CATEGORIES;
  var npStore = new NotificationStore([
    { id: 1, cat: "seo", icon: "ph-chart-line-up", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "Anahtar kelime 'flutter developer' 3. siraya yukseldi", d: "Google SERP pozisyon takibi guncel sonuclari.", time: "5 dk once", read: false },
    { id: 2, cat: "seo", icon: "ph-link-simple", ic: "#3b82f6", ib: "rgba(59,130,246,0.1)", t: "Backlink profili %12 buyudu", d: "Son 7 gunde 34 yeni kaliteli backlink kazanildi.", time: "23 dk once", read: false },
    { id: 3, cat: "seo", icon: "ph-bug", ic: "#a855f7", ib: "rgba(168,85,247,0.1)", t: "Teknik SEO skoru 92'ye cikti", d: "Site denetimi tamamlandi. 3 uyari giderildi.", time: "1 saat once", read: false },
    { id: 4, cat: "seo", icon: "ph-globe-hemisphere-west", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "GEO: AI gorunurluk %78'e ulasti", d: "ChatGPT ve Perplexity'de brand mention artti.", time: "2 saat once", read: true },
    { id: 5, cat: "seo", icon: "ph-ranking", ic: "#eab308", ib: "rgba(234,179,8,0.1)", t: "5 anahtar kelime ilk sayfadan dustu", d: "Haftalik rank takibi uyarisi.", time: "4 saat once", read: true },
    { id: 6, cat: "icerik", icon: "ph-article", ic: "#3b82f6", ib: "rgba(59,130,246,0.1)", t: "Blog yazisi 'AI Trendleri 2026' 2.4K goruntulenme aldi", d: "Gecen haftaya gore %340 artis.", time: "12 dk once", read: false },
    { id: 7, cat: "icerik", icon: "ph-file-text", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "Icerik skoru %85 uzerinde 3 yeni sayfa", d: "Content decay analizi tamamlandi.", time: "45 dk once", read: false },
    { id: 8, cat: "icerik", icon: "ph-pencil-simple", ic: "#eab308", ib: "rgba(234,179,8,0.1)", t: "Icerik takvimi: 2 yazi son tarihi yaklasti", d: "Bu haftaki planlanan icerikler icin hatirlatma.", time: "3 saat once", read: true },
    { id: 9, cat: "icerik", icon: "ph-tree-structure", ic: "#a855f7", ib: "rgba(168,85,247,0.1)", t: "Semantik harita: 5 orphan sayfa tespit edildi", d: "Bu sayfalar hicbir internal linkle baglanmiyor.", time: "5 saat once", read: true },
    { id: 10, cat: "reklamlar", icon: "ph-megaphone", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "Meta kampanya ROAS 4.2x'e ulasti", d: "Bahar kampanyasi hedef ROAS'i %40 asti.", time: "8 dk once", read: false },
    { id: 11, cat: "reklamlar", icon: "ph-warning", ic: "#eab308", ib: "rgba(234,179,8,0.1)", t: "Google Ads butcesi %90 harcandi", d: "Gunluk butce limiti 2 saat icinde dolacak.", time: "30 dk once", read: false },
    { id: 12, cat: "reklamlar", icon: "ph-tiktok-logo", ic: "#3b82f6", ib: "rgba(59,130,246,0.1)", t: "TikTok Ads: Yeni hedef kitle onerisi", d: "AI analizi yeni bir lookalike segment onerdi.", time: "1 saat once", read: false },
    { id: 13, cat: "reklamlar", icon: "ph-chart-bar", ic: "#a855f7", ib: "rgba(168,85,247,0.1)", t: "Cross-channel attribution raporu hazir", d: "Son 30 gunluk performans ozeti.", time: "6 saat once", read: true },
    { id: 14, cat: "sistem", icon: "ph-database", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "PostgreSQL replikasyon gecikmesi <50ms", d: "Veritabani sagligi normal seviyelerde.", time: "15 dk once", read: true },
    { id: 15, cat: "sistem", icon: "ph-shield-warning", ic: "#ef4444", ib: "rgba(239,68,68,0.1)", t: "SSL sertifikasi 14 gun icinde dolacak", d: "acme.com icin Let's Encrypt yenileme gerekli.", time: "1 saat once", read: false },
    { id: 16, cat: "sistem", icon: "ph-plugs-connected", ic: "#eab308", ib: "rgba(234,179,8,0.1)", t: "Drupal adaptoru: baglanti yeniden kuruldu", d: "3 basarisiz health check sonrasi otomatik yeniden baglandi.", time: "2 saat once", read: false },
    { id: 17, cat: "sistem", icon: "ph-arrow-clockwise", ic: "#3b82f6", ib: "rgba(59,130,246,0.1)", t: "Otomatik yedekleme tamamlandi", d: "Gunluk PostgreSQL snapshot alindi. Boyut: 2.4 GB.", time: "4 saat once", read: true },
    { id: 18, cat: "ai", icon: "ph-robot", ic: "#a855f7", ib: "rgba(168,85,247,0.1)", t: "Haftalik SEO ozeti hazirlandi", d: "AI tarafindan olusturulan 7 gunluk performans raporu.", time: "10 dk once", read: false },
    { id: 19, cat: "ai", icon: "ph-flag", ic: "#ef4444", ib: "rgba(239,68,68,0.1)", t: "Rakip analiz raporu guncellendi", d: "3 rakibin SERP pozisyonlari ve icerik stratejisi analizi.", time: "25 dk once", read: false },
    { id: 20, cat: "ai", icon: "ph-trend-down", ic: "#ef4444", ib: "rgba(239,68,68,0.1)", t: "Anomali: organik trafikte %18 dusus", d: "Son 72 saatlik trafik verisi normal bandinin altinda.", time: "40 dk once", read: false },
    { id: 21, cat: "ai", icon: "ph-lightning", ic: "#eab308", ib: "rgba(234,179,8,0.1)", t: "AI Digest: Haftalik insight ozeti", d: "12 insight, 3 oncelikli aksiyon onerisi iceriyor.", time: "2 saat once", read: true },
    { id: 22, cat: "ai", icon: "ph-brain", ic: "#22c55e", ib: "rgba(34,197,94,0.1)", t: "Brand Radar: 8 yeni bahsetme tespit edildi", d: "Reddit, Twitter ve blog platformlarinda marka bahsetmeleri.", time: "3 saat once", read: true }
  ]);
  function renderNpList(activeTab) {
    const listEl = document.getElementById("np-list");
    if (!listEl) return;
    const items = npStore.getFiltered(activeTab);
    if (!items.length) {
      listEl.innerHTML = '<div class="np-empty"><i class="ph ph-bell-slash"></i><span>Bu kategoride bildirim yok</span></div>';
      return;
    }
    listEl.innerHTML = items.map(
      (n) => '<div class="np-item' + (n.read ? " np-item--read" : "") + '"><div class="np-icon" style="background:' + n.ib + '"><i class="ph ' + n.icon + '" style="color:' + n.ic + '"></i></div><div class="np-body"><div class="np-item-title">' + n.t + '</div><div class="np-item-desc">' + n.d + '</div><div class="np-meta">' + n.time + '</div></div><div class="np-actions">' + (!n.read ? '<button title="Okundu" data-np-read="' + n.id + '"><i class="ph ph-check"></i></button>' : "") + '<button title="Kaldir" data-np-dismiss="' + n.id + '"><i class="ph ph-x"></i></button></div></div>'
    ).join("");
  }
  function syncBadges() {
    const unread = npStore.unreadCount;
    const el = document.getElementById("np-count");
    if (el) el.textContent = String(unread);
    const tb = document.getElementById("notif-badge");
    if (tb) {
      tb.textContent = unread > 0 ? unread > 99 ? "99+" : String(unread) : "";
      tb.style.display = unread > 0 ? "flex" : "none";
    }
    const bn = document.getElementById("bn-notif-badge");
    if (bn) {
      bn.textContent = unread > 0 ? String(unread) : "";
      bn.style.display = unread > 0 ? "flex" : "none";
    }
  }
  function initNotificationPanel(base) {
    let activeTab = "tumu";
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="np-backdrop"></div><div id="np-panel" role="dialog" aria-modal="true" aria-label="Bildirimler"><div class="np-header"><span class="np-title" id="np-title">Bildirimler</span><span class="np-badge" id="np-count" aria-live="polite">0</span><button class="np-close" id="np-close-btn" title="Kapat" aria-label="Bildirimleri kapat"><i class="ph ph-x" aria-hidden="true"></i></button></div><div class="np-tabs" id="np-tabs" role="tablist" aria-label="Bildirim kategorileri"></div><div class="np-list" id="np-list" role="log" aria-live="polite" aria-label="Bildirim listesi"></div><div class="np-footer"><button class="np-footer-btn" id="np-mark-all">Tumunu okundu isaretle</button><a class="np-footer-link" id="np-view-all" href="' + base + 'pages/notifications.html">Tumunu Gor <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div></div>'
    );
    const tabsEl = document.getElementById("np-tabs");
    if (tabsEl) {
      NP_CATS.forEach((c) => {
        const btn = document.createElement("button");
        btn.className = "np-tab" + (c.key === activeTab ? " active" : "");
        btn.textContent = c.label;
        btn.dataset.cat = c.key;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", c.key === activeTab ? "true" : "false");
        btn.onclick = () => {
          activeTab = c.key;
          tabsEl.querySelectorAll(".np-tab").forEach((t) => {
            const isActive = t.dataset.cat === activeTab;
            t.classList.toggle("active", isActive);
            t.setAttribute("aria-selected", isActive ? "true" : "false");
          });
          renderNpList(activeTab);
        };
        tabsEl.appendChild(btn);
      });
    }
    const listEl = document.getElementById("np-list");
    if (listEl) {
      listEl.addEventListener("click", (e) => {
        const target = e.target;
        const readBtn = target.closest("[data-np-read]");
        const dismissBtn = target.closest("[data-np-dismiss]");
        if (readBtn) {
          npStore.markAsRead(parseInt(readBtn.dataset.npRead ?? "", 10));
          renderNpList(activeTab);
          syncBadges();
        }
        if (dismissBtn) {
          npStore.dismiss(parseInt(dismissBtn.dataset.npDismiss ?? "", 10));
          renderNpList(activeTab);
          syncBadges();
        }
      });
    }
    const backdrop = document.getElementById("np-backdrop");
    if (backdrop) backdrop.onclick = () => {
      toggleNotifPanel();
    };
    const closeBtn = document.getElementById("np-close-btn");
    if (closeBtn) closeBtn.onclick = () => {
      toggleNotifPanel();
    };
    const markAll = document.getElementById("np-mark-all");
    if (markAll) {
      markAll.onclick = () => {
        npStore.markAllAsRead();
        renderNpList(activeTab);
        syncBadges();
        if (window.Alpine && Alpine.store("toast")) {
          Alpine.store("toast").show("Tum bildirimler okundu", "success", 2500);
        }
      };
    }
    syncBadges();
    renderNpList(activeTab);
  }
  function toggleNotifPanel() {
    const p = document.getElementById("np-panel");
    const b = document.getElementById("np-backdrop");
    if (!p || !b) return;
    const isOpen = p.classList.toggle("open");
    b.classList.toggle("open", isOpen);
  }

  // src/app/shell/tenant-switcher.ts
  var WORKSPACES = ["acme.com", "shop.beta.com", "gamma.io"];
  var currentWorkspace = WORKSPACES[0];
  function initTenantSwitcher() {
    const tenantArea = document.getElementById("tb-tenant-area");
    if (!tenantArea) return;
    const tenantLabel = tenantArea.querySelector(".tb-tenant-label");
    if (!document.getElementById("tenant-backdrop")) {
      document.body.insertAdjacentHTML("beforeend", '<div id="tenant-backdrop"></div>');
    }
    const tenantBdEl = document.getElementById("tenant-backdrop");
    if (!tenantBdEl) return;
    const tenantBd = tenantBdEl;
    function buildTenantDropdown() {
      let html = '<div class="tenant-dropdown">';
      WORKSPACES.forEach((ws) => {
        const isCurrent = ws === currentWorkspace;
        html += `<div class="td-item${isCurrent ? " td-item-active" : ""}" data-ws="${ws}"><div class="td-icon${isCurrent ? " td-icon-active" : ""}"><i class="ph ph-globe"></i></div><span>${ws}</span></div>`;
      });
      html += "</div>";
      tenantBd.innerHTML = html;
      tenantBd.querySelectorAll(".td-item").forEach((item) => {
        item.onclick = (e) => {
          e.stopPropagation();
          currentWorkspace = item.dataset.ws ?? "";
          if (tenantLabel) tenantLabel.textContent = item.dataset.ws ?? "";
          tenantBd.classList.remove("show");
          showToast("Workspace degistirildi: " + (item.dataset.ws ?? ""));
        };
      });
    }
    tenantArea.onclick = () => {
      buildTenantDropdown();
      tenantBd.classList.toggle("show");
    };
    tenantBd.onclick = (e) => {
      if (e.target === tenantBd) tenantBd.classList.remove("show");
    };
  }
  function initMobileTenantSwitcher() {
    const bnTenantBtn = document.getElementById("bn-tenant-btn");
    if (!bnTenantBtn) return;
    const tenantLabel = document.querySelector(".tb-tenant-label");
    bnTenantBtn.onclick = () => {
      let modal = document.getElementById("tenant-modal");
      if (modal) return;
      modal = document.createElement("div");
      modal.id = "tenant-modal";
      let boxHTML = '<div class="tenant-dropdown"><div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;padding:12px 16px 8px">Workspace Sec</div>';
      WORKSPACES.forEach((ws) => {
        const isCur = ws === currentWorkspace;
        boxHTML += '<div class="td-item' + (isCur ? " td-item-active" : "") + '" data-ws="' + ws + '"><div class="td-icon' + (isCur ? " td-icon-active" : "") + '"><i class="ph ph-globe"></i></div><span>' + ws + "</span></div>";
      });
      boxHTML += "</div>";
      modal.innerHTML = boxHTML;
      modal.querySelectorAll(".td-item").forEach((item) => {
        item.onclick = () => {
          currentWorkspace = item.dataset.ws ?? "";
          if (tenantLabel) tenantLabel.textContent = item.dataset.ws ?? "";
          modal?.remove();
          showToast("Workspace: " + (item.dataset.ws ?? ""));
        };
      });
      modal.onclick = (e) => {
        if (e.target === modal) modal?.remove();
      };
      document.body.appendChild(modal);
    };
  }

  // src/app/shell/user-dropdown.ts
  function renderUserDropdown(base) {
    const udBd = document.getElementById("ud-backdrop");
    if (!udBd) return;
    udBd.innerHTML = `<div id="user-dropdown"><a class="ud-item" href="${base}pages/settings-profile.html"><i class="ph ph-user-circle"></i>Profil</a><a class="ud-item" href="${base}pages/settings.html"><i class="ph ph-gear"></i>Ayarlar</a><div class="ud-divider"></div><button class="ud-item" style="color:var(--accent);font-weight:600"><i class="ph ph-sign-out" style="color:var(--accent)"></i>Cikis Yap</button></div>`;
  }
  function bindUserDropdownEvents() {
    const udBd = document.getElementById("ud-backdrop");
    if (!udBd) return;
    const trigger = document.getElementById("user-trigger");
    if (trigger) {
      trigger.onclick = () => udBd.classList.toggle("show");
    }
    udBd.onclick = (e) => {
      if (e.target === udBd) udBd.classList.remove("show");
    };
  }

  // src/app/shell/logo-animation.ts
  var LETTER_PATHS = "M 20.3 62.1 L 44.73 62.1 L 50.4 76.5 L 67.2 76.5 L 34 0 L 33.2 0 L 0 76.5 L 14.3 76.5 Z M 32.85 31.96 L 39.92 49.9 L 25.38 49.9 Z M 342.3 62.1 L 366.73 62.1 L 372.4 76.5 L 389.2 76.5 L 356 0 L 355.2 0 L 322 76.5 L 336.3 76.5 Z M 354.85 31.96 L 361.92 49.9 L 347.38 49.9 Z M 79.7 32.6 L 79.7 13.6 L 93.7 13.6 L 93.7 32.6 L 104.3 32.6 L 104.3 43.5 L 93.7 43.5 L 93.7 76.5 L 79.7 76.5 L 79.7 43.5 L 72.9 43.5 L 72.9 32.6 Z M 292.7 32.6 L 292.7 13.6 L 306.7 13.6 L 306.7 32.6 L 317.3 32.6 L 317.3 43.5 L 306.7 43.5 L 306.7 76.5 L 292.7 76.5 L 292.7 43.5 L 285.9 43.5 L 285.9 32.6 Z M 111.6 54.1 Q 111.6 47.4 114.75 42.1 Q 117.9 36.8 123.6 33.75 Q 129.3 30.7 136.7 30.7 Q 144.2 30.7 149.7 33.75 Q 155.2 36.8 158.15 42.1 Q 161.1 47.4 161.1 54.1 Q 161.1 60.8 158.15 66.15 Q 155.2 71.5 149.7 74.6 Q 144.2 77.7 136.5 77.7 Q 129.3 77.7 123.65 74.9 Q 118 72.1 114.8 66.8 Q 111.6 61.5 111.6 54.1 Z M 125.7 54.2 Q 125.7 50.7 127.1 48 Q 128.5 45.3 130.9 43.7 Q 133.3 42.1 136.3 42.1 Q 139.6 42.1 142 43.7 Q 144.4 45.3 145.7 48 Q 147 50.7 147 54.2 Q 147 57.6 145.7 60.35 Q 144.4 63.1 142 64.7 Q 139.6 66.3 136.3 66.3 Q 133.3 66.3 130.9 64.7 Q 128.5 63.1 127.1 60.35 Q 125.7 57.6 125.7 54.2 Z M 172.1 32.8 L 184.8 32.8 L 185.9 40.6 L 185.7 39.9 Q 188 35.8 192.2 33.25 Q 196.4 30.7 202.5 30.7 Q 208.7 30.7 212.85 34.35 Q 217 38 217.1 43.8 L 217.1 76.5 L 203.1 76.5 L 203.1 49 Q 203 46.1 201.55 44.35 Q 200.1 42.6 196.7 42.6 Q 193.5 42.6 191.1 44.7 Q 188.7 46.8 187.4 50.4 Q 186.1 54 186.1 58.7 L 186.1 76.5 L 172.1 76.5 Z M 228.1 54.1 Q 228.1 47.4 231.25 42.1 Q 234.4 36.8 240.1 33.75 Q 245.8 30.7 253.2 30.7 Q 260.7 30.7 266.2 33.75 Q 271.7 36.8 274.65 42.1 Q 277.6 47.4 277.6 54.1 Q 277.6 60.8 274.65 66.15 Q 271.7 71.5 266.2 74.6 Q 260.7 77.7 253 77.7 Q 245.8 77.7 240.15 74.9 Q 234.5 72.1 231.3 66.8 Q 228.1 61.5 228.1 54.1 Z M 242.2 54.2 Q 242.2 50.7 243.6 48 Q 245 45.3 247.4 43.7 Q 249.8 42.1 252.8 42.1 Q 256.1 42.1 258.5 43.7 Q 260.9 45.3 262.2 48 Q 263.5 50.7 263.5 54.2 Q 263.5 57.6 262.2 60.35 Q 260.9 63.1 258.5 64.7 Q 256.1 66.3 252.8 66.3 Q 249.8 66.3 247.4 64.7 Q 245 63.1 243.6 60.35 Q 242.2 57.6 242.2 54.2 Z";
  var P = 12;
  var LW = 389.2;
  var LH = 77.701;
  var W = LW + P * 2;
  var H = LH + P * 2;
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }
  function initLogoAnimation() {
    if (typeof gsap === "undefined") return;
    const logoContainer = document.querySelector(".tb-logo");
    if (!logoContainer) return;
    const y1 = P;
    const y2 = P + LH;
    const mx = W / 2;
    const s = 0.6;
    const isDark = document.documentElement.classList.contains("dark");
    const DC = isDark ? ["#C94B1A", "#00FFFF", "#FFF030", "#FF00FF", "#E02020", "#00BB00", "#1040FF", "#9500FF"] : ["#C94B1A", "#00CCCC", "#D4C000", "#CC00CC", "#CC1010", "#009900", "#0033CC", "#8800EE"];
    const UC = isDark ? "#ffffff" : "#000000";
    const oldSvg = logoContainer.querySelector("svg");
    if (oldSvg) oldSvg.remove();
    const svg = svgEl("svg", {
      viewBox: `0 0 ${W} ${H}`,
      xmlns: NS,
      overflow: "visible",
      style: "height:44px;width:auto"
    });
    const defs = svgEl("defs", {});
    const rt = svgEl("rect", { id: "logo-rt", x: "0", y: "0", width: String(W), height: String(y1) });
    const rb = svgEl("rect", { id: "logo-rb", x: "0", y: String(y1), width: String(W), height: String(H - y1) });
    const clipTop = svgEl("clipPath", { id: "logo-ct" });
    clipTop.appendChild(rt);
    const clipBot = svgEl("clipPath", { id: "logo-cb" });
    clipBot.appendChild(rb);
    defs.appendChild(clipTop);
    defs.appendChild(clipBot);
    svg.appendChild(defs);
    const sw = "0.25mm";
    const ga = svgEl("g", {
      id: "logo-ga",
      "clip-path": "url(#logo-ct)",
      "stroke-linecap": "round",
      "fill-rule": "evenodd",
      stroke: "#C94B1A",
      "stroke-width": sw,
      fill: "none",
      transform: `translate(${P},${P})`
    });
    ga.appendChild(svgEl("path", { "vector-effect": "non-scaling-stroke", d: LETTER_PATHS }));
    const gb = svgEl("g", {
      id: "logo-gb",
      "clip-path": "url(#logo-cb)",
      "stroke-linecap": "round",
      "fill-rule": "evenodd",
      stroke: UC,
      "stroke-width": sw,
      fill: "none",
      transform: `translate(${P},${P})`
    });
    gb.appendChild(svgEl("path", { "vector-effect": "non-scaling-stroke", d: LETTER_PATHS }));
    const sl = svgEl("line", {
      id: "logo-sl",
      x1: "0",
      x2: String(W),
      y1: String(y1),
      y2: String(y1),
      stroke: "#C94B1A",
      "stroke-width": "1.5"
    });
    const ol = svgEl("path", {
      id: "logo-ol",
      d: `M${mx},${s} L${s},${s} L${s},${H - s} L${mx},${H - s}`,
      fill: "none",
      stroke: "#C94B1A",
      "stroke-width": "1.2",
      "stroke-linejoin": "miter",
      "stroke-linecap": "square"
    });
    const orr = svgEl("path", {
      id: "logo-or",
      d: `M${mx},${s} L${W - s},${s} L${W - s},${H - s} L${mx},${H - s}`,
      fill: "none",
      stroke: "#C94B1A",
      "stroke-width": "1.2",
      "stroke-linejoin": "miter",
      "stroke-linecap": "square"
    });
    svg.appendChild(ga);
    svg.appendChild(gb);
    svg.appendChild(sl);
    svg.appendChild(ol);
    svg.appendChild(orr);
    logoContainer.appendChild(svg);
    const lL = ol.getTotalLength();
    gsap.set([ol, orr], { strokeDasharray: lL, strokeDashoffset: lL });
    gsap.to([ol, orr], {
      strokeDashoffset: 0,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
    const st = { y: y1 };
    let ci = 0;
    function upd() {
      const cy = Math.max(y1, Math.min(y2, st.y));
      rt.setAttribute("height", String(cy));
      rb.setAttribute("y", String(cy));
      rb.setAttribute("height", String(H - cy));
      sl.setAttribute("y1", String(cy));
      sl.setAttribute("y2", String(cy));
    }
    function sweepDown() {
      const c = DC[ci % DC.length] ?? "#C94B1A";
      ga.setAttribute("stroke", c);
      sl.setAttribute("stroke", c);
      ol.setAttribute("stroke", c);
      orr.setAttribute("stroke", c);
      gsap.to(st, { y: y2, duration: 5, ease: "power1.inOut", onUpdate: upd, onComplete: sweepUp });
    }
    function sweepUp() {
      ci++;
      gb.setAttribute("stroke", UC);
      sl.setAttribute("stroke", UC);
      gsap.to(st, { y: y1, duration: 5, ease: "power1.inOut", onUpdate: upd, onComplete: sweepDown });
    }
    sweepDown();
  }
  function loadAndInitLogo() {
    if (!document.querySelector('script[src*="gsap"]')) {
      const gsapScript = document.createElement("script");
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      gsapScript.onload = () => initLogoAnimation();
      document.head.appendChild(gsapScript);
      return;
    }
    initLogoAnimation();
  }

  // src/app/shell/mobile-menu.ts
  function renderBottomNav(base, key) {
    if (document.getElementById("bottom-nav")) return;
    const bnav = document.createElement("nav");
    bnav.id = "bottom-nav";
    bnav.innerHTML = `<div class="bn-item" id="bn-search-btn"><i class="ph ph-magnifying-glass"></i><span>Ara</span></div><div class="bn-item" id="bn-tenant-btn"><i class="ph ph-buildings"></i><span>Tenant</span></div><a class="bn-item bn-center${key === "ai" ? " bn-active" : ""}" href="${base}pages/ai.html"><i class="ph ph-robot"></i><span>AI</span></a><div class="bn-item bn-notif" onclick="toggleNotifPanel()"><i class="ph ph-bell"></i><span class="bn-badge" id="bn-notif-badge"></span><span>Bildirim</span></div><button class="bn-item bn-menu-btn" id="bn-menu-popup-btn" aria-expanded="false" aria-label="Menuyu ac"><span class="grid" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span><span>Menu</span></button>`;
    document.body.appendChild(bnav);
  }
  function initMobileMenu(base, key) {
    const menuPopupBtn = document.getElementById("bn-menu-popup-btn");
    const menuPopup = document.getElementById("menu-popup");
    if (!menuPopupBtn || !menuPopup) return;
    const currentFile = getCurrentFile();
    const inPages = isInPages();
    let popupHTML = '<button class="mp-close" aria-label="Menuyu kapat"><i class="ph ph-x"></i></button>';
    popupHTML += '<div class="menu-popup-inner">';
    MENU.forEach((group) => {
      popupHTML += `<div class="mp-section"><div class="mp-head">${group.group}</div>`;
      group.items.forEach((item) => {
        const sd = SIDEBAR_DATA[item.key];
        const isActiveSection = item.key === key;
        if (sd && sd.length) {
          popupHTML += `<div class="mp-accordion${isActiveSection ? " mp-acc-open" : ""}">`;
          popupHTML += `<div class="mp-acc-trigger" onclick="this.parentElement.classList.toggle('mp-acc-open')"><i class="ph ${item.icon}"></i><span>${item.title}</span><i class="ph ph-caret-down mp-acc-chevron"></i></div>`;
          popupHTML += '<div class="mp-acc-body">';
          sd.forEach((g) => {
            g.ch.forEach((ch) => {
              const p = ch.split("|");
              const lbl = p[0];
              const bdg = p[1] ?? "";
              const hr = p[2] ?? "";
              if (!hr) return;
              const rHref = hr === "index.html" ? inPages ? "../index.html" : "index.html" : inPages ? hr : "pages/" + hr;
              const act = currentFile === hr ? " mp-sub-active" : "";
              popupHTML += `<a class="mp-sub${act}" href="${rHref}">${lbl}` + (bdg ? `<span class="mp-sub-badge">${bdg}</span>` : "") + `</a>`;
            });
          });
          popupHTML += "</div></div>";
        } else {
          popupHTML += `<a class="mp-link" href="${base}${item.href}"><i class="ph ${item.icon}"></i>${item.title}</a>`;
        }
      });
      popupHTML += "</div>";
    });
    popupHTML += `<div class="mp-section"><div class="mp-head">SISTEM</div><a class="mp-link" href="${base}pages/settings.html"><i class="ph ph-gear"></i>Ayarlar</a></div>`;
    popupHTML += "</div>";
    menuPopup.innerHTML = popupHTML;
    const closeBtn = menuPopup.querySelector(".mp-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        menuPopup.classList.remove("open");
        menuPopupBtn.setAttribute("aria-expanded", "false");
        menuPopupBtn.setAttribute("aria-label", "Menuyu ac");
      });
    }
    menuPopupBtn.onclick = () => {
      const isOpen = menuPopup.classList.toggle("open");
      menuPopupBtn.setAttribute("aria-expanded", String(isOpen));
      menuPopupBtn.setAttribute("aria-label", isOpen ? "Menuyu kapat" : "Menuyu ac");
    };
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!menuPopup.contains(target) && target !== menuPopupBtn && !menuPopupBtn.contains(target)) {
        menuPopup.classList.remove("open");
        menuPopupBtn.setAttribute("aria-expanded", "false");
        menuPopupBtn.setAttribute("aria-label", "Menuyu ac");
      }
    });
  }

  // src/app/shell/rail.ts
  function railClick(btn, _activeKey) {
    const clickedKey = btn.dataset.key ?? "";
    const base = window.__SHELL_BASE ?? "";
    const currentSidebarKey = window.__SIDEBAR_KEY ?? "";
    const sidebarOpen = document.body.classList.contains("wide-open");
    if (clickedKey === currentSidebarKey && sidebarOpen) {
      document.body.classList.remove("wide-open");
      return;
    }
    renderSidebar(base, clickedKey);
    window.__SIDEBAR_KEY = clickedKey;
    document.body.classList.add("wide-open");
    document.querySelectorAll(".ni").forEach((ni) => ni.classList.remove("active"));
    btn.classList.add("active");
  }

  // src/ui/base/Component.ts
  var Component = class {
    constructor(containerId, bus) {
      this.containerId = containerId;
      this.bus = bus;
    }
    el = null;
    boundListeners = [];
    busListeners = [];
    /** Render into container element. */
    render() {
      this.el = document.getElementById(this.containerId);
      if (!this.el) return;
      this.el.innerHTML = this.buildHTML();
      this.onRendered();
    }
    /** Called after render — subclasses bind events here. */
    onRendered() {
    }
    /** Safely add a DOM event listener (auto-cleaned on destroy). */
    listen(target, event, handler) {
      target.addEventListener(event, handler);
      this.boundListeners.push({ target, event, handler });
    }
    /** Safely subscribe to event bus (auto-cleaned on destroy). */
    on(event, cb) {
      this.bus.on(event, cb);
      this.busListeners.push({ event, cb });
    }
    /** Query within this component's container. */
    query(selector) {
      return this.el?.querySelector(selector) ?? null;
    }
    /** Query all within this component's container. */
    queryAll(selector) {
      return this.el ? Array.from(this.el.querySelectorAll(selector)) : [];
    }
    /** Set ARIA attribute on the container element. */
    setAria(attr, value) {
      this.el?.setAttribute(attr, value);
    }
    /** Cleanup — remove all listeners, nullify references. */
    destroy() {
      for (const { target, event, handler } of this.boundListeners) {
        target.removeEventListener(event, handler);
      }
      this.boundListeners = [];
      for (const { event, cb } of this.busListeners) {
        this.bus.off(event, cb);
      }
      this.busListeners = [];
      this.el = null;
    }
  };

  // src/ui/base/DOMHelper.ts
  var ENTITY_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  function esc(str) {
    return str.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] ?? ch);
  }
  var VOID = /* @__PURE__ */ new Set(["br", "hr", "img", "input", "meta", "link"]);
  function h(tag, attrs, ...children) {
    let a = "";
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === false || v === void 0 || v === null) continue;
        a += v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`;
      }
    }
    if (VOID.has(tag)) return `<${tag}${a}>`;
    return `<${tag}${a}>${children.join("")}</${tag}>`;
  }
  function icon(name, style) {
    return h("i", { class: `ph ${name}`, "aria-hidden": "true", style });
  }
  function separator() {
    return h("div", { role: "separator", class: "ni-div" });
  }

  // src/shell/components/RailComponent.ts
  var RailComponent = class extends Component {
    constructor(containerId, bus, menu, base) {
      super(containerId, bus);
      this.menu = menu;
      this.base = base;
    }
    activeKey = "";
    setActiveKey(key) {
      this.activeKey = key;
    }
    buildHTML() {
      let html = "";
      this.menu.forEach((group, gi) => {
        if (gi > 0) html += separator();
        group.items.forEach((item) => {
          const active = item.key === this.activeKey ? " active" : "";
          const ariaCurrent = item.key === this.activeKey ? "section" : void 0;
          html += h(
            "button",
            {
              class: `ni${active}`,
              "data-key": item.key,
              "data-href": `${this.base}${item.href}`,
              "aria-label": item.title,
              "aria-current": ariaCurrent
            },
            icon(item.icon),
            h("span", { class: "ni-label" }, item.title)
          );
        });
      });
      return html;
    }
    onRendered() {
      this.setAria("role", "navigation");
      this.setAria("aria-label", "Ana navigasyon");
      this.queryAll(".ni").forEach((btn) => {
        this.listen(btn, "click", () => this.handleClick(btn));
      });
    }
    handleClick(btn) {
      const clickedKey = btn.dataset["key"] ?? "";
      this.bus.emit("rail:click", { key: clickedKey, base: this.base });
      this.queryAll(".ni").forEach((ni) => ni.classList.remove("active"));
      btn.classList.add("active");
    }
  };

  // src/shell/components/FooterComponent.ts
  var FooterComponent = class extends Component {
    buildHTML() {
      return '<span class="fb-dot"></span><span>Sistem aktif</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">12</strong> tenant</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">47</strong> workspace</span><span class="fb-sep"></span><span><strong style="color:var(--text);font-weight:700">5</strong> adaptor</span><span style="margin-left:auto;font-size:0.625rem;letter-spacing:0.05em">v0.1.0</span>';
    }
    onRendered() {
      this.setAria("role", "contentinfo");
      this.setAria("aria-label", "Sistem durumu");
    }
  };

  // src/shell/components/KeyboardShortcutManager.ts
  var KeyboardShortcutManager = class {
    constructor(bus) {
      this.bus = bus;
    }
    handlers = [];
    keydownHandler = null;
    /** Register a keyboard shortcut. */
    register(combo, handler) {
      this.handlers.push({ combo, handler });
    }
    /** Start listening for keyboard events. */
    init() {
      this.keydownHandler = (e) => {
        const mod = e.metaKey || e.ctrlKey;
        const activeTag = document.activeElement?.tagName ?? "";
        const inInput = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
        for (const { combo, handler } of this.handlers) {
          if (combo.mod && !mod) continue;
          if (!combo.mod && mod && combo.key !== "Escape") continue;
          if (combo.notInInput && inInput) continue;
          if (e.key === combo.key || e.key.toLowerCase() === combo.key.toLowerCase()) {
            e.preventDefault();
            handler(e);
            return;
          }
        }
      };
      window.addEventListener("keydown", this.keydownHandler);
    }
    /** Show shortcuts help modal. */
    showHelp() {
      if (document.getElementById("shortcuts-help-modal")) return;
      const mac = /mac/i.test(navigator.platform);
      const modLabel = mac ? "\u2318" : "Ctrl+";
      const shortcuts = [
        [modLabel + "K", "Spotlight Arama"],
        [modLabel + "N", "Yeni Olustur"],
        ["?", "Kisayol Yardimi"],
        ["ESC", "Kapat"]
      ];
      const rows = shortcuts.map(
        ([k, v]) => h(
          "div",
          { style: "display:flex;align-items:center;justify-content:space-between", role: "listitem" },
          h("span", { style: "font-size:0.8125rem;color:var(--text)" }, v),
          h("kbd", { style: "font-size:0.75rem;font-weight:600;color:var(--muted);background:var(--surface-2);border:1px solid var(--border);padding:3px 10px;border-radius:6px;font-family:monospace;min-width:48px;text-align:center" }, k)
        )
      ).join("");
      const overlay = document.createElement("div");
      overlay.id = "shortcuts-help-modal";
      overlay.className = "ap-confirm-backdrop";
      overlay.style.cssText = "z-index:9999;";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Klavye kisayollari");
      overlay.innerHTML = h(
        "div",
        { style: "background:var(--color-glass-panel);backdrop-filter:blur(var(--blur-level)) saturate(1.4);-webkit-backdrop-filter:blur(var(--blur-level)) saturate(1.4);border:1px solid var(--glass-border);border-radius:16px;padding:28px 32px;min-width:340px;max-width:420px;box-shadow:0 24px 48px rgba(0,0,0,0.4)" },
        h(
          "div",
          { style: "display:flex;align-items:center;justify-content:space-between;margin-bottom:20px" },
          h("h3", { style: "font-size:1rem;font-weight:700;color:var(--text);margin:0" }, "Klavye Kisayollari"),
          h("button", { id: "shortcuts-close", style: "background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.25rem;padding:4px", "aria-label": "Kapat" }, icon("ph-x"))
        ),
        h("div", { style: "display:flex;flex-direction:column;gap:12px", role: "list" }, rows)
      );
      document.body.appendChild(overlay);
      const closeBtn = document.getElementById("shortcuts-close");
      if (closeBtn) {
        closeBtn.focus();
        closeBtn.onclick = () => overlay.remove();
      }
      overlay.onclick = (ev) => {
        if (ev.target === overlay) overlay.remove();
      };
      overlay.addEventListener("keydown", (ev) => {
        if (ev.key === "Tab") {
          const focusable = overlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (ev.shiftKey && document.activeElement === first) {
            ev.preventDefault();
            last.focus();
          } else if (!ev.shiftKey && document.activeElement === last) {
            ev.preventDefault();
            first.focus();
          }
        }
      });
    }
    /** Stop listening. */
    destroy() {
      if (this.keydownHandler) {
        window.removeEventListener("keydown", this.keydownHandler);
        this.keydownHandler = null;
      }
      this.handlers = [];
    }
  };

  // src/app/shell/index.ts
  var shellBus = createEventBus();
  var railComponent = null;
  var footerComponent = null;
  var keyboardManager = null;
  function initShell(pageKey) {
    const rawKey = pageKey ?? getCurrentKey();
    const key = KEY_MAP[rawKey] ?? rawKey;
    window.__SHELL_KEY = key;
    window.__SIDEBAR_KEY = key;
    const base = getBasePath();
    window.__SHELL_BASE = base;
    document.body.insertAdjacentHTML("afterbegin", '<a href="#main" class="skip-link">Icerige atla</a>');
    const mainEl = document.getElementById("main");
    if (mainEl) {
      mainEl.setAttribute("role", "main");
      mainEl.setAttribute("aria-label", "Sayfa icerigi");
    }
    railComponent = new RailComponent("rail", shellBus, MENU, base);
    railComponent.setActiveKey(key);
    railComponent.render();
    footerComponent = new FooterComponent("footbar", shellBus);
    footerComponent.render();
    keyboardManager = new KeyboardShortcutManager(shellBus);
    keyboardManager.register({ key: "k", mod: true }, () => {
      const spotBd = document.getElementById("spotlight-backdrop");
      if (spotBd) {
        spotBd.classList.add("open");
        document.getElementById("sp-input")?.focus();
      }
    });
    keyboardManager.register({ key: "Escape" }, () => {
      document.getElementById("spotlight-backdrop")?.classList.remove("open");
      document.getElementById("ud-backdrop")?.classList.remove("show");
      tmCloseAll();
      const np = document.getElementById("np-panel");
      if (np && np.classList.contains("open")) toggleNotifPanel();
      document.getElementById("tenant-backdrop")?.classList.remove("show");
      document.getElementById("shortcuts-help-modal")?.remove();
    });
    keyboardManager.register({ key: "n", mod: true }, () => {
      const skey = window.__SHELL_KEY ?? "";
      const createPages = {
        yonetim: "tenant-create.html",
        seo: "seo-keyword-magic.html",
        content: "content-writing-assistant.html",
        ads: "ads-campaign-create.html"
      };
      if (createPages[skey]) window.location.href = base + "pages/" + createPages[skey];
    });
    keyboardManager.register({ key: "?", notInInput: true }, () => {
      keyboardManager?.showHelp();
    });
    keyboardManager.init();
    renderTopbar(base);
    buildTopMenu();
    renderSidebar(base, key);
    renderBreadcrumb(base, key);
    renderBottomNav(base, key);
    renderSpotlight(base);
    initSpotlightNav(base);
    bindSpotlightEvents();
    renderUserDropdown(base);
    bindUserDropdownEvents();
    initMobileMenu(base, key);
    const wideToggle = document.getElementById("wide-toggle-tb");
    if (wideToggle) {
      wideToggle.onclick = () => {
        const isOpen = document.body.classList.toggle("wide-open");
        wideToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      };
    }
    const wideOverlay = document.getElementById("wide-overlay");
    if (wideOverlay) {
      wideOverlay.onclick = () => {
        const sw = document.getElementById("sidebar-wide");
        if (sw) sw.classList.remove("open");
        wideOverlay.classList.remove("show");
      };
    }
    loadAndInitLogo();
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = base + "manifest.json";
      document.head.appendChild(manifestLink);
    }
    if (!document.querySelector('link[rel="icon"]')) {
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/svg+xml";
      favicon.href = base + "favicon.svg";
      document.head.appendChild(favicon);
    }
    initNotificationPanel(base);
    initAutoSaveToast();
    initTenantSwitcher();
    initMobileTenantSwitcher();
    shellBus.on("rail:click", (payload) => {
      const p = payload;
      const currentSidebarKey = window.__SIDEBAR_KEY ?? "";
      const sidebarOpen = document.body.classList.contains("wide-open");
      if (p.key === currentSidebarKey && sidebarOpen) {
        document.body.classList.remove("wide-open");
        return;
      }
      renderSidebar(p.base, p.key);
      window.__SIDEBAR_KEY = p.key;
      document.body.classList.add("wide-open");
    });
  }
  function initAutoSaveToast() {
    let timer = null;
    function trigger() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.Alpine && Alpine.store("toast")) {
          Alpine.store("toast").show(
            "Ayarlar kaydedildi",
            "success",
            2500
          );
        }
      }, 800);
    }
    if (window.AppearanceStore) window.AppearanceStore.on("any-change", trigger);
    if (window.ThemeStore) window.ThemeStore.on("any-change", trigger);
  }
  window.initShell = initShell;
  window.railClick = function windowRailClick(btn) {
    const key = window.__SHELL_KEY ?? "";
    railClick(btn, key);
  };
  window.toggleNotifPanel = toggleNotifPanel;
  window.togglePageFav = togglePageFav;
  window.toggleFav = toggleFav;
  window.showToast = showToast;
  window.tmCloseAll = tmCloseAll;
  window.buildTopMenu = buildTopMenu;
})();
