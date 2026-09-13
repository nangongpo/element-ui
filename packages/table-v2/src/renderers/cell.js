import Cell from '../components/cell';

export default {
  name: 'TableV2CellRenderer',
  functional: true,
  props: { column: Object, columns: Array, rowData: Object, rowIndex: Number, columnIndex: Number, style: Object, table: Object, isScrolling: Boolean },
  render(h, context) {
    const p = context.props;
    const value = p.table.getCellValue(p.column, p.rowData, p.rowIndex, p.columnIndex);
    return h(Cell, { props: { column: p.column, value, style: p.style, scope: { column: p.column, columns: p.columns, rowData: p.rowData, rowIndex: p.rowIndex, columnIndex: p.columnIndex, cellData: value, isScrolling: p.isScrolling }, cellRenderer: p.column.cellRenderer } });
  }
};
