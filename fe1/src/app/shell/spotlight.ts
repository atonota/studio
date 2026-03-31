/**
 * spotlight.ts
 * Responsibility: Spotlight search overlay — renders initial quick-access items,
 * handles text filtering across all MENU + SIDEBAR_DATA items, and provides
 * keyboard navigation (ArrowUp/Down, Enter) within the result list.
 */

import { MENU, SIDEBAR_DATA } from './navigation-config';
import { isInPages } from './helpers';

interface SpotlightItem {
  title: string;
  icon: string;
  href: string;
  parent?: string;
}

export function renderSpotlight(base: string): void {
  const spotBd = document.getElementById('spotlight-backdrop');
  if (!spotBd) return;

  const quickItems = MENU.flatMap((g) => g.items)
    .slice(0, 6)
    .map(
      (i) =>
        `<a class="sp-item" href="${base}${i.href}">` +
        `<div class="sp-item-icon"><i class="ph ${i.icon}"></i></div>` +
        `<div><div class="sp-item-title">${i.title}</div></div></a>`,
    )
    .join('');

  spotBd.innerHTML =
    `<div id="spotlight" role="dialog" aria-modal="true" aria-label="Spotlight arama">` +
    `<div class="sp-input-wrap">` +
    `<i class="ph ph-magnifying-glass" style="font-size:1.125rem;color:var(--muted)" aria-hidden="true"></i>` +
    `<input id="sp-input" class="sp-input" type="text" placeholder="Panelde ara..." autocomplete="off" role="combobox" aria-expanded="true" aria-controls="sp-results-list" aria-autocomplete="list">` +
    `<span class="sp-kbd" id="sp-close" role="button" tabindex="0" aria-label="Kapat">ESC</span></div>` +
    `<div class="sp-results" id="sp-results-list" role="listbox"><div class="sp-section-label" id="sp-quick-label">Hizli Erisim</div>${quickItems}</div>` +
    `<div class="sp-footer" aria-hidden="true">` +
    `<span style="display:flex;align-items:center;gap:4px"><span class="sp-key">\u2191\u2193</span> gezin</span>` +
    `<span style="display:flex;align-items:center;gap:4px"><span class="sp-key">\u21B5</span> ac</span>` +
    `<span style="display:flex;align-items:center;gap:4px"><span class="sp-key">ESC</span> kapat</span>` +
    `</div></div>`;
}

export function initSpotlightNav(base: string): void {
  const spotBd = document.getElementById('spotlight-backdrop');
  if (!spotBd) return;

  const spInput = document.getElementById('sp-input') as HTMLInputElement | null;
  if (!spInput) return;

  let spIdx = -1;
  const inPages = isInPages();

  // Build searchable item list
  const allSpItems: SpotlightItem[] = [];
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
        const p = ch.split('|');
        if (!p[2]) return;
        const href =
          p[2] === 'index.html'
            ? inPages ? '../index.html' : 'index.html'
            : inPages ? p[2] : 'pages/' + p[2];
        allSpItems.push({
          title: p[0] ?? '',
          icon: sec ? sec.icon : 'ph-file-text',
          href,
          parent: sec ? sec.title : '',
        });
      });
    });
  });

  function renderSpItems(items: SpotlightItem[], label: string): void {
    const resultsEl = spotBd!.querySelector('.sp-results');
    if (!resultsEl) return;
    resultsEl.innerHTML =
      '<div class="sp-section-label">' + label + '</div>' +
      items
        .map(
          (i) =>
            `<a class="sp-item" href="${i.href}">` +
            `<div class="sp-item-icon"><i class="ph ${i.icon}"></i></div>` +
            `<div><div class="sp-item-title">${i.title}</div>` +
            (i.parent
              ? `<div style="font-size:0.625rem;color:var(--muted)">${i.parent}</div>`
              : '') +
            `</div></a>`,
        )
        .join('');
  }

  function updateActive(): void {
    const items = spotBd!.querySelectorAll('.sp-item');
    items.forEach((el, i) => el.classList.toggle('active', i === spIdx));
    const activeItem = items[spIdx] as HTMLElement | undefined;
    if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
  }

  spInput.addEventListener('keydown', (e: KeyboardEvent) => {
    const items = spotBd.querySelectorAll('.sp-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      spIdx = Math.min(spIdx + 1, items.length - 1);
      updateActive();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      spIdx = Math.max(spIdx - 1, -1);
      updateActive();
      return;
    }
    if (e.key === 'Enter' && spIdx >= 0) {
      const target = items[spIdx] as HTMLElement | undefined;
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  });

  spInput.addEventListener('input', () => {
    spIdx = -1;
    const q = spInput.value.toLowerCase().trim();
    if (!q) {
      renderSpItems(allSpItems.slice(0, 6), 'Hizli Erisim');
      return;
    }
    const filtered = allSpItems
      .filter((i) => i.title.toLowerCase().includes(q))
      .slice(0, 8);
    if (filtered.length) {
      renderSpItems(filtered, filtered.length + ' sonuc');
      return;
    }
    const resultsEl = spotBd.querySelector('.sp-results');
    if (resultsEl) {
      resultsEl.innerHTML =
        '<div class="sp-section-label" style="text-align:center;padding:24px 0;opacity:0.5">Sonuc bulunamadi</div>';
    }
  });

  // Reset on open
  spotBd.addEventListener('transitionend', () => {
    if (spotBd.classList.contains('open')) {
      spInput.value = '';
      spIdx = -1;
    }
  });
}

export function bindSpotlightEvents(): void {
  const spotBd = document.getElementById('spotlight-backdrop');
  if (!spotBd) return;

  const tbSearch = document.getElementById('tb-search-btn');
  if (tbSearch) {
    tbSearch.onclick = () => {
      spotBd.classList.add('open');
      (document.getElementById('sp-input') as HTMLInputElement | null)?.focus();
    };
  }

  const bnSearch = document.getElementById('bn-search-btn');
  if (bnSearch) {
    bnSearch.onclick = () => {
      spotBd.classList.add('open');
      (document.getElementById('sp-input') as HTMLInputElement | null)?.focus();
    };
  }

  spotBd.onclick = (e: MouseEvent) => {
    if (e.target === spotBd) spotBd.classList.remove('open');
  };

  const spClose = document.getElementById('sp-close');
  if (spClose) {
    spClose.onclick = () => spotBd.classList.remove('open');
  }
}
