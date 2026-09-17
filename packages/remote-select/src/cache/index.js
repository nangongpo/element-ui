/* global Map */

import { CacheStore } from './cache-store';
import { expired } from './cache-utils';
import { clearAll } from './cache-storage';

export class RemoteSelectCache {
  constructor() {
    this.stores = new Map();
  }

  namespaceKey(namespace) {
    return String(namespace);
  }

  /** Get or restore a cache namespace synchronously. */
  store(namespace) {
    const key = this.namespaceKey(namespace);
    if (!this.stores.has(key)) this.stores.set(key, new CacheStore(key));
    return this.stores.get(key);
  }

  /** Read a query without touching LRU. */
  peek(namespace, query, ttl) {
    return this.store(namespace).get(query, ttl, false);
  }

  /** Read a query and touch its LRU position. */
  get(namespace, query, ttl) {
    return this.store(namespace).get(query, ttl, true);
  }

  /** Store a successful query result synchronously. */
  set(namespace, query, options, size, valueKey) {
    this.store(namespace).setQuery(query, options, size, valueKey);
  }

  /** Store a resolved option synchronously. */
  setOption(namespace, option, valueKey, size) {
    this.store(namespace).setOption(option, valueKey, size);
  }

  /** Read a resolved option synchronously. */
  getOption(namespace, value, valueKey) {
    return this.store(namespace).option(value, valueKey);
  }

  /** Update already indexed local options synchronously. */
  updateOptions(namespace, options, valueKey) {
    this.store(namespace).updateOptions(options, valueKey);
  }

  /** Rebuild indexes synchronously after valueKey changes. */
  reindex(namespace, valueKey) {
    this.store(namespace).reindex(valueKey);
  }

  /** Subscribe to isolated cache changes. */
  subscribe(namespace, listener) {
    const key = this.namespaceKey(namespace);
    const cacheStore = this.store(key);
    const unsubscribe = cacheStore.subscribe(listener);
    return () => {
      unsubscribe();
      if (
        !cacheStore.store.listeners.size &&
        !cacheStore.store.queries.size
      ) {
        this.stores.delete(key);
      }
    };
  }

  /** Enforce both independent cache capacities synchronously. */
  enforce(namespace, size, optionSize) {
    this.store(namespace).resize(size, optionSize);
  }

  /** Clear one namespace, or all namespaces when omitted. */
  clear(namespace) {
    if (namespace === undefined) {
      this.stores.forEach((cacheStore, key) => {
        cacheStore.clear();
        if (!cacheStore.store.listeners.size) this.stores.delete(key);
      });
      clearAll();
      return;
    }

    const key = this.namespaceKey(namespace);
    const cacheStore = this.stores.get(key);
    if (!cacheStore) return;
    cacheStore.clear();
    if (!cacheStore.store.listeners.size) this.stores.delete(key);
  }

  /** Invalidate one query entry synchronously. */
  invalidate(namespace, query) {
    return this.store(namespace).invalidate(query);
  }

  /** Invalidate one resolved option synchronously. */
  invalidateOption(namespace, value, valueKey) {
    return this.store(namespace).invalidateOption(value, valueKey);
  }

  /** Return cache statistics after removing expired queries. */
  stats(namespace, ttl) {
    const cacheStore = this.store(namespace);
    this.cleanup(namespace, ttl);
    let resolvedSize = 0;
    cacheStore.store.options.forEach(entry => {
      if (entry.standalone) resolvedSize++;
    });
    return {
      size: cacheStore.store.queries.size,
      querySize: cacheStore.store.queries.size,
      resolvedSize
    };
  }

  /** List cached queries without touching their LRU order. */
  list(namespace, ttl) {
    const cacheStore = this.store(namespace);
    this.cleanup(namespace, ttl);
    return Array.from(cacheStore.store.queries.keys()).map(query => ({
      query,
      options: cacheStore.get(query, ttl, false) || []
    }));
  }

  cleanup(namespace, ttl) {
    const cacheStore = this.store(namespace);
    Array.from(cacheStore.store.queries.entries()).forEach(([query, entry]) => {
      if (expired(entry, ttl)) cacheStore.invalidate(query);
    });
  }
}

export default new RemoteSelectCache();
