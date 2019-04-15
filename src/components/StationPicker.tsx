import * as React from 'react';

import { Picker } from 'react-native';

import { stationNames } from '../utils/stations';

import styles from './StationPicker.styles';

type Props = {
  onSelect: (itemValue: any, itemPosition: number) => void;
  selectedValue: string;
};

class StationPicker extends React.Component<Props> {
  render() {
    return (
      <Picker
        style={styles.picker}
        itemStyle={styles.item}
        selectedValue={this.props.selectedValue}
        onValueChange={this.props.onSelect}
      >
        {Object.keys(stationNames).map(k => (
          <Picker.Item label={stationNames[k]} value={k} key={k} />
        ))}
      </Picker>
    );
  }
}

export default StationPicker;
