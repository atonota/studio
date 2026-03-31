/**
 * pagination.ts — Auto-pagination for static tables (auto-feature)
 *
 * Responsibility: Automatically adds client-side pagination to any table
 * inside an element with [data-paginate] attribute. No Alpine.js needed.
 * Creates prev/next controls and a page indicator below the table.
 *
 * Usage: <div data-paginate="20"> <table> ... </table> </div>
 */

interface PaginateContainer extends HTMLElement {
  __pgPrev: () => void;
  __pgNext: () => void;
}

export function initPagination(): void {
  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll<HTMLElement>('[data-paginate]');

    containers.forEach((container) => {
      const perPage = parseInt(container.dataset.paginate || '20', 10) || 20;
      const table = container.querySelector('table');
      if (!table) return;

      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const allRows = Array.from(tbody.querySelectorAll('tr'));
      if (allRows.length <= perPage) return;

      let page = 1;
      const totalPages = Math.ceil(allRows.length / perPage);

      const pBar = document.createElement('div');
      pBar.style.cssText =
        'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);font-size:0.8125rem;color:var(--muted)';
      container.appendChild(pBar);

      function render(): void {
        const start = (page - 1) * perPage;
        const end = Math.min(start + perPage, allRows.length);

        allRows.forEach((r, i) => {
          r.style.display = (i >= start && i < end) ? '' : 'none';
        });

        const prevDisabled = page <= 1;
        const nextDisabled = page >= totalPages;
        const disabledStyle = 'opacity:0.4;cursor:not-allowed';
        const baseBtn =
          'padding:6px 12px;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:inherit;border:1px solid var(--border);background:var(--surface-2);color:var(--muted)';

        pBar.innerHTML = `
          <span>${start + 1}-${end} / ${allRows.length} sonuc</span>
          <div style="display:flex;gap:6px">
            <button onclick="this.closest('[data-paginate]').__pgPrev()" ${prevDisabled ? 'disabled' : ''} style="${baseBtn};${prevDisabled ? disabledStyle : ''}">Onceki</button>
            <span style="padding:6px 8px;font-size:0.75rem;color:var(--text)">${page}/${totalPages}</span>
            <button onclick="this.closest('[data-paginate]').__pgNext()" ${nextDisabled ? 'disabled' : ''} style="${baseBtn};${nextDisabled ? disabledStyle : ''}">Sonraki</button>
          </div>`;
      }

      const pgContainer = container as PaginateContainer;
      pgContainer.__pgPrev = () => { if (page > 1) { page--; render(); } };
      pgContainer.__pgNext = () => { if (page < totalPages) { page++; render(); } };

      render();
    });
  });
}
