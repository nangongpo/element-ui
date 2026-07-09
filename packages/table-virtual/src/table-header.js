import { assertArray } from './util';

export default {
  name: 'ElTableVirtualHeader',

  functional: true,

  props: {
    table: Object,
    columns: Array,
    fixed: Boolean
  },

  render(h, { props }) {
    const table = props.table;
    const columns = assertArray(props.columns, 'columns');
    if (!table.showHeader || !columns.length) return null;

    const style = props.fixed
      ? { width: table.getColumnsWidth(columns) + 'px' }
      : {
        width: table.mainWidth + 'px',
        transform: 'translateX(' + (-table.scrollLeft) + 'px)'
      };

    return (
      <div class="el-table-virtual__header-layer" style={style}>
        <div class={table.getHeaderRowClass()} style={table.getHeaderRowStyle()}>
          { columns.map((column, columnIndex) => (
            <div
              class={table.getCellClass(null, column, 0, columnIndex, true)}
              style={table.getCellStyle(null, column, 0, columnIndex, true)}
              on-click={event => table.handleHeaderClick(event, column)}
              on-contextmenu={event => table.handleHeaderContextmenu(event, column)}>
              <div class="cell">
                { table.renderHeaderContent(h, column, columnIndex) }
                { column.sortable ? <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span> : null }
                { column.filterable ? (
                  <span
                    class="el-table__column-filter-trigger"
                    on-click={event => table.handleFilterClick(event, column)}>
                    <i class={['el-icon-arrow-down', column.filterOpened ? 'el-icon-arrow-up' : '']}></i>
                  </span>
                ) : null }
              </div>
            </div>
          )) }
        </div>
      </div>
    );
  }
};
