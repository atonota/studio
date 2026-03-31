/**
 * @module stores/appearance
 * Entry point — instantiates OOP AppearanceStore class,
 * exposes window.AppearanceStore via toAPI() compat layer.
 * HTML pages see the same API as before.
 */

import { AppearanceStore } from '../../../domain/appearance/AppearanceStore';

const instance = new AppearanceStore();
window.AppearanceStore = instance.toAPI();
