/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';

import StationView from './Station';
import {startLocation} from '../actions/locationActions';
import {startFetchingTimes,
  stopFetchingTimes,
  hackilySetLoc,
  fetchWalkingDirections,
  fetchImmediate,
  refreshStations,
} from '../actions/dataActions';

import type {Station} from '../reducers/appStore';

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
  fetchWalkingDirections: (s: Station) => void,
  refreshingStations: bool,
  refreshStations: Function,
};

class DataContainer extends React.Component {
  props: Props;

  componentWillMount() {
    this.props.startLocation();
    this.props.startFetchingTimes();
  }

  componentWillReceiveProps(nextProps: Props) {
    hackilySetLoc(nextProps.location);
    this.props.startFetchingTimes();

    if (nextProps.stations) {
      nextProps.stations.forEach((s: Station) => {
        if (s.walkingDirections.state === 'dirty') {
          this.props.fetchWalkingDirections(s);
        }
      });
    }
  }

  render() {
    const {location, walkingData, stations, locationError} = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshingStations}
            onRefresh={this.props.refreshStations}
          />
        }
        style={styles.container}
      >
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
  refreshingStations: state.refreshingStations,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    startLocation,
    startFetchingTimes,
    stopFetchingTimes,
    fetchWalkingDirections,
    refreshStations,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
