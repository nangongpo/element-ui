import axios from 'axios';

/**
 * Create the cancellation context passed to remoteMethod and resolveValue.
 * @returns {{signal: Object|null, cancelToken: Object|null, cancel: Function}}
 */
export function createRequestController() {
  const abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const cancelSource = axios.CancelToken && axios.CancelToken.source ? axios.CancelToken.source() : null;
  return {
    signal: abortController && abortController.signal,
    cancelToken: cancelSource && cancelSource.token,
    cancel(reason) {
      if (abortController) abortController.abort();
      if (cancelSource) cancelSource.cancel(reason);
    }
  };
}
