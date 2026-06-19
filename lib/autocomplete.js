import ElInput from 'element-ui/lib/input.js';
import Clickoutside from 'element-ui/lib/utils/clickoutside.js';
import Popper from 'element-ui/lib/utils/vue-popper.js';
import Emitter from 'element-ui/lib/mixins/emitter.js';
import ElScrollbar from 'element-ui/lib/scrollbar.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Migrating from 'element-ui/lib/mixins/migrating.js';
import { generateId } from 'element-ui/lib/utils/util.js';
import Focus from 'element-ui/lib/mixins/focus.js';

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

//
var script$1 = {
  components: {
    ElScrollbar: ElScrollbar
  },
  mixins: [Popper, Emitter],
  componentName: 'ElAutocompleteSuggestions',
  data: function data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },
  props: {
    options: {
      default: function _default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },
  methods: {
    select: function select(item) {
      this.dispatch('ElAutocomplete', 'item-click', item);
    }
  },
  updated: function updated() {
    var _this = this;
    this.$nextTick(function (_) {
      _this.popperJS && _this.updatePopper();
    });
  },
  mounted: function mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
    this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  },
  created: function created() {
    var _this2 = this;
    this.$on('visible', function (val, inputWidth) {
      _this2.dropdownWidth = inputWidth + 'px';
      _this2.showPopper = val;
    });
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      name: "el-zoom-in-top"
    },
    on: {
      "after-leave": _vm.doDestroy
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showPopper,
      expression: "showPopper"
    }],
    staticClass: "el-autocomplete-suggestion el-popper",
    class: {
      "is-loading": !_vm.parent.hideLoading && _vm.parent.loading
    },
    style: {
      width: _vm.dropdownWidth
    },
    attrs: {
      role: "region"
    }
  }, [_c("el-scrollbar", {
    attrs: {
      tag: "ul",
      "wrap-class": "el-autocomplete-suggestion__wrap",
      "view-class": "el-autocomplete-suggestion__list"
    }
  }, [!_vm.parent.hideLoading && _vm.parent.loading ? _c("li", [_c("i", {
    staticClass: "el-icon-loading"
  })]) : _vm._t("default")], 2)], 1)]);
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: 'ElAutocomplete',
  mixins: [Emitter, Focus('input'), Migrating],
  inheritAttrs: false,
  componentName: 'ElAutocomplete',
  components: {
    ElInput: ElInput,
    ElAutocompleteSuggestions: __vue_component__$1
  },
  directives: {
    Clickoutside: Clickoutside
  },
  props: {
    valueKey: {
      type: String,
      default: 'value'
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false
    };
  },
  computed: {
    suggestionVisible: function suggestionVisible() {
      var suggestions = this.suggestions;
      var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      return (isValidData || this.loading) && this.activated;
    },
    id: function id() {
      return "el-autocomplete-".concat(generateId());
    }
  },
  watch: {
    suggestionVisible: function suggestionVisible(val) {
      var $input = this.getInput();
      if ($input) {
        this.broadcast('ElAutocompleteSuggestions', 'visible', [val, $input.offsetWidth]);
      }
    }
  },
  methods: {
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'custom-item': 'custom-item is removed, use scoped slot instead.',
          'props': 'props is removed, use value-key instead.'
        }
      };
    },
    getData: function getData(queryString) {
      var _this = this;
      if (this.suggestionDisabled) {
        return;
      }
      this.loading = true;
      this.fetchSuggestions(queryString, function (suggestions) {
        _this.loading = false;
        if (_this.suggestionDisabled) {
          return;
        }
        if (Array.isArray(suggestions)) {
          _this.suggestions = suggestions;
          _this.highlightedIndex = _this.highlightFirstItem ? 0 : -1;
        } else {
          console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array');
        }
      });
    },
    handleInput: function handleInput(value) {
      this.$emit('input', value);
      this.suggestionDisabled = false;
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true;
        this.suggestions = [];
        return;
      }
      this.debouncedGetData(value);
    },
    handleChange: function handleChange(value) {
      this.$emit('change', value);
    },
    handleFocus: function handleFocus(event) {
      this.activated = true;
      this.$emit('focus', event);
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value);
      }
    },
    handleBlur: function handleBlur(event) {
      this.$emit('blur', event);
    },
    handleClear: function handleClear() {
      this.activated = false;
      this.$emit('clear');
    },
    close: function close(e) {
      this.activated = false;
    },
    handleKeyEnter: function handleKeyEnter(e) {
      var _this2 = this;
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault();
        this.select(this.suggestions[this.highlightedIndex]);
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', {
          value: this.value
        });
        this.$nextTick(function (_) {
          _this2.suggestions = [];
          _this2.highlightedIndex = -1;
        });
      }
    },
    select: function select(item) {
      var _this3 = this;
      this.$emit('input', item[this.valueKey]);
      this.$emit('select', item);
      this.$nextTick(function (_) {
        _this3.suggestions = [];
        _this3.highlightedIndex = -1;
      });
    },
    highlight: function highlight(index) {
      if (!this.suggestionVisible || this.loading) {
        return;
      }
      if (index < 0) {
        this.highlightedIndex = -1;
        return;
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1;
      }
      var suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap');
      var suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li');
      var highlightItem = suggestionList[index];
      var scrollTop = suggestion.scrollTop;
      var offsetTop = highlightItem.offsetTop;
      if (offsetTop + highlightItem.scrollHeight > scrollTop + suggestion.clientHeight) {
        suggestion.scrollTop += highlightItem.scrollHeight;
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight;
      }
      this.highlightedIndex = index;
      var $input = this.getInput();
      $input.setAttribute('aria-activedescendant', "".concat(this.id, "-item-").concat(this.highlightedIndex));
    },
    getInput: function getInput() {
      return this.$refs.input.getInput();
    }
  },
  mounted: function mounted() {
    var _this4 = this;
    this.debouncedGetData = debounce(this.debounce, this.getData);
    this.$on('item-click', function (item) {
      _this4.select(item);
    });
    var $input = this.getInput();
    $input.setAttribute('role', 'textbox');
    $input.setAttribute('aria-autocomplete', 'list');
    $input.setAttribute('aria-controls', 'id');
    $input.setAttribute('aria-activedescendant', "".concat(this.id, "-item-").concat(this.highlightedIndex));
  },
  beforeDestroy: function beforeDestroy() {
    this.$refs.suggestions.$destroy();
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
      value: _vm.close,
      expression: "close"
    }],
    staticClass: "el-autocomplete",
    attrs: {
      "aria-haspopup": "listbox",
      role: "combobox",
      "aria-expanded": _vm.suggestionVisible,
      "aria-owns": _vm.id
    }
  }, [_c("el-input", _vm._b({
    ref: "input",
    on: {
      input: _vm.handleInput,
      change: _vm.handleChange,
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      clear: _vm.handleClear
    },
    nativeOn: {
      keydown: [function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }
        $event.preventDefault();
        _vm.highlight(_vm.highlightedIndex - 1);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }
        $event.preventDefault();
        _vm.highlight(_vm.highlightedIndex + 1);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.handleKeyEnter($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
          return null;
        }
        return _vm.close($event);
      }]
    }
  }, "el-input", [_vm.$props, _vm.$attrs], false), [_vm.$slots.prepend ? _c("template", {
    slot: "prepend"
  }, [_vm._t("prepend")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.append ? _c("template", {
    slot: "append"
  }, [_vm._t("append")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.prefix ? _c("template", {
    slot: "prefix"
  }, [_vm._t("prefix")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.suffix ? _c("template", {
    slot: "suffix"
  }, [_vm._t("suffix")], 2) : _vm._e()], 2), _vm._v(" "), _c("el-autocomplete-suggestions", {
    ref: "suggestions",
    class: [_vm.popperClass ? _vm.popperClass : ""],
    attrs: {
      "visible-arrow": "",
      "popper-options": _vm.popperOptions,
      "append-to-body": _vm.popperAppendToBody,
      placement: _vm.placement,
      id: _vm.id
    }
  }, _vm._l(_vm.suggestions, function (item, index) {
    return _c("li", {
      key: index,
      class: {
        highlighted: _vm.highlightedIndex === index
      },
      attrs: {
        id: _vm.id + "-item-" + index,
        role: "option",
        "aria-selected": _vm.highlightedIndex === index
      },
      on: {
        click: function click($event) {
          _vm.select(item);
        }
      }
    }, [_vm._t("default", [_vm._v("\n        " + _vm._s(item[_vm.valueKey]) + "\n      ")], {
      item: item
    })], 2);
  }), 0)], 1);
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
