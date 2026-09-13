<template
  ><el-table-v2
    :columns="columns"
    :data="data"
    expand-column-key="name"
    :default-expanded-row-keys="[1]"
    :width="700"
    :height="400"
    @row-expand="onExpand"
/></template>
<script>
export default {
  data() {
    return {
      columns: [
        { key: "name", dataKey: "name", title: "名称", width: 260 },
        { key: "value", dataKey: "value", title: "值", width: 200 }
      ],
      data: [
        {
          id: 1,
          name: "节点 1",
          value: "root",
          children: [{ id: 2, name: "节点 1-1", value: "child" }]
        },
        { id: 3, name: "节点 2", value: "lazy", hasChildren: true }
      ]
    };
  },
  methods: {
    onExpand({ expanded, rowData }) {
      if (expanded && rowData.hasChildren && !rowData.children)
        this.$set(rowData, "children", [
          { id: rowData.id + "-1", name: "异步子节点", value: "loaded" }
        ]);
    }
  }
};
</script>
