/* @flow */
import React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import StationName from './StationName';
import styles from './Station.styles';
import Departure from './Departure';
import tracker from '../native/ga';

import type { Station, Line, Trip, Estimate } from '../reducers/appStore';

const runningSpeed = 200; // meters per minute
const getRunningTime = distance => Math.ceil(distance / runningSpeed);

type DepartureType = {
  estimate: Estimate,
  line: Line,
};

type Props = {
  station: Station,
  tripForStation: ?Trip,
};

export default class StationView extends React.Component<Props> {
  goToSchedule = () => {
    tracker.trackEvent('interaction', 'go-to-schedule');
    Linking.openURL(`https://m.bart.gov/schedules/eta?stn=${this.props.station.abbr}`);
  };

  renderDirection = (lines: Line[], direction: string) => {
    const { tripForStation } = this.props;
    const departures: DepartureType[] = lines
      .reduce((acc, l) => {
        const estimates = l.estimates.map(e => ({
          estimate: e,
          line: l,
        }));
        return acc.concat(estimates);
      }, [])
      .sort((a: DepartureType, b: DepartureType) => {
        if (parseInt(a.estimate.minutes, 10) < parseInt(b.estimate.minutes, 10)) {
          return -1;
        }
        return 1;
      })
      .slice(0, 4);

    return (
      <View key={direction}>
        {departures.map(d => {
          const tripForLine = tripForStation
            ? tripForStation.lines.find(l => l.abbreviation === d.line.abbreviation)
            : undefined;
          return (
            <Departure
              key={`${d.estimate.minutes}${d.line.abbreviation}`}
              departure={d}
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
              { fontSize: 16, color: '#AAA', fontWeight: '400', marginBottom: 4 },
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
    const { tripForStation } = this.props;
    const s = this.props.station;
    const { distance, time } = this.props.station.walkingDirections || {};

    const lineName = (a: Line, b: Line) =>
      a.destination.charCodeAt(0) - b.destination.charCodeAt(0);

    const selected = tripForStation
      ? s.lines.filter(l =>
          tripForStation.lines.map(line => line.abbreviation).includes(l.abbreviation),
        )
      : s.lines;

    const north = selected.filter(d => d.estimates[0].direction === 'North').sort(lineName);
    const south = selected.filter(d => d.estimates[0].direction === 'South').sort(lineName);
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
            <Text style={styles.directionText}>Northbound departures</Text>
            {this.renderDirection(north, 'north')}
          </View>
        )}
        {!!south.length && (
          <View style={styles.direction}>
            <Text style={styles.directionText}>Southbound departures</Text>
            {this.renderDirection(south, 'south')}
          </View>
        )}
      </View>
    );
  }
}
