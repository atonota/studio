/**
 * form-validation.ts — Form validation Alpine.js data component
 *
 * Responsibility: Manages form field state, required-field validation,
 * error tracking, simulated submission, and reset. Used across 14 pages.
 *
 * Usage: x-data="form({name:'', email:''})"
 * Methods: validate(), submit(), reset(), hasError(key), getError(key)
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

const SUBMIT_DELAY_MS = 1200;

type FieldMap = Record<string, unknown>;
type ErrorMap = Record<string, string>;

interface FormComponent {
  fields: FieldMap;
  errors: ErrorMap;
  submitted: boolean;
  submitting: boolean;
  validate(): boolean;
  hasError(key: string): boolean;
  getError(key: string): string;
  submit(): void;
  reset(): void;
}

export function registerForm(): void {
  Alpine.data('form', (initialFields: unknown = {}) => {
    const fieldsDef: FieldMap = (
      initialFields !== null && typeof initialFields === 'object' && !Array.isArray(initialFields)
    ) ? initialFields as FieldMap : {};

    const component: FormComponent = {
      fields: { ...fieldsDef },
      errors: {},
      submitted: false,
      submitting: false,

      validate(): boolean {
        this.errors = {};

        for (const [key, val] of Object.entries(this.fields)) {
          if (typeof val !== 'string') continue;
          if (val.trim() !== '') continue;
          this.errors[key] = 'Bu alan zorunlu';
        }

        return Object.keys(this.errors).length === 0;
      },

      hasError(key: string): boolean {
        return !!this.errors[key];
      },

      getError(key: string): string {
        return this.errors[key] || '';
      },

      submit() {
        if (!this.validate()) return;

        this.submitting = true;
        setTimeout(() => {
          this.submitting = false;
          this.submitted = true;
        }, SUBMIT_DELAY_MS);
      },

      reset() {
        this.fields = { ...fieldsDef };
        this.errors = {};
        this.submitted = false;
      },
    };
    return component as unknown as Record<string, unknown>;
  });
}
