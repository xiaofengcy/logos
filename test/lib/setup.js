/*eslint-disable no-console, no-prototype-builtins, no-continue, no-multi-assign */
Object.defineProperty(window.location, 'href', {
  writable: true,
  value: 'http://localhost:3000/',
});

Object.defineProperty(window.location, 'pathname', {
  writable: true,
  value: '/',
});

global.window.matchMedia = () => ({ matches: true });
global.navigator = { userAgent: 'node.js' };
global.FormData = window.FormData;
global.window.localStorage = window.sessionStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  clear() {
    return this;
  },
};
