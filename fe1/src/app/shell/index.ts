/**
 * index.ts — Shell Orchestrator
 * Responsibility: Main entry point that imports all shell sub-modules,
 * runs initShell(pageKey) to render the entire app shell, and exposes
 * required functions to window.* for inline onclick handlers in HTML.
 */

import { KEY_MAP } from './navigation-config';
import { togglePageFav, toggleFav } from './favorites';
import { renderTopbar } from './topbar';
import { renderRail, railClick } from './rail';
import { renderSidebar } from './sidebar';
import { renderBreadcrumb } from './breadcrumb';
import { renderSpotlight, initSpotlightNav, bindSpotlightEvents } from './spotlight';
import { initNotificationPanel, toggleNotifPanel } from './notification-panel';
import { initTenantSwitcher, initMobileTenantSwitcher } from './tenant-switcher';
import { initKeyboardShortcuts } from './keyboard-shortcuts';
import { renderUserDropdown, bindUserDropdownEvents } from './user-dropdown';
import { loadAndInitLogo } from './logo-animation';
import { renderBottomNav, initMobileMenu } from './mobile-menu';
import { getBasePath, getCurrentKey, showToast, tmCloseAll, buildTopMenu } from './helpers';

// ── CDN global declarations ──────────────────────────

declare const Alpine: { store: (name: string) => unknown; data: (...args: unknown[]) => unknown };

// Window type extensions are declared in shared/types/index.ts

// ── initShell ──────────────────────────

export function initShell(pageKey?: string): void {
  const rawKey = pageKey ?? getCurrentKey();
  const key = KEY_MAP[rawKey] ?? rawKey;
  window.__SHELL_KEY = key;
  window.__SIDEBAR_KEY = key;
  const base = getBasePath();
  window.__SHELL_BASE = base;

  // Skip link
  document.body.insertAdjacentHTML('afterbegin', '<a href="#main" class="skip-link">Icerige atla</a>');

  // Render shell sections
  renderTopbar(base);
  buildTopMenu();
  renderRail(base, key);
  renderSidebar(base, key);
  renderBreadcrumb(base, key);
  renderFooter();
  renderBottomNav(base, key);
  renderSpotlight(base);
  initSpotlightNav(base);
  bindSpotlightEvents();
  renderUserDropdown(base);
  bindUserDropdownEvents();
  initMobileMenu(base, key);

  // Wide sidebar toggle
  const wideToggle = document.getElementById('wide-toggle-tb');
  if (wideToggle) {
    wideToggle.onclick = () => { document.body.classList.toggle('wide-open'); };
  }
  const wideOverlay = document.getElementById('wide-overlay');
  if (wideOverlay) {
    wideOverlay.onclick = () => {
      const sw = document.getElementById('sidebar-wide');
      if (sw) sw.classList.remove('open');
      wideOverlay.classList.remove('show');
    };
  }

  // Keyboard shortcuts
  initKeyboardShortcuts(base);

  // GSAP logo animation
  loadAndInitLogo();

  // PWA manifest injection
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = base + 'manifest.json';
    document.head.appendChild(manifestLink);
  }

  // Favicon injection
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = base + 'favicon.svg';
    document.head.appendChild(favicon);
  }

  // Notification panel
  initNotificationPanel(base);

  // Auto-save toast (debounced)
  initAutoSaveToast();

  // Tenant switcher (desktop + mobile)
  initTenantSwitcher();
  initMobileTenantSwitcher();
}

// ── Footer ──────────────────────────

function renderFooter(): void {
  const footbar = document.getElementById('footbar');
  if (!footbar) return;
  footbar.innerHTML =
    '<span class="fb-dot"></span><span>Sistem aktif</span><span class="fb-sep"></span>' +
    '<span><strong style="color:var(--text);font-weight:700">12</strong> tenant</span><span class="fb-sep"></span>' +
    '<span><strong style="color:var(--text);font-weight:700">47</strong> workspace</span><span class="fb-sep"></span>' +
    '<span><strong style="color:var(--text);font-weight:700">5</strong> adaptor</span>' +
    '<span style="margin-left:auto;font-size:0.625rem;letter-spacing:0.05em">v0.1.0</span>';
}

// ── Auto-save toast ──────────────────────────

function initAutoSaveToast(): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  function trigger(): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.Alpine && (Alpine.store('toast') as { show?: unknown } | undefined)) {
        (Alpine.store('toast') as { show: (msg: string, type: string, dur: number) => void }).show(
          'Ayarlar kaydedildi', 'success', 2500,
        );
      }
    }, 800);
  }
  if (window.AppearanceStore) window.AppearanceStore.on('any-change', trigger);
  if (window.ThemeStore) window.ThemeStore.on('any-change', trigger);
}

// ── Window assignments (for inline onclick handlers) ──────────────────────────

window.initShell = initShell;
window.railClick = function windowRailClick(btn: HTMLElement): void {
  const key = window.__SHELL_KEY ?? '';
  railClick(btn, key);
};
window.toggleNotifPanel = toggleNotifPanel;
window.togglePageFav = togglePageFav;
window.toggleFav = toggleFav;
window.showToast = showToast;
window.tmCloseAll = tmCloseAll;
window.buildTopMenu = buildTopMenu;

// Window type extensions are declared in shared/types/index.ts
