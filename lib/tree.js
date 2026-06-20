import merge from './utils/merge.js';
import { arrayFindIndex } from './utils/util.js';
import CollapseTransition from './transitions/collapse-transition.js';
import __vue_component__$2 from './checkbox.js';
import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import { t } from './locale/index.js';
import { removeClass, addClass } from './utils/dom.js';
import 'vue';
import './utils/types.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';

var NODE_KEY = '$treeNodeId';
var markNodeData = function markNodeData(node, data) {
  if (!data || data[NODE_KEY]) return;
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false
  });
};
var getNodeKey = function getNodeKey(key, data) {
  if (!key) return data[NODE_KEY];
  return data[key];
};
var findNearestComponent = (element, componentName) => {
  var target = element;
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__;
    }
    target = target.parentNode;
  }
  return null;
};

var getChildState = node => {
  var all = true;
  var none = true;
  var allWithoutDisable = true;
  for (var i = 0, j = node.length; i < j; i++) {
    var n = node[i];
    if (n.checked !== true || n.indeterminate) {
      all = false;
      if (!n.disabled) {
        allWithoutDisable = false;
      }
    }
    if (n.checked !== false || n.indeterminate) {
      none = false;
    }
  }
  return {
    all,
    none,
    allWithoutDisable,
    half: !all && !none
  };
};
var _reInitChecked = function reInitChecked(node) {
  if (node.childNodes.length === 0 || node.loading) return;
  var _getChildState = getChildState(node.childNodes),
    all = _getChildState.all,
    none = _getChildState.none,
    half = _getChildState.half;
  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }
  var parent = node.parent;
  if (!parent || parent.level === 0) return;
  if (!node.store.checkStrictly) {
    _reInitChecked(parent);
  }
};
var getPropertyFromData = function getPropertyFromData(node, prop) {
  var props = node.store.props;
  var data = node.data || {};
  var config = props[prop];
  if (typeof config === 'function') {
    return config(data, node);
  } else if (typeof config === 'string') {
    return data[config];
  } else if (typeof config === 'undefined') {
    var dataProp = data[prop];
    return dataProp === undefined ? '' : dataProp;
  }
};
var nodeIdSeed = 0;
class Node {
  constructor(options) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    this.indeterminate = false;
    this.data = null;
    this.expanded = false;
    this.parent = null;
    this.visible = true;
    this.isCurrent = false;
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    // internal
    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;
    if (this.parent) {
      this.level = this.parent.level + 1;
    }
    var store = this.store;
    if (!store) {
      throw new Error('[Node]store is required!');
    }
    store.registerNode(this);
    var props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {
      var isLeaf = getPropertyFromData(this, 'isLeaf');
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }
    if (store.lazy !== true && this.data) {
      this.setData(this.data);
      if (store.defaultExpandAll) {
        this.expanded = true;
      }
    } else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
      this.expand();
    }
    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }
    if (!this.data) return;
    var defaultExpandedKeys = store.defaultExpandedKeys;
    var key = store.key;
    if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
      this.expand(null, store.autoExpandParent);
    }
    if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }
    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }
    this.updateLeafState();
  }
  setData(data) {
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }
    this.data = data;
    this.childNodes = [];
    var children;
    if (this.level === 0 && this.data instanceof Array) {
      children = this.data;
    } else {
      children = getPropertyFromData(this, 'children') || [];
    }
    for (var i = 0, j = children.length; i < j; i++) {
      this.insertChild({
        data: children[i]
      });
    }
  }
  get label() {
    return getPropertyFromData(this, 'label');
  }
  get key() {
    var nodeKey = this.store.key;
    if (this.data) return this.data[nodeKey];
    return null;
  }
  get disabled() {
    return getPropertyFromData(this, 'disabled');
  }
  get nextSibling() {
    var parent = this.parent;
    if (parent) {
      var index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return parent.childNodes[index + 1];
      }
    }
    return null;
  }
  get previousSibling() {
    var parent = this.parent;
    if (parent) {
      var index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index > 0 ? parent.childNodes[index - 1] : null;
      }
    }
    return null;
  }
  contains(target, deep = true) {
    var _walk = function walk(parent) {
      var children = parent.childNodes || [];
      var result = false;
      for (var i = 0, j = children.length; i < j; i++) {
        var child = children[i];
        if (child === target || deep && _walk(child)) {
          result = true;
          break;
        }
      }
      return result;
    };
    return _walk(this);
  }
  remove() {
    var parent = this.parent;
    if (parent) {
      parent.removeChild(this);
    }
  }
  insertChild(child, index, batch) {
    if (!child) throw new Error('insertChild error: child is required.');
    if (!(child instanceof Node)) {
      if (!batch) {
        var children = this.getChildren(true) || [];
        if (children.indexOf(child.data) === -1) {
          if (typeof index === 'undefined' || index < 0) {
            children.push(child.data);
          } else {
            children.splice(index, 0, child.data);
          }
        }
      }
      merge(child, {
        parent: this,
        store: this.store
      });
      child = new Node(child);
    }
    child.level = this.level + 1;
    if (typeof index === 'undefined' || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }
    this.updateLeafState();
  }
  insertBefore(child, ref) {
    var index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }
  insertAfter(child, ref) {
    var index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }
  removeChild(child) {
    var children = this.getChildren() || [];
    var dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }
    var index = this.childNodes.indexOf(child);
    if (index > -1) {
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }
    this.updateLeafState();
  }
  removeChildByData(data) {
    var targetNode = null;
    for (var i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].data === data) {
        targetNode = this.childNodes[i];
        break;
      }
    }
    if (targetNode) {
      this.removeChild(targetNode);
    }
  }
  expand(callback, expandParent) {
    var done = () => {
      if (expandParent) {
        var parent = this.parent;
        while (parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) callback();
    };
    if (this.shouldLoadData()) {
      this.loadData(data => {
        if (data instanceof Array) {
          if (this.checked) {
            this.setChecked(true, true);
          } else if (!this.store.checkStrictly) {
            _reInitChecked(this);
          }
          done();
        }
      });
    } else {
      done();
    }
  }
  doCreateChildren(array, defaultProps = {}) {
    array.forEach(item => {
      this.insertChild(merge({
        data: item
      }, defaultProps), undefined, true);
    });
  }
  collapse() {
    this.expanded = false;
  }
  shouldLoadData() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  }
  updateLeafState() {
    if (this.store.lazy === true && this.loaded !== true && typeof this.isLeafByUser !== 'undefined') {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    var childNodes = this.childNodes;
    if (!this.store.lazy || this.store.lazy === true && this.loaded === true) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    this.isLeaf = false;
  }
  setChecked(value, deep, recursion, passValue) {
    this.indeterminate = value === 'half';
    this.checked = value === true;
    if (this.store.checkStrictly) return;
    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      var _getChildState2 = getChildState(this.childNodes),
        all = _getChildState2.all,
        allWithoutDisable = _getChildState2.allWithoutDisable;
      if (!this.isLeaf && !all && allWithoutDisable) {
        this.checked = false;
        value = false;
      }
      var handleDescendants = () => {
        if (deep) {
          var childNodes = this.childNodes;
          for (var i = 0, j = childNodes.length; i < j; i++) {
            var child = childNodes[i];
            passValue = passValue || value !== false;
            var isCheck = child.disabled ? child.checked : passValue;
            child.setChecked(isCheck, deep, true, passValue);
          }
          var _getChildState3 = getChildState(childNodes),
            half = _getChildState3.half,
            _all = _getChildState3.all;
          if (!_all) {
            this.checked = _all;
            this.indeterminate = half;
          }
        }
      };
      if (this.shouldLoadData()) {
        // Only work on lazy load data.
        this.loadData(() => {
          handleDescendants();
          _reInitChecked(this);
        }, {
          checked: value !== false
        });
        return;
      } else {
        handleDescendants();
      }
    }
    var parent = this.parent;
    if (!parent || parent.level === 0) return;
    if (!recursion) {
      _reInitChecked(parent);
    }
  }
  getChildren(forceInit = false) {
    // this is data
    if (this.level === 0) return this.data;
    var data = this.data;
    if (!data) return null;
    var props = this.store.props;
    var children = 'children';
    if (props) {
      children = props.children || 'children';
    }
    if (data[children] === undefined) {
      data[children] = null;
    }
    if (forceInit && !data[children]) {
      data[children] = [];
    }
    return data[children];
  }
  updateChildren() {
    var newData = this.getChildren() || [];
    var oldData = this.childNodes.map(node => node.data);
    var newDataMap = {};
    var newNodes = [];
    newData.forEach((item, index) => {
      var key = item[NODE_KEY];
      var isNodeExists = !!key && arrayFindIndex(oldData, data => data[NODE_KEY] === key) >= 0;
      if (isNodeExists) {
        newDataMap[key] = {
          index,
          data: item
        };
      } else {
        newNodes.push({
          index,
          data: item
        });
      }
    });
    if (!this.store.lazy) {
      oldData.forEach(item => {
        if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
      });
    }
    newNodes.forEach(({
      index,
      data
    }) => {
      this.insertChild({
        data
      }, index);
    });
    this.updateLeafState();
  }
  loadData(callback, defaultProps = {}) {
    if (this.store.lazy === true && this.store.load && !this.loaded && (!this.loading || Object.keys(defaultProps).length)) {
      this.loading = true;
      var resolve = children => {
        this.childNodes = [];
        this.doCreateChildren(children, defaultProps);
        this.loaded = true;
        this.loading = false;
        this.updateLeafState();
        if (callback) {
          callback.call(this, children);
        }
      };
      this.store.load(this, resolve);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  }
}

