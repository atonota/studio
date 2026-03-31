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
const isProd = process.argv.includes('--prod');

const config = {
  entryPoints: {
    'utils': 'src/shared/formatting/index.ts',
    'appearance-store': 'src/app/stores/appearance/index.ts',
    'appearance-init': 'src/app/bootstrap/appearance-init.ts',
    'theme-store': 'src/app/stores/theme/index.ts',
    'mock-data': 'src/shared/charts/mock-data.ts',
    'charts': 'src/shared/charts/chart-theme.ts',
    'components': 'src/features/index.ts',
    'shell': 'src/app/shell/index.ts',
    'http-client': 'src/core/http/client.ts',
  },
  outdir: 'js',
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: isProd,
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
