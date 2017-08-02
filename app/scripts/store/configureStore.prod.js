import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as reduxFormReducer } from 'redux-form';

import history from 'modules/history';
import rootSagas from 'sagas';
import rootReducer from 'reducers';

const reducer = combineReducers({
  ...rootReducer,
  form: reduxFormReducer,
  router: routerReducer,
});
const sagaMiddleware = createSagaMiddleware();

export default (initialState = {}) => {
  const createStoreWithMiddleware = applyMiddleware(thunk, sagaMiddleware, routerMiddleware(history))(createStore);
  const store = createStoreWithMiddleware(reducer, initialState);
  sagaMiddleware.run(rootSagas);

  return store;
};
