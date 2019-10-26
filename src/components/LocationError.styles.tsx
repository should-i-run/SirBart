import { StyleSheet } from 'react-native';

import { genericText } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  container: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 5,
  },
  advisory: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    ...genericText,
    lineHeight: 24,
    paddingTop: 10,
  },
  icon: {
    marginLeft: 10,
    marginHorizontal: 10,
    top: 4,
  },
});
