/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import StationView from './Station';
import {startLocation} from '../actions/locationActions';
import {startFetchingTimes, stopFetchingTimes, hackilySetLoc} from '../actions/dataActions';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252F39',
    paddingTop: 20,
  },
});

type Props = {
  walkingData: Object,
  stations: ?Object,
  location: ?Object,
  locationError: bool,
  startLocation: Function,
  startFetchingTimes: Function,
  stopFetchingTimes: Function,
};

class DataContainer extends React.Component {
  props: Props;

  componentWillMount() {
    this.props.startLocation();
  }

  componentWillReceiveProps(nextProps: Props) {
    hackilySetLoc(nextProps.location);
    if (!this.props.location && nextProps.location) {
      this.props.startFetchingTimes();
    }
    if (this.props.location && !nextProps.location) {
      this.props.stopFetchingTimes();
    }
    // if any walking directions are dirty, fetch walking directions for it.
  }

  render() {
    const {location, walkingData, stations, locationError} = this.props;
    return (
      <ScrollView style={styles.container}>
        {stations && stations.map((s, i) =>
          <StationView key={i} station={s} walking={walkingData[s.abbr]} location={location} />)}
        {locationError && <Text>Location Error</Text>}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  location: state.location,
  stations: state.stations,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    startLocation,
    startFetchingTimes,
    stopFetchingTimes,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
