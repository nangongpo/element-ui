<template
  ><el-table-v2
    :columns="columns"
    :data="data"
    :estimated-row-height="50"
    :width="700"
    :height="400"
    fixed
/></template>
<script>
export default {
  data() {
    return {
      columns: [
        { key: 'name', dataKey: 'name', title: '姓名', width: 150 },
        {
          key: 'description',
          dataKey: 'description',
          title: '描述',
          width: 500
        }
      ],
      data: Array.from({ length: 200 }, (_, id) => ({
        id,
        name: 'Tom',
        description:
          id % 3 === 0
            ? '这是一段较长的文本，用于展示动态行高。'.repeat(3)
            : '短文本。'
      }))
    };
  }
};
</script>
