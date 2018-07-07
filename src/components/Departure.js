/* @flow */
import React from 'react';
import { Text, View } from 'react-native';

import styles from './Departure.styles';
import { stationNames } from '../utils/stations';
import { formatAMPM } from '../utils/time';

import type { Station, Trip } from '../reducers/appStore';

const runningSpeed = 200; // meters per minute
const getRunningTime = distance => Math.ceil(distance / runningSpeed);

type Props = {
  station: Station,
  departure: *,
  tripForLine: ?Trip,
};

class Departure extends React.Component<Props> {
  renderArrive = (trip: TripForLine, min: string) => {
    const minNumber = min === 'Leaving' ? 0 : min;
    const now = new Date().getTime();
    const minutesToAdd = (parseInt(minNumber, 10) + parseInt(trip.timeEstimate, 10)) * 1000 * 60;
    const time = new Date(now + minutesToAdd);
    return (
      <View style={styles.arriveInfo}>
        <Text style={[styles.genericText]}>{trip.timeEstimate} minutes</Text>
        <Text style={[styles.genericText]}>Arrives {formatAMPM(time)}</Text>
        {trip.transferStation && (
          <Text style={[styles.genericText]}>Transfer at {stationNames[trip.transferStation]}</Text>
        )}
      </View>
    );
  };
  render = () => {
    const { station, departure, tripForLine } = this.props;
    const { estimate, line } = departure;
    const { walkingDirections } = station;
    let labelStyle = styles.missed;
    const departureTime = estimate.minutes === 'Leaving' ? 0 : parseInt(estimate.minutes, 10);

    const { distance, time } = walkingDirections || {};
    if (distance && typeof time === 'number') {
      if (departureTime >= time) {
        labelStyle = styles.walk;
      } else if (departureTime >= getRunningTime(distance)) {
        labelStyle = styles.run;
      }
    }
    return (
      <View style={[styles.departure, styles.row, { justifyContent: 'flex-start' }]}>
        <Text style={[styles.departureTime, labelStyle]}>{departureTime}</Text>
        <View style={styles.row}>
          <View styles={styles.trainInfo}>
            <Text style={styles.lineName}>{line.destination}</Text>
            <Text style={[styles.genericText]}>{estimate.length} cars</Text>
          </View>
          {tripForLine && this.renderArrive(tripForLine, estimate.minutes)}
        </View>
      </View>
    );
  };
}

export default Departure;
