/** Convert a cache query to the public string representation. */
export function normalizeQuery(query) {
  return query == null ? '' : String(query);
}

/** Read a value, using valueKey for object values. */
export function valueAt(value, valueKey) {
  if (value && typeof value === 'object' && valueKey) {
    return valueKey.split('.').reduce((result, key) => {
      return result == null ? undefined : result[key];
    }, value);
  }
  return value;
}

/** Build an index key shared by all cache value lookups. */
export function valueIndex(value, valueKey) {
  const resolved = valueAt(value, valueKey);
  if (resolved && typeof resolved === 'object') {
    try {
      return `object:${JSON.stringify(resolved)}`;
    } catch (e) {
      return `object:${String(resolved)}`;
    }
  }
  return `${typeof resolved}:${String(resolved)}`;
}

/** Validate a cache capacity. */
export function capacity(value, fallback) {
  return isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

/** Test query-entry expiry. */
export function expired(entry, ttl) {
  return ttl > 0 && Date.now() - entry.createdAt >= ttl;
}
