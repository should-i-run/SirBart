/* @flow */

export const locationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 1000 * 30,
};

function receiveLocation(location: {coords: {latitude: number, longitude: number}}) {
  return {
    type: 'RECEIVE_LOCATION' as 'RECEIVE_LOCATION',
    location: {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    },
  };
}

function locationError() {
  return {
    type: 'LOCATION_ERROR' as 'LOCATION_ERROR',
  };
}

export function startLocation() {
  return (dispatch: Function) => {
    navigator.geolocation.watchPosition(
      loc => {
        dispatch(receiveLocation(loc));
      },
      () => dispatch(locationError()),
      {
        ...locationOptions,
        distanceFilter: 20,
      },
    );
  };
}

export type LocationActions =
  | ReturnType<typeof locationError>
  | ReturnType<typeof receiveLocation>;