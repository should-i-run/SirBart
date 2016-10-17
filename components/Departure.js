/* @flow */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import styles from './Station.styles';
import {showSelector} from '../actions/selectorActions';

import type {Station, Estimate, Line} from '../reducers/appStore';

const runningSpeed = 200; // meters per minute
const getRunningTime = distance => Math.ceil(distance / runningSpeed);

type Props = {
  station: Station,
  estimate: Estimate,
  line: Line,
  showSelector: Function,
};

class Departure extends React.Component {
  props: Props;

  toggle = () => {
    const {station, line, estimate} = this.props;
    this.props.showSelector('departure', {station, line, estimate});
  }

  render = () => {
    const {estimate, station} = this.props;
    if (estimate === 'blank') {
      return (
        <View style={styles.departure}>
          <Text style={styles.departureTime}>
            {' '}
          </Text>
        </View>
      );
    }
    const {walkingDirections} = station;
    let labelStyle = styles.missed;
    const departureTime = estimate.minutes === 'Leaving' ? 0 : parseInt(estimate.minutes, 10);

    const {distance, time} = (walkingDirections || {});
    if (distance && typeof time === 'number') {
      if (departureTime >= time) {
        labelStyle = styles.walk;
      } else if (departureTime >= getRunningTime(distance)) {
        labelStyle = styles.run;
      }
    }
    return (
      <TouchableOpacity
        onPress={this.toggle}
        style={styles.departure}>
        <Text style={[styles.departureTime, labelStyle]}>
          {departureTime}
        </Text>
      </TouchableOpacity>
    );
  }
}


const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    showSelector,
  }, dispatch);

export default connect(undefined, mapDispatchToProps)(Departure);
