import React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import StationName from './StationName';
import styles from './Station.styles';
import DepartureView from './Departure';
import tracker from '../native/analytics';
import { colors } from '../styles';
import { getRunningTime } from '../utils/distance';

import { Station, Departure } from '../reducers/appStore';

type Props = {
  station: Station;
  selectedTrip?: Trip;
};

export default class StationView extends React.Component<Props> {
  goToSchedule = () => {
    tracker.logEvent('go_to_schedule');
    Linking.openURL(`https://m.bart.gov/schedules/eta?stn=${this.props.station.abbr}`);
  };

  renderDirection = (departures: Departure[], direction: string) => {
    const { selectedTrip, station } = this.props;
    const firstWalkableIndex = departures.findIndex(d =>
      station.walkingDirections.time === undefined
        ? false
        : (d.estimate.minutes || 0) >= station.walkingDirections.time,
    );
    const firstRunableIndex = departures.findIndex(d =>
      station.walkingDirections.distance === undefined
        ? false
        : (d.estimate.minutes || 0) >= getRunningTime(station.walkingDirections.distance),
    );
    return (
      <View key={direction}>
        {departures.slice(0, 4).map((d, i) => {
          const tripForLine = selectedTrip
            ? selectedTrip.lines.find(l => l.abbreviation === d.line.abbreviation)
            : undefined;
          return (
            <DepartureView
              key={`${d.estimate.minutes}${d.line.abbreviation}${d.estimate.length}${i}`}
              departure={d}
              firstWalkableIndex={firstWalkableIndex === undefined ? -1 : firstWalkableIndex}
              firstRunableIndex={firstRunableIndex === undefined ? -1 : firstRunableIndex}
              index={i}
              station={this.props.station}
              tripForLine={tripForLine}
            />
          );
        })}
      </View>
    );
  };

  renderNoDepartures() {
    return (
      <View
        style={{ flexDirection: 'row', margin: 10, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon name="chain-broken" size={24} color="#FC5B3F" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            style={[
              styles.genericText,
              { fontSize: 16, color: colors.lightText, fontWeight: '400', marginBottom: 4 },
            ]}
          >
            No departure times avaliable.
          </Text>
          <TouchableOpacity onPress={this.goToSchedule}>
            <Text style={{ color: '#565FBF', fontSize: 16 }}>Check service status.</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { selectedTrip } = this.props;
    const s = this.props.station;
    const { distance, time } = s.walkingDirections;

    const selectedDepartures = selectedTrip
      ? s.departures.filter(d =>
          selectedTrip.lines.map(line => line.abbreviation).includes(d.line.abbreviation),
        )
      : s.departures;

    const north = selectedDepartures.filter(d => d.estimate.direction === 'North');
    const south = selectedDepartures.filter(d => d.estimate.direction === 'South');
    return (
      <View style={styles.station}>
        <StationName station={s} distance={distance} />
        <View style={styles.stationMetadataContainer}>
          <Text style={styles.stationMetadata}>
            Running:
            <Text style={styles.run}>
              {' '}
              {typeof distance === 'number' ? getRunningTime(distance) : '...'} min
            </Text>
          </Text>
          <Text style={styles.stationMetadata}>
            Walking:
            <Text style={styles.walk}> {typeof time === 'number' ? time || 1 : '...'} min</Text>
          </Text>
        </View>
        {!s.lines.length && this.renderNoDepartures()}
        {!!north.length && (
          <View style={styles.direction}>
            {!selectedTrip && <Text style={styles.directionText}>Northbound departures</Text>}
            {this.renderDirection(north, 'north')}
          </View>
        )}
        {!!south.length && (
          <View style={styles.direction}>
            {!selectedTrip && <Text style={styles.directionText}>Southbound departures</Text>}
            {this.renderDirection(south, 'south')}
          </View>
        )}
      </View>
    );
  }
}
