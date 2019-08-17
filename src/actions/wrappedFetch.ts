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
  operation: RetryOperation
  reject: (reason?: any) => void
  resolve: (value?: Response | PromiseLike<Response> | undefined) => void
}

const state: Record<RequestKey, PendingRequest> = {};

export const SKIPPED = 'skipped';

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

  function run(resolve: (value?: Response | PromiseLike<Response> | undefined) => void, reject: (reason?: any) => void) {
    const existingRequest = getRequest(requestKey);

    if (existingRequest) {
      existingRequest.opts = opts
      existingRequest.reject(SKIPPED);
      // console.log({ requestKey, status: 'rejecting existing promise' })
    }
    const operation = (existingRequest && existingRequest.operation) || retry.operation({
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
    }

    setRequest(requestKey, currentRequest);

    if (!existingRequest) {
      operation.attempt((_currentAttempt) => {
        fetch(url, getRequestOrError(requestKey).opts).then((res) => {
          dispatch(statusChange(url, NetworkStatus.Success));
          // console.log({ requestKey, status: 'success' })
          getRequestOrError(requestKey).resolve(res);
          clearRequest(requestKey)
        }).catch((err) => {
          if (operation.retry(err)) {
            // console.log({ requestKey, status: 'retrying', _currentAttempt })
            return;
          }
          // console.log({ requestKey, status: 'error' })
          getRequestOrError(requestKey).reject(err);
          dispatch(statusChange(url, NetworkStatus.Error));
          clearRequest(requestKey)
        })
      })
    }
  }

  return new Promise(run);
}

export type WrappedFetchActions = ReturnType<typeof statusChange>;


