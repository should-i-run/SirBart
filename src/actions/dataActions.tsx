/* @flow */
// import { NativeModules } from 'react-native';
import { throttle } from 'lodash';

import { Station, Advisory } from '../reducers/appStore';
import tracker from '../native/ga';
import { Dispatch } from 'redux';

// const { WalkingDirectionsManager } = NativeModules;

const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart';
let interval: NodeJS.Timer;

export type Location = { lat: number; lng: number };
let location: Location | undefined;

const receiveStations = (stations: Station[]) => {
  return {
    type: 'RECEIVE_TIMES' as 'RECEIVE_TIMES',
    stations,
  };
};

function startRefreshStations() {
  return {
    type: 'START_REFRESH_STATIONS' as 'START_REFRESH_STATIONS',
  };
}

function receiveAdvs(advs: Advisory[]) {
  return {
    type: 'RECEIVE_ADVS' as 'RECEIVE_ADVS',
    advs,
  };
}

const fetchAdvs = throttle(dispatch => {
  fetch('https://api.bart.gov/api/bsa.aspx?cmd=bsa&key=ZELI-U2UY-IBKQ-DT35&json=y', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(
      data => {
        dispatch(receiveAdvs(data.root.bsa));
      },
      error => {
        console.warn(error);
        tracker.logEvent('fetchAdvs_error');
      },
    )
    .catch(error => {
      console.warn(error);
      tracker.logEvent('fetchAdvs_dispatch_error');
    });
}, 1000 * 60);

const fetchData = (dispatch: Dispatch<any>) => {
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
    .then(
      data => {
        dispatch(receiveStations(data));
      },
      error => {
        console.warn(error);
        tracker.logEvent('fetchData_stations_error');
        fetchData(dispatch);
      },
    )
    .catch(error => {
      console.warn(error);
      tracker.logEvent('fetchData_dispatch_error');
      fetchData(dispatch);
    });
  fetchAdvs(dispatch);
};

export function setupDataFetching() {
  return (dispatch: Dispatch<any>) => {
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
  return (dispatch: Dispatch<any>) => {
    dispatch(startRefreshStations());
    fetchData(dispatch);
  };
}
export function fetchStations() {
  return (dispatch: Dispatch<any>) => {
    dispatch(startRefreshStations());
    fetchData(dispatch);
  };
}

export function stopFetchingTimes() {
  clearInterval(interval);
  return {};
}

export function hackilySetLoc(loc?: Location) {
  location = loc;
}

function startWalkingDirections(station: Station) {
  return {
    type: 'START_WALKING_DIRECTIONS' as 'START_WALKING_DIRECTIONS',
    station,
  };
}
function receiveWalkingDirections(station: Station, result: { time: number; distance: number }) {
  return {
    type: 'RECEIVE_WALKING_DIRECTIONS' as 'RECEIVE_WALKING_DIRECTIONS',
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
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.lat},${
        location.lng
      }&destination=${closestEntrance.lat},${
        closestEntrance.lng
      }&units=metric&mode=walking&key=AIzaSyDtzqYGAIdJSmbN63uzvkGsin1kwS5HXvQ`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          const leg = result.routes[0].legs[0];
          const directions = {
            distance: leg.distance.value,
            time: parseInt(String(leg.duration.value / 60), 10),
          };
          dispatch(receiveWalkingDirections(station, directions));
        })
        .catch(error => {
          console.warn(error);
          tracker.logEvent('fetch_walking_directions_error');
        });
      // }
    }
  };
}

export type DataActions =
  | ReturnType<typeof startRefreshStations>
  | ReturnType<typeof receiveAdvs>
  | ReturnType<typeof startWalkingDirections>
  | ReturnType<typeof receiveWalkingDirections>
  | ReturnType<typeof receiveStations>;
