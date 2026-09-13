<template>
  <div>
    <el-form
      :inline="true"
      style="display: flex; align-items: center; margin-bottom: 16px"
    >
      <el-form-item label="滚动像素" style="margin: 0 16px 0 0">
        <el-input v-model.number="scrollDelta" />
      </el-form-item>
      <el-form-item label="滚动行数" style="margin: 0">
        <el-input v-model.number="scrollRows" />
      </el-form-item>
    </el-form>
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <el-button @click="scrollByPixels">按像素滚动</el-button>
      <el-button @click="scrollByRows">按行滚动</el-button>
    </div>
    <div style="height: 400px">
      <el-auto-resizer>
        <template slot-scope="{ height, width }">
          <el-table-v2
            ref="tableRef"
            :columns="columns"
            :data="data"
            :width="width"
            :height="height"
            fixed
          />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>
<script>
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

export default {
  data() {
    const columns = generateColumns(10);
    const data = generateData(columns, 200);
    return {
      columns,
      data,
      scrollDelta: 200,
      scrollRows: 10
    };
  },
  methods: {
    scrollByPixels() {
      this.$refs.tableRef.scrollToTop(this.scrollDelta);
    },
    scrollByRows() {
      this.$refs.tableRef.scrollToRow(this.scrollRows);
    }
  }
};
</script>
