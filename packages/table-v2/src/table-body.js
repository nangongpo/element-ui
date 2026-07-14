import { assertArray } from './util';
import TableV2Row from './table-row';

export default {
  name: 'ElTableV2Body',

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
        transform: 'translate3d(0,' + (table.offsetY - table.scrollTop) + 'px,0)'
      }
      : {
        width: table.mainWidth + 'px',
        transform: 'translate3d(0,' + table.offsetY + 'px,0)'
      };

    return (
      <div class="el-table-v2__rows" style={style}>
        { table.visibleRows.map((row, index) => {
          const rowIndex = table.start + index;
          return h(TableV2Row, {
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
