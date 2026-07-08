import ElTooltip from 'element-ui/packages/tooltip';
import { getValueByPath } from 'element-ui/src/utils/util';
import Locale from 'element-ui/src/mixins/locale';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import { getRowIdentity, orderBy } from 'element-ui/packages/table/src/util';

let tableIdSeed = 1;

const getStyleNumber = function(value) {
  const number = parseInt(value, 10);
  return isNaN(number) ? 0 : number;
};

const formatHeight = function(value) {
  if (typeof value === 'number') return value + 'px';
  if (typeof value === 'string' && /^\d+$/.test(value)) return value + 'px';
  return value;
};

const getColumnWidth = function(column) {
  return getStyleNumber(column.realWidth || column.width || column.minWidth || 80);
};

const getColumnMinWidth = function(column) {
  return getStyleNumber(column.minWidth || 80);
};

const isFlexColumn = function(column) {
  return typeof column.width !== 'number';
};

const getColumnAlignClass = function(align) {
  return align ? 'is-' + align.replace('is-', '') : '';
};

const getRowKey = function(row, rowKey, index) {
  if (!rowKey) return index;
  return getRowIdentity(row, rowKey);
};

const getDefaultCellValue = function(row, column, index) {
  const property = column.property;
  const value = property ? getValueByPath(row, property) : '';
  if (column.formatter) {
    return column.formatter(row, column, value, index);
  }
  return value;
};

