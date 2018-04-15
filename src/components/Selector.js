/* @flow */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Text, Animated, Linking, TouchableOpacity, View, Platform } from 'react-native';

import { hideSelector } from '../actions/selectorActions';
import tracker from '../native/ga';

import styles from './Selector.styles';

import type { Station, Line, Estimate } from '../reducers/appStore';

// https://stackoverflow.com/a/8888498
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

type Props = {
  selectorShown: boolean,
  hideSelector: Function,
  selectionKind: 'distance' | 'departure',
  selectionData: ?Object,
};

type State = {
  closing: boolean,
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
    tracker.trackEvent('interaction', 'close-selector');
    this.height.setValue(1);
    Animated.spring(this.height, {
      toValue: 0,
      friction: 7,
      tension: 70,
    }).start(() => this.setState({ closing: false }));
  };

  goToDirections = () => {
    tracker.trackEvent('interaction', 'go-to-directions');
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

  renderDeparture(
    station: Station,
    line: Line,
    estimate: Estimate,
    tripForLine?: { timeEstimate?: string },
  ) {
    const min = estimate.minutes;

    const renderArrive = (timeEstimate: string) => {
      const minNumber = min === 'Leaving' ? 0 : min;
      const now = new Date().getTime();
      const minutesToAdd = (parseInt(minNumber, 10) + parseInt(timeEstimate, 10)) * 1000 * 60;
      const time = new Date(now + minutesToAdd);
      return (
        <View style={{ marginLeft: 20 }}>
          <Text style={[styles.genericText]}>Duration {timeEstimate} minutes</Text>
          <Text style={[styles.genericText]}>Arrives around {formatAMPM(time)}</Text>
        </View>
      );
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          {/* <Text style={styles.title}>{desc}</Text> */}
          <Text style={[styles.genericText]}>{estimate.length} cars</Text>
        </View>
        {tripForLine && renderArrive(tripForLine.timeEstimate || '')}
      </View>
    );
  }

  render() {
    const { selectorShown, selectionData, selectionKind } = this.props;
    if ((selectorShown || this.state.closing) && selectionData && selectionKind) {
      let stuff;
      if (selectionKind === 'distance' && selectionData.station) {
        stuff = this.renderDistance(selectionData.station);
      }
      if (selectionKind === 'departure' && selectionData.station) {
        stuff = this.renderDeparture(
          selectionData.station,
          selectionData.line,
          selectionData.estimate,
          selectionData.tripForLine,
        );
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

const mapStateToProps = state => ({
  selectorShown: state.selectorShown,
  selectionData: state.selectionData,
  selectionKind: state.selectionKind,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators(
    {
      hideSelector,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Selector);