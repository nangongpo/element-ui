export default function createStore(table) {
  return {
    commit: (name, column, index, parent) => {
      if (name === 'insertColumn') {
        table.insertColumn(column, index, parent);
      } else if (name === 'removeColumn') {
        table.removeColumn(column, parent);
      } else if (name === 'rowSelectedChanged') {
        table.toggleRowSelection(column);
      } else if (name === 'toggleAllSelection') {
        table.toggleAllSelection();
      } else if (name === 'filterChange') {
        table.filterChange(column);
      }
    },
    scheduleLayout: () => {
      table.updateColumns();
      table.$nextTick(table.doLayout);
    },
    updateAllSelected: () => {
      table.updateAllSelected();
    },
    states: {
      data: table.sortedData,
      selection: table.tableSelection
    }
  };
}
