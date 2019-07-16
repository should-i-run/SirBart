import * as React from 'react';
import { Text, View } from 'react-native';

import styles from './Departure.styles';
import { colors } from '../styles';
import { formatAMPM } from '../utils/time';

import { Station, Departure as DepartureType } from '../reducers/appStore';

type Props = {
  station: Station;
  departure: DepartureType;
  tripForLine?: TripForLine;
  firstWalkableIndex: number;
  firstRunableIndex: number;
  index: number;
};

class Departure extends React.Component<Props> {
  // renderArrive = (trip: TripForLine, min: number) => {
  //   const now = new Date().getTime();
  //   const minutesToAdd = (min + parseInt(trip.timeEstimate, 10)) * 1000 * 60;
  //   const time = new Date(now + minutesToAdd);
  //   return (
  //     <View style={styles.arriveInfo}>
  //       <Text style={[styles.genericText]}>Takes {trip.timeEstimate} minutes</Text>
  //       <Text style={[styles.genericText]}>Arrives {formatAMPM(time)}</Text>
  //       {trip.transferStation && (
  //         <Text style={[styles.genericText]}>Transfer at {stationNames[trip.transferStation]}</Text>
  //       )}
  //     </View>
  //   );
  // };
  renderEstimateArrive = (trip: TripForLine, min: number) => {
    const now = new Date().getTime();
    const minutesToAdd =
      (min + parseInt(String(trip.timeEstimate), 10)) * 1000 * 60;
    const time = new Date(now + minutesToAdd);
    return (
      <Text key="a" style={[styles.metadataText]}>
        • Arrives {formatAMPM(time)}
      </Text>
    );
  };

  render = () => {
    const {
      station,
      departure,
      tripForLine,
      firstWalkableIndex,
      index,
      firstRunableIndex,
    } = this.props;
    const { estimate, line } = departure;
    const { walkingDirections } = station;
    const isFirstWalkable = firstWalkableIndex === index;
    const isAfterFirstWalkable = firstWalkableIndex < index;
    const isRunable = index >= firstRunableIndex && index < firstWalkableIndex;
    const isMissed = index < firstRunableIndex && index < firstWalkableIndex;

    let labelStyle = styles.missed;
    const { distance, time } = walkingDirections;
    if (distance && typeof time === 'number') {
      if (isFirstWalkable) {
        labelStyle = styles.best;
      } else if (isRunable) {
        // labelStyle = styles.run;
        labelStyle = styles.walk as { color: string };
      } else if (isAfterFirstWalkable) {
        labelStyle = styles.walk as { color: string };
      }
    }
    //
    // function getStatus() {
    //   if (isMissed) {
    //     return 'missed';
    //   } else if (isRunable) {
    //     return 'run';
    //   } else if (isFirstWalkable || isAfterFirstWalkable) {
    //     return 'walk';
    //   }
    //   return '';
    // }

    return (
      <View
        style={[styles.departure, styles.row, { alignItems: 'flex-start' }]}
      >
        <Text style={[styles.departureTime, labelStyle]}>
          {estimate.minutes}
        </Text>
        <View>
          <Text
            style={[
              styles.lineName,
              !isMissed && { color: colors.genericText },
              // (isAfterFirstWalkable || isRunable) && { color: colors.genericText },
              // isFirstWalkable && styles.best,
            ]}
          >
            {line.destination}
          </Text>
          <View style={styles.row}>
            {/* <Text style={[styles.metadataText]}>{getStatus()}</Text> */}
            <Text style={[styles.metadataText]}>{estimate.length} cars</Text>
            {/* {tripForLine && (
              <Text key="t" style={[styles.metadataText]}>
                Takes {tripForLine.timeEstimate} minutes
              </Text>
            )} */}
            {tripForLine &&
              this.renderEstimateArrive(tripForLine, estimate.minutes)}
          </View>
        </View>
      </View>
    );
  };
}

export default Departure;
