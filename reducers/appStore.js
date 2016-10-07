/* @flow */

type State = {
  stations: ?Object[],
  location: ?{
    lat: number,
    lng: number,
  },
  locationError: bool,
  walkingDirections: ?Object,
}

const initialState: State = {
  stations: null,
  location: null,
  walkingDirections: null,
  locationError: false,
};

export default function(state: State = initialState, action: Object) {
  switch (action.type) {
    case 'RECEIVE_LOCATION': {
      return {
        ...state,
        location: action.location,
        locationError: false,
      };
    }
    case 'LOCATION_ERROR': {
      return {
        ...state,
        // location: null,
        locationError: true,
      };
    }
    case 'RECEIVE_TIMES': {
      return {
        ...state,
        stations: action.stations,
        locationError: false,
      };
    }
    default:
      return state;
  }
}
