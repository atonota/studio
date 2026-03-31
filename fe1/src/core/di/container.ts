/**
 * @module core/di/container
 * Lightweight DI container — register factories, resolve instances.
 * No external library needed. Singletons by default.
 */

export class Container {
  private registry = new Map<symbol, unknown>();
  private factories = new Map<symbol, () => unknown>();

  /** Register a factory function. Instance created on first resolve (lazy singleton). */
  register<T>(token: symbol, factory: () => T): void {
    this.factories.set(token, factory);
  }

  /** Register an already-created instance. */
  registerInstance<T>(token: symbol, instance: T): void {
    this.registry.set(token, instance);
  }

  /** Resolve a service by token. Creates singleton on first call. */
  resolve<T>(token: symbol): T {
    if (this.registry.has(token)) {
      return this.registry.get(token) as T;
    }
    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`DI: service not registered for ${token.toString()}`);
    }
    const instance = factory();
    this.registry.set(token, instance);
    return instance as T;
  }

  /** Check if a service is registered. */
  has(token: symbol): boolean {
    return this.registry.has(token) || this.factories.has(token);
  }

  /** Clear all registrations (for testing). */
  clear(): void {
    this.registry.clear();
    this.factories.clear();
  }
}

/** Global container singleton. */
export const container = new Container();
