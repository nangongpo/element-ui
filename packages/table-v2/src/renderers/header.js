import Header from '../components/header';

export default {
  name: 'TableV2HeaderRenderer',
  functional: true,
  props: { columns: Array, styles: Array, table: Object },
  render(h, context) {
    const p = context.props;
    return h(Header, { props: { columns: p.columns, columnStyles: p.styles, height: p.table.headerHeight, headerClass: p.table.headerClass, headerProps: p.table.headerProps, headerCellProps: p.table.headerCellProps, sortBy: p.table.sortBy, headerSlot: p.table.$scopedSlots.header }, on: { sort: column => p.table.$emit('column-sort', { column, key: column.key, order: p.table.nextSortOrder(column) }) } });
  }
};
