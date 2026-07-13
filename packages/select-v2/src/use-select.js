import { valueEquals } from 'element-ui/src/utils/util';
import { isKorean } from 'element-ui/src/utils/shared';

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
    this.$nextTick(() => {
      const selectedIndex = this.findSelectedDisplayIndex();
      if (selectedIndex > -1) {
        this.hoveringIndex = selectedIndex;
        this.scrollToIndex(selectedIndex);
      } else if (this.defaultFirstOption) {
        if (this.$refs.popper) this.$refs.popper.resetScrollTop();
        this.highlightFirstOption();
      } else if (this.$refs.popper) {
        this.$refs.popper.resetScrollTop();
      }
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
  handleMenuEnter() {
    this.requestLayoutSync();
  },
  handleClose() {
    this.visible = false;
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
    this.focus();
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
    this.$nextTick(() => {
      const reference = this.$refs.reference;
      const input = reference && reference.$el.querySelector('input');
      const tags = this.$refs.tags;
      if (!input || !tags) return;
      const initialHeight = this.initialInputHeight || input.getBoundingClientRect().height || 40;
      const tagsHeight = Math.round(tags.getBoundingClientRect().height);
      input.style.height = (this.selectedOptions.length
        ? Math.max(tagsHeight + (tagsHeight > initialHeight ? 6 : 0), initialHeight)
        : initialHeight) + 'px';
    });
  },
  requestLayoutSync() {
    if (this._layoutScheduled) return;
    this._layoutScheduled = true;
    this.$nextTick(() => {
      if (!this._layoutScheduled) return;
      this.writeLayoutMetrics(this.readLayoutMetrics());
    });
  },
  readLayoutMetrics() {
    const reference = this.$refs.reference;
    const referenceEl = reference && reference.$el;
    if (!referenceEl) return null;
    const input = referenceEl.querySelector('input');
    const tags = this.$refs.tags;
    return {
      inputWidth: referenceEl.getBoundingClientRect().width,
      inputHeight: input ? input.getBoundingClientRect().height : 0,
      tagsHeight: tags ? Math.round(tags.getBoundingClientRect().height) : 0
    };
  },
  writeLayoutMetrics(metrics) {
    this._layoutScheduled = false;
    if (!metrics) return;
    this.inputWidth = metrics.inputWidth;
    this.appliedDropdownStyle = this.dropdownStyle;
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
    if (this.visible && this.$refs.popper) {
      this.broadcast('ElSelectDropdown', 'updatePopper');
    }
  }
};
