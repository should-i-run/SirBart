/* @flow */

export function showSelector(kind: string, data: Object) {
  return {
    type: 'SHOW_SELECTOR',
    kind,
    data,
  };
}
export function hideSelector() {
  return {
    type: 'HIDE_SELECTOR',
  };
}
