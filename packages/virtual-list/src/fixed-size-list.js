import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  END_ALIGNMENT,
  START_ALIGNMENT
} from './defaults';

const getViewportSize = vm => vm.isHorizontal ? Number(vm.width) : Number(vm.height);

export default {
  name: 'ElFixedSizeList',
  clearCache: true,
  initCache() {},
  validateProps(vm) {
    if (process.env.NODE_ENV !== 'production' && typeof vm.itemSize !== 'number') {
      throw new Error('[ElFixedSizeList] itemSize must be a number');
    }
  },
  getItemOffset(index) {
    return index * this.itemSize;
  },
  getItemSize() {
    return this.itemSize;
  },
  getEstimatedTotalSize() {
    return this.resolvedTotal * this.itemSize;
  },
  getOffset(index, alignment, scrollOffset) {
    const size = getViewportSize(this);
    const lastItemOffset = Math.max(0, this.resolvedTotal * this.itemSize - size);
    const maxOffset = Math.min(lastItemOffset, index * this.itemSize);
    const minOffset = Math.max(0, (index + 1) * this.itemSize - size);
    let nextAlignment = this.resolveAlignment(alignment, scrollOffset, minOffset, maxOffset, size);
    if (nextAlignment === START_ALIGNMENT) return maxOffset;
    if (nextAlignment === END_ALIGNMENT) return minOffset;
    if (nextAlignment === CENTERED_ALIGNMENT) {
      const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
      if (middleOffset < Math.ceil(size / 2)) return 0;
      if (middleOffset > lastItemOffset + Math.floor(size / 2)) return lastItemOffset;
      return middleOffset;
    }
    if (nextAlignment === AUTO_ALIGNMENT &&
      scrollOffset >= minOffset && scrollOffset <= maxOffset) return scrollOffset;
    return scrollOffset < minOffset ? minOffset : maxOffset;
  },
  findStartIndex(offset) {
    return Math.max(0, Math.min(
      this.resolvedTotal - 1,
      Math.floor(offset / this.itemSize)
    ));
  },
  findStopIndex(startIndex, scrollOffset) {
    const offset = startIndex * this.itemSize;
    const visibleCount = Math.ceil(
      (getViewportSize(this) + scrollOffset - offset) / this.itemSize
    );
    return Math.max(0, Math.min(
      this.resolvedTotal - 1,
      startIndex + visibleCount - 1
    ));
  },
  resetAfterIndex() {
    this.getItemStyleCache(-1, null, null);
  }
};
