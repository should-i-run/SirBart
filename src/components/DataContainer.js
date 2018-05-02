/* @flow */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import { ScrollView, Text, RefreshControl, View, Platform } from 'react-native';

import Advisories from './Advisories';
import StationView from './Station';
import Selector from './Selector';
import DestinationSelector from './DestinationSelector';
import { startLocation } from '../actions/locationActions';
import {
  setupDataFetching,
  stopFetchingTimes,
  hackilySetLoc,
  fetchWalkingDirections,
  fetchStations,
  refreshStations,
} from '../actions/dataActions';

import { loadSavedDestinations, selectDestination } from '../actions/destinationActions';

import tracker from '../native/ga';
import { distanceBetweenCoordinates } from '../utils/distance';

import { colors } from '../styles';

import type { Station, Trip } from '../reducers/appStore';

type State = {
  fakeRefreshing: boolean,
};

type Props = {
  stations: ?(Station[]),
  location: ?Object,
  advisories: ?*,
  locationError: boolean,
  trips: ?(Trip[]),
  startLocation: Function,
  setupDataFetching: Function,
  fetchWalkingDirections: (s: Station) => void,
  refreshingStations: boolean,
  refreshStations: Function,
  fetchStations: Function,
  loadSavedDestinations: Function,
  selectedDestinationCode: ?string,
  selectDestination: Function,
};

class DataContainer extends React.Component<Props, State> {
  state = {
    fakeRefreshing: false,
  };

  componentDidMount() {
    this.props.startLocation();
    this.props.fetchStations();
    this.props.setupDataFetching();
    this.props.loadSavedDestinations();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { location, selectedDestinationCode } = this.props;
    hackilySetLoc(nextProps.location);
    if (!this.props.location && nextProps.location) {
      this.props.fetchStations();
    } else if (
      location &&
      nextProps.location &&
      distanceBetweenCoordinates(
        location.lat,
        location.lng,
        nextProps.location.lat,
        nextProps.location.lng,
      ) > 0.5
    ) {
      this.props.refreshStations();
    }

    if (nextProps.stations) {
      nextProps.stations.forEach((s: Station) => {
        if (s.walkingDirections.state === 'dirty') {
          this.props.fetchWalkingDirections(s);
        }
      });
    }

    if (this.props.stations && nextProps.stations && selectedDestinationCode) {
      const stationsHaveChanged =
        !this.props.stations.every(s => nextProps.stations.some(n => n.abbr === s.abbr)) &&
        this.props.stations.length === nextProps.stations.length;
      if (stationsHaveChanged) {
        const stationCodes = nextProps.stations.map((s: Station) => s.abbr);
        if (!stationCodes.includes(selectedDestinationCode)) {
          tracker.trackEvent('interaction', 'select-destination');
          this.props.selectDestination(selectedDestinationCode, stationCodes);
        }
      }
    }
  }

  refreshStations = () => {
    this.props.refreshStations();
    this.setState({ fakeRefreshing: true });
    setTimeout(() => {
      this.setState({ fakeRefreshing: false });
    }, 800);
    tracker.trackEvent('interaction', 'pull-to-refresh');
  };

  render() {
    const { location, stations, locationError, trips, advisories } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.select({ android: 0, ios: 25 }),
        }}
      >
        <DestinationSelector />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshingStations || this.state.fakeRefreshing}
              onRefresh={this.refreshStations}
              tintColor="#E6E6E6"
            />
          }
        >
          <Advisories advisories={advisories} />
          {stations &&
            stations.filter(s => s.abbr !== this.props.selectedDestinationCode).map(s => {
              const tripForStation = trips && trips.find(l => l.code === s.abbr);
              return (
                <StationView
                  key={s.abbr}
                  station={s}
                  location={location}
                  tripForStation={tripForStation}
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
  trips: state.trips,
  advisories: state.advisories,
  selectedDestinationCode: state.selectedDestinationCode,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators(
    {
      startLocation,
      setupDataFetching,
      stopFetchingTimes,
      fetchWalkingDirections,
      refreshStations,
      fetchStations,
      loadSavedDestinations,
      selectDestination,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
