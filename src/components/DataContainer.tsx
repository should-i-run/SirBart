import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  AppState,
  ScrollView,
  RefreshControl,
  View,
  Platform,
  AppStateStatus,
  Text,
} from 'react-native';

import Advisories from './Advisories';
import StationView from './Station';
import DestinationSelector from './DestinationSelector';
import LocationError from './LocationError';
import ReviewPrompt from './ReviewPrompt';
import { startLocation, LocationErrorReason } from '../actions/locationActions';
import {
  setupDataFetching,
  stopFetchingTimes,
  fetchWalkingDirections,
  fetchStations,
  fetchStationsWithIndicator,
} from '../actions/dataActions';
import { State as ReducerState } from '../reducers/appStore';

import {
  loadSavedDestinations,
  selectDestination,
} from '../actions/destinationActions';

import tracker from '../native/analytics';
import { distanceBetweenCoordinates } from '../utils/distance';

import { colors, genericText } from '../styles';

import { Station, Advisory } from '../reducers/appStore';

import { Location } from '../actions/dataActions';
import LastUpdatedTime from './LastUpdatedTime';

type State = {
  fakeRefreshing: boolean;
  appState: AppStateStatus;
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
  fetchStationsWithIndicator: () => void;
  fetchStations: () => void;
  loadSavedDestinations: Function;
  selectedDestinationCode?: string;
  selectedDestinationAt?: Date;
  selectDestination: Function;
  savedDestinations: SavedDestinations;
  locationErrorReason: LocationErrorReason | undefined;
};

class DataContainer extends React.Component<Props, State> {
  state: State = {
    fakeRefreshing: false,
    appState: AppState.currentState,
  };

  componentDidMount() {
    this.props.startLocation();
    this.props.fetchStationsWithIndicator();
    this.props.setupDataFetching();
    this.props.loadSavedDestinations();
    AppState.addEventListener('change', this._handleAppStateChange);
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
      selectedDestinationAt,
    } = this.props;
    if (!prevLocation && location) {
      this.props.fetchStationsWithIndicator();
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
      this.props.fetchStations();
    }

    if (stations) {
      stations.forEach((s: Station) => {
        if (s.walkingDirections.state === 'dirty') {
          this.props.fetchWalkingDirections(s);
        }
      });
    }

    // Auto select destination
    if (stations) {
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
      if (!selectedDestinationCode) {
        if (inCommon.length === 0 && currentEligibleDestinations.length === 1) {
          tracker.logEvent('auto_select_destination');
          const stationCodes = stations.map((s: Station) => s.abbr);
          this.props.selectDestination(
            currentEligibleDestinations[0],
            stationCodes,
          );
        }
      } else if (selectedDestinationAt && inCommon.length === 0) {
        const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
        if (selectedDestinationAt.getTime() < thirtyMinAgo) {
          tracker.logEvent('auto_deselect_destination');
          this.props.selectDestination();
        }
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

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      tracker.logEvent('refresh_on_foreground');
      this.props.fetchStations();
    }
    this.setState({ appState: nextAppState });
  };

  refreshStations = () => {
    this.props.fetchStationsWithIndicator();
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
        {locationErrorReason ? (
          <LocationError errorReason={locationErrorReason} />
        ) : (
          <React.Fragment>
            <LastUpdatedTime
              manualRefreshing={
                this.props.refreshingStations || this.state.fakeRefreshing
              }
            />
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
              {__DEV__ && <Text style={genericText}>Debug</Text>}
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
  selectedDestinationAt: state.selectedDestinationAt,
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
      fetchStationsWithIndicator,
      fetchStations,
      loadSavedDestinations,
      selectDestination,
    },
    dispatch,
  );

function propsChecker(WrappedComponent) {
  return class PropsChecker extends React.Component<Props> {
    componentDidUpdate(prevProps: Props) {
      Object.keys(this.props)
        .filter(key => {
          return this.props[key] !== prevProps[key];
        })
        .map(key => {
          console.log(
            'changed property:',
            key,
            'from',
            prevProps[key],
            'to',
            this.props[key],
          );
        });
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
const withPropsChecker = ((): Function => {
  if (__DEV__) {
    return propsChecker;
  }
  return () => {};
})();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withPropsChecker(DataContainer));
