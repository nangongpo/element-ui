export const call = (value, params, fallback) => {
  if (typeof value === 'function') return value(params) || fallback;
  return value == null ? fallback : value;
};

export const leafColumns = columns => {
  const result = [];
  const visit = list => (list || []).forEach(column => {
    if (column && column.hidden) return;
    if (column && column.children && column.children.length) visit(column.children);
    else if (column) result.push(column);
  });
  visit(columns);
  return result;
};

export const columnWidth = column => Number(column && (column.width || column.minWidth)) || 0;

export const getByPath = (object, path) => {
  if (typeof path === 'function') return path(object);
  if (path == null || path === '') return undefined;
  return String(path).split('.').reduce((value, key) => value == null ? undefined : value[key], object);
};

export const rowIdentity = (row, rowKey, index) => {
  const value = rowKey == null ? undefined : getByPath(row, rowKey);
  return value == null ? index : value;
};

export const normalizeStyle = style => {
  if (style == null) return {};
  if (typeof style === 'string') return { cssText: style };
  return style;
};

export const normalizeClass = value => value || undefined;
