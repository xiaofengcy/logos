// Polyfills
import 'core-js/shim';
import 'isomorphic-fetch';
import 'classlist-polyfill';
import 'vendor/polyfills';

import 'expose?$!expose?jQuery!jquery';
import 'expose?Util!exports?Util!bootstrap/js/dist/util';
import 'bootstrap/js/dist/modal';
import 'footable/compiled/footable';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import store from 'store';

import App from 'containers/App';
import '../styles/main.scss';

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install();
}

function renderApp(RootComponent) {
  const target = document.getElementById('react');
  /* istanbul ignore if  */
  if (target) {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <RootComponent />
        </Provider>
      </AppContainer>,
      target
    );
  }
}

renderApp(App);

/* istanbul ignore next  */
if (module.hot) {
  module.hot.accept(
    'containers/App',
    () => renderApp(require('containers/App').default)
  );
}
