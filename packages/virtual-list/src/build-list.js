import VirtualScrollbar from './scrollbar';
import {
  AUTO_ALIGNMENT,
  BACKWARD,
  CENTERED_ALIGNMENT,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
  END_REACHED_EVT,
  FORWARD,
  HORIZONTAL,
  ITEM_RENDER_EVT,
  LTR,
  RTL,
  SCROLL_EVT,
  SMART_ALIGNMENT,
  VERTICAL
} from './defaults';

export default function buildList(strategy) {
  const strategyMethods = Object.assign({}, strategy);
  delete strategyMethods.name;
  Object.keys(strategyMethods).forEach(key => {
    if (typeof strategyMethods[key] !== 'function' ||
      ['initCache', 'validateProps'].indexOf(key) > -1) delete strategyMethods[key];
  });

  return {
    name: strategy.name,

    components: { VirtualScrollbar },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      items: {
        type: Array,
        default() {
          return [];
        }
      },
      height: {
        type: [Number, String],
        required: true
      },
      width: {
        type: [Number, String],
        default: '100%'
      },
      total: Number,
      itemSize: {
        type: strategy.name === 'ElFixedSizeList' ? Number : Function,
        required: true
      },
      estimatedItemSize: {
        type: Number,
        default: DEFAULT_DYNAMIC_LIST_ITEM_SIZE
      },
      overscan: {
        type: Number,
        default: 2
      },
      cache: Number,
      initScrollOffset: {
        type: Number,
        default: 0
      },
      itemKey: Function,
      viewClass: [String, Array, Object],
      className: String,
      direction: {
        type: String,
        default: LTR,
        validator: value => [LTR, RTL].indexOf(value) > -1
      },
      layout: {
        type: String,
        default: VERTICAL,
        validator: value => [HORIZONTAL, VERTICAL].indexOf(value) > -1
      },
      containerElement: {
        type: [String, Object],
        default: 'div'
      },
      innerElement: {
        type: [String, Object],
        default: 'div'
      },
      innerProps: Object,
      innerWidth: [Number, String],
      scrollbarAlwaysOn: Boolean,
      useIsScrolling: Boolean
    },

    data() {
      return {
        isScrolling: false,
        scrollDirection: FORWARD,
        scrollOffset: Math.max(0, this.initScrollOffset),
        startIndex: 0,
        stopIndex: -1,
        cacheStartIndex: 0,
        cacheStopIndex: -1,
        scrollbarDragging: false
      };
    },

    computed: {
      resolvedData() {
        return this.data.length || !this.items.length ? this.data : this.items;
      },
      resolvedTotal() {
        return typeof this.total === 'number' ? this.total : this.resolvedData.length;
      },
      resolvedCache() {
        return typeof this.cache === 'number' ? this.cache : this.overscan;
      },
      isHorizontal() {
        return this.layout === HORIZONTAL;
      },
      clientSize() {
        return Number(this.isHorizontal ? this.width : this.height);
      },
      totalSize() {
        return this.getEstimatedTotalSize();
      },
      maxOffset() {
        return Math.max(0, this.totalSize - this.clientSize);
      },
      itemsToRender() {
        const entries = [];
        for (let index = this.cacheStartIndex; index <= this.cacheStopIndex; index++) {
          if (index >= 0 && index < this.resolvedTotal) {
            entries.push({ item: this.resolvedData[index], index });
          }
        }
        return entries;
      }
    },

    watch: {
      items() {
        this.resetAfterIndex(0, false);
        this.clampScrollOffset();
        this.updateRange(true);
      },
      data() {
        this.resetAfterIndex(0, false);
        this.clampScrollOffset();
        this.updateRange(true);
      },
      total() {
        this.clampScrollOffset();
        this.updateRange(true);
      },
      itemSize() {
        this.resetAfterIndex(0, false);
        this.clampScrollOffset();
        this.updateRange(true);
      },
      estimatedItemSize(value) {
        if (this._listCache) this._listCache.estimatedItemSize = value;
        this.updateRange(true);
      },
      height() {
        this.clampScrollOffset();
        this.updateRange(true);
      },
      overscan() {
        this.updateRange(true);
      },
      layout() {
        this.getItemStyleCache(-1);
        this.clampScrollOffset();
        this.updateRange(true);
      },
      direction() {
        this.getItemStyleCache(-1);
      }
    },

    created() {
      strategy.validateProps(this);
      this._listCache = strategy.initCache.call(this);
      this._itemMetadata = this._listCache;
      this._itemStyleCache = {};
      this._edgeState = { start: this.scrollOffset <= 0, end: false };
    },

    mounted() {
      this.updateRange(true);
      this.scrollTo(this.scrollOffset);
    },

    methods: Object.assign({}, strategyMethods, {
      getItemKey(item, index) {
        return this.itemKey ? this.itemKey(item, index) : index;
      },
      updateRange(force) {
        if (!this.resolvedTotal) {
          this.startIndex = this.cacheStartIndex = 0;
          this.stopIndex = this.cacheStopIndex = -1;
          return;
        }
        const start = this.findStartIndex(this.scrollOffset);
        const stop = this.findStopIndex(start, this.scrollOffset);
        const backwardCache = !this.isScrolling || this.scrollDirection === BACKWARD
          ? Math.max(1, this.resolvedCache) : 1;
        const forwardCache = !this.isScrolling || this.scrollDirection === FORWARD
          ? Math.max(1, this.resolvedCache) : 1;
        const cacheStart = Math.max(0, start - backwardCache);
        const cacheStop = Math.min(this.resolvedTotal - 1, stop + forwardCache);
        const changed = start !== this.startIndex || stop !== this.stopIndex ||
          cacheStart !== this.cacheStartIndex || cacheStop !== this.cacheStopIndex;
        if (changed || force) {
          this.startIndex = start;
          this.stopIndex = stop;
          this.cacheStartIndex = cacheStart;
          this.cacheStopIndex = cacheStop;
          this.$emit('range-change', {
            start: cacheStart,
            end: cacheStop + 1,
            visibleStart: start,
            visibleEnd: stop + 1
          });
          this.$emit(ITEM_RENDER_EVT, cacheStart, cacheStop, start, stop);
          this.$emit('item-rendered', cacheStart, cacheStop, start, stop);
        }
      },
      handleScroll(event) {
        const target = event.target;
        const offset = this.isHorizontal ? target.scrollLeft : target.scrollTop;
        const scrollSize = this.isHorizontal ? target.scrollWidth : target.scrollHeight;
        const clientSize = this.isHorizontal ? target.clientWidth : target.clientHeight;
        const nextOffset = Math.min(
          Math.abs(offset),
          Math.max(0, scrollSize - clientSize)
        );
        if (nextOffset === this.scrollOffset) return;
        this.scrollDirection = nextOffset > this.scrollOffset ? FORWARD : BACKWARD;
        this.scrollOffset = nextOffset;
        this.isScrolling = true;
        this.updateRange();
        this.emitEndReached();
        this.$emit(SCROLL_EVT, this.scrollDirection, this.scrollOffset, false);
        this.$nextTick(() => {
          this.isScrolling = false;
          this._itemStyleCache = {};
        });
      },
      handleWheel(event) {
        const delta = this.isHorizontal
          ? (event.deltaX || event.deltaY)
          : event.deltaY;
        if (!delta) return;
        const nextOffset = Math.max(0, Math.min(this.scrollOffset + delta, this.maxOffset));
        if (nextOffset === this.scrollOffset) return;
        event.preventDefault();
        if (this.$refs.scrollbar) this.$refs.scrollbar.handleMouseUp();
        this.scrollTo(nextOffset, false);
      },
      clampScrollOffset() {
        if (this.scrollOffset > this.maxOffset) this.scrollTo(this.maxOffset);
      },
      scrollTo(offset, isProgrammatic = true) {
        const nextOffset = Math.max(0, Math.min(Number(offset) || 0, this.maxOffset));
        this.scrollDirection = nextOffset > this.scrollOffset ? FORWARD : BACKWARD;
        this.scrollOffset = nextOffset;
        if (this.$refs.window) {
          const property = this.isHorizontal ? 'scrollLeft' : 'scrollTop';
          this.$refs.window[property] = this.direction === RTL && this.isHorizontal
            ? -nextOffset : nextOffset;
        }
        this.updateRange();
        this.emitEndReached();
        this.$emit(SCROLL_EVT, this.scrollDirection, this.scrollOffset, isProgrammatic);
      },
      scrollToIndex(index, alignment) {
        this.scrollToItem(index, alignment);
      },
      scrollToItem(index, alignment = AUTO_ALIGNMENT) {
        if (!this.resolvedTotal) return;
        const targetIndex = Math.max(0, Math.min(index, this.resolvedTotal - 1));
        this.scrollTo(this.getOffset(targetIndex, alignment, this.scrollOffset));
      },
      resolveAlignment(alignment, scrollOffset, minOffset, maxOffset, size) {
        if (alignment !== SMART_ALIGNMENT) return alignment;
        return scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size
          ? AUTO_ALIGNMENT : CENTERED_ALIGNMENT;
      },
      resetAfterIndex(index, forceUpdate = true) {
        strategy.resetAfterIndex.call(this, index);
        if (forceUpdate) this.$forceUpdate();
      },
      getItemStyle(index) {
        if (this._itemStyleCache[index]) return this._itemStyleCache[index];
        const offset = this.getItemOffset(index);
        const size = this.getItemSize(index);
        const style = {
          position: 'absolute',
          left: this.isHorizontal && this.direction !== 'rtl' ? offset + 'px' : 0,
          right: this.isHorizontal && this.direction === RTL ? offset + 'px' : null,
          top: this.isHorizontal ? 0 : offset + 'px',
          height: this.isHorizontal ? '100%' : size + 'px',
          width: this.isHorizontal ? size + 'px' : '100%'
        };
        this._itemStyleCache[index] = style;
        return style;
      },
      handleScrollbarScroll(distance, totalSteps) {
        if (!totalSteps) return;
        this.scrollTo(distance / totalSteps * this.maxOffset, false);
      },
      getItemStyleCache() {
        if (arguments[0] === -1) this._itemStyleCache = {};
        return this._itemStyleCache;
      },
      resetScrollTop() {
        this.scrollTo(0);
      },
      emitEndReached() {
        const start = this.scrollOffset <= 1;
        const end = this.maxOffset - this.scrollOffset <= 1;
        if (this.scrollDirection === FORWARD && end && !this._edgeState.end) {
          this.$emit(END_REACHED_EVT, this.isHorizontal
            ? (this.direction === RTL ? 'left' : 'right') : 'bottom');
        }
        if (this.scrollDirection === BACKWARD && start && !this._edgeState.start) {
          this.$emit(END_REACHED_EVT, this.isHorizontal
            ? (this.direction === RTL ? 'right' : 'left') : 'top');
        }
        this._edgeState = { start, end };
      }
    }),

    render(h) {
      const children = this.itemsToRender.reduce((nodes, entry) => {
        const style = this.getItemStyle(entry.index);
        const slot = this.$scopedSlots.default;
        const rendered = slot ? slot({
          data: this.resolvedData,
          item: entry.item,
          index: entry.index,
          style,
          isScrolling: this.useIsScrolling ? this.isScrolling : undefined
        }) : [];
        const slotNodes = Array.isArray(rendered) ? rendered : [rendered];
        slotNodes.forEach((node, nodeIndex) => {
          if (!node) return;
          node.data = node.data || {};
          node.data.style = Object.assign({}, style, node.data.style || {});
          if (node.key === undefined) {
            const key = this.getItemKey(entry.item, entry.index);
            node.key = nodeIndex ? `${key}_${nodeIndex}` : key;
          }
          nodes.push(node);
        });
        return nodes;
      }, []);
      const formatSize = value => typeof value === 'number' ? value + 'px' : value;
      const vnodeStyle = this.$vnode && this.$vnode.data && this.$vnode.data.style;
      const windowStyle = Object.assign({
        position: 'relative',
        [`overflow-${this.isHorizontal ? 'x' : 'y'}`]: 'scroll',
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform',
        direction: this.direction,
        height: formatSize(this.height),
        width: formatSize(this.width)
      }, vnodeStyle || {});
      const innerStyle = {
        pointerEvents: this.isScrolling ? 'none' : null,
        height: this.isHorizontal ? '100%' : this.totalSize + 'px',
        width: this.isHorizontal
          ? this.totalSize + 'px'
          : (this.innerWidth === undefined ? '100%' : formatSize(this.innerWidth)),
        margin: 0,
        boxSizing: 'border-box'
      };
      const innerProps = this.innerProps || {};
      const inner = h(this.innerElement, {
        ref: 'inner',
        class: innerProps.class,
        style: Object.assign(innerStyle, innerProps.style || {}),
        attrs: innerProps.attrs || innerProps,
        on: innerProps.on
      }, children);

      const listContainer = h(this.containerElement, {
        ref: 'window',
        class: [
          'el-vl__window',
          this.className,
          this.viewClass
        ],
        style: windowStyle,
        on: {
          scroll: this.handleScroll,
          wheel: this.handleWheel
        }
      }, [inner]);

      const scrollbar = h(VirtualScrollbar, {
        ref: 'scrollbar',
        props: {
          layout: this.layout,
          total: this.resolvedTotal,
          ratio: this.totalSize ? this.clientSize * 100 / this.totalSize : 100,
          clientSize: this.clientSize,
          scrollFrom: this.maxOffset ? this.scrollOffset / this.maxOffset : 0,
          alwaysOn: this.scrollbarAlwaysOn,
          visible: this.isScrolling
        },
        on: {
          scroll: this.handleScrollbarScroll,
          'start-move': () => { this.scrollbarDragging = true; },
          'stop-move': () => { this.scrollbarDragging = false; }
        }
      });
      return h('div', {
        class: ['el-vl__wrapper', this.scrollbarAlwaysOn ? 'always-on' : '']
      }, [listContainer, scrollbar]);
    }
  };
}
