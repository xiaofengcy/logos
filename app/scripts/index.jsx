// Polyfills
import 'core-js/shim';
import 'isomorphic-fetch';
import 'classlist-polyfill';
import 'vendor/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import store, { dispatch } from 'store';
import { showAlert } from 'actions';

import App from 'containers/App';
import '../styles/main.scss';

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  const OfflinePlugin = require('offline-plugin/runtime');

  OfflinePlugin.install({
    onUpdateReady: () => {
      OfflinePlugin.applyUpdate();
    },
    onUpdated: () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
          .then(regs => {
            const isCurrentSW = regs.find(d => d.active && d.active.scriptURL.includes('sw.js'));
            if (isCurrentSW) {
              dispatch(showAlert((
                <div className="app__cache-reload">
                  <p>Existe uma nova versão do site disponível. Por favor recarregue a página.</p>
                  <button className="btn btn-sm btn-black" onClick={() => window.location.reload()}>Recarregar
                  </button>
                </div>
              ), { type: 'black', icon: 'i-flash', timeout: 0 }));
            }
          });
      }
    },
  });
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
