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
  stationAbbr: string,
  entranceLocation: Location,
  key: string,
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

const addClosestEntrance = (station: Station, location: ?Location): Station => ({
  ...station,
  closestEntranceLoc: location && getClosestEntrance(station, location),
});

const createWalkingDirections = (station: Station, location: ?Location): WalkingDirections => {
  const existingWalking = station.walkingDirections || {};
  return ({
    state: 'dirty',
    stationAbbr: station.abbr,
    entranceLocation: station.closestEntranceLoc,
    distance: undefined,
    time: undefined,
  });
};

export default function(state: State = initialState, action: Object) {
  switch (action.type) {
    case 'RECEIVE_LOCATION': {
      if (state.location && action.location && isSameLocation(state.location, action.location)) {
        return state;
      }

      if (!state.stations) {
        return {
          ...state,
          location: action.location,
          locationError: false,
        };
      }

      const stations = state.stations
        .map(s => addClosestEntrance(s, action.location));
      return {
        ...state,
        stations,
        walkingDirections: stations.map(s => createWalkingDirections(s, action.location)),
        location: action.location,
        locationError: false,
      };
    }
    case 'LOCATION_ERROR': {
      return {
        ...state,
        locationError: true,
      };
    }
    case 'RECEIVE_TIMES': {
      return {
        ...state,
        stations: addClosestEntrances(action.stations, state.location),
        locationError: false,
      };
    }
    default:
      return state;
  }
}
