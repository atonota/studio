"use strict";
(() => {
  // src/features/auto/responsive-grid.ts
  var MEDIUM_BREAKPOINT = 800;
  var SMALL_BREAKPOINT = 500;
  var SIDEBAR_TOGGLE_DELAY_MS = 350;
  var INITIAL_DELAY_MS = 100;
  var MAX_REPEAT_COLS = 2;
  function fixGrids() {
    const main = document.getElementById("main");
    const w = main ? main.clientWidth : window.innerWidth;
    const grids = document.querySelectorAll(
      '#main [style*="grid-template-columns"]'
    );
    grids.forEach((el) => {
      const orig = el.dataset.origGrid || el.style.gridTemplateColumns;
      if (!el.dataset.origGrid) el.dataset.origGrid = orig;
      if (w < SMALL_BREAKPOINT) {
        el.style.gridTemplateColumns = "1fr";
        return;
      }
      if (w < MEDIUM_BREAKPOINT) {
        const match = orig.match(/repeat\((\d+)/);
        const cols = match ? parseInt(match[1] ?? "0", 10) : 0;
        el.style.gridTemplateColumns = cols > MAX_REPEAT_COLS ? "repeat(2,1fr)" : orig;
        return;
      }
      el.style.gridTemplateColumns = orig;
    });
  }
  window.fixGrids = fixGrids;
  window.addEventListener("DOMContentLoaded", () => setTimeout(fixGrids, INITIAL_DELAY_MS));
  var _resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(fixGrids, 100);
  });
  new MutationObserver(() => setTimeout(fixGrids, SIDEBAR_TOGGLE_DELAY_MS)).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // src/features/auto/display-fix.ts
  var OBSERVED_DISPLAY_VALUES = /* @__PURE__ */ new Set(["grid", "flex", "inline-flex"]);
  var observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName !== "style") continue;
      const el = mutation.target;
      if (!el.dataset.display) continue;
      if (el.style.display === "none") continue;
      if (el.style.display === el.dataset.display) continue;
      el.style.display = el.dataset.display;
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[x-show]");
    elements.forEach((el) => {
      const computed = getComputedStyle(el);
      const display = el.style.display || computed.display;
      if (!OBSERVED_DISPLAY_VALUES.has(display)) return;
      el.dataset.display = display;
      observer.observe(el, { attributes: true, attributeFilter: ["style"] });
    });
  });

  // src/features/auto/skeleton.ts
  var SKELETON_DELAY_MIN = 300;
  var SKELETON_DELAY_MAX = 600;
  var STAGGER_MS = 50;
  var FADE_MS = 300;
  var SKELETON_TEMPLATES = {
    dashboard: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div class="skel-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sp-4);margin-bottom:var(--sp-6)"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);margin-bottom:var(--sp-6)"><div class="skeleton skeleton-chart"></div><div class="skeleton skeleton-chart"></div></div>
    <div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div>`,
    table: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;border-radius:var(--r-md)"></div>`,
    tool: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md);margin-bottom:var(--sp-4)"></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-4)"><div class="skeleton" style="flex:1;height:32px;border-radius:var(--r-sm)"></div><div class="skeleton" style="width:100px;height:32px;border-radius:var(--r-sm)"></div></div>
    <div class="skeleton skeleton-chart" style="margin-bottom:var(--sp-6)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;border-radius:var(--r-md)"></div>`,
    chat: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:180px;height:36px;border-radius:var(--r-md)"></div><div class="skeleton" style="width:180px;height:36px;border-radius:var(--r-md)"></div></div>
    <div class="skeleton" style="width:65%;height:60px;border-radius:var(--r-lg);margin-bottom:var(--sp-4)"></div>
    <div class="skeleton" style="width:70%;height:80px;border-radius:var(--r-lg);margin-bottom:var(--sp-4);margin-left:auto"></div>
    <div class="skeleton" style="width:60%;height:60px;border-radius:var(--r-lg);margin-bottom:var(--sp-6)"></div>
    <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>`,
    form: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;flex-direction:column;gap:var(--sp-4);max-width:640px">
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:100px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:120px;height:40px;border-radius:var(--r-md)"></div>
    </div>`,
    cards: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div></div>
    <div class="skel-grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-4)"><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div></div>`
  };
  function isSkeletonType(value) {
    return value in SKELETON_TEMPLATES;
  }
  function initSkeleton() {
    document.addEventListener("DOMContentLoaded", () => {
      const main = document.getElementById("main");
      if (!main) return;
      if (!document.getElementById("rail")) return;
      if (localStorage.getItem("ap_skeleton_anim") === "false") return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const skelTypeRaw = main.dataset.skeleton || "dashboard";
      const skelType = isSkeletonType(skelTypeRaw) ? skelTypeRaw : "dashboard";
      const template = SKELETON_TEMPLATES[skelType];
      const skel = document.createElement("div");
      skel.id = "skeleton-overlay";
      skel.style.cssText = `position:absolute;top:0;left:0;right:0;padding:var(--sp-6) var(--sp-4);z-index:10;transition:opacity ${FADE_MS}ms ease`;
      skel.innerHTML = template;
      main.style.position = "relative";
      const children = Array.from(main.children);
      children.forEach((c) => {
        c.style.opacity = "0";
        c.style.transition = `opacity ${FADE_MS}ms ease`;
      });
      main.insertBefore(skel, main.firstChild);
      const loadTime = SKELETON_DELAY_MIN + Math.random() * (SKELETON_DELAY_MAX - SKELETON_DELAY_MIN);
      setTimeout(() => {
        skel.style.opacity = "0";
        setTimeout(() => {
          try {
            skel.remove();
          } catch (e) {
            console.warn("Skeleton: remove failed", e);
          }
          try {
            main.style.position = "";
          } catch (e) {
            console.warn("Skeleton: position restore failed", e);
          }
          children.forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = "1";
            }, i * STAGGER_MS);
          });
        }, FADE_MS);
      }, loadTime);
    });
  }

  // src/features/auto/chart-skeleton.ts
  var CHART_TIMEOUT_MS = 5e3;
  function initChartSkeleton() {
    document.addEventListener("DOMContentLoaded", () => {
      if (localStorage.getItem("ap_skeleton_anim") === "false") return;
      const charts = document.querySelectorAll('[id^="chart-"]');
      charts.forEach((el) => {
        if (el.offsetHeight <= 0) return;
        if (el.querySelector("canvas")) return;
        el.classList.add("skeleton", "skeleton-chart");
        const obs = new MutationObserver(() => {
          if (!el.querySelector("canvas")) return;
          el.classList.remove("skeleton", "skeleton-chart");
          obs.disconnect();
          clearTimeout(timeout);
        });
        const timeout = setTimeout(() => {
          el.classList.remove("skeleton", "skeleton-chart");
          obs.disconnect();
        }, CHART_TIMEOUT_MS);
        obs.observe(el, { childList: true, subtree: true });
      });
    });
  }

  // src/features/auto/pagination.ts
  function initPagination() {
    document.addEventListener("DOMContentLoaded", () => {
      const containers = document.querySelectorAll("[data-paginate]");
      containers.forEach((container) => {
        const perPage = parseInt(container.dataset.paginate || "20", 10) || 20;
        const table = container.querySelector("table");
        if (!table) return;
        const tbody = table.querySelector("tbody");
        if (!tbody) return;
        const allRows = Array.from(tbody.querySelectorAll("tr"));
        if (allRows.length <= perPage) return;
        let page = 1;
        const totalPages = Math.ceil(allRows.length / perPage);
        const pBar = document.createElement("div");
        pBar.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);font-size:0.8125rem;color:var(--muted)";
        container.appendChild(pBar);
        function render() {
          const start = (page - 1) * perPage;
          const end = Math.min(start + perPage, allRows.length);
          allRows.forEach((r, i) => {
            r.style.display = i >= start && i < end ? "" : "none";
          });
          const prevDisabled = page <= 1;
          const nextDisabled = page >= totalPages;
          const disabledStyle = "opacity:0.4;cursor:not-allowed";
          const baseBtn = "padding:6px 12px;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:inherit;border:1px solid var(--border);background:var(--surface-2);color:var(--muted)";
          pBar.innerHTML = `
          <span>${start + 1}-${end} / ${allRows.length} sonuc</span>
          <div style="display:flex;gap:6px">
            <button onclick="this.closest('[data-paginate]').__pgPrev()" ${prevDisabled ? "disabled" : ""} style="${baseBtn};${prevDisabled ? disabledStyle : ""}">Onceki</button>
            <span style="padding:6px 8px;font-size:0.75rem;color:var(--text)">${page}/${totalPages}</span>
            <button onclick="this.closest('[data-paginate]').__pgNext()" ${nextDisabled ? "disabled" : ""} style="${baseBtn};${nextDisabled ? disabledStyle : ""}">Sonraki</button>
          </div>`;
        }
        const pgContainer = container;
        pgContainer.__pgPrev = () => {
          if (page > 1) {
            page--;
            render();
          }
        };
        pgContainer.__pgNext = () => {
          if (page < totalPages) {
            page++;
            render();
          }
        };
        render();
      });
    });
  }

  // src/features/auto/empty-state.ts
  var EMPTY_MESSAGES = {
    seo: {
      icon: "ph-chart-line-up",
      title: "Henuz SEO verisi yok",
      desc: "Bir workspace ekleyin ve ilk site denetimini baslatin.",
      action: "Workspace Ekle",
      href: "workspace-create.html"
    },
    content: {
      icon: "ph-article",
      title: "Henuz icerik analiz edilmedi",
      desc: "Bir workspace ekleyerek icerik analizi baslatin.",
      action: "Workspace Ekle",
      href: "workspace-create.html"
    },
    ads: {
      icon: "ph-megaphone",
      title: "Henuz reklam hesabi bagli degil",
      desc: "Bir reklam platformu baglayarak kampanya yonetimine baslayin.",
      action: "Hesap Bagla",
      href: "ads-accounts.html"
    },
    analytics: {
      icon: "ph-chart-bar",
      title: "Henuz analitik verisi yok",
      desc: "Google Analytics veya atonota pixel entegrasyonunu yapin.",
      action: "Entegrasyon",
      href: "adapters.html"
    },
    competitors: {
      icon: "ph-binoculars",
      title: "Henuz rakip eklenmedi",
      desc: "Rakip domain ekleyerek rekabet analizine baslayin.",
      action: "Rakip Ekle",
      href: "competitors.html"
    },
    security: {
      icon: "ph-shield-check",
      title: "Henuz guvenlik taramasi yapilmadi",
      desc: "Ilk guvenlik taramasini baslatin.",
      action: "Tarama Baslat",
      href: "security-vulnerabilities.html"
    },
    adapters: {
      icon: "ph-plugs-connected",
      title: "Henuz platform bagli degil",
      desc: "83+ platformdan birini baglayarak baslayin.",
      action: "Platform Bagla",
      href: "adapter-connect.html"
    },
    reports: {
      icon: "ph-file-text",
      title: "Henuz rapor olusturulmadi",
      desc: "Ilk raporunuzu AI ile olusturun.",
      action: "Rapor Olustur",
      href: "report-create.html"
    },
    audit: {
      icon: "ph-clock-counter-clockwise",
      title: "Henuz audit kaydi yok",
      desc: "Sistem kullanildikca olaylar burada listelenir."
    },
    default: {
      icon: "ph-database",
      title: "Veri bulunamadi",
      desc: "Filtreleri degistirin veya yeni veri ekleyin."
    }
  };
  function getMessage(key) {
    return EMPTY_MESSAGES[key] ?? EMPTY_MESSAGES["default"];
  }
  function buildEmptyHTML(msg, actionHref) {
    const actionBtn = msg.action ? `<a href="${actionHref}" class="btn-primary" style="font-size:0.8125rem;padding:8px 16px">${msg.action}</a>` : "";
    return `<div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p>${actionBtn}</div>`;
  }
  function resolveHref(href) {
    if (!href) return "";
    const inPages = window.location.pathname.includes("/pages/");
    return inPages ? href : "pages/" + href;
  }
  function initEmptyState() {
    document.addEventListener("DOMContentLoaded", () => {
      const tables = document.querySelectorAll("table.r-table, table");
      tables.forEach((table) => {
        const tbody = table.querySelector("tbody");
        if (!tbody) return;
        if (tbody.querySelectorAll("tr").length > 0) return;
        const cols = table.querySelectorAll("thead th").length || 3;
        const key = window.__SHELL_KEY || "default";
        const msg = getMessage(key);
        const actionHref = resolveHref(msg.href);
        tbody.innerHTML = `<tr><td colspan="${cols}" style="padding:0">${buildEmptyHTML(msg, actionHref)}</td></tr>`;
      });
    });
    window.emptyStateHTML = function(key) {
      const msg = getMessage(key);
      return `<div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p></div>`;
    };
  }

  // src/features/alpine/wizard.ts
  function registerWizard() {
    Alpine.data("wizard", (totalSteps = 3) => {
      const total = typeof totalSteps === "number" ? totalSteps : 3;
      return {
        step: 1,
        total,
        next() {
          if (this.step < this.total) this.step++;
        },
        prev() {
          if (this.step > 1) this.step--;
        },
        goTo(n) {
          if (n < 1 || n > this.total) return;
          this.step = n;
        },
        isActive(n) {
          return this.step === n;
        },
        isCompleted(n) {
          return this.step > n;
        },
        isPending(n) {
          return this.step < n;
        },
        get isFirst() {
          return this.step === 1;
        },
        get isLast() {
          return this.step === this.total;
        },
        get progress() {
          return Math.round(this.step / this.total * 100);
        }
      };
    });
  }

  // src/features/alpine/tabs.ts
  function registerTabs() {
    Alpine.data("tabs", (defaultTab = "") => {
      const initial = typeof defaultTab === "string" ? defaultTab : "";
      return {
        active: initial,
        _tabKeys: [],
        select(id, focusPanel) {
          this.active = id;
          if (!focusPanel) return;
          this.$nextTick(() => {
            const panel = document.getElementById("tabpanel-" + id);
            if (panel) panel.focus();
          });
        },
        isActive(id) {
          return this.active === id;
        },
        registerTab(id) {
          if (this._tabKeys.indexOf(id) === -1) this._tabKeys.push(id);
        },
        handleTabKey(e, id) {
          const keys = this._tabKeys;
          if (!keys.length) return;
          const idx = keys.indexOf(id);
          let next = -1;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            next = (idx + 1) % keys.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            next = (idx - 1 + keys.length) % keys.length;
          } else if (e.key === "Home") {
            e.preventDefault();
            next = 0;
          } else if (e.key === "End") {
            e.preventDefault();
            next = keys.length - 1;
          }
          if (next < 0) return;
          this.active = keys[next] ?? "";
          this.$nextTick(() => {
            const btn = document.getElementById("tab-" + (keys[next] ?? ""));
            if (btn) btn.focus();
          });
        }
      };
    });
  }

  // src/features/alpine/data-table.ts
  function registerDataTable() {
    Alpine.data("dataTable", (initialRows = []) => {
      const rows = Array.isArray(initialRows) ? initialRows : [];
      const component = {
        allRows: rows,
        rows: [...rows],
        sortCol: "",
        sortDir: "asc",
        searchQuery: "",
        page: 1,
        perPage: 10,
        sort(col) {
          if (this.sortCol === col) {
            this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
          } else {
            this.sortCol = col;
            this.sortDir = "asc";
          }
          this.rows = [...this.rows].sort((a, b) => {
            const va = a[col] ?? "";
            const vb = b[col] ?? "";
            const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "tr");
            return this.sortDir === "asc" ? cmp : -cmp;
          });
        },
        filter(query) {
          this.searchQuery = query.toLowerCase();
          this.page = 1;
          if (!this.searchQuery) {
            this.rows = this.allRows;
            return;
          }
          this.rows = this.allRows.filter(
            (r) => Object.values(r).some((v) => String(v).toLowerCase().includes(this.searchQuery))
          );
        },
        get paged() {
          const start = (this.page - 1) * this.perPage;
          return this.rows.slice(start, start + this.perPage);
        },
        get totalPages() {
          return Math.ceil(this.rows.length / this.perPage);
        },
        get showing() {
          const start = (this.page - 1) * this.perPage + 1;
          const end = Math.min(this.page * this.perPage, this.rows.length);
          return `${start}-${end} / ${this.rows.length}`;
        },
        nextPage() {
          if (this.page < this.totalPages) this.page++;
        },
        prevPage() {
          if (this.page > 1) this.page--;
        }
      };
      return component;
    });
  }

  // src/features/alpine/select-card.ts
  function registerSelectCard() {
    Alpine.data("selectCard", (initial = null) => {
      const initialValue = typeof initial === "string" || typeof initial === "number" ? initial : null;
      return {
        selected: initialValue,
        select(id) {
          this.selected = this.selected === id ? null : id;
        },
        isSelected(id) {
          return this.selected === id;
        }
      };
    });
  }

  // src/features/alpine/form-validation.ts
  var SUBMIT_DELAY_MS = 1200;
  function registerForm() {
    Alpine.data("form", (initialFields = {}) => {
      const fieldsDef = initialFields !== null && typeof initialFields === "object" && !Array.isArray(initialFields) ? initialFields : {};
      const component = {
        fields: { ...fieldsDef },
        errors: {},
        submitted: false,
        submitting: false,
        validate() {
          this.errors = {};
          for (const [key, val] of Object.entries(this.fields)) {
            if (typeof val !== "string") continue;
            if (val.trim() !== "") continue;
            this.errors[key] = "Bu alan zorunlu";
          }
          return Object.keys(this.errors).length === 0;
        },
        hasError(key) {
          return !!this.errors[key];
        },
        getError(key) {
          return this.errors[key] || "";
        },
        submit() {
          if (!this.validate()) return;
          this.submitting = true;
          setTimeout(() => {
            this.submitting = false;
            this.submitted = true;
          }, SUBMIT_DELAY_MS);
        },
        reset() {
          this.fields = { ...fieldsDef };
          this.errors = {};
          this.submitted = false;
        }
      };
      return component;
    });
  }

  // src/features/alpine/micro-components.ts
  var FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  function registerToggle() {
    Alpine.data("toggle", (initial = false) => ({
      on: initial === true,
      flip() {
        this.on = !this.on;
      }
    }));
  }
  function registerModal() {
    Alpine.data("modal", () => ({
      isOpen: false,
      _trigger: null,
      open() {
        this._trigger = document.activeElement;
        this.isOpen = true;
        document.body.style.overflow = "hidden";
        this.$nextTick(() => {
          const el = this.$el.querySelector(
            `[autofocus], ${FOCUSABLE_SELECTOR}`
          );
          if (el) el.focus();
        });
      },
      close() {
        this.isOpen = false;
        document.body.style.overflow = "";
        if (!this._trigger) return;
        this._trigger.focus();
        this._trigger = null;
      },
      trapFocus(e) {
        if (!this.isOpen || e.key !== "Tab") return;
        const focusable = this.$el.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
          return;
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }));
  }
  function registerDropdown() {
    Alpine.data("dropdown", () => ({
      open: false,
      value: "",
      label: "",
      toggle() {
        this.open = !this.open;
      },
      select(val, lbl) {
        this.value = val;
        this.label = lbl;
        this.open = false;
      },
      close() {
        this.open = false;
      }
    }));
  }
  function registerMultiSelect() {
    Alpine.data("multiSelect", (initial = []) => {
      const list = Array.isArray(initial) ? initial : [];
      const component = {
        selected: [...list],
        toggle(id) {
          const i = this.selected.indexOf(id);
          if (i >= 0) {
            this.selected.splice(i, 1);
          } else {
            this.selected.push(id);
          }
        },
        isSelected(id) {
          return this.selected.includes(id);
        },
        get count() {
          return this.selected.length;
        }
      };
      return component;
    });
  }
  function registerCounter() {
    Alpine.data("counter", (target = 0, duration = 800) => {
      const targetNum = typeof target === "number" ? target : 0;
      const durationMs = typeof duration === "number" ? duration : 800;
      const component = {
        current: 0,
        target: targetNum,
        display: "0",
        init() {
          const self = this;
          const start = performance.now();
          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            self.current = Math.floor(progress * self.target);
            self.display = self.current.toLocaleString("tr-TR");
            if (progress < 1) {
              requestAnimationFrame(step);
              return;
            }
            self.display = self.target.toLocaleString("tr-TR");
          };
          requestAnimationFrame(step);
        }
      };
      return component;
    });
  }
  function registerFilterPills() {
    Alpine.data("filterPills", (defaultVal = "", options = []) => {
      const defaultStr = typeof defaultVal === "string" ? defaultVal : "";
      const optList = Array.isArray(options) ? options : [];
      const component = {
        active: defaultStr,
        options: optList,
        select(val) {
          this.active = val;
        },
        isActive(val) {
          return this.active === val;
        }
      };
      return component;
    });
  }
  function registerAccordion() {
    Alpine.data("accordion", (openIndex = -1) => {
      const idx = typeof openIndex === "number" ? openIndex : -1;
      const component = {
        openIdx: idx,
        toggle(i) {
          this.openIdx = this.openIdx === i ? -1 : i;
        },
        isOpen(i) {
          return this.openIdx === i;
        }
      };
      return component;
    });
  }
  function registerCopyText() {
    Alpine.magic("copyText", () => {
      return (text) => {
        navigator.clipboard.writeText(text).then(() => {
          const store = Alpine.store("toast");
          store.show("Kopyalandi!", "success", 2e3);
        });
      };
    });
  }
  function registerMicroComponents() {
    registerToggle();
    registerModal();
    registerDropdown();
    registerMultiSelect();
    registerCounter();
    registerFilterPills();
    registerAccordion();
    registerCopyText();
  }

  // src/features/alpine/stores.ts
  var DEFAULT_TOAST_DURATION = 4e3;
  var TOAST_ICONS = {
    success: "ph-check-circle",
    error: "ph-x-circle",
    warning: "ph-warning",
    info: "ph-info"
  };
  var TOAST_COLORS = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#eab308",
    info: "#3b82f6"
  };
  function registerToastStore() {
    Alpine.store("toast", {
      visible: false,
      message: "",
      type: "info",
      timeout: null,
      ariaLive: "assertive",
      show(msg, type = "info", duration = DEFAULT_TOAST_DURATION) {
        this.message = msg;
        this.type = type;
        this.visible = true;
        ensureAriaLiveRegion(msg);
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = false;
        }, duration);
      },
      hide() {
        this.visible = false;
      },
      get icon() {
        return TOAST_ICONS[this.type] || TOAST_ICONS.info;
      },
      get color() {
        return TOAST_COLORS[this.type] || TOAST_COLORS.info;
      }
    });
  }
  function ensureAriaLiveRegion(msg) {
    let region = document.getElementById("ap-toast-live");
    if (!region) {
      region = document.createElement("div");
      region.id = "ap-toast-live";
      region.setAttribute("aria-live", "assertive");
      region.setAttribute("aria-atomic", "true");
      region.setAttribute("role", "status");
      region.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)";
      document.body.appendChild(region);
    }
    region.textContent = msg;
  }
  function registerConfirmStore() {
    Alpine.store("confirm", {
      visible: false,
      message: "",
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
      no() {
        this.visible = false;
      }
    });
  }
  function injectStoreHTML() {
    const html = `
    <div x-data x-show="$store.toast.visible" x-cloak
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="ap-toast"
         @click="$store.toast.hide()">
      <i class="ph" :class="$store.toast.icon" :style="'color:'+$store.toast.color+';font-size:1.25rem;flex-shrink:0'"></i>
      <span style="font-size:0.8125rem;color:var(--text)" x-text="$store.toast.message"></span>
    </div>
    <div x-data x-show="$store.confirm.visible" x-cloak
         class="ap-confirm-backdrop"
         @click.self="$store.confirm.no()"
         x-transition:enter="transition ease-out duration-200"
         x-transition:leave="transition ease-in duration-150">
      <div style="background:var(--color-glass-panel);backdrop-filter:blur(var(--blur-level)) saturate(1.4);-webkit-backdrop-filter:blur(var(--blur-level)) saturate(1.4);border:1px solid var(--glass-border);border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.4)">
        <div style="font-size:0.9375rem;color:var(--text);margin-bottom:20px;line-height:1.5" x-text="$store.confirm.message"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button @click="$store.confirm.no()" class="btn-secondary" style="padding:8px 16px">Iptal</button>
          <button @click="$store.confirm.yes()" class="btn-primary" style="padding:8px 16px">Onayla</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
  }
  function registerStores() {
    registerToastStore();
    registerConfirmStore();
    injectStoreHTML();
  }

  // src/features/index.ts
  document.addEventListener("alpine:init", () => {
    registerWizard();
    registerTabs();
    registerDataTable();
    registerSelectCard();
    registerForm();
    registerMicroComponents();
    registerStores();
  });
  initSkeleton();
  initChartSkeleton();
  initPagination();
  initEmptyState();
})();
