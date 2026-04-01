/**
 * favorites.ts
 * Responsibility: Favorites / shortcuts system — localStorage persistence,
 * add/remove/toggle operations, sidebar star sync, breadcrumb star sync,
 * and favorites dropdown panel with glassmorphic backdrop.
 * Max 12 favorites, stored under 'ap_fav_shortcuts' key.
 */

import type { Favorite } from '../../shared/types';
import { tmResolveHref } from './helpers';

declare const Alpine: { store: (name: string) => { show: (msg: string, type: string, dur: number) => void } };

// ── Constants ──────────────────────────

const FAV_KEY = 'ap_fav_shortcuts';
const FAV_MAX = 12;

// ── Type guard ──────────────────────────

function isFavoriteArray(val: unknown): val is Favorite[] {
  if (!Array.isArray(val)) return false;
  return val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).label === 'string' &&
      typeof (item as Record<string, unknown>).href === 'string',
  );
}

// ── Core CRUD ──────────────────────────

export function getFavorites(): Favorite[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
    return isFavoriteArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: Favorite[]): void {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs.slice(0, FAV_MAX)));
}

export function addFavorite(label: string, href: string): void {
  const favs = getFavorites();
  if (favs.some((f) => f.href === href)) return;
  favs.unshift({ label, href });
  if (favs.length > FAV_MAX) favs.pop();
  saveFavorites(favs);
  renderFavorites();
}

export function removeFavorite(href: string): void {
  const favs = getFavorites().filter((f) => f.href !== href);
  saveFavorites(favs);
  renderFavorites();
}

export function isFavorite(href: string): boolean {
  return getFavorites().some((f) => f.href === href);
}

// ── Dropdown rendering ──────────────────────────

export function renderFavorites(): void {
  const dropdown = document.getElementById('fav-dropdown');
  if (!dropdown) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    dropdown.innerHTML = '<div class="fav-empty">Henuz favori eklenmedi</div>';
    return;
  }

  dropdown.innerHTML = favs
    .map((f) => {
      const resolved = tmResolveHref(f.href);
      return `<a class="fav-item" href="${resolved}">` +
        `<i class="ph ph-caret-right"></i>` +
        `<span>${f.label}</span></a>`;
    })
    .join('');
}

// ── Dropdown toggle ──────────────────────────

export function toggleFavDropdown(): void {
  const dropdown = document.getElementById('fav-dropdown');
  const backdrop = document.getElementById('fav-backdrop');
  const toggleBtn = document.getElementById('bc-fav-toggle-btn');
  if (!dropdown || !backdrop) return;

  const isOpen = dropdown.classList.contains('show');

  if (isOpen) {
    closeFavDropdown();
    return;
  }

  // Position dropdown below the toggle button
  if (toggleBtn) {
    const rect = toggleBtn.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 8) + 'px';
    dropdown.style.right = (window.innerWidth - rect.right) + 'px';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  // Render fresh items before opening
  renderFavorites();
  dropdown.classList.add('show');
  backdrop.classList.add('show');
}

export function closeFavDropdown(): void {
  const dropdown = document.getElementById('fav-dropdown');
  const backdrop = document.getElementById('fav-backdrop');
  const toggleBtn = document.getElementById('bc-fav-toggle-btn');

  if (dropdown) dropdown.classList.remove('show');
  if (backdrop) backdrop.classList.remove('show');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

/** Inject backdrop + dropdown elements into body (called once from initShell) */
export function initFavBackdrop(): void {
  if (document.getElementById('fav-backdrop')) return;

  // Backdrop
  const bd = document.createElement('div');
  bd.id = 'fav-backdrop';
  document.body.appendChild(bd);
  bd.addEventListener('click', () => { closeFavDropdown(); });

  // Dropdown (fixed, positioned via JS)
  const dd = document.createElement('div');
  dd.id = 'fav-dropdown';
  document.body.appendChild(dd);
}

// ── Toggle from breadcrumb star ──────────────────────────

export function togglePageFav(): void {
  const href = window.location.pathname.split('/').pop() ?? '';
  const titleEl = document.querySelector('.page-title');
  const label = titleEl
    ? titleEl.textContent ?? ''
    : (document.title.split('\u2014')[0] ?? '').trim();
  const btn = document.getElementById('bc-star-btn');

  if (isFavorite(href)) {
    removeFavorite(href);
    if (btn) {
      btn.classList.remove('bc-star-active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'ph ph-star';
      btn.title = 'Kisayollara ekle';
    }
    document.querySelectorAll(`.ws-star[data-fav-href="${href}"]`).forEach((s) => {
      s.classList.remove('active');
    });
    if (window.Alpine && Alpine.store('toast')) {
      Alpine.store('toast').show(label + ' kisayollardan kaldirildi', 'info', 2000);
    }
    return;
  }

  addFavorite(label, href);
  if (btn) {
    btn.classList.add('bc-star-active');
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'ph-fill ph-star';
    btn.title = 'Kisayollardan kaldir';
  }
  document.querySelectorAll(`.ws-star[data-fav-href="${href}"]`).forEach((s) => {
    s.classList.add('active');
  });
  if (window.Alpine && Alpine.store('toast')) {
    Alpine.store('toast').show(label + ' kisayollara eklendi', 'success', 2000);
  }
}

// ── Toggle from sidebar star button ──────────────────────────

export function toggleFav(btn: HTMLElement): void {
  const href = btn.dataset.favHref ?? '';
  const label = btn.dataset.favLabel ?? '';

  if (isFavorite(href)) {
    removeFavorite(href);
    btn.classList.remove('active');
    const bcStar = document.getElementById('bc-star-btn');
    if (bcStar && window.location.pathname.split('/').pop() === href) {
      bcStar.classList.remove('bc-star-active');
      const icon = bcStar.querySelector('i');
      if (icon) icon.className = 'ph ph-star';
    }
    if (window.Alpine && Alpine.store('toast')) {
      Alpine.store('toast').show(label + ' kisayollardan kaldirildi', 'info', 2000);
    }
    return;
  }

  addFavorite(label, href);
  btn.classList.add('active');
  const bcStar = document.getElementById('bc-star-btn');
  if (bcStar && window.location.pathname.split('/').pop() === href) {
    bcStar.classList.add('bc-star-active');
    const icon = bcStar.querySelector('i');
    if (icon) icon.className = 'ph-fill ph-star';
  }
  if (window.Alpine && Alpine.store('toast')) {
    Alpine.store('toast').show(label + ' kisayollara eklendi', 'success', 2000);
  }
}
