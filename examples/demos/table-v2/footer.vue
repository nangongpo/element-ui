<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :row-height="40"
    :width="700"
    :height="400"
    :footer-height="50"
    fixed>
    <template slot="footer">
      <div
        class="flex items-center"
        style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #c6e2ff;">
        Display a message in the footer
      </div>
    </template>
  </el-table-v2>
</template>

<script>
const generateColumns = (length = 10, prefix = 'column-', props) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...(props || {}),
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }));

const generateData = (columns, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => columns.reduce((rowData, column, columnIndex) => {
    rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
    return rowData;
  }, { id: `${prefix}${rowIndex}`, parentId: null }));

export default {
  data() {
    const columns = generateColumns(10);
    const data = generateData(columns, 200);
    return { columns, data };
  }
};
</script>
