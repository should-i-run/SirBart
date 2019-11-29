import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

export default StyleSheet.create({
  station: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 0,
  },
  genericText: {
    ...genericText,
  },
  direction: {
    backgroundColor: colors.layer1,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  directionText: {
    ...genericText,
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 5,
  },
  stationMetadata: {
    ...genericText,
    fontSize: 14,
    marginLeft: 15,
    color: colors.lightText,
  },
  stationMetadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingLeft: 10,
    marginBottom: 10,
  },
  runWalkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  departureTime: {
    ...genericText,
    width: 45,
    textAlign: 'center',
    fontSize: 26,
    paddingVertical: 5,
  },
  lineName: {
    ...genericText,
    width: 120,
  },
  run: {
    color: colors.run,
  },
  walk: {
    color: colors.walk,
  },
  missed: {
    color: '#999',
  },
  stationDistance: {
    maxWidth: 120,
  },
  stationDistanceText: {
    ...genericText,
    color: colors.lightText,
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 26,
  },
});
