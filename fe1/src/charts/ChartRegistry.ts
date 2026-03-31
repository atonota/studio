/**
 * @module charts/ChartRegistry
 * OOP chart instance management — private registry, resize handler.
 * Replaces module-level _charts array and window.addEventListener('resize').
 */

interface EChartsInstance {
  setOption(opt: Record<string, unknown>): void;
  getOption(): Record<string, unknown>;
  resize(): void;
  dispose(): void;
}

declare const echarts: {
  init(el: HTMLElement, theme?: string | null, opts?: Record<string, unknown>): EChartsInstance;
};

export class ChartRegistry {
  private instances: EChartsInstance[] = [];
  private resizeHandler: (() => void) | null = null;

  /** Create and register an ECharts instance. */
  create(el: HTMLElement): EChartsInstance {
    const instance = echarts.init(el, null, { renderer: 'canvas' });
    this.instances.push(instance);
    return instance;
  }

  /** Resize all registered chart instances. */
  resizeAll(): void {
    this.instances.forEach(c => c.resize());
  }

  /** Start listening for window resize. */
  init(): void {
    this.resizeHandler = () => this.resizeAll();
    window.addEventListener('resize', this.resizeHandler);
  }

  /** Get all instances for theme refresh. */
  getAll(): readonly EChartsInstance[] {
    return this.instances;
  }

  /** Dispose all charts and stop listening. */
  destroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.instances.forEach(c => { try { c.dispose(); } catch { /* ignore */ } });
    this.instances = [];
  }
}
