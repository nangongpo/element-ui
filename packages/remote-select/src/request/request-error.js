import axios from 'axios';

/**
 * Return whether an error is an expected request cancellation.
 * @param {*} error
 * @returns {Boolean}
 */
export function isCanceled(error) {
  return axios.isCancel(error) || error && (
    error.code === 'ERR_CANCELED' ||
    error.name === 'CanceledError' ||
    error.name === 'AbortError'
  );
}
