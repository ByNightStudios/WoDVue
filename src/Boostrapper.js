import React from 'react';

import AppRouter from './Router';

import styles from './styles/imports.scss';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store, persistor} from './store/store';

//import {initializePush} from './common/firebasePermission'
export default class Boostrapper extends React.Component {

  render() {
    return (
      
      <div className='application-wrapper' style={styles}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
        </PersistGate>
      </Provider>
      </div>
      
    );
  }
}
