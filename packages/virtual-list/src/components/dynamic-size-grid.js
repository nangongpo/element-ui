import buildGrid from '../builders/build-grid';

const strategy = {
  name: 'ElDynamicSizeGrid',
  initCache(vm) { return { columns: {}, rows: {}, rowSizes: {}, lastVisitedColumnIndex: -1, lastVisitedRowIndex: -1, estimatedColumnWidth: vm.estimatedColumnWidth || 100, estimatedRowHeight: vm.estimatedRowHeight || 50 }; },
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.columnWidth !== 'function') throw new Error('[ElDynamicSizeGrid] columnWidth must be a function');
    if (process.env.NODE_ENV !== 'production' && typeof vm.rowHeight !== 'function') throw new Error('[ElDynamicSizeGrid] rowHeight must be a function');
  },
  getMeta(vm, index, cache, axis) {
    const lastKey = axis === 'column' ? 'lastVisitedColumnIndex' : 'lastVisitedRowIndex';
    const map = axis === 'column' ? cache.columns : cache.rows;
    const sizeFn = axis === 'column' ? vm.columnWidth : vm.rowHeight;
    if (index > cache[lastKey]) {
      let offset = 0;
      if (cache[lastKey] >= 0) { const last = map[cache[lastKey]]; offset = last.offset + last.size; }
      for (let current = cache[lastKey] + 1; current <= index; current++) { const size = axis === 'row' && cache.rowSizes[current] ? cache.rowSizes[current] : sizeFn(current); map[current] = { offset, size }; offset += size; }
      cache[lastKey] = index;
    }
    return map[index];
  },
  getColumnOffset(vm, index, cache) { return this.getMeta(vm, index, cache, 'column').offset; },
  getRowOffset(vm, index, cache) { return this.getMeta(vm, index, cache, 'row').offset; },
  getColumnSize(vm, index, cache) { return this.getMeta(vm, index, cache, 'column').size; },
  getRowSize(vm, index, cache) { return this.getMeta(vm, index, cache, 'row').size; },
  getEstimatedTotalWidth(vm, cache) { return this.estimated(vm, cache, 'column'); },
  getEstimatedTotalHeight(vm, cache) { return this.estimated(vm, cache, 'row'); },
  estimated(vm, cache, axis) {
    const lastKey = axis === 'column' ? 'lastVisitedColumnIndex' : 'lastVisitedRowIndex';
    const map = axis === 'column' ? cache.columns : cache.rows;
    const total = axis === 'column' ? vm.totalColumn : vm.totalRow;
    const estimate = axis === 'column' ? cache.estimatedColumnWidth : cache.estimatedRowHeight;
    const last = Math.min(cache[lastKey], total - 1);
    if (last < 0) return total * estimate;
    return map[last].offset + map[last].size + (total - last - 1) * estimate;
  },
  findStart(vm, offset, cache, axis) {
    const total = axis === 'column' ? vm.totalColumn : vm.totalRow;
    let low = 0;
    let high = total - 1;
    while (low <= high) { const middle = low + Math.floor((high - low) / 2); const current = this.getMeta(vm, middle, cache, axis); if (current.offset === offset) return middle; if (current.offset < offset) low = middle + 1; else high = middle - 1; }
    return Math.max(0, low - 1);
  },
  findStop(vm, start, offset, cache, axis) {
    const total = axis === 'column' ? vm.totalColumn : vm.totalRow;
    const viewport = axis === 'column' ? vm.width : vm.height;
    let index = start;
    let end = this.getMeta(vm, start, cache, axis).offset + this.getMeta(vm, start, cache, axis).size;
    while (index < total - 1 && end < offset + viewport) { index++; end += this.getMeta(vm, index, cache, axis).size; }
    return index;
  },
  getColumnStartIndex(vm, offset, cache) { return this.findStart(vm, offset, cache, 'column'); },
  getRowStartIndex(vm, offset, cache) { return this.findStart(vm, offset, cache, 'row'); },
  getColumnStopIndex(vm, start, offset, cache) { return this.findStop(vm, start, offset, cache, 'column'); },
  getRowStopIndex(vm, start, offset, cache) { return this.findStop(vm, start, offset, cache, 'row'); },
  setRowSize(vm, index, size) {
    if (vm.cache.rowSizes[index] === size) return;
    vm.resetAfter(0, index, false);
    vm.cache.rowSizes[index] = size;
    vm.$forceUpdate();
  },
  resetAfter(vm, columnIndex = 0, rowIndex = 0) { Object.keys(vm.cache.columns).forEach(key => { if (Number(key) >= columnIndex) delete vm.cache.columns[key]; }); Object.keys(vm.cache.rows).forEach(key => { if (Number(key) >= rowIndex) delete vm.cache.rows[key]; }); Object.keys(vm.cache.rowSizes).forEach(key => { if (Number(key) >= rowIndex) delete vm.cache.rowSizes[key]; }); vm.cache.lastVisitedColumnIndex = Math.min(vm.cache.lastVisitedColumnIndex, columnIndex - 1); vm.cache.lastVisitedRowIndex = Math.min(vm.cache.lastVisitedRowIndex, rowIndex - 1); }
};

export default buildGrid(strategy);
