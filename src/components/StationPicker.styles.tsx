/* @flow */
import { StyleSheet, Platform } from 'react-native';

import { genericText } from '../styles';
export const pickerHeight = 200;

export default StyleSheet.create({
  item: {
    ...genericText,
  },
  picker: {
    width: 350,
    height: Platform.select({ ios: pickerHeight, android: 30 }),
    elevation: 5,
    ...(Platform.OS === 'android' ? { color: '#FFF' } : {}),
  },
});
