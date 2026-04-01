/**
 * breadcrumb.ts
 * Responsibility: Render the breadcrumb navigation row at the top of #main,
 * including the favorite star button for the current page.
 */

import type { MenuItem } from '../../shared/types';
import { MENU } from './navigation-config';
import { isFavorite } from './favorites';
import { getCurrentFile } from './helpers';

function findSectionInfo(key: string): MenuItem | undefined {
  return MENU.flatMap((g) => g.items).find((i) => i.key === key);
}

export function renderBreadcrumb(base: string, key: string): void {
  const mainEl = document.getElementById('main');
  if (!mainEl) return;

  const secInfo = findSectionInfo(key);
  const currentPageFile = getCurrentFile();
  const isFav = isFavorite(currentPageFile);
  const starClass = isFav ? 'ph-fill ph-star' : 'ph ph-star';
  const starActiveClass = isFav ? ' bc-star-active' : '';

  let crumbs =
    `<a href="${base}index.html" style="color:var(--muted);text-decoration:none;font-size:0.75rem">Dashboard</a>`;

  if (key !== 'dashboard') {
    crumbs +=
      `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i>` +
      `<a href="${base}${secInfo ? secInfo.href : 'index.html'}" style="color:var(--muted);text-decoration:none;font-size:0.75rem">${secInfo ? secInfo.title : ''}</a>`;
  }

  const bcHTML =
    `<div class="bc-row">` +
    `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>` +
    `<div class="bc-fav-group">` +
    `<button class="bc-star${starActiveClass}" id="bc-star-btn" ` +
    `title="${isFav ? 'Kisayollardan kaldir' : 'Kisayollara ekle'}" ` +
    `onclick="togglePageFav()">` +
    `<i class="${starClass}"></i></button>` +
    `<span class="bc-fav-divider"></span>` +
    `<button class="bc-fav-toggle" id="bc-fav-toggle-btn" ` +
    `title="Favorileri goster" onclick="toggleFavDropdown()" ` +
    `aria-expanded="false" aria-haspopup="true">` +
    `<span>Favoriler</span><i class="ph ph-caret-down"></i></button>` +
    `</div></div>`;

  mainEl.insertAdjacentHTML('afterbegin', bcHTML);
}
