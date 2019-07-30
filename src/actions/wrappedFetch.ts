import { NetworkStatus } from '../reducers/appStore';
import retry from 'async-retry';

// enum FetchingStates {
//   Active,
//   Complete,
// }

// const fetchingMap: Record<string, FetchingStates> = {};

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

  // if (fetchingMap[url] && fetchingMap[url] === FetchingStates.Active) {
  //   return Promise.resolve(new Response());
  // }

  return retry(
    async () => {
      return fetch(url, opts);
    },
    {
      onRetry(error, attempt) {
        console.log('retrying attempt ', attempt, ' error ', error);
      },
      // https://github.com/tim-kos/node-retry#retrytimeoutsoptions
      retries: 10,
      minTimeout: 200,
      maxTimeout: 2000,
      factor: 2, // default
    },
  )
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
