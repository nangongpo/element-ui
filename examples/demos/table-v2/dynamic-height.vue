<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :sort-by="sort"
    :estimated-row-height="40"
    :width="700"
    :height="400"
    fixed
    @column-sort="onColumnSort"
  />
</template>

<script lang="jsx">
import { SortOrder as TableV2SortOrder } from 'element-ui/packages/table-v2';
import ElButton from 'element-ui/packages/button';
import ElTag from 'element-ui/packages/tag';

const longText = '这是一段较长的文本，用于展示动态高度行的效果。';
const midText = '这是一段中等长度的文本。';
const shortText = '短文本。';
const textList = [shortText, midText, longText];

let id = 0;
const dataGenerator = () => ({
  id: 'random-' + (++id),
  name: 'Tom',
  date: '2016-05-03',
  description: textList[Math.floor(Math.random() * 3)]
});

export default {
  components: { ElButton, ElTag },
  data() {
    const columns = [
      { key: 'id', title: 'Id', dataKey: 'id', width: 150, sortable: true },
      {
        key: 'name', title: 'Name', dataKey: 'name', width: 150, align: 'center',
        cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>
      },
      {
        key: 'description', title: 'Description', dataKey: 'description', width: 150,
        cellRenderer: ({ cellData: description }) => (
          <div style={{ padding: '10px 0' }}>
            {description}
          </div>
        )
      },
      {
        key: 'operations',
        title: 'Operations',
        width: 150,
        align: 'center',
        cellRenderer: () => [
          <ElButton size="small">Edit</ElButton>,
          <ElButton size="small" type="danger">Delete</ElButton>
        ]
      }
    ];
    const data = Array.from({ length: 200 }).map(dataGenerator)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
    const sort = { key: 'name', order: TableV2SortOrder.ASC };
    return { columns, data, sort };
  },
  methods: {
    onColumnSort(sortBy) {
      const order = sortBy.order === 'asc' ? 1 : -1;
      this.data = this.data.slice().sort((a, b) => (a[sortBy.key] > b[sortBy.key] ? order : -order));
      this.sort = sortBy;
    }
  }
};
</script>
