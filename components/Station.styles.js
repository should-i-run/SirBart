/* @flow */
import {
  StyleSheet,
} from 'react-native';

import {genericText} from '../styles';

export default StyleSheet.create({
  station: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 10,
  },
  genericText: {
    ...genericText,
  },
  stationMetadata: {
    ...genericText,
    fontSize: 14,
    marginRight: 15,
    color: '#AAA',
  },
  departureTime: {
    ...genericText,
    width: 35,
    textAlign: 'right',
    fontSize: 26,
  },
  lineName: {
    ...genericText,
    width: 120,
  },
  direction: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#344453',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 5,
  },
  directionText: {
    ...genericText,
    fontSize: 14,
    color: '#AAA',
    marginBottom: -5,
  },
  stationMetadataContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginTop: 6,
  },
  departure: {
    marginLeft: 5,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  depTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  missed: {
    color: '#999',
  },
  run: {
    color: '#FC5B3F',
  },
  walk: {
    color: '#6FD57F',
  },
});
