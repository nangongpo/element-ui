<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script lang="jsx">
import ElCheckbox from 'element-ui/packages/checkbox';

const SelectionCell = {
  functional: true,
  components: {
    ElCheckbox
  },
  props: {
    value: Boolean,
    indeterminate: Boolean,
    ariaLabel: String
  },
  render(h, context) {
    const { value, indeterminate, ariaLabel } = context.props;
    const onChange = context.listeners && context.listeners.change;

    return (
      <ElCheckbox
        value={value}
        indeterminate={indeterminate}
        aria-label={ariaLabel}
        onChange={onChange}
      />
    );
  }
};

const generateColumns = (length = 10) =>
  Array.from({ length }).map((_, columnIndex) => ({
    key: 'column-' + columnIndex,
    dataKey: 'column-' + columnIndex,
    title: 'Column ' + columnIndex,
    width: 150
  }));

const generateData = (columns, length = 200) =>
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] =
          'Row ' + rowIndex + ' - Col ' + columnIndex;
        return rowData;
      },
      {
        id: 'row-' + rowIndex,
        checked: false,
        parentId: null
      }
    )
  );

export default {
  components: {
    SelectionCell
  },
  data() {
    const columns = generateColumns();

    columns.unshift({
      key: 'selection',
      width: 50,
      fixed: 'left',
      cellRenderer: ({ rowData }) => (
        <SelectionCell
          value={rowData.checked}
          ariaLabel="Select row"
          onChange={value => {
            rowData.checked = value;
          }}
        />
      ),
      headerCellRenderer: () => {
        const allSelected =
          this.data.length > 0 && this.data.every(row => row.checked);
        const containsChecked = this.data.some(row => row.checked);

        return (
          <SelectionCell
            value={allSelected}
            indeterminate={containsChecked && !allSelected}
            ariaLabel="Select all rows"
            onChange={value => {
              this.data = this.data.map(row =>
                Object.assign({}, row, { checked: value })
              );
            }}
          />
        );
      }
    });

    return {
      columns,
      data: generateData(columns)
    };
  }
};
</script>
