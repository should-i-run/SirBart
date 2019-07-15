import { NetworkStatus } from '../reducers/appStore';

function statusChange(url: string, status: NetworkStatus) {
  return {
    type: 'NETWORK_CHANGE' as 'NETWORK_CHANGE',
    url: url.slice(0, 44),
    status,
  };
}

export default function wrappedFetch(
  dispatch: any,
  url: string,
  opts?: RequestInit,
): Promise<Response> {
  dispatch(statusChange(url, NetworkStatus.Fetching));
  return fetch(url, opts)
    .then((stuff: any) => {
      dispatch(statusChange(url, NetworkStatus.Success));
      return stuff;
    })
    .catch((e: Error) => {
      dispatch(statusChange(url, NetworkStatus.Error));
      throw e;
    });
}

export type WrappedFetchActions = ReturnType<typeof statusChange>;
