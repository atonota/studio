/**
 * @module core/di/types
 * Service tokens for dependency injection.
 * Each token is a unique symbol — used as key in the DI container.
 */

export const TOKENS = {
  EventBus: Symbol('EventBus'),
  Storage: Symbol('Storage'),
  AppearanceStore: Symbol('AppearanceStore'),
  ThemeStore: Symbol('ThemeStore'),
  NotificationStore: Symbol('NotificationStore'),
  ChartRegistry: Symbol('ChartRegistry'),
  DataProvider: Symbol('DataProvider'),
  KeyboardShortcuts: Symbol('KeyboardShortcuts'),
  Rail: Symbol('Rail'),
  Footer: Symbol('Footer'),
} as const;
