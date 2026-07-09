export default {
  methods: {
    applyDefaultSort() {
      if (!this.defaultSort || !this.defaultSort.prop) return;
      const column = this.tableColumns.filter(item => item.property === this.defaultSort.prop)[0];
      if (column) {
        this.sort(column.property, this.defaultSort.order || 'ascending');
      }
    },

    toggleSort(column) {
      const orders = Array.isArray(column.sortOrders) && column.sortOrders.length
        ? column.sortOrders
        : ['ascending', 'descending', null];
      const index = orders.indexOf(column.order);
      const nextOrder = orders[(index + 1) % orders.length];
      this.sort(column.property, nextOrder);
    },

    sort(prop, order) {
      const columns = this.tableColumns;
      const column = columns.filter(item => item.property === prop)[0];
      if (!column) return;
      columns.forEach(item => {
        if (item !== column) item.order = null;
      });
      column.order = order;
      this.sortingColumn = order ? column : null;
      this.sortProp = order ? prop : null;
      this.sortOrder = order || null;
      this.sortVersion++;
      this.refreshViewData();
      this.syncStoreStates();
      this.scrollTop = 0;
      if (this.$refs.body) this.$refs.body.scrollTop = 0;
      this.updateRange();
      this.$emit('sort-change', {
        column,
        prop,
        order
      });
    },

    clearSort() {
      if (!this.sortingColumn) return;
      const column = this.sortingColumn;
      column.order = null;
      this.sortingColumn = null;
      this.sortProp = null;
      this.sortOrder = null;
      this.sortVersion++;
      this.refreshViewData();
      this.syncStoreStates();
      this.updateRange();
      this.$emit('sort-change', {
        column,
        prop: null,
        order: null
      });
    }
  }
};
