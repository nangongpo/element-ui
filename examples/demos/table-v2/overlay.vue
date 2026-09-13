<template
  ><el-table-v2 :columns="columns" :data="data" :width="700" :height="400"
    ><div slot="overlay" class="table-v2-overlay">加载中...</div></el-table-v2
  ></template
>
<script>
export default {
  data() {
    return {
      columns: [{ key: "name", dataKey: "name", title: "姓名", width: 220 }],
      data: [{ id: 1, name: "Tom" }]
    };
  }
};
</script>
