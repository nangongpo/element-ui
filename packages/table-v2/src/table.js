import ElTooltip from 'element-ui/packages/tooltip';
import ElCheckbox from 'element-ui/packages/checkbox';
import Locale from 'element-ui/src/mixins/locale';
import domScheduler from 'element-ui/src/utils/dom-scheduler';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import { cancelFrame, requestFrame } from 'element-ui/src/utils/util';
import { orderBy } from 'element-ui/packages/table/src/util';
import { getDefaultCellValue } from './config';
import TableV2Body from './table-body';
import TableV2Header from './table-header';
import TableLayout from './table-layout';
import createStore from './store';
import Current from './store/current';
import Filter from './store/filter';
import Selection from './store/selection';
import Sort from './store/sort';
import {
  assertArray,
  formatHeight,
  getColumnAlignClass,
  getColumnWidth,
  getRowKey
} from './util';

let tableIdSeed = 1;

export default {
  name: 'ElTableV2',

  components: {
    ElCheckbox,
    ElTooltip,
    TableV2Body,
    TableV2Header
  },

  mixins: [Locale, TableLayout, Current, Filter, Selection, Sort],

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
      tableId: 'el-table-v2_' + tableIdSeed++,
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
      sortOrder: null,
      isAllSelected: false,
      activeFilters: {},
      useInternalData: false,
      dataVersion: 0,
      internalDataVersion: 0,
      filterVersion: 0,
      sortVersion: 0,
      viewVersion: 0,
      viewLength: 0
    };
  },

  computed: {
    tableData() {
      if (this.useInternalData) {
        return this.getInternalData(this.internalDataVersion);
      }
      return assertArray(this.data, 'data');
    },

    tableColumns() {
      return assertArray(this.columns, 'columns');
    },

    tableSelection() {
      return assertArray(this.selection, 'selection');
    },

    tableClasses() {
      const classes = ['el-table-v2', 'el-table'];
      if (this.border) classes.push('el-table--border');
      if (this.stripe) classes.push('el-table--striped');
      if (this.fit) classes.push('el-table--fit');
      if (this.hasHorizontalScroll) classes.push('el-table--scrollable-x');
      if (this.hasVerticalScroll) classes.push('el-table--scrollable-y');
      if (this.tableSize) classes.push('el-table--' + this.tableSize);
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
        style.height = this.naturalHeight + (this.hasHorizontalScroll ? this.scrollbarWidth : 0) + 'px';
      }
      if (this.maxHeight) {
        style.maxHeight = formatHeight(this.maxHeight);
      }
      return style;
    },

    filteredData() {
      return this.getFilteredData(this.dataVersion, this.internalDataVersion, this.filterVersion);
    },

    sortedData() {
      return this.getViewData();
    },

    totalHeight() {
      return this.viewLength * this.rowHeight;
    },

    headerHeight() {
      return this.showHeader ? this.rowHeight : 0;
    },

    naturalHeight() {
      return this.headerHeight + this.totalHeight;
    },

    isAutoHeight() {
      return !this.height && !this.maxHeight;
    },

    visibleRows() {
      return this.getVisibleRows();
    },

    fixedColumns() {
      return this.tableColumns.filter(column => column.fixed === true || column.fixed === 'left');
    },

    rightFixedColumns() {
      return this.tableColumns.filter(column => column.fixed === 'right');
    },

    mainWidth() {
      return this.getColumnsWidth(this.tableColumns);
    }
  },

  watch: {
    data() {
      if (!this.useInternalData) {
        this.dataVersion++;
        this.refreshViewData();
      }
      this.syncSelection();
      this.updateAllSelected();
      this.updateRange();
      this.syncCurrentRowByKey();
      this.scheduleLayout();
    },

    height() {
      this.scheduleLayout();
    },

    maxHeight() {
      this.scheduleLayout();
    },

    rowHeight() {
      this.scheduleLayout();
    },

    currentRowKey() {
      this.syncCurrentRowByKey();
    },

    columns() {
      this.filterVersion++;
      this.sortVersion++;
      this.refreshViewData();
      this.syncStoreStates();
      this.scheduleLayout();
    }
  },

  created() {
    this.hoverRow = null;
    this.hoverRowVisibleIndex = null;
    this.lastMouseClientX = null;
    this.lastMouseClientY = null;
    this.filterPanels = {};
    this.internalData = [];
    this.filteredDataCache = [];
    this.filteredDataCacheKey = null;
    this.sortedDataCache = [];
    this.sortedDataCacheKey = null;
    this.viewData = [];
    this.viewDataCacheKey = null;
    this.selection = [];
    this.selectionMapCache = {};
    this.allSelectionMode = false;
    this.excludedSelectionMap = {};
    this.selectionCount = 0;
    this.layoutPending = false;
    this.layoutForce = false;
    this.filterFrame = null;
    this.hoverScrollTimer = null;
    this.hoverScrolling = false;
    this.hoverScrollEndDelay = 120;
    this.fixedScrollFrame = null;
    this.fixedScrollTimer = null;
    this.fixedScrollEndDelay = 80;
    this.fixedRowsTransform = '';
    this.store = createStore(this);
  },

  mounted() {
    this.scrollbarWidth = scrollbarWidth();
    this.bodyWrapper = this.$refs.body;
    this.applyDefaultSort();
    this.refreshViewData();
    this.syncCurrentRowByKey();
    const layoutMetrics = this.readLayoutMetrics();
    this.doLayout(layoutMetrics);
    this.resizeState = {
      width: layoutMetrics ? layoutMetrics.width : null,
      height: layoutMetrics ? layoutMetrics.height : null
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
      cancelFrame(this.scrollFrame);
      this.scrollFrame = null;
    }
    domScheduler.deregister(this);
    if (this.filterFrame) {
      cancelFrame(this.filterFrame);
      this.filterFrame = null;
    }
    if (this.hoverScrollTimer) {
      clearTimeout(this.hoverScrollTimer);
      this.hoverScrollTimer = null;
    }
    this.stopFixedScrollSync();
    this.filterTaskToken = null;
    this.hoverScrolling = false;
    this.layoutPending = false;
    this.layoutForce = false;
    this.fixedRowsTransform = '';
    this.destroyFilterPanels();
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
    this.lastMouseClientX = null;
    this.lastMouseClientY = null;
    this.hoverScrollTimer = null;
    this.hoverScrolling = false;
    this.fixedScrollFrame = null;
    this.fixedScrollTimer = null;
    this.fixedRowsTransform = '';
    this.currentRow = null;
    this.sortingColumn = null;
    this.sortProp = null;
    this.sortOrder = null;
    this.selection = [];
    this.selectionMapCache = {};
    this.allSelectionMode = false;
    this.excludedSelectionMap = {};
    this.selectionCount = 0;
    this.isAllSelected = false;
    this.internalData = [];
    this.filteredDataCache = [];
    this.filteredDataCacheKey = null;
    this.sortedDataCache = [];
    this.sortedDataCacheKey = null;
    this.viewData = [];
    this.viewDataCacheKey = null;
    this.viewLength = 0;
    this.useInternalData = false;
    if (this.store && this.store.states) {
      this.store.states.data = null;
      this.store.states.selection = null;
    }
    this.store = null;
    this.bodyWrapper = null;
  },

  methods: {
    scheduleLayout(resizeOnly = false) {
      if (!resizeOnly) {
        this.layoutForce = true;
      }
      if (this.layoutPending) return;
      this.layoutPending = true;
      this.$nextTick(() => {
        if (!this.layoutPending) return;
        domScheduler.register({
          vm: this,
          read: this.readLayoutMetrics,
          write: this.applyScheduledLayout
        });
      });
    },

    applyScheduledLayout(metrics) {
      this.layoutPending = false;
      const force = this.layoutForce;
      this.layoutForce = false;
      if (!metrics) return;

      const widthChanged = metrics.width !== this.resizeState.width;
      const heightChanged = metrics.height !== this.resizeState.height;
      this.resizeState.width = metrics.width;
      this.resizeState.height = metrics.height;
      if (!force && !widthChanged && (!heightChanged || this.isAutoHeight)) return;
      this.doLayout(metrics);
    },

    insertColumn(column, index, parent) {
      const target = parent
        ? (typeof parent.children === 'undefined' ? (parent.children = []) : assertArray(parent.children, 'column.children'))
        : this.tableColumns;
      if (typeof index === 'undefined' || index < 0 || index > target.length) {
        target.push(column);
      } else {
        target.splice(index, 0, column);
      }
      this.syncColumnFilter(column);
      this.syncStoreStates();
      this.updateColumns();
      this.scheduleLayout();
    },

    removeColumn(column, parent) {
      const target = parent ? parent.children : this.tableColumns;
      if (typeof target === 'undefined') return;
      assertArray(target, parent ? 'column.children' : 'columns');
      const index = target.indexOf(column);
      if (index > -1) {
        target.splice(index, 1);
      }
      this.syncStoreStates();
      this.updateColumns();
      this.scheduleLayout();
    },

    syncStoreStates() {
      if (!this.store || !this.store.states) return;
      this.store.states.data = this.getViewData();
      this.store.states.selection = this.getSelection ? this.getSelection() : this.tableSelection;
    },

    getFilterCacheKey(dataVersion, internalDataVersion, filterVersion) {
      return [
        this.useInternalData ? 'internal' : 'props',
        dataVersion,
        internalDataVersion,
        filterVersion,
        this.tableColumns.length
      ].join('|');
    },

    getSortCacheKey(dataVersion, internalDataVersion, filterVersion, sortVersion) {
      return [
        this.getFilterCacheKey(dataVersion, internalDataVersion, filterVersion),
        sortVersion,
        this.sortProp || '',
        this.sortOrder || ''
      ].join('|');
    },

    hasActiveFilters() {
      const filters = this.activeFilters || {};
      const keys = Object.keys(filters);
      for (let i = 0; i < keys.length; i++) {
        const values = filters[keys[i]];
        if (Array.isArray(values) && values.length) return true;
      }
      return false;
    },

    hasActiveSort() {
      return !!(this.sortingColumn && this.sortOrder && this.sortingColumn.sortable !== 'custom');
    },

    shouldAsyncFilter(data, filteredColumns) {
      return data.length > 50000 && filteredColumns.length > 0;
    },

    getViewCacheKey() {
      return this.getSortCacheKey(this.dataVersion, this.internalDataVersion, this.filterVersion, this.sortVersion);
    },

    getFilteredData(dataVersion, internalDataVersion, filterVersion) {
      const key = this.getFilterCacheKey(dataVersion, internalDataVersion, filterVersion);
      if (this.filteredDataCacheKey === key) return this.filteredDataCache;

      const data = this.tableData;
      const columns = this.tableColumns;
      const filteredColumns = columns.filter(column => this.getFilterValues(column).length);
      if (!filteredColumns.length) {
        this.filteredDataCache = data;
        this.filteredDataCacheKey = key;
        return data;
      }

      const result = [];
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const row = data[rowIndex];
        let rowMatched = true;
        for (let i = 0; i < filteredColumns.length; i++) {
          const column = filteredColumns[i];
          const values = this.getFilterValues(column);
          if (!values.length || typeof column.filterMethod !== 'function') continue;
          let matched = false;
          for (let j = 0; j < values.length; j++) {
            if (column.filterMethod.call(null, values[j], row, column)) {
              matched = true;
              break;
            }
          }
          if (!matched) {
            rowMatched = false;
            break;
          }
        }
        if (rowMatched) result.push(row);
      }
      this.filteredDataCache = result;
      this.filteredDataCacheKey = key;
      return result;
    },

    getFilteredColumns() {
      const columns = this.tableColumns;
      return columns.filter(column => this.getFilterValues(column).length);
    },

    rowPassesFilters(row, filteredColumns) {
      for (let i = 0; i < filteredColumns.length; i++) {
        const column = filteredColumns[i];
        const values = this.getFilterValues(column);
        if (!values.length || typeof column.filterMethod !== 'function') continue;
        let matched = false;
        for (let j = 0; j < values.length; j++) {
          if (column.filterMethod.call(null, values[j], row, column)) {
            matched = true;
            break;
          }
        }
        if (!matched) return false;
      }
      return true;
    },

    getSortedData(dataVersion, internalDataVersion, filterVersion, sortVersion) {
      const key = this.getSortCacheKey(dataVersion, internalDataVersion, filterVersion, sortVersion);
      if (this.sortedDataCacheKey === key) return this.sortedDataCache;

      const data = this.filteredData;
      if (!this.sortingColumn || !this.sortOrder || this.sortingColumn.sortable === 'custom') {
        this.sortedDataCache = data;
        this.sortedDataCacheKey = key;
        return data;
      }

      const result = this.getOrderedData(data);
      this.sortedDataCache = result;
      this.sortedDataCacheKey = key;
      return result;
    },

    getOrderedData(data) {
      const column = this.sortingColumn;
      if (column.sortMethod || column.sortBy) {
        return orderBy(data, this.sortProp, this.sortOrder, column.sortMethod, column.sortBy);
      }
      const prop = this.sortProp;
      const reverse = this.sortOrder === 'descending' ? -1 : 1;
      const result = data.slice();
      result.sort((a, b) => {
        const valueA = this.getSortValue(a, prop);
        const valueB = this.getSortValue(b, prop);
        if (valueA < valueB) return -1 * reverse;
        if (valueA > valueB) return 1 * reverse;
        return 0;
      });
      return result;
    },

    getSortValue(row, prop) {
      if (!row || !prop) return row;
      if (prop.indexOf('.') === -1) return row[prop];
      const path = prop.split('.');
      let value = row;
      for (let i = 0; i < path.length && value != null; i++) {
        value = value[path[i]];
      }
      return value;
    },

    getViewData() {
      const key = this.getViewCacheKey();
      if (this.viewDataCacheKey === key) return this.viewData;
      return this.refreshViewData();
    },

    refreshViewData() {
      const key = this.getViewCacheKey();
      const data = this.getSortedData(this.dataVersion, this.internalDataVersion, this.filterVersion, this.sortVersion);
      this.viewData = data;
      this.viewDataCacheKey = key;
      this.viewLength = data.length;
      this.viewVersion++;
      return data;
    },

    refreshViewDataAsync(done) {
      const key = this.getViewCacheKey();
      const data = this.tableData;
      const filteredColumns = this.getFilteredColumns();
      if (!this.shouldAsyncFilter(data, filteredColumns)) {
        const result = this.refreshViewData();
        if (done) done(result);
        return;
      }

      const token = {};
      if (this.filterFrame) {
        cancelFrame(this.filterFrame);
        this.filterFrame = null;
      }
      this.filterTaskToken = token;
      const result = [];
      let index = 0;
      const chunkSize = 5000;
      const next = () => {
        if (this.filterTaskToken !== token) return;
        const end = Math.min(index + chunkSize, data.length);
        for (; index < end; index++) {
          const row = data[index];
          if (this.rowPassesFilters(row, filteredColumns)) {
            result.push(row);
          }
        }
        if (index < data.length) {
          const frame = requestFrame(() => {
            if (this.filterFrame === frame) {
              this.filterFrame = null;
            }
            next();
          });
          this.filterFrame = frame;
          return;
        }

        this.filterFrame = null;
        this.filteredDataCache = result;
        this.filteredDataCacheKey = this.getFilterCacheKey(this.dataVersion, this.internalDataVersion, this.filterVersion);
        this.sortedDataCache = null;
        this.sortedDataCacheKey = null;
        this.viewData = this.getSortedData(this.dataVersion, this.internalDataVersion, this.filterVersion, this.sortVersion);
        this.viewDataCacheKey = key;
        this.viewLength = this.viewData.length;
        this.viewVersion++;
        this.syncStoreStates();
        this.updateRange();
        this.updateAllSelected();
        this.$forceUpdate();
        if (done) done(this.viewData);
      };
      next();
    },

    getVisibleRows() {
      const data = this.getViewData();
      return data.slice(this.start, this.end);
    },

    getViewRow(index) {
      const data = this.getViewData();
      return data[index];
    },

    getInternalData(version) {
      if (version < 0) return [];
      return assertArray(this.internalData, 'reloadData.data');
    },

    reloadData(data) {
      this.internalData = assertArray(data, 'reloadData.data');
      this.useInternalData = true;
      this.dataVersion++;
      this.internalDataVersion++;
      this.filteredDataCache = [];
      this.filteredDataCacheKey = null;
      this.sortedDataCache = [];
      this.sortedDataCacheKey = null;
      this.viewData = this.hasActiveFilters() || this.hasActiveSort()
        ? this.getSortedData(this.dataVersion, this.internalDataVersion, this.filterVersion, this.sortVersion)
        : this.internalData;
      this.viewDataCacheKey = this.getViewCacheKey();
      this.viewLength = this.viewData.length;
      this.viewVersion++;
      this.syncStoreStates();
      this.scrollTop = 0;
      this.scrollLeft = 0;
      if (this.$refs.body) {
        this.$refs.body.scrollTop = 0;
        this.$refs.body.scrollLeft = 0;
      }
      this.clearHoverRow();
      this.syncCurrentRowByKey();
      this.updateRange();
      this.scheduleLayout();
    },

    handleScroll(event) {
      const target = event.target;
      const scrollTop = target.scrollTop || 0;
      const scrollLeft = target.scrollLeft || 0;
      this.pendingScrollTop = scrollTop;
      this.pendingScrollLeft = scrollLeft;
      this.syncFixedRowsPosition(scrollTop);
      this.startFixedScrollSync();
      this.scheduleFixedScrollEnd();
      if (this.isClientInBodyArea(this.lastMouseClientX, this.lastMouseClientY)) {
        if (!this.hoverScrolling) {
          this.hoverScrolling = true;
          this.clearHoverRow();
        }
        this.scheduleHoverScrollEnd();
      } else {
        this.stopHoverScrollSync();
        this.clearHoverRow();
      }
      if (this.scrollFrame) return;
      this.scrollFrame = requestFrame(() => {
        this.scrollFrame = null;
        this.scrollTop = this.pendingScrollTop || 0;
        this.scrollLeft = this.pendingScrollLeft || 0;
        this.updateRange();
        this.$nextTick(() => {
          if (!this.hoverScrolling) {
            this.syncHoverRowByPointer();
          }
        });
        this.$emit('scroll', {
          scrollTop: this.scrollTop,
          scrollLeft: this.scrollLeft
        });
      });
    },

    handleBodyWheel(event) {
      const body = this.$refs.body;
      if (!body) return;
      if (
        event &&
        event.clientX != null &&
        event.clientY != null &&
        !this.isClientInBodyArea(event.clientX, event.clientY)
      ) return;
      const deltaY = this.normalizeWheelDeltaY(event);
      if (!deltaY) return;
      this.startFixedScrollSync();
      this.scheduleFixedScrollEnd();
    },

    normalizeWheelDeltaY(event) {
      let deltaY = event && event.deltaY ? event.deltaY : 0;
      if (!deltaY) return 0;
      if (event.deltaMode === 1) {
        deltaY *= this.rowHeight;
      } else if (event.deltaMode === 2) {
        deltaY *= this.bodyHeight || this.rowHeight;
      }
      return deltaY;
    },

    getRowClass(row, rowIndex) {
      const classes = ['el-table-v2__row', 'el-table__row'];
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
      const classes = ['el-table-v2__cell', 'el-table__cell'];
      const align = header ? column.headerAlign || column.align : column.align;
      const alignClass = getColumnAlignClass(align);
      if (alignClass) classes.push(alignClass);
      if (column.className && !header) classes.push(column.className);
      if (column.labelClassName && header) classes.push(column.labelClassName);
      if (column.showOverflowTooltip && !header) classes.push('el-tooltip');
      if (header && this.getFilterValues(column).length) classes.push('highlight');

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
      const height = this.rowHeight;
      const style = {
        width: getColumnWidth(column) + 'px',
        height: height + 'px',
        lineHeight: height + 'px'
      };
      const custom = header ? this.headerCellStyle : this.cellStyle;
      if (typeof custom === 'function') {
        return Object.assign(style, custom({ row, column, rowIndex, columnIndex }) || {});
      }
      return Object.assign(style, custom || {});
    },

    getHeaderRowClass() {
      const classes = ['el-table-v2__header-row'];
      if (typeof this.headerRowClassName === 'string') {
        classes.push(this.headerRowClassName);
      } else if (typeof this.headerRowClassName === 'function') {
        const result = this.headerRowClassName({ row: this.tableColumns, rowIndex: 0 });
        if (result) classes.push(result);
      }
      return classes.join(' ');
    },

    getHeaderRowStyle() {
      const base = { height: this.rowHeight + 'px' };
      if (typeof this.headerRowStyle === 'function') {
        return Object.assign(base, this.headerRowStyle({ row: this.tableColumns, rowIndex: 0 }) || {});
      }
      return Object.assign(base, this.headerRowStyle || {});
    },

    getCellScope(row, column, index) {
      return {
        row,
        column,
        $index: index,
        isSelected: this.isSelected(row),
        store: this.store,
        _self: this.$parent
      };
    },

    getRowIdentityValue(row, index) {
      return getRowKey(row, this.rowKey, index);
    },

    renderCellContent(h, row, column, rowIndex, visibleIndex) {
      const isBuiltInType = column.type === 'selection' || column.type === 'index' || column.type === 'expand';
      const scopeIndex = isBuiltInType ? rowIndex : visibleIndex;
      const scope = this.getCellScope(row, column, scopeIndex);
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

    handleBodyMouseMove(event) {
      this.lastMouseClientX = event.clientX;
      this.lastMouseClientY = event.clientY;
    },

    handleBodyMouseLeave() {
      this.lastMouseClientX = null;
      this.lastMouseClientY = null;
      this.stopHoverScrollSync();
      this.clearHoverRow();
    },

    handleCellMouseEnter(event, row, column, rowIndex) {
      this.handleBodyMouseMove(event);
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
      this.handleBodyMouseMove(event);
      if (this.isClientInBodyArea(event.clientX, event.clientY)) {
        this.syncHoverRowByPointer();
      } else {
        this.clearHoverRow();
      }
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

    handleCellContextmenu(event, row, column) {
      this.$emit('cell-contextmenu', row, column, event.currentTarget, event);
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
      const layers = root.querySelectorAll('.el-table-v2__rows');
      for (let i = 0; i < layers.length; i++) {
        const row = layers[i].children[visibleIndex];
        if (row) {
          row.classList[active ? 'add' : 'remove']('hover-row');
        }
      }
    },

    clearHoverRowClasses() {
      const root = this.$el;
      if (!root) return;
      const rows = root.querySelectorAll('.el-table-v2__row.hover-row');
      for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove('hover-row');
      }
    },

    setHoverRow(row, cell) {
      const visibleIndex = this.getVisibleRowIndex(cell);
      this.setHoverRowByVisibleIndex(row, visibleIndex);
    },

    setHoverRowByVisibleIndex(row, visibleIndex) {
      if (this.hoverRow === row && this.hoverRowVisibleIndex === visibleIndex) return;
      this.clearHoverRowClasses();
      this.hoverRow = row;
      this.hoverRowVisibleIndex = visibleIndex;
      if (visibleIndex > -1) {
        this.syncHoverRowClass(visibleIndex, true);
      }
    },

    clearHoverRow() {
      this.clearHoverRowClasses();
      this.hoverRow = null;
      this.hoverRowVisibleIndex = null;
    },

    syncFixedRowsPosition(scrollTop) {
      const root = this.$el;
      if (!root) return;
      const rows = root.querySelectorAll('.el-table-v2__fixed-body .el-table-v2__rows');
      const transform = 'translate3d(0,' + (this.offsetY - scrollTop) + 'px,0)';
      if (transform === this.fixedRowsTransform) return;
      this.fixedRowsTransform = transform;
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.transform = transform;
      }
    },

    startFixedScrollSync() {
      if (this.fixedScrollFrame) return;
      const sync = () => {
        const body = this.$refs.body;
        if (!body) {
          this.fixedScrollFrame = null;
          return;
        }
        const scrollTop = body.scrollTop || 0;
        this.pendingScrollTop = scrollTop;
        this.syncFixedRowsPosition(scrollTop);
        this.fixedScrollFrame = requestFrame(sync);
      };
      this.fixedScrollFrame = requestFrame(sync);
    },

    scheduleFixedScrollEnd() {
      if (this.fixedScrollTimer) {
        clearTimeout(this.fixedScrollTimer);
      }
      this.fixedScrollTimer = setTimeout(() => {
        const body = this.$refs.body;
        if (body) {
          this.pendingScrollTop = body.scrollTop || 0;
          this.syncFixedRowsPosition(this.pendingScrollTop);
        }
        this.stopFixedScrollSync();
      }, this.fixedScrollEndDelay);
    },

    stopFixedScrollSync() {
      if (this.fixedScrollTimer) {
        clearTimeout(this.fixedScrollTimer);
        this.fixedScrollTimer = null;
      }
      if (this.fixedScrollFrame) {
        cancelFrame(this.fixedScrollFrame);
        this.fixedScrollFrame = null;
      }
    },

    getHoverBodyRect() {
      const body = this.$refs.body;
      if (!body) return null;
      const rect = body.getBoundingClientRect();
      const hoverRect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      };
      const root = this.$el;
      if (!root) return hoverRect;
      const fixedBodies = root.querySelectorAll('.el-table-v2__fixed-body');
      for (let i = 0; i < fixedBodies.length; i++) {
        const fixedRect = fixedBodies[i].getBoundingClientRect();
        hoverRect.left = Math.min(hoverRect.left, fixedRect.left);
        hoverRect.right = Math.max(hoverRect.right, fixedRect.right);
      }
      return hoverRect;
    },

    isClientInBodyArea(clientX, clientY) {
      if (clientX == null || clientY == null) return false;
      const rect = this.getHoverBodyRect();
      if (!rect) return false;
      return !(
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      );
    },

    syncHoverRowByPointer(scrollTop) {
      const body = this.$refs.body;
      if (!body || this.lastMouseClientX == null || this.lastMouseClientY == null) return;
      const rect = this.getHoverBodyRect();
      if (!rect || !this.isClientInBodyArea(this.lastMouseClientX, this.lastMouseClientY)) return;

      const bodyOffsetY = this.lastMouseClientY - rect.top;
      const currentScrollTop = scrollTop == null ? this.scrollTop : scrollTop;
      const rowIndex = Math.floor((currentScrollTop + bodyOffsetY) / this.rowHeight);
      const visibleIndex = rowIndex - this.start;
      const row = this.getViewRow(rowIndex);
      if (row) {
        this.setHoverRowByVisibleIndex(row, visibleIndex);
      } else {
        this.clearHoverRow();
      }
    },

    scheduleHoverScrollEnd() {
      if (this.hoverScrollTimer) {
        clearTimeout(this.hoverScrollTimer);
      }
      this.hoverScrollTimer = setTimeout(() => {
        this.hoverScrollTimer = null;
        this.hoverScrolling = false;
        const body = this.$refs.body;
        this.syncHoverRowByPointer(body ? body.scrollTop || 0 : this.scrollTop || 0);
      }, this.hoverScrollEndDelay);
    },

    stopHoverScrollSync() {
      this.hoverScrolling = false;
      if (this.hoverScrollTimer) {
        clearTimeout(this.hoverScrollTimer);
        this.hoverScrollTimer = null;
      }
    },

    handleHeaderClick(event, column) {
      if (column.sortable) {
        this.toggleSort(column);
      }
      if (column.filterable && !column.sortable) {
        this.handleFilterClick(event, column);
      }
      this.$emit('header-click', column, event);
    },

    handleHeaderContextmenu(event, column) {
      this.$emit('header-contextmenu', column, event);
    },

    scrollTo(scrollTop) {
      const body = this.$refs.body;
      if (body) {
        body.scrollTop = scrollTop;
        this.scrollTop = scrollTop;
        this.clearHoverRow();
        this.updateRange();
      }
    },

    renderEmpty(h) {
      if (this.viewLength) return null;
      return (
        <div class="el-table__empty-block" style={{ height: this.bodyHeight + 'px' }}>
          <span class="el-table__empty-text">
            { this.$slots.empty || this.emptyText || this.t('el.table.emptyText') }
          </span>
        </div>
      );
    }
  },

  render(h) {
    const hiddenColumns = <div ref="hiddenColumns" class="hidden-columns">{ this.$slots.default }</div>;
    const headerHeight = this.showHeader ? this.rowHeight : 0;
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
      <div class={this.tableClasses} style={this.tableStyle} on-wheel={this.handleBodyWheel}>
        { hiddenColumns }
        <el-tooltip ref="tooltip" effect={this.tooltipEffect} placement="top" content=""></el-tooltip>
        { this.showHeader ? (
          <div class="el-table-v2__header-wrapper" style={{ height: headerHeight + 'px' }}>
            <div class="el-table-v2__header-main">
              <TableV2Header table={this} columns={this.tableColumns} />
            </div>
            { this.fixedColumns.length ? <div class="el-table-v2__fixed-header el-table-v2__fixed-left" style={{ width: this.fixedLeftWidth + 'px' }}><TableV2Header table={this} columns={this.fixedColumns} fixed /></div> : null }
            { this.rightFixedColumns.length ? <div class="el-table-v2__fixed-header el-table-v2__fixed-right" style={fixedRightStyle}><TableV2Header table={this} columns={this.rightFixedColumns} fixed /></div> : null }
            { fixedRightGutterWidth ? <div class="el-table-v2__fixed-right-gutter" style={{ width: fixedRightGutterWidth + 'px' }}></div> : null }
          </div>
        ) : null }
        <div
          ref="body"
          class="el-table-v2__body-wrapper"
          style={bodyStyle}
          on-scroll={this.handleScroll}
          on-mousemove={this.handleBodyMouseMove}
          on-mouseleave={this.handleBodyMouseLeave}>
          <div class="el-table-v2__phantom" style={phantomStyle}></div>
          <TableV2Body table={this} columns={this.tableColumns} />
          { this.renderEmpty(h) }
          { this.$slots.append ? <div class="el-table__append-wrapper" style={{ width: this.scrollBodyWidth + 'px' }}>{ this.$slots.append }</div> : null }
        </div>
        { this.fixedColumns.length ? <div class="el-table-v2__fixed-body el-table-v2__fixed-left" style={{ top: this.headerHeight + 'px', bottom: (this.hasHorizontalScroll ? this.scrollbarWidth : 0) + 'px', width: this.fixedLeftWidth + 'px' }}><TableV2Body table={this} columns={this.fixedColumns} fixed /></div> : null }
        { this.rightFixedColumns.length ? <div class="el-table-v2__fixed-body el-table-v2__fixed-right" style={Object.assign({ top: this.headerHeight + 'px', bottom: (this.hasHorizontalScroll ? this.scrollbarWidth : 0) + 'px' }, fixedRightStyle)}><TableV2Body table={this} columns={this.rightFixedColumns} fixed /></div> : null }
      </div>
    );
  }
};
