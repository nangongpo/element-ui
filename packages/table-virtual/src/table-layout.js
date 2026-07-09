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
    updateColumns() {
      const columns = this.tableColumns;
      const bodyWidth = this.bodyWidth || (this.$refs.body && this.$refs.body.clientWidth) || 0;
      const flexColumns = columns.filter(column => isFlexColumn(column));
      let bodyMinWidth = 0;

      columns.forEach(column => {
        if (isFlexColumn(column)) {
          column.realWidth = getColumnMinWidth(column);
        } else {
          column.realWidth = getStyleNumber(column.width);
        }
        bodyMinWidth += column.realWidth;
      });

      if (this.fit && flexColumns.length && bodyWidth > bodyMinWidth) {
        let totalFlexWidth = bodyWidth - bodyMinWidth;
        if (flexColumns.length === 1) {
          flexColumns[0].realWidth += totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + getColumnMinWidth(column), 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(getColumnMinWidth(column) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth += flexWidth;
          });
          flexColumns[0].realWidth += totalFlexWidth - noneFirstWidth;
        }
      }

      let left = 0;
      columns.forEach(column => {
        column.left = left;
        left += column.realWidth;
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
      const bodyHeight = body.clientHeight;
      const bodyWidth = body.clientWidth;
      this.bodyHeight = bodyHeight;
      this.bodyWidth = bodyWidth;
      this.hasVerticalScroll = this.totalHeight > bodyHeight;
      this.updateColumns();
      this.hasHorizontalScroll = this.scrollBodyWidth > bodyWidth;
      this.updateRange();
    },

    resizeListener() {
      const el = this.$el;
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width === this.resizeState.width && height === this.resizeState.height) return;
      this.resizeState.width = width;
      this.resizeState.height = height;
      this.doLayout();
    },

    updateRange() {
      const dataLength = this.viewLength;
      const visibleCount = Math.ceil((this.bodyHeight || 0) / this.rowHeight);
      const start = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - this.overscan);
      const end = Math.min(dataLength, start + visibleCount + this.overscan * 2 + 1);
      this.start = start;
      this.end = end;
      this.offsetY = start * this.rowHeight;
    }
  }
};
