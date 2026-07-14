import { getValueByPath } from 'element-ui/src/utils/util';

export const getDefaultCellValue = function(row, column, index) {
  if (column.type === 'index') {
    if (typeof column.index === 'number') return index + column.index;
    if (typeof column.index === 'function') return column.index(index);
    return index + 1;
  }
  const property = column.property;
  const value = property ? getValueByPath(row, property) : '';
  if (column.formatter) {
    return column.formatter(row, column, value, index);
  }
  return value;
};
