/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import {
  Text,
  View,
  Linking,
} from 'react-native';

import {toggleSelector} from '../actions/selectorActions';

import type {Station} from '../reducers/appStore';
import styles from './Station.styles';


type Props = {
  station: Station,
  distance: ?number,
  toggleSelector: Function,
};

class StationView extends React.Component {
  props: Props;

  goToDirections = () => {
    if (this.props.station.closestEntranceLoc) {
      // const {lat, lng} = this.props.station.closestEntranceLoc;
      // Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=w&t=r`);
      this.props.toggleSelector();
    }
  }

  render() {
    const {station, distance} = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <Text style={styles.stationName} numberOfLines={1}>{station.name}</Text>
        <Text style={[styles.stationDistance]} onPress={this.goToDirections}>
          {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    toggleSelector,
  }, dispatch);

export default connect(undefined, mapDispatchToProps)(StationView);
