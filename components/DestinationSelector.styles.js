/* @flow */
import {
  StyleSheet,
} from 'react-native';

import {genericText} from '../styles';

export default StyleSheet.create({
  wrapper: {
    height: 45,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  genericText,
  label: {
    ...genericText,
    marginRight: 10,
  },
});
