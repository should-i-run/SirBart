import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  genericText: {
    ...genericText,
  },
  container: {
    paddingTop: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: colors.layer1,
    borderRadius: 5,
  },
  advisory: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 14,
    color: colors.genericText,
  },
  icon: {
    marginLeft: 10,
    marginHorizontal: 10,
    top: 4,
    ...genericText,
    fontSize: 16,
  },
});
