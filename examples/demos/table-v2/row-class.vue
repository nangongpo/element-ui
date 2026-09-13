<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    :row-class="rowClass"
  />
</template>

<script lang="jsx">
import ElButton from 'element-ui/packages/button';
import ElTag from 'element-ui/packages/tag';
import ElTooltip from 'element-ui/packages/tooltip';

export default {
  components: {
    ElButton,
    ElTag,
    ElTooltip
  },
  data() {
    return {
      columns: [
        {
          key: 'date',
          dataKey: 'date',
          title: '日期',
          width: 150,
          fixed: 'left',
          cellRenderer: ({ cellData }) => {
            const formattedDate = this.formatDate(cellData);
            return (
              <ElTooltip content={formattedDate} placement="top">
                <span class="table-v2-date-cell">
                  <i class="el-icon-time" />
                  {formattedDate}
                </span>
              </ElTooltip>
            );
          }
        },
        {
          key: 'name',
          dataKey: 'name',
          title: '姓名',
          width: 150,
          align: 'center',
          cellRenderer: ({ cellData }) => <ElTag>{cellData}</ElTag>
        },
        {
          key: 'operations',
          title: '操作',
          width: 150,
          flexGrow: 1,
          align: 'center',
          cellRenderer: () => [
            <ElButton size="small">编辑</ElButton>,
            <ElButton size="small" type="danger">删除</ElButton>
          ]
        }
      ],
      data: Array.from({ length: 200 }, (_, id) => ({
        id: 'random-id-' + (id + 1),
        name: 'Tom',
        date: '2020-10-1'
      }))
    };
  },
  methods: {
    formatDate(value) {
      return String(value).replace(/-/g, '/');
    },
    rowClass({ rowIndex }) {
      if (rowIndex % 10 === 5) return 'bg-red-100';
      if (rowIndex % 10 === 0) return 'bg-blue-200';
      return '';
    }
  }
};
</script>

<style>
.bg-blue-200 {
  background-color: #bfdbfe;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.table-v2-date-cell {
  display: flex;
  align-items: center;
}
</style>
