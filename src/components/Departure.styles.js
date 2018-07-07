/* @flow */
import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  departureTime: {
    ...genericText,
    width: 45,
    textAlign: 'center',
    fontSize: 26,
    marginLeft: -10,
  },
  lineName: {
    ...genericText,
    fontSize: 26,
  },
  trainInfo: {
    width: 150,
  },
  arriveInfo: {
    marginLeft: 10,
  },

  departure: {
    marginVertical: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missed: {
    color: '#999',
  },
  run: {
    color: colors.run,
  },
  walk: {
    color: colors.walk,
  },
});
