import { getRowIdentity } from 'element-ui/packages/table/src/util';

export const getStyleNumber = function(value) {
  const number = parseInt(value, 10);
  return isNaN(number) ? 0 : number;
};

export const formatHeight = function(value) {
  if (typeof value === 'number') return value + 'px';
  if (typeof value === 'string' && /^\d+$/.test(value)) return value + 'px';
  return value;
};

export const getColumnWidth = function(column) {
  return getStyleNumber(column.realWidth || column.width || column.minWidth || 80);
};

export const getColumnMinWidth = function(column) {
  return getStyleNumber(column.minWidth || 80);
};

export const isFlexColumn = function(column) {
  return typeof column.width !== 'number';
};

export const getColumnAlignClass = function(align) {
  return align ? 'is-' + align.replace('is-', '') : '';
};

export const assertArray = function(value, name) {
  if (!Array.isArray(value)) {
    throw new TypeError('[TableV2] ' + name + ' must be an array.');
  }
  return value;
};

export const toValueArray = function(value) {
  if (typeof value === 'undefined' || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

export const getRowKey = function(row, rowKey, index) {
  if (!rowKey) return index;
  return getRowIdentity(row, rowKey);
};
