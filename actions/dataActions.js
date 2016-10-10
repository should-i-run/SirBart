/* @flow */
import {NativeModules} from 'react-native';

const {WalkingDirectionsManager} = NativeModules;

const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart';
let timeout;

export type Location = {lat: number, lng: number};
let location: ?Location;

function receiveStations(stations) {
  return {
    type: 'RECEIVE_TIMES',
    stations,
  };
}

function fetchData(dispatch) {
  if (!location) {
    return;
  }
  fetch(URL, {
    method: 'POST',
    body: JSON.stringify({
      lat: location.lat,
      lng: location.lng,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then(data => {
    dispatch(receiveStations(data));
  })
  .catch((error) => {
    console.warn(error);
    // TODO set data error state
  });
}

export function startFetchingTimes() {
  return (dispatch: Function) => {
    fetchData(dispatch);
    timeout = setTimeout(() => {
      fetchData(dispatch);
    }, 1000 * 20);
  };
}

export function stopFetchingTimes() {
  clearTimeout(timeout);
  return {};
}

export function hackilySetLoc(loc: ?Location) {
  location = loc;
}

export function fetchWalkingDirections(endLoc: Location) {
  return (dispatch: Function) => {
    if (!location) {
      return {};
    }
    WalkingDirectionsManager.getWalkingDirectionsBetween(
      location.lat,
      location.lng,
      endLoc.lat,
      endLoc.lng)
    .then();
  };
}
