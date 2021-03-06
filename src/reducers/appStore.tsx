import { uniqBy } from 'lodash';
import { getClosestEntrance, isSameLocation } from '../utils/distance';
import { getAbbrForName } from '../utils/stations';
import { Location, DataActions } from '../actions/dataActions';
import { DestinationActions } from '../actions/destinationActions';
import {
  LocationActions,
  LocationErrorReason,
} from '../actions/locationActions';
import { WrappedFetchActions } from '../actions/wrappedFetch';
import { log } from '../utils/sumo';

import AsyncStorage from '@react-native-community/async-storage';

export enum NetworkStatus {
  Fetching,
  Error,
  Success,
}

export type SelectedDestination = {
  code: string;
  label?: 'home' | 'work';
};

export type Advisory = {
  '@id': string;
  station: string;
  type: string;
  description: {
    '#cdata-section': string;
  };
  expires: string;
};

export type Estimate = {
  direction: string;
  hexcolor: string;
  length: string;
  minutes: number;
  platform: string;
};

export type Line = {
  abbreviation: string;
  destination: string;
  estimates: Estimate[];
};

type WalkingDirections = {
  state: 'dirty' | 'loading' | 'loaded';
  distance?: number;
  time?: number;
};

export type Departure = {
  estimate: Estimate;
  line: Line;
};

export type Station = {
  abbr: string;
  name: string;
  lines: Line[];
  entrances?: Location[];
  gtfs_latitude: number;
  gtfs_longitude: number;
  closestEntranceLoc: Location;
  walkingDirections: WalkingDirections;
  departures: Departure[];
};

export type State = {
  stations?: Station[];
  location?: {
    lat: number;
    lng: number;
  };
  locationError: boolean;
  locationErrorReason: LocationErrorReason | undefined;
  refreshingStations: boolean;
  selectorShown: boolean;
  selectionKey?: string;
  selectedDestination?: SelectedDestination;
  selectedDestinationAt?: Date;
  savedDestinations: SavedDestinations;
  trips?: Trip[];
  advisories?: Advisory[];
  network: Record<string, NetworkStatus>;
  timesLastUpdatedAt?: Date;
};

const initialState: State = {
  stations: undefined,
  location: undefined,
  locationError: false,
  locationErrorReason: undefined,
  refreshingStations: false,
  selectorShown: false,
  selectionKey: undefined,
  selectedDestination: undefined,
  selectedDestinationAt: undefined,
  savedDestinations: {},
  trips: undefined,
  advisories: undefined,
  // advisories: [{
  //   ['@id']: '1',
  //   description: {
  //     '#cdata-section': "there is a delay at blah blah blah due to police activity,  blah due to police activity,  blah due to police activity,  blah due to police activity,  blah due to police activity,  blah due to police activity."
  //   },
  //   station: 'foo',
  //   type: 'bar',
  //   expires: '1235'
  // }],
  network: {},
  timesLastUpdatedAt: undefined,
};

const initialWalkingDirections: WalkingDirections = {
  state: 'dirty',
  distance: undefined,
  time: undefined,
};
const mergeStations = (existing: Station, newStation: Station) => ({
  ...existing,
  lines: newStation.lines,
});

