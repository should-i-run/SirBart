import * as React from 'react';
import { Text, View } from 'react-native';

import { Station } from '../reducers/appStore';
import styles from './StationName.styles';

type Props = {
  station: Station;
};

class StationView extends React.Component<Props> {
  render() {
    const { station } = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <View style={styles.stationName}>
          <Text style={styles.stationNameText} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
      </View>
    );
  }
}

export default StationView;
