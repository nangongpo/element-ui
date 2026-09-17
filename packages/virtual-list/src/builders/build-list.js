import Scrollbar from '../components/scrollbar';
import { virtualizedListProps } from '../props';
import { AUTO_ALIGNMENT, BACKWARD, END_REACHED_EVT, FORWARD, ITEM_RENDER_EVT, HORIZONTAL, SCROLL_EVT, SMART_ALIGNMENT } from '../defaults';
import { clamp, getScrollDir, normalizeRTLScrollLeft } from '../utils';

export default function buildList(strategy) {
  return {
    name: strategy.name,
    components: { Scrollbar },
    props: virtualizedListProps,
    data() {
      return {
        state: {
          isScrolling: false,
          scrollDir: FORWARD,
          scrollOffset: Number(this.initScrollOffset) || 0,
          updateRequested: false
        },
        itemCache: strategy.initCache(this),
        itemStyleCache: {},
        itemStyleCacheKey: null,
        edgeState: { start: true, end: false }
      };
    },
    computed: {
      isHorizontal() { return this.layout === HORIZONTAL; },
      states() { return this.state; },
      clientSize() { return Number(this.isHorizontal ? this.width : this.height); },
      estimatedTotalSize() { return strategy.getEstimatedTotalSize(this, this.itemCache); },
      maxOffset() { return Math.max(0, this.estimatedTotalSize - this.clientSize); },
      renderRange() {
        if (!this.total) return { cacheStartIndex: 0, cacheStopIndex: -1, startIndex: 0, stopIndex: -1 };
        const start = strategy.getStartIndexForOffset(this, this.state.scrollOffset, this.itemCache);
        const stop = strategy.getStopIndexForStartIndex(this, start, this.state.scrollOffset, this.itemCache);
        const backward = !this.state.isScrolling || this.state.scrollDir === BACKWARD ? Math.max(1, this.cacheSize) : 1;
        const forward = !this.state.isScrolling || this.state.scrollDir === FORWARD ? Math.max(1, this.cacheSize) : 1;
        return { cacheStartIndex: Math.max(0, start - backward), cacheStopIndex: Math.min(this.total - 1, stop + forward), startIndex: start, stopIndex: stop };
      },
      itemsToRender() {
        const range = this.renderRange;
        const result = [];
        for (let index = range.cacheStartIndex; index <= range.cacheStopIndex; index++) result.push(index);
        return result;
      },
      cacheSize() { return Math.max(1, Number(this.cache) || 2); },
      windowStyle() {
        return [{ position: 'relative', [`overflow-${this.isHorizontal ? 'x' : 'y'}`]: 'scroll', WebkitOverflowScrolling: 'touch', willChange: 'transform' }, { direction: this.direction, height: typeof this.height === 'number' ? `${this.height}px` : this.height, width: typeof this.width === 'number' ? `${this.width}px` : this.width }, this.$attrs.style];
      },
      innerStyle() {
        return { height: this.isHorizontal ? '100%' : `${this.estimatedTotalSize}px`, width: this.isHorizontal ? `${this.estimatedTotalSize}px` : (this.innerWidth === undefined ? '100%' : typeof this.innerWidth === 'number' ? `${this.innerWidth}px` : this.innerWidth), pointerEvents: this.state.isScrolling ? 'none' : undefined, margin: 0, boxSizing: 'border-box' };
      }
    },
    watch: {
      data() { this.resetAfterIndex(0, false); this.updateRange(); },
      total() { this.clampScrollOffset(); this.updateRange(); },
      itemSize() { this.resetAfterIndex(0, false); this.updateRange(); },
      estimatedItemSize() { this.updateRange(); },
      width() { this.clampScrollOffset(); },
      height() { this.clampScrollOffset(); },
      layout() { this.resetAfterIndex(0, false); this.clampScrollOffset(); }
    },
    created() {
      strategy.validateProps(this);
    },
    mounted() {
      this.$nextTick(() => {
        this.updateRange();
        if (this.$refs.window) this.$refs.window[this.isHorizontal ? 'scrollLeft' : 'scrollTop'] = this.state.scrollOffset;
        this.emitRendered();
        this.$emit(SCROLL_EVT, this.state.scrollDir, this.state.scrollOffset, this.state.updateRequested);
      });
    },
    updated() {
      if (this.state.updateRequested && this.$refs.window) this.$refs.window[this.isHorizontal ? 'scrollLeft' : 'scrollTop'] = this.state.scrollOffset;
    },
    methods: {
      updateRange() {
        this.$forceUpdate();
      },
      getItemStyleCache(itemSize, layout, direction) {
        const key = `${itemSize}:${layout}:${direction}`;
        if (key !== this.itemStyleCacheKey) {
          this.itemStyleCacheKey = key;
          this.itemStyleCache = {};
        }
        return this.itemStyleCache;
      },
      renderItem(h, index) {
        const slot = this.$scopedSlots.default;
        const style = this.getItemStyle(index);
        const nodes = slot ? slot({ data: this.data, item: this.data[index], index, style, isScrolling: this.useIsScrolling ? this.state.isScrolling : undefined }) : [];
        if (nodes.length === 1 && nodes[0] && nodes[0].tag) {
          const vnode = nodes[0];
          vnode.data = vnode.data || {};
          vnode.data.style = Object.assign({}, style, vnode.data.style || {});
          return vnode;
        }
        return h('div', { key: index, style }, nodes);
      },
      getItemStyle(index) {
        const cache = this.getItemStyleCache(this.itemSize, this.layout, this.direction);
        if (!cache[index]) {
          const offset = strategy.getItemOffset(this, index, this.itemCache);
          const size = strategy.getItemSize(this, index, this.itemCache);
          cache[index] = { position: 'absolute', left: this.isHorizontal && this.direction !== 'rtl' ? `${offset}px` : 0, right: this.isHorizontal && this.direction === 'rtl' ? `${offset}px` : null, top: this.isHorizontal ? 0 : `${offset}px`, width: this.isHorizontal ? `${size}px` : '100%', height: this.isHorizontal ? '100%' : `${size}px` };
        }
        return cache[index];
      },
      emitRendered() {
        const range = this.renderRange;
        this.$emit(ITEM_RENDER_EVT, range.cacheStartIndex, range.cacheStopIndex, range.startIndex, range.stopIndex);
      },
      onScroll(event) {
        const target = event.currentTarget;
        const raw = this.isHorizontal ? target.scrollLeft : target.scrollTop;
        const offset = this.isHorizontal ? normalizeRTLScrollLeft(raw, this.direction, target) : raw;
        if (offset === this.state.scrollOffset) return;
        this.state = Object.assign({}, this.state, { isScrolling: true, scrollDir: getScrollDir(this.state.scrollOffset, offset), scrollOffset: clamp(offset, 0, this.maxOffset), updateRequested: false });
        this.emitRendered();
        this.$emit(SCROLL_EVT, this.state.scrollDir, this.state.scrollOffset, false);
        this.emitEndReached();
        this.$nextTick(() => { this.state.isScrolling = false; });
      },
      onScrollbarScroll(distance, totalSteps) { if (!totalSteps) return; this.scrollTo((this.maxOffset / totalSteps) * distance); },
      onWheel(event) {
        const delta = this.isHorizontal ? (event.shiftKey ? event.deltaY : event.deltaX || event.deltaY) : event.deltaY;
        if (!delta) return;
        event.preventDefault();
        this.scrollTo(this.state.scrollOffset + delta);
      },
      scrollTo(offset) {
        const next = clamp(Number(offset) || 0, 0, this.maxOffset);
        if (next === this.state.scrollOffset) return;
        this.state = Object.assign({}, this.state, { scrollOffset: next, scrollDir: getScrollDir(this.state.scrollOffset, next), updateRequested: true });
        this.$emit(SCROLL_EVT, this.state.scrollDir, next, true);
        this.$forceUpdate();
      },
      scrollToItem(index, alignment = AUTO_ALIGNMENT) {
        if (!this.total) return;
        index = Math.max(0, Math.min(Number(index) || 0, this.total - 1));
        const size = this.clientSize;
        const item = strategy.getItemOffset(this, index, this.itemCache);
        const itemSize = strategy.getItemSize(this, index, this.itemCache);
        const max = Math.max(0, Math.min(this.estimatedTotalSize - size, item));
        const min = Math.max(0, item + itemSize - size);
        if (alignment === 'start') this.scrollTo(max);
        else if (alignment === 'end') this.scrollTo(min);
        else if (alignment === 'center') this.scrollTo(Math.round(min + (max - min) / 2));
        else if (alignment === SMART_ALIGNMENT && this.state.scrollOffset >= min && this.state.scrollOffset <= max) this.scrollTo(this.state.scrollOffset);
        else this.scrollTo(this.state.scrollOffset < min ? min : max);
      },
      resetAfterIndex(index = 0, forceUpdate = true) {
        strategy.resetAfterIndex(this, index);
        this.itemStyleCache = {};
        this.itemStyleCacheKey = null;
        if (forceUpdate) this.$forceUpdate();
      },
      resetScrollTop() { this.scrollTo(0); },
      clampScrollOffset() { if (this.state.scrollOffset > this.maxOffset) this.scrollTo(this.maxOffset); },
      emitEndReached() {
        const atStart = this.state.scrollOffset <= 1;
        const atEnd = this.maxOffset - this.state.scrollOffset <= 1;
        if (this.state.scrollDir === FORWARD && atEnd && !this.edgeState.end) this.$emit(END_REACHED_EVT, this.isHorizontal ? 'right' : 'bottom');
        if (this.state.scrollDir === BACKWARD && atStart && !this.edgeState.start) this.$emit(END_REACHED_EVT, this.isHorizontal ? 'left' : 'top');
        this.edgeState = { start: atStart, end: atEnd };
      }
    },
    render(h) {
      const children = this.itemsToRender.map(index => this.renderItem(h, index));
      const scrollbar = h(Scrollbar, { props: { layout: this.layout, total: this.total, ratio: this.estimatedTotalSize ? this.clientSize * 100 / this.estimatedTotalSize : 100, clientSize: this.clientSize, scrollFrom: this.maxOffset ? this.state.scrollOffset / this.maxOffset : 0, alwaysOn: this.scrollbarAlwaysOn, visible: true }, on: { scroll: this.onScrollbarScroll } });
      const innerData = Object.assign({}, this.innerProps, { ref: 'inner', style: Object.assign({}, this.innerProps.style || {}, this.innerStyle) });
      return h('div', { class: ['el-vl__wrapper', this.scrollbarAlwaysOn && 'always-on'] }, [h(this.containerElement, { ref: 'window', class: ['el-vl__window', this.className], style: this.windowStyle, on: { scroll: this.onScroll, wheel: this.onWheel } }, [h(this.innerElement, innerData, children)]), scrollbar]);
    }
  };
}
