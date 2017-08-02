import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { createLogger } from 'redux-logger';

import history from 'modules/history';
import rootSagas from 'sagas';
import rootReducer from 'reducers';

const reducer = combineReducers({
  ...rootReducer,
  form: reduxFormReducer,
  router: routerReducer,
});
const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  // predicate: (getState, action) => (action.type.indexOf('_REQUEST') === -1),
  collapsed: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
export default (initialState = {}) => {
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(thunk, sagaMiddleware, routerMiddleware(history), logger)
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
