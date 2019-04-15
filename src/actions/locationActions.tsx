export const locationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 1000 * 30,
};

type LocationType = {
  coords: { latitude: number; longitude: number };
};

function receiveLocation(location: LocationType) {
  return {
    type: 'RECEIVE_LOCATION' as 'RECEIVE_LOCATION',
    location: {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    },
  };
}

export type LocationErrorReason = 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT';
interface LocationError {
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
  code: number;
  message: string;
}

function locationError(errorReason: LocationErrorReason) {
  return {
    type: 'LOCATION_ERROR' as 'LOCATION_ERROR',
    errorReason,
  };
}

export function startLocation() {
  navigator.geolocation.requestAuthorization();
  return (dispatch: Function) => {
    const handlePosition = (loc: LocationType) => {
      dispatch(receiveLocation(loc));
    };
    const handlePositionError = (err: LocationError) => {
      // PERMISSION_DENIED: 1
      // POSITION_UNAVAILABLE: 2
      // TIMEOUT: 3
      // code: 1
      // message: "User denied access to location services."
      const possibleReasons = [
        'PERMISSION_DENIED',
        'POSITION_UNAVAILABLE',
        'TIMEOUT',
      ] as LocationErrorReason[];
      const reason = possibleReasons.find(k => {
        return err[k] === err.code;
      });

      dispatch(locationError(reason!));
    };
    navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError);
    navigator.geolocation.watchPosition(handlePosition, handlePositionError, {
      ...locationOptions,
      distanceFilter: 20,
    });
  };
}

export type LocationActions = ReturnType<typeof locationError> | ReturnType<typeof receiveLocation>;
