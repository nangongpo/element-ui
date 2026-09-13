import Cell from './cell';
import ExpandIcon from './expand-icon';
import { getByPath } from '../common';

export default {
  name: 'TableV2Row',
  components: { Cell, ExpandIcon },
  props: { columns: Array, rowData: Object, rowIndex: Number, rowKey: [String, Number], depth: Number, cellStyles: Array, cellProps: [Object, Function], expandColumnKey: [String, Number], expanded: Boolean, indentSize: Number, iconSize: Number, isScrolling: Boolean, rowClass: [String, Array, Object], rowProps: Object, rowStyle: Object, cellRenderer: [Object, Function], dataGetter: Function },
  methods: {
    cellValue(column) {
      const scope = { column, columns: this.columns, columnIndex: this.columns.indexOf(column), rowData: this.rowData, rowIndex: this.rowIndex };
      if (typeof column.dataGetter === 'function') return column.dataGetter(scope);
      if (typeof this.dataGetter === 'function') return this.dataGetter(scope);
      return getByPath(this.rowData, column.dataKey);
    },
    cellExtra(column, index, cellData) { const value = this.cellProps; const scope = { column, columns: this.columns, columnIndex: index, cellData, rowData: this.rowData, rowIndex: this.rowIndex }; return typeof value === 'function' ? (value(scope) || {}) : (value || {}); },
    cellWidth(index, colSpan) {
      return this.cellStyles.slice(index, index + colSpan).reduce((total, style) => {
        const value = style && style.width;
        return total + (typeof value === 'number' ? value : parseFloat(value) || 0);
      }, 0);
    }
  },
  render(h) {
    const cells = [];
    let skipped = 0;
    this.columns.forEach((column, index) => {
      if (skipped > 0) {
        skipped -= 1;
        return;
      }
      const cellData = this.cellValue(column);
      const extra = this.cellExtra(column, index, cellData);
      const cellAttrs = {};
      const cellEvents = {};
      Object.keys(extra).forEach(key => {
        if (/^on[A-Z]/.test(key) && typeof extra[key] === 'function') {
          const eventName = key.slice(2).replace(/^[A-Z]/, value => value.toLowerCase());
          cellEvents[eventName] = extra[key];
        } else if (key !== 'class' && key !== 'style' && key !== 'span') {
          cellAttrs[key] = extra[key];
        }
      });
      const span = extra.span || {};
      const colSpan = Math.max(1, Number(span.colSpan) || 1);
      skipped = colSpan - 1;
      const expandable = this.expandColumnKey != null && column.key === this.expandColumnKey && this.rowData && Array.isArray(this.rowData.children);
      const prefix = expandable ? h('expand-icon', { props: { expanded: this.expanded, size: this.iconSize, expandable: true }, style: { marginLeft: `${(this.depth || 0) * this.indentSize}px` }, on: { click: e => { e.stopPropagation(); this.$emit('expand', !this.expanded); } } }) : null;
      const renderer = column.cellRenderer || this.cellRenderer;
      cells.push(h('cell', {
        key: column.key,
        props: {
          column,
          style: Object.assign({}, this.cellStyles[index], {
            width: `${this.cellWidth(index, colSpan)}px`,
            height: span.rowSpan > 1 ? `${(Number(span.rowSpan) || 1) * (this.rowStyle && parseFloat(this.rowStyle.height) || 50)}px` : undefined
          }, extra.style || {}),
          prefix,
          value: cellData,
          className: extra.class,
          scope: { column, columns: this.columns, columnIndex: index, rowData: this.rowData, rowIndex: this.rowIndex, cellData, depth: this.depth || 0, style: Object.assign({}, this.cellStyles[index], extra.style || {}), isScrolling: this.isScrolling, expandIconProps: expandable ? { rowData: this.rowData, rowIndex: this.rowIndex, expanded: this.expanded, onExpand: value => this.$emit('expand', value) } : undefined },
          cellRenderer: renderer
        },
        attrs: cellAttrs,
        on: cellEvents
      }));
    });
    const rowSlot = this.$scopedSlots.default;
    const content = rowSlot ? rowSlot({
      cells,
      columns: this.columns,
      depth: this.depth || 0,
      style: this.rowStyle,
      rowData: this.rowData,
      rowIndex: this.rowIndex,
      isScrolling: this.isScrolling,
      data: this.rowData,
      key: this.rowKey
    }) : cells;
    return h('div', { class: ['el-table-v2__row', this.rowClass], style: this.rowStyle, on: this.$listeners, attrs: { role: 'row' } }, Array.isArray(content) ? content : [content]);
  }
};
