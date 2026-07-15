import Node from './node';
import { getNodeKey } from './util';

export default class TreeStore {
  constructor(options) {
    this.currentNode = null;
    this.currentNodeKey = null;
    this.defaultCheckedKeysMap = Object.create(null);

    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.nodesMap = {};

    this.root = new Node({
      data: this.data,
      store: this
    });

    this._setDefaultCheckedKeys(this.defaultCheckedKeys || []);
    this._syncCurrentNode();

    if (this.lazy && this.load) {
      const loadFn = this.load;
      loadFn(this.root, (data) => {
        this.root.doCreateChildren(data);
        this._initDefaultCheckedNodes();
        this._syncCurrentNode();
      });
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  filter(value) {
    const filterNodeMethod = this.filterNodeMethod;
    const lazy = this.lazy;
    if (!value) {
      const resetVisible = function(node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        for (let i = 0, j = childNodes.length; i < j; i++) {
          const child = childNodes[i];
          child.visible = true;
          resetVisible(child);
        }
      };

      this.visible = true;
      resetVisible(this);
      return;
    }

    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;
      let hasVisibleChild = false;

      for (let i = 0, j = childNodes.length; i < j; i++) {
        const child = childNodes[i];
        const visible = filterNodeMethod.call(child, value, child.data, child);
        child.visible = visible;
        if (visible) hasVisibleChild = true;

        traverse(child);
      }

      if (!node.visible && childNodes.length) {
        if (node.root) {
          node.root.visible = hasVisibleChild;
        } else {
          node.visible = hasVisibleChild;
        }
      }
      if (node.visible && !node.isLeaf && !lazy) node.expand();
    };

    traverse(this);
  }

  setData(newVal) {
    const instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
    } else {
      this.root.updateChildren();
    }

    this._syncCurrentNode();
  }

  getNode(data) {
    if (data instanceof Node) return data;
    const key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
    return this.nodesMap[key] || null;
  }

  insertBefore(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertBefore({ data }, refNode);
  }

  insertAfter(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertAfter({ data }, refNode);
  }

  remove(data) {
    const node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
  }

  append(data, parentData) {
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
  }

