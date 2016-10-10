/* @flow */

import type {Location} from '../actions/dataActions';
import type {Station} from '../reducers/appStore';

export function isSameLocation(old: Location, newLoc: Location) {
  return (
    old.lat === newLoc.lat &&
    old.lng === newLoc.lng
  );
}

export function getClosestEntrance(station: Station, start: ?Location) {
  if (start && station.entrances.length) {
    const getDistance = (entrance: Location, startLoc: Location) => {
      const latDistance = Math.pow((startLoc.lat - entrance.lat), 2);
      const lngDistance = Math.pow((startLoc.lng - entrance.lng), 2);
      return Math.sqrt(lngDistance + latDistance);
    };
    const sortedEntrances = station.entrances.sort((a, b) => getDistance(a, start) - getDistance(b, start));
    return sortedEntrances[0];
  }
  return {lat: station.gtfs_latitude, lng: station.gtfs_longitude};
}
