import ElScrollbar from 'element-ui/lib/scrollbar';
import ElCheckbox from 'element-ui/lib/checkbox';
import ElRadio from 'element-ui/lib/radio';
import { isEqual, generateId, capitalize, coerceTruthyValueToArray, valueEquals, isEmpty, noop } from 'element-ui/lib/utils/util';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Locale from 'element-ui/lib/mixins/locale';
import { isDef } from 'element-ui/lib/utils/shared';
import merge from 'element-ui/lib/utils/merge';
import AriaUtils from 'element-ui/lib/utils/aria-utils';
import _scrollIntoView from 'element-ui/lib/utils/scroll-into-view';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

var stopPropagation = function stopPropagation(e) {
  return e.stopPropagation();
};
var script$2 = {
  inject: ['panel'],
  components: {
    ElCheckbox: ElCheckbox,
    ElRadio: ElRadio
  },
  props: {
    node: {
      required: true
    },
    nodeId: String
  },
  computed: {
    config: function config() {
      return this.panel.config;
    },
    isLeaf: function isLeaf() {
      return this.node.isLeaf;
    },
    isDisabled: function isDisabled() {
      return this.node.isDisabled;
    },
    checkedValue: function checkedValue() {
      return this.panel.checkedValue;
    },
    isChecked: function isChecked() {
      return this.node.isSameNode(this.checkedValue);
    },
    inActivePath: function inActivePath() {
      return this.isInPath(this.panel.activePath);
    },
    inCheckedPath: function inCheckedPath() {
      var _this = this;
      if (!this.config.checkStrictly) return false;
      return this.panel.checkedNodePaths.some(function (checkedPath) {
        return _this.isInPath(checkedPath);
      });
    },
    value: function value() {
      return this.node.getValueByOption();
    }
  },
  methods: {
    handleExpand: function handleExpand() {
      var _this2 = this;
      var panel = this.panel,
        node = this.node,
        isDisabled = this.isDisabled,
        config = this.config;
      var multiple = config.multiple,
        checkStrictly = config.checkStrictly;
      if (!checkStrictly && isDisabled || node.loading) return;
      if (config.lazy && !node.loaded) {
        panel.lazyLoad(node, function () {
          // do not use cached leaf value here, invoke this.isLeaf to get new value.
          var isLeaf = _this2.isLeaf;
          if (!isLeaf) _this2.handleExpand();
          if (multiple) {
            // if leaf sync checked state, else clear checked state
            var checked = isLeaf ? node.checked : false;
            _this2.handleMultiCheckChange(checked);
          }
        });
      } else {
        panel.handleExpand(node);
      }
    },
    handleCheckChange: function handleCheckChange() {
      var panel = this.panel,
        value = this.value,
        node = this.node;
      panel.handleCheckChange(value);
      panel.handleExpand(node);
    },
    handleMultiCheckChange: function handleMultiCheckChange(checked) {
      this.node.doCheck(checked);
      this.panel.calculateMultiCheckedValue();
    },
    isInPath: function isInPath(pathNodes) {
      var node = this.node;
      var selectedPathNode = pathNodes[node.level - 1] || {};
      return selectedPathNode.uid === node.uid;
    },
    renderPrefix: function renderPrefix(h) {
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
    renderPostfix: function renderPostfix(h) {
      var node = this.node,
        isLeaf = this.isLeaf;
      if (node.loading) {
        return this.renderLoadingIcon(h);
      } else if (!isLeaf) {
        return this.renderExpandIcon(h);
      }
      return null;
    },
    renderCheckbox: function renderCheckbox(h) {
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
    renderRadio: function renderRadio(h) {
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
    renderCheckIcon: function renderCheckIcon(h) {
      return h("i", {
        "class": "el-icon-check el-cascader-node__prefix"
      });
    },
    renderLoadingIcon: function renderLoadingIcon(h) {
      return h("i", {
        "class": "el-icon-loading el-cascader-node__postfix"
      });
    },
    renderExpandIcon: function renderExpandIcon(h) {
      return h("i", {
        "class": "el-icon-arrow-right el-cascader-node__postfix"
      });
    },
    renderContent: function renderContent(h) {
      var panel = this.panel,
        node = this.node;
      var render = panel.renderLabelFn;
      var vnode = render ? render({
        node: node,
        data: node.data
      }) : null;
      return h("span", {
        "class": "el-cascader-node__label"
      }, [vnode || node.label]);
    }
  },
  render: function render(h) {
    var _this3 = this;
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
      events.on.mouseenter = function (e) {
        _this3.handleExpand();
        _this3.$emit('expand', e);
      };
      events.on.focus = function (e) {
        _this3.handleExpand();
        _this3.$emit('expand', e);
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

var __vue_component__$2 = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var script$1 = {
  name: 'ElCascaderMenu',
  mixins: [Locale],
  inject: ['panel'],
  components: {
    ElScrollbar: ElScrollbar,
    CascaderNode: __vue_component__$2
  },
  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number
  },
  data: function data() {
    return {
      activeNode: null,
      hoverTimer: null,
      id: generateId()
    };
  },
  computed: {
    isEmpty: function isEmpty() {
      return !this.nodes.length;
    },
    menuId: function menuId() {
      return "cascader-menu-".concat(this.id, "-").concat(this.index);
    }
  },
  methods: {
    handleExpand: function handleExpand(e) {
      this.activeNode = e.target;
    },
    handleMouseMove: function handleMouseMove(e) {
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
        hoverZone.innerHTML = "\n          <path style=\"pointer-events: auto;\" fill=\"transparent\" d=\"M".concat(startX, " ").concat(top, " L").concat(offsetWidth, " 0 V").concat(top, " Z\" />\n          <path style=\"pointer-events: auto;\" fill=\"transparent\" d=\"M").concat(startX, " ").concat(bottom, " L").concat(offsetWidth, " ").concat(offsetHeight, " V").concat(bottom, " Z\" />\n        ");
      } else if (!hoverTimer) {
        this.hoverTimer = setTimeout(this.clearHoverZone, this.panel.config.hoverThreshold);
      }
    },
    clearHoverZone: function clearHoverZone() {
      var hoverZone = this.$refs.hoverZone;
      if (!hoverZone) return;
      hoverZone.innerHTML = '';
    },
    renderEmptyText: function renderEmptyText(h) {
      return h("div", {
        "class": "el-cascader-menu__empty-text"
      }, [this.t('el.cascader.noData')]);
    },
    renderNodeList: function renderNodeList(h) {
      var menuId = this.menuId;
      var isHoverMenu = this.panel.isHoverMenu;
      var events = {
        on: {}
      };
      if (isHoverMenu) {
        events.on.expand = this.handleExpand;
      }
      var nodes = this.nodes.map(function (node, index) {
        var hasChildren = node.hasChildren;
        return h("cascader-node", helper([{
          "key": node.uid,
          "attrs": {
            "node": node,
            "node-id": "".concat(menuId, "-").concat(index),
            "aria-haspopup": hasChildren,
            "aria-owns": hasChildren ? menuId : null
          }
        }, events]));
      });
      return [].concat(_toConsumableArray(nodes), [isHoverMenu ? h("svg", {
        "ref": 'hoverZone',
        "class": 'el-cascader-menu__hover-zone'
      }) : null]);
    }
  },
  render: function render(h) {
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var uid = 0;
var Node = /*#__PURE__*/function () {
  function Node(data, config, parentNode) {
    _classCallCheck(this, Node);
    this.data = data;
    this.config = config;
    this.parent = parentNode || null;
    this.level = !this.parent ? 1 : this.parent.level + 1;
    this.uid = uid++;
    this.initState();
    this.initChildren();
  }
  return _createClass(Node, [{
    key: "initState",
    value: function initState() {
      var _this$config = this.config,
        valueKey = _this$config.value,
        labelKey = _this$config.label;
      this.value = this.data[valueKey];
      this.label = this.data[labelKey];
      this.pathNodes = this.calculatePathNodes();
      this.path = this.pathNodes.map(function (node) {
        return node.value;
      });
      this.pathLabels = this.pathNodes.map(function (node) {
        return node.label;
      });

      // lazy load
      this.loading = false;
      this.loaded = false;
    }
  }, {
    key: "initChildren",
    value: function initChildren() {
      var _this = this;
      var config = this.config;
      var childrenKey = config.children;
      var childrenData = this.data[childrenKey];
      this.hasChildren = Array.isArray(childrenData);
      this.children = (childrenData || []).map(function (child) {
        return new Node(child, config, _this);
      });
    }
  }, {
    key: "isDisabled",
    get: function get() {
      var data = this.data,
        parent = this.parent,
        config = this.config;
      var disabledKey = config.disabled;
      var checkStrictly = config.checkStrictly;
      return data[disabledKey] || !checkStrictly && parent && parent.isDisabled;
    }
  }, {
    key: "isLeaf",
    get: function get() {
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
  }, {
    key: "calculatePathNodes",
    value: function calculatePathNodes() {
      var nodes = [this];
      var parent = this.parent;
      while (parent) {
        nodes.unshift(parent);
        parent = parent.parent;
      }
      return nodes;
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.path;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }, {
    key: "getValueByOption",
    value: function getValueByOption() {
      return this.config.emitPath ? this.getPath() : this.getValue();
    }
  }, {
    key: "getText",
    value: function getText(allLevels, separator) {
      return allLevels ? this.pathLabels.join(separator) : this.label;
    }
  }, {
    key: "isSameNode",
    value: function isSameNode(checkedValue) {
      var value = this.getValueByOption();
      return this.config.multiple && Array.isArray(checkedValue) ? checkedValue.some(function (val) {
        return isEqual(val, value);
      }) : isEqual(checkedValue, value);
    }
  }, {
    key: "broadcast",
    value: function broadcast(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var handlerName = "onParent".concat(capitalize(event));
      this.children.forEach(function (child) {
        if (child) {
          // bottom up
          child.broadcast.apply(child, [event].concat(args));
          child[handlerName] && child[handlerName].apply(child, args);
        }
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var parent = this.parent;
      var handlerName = "onChild".concat(capitalize(event));
      if (parent) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        parent[handlerName] && parent[handlerName].apply(parent, args);
        parent.emit.apply(parent, [event].concat(args));
      }
    }
  }, {
    key: "onParentCheck",
    value: function onParentCheck(checked) {
      if (!this.isDisabled) {
        this.setCheckState(checked);
      }
    }
  }, {
    key: "onChildCheck",
    value: function onChildCheck() {
      var children = this.children;
      var validChildren = children.filter(function (child) {
        return !child.isDisabled;
      });
      var checked = validChildren.length ? validChildren.every(function (child) {
        return child.checked;
      }) : false;
      this.setCheckState(checked);
    }
  }, {
    key: "setCheckState",
    value: function setCheckState(checked) {
      var totalNum = this.children.length;
      var checkedNum = this.children.reduce(function (c, p) {
        var num = p.checked ? 1 : p.indeterminate ? 0.5 : 0;
        return c + num;
      }, 0);
      this.checked = checked;
      this.indeterminate = checkedNum !== totalNum && checkedNum > 0;
    }
  }, {
    key: "syncCheckState",
    value: function syncCheckState(checkedValue) {
      var value = this.getValueByOption();
      var checked = this.isSameNode(checkedValue, value);
      this.doCheck(checked);
    }
  }, {
    key: "doCheck",
    value: function doCheck(checked) {
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
  }]);
}();

var _flatNodes = function flatNodes(data, leafOnly) {
  return data.reduce(function (res, node) {
    if (node.isLeaf) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(_flatNodes(node.children, leafOnly));
    }
    return res;
  }, []);
};
var Store = /*#__PURE__*/function () {
  function Store(data, config) {
    _classCallCheck(this, Store);
    this.config = config;
    this.initNodes(data);
  }
  return _createClass(Store, [{
    key: "initNodes",
    value: function initNodes(data) {
      var _this = this;
      data = coerceTruthyValueToArray(data);
      this.nodes = data.map(function (nodeData) {
        return new Node(nodeData, _this.config);
      });
      this.flattedNodes = this.getFlattedNodes(false, false);
      this.leafNodes = this.getFlattedNodes(true, false);
    }
  }, {
    key: "appendNode",
    value: function appendNode(nodeData, parentNode) {
      var node = new Node(nodeData, this.config, parentNode);
      var children = parentNode ? parentNode.children : this.nodes;
      children.push(node);
    }
  }, {
    key: "appendNodes",
    value: function appendNodes(nodeDataList, parentNode) {
      var _this2 = this;
      nodeDataList = coerceTruthyValueToArray(nodeDataList);
      nodeDataList.forEach(function (nodeData) {
        return _this2.appendNode(nodeData, parentNode);
      });
    }
  }, {
    key: "getNodes",
    value: function getNodes() {
      return this.nodes;
    }
  }, {
    key: "getFlattedNodes",
    value: function getFlattedNodes(leafOnly) {
      var cached = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var cachedNodes = leafOnly ? this.leafNodes : this.flattedNodes;
      return cached ? cachedNodes : _flatNodes(this.nodes, leafOnly);
    }
  }, {
    key: "getNodeByValue",
    value: function getNodeByValue(value) {
      var nodes = this.getFlattedNodes(false, !this.config.lazy).filter(function (node) {
        return valueEquals(node.path, value) || node.value === value;
      });
      return nodes && nodes.length ? nodes[0] : null;
    }
  }]);
}();

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
var isLeaf = function isLeaf(el) {
  return !el.getAttribute('aria-owns');
};
var getSibling = function getSibling(el, distance) {
  var parentNode = el.parentNode;
  if (parentNode) {
    var siblings = parentNode.querySelectorAll('.el-cascader-node[tabindex="-1"]');
    var index = Array.prototype.indexOf.call(siblings, el);
    return siblings[index + distance] || null;
  }
  return null;
};
var getMenuIndex = function getMenuIndex(el, distance) {
  if (!el) return;
  var pieces = el.id.split('-');
  return Number(pieces[pieces.length - 2]);
};
var focusNode = function focusNode(el) {
  if (!el) return;
  el.focus();
  !isLeaf(el) && el.click();
};
var checkNode = function checkNode(el) {
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
  provide: function provide() {
    return {
      panel: this
    };
  },
  data: function data() {
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
    config: function config() {
      return merge(_objectSpread2({}, DefaultProps), this.props || {});
    },
    multiple: function multiple() {
      return this.config.multiple;
    },
    checkStrictly: function checkStrictly() {
      return this.config.checkStrictly;
    },
    leafOnly: function leafOnly() {
      return !this.checkStrictly;
    },
    isHoverMenu: function isHoverMenu() {
      return this.config.expandTrigger === 'hover';
    },
    renderLabelFn: function renderLabelFn() {
      return this.renderLabel || this.$scopedSlots.default;
    }
  },
  watch: {
    value: function value() {
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
    checkedValue: function checkedValue(val) {
      if (!isEqual(val, this.value)) {
        this.checkStrictly && this.calculateCheckedNodePaths();
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  },
  mounted: function mounted() {
    if (!this.isEmptyValue(this.value)) {
      this.syncCheckedValue();
    }
  },
  methods: {
    initStore: function initStore() {
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
    syncCheckedValue: function syncCheckedValue() {
      var value = this.value,
        checkedValue = this.checkedValue;
      if (!isEqual(value, checkedValue)) {
        this.activePath = [];
        this.checkedValue = value;
        this.syncMenuState();
      }
    },
    syncMenuState: function syncMenuState() {
      var multiple = this.multiple,
        checkStrictly = this.checkStrictly;
      this.syncActivePath();
      multiple && this.syncMultiCheckState();
      checkStrictly && this.calculateCheckedNodePaths();
      this.$nextTick(this.scrollIntoView);
    },
    syncMultiCheckState: function syncMultiCheckState() {
      var _this = this;
      var nodes = this.getFlattedNodes(this.leafOnly);
      nodes.forEach(function (node) {
        node.syncCheckState(_this.checkedValue);
      });
    },
    isEmptyValue: function isEmptyValue(val) {
      var multiple = this.multiple,
        config = this.config;
      var emitPath = config.emitPath;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    syncActivePath: function syncActivePath() {
      var _this2 = this;
      var store = this.store,
        multiple = this.multiple,
        activePath = this.activePath,
        checkedValue = this.checkedValue;
      if (!isEmpty(activePath)) {
        var nodes = activePath.map(function (node) {
          return _this2.getNodeByValue(node.getValue());
        });
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
    expandNodes: function expandNodes(nodes) {
      var _this3 = this;
      nodes.forEach(function (node) {
        return _this3.handleExpand(node, true /* silent */);
      });
    },
    calculateCheckedNodePaths: function calculateCheckedNodePaths() {
      var _this4 = this;
      var checkedValue = this.checkedValue,
        multiple = this.multiple;
      var checkedValues = multiple ? coerceTruthyValueToArray(checkedValue) : [checkedValue];
      this.checkedNodePaths = checkedValues.map(function (v) {
        var checkedNode = _this4.getNodeByValue(v);
        return checkedNode ? checkedNode.pathNodes : [];
      });
    },
    handleKeyDown: function handleKeyDown(e) {
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
    handleExpand: function handleExpand(node, silent) {
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
        var pathValues = path.map(function (node) {
          return node.getValue();
        });
        var activePathValues = activePath.map(function (node) {
          return node.getValue();
        });
        if (!valueEquals(pathValues, activePathValues)) {
          this.$emit('active-item-change', pathValues); // Deprecated
          this.$emit('expand-change', pathValues);
        }
      }
    },
    handleCheckChange: function handleCheckChange(value) {
      this.checkedValue = value;
    },
    lazyLoad: function lazyLoad(node, onFullfiled) {
      var _this5 = this;
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
      var resolve = function resolve(dataList) {
        var parent = node.root ? null : node;
        dataList && dataList.length && _this5.store.appendNodes(dataList, parent);
        node.loading = false;
        node.loaded = true;

        // dispose default value on lazy load mode
        if (Array.isArray(_this5.checkedValue)) {
          var nodeValue = _this5.checkedValue[_this5.loadCount++];
          var valueKey = _this5.config.value;
          var leafKey = _this5.config.leaf;
          if (Array.isArray(dataList) && dataList.filter(function (item) {
            return item[valueKey] === nodeValue;
          }).length > 0) {
            var checkedNode = _this5.store.getNodeByValue(nodeValue);
            if (!checkedNode.data[leafKey]) {
              _this5.lazyLoad(checkedNode, function () {
                _this5.handleExpand(checkedNode);
              });
            }
            if (_this5.loadCount === _this5.checkedValue.length) {
              _this5.$parent.computePresentText();
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
    calculateMultiCheckedValue: function calculateMultiCheckedValue() {
      this.checkedValue = this.getCheckedNodes(this.leafOnly).map(function (node) {
        return node.getValueByOption();
      });
    },
    scrollIntoView: function scrollIntoView() {
      if (this.$isServer) return;
      var menus = this.$refs.menu || [];
      menus.forEach(function (menu) {
        var menuElement = menu.$el;
        if (menuElement) {
          var container = menuElement.querySelector('.el-scrollbar__wrap');
          var activeNode = menuElement.querySelector('.el-cascader-node.is-active') || menuElement.querySelector('.el-cascader-node.in-active-path');
          _scrollIntoView(container, activeNode);
        }
      });
    },
    getNodeByValue: function getNodeByValue(val) {
      return this.store.getNodeByValue(val);
    },
    getFlattedNodes: function getFlattedNodes(leafOnly) {
      var cached = !this.config.lazy;
      return this.store.getFlattedNodes(leafOnly, cached);
    },
    getCheckedNodes: function getCheckedNodes(leafOnly) {
      var checkedValue = this.checkedValue,
        multiple = this.multiple;
      if (multiple) {
        var nodes = this.getFlattedNodes(leafOnly);
        return nodes.filter(function (node) {
          return node.checked;
        });
      } else {
        return this.isEmptyValue(checkedValue) ? [] : [this.getNodeByValue(checkedValue)];
      }
    },
    clearCheckedNodes: function clearCheckedNodes() {
      var config = this.config,
        leafOnly = this.leafOnly;
      var multiple = config.multiple,
        emitPath = config.emitPath;
      if (multiple) {
        this.getCheckedNodes(leafOnly).filter(function (node) {
          return !node.isDisabled;
        }).forEach(function (node) {
          return node.doCheck(false);
        });
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
