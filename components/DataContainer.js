/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  View,
} from 'react-native';

import StationView from './Station';
import Selector from './Selector';
import DestinationSelector from './DestinationSelector';
import {startLocation} from '../actions/locationActions';
import {
  setupDataFetching,
  stopFetchingTimes,
  hackilySetLoc,
  fetchWalkingDirections,
  fetchStations,
  refreshStations,
} from '../actions/dataActions';

import {
  loadSavedDestinations,
} from '../actions/destinationActions';

import tracker from '../native/ga';

import type {Station, Trip} from '../reducers/appStore';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252F39',
    paddingTop: 30,
  },
});

type State = {
  fakeRefreshing: false,
};

type Props = {
  stations: ?Object,
  location: ?Object,
  locationError: bool,
  linesForStations: ?Trip[],
  startLocation: Function,
  setupDataFetching: Function,
  fetchWalkingDirections: (s: Station) => void,
  refreshingStations: bool,
  refreshStations: Function,
  fetchStations: Function,
  loadSavedDestinations: Function,
};

class DataContainer extends React.Component {
  props: Props;
  state: State;

  state = {
    fakeRefreshing: false,
  };

  componentWillMount() {
    this.props.startLocation();
    this.props.fetchStations();
    this.props.setupDataFetching();
    this.props.loadSavedDestinations();
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

  refreshStations = () => {
    this.props.refreshStations();
    this.setState({fakeRefreshing: true});
    setTimeout(() => {
      this.setState({fakeRefreshing: false});
    }, 800);
    tracker.trackEvent('interaction', 'pull-to-refresh');
  }

  render() {
    const {location, stations, locationError, linesForStations} = this.props;
    return (
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshingStations || this.state.fakeRefreshing}
              onRefresh={this.refreshStations}
              tintColor="#E6E6E6"
            />
          }
          style={styles.container}
        >
          <DestinationSelector />
          {stations && stations.map((s, i) => {
            const selectedLines = linesForStations && linesForStations.find(l => l.code === s.abbr);
            return (
              <StationView
                key={i}
                station={s}
                location={location}
                selectedLines={selectedLines}
              />
            );
          })}
          {locationError && <Text>Location Error</Text>}
        </ScrollView>
        <Selector />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  location: state.location,
  stations: state.stations,
  refreshingStations: state.refreshingStations,
  linesForStations: state.linesForStations,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    startLocation,
    setupDataFetching,
    stopFetchingTimes,
    fetchWalkingDirections,
    refreshStations,
    fetchStations,
    loadSavedDestinations,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
