/**
 * favorites.ts
 * Responsibility: Favorites / shortcuts system — localStorage persistence,
 * add/remove/toggle operations, sidebar star sync, breadcrumb star sync.
 * Max 5 favorites, stored under 'ap_fav_shortcuts' key.
 */

import type { Favorite } from '../../shared/types';

declare const Alpine: { store: (name: string) => { show: (msg: string, type: string, dur: number) => void } };

// ── Constants ──────────────────────────

const FAV_KEY = 'ap_fav_shortcuts';
const FAV_MAX = 5;

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

export function renderFavorites(): void {
  // Placeholder — reserved for future favorites bar rendering
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
    if (icon) icon.className = 'ph ph-star-fill';
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
    if (icon) icon.className = 'ph ph-star-fill';
  }
  if (window.Alpine && Alpine.store('toast')) {
    Alpine.store('toast').show(label + ' kisayollara eklendi', 'success', 2000);
  }
}
