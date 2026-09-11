import { valueEquals } from 'element-ui/src/utils/util';
import { isKorean } from 'element-ui/src/utils/shared';
import domScheduler from 'element-ui/src/utils/dom-scheduler';

const ASCII_WIDTH_FACTORS = [];
const LABEL_MEASURE_CANDIDATE_COUNT = 3;
for (let code = 0; code < 128; code++) ASCII_WIDTH_FACTORS[code] = 0.56;
' !\'(),.:;I[]`ijl|'.split('').forEach(char => {
  ASCII_WIDTH_FACTORS[char.charCodeAt(0)] = 0.3;
});
'MW@#%&QGmwy'.split('').forEach(char => {
  ASCII_WIDTH_FACTORS[char.charCodeAt(0)] = 0.9;
});

export default {
  isEmptyValue(value) {
    return this.emptyValues.some(empty => this.isSameValue(empty, value));
  },
  getOptionValue(option) {
    return this._propsAdapter.getValue(option);
  },
  isOptionGroup(entry) {
    return Array.isArray(this._propsAdapter.getOptions(entry));
  },
  getOptionLabel(option) {
    return this._propsAdapter.getLabel(option);
  },
  getOptionChildren(option) {
    return this._propsAdapter.getOptions(option) || [];
  },
  getOptionKey(option) {
    return this._optionAdapter.getOptionKey(option);
  },
  isSameValue(left, right) {
    return this._optionAdapter.isSameValue(left, right);
  },
  findOption(value) {
    for (let index = this.allOptions.length - 1; index >= 0; index--) {
      if (this.isSameValue(this.getOptionValue(this.allOptions[index]), value)) {
        return this.allOptions[index];
      }
    }
    return null;
  },
  createFallbackOption(value) {
    return {
      [this.aliasProps.value]: value,
      [this.aliasProps.label]: value === null || value === undefined ? '' : String(value)
    };
  },
  syncSelectedOptions() {
    if (!this.multiple) {
      const option = this.findOption(this.value);
      this.cachedSelectedOptions = option ? [option] : [];
      return;
    }
    const values = Array.isArray(this.value) ? this.value : [];
    const cachedOptions = this.cachedSelectedOptions.slice();
    this.cachedSelectedOptions = values.map(value => {
      const option = this.findOption(value);
      if (option) return option;
      return cachedOptions.find(item => this.isSameValue(this.getOptionValue(item), value)) ||
        this.createFallbackOption(value);
    });
  },
  isOptionSelected(option) {
    const optionValue = this.getOptionValue(option);
    if (!this.multiple) return this.isSameValue(this.value, optionValue);
    return (this.value || []).some(value => this.isSameValue(value, optionValue));
  },
  isOptionDisabled(option) {
    if (this._propsAdapter.getDisabled(option)) return true;
    return this.multiple && !this.isOptionSelected(option) && this.multipleLimit > 0 &&
      (this.value || []).length >= this.multipleLimit;
  },
  isRowDisabled(row) {
    return !row || row.type !== 'option' || row.groupDisabled || this.isOptionDisabled(row.option);
  },
  syncDisplayLabel() {
    if (this.multiple) {
      this.displayLabel = '';
      this.currentPlaceholder = this.query || this.selectedOptions.length ? '' : this.propPlaceholder;
      return;
    }
    const option = this.findOption(this.value);
    this.displayLabel = option
      ? String(this.getOptionLabel(option))
      : (this.value === null || this.value === undefined ? '' : String(this.value));
  },
  emitChange(value) {
    if (!valueEquals(this.value, value)) this.$emit('change', value);
  },
  handleOptionSelect(index) {
    const row = this.displayRows[index];
    if (this.isRowDisabled(row)) return;
    const option = row.option;
    const optionValue = this.getOptionValue(option);
    if (this.multiple) {
      const value = (this.value || []).slice();
      const selectedIndex = this._optionAdapter.getValueIndex(value, optionValue);
      if (selectedIndex > -1) {
        value.splice(selectedIndex, 1);
        this.cachedSelectedOptions.splice(selectedIndex, 1);
        this._allowCreate.removeNewOption(option);
      } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
        value.push(optionValue);
        this.cachedSelectedOptions.push(option);
        this._allowCreate.selectNewOption(option);
      }
      this.$emit('input', value);
      this.emitChange(value);
      if (this.filterable && (option.created || !this.reserveKeyword)) {
        this.query = '';
      }
      if (option.created) this.handleQueryChange('');
      this.syncInputHeightImmediately();
      this.setSoftFocus();
    } else {
      this._allowCreate.selectNewOption(option);
      this.$emit('input', optionValue);
      this.emitChange(optionValue);
      this.displayLabel = String(this.getOptionLabel(option));
      this.visible = false;
      this.setSoftFocus();
    }
    this.isSilentBlur = true;
    this.requestLayoutSync();
  },
  handleOptionHover(index) {
    const row = this.displayRows[index];
    if (!this.isRowDisabled(row)) {
      this.hoveringIndex = index;
    }
  },
  handleNavigate(direction) {
    if (this.isOnComposition) return;
    if (!this.visible) {
      this.visible = true;
      return;
    }
    const length = this.displayRows.length;
    if (!length) return;
    let index = this.hoveringIndex;
    for (let count = 0; count < length; count++) {
      index = direction === 'next'
        ? (index + 1 + length) % length
        : (index - 1 + length) % length;
      if (!this.isRowDisabled(this.displayRows[index])) {
        this.hoveringIndex = index;
        this.scrollToIndex(index);
        return;
      }
    }
  },
  selectHighlighted() {
    if (!this.visible) this.visible = true;
    else if (this.hoveringIndex > -1) this.handleOptionSelect(this.hoveringIndex);
  },
  highlightFirstOption() {
    for (let index = 0; index < this.displayRows.length; index++) {
      if (!this.isRowDisabled(this.displayRows[index])) {
        this.hoveringIndex = index;
        return;
      }
    }
  },
  ensureHoverIndex() {
    if (this.hoveringIndex >= this.displayRows.length) this.hoveringIndex = -1;
  },
  handleQueryInput(event) {
    const value = event.target.value;
    this.query = value;
    this.currentPlaceholder = value || this.selectedOptions.length ? '' : this.propPlaceholder;
    this.handleQueryChange(value);
    this.syncInputHeightImmediately();
    this.requestLayoutSync();
  },
  handleReferenceInput(value) {
    if (!this.filterable) return;
    this.query = value;
    this.handleQueryChange(value);
  },
  handleQueryChange(query) {
    if (this.isOnComposition) return;
    if (this.remote) this.debouncedRemoteQuery(query);
    else if (typeof this.filterMethod === 'function') this.filterMethod(query);
  },
  handleComposition(event) {
    const text = event.target.value;
    if (event.type === 'compositionend') {
      this.isOnComposition = false;
      this.query = text;
      if (this.multiple) {
        this.currentPlaceholder = text || this.selectedOptions.length ? '' : this.propPlaceholder;
        this.syncInputHeightImmediately();
      }
      this.handleQueryChange(text);
    } else {
      this.isOnComposition = !isKorean(text[text.length - 1] || '');
    }
  },
  handleFocus(event) {
    if (!this.softFocus) {
      if (this.automaticDropdown || this.filterable) {
        if (this.filterable && !this.visible) this.menuVisibleOnFocus = true;
        this.visible = true;
      }
      this.$emit('focus', event);
    } else {
      this.softFocus = false;
    }
  },
  handleBlur(event) {
    setTimeout(() => {
      if (this.isSilentBlur) this.isSilentBlur = false;
      else this.$emit('blur', event);
    }, 50);
    this.softFocus = false;
  },
  toggleMenu() {
    if (this.selectDisabled) return;
    if (this.menuVisibleOnFocus) this.menuVisibleOnFocus = false;
    else this.visible = !this.visible;
    if (this.visible) (this.$refs.input || this.$refs.reference).focus();
  },
  openMenu() {
    if (this.filterable && !this.multiple) {
      this.currentPlaceholder = this.displayLabel || this.propPlaceholder;
      this.query = '';
      this.displayLabel = '';
    }
  },
  handleMenuEnter() {
    this.$nextTick(() => {
      if (!this.visible) return;
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.syncDropdownScrollPosition(true);
      this.requestLayoutSync();
    });
  },
  closeMenu() {
    this.broadcast('ElSelectDropdown', 'destroyPopper');
    this.menuVisibleOnFocus = false;
    this.hoveringIndex = -1;
    if (this.filterable && !this.multiple) {
      this.query = '';
      this.syncDisplayLabel();
      this.currentPlaceholder = this.propPlaceholder;
    } else if (this.multiple && !this.reserveKeyword) {
      this.query = '';
    }
  },
  findSelectedDisplayIndex() {
    return this.displayRows.findIndex(row =>
      row.type === 'option' && this.isOptionSelected(row.option));
  },
  syncDropdownScrollPosition(scrollToSelected) {
    const popper = this.$refs.popper;
    if (!popper) return;
    const selectedIndex = scrollToSelected ? this.findSelectedDisplayIndex() : -1;
    if (selectedIndex > -1) {
      this.hoveringIndex = selectedIndex;
      popper.scrollToIndex(selectedIndex);
    } else {
      popper.resetScrollTop();
      if (this.defaultFirstOption) this.highlightFirstOption();
    }
  },
  handleClose() {
    if (this.closeOnClickOutside) this.visible = false;
  },
  destroyDropdown() {
    if (this.$refs.popper) this.$refs.popper.doDestroy();
  },
  clearSelection(event) {
    if (event) event.stopPropagation();
    const value = this.multiple
      ? []
      : (typeof this.valueOnClear === 'function' ? this.valueOnClear() : this.valueOnClear);
    this.$emit('input', value);
    this.emitChange(value);
    this.visible = false;
    this.$emit('clear');
    this.cachedSelectedOptions = [];
    this._allowCreate.clearAllNewOption();
    this.syncInputHeightImmediately();
    this.requestLayoutSync();
  },
  deleteTag(event, option) {
    const value = (this.value || []).slice();
    const optionValue = this.getOptionValue(option);
    const index = this._optionAdapter.getValueIndex(value, optionValue);
    if (index > -1 && !this.selectDisabled) {
      value.splice(index, 1);
      this.cachedSelectedOptions.splice(index, 1);
      this.$emit('input', value);
      this.emitChange(value);
      this.$emit('remove-tag', optionValue);
      this._allowCreate.removeNewOption(option);
      this.syncInputHeightImmediately();
      this.requestLayoutSync();
    }
    event.stopPropagation();
  },
  deletePrevTag(event) {
    if (event.target.value || !Array.isArray(this.value) || !this.value.length) return;
    const lastOption = this.selectedOptions[this.selectedOptions.length - 1];
    const lastKey = this.getOptionKey(lastOption);
    if (this.hitOptionKey !== lastKey) {
      this.hitOptionKey = lastKey;
      return;
    }
    const value = this.value.slice();
    const removed = value.pop();
    this.cachedSelectedOptions.pop();
    this._allowCreate.removeNewOption(lastOption);
    this.hitOptionKey = null;
    this.$emit('input', value);
    this.emitChange(value);
    this.$emit('remove-tag', removed);
    this.syncInputHeightImmediately();
    this.requestLayoutSync();
  },
  resetInputState(event) {
    if (event.keyCode !== 8) {
      this.hitOptionKey = null;
    }
  },
  setSoftFocus() {
    this.softFocus = true;
    const input = this.$refs.input || this.$refs.reference;
    if (input) input.focus();
  },
  focus() {
    this.$refs.reference.focus();
  },
  blur() {
    this.visible = false;
    this.$refs.reference.blur();
  },
  scrollToIndex(index) {
    const list = this.$refs.popper;
    if (list) list.scrollToIndex(index);
  },
  syncInputHeightImmediately() {
    if (!this.multiple) return;
    this.requestLayoutSync();
  },
  requestLayoutSync() {
    if (this._layoutScheduled) return;
    this._layoutScheduled = true;
    domScheduler.register({
      vm: this,
      read: this.readLayoutMetrics,
      write: this.writeLayoutMetrics
    });
  },
  cancelLayoutSync() {
    this._layoutScheduled = false;
    domScheduler.deregister(this);
    if (this.$refs.popper) domScheduler.deregister(this.$refs.popper);
  },
  readLayoutMetrics() {
    const reference = this.$refs.reference;
    const referenceEl = reference && reference.$el;
    if (!referenceEl) return null;
    const input = referenceEl.querySelector('input');
    const tags = this.$refs.tags;
    const metrics = {
      inputWidth: referenceEl.getBoundingClientRect().width,
      inputHeight: input ? input.getBoundingClientRect().height : 0,
      tagsHeight: tags ? Math.round(tags.getBoundingClientRect().height) : 0
    };
    if (this.fitInputWidth === false && this._labelWidthDirty) {
      metrics.dropdownContentWidth = this.calculateLabelMaxWidth();
    }
    return metrics;
  },
  calculateLabelMaxWidth() {
    if (!this.displayOptions.length) return 0;
    const popper = this.$refs.popper;
    const dropdownItem = popper && popper.$el.querySelector('.el-select-dropdown__item');
    const context = this.getLabelMeasureContext();
    if (!dropdownItem || !context) return null;
    const style = window.getComputedStyle(dropdownItem);
    const dropdownStyle = window.getComputedStyle(popper.$el);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const border = (parseFloat(dropdownStyle.borderLeftWidth) || 0) +
      (parseFloat(dropdownStyle.borderRightWidth) || 0);
    const font = style.font
      ? `bold ${style.font.replace(new RegExp(`\\b${style.fontWeight}\\b`), '')}`
      : `bold ${style.fontSize} ${style.fontFamily}`;
    if (this._labelWidthCacheFont !== font) {
      this._labelWidthCache = Object.create(null);
      this._labelWidthEstimateCache = Object.create(null);
      this._labelWidthCacheFont = font;
      context.font = font;
    }
    const labels = this.findWidestEstimatedLabels(LABEL_MEASURE_CANDIDATE_COUNT);
    let maxWidth = 0;
    labels.forEach(label => {
      if (!Object.prototype.hasOwnProperty.call(this._labelWidthCache, label)) {
        this._labelWidthCache[label] = context.measureText(label).width;
      }
      maxWidth = Math.max(maxWidth, this._labelWidthCache[label]);
    });
    return maxWidth + padding + border;
  },
  findWidestEstimatedLabels(limit) {
    const options = this.displayOptions;
    const candidates = [];
    const seenLabels = Object.create(null);
    for (let index = 0; index < options.length; index++) {
      const label = String(this.getOptionLabel(options[index]));
      if (seenLabels[label]) continue;
      seenLabels[label] = true;
      const estimate = this.estimateLabelWidth(label);
      let insertIndex = candidates.length;
      while (insertIndex > 0 && estimate > candidates[insertIndex - 1].estimate) insertIndex--;
      if (insertIndex >= limit) continue;
      candidates.splice(insertIndex, 0, { label, estimate });
      if (candidates.length > limit) candidates.pop();
    }
    return candidates.map(candidate => candidate.label);
  },
  estimateLabelWidth(label) {
    if (Object.prototype.hasOwnProperty.call(this._labelWidthEstimateCache, label)) {
      return this._labelWidthEstimateCache[label];
    }
    let width = 0;
    for (let index = 0; index < label.length; index++) {
      const code = label.charCodeAt(index);
      if (code < 128) {
        width += ASCII_WIDTH_FACTORS[code];
      } else if (code >= 0xD800 && code <= 0xDBFF && index + 1 < label.length) {
        width += 1;
        index++;
      } else if (code >= 0x0300 && code <= 0x036F) {
        continue;
      } else {
        width += code >= 0x2E80 ? 1 : 0.65;
      }
    }
    this._labelWidthEstimateCache[label] = width;
    return width;
  },
  getLabelMeasureContext() {
    if (!this._labelMeasureContext) {
      this._labelMeasureContext = document.createElement('canvas').getContext('2d');
    }
    return this._labelMeasureContext;
  },
  resetLabelWidthCache() {
    this._labelWidthCache = Object.create(null);
    this._labelWidthEstimateCache = Object.create(null);
    this.invalidateLabelWidth();
  },
  invalidateLabelWidth() {
    this._labelWidthDirty = true;
  },
  requestPopperUpdate() {
    const popper = this.$refs.popper;
    if (!this.visible || !popper) return;
    domScheduler.register({
      vm: popper,
      read: () => true,
      write: () => {
        if (this.visible && this.$refs.popper === popper) {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      }
    });
  },
  writeLayoutMetrics(metrics) {
    this._layoutScheduled = false;
    if (!metrics) return;
    this.inputWidth = metrics.inputWidth;
    if (metrics.dropdownContentWidth !== null &&
      typeof metrics.dropdownContentWidth !== 'undefined') {
      this.dropdownContentWidth = metrics.dropdownContentWidth;
      this._labelWidthDirty = false;
    }
    if (!this.initialInputHeight) this.initialInputHeight = metrics.inputHeight;
    if (this.multiple) {
      const reference = this.$refs.reference;
      const input = reference && reference.$el.querySelector('input');
      if (input) {
        const initialHeight = this.initialInputHeight || 40;
        input.style.height = (this.selectedOptions.length
          ? Math.max(metrics.tagsHeight + (metrics.tagsHeight > initialHeight ? 6 : 0), initialHeight)
          : initialHeight) + 'px';
      }
    }
    this.requestPopperUpdate();
  }
};
