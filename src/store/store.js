/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { notification } from 'antd';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import createReducer from '../reducers';
const initialState = {};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
  blacklist: [
    'community',
    'elder',
    'notification',
    'demoApiSaga',
    'myElders',
    'opsContainerReducer',
    'socialTabReducer',
    'antFromLoginPage',
    'planReport'
  ],
};

const persistedReducer = persistReducer(persistConfig, createReducer);
const reduxSagaMonitorOptions = {};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const axiosInstance = axios.create({
  baseURL: config.BASEURL,
  timeout: 600000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Headers':
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  },
});

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    if (!error.response)
      notification.open({
        message: 'Error',
        description:
          'There was an error while trying to establish connection to the server.',
        duration: 10,
        style: {
          color: 'red',
        },
      });
    else if (
      error.response.data.code === 401 ||
      error.response.status === 401
    ) {
      notification.open({
        message: 'Error',
        description:
          'Your session has expired. Please login again to access the system.',
        duration: 10,
        style: {
          color: 'red',
        },
      });
    } else if (
      error.response.data.code === 403 ||
      error.response.status === 403
    ) {
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  },
);
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

const middleware = [
  sagaMiddleware,
  thunk.withExtraArgument({
    api: axiosInstance,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({
    duration: true,
  });
  middleware.push(logger);
}

const store = createStore(
  persistedReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware)),
);

// Extensions
store.runSaga = sagaMiddleware.run;
store.injectedReducers = {}; // Reducer registry
store.injectedSagas = {}; // Saga registry

const persistor = persistStore(store);

export { store, axiosInstance, persistor };
