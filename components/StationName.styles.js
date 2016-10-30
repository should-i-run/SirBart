/* @flow */
import {
  StyleSheet,
} from 'react-native';

const genericText = {
  color: '#E6E6E6',
  fontSize: 18,
  fontWeight: '200',
};

export default StyleSheet.create({
  stationNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stationName: {
    flex: 1,
  },
  stationDistance: {
    maxWidth: 100,
  },
  stationDistanceText: {
    ...genericText,
    color: '#AAA',
    fontSize: 20,
    textAlign: 'right',
  },
  stationNameText: {
    ...genericText,
    height: 29,
    fontSize: 26,
  },
});
