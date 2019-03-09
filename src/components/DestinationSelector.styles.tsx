/* @flow */
import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

import { genericText, colors } from '../styles';
import { pickerHeight } from './StationPicker.styles';

const styles: { [k: string]: ViewStyle | TextStyle } = {
  wrapper: {
    ...(Platform.OS === 'ios' ? { zIndex: 100 } : {}),
    // alignItems: 'flex-end',
    // marginBottom: 30,
    justifyContent: 'flex-start',
    // flexDirection: 'column',
    backgroundColor: colors.darkBackground,
    shadowColor: colors.darkBackground,
    shadowRadius: 10,
    shadowOpacity: 1,
    borderRadius: 12,
    height: 105,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 10,
    // marginHorizontal: 5,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginHorizontal: 10,
  //   borderRadius: 5,
  //   // height: 55,
  // },
  pickerContainer: {
    position: 'absolute',
    zIndex: Platform.select({ ios: 100, android: 0 }),
    elevation: 5,
    top: 20 - pickerHeight,
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
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    borderColor: colors.lightText,
  },
  disabledText: {
    color: colors.disabledText,
  },
};

export default styles;
