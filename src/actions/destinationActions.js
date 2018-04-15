/* @flow */
import { AsyncStorage } from 'react-native';

import tracker from '../native/ga';

const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart/directions';

export function destinationAdd(label: string, code: string) {
  return {
    type: 'DEST_ADD',
    label,
    code,
  };
}

export function destinationRemove(code: string) {
  return {
    type: 'DEST_REMOVE',
    code,
  };
}

function setDestinations(destinations: SavedDestinations) {
  return {
    type: 'DEST_LOAD',
    destinations,
  };
}

export function loadSavedDestinations() {
  return (dispatch: Function) => {
    AsyncStorage.getItem('savedDestinations').then(destinations => {
      let dests;
      try {
        dests = JSON.parse(destinations);
      } catch (e) {
        dests = {};
      }
      if (Array.isArray(dests)) {
        dests = {};
      }
      dispatch(setDestinations(dests));
    });
  };
}

function loadTrips(trips: Object[]) {
  return {
    type: 'TRIPS_LOAD',
    trips,
  };
}

export function selectDestinationAction(code: ?string) {
  return {
    type: 'DEST_SELECT',
    code,
  };
}

function fetchData(trips: Object[], dispatch) {
  fetch(URL, {
    method: 'POST',
    body: JSON.stringify(trips),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      dispatch(loadTrips(data));
    })
    .catch(error => {
      console.warn(error);
      tracker.trackEvent('api', 'fetchTrips error');
      dispatch(selectDestinationAction(null));
    });
}

export function selectDestination(endCode?: string, stationCodes?: string[]) {
  if (endCode && stationCodes) {
    const trips = stationCodes.map(c => ({ startCode: c, endCode }));
    if (!stationCodes.includes(endCode)) {
      return (dispatch: Function) => {
        dispatch(selectDestinationAction(endCode));
        fetchData(trips, dispatch);
      };
    }
  }
  return selectDestinationAction(null);
}
