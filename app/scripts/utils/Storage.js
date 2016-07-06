/**
 * localStorage Helper
 * @module Storage
 */
import store from 'store';

/**
 * Get Item.
 *
 * @function
 * @param {string} name
 * @returns {Object}
 */
export function getItem(name) {
  if (!store.enabled) {
    return false;
  }

  return JSON.parse(localStorage.getItem(name));
}

/**
 * Set Item.
 *
 * @function
 * @param {string} name
 * @param {Object} value
 */
export function setItem(name, value) {
  if (!store.enabled) {
    return;
  }

  localStorage.setItem(name, JSON.stringify(value));
}

/**
 * Remove Item.
 *
 * @function
 * @param {string} name
 */
export function removeItem(name) {
  if (!store.enabled) {
    return;
  }

  localStorage.removeItem(name);
}

/**
 * Clear All.
 *
 * @function
 */
export function clearAll() {
  if (!store.enabled) {
    return;
  }

  localStorage.clear();
}

export default { getItem, setItem, removeItem, clearAll };
