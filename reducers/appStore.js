/* @flow */

import {getClosestEntrance} from '../utils/distance';

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

export type Station = {
  abbr: string,
  name: string,
  departures: Line[],
  entrances: Location[],
  gtfs_latitude: number,
  gtfs_longitude: number,
  closestEntranceLoc: ?Location,
};

type State = {
  stations: ?Station[],
  location: ?{
    lat: number,
    lng: number,
  },
  locationError: bool,
  walkingDirections: ?Object,
};

const initialState: State = {
  stations: null,
  location: null,
  walkingDirections: null,
  locationError: false,
};

const addClosestEntrances = (stations: ?Station[], location: ?Location): ?Station[] => {
  if (!location || !stations) {
    return stations;
  }
  return stations.map(s => ({...s, closestEntranceLoc: getClosestEntrance(s, location)}));
};

export default function(state: State = initialState, action: Object) {
  switch (action.type) {
    case 'RECEIVE_LOCATION': {
      return {
        ...state,
        stations: addClosestEntrances(state.stations, action.location),
        location: action.location,
        locationError: false,
      };
    }
    case 'LOCATION_ERROR': {
      return {
        ...state,
        // location: null,
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
