import { SelectionData } from "../reducers/appStore";

/* @flow */

export function showSelector(kind: SelectorKinds, data: SelectionData, selectionKey?: string) {
  return {
    type: 'SHOW_SELECTOR' as 'SHOW_SELECTOR',
    kind,
    data,
    selectionKey,
  };
}
export function hideSelector() {
  return {
    type: 'HIDE_SELECTOR' as 'HIDE_SELECTOR',
  };
}

export enum SelectorKinds {
  distance = 'distance'
}

export type SelectorActions =
  | ReturnType<typeof hideSelector>
  | ReturnType<typeof showSelector>;