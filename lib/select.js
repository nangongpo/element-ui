import emitter from './mixins/emitter.js';
import Focus from './mixins/focus.js';
import Locale from './mixins/locale.js';
import __vue_component__$2 from './input.js';
import Popper from './utils/vue-popper.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import { _ as __vue_component__$3 } from './shared/option-75a44e56.js';
import __vue_component__$4 from './tag.js';
import Scrollbar from './scrollbar.js';
import { d as debounce } from './shared/debounce-e5482a73.js';
import Clickoutside from './utils/clickoutside.js';
import { a as addResizeListener, r as removeResizeListener } from './shared/resize-event-51726919.js';
import scrollIntoView from './utils/scroll-into-view.js';
import { isIE, isEdge, valueEquals, getValueByPath } from './utils/util.js';
import { isKorean } from './utils/shared.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import 'vue';
import './locale/format.js';
import './mixins/migrating.js';
import './utils/merge.js';
import './utils/types.js';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './utils/dom.js';
import './utils/scrollbar-width.js';
import './shared/throttle-54b44d30.js';

//
var script$1 = {
  name: 'ElSelectDropdown',
  componentName: 'ElSelectDropdown',
  mixins: [Popper],
  props: {
    placement: {
      default: 'bottom-start'
    },
    boundariesPadding: {
      default: 0
    },
    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    visibleArrow: {
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      minWidth: ''
    };
  },
  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },
  watch: {
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },
  mounted() {
    this.referenceElm = this.$parent.$refs.reference.$el;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', () => {
      if (this.$parent.visible) this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-select-dropdown el-popper",
    class: [{
      "is-multiple": _vm.$parent.multiple
    }, _vm.popperClass],
    style: {
      minWidth: _vm.minWidth
    }
  }, [_vm._t("default")], 2);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var NavigationMixin = {
  data() {
    return {
      hoverOption: -1
    };
  },
  computed: {
    optionsAllDisabled() {
      return this.options.filter(option => option.visible).every(option => option.disabled);
    }
  },
  watch: {
    hoverIndex(val) {
      if (typeof val === 'number' && val > -1) {
        this.hoverOption = this.options[val] || {};
      }
      this.options.forEach(option => {
        option.hover = this.hoverOption === option;
      });
    }
  },
  methods: {
    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
        }
        var option = this.options[this.hoverIndex];
        if (option.disabled === true || option.groupDisabled === true || !option.visible) {
          this.navigateOptions(direction);
        }
        this.$nextTick(() => this.scrollToOption(this.hoverOption));
      }
    }
  }
};

