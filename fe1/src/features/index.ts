/**
 * features/index.ts — Entry point for all interactive components
 *
 * Responsibility: Imports and orchestrates all Alpine.js data components,
 * global stores, and auto-features. Alpine components are registered inside
 * the 'alpine:init' event. Auto-features run on DOMContentLoaded or
 * self-execute on import.
 *
 * Build entry: esbuild bundles this as 'components': 'src/features/index.ts'
 * Output: js/components.js (single IIFE)
 */

// ── Auto-features (self-executing on import) ────
import './auto/responsive-grid';
import './auto/display-fix';

// ── Auto-features (registered on DOMContentLoaded) ──
import { initSkeleton } from './auto/skeleton';
import { initChartSkeleton } from './auto/chart-skeleton';
import { initPagination } from './auto/pagination';
import { initEmptyState } from './auto/empty-state';

// ── Alpine components ───────────────────────────
import { registerWizard } from './alpine/wizard';
import { registerTabs } from './alpine/tabs';
import { registerDataTable } from './alpine/data-table';
import { registerSelectCard } from './alpine/select-card';
import { registerForm } from './alpine/form-validation';
import { registerMicroComponents } from './alpine/micro-components';
import { registerStores } from './alpine/stores';

// ── Alpine registration ─────────────────────────
document.addEventListener('alpine:init', () => {
  registerWizard();
  registerTabs();
  registerDataTable();
  registerSelectCard();
  registerForm();
  registerMicroComponents();
  registerStores();
});

// ── Auto-features that need DOMContentLoaded ────
initSkeleton();
initChartSkeleton();
initPagination();
initEmptyState();
