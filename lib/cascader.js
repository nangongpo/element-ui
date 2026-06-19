import Popper from 'element-ui/lib/utils/vue-popper.js';
import Clickoutside from 'element-ui/lib/utils/clickoutside.js';
import Emitter from 'element-ui/lib/mixins/emitter.js';
import Locale from 'element-ui/lib/mixins/locale.js';
import Migrating from 'element-ui/lib/mixins/migrating.js';
import ElInput from 'element-ui/lib/input.js';
import ElTag from 'element-ui/lib/tag.js';
import ElScrollbar from 'element-ui/lib/scrollbar.js';
import ElCascaderPanel from 'element-ui/lib/cascader-panel.js';
import AriaUtils from 'element-ui/lib/utils/aria-utils.js';
import { t } from 'element-ui/lib/locale/index.js';
import { kebabCase, isEqual, isEmpty } from 'element-ui/lib/utils/util.js';
import { isUndefined, isFunction } from 'element-ui/lib/utils/types.js';
import { isDef } from 'element-ui/lib/utils/shared.js';
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toArray(r) {
  return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
var throttle$1 = function ( delay, noTrailing, callback, debounceMode ) {

	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();

		} else if ( noTrailing !== true ) {
			// In trailing throttle mode, since `delay` time has not been
			// exceeded, schedule `callback` to execute `delay` ms after most
			// recent execution.
			//
			// If `debounceMode` is true (at begin), schedule `clear` to execute
			// after `delay` ms.
			//
			// If `debounceMode` is false (at end), schedule `callback` to
			// execute after `delay` ms.
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}

	}

	// Return the wrapper function.
	return wrapper;

};

/* eslint-disable no-undefined */

