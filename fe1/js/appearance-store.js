"use strict";
(() => {
  // src/app/stores/appearance.store.ts
  var LIGHT_TONES = [
    { key: "pure", label: "White", base: "#FFFFFF", s: "#F7F7F7", s2: "#EEEEEE", b: "#DCDCDC" },
    { key: "snow", label: "Snow", base: "#FDFDFB", s: "#F6F6F3", s2: "#EEEDE9", b: "#DDDBD5" },
    { key: "pearl", label: "Pearl", base: "#FAFAF6", s: "#F3F3EE", s2: "#EAEAE3", b: "#D5D4CC" },
    { key: "milk", label: "Milk", base: "#F8F5EC", s: "#F0EDE3", s2: "#E8E4D8", b: "#D6D1C2" },
    { key: "cream", label: "Cream", base: "#F5F0E3", s: "#EDE7D5", s2: "#E3DCC9", b: "#CEC9B4" },
    { key: "ecru", label: "Ecru", base: "#F0EBD8", s: "#E8E2CD", s2: "#DDDBBF", b: "#C8BEA5" },
    { key: "linen", label: "Linen", base: "#EDE8D5", s: "#E3DDC8", s2: "#D8D2BA", b: "#C0B89F" },
    { key: "parchment", label: "Parchment", base: "#EAE4CE", s: "#E0DAC2", s2: "#D5CEB4", b: "#BCB49A" },
    { key: "cyan-l", label: "Cyan", base: "#EEF8F8", s: "#E5F0F0", s2: "#D9EAEA", b: "#C4D8D8" },
    { key: "mag-l", label: "Magenta", base: "#F8EEF6", s: "#F0E5EE", s2: "#E9DAE7", b: "#D6C8D4" },
    { key: "yel-l", label: "Lemon", base: "#F8F8EE", s: "#F0F0E5", s2: "#E9E9DA", b: "#D6D6C4" },
    { key: "red-l", label: "Red", base: "#F8EEEE", s: "#F0E5E5", s2: "#E9DADA", b: "#D6C4C4" },
    { key: "grn-l", label: "Green", base: "#EEF8EE", s: "#E5F0E5", s2: "#DAE9DA", b: "#C4D6C4" },
    { key: "blu-l", label: "Blue", base: "#EEF0F8", s: "#E5E8F0", s2: "#DAE0E9", b: "#C4CCD6" },
    { key: "vio-l", label: "Violet", base: "#F2EEF8", s: "#EAE5F0", s2: "#E2DAE9", b: "#CFC8D6" },
    { key: "org-l", label: "Orange", base: "#F8F2EE", s: "#F0EAE5", s2: "#E9E0DA", b: "#D6CCC4" }
  ];
  var DARK_TONES = [
    { key: "coal-warm", label: "Warm", base: "#161412", s: "#201C18", s2: "#2A2420", b: "#3C342C" },
    { key: "coal-cool", label: "Cool", base: "#141618", s: "#1E2024", s2: "#282C30", b: "#383E44" },
    { key: "obsidian", label: "Obsidian", base: "#121212", s: "#1C1C1C", s2: "#262626", b: "#363636" },
    { key: "raven", label: "Raven", base: "#0F0E0D", s: "#191714", s2: "#231F1C", b: "#302C28" },
    { key: "void", label: "Void", base: "#0D0D0E", s: "#171718", s2: "#212122", b: "#2E2E30" },
    { key: "graphite", label: "Graphite", base: "#111213", s: "#1B1C1D", s2: "#252627", b: "#343536" },
    { key: "onyx", label: "Onyx", base: "#0E0E10", s: "#181819", s2: "#222224", b: "#30303A" },
    { key: "jet", label: "Jet", base: "#0C0C0C", s: "#161616", s2: "#202020", b: "#2C2C2C" },
    { key: "cyan-d", label: "Cyan", base: "#0A1214", s: "#141C1E", s2: "#1E2628", b: "#2C3638" },
    { key: "mag-d", label: "Magenta", base: "#140A12", s: "#1E141C", s2: "#281E26", b: "#382C36" },
    { key: "yel-d", label: "Lemon", base: "#13120A", s: "#1D1C14", s2: "#27261E", b: "#38362C" },
    { key: "red-d", label: "Red", base: "#14080A", s: "#1E1214", s2: "#281C1E", b: "#382C2C" },
    { key: "grn-d", label: "Green", base: "#081408", s: "#121E12", s2: "#1C281C", b: "#2C382C" },
    { key: "blu-d", label: "Blue", base: "#080A14", s: "#12141E", s2: "#1C1E28", b: "#2C2C38" },
    { key: "vio-d", label: "Violet", base: "#0E0814", s: "#18121E", s2: "#221C28", b: "#302838" },
    { key: "org-d", label: "Orange", base: "#140E08", s: "#1E1812", s2: "#28221C", b: "#38302A" }
  ];
  var ACCENTS = [
    { key: "cyan", color: "#67C4D4", h: "#4AABBD" },
    { key: "magenta", color: "#D966A8", h: "#C2498E" },
    { key: "yellow", color: "#D4C84A", h: "#BCB02C" },
    { key: "red", color: "#E07070", h: "#C85555" },
    { key: "green", color: "#6DC26D", h: "#52A852" },
    { key: "blue", color: "#6A99D4", h: "#4D80BE" },
    { key: "violet", color: "#9B7ECC", h: "#8264B8" },
    { key: "orange", color: "#E0A05A", h: "#C98740" }
  ];
  var PREFIX = "ap_";
  var R = document.documentElement;
  function hexToRgb(h) {
    return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) };
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
  }
  function darken(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
  }
  function lighten(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  }
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0, s = 0;
    const l = (mx + mn) / 2;
    if (d > 0) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (mx === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
      const v = Math.round(l * 255);
      return { r: v, g: v, b: v };
    }
    const hue2rgb = (p2, q2, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2) return q2;
      if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
  }
  function desaturate(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const hsl = rgbToHsl(r, g, b);
    hsl.s = Math.max(0, hsl.s * (1 - amount));
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  var state = {
    mode: "dark",
    lightTone: "milk",
    darkTone: "coal-warm",
    accentDark: "violet",
    accentLight: "violet",
    customLight: null,
    customDark: null,
    blurLevel: 6,
    chromeBg: null
  };
  var listeners = {};
  function on(event, cb) {
    (listeners[event] = listeners[event] || []).push(cb);
  }
  function off(event, cb) {
    if (listeners[event]) listeners[event] = listeners[event].filter((f) => f !== cb);
  }
  function emit(event, payload) {
    (listeners[event] || []).forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error("AppearanceStore event error:", e);
      }
    });
  }
  function load() {
    try {
      state.mode = localStorage.getItem(PREFIX + "mode") || "dark";
      state.lightTone = localStorage.getItem(PREFIX + "light_tone") || "milk";
      state.darkTone = localStorage.getItem(PREFIX + "dark_tone") || "coal-warm";
      const legacyAccent = localStorage.getItem(PREFIX + "accent") || null;
      state.accentDark = localStorage.getItem(PREFIX + "accent_dark") || legacyAccent || "violet";
      state.accentLight = localStorage.getItem(PREFIX + "accent_light") || legacyAccent || "violet";
      if (legacyAccent) {
        localStorage.setItem(PREFIX + "accent_dark", state.accentDark);
        localStorage.setItem(PREFIX + "accent_light", state.accentLight);
        localStorage.removeItem(PREFIX + "accent");
      }
      state.customLight = localStorage.getItem(PREFIX + "custom_light") || null;
      state.customDark = localStorage.getItem(PREFIX + "custom_dark") || null;
      const bl = localStorage.getItem(PREFIX + "blur");
      state.blurLevel = bl !== null ? parseInt(bl, 10) : 6;
      state.chromeBg = localStorage.getItem(PREFIX + "chrome_bg") || null;
    } catch {
      console.warn("AppearanceStore: localStorage read failed, using defaults");
    }
  }
  function save() {
    try {
      localStorage.setItem(PREFIX + "schema_v", "2");
      localStorage.setItem(PREFIX + "mode", state.mode);
      localStorage.setItem(PREFIX + "light_tone", state.lightTone);
      localStorage.setItem(PREFIX + "dark_tone", state.darkTone);
      localStorage.setItem(PREFIX + "accent_dark", state.accentDark);
      localStorage.setItem(PREFIX + "accent_light", state.accentLight);
      if (state.customLight) localStorage.setItem(PREFIX + "custom_light", state.customLight);
      else localStorage.removeItem(PREFIX + "custom_light");
      if (state.customDark) localStorage.setItem(PREFIX + "custom_dark", state.customDark);
      else localStorage.removeItem(PREFIX + "custom_dark");
      localStorage.setItem(PREFIX + "blur", String(state.blurLevel));
      if (state.chromeBg) localStorage.setItem(PREFIX + "chrome_bg", state.chromeBg);
      else localStorage.removeItem(PREFIX + "chrome_bg");
    } catch {
    }
  }
  function applyToneVars(t) {
    R.style.setProperty("--color-bg-base", t.base);
    R.style.setProperty("--color-bg-elevated", t.s);
    R.style.setProperty("--color-bg-sunken", t.s2);
    R.style.setProperty("--color-border-default", t.b);
    R.style.setProperty("--base", t.base);
    R.style.setProperty("--surface", t.s);
    R.style.setProperty("--surface-2", t.s2);
    R.style.setProperty("--border", t.b);
    const isDark = R.classList.contains("dark");
    const railBg = isDark ? darken(desaturate(t.s, 0.35), 0.06) : lighten(desaturate(t.s, 0.35), 0.04);
    R.style.setProperty("--rail-bg", railBg);
    R.style.setProperty("--wide-bg", t.s);
    if (isDark) {
      const autoChrome = darken(t.base, 0.15);
      R.style.setProperty("--chrome-bg-auto", autoChrome);
      R.style.setProperty("--chrome-bg", autoChrome);
    } else {
      const chromeFallback = state.chromeBg || "#171a1d";
      R.style.setProperty("--chrome-bg-auto", "#171a1d");
      R.style.setProperty("--chrome-bg", chromeFallback);
    }
  }
  function applyAccentVars(key) {
    const a = ACCENTS.find((x) => x.key === key) ?? ACCENTS[6];
    if (!a) return;
    const { r, g, b } = hexToRgb(a.color);
    R.style.setProperty("--color-primary", a.color);
    R.style.setProperty("--color-primary-hover", a.h);
    R.style.setProperty("--color-primary-soft", `rgba(${r},${g},${b},0.12)`);
    R.style.setProperty("--color-primary-muted", `rgba(${r},${g},${b},0.22)`);
    R.style.setProperty("--accent", a.color);
    R.style.setProperty("--accent-h", a.h);
    R.style.setProperty("--accent-soft", `rgba(${r},${g},${b},0.1)`);
    R.style.setProperty("--accent-muted", `rgba(${r},${g},${b},0.2)`);
    const railAccent = desaturate(a.color, 0.45);
    const railRgb = hexToRgb(railAccent);
    R.style.setProperty("--rail-accent", railAccent);
    R.style.setProperty("--rail-accent-soft", `rgba(${railRgb.r},${railRgb.g},${railRgb.b},0.12)`);
    R.style.setProperty("--wide-accent", a.color);
    R.style.setProperty("--wide-accent-soft", `rgba(${r},${g},${b},0.12)`);
  }
  function applyMode(m) {
    const isDark = m === "dark";
    R.classList.toggle("dark", isDark);
    const presets = isDark ? DARK_TONES : LIGHT_TONES;
    const key = isDark ? state.darkTone : state.lightTone;
    const customHex = isDark ? state.customDark : state.customLight;
    if (key === "custom" && customHex) {
      if (isDark) {
        applyToneVars({ key: "custom", label: "Custom", base: customHex, s: lighten(customHex, 0.04), s2: lighten(customHex, 0.1), b: lighten(customHex, 0.2) });
      } else {
        applyToneVars({ key: "custom", label: "Custom", base: customHex, s: darken(customHex, 0.04), s2: darken(customHex, 0.09), b: darken(customHex, 0.17) });
      }
      return;
    }
    const tone = presets.find((p) => p.key === key) ?? presets[0];
    if (tone) applyToneVars(tone);
  }
  function applyBlur() {
    R.style.setProperty("--blur-level", state.blurLevel + "px");
  }
  function applyChromeBg() {
    if (state.mode === "light" && state.chromeBg) {
      R.style.setProperty("--chrome-bg", state.chromeBg);
    }
  }
  function getChromeBgResolved() {
    if (state.mode === "dark") {
      return R.style.getPropertyValue("--chrome-bg-auto").trim() || "#131110";
    }
    return state.chromeBg || "#171a1d";
  }
  function apply() {
    load();
    applyMode(state.mode);
    applyAccentVars(state.mode === "dark" ? state.accentDark : state.accentLight);
    applyBlur();
    applyChromeBg();
    emit("any-change", { state: getState() });
  }
  function getState() {
    return { ...state };
  }
  function setMode(m) {
    state.mode = m;
    save();
    applyMode(m);
    applyAccentVars(m === "dark" ? state.accentDark : state.accentLight);
    emit("mode-change", { mode: m });
    emit("any-change", { state: getState() });
  }
  function setLightTone(key) {
    state.lightTone = key;
    save();
    if (state.mode === "light") applyMode("light");
    emit("tone-change", { mode: "light", tone: key });
    emit("any-change", { state: getState() });
  }
  function setDarkTone(key) {
    state.darkTone = key;
    save();
    if (state.mode === "dark") applyMode("dark");
    emit("tone-change", { mode: "dark", tone: key });
    emit("any-change", { state: getState() });
  }
  function setAccent(key) {
    state.accentDark = key;
    state.accentLight = key;
    save();
    applyAccentVars(key);
    emit("accent-change", { key, color: (ACCENTS.find((x) => x.key === key) ?? ACCENTS[6])?.color ?? "" });
    emit("any-change", { state: getState() });
  }
  function setAccentDark(key) {
    state.accentDark = key;
    save();
    if (state.mode === "dark") applyAccentVars(key);
    emit("accent-change", { mode: "dark", key, color: (ACCENTS.find((x) => x.key === key) ?? ACCENTS[6])?.color ?? "" });
    emit("any-change", { state: getState() });
  }
  function setAccentLight(key) {
    state.accentLight = key;
    save();
    if (state.mode === "light") applyAccentVars(key);
    emit("accent-change", { mode: "light", key, color: (ACCENTS.find((x) => x.key === key) ?? ACCENTS[6])?.color ?? "" });
    emit("any-change", { state: getState() });
  }
  function setCustomLight(hex) {
    state.customLight = hex;
    state.lightTone = "custom";
    save();
    if (state.mode === "light") applyMode("light");
    emit("tone-change", { mode: "light", tone: "custom" });
    emit("any-change", { state: getState() });
  }
  function setCustomDark(hex) {
    state.customDark = hex;
    state.darkTone = "custom";
    save();
    if (state.mode === "dark") applyMode("dark");
    emit("tone-change", { mode: "dark", tone: "custom" });
    emit("any-change", { state: getState() });
  }
  function setBlur(level) {
    state.blurLevel = Math.max(0, Math.min(20, parseInt(String(level), 10) || 0));
    save();
    applyBlur();
    emit("blur-change", { level: state.blurLevel });
    emit("any-change", { state: getState() });
  }
  function setChromeBg(hex) {
    state.chromeBg = hex || null;
    save();
    if (state.chromeBg) {
      applyChromeBg();
    } else {
      applyMode(state.mode);
    }
    emit("chrome-change", { color: getChromeBgResolved() });
    emit("any-change", { state: getState() });
  }
  var store = {
    getState,
    apply,
    on,
    off,
    setMode,
    setLightTone,
    setDarkTone,
    setAccent,
    setAccentDark,
    setAccentLight,
    setCustomLight,
    setCustomDark,
    setBlur,
    setChromeBg,
    getChromeBgResolved,
    LIGHT_TONES,
    DARK_TONES,
    ACCENTS,
    hexToRgb,
    rgbToHex,
    darken,
    lighten
  };
  window.AppearanceStore = store;
})();
