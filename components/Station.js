/* @flow */
import React from 'react';
import {
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import StationName from './StationName';
import styles from './Station.styles';
import Departure from './Departure';
import tracker from '../native/ga';

import type {Station, Line} from '../reducers/appStore';

const runningSpeed = 200; // meters per minute
const getRunningTime = distance => Math.ceil(distance / runningSpeed);

type Props = {
  station: Station,
};

export default class StationView extends React.Component {
  props: Props;

  goToSchedule = () => {
    tracker.trackEvent('interaction', 'go-to-schedule');
    Linking.openURL(`https://m.bart.gov/schedules/eta?stn=${this.props.station.abbr}`);
  };

  renderLine = (line: Line, i: number) => {
    const {destination, estimates} = line;
    while (estimates.length < 3) {
      // $FlowFixMe
      estimates.push('blank');
    }
    return (
      <View key={i} style={styles.line}>
        <Text
          numberOfLines={2}
          style={styles.lineName}
        >
          {destination}
        </Text>
        <View style={styles.depTimeContainer}>
          {estimates.map((estimate, eIndex) => (
            <Departure
              key={eIndex}
              line={line}
              estimate={estimate}
              station={this.props.station}
            />))}
        </View>
      </View>
    );
  }

  renderNoDepartures() {
    return (
      <View style={{flexDirection: 'row', margin: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="chain-broken" size={24} color="#FC5B3F" />
        <View
          style={{marginLeft: 10, flex: 1}}>
          <Text style={[styles.genericText, {fontSize: 16, color: '#AAA', fontWeight: '400', marginBottom: 4}]}>
            Departure times aren’t avaliable.
          </Text>
          <TouchableOpacity
            onPress={this.goToSchedule}>
            <Text
              style={{color: '#565FBF', fontSize: 16}}
            >
              Check service status.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const s = this.props.station;
    const {distance, time} = (this.props.station.walkingDirections || {});
    const isMakable = estimate => parseInt(estimate.minutes, 10) >= (time || 999);
    const makableDepartureTime = (a, b) => {
      const aBest = a.estimates.filter(isMakable)[0];
      const aMinutes = aBest ? aBest.minutes : 999;
      const bBest = b.estimates.filter(isMakable)[0];
      const bMinutes = bBest ? bBest.minutes : 999;
      return parseInt(aMinutes, 10) - parseInt(bMinutes, 10);
    };

    const north = s.lines
      .filter(d => d.estimates[0].direction === 'North')
      .sort(makableDepartureTime);
    const south = s.lines
      .filter(d => d.estimates[0].direction === 'South')
      .sort(makableDepartureTime);
    return (
      <View style={styles.station}>
        <StationName station={s} distance={distance} />
        <View style={styles.stationMetadataContainer}>
          <Text style={styles.stationMetadata}>
            Running:
            <Text style={styles.run}> {typeof distance === 'number' ? getRunningTime(distance) : '...'} min</Text>
          </Text>
          <Text style={styles.stationMetadata}>
            Walking:
            <Text style={styles.walk}> {typeof time === 'number' ? (time || 1) : '...'} min</Text>
          </Text>
        </View>
        {!s.lines.length && this.renderNoDepartures(s)}
        {!!north.length &&
          <View style={styles.direction}>
            <Text style={styles.directionText}>Northbound departuers</Text>
            {north.map(this.renderLine)}
          </View>}
        {!!south.length &&
          <View style={styles.direction}>
            <Text style={styles.directionText}>Southbound departures</Text>
            {south.map(this.renderLine)}
          </View>}
      </View>
    );
  }
}
