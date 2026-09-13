<template>
  <el-table-v2
    :columns="columns"
    :data="tableData"
    :fixed-data="fixedData"
    :width="700"
    :height="400"
    :row-class="rowClass"
    fixed
    @scroll="onScroll"
  />
</template>
<script>
export default {
  data() {
    return {
      columns: Array.from({ length: 10 }, (_, columnIndex) => ({
        key: 'column-' + columnIndex,
        dataKey: 'column-' + columnIndex,
        title: 'Column ' + columnIndex,
        width: 150
      })),
      data: [],
      stickyIndex: 0
    };
  },
  computed: {
    tableData() {
      return this.data.slice(1);
    },
    fixedData() {
      return this.data.slice(this.stickyIndex, this.stickyIndex + 1);
    }
  },
  methods: {
    generateData() {
      return Array.from({ length: 200 }, (_, rowIndex) =>
        this.columns.reduce(
          (rowData, column, columnIndex) => {
            rowData[column.dataKey] =
              'Row ' + rowIndex + ' - Col ' + columnIndex;
            return rowData;
          },
          {
            id: 'row-' + rowIndex,
            parentId: null
          }
        )
      );
    },
    rowClass({ rowIndex }) {
      if (rowIndex < 0 || (rowIndex + 1) % 5 === 0) {
        return 'sticky-row';
      }
      return '';
    },
    onScroll({ scrollTop }) {
      this.stickyIndex = Math.floor(scrollTop / 250) * 5;
    }
  },
  created() {
    this.data = this.generateData();
  }
};
</script>
<style>
.el-table-v2__fixed-header-row {
  background-color: #a0cfff;
  font-weight: bold;
}
</style>
