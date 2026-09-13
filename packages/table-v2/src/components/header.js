import HeaderRow from './header-row';

export default {
  name: 'TableV2Header',
  components: { HeaderRow },
  props: { columns: Array, columnStyles: Array, height: [Number, Array], headerClass: [String, Function], headerProps: [Object, Function], headerCellProps: [Object, Function], sortBy: Object, sortState: Object, scrollLeft: Number, fixed: String, tableFixed: Boolean, width: Number, offset: Number, headerSlot: Function },
  render(h) {
    const heights = Array.isArray(this.height) ? this.height : [this.height];
    const headerProps = typeof this.headerProps === 'function' ? (this.headerProps({ columns: this.columns, headerIndex: 0 }) || {}) : (this.headerProps || {});
    const rows = heights.map((height, headerIndex) => h('header-row', {
      props: {
        columns: this.columns,
        styles: this.columnStyles,
        headerIndex,
        sortBy: this.sortBy,
        sortState: this.sortState,
        headerCellProps: this.headerCellProps,
        tableFixed: this.tableFixed,
        fixedColumn: !!this.fixed,
        headerSlot: this.headerSlot,
        headerClass: this.headerClass,
        rowHeight: height
      },
      scopedSlots: { default: scope => this.$scopedSlots['header-cell'] ? this.$scopedSlots['header-cell'](scope) : undefined },
      on: { sort: column => this.$emit('sort', column) }
    }));
    return h('div', {
      class: ['el-table-v2__header-layer', this.fixed ? `el-table-v2__header-fixed-${this.fixed}` : '', typeof this.headerClass === 'function' ? this.headerClass({ columns: this.columns, headerIndex: 0 }) : this.headerClass, headerProps.class],
      style: Object.assign({ height: `${heights.reduce((a, b) => a + b, 0)}px`, left: this.fixed ? undefined : `${this.offset || 0}px`, transform: this.fixed ? 'none' : `translateX(-${this.scrollLeft || 0}px)`, width: this.width ? `${this.width}px` : undefined }, headerProps.style || {}),
      attrs: headerProps.attrs
    }, rows.length === 1 ? rows : [h('div', { class: 'el-table-v2__header-rows' }, rows)]);
  }
};
