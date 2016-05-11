/**
 * localStorage Helper
 * @module Storage
 */

/**
 * Get Item.
 *
 * @function
 * @param {string} name
 * @returns {Object}
 */
export function getItem(name) {
  if (typeof localStorage !== 'undefined') {
    return JSON.parse(localStorage.getItem(name));
  }

  return false;
}

/**
 * Set Item.
 *
 * @function
 * @param {string} name
 * @param {Object} value
 */
export function setItem(name, value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(name, JSON.stringify(value));
  }
}

/**
 * Remove Item.
 *
 * @function
 * @param {string} name
 */
export function removeItem(name) {
  if (typeof localStorage === 'undefined') {
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
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.clear();
}

export default { getItem, setItem, removeItem, clearAll };
