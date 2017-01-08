/* @flow */
import {
  StyleSheet,
} from 'react-native';

import {genericText, colors} from '../styles';

export default StyleSheet.create({
  title: {
    ...genericText,
    fontWeight: '600',
  },
  genericText,
  selector: {
    position: 'absolute',
    height: 120,
    bottom: -120,
    left: 0,
    right: 0,
    backgroundColor: colors.darkBackground,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 10,
    paddingBottom: 30,
    shadowColor: colors.darkBackground,
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  closeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  token: {
    marginRight: 30,
    padding: 5,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    height: 35,
  },
  leftRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
});
