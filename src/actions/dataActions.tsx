import { Station, Advisory } from '../reducers/appStore';
import tracker from '../native/analytics';
import { Dispatch } from 'redux';
import wrappedFetch, { SKIPPED, STALE } from './wrappedFetch';
import { throttle } from 'lodash';

export const URL = 'https://bart.rgoldfinger.com/bart';
let interval: NodeJS.Timer | undefined;

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
function stopRefreshStations() {
  return {
    type: 'STOP_REFRESH_STATIONS' as 'STOP_REFRESH_STATIONS',
  };
}

function receiveAdvs(advs: Advisory[]) {
  return {
    type: 'RECEIVE_ADVS' as 'RECEIVE_ADVS',
    advs,
  };
}

const advUrl =
  'https://api.bart.gov/api/bsa.aspx?cmd=bsa&key=ZELI-U2UY-IBKQ-DT35&json=y';

const fetchAdvs = throttle((dispatch: Dispatch<any>) => {
  wrappedFetch(dispatch, advUrl, 'advs', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(
      data => {
        dispatch(receiveAdvs(data.root.bsa));
      },
      error => {
        if (error === SKIPPED) return;
        if (error === STALE) return fetchAdvs(dispatch);
        console.warn(error);
        tracker.logEvent('fetchAdvs_error');
      },
    )
    .catch(error => {
      console.warn(error);
      tracker.logEvent('fetchAdvs_dispatch_error');
    });
}, 1000 * 60);

const fetchData = async (dispatch: Dispatch<any>) => {
  fetchAdvs(dispatch);
  if (!location) {
    return;
  }
  try {
    const res = await wrappedFetch(dispatch, URL, 'stations', {
      method: 'POST',
      body: JSON.stringify({
        lat: location.lat,
        lng: location.lng,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    dispatch(receiveStations(data));
    setupDataFetching()(dispatch);
  } catch (e) {
    if (e === SKIPPED) return;
    if (e === STALE) return;
    console.log(e);
    dispatch(stopRefreshStations());
    tracker.logEvent('fetchData_dispatch_error');
  }
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
    }, 1000 * 15);
  };
}

export function fetchStations() {
  return (dispatch: Dispatch<any>) => {
    fetchData(dispatch);
  };
}
export function fetchStationsWithIndicator() {
  return (dispatch: Dispatch<any>) => {
    dispatch(startRefreshStations());
    fetchData(dispatch);
  };
}

export function stopFetchingTimes() {
  clearInterval(interval!);
  interval = undefined;
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
function receiveWalkingDirections(
  station: Station,
  result: { time: number; distance: number },
) {
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
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.lat},${location.lng}&destination=${closestEntrance.lat},${closestEntrance.lng}&units=metric&mode=walking&key=AIzaSyDtzqYGAIdJSmbN63uzvkGsin1kwS5HXvQ`;
      wrappedFetch(dispatch, url, `walking_directions_${station.abbr}`)
        .then(response => response.json())
        .then(result => {
          if (result.error_message) throw new Error(result.error_message);
          const leg = result.routes[0].legs[0];
          const directions = {
            distance: leg.distance.value,
            time: parseInt(String(leg.duration.value / 60), 10),
          };
          dispatch(receiveWalkingDirections(station, directions));
        })
        .catch(error => {
          if (error === SKIPPED) return;
          if (error === STALE) return;
          console.warn(error);
          tracker.logEvent('fetch_walking_directions_error', { error });
        });
    }
  };
}

function reset() {
  return {
    type: 'RESET' as const,
  };
}

export function resetStore() {
  return (dispatch: Function) => {
    dispatch(reset());
  };
}

export type DataActions =
  | ReturnType<typeof reset>
  | ReturnType<typeof startRefreshStations>
  | ReturnType<typeof stopRefreshStations>
  | ReturnType<typeof receiveAdvs>
  | ReturnType<typeof startWalkingDirections>
  | ReturnType<typeof receiveWalkingDirections>
  | ReturnType<typeof receiveStations>;