class TreeStore {
  constructor(options) {
    this.currentNode = null;
    this.currentNodeKey = null;
    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    this.nodesMap = {};
    this.root = new Node({
      data: this.data,
      store: this
    });
    if (this.lazy && this.load) {
      var loadFn = this.load;
      loadFn(this.root, data => {
        this.root.doCreateChildren(data);
        this._initDefaultCheckedNodes();
      });
    } else {
      this._initDefaultCheckedNodes();
    }
  }
  filter(value) {
    var filterNodeMethod = this.filterNodeMethod;
    var lazy = this.lazy;
    var _traverse = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;
      childNodes.forEach(child => {
        child.visible = filterNodeMethod.call(child, value, child.data, child);
        _traverse(child);
      });
      if (!node.visible && childNodes.length) {
        var allHidden = true;
        allHidden = !childNodes.some(child => child.visible);
        if (node.root) {
          node.root.visible = allHidden === false;
        } else {
          node.visible = allHidden === false;
        }
      }
      if (!value) return;
      if (node.visible && !node.isLeaf && !lazy) node.expand();
    };
    _traverse(this);
  }
  setData(newVal) {
    var instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
    } else {
      this.root.updateChildren();
    }
  }
  getNode(data) {
    if (data instanceof Node) return data;
    var key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
    return this.nodesMap[key] || null;
  }
  insertBefore(data, refData) {
    var refNode = this.getNode(refData);
    refNode.parent.insertBefore({
      data
    }, refNode);
  }
  insertAfter(data, refData) {
    var refNode = this.getNode(refData);
    refNode.parent.insertAfter({
      data
    }, refNode);
  }
  remove(data) {
    var node = this.getNode(data);
    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
  }
  append(data, parentData) {
    var parentNode = parentData ? this.getNode(parentData) : this.root;
    if (parentNode) {
      parentNode.insertChild({
        data
      });
    }
  }
  _initDefaultCheckedNodes() {
    var defaultCheckedKeys = this.defaultCheckedKeys || [];
    var nodesMap = this.nodesMap;
    defaultCheckedKeys.forEach(checkedKey => {
      var node = nodesMap[checkedKey];
      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }
  _initDefaultCheckedNode(node) {
    var defaultCheckedKeys = this.defaultCheckedKeys || [];
    if (defaultCheckedKeys.indexOf(node.key) !== -1) {
      node.setChecked(true, !this.checkStrictly);
    }
  }
  setDefaultCheckedKey(newVal) {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
    }
  }
  registerNode(node) {
    var key = this.key;
    if (!key || !node || !node.data) return;
    var nodeKey = node.key;
    if (nodeKey !== undefined) this.nodesMap[node.key] = node;
  }
  deregisterNode(node) {
    var key = this.key;
    if (!key || !node || !node.data) return;
    node.childNodes.forEach(child => {
      this.deregisterNode(child);
    });
    delete this.nodesMap[node.key];
  }
  getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    var checkedNodes = [];
    var _traverse2 = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;
      childNodes.forEach(child => {
        if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          checkedNodes.push(child.data);
        }
        _traverse2(child);
      });
    };
    _traverse2(this);
    return checkedNodes;
  }
  getCheckedKeys(leafOnly = false) {
    return this.getCheckedNodes(leafOnly).map(data => (data || {})[this.key]);
  }
  getHalfCheckedNodes() {
    var nodes = [];
    var _traverse3 = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;
      childNodes.forEach(child => {
        if (child.indeterminate) {
          nodes.push(child.data);
        }
        _traverse3(child);
      });
    };
    _traverse3(this);
    return nodes;
  }
  getHalfCheckedKeys() {
    return this.getHalfCheckedNodes().map(data => (data || {})[this.key]);
  }
  _getAllNodes() {
    var allNodes = [];
    var nodesMap = this.nodesMap;
    for (var nodeKey in nodesMap) {
      if (nodesMap.hasOwnProperty(nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }
    return allNodes;
  }
  updateChildren(key, data) {
    var node = this.nodesMap[key];
    if (!node) return;
    var childNodes = node.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
      var child = childNodes[i];
      this.remove(child.data);
    }
    for (var _i = 0, j = data.length; _i < j; _i++) {
      var _child = data[_i];
      this.append(_child, node.data);
    }
  }
  _setCheckedKeys(key, leafOnly = false, checkedKeys) {
    var _this = this;
    var allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
    var cache = Object.create(null);
    var keys = Object.keys(checkedKeys);
    allNodes.forEach(node => node.setChecked(false, false));
    var _loop = function _loop() {
        var node = allNodes[i];
        var nodeKey = node.data[key].toString();
        var checked = keys.indexOf(nodeKey) > -1;
        if (!checked) {
          if (node.checked && !cache[nodeKey]) {
            node.setChecked(false, false);
          }
          return 0; // continue
        }
        var parent = node.parent;
        while (parent && parent.level > 0) {
          cache[parent.data[key]] = true;
          parent = parent.parent;
        }
        if (node.isLeaf || _this.checkStrictly) {
          node.setChecked(true, false);
          return 0; // continue
        }
        node.setChecked(true, true);
        if (leafOnly) {
          node.setChecked(false, false);
          var _traverse4 = function traverse(node) {
            var childNodes = node.childNodes;
            childNodes.forEach(child => {
              if (!child.isLeaf) {
                child.setChecked(false, false);
              }
              _traverse4(child);
            });
          };
          _traverse4(node);
        }
      },
      _ret;
    for (var i = 0, j = allNodes.length; i < j; i++) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
  }
  setCheckedNodes(array, leafOnly = false) {
    var key = this.key;
    var checkedKeys = {};
    array.forEach(item => {
      checkedKeys[(item || {})[key]] = true;
    });
    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }
  setCheckedKeys(keys, leafOnly = false) {
    this.defaultCheckedKeys = keys;
    var key = this.key;
    var checkedKeys = {};
    keys.forEach(key => {
      checkedKeys[key] = true;
    });
    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }
  setDefaultExpandedKeys(keys) {
    keys = keys || [];
    this.defaultExpandedKeys = keys;
    keys.forEach(key => {
      var node = this.getNode(key);
      if (node) node.expand(null, this.autoExpandParent);
    });
  }
  setChecked(data, checked, deep) {
    var node = this.getNode(data);
    if (node) {
      node.setChecked(!!checked, deep);
    }
  }
  getCurrentNode() {
    return this.currentNode;
  }
  setCurrentNode(currentNode) {
    var prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  }
  setUserCurrentNode(node) {
    var key = node[this.key];
    var currNode = this.nodesMap[key];
    this.setCurrentNode(currNode);
  }
  setCurrentNodeKey(key) {
    if (key === null || key === undefined) {
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;
      return;
    }
    var node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
    }
  }
}

