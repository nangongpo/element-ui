/* global Map, Set */

import { clone, queryEntry, optionEntry } from './cache-entry';
import { valueIndex, normalizeQuery, expired, capacity } from './cache-utils';
import { read, write, remove } from './cache-storage';
import { notify, subscribe } from './cache-notifier';

export function createStore(namespace) {
  const store = { queries: new Map(), options: new Map(), listeners: new Set() };
  const snapshot = read(namespace) || {};
  const queries = Array.isArray(snapshot.queries) ? snapshot.queries : [];
  const options = Array.isArray(snapshot.options) ? snapshot.options : [];

  queries.forEach(item => {
    if (!item || !item[1] || typeof item[1] !== 'object') return;
    const entry = item[1];
    store.queries.set(normalizeQuery(item[0]), {
      ...entry,
      value: Array.isArray(entry.value) ? entry.value : [],
      optionKeys: Array.isArray(entry.optionKeys) ? entry.optionKeys : [],
      createdAt: Number(entry.createdAt) || Date.now()
    });
  });

  options.forEach(item => {
    if (item && item[1] && item[1].option) {
      const entry = item[1];
      entry.queryKeys = new Set(Array.isArray(entry.queryKeys) ? entry.queryKeys : []);
      store.options.set(String(item[0]), entry);
    }
  });
  return store;
}

export function persist(namespace, store) {
  return write(namespace, {
    queries: Array.from(store.queries.entries()),
    options: Array.from(store.options.entries()).map(item => [
      item[0],
      { ...item[1], queryKeys: Array.from(item[1].queryKeys) }
    ])
  });
}

export function release(store, entry, query) {
  (entry.optionKeys || []).forEach(index => {
    const option = store.options.get(index);
    if (!option) return;
    option.queryKeys.delete(query);
    if (!option.standalone && option.queryKeys.size === 0) store.options.delete(index);
  });
}

export function enforceQueries(store, limit) {
  let changed = false;
  const maxSize = capacity(limit, 20);
  while (store.queries.size > maxSize) {
    const oldest = store.queries.entries().next().value;
    if (!oldest) break;
    store.queries.delete(oldest[0]);
    release(store, oldest[1], oldest[0]);
    changed = true;
  }
  return changed;
}

export function enforceOptions(store, limit) {
  const maxSize = capacity(limit, 20);
  let standaloneCount = 0;
  store.options.forEach(entry => {
    if (entry.standalone) standaloneCount++;
  });

  let changed = false;
  while (standaloneCount > maxSize) {
    let oldestKey;
    let oldestUsedAt = Infinity;
    store.options.forEach((entry, key) => {
      if (
        entry.standalone &&
        entry.queryKeys.size === 0 &&
        entry.standaloneUsedAt < oldestUsedAt
      ) {
        oldestKey = key;
        oldestUsedAt = entry.standaloneUsedAt;
      }
    });
    if (oldestKey === undefined) break;
    store.options.delete(oldestKey);
    standaloneCount--;
    changed = true;
  }
  return changed;
}

export function evictOldestQuery(store) {
  const oldest = store.queries.entries().next().value;
  if (!oldest) return false;
  store.queries.delete(oldest[0]);
  release(store, oldest[1], oldest[0]);
  return true;
}

export function evictOldestOption(store) {
  let oldestKey;
  let oldestUsedAt = Infinity;
  store.options.forEach((entry, key) => {
    if (
      entry.standalone &&
      entry.queryKeys.size === 0 &&
      entry.standaloneUsedAt < oldestUsedAt
    ) {
      oldestKey = key;
      oldestUsedAt = entry.standaloneUsedAt;
    }
  });
  if (oldestKey === undefined) return false;
  store.options.delete(oldestKey);
  return true;
}

export class CacheStore {
  constructor(namespace) {
    this.namespace = namespace;
    this.store = createStore(namespace);
    this.sequence = 0;
  }

  save() {
    let result = persist(this.namespace, this.store);
    if (result.success || result.reason !== 'quota-exceeded') return result;

    while (result.reason === 'quota-exceeded') {
      const evicted = evictOldestQuery(this.store) ||
        evictOldestOption(this.store);
      if (!evicted) break;
      result = persist(this.namespace, this.store);
    }
    return result;
  }

