/* @flow */
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import React from 'react';
import {StatusBar} from 'react-native';
import thunkMiddleware from 'redux-thunk';
import codePush from 'react-native-code-push';

import DataContainer from './DataContainer';
import appStore from '../reducers/appStore';

const store = createStore(appStore, applyMiddleware(thunkMiddleware));

class App extends React.Component {
  componentWillMount() {
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return (
      <Provider store={store}>
        <DataContainer />
      </Provider>
    );
  }
}

export default codePush(App);
