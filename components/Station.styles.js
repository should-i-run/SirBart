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
  genericText: {
    ...genericText,
  },
  stationName: {
    ...genericText,
    fontSize: 26,
    flex: 5,
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
    backgroundColor: '#344453',
    padding: 5,
    marginTop: 10,
    borderRadius: 2,
    paddingLeft: 10,
  },
  directionText: {
    ...genericText,
    fontSize: 14,
    color: '#AAA',
    marginBottom: -5,
  },
  stationDistance: {
    ...genericText,
    color: '#AAA',
    fontSize: 26,
    flex: 4,
    marginRight: 10,
    textAlign: 'right',
  },
  station: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 30,
    marginBottom: 20,
  },
  stationNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationMetadataContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginTop: 10,
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
    // fontWeight: '400',
  },
  walk: {
    color: '#6FD57F',
    // fontWeight: '400',
  },
});
