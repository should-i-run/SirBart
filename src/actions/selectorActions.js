/* @flow */

export function showSelector(kind: string, data: Object, selectionKey?: string) {
  return {
    type: 'SHOW_SELECTOR',
    kind,
    data,
    selectionKey,
  };
}
export function hideSelector() {
  return {
    type: 'HIDE_SELECTOR',
  };
}