export default function(
  state: State = initialState,
  action:
    | DataActions
    | DestinationActions
    | LocationActions
    | WrappedFetchActions,
) {
  log(action.type);
  switch (action.type) {
    case 'RECEIVE_LOCATION': {
      if (
        state.location &&
        action.location &&
        isSameLocation(state.location, action.location)
      ) {
        return state;
      }
      return {
        ...state,
        location: action.location,
        locationError: false,
        locationErrorReason: undefined,
        stations:
          state.stations &&
          state.stations.map(
            (s): Station => ({
              ...s,
              closestEntranceLoc: getClosestEntrance(s, action.location),
              walkingDirections: {
                ...s.walkingDirections,
                state: 'dirty',
              },
            }),
          ),
      };
    }
    case 'LOCATION_ERROR': {
      return {
        ...state,
        locationError: true,
        locationErrorReason: action.errorReason,
      };
    }
    case 'RECEIVE_TIMES': {
      const newStations = action.stations
        .map(s => {
          const existing =
            state.stations && state.stations.find(os => os.abbr === s.abbr);
          if (existing) {
            return mergeStations(existing, s);
          }
          return {
            ...s,
            walkingDirections: initialWalkingDirections,
            closestEntranceLoc: getClosestEntrance(s, state.location),
          };
        })
        .map(
          (s): Station => ({
            ...s,
            lines: s.lines.map(l => ({
              ...l,
              estimates: l.estimates.map(e => ({
                ...e,
                minutes:
                  String(e.minutes) === 'Leaving'
                    ? 0
                    : parseInt(String(e.minutes), 10),
              })),
            })),
          }),
        )
        .map(s => ({
          ...s,
          departures: s.lines
            .reduce((acc, l) => {
              const estimates = l.estimates.map(e => ({
                estimate: e,
                line: l,
              }));
              return acc.concat(estimates);
            }, [] as Departure[])
            .sort((a: Departure, b: Departure) => {
              if (a.estimate.minutes <= b.estimate.minutes) {
                return -1;
              }
              return 1;
            }),
        }));

      const selectedDestination =
        newStations.some(s => s.abbr === state.selectedDestination?.code) &&
        newStations.length === 1
          ? undefined
          : state.selectedDestination;
      return {
        ...state,
        stations: newStations,
        locationError: false,
        refreshingStations: false,
        selectorShown: false,
        selectionKey: undefined,
        selectedDestination,
        timesLastUpdatedAt: new Date(),
      };
    }

    case 'START_WALKING_DIRECTIONS': {
      const { abbr } = action.station;
      return {
        ...state,
        stations:
          state.stations &&
          state.stations.map(
            (s: Station): Station => {
              if (s.abbr === abbr) {
                return {
                  ...s,
                  walkingDirections: {
                    ...s.walkingDirections,
                    state: 'loading',
                  },
                };
              }
              return s;
            },
          ),
      };
    }
    case 'RECEIVE_WALKING_DIRECTIONS': {
      const { result, station } = action;
      const { abbr } = station;
      return {
        ...state,
        stations:
          state.stations &&
          state.stations.map(
            (s: Station): Station => {
              if (s.abbr === abbr) {
                return {
                  ...s,
                  walkingDirections: {
                    state: 'loaded',
                    distance: result.distance,
                    time: result.time,
                  },
                };
              }
              return s;
            },
          ),
      };
    }
    case 'START_REFRESH_STATIONS': {
      return {
        ...state,
        refreshingStations: true,
      };
    }
    case 'STOP_REFRESH_STATIONS': {
      return {
        ...state,
        refreshingStations: false,
      };
    }
    case 'DEST_SELECT': {
      return {
        ...state,
        selectedDestination: !action.code
          ? undefined
          : { code: action.code, label: action.label },
        trips: undefined,
        selectedDestinationAt: action.code ? new Date() : undefined,
      };
    }
    case 'DEST_ADD': {
      const newSavedDestinations = {
        ...state.savedDestinations,
        [action.label]: action.code,
      };
      AsyncStorage.setItem(
        'savedDestinations',
        JSON.stringify(newSavedDestinations),
      );
      return {
        ...state,
        savedDestinations: newSavedDestinations,
      };
    }
    case 'DEST_REMOVE': {
      AsyncStorage.setItem('savedDestinations', JSON.stringify({}));
      return {
        ...state,
        savedDestinations: {},
      };
    }
    case 'DEST_LOAD': {
      return {
        ...state,
        savedDestinations: action.destinations || {},
      };
    }

    case 'TRIPS_LOAD': {
      const trips = action.trips.map(tripsForStation => {
        let code: string;
        const lines = tripsForStation.map(t => {
          const legs = Array.isArray(t.leg) ? t.leg : [t.leg];
          code = legs[0].origin;
          const transferStation = legs.length > 1 ? legs[0].destination : null;
          return {
            abbreviation: getAbbrForName(legs[0].trainHeadStation)!,
            timeEstimate: t.tripTime,
            transferStation,
          };
        });
        return {
          code: code!,
          lines: uniqBy(lines, 'abbreviation'),
        };
      });
      return {
        ...state,
        trips,
      };
    }
    case 'RECEIVE_ADVS': {
      return {
        ...state,
        advisories: action.advs,
      };
    }
    case 'NETWORK_CHANGE': {
      return {
        ...state,
        network: {
          ...state.network,
          [action.url]: action.status,
        },
      };
    }
    case 'RESET': {
      return {
        ...initialState,
        savedDestinations: state.savedDestinations,
      };
    }
    default:
      return state;
  }
}
