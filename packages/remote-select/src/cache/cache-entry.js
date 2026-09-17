/** Deep clone values stored outside the component. */
/* global Set */

export function clone(value) {
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value);
  if (Array.isArray(value)) return value.map(clone);

  return Object.keys(value).reduce((result, key) => {
    result[key] = clone(value[key]);
    return result;
  }, {});
}

export function queryEntry(options) {
  return {
    value: options.map(clone),
    optionKeys: [],
    createdAt: Date.now()
  };
}

export function optionEntry(option, standaloneUsedAt) {
  return {
    option: clone(option),
    queryKeys: new Set(),
    standalone: standaloneUsedAt > 0,
    standaloneUsedAt: standaloneUsedAt || 0
  };
}
