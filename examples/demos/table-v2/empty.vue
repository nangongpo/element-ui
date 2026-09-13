<template>
  <el-table-v2
    :columns="columns"
    :data="[]"
    :row-height="40"
    :width="700"
    :height="400"
    :footer-height="50">
    <template slot="empty">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <el-empty />
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

export default {
  data() {
    return { columns: generateColumns(10) };
  }
};
</script>
