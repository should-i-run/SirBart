/* @flow */
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { State as ReducerState, SelectionData } from '../reducers/appStore';

import {
  Text,
  Animated,
  Linking,
  TouchableOpacity,
  View,
  Platform,
  GestureResponderEvent,
} from 'react-native';

import { hideSelector, SelectorKinds } from '../actions/selectorActions';
import tracker from '../native/ga';

import styles from './Selector.styles';

import { Station } from '../reducers/appStore';

type Props = {
  selectorShown?: boolean;
  hideSelector?: ((event: GestureResponderEvent) => void) | undefined;
  selectionKind?: SelectorKinds;
  selectionData?: SelectionData;
};

type State = {
  closing: boolean;
};

class Selector extends React.Component<Props, State> {
  state = { closing: false };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.selectorShown && nextProps.selectorShown) {
      this.show();
    }
    if (this.props.selectorShown && !nextProps.selectorShown) {
      this.setState({ closing: true });
      this.close();
    }
  }

  height: Animated.Value = new Animated.Value(0);

  show = () => {
    this.height.setValue(0);
    Animated.spring(this.height, {
      toValue: 1,
      friction: 7,
      tension: 70,
    }).start();
  };

  close = () => {
    tracker.logEvent('close_selector');
    this.height.setValue(1);
    Animated.spring(this.height, {
      toValue: 0,
      friction: 7,
      tension: 70,
    }).start(() => this.setState({ closing: false }));
  };

  goToDirections = () => {
    tracker.logEvent('go_to_directions');
    if (this.props.selectionData) {
      const { lat, lng } = this.props.selectionData.station.closestEntranceLoc;
      const url = Platform.select({
        android: `google.navigation:q=${lat},${lng}&mode=w`,
        ios: `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=w&t=r`,
      });
      Linking.openURL(url);
    }
  };

  renderDistance(station: Station) {
    const { distance } = station.walkingDirections;
    return (
      <View style={styles.stationContainer}>
        <View style={[styles.leftRight, { marginRight: 30 }]}>
          <Text numberOfLines={1} style={[styles.genericText, { flex: 1 }]}>
            {station.name}
          </Text>
          <Text numberOfLines={1} style={[styles.title, { flex: 1, marginLeft: 10 }]}>
            {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
          </Text>
        </View>
        <TouchableOpacity onPress={this.goToDirections}>
          <Text style={[styles.genericText, styles.token]}>View route</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { selectorShown, selectionData, selectionKind } = this.props;
    if ((selectorShown || this.state.closing) && selectionData && selectionKind) {
      let stuff;
      if (selectionKind === SelectorKinds.distance && selectionData.station) {
        stuff = this.renderDistance(selectionData.station);
      }
      const bottom = this.height.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
      });
      return (
        <Animated.View
          style={[
            styles.selector,
            {
              transform: [{ translateY: bottom }],
            },
          ]}
        >
          {stuff}
          <TouchableOpacity style={styles.closeContainer} onPress={this.props.hideSelector}>
            <Icon name="times-circle" size={24} color="#E6E6E6" />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: ReducerState) => ({
  selectorShown: state.selectorShown,
  selectionData: state.selectionData,
  selectionKind: state.selectionKind,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      hideSelector,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Selector);
