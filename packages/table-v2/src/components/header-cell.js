import SortIcon from './sort-icon';
import { columnAlignClass } from '../utils';

export default {
  name: 'TableV2HeaderCell',
  components: { SortIcon },
  props: {
    column: Object,
    columnIndex: Number,
    headerIndex: Number,
    sortBy: Object,
    sortState: Object,
    cellProps: [Object, Function]
  },
  computed: {
    cellStyle() {
      // Vue 2 keeps class/style on the component VNode data instead of
      // exposing them through $attrs. Header cells must forward the exact
      // column layout style to match Element Plus' renderer.
      return (this.$vnode && this.$vnode.data && this.$vnode.data.style) || {};
    },
    order() {
      if (this.sortState && this.sortState[this.column.key]) return this.sortState[this.column.key];
      return this.sortBy && this.sortBy.key === this.column.key ? this.sortBy.order : undefined;
    },
    extraProps() {
      const value = this.cellProps;
      const scope = { column: this.column, columns: this.$parent.columns || [], columnIndex: this.columnIndex, headerIndex: this.headerIndex, style: this.cellStyle };
      return typeof value === 'function' ? (value(scope) || {}) : (value || {});
    }
  },
  render(h) {
    const column = this.column;
    const scope = {
      column,
      columns: this.$parent.columns || [],
      columnIndex: this.columnIndex,
      headerIndex: this.headerIndex,
      style: this.cellStyle,
      sortBy: this.sortBy
    };
    const renderer = column.headerCellRenderer;
    let content = null;
    if (column.placeholderSign) content = [];
    else if (typeof renderer === 'function') content = renderer(scope);
    else if (renderer) content = h(renderer, { props: scope });
    if (!content) {
      const slot = this.$scopedSlots.default;
      content = slot ? slot(scope) : null;
      if (!content) content = [h('div', { class: 'el-table-v2__header-cell-text', attrs: { title: column.title || '' } }, [column.title || ''])];
    }
    const children = Array.isArray(content) ? content : [content];
    return h('div', {
      class: ['el-table-v2__header-cell', columnAlignClass(column.headerAlign || column.align), column.headerClass, this.extraProps.class, column.sortable ? 'is-sortable' : ''],
      // Element Plus applies the calculated column style after header props.
      // Keep the column layout authoritative for width/flex/min/max rules.
      style: this.cellStyle,
      attrs: Object.assign({ 'data-key': column.key, role: 'columnheader' }, this.extraProps.attrs || {}, column.sortable ? { 'aria-sort': this.order || 'none' } : {}),
      on: { click: () => column.sortable && this.$emit('sort', column) }
    }, children.concat(column.sortable ? [h('sort-icon', { props: { order: this.order, label: column.title } })] : []));
  }
};
