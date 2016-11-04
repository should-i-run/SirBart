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
    maxWidth: 120,
  },
  stationDistanceText: {
    ...genericText,
    color: '#AAA',
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 26,
  },
  stationNameText: {
    ...genericText,
    fontSize: 26,
  },
});
