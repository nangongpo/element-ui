export default {
  computed: {
    tableBodyHeight() {
      const height = this.maxHeight == null ? this.height : Math.min(this.height, this.maxHeight);
      return Math.max(0, height - this.resolvedHeaderHeight - this.footerHeight);
    },
    dynamicRows() { return typeof this.estimatedRowHeight === 'number' && this.estimatedRowHeight > 0; }
  },
  methods: {
    rowHeightOf() { return this.dynamicRows ? this.estimatedRowHeight : this.rowHeight; },
    rowStyle(index, virtualStyle) { return Object.assign({ height: this.dynamicRows ? undefined : `${this.rowHeight}px` }, virtualStyle || {}); },
    cellStyle(column, columnIndex) { return Object.assign({ width: `${Number(column.width || column.minWidth || 0)}px` }, column.style || {}, { flexShrink: column.flexShrink == null ? 1 : column.flexShrink, flexGrow: column.flexGrow || 0 }); }
  }
};
