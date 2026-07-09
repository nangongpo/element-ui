import { getRowKey } from './util';

export default {
  name: 'ElTableVirtualRow',

  functional: true,

  props: {
    table: Object,
    row: Object,
    rowIndex: Number,
    visibleIndex: Number,
    columns: Array
  },

  render(h, { props }) {
    const table = props.table;
    const row = props.row;
    const rowIndex = props.rowIndex;
    const visibleIndex = props.visibleIndex;
    const columns = props.columns;

    return (
      <div
        class={table.getRowClass(row, rowIndex)}
        style={table.getRowStyle(row, rowIndex)}
        key={getRowKey(row, table.rowKey, rowIndex)}
      >
        { columns.map((column, columnIndex) => (
          <div
            class={table.getCellClass(row, column, rowIndex, columnIndex, false)}
            style={table.getCellStyle(row, column, rowIndex, columnIndex, false)}
            on-mouseenter={event => table.handleCellMouseEnter(event, row, column, rowIndex)}
            on-mouseleave={event => table.handleCellMouseLeave(event, row, column)}
            on-click={event => table.handleCellClick(event, row, column, rowIndex)}
            on-dblclick={event => table.handleCellDblclick(event, row, column)}
            on-contextmenu={event => table.handleCellContextmenu(event, row, column)}>
            { table.renderCellContent(h, row, column, rowIndex, visibleIndex) }
          </div>
        )) }
      </div>
    );
  }
};
