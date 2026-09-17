const STORAGE_PREFIX = 'el-remote-select:';

export function storage() {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch (e) {
    return null;
  }
}

export function key(namespace) {
  return `${STORAGE_PREFIX}${String(namespace)}`;
}

export function read(namespace) {
  const target = storage();
  if (!target) return null;
  try {
    return JSON.parse(target.getItem(key(namespace)) || '{}');
  } catch (e) {
    try {
      target.removeItem(key(namespace));
    } catch (ignore) {
      // Restricted storage should not break cache reads.
    }
    return null;
  }
}

export function serialize(snapshot) {
  try {
    const value = JSON.stringify(snapshot);
    return {
      value,
      bytes: byteLength(value)
    };
  } catch (error) {
    return {
      value: null,
      bytes: 0,
      reason: 'serialize-failed',
      error
    };
  }
}

export function byteLength(value) {
  if (typeof Blob !== 'undefined') return new Blob([value]).size;
  return value.length;
}

export function isQuotaError(error) {
  return !!error && (
    error.code === 22 ||
    error.code === 1014 ||
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );
}

export function write(namespace, snapshot) {
  const target = storage();
  if (!target) return { success: false, reason: 'unavailable', bytes: 0 };
  const serialized = serialize(snapshot);
  if (serialized.reason) return { success: false, ...serialized };

  try {
    target.setItem(key(namespace), serialized.value);
    return { success: true, bytes: serialized.bytes };
  } catch (e) {
    return {
      success: false,
      reason: isQuotaError(e) ? 'quota-exceeded' : 'write-failed',
      bytes: serialized.bytes,
      error: e
    };
  }
}

export function remove(namespace) {
  const target = storage();
  if (!target) return;
  try {
    target.removeItem(key(namespace));
  } catch (e) {
    // Restricted storage should not break cache invalidation.
  }
}

/** Remove every remote-select persistence record without failing in restricted storage. */
export function clearAll() {
  const target = storage();
  if (!target) return;
  const keys = [];
  try {
    for (let index = 0; index < target.length; index++) {
      const item = target.key(index);
      if (item && item.indexOf(STORAGE_PREFIX) === 0) keys.push(item);
    }
  } catch (e) {
    return;
  }

  keys.forEach(item => {
    try {
      target.removeItem(item);
    } catch (e) {
      // Continue removing other namespaces when one key fails.
    }
  });
}
