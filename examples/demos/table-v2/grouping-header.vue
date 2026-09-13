<template>
  <el-table-v2
    fixed
    :columns="fixedColumns"
    :data="data"
    :header-height="[50, 40, 50]"
    :header-class="headerClass"
    :width="700"
    :height="400">
    <template slot="header" slot-scope="props">
      <customized-header v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="jsx">
import {
  FixedDir as TableV2FixedDir,
  TableV2Placeholder
} from 'element-ui/packages/table-v2';

const generateColumns = (length = 10, prefix = 'column-', props) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...(props || {}),
    key: prefix + columnIndex,
    dataKey: prefix + columnIndex,
    title: 'Column ' + columnIndex,
    width: 150
  }));

const generateData = (columns, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex;
        return rowData;
      },
      {
        id: prefix + rowIndex,
        parentId: null
      }
    )
  );

const CustomizedHeader = {
  name: 'TableV2CustomizedHeader',
  functional: true,
  props: {
    cells: Array,
    columns: Array,
    headerIndex: Number
  },
  render(h, context) {
    const { cells, columns, headerIndex } = context.props;

    if (headerIndex === 2) {
      return cells;
    }

    const groupCells = [];
    let width = 0;
    let index = 0;

    columns.forEach((column, columnIndex) => {
      if (column.placeholderSign === TableV2Placeholder) {
        groupCells.push(cells[columnIndex]);
      } else {
        const cell = cells[columnIndex];
        const cellColumn = cell && cell.componentOptions && cell.componentOptions.propsData
          ? cell.componentOptions.propsData.column
          : column;
        const cellStyle = cell && cell.data && cell.data.style ? cell.data.style : {};
        width += Number(cellColumn && cellColumn.width) || 0;
        index += 1;

        const nextColumn = columns[columnIndex + 1];
        if (
          columnIndex === columns.length - 1 ||
          (nextColumn && nextColumn.placeholderSign === TableV2Placeholder) ||
          index === (headerIndex === 0 ? 4 : 2)
        ) {
          groupCells.push(
            <div
              class="custom-header-cell"
              role="columnheader"
              style={{ ...cellStyle, width: width + 'px' }}
            >
              Group width {width}
            </div>
          );
          width = 0;
          index = 0;
        }
      }
    });

    return groupCells;
  }
};

export default {
  components: {
    CustomizedHeader
  },
  data() {
    const columns = generateColumns(15);
    const data = generateData(columns, 200);
    const fixedColumns = columns.map((column, columnIndex) => {
      let fixed;
      if (columnIndex < 3) fixed = TableV2FixedDir.LEFT;
      if (columnIndex > 12) fixed = TableV2FixedDir.RIGHT;
      return { ...column, fixed, width: 100 };
    });

    return { columns, data, fixedColumns };
  },
  methods: {
    headerClass({ headerIndex }) {
      if (headerIndex === 1) return 'el-primary-color';
      return '';
    }
  }
};
</script>

<style>
.el-table-v2__header-row .custom-header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ebeef5;
}

.el-table-v2__header-row .custom-header-cell:last-child {
  border-right: none;
}

.el-primary-color {
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.el-primary-color .custom-header-cell {
  padding: 0 4px;
}
</style>
