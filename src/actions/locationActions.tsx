import Geolocation from '@react-native-community/geolocation';
import { hackilySetLoc } from './dataActions';
import { log } from '../utils/sumo';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

export const locationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 1000 * 30,
};

// Northeast corner (Sac): 38.585532,-121.498054
// Southwest corner: 37.040709,-123.002518
function isLocationOutsideRange(loc: LocationType): boolean {
  const { latitude, longitude } = loc.coords;
  const latOutOfRange = latitude < 37.04 || latitude > 38.58;
  const lonOutOfRange = longitude > -121.5 || longitude < -123.0;
  return latOutOfRange || lonOutOfRange;
}

type LocationType = {
  coords: { latitude: number; longitude: number };
};

function receiveLocation(location: LocationType) {
  const locationAction = {
    type: 'RECEIVE_LOCATION' as 'RECEIVE_LOCATION',
    location: {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    },
  };
  hackilySetLoc(locationAction.location);
  return locationAction;
}

export type LocationErrorReason =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'OUTSIDE_RANGE'
  | 'TIMEOUT';
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

let watchID: number | undefined;

export function startLocation() {
  log('startLocation');
  Geolocation.requestAuthorization();
  return (dispatch: Function) => {
    log('startLocation callback');
    const handlePosition = (loc: LocationType) => {
      if (isLocationOutsideRange(loc)) {
        dispatch(locationError('OUTSIDE_RANGE'));
      } else {
        dispatch(receiveLocation(loc));
      }
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
      ] as const;
      const reason = possibleReasons.find(k => {
        return err[k] === err.code;
      });

      dispatch(locationError(reason!));
    };
    Geolocation.getCurrentPosition(handlePosition, handlePositionError);
    watchID = Geolocation.watchPosition(handlePosition, handlePositionError, {
      ...locationOptions,
      distanceFilter: 20,
    });
  };
}

export function stopLocation() {
  log('stopLocation');
  if (watchID) {
    Geolocation.clearWatch(watchID);
  }
}

export type LocationActions =
  | ReturnType<typeof locationError>
  | ReturnType<typeof receiveLocation>;
