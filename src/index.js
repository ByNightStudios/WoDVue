/* eslint-disable import/no-webpack-loader-syntax */

/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { message } from 'antd';

import 'sanitize.css/sanitize.css';
import "antd/dist/antd.css";

import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from './store/store';
import AppRouter from './Router';
import './styles/imports.scss';
import '../src/styles/antd-variables.less';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */


// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};

const MOUNT_NODE = document.getElementById('app');
const key = 'updatable';

message.config({
  top: 80,
  maxCount: 1,
});

const openMessage = () => {
  message.loading({ content: 'A New Version Found, Please wait...', key });
  setTimeout(() => {
    message.success({ content: 'Changes are live!', key, duration: 2 });
    window.location.reload();
  }, 2000);
};

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', './Router.js'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .then(function (registration) {
    })
    .catch(function (err) {
    });
}
// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      require('offline-plugin/runtime').applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
      // Reload the webpage to reload into new version
      openMessage();
    },

    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
}

