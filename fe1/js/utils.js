"use strict";
(() => {
  // src/shared/formatting/number-format.ts
  function fmtNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function fmtTRY(n) {
    return "\u20BA" + fmtNum(n);
  }

  // src/shared/formatting/date-format.ts
  function timeAgo(minutes) {
    if (minutes < 60) return minutes + " dk once";
    if (minutes < 1440) return Math.floor(minutes / 60) + " saat once";
    return Math.floor(minutes / 1440) + " gun once";
  }

  // src/shared/formatting/ui-fragments.ts
  function statCard(label, value, change, color, delay) {
    const cls = delay ? ` fade-in-d${delay}` : "";
    const changeColor = change.startsWith("+") || change.startsWith("\u2191") ? "stat-change--up" : change.startsWith("-") || change.startsWith("\u2193") ? "stat-change--down" : "stat-change--flat";
    return `<div class="stat-card stat-card--${color}${cls}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-change ${changeColor}">${change}</div></div>`;
  }
  function badge(text, color) {
    return `<span class="badge badge--${color}">${text}</span>`;
  }
  function iconCircle(icon, color) {
    return `<div class="icon-circle icon-circle--${color}"><i class="ph ${icon}"></i></div>`;
  }

  // src/shared/formatting/index.ts
  window.fmtNum = fmtNum;
  window.fmtTRY = fmtTRY;
  window.timeAgo = timeAgo;
  window.statCard = statCard;
  window.badge = badge;
  window.iconCircle = iconCircle;
})();
