import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as React from 'react';
import { StatusBar, Platform } from 'react-native';
import thunkMiddleware from 'redux-thunk';
import codePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DataContainer from './DataContainer';
import appStore from '../reducers/appStore';
import CodePush from 'react-native-code-push';
import { incrementLaunchCount } from '../utils/launches';
import { log } from '../utils/sumo';

const store = createStore(appStore, applyMiddleware(thunkMiddleware));

class App extends React.Component<{}> {
  async componentDidMount() {
    log('App componentDidMount');
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBackgroundColor('#252F39');
    }
    incrementLaunchCount();
  }

  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <DataContainer />
        </Provider>
      </SafeAreaProvider>
    );
  }
}

export default codePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
})(App);
