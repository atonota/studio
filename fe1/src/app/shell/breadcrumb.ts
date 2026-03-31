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
  const pageTitle = document.querySelector('.page-title');
  const titleText = pageTitle
    ? (pageTitle.textContent ?? '')
    : (secInfo ? secInfo.title : 'Dashboard');

  const currentPageFile = getCurrentFile();
  const isFav = isFavorite(currentPageFile);
  const starIcon = isFav ? 'ph-star-fill' : 'ph-star';
  const starActiveClass = isFav ? ' bc-star-active' : '';

  let crumbs =
    `<a href="${base}index.html" style="color:var(--muted);text-decoration:none;font-size:0.75rem">Dashboard</a>`;

  if (key !== 'dashboard') {
    crumbs +=
      `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i>` +
      `<a href="${base}${secInfo ? secInfo.href : 'index.html'}" style="color:var(--muted);text-decoration:none;font-size:0.75rem">${secInfo ? secInfo.title : ''}</a>`;
  }

  const sectionTitle = secInfo ? secInfo.title : 'Dashboard';
  if (titleText !== sectionTitle) {
    crumbs +=
      `<i class="ph ph-caret-right" style="font-size:0.5rem;color:var(--border);margin:0 6px"></i>` +
      `<span style="color:var(--text);font-size:0.75rem;font-weight:500">${titleText}</span>`;
  }

  const bcHTML =
    `<div class="bc-row">` +
    `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>` +
    `<button class="bc-star${starActiveClass}" id="bc-star-btn" ` +
    `title="${isFav ? 'Kisayollardan kaldir' : 'Kisayollara ekle'}" ` +
    `onclick="togglePageFav()">` +
    `<i class="ph ${starIcon}"></i></button></div>`;

  mainEl.insertAdjacentHTML('afterbegin', bcHTML);
}
