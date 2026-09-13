import HeaderCell from './header-cell';
import { columnWidth } from '../common';

export default {
  name: 'TableV2HeaderRow',
  components: { HeaderCell },
  props: { columns: Array, styles: Array, headerIndex: Number, sortBy: Object, sortState: Object, headerCellProps: [Object, Function], headerSlot: Function, headerClass: [String, Function], rowHeight: Number, level: Number, tableFixed: Boolean, fixedColumn: Boolean },
  methods: {
    leafCount(column) {
      return column.children && column.children.length ? column.children.reduce((count, child) => count + this.leafCount(child), 0) : 1;
    },
    widthOf(column) {
      return column.children && column.children.length ? column.children.reduce((width, child) => width + this.widthOf(child), 0) : columnWidth(column);
    },
    groupCellStyle(column, width, height) {
      const style = {
        flexGrow: this.tableFixed ? 0 : (column.flexGrow || 0),
        flexShrink: this.tableFixed ? 0 : (column.flexShrink == null ? 1 : column.flexShrink),
        flexBasis: 'auto',
        width: `${width}px`,
        height: `${height}px`
      };
      if (!this.fixedColumn) {
        if (column.maxWidth) style.maxWidth = `${column.maxWidth}px`;
        if (column.minWidth) style.minWidth = `${column.minWidth}px`;
      }
      return style;
    },
    renderLevel(h, columns, level) {
      const rowHeight = this.rowHeight || 50;
      const cells = [];
      columns.forEach(column => {
        const hasChildren = column.children && column.children.length;
        const cellHeight = hasChildren ? rowHeight : rowHeight * (this.maxLevel - level + 1);
        cells.push(h('header-cell', {
          key: `${column.key}-${level}`,
          props: { column, columnIndex: 0, headerIndex: level, sortBy: this.sortBy, sortState: this.sortState, cellProps: this.headerCellProps },
          style: this.groupCellStyle(column, this.widthOf(column), cellHeight),
          scopedSlots: { default: scope => this.$scopedSlots.default ? this.$scopedSlots.default(scope) : undefined },
          on: { sort: value => this.$emit('sort', value) }
        }));
      });
      return h('div', {
        class: ['el-table-v2__header-row', this.tableFixed ? 'is-fixed-layout' : ''],
        style: { height: `${rowHeight}px` }
      }, cells);
    },
    maxDepth(columns) {
      return columns.reduce((depth, column) => Math.max(depth, column.children && column.children.length ? this.maxDepth(column.children) + 1 : 1), 1);
    },
    renderFlat(h) {
      const cells = this.columns.map((column, index) => h('header-cell', {
        key: column.key,
        props: { column, columnIndex: index, headerIndex: this.headerIndex, sortBy: this.sortBy, sortState: this.sortState, cellProps: this.headerCellProps },
        scopedSlots: { default: scope => this.$scopedSlots.default ? this.$scopedSlots.default(scope) : undefined },
        style: this.styles[index],
        on: { sort: column => this.$emit('sort', column) }
      }));
      const content = this.headerSlot ? this.headerSlot({ cells, columns: this.columns, headerIndex: this.headerIndex }) : cells;
      const headerClass = typeof this.headerClass === 'function' ? this.headerClass({ columns: this.columns, headerIndex: this.headerIndex }) : this.headerClass;
      return h('div', {
        class: ['el-table-v2__header-row', headerClass, this.tableFixed ? 'is-fixed-layout' : ''],
        style: { height: `${this.rowHeight || (this.styles && this.styles[0] ? this.styles[0].height : 50)}px` }
      }, Array.isArray(content) ? content : [content]);
    }
  },
  computed: {
    maxLevel() { return this.maxDepth(this.columns); }
  },
  render(h) {
    if (!this.columns.some(column => column.children && column.children.length)) return this.renderFlat(h);
    const rows = [];
    const renderRows = (columns, level) => {
      rows.push(this.renderLevel(h, columns, level));
      const children = columns.reduce((result, column) => result.concat(column.children || []), []);
      if (children.length) renderRows(children, level + 1);
    };
    renderRows(this.columns, 0);
    return h('div', { class: 'el-table-v2__header-rows' }, rows);
  }
};
