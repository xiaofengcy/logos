import { REHYDRATE } from 'redux-persist/constants';
import { createReducer } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

export const userState = {
  isAuthenticated: false,
  credential: {},
  isAdmin: false,
  data: {},
  isRunning: false,
  rehydrated: false,
};

export default {
  user: createReducer(userState, {
    [REHYDRATE](state, action) {
      return {
        ...state,
        ...action.payload.user,
        rehydrated: true,
      };
    },
    [ActionTypes.USER_LOGIN_REQUEST](state) {
      return { ...state, isRunning: true };
    },
    [ActionTypes.USER_LOGIN_SUCCESS](state, action) {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isRunning: false,
      };
    },
    [ActionTypes.USER_LOGIN_FAILURE](state, action) {
      return { ...userState, rehydrated: true };
    },
    [ActionTypes.USER_PERMISSIONS](state, action) {
      return { ...state, ...action.payload };
    },
    [ActionTypes.USER_LOGOUT_SUCCESS]() {
      return { ...userState, rehydrated: true };
    },
  }),
};

