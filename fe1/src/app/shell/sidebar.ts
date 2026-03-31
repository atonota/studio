/**
 * sidebar.ts
 * Responsibility: Render the wide sidebar (#sidebar-wide) content —
 * section header, dashboard link, collapsible groups with child links,
 * star buttons for favorites, and the user card at the bottom.
 * Also creates the sidebar toggle button if it doesn't exist.
 */

import type { MenuItem } from '../../shared/types';
import { MENU, SIDEBAR_DATA, SIDEBAR_HIDDEN } from './navigation-config';
import { isFavorite } from './favorites';
import { getCurrentFile, isInPages } from './helpers';

function findSectionInfo(key: string): MenuItem | undefined {
  return MENU.flatMap((g) => g.items).find((i) => i.key === key);
}

export function renderSidebar(base: string, key: string): void {
  const sidebarEl = document.getElementById('sidebar-wide');
  if (!sidebarEl) return;

  const sidebarData = SIDEBAR_DATA[key] ?? [];
  const secInfo = findSectionInfo(key);
  const currentFile = getCurrentFile();
  const inPages = isInPages();

  // Section header
  let html = SIDEBAR_HIDDEN.includes(key)
    ? ''
    : `<div class="ws-header"><i class="ph ${secInfo ? secInfo.icon : 'ph-squares-four'}" style="font-size:0.8125rem"></i><span>${secInfo ? secInfo.title : 'Dashboard'}</span></div>`;

  html += '<div style="flex:1;overflow-y:auto">';

  // Dashboard link at top
  if (secInfo && !SIDEBAR_HIDDEN.includes(key)) {
    const dashHref = secInfo.href.replace('pages/', '');
    const resolvedDash = inPages ? dashHref : 'pages/' + dashHref;
    const dashActive = currentFile === dashHref ? ' active' : '';
    html += `<a class="ws-dash${dashActive}" href="${resolvedDash}"><i class="ph ph-squares-four"></i><span>Dashboard</span></a>`;
  }

  // Sidebar groups
  sidebarData.forEach((group) => {
    const groupHasActive = group.ch.some((ch) => {
      const h = ch.split('|')[2];
      return h !== undefined && h !== '' && currentFile === h;
    });
    const openClass = groupHasActive ? ' open' : '';

    html += `<div class="ws-section"><div class="ws-l1${openClass}" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><span>${group.l}</span><i class="ph ph-caret-right chevron"></i></div><div class="ws-l1-body${openClass}">`;

    group.ch.forEach((ch) => {
      const parts = ch.split('|');
      const label = parts[0];
      const badge = parts[1] ?? '';
      const href = parts[2] ?? '';
      const isActive = href !== '' && currentFile === href;
      const activeClass = isActive ? ' active' : '';

      if (href) {
        const resolvedHref = resolveChildHref(href, inPages);
        const starClass = isFavorite(href) ? 'ws-star active' : 'ws-star';
        html +=
          `<a class="ws-l2${activeClass}" href="${resolvedHref}">` +
          `<span>${label}</span>` +
          (badge ? `<span class="ws-badge">${badge}</span>` : '') +
          `<button class="${starClass}" data-fav-href="${href}" data-fav-label="${label}" ` +
          `title="Kisayol ekle/kaldir" onclick="event.preventDefault();event.stopPropagation();toggleFav(this)">` +
          `<i class="ph ph-star"></i></button></a>`;
      } else {
        html +=
          `<div class="ws-l2${activeClass}"><span>${label}</span>` +
          (badge ? `<span class="ws-badge">${badge}</span>` : '') +
          '</div>';
      }
    });
    html += '</div></div>';
  });

  // Close scrollable area
  html += '</div>';

  // User card at bottom
  html += renderUserCard();

  sidebarEl.innerHTML = html;

  // Sidebar 2'de bir item tıklandığında sidebar'ı otomatik kapat
  sidebarEl.querySelectorAll<HTMLAnchorElement>('a.ws-l2, a.ws-dash').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('wide-open');
    });
  });

  // Sidebar toggle button
  ensureToggleButton();
}

function resolveChildHref(href: string, inPages: boolean): string {
  if (href === 'index.html') {
    return inPages ? '../index.html' : 'index.html';
  }
  return inPages ? href : 'pages/' + href;
}

function renderUserCard(): string {
  return (
    '<div class="sidebar-bottom"><div class="user-card">' +
    '<div class="ud-trigger" id="user-trigger">' +
    '<div style="width:36px;height:36px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--accent)">' +
    '<span style="font-size:0.7rem;font-weight:700;color:var(--accent)">IK</span></div>' +
    '<div style="min-width:0;flex:1">' +
    '<div style="font-size:0.8125rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Ismail Karaca</div>' +
    '<div style="font-size:0.625rem;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase">Super Admin</div>' +
    '</div>' +
    '<i class="ph ph-caret-up" style="color:var(--muted);font-size:0.75rem;flex-shrink:0"></i>' +
    '</div></div></div>'
  );
}

function ensureToggleButton(): void {
  if (document.getElementById('wide-toggle-tb')) return;
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'wide-toggle-tb';
  toggleBtn.title = 'Sidebar toggle';
  toggleBtn.innerHTML = '<span class="toggle-arrow"><i class="ph ph-caret-left"></i></span>';
  document.body.appendChild(toggleBtn);
}
