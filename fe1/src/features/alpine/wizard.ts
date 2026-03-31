/**
 * wizard.ts — Multi-step form wizard Alpine.js data component
 *
 * Responsibility: Manages step-based navigation for multi-step forms.
 * Provides next/prev/goTo navigation, step state queries, and progress tracking.
 *
 * Usage: x-data="wizard(3)" (3-step wizard)
 * Methods: next(), prev(), goTo(n), isActive(n), isCompleted(n), isPending(n)
 * Getters: isFirst, isLast, progress
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

interface WizardState {
  step: number;
  total: number;
  next(): void;
  prev(): void;
  goTo(n: number): void;
  isActive(n: number): boolean;
  isCompleted(n: number): boolean;
  isPending(n: number): boolean;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly progress: number;
}

export function registerWizard(): void {
  Alpine.data('wizard', (totalSteps: unknown = 3) => {
    const total = typeof totalSteps === 'number' ? totalSteps : 3;

    return {
      step: 1,
      total,

      next() {
        if (this.step < this.total) this.step++;
      },

      prev() {
        if (this.step > 1) this.step--;
      },

      goTo(n: number) {
        if (n < 1 || n > this.total) return;
        this.step = n;
      },

      isActive(n: number): boolean {
        return this.step === n;
      },

      isCompleted(n: number): boolean {
        return this.step > n;
      },

      isPending(n: number): boolean {
        return this.step < n;
      },

      get isFirst(): boolean {
        return this.step === 1;
      },

      get isLast(): boolean {
        return this.step === this.total;
      },

      get progress(): number {
        return Math.round((this.step / this.total) * 100);
      },
    } satisfies WizardState;
  });
}
