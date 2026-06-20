import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { h as helper } from './shared/helper-cd11baf0.js';
import { getPropByPath } from './utils/util.js';
import { h as parseWidth, i as parseMinWidth, m as mergeOptions, j as compose } from './shared/util-0e475954.js';
import __vue_component__ from './checkbox.js';
import 'vue';
import './utils/types.js';
import './mixins/emitter.js';
import './shared/normalize-component-01820469.js';

var cellStarts = {
  default: {
    order: ''
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
    className: 'el-table-column--selection'
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  }
};

// 这些选项不应该被覆盖
var cellForced = {
  selection: {
    renderHeader: function renderHeader(h, {
      store
    }) {
      return h("el-checkbox", {
        "attrs": {
          "disabled": store.states.data && store.states.data.length === 0,
          "indeterminate": store.states.selection.length > 0 && !this.isAllSelected,
          "value": this.isAllSelected
        },
        "on": {
          "input": this.toggleAllSelection
        }
      });
    },
    renderCell: function renderCell(h, {
      row,
      column,
      isSelected,
      store,
      $index
    }) {
      return h("el-checkbox", {
        "nativeOn": {
          "click": event => event.stopPropagation()
        },
        "attrs": {
          "value": isSelected,
          "disabled": column.selectable ? !column.selectable.call(null, row, $index) : false
        },
        "on": {
          "input": () => {
            store.commit('rowSelectedChanged', row);
          }
        }
      });
    },
    sortable: false,
    resizable: false
  },
  index: {
    renderHeader: function renderHeader(h, {
      column
    }) {
      return column.label || '#';
    },
    renderCell: function renderCell(h, {
      $index,
      column
    }) {
      var i = $index + 1;
      var index = column.index;
      if (typeof index === 'number') {
        i = $index + index;
      } else if (typeof index === 'function') {
        i = index($index);
      }
      return h("div", [i]);
    },
    sortable: false
  },
  expand: {
    renderHeader: function renderHeader(h, {
      column
    }) {
      return column.label || '';
    },
    renderCell: function renderCell(h, {
      row,
      store,
      isExpanded
    }) {
      var classes = ['el-table__expand-icon'];
      if (isExpanded) {
        classes.push('el-table__expand-icon--expanded');
      }
      var callback = function callback(e) {
        e.stopPropagation();
        store.toggleRowExpansion(row);
      };
      return h("div", {
        "class": classes,
        "on": {
          "click": callback
        }
      }, [h("i", {
        "class": 'el-icon el-icon-arrow-right'
      })]);
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column'
  }
};
function defaultRenderCell(h, {
  row,
  column,
  $index
}) {
  var property = column.property;
  var value = property && getPropByPath(row, property).v;
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value;
}
function treeCellPrefix(h, {
  row,
  treeNode,
  store
}) {
  if (!treeNode) return null;
  var ele = [];
  var callback = function callback(e) {
    e.stopPropagation();
    store.loadOrToggle(row);
  };
  if (treeNode.indent) {
    ele.push(h("span", {
      "class": "el-table__indent",
      "style": {
        'padding-left': treeNode.indent + 'px'
      }
    }));
  }
  if (typeof treeNode.expanded === 'boolean' && !treeNode.noLazyChildren) {
    var expandClasses = ['el-table__expand-icon', treeNode.expanded ? 'el-table__expand-icon--expanded' : ''];
    var iconClasses = ['el-icon-arrow-right'];
    if (treeNode.loading) {
      iconClasses = ['el-icon-loading'];
    }
    ele.push(h("div", {
      "class": expandClasses,
      "on": {
        "click": callback
      }
    }, [h("i", {
      "class": iconClasses
    })]));
  } else {
    ele.push(h("span", {
      "class": "el-table__placeholder"
    }));
  }
  return ele;
}

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var columnIdSeed = 1;
var ElTableColumn = {
  name: 'ElTableColumn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default() {
        return ['ascending', 'descending', null];
      },
      validator(val) {
        return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1);
      }
    }
  },
  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },
  computed: {
    owner() {
      var parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    columnOrTableParent() {
      var parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    },
    realWidth() {
      return parseWidth(this.width);
    },
    realMinWidth() {
      return parseMinWidth(this.minWidth);
    },
    realAlign() {
      return this.align ? 'is-' + this.align : null;
    },
    realHeaderAlign() {
      return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign;
    }
  },
  methods: {
    getPropsData(...props) {
      return props.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach(key => {
            prev[key] = this[key];
          });
        }
        return prev;
      }, {});
    },
    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },
    setColumnWidth(column) {
      if (this.realWidth) {
        column.width = this.realWidth;
      }
      if (this.realMinWidth) {
        column.minWidth = this.realMinWidth;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width;
      return column;
    },
    setColumnForcedProps(column) {
      // 对于特定类型的 column，某些属性不允许设置
      var type = column.type;
      var source = cellForced[type] || {};
      Object.keys(source).forEach(prop => {
        var value = source[prop];
        if (value !== undefined) {
          column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
        }
      });
      return column;
    },
    setColumnRenders(column) {
      this.$createElement;
      // renderHeader 属性不推荐使用。
      if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
      } else if (column.type !== 'selection') {
        column.renderHeader = (h, scope) => {
          var renderHeader = this.$scopedSlots.header;
          return renderHeader ? renderHeader(scope) : column.label;
        };
      }
      var originRenderCell = column.renderCell;
      // TODO: 这里的实现调整
      if (column.type === 'expand') {
        // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
        column.renderCell = (h, data) => h("div", {
          "class": "cell"
        }, [originRenderCell(h, data)]);
        this.owner.renderExpanded = (h, data) => {
          return this.$scopedSlots.default ? this.$scopedSlots.default(data) : this.$slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        // 对 renderCell 进行包装
        column.renderCell = (h, data) => {
          var children = null;
          if (this.$scopedSlots.default) {
            children = this.$scopedSlots.default(data);
          } else {
            children = originRenderCell(h, data);
          }
          var prefix = treeCellPrefix(h, data);
          var props = {
            class: 'cell',
            style: {}
          };
          if (column.showOverflowTooltip) {
            props.class += ' el-tooltip';
            props.style = {
              width: (data.column.realWidth || data.column.width) - 1 + 'px'
            };
          }
          return h("div", helper([{}, props]), [prefix, children]);
        };
      }
      return column;
    },
    registerNormalWatchers() {
      var props = ['label', 'property', 'filters', 'filterMultiple', 'sortable', 'index', 'formatter', 'className', 'labelClassName', 'showOverflowTooltip'];
      // 一些属性具有别名
      var aliases = {
        prop: 'property',
        realAlign: 'align',
        realHeaderAlign: 'headerAlign',
        realWidth: 'width'
      };
      var allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);
      Object.keys(allAliases).forEach(key => {
        var columnKey = aliases[key];
        this.$watch(key, newVal => {
          this.columnConfig[columnKey] = newVal;
        });
      });
    },
    registerComplexWatchers() {
      var props = ['fixed'];
      var aliases = {
        realWidth: 'width',
        realMinWidth: 'minWidth'
      };
      var allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);
      Object.keys(allAliases).forEach(key => {
        var columnKey = aliases[key];
        this.$watch(key, newVal => {
          this.columnConfig[columnKey] = newVal;
          var updateColumns = columnKey === 'fixed';
          this.owner.store.scheduleLayout(updateColumns);
        });
      });
    }
  },
  components: {
    ElCheckbox: __vue_component__
  },
  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
    this.columnId = '';
  },
  created() {
    var parent = this.columnOrTableParent;
    this.isSubColumn = this.owner !== parent;
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;
    var type = this.type || 'default';
    var sortable = this.sortable === '' ? true : this.sortable;
    var defaults = _objectSpread(_objectSpread({}, cellStarts[type]), {}, {
      id: this.columnId,
      type: type,
      property: this.prop || this.property,
      align: this.realAlign,
      headerAlign: this.realHeaderAlign,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      // filter 相关属性
      filterable: this.filters || this.filterMethod,
      filteredValue: [],
      filterPlacement: '',
      isColumnGroup: false,
      filterOpened: false,
      // sort 相关属性
      sortable: sortable,
      // index 列
      index: this.index
    });
    var basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable'];
    var sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
    var selectProps = ['selectable', 'reserveSelection'];
    var filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement'];
    var column = this.getPropsData(basicProps, sortProps, selectProps, filterProps);
    column = mergeOptions(defaults, column);

    // 注意 compose 中函数执行的顺序是从右到左
    var chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps);
    column = chains(column);
    this.columnConfig = column;

    // 注册 watcher
    this.registerNormalWatchers();
    this.registerComplexWatchers();
  },
  mounted() {
    var owner = this.owner;
    var parent = this.columnOrTableParent;
    var children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children;
    var columnIndex = this.getColumnElIndex(children, this.$el);
    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  },
  destroyed() {
    if (!this.$parent) return;
    var parent = this.$parent;
    this.owner.store.commit('removeColumn', this.columnConfig, this.isSubColumn ? parent.columnConfig : null);
  },
  render(h) {
    // slots 也要渲染，需要计算合并表头
    return h('div', this.$slots.default);
  }
};

/* istanbul ignore next */
ElTableColumn.install = function (Vue) {
  Vue.component(ElTableColumn.name, ElTableColumn);
};

export { ElTableColumn as default };
