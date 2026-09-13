<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template slot-scope="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script>
export default {
  data() {
    const columns = Array.from({ length: 10 }, (_, index) => ({
      key: 'column-' + index,
      dataKey: 'column-' + index,
      title: 'Column ' + index,
      width: 150
    }));
    const data = Array.from({ length: 200 }, (_, rowIndex) => {
      const row = { id: 'row-' + rowIndex, parentId: null };
      columns.forEach((column, columnIndex) => {
        row[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex;
      });
      return row;
    });
    return { columns, data };
  }
};
</script>
