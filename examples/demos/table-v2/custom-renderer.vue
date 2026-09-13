<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<style>
.table-v2-date-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>

<script lang="jsx">
import dayjs from 'dayjs';
import ElButton from 'element-ui/packages/button';
import ElTag from 'element-ui/packages/tag';
import ElTooltip from 'element-ui/packages/tooltip';

let id = 0;

const dataGenerator = () => ({
  id: 'random-id-' + (++id),
  name: 'Tom',
  date: '2020-10-1'
});

export default {
  data() {
    return {
      columns: [
        {
          key: 'date',
          title: 'Date',
          dataKey: 'date',
          width: 150,
          fixed: 'left',
          cellRenderer: ({ cellData }) => {
            const formattedDate = dayjs(cellData).format('YYYY/MM/DD');
            return (
              <ElTooltip content={formattedDate}>
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
          title: 'Name',
          dataKey: 'name',
          width: 150,
          align: 'center',
          cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>
        },
        {
          key: 'operations',
          title: 'Operations',
          cellRenderer: () => [
            <ElButton size="small">Edit</ElButton>,
            <ElButton size="small" type="danger">Delete</ElButton>
          ],
          width: 150,
          align: 'center'
        }
      ],
      data: Array.from({ length: 200 }).map(dataGenerator)
    };
  }
};
</script>
