/* @flow */

import type {Location} from '../actions/dataActions';
import type {Station} from '../reducers/appStore';

export function getClosestEntrance(station: Station, start: Location) {
  const getDistance = (entrance) => {
    const latDistance = Math.pow((start.lat - entrance.lat), 2);
    const lngDistance = Math.pow((start.lng - entrance.lng), 2);
    return Math.sqrt(lngDistance + latDistance);
  };
  if (station.entrances.length) {
    const sortedEntrances = station.entrances.sort((a, b) => getDistance(a) - getDistance(b));
    return sortedEntrances[0];
  }
  return {lat: station.gtfs_latitude, lng: station.gtfs_longitude};
}
