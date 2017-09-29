/* @flow */
import { StyleSheet, Platform } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  wrapper: {
    ...(Platform.OS === 'ios' ? { zIndex: 100 } : {}),
    alignItems: 'stretch',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.darkBackground,
    marginHorizontal: 10,
    borderRadius: 5,
    height: 55,
  },
  pickerContainer: {
    position: 'absolute',
    zIndex: Platform.select({ ios: 100, android: 0 }),
    elevation: 5,
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
    shadowColor: colors.darkBackground,
    shadowRadius: 10,
    shadowOpacity: 1,
    backgroundColor: colors.darkBackground,
    padding: 10,
  },
  picker: {
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  genericText,
  label: {
    ...genericText,
  },
  leftRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destToken: {
    marginRight: 8,
    maxWidth: 140,
    padding: 6,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    borderColor: '#AAA',
  },
  disabledText: {
    color: '#999',
  },
});
