/* @flow */

import {getClosestEntrance, isSameLocation} from '../utils/distance';

import type {Location} from '../actions/dataActions';

type Estimate = {
  direction: string,
  hexcolor: string,
  length: string,
  minutes: string,
  platform: string,
}

export type Line = {
  abbreviation: string,
  destination: string,
  estimates: Estimate[],
};

type WalkingDirections = {
  state: 'dirty' | 'loading' | 'loaded',
  distance: ?number,
  time: ?number,
};

export type Station = {
  abbr: string,
  name: string,
  departures: Line[],
  entrances: Location[],
  gtfs_latitude: number,
  gtfs_longitude: number,
  closestEntranceLoc: Location,
  WalkingDirections: ?WalkingDirections,
};

type State = {
  stations: ?Station[],
  location: ?{
    lat: number,
    lng: number,
  },
  locationError: bool,
};

const initialState: State = {
  stations: null,
  location: null,
  walkingDirections: null,
  locationError: false,
};

const initialWalkingDirections: WalkingDirections = {
  state: 'dirty',
  distance: undefined,
  time: undefined,
};
const mergeStations = (existing: Station, newStation: Station) => ({
  ...existing,
  departures: newStation.departures,
});

export default function(state: State = initialState, action: Object) {
  switch (action.type) {
    case 'RECEIVE_LOCATION': {
      if (state.location && action.location && isSameLocation(state.location, action.location)) {
        return state;
      }
      return {
        ...state,
        location: action.location,
        locationError: false,
        stations: state.stations && state.stations.map((s) => ({
          ...s,
          closestEntranceLoc: getClosestEntrance(s, action.location),
          walkingDirections: {
            ...s.walkingDirections,
            state: 'dirty',
          },
        })),
      };
    }
    case 'LOCATION_ERROR': {
      return {
        ...state,
        locationError: true,
      };
    }
    case 'RECEIVE_TIMES': {
      const newStations = action.stations
        .map(s => {
          const existing = state.stations && state.stations.find(os => os.abbr === s.abbr);
          if (existing) {
            return mergeStations(existing, s);
          }
          return {
            ...s,
            walkingDirections: initialWalkingDirections,
            closestEntranceLoc: getClosestEntrance(s, state.location),
          };
        });
      return {
        ...state,
        stations: newStations,
        locationError: false,
      };
    }

    case 'START_WALKING_DIRECTIONS': {
      const {abbr} = action.station;
      return {
        ...state,
        stations: state.stations.map((s: Station) => {
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
        }),
      };
    }
    case 'RECEIVE_WALKING_DIRECTIONS': {
      const {result, station} = action;
      const {abbr} = station;
      return {
        ...state,
        stations: state.stations.map((s: Station) => {
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
        }),
      };
    }
    default:
      return state;
  }
}
