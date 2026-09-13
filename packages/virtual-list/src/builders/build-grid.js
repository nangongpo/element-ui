import Scrollbar from '../components/scrollbar';
import { virtualizedGridProps } from '../props';
import { BACKWARD, END_REACHED_EVT, FORWARD, ITEM_RENDER_EVT, RTL, SCROLL_EVT } from '../defaults';
import { clamp, getScrollDir, normalizeRTLScrollLeft } from '../utils';

export default function buildGrid(strategy) {
  return {
    name: strategy.name,
    components: { Scrollbar },
    props: virtualizedGridProps,
    data() {
      return {
        state: {
          isScrolling: false,
          scrollLeft: Number(this.initScrollLeft) || 0,
          scrollTop: Number(this.initScrollTop) || 0,
          updateRequested: false,
          xAxisScrollDir: FORWARD,
          yAxisScrollDir: FORWARD
        },
        cache: strategy.initCache(this),
        columnsRange: [0, -1, 0, -1],
        rowsRange: [0, -1, 0, -1],
        edgeState: { left: true, right: false, top: true, bottom: false },
        itemStyleCache: {},
        itemStyleCacheKey: null,
        touchStartX: 0,
        touchStartY: 0
      };
    },
    computed: {
      parsedWidth() { return Number.parseInt(`${this.width}`, 10) || 0; },
      parsedHeight() { return Number.parseInt(`${this.height}`, 10) || 0; },
      states() { return this.state; },
      estimatedTotalWidth() {
        if (this.innerWidth != null) return Number(this.innerWidth) || 0;
        return strategy.getEstimatedTotalWidth(this, this.cache);
      },
      estimatedTotalHeight() { return strategy.getEstimatedTotalHeight(this, this.cache); },
      maxScrollLeft() { return Math.max(0, this.estimatedTotalWidth - this.parsedWidth); },
      maxScrollTop() { return Math.max(0, this.estimatedTotalHeight - this.parsedHeight); },
      columnRange() {
        const start = strategy.getColumnStartIndex(this, this.state.scrollLeft, this.cache);
        const stop = strategy.getColumnStopIndex(this, start, this.state.scrollLeft, this.cache);
        const backward = !this.state.isScrolling || this.state.xAxisScrollDir === BACKWARD ? Math.max(1, this.columnCache) : 1;
        const forward = !this.state.isScrolling || this.state.xAxisScrollDir === FORWARD ? Math.max(1, this.columnCache) : 1;
        return [Math.max(0, start - backward), Math.min(this.totalColumn - 1, stop + forward), start, stop];
      },
      rowRange() {
        const start = strategy.getRowStartIndex(this, this.state.scrollTop, this.cache);
        const stop = strategy.getRowStopIndex(this, start, this.state.scrollTop, this.cache);
        const backward = !this.state.isScrolling || this.state.yAxisScrollDir === BACKWARD ? Math.max(1, this.rowCache) : 1;
        const forward = !this.state.isScrolling || this.state.yAxisScrollDir === FORWARD ? Math.max(1, this.rowCache) : 1;
        return [Math.max(0, start - backward), Math.min(this.totalRow - 1, stop + forward), start, stop];
      }
    },
    watch: {
      data() { this.resetAfter(); },
      width() { this.clampScroll(); },
      height() { this.clampScroll(); },
      columnWidth() { this.resetAfter(0, 0); },
      rowHeight() { this.resetAfter(0, 0); },
      totalColumn() { this.clampScroll(); },
      totalRow() { this.clampScroll(); }
    },
    created() {
      strategy.validateProps(this);
      this.$watch('columnRange', value => { this.columnsRange = value; this.emitRendered(); }, { immediate: true });
      this.$watch('rowRange', value => { this.rowsRange = value; this.emitRendered(); }, { immediate: true });
    },
    mounted() {
      this.$nextTick(() => {
        this.syncScrollPosition();
        this.emitRendered();
        this.emitScroll();
      });
    },
    updated() { this.syncScrollPosition(); },
    methods: {
      getItemStyleCache(columnWidth, rowHeight, direction) {
        const key = `${columnWidth}:${rowHeight}:${direction}`;
        if (key !== this.itemStyleCacheKey) {
          this.itemStyleCacheKey = key;
          this.itemStyleCache = {};
        }
        return this.itemStyleCache;
      },
      getColumnStyle(index) {
        const cache = this.getItemStyleCache(this.columnWidth, this.rowHeight, this.direction);
        const key = `column:${index}`;
        if (!cache[key]) cache[key] = { position: 'absolute', left: this.direction === RTL ? undefined : `${strategy.getColumnOffset(this, index, this.cache)}px`, right: this.direction === RTL ? `${strategy.getColumnOffset(this, index, this.cache)}px` : undefined, width: `${strategy.getColumnSize(this, index, this.cache)}px` };
        return cache[key];
      },
      getRowStyle(index) {
        const cache = this.getItemStyleCache(this.columnWidth, this.rowHeight, this.direction);
        const key = `row:${index}`;
        if (!cache[key]) cache[key] = { position: 'absolute', top: `${strategy.getRowOffset(this, index, this.cache)}px`, height: `${strategy.getRowSize(this, index, this.cache)}px` };
        return cache[key];
      },
      getCellStyle(rowIndex, columnIndex) { return Object.assign({}, this.getColumnStyle(columnIndex), this.getRowStyle(rowIndex)); },
      emitRendered() {
        if (!this.totalColumn || !this.totalRow) return;
        this.$emit(ITEM_RENDER_EVT, { columnCacheStart: this.columnsRange[0], columnCacheEnd: this.columnsRange[1], rowCacheStart: this.rowsRange[0], rowCacheEnd: this.rowsRange[1], columnVisibleStart: this.columnsRange[2], columnVisibleEnd: this.columnsRange[3], rowVisibleStart: this.rowsRange[2], rowVisibleEnd: this.rowsRange[3] });
      },
      emitScroll() { this.$emit(SCROLL_EVT, Object.assign({}, this.state)); },
      onScroll(event) {
        const target = event.currentTarget;
        const nextLeft = clamp(normalizeRTLScrollLeft(target.scrollLeft, this.direction, target), 0, this.maxScrollLeft);
        const nextTop = clamp(target.scrollTop, 0, this.maxScrollTop);
        if (nextLeft === this.state.scrollLeft && nextTop === this.state.scrollTop) return;
        this.state = Object.assign({}, this.state, { isScrolling: true, scrollLeft: nextLeft, scrollTop: nextTop, updateRequested: false, xAxisScrollDir: getScrollDir(this.state.scrollLeft, nextLeft), yAxisScrollDir: getScrollDir(this.state.scrollTop, nextTop) });
        this.emitRendered();
        this.emitScroll();
        this.emitEndReached();
        this.$nextTick(() => { this.state.isScrolling = false; });
      },
      onWheel(event) {
        const deltaX = Number(event.deltaX) || 0;
        const deltaY = Number(event.deltaY) || 0;
        // Keep a predominantly vertical wheel gesture on the vertical axis.
        // Trackpads can report a small deltaX together with deltaY, which
        // otherwise makes the horizontal scrollbar move during vertical
        // scrolling.
        const x = event.shiftKey ? deltaY : (Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : 0);
        const y = event.shiftKey ? 0 : deltaY;
        if (!x && !y) return;
        event.preventDefault();
        this.scrollTo({ scrollLeft: this.state.scrollLeft + x, scrollTop: this.state.scrollTop + y });
      },
      handleTouchStart(event) {
        const touch = event.touches && event.touches[0];
        if (!touch) return;
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      handleTouchMove(event) {
        const touch = event.touches && event.touches[0];
        if (!touch) return;
        const deltaX = this.touchStartX - touch.clientX;
        const deltaY = this.touchStartY - touch.clientY;
        if (!deltaX && !deltaY) return;
        event.preventDefault();
        this.scrollTo({ scrollLeft: this.state.scrollLeft + deltaX, scrollTop: this.state.scrollTop + deltaY });
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      onHorizontalScrollbar(distance, totalSteps) { if (totalSteps) this.scrollTo({ scrollLeft: this.maxScrollLeft / totalSteps * distance, scrollTop: this.state.scrollTop }); },
      onVerticalScrollbar(distance, totalSteps) { if (totalSteps) this.scrollTo({ scrollLeft: this.state.scrollLeft, scrollTop: this.maxScrollTop / totalSteps * distance }); },
      scrollTo(options) {
        const nextLeft = clamp(options.scrollLeft == null ? this.state.scrollLeft : options.scrollLeft, 0, this.maxScrollLeft);
        const nextTop = clamp(options.scrollTop == null ? this.state.scrollTop : options.scrollTop, 0, this.maxScrollTop);
        if (nextLeft === this.state.scrollLeft && nextTop === this.state.scrollTop) return;
        this.state = Object.assign({}, this.state, { scrollLeft: nextLeft, scrollTop: nextTop, updateRequested: true, xAxisScrollDir: getScrollDir(this.state.scrollLeft, nextLeft), yAxisScrollDir: getScrollDir(this.state.scrollTop, nextTop) });
        this.emitScroll();
        this.$forceUpdate();
      },
      scrollToItem(rowIndex = 0, columnIndex = 0, alignment = 'auto') {
        const row = Math.max(0, Math.min(this.totalRow - 1, rowIndex));
        const column = Math.max(0, Math.min(this.totalColumn - 1, columnIndex));
        this.scrollTo({ scrollLeft: this.resolveItemOffset(column, alignment, true), scrollTop: this.resolveItemOffset(row, alignment, false) });
      },
      resolveItemOffset(index, alignment, horizontal) {
        const size = horizontal ? this.parsedWidth : this.parsedHeight;
        const item = horizontal ? strategy.getColumnOffset(this, index, this.cache) : strategy.getRowOffset(this, index, this.cache);
        const itemSize = horizontal ? strategy.getColumnSize(this, index, this.cache) : strategy.getRowSize(this, index, this.cache);
        const total = horizontal ? this.estimatedTotalWidth : this.estimatedTotalHeight;
        const current = horizontal ? this.state.scrollLeft : this.state.scrollTop;
        const max = Math.max(0, Math.min(total - size, item));
        const min = Math.max(0, item + itemSize - size);
        if (alignment === 'start') return max;
        if (alignment === 'end') return min;
        if (alignment === 'center') return Math.round(min + (max - min) / 2);
        if (alignment === 'smart' && current >= min && current <= max) return current;
        return current < min ? min : max;
      },
      resetAfter(columnIndex = 0, rowIndex = 0, forceUpdate = true) { if (strategy.resetAfter) strategy.resetAfter(this, columnIndex, rowIndex); if (forceUpdate) this.$forceUpdate(); },
      resetAfterColumnIndex(index = 0, forceUpdate = true) { this.resetAfter(index, 0, forceUpdate); },
      resetAfterRowIndex(index = 0, forceUpdate = true) { this.resetAfter(0, index, forceUpdate); },
      clampScroll() {
        const scrollLeft = Math.min(this.state.scrollLeft, this.maxScrollLeft);
        const scrollTop = Math.min(this.state.scrollTop, this.maxScrollTop);
        if (scrollLeft === this.state.scrollLeft && scrollTop === this.state.scrollTop) return;
        this.scrollTo({ scrollLeft, scrollTop });
      },
      syncScrollPosition() {
        if (!this.$refs.window || !this.state.updateRequested) return;
        this.$refs.window.scrollLeft = this.state.scrollLeft;
        this.$refs.window.scrollTop = this.state.scrollTop;
        this.state.updateRequested = false;
      },
      emitEndReached() {
        if (this.state.xAxisScrollDir === FORWARD && this.maxScrollLeft - this.state.scrollLeft <= 1 && !this.edgeState.right) this.$emit(END_REACHED_EVT, 'right');
        if (this.state.xAxisScrollDir === BACKWARD && this.state.scrollLeft <= 1 && !this.edgeState.left) this.$emit(END_REACHED_EVT, 'left');
        if (this.state.yAxisScrollDir === FORWARD && this.maxScrollTop - this.state.scrollTop <= 1 && !this.edgeState.bottom) this.$emit(END_REACHED_EVT, 'bottom');
        if (this.state.yAxisScrollDir === BACKWARD && this.state.scrollTop <= 1 && !this.edgeState.top) this.$emit(END_REACHED_EVT, 'top');
        this.edgeState = { left: this.state.scrollLeft <= 1, right: this.maxScrollLeft - this.state.scrollLeft <= 1, top: this.state.scrollTop <= 1, bottom: this.maxScrollTop - this.state.scrollTop <= 1 };
      }
    },
    render(h) {
      const cells = [];
      for (let rowIndex = this.rowsRange[0]; rowIndex <= this.rowsRange[1]; rowIndex++) {
        for (let columnIndex = this.columnsRange[0]; columnIndex <= this.columnsRange[1]; columnIndex++) {
          const slot = this.$scopedSlots.default;
          const key = this.itemKey({ columnIndex, rowIndex, data: this.data });
          const content = slot ? slot({ columnIndex, rowIndex, data: this.data, key, style: this.getCellStyle(rowIndex, columnIndex), isScrolling: this.useIsScrolling ? this.state.isScrolling : undefined }) : [];
          const cellStyle = this.getCellStyle(rowIndex, columnIndex);
          const children = Array.isArray(content) ? content : (content ? [content] : []);
          // A table cell already receives the virtual position from its slot
          // scope. Reuse a single VNode directly so the position is not
          // applied twice by an additional absolutely positioned wrapper.
          if (children.length === 1 && children[0] && children[0].tag) {
            const vnode = children[0];
            vnode.key = vnode.key || key;
            vnode.data = vnode.data || {};
            vnode.data.style = Object.assign({}, cellStyle, vnode.data.style || {});
            cells.push(vnode);
          } else {
            cells.push(h('div', { key, style: cellStyle }, children));
          }
        }
      }
      const innerData = Object.assign({}, this.innerProps, { ref: 'inner', style: Object.assign({}, this.innerProps.style || {}, { width: `${this.estimatedTotalWidth}px`, height: `${this.estimatedTotalHeight}px`, position: 'relative' }) });
      const inner = h(this.innerElement, innerData, cells);
      const horizontal = h(Scrollbar, { props: { layout: 'horizontal', total: this.totalColumn, ratio: this.estimatedTotalWidth ? this.parsedWidth * 100 / this.estimatedTotalWidth : 100, clientSize: this.parsedWidth, scrollFrom: this.maxScrollLeft ? this.state.scrollLeft / this.maxScrollLeft : 0, scrollbarSize: this.hScrollbarSize, startGap: this.scrollbarStartGap, endGap: this.scrollbarEndGap, alwaysOn: this.scrollbarAlwaysOn, visible: true }, on: { scroll: this.onHorizontalScrollbar } });
      const vertical = h(Scrollbar, { props: { layout: 'vertical', total: this.totalRow, ratio: this.estimatedTotalHeight ? this.parsedHeight * 100 / this.estimatedTotalHeight : 100, clientSize: this.parsedHeight, scrollFrom: this.maxScrollTop ? this.state.scrollTop / this.maxScrollTop : 0, scrollbarSize: this.vScrollbarSize, startGap: this.scrollbarStartGap, endGap: this.scrollbarEndGap, alwaysOn: this.scrollbarAlwaysOn, visible: true }, on: { scroll: this.onVerticalScrollbar } });
      return h('div', { class: ['el-vl__wrapper', this.scrollbarAlwaysOn && 'always-on'], style: this.$attrs.style }, [h(this.containerElement, { ref: 'window', class: ['el-vl__window', this.className], attrs: { role: this.role }, style: { position: 'relative', overflow: 'hidden', width: typeof this.width === 'number' ? `${this.width}px` : this.width, height: typeof this.height === 'number' ? `${this.height}px` : this.height, direction: this.direction }, on: { scroll: this.onScroll, wheel: this.onWheel, touchstart: this.handleTouchStart, touchmove: this.handleTouchMove } }, [inner]), horizontal, vertical]);
    }
  };
}
