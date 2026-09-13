<template
  ><el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    :footer-height="50"
    ><div slot="footer" class="table-v2-footer">
      共 {{ data.length }} 条数据
    </div>
    <el-empty slot="empty" description="暂无数据" />
    <div slot="overlay" class="table-v2-overlay">加载中...</div></el-table-v2
  ></template
>
<script>
export default {
  data() {
    return {
      columns: [{ key: 'id', dataKey: 'id', title: '编号', width: 180 }],
      data: []
    };
  }
};
</script>
