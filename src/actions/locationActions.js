/* @flow */

export const locationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 1000 * 30,
};

function receiveLocation(location) {
  return {
    type: 'RECEIVE_LOCATION',
    location: {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    },
  };
}

export function locationError() {
  return {
    type: 'LOCATION_ERROR',
  };
}

export function startLocation() {
  return (dispatch: Function) => {
    navigator.geolocation.watchPosition((loc) => {
      dispatch(receiveLocation(loc));
    },
    () => dispatch(locationError()),
      {
        ...locationOptions,
        distanceFilter: 20,
      });
  };
}
