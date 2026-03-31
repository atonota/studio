/**
 * tenant-switcher.ts
 * Responsibility: Tenant/workspace switcher — desktop dropdown triggered
 * from the topbar tenant area, and mobile modal triggered from bottom-nav.
 * Manages workspace selection state and syncs the tenant label.
 */

import { showToast } from './helpers';

// ── State ──────────────────────────

const WORKSPACES: readonly string[] = ['acme.com', 'shop.beta.com', 'gamma.io'];
let currentWorkspace = WORKSPACES[0];

// ── Desktop tenant switcher ──────────────────────────

export function initTenantSwitcher(): void {
  const tenantArea = document.getElementById('tb-tenant-area');
  if (!tenantArea) return;

  const tenantLabel = tenantArea.querySelector('.tb-tenant-label');
  if (!document.getElementById('tenant-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', '<div id="tenant-backdrop"></div>');
  }
  const tenantBdEl = document.getElementById('tenant-backdrop');
  if (!tenantBdEl) return;
  const tenantBd: HTMLElement = tenantBdEl;

  function buildTenantDropdown(): void {
    let html = '<div class="tenant-dropdown">';
    WORKSPACES.forEach((ws) => {
      const isCurrent = ws === currentWorkspace;
      html +=
        `<div class="td-item${isCurrent ? ' td-item-active' : ''}" data-ws="${ws}">` +
        `<div class="td-icon${isCurrent ? ' td-icon-active' : ''}"><i class="ph ph-globe"></i></div>` +
        `<span>${ws}</span></div>`;
    });
    html += '</div>';
    tenantBd.innerHTML = html;

    tenantBd.querySelectorAll<HTMLElement>('.td-item').forEach((item) => {
      item.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        currentWorkspace = item.dataset.ws ?? '';
        if (tenantLabel) tenantLabel.textContent = item.dataset.ws ?? '';
        tenantBd.classList.remove('show');
        showToast('Workspace degistirildi: ' + (item.dataset.ws ?? ''));
      };
    });
  }

  tenantArea.onclick = () => {
    buildTenantDropdown();
    tenantBd.classList.toggle('show');
  };
  tenantBd.onclick = (e: MouseEvent) => {
    if (e.target === tenantBd) tenantBd.classList.remove('show');
  };
}

// ── Mobile tenant modal ──────────────────────────

export function initMobileTenantSwitcher(): void {
  const bnTenantBtn = document.getElementById('bn-tenant-btn');
  if (!bnTenantBtn) return;

  const tenantLabel = document.querySelector('.tb-tenant-label');

  bnTenantBtn.onclick = () => {
    let modal = document.getElementById('tenant-modal');
    if (modal) return;

    modal = document.createElement('div');
    modal.id = 'tenant-modal';

    let boxHTML =
      '<div class="tenant-dropdown">' +
      '<div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;padding:12px 16px 8px">Workspace Sec</div>';

    WORKSPACES.forEach((ws) => {
      const isCur = ws === currentWorkspace;
      boxHTML +=
        '<div class="td-item' + (isCur ? ' td-item-active' : '') + '" data-ws="' + ws + '">' +
        '<div class="td-icon' + (isCur ? ' td-icon-active' : '') + '"><i class="ph ph-globe"></i></div>' +
        '<span>' + ws + '</span></div>';
    });
    boxHTML += '</div>';
    modal.innerHTML = boxHTML;

    modal.querySelectorAll<HTMLElement>('.td-item').forEach((item) => {
      item.onclick = () => {
        currentWorkspace = item.dataset.ws ?? '';
        if (tenantLabel) tenantLabel.textContent = item.dataset.ws ?? '';
        modal?.remove();
        showToast('Workspace: ' + (item.dataset.ws ?? ''));
      };
    });

    modal.onclick = (e: MouseEvent) => {
      if (e.target === modal) modal?.remove();
    };
    document.body.appendChild(modal);
  };
}
