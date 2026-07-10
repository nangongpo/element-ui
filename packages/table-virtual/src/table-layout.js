import {
  assertArray,
  getColumnMinWidth,
  getColumnWidth,
  getStyleNumber,
  isFlexColumn
} from './util';

export default {
  computed: {
    fixedLeftWidth() {
      return this.getColumnsWidth(this.fixedColumns);
    },

    fixedRightWidth() {
      return this.getColumnsWidth(this.rightFixedColumns);
    },

    scrollBodyWidth() {
      return this.mainWidth + (this.rightFixedColumns.length ? this.fixedRightWidth : 0);
    }
  },

  methods: {
    updateColumns(bodyWidth) {
      const columns = this.tableColumns;
      const layoutWidth = bodyWidth === undefined
        ? this.bodyWidth || (this.$refs.body && this.$refs.body.clientWidth) || 0
        : bodyWidth;
      const flexColumns = [];
      const columnWidths = [];
      let bodyMinWidth = 0;

      columns.forEach((column, index) => {
        const width = isFlexColumn(column)
          ? getColumnMinWidth(column)
          : getStyleNumber(column.width);
        columnWidths[index] = width;
        if (isFlexColumn(column)) {
          flexColumns.push({
            column,
            index
          });
        }
        bodyMinWidth += width;
      });

      if (this.fit && flexColumns.length && layoutWidth > bodyMinWidth) {
        let totalFlexWidth = layoutWidth - bodyMinWidth;
        if (flexColumns.length === 1) {
          columnWidths[flexColumns[0].index] += totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, item) => prev + getColumnMinWidth(item.column), 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((item, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(getColumnMinWidth(item.column) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            columnWidths[item.index] += flexWidth;
          });
          columnWidths[flexColumns[0].index] += totalFlexWidth - noneFirstWidth;
        }
      }

      let left = 0;
      columns.forEach((column, index) => {
        const width = columnWidths[index];
        if (column.realWidth !== width) {
          column.realWidth = width;
        }
        if (column.left !== left) {
          column.left = left;
        }
        left += width;
      });
    },

    getColumnsWidth(columns) {
      let width = 0;
      assertArray(columns, 'columns').forEach(column => {
        width += getColumnWidth(column);
      });
      return width;
    },

    doLayout() {
      const body = this.$refs.body;
      if (!body) return;
      const scrollbarWidth = this.scrollbarWidth || 0;
      const bodyWidth = body.offsetWidth;
      const autoHeight = this.isAutoHeight;
      const bodyHeight = autoHeight ? this.totalHeight : body.offsetHeight;
      let hasHorizontalScroll = this.hasHorizontalScroll;
      let hasVerticalScroll = this.hasVerticalScroll;

      for (let i = 0; i < 3; i++) {
        const availableHeight = autoHeight
          ? this.totalHeight
          : Math.max(0, bodyHeight - (hasHorizontalScroll ? scrollbarWidth : 0));
        const availableWidth = Math.max(0, bodyWidth - (hasVerticalScroll ? scrollbarWidth : 0));
        this.updateColumns(availableWidth);
        const nextHasHorizontalScroll = this.scrollBodyWidth > availableWidth;
        const nextHasVerticalScroll = autoHeight ? false : this.totalHeight > availableHeight;
        if (nextHasHorizontalScroll === hasHorizontalScroll && nextHasVerticalScroll === hasVerticalScroll) break;
        hasHorizontalScroll = nextHasHorizontalScroll;
        hasVerticalScroll = nextHasVerticalScroll;
      }

      const availableHeight = autoHeight
        ? this.totalHeight
        : Math.max(0, bodyHeight - (hasHorizontalScroll ? scrollbarWidth : 0));
      const availableWidth = Math.max(0, bodyWidth - (hasVerticalScroll ? scrollbarWidth : 0));
      this.updateColumns(availableWidth);
      if (this.bodyHeight !== availableHeight) {
        this.bodyHeight = availableHeight;
      }
      if (this.bodyWidth !== availableWidth) {
        this.bodyWidth = availableWidth;
      }
      if (this.hasVerticalScroll !== hasVerticalScroll) {
        this.hasVerticalScroll = hasVerticalScroll;
      }
      if (this.hasHorizontalScroll !== hasHorizontalScroll) {
        this.hasHorizontalScroll = hasHorizontalScroll;
      }
      this.updateRange();
    },

    resizeListener() {
      const el = this.$el;
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const widthChanged = width !== this.resizeState.width;
      const heightChanged = height !== this.resizeState.height;
      if (!widthChanged && !heightChanged) return;
      this.resizeState.width = width;
      this.resizeState.height = height;
      if (!widthChanged && this.isAutoHeight) return;
      this.scheduleLayout();
    },

    updateRange() {
      const dataLength = this.viewLength;
      const visibleCount = Math.ceil((this.bodyHeight || 0) / this.rowHeight);
      const start = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - this.overscan);
      const end = Math.min(dataLength, start + visibleCount + this.overscan * 2 + 1);
      const offsetY = start * this.rowHeight;
      if (this.start !== start) {
        this.start = start;
      }
      if (this.end !== end) {
        this.end = end;
      }
      if (this.offsetY !== offsetY) {
        this.offsetY = offsetY;
      }
    }
  }
};
