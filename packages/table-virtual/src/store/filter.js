import FilterPanel from 'element-ui/packages/table/src/filter-panel.vue';
import Vue from 'vue';
import { assertArray, toValueArray } from '../util';

export default {
  methods: {
    getColumnFilterKey(column) {
      return column.columnKey || column.id || column.property;
    },

    getFilterValues(column) {
      const key = this.getColumnFilterKey(column);
      const values = this.activeFilters[key];
      return typeof values === 'undefined' ? [] : assertArray(values, 'activeFilters.' + key);
    },

    syncColumnFilter(column) {
      if (!column || !column.filterable || !column.filteredValue) return;
      const filteredValue = assertArray(column.filteredValue, 'column.filteredValue');
      if (!filteredValue.length) return;
      this.$set(this.activeFilters, this.getColumnFilterKey(column), filteredValue.slice());
    },

    handleFilterClick(event, column) {
      event.stopPropagation();
      const target = event.currentTarget;
      let filterPanel = this.filterPanels[column.id];

      if (filterPanel && column.filterOpened) {
        filterPanel.showPopper = false;
        return;
      }

      if (!filterPanel) {
        filterPanel = new Vue(FilterPanel);
        this.filterPanels[column.id] = filterPanel;
        if (column.filterPlacement) {
          filterPanel.placement = column.filterPlacement;
        }
        filterPanel.table = this;
        filterPanel.cell = target;
        filterPanel.column = column;
        !this.$isServer && filterPanel.$mount(document.createElement('div'));
      }

      setTimeout(() => {
        filterPanel.showPopper = true;
      }, 16);
    },

    destroyFilterPanels() {
      const panels = this.filterPanels || {};
      Object.keys(panels).forEach(key => {
        if (panels[key]) {
          panels[key].$destroy(true);
          panels[key] = null;
        }
      });
      this.filterPanels = {};
    },

    getFilterChangePayload() {
      const filters = {};
      this.tableColumns.forEach(column => {
        if (column.filterable) {
          filters[this.getColumnFilterKey(column)] = this.getFilterValues(column);
        }
      });
      return filters;
    },

    filterChange(options = {}) {
      const column = options.column;
      if (!column) return;
      const values = typeof options.values === 'undefined' ? [] : assertArray(options.values, 'filterChange.values');
      column.filteredValue = values;
      this.$set(this.activeFilters, this.getColumnFilterKey(column), values.slice());
      this.scrollTop = 0;
      if (this.$refs.body) this.$refs.body.scrollTop = 0;
      this.updateRange();
      this.updateAllSelected();
      if (!options.silent) {
        this.$emit('filter-change', this.getFilterChangePayload());
      }
    },

    clearFilter(columnKeys) {
      const keys = typeof columnKeys === 'undefined'
        ? null
        : (Array.isArray(columnKeys) ? columnKeys : [columnKeys]);
      this.tableColumns.forEach(column => {
        const key = this.getColumnFilterKey(column);
        if (!column.filterable || (keys && keys.indexOf(key) === -1)) return;
        column.filteredValue = [];
        this.$set(this.activeFilters, key, []);
      });
      this.scrollTop = 0;
      if (this.$refs.body) this.$refs.body.scrollTop = 0;
      this.updateRange();
      this.updateAllSelected();
      this.$emit('filter-change', this.getFilterChangePayload());
    },

    filter(columnKey, values) {
      const column = this.tableColumns.filter(item => this.getColumnFilterKey(item) === columnKey)[0];
      if (!column || !column.filterable) return;
      this.filterChange({
        column,
        values: toValueArray(values)
      });
    }
  }
};
