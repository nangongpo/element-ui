<template
  ><div>
    <el-button @click="scroll">滚动到第 100 行</el-button
    ><el-table-v2
      ref="table"
      :columns="columns"
      :data="data"
      :width="700"
      :height="400"
    /></div
></template>
<script>
export default {
  data() {
    return {
      columns: [
        { key: "id", dataKey: "id", title: "编号", width: 150 },
        { key: "name", dataKey: "name", title: "姓名", width: 300 }
      ],
      data: Array.from({ length: 1000 }, (_, id) => ({ id, name: "Tom " + id }))
    };
  },
  methods: {
    scroll() {
      this.$refs.table.scrollToRow(100, "center");
    }
  }
};
</script>
