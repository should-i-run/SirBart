/* @flow */
import React from 'react';

import {
  Picker,
} from 'react-native';

import {stationNames} from '../utils/stations';

import styles from './StationPicker.styles';

type Props = {
  onSelect: Function,
  selectedValue: string,
};

class StationPicker extends React.Component {
  props: Props;

  render() {
    return (
      <Picker
        style={styles.picker}
        itemStyle={styles.item}
        selectedValue={this.props.selectedValue}
        onValueChange={this.props.onSelect}>
        {Object.keys(stationNames).map(k =>
          <Picker.Item
            label={stationNames[k]}
            value={k}
            key={k}
          />,
        )}
      </Picker>
    );
  }
}

export default StationPicker;
