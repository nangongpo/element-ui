<template>
  <el-table-v2 fixed :columns="columns" :data="data" :width="700" :height="400">
    <template slot="row" slot-scope="props">
      <table-v2-row v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="jsx">
import { cloneVNode } from 'element-ui/src/utils/vue2-util';

const generateColumns = (length = 10, prefix = 'column-', props) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...(props || {}), key: prefix + columnIndex, dataKey: prefix + columnIndex,
    title: 'Column ' + columnIndex, width: 150
  }));
const generateData = (columns, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => columns.reduce((rowData, column, columnIndex) => {
    rowData[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex;
    return rowData;
  }, { id: prefix + rowIndex, parentId: null }));
const cellStyle = vnode => vnode.componentOptions && vnode.componentOptions.propsData
  ? vnode.componentOptions.propsData.style || {}
  : (vnode.data && vnode.data.style) || (vnode.data && vnode.data.props && vnode.data.props.style) || {};
const columns = generateColumns(10);
const data = generateData(columns, 200);
const colSpanIndex = 1;
columns[colSpanIndex].colSpan = ({ rowIndex }) => (rowIndex % 4) + 1;
columns[colSpanIndex].align = 'center';
const rowSpanIndex = 0;
columns[rowSpanIndex].rowSpan = ({ rowIndex }) => rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1;
const Row = {
  functional: true,
  props: { cells: Array, columns: Array, rowData: Object, rowIndex: Number },
  render(h, context) {
    const { cells, columns, rowData, rowIndex } = context.props;
    const colSpan = columns[colSpanIndex].colSpan({ rowData, rowIndex });
    if (colSpan > 1) {
      let width = parseInt(cellStyle(cells[colSpanIndex]).width, 10);
      for (let i = 1; i < colSpan; i += 1) {
        width += parseInt(cellStyle(cells[colSpanIndex + i]).width, 10);
        cells[colSpanIndex + i] = null;
      }
      const style = Object.assign({}, cellStyle(cells[colSpanIndex]), {
        width: width + 'px',
        backgroundColor: '#79bbff'
      });
      cells[colSpanIndex] = cloneVNode(h, cells[colSpanIndex], {
        style
      });
    }
    const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex });
    if (rowSpan > 1) {
      cells[rowSpanIndex] = cloneVNode(h, cells[rowSpanIndex], { style: {
        backgroundColor: '#f89898', height: rowSpan * 50 + 'px',
        alignSelf: 'flex-start', zIndex: 1
      } });
    } else {
      const style = cellStyle(cells[rowSpanIndex]);
      cells[rowSpanIndex] = h('div', { style: Object.assign({}, style, { width: style.width }) });
    }
    return cells;
  }
};
export default { components: { TableV2Row: Row }, data() { return { columns, data }; } };
</script>
