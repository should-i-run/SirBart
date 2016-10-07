/* @flow */
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import React from 'react';
import thunkMiddleware from 'redux-thunk';

import DataContainer from './DataContainer';
import appStore from '../reducers/appStore';

const store = createStore(appStore, applyMiddleware(thunkMiddleware));

class App extends React.Component {
  static propTypes = {
    walkingData: React.PropTypes.object,
  }

  render() {
    return (
      <Provider store={store}>
        <DataContainer walkingData={this.props.walkingData || {}} />
      </Provider>
    );
  }
}

export default App;
