// @flow

/**
 * @module Sagas/User
 * @desc User
 */
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { connectRoles, signInWithPopup, signInWithCredential, signOut } from 'utils/firebaseClient';

import { ActionTypes } from 'constants/index';
import { goTo } from 'actions';

/**
 * Login
 * @param {Object} action
 */
export function* login(action) {
  try {
    const auth = yield call(signInWithPopup, action.payload.provider);
    yield call(connectRoles);

    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
      payload: {
        credential: auth.credential,
        data: {
          uid: auth.user.uid,
          displayName: auth.user.displayName,
          email: auth.user.email,
          photoURL: auth.user.photoURL,
          refreshToken: auth.user.refreshToken,
        },
      },
    });
  } catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: error,
    });
  }
}

/**
 * Restore
 */
export function* restore() {
  try {
    yield call(signInWithCredential);

    yield put({
      type: ActionTypes.USER_RESTORE_SUCCESS,
    });
  } catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_RESTORE_FAILURE,
      payload: error,
    });
  }
}

/**
 * Logout
 */
export function* logout() {
  try {
    yield call(signOut);

    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
    yield put(goTo('/'));
  } catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: error,
    });
  }
}

function* watchLogin() {
  yield takeLatest(ActionTypes.USER_LOGIN_REQUEST, login);
}

function* watchRestore() {
  yield takeLatest(ActionTypes.USER_RESTORE_REQUEST, restore);
}

function* watchLogout() {
  yield takeLatest(ActionTypes.USER_LOGOUT_REQUEST, logout);
}

/**
 * User Sagas
 */
export default function* user() {
  yield all([
    watchLogin(),
    watchRestore(),
    watchLogout(),
  ]);
}