  get(query, ttl, touch) {
    const key = normalizeQuery(query);
    const entry = this.store.queries.get(key);
    if (!entry) return undefined;
    if (expired(entry, ttl)) {
      this.store.queries.delete(key);
      release(this.store, entry, key);
      this.save();
      notify(this.store, { type: 'expire', query: key });
      return undefined;
    }
    if (touch) {
      this.store.queries.delete(key);
      this.store.queries.set(key, entry);
    }
    return (entry.value || []).map(clone);
  }

  setQuery(query, options, maxSize, valueKey) {
    const key = normalizeQuery(query);
    const old = this.store.queries.get(key);
    if (old) release(this.store, old, key);
    const entry = queryEntry(options);
    this.store.queries.set(key, entry);
    entry.value.forEach(option => {
      const index = valueIndex(option.value, valueKey);
      let record = this.store.options.get(index);
      if (!record) record = optionEntry(option, 0);
      record.option = clone(option);
      record.queryKeys.add(key);
      this.store.options.set(index, record);
      entry.optionKeys.push(index);
    });
    enforceQueries(this.store, maxSize);
    this.save();
    notify(this.store, { type: 'set', query: key });
  }

  setOption(option, valueKey, maxSize) {
    const index = valueIndex(option.value, valueKey);
    let record = this.store.options.get(index);
    if (!record) record = optionEntry(option, ++this.sequence);
    record.option = clone(option);
    record.standalone = true;
    record.standaloneUsedAt = ++this.sequence;
    this.store.options.set(index, record);
    enforceOptions(this.store, maxSize);
    this.save();
    notify(this.store, { type: 'option-set', value: index });
  }

  option(value, valueKey) {
    const record = this.store.options.get(valueIndex(value, valueKey));
    return record && clone(record.option);
  }

  updateOptions(options, valueKey) {
    let changed = false;
    options.forEach(option => {
      const record = this.store.options.get(valueIndex(option.value, valueKey));
      if (!record) return;
      record.option = clone(option);
      changed = true;
    });
    if (changed) {
      this.save();
      notify(this.store, { type: 'options-update' });
    }
  }

  reindex(valueKey) {
    const records = Array.from(this.store.options.values());
    this.store.options.clear();
    records.forEach(record => {
      const index = valueIndex(record.option.value, valueKey);
      const previous = this.store.options.get(index);
      if (!previous) {
        this.store.options.set(index, record);
        return;
      }
      previous.queryKeys = new Set([...previous.queryKeys, ...record.queryKeys]);
      previous.standalone = previous.standalone || record.standalone;
      previous.standaloneUsedAt = Math.max(
        previous.standaloneUsedAt,
        record.standaloneUsedAt
      );
    });
    this.store.queries.forEach(entry => {
      entry.optionKeys = (entry.value || []).map(option => {
        return valueIndex(option.value, valueKey);
      });
    });
    this.save();
    notify(this.store, { type: 'reindex' });
  }

  subscribe(listener) {
    return subscribe(this.store, listener);
  }

  resize(querySize, optionSize) {
    const queryChanged = enforceQueries(this.store, querySize);
    const optionChanged = enforceOptions(this.store, optionSize);
    if (queryChanged || optionChanged) {
      this.save();
      notify(this.store, { type: 'resize' });
    }
  }

  clear() {
    this.store.queries.clear();
    this.store.options.clear();
    remove(this.namespace);
    notify(this.store, { type: 'clear' });
  }

  invalidate(query) {
    const key = normalizeQuery(query);
    const entry = this.store.queries.get(key);
    if (!entry) return false;
    this.store.queries.delete(key);
    release(this.store, entry, key);
    this.save();
    notify(this.store, { type: 'invalidate', query: key });
    return true;
  }

  invalidateOption(value, valueKey) {
    const index = valueIndex(value, valueKey);
    if (!this.store.options.has(index)) return false;
    this.store.options.delete(index);
    this.store.queries.forEach(entry => {
      entry.optionKeys = (entry.optionKeys || []).filter(item => item !== index);
    });
    this.save();
    notify(this.store, { type: 'option-invalidate', value: index });
    return true;
  }
}
