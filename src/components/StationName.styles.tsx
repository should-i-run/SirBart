import { StyleSheet } from 'react-native';

import { genericText } from '../styles';

export default StyleSheet.create({
  stationNameContainer: {
    marginLeft: 8,
  },
  stationName: {
    flex: 1,
  },
  stationNameText: {
    ...genericText,
    fontSize: 26,
  },
});
