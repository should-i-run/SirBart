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
    paddingVertical: 5,
    marginLeft: -10,
  },
  lineName: {
    ...genericText,
    fontSize: 26,
  },
  trainInfo: {
    width: 150,
    marginRight: 10,
    flex: 0,
  },
  arriveInfo: {
    marginLeft: 10,
    flex: 0,
  },

  departure: {
    marginHorizontal: 0,
    padding: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