  _initDefaultCheckedNodes() {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];
    const nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = nodesMap[checkedKey];

      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }

  _initDefaultCheckedNode(node) {
    if (this.defaultCheckedKeysMap[node.key] === true) {
      node.setChecked(true, !this.checkStrictly);
    }
  }

  _setDefaultCheckedKeys(keys) {
    this.defaultCheckedKeys = keys || [];
    const map = Object.create(null);
    this.defaultCheckedKeys.forEach((key) => {
      map[key] = true;
    });
    this.defaultCheckedKeysMap = map;
  }

  _collectCheckedState(leafOnly = false, includeHalfChecked = false) {
    const checkedNodes = [];
    const checkedKeys = [];
    const halfCheckedNodes = [];
    const halfCheckedKeys = [];
    const key = this.key;

    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      for (let i = 0, j = childNodes.length; i < j; i++) {
        const child = childNodes[i];
        const childData = child.data;
        const childKey = childData ? childData[key] : undefined;
        const checked = child.checked;
        const indeterminate = child.indeterminate;
        const isLeaf = child.isLeaf;

        if ((checked || (includeHalfChecked && indeterminate)) && (!leafOnly || isLeaf)) {
          checkedNodes.push(childData);
          checkedKeys.push(childKey);
        }

        if (indeterminate) {
          halfCheckedNodes.push(childData);
          halfCheckedKeys.push(childKey);
        }

        traverse(child);
      }
    };

    traverse(this);

    return {
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    };
  }

  setDefaultCheckedKey(newVal) {
    if (newVal !== this.defaultCheckedKeys) {
      this._setDefaultCheckedKeys(newVal);
      this._initDefaultCheckedNodes();
    }
  }

  registerNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    const nodeKey = node.key;
    if (nodeKey !== undefined) this.nodesMap[node.key] = node;
  }

  deregisterNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    node.childNodes.forEach(child => {
      this.deregisterNode(child);
    });

    delete this.nodesMap[node.key];
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    return this._collectCheckedState(leafOnly, includeHalfChecked).checkedNodes;
  }

  getCheckedKeys(leafOnly = false) {
    return this._collectCheckedState(leafOnly, false).checkedKeys;
  }

  getHalfCheckedNodes() {
    return this._collectCheckedState(false, true).halfCheckedNodes;
  }

  getHalfCheckedKeys() {
    return this._collectCheckedState(false, true).halfCheckedKeys;
  }

  _getAllNodes() {
    const allNodes = [];
    const nodesMap = this.nodesMap;
    const keys = Object.keys(nodesMap);
    for (let i = 0, j = keys.length; i < j; i++) {
      allNodes.push(nodesMap[keys[i]]);
    }

    return allNodes;
  }

  updateChildren(key, data) {
    const node = this.nodesMap[key];
    if (!node) return;
    const childNodes = node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];
      this.remove(child.data);
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];
      this.append(child, node.data);
    }
  }

  _setCheckedKeys(key, leafOnly = false, checkedKeys) {
    const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
    const cache = Object.create(null);
    allNodes.forEach(node => node.setChecked(false, false));
    for (let i = 0, j = allNodes.length; i < j; i++) {
      const node = allNodes[i];
      const nodeKey = node.data[key];
      let checked = checkedKeys[nodeKey] === true;
      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        continue;
      }

      let parent = node.parent;
      while (parent && parent.level > 0) {
        cache[parent.data[key]] = true;
        parent = parent.parent;
      }

      if (node.isLeaf || this.checkStrictly) {
        node.setChecked(true, false);
        continue;
      }
      node.setChecked(true, true);

      if (leafOnly) {
        node.setChecked(false, false);
        const traverse = function(node) {
          const childNodes = node.childNodes;
          childNodes.forEach((child) => {
            if (!child.isLeaf) {
              child.setChecked(false, false);
            }
            traverse(child);
          });
        };
        traverse(node);
      }
    }
  }

  setCheckedNodes(array, leafOnly = false) {
    const key = this.key;
    const checkedKeys = Object.create(null);
    array.forEach((item) => {
      checkedKeys[(item || {})[key]] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys, leafOnly = false) {
    this._setDefaultCheckedKeys(keys);
    const key = this.key;
    const checkedKeys = Object.create(null);
    keys.forEach((key) => {
      checkedKeys[key] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setDefaultExpandedKeys(keys) {
    keys = keys || [];
    this.defaultExpandedKeys = keys;

    keys.forEach((key) => {
      const node = this.getNode(key);
      if (node) node.expand(null, this.autoExpandParent);
    });
  }

  setChecked(data, checked, deep) {
    const node = this.getNode(data);

    if (node) {
      node.setChecked(!!checked, deep);
    }
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(currentNode) {
    const prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNodeKey = currentNode ? currentNode.key : null;
    this.currentNode && (this.currentNode.isCurrent = true);
  }

  setUserCurrentNode(node) {
    const key = node[this.key];
    this.setCurrentNodeKey(key);
  }

  setCurrentNodeKey(key) {
    this.currentNodeKey = key;
    if (key === null || key === undefined) {
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;
      return;
    }
    const node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
    } else if (this.currentNode) {
      this.currentNode.isCurrent = false;
      this.currentNode = null;
    }
  }

  _syncCurrentNode() {
    if (this.currentNodeKey === null || this.currentNodeKey === undefined) {
      if (this.currentNode) {
        this.currentNode.isCurrent = false;
      }
      this.currentNode = null;
      return;
    }

    const node = this.getNode(this.currentNodeKey);
    if (node) {
      this.setCurrentNode(node);
    } else if (this.currentNode) {
      this.currentNode.isCurrent = false;
      this.currentNode = null;
    }
  }
};
