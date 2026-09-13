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
    ...(props || {}),
    key: prefix + columnIndex,
    dataKey: prefix + columnIndex,
    title: 'Column ' + columnIndex,
    width: 150
  }));

const generateData = (columns, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex;
        return rowData;
      },
      {
        id: prefix + rowIndex,
        parentId: null
      }
    )
  );

const cellStyle = vnode => vnode.componentOptions && vnode.componentOptions.propsData
  ? vnode.componentOptions.propsData.style || {}
  : (vnode.data && vnode.data.style) || (vnode.data && vnode.data.props && vnode.data.props.style) || {};

const columns = generateColumns(10);
const data = generateData(columns, 200);
const rowSpanIndex = 0;
columns[rowSpanIndex].rowSpan = ({ rowIndex }) =>
  rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1;

const Row = {
  functional: true,
  props: { cells: Array, columns: Array, rowData: Object, rowIndex: Number },
  render(h, context) {
    const { cells, columns, rowData, rowIndex } = context.props;
    const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex });
    if (rowSpan > 1) {
      const cell = cells[rowSpanIndex];
      const style = Object.assign({}, cellStyle(cell), {
        backgroundColor: '#79bbff',
        height: rowSpan * 50 - 1 + 'px',
        alignSelf: 'flex-start',
        zIndex: 1
      });
      cells[rowSpanIndex] = cloneVNode(h, cell, { style });
    }
    return cells;
  }
};

export default { components: { TableV2Row: Row }, data() { return { columns, data }; } };
</script>
