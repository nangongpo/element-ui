import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { h as helper } from './shared/helper-cd11baf0.js';
import Scrollbar from './scrollbar.js';
import __vue_component__$3 from './checkbox.js';
import __vue_component__$4 from './radio.js';
import { isEqual, generateId, capitalize, valueEquals, coerceTruthyValueToArray, isEmpty, noop } from './utils/util.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import Locale from './mixins/locale.js';
import { isDef } from './utils/shared.js';
import merge from './utils/merge.js';
import AriaUtils from './utils/aria-utils.js';
import scrollIntoView from './utils/scroll-into-view.js';
import './shared/resize-event-51726919.js';
import './shared/throttle-54b44d30.js';
import './shared/debounce-e5482a73.js';
import './utils/scrollbar-width.js';
import 'vue';
import './utils/dom.js';
import './utils/types.js';
import './mixins/emitter.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';

var stopPropagation = e => e.stopPropagation();
var script$2 = {
  inject: ['panel'],
  components: {
    ElCheckbox: __vue_component__$3,
    ElRadio: __vue_component__$4
  },
  props: {
    node: {
      required: true
    },
    nodeId: String
  },
  computed: {
    config() {
      return this.panel.config;
    },
    isLeaf() {
      return this.node.isLeaf;
    },
    isDisabled() {
      return this.node.isDisabled;
    },
    checkedValue() {
      return this.panel.checkedValue;
    },
    isChecked() {
      return this.node.isSameNode(this.checkedValue);
    },
    inActivePath() {
      return this.isInPath(this.panel.activePath);
    },
    inCheckedPath() {
      if (!this.config.checkStrictly) return false;
      return this.panel.checkedNodePaths.some(checkedPath => this.isInPath(checkedPath));
    },
    value() {
      return this.node.getValueByOption();
    }
  },
  methods: {
    handleExpand() {
      var panel = this.panel,
        node = this.node,
        isDisabled = this.isDisabled,
        config = this.config;
      var multiple = config.multiple,
        checkStrictly = config.checkStrictly;
      if (!checkStrictly && isDisabled || node.loading) return;
      if (config.lazy && !node.loaded) {
        panel.lazyLoad(node, () => {
          // do not use cached leaf value here, invoke this.isLeaf to get new value.
          var isLeaf = this.isLeaf;
          if (!isLeaf) this.handleExpand();
          if (multiple) {
            // if leaf sync checked state, else clear checked state
            var checked = isLeaf ? node.checked : false;
            this.handleMultiCheckChange(checked);
          }
        });
      } else {
        panel.handleExpand(node);
      }
    },
    handleCheckChange() {
      var panel = this.panel,
        value = this.value,
        node = this.node;
      panel.handleCheckChange(value);
      panel.handleExpand(node);
    },
    handleMultiCheckChange(checked) {
      this.node.doCheck(checked);
      this.panel.calculateMultiCheckedValue();
    },
    isInPath(pathNodes) {
      var node = this.node;
      var selectedPathNode = pathNodes[node.level - 1] || {};
      return selectedPathNode.uid === node.uid;
    },
    renderPrefix(h) {
      var isLeaf = this.isLeaf,
        isChecked = this.isChecked,
        config = this.config;
      var checkStrictly = config.checkStrictly,
        multiple = config.multiple;
      if (multiple) {
        return this.renderCheckbox(h);
      } else if (checkStrictly) {
        return this.renderRadio(h);
      } else if (isLeaf && isChecked) {
        return this.renderCheckIcon(h);
      }
      return null;
    },
    renderPostfix(h) {
      var node = this.node,
        isLeaf = this.isLeaf;
      if (node.loading) {
        return this.renderLoadingIcon(h);
      } else if (!isLeaf) {
        return this.renderExpandIcon(h);
      }
      return null;
    },
    renderCheckbox(h) {
      var node = this.node,
        config = this.config,
        isDisabled = this.isDisabled;
      var events = {
        on: {
          change: this.handleMultiCheckChange
        },
        nativeOn: {}
      };
      if (config.checkStrictly) {
        // when every node is selectable, click event should not trigger expand event.
        events.nativeOn.click = stopPropagation;
      }
      return h("el-checkbox", helper([{
        "attrs": {
          "value": node.checked,
          "indeterminate": node.indeterminate,
          "disabled": isDisabled
        }
      }, events]));
    },
    renderRadio(h) {
      var checkedValue = this.checkedValue,
        value = this.value,
        isDisabled = this.isDisabled;

      // to keep same reference if value cause radio's checked state is calculated by reference comparision;
      if (isEqual(value, checkedValue)) {
        value = checkedValue;
      }
      return h("el-radio", {
        "attrs": {
          "value": checkedValue,
          "label": value,
          "disabled": isDisabled
        },
        "on": {
          "change": this.handleCheckChange
        },
        "nativeOn": {
          "click": stopPropagation
        }
      }, [h("span")]);
    },
    renderCheckIcon(h) {
      return h("i", {
        "class": "el-icon-check el-cascader-node__prefix"
      });
    },
    renderLoadingIcon(h) {
      return h("i", {
        "class": "el-icon-loading el-cascader-node__postfix"
      });
    },
    renderExpandIcon(h) {
      return h("i", {
        "class": "el-icon-arrow-right el-cascader-node__postfix"
      });
    },
    renderContent(h) {
      var panel = this.panel,
        node = this.node;
      var render = panel.renderLabelFn;
      var vnode = render ? render({
        node,
        data: node.data
      }) : null;
      return h("span", {
        "class": "el-cascader-node__label"
      }, [vnode || node.label]);
    }
  },
  render(h) {
    var inActivePath = this.inActivePath,
      inCheckedPath = this.inCheckedPath,
      isChecked = this.isChecked,
      isLeaf = this.isLeaf,
      isDisabled = this.isDisabled,
      config = this.config,
      nodeId = this.nodeId;
    var expandTrigger = config.expandTrigger,
      checkStrictly = config.checkStrictly,
      multiple = config.multiple;
    var disabled = !checkStrictly && isDisabled;
    var events = {
      on: {}
    };
    if (expandTrigger === 'click') {
      events.on.click = this.handleExpand;
    } else {
      events.on.mouseenter = e => {
        this.handleExpand();
        this.$emit('expand', e);
      };
      events.on.focus = e => {
        this.handleExpand();
        this.$emit('expand', e);
      };
    }
    if (isLeaf && !isDisabled && !checkStrictly && !multiple) {
      events.on.click = this.handleCheckChange;
    }
    return h("li", helper([{
      "attrs": {
        "role": "menuitem",
        "id": nodeId,
        "aria-expanded": inActivePath,
        "tabindex": disabled ? null : -1
      },
      "class": {
        'el-cascader-node': true,
        'is-selectable': checkStrictly,
        'in-active-path': inActivePath,
        'in-checked-path': inCheckedPath,
        'is-active': isChecked,
        'is-disabled': disabled
      }
    }, events]), [this.renderPrefix(h), this.renderContent(h), this.renderPostfix(h)]);
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var script$1 = {
  name: 'ElCascaderMenu',
  mixins: [Locale],
  inject: ['panel'],
  components: {
    ElScrollbar: Scrollbar,
    CascaderNode: __vue_component__$2
  },
  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number
  },
  data() {
    return {
      activeNode: null,
      hoverTimer: null,
      id: generateId()
    };
  },
  computed: {
    isEmpty() {
      return !this.nodes.length;
    },
    menuId() {
      return `cascader-menu-${this.id}-${this.index}`;
    }
  },
  methods: {
    handleExpand(e) {
      this.activeNode = e.target;
    },
    handleMouseMove(e) {
      var activeNode = this.activeNode,
        hoverTimer = this.hoverTimer;
      var hoverZone = this.$refs.hoverZone;
      if (!activeNode || !hoverZone) return;
      if (activeNode.contains(e.target)) {
        clearTimeout(hoverTimer);
        var _this$$el$getBounding = this.$el.getBoundingClientRect(),
          left = _this$$el$getBounding.left;
        var startX = e.clientX - left;
        var _this$$el = this.$el,
          offsetWidth = _this$$el.offsetWidth,
          offsetHeight = _this$$el.offsetHeight;
        var top = activeNode.offsetTop;
        var bottom = top + activeNode.offsetHeight;
        hoverZone.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} 0 V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight} V${bottom} Z" />
        `;
      } else if (!hoverTimer) {
        this.hoverTimer = setTimeout(this.clearHoverZone, this.panel.config.hoverThreshold);
      }
    },
    clearHoverZone() {
      var hoverZone = this.$refs.hoverZone;
      if (!hoverZone) return;
      hoverZone.innerHTML = '';
    },
    renderEmptyText(h) {
      return h("div", {
        "class": "el-cascader-menu__empty-text"
      }, [this.t('el.cascader.noData')]);
    },
    renderNodeList(h) {
      var menuId = this.menuId;
      var isHoverMenu = this.panel.isHoverMenu;
      var events = {
        on: {}
      };
      if (isHoverMenu) {
        events.on.expand = this.handleExpand;
      }
      var nodes = this.nodes.map((node, index) => {
        var hasChildren = node.hasChildren;
        return h("cascader-node", helper([{
          "key": node.uid,
          "attrs": {
            "node": node,
            "node-id": `${menuId}-${index}`,
            "aria-haspopup": hasChildren,
            "aria-owns": hasChildren ? menuId : null
          }
        }, events]));
      });
      return [...nodes, isHoverMenu ? h("svg", {
        "ref": 'hoverZone',
        "class": 'el-cascader-menu__hover-zone'
      }) : null];
    }
  },
  render(h) {
    var isEmpty = this.isEmpty,
      menuId = this.menuId;
    var events = {
      nativeOn: {}
    };

    // optimize hover to expand experience (#8010)
    if (this.panel.isHoverMenu) {
      events.nativeOn.mousemove = this.handleMouseMove;
      // events.nativeOn.mouseleave = this.clearHoverZone;
    }
    return h("el-scrollbar", helper([{
      "attrs": {
        "tag": "ul",
        "role": "menu",
        "id": menuId,
        "wrap-class": "el-cascader-menu__wrap",
        "view-class": {
          'el-cascader-menu__list': true,
          'is-empty': isEmpty
        }
      },
      "class": "el-cascader-menu"
    }, events]), [isEmpty ? this.renderEmptyText(h) : this.renderNodeList(h)]);
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var uid = 0;
class Node {
  constructor(data, config, parentNode) {
    this.data = data;
    this.config = config;
    this.parent = parentNode || null;
    this.level = !this.parent ? 1 : this.parent.level + 1;
    this.uid = uid++;
    this.initState();
    this.initChildren();
  }
  initState() {
    var _this$config = this.config,
      valueKey = _this$config.value,
      labelKey = _this$config.label;
    this.value = this.data[valueKey];
    this.label = this.data[labelKey];
    this.pathNodes = this.calculatePathNodes();
    this.path = this.pathNodes.map(node => node.value);
    this.pathLabels = this.pathNodes.map(node => node.label);

    // lazy load
    this.loading = false;
    this.loaded = false;
  }
  initChildren() {
    var config = this.config;
    var childrenKey = config.children;
    var childrenData = this.data[childrenKey];
    this.hasChildren = Array.isArray(childrenData);
    this.children = (childrenData || []).map(child => new Node(child, config, this));
  }
  get isDisabled() {
    var data = this.data,
      parent = this.parent,
      config = this.config;
    var disabledKey = config.disabled;
    var checkStrictly = config.checkStrictly;
    return data[disabledKey] || !checkStrictly && parent && parent.isDisabled;
  }
  get isLeaf() {
    var data = this.data,
      loaded = this.loaded,
      hasChildren = this.hasChildren,
      children = this.children;
    var _this$config2 = this.config,
      lazy = _this$config2.lazy,
      leafKey = _this$config2.leaf;
    if (lazy) {
      var isLeaf = isDef(data[leafKey]) ? data[leafKey] : loaded ? !children.length : false;
      this.hasChildren = !isLeaf;
      return isLeaf;
    }
    return !hasChildren;
  }
  calculatePathNodes() {
    var nodes = [this];
    var parent = this.parent;
    while (parent) {
      nodes.unshift(parent);
      parent = parent.parent;
    }
    return nodes;
  }
  getPath() {
    return this.path;
  }
  getValue() {
    return this.value;
  }
  getValueByOption() {
    return this.config.emitPath ? this.getPath() : this.getValue();
  }
  getText(allLevels, separator) {
    return allLevels ? this.pathLabels.join(separator) : this.label;
  }
  isSameNode(checkedValue) {
    var value = this.getValueByOption();
    return this.config.multiple && Array.isArray(checkedValue) ? checkedValue.some(val => isEqual(val, value)) : isEqual(checkedValue, value);
  }
  broadcast(event, ...args) {
    var handlerName = `onParent${capitalize(event)}`;
    this.children.forEach(child => {
      if (child) {
        // bottom up
        child.broadcast(event, ...args);
        child[handlerName] && child[handlerName](...args);
      }
    });
  }
  emit(event, ...args) {
    var parent = this.parent;
    var handlerName = `onChild${capitalize(event)}`;
    if (parent) {
      parent[handlerName] && parent[handlerName](...args);
      parent.emit(event, ...args);
    }
  }
  onParentCheck(checked) {
    if (!this.isDisabled) {
      this.setCheckState(checked);
    }
  }
  onChildCheck() {
    var children = this.children;
    var validChildren = children.filter(child => !child.isDisabled);
    var checked = validChildren.length ? validChildren.every(child => child.checked) : false;
    this.setCheckState(checked);
  }
  setCheckState(checked) {
    var totalNum = this.children.length;
    var checkedNum = this.children.reduce((c, p) => {
      var num = p.checked ? 1 : p.indeterminate ? 0.5 : 0;
      return c + num;
    }, 0);
    this.checked = checked;
    this.indeterminate = checkedNum !== totalNum && checkedNum > 0;
  }
  syncCheckState(checkedValue) {
    var value = this.getValueByOption();
    var checked = this.isSameNode(checkedValue, value);
    this.doCheck(checked);
  }
  doCheck(checked) {
    if (this.checked !== checked) {
      if (this.config.checkStrictly) {
        this.checked = checked;
      } else {
        // bottom up to unify the calculation of the indeterminate state
        this.broadcast('check', checked);
        this.setCheckState(checked);
        this.emit('check');
      }
    }
  }
}

var flatNodes = (data, leafOnly) => {
  return data.reduce((res, node) => {
    if (node.isLeaf) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
  }, []);
};
class Store {
  constructor(data, config) {
    this.config = config;
    this.initNodes(data);
  }
  initNodes(data) {
    data = coerceTruthyValueToArray(data);
    this.nodes = data.map(nodeData => new Node(nodeData, this.config));
    this.flattedNodes = this.getFlattedNodes(false, false);
    this.leafNodes = this.getFlattedNodes(true, false);
  }
  appendNode(nodeData, parentNode) {
    var node = new Node(nodeData, this.config, parentNode);
    var children = parentNode ? parentNode.children : this.nodes;
    children.push(node);
  }
  appendNodes(nodeDataList, parentNode) {
    nodeDataList = coerceTruthyValueToArray(nodeDataList);
    nodeDataList.forEach(nodeData => this.appendNode(nodeData, parentNode));
  }
  getNodes() {
    return this.nodes;
  }
  getFlattedNodes(leafOnly, cached = true) {
    var cachedNodes = leafOnly ? this.leafNodes : this.flattedNodes;
    return cached ? cachedNodes : flatNodes(this.nodes, leafOnly);
  }
  getNodeByValue(value) {
    var nodes = this.getFlattedNodes(false, !this.config.lazy).filter(node => valueEquals(node.path, value) || node.value === value);
    return nodes && nodes.length ? nodes[0] : null;
  }
}

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var KeyCode = AriaUtils.keys;
var DefaultProps = {
  expandTrigger: 'click',
  // or hover
  multiple: false,
  checkStrictly: false,
  // whether all nodes can be selected
  emitPath: true,
  // wether to emit an array of all levels value in which node is located
  lazy: false,
  lazyLoad: noop,
  value: 'value',
  label: 'label',
  children: 'children',
  leaf: 'leaf',
  disabled: 'disabled',
  hoverThreshold: 500
};
var isLeaf = el => !el.getAttribute('aria-owns');
var getSibling = (el, distance) => {
  var parentNode = el.parentNode;
  if (parentNode) {
    var siblings = parentNode.querySelectorAll('.el-cascader-node[tabindex="-1"]');
    var index = Array.prototype.indexOf.call(siblings, el);
    return siblings[index + distance] || null;
  }
  return null;
};
var getMenuIndex = (el, distance) => {
  if (!el) return;
  var pieces = el.id.split('-');
  return Number(pieces[pieces.length - 2]);
};
var focusNode = el => {
  if (!el) return;
  el.focus();
  !isLeaf(el) && el.click();
};
var checkNode = el => {
  if (!el) return;
  var input = el.querySelector('input');
  if (input) {
    input.click();
  } else if (isLeaf(el)) {
    el.click();
  }
};
var script = {
  name: 'ElCascaderPanel',
  components: {
    CascaderMenu: __vue_component__$1
  },
  props: {
    value: {},
    options: Array,
    props: Object,
    border: {
      type: Boolean,
      default: true
    },
    renderLabel: Function
  },
  provide() {
    return {
      panel: this
    };
  },
  data() {
    return {
      checkedValue: null,
      checkedNodePaths: [],
      store: [],
      menus: [],
      activePath: [],
      loadCount: 0
    };
  },
  computed: {
    config() {
      return merge(_objectSpread({}, DefaultProps), this.props || {});
    },
    multiple() {
      return this.config.multiple;
    },
    checkStrictly() {
      return this.config.checkStrictly;
    },
    leafOnly() {
      return !this.checkStrictly;
    },
    isHoverMenu() {
      return this.config.expandTrigger === 'hover';
    },
    renderLabelFn() {
      return this.renderLabel || this.$scopedSlots.default;
    }
  },
  watch: {
    value() {
      this.syncCheckedValue();
      this.checkStrictly && this.calculateCheckedNodePaths();
    },
    options: {
      handler: function handler() {
        this.initStore();
      },
      immediate: true,
      deep: true
    },
    checkedValue(val) {
      if (!isEqual(val, this.value)) {
        this.checkStrictly && this.calculateCheckedNodePaths();
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  },
  mounted() {
    if (!this.isEmptyValue(this.value)) {
      this.syncCheckedValue();
    }
  },
  methods: {
    initStore() {
      var config = this.config,
        options = this.options;
      if (config.lazy && isEmpty(options)) {
        this.lazyLoad();
      } else {
        this.store = new Store(options, config);
        this.menus = [this.store.getNodes()];
        this.syncMenuState();
      }
    },
    syncCheckedValue() {
      var value = this.value,
        checkedValue = this.checkedValue;
      if (!isEqual(value, checkedValue)) {
        this.activePath = [];
        this.checkedValue = value;
        this.syncMenuState();
      }
    },
    syncMenuState() {
      var multiple = this.multiple,
        checkStrictly = this.checkStrictly;
      this.syncActivePath();
      multiple && this.syncMultiCheckState();
      checkStrictly && this.calculateCheckedNodePaths();
      this.$nextTick(this.scrollIntoView);
    },
    syncMultiCheckState() {
      var nodes = this.getFlattedNodes(this.leafOnly);
      nodes.forEach(node => {
        node.syncCheckState(this.checkedValue);
      });
    },
    isEmptyValue(val) {
      var multiple = this.multiple,
        config = this.config;
      var emitPath = config.emitPath;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    syncActivePath() {
      var store = this.store,
        multiple = this.multiple,
        activePath = this.activePath,
        checkedValue = this.checkedValue;
      if (!isEmpty(activePath)) {
        var nodes = activePath.map(node => this.getNodeByValue(node.getValue()));
        this.expandNodes(nodes);
      } else if (!this.isEmptyValue(checkedValue)) {
        var value = multiple ? checkedValue[0] : checkedValue;
        var checkedNode = this.getNodeByValue(value) || {};
        var _nodes = (checkedNode.pathNodes || []).slice(0, -1);
        this.expandNodes(_nodes);
      } else {
        this.activePath = [];
        this.menus = [store.getNodes()];
      }
    },
    expandNodes(nodes) {
      nodes.forEach(node => this.handleExpand(node, true /* silent */));
    },
    calculateCheckedNodePaths() {
      var checkedValue = this.checkedValue,
        multiple = this.multiple;
      var checkedValues = multiple ? coerceTruthyValueToArray(checkedValue) : [checkedValue];
      this.checkedNodePaths = checkedValues.map(v => {
        var checkedNode = this.getNodeByValue(v);
        return checkedNode ? checkedNode.pathNodes : [];
      });
    },
    handleKeyDown(e) {
      var target = e.target,
        keyCode = e.keyCode;
      switch (keyCode) {
        case KeyCode.up:
          var prev = getSibling(target, -1);
          focusNode(prev);
          break;
        case KeyCode.down:
          var next = getSibling(target, 1);
          focusNode(next);
          break;
        case KeyCode.left:
          var preMenu = this.$refs.menu[getMenuIndex(target) - 1];
          if (preMenu) {
            var expandedNode = preMenu.$el.querySelector('.el-cascader-node[aria-expanded="true"]');
            focusNode(expandedNode);
          }
          break;
        case KeyCode.right:
          var nextMenu = this.$refs.menu[getMenuIndex(target) + 1];
          if (nextMenu) {
            var firstNode = nextMenu.$el.querySelector('.el-cascader-node[tabindex="-1"]');
            focusNode(firstNode);
          }
          break;
        case KeyCode.enter:
          checkNode(target);
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.$emit('close');
          break;
        default:
          return;
      }
    },
    handleExpand(node, silent) {
      var activePath = this.activePath;
      var level = node.level;
      var path = activePath.slice(0, level - 1);
      var menus = this.menus.slice(0, level);
      if (!node.isLeaf) {
        path.push(node);
        menus.push(node.children);
      }
      this.activePath = path;
      this.menus = menus;
      if (!silent) {
        var pathValues = path.map(node => node.getValue());
        var activePathValues = activePath.map(node => node.getValue());
        if (!valueEquals(pathValues, activePathValues)) {
          this.$emit('active-item-change', pathValues); // Deprecated
          this.$emit('expand-change', pathValues);
        }
      }
    },
    handleCheckChange(value) {
      this.checkedValue = value;
    },
    lazyLoad(node, onFullfiled) {
      var config = this.config;
      if (!node) {
        node = node || {
          root: true,
          level: 0
        };
        this.store = new Store([], config);
        this.menus = [this.store.getNodes()];
      }
      node.loading = true;
      var resolve = dataList => {
        var parent = node.root ? null : node;
        dataList && dataList.length && this.store.appendNodes(dataList, parent);
        node.loading = false;
        node.loaded = true;

        // dispose default value on lazy load mode
        if (Array.isArray(this.checkedValue)) {
          var nodeValue = this.checkedValue[this.loadCount++];
          var valueKey = this.config.value;
          var leafKey = this.config.leaf;
          if (Array.isArray(dataList) && dataList.filter(item => item[valueKey] === nodeValue).length > 0) {
            var checkedNode = this.store.getNodeByValue(nodeValue);
            if (!checkedNode.data[leafKey]) {
              this.lazyLoad(checkedNode, () => {
                this.handleExpand(checkedNode);
              });
            }
            if (this.loadCount === this.checkedValue.length) {
              this.$parent.computePresentText();
            }
          }
        }
        onFullfiled && onFullfiled(dataList);
      };
      config.lazyLoad(node, resolve);
    },
    /**
     * public methods
    */
    calculateMultiCheckedValue() {
      this.checkedValue = this.getCheckedNodes(this.leafOnly).map(node => node.getValueByOption());
    },
    scrollIntoView() {
      if (this.$isServer) return;
      var menus = this.$refs.menu || [];
      menus.forEach(menu => {
        var menuElement = menu.$el;
        if (menuElement) {
          var container = menuElement.querySelector('.el-scrollbar__wrap');
          var activeNode = menuElement.querySelector('.el-cascader-node.is-active') || menuElement.querySelector('.el-cascader-node.in-active-path');
          scrollIntoView(container, activeNode);
        }
      });
    },
    getNodeByValue(val) {
      return this.store.getNodeByValue(val);
    },
    getFlattedNodes(leafOnly) {
      var cached = !this.config.lazy;
      return this.store.getFlattedNodes(leafOnly, cached);
    },
    getCheckedNodes(leafOnly) {
      var checkedValue = this.checkedValue,
        multiple = this.multiple;
      if (multiple) {
        var nodes = this.getFlattedNodes(leafOnly);
        return nodes.filter(node => node.checked);
      } else {
        return this.isEmptyValue(checkedValue) ? [] : [this.getNodeByValue(checkedValue)];
      }
    },
    clearCheckedNodes() {
      var config = this.config,
        leafOnly = this.leafOnly;
      var multiple = config.multiple,
        emitPath = config.emitPath;
      if (multiple) {
        this.getCheckedNodes(leafOnly).filter(node => !node.isDisabled).forEach(node => node.doCheck(false));
        this.calculateMultiCheckedValue();
      } else {
        this.checkedValue = emitPath ? [] : null;
      }
    }
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: ["el-cascader-panel", _vm.border && "is-bordered"],
    on: {
      keydown: _vm.handleKeyDown
    }
  }, _vm._l(_vm.menus, function (menu, index) {
    return _c("cascader-menu", {
      key: index,
      ref: "menu",
      refInFor: true,
      attrs: {
        index: index,
        nodes: menu
      }
    });
  }), 1);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
