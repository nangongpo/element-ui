<template>
  <el-table-v2
    fixed
    :columns="fixedColumns"
    :data="data"
    :width="700"
    :height="400"
  />
</template>

<script lang="jsx">
// JSX component references are resolved by the Vue JSX transform.
import ElButton from 'element-ui/packages/button';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElPopover from 'element-ui/packages/popover';
import { FixedDir as TableV2FixedDir } from 'element-ui/packages/table-v2';

const generateColumns = (length = 10, prefix = 'column-', props) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...(props || {}),
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }));

const generateData = (
  columns,
  length = 200,
  prefix = 'row-',
  valuePrefix = 'Row'
) =>
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `${valuePrefix} ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    )
  );

const FilterHeader = {
  functional: true,
  components: {
    ElButton,
    ElCheckbox,
    ElPopover
  },
  props: {
    title: String,
    checked: Boolean,
    onInput: Function,
    onFilter: Function,
    onReset: Function
  },
  render(h, context) {
    const { checked, title } = context.props;
    const listeners = context.listeners || {};
    const onInput = listeners.input;
    const onFilter = listeners.filter;
    const onReset = listeners.reset;
    const hidePopover = () => {
      const popover = context.parent.$refs.filterPopover;
      if (popover && popover.doClose) popover.doClose();
    };

    return (
      <div class="table-v2-filter-header">
        <span class="table-v2-filter-title">{title}</span>
        <ElPopover
          ref="filterPopover"
          trigger="click"
          width={200}
          onAfterEnter={() => {
            const button = document.querySelector(
              '.el-table-v2__demo-filter-btn'
            );
            if (button && button.focus) button.focus();
          }}
        >
          <div slot="reference" class="el-table-v2__demo-filter-btn">
            <i class="el-icon-arrow-down" />
          </div>
          <div class="filter-wrapper">
            <div class="filter-group">
              <ElCheckbox
                ref="filterCheckbox"
                checked={checked}
                onChange={onInput}
              >
                Filter Text
              </ElCheckbox>
            </div>
            <div class="el-table-v2__demo-filter">
              <ElButton
                type="text"
                onClick={() => {
                  hidePopover();
                  onFilter();
                }}
              >
                Confirm
              </ElButton>
              <ElButton
                type="text"
                onClick={() => {
                  const checkbox = context.parent.$refs.filterCheckbox;
                  if (checkbox) checkbox.selfModel = false;
                  hidePopover();
                  onReset();
                }}
              >
                Reset
              </ElButton>
            </div>
          </div>
        </ElPopover>
      </div>
    );
  }
};

export default {
  components: {
    FilterHeader
  },
  data() {
    const columns = generateColumns(10);

    columns[0].headerCellRenderer = props => (
      <FilterHeader
        title={props.column.title}
        checked={this.filterValue}
        onInput={this.onFilterInput}
        onFilter={this.onFilter}
        onReset={this.onReset}
      />
    );

    const fixedColumns = columns.map((column, columnIndex) => {
      let fixed;
      if (columnIndex < 2) fixed = TableV2FixedDir.LEFT;
      if (columnIndex > 9) fixed = TableV2FixedDir.RIGHT;
      return { ...column, fixed, width: 100 };
    });

    return {
      columns,
      fixedColumns,
      data: generateData(columns),
      shouldFilter: false,
      filterValue: false
    };
  },
  methods: {
    onFilter(shouldFilter = this.filterValue) {
      this.shouldFilter = shouldFilter;
      this.data = this.shouldFilter
        ? generateData(this.columns, 100, 'filtered-', 'Filtered Row')
        : generateData(this.columns, 200);
    },
    onReset() {
      this.shouldFilter = false;
      this.filterValue = false;
      this.onFilter();
    },
    onFilterInput(value) {
      this.filterValue = value;
    }
  }
};
</script>

<style>
.table-v2-filter-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-v2-filter-title {
  margin-right: 8px;
  font-size: 12px;
}

.filter-wrapper {
  padding: 0;
}

.el-table-v2__demo-filter {
  border-top: 1px solid #ebeef5;
  margin: 12px -12px -12px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
}

.el-table-v2__demo-filter-btn {
  display: flex;
  cursor: pointer;
  padding: 0;
  margin: 0;
  background-color: transparent;
  appearance: none;
  border: none;
}
</style>
