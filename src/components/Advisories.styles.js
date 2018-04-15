/* @flow */
import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  container: {
    paddingHorizontal: 10,
  },
  advisory: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 14,
    color: '#AAA',
  },
});
