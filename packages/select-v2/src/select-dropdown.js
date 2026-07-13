import Popper from 'element-ui/src/utils/vue-popper';
import { FixedSizeList, DynamicSizeList } from 'element-ui/packages/virtual-list';
import ElOptionItem from './option-item.vue';
import ElOptionGroup from './option-group.vue';

export default {
  name: 'ElSelectDropdown',

  componentName: 'ElSelectDropdown',

  mixins: [Popper],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    loading: Boolean,
    emptyText: [String, Boolean],
    height: Number,
    itemHeight: Number,
    estimatedOptionHeight: Number,
    overscan: Number,
    scrollbarAlwaysOn: Boolean,
    contentId: String,
    hoveringIndex: Number,
    placement: {
      default: 'bottom-start'
    },
    boundariesPadding: {
      default: 0
    },
    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    visibleArrow: {
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      cachedHeights: []
    };
  },

  watch: {
    data() {
      this.cachedHeights = [];
      if (this.$refs.list && this.$refs.list.resetAfterIndex) {
        this.$refs.list.resetAfterIndex(0, false);
      }
    }
  },

  mounted() {
    this.referenceElm = this.$parent.$refs.reference.$el;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', () => {
      if (this.$parent.visible) this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  },

  methods: {
    scrollTo(offset) {
      if (this.$refs.list) this.$refs.list.scrollTo(offset);
    },
    scrollToIndex(index) {
      if (this.$refs.list) this.$refs.list.scrollToIndex(index);
    },
    scrollToItem(index) {
      if (this.$refs.list) this.$refs.list.scrollToItem(index);
    },
    resetScrollTop() {
      this.scrollTo(0);
    },
    getItemSize(index) {
      return this.cachedHeights[index] || this.estimatedOptionHeight;
    },
    handleItemResize(index, height) {
      if (!this.estimatedOptionHeight || !height || this.cachedHeights[index] === height) return;
      this.$set(this.cachedHeights, index, height);
      if (this.$refs.list && this.$refs.list.clearCacheAfterIndex) {
        this.$refs.list.clearCacheAfterIndex(index, true);
      }
    },
    getRowStyle(style) {
      if (!this.estimatedOptionHeight) return style;
      return Object.assign({}, style, {
        height: 'auto',
        minHeight: this.estimatedOptionHeight + 'px'
      });
    },
    isItemHovering(index) {
      return this.hoveringIndex === index;
    },
    renderItem(h, scope) {
      const select = this.$parent;
      const row = scope.item;
      if (row.type === 'group') {
        return h(ElOptionGroup, {
          key: row.key,
          style: this.getRowStyle(scope.style),
          props: {
            label: row.label,
            itemHeight: this.itemHeight,
            dynamic: Boolean(this.estimatedOptionHeight),
            index: scope.index
          },
          on: {
            resize: this.handleItemResize
          }
        });
      }

      const selected = select.isOptionSelected(row.option);
      const disabled = select.isRowDisabled(row);
      const optionSlot = this.$scopedSlots.option;
      const optionContent = optionSlot ? optionSlot({
        item: row.option,
        index: scope.index,
        selected,
        disabled
      }) : null;
      return h(ElOptionItem, {
        key: row.key,
        style: this.getRowStyle(scope.style),
        props: {
          index: scope.index,
          item: row.option,
          label: select.getOptionLabel(row.option),
          disabled,
          selected,
          created: Boolean(row.option && row.option.created),
          hovering: this.isItemHovering(scope.index),
          itemHeight: this.itemHeight,
          dynamic: Boolean(this.estimatedOptionHeight),
          contentId: this.contentId
        },
        on: {
          hover: select.handleOptionHover,
          select: select.handleOptionSelect,
          resize: this.handleItemResize
        }
      }, optionContent && optionContent.length
        ? optionContent
        : [select.getOptionLabel(row.option)]);
    }
  },

  render(h) {
    const children = [];
    if (this.$slots.header) {
      children.push(h('div', {
        class: 'el-select-dropdown__header',
        on: { click: event => event.stopPropagation() }
      }, this.$slots.header));
    }

    if (this.loading) {
      children.push(this.$slots.loading || h('p', {
        class: 'el-select-dropdown__loading'
      }, [this.$parent.t('el.select.loading')]));
    } else if (this.data.length) {
      const List = this.estimatedOptionHeight ? DynamicSizeList : FixedSizeList;
      const listProps = {
        data: this.data,
        total: this.data.length,
        height: this.height,
        width: '100%',
        overscan: this.overscan,
        cache: this.overscan,
        innerElement: 'ul',
        innerProps: {
          attrs: {
            id: this.contentId,
            role: 'listbox',
            'aria-orientation': 'vertical'
          }
        },
        className: 'el-select-dropdown__list',
        scrollbarAlwaysOn: this.scrollbarAlwaysOn
      };
      if (this.estimatedOptionHeight) {
        listProps.itemSize = this.getItemSize;
        listProps.estimatedItemSize = this.estimatedOptionHeight;
      } else {
        listProps.itemSize = this.itemHeight;
      }
      children.push(h(List, {
        ref: 'list',
        props: listProps,
        on: {
          'end-reached': direction => this.$emit('end-reached', direction)
          // 'keydown':
        },
        scopedSlots: {
          default: scope => [this.renderItem(h, scope)]
        }
      }));
    } else if (this.emptyText) {
      children.push(this.$slots.empty || h('p', {
        class: 'el-select-dropdown__empty'
      }, [this.emptyText]));
    }

    if (this.$slots.footer) {
      children.push(h('div', {
        class: 'el-select-dropdown__footer',
        on: { click: event => event.stopPropagation() }
      }, this.$slots.footer));
    }

    return h('div', {
      class: [
        'el-select-dropdown',
        'el-select-dropdown--v2',
        { 'is-multiple': this.$parent.multiple },
        this.$parent.popperClass
      ],
      style: this.$parent.appliedDropdownStyle
    }, children);
  }
};
