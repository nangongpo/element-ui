<template
  ><el-table-v2
    :columns="columns"
    :data="data"
    :estimated-row-height="80"
    :width="700"
    :height="400"
/></template>
<script>
export default {
  data() {
    return {
      columns: [
        { key: 'name', dataKey: 'name', title: '姓名', width: 180 },
        { key: 'detail', dataKey: 'detail', title: '详情', width: 480 }
      ],
      data: Array.from({ length: 20 }, (_, id) => ({
        id,
        name: 'Tom ' + id,
        detail: '这是第 ' + id + ' 行的详细内容，可以配合动态行高展示较长文本。'
      }))
    };
  }
};
</script>
