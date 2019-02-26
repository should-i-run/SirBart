/* @flow */
declare type SavedDestinations = {
  home?: string,
  work?: string,
};

declare type TripForLine = {
  abbreviation: string,
  timeEstimate: number,
  transferStation?: string,
};

declare type Trip = {
  code: string,
  lines: TripForLine[],
};

declare type __DEV__ = boolean;
