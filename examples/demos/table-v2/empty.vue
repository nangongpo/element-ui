<template
  ><el-table-v2 :columns="columns" :data="[]" :width="700" :height="400"
    ><el-empty slot="empty" description="暂无数据"/></el-table-v2
></template>
<script>
export default {
  data() {
    return {
      columns: [{ key: 'name', dataKey: 'name', title: '姓名', width: 220 }]
    };
  }
};
</script>
