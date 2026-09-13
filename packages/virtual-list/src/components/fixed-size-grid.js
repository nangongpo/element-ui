import buildGrid from '../builders/build-grid';

const strategy = {
  name: 'ElFixedSizeGrid',
  initCache() { return {}; },
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.columnWidth !== 'number') throw new Error('[ElFixedSizeGrid] columnWidth must be a number');
    if (process.env.NODE_ENV !== 'production' && typeof vm.rowHeight !== 'number') throw new Error('[ElFixedSizeGrid] rowHeight must be a number');
  },
  getColumnOffset(vm, index) { return index * vm.columnWidth; },
  getRowOffset(vm, index) { return index * vm.rowHeight; },
  getColumnSize(vm) { return vm.columnWidth; },
  getRowSize(vm) { return vm.rowHeight; },
  getEstimatedTotalWidth(vm) { return vm.totalColumn * vm.columnWidth; },
  getEstimatedTotalHeight(vm) { return vm.totalRow * vm.rowHeight; },
  getColumnStartIndex(vm, offset) { return Math.max(0, Math.min(vm.totalColumn - 1, Math.floor(offset / vm.columnWidth))); },
  getRowStartIndex(vm, offset) { return Math.max(0, Math.min(vm.totalRow - 1, Math.floor(offset / vm.rowHeight))); },
  getColumnStopIndex(vm, start, offset) { return Math.max(0, Math.min(vm.totalColumn - 1, start + Math.ceil((vm.width + offset - start * vm.columnWidth) / vm.columnWidth) - 1)); },
  getRowStopIndex(vm, start, offset) { return Math.max(0, Math.min(vm.totalRow - 1, start + Math.ceil((vm.height + offset - start * vm.rowHeight) / vm.rowHeight) - 1)); },
  resetAfter() {}
};

export default buildGrid(strategy);
