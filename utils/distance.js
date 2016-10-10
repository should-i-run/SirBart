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
  if (!start) {
    return {lat: station.gtfs_latitude, lng: station.gtfs_longitude};
  }
  if (start && station.entrances.length) {
    const getDistance = (entrance) => {
      const latDistance = Math.pow((start.lat - entrance.lat), 2);
      const lngDistance = Math.pow((start.lng - entrance.lng), 2);
      return Math.sqrt(lngDistance + latDistance);
    };
    const sortedEntrances = station.entrances.sort((a, b) => getDistance(a) - getDistance(b));
    return sortedEntrances[0];
  } else {
    return {lat: station.gtfs_latitude, lng: station.gtfs_longitude};
  }
}
