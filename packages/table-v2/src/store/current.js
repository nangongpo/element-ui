import { getRowIdentity } from 'element-ui/packages/table/src/util';

export default {
  methods: {
    setCurrentRow(row) {
      const oldCurrentRow = this.currentRow;
      if (row !== oldCurrentRow) {
        this.currentRow = row || null;
        this.$emit('current-change', this.currentRow, oldCurrentRow);
      }
    },

    syncCurrentRowByKey() {
      if (!this.rowKey || typeof this.currentRowKey === 'undefined') return;
      const data = this.getViewData();
      for (let i = 0; i < data.length; i++) {
        if (getRowIdentity(data[i], this.rowKey) === this.currentRowKey) {
          this.currentRow = data[i];
          return;
        }
      }
      this.currentRow = null;
    }
  }
};
