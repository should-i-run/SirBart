/* @flow */
import {
  StyleSheet,
  Platform,
} from 'react-native';

import {genericText} from '../styles';

export default StyleSheet.create({
  item: {
    ...genericText,
  },
  picker: {
    width: 350,
    height: Platform.select({ios: 200, android: 30}),
    elevation: 5,
    color: Platform.select({ios: 'inherit', android: '#FFF'}),
  },
});
