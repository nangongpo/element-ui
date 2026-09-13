import buildList from '../builders/build-list';

const strategy = {
  name: 'ElDynamicSizeList',
  initCache(vm) { return { items: {}, estimatedItemSize: vm.estimatedItemSize, lastVisitedIndex: -1 }; },
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.itemSize !== 'function') throw new Error('[ElDynamicSizeList] itemSize must be a function');
  },
  getItemMetadata(vm, index, cache) {
    if (index > cache.lastVisitedIndex) {
      let offset = 0;
      if (cache.lastVisitedIndex >= 0) {
        const last = cache.items[cache.lastVisitedIndex];
        offset = last.offset + last.size;
      }
      for (let current = cache.lastVisitedIndex + 1; current <= index; current++) {
        const size = vm.itemSize(current);
        cache.items[current] = { offset, size };
        offset += size;
      }
      cache.lastVisitedIndex = index;
    }
    return cache.items[index];
  },
  getItemOffset(vm, index, cache) { return this.getItemMetadata(vm, index, cache).offset; },
  getItemSize(vm, index, cache) { return this.getItemMetadata(vm, index, cache).size; },
  getEstimatedTotalSize(vm, cache) {
    const lastIndex = Math.min(cache.lastVisitedIndex, vm.total - 1);
    if (lastIndex < 0) return vm.total * cache.estimatedItemSize;
    const last = cache.items[lastIndex];
    return last.offset + last.size + (vm.total - lastIndex - 1) * cache.estimatedItemSize;
  },
  getStartIndexForOffset(vm, offset, cache) {
    let low = 0;
    let high = Math.min(cache.lastVisitedIndex, vm.total - 1);
    if (high < 0 || this.getItemMetadata(vm, high, cache).offset < offset) {
      high = Math.min(vm.total - 1, Math.max(0, high * 2));
      while (high < vm.total - 1 && this.getItemMetadata(vm, high, cache).offset < offset) high = Math.min(vm.total - 1, Math.max(high + 1, high * 2));
    }
    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      if (this.getItemMetadata(vm, middle, cache).offset === offset) return middle;
      if (this.getItemMetadata(vm, middle, cache).offset < offset) low = middle + 1;
      else high = middle - 1;
    }
    return Math.max(0, low - 1);
  },
  getStopIndexForStartIndex(vm, start, offset, cache) {
    const max = offset + vm.clientSize;
    let index = start;
    let end = this.getItemMetadata(vm, start, cache).offset + this.getItemSize(vm, start, cache);
    while (index < vm.total - 1 && end < max) { index++; end += this.getItemSize(vm, index, cache); }
    return index;
  },
  resetAfterIndex(vm, index) { cacheReset(vm, index); }
};

function cacheReset(vm, index) {
  vm.itemCache.lastVisitedIndex = Math.min(vm.itemCache.lastVisitedIndex, index - 1);
  Object.keys(vm.itemCache.items).forEach(key => { if (Number(key) >= index) delete vm.itemCache.items[key]; });
}

export default buildList(strategy);
