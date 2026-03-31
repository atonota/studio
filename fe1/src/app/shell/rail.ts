/**
 * rail.ts
 * Responsibility: Render the left navigation rail (#rail) with group
 * dividers, and handle rail button clicks (toggle sidebar or navigate).
 */

import { MENU } from './navigation-config';
import { renderSidebar } from './sidebar';

export function renderRail(base: string, activeKey: string): void {
  const railEl = document.getElementById('rail');
  if (!railEl) return;

  // ARIA landmark
  railEl.setAttribute('role', 'navigation');
  railEl.setAttribute('aria-label', 'Ana navigasyon');

  let railHTML = '';
  MENU.forEach((group, gi) => {
    if (gi > 0) railHTML += '<div class="ni-div" role="separator"></div>';
    group.items.forEach((item) => {
      const active = item.key === activeKey ? ' active' : '';
      const ariaCurrent = item.key === activeKey ? ' aria-current="section"' : '';
      railHTML +=
        `<button class="ni${active}" data-key="${item.key}" ` +
        `data-href="${base}${item.href}" title="${item.title}" ` +
        `aria-label="${item.title}"${ariaCurrent} ` +
        `onclick="railClick(this)">` +
        `<i class="ph ${item.icon}" aria-hidden="true"></i>` +
        `<span class="ni-label">${item.title}</span></button>`;
    });
  });
  railEl.innerHTML = railHTML;
}

/**
 * Rail click handler:
 * - Herhangi bir item tıklandığında Sidebar 2'yi aç.
 * - Aynı item tekrar tıklanırsa (sidebar açıkken) kapat.
 */
export function railClick(btn: HTMLElement, _activeKey: string): void {
  const clickedKey = btn.dataset.key ?? '';
  const base = window.__SHELL_BASE ?? '';
  const currentSidebarKey = window.__SIDEBAR_KEY ?? '';
  const sidebarOpen = document.body.classList.contains('wide-open');

  if (clickedKey === currentSidebarKey && sidebarOpen) {
    // Aynı section, sidebar açık → kapat
    document.body.classList.remove('wide-open');
    return;
  }

  // Tıklanan section'ın sidebar'ını render et ve aç
  renderSidebar(base, clickedKey);
  window.__SIDEBAR_KEY = clickedKey;
  document.body.classList.add('wide-open');

  // Rail'de aktif göstergeyi güncelle
  document.querySelectorAll<HTMLElement>('.ni').forEach((ni) => ni.classList.remove('active'));
  btn.classList.add('active');
}
