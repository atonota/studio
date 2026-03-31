/**
 * @module stores/theme
 * Entry point — instantiates OOP ThemeStore class,
 * exposes window.ThemeStore via toAPI() compat layer.
 * HTML pages see the same API as before.
 */

import { ThemeStore } from '../../../domain/theme/ThemeStore';

const instance = new ThemeStore();
window.ThemeStore = instance.toAPI();
