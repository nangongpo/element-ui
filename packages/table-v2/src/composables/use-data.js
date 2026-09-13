import { rowIdentity } from '../common';

export default {
  data() { return { tableExpandedKeys: this.defaultExpandedRowKeys.slice() }; },
  computed: {
    flatData() {
      const result = [];
      const visit = (rows, depth) => (rows || []).forEach(row => {
        const index = result.length;
        const key = rowIdentity(row, this.rowKey, index);
        result.push({ row, key, depth });
        if (row && Array.isArray(row.children) && this.tableExpandedKeys.indexOf(key) !== -1) visit(row.children, depth + 1);
      });
      visit(this.data, 0);
      return result;
    },
    resolvedExpandedKeys() { return this.expandedRowKeys === undefined ? this.tableExpandedKeys : this.expandedRowKeys; }
  },
  watch: {
    defaultExpandedRowKeys(value) { this.tableExpandedKeys = (value || []).slice(); },
    expandedRowKeys(value) { if (value !== undefined) this.tableExpandedKeys = value.slice(); }
  },
  methods: {
    rowKeyOf(row, index) { return rowIdentity(row, this.rowKey, index); },
    toggleRow(row, index, expanded) {
      const key = this.rowKeyOf(row, index);
      const keys = this.tableExpandedKeys.slice();
      const position = keys.indexOf(key);
      if (expanded && position === -1) keys.push(key);
      if (!expanded && position !== -1) keys.splice(position, 1);
      this.tableExpandedKeys = keys;
      this.$emit('update:expandedRowKeys', keys);
      this.$emit('expanded-rows-change', keys);
      this.$emit('row-expand', { expanded, rowData: row, rowIndex: index, rowKey: key });
    }
  }
};
