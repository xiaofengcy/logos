// @flow
/**
 * Helper functions
 * @module Helpers
 */
import { detect } from 'detect-browser';
import ExecutionEnvironment from 'exenv';
import scroll from 'scroll';

export const { canUseDOM } = ExecutionEnvironment;

/**
 * Generate reducer.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 * @returns {function}
 */
export function createReducer(initialState: Object, handlers: Object) {
  return function reducer(state: Object = initialState, action: Object) {
    if ({}.hasOwnProperty.call(handlers, action.type)) {
      /**
       * Reducer.
       *
       * @param {Object} [state]
       * @param {Object} [action]
       * @param {string} action.type
       * @param {Object} action.payload
       * @param {Object} action.meta
       * @returns {Object}
       */
      return handlers[action.type](state, action);
    }

    return state;
  };
}

/**
 * Create request types for contants
 * @param {string} base
 * @returns {Object}
 */
export function createRequestTypes(base: String) {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].reduce((initial, type) => {
    initial[`${base}_${type}`] = undefined;
    return initial;
  }, {});
}

/**
 * Convert data attributes to Object
 * @param {Element} elem
 * @returns {{}}
 */
export function datasetToObject(elem: Element) {
  const data = {};
  [].forEach.call(elem.attributes, attr => {
    /* istanbul ignore else */
    if (/^data-/.test(attr.name)) {
      const camelCaseName = attr.name.substr(5).replace(/-(.)/g, ($0, $1) => $1.toUpperCase());
      data[camelCaseName] = attr.value;
    }
  });
  return data;
}

export function trackEvent(category, type, label) {
  const options = {
    eventCategory: category,
    eventAction: type,
  };

  if (label) {
    options.eventLabel = label;
  }

  if (typeof ga !== 'undefined') {
    ga('send', 'event', options);
  } else {
    console.log('trackEvent', options); //eslint-disable-line no-console
  }
}

/**
 * Get DOM document scrolling element
 * @returns {Element}
 */
export function getScrollingElement() {
  const browser = detect();
  const { scrollingElement } = document;

  if (!scrollingElement) {
    return ['ie', 'firefox'].indexOf(browser.name) > -1 ? document.documentElement : document.body;
  }

  return scrollingElement;
}

export function scrollTo(to = 0) {
  const root = getScrollingElement();
  const duration = root.scrollTop / 10 < 500 ? root.scrollTop / 10 : 500;

  scroll.top(root, to, { duration });
}

/**
 * Usage: new ScaleLog({  min: 10, max: 100 });
 */
export class ScaleLog {
  constructor(options) {
    const newOptions = options || {};
    this.minSize = newOptions.minSize || 1.2;
    this.maxSize = newOptions.maxSize || 5;
    this.unit = newOptions.unit || '';
    this.min = (newOptions.min || 1);
    this.max = (newOptions.max || 50);

    this.scale = (this.max - this.min) / (this.maxSize - this.minSize);
  }

  value(qty) {
    return (qty === this.min ? this.minSize : ((qty / this.max) * (this.maxSize - this.minSize)) + this.minSize).toFixed(2) + this.unit;
  }
}

/**
 * Get Unix timestamp in seconds.
 *
 * @returns {number}
 */
export function getUnixtime() {
  return Math.floor(Date.now() / 1000);
}