export default {
  name: 'ElTableVirtual',

  components: {
    ElTooltip
  },

  mixins: [Locale],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: Boolean,
    border: Boolean,
    size: String,
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    rowKey: [String, Function],
    emptyText: String,
    tooltipEffect: {
      type: String,
      default: 'dark'
    },
    defaultSort: Object,
    rowHeight: {
      type: Number,
      default: 48
    },
    overscan: {
      type: Number,
      default: 6
    }
  },

  data() {
    return {
      tableId: 'el-table-virtual_' + tableIdSeed++,
      columns: [],
      scrollTop: 0,
      scrollLeft: 0,
      bodyHeight: 0,
      bodyWidth: 0,
      scrollbarWidth: 0,
      hasHorizontalScroll: false,
      hasVerticalScroll: false,
      start: 0,
      end: 0,
      offsetY: 0,
      resizeState: {
        width: null,
        height: null
      },
      currentRow: null,
      sortingColumn: null,
      sortProp: null,
      sortOrder: null
    };
  },

  computed: {
    tableClasses() {
      const classes = ['el-table-virtual', 'el-table'];
      if (this.border) classes.push('el-table--border', 'el-table-virtual--border');
      if (this.stripe) classes.push('el-table--striped', 'el-table-virtual--striped');
      if (this.fit) classes.push('el-table--fit');
      if (this.tableSize) classes.push('el-table--' + this.tableSize, 'el-table-virtual--' + this.tableSize);
      if (this.columns.length && this.fixedColumns.length) classes.push('el-table-virtual--has-fixed-left');
      if (this.columns.length && this.rightFixedColumns.length) classes.push('el-table-virtual--has-fixed-right');
      return classes.join(' ');
    },

    tableSize() {
      return this.size || (this.$ELEMENT || {}).size;
    },

    tableStyle() {
      const style = {};
      if (this.height) {
        style.height = formatHeight(this.height);
      } else {
        style.height = this.naturalHeight + 'px';
      }
      if (this.maxHeight) {
        style.maxHeight = formatHeight(this.maxHeight);
      }
      return style;
    },

    sortedData() {
      const data = this.data || [];
      if (!this.sortingColumn || !this.sortOrder) return data;
      return orderBy(data, this.sortProp, this.sortOrder, this.sortingColumn.sortMethod, this.sortingColumn.sortBy);
    },

    totalHeight() {
      return this.sortedData.length * this.rowHeight;
    },

    headerHeight() {
      return this.showHeader ? 48 : 0;
    },

    naturalHeight() {
      return this.headerHeight + this.totalHeight;
    },

    visibleRows() {
      return this.sortedData.slice(this.start, this.end);
    },

    fixedColumns() {
      return this.columns.filter(column => column.fixed === true || column.fixed === 'left');
    },

    rightFixedColumns() {
      return this.columns.filter(column => column.fixed === 'right');
    },

    mainWidth() {
      return this.getColumnsWidth(this.columns);
    },

    fixedLeftWidth() {
      return this.getColumnsWidth(this.fixedColumns);
    },

    fixedRightWidth() {
      return this.getColumnsWidth(this.rightFixedColumns);
    },

    scrollBodyWidth() {
      return this.mainWidth + (this.rightFixedColumns.length ? this.fixedRightWidth : 0);
    }
  },

  watch: {
    data() {
      this.updateRange();
      this.syncCurrentRowByKey();
    },

    height() {
      this.$nextTick(this.doLayout);
    },

    currentRowKey() {
      this.syncCurrentRowByKey();
    },

    columns() {
      this.$nextTick(this.doLayout);
    }
  },

  created() {
    this.hoverRow = null;
    this.hoverRowVisibleIndex = null;
    this.store = {
      commit: (name, column, index, parent) => {
        if (name === 'insertColumn') {
          this.insertColumn(column, index, parent);
        } else if (name === 'removeColumn') {
          this.removeColumn(column, parent);
        }
      },
      scheduleLayout: () => {
        this.updateColumns();
        this.$nextTick(this.doLayout);
      },
      states: {
        data: this.data
      }
    };
  },

  mounted() {
    this.scrollbarWidth = scrollbarWidth();
    this.applyDefaultSort();
    this.syncCurrentRowByKey();
    this.doLayout();
    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };
    if (this.fit) {
      addResizeListener(this.$el, this.resizeListener);
    }
  },

  beforeDestroy() {
    if (this.fit) {
      removeResizeListener(this.$el, this.resizeListener);
    }
    if (this.scrollFrame) {
      this.cancelFrame(this.scrollFrame);
      this.scrollFrame = null;
    }
    this.pendingScrollTop = null;
    this.pendingScrollLeft = null;

    const tooltip = this.$refs.tooltip;
    if (tooltip) {
      this._tooltip = tooltip;
      tooltip.setExpectedState(false);
      tooltip.handleClosePopper();
      tooltip.doDestroy();
    }
  },

  destroyed() {
    if (this._tooltip) {
      this._tooltip.referenceElm = null;
      this._tooltip.$slots.content = null;
      this._tooltip = null;
    }
    this.columns = [];
    this.hoverRow = null;
    this.hoverRowVisibleIndex = null;
    this.currentRow = null;
    this.sortingColumn = null;
    this.sortProp = null;
    this.sortOrder = null;
    if (this.store && this.store.states) {
      this.store.states.data = null;
    }
    this.store = null;
  },

  methods: {
    getFrame(callback) {
      const raf = window.requestAnimationFrame || function(fn) {
        return setTimeout(fn, 16);
      };
      return raf(callback);
    },

    cancelFrame(id) {
      const cancel = window.cancelAnimationFrame || clearTimeout;
      cancel(id);
    },

    insertColumn(column, index, parent) {
      const target = parent ? parent.children || (parent.children = []) : this.columns;
      if (typeof index === 'undefined' || index < 0 || index > target.length) {
        target.push(column);
      } else {
        target.splice(index, 0, column);
      }
      this.updateColumns();
      this.$nextTick(this.doLayout);
    },

    removeColumn(column, parent) {
      const target = parent ? parent.children : this.columns;
      if (!target) return;
      const index = target.indexOf(column);
      if (index > -1) {
        target.splice(index, 1);
      }
      this.updateColumns();
      this.$nextTick(this.doLayout);
    },

    updateColumns() {
      const columns = this.columns;
      const bodyWidth = this.bodyWidth || (this.$refs.body && this.$refs.body.clientWidth) || 0;
      const flexColumns = columns.filter(column => isFlexColumn(column));
      let bodyMinWidth = 0;

      columns.forEach(column => {
        if (isFlexColumn(column)) {
          column.realWidth = getColumnMinWidth(column);
        } else {
          column.realWidth = getStyleNumber(column.width);
        }
        bodyMinWidth += column.realWidth;
      });

      if (this.fit && flexColumns.length && bodyWidth > bodyMinWidth) {
        let totalFlexWidth = bodyWidth - bodyMinWidth;
        if (flexColumns.length === 1) {
          flexColumns[0].realWidth += totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + getColumnMinWidth(column), 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(getColumnMinWidth(column) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth += flexWidth;
          });
          flexColumns[0].realWidth += totalFlexWidth - noneFirstWidth;
        }
      }

      let left = 0;
      columns.forEach(column => {
        column.left = left;
        left += column.realWidth;
      });
    },

    getColumnsWidth(columns) {
      let width = 0;
      columns.forEach(column => {
        width += getColumnWidth(column);
      });
      return width;
    },

    doLayout() {
      const body = this.$refs.body;
      if (!body) return;
      const bodyHeight = body.clientHeight;
      const bodyWidth = body.clientWidth;
      this.bodyHeight = bodyHeight;
      this.bodyWidth = bodyWidth;
      this.hasVerticalScroll = this.totalHeight > bodyHeight;
      this.updateColumns();
      this.hasHorizontalScroll = this.scrollBodyWidth > bodyWidth;
      this.updateRange();
    },

    resizeListener() {
      const el = this.$el;
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width === this.resizeState.width && height === this.resizeState.height) return;
      this.resizeState.width = width;
      this.resizeState.height = height;
      this.doLayout();
    },

    updateRange() {
      const dataLength = this.sortedData.length;
      const visibleCount = Math.ceil((this.bodyHeight || 0) / this.rowHeight);
      const start = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - this.overscan);
      const end = Math.min(dataLength, start + visibleCount + this.overscan * 2 + 1);
      this.start = start;
      this.end = end;
      this.offsetY = start * this.rowHeight;
    },

    handleScroll(event) {
      const target = event.target;
      this.pendingScrollTop = target.scrollTop;
      this.pendingScrollLeft = target.scrollLeft;
      if (this.scrollFrame) return;
      this.scrollFrame = this.getFrame(() => {
        this.scrollFrame = null;
        this.scrollTop = this.pendingScrollTop || 0;
        this.scrollLeft = this.pendingScrollLeft || 0;
        this.updateRange();
        this.$emit('scroll', {
          scrollTop: this.scrollTop,
          scrollLeft: this.scrollLeft
        });
      });
    },

    getRowClass(row, rowIndex) {
      const classes = ['el-table-virtual__row', 'el-table__row'];
      if (this.stripe && rowIndex % 2 === 1) classes.push('el-table__row--striped');
      if (row === this.hoverRow) classes.push('hover-row');
      if (this.highlightCurrentRow && row === this.currentRow) classes.push('current-row');
      if (typeof this.rowClassName === 'string') {
        classes.push(this.rowClassName);
      } else if (typeof this.rowClassName === 'function') {
        const result = this.rowClassName({ row, rowIndex });
        if (result) classes.push(result);
      }
      return classes.join(' ');
    },

    getRowStyle(row, rowIndex) {
      const base = {
        height: this.rowHeight + 'px'
      };
      if (typeof this.rowStyle === 'function') {
        return Object.assign(base, this.rowStyle({ row, rowIndex }) || {});
      }
      return Object.assign(base, this.rowStyle || {});
    },

    getCellClass(row, column, rowIndex, columnIndex, header) {
      const classes = ['el-table-virtual__cell', 'el-table__cell'];
      const align = header ? column.headerAlign || column.align : column.align;
      const alignClass = getColumnAlignClass(align);
      if (alignClass) classes.push(alignClass);
      if (column.className && !header) classes.push(column.className);
      if (column.labelClassName && header) classes.push(column.labelClassName);
      if (column.showOverflowTooltip && !header) classes.push('el-tooltip');

      const custom = header ? this.headerCellClassName : this.cellClassName;
      if (typeof custom === 'string') {
        classes.push(custom);
      } else if (typeof custom === 'function') {
        const result = custom({ row, column, rowIndex, columnIndex });
        if (result) classes.push(result);
      }
      if (header && column.sortable) {
        classes.push('is-sortable');
        if (column.order) classes.push(column.order);
      }
      return classes.join(' ');
    },

    getCellStyle(row, column, rowIndex, columnIndex, header) {
      const style = {
        width: getColumnWidth(column) + 'px',
        height: (header ? 48 : this.rowHeight) + 'px'
      };
      const custom = header ? this.headerCellStyle : this.cellStyle;
      if (typeof custom === 'function') {
        return Object.assign(style, custom({ row, column, rowIndex, columnIndex }) || {});
      }
      return Object.assign(style, custom || {});
    },

    getHeaderRowClass() {
      const classes = ['el-table-virtual__header-row'];
      if (typeof this.headerRowClassName === 'string') {
        classes.push(this.headerRowClassName);
      } else if (typeof this.headerRowClassName === 'function') {
        const result = this.headerRowClassName({ row: this.columns, rowIndex: 0 });
        if (result) classes.push(result);
      }
      return classes.join(' ');
    },

    getHeaderRowStyle() {
      const base = { height: '48px' };
      if (typeof this.headerRowStyle === 'function') {
        return Object.assign(base, this.headerRowStyle({ row: this.columns, rowIndex: 0 }) || {});
      }
      return Object.assign(base, this.headerRowStyle || {});
    },

    getCellScope(row, column, index) {
      return {
        row,
        column,
        $index: index,
        store: this.store,
        _self: this.$parent
      };
    },

    renderCellContent(h, row, column, rowIndex) {
      const scope = this.getCellScope(row, column, rowIndex);
      if (column.renderCell) {
        return column.renderCell(h, scope);
      }
      return <div class="cell">{ getDefaultCellValue(row, column, rowIndex) }</div>;
    },

    renderHeaderContent(h, column, columnIndex) {
      const scope = {
        column,
        $index: columnIndex,
        store: this.store,
        _self: this.$parent && this.$parent.$vnode ? this.$parent.$vnode.context : this.$parent
      };
      if (column.renderHeader) {
        return column.renderHeader.call(this._renderProxy, h, scope);
      }
      return column.label;
    },

    handleCellMouseEnter(event, row, column, rowIndex) {
      const cell = event.currentTarget;
      this.$emit('cell-mouse-enter', row, column, cell, event);
      const cellChild = cell.querySelector('.cell') || cell;
      const content = cellChild.innerText || cellChild.textContent;
      const isOverflow = cellChild.scrollWidth > cellChild.clientWidth || cell.scrollWidth > cell.clientWidth;
      this.syncNativeTitle(cell, content, isOverflow);
      if (!column.showOverflowTooltip) {
        this.setHoverRow(row, cell);
        return;
      }
      this.setHoverRow(row, cell);
      if (!isOverflow) return;
      const tooltip = this.$refs.tooltip;
      if (!tooltip) return;
      tooltip.$slots.content = [tooltip.$createElement('span', content)];
      tooltip.$forceUpdate();
      tooltip.referenceElm = cell;
      tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
      tooltip.doDestroy();
      tooltip.setExpectedState(true);
      tooltip.handleShowPopper();
    },

    syncNativeTitle(cell, content, isOverflow) {
      if (isOverflow && content) {
        cell.setAttribute('title', content);
      } else {
        cell.removeAttribute('title');
      }
    },

    handleCellMouseLeave(event, row, column) {
      const tooltip = this.$refs.tooltip;
      this.clearHoverRow();
      this.$emit('cell-mouse-leave', row, column, event.currentTarget, event);
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },

    handleCellClick(event, row, column, rowIndex) {
      this.setCurrentRow(row);
      this.$emit('cell-click', row, column, event.currentTarget, event);
      this.$emit('row-click', row, column, event);
    },

    handleCellDblclick(event, row, column) {
      this.$emit('cell-dblclick', row, column, event.currentTarget, event);
      this.$emit('row-dblclick', row, column, event);
    },

    handleRowContextmenu(event, row, column) {
      this.$emit('row-contextmenu', row, column, event);
    },

    getVisibleRowIndex(cell) {
      const row = cell && cell.parentNode;
      const rows = row && row.parentNode;
      if (!row || !rows) return -1;
      for (let i = 0; i < rows.children.length; i++) {
        if (rows.children[i] === row) return i;
      }
      return -1;
    },

    syncHoverRowClass(visibleIndex, active) {
      const root = this.$el;
      if (!root) return;
      const layers = root.querySelectorAll('.el-table-virtual__rows');
      for (let i = 0; i < layers.length; i++) {
        const row = layers[i].children[visibleIndex];
        if (row) {
          row.classList[active ? 'add' : 'remove']('hover-row');
        }
      }
    },

    setHoverRow(row, cell) {
      const visibleIndex = this.getVisibleRowIndex(cell);
      if (this.hoverRowVisibleIndex === visibleIndex) return;
      if (this.hoverRowVisibleIndex !== null) {
        this.syncHoverRowClass(this.hoverRowVisibleIndex, false);
      }
      this.hoverRow = row;
      this.hoverRowVisibleIndex = visibleIndex;
      if (visibleIndex > -1) {
        this.syncHoverRowClass(visibleIndex, true);
      }
    },

    clearHoverRow() {
      if (this.hoverRowVisibleIndex !== null) {
        this.syncHoverRowClass(this.hoverRowVisibleIndex, false);
      }
      this.hoverRow = null;
      this.hoverRowVisibleIndex = null;
    },

    handleHeaderClick(event, column) {
      if (column.sortable) {
        this.toggleSort(column);
      }
      this.$emit('header-click', column, event);
    },

    handleHeaderContextmenu(event, column) {
      this.$emit('header-contextmenu', column, event);
    },

    setCurrentRow(row) {
      const oldCurrentRow = this.currentRow;
      if (row !== oldCurrentRow) {
        this.currentRow = row || null;
        this.$emit('current-change', this.currentRow, oldCurrentRow);
      }
    },

    syncCurrentRowByKey() {
      if (!this.rowKey || typeof this.currentRowKey === 'undefined') return;
      const data = this.sortedData;
      for (let i = 0; i < data.length; i++) {
        if (getRowIdentity(data[i], this.rowKey) === this.currentRowKey) {
          this.currentRow = data[i];
          return;
        }
      }
      this.currentRow = null;
    },

    applyDefaultSort() {
      if (!this.defaultSort || !this.defaultSort.prop) return;
      const column = this.columns.filter(item => item.property === this.defaultSort.prop)[0];
      if (column) {
        this.sort(column.property, this.defaultSort.order || 'ascending');
      }
    },

    toggleSort(column) {
      const orders = column.sortOrders || ['ascending', 'descending', null];
      const index = orders.indexOf(column.order);
      const nextOrder = orders[(index + 1) % orders.length];
      this.sort(column.property, nextOrder);
    },

    sort(prop, order) {
      const column = this.columns.filter(item => item.property === prop)[0];
      if (!column) return;
      this.columns.forEach(item => {
        if (item !== column) item.order = null;
      });
      column.order = order;
      this.sortingColumn = order ? column : null;
      this.sortProp = order ? prop : null;
      this.sortOrder = order || null;
      this.updateRange();
      this.$emit('sort-change', {
        column,
        prop,
        order
      });
    },

    clearSort() {
      if (!this.sortingColumn) return;
      const column = this.sortingColumn;
      column.order = null;
      this.sortingColumn = null;
      this.sortProp = null;
      this.sortOrder = null;
      this.updateRange();
      this.$emit('sort-change', {
        column,
        prop: null,
        order: null
      });
    },

    scrollTo(scrollTop) {
      const body = this.$refs.body;
      if (body) {
        body.scrollTop = scrollTop;
        this.scrollTop = scrollTop;
        this.updateRange();
      }
    },

    renderHeaderLayer(h, columns, fixed) {
      if (!this.showHeader || !columns.length) return null;
      const style = fixed
        ? { width: this.getColumnsWidth(columns) + 'px' }
        : {
          width: this.mainWidth + 'px',
          transform: 'translateX(' + (-this.scrollLeft) + 'px)'
        };
      return (
        <div class="el-table-virtual__header-layer" style={style}>
          <div class={this.getHeaderRowClass()} style={this.getHeaderRowStyle()}>
            { columns.map((column, columnIndex) => (
              <div
                class={this.getCellClass(null, column, 0, columnIndex, true)}
                style={this.getCellStyle(null, column, 0, columnIndex, true)}
                on-click={event => this.handleHeaderClick(event, column)}
                on-contextmenu={event => this.handleHeaderContextmenu(event, column)}>
                <div class="cell">
                  { this.renderHeaderContent(h, column, columnIndex) }
                  { column.sortable ? <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span> : null }
                </div>
              </div>
            )) }
          </div>
        </div>
      );
    },

    renderRowsLayer(h, columns, fixed) {
      const style = fixed
        ? {
          width: this.getColumnsWidth(columns) + 'px',
          transform: 'translateY(' + (this.offsetY - this.scrollTop) + 'px)'
        }
        : {
          width: this.mainWidth + 'px',
          transform: 'translate3d(0,' + this.offsetY + 'px,0)'
        };
      return (
        <div class="el-table-virtual__rows" style={style}>
          { this.visibleRows.map((row, index) => {
            const rowIndex = this.start + index;
            return (
              <div
                class={this.getRowClass(row, rowIndex)}
                style={this.getRowStyle(row, rowIndex)}
                key={getRowKey(row, this.rowKey, rowIndex)}
                on-contextmenu={event => this.handleRowContextmenu(event, row, null)}>
                { columns.map((column, columnIndex) => (
                  <div
                    class={this.getCellClass(row, column, rowIndex, columnIndex, false)}
                    style={this.getCellStyle(row, column, rowIndex, columnIndex, false)}
                    on-mouseenter={event => this.handleCellMouseEnter(event, row, column, rowIndex)}
                    on-mouseleave={event => this.handleCellMouseLeave(event, row, column)}
                    on-click={event => this.handleCellClick(event, row, column, rowIndex)}
                    on-dblclick={event => this.handleCellDblclick(event, row, column)}>
                    { this.renderCellContent(h, row, column, rowIndex) }
                  </div>
                )) }
              </div>
            );
          }) }
        </div>
      );
    },

    renderEmpty(h) {
      if (this.sortedData.length) return null;
      return (
        <div class="el-table__empty-block el-table-virtual__empty" style={{ height: this.bodyHeight + 'px' }}>
          <span class="el-table__empty-text">
            { this.$slots.empty || this.emptyText || this.t('el.table.emptyText') }
          </span>
        </div>
      );
    }
  },

  render(h) {
    const hiddenColumns = <div ref="hiddenColumns" class="hidden-columns">{ this.$slots.default }</div>;
    const headerHeight = this.showHeader ? 48 : 0;
    const bodyStyle = {
      top: this.headerHeight + 'px'
    };
    const fixedRightStyle = {
      right: (this.hasVerticalScroll ? this.scrollbarWidth : 0) + 'px',
      width: this.fixedRightWidth + 'px'
    };
    const fixedRightGutterWidth = this.rightFixedColumns.length && this.hasVerticalScroll ? this.scrollbarWidth : 0;
    const phantomStyle = {
      height: this.totalHeight + 'px',
      width: this.scrollBodyWidth + 'px'
    };

    return (
      <div class={this.tableClasses} style={this.tableStyle}>
        { hiddenColumns }
        <el-tooltip ref="tooltip" effect={this.tooltipEffect} placement="top" content=""></el-tooltip>
        { this.showHeader ? (
          <div class="el-table-virtual__header-wrapper" style={{ height: headerHeight + 'px' }}>
            <div class="el-table-virtual__header-main">
              { this.renderHeaderLayer(h, this.columns, false) }
            </div>
            { this.fixedColumns.length ? <div class="el-table-virtual__fixed-header el-table-virtual__fixed-left" style={{ width: this.fixedLeftWidth + 'px' }}>{ this.renderHeaderLayer(h, this.fixedColumns, true) }</div> : null }
            { this.rightFixedColumns.length ? <div class="el-table-virtual__fixed-header el-table-virtual__fixed-right" style={fixedRightStyle}>{ this.renderHeaderLayer(h, this.rightFixedColumns, true) }</div> : null }
            { fixedRightGutterWidth ? <div class="el-table-virtual__fixed-right-gutter" style={{ width: fixedRightGutterWidth + 'px' }}></div> : null }
          </div>
        ) : null }
        <div ref="body" class="el-table-virtual__body-wrapper" style={bodyStyle} on-scroll={this.handleScroll}>
          <div class="el-table-virtual__phantom" style={phantomStyle}></div>
          { this.renderRowsLayer(h, this.columns, false) }
          { this.renderEmpty(h) }
          { this.$slots.append ? <div class="el-table__append-wrapper el-table-virtual__append" style={{ width: this.scrollBodyWidth + 'px' }}>{ this.$slots.append }</div> : null }
        </div>
        { this.fixedColumns.length ? <div class="el-table-virtual__fixed-body el-table-virtual__fixed-left" style={{ top: this.headerHeight + 'px', bottom: (this.hasHorizontalScroll ? this.scrollbarWidth : 0) + 'px', width: this.fixedLeftWidth + 'px' }}>{ this.renderRowsLayer(h, this.fixedColumns, true) }</div> : null }
        { this.rightFixedColumns.length ? <div class="el-table-virtual__fixed-body el-table-virtual__fixed-right" style={Object.assign({ top: this.headerHeight + 'px', bottom: (this.hasHorizontalScroll ? this.scrollbarWidth : 0) + 'px' }, fixedRightStyle)}>{ this.renderRowsLayer(h, this.rightFixedColumns, true) }</div> : null }
      </div>
    );
  }
};
