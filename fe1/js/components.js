/* ═══════════════════════════════════════════
   atonota Studio — Interactive Components
   Alpine.js ile calisan reusable UI component'leri
   Her sayfa bu dosyayi yukler
═══════════════════════════════════════════ */

/* Fix: Alpine.js x-show kills display:grid/flex.
   MutationObserver restores original display when x-show makes element visible. */
(function(){
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.attributeName === 'style' && m.target.dataset.display) {
        const el = m.target;
        if (el.style.display !== 'none' && el.style.display !== el.dataset.display) {
          el.style.display = el.dataset.display;
        }
      }
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[x-show]').forEach(el => {
      const cs = getComputedStyle(el);
      const d = el.style.display || cs.display;
      if (d === 'grid' || d === 'flex' || d === 'inline-flex') {
        el.dataset.display = d;
        obs.observe(el, { attributes: true, attributeFilter: ['style'] });
      }
    });
  });
})();

document.addEventListener('alpine:init', () => {

  /* ── WIZARD ──────────────────────────────────
     Kullanim: x-data="wizard(3)" (3 adimli)
     Metodlar: next(), prev(), goTo(n), isActive(n), isCompleted(n)
  ──────────────────────────────────────────── */
  Alpine.data('wizard', (totalSteps = 3) => ({
    step: 1,
    total: totalSteps,
    next() { if (this.step < this.total) this.step++ },
    prev() { if (this.step > 1) this.step-- },
    goTo(n) { if (n >= 1 && n <= this.total) this.step = n },
    isActive(n) { return this.step === n },
    isCompleted(n) { return this.step > n },
    isPending(n) { return this.step < n },
    get isFirst() { return this.step === 1 },
    get isLast() { return this.step === this.total },
    get progress() { return Math.round((this.step / this.total) * 100) },
  }));

  /* ── TABS ────────────────────────────────────
     Kullanim: x-data="tabs('genel')"
     Metodlar: select(id), isActive(id)
  ──────────────────────────────────────────── */
  Alpine.data('tabs', (defaultTab = '') => ({
    active: defaultTab,
    select(id) { this.active = id },
    isActive(id) { return this.active === id },
  }));

  /* ── TABLE ───────────────────────────────────
     Kullanim: x-data="dataTable(rows)"
     rows = [{col1:'val', col2:'val', ...}]
     Metodlar: sort(col), filter(query), paginate()
  ──────────────────────────────────────────── */
  Alpine.data('dataTable', (initialRows = []) => ({
    allRows: initialRows,
    rows: initialRows,
    sortCol: '',
    sortDir: 'asc',
    searchQuery: '',
    page: 1,
    perPage: 10,

    sort(col) {
      if (this.sortCol === col) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortCol = col;
        this.sortDir = 'asc';
      }
      this.rows = [...this.rows].sort((a, b) => {
        const va = a[col] ?? '', vb = b[col] ?? '';
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'tr');
        return this.sortDir === 'asc' ? cmp : -cmp;
      });
    },

    filter(query) {
      this.searchQuery = query.toLowerCase();
      this.page = 1;
      if (!this.searchQuery) { this.rows = this.allRows; return; }
      this.rows = this.allRows.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(this.searchQuery))
      );
    },

    get paged() {
      const start = (this.page - 1) * this.perPage;
      return this.rows.slice(start, start + this.perPage);
    },
    get totalPages() { return Math.ceil(this.rows.length / this.perPage) },
    get showing() {
      const start = (this.page - 1) * this.perPage + 1;
      const end = Math.min(this.page * this.perPage, this.rows.length);
      return `${start}-${end} / ${this.rows.length}`;
    },
    nextPage() { if (this.page < this.totalPages) this.page++ },
    prevPage() { if (this.page > 1) this.page-- },
  }));

  /* ── TOGGLE ──────────────────────────────────
     Kullanim: x-data="toggle(true)"
  ──────────────────────────────────────────── */
  Alpine.data('toggle', (initial = false) => ({
    on: initial,
    flip() { this.on = !this.on },
  }));

  /* ── MODAL ───────────────────────────────────
     Kullanim: x-data="modal()"
     Metodlar: open(), close()
  ──────────────────────────────────────────── */
  Alpine.data('modal', () => ({
    isOpen: false,
    open() { this.isOpen = true; document.body.style.overflow = 'hidden' },
    close() { this.isOpen = false; document.body.style.overflow = '' },
  }));

  /* ── SELECT ──────────────────────────────────
     Kullanim: x-data="selectCard()"
     Metodlar: select(id), isSelected(id)
  ──────────────────────────────────────────── */
  Alpine.data('selectCard', (initial = null) => ({
    selected: initial,
    select(id) { this.selected = this.selected === id ? null : id },
    isSelected(id) { return this.selected === id },
  }));

  /* ── MULTI SELECT ────────────────────────────
     Kullanim: x-data="multiSelect(['a','b'])"
  ──────────────────────────────────────────── */
  Alpine.data('multiSelect', (initial = []) => ({
    selected: initial,
    toggle(id) {
      const i = this.selected.indexOf(id);
      if (i >= 0) this.selected.splice(i, 1);
      else this.selected.push(id);
    },
    isSelected(id) { return this.selected.includes(id) },
    get count() { return this.selected.length },
  }));

  /* ── DROPDOWN ────────────────────────────────
     Kullanim: x-data="dropdown()"
  ──────────────────────────────────────────── */
  Alpine.data('dropdown', () => ({
    open: false,
    value: '',
    label: '',
    toggle() { this.open = !this.open },
    select(val, lbl) { this.value = val; this.label = lbl; this.open = false },
    close() { this.open = false },
  }));

  /* ── FORM ────────────────────────────────────
     Kullanim: x-data="form({name:'', email:''})"
     Metodlar: validate(), submit(), reset()
  ──────────────────────────────────────────── */
  Alpine.data('form', (initialFields = {}) => ({
    fields: { ...initialFields },
    errors: {},
    submitted: false,
    submitting: false,

    validate() {
      this.errors = {};
      for (const [key, val] of Object.entries(this.fields)) {
        if (typeof val === 'string' && val.trim() === '') {
          this.errors[key] = 'Bu alan zorunlu';
        }
      }
      return Object.keys(this.errors).length === 0;
    },

    hasError(key) { return !!this.errors[key] },
    getError(key) { return this.errors[key] || '' },

    submit() {
      if (!this.validate()) return;
      this.submitting = true;
      // Simulate API call
      setTimeout(() => {
        this.submitting = false;
        this.submitted = true;
      }, 1200);
    },

    reset() {
      this.fields = { ...initialFields };
      this.errors = {};
      this.submitted = false;
    },
  }));

  /* ── TOAST ───────────────────────────────────
     Global toast notification
     Kullanim: $store.toast.show('Basarili!', 'success')
  ──────────────────────────────────────────── */
  Alpine.store('toast', {
    visible: false,
    message: '',
    type: 'info', // success, error, warning, info
    timeout: null,

    show(msg, type = 'info', duration = 3000) {
      this.message = msg;
      this.type = type;
      this.visible = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.visible = false }, duration);
    },

    hide() { this.visible = false },

    get icon() {
      const icons = { success: 'ph-check-circle', error: 'ph-x-circle', warning: 'ph-warning', info: 'ph-info' };
      return icons[this.type] || icons.info;
    },
    get color() {
      const colors = { success: '#22c55e', error: '#ef4444', warning: '#eab308', info: '#3b82f6' };
      return colors[this.type] || colors.info;
    },
  });

  /* ── CONFIRM ─────────────────────────────────
     Kullanim: $store.confirm.ask('Emin misiniz?', () => doSomething())
  ──────────────────────────────────────────── */
  Alpine.store('confirm', {
    visible: false,
    message: '',
    onConfirm: null,

    ask(msg, callback) {
      this.message = msg;
      this.onConfirm = callback;
      this.visible = true;
    },

    yes() {
      if (this.onConfirm) this.onConfirm();
      this.visible = false;
    },

    no() { this.visible = false },
  });

  /* ── FILTER PILLS ────────────────────────────
     Kullanim: x-data="filterPills('tumu', ['tumu','aktif','pasif'])"
  ──────────────────────────────────────────── */
  Alpine.data('filterPills', (defaultVal = '', options = []) => ({
    active: defaultVal,
    options: options,
    select(val) { this.active = val },
    isActive(val) { return this.active === val },
  }));

  /* ── ACCORDION ───────────────────────────────
     Kullanim: x-data="accordion(0)" (ilk item acik)
  ──────────────────────────────────────────── */
  Alpine.data('accordion', (openIndex = -1) => ({
    openIdx: openIndex,
    toggle(idx) { this.openIdx = this.openIdx === idx ? -1 : idx },
    isOpen(idx) { return this.openIdx === idx },
  }));

  /* ── COPY TO CLIPBOARD ──────────────────────
     Kullanim: @click="copyText('text')"
  ──────────────────────────────────────────── */
  Alpine.magic('copyText', () => {
    return (text) => {
      navigator.clipboard.writeText(text).then(() => {
        Alpine.store('toast').show('Kopyalandi!', 'success', 2000);
      });
    };
  });

  /* ── COUNTER ANIMATION ──────────────────────
     Kullanim: x-data="counter(24891)" x-text="display"
  ──────────────────────────────────────────── */
  Alpine.data('counter', (target = 0, duration = 800) => ({
    current: 0,
    target: target,
    display: '0',

    init() {
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        this.current = Math.floor(progress * this.target);
        this.display = this.current.toLocaleString('tr-TR');
        if (progress < 1) requestAnimationFrame(step);
        else this.display = this.target.toLocaleString('tr-TR');
      };
      requestAnimationFrame(step);
    },
  }));

});

