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

  // src/app/stores/appearance/presets.ts
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
  function hexToRgb(hex) {
    return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
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

  // src/domain/appearance/AppearanceStore.ts
  var PREFIX = "ap_";
  var R = document.documentElement;
  var AppearanceStore = class {
    state;
    bus = createEventBus();
    constructor() {
      this.state = {
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
    }
    // ── Public API ──────────────────────────
    getState() {
      return { ...this.state };
    }
    apply() {
      this.load();
      this.applyMode(this.state.mode);
      this.applyAccentVars(this.state.mode === "dark" ? this.state.accentDark : this.state.accentLight);
      this.applyBlur();
      this.applyChromeBg();
      this.bus.emit("any-change", { state: this.getState() });
    }
    on(event, cb) {
      this.bus.on(event, cb);
    }
    off(event, cb) {
      this.bus.off(event, cb);
    }
    setMode(m) {
      this.state.mode = m;
      this.save();
      this.applyMode(m);
      this.applyAccentVars(m === "dark" ? this.state.accentDark : this.state.accentLight);
      this.bus.emit("mode-change", { mode: m });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setLightTone(key) {
      this.state.lightTone = key;
      this.save();
      if (this.state.mode === "light") this.applyMode("light");
      this.bus.emit("tone-change", { mode: "light", tone: key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setDarkTone(key) {
      this.state.darkTone = key;
      this.save();
      if (this.state.mode === "dark") this.applyMode("dark");
      this.bus.emit("tone-change", { mode: "dark", tone: key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    /** @deprecated Use setAccentDark / setAccentLight */
    setAccent(key) {
      this.state.accentDark = key;
      this.state.accentLight = key;
      this.save();
      this.applyAccentVars(key);
      this.bus.emit("accent-change", { key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setAccentDark(key) {
      this.state.accentDark = key;
      this.save();
      if (this.state.mode === "dark") this.applyAccentVars(key);
      this.bus.emit("accent-change", { mode: "dark", key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setAccentLight(key) {
      this.state.accentLight = key;
      this.save();
      if (this.state.mode === "light") this.applyAccentVars(key);
      this.bus.emit("accent-change", { mode: "light", key });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setCustomLight(hex) {
      this.state.customLight = hex;
      this.state.lightTone = "custom";
      this.save();
      if (this.state.mode === "light") this.applyMode("light");
      this.bus.emit("tone-change", { mode: "light", tone: "custom" });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setCustomDark(hex) {
      this.state.customDark = hex;
      this.state.darkTone = "custom";
      this.save();
      if (this.state.mode === "dark") this.applyMode("dark");
      this.bus.emit("tone-change", { mode: "dark", tone: "custom" });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setBlur(level) {
      this.state.blurLevel = Math.max(0, Math.min(20, parseInt(String(level), 10) || 0));
      this.save();
      this.applyBlur();
      this.bus.emit("blur-change", { level: this.state.blurLevel });
      this.bus.emit("any-change", { state: this.getState() });
    }
    setChromeBg(hex) {
      this.state.chromeBg = hex || null;
      this.save();
      if (this.state.chromeBg) this.applyChromeBg();
      else this.applyMode(this.state.mode);
      this.bus.emit("chrome-change", { color: this.getChromeBgResolved() });
      this.bus.emit("any-change", { state: this.getState() });
    }
    getChromeBgResolved() {
      if (this.state.mode === "dark") return R.style.getPropertyValue("--chrome-bg-auto").trim() || "#131110";
      return this.state.chromeBg || "#171a1d";
    }
    // ── Persistence (private) ──────────────────────────
    load() {
      try {
        const storedMode = localStorage.getItem(PREFIX + "mode");
        if (storedMode) {
          this.state.mode = storedMode;
        } else {
          const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
          this.state.mode = prefersDark ? "dark" : "light";
        }
        this.state.lightTone = localStorage.getItem(PREFIX + "light_tone") || "milk";
        this.state.darkTone = localStorage.getItem(PREFIX + "dark_tone") || "coal-warm";
        const legacy = localStorage.getItem(PREFIX + "accent") || null;
        this.state.accentDark = localStorage.getItem(PREFIX + "accent_dark") || legacy || "violet";
        this.state.accentLight = localStorage.getItem(PREFIX + "accent_light") || legacy || "violet";
        if (legacy) {
          localStorage.setItem(PREFIX + "accent_dark", this.state.accentDark);
          localStorage.setItem(PREFIX + "accent_light", this.state.accentLight);
          localStorage.removeItem(PREFIX + "accent");
        }
        this.state.customLight = localStorage.getItem(PREFIX + "custom_light") || null;
        this.state.customDark = localStorage.getItem(PREFIX + "custom_dark") || null;
        const bl = localStorage.getItem(PREFIX + "blur");
        this.state.blurLevel = bl !== null ? parseInt(bl, 10) : 6;
        this.state.chromeBg = localStorage.getItem(PREFIX + "chrome_bg") || null;
      } catch {
      }
    }
    save() {
      try {
        localStorage.setItem(PREFIX + "schema_v", "2");
        localStorage.setItem(PREFIX + "mode", this.state.mode);
        localStorage.setItem(PREFIX + "light_tone", this.state.lightTone);
        localStorage.setItem(PREFIX + "dark_tone", this.state.darkTone);
        localStorage.setItem(PREFIX + "accent_dark", this.state.accentDark);
        localStorage.setItem(PREFIX + "accent_light", this.state.accentLight);
        if (this.state.customLight) localStorage.setItem(PREFIX + "custom_light", this.state.customLight);
        else localStorage.removeItem(PREFIX + "custom_light");
        if (this.state.customDark) localStorage.setItem(PREFIX + "custom_dark", this.state.customDark);
        else localStorage.removeItem(PREFIX + "custom_dark");
        localStorage.setItem(PREFIX + "blur", String(this.state.blurLevel));
        if (this.state.chromeBg) localStorage.setItem(PREFIX + "chrome_bg", this.state.chromeBg);
        else localStorage.removeItem(PREFIX + "chrome_bg");
      } catch {
      }
    }
    // ── CSS Application (private) ──────────────────────────
    applyToneVars(t) {
      R.style.setProperty("--color-bg-base", t.base);
      R.style.setProperty("--color-bg-elevated", t.s);
      R.style.setProperty("--color-bg-sunken", t.s2);
      R.style.setProperty("--color-border-default", t.b);
      R.style.setProperty("--base", t.base);
      R.style.setProperty("--surface", t.s);
      R.style.setProperty("--surface-2", t.s2);
      R.style.setProperty("--border", t.b);
      const isDark = R.classList.contains("dark");
      R.style.setProperty("--rail-bg", isDark ? darken(desaturate(t.s, 0.35), 0.06) : lighten(desaturate(t.s, 0.35), 0.04));
      R.style.setProperty("--wide-bg", t.s);
      if (isDark) {
        const auto = darken(t.base, 0.15);
        R.style.setProperty("--chrome-bg-auto", auto);
        R.style.setProperty("--chrome-bg", auto);
      } else {
        R.style.setProperty("--chrome-bg-auto", "#171a1d");
        R.style.setProperty("--chrome-bg", this.state.chromeBg || "#171a1d");
      }
    }
    applyAccentVars(key) {
      const a = ACCENTS.find((x) => x.key === key) ?? ACCENTS[6];
      if (!a) return;
      const { r, g, b } = hexToRgb(a.color);
      const isDark = R.classList.contains("dark");
      R.style.setProperty("--color-primary", a.color);
      R.style.setProperty("--color-primary-hover", a.h);
      R.style.setProperty("--_primary-rgb", `${r}, ${g}, ${b}`);
      R.style.setProperty("--color-primary-soft", `rgba(${r},${g},${b},${isDark ? 0.1 : 0.15})`);
      R.style.setProperty("--color-primary-muted", `rgba(${r},${g},${b},${isDark ? 0.2 : 0.25})`);
      R.style.setProperty("--accent", a.color);
      R.style.setProperty("--accent-h", a.h);
      R.style.setProperty("--accent-soft", `rgba(${r},${g},${b},${isDark ? 0.08 : 0.12})`);
      R.style.setProperty("--accent-muted", `rgba(${r},${g},${b},${isDark ? 0.16 : 0.22})`);
      const rail = desaturate(a.color, 0.45);
      const rr = hexToRgb(rail);
      R.style.setProperty("--rail-accent", rail);
      R.style.setProperty("--rail-accent-soft", `rgba(${rr.r},${rr.g},${rr.b},0.12)`);
      R.style.setProperty("--wide-accent", a.color);
      R.style.setProperty("--wide-accent-soft", `rgba(${r},${g},${b},0.12)`);
    }
    applyMode(m) {
      const isDark = m === "dark";
      R.classList.toggle("dark", isDark);
      const presets = isDark ? DARK_TONES : LIGHT_TONES;
      const key = isDark ? this.state.darkTone : this.state.lightTone;
      const custom = isDark ? this.state.customDark : this.state.customLight;
      if (key === "custom" && custom) {
        const tone2 = isDark ? { key: "custom", label: "Custom", base: custom, s: lighten(custom, 0.04), s2: lighten(custom, 0.1), b: lighten(custom, 0.2) } : { key: "custom", label: "Custom", base: custom, s: darken(custom, 0.04), s2: darken(custom, 0.09), b: darken(custom, 0.17) };
        this.applyToneVars(tone2);
        return;
      }
      const tone = presets.find((p) => p.key === key) ?? presets[0];
      if (tone) this.applyToneVars(tone);
    }
    applyBlur() {
      R.style.setProperty("--blur-level", this.state.blurLevel + "px");
    }
    applyChromeBg() {
      if (this.state.mode === "light" && this.state.chromeBg) {
        R.style.setProperty("--chrome-bg", this.state.chromeBg);
      }
    }
    // ── Compat API (for window.AppearanceStore) ──────────────────────────
    toAPI() {
      return {
        getState: () => this.getState(),
        apply: () => this.apply(),
        on: (e, cb) => this.on(e, cb),
        off: (e, cb) => this.off(e, cb),
        setMode: (m) => this.setMode(m),
        setLightTone: (k) => this.setLightTone(k),
        setDarkTone: (k) => this.setDarkTone(k),
        setAccent: (k) => this.setAccent(k),
        setAccentDark: (k) => this.setAccentDark(k),
        setAccentLight: (k) => this.setAccentLight(k),
        setCustomLight: (h) => this.setCustomLight(h),
        setCustomDark: (h) => this.setCustomDark(h),
        setBlur: (l) => this.setBlur(l),
        setChromeBg: (h) => this.setChromeBg(h),
        getChromeBgResolved: () => this.getChromeBgResolved(),
        LIGHT_TONES,
        DARK_TONES,
        ACCENTS,
        hexToRgb,
        rgbToHex,
        darken,
        lighten
      };
    }
  };

  // src/app/stores/appearance/index.ts
  var instance = new AppearanceStore();
  window.AppearanceStore = instance.toAPI();
})();