var throttle = throttle$1;

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  [atBegin]     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */
var debounce = function ( delay, atBegin, callback ) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
};

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
    Clickoutside: Clickoutside
  },
  mixins: [PopperMixin, Emitter, Locale, Migrating],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  components: {
    ElInput: ElInput,
    ElTag: ElTag,
    ElScrollbar: ElScrollbar,
    ElCascaderPanel: ElCascaderPanel
  },
  props: {
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: function _default() {
        return t('el.cascader.placeholder');
      }
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
      default: function _default() {
        return function () {};
      }
    },
    popperClass: String
  },
  data: function data() {
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
    realSize: function realSize() {
      var _elFormItemSize = (this.elFormItem || {}).elFormItemSize;
      return this.size || _elFormItemSize || (this.$ELEMENT || {}).size;
    },
    tagSize: function tagSize() {
      return ['small', 'mini'].indexOf(this.realSize) > -1 ? 'mini' : 'small';
    },
    isDisabled: function isDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    config: function config() {
      var config = this.props || {};
      var $attrs = this.$attrs;
      Object.keys(MigratingProps).forEach(function (oldProp) {
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
    multiple: function multiple() {
      return this.config.multiple;
    },
    leafOnly: function leafOnly() {
      return !this.config.checkStrictly;
    },
    readonly: function readonly() {
      return !this.filterable || this.multiple;
    },
    clearBtnVisible: function clearBtnVisible() {
      if (!this.clearable || this.isDisabled || this.filtering || !this.inputHover) {
        return false;
      }
      return this.multiple ? !!this.checkedNodes.filter(function (node) {
        return !node.isDisabled;
      }).length : !!this.presentText;
    },
    panel: function panel() {
      return this.$refs.panel;
    }
  },
  watch: {
    disabled: function disabled() {
      this.computePresentContent();
    },
    value: function value(val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val;
        this.computePresentContent();
      }
    },
    checkedValue: function checkedValue(val) {
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
    presentText: function presentText(val) {
      this.inputValue = val;
    },
    presentTags: function presentTags(val, oldVal) {
      if (this.multiple && (val.length || oldVal.length)) {
        this.$nextTick(this.updateStyle);
      }
    },
    filtering: function filtering(val) {
      this.$nextTick(this.updatePopper);
    }
  },
  mounted: function mounted() {
    var _this = this;
    var input = this.$refs.input;
    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap[this.realSize] || 40;
    }
    if (!this.isEmptyValue(this.value)) {
      this.computePresentContent();
    }
    this.filterHandler = debounce(this.debounce, function () {
      var inputValue = _this.inputValue;
      if (!inputValue) {
        _this.filtering = false;
        return;
      }
      var before = _this.beforeFilter(inputValue);
      if (before && before.then) {
        before.then(_this.getSuggestions);
      } else if (before !== false) {
        _this.getSuggestions();
      } else {
        _this.filtering = false;
      }
    });
    addResizeListener(this.$el, this.updateStyle);
  },
  beforeDestroy: function beforeDestroy() {
    removeResizeListener(this.$el, this.updateStyle);
  },
  methods: {
    getMigratingConfig: function getMigratingConfig() {
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
    toggleDropDownVisible: function toggleDropDownVisible(visible) {
      var _this2 = this;
      if (this.isDisabled) return;
      var dropDownVisible = this.dropDownVisible;
      var input = this.$refs.input;
      visible = isDef(visible) ? visible : !dropDownVisible;
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;
        if (visible) {
          this.$nextTick(function () {
            _this2.updatePopper();
            _this2.panel.scrollIntoView();
          });
        }
        input.$refs.input.setAttribute('aria-expanded', visible);
        this.$emit('visible-change', visible);
      }
    },
    handleDropdownLeave: function handleDropdownLeave() {
      this.filtering = false;
      this.inputValue = this.presentText;
      this.doDestroy();
    },
    handleKeyDown: function handleKeyDown(event) {
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
    handleFocus: function handleFocus(e) {
      this.$emit('focus', e);
    },
    handleBlur: function handleBlur(e) {
      this.$emit('blur', e);
    },
    handleInput: function handleInput(val, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true);
      if (event && event.isComposing) return;
      if (val) {
        this.filterHandler();
      } else {
        this.filtering = false;
      }
    },
    handleClear: function handleClear() {
      this.presentText = '';
      this.panel.clearCheckedNodes();
    },
    handleExpandChange: function handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this));
      this.$emit('expand-change', value);
      this.$emit('active-item-change', value); // Deprecated
    },
    focusFirstNode: function focusFirstNode() {
      var _this3 = this;
      this.$nextTick(function () {
        var filtering = _this3.filtering;
        var _this3$$refs = _this3.$refs,
          popper = _this3$$refs.popper,
          suggestionPanel = _this3$$refs.suggestionPanel;
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
    computePresentContent: function computePresentContent() {
      var _this4 = this;
      // nextTick is required, because checked nodes may not change right now
      this.$nextTick(function () {
        if (_this4.config.multiple) {
          _this4.computePresentTags();
          _this4.presentText = _this4.presentTags.length ? ' ' : null;
        } else {
          _this4.computePresentText();
        }
      });
    },
    isEmptyValue: function isEmptyValue(val) {
      var multiple = this.multiple;
      var emitPath = this.panel.config.emitPath;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    computePresentText: function computePresentText() {
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
    computePresentTags: function computePresentTags() {
      var isDisabled = this.isDisabled,
        leafOnly = this.leafOnly,
        showAllLevels = this.showAllLevels,
        separator = this.separator,
        collapseTags = this.collapseTags;
      var checkedNodes = this.getCheckedNodes(leafOnly);
      var tags = [];
      var genTag = function genTag(node) {
        return {
          node: node,
          key: node.uid,
          text: node.getText(showAllLevels, separator),
          hitState: false,
          closable: !isDisabled && !node.isDisabled
        };
      };
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
              text: "+ ".concat(restCount),
              closable: false
            });
          } else {
            rest.forEach(function (node) {
              return tags.push(genTag(node));
            });
          }
        }
      }
      this.checkedNodes = checkedNodes;
      this.presentTags = tags;
    },
    getSuggestions: function getSuggestions() {
      var _this5 = this;
      var filterMethod = this.filterMethod;
      if (!isFunction(filterMethod)) {
        filterMethod = function filterMethod(node, keyword) {
          return node.text.includes(keyword);
        };
      }
      var suggestions = this.panel.getFlattedNodes(this.leafOnly).filter(function (node) {
        if (node.isDisabled) return false;
        node.text = node.getText(_this5.showAllLevels, _this5.separator) || '';
        return filterMethod(node, _this5.inputValue);
      });
      if (this.multiple) {
        this.presentTags.forEach(function (tag) {
          tag.hitState = false;
        });
      } else {
        suggestions.forEach(function (node) {
          node.checked = isEqual(_this5.checkedValue, node.getValueByOption());
        });
      }
      this.filtering = true;
      this.suggestions = suggestions;
      this.$nextTick(this.updatePopper);
    },
    handleSuggestionKeyDown: function handleSuggestionKeyDown(event) {
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
    handleDelete: function handleDelete() {
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
    handleSuggestionClick: function handleSuggestionClick(index) {
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
    deleteTag: function deleteTag(tag) {
      var checkedValue = this.checkedValue;
      var current = tag.node.getValueByOption();
      var val = checkedValue.find(function (n) {
        return isEqual(n, current);
      });
      this.checkedValue = checkedValue.filter(function (n) {
        return !isEqual(n, current);
      });
      this.$emit('remove-tag', val);
    },
    updateStyle: function updateStyle() {
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
    getCheckedNodes: function getCheckedNodes(leafOnly) {
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
