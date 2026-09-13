import Row from '../components/row';

export default {
  name: 'TableV2RowRenderer',
  functional: true,
  props: { columns: Array, entry: Object, rowIndex: Number, table: Object, fixed: String, fixedLayout: Boolean, isScrolling: Boolean, rowClass: [String, Array, Object] },
  render(h, context) {
    const p = context.props;
    const table = p.table;
    const row = p.entry.row;
    const key = p.entry.key;
    const rowProps = table.getRowProps(row, p.rowIndex);
    return h(Row, {
      key,
      props: {
        columns: p.columns,
        rowData: row,
        rowIndex: p.rowIndex,
        rowKey: key,
        depth: p.entry.depth,
        cellStyles: p.columns.map(column => table.cellStyle(column, !!p.fixed)),
        cellProps: table.cellProps,
        expandColumnKey: table.expandColumnKey,
        expanded: table.resolvedExpandedKeys.indexOf(key) !== -1,
        indentSize: table.indentSize,
        iconSize: table.iconSize,
        isScrolling: p.isScrolling,
        rowClass: [table.getRowClass(row, p.rowIndex), p.fixedLayout ? 'is-fixed-layout' : '', p.rowClass],
        rowStyle: table.getRowStyle(row, p.rowIndex, context.data.style),
        rowProps,
        cellRenderer: scope => table.cellRenderer(scope),
        dataGetter: table.dataGetter
      },
      style: undefined,
      domProps: rowProps.domProps,
      attrs: rowProps.attrs,
      on: Object.assign({}, table.getRowEventHandlers(row, p.rowIndex), {
        expand: expanded => table.toggleRow(row, p.rowIndex, expanded),
        mouseenter: event => table.handleRowHover(true, row, p.rowIndex, event),
        mouseleave: event => table.handleRowHover(false, row, p.rowIndex, event)
      }),
      scopedSlots: context.scopedSlots
    });
  }
};
