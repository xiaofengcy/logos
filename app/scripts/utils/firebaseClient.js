import firebase from 'firebase';
import config from 'config';
import { dispatch, getState } from 'store';
import { getUnixtime } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

firebase.initializeApp(config.firebase);

const auth = firebase.auth();
const database = firebase.database();

export async function signInWithPopup(provider) {
  let AuthProvider;

  if (provider === 'facebook') {
    AuthProvider = new firebase.auth.FacebookAuthProvider();
  } else {
    AuthProvider = new firebase.auth.GithubAuthProvider();
  }
  AuthProvider.addScope('email');

  return auth.signInWithPopup(AuthProvider);
}

export async function link(provider) {
  return auth.currentUser.linkWithPopup(provider);
}

export async function signOut() {
  return auth.signOut();
}

export async function signInWithCredential() {
  const { user } = getState();
  const credential = await firebase.auth.GithubAuthProvider.credential(user.credential);

  return auth.signInWithCredential(credential);
}

export function connectLogos() {
  const logos = database.ref('items').orderByChild('updated');

  return new Promise((resolve, reject) => {
    logos.on('value', snapshot => {
      resolve();
      const data = [];

      snapshot.forEach(child => {
        data.push({ id: child.getKey(), ...child.val() });
      });

      dispatch({
        type: ActionTypes.CONNECT_LOGOS_UPDATE,
        payload: { data: data.reverse(), updated: getUnixtime() },
      });
    }, error => {
      dispatch({
        type: ActionTypes.CONNECT_LOGOS_FAILURE,
        payload: { error, updated: getUnixtime() },
      });
      reject();
    });
  });
}

export function connectTags() {
  const tags = database.ref('tags');

  return new Promise((resolve, reject) => {
    tags.on('value', snapshot => {
      resolve();
      const data = [];

      snapshot.forEach(child => {
        data.push({ id: child.getKey(), ...child.val() });
      });

      dispatch({
        type: ActionTypes.CONNECT_TAGS_UPDATE,
        payload: { data, updated: getUnixtime() },
      });
    }, error => {
      dispatch({
        type: ActionTypes.CONNECT_TAGS_FAILURE,
        payload: { error, updated: getUnixtime() },
      });
      reject();
    });
  });
}

export function connectCategories() {
  const categories = database.ref('categories');

  return new Promise((resolve, reject) => {
    categories.on('value', snapshot => {
      resolve();
      const data = [];

      snapshot.forEach(child => {
        data.push({ id: child.getKey(), ...child.val() });
      });

      dispatch({
        type: ActionTypes.CONNECT_CATEGORIES_UPDATE,
        payload: { data, updated: getUnixtime() },
      });
    }, error => {
      dispatch({
        type: ActionTypes.CONNECT_CATEGORIES_FAILURE,
        payload: { error, updated: getUnixtime() },
      });
      reject();
    });
  });
}

export function connectRoles() {
  const roles = database.ref('roles');

  return new Promise(resolve => {
    roles.on('value', () => {
      resolve(
        dispatch({
          type: ActionTypes.USER_PERMISSIONS,
          payload: { isAdmin: true },
        })
      );
    }, error => {
      resolve(
        dispatch({
          type: ActionTypes.USER_PERMISSIONS,
          payload: { isAdmin: false, error },
        })
      );
    });
  });
}

export function updateItems(payload) {
  const updates = {};
  const { firebase: data } = getState();

  return new Promise(async(resolve, reject) => {
    let itemKey = payload.id;
    if (!itemKey) {
      itemKey = await database.ref().child('items').push().key;
    }

    updates[`/items/${itemKey}`] = payload.item;

    if (payload.tags) {
      const tags = {};
      data.tags.data.forEach(t => {
        tags[t.name] = t;
      });

      if (payload.tags.added.length) {
        for (const newTag of payload.tags.added) {
          const tagExist = tags[newTag];
          if (tagExist) {
            updates[`/tags/${tagExist.id}`] = { name: tagExist.name, count: tagExist.count + 1 };
          } else {
            const newTagKey = await database.ref().child('tags').push().key;
            updates[`/tags/${newTagKey}`] = { name: newTag, count: 1 };
          }
        }
      }

      if (payload.tags.removed.length) {
        for (const removed of payload.tags.removed) {
          const tagExist = tags[removed];

          if (tagExist) {
            if (tagExist.count === 1) {
              updates[`/tags/${tagExist.id}`] = null;
            } else {
              updates[`/tags/${tagExist.id}`] = { name: tagExist.name, count: tagExist.count - 1 };
            }
          }
        }
      }
    }

    if (payload.categories) {
      const categories = {};
      data.categories.data.forEach(c => {
        categories[c.name] = c;
      });

      if (payload.categories.added.length) {
        for (const newCategory of payload.categories.added) {
          const catExist = categories[newCategory];
          if (catExist) {
            updates[`/categories/${catExist.id}`] = { name: catExist.name, count: catExist.count + 1 };
          } else {
            const newCategoryKey = await database.ref().child('categories').push().key;
            updates[`/categories/${newCategoryKey}`] = { name: newCategory, count: 1 };
          }
        }
      }

      if (payload.categories.removed.length) {
        for (const removed of payload.categories.removed) {
          const catExist = categories[removed];

          if (catExist) {
            if (catExist.count === 1) {
              updates[`/categories/${catExist.id}`] = null;
            } else {
              updates[`/categories/${catExist.id}`] = { name: catExist.name, count: catExist.count - 1 };
            }
          }
        }
      }
    }

    try {
      await database.ref().update(updates);
      resolve();
    } catch (error) {
      reject();
    }
  });
}

export function updateTaxonomies() {
  const { firebase: { logos, categories, tags } } = getState();
  const updates = {};
  const tagsCount = {};
  const categoriesCount = {};

  return new Promise(async(resolve, reject) => {
    logos.data.forEach(l => {
      l.tags.forEach(t => {
        if (!tagsCount[t]) {
          tagsCount[t] = 0;
        }

        tagsCount[t]++;
      });

      l.categories.forEach(t => {
        if (!categoriesCount[t]) {
          categoriesCount[t] = 0;
        }

        categoriesCount[t]++;
      });
    });

    tags.data.forEach(t => {
      if (t.count !== tagsCount[t.name]) {
        if (tagsCount[t.name]) {
          updates[`/tags/${t.id}`] = { name: t.name, count: tagsCount[t.name] };
        } else {
          updates[`/tags/${t.id}`] = null;
        }
      }
    });

    categories.data.forEach(c => {
      if (c.count !== categoriesCount[c.name]) {
        if (categoriesCount[c.name]) {
          updates[`/categories/${c.id}`] = { name: c.name, count: categoriesCount[c.name] };
        } else {
          updates[`/categories/${c.id}`] = null;
        }
      }
    });

    if (!updates) {
      resolve();
      return;
    }

    try {
      await database.ref().update(updates);
      resolve();
    } catch (error) {
      reject();
    }
  });
}

export default {
  auth,
  database,
};
