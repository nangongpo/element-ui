import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
  END_ALIGNMENT,
  START_ALIGNMENT
} from './defaults';

const getViewportSize = vm => vm.isHorizontal ? Number(vm.width) : Number(vm.height);

export default {
  name: 'ElDynamicSizeList',
  clearCache: false,
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.itemSize !== 'function') {
      throw new Error('[ElDynamicSizeList] itemSize must be a function');
    }
  },
  initCache() {
    return {
      items: {},
      estimatedItemSize: this.estimatedItemSize || DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
      lastVisitedIndex: -1
    };
  },
  getItemMetadata(index) {
    const cache = this._listCache;
    if (index > cache.lastVisitedIndex) {
      let offset = 0;
      if (cache.lastVisitedIndex >= 0) {
        const item = cache.items[cache.lastVisitedIndex];
        offset = item.offset + item.size;
      }
      for (let current = cache.lastVisitedIndex + 1; current <= index; current++) {
        const size = this.itemSize(current);
        cache.items[current] = { offset, size };
        offset += size;
      }
      cache.lastVisitedIndex = index;
    }
    return cache.items[index];
  },
  getItemOffset(index) {
    return this.getItemMetadata(index).offset;
  },
  getItemSize(index) {
    return this.getItemMetadata(index).size;
  },
  getEstimatedTotalSize() {
    const cache = this._listCache;
    const lastIndex = Math.min(cache.lastVisitedIndex, this.resolvedTotal - 1);
    let measured = 0;
    if (lastIndex >= 0) {
      const item = cache.items[lastIndex];
      measured = item.offset + item.size;
    }
    return measured + (this.resolvedTotal - lastIndex - 1) * cache.estimatedItemSize;
  },
  binarySearch(low, high, offset) {
    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const currentOffset = this.getItemMetadata(middle).offset;
      if (currentOffset === offset) return middle;
      if (currentOffset < offset) low = middle + 1;
      else high = middle - 1;
    }
    return Math.max(0, low - 1);
  },
  exponentialSearch(index, offset) {
    let exponent = 1;
    while (index < this.resolvedTotal && this.getItemMetadata(index).offset < offset) {
      index += exponent;
      exponent *= 2;
    }
    return this.binarySearch(
      Math.floor(index / 2),
      Math.min(index, this.resolvedTotal - 1),
      offset
    );
  },
  findStartIndex(offset) {
    const cache = this._listCache;
    const lastOffset = cache.lastVisitedIndex > 0
      ? cache.items[cache.lastVisitedIndex].offset : 0;
    return lastOffset >= offset
      ? this.binarySearch(0, cache.lastVisitedIndex, offset)
      : this.exponentialSearch(Math.max(0, cache.lastVisitedIndex), offset);
  },
  findStopIndex(startIndex, scrollOffset) {
    const maxOffset = scrollOffset + getViewportSize(this);
    const item = this.getItemMetadata(startIndex);
    let offset = item.offset + item.size;
    let stopIndex = startIndex;
    while (stopIndex < this.resolvedTotal - 1 && offset < maxOffset) {
      stopIndex++;
      offset += this.getItemMetadata(stopIndex).size;
    }
    return stopIndex;
  },
  getOffset(index, alignment, scrollOffset) {
    const size = getViewportSize(this);
    const item = this.getItemMetadata(index);
    const maxOffset = Math.max(0, Math.min(
      this.getEstimatedTotalSize() - size,
      item.offset
    ));
    const minOffset = Math.max(0, item.offset - size + item.size);
    const nextAlignment = this.resolveAlignment(
      alignment, scrollOffset, minOffset, maxOffset, size
    );
    if (nextAlignment === START_ALIGNMENT) return maxOffset;
    if (nextAlignment === END_ALIGNMENT) return minOffset;
    if (nextAlignment === CENTERED_ALIGNMENT) {
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    }
    if (nextAlignment === AUTO_ALIGNMENT &&
      scrollOffset >= minOffset && scrollOffset <= maxOffset) return scrollOffset;
    return scrollOffset < minOffset ? minOffset : maxOffset;
  },
  clearCacheAfterIndex(index, forceUpdate = true) {
    this._listCache.lastVisitedIndex = Math.min(
      this._listCache.lastVisitedIndex,
      index - 1
    );
    this.getItemStyleCache(-1);
    if (forceUpdate) this.$forceUpdate();
  },
  resetAfterIndex(index, forceUpdate = true) {
    this.clearCacheAfterIndex(index, forceUpdate);
  }
};
