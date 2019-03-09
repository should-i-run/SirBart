/* @flow */
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';

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
import { State as ReducerState } from '../reducers/appStore';

import { loadSavedDestinations, selectDestination } from '../actions/destinationActions';

import tracker from '../native/ga';
import { distanceBetweenCoordinates } from '../utils/distance';

import { colors } from '../styles';

import { Station, Advisory } from '../reducers/appStore';

import { Location } from '../actions/dataActions';

type State = {
  fakeRefreshing: boolean,
};

type Props = {
  stations?: Station[],
  location?: Location,
  advisories?: Advisory[],
  trips?: Trip[],
  startLocation: Function,
  setupDataFetching: Function,
  fetchWalkingDirections: (s: Station) => void,
  refreshingStations: boolean,
  refreshStations: Function,
  fetchStations: Function,
  loadSavedDestinations: Function,
  selectedDestinationCode?: string,
  selectDestination: Function,
  savedDestinations: SavedDestinations,
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

  componentDidUpdate(prevProps: Props) {
    const {
      location: prevLocation,
      stations: prevStations,
      savedDestinations: prevSavedDestinations,
    } = prevProps;
    const { stations, savedDestinations, selectedDestinationCode, location } = this.props;
    hackilySetLoc(location);
    if (!prevLocation && location) {
      this.props.fetchStations();
    } else if (
      prevLocation &&
      location &&
      distanceBetweenCoordinates(prevLocation.lat, prevLocation.lng, location.lat, location.lng) >
        0.5
    ) {
      this.props.refreshStations();
      this.props.selectDestination();
    }

    if (stations) {
      stations.forEach((s: Station) => {
        if (s.walkingDirections.state === 'dirty') {
          this.props.fetchWalkingDirections(s);
        }
      });
    }

    // Auto select destination
    if (stations && !selectedDestinationCode) {
      if (!stations) {
        return;
      }
      const previousEligibleDestinations = prevStations
        ? Object.values(prevSavedDestinations).filter(d => !prevStations.some(s => s.abbr === d))
        : [];
      const currentEligibleDestinations = Object.values(savedDestinations).filter(
        d => !stations.some(s => s.abbr === d),
      );
      const inCommon = previousEligibleDestinations.filter(d =>
        currentEligibleDestinations.includes(d),
      );
      if (inCommon.length === 0 && currentEligibleDestinations.length === 1) {
        tracker.trackEvent('auto', 'auto-select-destination');
        const stationCodes = stations.map((s: Station) => s.abbr);
        this.props.selectDestination(currentEligibleDestinations[0], stationCodes);
      }
    }

    // when a destination is selected, and the stations change, get directions for the new station
    if (prevStations && stations && selectedDestinationCode) {
      const stationsHaveChanged =
        !prevStations.every(s => stations.some(n => n.abbr === s.abbr)) &&
        prevStations.length === stations.length;
      if (stationsHaveChanged) {
        const stationCodes = stations.map((s: Station) => s.abbr);
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
    const { location, stations, trips, advisories } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.select({ android: 0, ios: 25 }),
        }}
      >
        <DestinationSelector />
        <Advisories advisories={advisories} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshingStations || this.state.fakeRefreshing}
              onRefresh={this.refreshStations}
              tintColor="#E6E6E6"
            />
          }
        >
          {stations &&
            stations.filter(s => s.abbr !== this.props.selectedDestinationCode).map(s => {
              const selectedTrip = trips && trips.find(l => l.code === s.abbr);
              return <StationView key={s.abbr} station={s} selectedTrip={selectedTrip} />;
            })}
        </ScrollView>
        <Selector />
      </View>
    );
  }
}

const mapStateToProps = (state: ReducerState) => ({
  location: state.location,
  stations: state.stations,
  refreshingStations: state.refreshingStations,
  trips: state.trips,
  advisories: state.advisories,
  selectedDestinationCode: state.selectedDestinationCode,
  savedDestinations: state.savedDestinations,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
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