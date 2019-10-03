import { NetworkStatus } from '../reducers/appStore';
import retry, { RetryOperation } from 'retry';

function statusChange(url: string, status: NetworkStatus) {
  return {
    type: 'NETWORK_CHANGE' as 'NETWORK_CHANGE',
    url: url.slice(0, 44),
    status,
  };
}

type RequestKey = string;

type PendingRequest = {
  opts: RequestInit | undefined;
  operation: RetryOperation;
  reject: (reason?: any) => void;
  resolve: (value?: Response | PromiseLike<Response> | undefined) => void;
  dataLastUpdatedTime: number;
};

const state: Record<RequestKey, PendingRequest> = {};

export const SKIPPED = 'skipped';
export const STALE = 'stale';

function setRequest(key: RequestKey, req: PendingRequest): void {
  state[key] = req;
}

function clearRequest(key: RequestKey) {
  delete state[key];
}

function getRequest(key: RequestKey): PendingRequest | undefined {
  return state[key];
}

function getRequestOrError(key: RequestKey): PendingRequest {
  const res = getRequest(key);
  if (!res) {
    throw new Error(`${key} not an existing request`);
  }
  return res;
}

export default function wrappedFetch(
  dispatch: any,
  url: string,
  requestKey: string,
  opts?: RequestInit,
): Promise<Response> {
  // console.log({ requestKey, status: 'fetching' })
  dispatch(statusChange(url, NetworkStatus.Fetching));

  function run(
    resolve: (value?: Response | PromiseLike<Response> | undefined) => void,
    reject: (reason?: any) => void,
  ) {
    const existingRequest = getRequest(requestKey);

    if (existingRequest) {
      existingRequest.opts = opts;
      existingRequest.reject(SKIPPED);
      // console.log({ requestKey, status: 'rejecting existing promise' })
    }
    const operation =
      (existingRequest && existingRequest.operation) ||
      retry.operation({
        // https://github.com/tim-kos/node-retry#retrytimeoutsoptions
        retries: 100,
        minTimeout: 200,
        maxTimeout: 2000,
        factor: 2, // default
      });

    const currentRequest: PendingRequest = {
      reject,
      resolve,
      opts,
      operation,
      dataLastUpdatedTime: Date.now(),
    };

    setRequest(requestKey, currentRequest);

    if (!existingRequest) {
      operation.attempt(_currentAttempt => {
        fetch(url, getRequestOrError(requestKey).opts)
          .then(res => {
            const req = getRequestOrError(requestKey);
            // If the time between when the request started and finished is greater than 1 min,
            // lets call it an error and rely on the caller to refetch
            if (req.dataLastUpdatedTime < Date.now() - 1000 * 60) {
              req.reject(STALE);
              dispatch(statusChange(url, NetworkStatus.Error));
            } else {
              dispatch(statusChange(url, NetworkStatus.Success));
              // console.log({ requestKey, status: 'success' })
              req.resolve(res);
            }
            clearRequest(requestKey);
          })
          .catch(err => {
            if (operation.retry(err)) {
              // console.log({ requestKey, status: 'retrying', _currentAttempt })
              return;
            }
            // console.log({ requestKey, status: 'error' })
            getRequestOrError(requestKey).reject(err);
            dispatch(statusChange(url, NetworkStatus.Error));
            clearRequest(requestKey);
          });
      });
    }
  }

  return new Promise(run);
}

export type WrappedFetchActions = ReturnType<typeof statusChange>;
