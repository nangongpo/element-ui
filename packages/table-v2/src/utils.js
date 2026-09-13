export { call, leafColumns, columnWidth, getByPath, rowIdentity, normalizeStyle, normalizeClass } from './common';

export const px = value => typeof value === 'number' ? `${value}px` : value;

export const invoke = (handler, params) => {
  if (typeof handler === 'function') handler(params);
};

export const renderValue = (h, value) => value == null ? '' : String(value);

export const columnAlignClass = align => {
  if (align === 'center') return 'is-align-center';
  if (align === 'right') return 'is-align-right';
  return '';
};
