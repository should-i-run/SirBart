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
import {setupDataFetching,
  stopFetchingTimes,
  hackilySetLoc,
  fetchWalkingDirections,
  fetchStations,
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
  stations: ?Object,
  location: ?Object,
  locationError: bool,
  startLocation: Function,
  setupDataFetching: Function,
  fetchWalkingDirections: (s: Station) => void,
  refreshingStations: bool,
  refreshStations: Function,
  fetchStations: Function,
};

class DataContainer extends React.Component {
  props: Props;

  componentWillMount() {
    this.props.startLocation();
    this.props.fetchStations();
    this.props.setupDataFetching();
  }

  componentWillReceiveProps(nextProps: Props) {
    hackilySetLoc(nextProps.location);
    if (!this.props.location && nextProps.location) {
      this.props.fetchStations();
    }

    if (nextProps.stations) {
      nextProps.stations.forEach((s: Station) => {
        if (s.walkingDirections.state === 'dirty') {
          this.props.fetchWalkingDirections(s);
        }
      });
    }
  }

  render() {
    const {location, stations, locationError} = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshingStations}
            onRefresh={this.props.refreshStations}
            tintColor="#E6E6E6"
          />
        }
        style={styles.container}
      >
        {stations && stations.map((s, i) =>
          <StationView key={i} station={s} location={location} />)}
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
    setupDataFetching,
    stopFetchingTimes,
    fetchWalkingDirections,
    refreshStations,
    fetchStations,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
