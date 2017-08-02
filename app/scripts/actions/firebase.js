/**
 * @module Actions/Firebase
 * @desc Firebase Actions
 */

import { ActionTypes } from 'constants/index';
import { getUnixtime } from 'utils/helpers';

/**
 * Init Firebase
 *
 * @returns {Object}
 */
export function initFirebase() {
  return {
    type: ActionTypes.CONNECT_FIREBASE_REQUEST,
    payload: {},
  };
}

/**
 * Connect Logos
 *
 * @returns {Object}
 */
export function connectLogos() {
  return {
    type: ActionTypes.CONNECT_LOGOS_REQUEST,
    payload: {},
  };
}

/**
 * Connect Tags
 *
 * @returns {Object}
 */
export function connectTags() {
  return {
    type: ActionTypes.CONNECT_TAGS_REQUEST,
    payload: {},
  };
}

/**
 * Connect Categories
 *
 * @returns {Object}
 */
export function connectCategories() {
  return {
    type: ActionTypes.CONNECT_CATEGORIES_REQUEST,
    payload: {},
  };
}

/**
 * Update Logos
 *
 * @param {Object} payload
 * @param {function} [callback]
 *
 * @returns {Object}
 */
export function updateLogos(payload, callback) {
  return {
    type: ActionTypes.UPDATE_LOGOS_REQUEST,
    payload,
    meta: {
      callback,
      updated: getUnixtime(),
    },
  };
}

/**
 * Update Taxonomies
 *
 * @param {function} [callback]
 *
 * @returns {Object}
 */
export function updateTaxonomies(callback) {
  return {
    type: ActionTypes.UPDATE_TAXONOMIES_REQUEST,
    payload: {},
    meta: {
      callback,
      updated: getUnixtime(),
    },
  };
}
