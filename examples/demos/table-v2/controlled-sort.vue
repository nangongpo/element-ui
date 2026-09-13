<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :sort-state="sortState"
    :width="700"
    :height="400"
    fixed
    @column-sort="onSort"
  />
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
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      { id: `${prefix}${rowIndex}`, parentId: null }
    )
  );

export default {
  data() {
    const columns = generateColumns(10);
    columns[0].sortable = true;
    columns[1].sortable = true;
    return {
      columns,
      data: generateData(columns, 200),
      sortState: {
        'column-0': 'desc',
        'column-1': 'asc'
      }
    };
  },
  methods: {
    onSort({ key, order }) {
      this.$set(this.sortState, key, order);
      this.data = this.data.slice().reverse();
    }
  }
};
</script>