//
var script$1 = {
  name: 'ElTreeNode',
  componentName: 'ElTreeNode',
  mixins: [emitter],
  props: {
    node: {
      default() {
        return {};
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElCollapseTransition: CollapseTransition,
    ElCheckbox: __vue_component__$2,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        var parent = this.$parent;
        var tree = parent.tree;
        var node = this.node;
        var data = node.data,
          store = node.store;
        return parent.renderContent ? parent.renderContent.call(parent._renderProxy, h, {
          _self: tree.$vnode.context,
          node,
          data,
          store
        }) : tree.$scopedSlots.default ? tree.$scopedSlots.default({
          node,
          data
        }) : h("span", {
          "class": "el-tree-node__label"
        }, [node.label]);
      }
    }
  },
  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },
  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val);
    },
    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },
    'node.expanded'(val) {
      this.$nextTick(() => this.expanded = val);
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },
  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data);
    },
    handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },
    handleClick() {
      var store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: {
            checked: !this.node.checked
          }
        });
      }
      this.tree.$emit('node-click', this.node.data, this.node, this);
    },
    handleContextMenu(event) {
      if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this);
    },
    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit('node-expand', this.node.data, this.node, this);
      }
    },
    handleCheckChange(value, ev) {
      this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      this.$nextTick(() => {
        var store = this.tree.store;
        this.tree.$emit('check', this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        });
      });
    },
    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.tree.$emit('node-expand', nodeData, node, instance);
    },
    handleDragStart(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-start', event, this);
    },
    handleDragOver(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-over', event, this);
      event.preventDefault();
    },
    handleDrop(event) {
      event.preventDefault();
    },
    handleDragEnd(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-end', event, this);
    }
  },
  created() {
    var parent = this.$parent;
    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }
    var tree = this.tree;
    if (!tree) {
      console.warn('Can not find node\'s tree.');
    }
    var props = tree.props || {};
    var childrenKey = props['children'] || 'children';
    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });
    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }
    if (this.tree.accordion) {
      this.$on('tree-node-expand', node => {
        if (this.node !== node) {
          this.node.collapse();
        }
      });
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var this$1$1 = this;
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.node.visible,
      expression: "node.visible"
    }],
    ref: "node",
    staticClass: "el-tree-node",
    class: {
      "is-expanded": _vm.expanded,
      "is-current": _vm.node.isCurrent,
      "is-hidden": !_vm.node.visible,
      "is-focusable": !_vm.node.disabled,
      "is-checked": !_vm.node.disabled && _vm.node.checked
    },
    attrs: {
      role: "treeitem",
      tabindex: "-1",
      "aria-expanded": _vm.expanded,
      "aria-disabled": _vm.node.disabled,
      "aria-checked": _vm.node.checked,
      draggable: _vm.tree.draggable
    },
    on: {
      click: function click($event) {
        $event.stopPropagation();
        return _vm.handleClick($event);
      },
      contextmenu: function contextmenu($event) {
        return this$1$1.handleContextMenu($event);
      },
      dragstart: function dragstart($event) {
        $event.stopPropagation();
        return _vm.handleDragStart($event);
      },
      dragover: function dragover($event) {
        $event.stopPropagation();
        return _vm.handleDragOver($event);
      },
      dragend: function dragend($event) {
        $event.stopPropagation();
        return _vm.handleDragEnd($event);
      },
      drop: function drop($event) {
        $event.stopPropagation();
        return _vm.handleDrop($event);
      }
    }
  }, [_c("div", {
    staticClass: "el-tree-node__content",
    style: {
      "padding-left": (_vm.node.level - 1) * _vm.tree.indent + "px"
    }
  }, [_c("span", {
    class: [{
      "is-leaf": _vm.node.isLeaf,
      expanded: !_vm.node.isLeaf && _vm.expanded
    }, "el-tree-node__expand-icon", _vm.tree.iconClass ? _vm.tree.iconClass : "el-icon-caret-right"],
    on: {
      click: function click($event) {
        $event.stopPropagation();
        return _vm.handleExpandIconClick($event);
      }
    }
  }), _vm._v(" "), _vm.showCheckbox ? _c("el-checkbox", {
    attrs: {
      indeterminate: _vm.node.indeterminate,
      disabled: !!_vm.node.disabled
    },
    on: {
      change: _vm.handleCheckChange
    },
    nativeOn: {
      click: function click($event) {
        $event.stopPropagation();
      }
    },
    model: {
      value: _vm.node.checked,
      callback: function callback($$v) {
        _vm.$set(_vm.node, "checked", $$v);
      },
      expression: "node.checked"
    }
  }) : _vm._e(), _vm._v(" "), _vm.node.loading ? _c("span", {
    staticClass: "el-tree-node__loading-icon el-icon-loading"
  }) : _vm._e(), _vm._v(" "), _c("node-content", {
    attrs: {
      node: _vm.node
    }
  })], 1), _vm._v(" "), _c("el-collapse-transition", [!_vm.renderAfterExpand || _vm.childNodeRendered ? _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.expanded,
      expression: "expanded"
    }],
    staticClass: "el-tree-node__children",
    attrs: {
      role: "group",
      "aria-expanded": _vm.expanded
    }
  }, _vm._l(_vm.node.childNodes, function (child) {
    return _c("el-tree-node", {
      key: _vm.getNodeKey(child),
      attrs: {
        "render-content": _vm.renderContent,
        "render-after-expand": _vm.renderAfterExpand,
        "show-checkbox": _vm.showCheckbox,
        node: child
      },
      on: {
        "node-expand": _vm.handleChildNodeExpand
      }
    });
  }), 1) : _vm._e()])], 1);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: 'ElTree',
  mixins: [emitter],
  components: {
    ElTreeNode: __vue_component__$1
  },
  data() {
    return {
      store: null,
      root: null,
      currentNode: null,
      treeItems: null,
      checkboxItems: [],
      dragState: {
        showDropIndicator: false,
        draggingNode: null,
        dropNode: null,
        allowDrop: true
      }
    };
  },
  props: {
    data: {
      type: Array
    },
    emptyText: {
      type: String,
      default() {
        return t('el.tree.emptyText');
      }
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        };
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    iconClass: String
  },
  computed: {
    children: {
      set(value) {
        this.data = value;
      },
      get() {
        return this.data;
      }
    },
    treeItemArray() {
      return Array.prototype.slice.call(this.treeItems);
    },
    isEmpty() {
      var childNodes = this.root.childNodes;
      return !childNodes || childNodes.length === 0 || childNodes.every(({
        visible
      }) => !visible);
    }
  },
  watch: {
    defaultCheckedKeys(newVal) {
      this.store.setDefaultCheckedKey(newVal);
    },
    defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal;
      this.store.setDefaultExpandedKeys(newVal);
    },
    data(newVal) {
      this.store.setData(newVal);
    },
    checkboxItems(val) {
      Array.prototype.forEach.call(val, checkbox => {
        checkbox.setAttribute('tabindex', -1);
      });
    },
    checkStrictly(newVal) {
      this.store.checkStrictly = newVal;
    }
  },
  methods: {
    filter(value) {
      if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
      this.store.filter(value);
    },
    getNodeKey(node) {
      return getNodeKey(this.nodeKey, node.data);
    },
    getNodePath(data) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getNodePath');
      var node = this.store.getNode(data);
      if (!node) return [];
      var path = [node.data];
      var parent = node.parent;
      while (parent && parent !== this.root) {
        path.push(parent.data);
        parent = parent.parent;
      }
      return path.reverse();
    },
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
    },
    getCheckedKeys(leafOnly) {
      return this.store.getCheckedKeys(leafOnly);
    },
    getCurrentNode() {
      var currentNode = this.store.getCurrentNode();
      return currentNode ? currentNode.data : null;
    },
    getCurrentKey() {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey');
      var currentNode = this.getCurrentNode();
      return currentNode ? currentNode[this.nodeKey] : null;
    },
    setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
      this.store.setCheckedNodes(nodes, leafOnly);
    },
    setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
      this.store.setCheckedKeys(keys, leafOnly);
    },
    setChecked(data, checked, deep) {
      this.store.setChecked(data, checked, deep);
    },
    getHalfCheckedNodes() {
      return this.store.getHalfCheckedNodes();
    },
    getHalfCheckedKeys() {
      return this.store.getHalfCheckedKeys();
    },
    setCurrentNode(node) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
      this.store.setUserCurrentNode(node);
    },
    setCurrentKey(key) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
      this.store.setCurrentNodeKey(key);
    },
    getNode(data) {
      return this.store.getNode(data);
    },
    remove(data) {
      this.store.remove(data);
    },
    append(data, parentNode) {
      this.store.append(data, parentNode);
    },
    insertBefore(data, refNode) {
      this.store.insertBefore(data, refNode);
    },
    insertAfter(data, refNode) {
      this.store.insertAfter(data, refNode);
    },
    handleNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.$emit('node-expand', nodeData, node, instance);
    },
    updateKeyChildren(key, data) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
      this.store.updateChildren(key, data);
    },
    initTabIndex() {
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
      var checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]');
      if (checkedItem.length) {
        checkedItem[0].setAttribute('tabindex', 0);
        return;
      }
      this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0);
    },
    handleKeydown(ev) {
      var currentItem = ev.target;
      if (currentItem.className.indexOf('el-tree-node') === -1) return;
      var keyCode = ev.keyCode;
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
      var currentIndex = this.treeItemArray.indexOf(currentItem);
      var nextIndex;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up、down
        ev.preventDefault();
        if (keyCode === 38) {
          // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        } else {
          nextIndex = currentIndex < this.treeItemArray.length - 1 ? currentIndex + 1 : 0;
        }
        this.treeItemArray[nextIndex].focus(); // 选中
      }
      if ([37, 39].indexOf(keyCode) > -1) {
        // left、right 展开
        ev.preventDefault();
        currentItem.click(); // 选中
      }
      var hasInput = currentItem.querySelector('[type="checkbox"]');
      if ([13, 32].indexOf(keyCode) > -1 && hasInput) {
        // space enter选中checkbox
        ev.preventDefault();
        hasInput.click();
      }
    }
  },
  created() {
    this.isTree = true;
    this.store = new TreeStore({
      key: this.nodeKey,
      data: this.data,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    });
    this.root = this.store.root;
    var dragState = this.dragState;
    this.$on('tree-node-drag-start', (event, treeNode) => {
      if (typeof this.allowDrag === 'function' && !this.allowDrag(treeNode.node)) {
        event.preventDefault();
        return false;
      }
      event.dataTransfer.effectAllowed = 'move';

      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        event.dataTransfer.setData('text/plain', '');
      } catch (e) {}
      dragState.draggingNode = treeNode;
      this.$emit('node-drag-start', treeNode.node, event);
    });
    this.$on('tree-node-drag-over', (event, treeNode) => {
      var dropNode = findNearestComponent(event.target, 'ElTreeNode');
      var oldDropNode = dragState.dropNode;
      if (oldDropNode && oldDropNode !== dropNode) {
        removeClass(oldDropNode.$el, 'is-drop-inner');
      }
      var draggingNode = dragState.draggingNode;
      if (!draggingNode || !dropNode) return;
      var dropPrev = true;
      var dropInner = true;
      var dropNext = true;
      var userAllowDropInner = true;
      if (typeof this.allowDrop === 'function') {
        dropPrev = this.allowDrop(draggingNode.node, dropNode.node, 'prev');
        userAllowDropInner = dropInner = this.allowDrop(draggingNode.node, dropNode.node, 'inner');
        dropNext = this.allowDrop(draggingNode.node, dropNode.node, 'next');
      }
      event.dataTransfer.dropEffect = dropInner ? 'move' : 'none';
      if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
        if (oldDropNode) {
          this.$emit('node-drag-leave', draggingNode.node, oldDropNode.node, event);
        }
        this.$emit('node-drag-enter', draggingNode.node, dropNode.node, event);
      }
      if (dropPrev || dropInner || dropNext) {
        dragState.dropNode = dropNode;
      }
      if (dropNode.node.nextSibling === draggingNode.node) {
        dropNext = false;
      }
      if (dropNode.node.previousSibling === draggingNode.node) {
        dropPrev = false;
      }
      if (dropNode.node.contains(draggingNode.node, false)) {
        dropInner = false;
      }
      if (draggingNode.node === dropNode.node || draggingNode.node.contains(dropNode.node)) {
        dropPrev = false;
        dropInner = false;
        dropNext = false;
      }
      var targetPosition = dropNode.$el.getBoundingClientRect();
      var treePosition = this.$el.getBoundingClientRect();
      var dropType;
      var prevPercent = dropPrev ? dropInner ? 0.25 : dropNext ? 0.45 : 1 : -1;
      var nextPercent = dropNext ? dropInner ? 0.75 : dropPrev ? 0.55 : 0 : 1;
      var indicatorTop = -9999;
      var distance = event.clientY - targetPosition.top;
      if (distance < targetPosition.height * prevPercent) {
        dropType = 'before';
      } else if (distance > targetPosition.height * nextPercent) {
        dropType = 'after';
      } else if (dropInner) {
        dropType = 'inner';
      } else {
        dropType = 'none';
      }
      var iconPosition = dropNode.$el.querySelector('.el-tree-node__expand-icon').getBoundingClientRect();
      var dropIndicator = this.$refs.dropIndicator;
      if (dropType === 'before') {
        indicatorTop = iconPosition.top - treePosition.top;
      } else if (dropType === 'after') {
        indicatorTop = iconPosition.bottom - treePosition.top;
      }
      dropIndicator.style.top = indicatorTop + 'px';
      dropIndicator.style.left = iconPosition.right - treePosition.left + 'px';
      if (dropType === 'inner') {
        addClass(dropNode.$el, 'is-drop-inner');
      } else {
        removeClass(dropNode.$el, 'is-drop-inner');
      }
      dragState.showDropIndicator = dropType === 'before' || dropType === 'after';
      dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;
      dragState.dropType = dropType;
      this.$emit('node-drag-over', draggingNode.node, dropNode.node, event);
    });
    this.$on('tree-node-drag-end', event => {
      var draggingNode = dragState.draggingNode,
        dropType = dragState.dropType,
        dropNode = dragState.dropNode;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      if (draggingNode && dropNode) {
        var draggingNodeCopy = {
          data: draggingNode.node.data
        };
        if (dropType !== 'none') {
          draggingNode.node.remove();
        }
        if (dropType === 'before') {
          dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node);
        } else if (dropType === 'after') {
          dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node);
        } else if (dropType === 'inner') {
          dropNode.node.insertChild(draggingNodeCopy);
        }
        if (dropType !== 'none') {
          this.store.registerNode(draggingNodeCopy);
        }
        removeClass(dropNode.$el, 'is-drop-inner');
        this.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType, event);
        if (dropType !== 'none') {
          this.$emit('node-drop', draggingNode.node, dropNode.node, dropType, event);
        }
      }
      if (draggingNode && !dropNode) {
        this.$emit('node-drag-end', draggingNode.node, null, dropType, event);
      }
      dragState.showDropIndicator = false;
      dragState.draggingNode = null;
      dragState.dropNode = null;
      dragState.allowDrop = true;
    });
  },
  mounted() {
    this.initTabIndex();
    this.$el.addEventListener('keydown', this.handleKeydown);
  },
  updated() {
    this.treeItems = this.$el.querySelectorAll('[role=treeitem]');
    this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
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
    staticClass: "el-tree",
    class: {
      "el-tree--highlight-current": _vm.highlightCurrent,
      "is-dragging": !!_vm.dragState.draggingNode,
      "is-drop-not-allow": !_vm.dragState.allowDrop,
      "is-drop-inner": _vm.dragState.dropType === "inner"
    },
    attrs: {
      role: "tree"
    }
  }, [_vm._l(_vm.root.childNodes, function (child) {
    return _c("el-tree-node", {
      key: _vm.getNodeKey(child),
      attrs: {
        node: child,
        props: _vm.props,
        "render-after-expand": _vm.renderAfterExpand,
        "show-checkbox": _vm.showCheckbox,
        "render-content": _vm.renderContent
      },
      on: {
        "node-expand": _vm.handleNodeExpand
      }
    });
  }), _vm._v(" "), _vm.isEmpty ? _c("div", {
    staticClass: "el-tree__empty-block"
  }, [_c("span", {
    staticClass: "el-tree__empty-text"
  }, [_vm._v(_vm._s(_vm.emptyText))])]) : _vm._e(), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.dragState.showDropIndicator,
      expression: "dragState.showDropIndicator"
    }],
    ref: "dropIndicator",
    staticClass: "el-tree__drop-indicator"
  })], 2);
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
