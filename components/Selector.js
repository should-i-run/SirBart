/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Text,
  Animated,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {
  hideSelector,
} from '../actions/selectorActions';
import tracker from '../native/ga';

import styles from './Selector.styles';

import type {Station, Line, Estimate} from '../reducers/appStore';

type Props = {
  selectorShown: bool,
  hideSelector: Function,
  selectionKind: 'distance' | 'departure',
  selectionData: ?Object,
};

class Selector extends React.Component {
  props: Props;
  state: {closing: bool};

  state = {closing: false};

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.selectorShown && nextProps.selectorShown) {
      this.show();
    }
    if (this.props.selectorShown && !nextProps.selectorShown) {
      this.setState({closing: true});
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
  }

  close = () => {
    tracker.trackEvent('interaction', 'close-selector');
    this.height.setValue(1);
    Animated.spring(this.height, {
      toValue: 0,
      friction: 7,
      tension: 70,
    }).start(() => this.setState({closing: false}));
  }

  goToDirections = () => {
    tracker.trackEvent('interaction', 'go-to-directions');
    if (this.props.selectionData) {
      const {lat, lng} = this.props.selectionData.station.closestEntranceLoc;
      Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=w&t=r`);
    }
  }

  renderDistance(station: Station) {
    const {distance} = station.walkingDirections;
    return (
      <TouchableOpacity onPress={this.goToDirections}>
        <Text style={styles.title}>{typeof distance === 'number' ? distance.toLocaleString() : '...'} meters</Text>
        <Text style={styles.genericText}>Get walking directions</Text>
      </TouchableOpacity>
    );
  }

  renderDeparture(station: Station, line: Line, estimate: Estimate) {
    // const {distance} = station.walkingDirections; // TODO calculate color in the store and use here.
    return (
      <TouchableOpacity>
        <Text style={styles.title}>{estimate.minutes} minutes</Text>
        <Text style={[styles.genericText, {color: estimate.hexcolor}]}>{estimate.length} cars</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {selectorShown, selectionData, selectionKind} = this.props;
    if ((selectorShown || this.state.closing) && selectionData && selectionKind) {
      let stuff;
      if (selectionKind === 'distance' && selectionData.station) {
        stuff = this.renderDistance(selectionData.station);
      }
      if (selectionKind === 'departure' && selectionData.station) {
        stuff = this.renderDeparture(selectionData.station, selectionData.line, selectionData.estimate);
      }
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
  bindActionCreators({
    hideSelector,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Selector);
