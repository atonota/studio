/**
 * data-table.ts — Sortable/filterable data table Alpine.js data component
 *
 * Responsibility: Client-side table sorting (by column, asc/desc toggle),
 * text search filtering across all columns, and cursor-style pagination.
 * Uses Turkish locale for string comparison.
 *
 * Usage: x-data="dataTable(rows)"
 * Methods: sort(col), filter(query), nextPage(), prevPage()
 * Getters: paged, totalPages, showing
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

type SortDirection = 'asc' | 'desc';

interface TableRow {
  [key: string]: unknown;
}

interface DataTableComponent {
  allRows: TableRow[];
  rows: TableRow[];
  sortCol: string;
  sortDir: SortDirection;
  searchQuery: string;
  page: number;
  perPage: number;
  readonly paged: TableRow[];
  readonly totalPages: number;
  readonly showing: string;
  sort(col: string): void;
  filter(query: string): void;
  nextPage(): void;
  prevPage(): void;
}

export function registerDataTable(): void {
  Alpine.data('dataTable', (initialRows: unknown = []) => {
    const rows: TableRow[] = Array.isArray(initialRows) ? initialRows as TableRow[] : [];

    const component: DataTableComponent = {
      allRows: rows,
      rows: [...rows],
      sortCol: '',
      sortDir: 'asc' as SortDirection,
      searchQuery: '',
      page: 1,
      perPage: 10,

      sort(col: string) {
        if (this.sortCol === col) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortCol = col;
          this.sortDir = 'asc';
        }

        this.rows = [...this.rows].sort((a: TableRow, b: TableRow) => {
          const va = a[col] ?? '';
          const vb = b[col] ?? '';
          const cmp = typeof va === 'number' && typeof vb === 'number'
            ? va - vb
            : String(va).localeCompare(String(vb), 'tr');
          return this.sortDir === 'asc' ? cmp : -cmp;
        });
      },

      filter(query: string) {
        this.searchQuery = query.toLowerCase();
        this.page = 1;

        if (!this.searchQuery) {
          this.rows = this.allRows;
          return;
        }

        this.rows = this.allRows.filter((r: TableRow) =>
          Object.values(r).some(v => String(v).toLowerCase().includes(this.searchQuery))
        );
      },

      get paged(): TableRow[] {
        const start = (this.page - 1) * this.perPage;
        return this.rows.slice(start, start + this.perPage);
      },

      get totalPages(): number {
        return Math.ceil(this.rows.length / this.perPage);
      },

      get showing(): string {
        const start = (this.page - 1) * this.perPage + 1;
        const end = Math.min(this.page * this.perPage, this.rows.length);
        return `${start}-${end} / ${this.rows.length}`;
      },

      nextPage() {
        if (this.page < this.totalPages) this.page++;
      },

      prevPage() {
        if (this.page > 1) this.page--;
      },
    };
    return component as unknown as Record<string, unknown>;
  });
}
