import { getRowIdentity } from 'element-ui/packages/table/src/util';

export default {
  computed: {
    selectionMap() {
      const map = {};
      if (!this.rowKey) return map;
      this.tableSelection.forEach(row => {
        map[getRowIdentity(row, this.rowKey)] = row;
      });
      return map;
    }
  },

  methods: {
    isSelectable(row, index) {
      const selectionColumn = this.getSelectionColumn();
      if (!selectionColumn || typeof selectionColumn.selectable !== 'function') return true;
      return selectionColumn.selectable.call(null, row, index);
    },

    isSelected(row) {
      if (this.rowKey) {
        return !!this.selectionMap[getRowIdentity(row, this.rowKey)];
      }
      return this.tableSelection.indexOf(row) > -1;
    },

    getSelectionColumn() {
      return this.tableColumns.filter(column => column.type === 'selection')[0];
    },

    syncSelection() {
      const selectionColumn = this.getSelectionColumn();
      const reserveSelection = selectionColumn && selectionColumn.reserveSelection && this.rowKey;
      if (reserveSelection) {
        const oldSelectionMap = {};
        this.tableSelection.forEach(row => {
          oldSelectionMap[getRowIdentity(row, this.rowKey)] = row;
        });
        const nextSelection = [];
        this.tableData.forEach(row => {
          const rowId = getRowIdentity(row, this.rowKey);
          if (oldSelectionMap[rowId]) {
            nextSelection.push(row);
          }
        });
        this.selection = nextSelection;
      } else {
        const data = this.sortedData;
        this.selection = this.tableSelection.filter(row => data.indexOf(row) > -1);
      }
      this.syncStoreStates();
    },

    updateAllSelected() {
      const data = this.sortedData;
      let selectedCount = 0;
      let selectableCount = 0;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (this.isSelectable(row, i)) {
          selectableCount++;
          if (this.isSelected(row)) selectedCount++;
        }
      }

      this.isAllSelected = selectableCount > 0 && selectedCount === selectableCount;
    },

    emitSelectionChange() {
      this.syncStoreStates();
      this.updateAllSelected();
      this.$emit('selection-change', this.tableSelection.slice());
    },

    clearSelection() {
      if (!this.tableSelection.length) return;
      this.selection = [];
      this.emitSelectionChange();
    },

    toggleRowSelection(row, selected, emitChange = true) {
      const index = this.sortedData.indexOf(row);
      if (index > -1 && !this.isSelectable(row, index)) return;
      const selection = this.tableSelection.slice();
      const oldIndex = this.rowKey
        ? selection.map(item => getRowIdentity(item, this.rowKey)).indexOf(getRowIdentity(row, this.rowKey))
        : selection.indexOf(row);
      const included = oldIndex > -1;
      const shouldSelect = typeof selected === 'boolean' ? selected : !included;

      if (shouldSelect && !included) {
        selection.push(row);
      } else if (!shouldSelect && included) {
        selection.splice(oldIndex, 1);
      } else {
        return;
      }

      this.selection = selection;
      if (emitChange) {
        this.$emit('select', this.tableSelection.slice(), row);
      }
      this.emitSelectionChange();
    },

    toggleAllSelection() {
      const data = this.sortedData;
      const selectableRows = data.filter((row, index) => this.isSelectable(row, index));
      const nextSelected = !this.isAllSelected;
      let selection = this.tableSelection.slice();
      let changed = false;

      selectableRows.forEach(row => {
        const selected = this.isSelected(row);
        if (nextSelected && !selected) {
          selection.push(row);
          changed = true;
        } else if (!nextSelected && selected) {
          selection = this.rowKey
            ? selection.filter(item => getRowIdentity(item, this.rowKey) !== getRowIdentity(row, this.rowKey))
            : selection.filter(item => item !== row);
          changed = true;
        }
      });

      this.selection = selection;
      if (changed) {
        this.emitSelectionChange();
      } else {
        this.updateAllSelected();
      }
      this.$emit('select-all', this.tableSelection.slice());
    }
  }
};
