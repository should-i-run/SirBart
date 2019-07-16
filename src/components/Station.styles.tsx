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
    backgroundColor: colors.lightBackground,
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
    marginRight: 15,
    color: colors.lightText,
    marginBottom: 10,
  },
  stationMetadataContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginTop: 6,
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
});
