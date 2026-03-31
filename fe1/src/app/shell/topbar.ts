/**
 * topbar.ts
 * Responsibility: Render the topbar HTML into #topbar element.
 * Desktop: [tenant][search] [LOGO center] [menu][bell]
 * Mobile:  [LOGO center] [menu-popup-btn][search-icon][bell]
 */

export function renderTopbar(base: string): void {
  const topbarEl = document.getElementById('topbar');
  if (!topbarEl) return;

  // Logo SVG is built dynamically by initLogoAnimation
  const logoSVG = '';

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
