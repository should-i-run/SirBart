/* @flow */
import {
  StyleSheet,
} from 'react-native';

const genericText = {
  color: '#E6E6E6',
  fontSize: 18,
  fontWeight: '200',
};

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
    backgroundColor: '#19212C',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 10,
    shadowColor: '#19212C',
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
  leftRight: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
