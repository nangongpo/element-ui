import { assertArray } from './util';
import TableVirtualRow from './table-row';

export default {
  name: 'ElTableVirtualBody',

  functional: true,

  props: {
    table: Object,
    columns: Array,
    fixed: Boolean
  },

  render(h, { props }) {
    const table = props.table;
    const columns = assertArray(props.columns, 'columns');
    const style = props.fixed
      ? {
        width: table.getColumnsWidth(columns) + 'px',
        transform: 'translateY(' + (table.offsetY - table.scrollTop) + 'px)'
      }
      : {
        width: table.mainWidth + 'px',
        transform: 'translate3d(0,' + table.offsetY + 'px,0)'
      };

    return (
      <div class="el-table-virtual__rows" style={style}>
        { table.visibleRows.map((row, index) => {
          const rowIndex = table.start + index;
          return h(TableVirtualRow, {
            props: {
              table,
              row,
              rowIndex,
              visibleIndex: index,
              columns
            }
          });
        }) }
      </div>
    );
  }
};
