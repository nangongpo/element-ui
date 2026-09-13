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
import ElInput from 'element-ui/packages/input';

const InputCell = {
  name: 'TableV2InputCell',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.focus();
  },
  methods: {
    focus() {
      if (this.$refs.input && this.$refs.input.focus) {
        this.$refs.input.focus();
      }
    },
    handleKeydown(event) {
      if (event.key === 'Enter') {
        this.$emit('keydown-enter', event);
      }
    }
  },
  render() {
    return (
      <ElInput
        ref="input"
        value={this.value}
        size="mini"
        onInput={value => this.$emit('input', value)}
        onBlur={event => this.$emit('blur', event)}
        nativeOnKeydown={this.handleKeydown}
      />
    );
  }
};

export default {
  components: {
    InputCell
  },
  data() {
    const columns = Array.from({ length: 10 }, (_, i) => ({
      key: 'column-' + i,
      dataKey: 'column-' + i,
      title: 'Column ' + i,
      width: 150
    }));
    columns[0] = {
      ...columns[0],
      title: 'Editable Column',
      cellRenderer: ({ rowData, column }) => {
        const value = rowData[column.dataKey];

        if (rowData.editing) {
          return (
            <InputCell
              value={value}
              onInput={nextValue =>
                this.updateCell(rowData, column.dataKey, nextValue)
              }
              onBlur={() => this.exitEdit(rowData)}
              onKeydownEnter={() => this.exitEdit(rowData)}
            />
          );
        }

        return (
          <div
            class="table-v2-inline-editing-trigger"
            onClick={() => this.enterEdit(rowData)}
          >
            {value}
          </div>
        );
      }
    };
    const data = Array.from({ length: 200 }, (_, rowIndex) => {
      const row = { id: 'row-' + rowIndex, parentId: null, editing: false };
      columns.forEach((column, columnIndex) => {
        row[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex;
      });
      return row;
    });
    return { columns, data };
  },
  methods: {
    enterEdit(row) {
      this.$set(row, 'editing', true);
    },
    updateCell(row, key, value) {
      this.$set(row, key, value);
    },
    exitEdit(row) {
      this.$set(row, 'editing', false);
    }
  }
};
</script>
<style>
.table-v2-inline-editing-trigger {
  border: 1px transparent dotted;
  padding: 4px;
}
.table-v2-inline-editing-trigger:hover {
  border-color: #409eff;
}
</style>
