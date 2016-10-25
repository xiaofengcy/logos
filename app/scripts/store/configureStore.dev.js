import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createLogger from 'redux-logger';

import Reactotron from 'reactotron-react-js';
import createReactotronTrackingEnhancer from 'reactotron-redux';

import rootSagas from 'sagas';
import rootReducer from 'reducers';
import { ActionTypes } from 'constants/index';

const reducer = combineReducers(Object.assign({}, rootReducer, {
  form: formReducer,
  routing: routerReducer,
}));
const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  // predicate: (getState, action) => (action.type.indexOf('_REQUEST') === -1),
  collapsed: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const newStore = (initialState = {}) => {
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware(browserHistory), logger),
    createReactotronTrackingEnhancer(Reactotron, {
      isActionImportant: action => action.type === ActionTypes.USER_LOGIN_SUCCESS,
    })
  )(createStore);

  const store = createStoreWithMiddleware(reducer, initialState);
  sagaMiddleware.run(rootSagas);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(require('reducers').default);
    });
  }

  return store;
};

export default newStore;
