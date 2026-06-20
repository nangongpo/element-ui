import _toArray from '@babel/runtime/helpers/esm/toArray';
import Popper from './utils/vue-popper.js';
import Clickoutside from './utils/clickoutside.js';
import emitter from './mixins/emitter.js';
import Locale from './mixins/locale.js';
import Migrating from './mixins/migrating.js';
import __vue_component__$1 from './input.js';
import __vue_component__$2 from './tag.js';
import Scrollbar from './scrollbar.js';
import __vue_component__$3 from './cascader-panel.js';
import AriaUtils from './utils/aria-utils.js';
import { t } from './locale/index.js';
import { kebabCase, isEqual, isEmpty } from './utils/util.js';
import { isUndefined, isFunction } from './utils/types.js';
import { isDef } from './utils/shared.js';
import { a as addResizeListener, r as removeResizeListener } from './shared/resize-event-51726919.js';
import { d as debounce } from './shared/debounce-e5482a73.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './shared/popper-c5560701.js';
import 'vue';
import './utils/popup/popup-manager.js';
import './utils/dom.js';
import './utils/merge.js';
import './utils/scrollbar-width.js';
import './shared/throttle-54b44d30.js';
import '@babel/runtime/helpers/esm/defineProperty';
import './shared/helper-cd11baf0.js';
import './checkbox.js';
import './radio.js';
import './utils/scroll-into-view.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';

