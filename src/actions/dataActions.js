/* @flow */
import { NativeModules } from 'react-native';
import { throttle } from 'lodash';

import type { Station } from '../reducers/appStore';
import tracker from '../native/ga';

const { WalkingDirectionsManager } = NativeModules;

const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart';
let interval;

export type Location = { lat: number, lng: number };
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

function receiveAdvs(advs) {
  return {
    type: 'RECEIVE_ADVS',
    advs,
  };
}

const fetchAdvs = throttle(dispatch => {
  fetch('https://api.bart.gov/api/bsa.aspx?cmd=bsa&key=ZELI-U2UY-IBKQ-DT35&json=y', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      dispatch(receiveAdvs(data.root.bsa));
    })
    .catch(error => {
      console.warn(error);
      tracker.trackEvent('api', 'fetchAdvs error');
    });
}, 1000 * 60);

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
    .then(response => response.json())
    .then(data => {
      dispatch(receiveStations(data));
    })
    .catch(error => {
      console.warn(error);
      tracker.trackEvent('api', 'fetchData stations error');
    });
  fetchAdvs(dispatch);
}

export function setupDataFetching() {
  return (dispatch: Function) => {
    if (interval) {
      clearInterval(interval);
    } else {
      // fetch right away if we haven't been fetching
      fetchData(dispatch);
    }
    interval = setInterval(() => {
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
export function fetchStations() {
  return (dispatch: Function) => {
    fetchData(dispatch);
  };
}

export function stopFetchingTimes() {
  clearInterval(interval);
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
      // if (WalkingDirectionsManager) {
      //   WalkingDirectionsManager.getWalkingDirectionsBetween(
      //     location.lat,
      //     location.lng,
      //     closestEntrance.lat,
      //     closestEntrance.lng,
      //   ).then(result => {
      //     dispatch(receiveWalkingDirections(station, result));
      //   });
      // } else {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.lat},${location.lng}&destination=${closestEntrance.lat},${closestEntrance.lng}&units=metric&mode=walking&key=AIzaSyDtzqYGAIdJSmbN63uzvkGsin1kwS5HXvQ`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          const leg = result.routes[0].legs[0];
          const directions = {
            distance: leg.distance.value,
            time: parseInt(leg.duration.value / 60, 10),
          };
          dispatch(receiveWalkingDirections(station, directions));
        })
        .catch(error => {
          console.warn(error);
          tracker.trackEvent('google-directions-api', 'fetch walking directions error');
        });
      // }
    }
  };
}
