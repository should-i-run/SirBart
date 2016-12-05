/* @flow */
import {AsyncStorage} from 'react-native';

const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart/directions';

export function destinationAdd(code: string) {
  return {
    type: 'DEST_ADD',
    code,
  };
}

export function destinationRemove(code: string) {
  return {
    type: 'DEST_REMOVE',
    code,
  };
}

function setDestinations(destinations: string[]) {
  return {
    type: 'DEST_LOAD',
    destinations,
  };
}

export function loadSavedDestinations() {
  return (dispatch: Function) => {
    AsyncStorage.getItem('savedDestinations')
      .then(destinations => {
        let dests;
        try {
          dests = JSON.parse(destinations);
        } catch (e) {
          dests = [];
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

function fetchData(trips: Object[], dispatch) {
  fetch(URL, {
    method: 'POST',
    body: JSON.stringify(trips),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then(data => {
    dispatch(loadTrips(data));
  })
  .catch((error) => {
    console.warn(error);
    // TODO set data error state
  });
}

export function selectDestinationAction(code: ?string) {
  return {
    type: 'DEST_SELECT',
    code,
  };
}
//
export function selectDestination(endCode?: string, stationCodes?: string[]) {
  if (endCode && stationCodes) {
    const trips = stationCodes.map(c => ({startCode: c, endCode}));
    return (dispatch: Function) => {
      dispatch(selectDestinationAction(endCode));
      fetchData(trips, dispatch);
    };
  }
  return selectDestinationAction(null);
}
