<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :sort-by="sortBy"
    :width="700"
    :height="400"
    fixed
    @column-sort="onSort"
  />
</template>
<script>
export default {
  data() {
    const columns = Array.from({ length: 10 }, (_, columnIndex) => ({
      key: 'column-' + columnIndex,
      dataKey: 'column-' + columnIndex,
      title: 'Column ' + columnIndex,
      width: 150
    }));

    columns[0].fixed = true;
    columns[1].fixed = 'left';
    columns[9].fixed = 'right';
    columns[0].sortable = true;

    return {
      columns,
      data: Array.from({ length: 200 }, (_, rowIndex) =>
        columns.reduce(
          (rowData, column, columnIndex) => {
            rowData[column.dataKey] =
              'Row ' + rowIndex + ' - Col ' + columnIndex;
            return rowData;
          },
          { id: 'row-' + rowIndex, parentId: null }
        )
      ),
      sortBy: { key: 'column-0', order: 'asc' }
    };
  },
  methods: {
    onSort(sortBy) {
      this.data = this.data.slice().reverse();
      this.sortBy = sortBy;
    }
  }
};
</script>
