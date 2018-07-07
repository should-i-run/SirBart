/* @flow */
import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  stationNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  stationName: {
    flex: 1,
  },
  stationDistance: {
    maxWidth: 120,
  },
  stationDistanceText: {
    ...genericText,
    color: colors.lightText,
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 26,
  },
  stationNameText: {
    ...genericText,
    fontSize: 26,
  },
});
