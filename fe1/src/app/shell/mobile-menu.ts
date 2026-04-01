/**
 * mobile-menu.ts
 * Responsibility: Mobile bottom navigation bar (5 items) and the mobile
 * popup menu with accordion-style navigation mirroring the full sidebar.
 */

import { MENU, SIDEBAR_DATA } from './navigation-config';
import { getCurrentFile, isInPages } from './helpers';

// ── Bottom nav bar ──────────────────────────

export function renderBottomNav(base: string, key: string): void {
  if (document.getElementById('bottom-nav')) return;

  const bnav = document.createElement('nav');
  bnav.id = 'bottom-nav';
  bnav.innerHTML =
    `<div class="bn-item" id="bn-search-btn"><i class="ph ph-magnifying-glass"></i><span>Ara</span></div>` +
    `<div class="bn-item" id="bn-tenant-btn"><i class="ph ph-buildings"></i><span>Tenant</span></div>` +
    `<button class="bn-item bn-center${key === 'ai' ? ' bn-active' : ''}" onclick="toggleAiModal()"><i class="ph ph-robot"></i><span>AI Chat</span></button>` +
    `<div class="bn-item bn-notif" onclick="toggleNotifPanel()"><i class="ph ph-bell"></i><span class="bn-badge" id="bn-notif-badge"></span><span>Bildirim</span></div>` +
    `<button class="bn-item bn-menu-btn" id="bn-menu-popup-btn" aria-expanded="false" aria-label="Menuyu ac">` +
    `<span class="grid" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>` +
    `<span>Menu</span></button>`;
  document.body.appendChild(bnav);
}

// ── Mobile popup menu ──────────────────────────

export function initMobileMenu(base: string, key: string): void {
  const menuPopupBtn = document.getElementById('bn-menu-popup-btn');
  const menuPopup = document.getElementById('menu-popup');
  if (!menuPopupBtn || !menuPopup) return;

  const currentFile = getCurrentFile();
  const inPages = isInPages();
  // Close button (mobile UX — explicit dismiss affordance)
  let popupHTML = '<button class="mp-close" aria-label="Menuyu kapat"><i class="ph ph-x"></i></button>';
  popupHTML += '<div class="menu-popup-inner">';

  MENU.forEach((group) => {
    popupHTML += `<div class="mp-section"><div class="mp-head">${group.group}</div>`;
    group.items.forEach((item) => {
      const sd = SIDEBAR_DATA[item.key];
      const isActiveSection = item.key === key;

      if (sd && sd.length) {
        popupHTML += `<div class="mp-accordion${isActiveSection ? ' mp-acc-open' : ''}">`;
        popupHTML +=
          `<div class="mp-acc-trigger" onclick="this.parentElement.classList.toggle('mp-acc-open')">` +
          `<i class="ph ${item.icon}"></i><span>${item.title}</span>` +
          `<i class="ph ph-caret-down mp-acc-chevron"></i></div>`;
        popupHTML += '<div class="mp-acc-body">';

        sd.forEach((g) => {
          g.ch.forEach((ch) => {
            const p = ch.split('|');
            const lbl = p[0];
            const bdg = p[1] ?? '';
            const hr = p[2] ?? '';
            if (!hr) return;
            const rHref =
              hr === 'index.html'
                ? inPages ? '../index.html' : 'index.html'
                : inPages ? hr : 'pages/' + hr;
            const act = currentFile === hr ? ' mp-sub-active' : '';
            popupHTML +=
              `<a class="mp-sub${act}" href="${rHref}">${lbl}` +
              (bdg ? `<span class="mp-sub-badge">${bdg}</span>` : '') +
              `</a>`;
          });
        });
        popupHTML += '</div></div>';
      } else {
        popupHTML +=
          `<a class="mp-link" href="${base}${item.href}"><i class="ph ${item.icon}"></i>${item.title}</a>`;
      }
    });
    popupHTML += '</div>';
  });

  // Settings link at bottom
  popupHTML +=
    `<div class="mp-section"><div class="mp-head">SISTEM</div>` +
    `<a class="mp-link" href="${base}pages/settings.html"><i class="ph ph-gear"></i>Ayarlar</a></div>`;
  popupHTML += '</div>';
  menuPopup.innerHTML = popupHTML;

  // Close button handler
  const closeBtn = menuPopup.querySelector('.mp-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      menuPopup.classList.remove('open');
      menuPopupBtn.setAttribute('aria-expanded', 'false');
      menuPopupBtn.setAttribute('aria-label', 'Menuyu ac');
    });
  }

  // Toggle behavior
  menuPopupBtn.onclick = () => {
    const isOpen = menuPopup.classList.toggle('open');
    menuPopupBtn.setAttribute('aria-expanded', String(isOpen));
    menuPopupBtn.setAttribute('aria-label', isOpen ? 'Menuyu kapat' : 'Menuyu ac');
  };

  // Close on outside click
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!menuPopup.contains(target) && target !== menuPopupBtn && !menuPopupBtn.contains(target)) {
      menuPopup.classList.remove('open');
      menuPopupBtn.setAttribute('aria-expanded', 'false');
      menuPopupBtn.setAttribute('aria-label', 'Menuyu ac');
    }
  });
}
