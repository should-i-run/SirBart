/* @flow */

import type { Location } from "../actions/dataActions";
import type { Station } from "../reducers/appStore";

export function isSameLocation(old: Location, newLoc: Location) {
  return old.lat === newLoc.lat && old.lng === newLoc.lng;
}

export function getClosestEntrance(station: Station, start: ?Location) {
  if (start && station.entrances.length) {
    const getDistance = (entrance: Location, startLoc: Location) => {
      const latDistance = Math.pow(startLoc.lat - entrance.lat, 2);
      const lngDistance = Math.pow(startLoc.lng - entrance.lng, 2);
      return Math.sqrt(lngDistance + latDistance);
    };
    const sortedEntrances = station.entrances.sort(
      // $FlowFixMe
      (a, b) => getDistance(a, start) - getDistance(b, start),
    );
    return sortedEntrances[0];
  }
  return { lat: station.gtfs_latitude, lng: station.gtfs_longitude };
}

// http://www.geodatasource.com/developers/javascript
export function distanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist * 1.609344;
}
