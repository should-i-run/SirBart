import tracker from '../native/analytics';
import { Dispatch } from 'redux';
import wrappedFetch, { SKIPPED, STALE } from './wrappedFetch';

import AsyncStorage from '@react-native-community/async-storage';

const URL = 'https://bart.rgoldfinger.com/bart/directions';

export function destinationAdd(label: string, code: string) {
  return {
    type: 'DEST_ADD' as 'DEST_ADD',
    label,
    code,
  };
}

export function destinationRemove(code: string) {
  return {
    type: 'DEST_REMOVE' as 'DEST_REMOVE',
    code,
  };
}

function setDestinations(destinations: SavedDestinations) {
  return {
    type: 'DEST_LOAD' as 'DEST_LOAD',
    destinations,
  };
}

export function loadSavedDestinations() {
  return (dispatch: Function) => {
    AsyncStorage.getItem('savedDestinations').then(destinations => {
      let dests;
      try {
        if (destinations) dests = JSON.parse(destinations);
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

function loadTrips(trips: any[][]) {
  return {
    type: 'TRIPS_LOAD' as 'TRIPS_LOAD',
    trips,
  };
}

export function selectDestinationAction(code?: string) {
  return {
    type: 'DEST_SELECT' as 'DEST_SELECT',
    code,
  };
}

function fetchTripsToDestination(
  trips: Record<string, any>[],
  dispatch: Dispatch<any>,
) {
  wrappedFetch(dispatch, URL, 'select_destination', {
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
      if (error === SKIPPED) return;
      if (error === STALE) return fetchTripsToDestination(trips, dispatch);
      console.warn(error);
      tracker.logEvent('fetchTrips_error');
      dispatch(selectDestinationAction(undefined));
    });
}

export function selectDestination(endCode?: string, stationCodes?: string[]) {
  if (endCode && stationCodes) {
    const trips = stationCodes
      .filter(c => c !== endCode)
      .map(c => ({ startCode: c, endCode }));
    return (dispatch: Dispatch<any>) => {
      dispatch(selectDestinationAction(endCode));
      fetchTripsToDestination(trips, dispatch);
    };
  }
  return selectDestinationAction(undefined);
}

export type DestinationActions =
  | ReturnType<typeof loadTrips>
  | ReturnType<typeof destinationAdd>
  | ReturnType<typeof destinationRemove>
  | ReturnType<typeof setDestinations>
  | ReturnType<typeof selectDestinationAction>;
