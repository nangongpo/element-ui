import { getRowIdentity } from 'element-ui/packages/table/src/util';
import { assertArray } from '../util';

export default {
  methods: {
    getLargeSelectionLimit() {
      return 50000;
    },

    getSelection() {
      return assertArray(this.selection, 'selection');
    },

    getSelectionCount() {
      if (this.allSelectionMode) return this.selectionCount || 0;
      return this.getSelection().length;
    },

    getSelectionForEvent() {
      if (!this.allSelectionMode) return this.getSelection().slice();
      const selection = [];
      selection.length = this.selectionCount || 0;
      return selection;
    },

    rebuildSelectionMap(selection) {
      const map = {};
      if (this.rowKey) {
        for (let i = 0; i < selection.length; i++) {
          map[getRowIdentity(selection[i], this.rowKey)] = selection[i];
        }
      }
      this.selectionMapCache = map;
    },

    setSelection(selection) {
      const nextSelection = assertArray(selection, 'selection');
      this.allSelectionMode = false;
      this.excludedSelectionMap = {};
      this.selectionCount = nextSelection.length;
      this.selection = nextSelection;
      this.rebuildSelectionMap(nextSelection);
    },

    isSelectable(row, index) {
      const selectionColumn = this.getSelectionColumn();
      if (!selectionColumn || typeof selectionColumn.selectable !== 'function') return true;
      return selectionColumn.selectable.call(null, row, index);
    },

    isSelected(row) {
      if (this.allSelectionMode) {
        if (!this.rowKey) return false;
        return !this.excludedSelectionMap[getRowIdentity(row, this.rowKey)];
      }
      if (this.rowKey) {
        return !!this.selectionMapCache[getRowIdentity(row, this.rowKey)];
      }
      return this.getSelection().indexOf(row) > -1;
    },

    getSelectionColumn() {
      return this.tableColumns.filter(column => column.type === 'selection')[0];
    },

    syncSelection() {
      if (this.allSelectionMode) {
        this.selectionCount = Math.max(0, this.viewLength - Object.keys(this.excludedSelectionMap || {}).length);
        this.isAllSelected = this.viewLength > 0 && this.selectionCount === this.viewLength;
        this.syncStoreStates();
        return;
      }
      const selectionColumn = this.getSelectionColumn();
      const reserveSelection = selectionColumn && selectionColumn.reserveSelection && this.rowKey;
      const selection = this.getSelection();
      if (!reserveSelection && !selection.length) {
        this.setSelection([]);
        this.syncStoreStates();
        return;
      }
      if (reserveSelection) {
        const oldSelectionMap = this.selectionMapCache;
        const nextSelection = [];
        const data = this.tableData;
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const rowId = getRowIdentity(row, this.rowKey);
          if (oldSelectionMap[rowId]) {
            nextSelection.push(row);
          }
        }
        this.setSelection(nextSelection);
      } else {
        const data = this.getViewData();
        let nextSelection;
        if (this.rowKey) {
          const dataMap = {};
          for (let i = 0; i < data.length; i++) {
            dataMap[getRowIdentity(data[i], this.rowKey)] = true;
          }
          nextSelection = selection.filter(row => dataMap[getRowIdentity(row, this.rowKey)]);
        } else {
          nextSelection = selection.filter(row => data.indexOf(row) > -1);
        }
        this.setSelection(nextSelection);
      }
      this.syncStoreStates();
    },

    updateAllSelected() {
      const data = this.getViewData();
      const selectionColumn = this.getSelectionColumn();
      const hasSelectable = selectionColumn && typeof selectionColumn.selectable === 'function';
      if (!hasSelectable) {
        this.isAllSelected = data.length > 0 && this.getSelectionCount() === data.length;
        return;
      }
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

    emitSelectionChange(updateAllSelected = true) {
      this.syncStoreStates();
      if (updateAllSelected) {
        this.updateAllSelected();
      }
      this.$forceUpdate();
      this.$emit('selection-change', this.getSelectionForEvent());
    },

    clearSelection() {
      const selection = this.getSelection();
      if (!selection.length && !this.allSelectionMode) return;
      this.setSelection([]);
      this.emitSelectionChange();
    },

    toggleRowSelection(row, selected, emitChange = true) {
      const selectionColumn = this.getSelectionColumn();
      const hasSelectable = selectionColumn && typeof selectionColumn.selectable === 'function';
      let index = -1;
      if (hasSelectable) {
        const data = this.getViewData();
        index = data.indexOf(row);
        if (index > -1 && !this.isSelectable(row, index)) return;
      }
      if (this.allSelectionMode && this.rowKey) {
        const rowId = getRowIdentity(row, this.rowKey);
        const included = !this.excludedSelectionMap[rowId];
        const shouldSelect = typeof selected === 'boolean' ? selected : !included;
        if (shouldSelect && !included) {
          delete this.excludedSelectionMap[rowId];
          this.selectionCount++;
        } else if (!shouldSelect && included) {
          this.excludedSelectionMap[rowId] = true;
          this.selectionCount--;
        } else {
          return;
        }
        if (emitChange) {
          this.$emit('select', this.getSelectionForEvent(), row);
        }
        this.emitSelectionChange();
        return;
      }
      const selection = this.getSelection().slice();
      const rowId = this.rowKey ? getRowIdentity(row, this.rowKey) : null;
      let oldIndex = -1;
      if (this.rowKey) {
        if (this.selectionMapCache[rowId]) {
          for (let i = 0; i < selection.length; i++) {
            if (getRowIdentity(selection[i], this.rowKey) === rowId) {
              oldIndex = i;
              break;
            }
          }
        }
      } else {
        oldIndex = selection.indexOf(row);
      }
      const included = oldIndex > -1;
      const shouldSelect = typeof selected === 'boolean' ? selected : !included;

      if (shouldSelect && !included) {
        selection.push(row);
      } else if (!shouldSelect && included) {
        selection.splice(oldIndex, 1);
      } else {
        return;
      }

      this.setSelection(selection);
      if (emitChange) {
        this.$emit('select', this.getSelectionForEvent(), row);
      }
      this.emitSelectionChange();
    },

    toggleAllSelection() {
      const data = this.getViewData();
      const selectionColumn = this.getSelectionColumn();
      const hasSelectable = selectionColumn && typeof selectionColumn.selectable === 'function';
      const nextSelected = !this.isAllSelected;
      if (nextSelected && !hasSelectable && this.rowKey && data.length > this.getLargeSelectionLimit()) {
        this.allSelectionMode = true;
        this.excludedSelectionMap = {};
        this.selection = [];
        this.selectionMapCache = {};
        this.selectionCount = data.length;
        this.isAllSelected = data.length > 0;
        this.emitSelectionChange(false);
        this.$emit('select-all', this.getSelectionForEvent());
        return;
      }
      if (!nextSelected && this.allSelectionMode) {
        this.setSelection([]);
        this.isAllSelected = false;
        this.emitSelectionChange(false);
        this.$emit('select-all', this.getSelectionForEvent());
        return;
      }
      let selection = this.getSelection().slice();
      const selectedMap = {};
      if (this.rowKey) {
        for (let i = 0; i < selection.length; i++) {
          selectedMap[getRowIdentity(selection[i], this.rowKey)] = true;
        }
      }
      let changed = false;

      for (let index = 0; index < data.length; index++) {
        const row = data[index];
        if (hasSelectable && !this.isSelectable(row, index)) continue;
        const selected = this.rowKey ? selectedMap[getRowIdentity(row, this.rowKey)] : selection.indexOf(row) > -1;
        if (nextSelected && !selected) {
          selection.push(row);
          if (this.rowKey) {
            selectedMap[getRowIdentity(row, this.rowKey)] = true;
          }
          changed = true;
        }
      }

      if (!nextSelected) {
        if (this.rowKey) {
          const removeMap = {};
          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (hasSelectable && !this.isSelectable(row, i)) continue;
            removeMap[getRowIdentity(row, this.rowKey)] = true;
          }
          const nextSelection = selection.filter(row => !removeMap[getRowIdentity(row, this.rowKey)]);
          changed = nextSelection.length !== selection.length;
          selection = nextSelection;
        } else {
          const nextSelection = selection.filter(row => data.indexOf(row) === -1);
          changed = nextSelection.length !== selection.length;
          selection = nextSelection;
        }
      }

      this.setSelection(selection);
      if (changed) {
        this.isAllSelected = nextSelected && data.length > 0;
        this.emitSelectionChange(false);
      } else {
        this.updateAllSelected();
      }
      this.$emit('select-all', this.getSelectionForEvent());
    }
  }
};
