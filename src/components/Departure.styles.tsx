import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  departureTime: {
    ...genericText,
    width: 65,
    textAlign: 'right',
    fontSize: 46,
    fontWeight: '100',
    marginLeft: -8,
    marginRight: 10,
  },
  lineName: {
    ...genericText,
    fontSize: 26,
    color: colors.lightText,
    marginTop: 5,
  },

  departure: {},

  metadataText: {
    ...genericText,
    color: colors.lightText,
    fontSize: 14,
    marginRight: 5,
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
  best: {
    color: colors.walk,
  },
  walk: {
    color: genericText.color,
  },
});
