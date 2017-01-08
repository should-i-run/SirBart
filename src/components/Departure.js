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
import {showSelector, hideSelector} from '../actions/selectorActions';
import tracker from '../native/ga';

import type {Station, Estimate, Line, Trip} from '../reducers/appStore';

const runningSpeed = 200; // meters per minute
const getRunningTime = distance => Math.ceil(distance / runningSpeed);

function getKey(station: Station, line: Line, estimate: Estimate) {
  return `${station.abbr}-${line.destination}-${estimate.minutes}`;
}

type Props = {
  station: Station,
  estimate: Estimate,
  line: Line,
  tripForLine: ?Trip,
  showSelector: Function,
  hideSelector: Function,
  selectorShown: bool,
  selectionData: ?Object,
  selectionKind: 'departure' | 'distance',
  selectionKey: ?string,
};

class Departure extends React.Component {
  props: Props;

  toggle = () => {
    const {selectorShown, selectionData, selectionKind, estimate, station, line, tripForLine} = this.props;
    if (selectorShown && selectionData && selectionKind === 'departure') {
      const isSelected = selectionData.estimate.minutes === estimate.minutes;
      if (isSelected) {
        this.props.hideSelector();
        tracker.trackEvent('interaction', 'hide-selector-departure');

        return;
      }
    }
    this.props.showSelector('departure', {station, line, estimate, tripForLine}, getKey(station, line, estimate));
    tracker.trackEvent('interaction', 'show-selector-departure');
  }

  render = () => {
    const {estimate, station, line, selectionKey} = this.props;
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
    const isSelected = getKey(station, line, estimate) === selectionKey;
    return (
      <View style={isSelected && styles.selectedDeparture}>
        <TouchableOpacity
          onPress={this.toggle}
          style={[styles.departure]}>
          <Text style={[styles.departureTime, labelStyle]}>
            {departureTime}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectionData: state.selectionData,
  selectionKind: state.selectionKind,
  selectorShown: state.selectorShown,
  selectionKey: state.selectionKey,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    showSelector,
    hideSelector,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Departure);