function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var KeyCode = AriaUtils.keys;
var MigratingProps = {
  expandTrigger: {
    newProp: 'expandTrigger',
    type: String
  },
  changeOnSelect: {
    newProp: 'checkStrictly',
    type: Boolean
  },
  hoverThreshold: {
    newProp: 'hoverThreshold',
    type: Number
  }
};
var PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    transformOrigin: Popper.props.transformOrigin
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};
var InputSizeMap = {
  medium: 36,
  small: 32,
  mini: 28
};
var script = {
  name: 'ElCascader',
  directives: {
    Clickoutside
  },
  mixins: [PopperMixin, emitter, Locale, Migrating],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  components: {
    ElInput: __vue_component__$1,
    ElTag: __vue_component__$2,
    ElScrollbar: Scrollbar,
    ElCascaderPanel: __vue_component__$3
  },
  props: {
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: () => t('el.cascader.placeholder')
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => () => {}
    },
    popperClass: String
  },
  data() {
    return {
      dropDownVisible: false,
      checkedValue: this.value,
      inputHover: false,
      inputValue: null,
      presentText: null,
      presentTags: [],
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0
    };
  },
  computed: {
    realSize() {
      var _elFormItemSize = (this.elFormItem || {}).elFormItemSize;
      return this.size || _elFormItemSize || (this.$ELEMENT || {}).size;
    },
    tagSize() {
      return ['small', 'mini'].indexOf(this.realSize) > -1 ? 'mini' : 'small';
    },
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    config() {
      var config = this.props || {};
      var $attrs = this.$attrs;
      Object.keys(MigratingProps).forEach(oldProp => {
        var _MigratingProps$oldPr = MigratingProps[oldProp],
          newProp = _MigratingProps$oldPr.newProp,
          type = _MigratingProps$oldPr.type;
        var oldValue = $attrs[oldProp] || $attrs[kebabCase(oldProp)];
        if (isDef(oldProp) && !isDef(config[newProp])) {
          if (type === Boolean && oldValue === '') {
            oldValue = true;
          }
          config[newProp] = oldValue;
        }
      });
      return config;
    },
    multiple() {
      return this.config.multiple;
    },
    leafOnly() {
      return !this.config.checkStrictly;
    },
    readonly() {
      return !this.filterable || this.multiple;
    },
    clearBtnVisible() {
      if (!this.clearable || this.isDisabled || this.filtering || !this.inputHover) {
        return false;
      }
      return this.multiple ? !!this.checkedNodes.filter(node => !node.isDisabled).length : !!this.presentText;
    },
    panel() {
      return this.$refs.panel;
    }
  },
  watch: {
    disabled() {
      this.computePresentContent();
    },
    value(val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val;
        this.computePresentContent();
      }
    },
    checkedValue(val) {
      var value = this.value,
        dropDownVisible = this.dropDownVisible;
      var _this$config = this.config,
        checkStrictly = _this$config.checkStrictly,
        multiple = _this$config.multiple;
      if (!isEqual(val, value) || isUndefined(value)) {
        this.computePresentContent();
        // hide dropdown when single mode
        if (!multiple && !checkStrictly && dropDownVisible) {
          this.toggleDropDownVisible(false);
        }
        this.$emit('input', val);
        this.$emit('change', val);
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
    },
    options: {
      handler: function handler() {
        this.$nextTick(this.computePresentContent);
      },
      deep: true
    },
    presentText(val) {
      this.inputValue = val;
    },
    presentTags(val, oldVal) {
      if (this.multiple && (val.length || oldVal.length)) {
        this.$nextTick(this.updateStyle);
      }
    },
    filtering(val) {
      this.$nextTick(this.updatePopper);
    }
  },
  mounted() {
    var input = this.$refs.input;
    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap[this.realSize] || 40;
    }
    if (!this.isEmptyValue(this.value)) {
      this.computePresentContent();
    }
    this.filterHandler = debounce(this.debounce, () => {
      var inputValue = this.inputValue;
      if (!inputValue) {
        this.filtering = false;
        return;
      }
      var before = this.beforeFilter(inputValue);
      if (before && before.then) {
        before.then(this.getSuggestions);
      } else if (before !== false) {
        this.getSuggestions();
      } else {
        this.filtering = false;
      }
    });
    addResizeListener(this.$el, this.updateStyle);
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.updateStyle);
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'expand-trigger': 'expand-trigger is removed, use `props.expandTrigger` instead.',
          'change-on-select': 'change-on-select is removed, use `props.checkStrictly` instead.',
          'hover-threshold': 'hover-threshold is removed, use `props.hoverThreshold` instead'
        },
        events: {
          'active-item-change': 'active-item-change is renamed to expand-change'
        }
      };
    },
    toggleDropDownVisible(visible) {
      if (this.isDisabled) return;
      var dropDownVisible = this.dropDownVisible;
      var input = this.$refs.input;
      visible = isDef(visible) ? visible : !dropDownVisible;
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;
        if (visible) {
          this.$nextTick(() => {
            this.updatePopper();
            this.panel.scrollIntoView();
          });
        }
        input.$refs.input.setAttribute('aria-expanded', visible);
        this.$emit('visible-change', visible);
      }
    },
    handleDropdownLeave() {
      this.filtering = false;
      this.inputValue = this.presentText;
      this.doDestroy();
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case KeyCode.enter:
          this.toggleDropDownVisible();
          break;
        case KeyCode.down:
          this.toggleDropDownVisible(true);
          this.focusFirstNode();
          event.preventDefault();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.$emit('blur', e);
    },
    handleInput(val, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true);
      if (event && event.isComposing) return;
      if (val) {
        this.filterHandler();
      } else {
        this.filtering = false;
      }
    },
    handleClear() {
      this.presentText = '';
      this.panel.clearCheckedNodes();
    },
    handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this));
      this.$emit('expand-change', value);
      this.$emit('active-item-change', value); // Deprecated
    },
    focusFirstNode() {
      this.$nextTick(() => {
        var filtering = this.filtering;
        var _this$$refs = this.$refs,
          popper = _this$$refs.popper,
          suggestionPanel = _this$$refs.suggestionPanel;
        var firstNode = null;
        if (filtering && suggestionPanel) {
          firstNode = suggestionPanel.$el.querySelector('.el-cascader__suggestion-item');
        } else {
          var firstMenu = popper.querySelector('.el-cascader-menu');
          firstNode = firstMenu.querySelector('.el-cascader-node[tabindex="-1"]');
        }
        if (firstNode) {
          firstNode.focus();
          !filtering && firstNode.click();
        }
      });
    },
    computePresentContent() {
      // nextTick is required, because checked nodes may not change right now
      this.$nextTick(() => {
        if (this.config.multiple) {
          this.computePresentTags();
          this.presentText = this.presentTags.length ? ' ' : null;
        } else {
          this.computePresentText();
        }
      });
    },
    isEmptyValue(val) {
      var multiple = this.multiple;
      var emitPath = this.panel.config.emitPath;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    computePresentText() {
      var checkedValue = this.checkedValue,
        config = this.config;
      if (!this.isEmptyValue(checkedValue)) {
        var node = this.panel.getNodeByValue(checkedValue);
        if (node && (config.checkStrictly || node.isLeaf)) {
          this.presentText = node.getText(this.showAllLevels, this.separator);
          return;
        }
      }
      this.presentText = null;
    },
    computePresentTags() {
      var isDisabled = this.isDisabled,
        leafOnly = this.leafOnly,
        showAllLevels = this.showAllLevels,
        separator = this.separator,
        collapseTags = this.collapseTags;
      var checkedNodes = this.getCheckedNodes(leafOnly);
      var tags = [];
      var genTag = node => ({
        node,
        key: node.uid,
        text: node.getText(showAllLevels, separator),
        hitState: false,
        closable: !isDisabled && !node.isDisabled
      });
      if (checkedNodes.length) {
        var _checkedNodes = _toArray(checkedNodes),
          first = _checkedNodes[0],
          rest = _arrayLikeToArray(_checkedNodes).slice(1);
        var restCount = rest.length;
        tags.push(genTag(first));
        if (restCount) {
          if (collapseTags) {
            tags.push({
              key: -1,
              text: `+ ${restCount}`,
              closable: false
            });
          } else {
            rest.forEach(node => tags.push(genTag(node)));
          }
        }
      }
      this.checkedNodes = checkedNodes;
      this.presentTags = tags;
    },
    getSuggestions() {
      var filterMethod = this.filterMethod;
      if (!isFunction(filterMethod)) {
        filterMethod = (node, keyword) => node.text.includes(keyword);
      }
      var suggestions = this.panel.getFlattedNodes(this.leafOnly).filter(node => {
        if (node.isDisabled) return false;
        node.text = node.getText(this.showAllLevels, this.separator) || '';
        return filterMethod(node, this.inputValue);
      });
      if (this.multiple) {
        this.presentTags.forEach(tag => {
          tag.hitState = false;
        });
      } else {
        suggestions.forEach(node => {
          node.checked = isEqual(this.checkedValue, node.getValueByOption());
        });
      }
      this.filtering = true;
      this.suggestions = suggestions;
      this.$nextTick(this.updatePopper);
    },
    handleSuggestionKeyDown(event) {
      var keyCode = event.keyCode,
        target = event.target;
      switch (keyCode) {
        case KeyCode.enter:
          target.click();
          break;
        case KeyCode.up:
          var prev = target.previousElementSibling;
          prev && prev.focus();
          break;
        case KeyCode.down:
          var next = target.nextElementSibling;
          next && next.focus();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleDelete() {
      var inputValue = this.inputValue,
        pressDeleteCount = this.pressDeleteCount,
        presentTags = this.presentTags;
      var lastIndex = presentTags.length - 1;
      var lastTag = presentTags[lastIndex];
      this.pressDeleteCount = inputValue ? 0 : pressDeleteCount + 1;
      if (!lastTag) return;
      if (this.pressDeleteCount) {
        if (lastTag.hitState) {
          this.deleteTag(lastTag);
        } else {
          lastTag.hitState = true;
        }
      }
    },
    handleSuggestionClick(index) {
      var multiple = this.multiple;
      var targetNode = this.suggestions[index];
      if (multiple) {
        var checked = targetNode.checked;
        targetNode.doCheck(!checked);
        this.panel.calculateMultiCheckedValue();
      } else {
        this.checkedValue = targetNode.getValueByOption();
        this.toggleDropDownVisible(false);
      }
    },
    deleteTag(tag) {
      var checkedValue = this.checkedValue;
      var current = tag.node.getValueByOption();
      var val = checkedValue.find(n => isEqual(n, current));
      this.checkedValue = checkedValue.filter(n => !isEqual(n, current));
      this.$emit('remove-tag', val);
    },
    updateStyle() {
      var $el = this.$el,
        inputInitialHeight = this.inputInitialHeight;
      if (this.$isServer || !$el) return;
      var suggestionPanel = this.$refs.suggestionPanel;
      var inputInner = $el.querySelector('.el-input__inner');
      if (!inputInner) return;
      var tags = $el.querySelector('.el-cascader__tags');
      var suggestionPanelEl = null;
      if (suggestionPanel && (suggestionPanelEl = suggestionPanel.$el)) {
        var suggestionList = suggestionPanelEl.querySelector('.el-cascader__suggestion-list');
        suggestionList.style.minWidth = inputInner.offsetWidth + 'px';
      }
      if (tags) {
        var offsetHeight = Math.round(tags.getBoundingClientRect().height);
        var height = Math.max(offsetHeight + 6, inputInitialHeight) + 'px';
        inputInner.style.height = height;
        if (this.dropDownVisible) {
          this.updatePopper();
        }
      }
    },
    /**
     * public methods
    */
    getCheckedNodes(leafOnly) {
      return this.panel.getCheckedNodes(leafOnly);
    }
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
      value: function value() {
        return _vm.toggleDropDownVisible(false);
      },
      expression: "() => toggleDropDownVisible(false)"
    }],
    ref: "reference",
    class: ["el-cascader", _vm.realSize && "el-cascader--" + _vm.realSize, {
      "is-disabled": _vm.isDisabled
    }],
    on: {
      mouseenter: function mouseenter($event) {
        _vm.inputHover = true;
      },
      mouseleave: function mouseleave($event) {
        _vm.inputHover = false;
      },
      click: function click() {
        return _vm.toggleDropDownVisible(_vm.readonly ? undefined : true);
      },
      keydown: _vm.handleKeyDown
    }
  }, [_c("el-input", {
    ref: "input",
    class: {
      "is-focus": _vm.dropDownVisible
    },
    attrs: {
      size: _vm.realSize,
      placeholder: _vm.placeholder,
      readonly: _vm.readonly,
      disabled: _vm.isDisabled,
      "validate-event": false
    },
    on: {
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      input: _vm.handleInput
    },
    model: {
      value: _vm.multiple ? _vm.presentText : _vm.inputValue,
      callback: function callback($$v) {
        _vm.multiple ? _vm.presentText : _vm.inputValue = $$v;
      },
      expression: "multiple ? presentText : inputValue"
    }
  }, [_c("template", {
    slot: "suffix"
  }, [_vm.clearBtnVisible ? _c("i", {
    key: "clear",
    staticClass: "el-input__icon el-icon-circle-close",
    on: {
      click: function click($event) {
        $event.stopPropagation();
        return _vm.handleClear($event);
      }
    }
  }) : _c("i", {
    key: "arrow-down",
    class: ["el-input__icon", "el-icon-arrow-down", _vm.dropDownVisible && "is-reverse"],
    on: {
      click: function click($event) {
        $event.stopPropagation();
        _vm.toggleDropDownVisible();
      }
    }
  })])], 2), _vm._v(" "), _vm.multiple ? _c("div", {
    staticClass: "el-cascader__tags"
  }, [_vm._l(_vm.presentTags, function (tag) {
    return _c("el-tag", {
      key: tag.key,
      attrs: {
        type: "info",
        size: _vm.tagSize,
        hit: tag.hitState,
        closable: tag.closable,
        "disable-transitions": ""
      },
      on: {
        close: function close($event) {
          _vm.deleteTag(tag);
        }
      }
    }, [_c("span", [_vm._v(_vm._s(tag.text))])]);
  }), _vm._v(" "), _vm.filterable && !_vm.isDisabled ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: _vm.inputValue,
      expression: "inputValue",
      modifiers: {
        trim: true
      }
    }],
    staticClass: "el-cascader__search-input",
    attrs: {
      type: "text",
      placeholder: _vm.presentTags.length ? "" : _vm.placeholder
    },
    domProps: {
      value: _vm.inputValue
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) {
          return;
        }
        _vm.inputValue = $event.target.value.trim();
      }, function (e) {
        return _vm.handleInput(_vm.inputValue, e);
      }],
      click: function click($event) {
        $event.stopPropagation();
        _vm.toggleDropDownVisible(true);
      },
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "delete", [8, 46], $event.key, ["Backspace", "Delete", "Del"])) {
          return null;
        }
        return _vm.handleDelete($event);
      },
      blur: function blur($event) {
        _vm.$forceUpdate();
      }
    }
  }) : _vm._e()], 2) : _vm._e(), _vm._v(" "), _c("transition", {
    attrs: {
      name: "el-zoom-in-top"
    },
    on: {
      "after-leave": _vm.handleDropdownLeave
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.dropDownVisible,
      expression: "dropDownVisible"
    }],
    ref: "popper",
    class: ["el-popper", "el-cascader__dropdown", _vm.popperClass]
  }, [_c("el-cascader-panel", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.filtering,
      expression: "!filtering"
    }],
    ref: "panel",
    attrs: {
      options: _vm.options,
      props: _vm.config,
      border: false,
      "render-label": _vm.$scopedSlots.default
    },
    on: {
      "expand-change": _vm.handleExpandChange,
      close: function close($event) {
        _vm.toggleDropDownVisible(false);
      }
    },
    model: {
      value: _vm.checkedValue,
      callback: function callback($$v) {
        _vm.checkedValue = $$v;
      },
      expression: "checkedValue"
    }
  }), _vm._v(" "), _vm.filterable ? _c("el-scrollbar", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.filtering,
      expression: "filtering"
    }],
    ref: "suggestionPanel",
    staticClass: "el-cascader__suggestion-panel",
    attrs: {
      tag: "ul",
      "view-class": "el-cascader__suggestion-list"
    },
    nativeOn: {
      keydown: function keydown($event) {
        return _vm.handleSuggestionKeyDown($event);
      }
    }
  }, [_vm.suggestions.length ? _vm._l(_vm.suggestions, function (item, index) {
    return _c("li", {
      key: item.uid,
      class: ["el-cascader__suggestion-item", item.checked && "is-checked"],
      attrs: {
        tabindex: -1
      },
      on: {
        click: function click($event) {
          _vm.handleSuggestionClick(index);
        }
      }
    }, [_c("span", [_vm._v(_vm._s(item.text))]), _vm._v(" "), item.checked ? _c("i", {
      staticClass: "el-icon-check"
    }) : _vm._e()]);
  }) : _vm._t("empty", [_c("li", {
    staticClass: "el-cascader__empty-text"
  }, [_vm._v(_vm._s(_vm.t("el.cascader.noMatch")))])])], 2) : _vm._e()], 1)])], 1);
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
