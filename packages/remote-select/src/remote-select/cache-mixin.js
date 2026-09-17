import cache from '../cache/index';

export default {
  watch: {
    value: {
      immediate: true,
      handler() {
        this.cancelResolveRequest();
        if (this.optionsReady) this.restoreSelectedOptions();
      }
    },
    options: {
      immediate: true,
      deep: true,
      handler(options) {
        try {
          this.optionsNormalized = this.normalizeOptions(options, 'options');
          this.optionsReady = true;
          if (this.cache) {
            cache.updateOptions(
              this.cacheKey,
              this.optionsNormalized,
              this.valueKey
            );
          }
          this.error = false;
        } catch (error) {
          this.optionsNormalized = [];
          this.optionsReady = true;
          this.error = true;
          this.$emit('error', error, 'options');
        }
        this.restoreSelectedOptions();
      }
    },
    valueKey() {
      if (this.cache) cache.reindex(this.cacheKey, this.valueKey);
      this.restoreSelectedOptions();
    },
    cacheSize() {
      this.resizeCache();
    },
    cacheOptionSize() {
      this.resizeCache();
    },
    cache(enabled) {
      this.unsubscribeCache();
      if (enabled) {
        this.assertCacheKey();
        this.subscribeCache();
        this.resizeCache();
      }
    },
    remote(enabled) {
      if (enabled) {
        this.assertRemoteMethod();
        return;
      }
      this.requestId++;
      this.abortRequest();
      this.updateLoading();
    },
    cacheKey() {
      if (this.cache) this.assertCacheKey();
      this.unsubscribeCache();
      if (this.cache) this.subscribeCache();
      this.requestId++;
      this.abortRequest();
      this.cancelResolveRequest();
      this.remoteOptions = [];
      this.error = false;
      this.pendingResolve = false;
      this.restoreSelectedOptions();
    }
  },
  methods: {
    /** Throw when caching is enabled without a stable namespace. */
    assertCacheKey() {
      if (this.cache && (!this.cacheKey || !this.cacheKey.trim())) {
        throw new Error('[ElRemoteSelect] cacheKey is required when cache is true');
      }
    },
    /** Subscribe to the current cache namespace. */
    subscribeCache() {
      if (!this.cache) return;
      this.unsubscribeCache();
      this.unsubscribeCacheChange = cache.subscribe(this.cacheKey, change => {
        this.$emit('cache-change', change);
        const shouldRestore = change && [
          'option-set',
          'options-update',
          'expire',
          'reindex'
        ].indexOf(change.type) !== -1;
        if (shouldRestore) this.restoreSelectedOptions();
      });
    },
    /** Unsubscribe from the current cache namespace. */
    unsubscribeCache() {
      if (!this.unsubscribeCacheChange) return;
      this.unsubscribeCacheChange();
      this.unsubscribeCacheChange = null;
    },
    /** Enforce current independent query and option capacities. */
    resizeCache() {
      if (!this.cache) return;
      this.assertCacheKey();
      cache.enforce(
        this.cacheKey,
        this.getCacheSize(),
        this.getCacheOptionSize()
      );
    },

    /** Clear all cached data for this component namespace. */
    clearCache() {
      if (this.cache) cache.clear(this.cacheKey);
    },

    /** Invalidate one query cache entry. */
    invalidateCache(query) {
      return this.cache ? cache.invalidate(this.cacheKey, query) : false;
    },

    /** Invalidate one resolved option. */
    invalidateOption(value) {
      return this.cache
        ? cache.invalidateOption(this.cacheKey, value, this.valueKey)
        : false;
    },

    /** Return cache statistics without changing query LRU order. */
    getCacheStats() {
      return this.cache
        ? cache.stats(this.cacheKey, this.getCacheTtl())
        : { size: 0, querySize: 0, resolvedSize: 0 };
    },

    /** List cached queries without changing query LRU order. */
    getCacheList() {
      return this.cache ? cache.list(this.cacheKey, this.getCacheTtl()) : [];
    },

    /** Return normalized query-cache TTL. */
    getCacheTtl() {
      return isFinite(this.cacheTtl) && this.cacheTtl >= 0
        ? this.cacheTtl
        : 5 * 60 * 1000;
    },

    /** Return normalized query-cache capacity. */
    getCacheSize() {
      return isFinite(this.cacheSize) && this.cacheSize > 0
        ? Math.floor(this.cacheSize)
        : 20;
    },

    /** Return normalized independent option-cache capacity. */
    getCacheOptionSize() {
      return isFinite(this.cacheOptionSize) && this.cacheOptionSize > 0
        ? Math.floor(this.cacheOptionSize)
        : 20;
    }
  }
};
