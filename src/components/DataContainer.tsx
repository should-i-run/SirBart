import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';

import { ScrollView, RefreshControl, View, Platform } from 'react-native';

import Advisories from './Advisories';
import StationView from './Station';
import DestinationSelector from './DestinationSelector';
import LocationError from './LocationError';
import ReviewPrompt from './ReviewPrompt';
import { startLocation, LocationErrorReason } from '../actions/locationActions';
import {
  setupDataFetching,
  stopFetchingTimes,
  hackilySetLoc,
  fetchWalkingDirections,
  fetchStations,
  refreshStations,
} from '../actions/dataActions';
import { State as ReducerState } from '../reducers/appStore';

import {
  loadSavedDestinations,
  selectDestination,
} from '../actions/destinationActions';

import tracker from '../native/analytics';
import { distanceBetweenCoordinates } from '../utils/distance';

import { colors } from '../styles';

import { Station, Advisory } from '../reducers/appStore';

import { Location } from '../actions/dataActions';
import NetworkStatus from './NetworkStatus';

type State = {
  fakeRefreshing: boolean;
};

type Props = {
  stations?: Station[];
  location?: Location;
  advisories?: Advisory[];
  trips?: Trip[];
  startLocation: Function;
  setupDataFetching: Function;
  fetchWalkingDirections: (s: Station) => void;
  refreshingStations: boolean;
  refreshStations: Function;
  fetchStations: Function;
  loadSavedDestinations: Function;
  selectedDestinationCode?: string;
  selectDestination: Function;
  savedDestinations: SavedDestinations;
  locationErrorReason: LocationErrorReason | undefined;
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
    const {
      stations,
      savedDestinations,
      selectedDestinationCode,
      location,
    } = this.props;
    hackilySetLoc(location);
    if (!prevLocation && location) {
      this.props.fetchStations();
    } else if (
      prevLocation &&
      location &&
      distanceBetweenCoordinates(
        prevLocation.lat,
        prevLocation.lng,
        location.lat,
        location.lng,
      ) > 0.5
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
        ? Object.values(prevSavedDestinations).filter(
            d => !prevStations.some(s => s.abbr === d),
          )
        : [];
      const currentEligibleDestinations = Object.values(
        savedDestinations,
      ).filter(d => !stations.some(s => s.abbr === d));
      const inCommon = previousEligibleDestinations.filter(d =>
        currentEligibleDestinations.includes(d),
      );
      if (inCommon.length === 0 && currentEligibleDestinations.length === 1) {
        tracker.logEvent('auto_select_destination');
        const stationCodes = stations.map((s: Station) => s.abbr);
        this.props.selectDestination(
          currentEligibleDestinations[0],
          stationCodes,
        );
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
          tracker.logEvent('select_destination');
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
    tracker.logEvent('pull_to_refresh');
  };

  render() {
    const { locationErrorReason, stations, trips, advisories } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.select({ android: 0, ios: 40 }),
        }}
      >
        <NetworkStatus />
        {locationErrorReason ? (
          <LocationError errorReason={locationErrorReason} />
        ) : (
          <React.Fragment>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={
                    this.props.refreshingStations || this.state.fakeRefreshing
                  }
                  onRefresh={this.refreshStations}
                  tintColor="#E6E6E6"
                  style={{ paddingTop: 10 }}
                />
              }
            >
              <Advisories advisories={advisories} />
              {stations &&
                stations
                  .filter(s => s.abbr !== this.props.selectedDestinationCode)
                  .sort((a, b) => {
                    if (
                      a.walkingDirections.distance &&
                      b.walkingDirections.distance
                    ) {
                      return (
                        a.walkingDirections!.distance! -
                        b.walkingDirections!.distance!
                      );
                    }
                    return 0;
                  })
                  .map(s => {
                    const selectedTrip =
                      trips && trips.find(l => l.code === s.abbr);
                    return (
                      <StationView
                        key={s.abbr}
                        station={s}
                        selectedTrip={selectedTrip}
                      />
                    );
                  })}
            </ScrollView>
            <DestinationSelector />
          </React.Fragment>
        )}
        <ReviewPrompt />
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
  locationErrorReason: state.locationErrorReason,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataContainer);
