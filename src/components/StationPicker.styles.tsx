import { StyleSheet, Platform } from 'react-native';

import { genericText } from '../styles';

export default StyleSheet.create({
  item: {
    ...genericText,
  },
  picker: {
    width: 350,
    ...(Platform.OS === 'android' ? { color: '#FFF' } : {}),
  },
});
