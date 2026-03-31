"use strict";
(() => {
  // src/app/bootstrap/appearance-init.ts
  if (typeof AppearanceStore === "undefined") {
    console.warn("appearance-init: AppearanceStore not loaded");
  } else {
    AppearanceStore.apply();
    applyThemeTokens();
    AppearanceStore.on("any-change", () => {
      if (typeof refreshAllCharts === "function") refreshAllCharts();
      if (typeof buildChartsReal === "function") {
        clearTimeout(window._chartDebounce);
        window._chartDebounce = setTimeout(buildChartsReal, 50);
      }
    });
  }
  function applyThemeTokens() {
    const P = "ap_";
    const R = document.documentElement;
    const g = (k, d) => localStorage.getItem(P + k) || d;
    const gi = (k, d) => {
      const v = parseInt(localStorage.getItem(P + k) || "", 10);
      return isNaN(v) ? d : v;
    };
    const gf = (k, d) => {
      const v = parseFloat(localStorage.getItem(P + k) || "");
      return isNaN(v) ? d : v;
    };
    const fontKey = g("font_family", "system");
    const fontStacks = {
      system: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      inter: "'Inter',sans-serif",
      ibm: "'IBM Plex Sans',sans-serif",
      nunito: "'Nunito',sans-serif"
    };
    const codeKey = g("font_code", "jetbrains");
    const codeStacks = {
      jetbrains: "'JetBrains Mono',ui-monospace,monospace",
      fira: "'Fira Code',ui-monospace,monospace",
      mono: "ui-monospace,'SF Mono',monospace"
    };
    const fontCdns = {
      inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      ibm: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap",
      nunito: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap",
      jetbrains: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap",
      fira: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap"
    };
    [fontKey, codeKey].forEach((k) => {
      if (fontCdns[k] && !document.getElementById("font-" + k)) {
        const l = document.createElement("link");
        l.id = "font-" + k;
        l.rel = "stylesheet";
        l.href = fontCdns[k];
        document.head.appendChild(l);
      }
    });
    R.style.setProperty("--font-family-body", fontStacks[fontKey] ?? fontStacks.system ?? null);
    R.style.setProperty("--font-family-code", codeStacks[codeKey] ?? codeStacks.jetbrains ?? null);
    const fontSize = gi("font_size", 15);
    R.style.setProperty("--font-size-base", fontSize + "px");
    R.style.setProperty("--font-scale", String(fontSize / 15));
    R.style.setProperty("--font-weight-body", String(gi("font_weight_body", 300)));
    R.style.setProperty("--font-weight-heading", String(gi("font_weight_heading", 600)));
    R.style.setProperty("--letter-spacing-base", gf("letter_spacing", 0.01) + "em");
    R.style.setProperty("--line-height-base", String(gf("line_height", 1.5)));
    const userRailW = localStorage.getItem(P + "rail_w") ?? null;
    const userWideW = localStorage.getItem(P + "wide_w") ?? null;
    const userTopH = localStorage.getItem(P + "top_h") ?? null;
    if (userRailW !== null) R.style.setProperty("--rail-w", userRailW + "px");
    if (userWideW !== null) R.style.setProperty("--wide-w", userWideW + "px");
    if (userTopH !== null) R.style.setProperty("--top-h", userTopH + "px");
    R.style.setProperty("--content-padding-scale", String(gf("content_padding", 1)));
    R.style.setProperty("--content-max-w", g("content_max_w", "none"));
    R.style.setProperty("--spacing-scale", g("compact", "false") === "true" ? "0.8" : "1");
    const rad = gi("radius", 10);
    R.style.setProperty("--radius-base", rad + "px");
    R.style.setProperty("--radius-sm", Math.round(rad * 0.6) + "px");
    R.style.setProperty("--radius-lg", Math.round(rad * 1.4) + "px");
    R.style.setProperty("--radius-xl", Math.round(rad * 1.6) + "px");
    R.style.setProperty("--shadow-scale", String(gf("shadow_scale", 1)));
    R.style.setProperty("--motion-scale", String(gf("motion_scale", 1)));
    const easings = {
      material: "cubic-bezier(0.4,0,0.2,1)",
      bounce: "cubic-bezier(0.34,1.08,0.64,1)",
      snappy: "cubic-bezier(0.16,1,0.3,1)",
      linear: "linear",
      ease: "ease"
    };
    R.style.setProperty("--motion-easing", easings[g("motion_easing", "material")] ?? easings.material ?? null);
    R.style.setProperty("--glass-opacity", String(gf("glass_opacity", 0.04)));
    R.style.setProperty("--backdrop-opacity", String(gf("backdrop_opacity", 0.5)));
    const panelOp = gf("panel_opacity", 0.55);
    const isDark = R.classList.contains("dark");
    R.style.setProperty("--color-glass-panel", isDark ? `rgba(30,26,20,${panelOp.toFixed(2)})` : `rgba(255,255,255,${panelOp.toFixed(2)})`);
    R.setAttribute("data-card-style", g("card_style", "elevated"));
    R.setAttribute("data-button-style", g("button_style", "rounded"));
    R.setAttribute("data-input-style", g("input_style", "bordered"));
    const a11yHighContrast = g("a11y_high_contrast", "off");
    if (a11yHighContrast !== "off") R.setAttribute("data-high-contrast", a11yHighContrast);
    if (g("a11y_reduced_transparency", "false") === "true") R.setAttribute("data-reduced-transparency", "");
    if (g("a11y_dyslexia", "false") === "true") R.setAttribute("data-dyslexia", "");
    const a11yFocusSize = g("a11y_focus_size", "default");
    if (a11yFocusSize !== "default") R.setAttribute("data-focus-size", a11yFocusSize);
    const a11yFontScale = gf("a11y_font_scale", 1);
    if (a11yFontScale !== 1) R.style.setProperty("--a11y-font-scale", String(a11yFontScale));
    const a11yCursor = g("a11y_cursor", "default");
    if (a11yCursor !== "default") R.setAttribute("data-cursor", a11yCursor);
    const sidebarPref = g("sidebar_default", "collapsed");
    if (sidebarPref === "open") {
      if (document.body) {
        document.body.classList.add("wide-open");
      } else {
        document.addEventListener("DOMContentLoaded", () => document.body.classList.add("wide-open"));
      }
    }
    const css = g("custom_css", "");
    if (css) {
      const s = document.createElement("style");
      s.id = "ap-custom-css";
      s.textContent = css;
      document.head.appendChild(s);
    }
  }
})();
