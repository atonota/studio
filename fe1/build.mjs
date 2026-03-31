/* ═══════════════════════════════════════════
   atonota Studio — esbuild Configuration
   .ts dosyalarini js/ dizinine compile eder.
   HTML referanslari degismez: <script src="../js/shell.js">

   Kullanim:
     npm run build   — tek seferlik build
     npm run watch   — degisiklik izle + otomatik rebuild
═══════════════════════════════════════════ */

import { build, context } from 'esbuild';

const isWatch = process.argv.includes('--watch');

const config = {
  entryPoints: {
    'utils': 'src/shared/formatting/index.ts',
    'appearance-store': 'src/app/stores/appearance.store.ts',
    'appearance-init': 'src/app/bootstrap/appearance-init.ts',
    'theme-store': 'src/app/stores/theme.store.ts',
    'mock-data': 'src/shared/charts/mock-data.ts',
    'charts': 'src/shared/charts/chart-theme.ts',
    'components': 'src/features/index.ts',
    'shell': 'src/app/shell/index.ts',
  },
  outdir: 'js',
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: false,
  sourcemap: false,
  logLevel: 'info',
};

if (isWatch) {
  const ctx = await context(config);
  await ctx.watch();
  console.log('⚡ Watching for changes...');
} else {
  await build(config);
  console.log('✅ Build complete');
}
