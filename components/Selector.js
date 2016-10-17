/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';

import {
  View,
  Text,
  Animated,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {
  hideSelector,
} from '../actions/selectorActions';
import styles from './Selector.styles';

import type {Station, Line, Estimate} from '../reducers/appStore';

type Props = {
  selectorShown: bool,
  hideSelector: Function,
  selectionKind: 'distance',
  selectionData: ?Object,
};

class Selector extends React.Component {
  props: Props;

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.selectorShown && nextProps.selectorShown) {
      this.show();
    }
    if (this.props.selectorShown && !nextProps.selectorShown) {
      this.close();
    }
  }

  height: Animated.Value = new Animated.Value(0);

  show = () => {
    Animated.spring(this.height, {
      toValue: 1,
      friction: 7,
      tension: 70,
    }).start();
  }

  close = () => {
    Animated.spring(this.height, {
      toValue: 0,
      friction: 7,
      tension: 70,
    }).start();
  }

  goToDirections = () => {
    if (this.props.selectionData) {
      const {lat, lng} = this.props.selectionData.station.closestEntranceLoc;
      Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=w&t=r`);
    }
  }

  renderDistance(station: Station) {
    const {distance} = station.walkingDirections; // TODO calculate color in the store and use here.
    return (
      <TouchableOpacity onPress={this.goToDirections} activeOpacity={0.5}>
        <Text style={styles.title}>{typeof distance === 'number' ? distance.toLocaleString() : '...'} meters</Text>
        <Text style={styles.genericText}>Get walking directions</Text>
      </TouchableOpacity>
    );
  }

  renderDeparture(station: Station, line: Line, estimate: Estimate) {
    // const {distance} = station.walkingDirections; // TODO calculate color in the store and use here.
    return (
      <TouchableOpacity onPress={this.goToDirections} activeOpacity={0.5}>
        <Text style={styles.title}>{estimate.minutes} minutes</Text>
        <Text style={[styles.genericText, {color: estimate.hexcolor}]}>{estimate.length} cars</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {selectionData, selectionKind} = this.props;
    if (selectionData && selectionKind) {
      let stuff;
      if (selectionKind === 'distance' && selectionData.station) {
        stuff = this.renderDistance(selectionData.station);
      }
      if (selectionKind === 'departure' && selectionData.station) {
        stuff = this.renderDeparture(selectionData.station, selectionData.line, selectionData.estimate);
      }
      if (stuff) {
        const bottom = this.height.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        });
        return (
          <Animated.View
            style={[styles.selector, {
              transform: [{translateY: bottom}],
            }]}>
            {stuff}
            <View style={styles.closeContainer}>
              <Text onPress={this.props.hideSelector} style={styles.genericText}>X</Text>
            </View>
          </Animated.View>
        );
      }
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
  bindActionCreators({
    hideSelector,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Selector);
