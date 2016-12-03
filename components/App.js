/* @flow */
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import React from 'react';
import {StatusBar} from 'react-native';
import thunkMiddleware from 'redux-thunk';

import DataContainer from './DataContainer';
import appStore from '../reducers/appStore';
import tracker from '../native/ga';

const store = createStore(appStore, applyMiddleware(thunkMiddleware));

class App extends React.Component {
  componentWillMount() {
    StatusBar.setBarStyle('light-content');
    tracker.trackScreenView('home');
  }

  render() {
    return (
      <Provider store={store}>
        <DataContainer />
      </Provider>
    );
  }
}

export default App;