/* ═══════════════════════════════════════════
   TOAST HTML — body'ye eklenir
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Toast container
  document.body.insertAdjacentHTML('beforeend', `
    <div x-data x-show="$store.toast.visible"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="position:fixed;bottom:80px;right:24px;z-index:600;display:flex;align-items:center;gap:10px;padding:12px 20px;background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);max-width:360px"
         @click="$store.toast.hide()">
      <i class="ph" :class="$store.toast.icon" :style="'color:'+$store.toast.color+';font-size:1.25rem;flex-shrink:0'"></i>
      <span style="font-size:0.8125rem;color:var(--text)" x-text="$store.toast.message"></span>
    </div>
  `);

  // Confirm dialog
  document.body.insertAdjacentHTML('beforeend', `
    <div x-data x-show="$store.confirm.visible"
         style="position:fixed;inset:0;z-index:550;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center"
         @click.self="$store.confirm.no()">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.4)">
        <div style="font-size:0.9375rem;color:var(--text);margin-bottom:20px;line-height:1.5" x-text="$store.confirm.message"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button @click="$store.confirm.no()" class="btn-secondary" style="padding:8px 16px">Iptal</button>
          <button @click="$store.confirm.yes()" class="btn-primary" style="padding:8px 16px">Onayla</button>
        </div>
      </div>
    </div>
  `);

  /* ── AUTO-PAGINATION ──────────────────────────────
     Automatically adds pagination to any table inside an element
     with [data-paginate] attribute.
     Usage: <div data-paginate="20"> ... <table class="r-table"> ... </div>
     No Alpine.js needed — pure vanilla JS.
  ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-paginate]').forEach(container => {
      const perPage = parseInt(container.dataset.paginate) || 20;
      const table = container.querySelector('table');
      if (!table) return;
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      const allRows = Array.from(tbody.querySelectorAll('tr'));
      if (allRows.length <= perPage) return; // no need

      let page = 1;
      const totalPages = Math.ceil(allRows.length / perPage);

      // Create pagination bar
      const pBar = document.createElement('div');
      pBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);font-size:0.8125rem;color:var(--muted)';
      container.appendChild(pBar);

      function render() {
        const start = (page-1)*perPage;
        const end = Math.min(start+perPage, allRows.length);
        allRows.forEach((r,i) => r.style.display = (i>=start && i<end) ? '' : 'none');
        pBar.innerHTML = `
          <span>${start+1}-${end} / ${allRows.length} sonuc</span>
          <div style="display:flex;gap:6px">
            <button onclick="this.closest('[data-paginate]').__pgPrev()" ${page<=1?'disabled':''} style="padding:6px 12px;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:inherit;border:1px solid var(--border);background:var(--surface-2);color:var(--muted);${page<=1?'opacity:0.4;cursor:not-allowed':''}">Onceki</button>
            <span style="padding:6px 8px;font-size:0.75rem;color:var(--text)">${page}/${totalPages}</span>
            <button onclick="this.closest('[data-paginate]').__pgNext()" ${page>=totalPages?'disabled':''} style="padding:6px 12px;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:inherit;border:1px solid var(--border);background:var(--surface-2);color:var(--muted);${page>=totalPages?'opacity:0.4;cursor:not-allowed':''}">Sonraki</button>
          </div>`;
      }
      container.__pgPrev = () => { if(page>1){page--;render()} };
      container.__pgNext = () => { if(page<totalPages){page++;render()} };
      render();
    });
  });

  /* ── EMPTY STATE ──────────────────────────────────
     Auto-inject empty state when Alpine.js filtered lists are empty.
     Also provides a global helper for pages to use.
     Usage in HTML:
       <div x-show="filtered.length === 0" class="empty-state">
         ... already handled by CSS class .empty-state in tokens.css
       </div>

     This auto-handler injects empty states into tables with 0 <tr> in <tbody>
     (static pages without Alpine.js) and into [data-empty] containers.
  ───────────────────────────────────────────────── */

  // Empty state messages per page section
  const EMPTY_MESSAGES = {
    seo:         {icon:'ph-chart-line-up', title:'Henuz SEO verisi yok', desc:'Bir workspace ekleyin ve ilk site denetimini baslatin.', action:'Workspace Ekle', href:'workspace-create.html'},
    content:     {icon:'ph-article', title:'Henuz icerik analiz edilmedi', desc:'Bir workspace ekleyerek icerik analizi baslatin.', action:'Workspace Ekle', href:'workspace-create.html'},
    ads:         {icon:'ph-megaphone', title:'Henuz reklam hesabi bagli degil', desc:'Bir reklam platformu baglayarak kampanya yonetimine baslayin.', action:'Hesap Bagla', href:'ads-accounts.html'},
    analytics:   {icon:'ph-chart-bar', title:'Henuz analitik verisi yok', desc:'Google Analytics veya atonota pixel entegrasyonunu yapin.', action:'Entegrasyon', href:'adapters.html'},
    competitors: {icon:'ph-binoculars', title:'Henuz rakip eklenmedi', desc:'Rakip domain ekleyerek rekabet analizine baslayin.', action:'Rakip Ekle', href:'competitors.html'},
    security:    {icon:'ph-shield-check', title:'Henuz guvenlik taramasi yapilmadi', desc:'Ilk guvenlik taramasini baslatin.', action:'Tarama Baslat', href:'security-vulnerabilities.html'},
    adapters:    {icon:'ph-plugs-connected', title:'Henuz platform bagli degil', desc:'83+ platformdan birini baglayarak baslayin.', action:'Platform Bagla', href:'adapter-connect.html'},
    reports:     {icon:'ph-file-text', title:'Henuz rapor olusturulmadi', desc:'Ilk raporunuzu AI ile olusturun.', action:'Rapor Olustur', href:'report-create.html'},
    audit:       {icon:'ph-clock-counter-clockwise', title:'Henuz audit kaydi yok', desc:'Sistem kullanildikca olaylar burada listelenir.'},
    default:     {icon:'ph-database', title:'Veri bulunamadi', desc:'Filtreleri degistirin veya yeni veri ekleyin.'},
  };

  // Auto-inject into empty static tables
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('table.r-table, table').forEach(table => {
      const tbody = table.querySelector('tbody');
      if (tbody && tbody.querySelectorAll('tr').length === 0) {
        const cols = table.querySelectorAll('thead th').length || 3;
        const key = window.__SHELL_KEY || 'default';
        const msg = EMPTY_MESSAGES[key] || EMPTY_MESSAGES.default;
        const inPages = window.location.pathname.includes('/pages/');
        const actionHref = msg.href ? (inPages ? msg.href : 'pages/' + msg.href) : '';
        tbody.innerHTML = `<tr><td colspan="${cols}" style="padding:0"><div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p>${msg.action ? `<a href="${actionHref}" class="btn-primary" style="font-size:0.8125rem;padding:8px 16px">${msg.action}</a>` : ''}</div></td></tr>`;
      }
    });
  });

  // Global helper function for Alpine.js pages
  window.emptyStateHTML = function(key) {
    const msg = EMPTY_MESSAGES[key] || EMPTY_MESSAGES.default;
    return `<div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p></div>`;
  };
});
