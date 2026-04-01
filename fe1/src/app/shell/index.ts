/**
 * @module shell/index
 * Shell Orchestrator — manages app shell lifecycle.
 * Uses OOP components where migrated, procedural functions elsewhere.
 * Exposes window.* compat layer for inline onclick handlers in HTML.
 */

import { KEY_MAP, MENU } from './navigation-config';
import { togglePageFav, toggleFav, toggleFavDropdown, closeFavDropdown, initFavBackdrop } from './favorites';
import { initAiChatModal, toggleAiModal, closeAiModal } from './ai-chat-modal';
import { renderTopbar } from './topbar';
import { renderSidebar, isSidebarLocked } from './sidebar';
import { renderBreadcrumb } from './breadcrumb';
import { renderSpotlight, initSpotlightNav, bindSpotlightEvents } from './spotlight';
import { initNotificationPanel, toggleNotifPanel } from './notification-panel';
import { initTenantSwitcher, initMobileTenantSwitcher } from './tenant-switcher';
import { renderUserDropdown, bindUserDropdownEvents } from './user-dropdown';
import { loadAndInitLogo } from './logo-animation';
import { renderBottomNav, initMobileMenu } from './mobile-menu';
import { getBasePath, getCurrentKey, showToast, tmCloseAll, buildTopMenu } from './helpers';
import { railClick } from './rail';

// OOP Components
import { createEventBus } from '../../core/event-bus';
import { RailComponent } from '../../shell/components/RailComponent';
import { FooterComponent } from '../../shell/components/FooterComponent';
import { KeyboardShortcutManager } from '../../shell/components/KeyboardShortcutManager';

// ── CDN global declarations ──────────────────────────

declare const Alpine: { store: (name: string) => unknown; data: (...args: unknown[]) => unknown };

// ── Shared event bus for shell components ──────────────────────────

const shellBus = createEventBus();

// ── Component instances (lifecycle managed) ──────────────────────────

let railComponent: RailComponent | null = null;
let footerComponent: FooterComponent | null = null;
let keyboardManager: KeyboardShortcutManager | null = null;

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

  // ARIA landmarks for main content
  const mainEl = document.getElementById('main');
  if (mainEl) {
    mainEl.setAttribute('role', 'main');
    mainEl.setAttribute('aria-label', 'Sayfa icerigi');
  }

  // ── OOP Components ──────────────────────────

  // Rail (OOP — replaces procedural renderRail)
  railComponent = new RailComponent('rail', shellBus, MENU, base);
  railComponent.setActiveKey(key);
  railComponent.render();

  // Footer (OOP — replaces procedural renderFooter)
  footerComponent = new FooterComponent('footbar', shellBus);
  footerComponent.render();

  // Keyboard shortcuts (OOP — replaces procedural initKeyboardShortcuts)
  keyboardManager = new KeyboardShortcutManager(shellBus);
  keyboardManager.register({ key: 'k', mod: true }, () => {
    const spotBd = document.getElementById('spotlight-backdrop');
    if (spotBd) {
      spotBd.classList.add('open');
      (document.getElementById('sp-input') as HTMLInputElement | null)?.focus();
    }
  });
  keyboardManager.register({ key: 'Escape' }, () => {
    document.getElementById('spotlight-backdrop')?.classList.remove('open');
    document.getElementById('ud-backdrop')?.classList.remove('show');
    closeFavDropdown();
    closeAiModal();
    tmCloseAll();
    const np = document.getElementById('np-panel');
    if (np && np.classList.contains('open')) toggleNotifPanel();
    document.getElementById('tenant-backdrop')?.classList.remove('show');
    document.getElementById('shortcuts-help-modal')?.remove();
  });
  keyboardManager.register({ key: 'n', mod: true }, () => {
    const skey = window.__SHELL_KEY ?? '';
    const createPages: Record<string, string> = {
      yonetim: 'tenant-create.html', seo: 'seo-keyword-magic.html',
      content: 'content-writing-assistant.html', ads: 'ads-campaign-create.html',
    };
    if (createPages[skey]) window.location.href = base + 'pages/' + createPages[skey];
  });
  keyboardManager.register({ key: '?', notInInput: true }, () => {
    keyboardManager?.showHelp();
  });
  keyboardManager.init();

  // ── Procedural renders (not yet migrated to OOP) ──────────────────────────

  renderTopbar(base);
  buildTopMenu();
  renderSidebar(base, key);
  renderBreadcrumb(base, key);
  initFavBackdrop();
  initAiChatModal();
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
    wideToggle.onclick = () => {
      const isOpen = document.body.classList.toggle('wide-open');
      wideToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
  }
  const wideOverlay = document.getElementById('wide-overlay');
  if (wideOverlay) {
    wideOverlay.onclick = () => {
      const sw = document.getElementById('sidebar-wide');
      if (sw) sw.classList.remove('open');
      wideOverlay.classList.remove('show');
    };
  }

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

  // ── Bus: rail click → sidebar render ──────────────────────────
  shellBus.on('rail:click', (payload) => {
    const p = payload as { key: string; base: string };
    const currentSidebarKey = window.__SIDEBAR_KEY ?? '';
    const sidebarOpen = document.body.classList.contains('wide-open');

    if (p.key === currentSidebarKey && sidebarOpen) {
      // Kilitliyse kapatma, sadece farklı section'a geçişte render et
      if (!isSidebarLocked()) {
        document.body.classList.remove('wide-open');
      }
      return;
    }
    renderSidebar(p.base, p.key);
    window.__SIDEBAR_KEY = p.key;
    document.body.classList.add('wide-open');
  });
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

// ── Window assignments (compat layer for inline onclick handlers) ──────────────────────────

window.initShell = initShell;
window.railClick = function windowRailClick(btn: HTMLElement): void {
  // Compat: old HTML onclick="railClick(this)" still works
  const key = window.__SHELL_KEY ?? '';
  railClick(btn, key);
};
window.toggleNotifPanel = toggleNotifPanel;
window.togglePageFav = togglePageFav;
window.toggleFav = toggleFav;
window.toggleFavDropdown = toggleFavDropdown;
window.toggleAiModal = toggleAiModal;
window.closeAiModal = closeAiModal;
window.showToast = showToast;
window.tmCloseAll = tmCloseAll;
window.buildTopMenu = buildTopMenu;