//
var script = {
  mixins: [emitter, Locale, Focus('reference'), NavigationMixin],
  name: 'ElSelect',
  componentName: 'ElSelect',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  provide() {
    return {
      'select': this
    };
  },
  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    readonly() {
      return !this.filterable || this.multiple || !isIE() && !isEdge() && !this.visible;
    },
    showClose() {
      var hasValue = this.multiple ? Array.isArray(this.value) && this.value.length > 0 : this.value !== undefined && this.value !== null && this.value !== '';
      var criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
      return criteria;
    },
    iconClass() {
      return this.remote && this.filterable ? '' : this.visible ? 'arrow-up is-reverse' : 'arrow-up';
    },
    debounce() {
      return this.remote ? 300 : 0;
    },
    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading');
      } else {
        if (this.remote && this.query === '' && this.options.length === 0) return false;
        if (this.filterable && this.query && this.options.length > 0 && this.filteredOptionsCount === 0) {
          return this.noMatchText || this.t('el.select.noMatch');
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t('el.select.noData');
        }
      }
      return null;
    },
    showNewOption() {
      var hasExistingOption = this.options.filter(option => !option.created).some(option => option.currentLabel === this.query);
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
    },
    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small';
    },
    propPlaceholder() {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : this.t('el.select.placeholder');
    }
  },
  components: {
    ElInput: __vue_component__$2,
    ElSelectMenu: __vue_component__$1,
    ElOption: __vue_component__$3,
    ElTag: __vue_component__$4,
    ElScrollbar: Scrollbar
  },
  directives: {
    Clickoutside
  },
  props: {
    name: String,
    id: String,
    value: {
      required: true
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' && console.warn('[Element Warn][Select]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
        return true;
      }
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      required: false
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    };
  },
  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    propPlaceholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },
    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight();
        if (val && val.length > 0 || this.$refs.input && this.query !== '') {
          this.currentPlaceholder = '';
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = '';
          this.handleQueryChange(this.query);
        }
      }
      this.setSelected();
      if (this.filterable && !this.multiple) {
        this.inputLength = 20;
      }
      if (!valueEquals(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val);
      }
    },
    visible(val) {
      if (!val) {
        this.broadcast('ElSelectDropdown', 'destroyPopper');
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.query = '';
        this.previousQuery = null;
        this.selectedLabel = '';
        this.inputLength = 20;
        this.menuVisibleOnFocus = false;
        this.resetHoverIndex();
        this.$nextTick(() => {
          if (this.$refs.input && this.$refs.input.value === '' && this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate && this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel;
            } else {
              this.selectedLabel = this.selected.currentLabel;
            }
            if (this.filterable) this.query = this.selectedLabel;
          }
          if (this.filterable) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
      } else {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel;
          this.handleQueryChange(this.query);
          if (this.multiple) {
            this.$refs.input.focus();
          } else {
            if (!this.remote) {
              this.broadcast('ElOption', 'queryChange', '');
              this.broadcast('ElOptionGroup', 'queryChange');
            }
            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel;
              this.selectedLabel = '';
            }
          }
        }
      }
      this.$emit('visible-change', val);
    },
    options() {
      if (this.$isServer) return;
      this.$nextTick(() => {
        this.broadcast('ElSelectDropdown', 'updatePopper');
      });
      if (this.multiple) {
        this.resetInputHeight();
      }
      var inputs = this.$el.querySelectorAll('input');
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }
    }
  },
  methods: {
    handleNavigate(direction) {
      if (this.isOnComposition) return;
      this.navigateOptions(direction);
    },
    handleComposition(event) {
      var text = event.target.value;
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.$nextTick(_ => this.handleQueryChange(text));
      } else {
        var lastCharacter = text[text.length - 1] || '';
        this.isOnComposition = !isKorean(lastCharacter);
      }
    },
    handleQueryChange(val) {
      if (this.previousQuery === val || this.isOnComposition) return;
      if (this.previousQuery === null && (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')) {
        this.previousQuery = val;
        return;
      }
      this.previousQuery = val;
      this.$nextTick(() => {
        if (this.visible) this.broadcast('ElSelectDropdown', 'updatePopper');
      });
      this.hoverIndex = -1;
      if (this.multiple && this.filterable) {
        this.$nextTick(() => {
          var length = this.$refs.input.value.length * 15 + 20;
          this.inputLength = this.collapseTags ? Math.min(50, length) : length;
          this.managePlaceholder();
          this.resetInputHeight();
        });
      }
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.hoverIndex = -1;
        this.remoteMethod(val);
      } else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val);
        this.broadcast('ElOptionGroup', 'queryChange');
      } else {
        this.filteredOptionsCount = this.optionsCount;
        this.broadcast('ElOption', 'queryChange', val);
        this.broadcast('ElOptionGroup', 'queryChange');
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }
    },
    scrollToOption(option) {
      var target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
      if (this.$refs.popper && target) {
        var menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        scrollIntoView(menu, target);
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
    },
    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected));
    },
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val);
      }
    },
    getOption(value) {
      var option;
      var isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      var isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]';
      var isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]';
      for (var i = this.cachedOptions.length - 1; i >= 0; i--) {
        var cachedOption = this.cachedOptions[i];
        var isEqual = isObject ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey) : cachedOption.value === value;
        if (isEqual) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      var label = !isObject && !isNull && !isUndefined ? String(value) : '';
      var newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },
    setSelected() {
      if (!this.multiple) {
        var option = this.getOption(this.value);
        if (option.created) {
          this.createdLabel = option.currentLabel;
          this.createdSelected = true;
        } else {
          this.createdSelected = false;
        }
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        if (this.filterable) this.query = this.selectedLabel;
        return;
      }
      var result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          if (this.filterable && !this.visible) {
            this.menuVisibleOnFocus = true;
          }
          this.visible = true;
        }
        this.$emit('focus', event);
      } else {
        this.softFocus = false;
      }
    },
    blur() {
      this.visible = false;
      this.$refs.reference.blur();
    },
    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false;
        } else {
          this.$emit('blur', event);
        }
      }, 50);
      this.softFocus = false;
    },
    handleClearClick(event) {
      this.deleteSelected(event);
    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },
    handleClose() {
      this.visible = false;
    },
    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) return;
      var option = this.selected[this.selected.length - 1];
      if (!option) return;
      if (hit === true || hit === false) {
        option.hitState = hit;
        return hit;
      }
      option.hitState = !option.hitState;
      return option.hitState;
    },
    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        var value = this.value.slice();
        value.pop();
        this.$emit('input', value);
        this.emitChange(value);
      }
    },
    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },
    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },
    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        var inputChildNodes = this.$refs.reference.$el.childNodes;
        var input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        var tags = this.$refs.tags;
        var tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0;
        var sizeInMap = this.initialInputHeight || 40;
        input.style.height = this.selected.length === 0 ? sizeInMap + 'px' : Math.max(tags ? tagsHeight + (tagsHeight > sizeInMap ? 6 : 0) : 0, sizeInMap) + 'px';
        if (this.visible && this.emptyText !== false) {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      });
    },
    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
          } else {
            this.hoverIndex = -1;
          }
        }
      }, 300);
    },
    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        var value = (this.value || []).slice();
        var optionIndex = this.getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value);
        }
        this.$emit('input', value);
        this.emitChange(value);
        if (option.created) {
          this.query = '';
          this.handleQueryChange('');
          this.inputLength = 20;
        }
        if (this.filterable) this.$refs.input.focus();
      } else {
        this.$emit('input', option.value);
        this.emitChange(option.value);
        this.visible = false;
      }
      this.isSilentBlur = byClick;
      this.setSoftFocus();
      if (this.visible) return;
      this.$nextTick(() => {
        this.scrollToOption(option);
      });
    },
    setSoftFocus() {
      this.softFocus = true;
      var input = this.$refs.input || this.$refs.reference;
      if (input) {
        input.focus();
      }
    },
    getValueIndex(arr = [], value) {
      var isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      if (!isObject) {
        return arr.indexOf(value);
      } else {
        var valueKey = this.valueKey;
        var index = -1;
        arr.some((item, i) => {
          if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
    },
    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false;
        } else {
          this.visible = !this.visible;
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus();
        }
      }
    },
    selectOption() {
      if (!this.visible) {
        this.toggleMenu();
      } else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      }
    },
    deleteSelected(event) {
      event.stopPropagation();
      var value = this.multiple ? [] : '';
      this.$emit('input', value);
      this.emitChange(value);
      this.visible = false;
      this.$emit('clear');
    },
    deleteTag(event, tag) {
      var index = this.selected.indexOf(tag);
      if (index > -1 && !this.selectDisabled) {
        var value = this.value.slice();
        value.splice(index, 1);
        this.$emit('input', value);
        this.emitChange(value);
        this.$emit('remove-tag', tag.value);
      }
      event.stopPropagation();
    },
    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel;
        this.handleQueryChange(this.query);
      }
    },
    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        this.options.splice(index, 1);
      }
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      // highlight the created option
      var hasCreated = false;
      for (var i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true;
          this.hoverIndex = i;
          break;
        }
      }
      if (hasCreated) return;
      for (var _i = 0; _i !== this.options.length; ++_i) {
        var option = this.options[_i];
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = _i;
            break;
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = _i;
            break;
          }
        }
      }
    },
    getValueKey(item) {
      if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
        return item.value;
      } else {
        return getValueByPath(item.value, this.valueKey);
      }
    }
  },
  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.propPlaceholder;
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '');
    }
    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange();
    });
    this.debouncedQueryChange = debounce(this.debounce, e => {
      this.handleQueryChange(e.target.value);
    });
    this.$on('handleOptionClick', this.handleOptionSelect);
    this.$on('setSelected', this.setSelected);
  },
  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = '';
    }
    addResizeListener(this.$el, this.handleResize);
    var reference = this.$refs.reference;
    if (reference && reference.$el) {
      var sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      var input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    if (this.remote && this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setSelected();
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleClose,
      expression: "handleClose"
    }],
    staticClass: "el-select",
    class: [_vm.selectSize ? "el-select--" + _vm.selectSize : ""],
    on: {
      click: function click($event) {
        $event.stopPropagation();
        return _vm.toggleMenu($event);
      }
    }
  }, [_vm.multiple ? _c("div", {
    ref: "tags",
    staticClass: "el-select__tags",
    style: {
      "max-width": _vm.inputWidth - 32 + "px",
      width: "100%"
    }
  }, [_vm.collapseTags && _vm.selected.length ? _c("span", [_c("el-tag", {
    attrs: {
      closable: !_vm.selectDisabled,
      size: _vm.collapseTagSize,
      hit: _vm.selected[0].hitState,
      type: "info",
      "disable-transitions": ""
    },
    on: {
      close: function close($event) {
        _vm.deleteTag($event, _vm.selected[0]);
      }
    }
  }, [_c("span", {
    staticClass: "el-select__tags-text"
  }, [_vm._v(_vm._s(_vm.selected[0].currentLabel))])]), _vm._v(" "), _vm.selected.length > 1 ? _c("el-tag", {
    attrs: {
      closable: false,
      size: _vm.collapseTagSize,
      type: "info",
      "disable-transitions": ""
    }
  }, [_c("span", {
    staticClass: "el-select__tags-text"
  }, [_vm._v("+ " + _vm._s(_vm.selected.length - 1))])]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), !_vm.collapseTags ? _c("transition-group", {
    on: {
      "after-leave": _vm.resetInputHeight
    }
  }, _vm._l(_vm.selected, function (item) {
    return _c("el-tag", {
      key: _vm.getValueKey(item),
      attrs: {
        closable: !_vm.selectDisabled,
        size: _vm.collapseTagSize,
        hit: item.hitState,
        type: "info",
        "disable-transitions": ""
      },
      on: {
        close: function close($event) {
          _vm.deleteTag($event, item);
        }
      }
    }, [_c("span", {
      staticClass: "el-select__tags-text"
    }, [_vm._v(_vm._s(item.currentLabel))])]);
  }), 1) : _vm._e(), _vm._v(" "), _vm.filterable ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.query,
      expression: "query"
    }],
    ref: "input",
    staticClass: "el-select__input",
    class: [_vm.selectSize ? "is-" + _vm.selectSize : ""],
    style: {
      "flex-grow": "1",
      width: _vm.inputLength / (_vm.inputWidth - 32) + "%",
      "max-width": _vm.inputWidth - 42 + "px"
    },
    attrs: {
      type: "text",
      disabled: _vm.selectDisabled,
      autocomplete: _vm.autoComplete || _vm.autocomplete
    },
    domProps: {
      value: _vm.query
    },
    on: {
      focus: _vm.handleFocus,
      blur: function blur($event) {
        _vm.softFocus = false;
      },
      keyup: _vm.managePlaceholder,
      keydown: [_vm.resetInputState, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }
        $event.preventDefault();
        _vm.handleNavigate("next");
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }
        $event.preventDefault();
        _vm.handleNavigate("prev");
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        $event.preventDefault();
        return _vm.selectOption($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
          return null;
        }
        $event.stopPropagation();
        $event.preventDefault();
        _vm.visible = false;
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "delete", [8, 46], $event.key, ["Backspace", "Delete", "Del"])) {
          return null;
        }
        return _vm.deletePrevTag($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
          return null;
        }
        _vm.visible = false;
      }],
      compositionstart: _vm.handleComposition,
      compositionupdate: _vm.handleComposition,
      compositionend: _vm.handleComposition,
      input: [function ($event) {
        if ($event.target.composing) {
          return;
        }
        _vm.query = $event.target.value;
      }, _vm.debouncedQueryChange]
    }
  }) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c("el-input", {
    ref: "reference",
    class: {
      "is-focus": _vm.visible
    },
    attrs: {
      type: "text",
      placeholder: _vm.currentPlaceholder,
      name: _vm.name,
      id: _vm.id,
      autocomplete: _vm.autoComplete || _vm.autocomplete,
      size: _vm.selectSize,
      disabled: _vm.selectDisabled,
      readonly: _vm.readonly,
      "validate-event": false,
      tabindex: _vm.multiple && _vm.filterable ? "-1" : null
    },
    on: {
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      input: _vm.debouncedOnInputChange,
      compositionstart: _vm.handleComposition,
      compositionupdate: _vm.handleComposition,
      compositionend: _vm.handleComposition
    },
    nativeOn: {
      keydown: [function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }
        $event.stopPropagation();
        $event.preventDefault();
        _vm.handleNavigate("next");
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }
        $event.stopPropagation();
        $event.preventDefault();
        _vm.handleNavigate("prev");
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        $event.preventDefault();
        return _vm.selectOption($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
          return null;
        }
        $event.stopPropagation();
        $event.preventDefault();
        _vm.visible = false;
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
          return null;
        }
        _vm.visible = false;
      }],
      mouseenter: function mouseenter($event) {
        _vm.inputHovering = true;
      },
      mouseleave: function mouseleave($event) {
        _vm.inputHovering = false;
      }
    },
    model: {
      value: _vm.selectedLabel,
      callback: function callback($$v) {
        _vm.selectedLabel = $$v;
      },
      expression: "selectedLabel"
    }
  }, [_vm.$slots.prefix ? _c("template", {
    slot: "prefix"
  }, [_vm._t("prefix")], 2) : _vm._e(), _vm._v(" "), _c("template", {
    slot: "suffix"
  }, [_c("i", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.showClose,
      expression: "!showClose"
    }],
    class: ["el-select__caret", "el-input__icon", "el-icon-" + _vm.iconClass]
  }), _vm._v(" "), _vm.showClose ? _c("i", {
    staticClass: "el-select__caret el-input__icon el-icon-circle-close",
    on: {
      click: _vm.handleClearClick
    }
  }) : _vm._e()])], 2), _vm._v(" "), _c("transition", {
    attrs: {
      name: "el-zoom-in-top"
    },
    on: {
      "before-enter": _vm.handleMenuEnter,
      "after-leave": _vm.doDestroy
    }
  }, [_c("el-select-menu", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible && _vm.emptyText !== false,
      expression: "visible && emptyText !== false"
    }],
    ref: "popper",
    attrs: {
      "append-to-body": _vm.popperAppendToBody
    }
  }, [_c("el-scrollbar", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.options.length > 0 && !_vm.loading,
      expression: "options.length > 0 && !loading"
    }],
    ref: "scrollbar",
    class: {
      "is-empty": !_vm.allowCreate && _vm.query && _vm.filteredOptionsCount === 0
    },
    attrs: {
      tag: "ul",
      "wrap-class": "el-select-dropdown__wrap",
      "view-class": "el-select-dropdown__list"
    }
  }, [_vm.showNewOption ? _c("el-option", {
    attrs: {
      value: _vm.query,
      created: ""
    }
  }) : _vm._e(), _vm._v(" "), _vm._t("default")], 2), _vm._v(" "), _vm.emptyText && (!_vm.allowCreate || _vm.loading || _vm.allowCreate && _vm.options.length === 0) ? [_vm.$slots.empty ? _vm._t("empty") : _c("p", {
    staticClass: "el-select-dropdown__empty"
  }, [_vm._v("\n          " + _vm._s(_vm.emptyText) + "\n        ")])] : _vm._e()], 2)], 1)], 1);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
