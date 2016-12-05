/* @flow */
import {AsyncStorage} from 'react-native';

// const URL = 'https://tranquil-harbor-8717.herokuapp.com/bart';

export function destinationSelect(code?: string) {
  return {
    type: 'DEST_SELECT',
    code,
  };
}

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
      .then(destinations => dispatch(setDestinations(JSON.parse(destinations))));
  };
}

//
// function fetchData(dispatch) {
//   if (!location) {
//     return;
//   }
//   fetch(URL, {
//     method: 'POST',
//     body: JSON.stringify({
//       lat: location.lat,
//       lng: location.lng,
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//   .then((response) => response.json())
//   .then(data => {
//     dispatch(receiveStations(data));
//   })
//   .catch((error) => {
//     console.warn(error);
//     // TODO set data error state
//   });
// }
//
// export function refreshStations() {
//   return (dispatch: Function) => {
//     dispatch(startRefreshStations());
//     fetchData(dispatch);
//   };
// }
// export function fetchStations() {
//   return (dispatch: Function) => {
//     fetchData(dispatch);
//   };
// }
