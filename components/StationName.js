/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {showSelector} from '../actions/selectorActions';

import type {Station} from '../reducers/appStore';
import styles from './Station.styles';


type Props = {
  station: Station,
  distance: ?number,
  showSelector: Function,
};

class StationView extends React.Component {
  props: Props;

  goToDirections = () => {
    this.props.showSelector('distance', {station: this.props.station});
  }

  render() {
    const {station, distance} = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <TouchableOpacity
          onPress={this.goToDirections}
          style={styles.stationName}>
          <Text style={styles.stationNameText} numberOfLines={1}>{station.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToDirections}
          style={[styles.stationDistance]}>
          <Text style={styles.stationDistanceText} >
            {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    showSelector,
  }, dispatch);

export default connect(undefined, mapDispatchToProps)(StationView);
