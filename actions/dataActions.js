/* @flow */
import {NativeModules} from 'react-native';

import type {Station} from '../reducers/appStore';

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

function startRefreshStations() {
  return {
    type: 'START_REFRESH_STATIONS',
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

export function refreshStations() {
  return (dispatch: Function) => {
    dispatch(startRefreshStations());
    fetchData(dispatch);
  };
}
export function stopFetchingTimes() {
  clearTimeout(timeout);
  return {};
}

export function hackilySetLoc(loc: ?Location) {
  location = loc;
}

function startWalkingDirections(station) {
  return {
    type: 'START_WALKING_DIRECTIONS',
    station,
  };
}
function receiveWalkingDirections(station: Station, result: Object) {
  return {
    type: 'RECEIVE_WALKING_DIRECTIONS',
    station,
    result,
  };
}

export function fetchWalkingDirections(station: Station) {
  return (dispatch: Function) => {
    if (location) {
      dispatch(startWalkingDirections(station));
      const closestEntrance = station.closestEntranceLoc;
      WalkingDirectionsManager.getWalkingDirectionsBetween(
        location.lat,
        location.lng,
        closestEntrance.lat,
        closestEntrance.lng)
        .then((results) => {
          dispatch(receiveWalkingDirections(station, results));
        });
    }
  };
}
