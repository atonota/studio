"use strict";
(() => {
  // src/app/stores/theme.store.ts
  var PREFIX = "ap_";
  var R = document.documentElement;
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
  var state = JSON.parse(JSON.stringify(DEFAULTS));
  function resetState() {
    state = JSON.parse(JSON.stringify(DEFAULTS));
  }
  var _history = [];
  var _historyIdx = -1;
  var _maxHistory = 20;
  var _historyLock = false;
  function pushHistory() {
    if (_historyLock) return;
    if (_historyIdx < _history.length - 1) {
      _history = _history.slice(0, _historyIdx + 1);
    }
    _history.push(JSON.stringify(state));
    if (_history.length > _maxHistory) _history.shift();
    _historyIdx = _history.length - 1;
  }
  function undo() {
    if (_historyIdx <= 0) return false;
    _historyIdx--;
    _historyLock = true;
    state = JSON.parse(_history[_historyIdx]);
    save();
    applyAll();
    _historyLock = false;
    emit("undo", { index: _historyIdx });
    emit("any-change", { state: getState() });
    return true;
  }
  function redo() {
    if (_historyIdx >= _history.length - 1) return false;
    _historyIdx++;
    _historyLock = true;
    state = JSON.parse(_history[_historyIdx]);
    save();
    applyAll();
    _historyLock = false;
    emit("redo", { index: _historyIdx });
    emit("any-change", { state: getState() });
    return true;
  }
  function canUndo() {
    return _historyIdx > 0;
  }
  function canRedo() {
    return _historyIdx < _history.length - 1;
  }
  var listeners = {};
  function on(ev, cb) {
    (listeners[ev] = listeners[ev] || []).push(cb);
  }
  function off(ev, cb) {
    if (listeners[ev]) listeners[ev] = listeners[ev].filter((f) => f !== cb);
  }
  function emit(ev, payload) {
    (listeners[ev] || []).forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error("ThemeStore event error:", e);
      }
    });
  }
  function load() {
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
      const gb = (k, d, invert = false) => {
        const raw = localStorage.getItem(PREFIX + k);
        if (raw === null) return d;
        return invert ? raw !== "false" : raw === "true";
      };
      state.fontFamily = g("font_family", DEFAULTS.fontFamily);
      state.fontSize = gi("font_size", DEFAULTS.fontSize);
      state.fontWeightBody = gi("font_weight_body", DEFAULTS.fontWeightBody);
      state.fontWeightHeading = gi("font_weight_heading", DEFAULTS.fontWeightHeading);
      state.letterSpacing = gf("letter_spacing", DEFAULTS.letterSpacing);
      state.lineHeight = gf("line_height", DEFAULTS.lineHeight);
      state.fontCode = g("font_code", DEFAULTS.fontCode);
      state.railW = gi("rail_w", DEFAULTS.railW);
      state.wideW = gi("wide_w", DEFAULTS.wideW);
      state.topH = gi("top_h", DEFAULTS.topH);
      state.contentPadding = gf("content_padding", DEFAULTS.contentPadding);
      state.contentMaxW = g("content_max_w", DEFAULTS.contentMaxW);
      state.compact = gb("compact", DEFAULTS.compact);
      state.sidebarDefault = g("sidebar_default", DEFAULTS.sidebarDefault);
      state.radius = gi("radius", DEFAULTS.radius);
      state.shadowScale = gf("shadow_scale", DEFAULTS.shadowScale);
      state.cardStyle = g("card_style", DEFAULTS.cardStyle);
      state.buttonStyle = g("button_style", DEFAULTS.buttonStyle);
      state.inputStyle = g("input_style", DEFAULTS.inputStyle);
      state.motionScale = gf("motion_scale", DEFAULTS.motionScale);
      state.motionEasing = g("motion_easing", DEFAULTS.motionEasing);
      state.reducedMotion = gb("reduced_motion", DEFAULTS.reducedMotion);
      state.skeletonAnim = gb("skeleton_anim", DEFAULTS.skeletonAnim, true);
      state.entranceAnim = gb("entrance_anim", DEFAULTS.entranceAnim, true);
      state.glassOpacity = gf("glass_opacity", DEFAULTS.glassOpacity);
      state.backdropOpacity = gf("backdrop_opacity", DEFAULTS.backdropOpacity);
      state.panelOpacity = gf("panel_opacity", DEFAULTS.panelOpacity);
      state.customCss = g("custom_css", "");
    } catch {
      console.warn("ThemeStore: localStorage read failed");
    }
  }
  function save() {
    try {
      const s = state;
      localStorage.setItem(PREFIX + "font_family", s.fontFamily);
      localStorage.setItem(PREFIX + "font_size", String(s.fontSize));
      localStorage.setItem(PREFIX + "font_weight_body", String(s.fontWeightBody));
      localStorage.setItem(PREFIX + "font_weight_heading", String(s.fontWeightHeading));
      localStorage.setItem(PREFIX + "letter_spacing", String(s.letterSpacing));
      localStorage.setItem(PREFIX + "line_height", String(s.lineHeight));
      localStorage.setItem(PREFIX + "font_code", s.fontCode);
      localStorage.setItem(PREFIX + "rail_w", String(s.railW));
      localStorage.setItem(PREFIX + "wide_w", String(s.wideW));
      localStorage.setItem(PREFIX + "top_h", String(s.topH));
      localStorage.setItem(PREFIX + "content_padding", String(s.contentPadding));
      localStorage.setItem(PREFIX + "content_max_w", s.contentMaxW);
      localStorage.setItem(PREFIX + "compact", String(s.compact));
      localStorage.setItem(PREFIX + "sidebar_default", s.sidebarDefault);
      localStorage.setItem(PREFIX + "radius", String(s.radius));
      localStorage.setItem(PREFIX + "shadow_scale", String(s.shadowScale));
      localStorage.setItem(PREFIX + "card_style", s.cardStyle);
      localStorage.setItem(PREFIX + "button_style", s.buttonStyle);
      localStorage.setItem(PREFIX + "input_style", s.inputStyle);
      localStorage.setItem(PREFIX + "motion_scale", String(s.motionScale));
      localStorage.setItem(PREFIX + "motion_easing", s.motionEasing);
      localStorage.setItem(PREFIX + "reduced_motion", String(s.reducedMotion));
      localStorage.setItem(PREFIX + "skeleton_anim", String(s.skeletonAnim));
      localStorage.setItem(PREFIX + "entrance_anim", String(s.entranceAnim));
      localStorage.setItem(PREFIX + "glass_opacity", String(s.glassOpacity));
      localStorage.setItem(PREFIX + "backdrop_opacity", String(s.backdropOpacity));
      localStorage.setItem(PREFIX + "panel_opacity", String(s.panelOpacity));
      if (s.customCss) localStorage.setItem(PREFIX + "custom_css", s.customCss);
      else localStorage.removeItem(PREFIX + "custom_css");
    } catch {
    }
  }
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
  function applyAll() {
    const s = state;
    R.style.setProperty("--font-family-body", loadFont(s.fontFamily, FONTS));
    R.style.setProperty("--font-family-code", loadFont(s.fontCode, CODE_FONTS));
    R.style.setProperty("--font-size-base", s.fontSize + "px");
    R.style.setProperty("--font-scale", String(s.fontSize / 15));
    R.style.setProperty("--font-weight-body", String(s.fontWeightBody));
    R.style.setProperty("--font-weight-heading", String(s.fontWeightHeading));
    R.style.setProperty("--letter-spacing-base", s.letterSpacing + "em");
    R.style.setProperty("--line-height-base", String(s.lineHeight));
    R.style.setProperty("--rail-w", s.railW + "px");
    R.style.setProperty("--wide-w", s.wideW + "px");
    R.style.setProperty("--top-h", s.topH + "px");
    R.style.setProperty("--content-padding-scale", String(s.contentPadding));
    R.style.setProperty("--content-max-w", s.contentMaxW);
    R.style.setProperty("--spacing-scale", s.compact ? "0.8" : "1");
    R.style.setProperty("--radius-base", s.radius + "px");
    R.style.setProperty("--radius-sm", Math.round(s.radius * 0.6) + "px");
    R.style.setProperty("--radius-lg", Math.round(s.radius * 1.4) + "px");
    R.style.setProperty("--radius-xl", Math.round(s.radius * 1.6) + "px");
    R.style.setProperty("--shadow-scale", String(s.shadowScale));
    R.setAttribute("data-card-style", s.cardStyle);
    R.setAttribute("data-button-style", s.buttonStyle);
    R.setAttribute("data-input-style", s.inputStyle);
    R.style.setProperty("--motion-scale", String(s.motionScale));
    const easing = EASING_PRESETS.find((e) => e.key === s.motionEasing) ?? EASING_PRESETS[0];
    R.style.setProperty("--motion-easing", easing?.value ?? "cubic-bezier(0.4, 0, 0.2, 1)");
    R.style.setProperty("--glass-opacity", String(s.glassOpacity));
    R.style.setProperty("--backdrop-opacity", String(s.backdropOpacity));
    const isDark = R.classList.contains("dark");
    R.style.setProperty("--color-glass-panel", isDark ? `rgba(30,26,20,${s.panelOpacity.toFixed(2)})` : `rgba(255,255,255,${s.panelOpacity.toFixed(2)})`);
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
  function apply() {
    load();
    applyAll();
    pushHistory();
    emit("any-change", { state: getState() });
  }
  function getState() {
    return JSON.parse(JSON.stringify(state));
  }
  function getDefaults() {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
  function set(key, value) {
    if (!(key in state)) return;
    if (VALID_ENUMS[key] && VALID_ENUMS[key].indexOf(String(value)) === -1) return;
    pushHistory();
    state[key] = value;
    save();
    applyAll();
    emit(key + "-change", { key, value });
    emit("any-change", { state: getState() });
  }
  function resetAll() {
    pushHistory();
    resetState();
    save();
    applyAll();
    emit("reset", {});
    emit("any-change", { state: getState() });
  }
  function resetCategory(cat) {
    const keys = CATEGORIES[cat];
    if (!keys) return;
    pushHistory();
    keys.forEach((k) => {
      state[k] = DEFAULTS[k];
    });
    save();
    applyAll();
    emit("category-reset", { category: cat });
    emit("any-change", { state: getState() });
  }
  function getChangedKeys() {
    return Object.keys(DEFAULTS).filter(
      (k) => JSON.stringify(state[k]) !== JSON.stringify(DEFAULTS[k])
    );
  }
  function exportTheme() {
    const data = { _schema: "2", _exported: (/* @__PURE__ */ new Date()).toISOString(), _platform: "atonota-studio" };
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) {
        data[k] = localStorage.getItem(k);
      }
    }
    return JSON.stringify(data, null, 2);
  }
  function importTheme(json) {
    try {
      const data = JSON.parse(json);
      if (data._platform && data._platform !== "atonota-studio") {
        console.warn("ThemeStore: unknown platform", data._platform);
      }
      pushHistory();
      let count = 0;
      Object.keys(data).forEach((k) => {
        if (k.startsWith(PREFIX)) {
          localStorage.setItem(k, data[k] ?? "");
          count++;
        }
      });
      load();
      applyAll();
      if (window.AppearanceStore) window.AppearanceStore.apply();
      emit("import", { count, schema: data._schema || "1" });
      emit("any-change", { state: getState() });
      return { ok: true, count };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("ThemeStore import error:", e);
      return { ok: false, error: msg };
    }
  }
  function applyPreset(key) {
    const presets = {
      "default": {},
      "minimal": { radius: 2, shadowScale: 0, glassOpacity: 0, motionScale: 0.5, cardStyle: "flat", buttonStyle: "sharp", inputStyle: "underline" },
      "glass": { radius: 16, shadowScale: 0.5, glassOpacity: 0.08, backdropOpacity: 0.6, cardStyle: "glass", buttonStyle: "rounded", inputStyle: "filled" },
      "compact": { fontSize: 13, railW: 72, wideW: 200, topH: 64, compact: true, contentPadding: 0.75, buttonStyle: "sharp", inputStyle: "filled" },
      "contrast": { radius: 4, shadowScale: 1.5, fontSize: 16, fontWeightBody: 400, cardStyle: "elevated", buttonStyle: "sharp", inputStyle: "bordered" }
    };
    const p = presets[key];
    if (!p) return;
    pushHistory();
    resetState();
    Object.entries(p).forEach(([k, v]) => {
      state[k] = v;
    });
    save();
    applyAll();
    emit("preset-change", { key });
    emit("any-change", { state: getState() });
  }
  var store = {
    apply,
    getState,
    getDefaults,
    set,
    resetAll,
    resetCategory,
    getChangedKeys,
    undo,
    redo,
    canUndo,
    canRedo,
    exportTheme,
    importTheme,
    applyPreset,
    on,
    off,
    FONTS,
    CODE_FONTS,
    EASING_PRESETS,
    THEME_PRESETS,
    CATEGORIES,
    DEFAULTS
  };
  window.ThemeStore = store;
})();
