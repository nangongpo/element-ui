<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
    v-show="nodeVisible"
    :class="{
      'is-expanded': expanded,
      'is-current': nodeIsCurrent,
      'is-hidden': !nodeVisible,
      'is-focusable': !nodeDisabled,
      'is-checked': !nodeDisabled && nodeChecked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="nodeDisabled"
    :aria-checked="nodeChecked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <div class="el-tree-node__content"
      :style="{ 'padding-left': contentPaddingLeft }">
      <span
        @click.stop="handleExpandIconClick"
        :class="[
          { 'is-leaf': nodeIsLeaf, expanded: !nodeIsLeaf && expanded },
          'el-tree-node__expand-icon',
          expandIconClass
        ]"
      >
      </span>
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="nodeIndeterminate"
        :disabled="!!nodeDisabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </el-checkbox>
      <span
        v-if="nodeLoading"
        class="el-tree-node__loading-icon el-icon-loading">
      </span>
      <node-content :node="node"></node-content>
    </div>
    <el-collapse-transition>
      <div
        class="el-tree-node__children"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <el-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand">
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
  import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import emitter from 'element-ui/src/mixins/emitter';
  import { getNodeKey } from './model/util';

  export default {
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
      ElCollapseTransition,
      ElCheckbox,
      NodeContent: {
        props: {
          node: {
            required: true
          }
        },
        render(h) {
          const parent = this.$parent;
          const tree = parent.tree;
          const node = this.node;
          const { data, store } = node;
          const renderContent = parent.renderContent;
          const defaultSlot = tree.$scopedSlots.default;
          return (
            renderContent
              ? renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
              : defaultSlot
                ? defaultSlot({ node, data })
                : <span class="el-tree-node__label">{ node.label }</span>
          );
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

    computed: {
      nodeVisible() {
        return this.node.visible;
      },

      nodeDisabled() {
        return this.node.disabled;
      },

      nodeChecked() {
        return this.node.checked;
      },

      nodeIndeterminate() {
        return this.node.indeterminate;
      },

      nodeIsLeaf() {
        return this.node.isLeaf;
      },

      nodeIsCurrent() {
        return this.node.isCurrent;
      },

      nodeLoading() {
        return this.node.loading;
      },

      nodeSelectionState() {
        return `${this.node.checked}:${this.node.indeterminate}`;
      },

      contentPaddingLeft() {
        return (this.node.level - 1) * this.tree.indent + 'px';
      },

      expandIconClass() {
        return this.tree.iconClass || 'el-icon-caret-right';
      }
    },

    watch: {
      nodeSelectionState() {
        this.syncSelectChange();
      },

      'node.key'() {
        this.resetSelectStateCache();
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

      syncSelectChange() {
        this.handleSelectChange(this.node.checked, this.node.indeterminate);
      },

      resetSelectStateCache() {
        this.oldChecked = null;
        this.oldIndeterminate = null;
      },

      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },

      handleClick() {
        const tree = this.tree;
        const node = this.node;
        const store = tree.store;
        store.setCurrentNode(node);
        tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        tree.currentNode = this;
        if (tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        if (tree.checkOnClickNode && !node.disabled) {
          this.handleCheckChange(null, {
            target: { checked: !node.checked }
          });
        }
        tree.$emit('node-click', node.data, node, this);
      },

      handleContextMenu(event) {
        const tree = this.tree;
        const node = this.node;
        if (tree._events['node-contextmenu'] && tree._events['node-contextmenu'].length > 0) {
          event.stopPropagation();
          event.preventDefault();
        }
        tree.$emit('node-contextmenu', event, node.data, node, this);
      },

      handleExpandIconClick() {
        const tree = this.tree;
        const node = this.node;
        if (node.isLeaf) return;
        if (this.expanded) {
          tree.$emit('node-collapse', node.data, node, this);
          node.collapse();
        } else {
          node.expand();
          this.$emit('node-expand', node.data, node, this);
        }
      },

      handleCheckChange(value, ev) {
        const tree = this.tree;
        const node = this.node;
        node.setChecked(ev.target.checked, !tree.checkStrictly);
        this.$nextTick(() => {
          const store = tree.store;
          const checkedState = store._collectCheckedState();
          tree.$emit('check', node.data, {
            checkedNodes: checkedState.checkedNodes,
            checkedKeys: checkedState.checkedKeys,
            halfCheckedNodes: checkedState.halfCheckedNodes,
            halfCheckedKeys: checkedState.halfCheckedKeys,
          });
        });
      },

      handleChildNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      },

      handleDragStart(event) {
        const tree = this.tree;
        if (!tree.draggable) return;
        tree.$emit('tree-node-drag-start', event, this);
      },

      handleDragOver(event) {
        const tree = this.tree;
        if (!tree.draggable) return;
        tree.$emit('tree-node-drag-over', event, this);
        event.preventDefault();
      },

      handleDrop(event) {
        event.preventDefault();
      },

      handleDragEnd(event) {
        const tree = this.tree;
        if (!tree.draggable) return;
        tree.$emit('tree-node-drag-end', event, this);
      }
    },

    created() {
      const parent = this.$parent;

      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }

      const tree = this.tree;
      if (!tree) {
        console.warn('Can not find node\'s tree.');
      }

      const props = tree.props || {};
      const childrenKey = props['children'] || 'children';

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });

      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if(this.tree.accordion) {
        this.$on('tree-node-expand', node => {
          if(this.node !== node) {
            this.node.collapse();
          }
        });
      }
    }
  };
</script>
