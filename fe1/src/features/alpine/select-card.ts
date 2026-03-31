/**
 * select-card.ts — Single-select card Alpine.js data component
 *
 * Responsibility: Manages single selection state for card-based UI.
 * Toggle behavior — clicking the same card deselects it.
 *
 * Usage: x-data="selectCard()"
 * Methods: select(id), isSelected(id)
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

export function registerSelectCard(): void {
  Alpine.data('selectCard', (initial: unknown = null) => {
    const initialValue = (typeof initial === 'string' || typeof initial === 'number')
      ? initial
      : null;

    return {
      selected: initialValue as string | number | null,

      select(id: string | number) {
        this.selected = this.selected === id ? null : id;
      },

      isSelected(id: string | number): boolean {
        return this.selected === id;
      },
    };
  });
}
