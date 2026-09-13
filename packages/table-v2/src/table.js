import { tableV2Props } from './defaults';
import { call, getByPath, normalizeStyle } from './common';
import useColumns from './composables/use-columns';
import useData from './composables/use-data';
import useStyles from './composables/use-styles';
import useScrollbar from './composables/use-scrollbar';
import TableGrid from './table-grid';
import Header from './components/header';
import Empty from 'element-ui/packages/empty';

let tableId = 0;

export default {
  name: 'ElTableV2',
  inheritAttrs: false,
  components: { TableGrid, Header, Empty },
  mixins: [useColumns, useData, useStyles, useScrollbar],
  props: tableV2Props,
  data() {
    return { tableId: `el-table-v2_${++tableId}`, scrollTop: 0, scrollLeft: 0, hoverRowKey: null };
  },
  computed: {
    headerStyle() { return { height: `${this.resolvedHeaderHeight}px` }; },
    mainRows() { return this.flatData; },
    fixedRows() { return (this.fixedData || []).map((row, index) => ({ row, key: this.rowKeyOf(row, -index - 1), depth: 0 })); },
    tableClass() {
      const vnodeData = this.$vnode && this.$vnode.data || {};
      return ['el-table-v2', 'el-table-v2__root', this.className, vnodeData.class, this.dynamicRows ? 'is-dynamic' : '', this.leftColumns.length ? 'has-fixed-left' : '', this.rightColumns.length ? 'has-fixed-right' : ''];
    }
  },
  methods: {
    getRowProps(row, rowIndex) { return call(this.rowProps, { columns: this.normalizedColumns, rowData: row, rowIndex }, {}); },
    getRowClass(row, rowIndex) { const key = this.rowKeyOf(row, rowIndex); return [call(this.rowClass, { columns: this.normalizedColumns, rowData: row, rowIndex }, ''), this.hoverRowKey === key ? 'hover-row' : '']; },
    getRowStyle(row, rowIndex, virtualStyle) { return Object.assign({}, virtualStyle || {}, this.getRowProps(row, rowIndex).style || {}, this.dynamicRows ? {} : { height: `${this.rowHeight}px` }); },
    getRowEventHandlers(row, rowIndex) {
      const handlers = this.rowEventHandlers || {};
      const key = this.rowKeyOf(row, rowIndex);
      return Object.keys(handlers).reduce((result, name) => {
        const eventName = name.replace(/^on/, '').toLowerCase();
        result[eventName] = event => handlers[name]({ rowKey: key, rowData: row, rowIndex, event });
        return result;
      }, {});
    },
    handleRowHover(hovered, row, rowIndex, event) {
      this.hoverRowKey = hovered ? this.rowKeyOf(row, rowIndex) : null;
      this.$emit('row-hover', { hovered, rowKey: this.hoverRowKey, rowData: row, rowIndex, event });
    },
    getCellValue(column, row, rowIndex, columnIndex) {
      if (typeof this.dataGetter === 'function') return this.dataGetter({ columns: this.normalizedColumns, column, columnIndex, rowData: row, rowIndex });
      return getByPath(row, column.dataKey);
    },
    columnStyle(column, fixedColumn) {
      const flex = {
        flexGrow: 0,
        flexShrink: 0
      };
      if (!this.fixed) {
        flex.flexGrow = column.flexGrow || 0;
        flex.flexShrink = column.flexShrink == null ? 1 : column.flexShrink;
      }
      const style = Object.assign({}, column.style || {}, flex, {
        flexBasis: 'auto',
        width: `${Number(column.width || column.minWidth || 0)}px`
      });
      if (style.height == null) style.height = '';
      if (!fixedColumn) {
        if (column.maxWidth) style.maxWidth = `${column.maxWidth}px`;
        else if (style.maxWidth == null) style.maxWidth = '';
        if (column.minWidth) style.minWidth = `${column.minWidth}px`;
        else if (style.minWidth == null) style.minWidth = '';
      }
      return style;
    },
    cellStyle(column, fixedColumn) { return this.columnStyle(column, fixedColumn); },
    headerCellStyle(column, fixedColumn) { return this.columnStyle(column, fixedColumn); },
    cellRenderer(scope) {
      const slot = this.$scopedSlots.cell;
      return slot ? slot(scope) : null;
    },
    handleGridScroll(payload, fixed) {
      if (!payload) return;
      if (fixed) {
        if (payload.scrollTop !== this.scrollTop) this.scrollToTop(payload.scrollTop);
        return;
      }
      this.scrollLeft = payload.scrollLeft;
      this.scrollTop = payload.scrollTop;
      // The main grid has already applied the native scroll position. Do not
      // scroll it again with the payload: during a vertical scroll that
      // payload can contain a stale horizontal offset and move the horizontal
      // scrollbar. Only fixed grids need to follow the main grid vertically.
      if (payload.scrollTop != null) {
        const left = this.$refs.leftGrid;
        const right = this.$refs.rightGrid;
        if (left) left.scrollToTop(payload.scrollTop);
        if (right) right.scrollToTop(payload.scrollTop);
      }
      this.$emit('scroll', { scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, xAxisScrollDir: payload.xAxisScrollDir || 'forward', yAxisScrollDir: payload.yAxisScrollDir || 'forward' });
    },
    nextSortOrder(column) {
      const current = this.sortBy && this.sortBy.key === column.key
        ? this.sortBy.order
        : this.sortState && this.sortState[column.key];
      return current === 'asc' ? 'desc' : 'asc';
    },
    renderHeaderArea(h, columns, fixed) {
      const isFixed = !!fixed;
      const header = this.$scopedSlots.header;
      return h(Header, {
        props: {
          columns,
          columnStyles: columns.map(column => this.headerCellStyle(column, isFixed)),
          height: this.headerHeight,
          headerClass: this.headerClass,
          headerProps: this.headerProps,
          headerCellProps: this.headerCellProps,
          sortBy: this.sortBy,
          sortState: this.sortState,
          tableFixed: this.fixed,
          // Each header area gets its own slot invocation. The columns passed
          // here belong only to this area (main, left, or right).
          headerSlot: header
            ? props => header(Object.assign({}, props, { columns }))
            : undefined,
          scrollLeft: isFixed ? 0 : this.scrollLeft,
          fixed,
          width: isFixed ? (fixed === 'left' ? this.leftWidth : this.rightWidth) : this.mainAreaWidth,
          // The main header already contains left and right placeholder
          // columns, so it must share the table's origin with the main body.
          // Fixed headers are independently positioned at their own edges.
          offset: 0
        },
        scopedSlots: { 'header-cell': this.$scopedSlots['header-cell'] },
        on: { sort: column => this.$emit('column-sort', { column, key: column.key, order: this.nextSortOrder(column) }) }
      });
    },
    renderArea(h, ref, columns, width, fixed) {
      const style = { width: `${width}px`, height: `${this.tableBodyHeight}px` };
      if (!fixed) {
        style.left = '0px';
        // __area has right: 0 in the shared stylesheet. The main area has an
        // explicit width, so keeping right: 0 would stretch it underneath the
        // right fixed grid and place its scrollbar at the table edge.
        style.right = 'auto';
      }
      const regionClass = fixed ? `el-table-v2__${fixed}` : 'el-table-v2__main';
      return h(TableGrid, { ref, class: ['el-table-v2__area', regionClass, fixed ? `el-table-v2__fixed-${fixed}` : ''], style, props: { table: this, columns, width, height: this.tableBodyHeight, fixed, data: this.mainRows, fixedData: this.fixedRows }, on: { scroll: value => this.handleGridScroll(value, fixed), 'rows-rendered': value => this.$emit('rows-rendered', value), 'end-reached': value => this.$emit('end-reached', value) }, scopedSlots: { row: this.$scopedSlots.row } });
    }
  },
  render(h) {
    const body = [];
    const empty = this.$scopedSlots.empty ? this.$scopedSlots.empty() : this.$slots.empty;
    const footer = this.$scopedSlots.footer ? this.$scopedSlots.footer() : this.$slots.footer;
    const overlay = this.$scopedSlots.overlay ? this.$scopedSlots.overlay() : this.$slots.overlay;
    if (this.mainRows.length) body.push(this.renderArea(h, 'mainGrid', this.mainColumns, this.mainAreaWidth, null));
    else body.push(h('div', { class: 'el-table-v2__empty' }, empty && empty.length ? empty : [h(Empty)]));
    if (this.leftColumns.length) body.push(this.renderArea(h, 'leftGrid', this.leftColumns, this.leftWidth, 'left'));
    if (this.rightColumns.length) body.push(this.renderArea(h, 'rightGrid', this.rightColumns, this.rightWidth, 'right'));
    const vnodeData = this.$vnode && this.$vnode.data || {};
    return h('div', { class: this.tableClass, style: Object.assign({ width: `${this.width}px`, height: `${this.height}px` }, normalizeStyle(vnodeData.style)), attrs: { role: 'grid' } }, [
      h('div', { class: 'el-table-v2__header-wrapper', style: this.headerStyle }, [
        this.renderHeaderArea(h, this.mainHeaderColumns),
        this.leftColumns.length ? this.renderHeaderArea(h, this.leftColumns, 'left') : null,
        this.rightColumns.length ? this.renderHeaderArea(h, this.rightColumns, 'right') : null
      ]),
      h('div', { class: 'el-table-v2__body-wrapper', style: { top: `${this.resolvedHeaderHeight}px`, bottom: `${this.footerHeight}px` } }, body),
      this.footerHeight ? h('div', { class: 'el-table-v2__footer', style: { height: `${this.footerHeight}px` } }, footer || []) : null,
      overlay ? h('div', { class: 'el-table-v2__overlay' }, overlay) : null
    ]);
  }
};
