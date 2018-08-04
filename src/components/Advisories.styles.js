/* @flow */
import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisory: {
    paddingVertical: 10,
  },
  advisoryContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  text: {
    fontSize: 14,
    color: colors.lightText,
  },
  icon: {
    marginRight: 10,
  },
});
