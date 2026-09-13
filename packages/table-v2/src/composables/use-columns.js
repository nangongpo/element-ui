import { FixedDir, TableV2Placeholder } from '../constants';
import { columnWidth, leafColumns } from '../common';

export default {
  computed: {
    normalizedColumns() {
      const normalize = list => (list || []).filter(Boolean).filter(column => !column.hidden).map((column, index) => {
        const item = Object.assign({ key: index, dataKey: index, title: '', width: 0 }, column);
        item.key = column.key == null ? index : column.key;
        item.dataKey = column.dataKey == null ? item.key : column.dataKey;
        if (column.children) item.children = normalize(column.children);
        return item;
      });
      return normalize(this.columns);
    },
    allColumns() { return leafColumns(this.normalizedColumns); },
    leftColumns() { return this.allColumns.filter(column => column.fixed === true || column.fixed === FixedDir.LEFT); },
    rightColumns() { return this.allColumns.filter(column => column.fixed === FixedDir.RIGHT); },
    mainColumns() { return this.allColumns.filter(column => !column.fixed || column.fixed === false); },
    mainHeaderColumns() {
      const placeholders = columns => columns.map(column => Object.assign({}, column, { placeholderSign: TableV2Placeholder }));
      return placeholders(this.leftColumns).concat(this.mainColumns, placeholders(this.rightColumns));
    },
    leftWidth() { return this.leftColumns.reduce((sum, column) => sum + columnWidth(column), 0); },
    rightWidth() { return this.rightColumns.reduce((sum, column) => sum + columnWidth(column), 0); },
    // Flexible tables use the AutoResizer width as their layout width. Fixed
    // tables keep the declared column widths and let the virtual list scroll
    // over the larger content width.
    mainWidth() { return Math.max(0, this.width - this.leftWidth - this.rightWidth); },
    mainAreaWidth() { return Math.max(0, this.width); },
    headerRows() { return Array.isArray(this.headerHeight) ? this.headerHeight : [this.headerHeight]; },
    resolvedHeaderHeight() { return this.headerRows.reduce((sum, height) => sum + height, 0); },
    columnStyles() { return this.allColumns.map(column => Object.assign({ width: `${columnWidth(column)}px` }, column.style || {})); }
  }
};
