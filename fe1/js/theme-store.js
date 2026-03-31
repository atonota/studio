"use strict";
(() => {
  // src/core/event-bus.ts
  function createEventBus() {
    const listeners = {};
    return {
      on(event, cb) {
        (listeners[event] = listeners[event] || []).push(cb);
      },
      off(event, cb) {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((f) => f !== cb);
        }
      },
      emit(event, payload) {
        (listeners[event] || []).forEach((cb) => {
          try {
            cb(payload);
          } catch (e) {
            console.error(`EventBus[${event}]:`, e);
          }
        });
      }
    };
  }

  // src/domain/theme/HistoryManager.ts
  var HistoryManager = class {
    stack = [];
    index = -1;
    locked = false;
    maxSize;
    constructor(maxSize = 20) {
      this.maxSize = maxSize;
    }
    /** Push current state snapshot. Truncates redo branch. */
    push(state2) {
      if (this.locked) return;
      if (this.index < this.stack.length - 1) {
        this.stack = this.stack.slice(0, this.index + 1);
      }
      this.stack.push(JSON.stringify(state2));
      if (this.stack.length > this.maxSize) this.stack.shift();
      this.index = this.stack.length - 1;
    }
    /** Undo — returns previous state or null if at beginning. */
    undo() {
      if (this.index <= 0) return null;
      this.index--;
      return JSON.parse(this.stack[this.index]);
    }
    /** Redo — returns next state or null if at end. */
    redo() {
      if (this.index >= this.stack.length - 1) return null;
      this.index++;
      return JSON.parse(this.stack[this.index]);
    }
    /** Lock history (prevent pushes during undo/redo apply). */
    lock() {
      this.locked = true;
    }
    /** Unlock history. */
    unlock() {
      this.locked = false;
    }
    get canUndo() {
      return this.index > 0;
    }
    get canRedo() {
      return this.index < this.stack.length - 1;
    }
    get currentIndex() {
      return this.index;
    }
  };

  // src/app/stores/theme/presets.ts
  var FONTS = [
    { key: "system", label: "System UI", stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", cdn: null },
    { key: "inter", label: "Inter", stack: "'Inter', sans-serif", cdn: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" },
    { key: "ibm", label: "IBM Plex Sans", stack: "'IBM Plex Sans', sans-serif", cdn: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" },
    { key: "nunito", label: "Nunito", stack: "'Nunito', sans-serif", cdn: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap" }
  ];
  var CODE_FONTS = [
    { key: "jetbrains", label: "JetBrains Mono", stack: "'JetBrains Mono', ui-monospace, monospace", cdn: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" },
    { key: "fira", label: "Fira Code", stack: "'Fira Code', ui-monospace, monospace", cdn: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap" },
    { key: "mono", label: "System Mono", stack: "ui-monospace, 'SF Mono', monospace", cdn: null }
  ];
  var EASING_PRESETS = [
    { key: "material", label: "Material", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
    { key: "bounce", label: "Bounce", value: "cubic-bezier(0.34, 1.08, 0.64, 1)" },
    { key: "snappy", label: "Snappy", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
    { key: "linear", label: "Linear", value: "linear" },
    { key: "ease", label: "Ease", value: "ease" }
  ];
  var THEME_PRESETS = [
    { key: "default", label: "Varsayilan", desc: "Standart atonota gorunumu" },
    { key: "minimal", label: "Sade", desc: "Duz yuzeyler, az golge, keskin kenarlar" },
    { key: "glass", label: "Cam", desc: "Yumusak kenarlar, yuksek blur, cam efekti" },
    { key: "compact", label: "Kompakt", desc: "Kucuk font, dar bosluk, yogun bilgi" },
    { key: "contrast", label: "Yuksek Kontrast", desc: "Koyu tonlar, keskin kenarlar, belirgin golgeler" }
  ];
  var DEFAULTS = {
    fontFamily: "system",
    fontSize: 15,
    fontWeightBody: 300,
    fontWeightHeading: 600,
    letterSpacing: 0.01,
    lineHeight: 1.5,
    fontCode: "jetbrains",
    railW: 96,
    wideW: 260,
    topH: 96,
    contentPadding: 1,
    contentMaxW: "none",
    compact: false,
    sidebarDefault: "collapsed",
    radius: 10,
    shadowScale: 1,
    cardStyle: "elevated",
    buttonStyle: "rounded",
    inputStyle: "bordered",
    motionScale: 1,
    motionEasing: "material",
    reducedMotion: false,
    skeletonAnim: true,
    entranceAnim: true,
    glassOpacity: 0.04,
    backdropOpacity: 0.5,
    panelOpacity: 0.55,
    customCss: ""
  };
  var CATEGORIES = {
    typography: ["fontFamily", "fontSize", "fontWeightBody", "fontWeightHeading", "letterSpacing", "lineHeight", "fontCode"],
    layout: ["railW", "wideW", "topH", "contentPadding", "contentMaxW", "compact", "sidebarDefault"],
    components: ["radius", "shadowScale", "cardStyle", "buttonStyle", "inputStyle"],
    motion: ["motionScale", "motionEasing", "reducedMotion", "skeletonAnim", "entranceAnim"],
    glass: ["glassOpacity", "backdropOpacity", "panelOpacity"]
  };
  var VALID_ENUMS = {
    cardStyle: ["flat", "elevated", "glass"],
    buttonStyle: ["rounded", "pill", "sharp"],
    inputStyle: ["bordered", "filled", "underline"],
    motionEasing: ["material", "bounce", "snappy", "linear", "ease"],
    contentMaxW: ["none", "1200px", "1400px", "1600px"],
    sidebarDefault: ["open", "collapsed"]
  };

  // src/app/stores/theme/state.ts
  var bus = createEventBus();
  var on = bus.on;
  var off = bus.off;
  var emit = bus.emit;
  var state = JSON.parse(JSON.stringify(DEFAULTS));

  // src/app/stores/theme/apply.ts
  var R = document.documentElement;
  function loadFont(key, presets) {
    const p = presets.find((f) => f.key === key) ?? presets[0];
    if (!p) return "";
    if (p.cdn && !document.getElementById("font-" + key)) {
      const link = document.createElement("link");
      link.id = "font-" + key;
      link.rel = "stylesheet";
      link.href = p.cdn;
      document.head.appendChild(link);
    }
    return p.stack;
  }
  function validateCss(css) {
    const dangerous = /@import|url\s*\(|expression\s*\(|javascript:|behavior\s*:|data\s*:|vbscript\s*:/gi;
    return css.replace(dangerous, "/* blocked */");
  }

  // src/domain/theme/ThemeStore.ts
  var PREFIX = "ap_";
  var R2 = document.documentElement;
  var ThemeStore = class {
    state;
    bus = createEventBus();
    history = new HistoryManager();
    constructor() {
      this.state = JSON.parse(JSON.stringify(DEFAULTS));
    }
    // ── Public API ──────────────────────────
    apply() {
      this.load();
      this.applyAll();
      this.history.push(this.state);
      this.bus.emit("any-change", { state: this.getState() });
    }
    getState() {
      return JSON.parse(JSON.stringify(this.state));
    }
    getDefaults() {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
    set(key, value) {
      if (!(key in this.state)) return;
      if (VALID_ENUMS[key] && VALID_ENUMS[key].indexOf(String(value)) === -1) return;
      this.history.push(this.state);
      this.state[key] = value;
      this.save();
      this.applyAll();
      this.bus.emit(key + "-change", { key, value });
      this.bus.emit("any-change", { state: this.getState() });
    }
    resetAll() {
      this.history.push(this.state);
      this.state = JSON.parse(JSON.stringify(DEFAULTS));
      this.save();
      this.applyAll();
      this.bus.emit("reset", {});
      this.bus.emit("any-change", { state: this.getState() });
    }
    resetCategory(cat) {
      const keys = CATEGORIES[cat];
      if (!keys) return;
      this.history.push(this.state);
      keys.forEach((k) => {
        this.state[k] = DEFAULTS[k];
      });
      this.save();
      this.applyAll();
      this.bus.emit("category-reset", { category: cat });
      this.bus.emit("any-change", { state: this.getState() });
    }
    getChangedKeys() {
      return Object.keys(DEFAULTS).filter(
        (k) => JSON.stringify(this.state[k]) !== JSON.stringify(DEFAULTS[k])
      );
    }
    undo() {
      const prev = this.history.undo();
      if (!prev) return false;
      this.history.lock();
      this.state = prev;
      this.save();
      this.applyAll();
      this.history.unlock();
      this.bus.emit("undo", { index: this.history.currentIndex });
      this.bus.emit("any-change", { state: this.getState() });
      return true;
    }
    redo() {
      const next = this.history.redo();
      if (!next) return false;
      this.history.lock();
      this.state = next;
      this.save();
      this.applyAll();
      this.history.unlock();
      this.bus.emit("redo", { index: this.history.currentIndex });
      this.bus.emit("any-change", { state: this.getState() });
      return true;
    }
    canUndo() {
      return this.history.canUndo;
    }
    canRedo() {
      return this.history.canRedo;
    }
    on(event, cb) {
      this.bus.on(event, cb);
    }
    off(event, cb) {
      this.bus.off(event, cb);
    }
    exportTheme() {
      const data = { _schema: "2", _exported: (/* @__PURE__ */ new Date()).toISOString(), _platform: "atonota-studio" };
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX)) data[k] = localStorage.getItem(k);
      }
      return JSON.stringify(data, null, 2);
    }
    importTheme(json) {
      try {
        const data = JSON.parse(json);
        this.history.push(this.state);
        let count = 0;
        Object.keys(data).forEach((k) => {
          if (k.startsWith(PREFIX)) {
            localStorage.setItem(k, data[k] ?? "");
            count++;
          }
        });
        this.load();
        this.applyAll();
        if (window.AppearanceStore) window.AppearanceStore.apply();
        this.bus.emit("import", { count });
        this.bus.emit("any-change", { state: this.getState() });
        return { ok: true, count };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }
    applyPreset(key) {
      const presets = {
        "default": {},
        "minimal": { radius: 2, shadowScale: 0, glassOpacity: 0, motionScale: 0.5, cardStyle: "flat", buttonStyle: "sharp", inputStyle: "underline" },
        "glass": { radius: 16, shadowScale: 0.5, glassOpacity: 0.08, backdropOpacity: 0.6, cardStyle: "glass", buttonStyle: "rounded", inputStyle: "filled" },
        "compact": { fontSize: 13, railW: 72, wideW: 200, topH: 64, compact: true, contentPadding: 0.75, buttonStyle: "sharp", inputStyle: "filled" },
        "contrast": { radius: 4, shadowScale: 1.5, fontSize: 16, fontWeightBody: 400, cardStyle: "elevated", buttonStyle: "sharp", inputStyle: "bordered" }
      };
      const p = presets[key];
      if (!p) return;
      this.history.push(this.state);
      this.state = JSON.parse(JSON.stringify(DEFAULTS));
      Object.entries(p).forEach(([k, v]) => {
        this.state[k] = v;
      });
      this.save();
      this.applyAll();
      this.bus.emit("preset-change", { key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    // ── Private ──────────────────────────
    load() {
      try {
        const g = (k, d) => localStorage.getItem(PREFIX + k) || d;
        const gi = (k, d) => {
          const v = parseInt(localStorage.getItem(PREFIX + k) || "", 10);
          return isNaN(v) ? d : v;
        };
        const gf = (k, d) => {
          const v = parseFloat(localStorage.getItem(PREFIX + k) || "");
          return isNaN(v) ? d : v;
        };
        const gb = (k, d, inv = false) => {
          const raw = localStorage.getItem(PREFIX + k);
          if (raw === null) return d;
          return inv ? raw !== "false" : raw === "true";
        };
        const s = this.state;
        s.fontFamily = g("font_family", DEFAULTS.fontFamily);
        s.fontSize = gi("font_size", DEFAULTS.fontSize);
        s.fontWeightBody = gi("font_weight_body", DEFAULTS.fontWeightBody);
        s.fontWeightHeading = gi("font_weight_heading", DEFAULTS.fontWeightHeading);
        s.letterSpacing = gf("letter_spacing", DEFAULTS.letterSpacing);
        s.lineHeight = gf("line_height", DEFAULTS.lineHeight);
        s.fontCode = g("font_code", DEFAULTS.fontCode);
        s.railW = gi("rail_w", DEFAULTS.railW);
        s.wideW = gi("wide_w", DEFAULTS.wideW);
        s.topH = gi("top_h", DEFAULTS.topH);
        s.contentPadding = gf("content_padding", DEFAULTS.contentPadding);
        s.contentMaxW = g("content_max_w", DEFAULTS.contentMaxW);
        s.compact = gb("compact", DEFAULTS.compact);
        s.sidebarDefault = g("sidebar_default", DEFAULTS.sidebarDefault);
        s.radius = gi("radius", DEFAULTS.radius);
        s.shadowScale = gf("shadow_scale", DEFAULTS.shadowScale);
        s.cardStyle = g("card_style", DEFAULTS.cardStyle);
        s.buttonStyle = g("button_style", DEFAULTS.buttonStyle);
        s.inputStyle = g("input_style", DEFAULTS.inputStyle);
        s.motionScale = gf("motion_scale", DEFAULTS.motionScale);
        s.motionEasing = g("motion_easing", DEFAULTS.motionEasing);
        s.reducedMotion = gb("reduced_motion", DEFAULTS.reducedMotion);
        s.skeletonAnim = gb("skeleton_anim", DEFAULTS.skeletonAnim, true);
        s.entranceAnim = gb("entrance_anim", DEFAULTS.entranceAnim, true);
        s.glassOpacity = gf("glass_opacity", DEFAULTS.glassOpacity);
        s.backdropOpacity = gf("backdrop_opacity", DEFAULTS.backdropOpacity);
        s.panelOpacity = gf("panel_opacity", DEFAULTS.panelOpacity);
        s.customCss = g("custom_css", "");
      } catch {
      }
    }
    save() {
      try {
        const s = this.state;
        const entries = [
          ["font_family", s.fontFamily],
          ["font_size", String(s.fontSize)],
          ["font_weight_body", String(s.fontWeightBody)],
          ["font_weight_heading", String(s.fontWeightHeading)],
          ["letter_spacing", String(s.letterSpacing)],
          ["line_height", String(s.lineHeight)],
          ["font_code", s.fontCode],
          ["rail_w", String(s.railW)],
          ["wide_w", String(s.wideW)],
          ["top_h", String(s.topH)],
          ["content_padding", String(s.contentPadding)],
          ["content_max_w", s.contentMaxW],
          ["compact", String(s.compact)],
          ["sidebar_default", s.sidebarDefault],
          ["radius", String(s.radius)],
          ["shadow_scale", String(s.shadowScale)],
          ["card_style", s.cardStyle],
          ["button_style", s.buttonStyle],
          ["input_style", s.inputStyle],
          ["motion_scale", String(s.motionScale)],
          ["motion_easing", s.motionEasing],
          ["reduced_motion", String(s.reducedMotion)],
          ["skeleton_anim", String(s.skeletonAnim)],
          ["entrance_anim", String(s.entranceAnim)],
          ["glass_opacity", String(s.glassOpacity)],
          ["backdrop_opacity", String(s.backdropOpacity)],
          ["panel_opacity", String(s.panelOpacity)]
        ];
        entries.forEach(([k, v]) => localStorage.setItem(PREFIX + k, v));
        if (s.customCss) localStorage.setItem(PREFIX + "custom_css", s.customCss);
        else localStorage.removeItem(PREFIX + "custom_css");
      } catch {
      }
    }
    applyAll() {
      const s = this.state;
      R2.style.setProperty("--font-family-body", loadFont(s.fontFamily, FONTS));
      R2.style.setProperty("--font-family-code", loadFont(s.fontCode, CODE_FONTS));
      R2.style.setProperty("--font-size-base", s.fontSize + "px");
      R2.style.setProperty("--font-scale", String(s.fontSize / 15));
      R2.style.setProperty("--font-weight-body", String(s.fontWeightBody));
      R2.style.setProperty("--font-weight-heading", String(s.fontWeightHeading));
      R2.style.setProperty("--letter-spacing-base", s.letterSpacing + "em");
      R2.style.setProperty("--line-height-base", String(s.lineHeight));
      R2.style.setProperty("--rail-w", s.railW + "px");
      R2.style.setProperty("--wide-w", s.wideW + "px");
      R2.style.setProperty("--top-h", s.topH + "px");
      R2.style.setProperty("--content-padding-scale", String(s.contentPadding));
      R2.style.setProperty("--content-max-w", s.contentMaxW);
      R2.style.setProperty("--spacing-scale", s.compact ? "0.8" : "1");
      R2.style.setProperty("--radius-base", s.radius + "px");
      R2.style.setProperty("--radius-sm", Math.round(s.radius * 0.6) + "px");
      R2.style.setProperty("--radius-lg", Math.round(s.radius * 1.4) + "px");
      R2.style.setProperty("--radius-xl", Math.round(s.radius * 1.6) + "px");
      R2.style.setProperty("--shadow-scale", String(s.shadowScale));
      R2.setAttribute("data-card-style", s.cardStyle);
      R2.setAttribute("data-button-style", s.buttonStyle);
      R2.setAttribute("data-input-style", s.inputStyle);
      R2.style.setProperty("--motion-scale", String(s.motionScale));
      const easing = EASING_PRESETS.find((e) => e.key === s.motionEasing) ?? EASING_PRESETS[0];
      R2.style.setProperty("--motion-easing", easing?.value ?? "cubic-bezier(0.4, 0, 0.2, 1)");
      R2.style.setProperty("--glass-opacity", String(s.glassOpacity));
      R2.style.setProperty("--backdrop-opacity", String(s.backdropOpacity));
      const isDark = R2.classList.contains("dark");
      R2.style.setProperty("--color-glass-panel", isDark ? `rgba(30,26,20,${s.panelOpacity.toFixed(2)})` : `rgba(255,255,255,${s.panelOpacity.toFixed(2)})`);
      let styleEl = document.getElementById("ap-custom-css");
      if (s.customCss) {
        const safeCss = validateCss(s.customCss);
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "ap-custom-css";
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = safeCss;
      } else if (styleEl) {
        styleEl.remove();
      }
    }
    // ── Compat ──────────────────────────
    toAPI() {
      return {
        apply: () => this.apply(),
        getState: () => this.getState(),
        getDefaults: () => this.getDefaults(),
        set: (k, v) => this.set(k, v),
        resetAll: () => this.resetAll(),
        resetCategory: (c) => this.resetCategory(c),
        getChangedKeys: () => this.getChangedKeys(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        canUndo: () => this.canUndo(),
        canRedo: () => this.canRedo(),
        exportTheme: () => this.exportTheme(),
        importTheme: (j) => this.importTheme(j),
        applyPreset: (k) => this.applyPreset(k),
        on: (e, cb) => this.on(e, cb),
        off: (e, cb) => this.off(e, cb),
        FONTS,
        CODE_FONTS,
        EASING_PRESETS,
        THEME_PRESETS,
        CATEGORIES,
        DEFAULTS
      };
    }
  };

  // src/app/stores/theme/index.ts
  var instance = new ThemeStore();
  window.ThemeStore = instance.toAPI();
})();
