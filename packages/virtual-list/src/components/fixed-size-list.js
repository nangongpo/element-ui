import buildList from '../builders/build-list';

const strategy = {
  name: 'ElFixedSizeList',
  initCache() { return {}; },
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.itemSize !== 'number') throw new Error('[ElFixedSizeList] itemSize must be a number');
  },
  getItemOffset(vm, index) { return index * vm.itemSize; },
  getItemSize(vm) { return vm.itemSize; },
  getEstimatedTotalSize(vm) { return vm.total * vm.itemSize; },
  getStartIndexForOffset(vm, offset) { return Math.max(0, Math.min(vm.total - 1, Math.floor(offset / vm.itemSize))); },
  getStopIndexForStartIndex(vm, start, offset) { return Math.max(0, Math.min(vm.total - 1, start + Math.ceil((vm.clientSize + offset - start * vm.itemSize) / vm.itemSize) - 1)); },
  resetAfterIndex() {}
};

export default buildList(strategy);
