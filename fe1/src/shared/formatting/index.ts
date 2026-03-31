/* ═══════════════════════════════════════════
   Formatting Module — utils.js TypeScript karsiligi
   Global scope'a assign edilir (mevcut HTML uyumu)
   Build output: js/utils.js
═══════════════════════════════════════════ */

export { fmtNum, fmtTRY } from './number-format';
export { timeAgo } from './date-format';
export { statCard, badge, iconCircle } from './ui-fragments';

// Global window'a assign — HTML sayfalari bu fonksiyonlari dogrudan cagirir
import { fmtNum, fmtTRY } from './number-format';
import { timeAgo } from './date-format';
import { statCard, badge, iconCircle } from './ui-fragments';

declare global {
  interface Window {
    fmtNum: typeof fmtNum;
    fmtTRY: typeof fmtTRY;
    timeAgo: typeof timeAgo;
    statCard: typeof statCard;
    badge: typeof badge;
    iconCircle: typeof iconCircle;
  }
}

window.fmtNum = fmtNum;
window.fmtTRY = fmtTRY;
window.timeAgo = timeAgo;
window.statCard = statCard;
window.badge = badge;
window.iconCircle = iconCircle;
