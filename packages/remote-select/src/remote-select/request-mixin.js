import { arrayFind, arrayFindIndex } from 'element-ui/src/utils/util';
import cache from '../cache/index';
import { createRequestController, isCanceled } from '../request';

export default {
  methods: {
    /** Throw when remote mode is enabled without a remote method. */
    assertRemoteMethod() {
      if (this.remote && typeof this.remoteMethod !== 'function') {
        throw new Error(
          '[ElRemoteSelect] remoteMethod is required when remote is true'
        );
      }
    },
    /** Restore selected values from local options, cache, or resolveValue. */
    restoreSelectedOptions() {
      const missing = [];
      const availableOptions = this.optionsNormalized.concat(this.remoteOptions);
      this.selectedValues.forEach(value => {
        const hasOption = this.hasSelectedOption(availableOptions, value);
        const option = this.cache &&
          cache.getOption(
            this.cacheKey,
            this.getValue(value),
            this.valueKey
          );
        if (option && !hasOption) {
          this.remoteOptions.push(option);
          availableOptions.push(option);
        }
        if (!hasOption && !option) missing.push(value);
      });
      if (!missing.length) this.resolveError = false;
      this.resolveDefaultOptions(missing);
    },
    /** Resolve missing bound values synchronously or asynchronously. */
    resolveDefaultOptions(values) {
      if (!this.resolveValue || !values || values.length === 0) return;
      if (this.resolveRequest) {
        this.pendingResolve = true;
        return;
      }
      const uniqueValues = values.filter((value, index) => {
        return arrayFindIndex(
          values,
          item => this.sameValue(item, value)
        ) === index;
      });
      const request = createRequestController();
      this.resolveRequest = request;
      this.resolveValues = uniqueValues;
      this.resolveError = false;
      this.loading = true;
      const context = {
        cacheKey: this.cacheKey,
        valueKey: this.valueKey,
        signal: request.signal,
        cancelToken: request.cancelToken
      };
      return this.invokeMethod(
        this.resolveValue,
        [uniqueValues, context],
        result => {
          if (this.resolveRequest !== request) return [];
          const options = this.normalizeOptions(result, 'resolveValue');
          options.forEach(option => {
            if (this.cache) {
              cache.setOption(
                this.cacheKey,
                option,
                this.valueKey,
                this.getCacheOptionSize()
              );
            }
            if (
              arrayFind(
                this.selectedValues,
                value => this.sameValue(value, option.value)
              )
            ) {
              this.remoteOptions.push(option);
            }
          });
          this.$emit('resolve-success', uniqueValues, options);
          return options;
        },
        error => {
          if (!this.isCanceled(error)) {
            if (this.resolveRequest === request) this.resolveError = true;
            this.$emit('resolve-error', error, uniqueValues);
          }
        },
        () => {
          if (this.resolveRequest === request) {
            this.resolveRequest = null;
            this.updateLoading();
            if (this.pendingResolve) {
              this.pendingResolve = false;
              this.restoreSelectedOptions();
            }
          }
        }
      );
    },
    /** Cancel the active keyword request. */
    abortRequest() {
      if (this.requestController) {
        this.requestController.cancel('remote-select request cancelled');
      }
      this.requestController = null;
    },
    /** Cancel the active resolveValue request. */
    cancelResolveRequest() {
      if (!this.resolveRequest) return;
      this.resolveRequest.cancel('remote-select resolve cancelled');
      this.resolveRequest = null;
      this.updateLoading();
    },
    /** Public resolve cancellation alias. */
    cancelResolve() { this.cancelResolveRequest(); },
    /** Return whether an error is an expected cancellation. */
    isCanceled(error) { return isCanceled(error); },
    /** Recompute loading from all active requests. */
    updateLoading() {
      this.loading = !!(this.requestController || this.resolveRequest);
    },
    /** Invoke a sync or Promise-returning method with uniform completion. */
    invokeMethod(method, args, onSuccess, onError, onComplete) {
      let result;
      try {
        result = method(...args);
      } catch (error) {
        onError(error);
        onComplete();
        return;
      }
      if (result && typeof result.then === 'function') {
        return result
          .then(value => {
            try {
              onSuccess(value);
            } catch (error) {
              onError(error);
            }
          }, onError)
          .then(onComplete, onComplete);
      }
      try {
        onSuccess(result);
      } catch (error) {
        onError(error);
      }
      onComplete();
    },
    /** Normalize a select query and delegate to el-select's debounced callback. */
    handleRemoteMethod(query) {
      const normalizedQuery = query == null ? '' : String(query);
      this.lastQuery = normalizedQuery;
      return this.search(normalizedQuery);
    },
    /** Search remotely or from query cache. */
    search(query) {
      this.assertRemoteMethod();
      query = query == null ? '' : String(query);
      this.lastQuery = query;
      const id = ++this.requestId;
      const canCacheQuery = this.cache && (query !== '' || this.cacheEmptyQuery);
      if (query.length < this.minQueryLength) {
        this.abortRequest();
        this.remoteOptions = [];
        this.error = false;
        this.updateLoading();
        return;
      }
      this.abortRequest();
      const cached = canCacheQuery
        ? cache.get(this.cacheKey, query, this.getCacheTtl())
        : undefined;
      if (cached) {
        this.remoteOptions = cached.slice();
        this.error = false;
        this.updateLoading();
        this.restoreSelectedOptions();
        this.$emit('cache-hit', query, cached);
        return;
      }
      this.loading = true;
      this.error = false;
      this.remoteOptions = [];
      const request = createRequestController();
      this.requestController = request;
      const context = {
        cacheKey: this.cacheKey,
        valueKey: this.valueKey,
        signal: request.signal,
        cancelToken: request.cancelToken
      };
      return this.invokeMethod(this.remoteMethod, [query, context], result => {
        if (id !== this.requestId) return;
        const options = this.normalizeOptions(result, 'remoteMethod');
        this.remoteOptions = options;
        if (canCacheQuery) {
          cache.set(
            this.cacheKey,
            query,
            options,
            this.getCacheSize(),
            this.valueKey
          );
        }
        this.restoreSelectedOptions();
        this.$emit('success', query, options);
      }, requestError => {
        if (id !== this.requestId || this.isCanceled(requestError)) return;
        this.remoteOptions = [];
        this.restoreSelectedOptions();
        this.error = true;
        this.$emit('remote-error', requestError, query);
        this.$emit('error', requestError, query);
      }, () => {
        if (id === this.requestId) {
          this.requestController = null;
          this.updateLoading();
        }
      });
    },
    /** Retry the last keyword query. */
    retry() {
      const promise = this.search(this.lastQuery);
      this.$emit('retry', this.lastQuery);
      return promise;
    },
    /** Retry the last failed resolveValue call. */
    retryResolve() {
      if (this.resolveValues.length) {
        return this.resolveDefaultOptions(this.resolveValues);
      }
    }
  }
};
