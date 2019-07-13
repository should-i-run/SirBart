import * as React from 'react';
import { Text, View } from 'react-native';

import { Station } from '../reducers/appStore';
import styles from './StationName.styles';

type Props = {
  station: Station;
  distance?: number;
};

class StationView extends React.Component<Props> {

  render() {
    const { station, distance } = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <View style={styles.stationName}>
          <Text style={styles.stationNameText} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
        <View style={[styles.stationDistance]}>
          <Text style={styles.stationDistanceText} numberOfLines={1}>
            {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
          </Text>
        </View>
      </View>
    );
  }
}

export default StationView;
