<template
  ><el-table-v2
    :columns="columns"
    :data="data"
    :cell-props="cellProps"
    :width="700"
    :height="400"
/></template>
<script>
export default {
  data() {
    return {
      columns: [
        { key: "a", dataKey: "a", title: "A", width: 200 },
        { key: "b", dataKey: "b", title: "B", width: 200 },
        { key: "c", dataKey: "c", title: "C", width: 200 }
      ],
      data: Array.from({ length: 20 }, (_, id) => ({
        id,
        a: "A-" + id,
        b: "B-" + id,
        c: "C-" + id
      }))
    };
  },
  methods: {
    cellProps({ rowIndex, columnIndex }) {
      return rowIndex === 0 && columnIndex === 0
        ? { span: { rowSpan: 2 } }
        : {};
    }
  }
};
</script>
