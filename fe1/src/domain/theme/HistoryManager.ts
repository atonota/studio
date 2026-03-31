/**
 * @module domain/theme/HistoryManager
 * Explicit undo/redo state machine with bounded history.
 * Replaces implicit _history/_historyIdx/_historyLock module-level variables.
 */

export class HistoryManager<T> {
  private stack: string[] = [];
  private index = -1;
  private locked = false;
  private readonly maxSize: number;

  constructor(maxSize = 20) {
    this.maxSize = maxSize;
  }

  /** Push current state snapshot. Truncates redo branch. */
  push(state: T): void {
    if (this.locked) return;
    if (this.index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.index + 1);
    }
    this.stack.push(JSON.stringify(state));
    if (this.stack.length > this.maxSize) this.stack.shift();
    this.index = this.stack.length - 1;
  }

  /** Undo — returns previous state or null if at beginning. */
  undo(): T | null {
    if (this.index <= 0) return null;
    this.index--;
    return JSON.parse(this.stack[this.index]!) as T;
  }

  /** Redo — returns next state or null if at end. */
  redo(): T | null {
    if (this.index >= this.stack.length - 1) return null;
    this.index++;
    return JSON.parse(this.stack[this.index]!) as T;
  }

  /** Lock history (prevent pushes during undo/redo apply). */
  lock(): void { this.locked = true; }

  /** Unlock history. */
  unlock(): void { this.locked = false; }

  get canUndo(): boolean { return this.index > 0; }
  get canRedo(): boolean { return this.index < this.stack.length - 1; }
  get currentIndex(): number { return this.index; }
}
