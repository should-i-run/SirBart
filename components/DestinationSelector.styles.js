/* @flow */
import {
  StyleSheet,
} from 'react-native';

import {genericText} from '../styles';

export default StyleSheet.create({
  wrapper: {
    height: 45,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  pickerContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
    shadowColor: '#19212C',
    shadowRadius: 10,
    shadowOpacity: 1,
    backgroundColor: '#19212C',
    padding: 10,
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
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    height: 35,
  },
  clearToken: {
    marginRight: 8,
    padding: 5,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    height: 30,
    width: 45,
  },
});
