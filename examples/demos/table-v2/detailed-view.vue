<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :estimated-row-height="50"
    :expand-column-key="columns[0].key"
    :width="700"
    :height="400"
  >
    <template slot="row" slot-scope="props">
      <table-v2-row v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="jsx">
const detailedText = `Velit sed aspernatur tempora. Natus consequatur officiis dicta vel assumenda.
Itaque est temporibus minus quis. Ipsum commodiab porro vel voluptas illum.
Qui quam nulla et dolore autem itaque est.
Id consequatur ipsum ea fuga et odit eligendi impedit.
Maiores officiis occaecati et magnam et sapiente est velit sunt.
Non et tempore temporibus. Excepturi et quos. Minus distinctio aut.
Voluptatem ea excepturi omnis vel. Non aperiam sit sed laboriosam eaque omnis deleniti.
Est molestiae omnis non et nulla repudiandae fuga sit.`;

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

const Row = {
  functional: true,
  props: { cells: Array, rowData: Object },
  render(h, context) {
    const { cells, rowData } = context.props;
    if (rowData && rowData.detail) return <div style={{ padding: '24px' }}>{rowData.detail}</div>;
    return cells;
  }
};

export default {
  components: { TableV2Row: Row },
  data() {
    const columns = generateColumns(10);
    const data = generateData(columns, 200).map(rowData => {
      rowData.children = [{ id: rowData.id + '-detail-content', detail: detailedText }];
      return rowData;
    });
    return { columns, data };
  }
};
</script>

<style>
.el-table-v2__row-depth-0 {
  height: 50px;
}
.el-table-v2__cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
