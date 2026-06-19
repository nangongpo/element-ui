import emitter from 'element-ui/lib/mixins/emitter.js';
import Migrating from 'element-ui/lib/mixins/migrating.js';
import merge from 'element-ui/lib/utils/merge.js';
import { isKorean } from 'element-ui/lib/utils/shared.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var hiddenTextarea;
var HIDDEN_STYLE = "\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n";
var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];
function calculateNodeStyling(targetElement) {
  var style = window.getComputedStyle(targetElement);
  var boxSizing = style.getPropertyValue('box-sizing');
  var paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));
  var borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));
  var contextStyle = CONTEXT_STYLE.map(function (name) {
    return "".concat(name, ":").concat(style.getPropertyValue(name));
  }).join(';');
  return {
    contextStyle: contextStyle,
    paddingSize: paddingSize,
    borderSize: borderSize,
    boxSizing: boxSizing
  };
}
function calcTextareaHeight(targetElement) {
  var minRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var maxRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }
  var _calculateNodeStyling = calculateNodeStyling(targetElement),
    paddingSize = _calculateNodeStyling.paddingSize,
    borderSize = _calculateNodeStyling.borderSize,
    boxSizing = _calculateNodeStyling.boxSizing,
    contextStyle = _calculateNodeStyling.contextStyle;
  hiddenTextarea.setAttribute('style', "".concat(contextStyle, ";").concat(HIDDEN_STYLE));
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';
  var height = hiddenTextarea.scrollHeight;
  var result = {};
  if (boxSizing === 'border-box') {
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }
  hiddenTextarea.value = '';
  var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
  if (minRows !== null) {
    var minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }
    height = Math.max(minHeight, height);
    result.minHeight = "".concat(minHeight, "px");
  }
  if (maxRows !== null) {
    var maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    height = Math.min(maxHeight, height);
  }
  result.height = "".concat(height, "px");
  hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
  hiddenTextarea = null;
  return result;
}

//
var script = {
  name: 'ElInput',
  componentName: 'ElInput',
  mixins: [emitter, Migrating],
  inheritAttrs: false,
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data: function data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false
    };
  },
  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator: function validator(val) {
        process.env.NODE_ENV !== 'production' && console.warn('[Element Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
        return true;
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },
  computed: {
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    validateState: function validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    needStatusIcon: function needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },
    validateIcon: function validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState];
    },
    textareaStyle: function textareaStyle() {
      return merge({}, this.textareaCalcStyle, {
        resize: this.resize
      });
    },
    inputSize: function inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled: function inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    nativeInputValue: function nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value);
    },
    showClear: function showClear() {
      return this.clearable && !this.inputDisabled && !this.readonly && this.nativeInputValue && (this.focused || this.hovering);
    },
    showPwdVisible: function showPwdVisible() {
      return this.showPassword && !this.inputDisabled && !this.readonly && (!!this.nativeInputValue || this.focused);
    },
    isWordLimitVisible: function isWordLimitVisible() {
      return this.showWordLimit && this.$attrs.maxlength && (this.type === 'text' || this.type === 'textarea') && !this.inputDisabled && !this.readonly && !this.showPassword;
    },
    upperLimit: function upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength: function textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }
      return (this.value || '').length;
    },
    inputExceed: function inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    }
  },
  watch: {
    value: function value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue: function nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type: function type() {
      var _this = this;
      this.$nextTick(function () {
        _this.setNativeInputValue();
        _this.resizeTextarea();
        _this.updateIconOffset();
      });
    }
  },
  methods: {
    focus: function focus() {
      this.getInput().focus();
    },
    blur: function blur() {
      this.getInput().blur();
    },
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          'click': 'click is removed.'
        }
      };
    },
    handleBlur: function handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
      }
    },
    select: function select() {
      this.getInput().select();
    },
    resizeTextarea: function resizeTextarea() {
      if (this.$isServer) return;
      var autosize = this.autosize,
        type = this.type;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      var minRows = autosize.minRows;
      var maxRows = autosize.maxRows;
      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    setNativeInputValue: function setNativeInputValue() {
      var input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus: function handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleCompositionStart: function handleCompositionStart(event) {
      this.$emit('compositionstart', event);
      this.isComposing = true;
    },
    handleCompositionUpdate: function handleCompositionUpdate(event) {
      this.$emit('compositionupdate', event);
      var text = event.target.value;
      var lastCharacter = text[text.length - 1] || '';
      this.isComposing = !isKorean(lastCharacter);
    },
    handleCompositionEnd: function handleCompositionEnd(event) {
      this.$emit('compositionend', event);
      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(event);
      }
    },
    handleInput: function handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return;

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return;
      this.$emit('input', event.target.value);

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange: function handleChange(event) {
      this.$emit('change', event.target.value);
    },
    calcIconOffset: function calcIconOffset(place) {
      var elList = [].slice.call(this.$el.querySelectorAll(".el-input__".concat(place)) || []);
      if (!elList.length) return;
      var el = null;
      for (var i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      var pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      };
      var pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        el.style.transform = "translateX(".concat(place === 'suffix' ? '-' : '').concat(this.$el.querySelector(".el-input-group__".concat(pendant)).offsetWidth, "px)");
      } else {
        el.removeAttribute('style');
      }
    },
    updateIconOffset: function updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    clear: function clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
    handlePasswordVisible: function handlePasswordVisible() {
      var _this2 = this;
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(function () {
        _this2.focus();
      });
    },
    getInput: function getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible: function getSuffixVisible() {
      return this.$slots.suffix || this.suffixIcon || this.showClear || this.showPassword || this.isWordLimitVisible || this.validateState && this.needStatusIcon;
    }
  },
  created: function created() {
    this.$on('inputSelect', this.select);
  },
  mounted: function mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },
  updated: function updated() {
    this.$nextTick(this.updateIconOffset);
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
    class: [_vm.type === "textarea" ? "el-textarea" : "el-input", _vm.inputSize ? "el-input--" + _vm.inputSize : "", {
      "is-disabled": _vm.inputDisabled,
      "is-exceed": _vm.inputExceed,
      "el-input-group": _vm.$slots.prepend || _vm.$slots.append,
      "el-input-group--append": _vm.$slots.append,
      "el-input-group--prepend": _vm.$slots.prepend,
      "el-input--prefix": _vm.$slots.prefix || _vm.prefixIcon,
      "el-input--suffix": _vm.$slots.suffix || _vm.suffixIcon || _vm.clearable || _vm.showPassword
    }],
    on: {
      mouseenter: function mouseenter($event) {
        _vm.hovering = true;
      },
      mouseleave: function mouseleave($event) {
        _vm.hovering = false;
      }
    }
  }, [_vm.type !== "textarea" ? [_vm.$slots.prepend ? _c("div", {
    staticClass: "el-input-group__prepend"
  }, [_vm._t("prepend")], 2) : _vm._e(), _vm._v(" "), _vm.type !== "textarea" ? _c("input", _vm._b({
    ref: "input",
    staticClass: "el-input__inner",
    attrs: {
      tabindex: _vm.tabindex,
      type: _vm.showPassword ? _vm.passwordVisible ? "text" : "password" : _vm.type,
      disabled: _vm.inputDisabled,
      readonly: _vm.readonly,
      autocomplete: _vm.autoComplete || _vm.autocomplete,
      "aria-label": _vm.label
    },
    on: {
      compositionstart: _vm.handleCompositionStart,
      compositionupdate: _vm.handleCompositionUpdate,
      compositionend: _vm.handleCompositionEnd,
      input: _vm.handleInput,
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      change: _vm.handleChange
    }
  }, "input", _vm.$attrs, false)) : _vm._e(), _vm._v(" "), _vm.$slots.prefix || _vm.prefixIcon ? _c("span", {
    staticClass: "el-input__prefix"
  }, [_vm._t("prefix"), _vm._v(" "), _vm.prefixIcon ? _c("i", {
    staticClass: "el-input__icon",
    class: _vm.prefixIcon
  }) : _vm._e()], 2) : _vm._e(), _vm._v(" "), _vm.getSuffixVisible() ? _c("span", {
    staticClass: "el-input__suffix"
  }, [_c("span", {
    staticClass: "el-input__suffix-inner"
  }, [!_vm.showClear || !_vm.showPwdVisible || !_vm.isWordLimitVisible ? [_vm._t("suffix"), _vm._v(" "), _vm.suffixIcon ? _c("i", {
    staticClass: "el-input__icon",
    class: _vm.suffixIcon
  }) : _vm._e()] : _vm._e(), _vm._v(" "), _vm.showClear ? _c("i", {
    staticClass: "el-input__icon el-icon-circle-close el-input__clear",
    on: {
      mousedown: function mousedown($event) {
        $event.preventDefault();
      },
      click: _vm.clear
    }
  }) : _vm._e(), _vm._v(" "), _vm.showPwdVisible ? _c("i", {
    staticClass: "el-input__icon el-icon-view el-input__clear",
    on: {
      click: _vm.handlePasswordVisible
    }
  }) : _vm._e(), _vm._v(" "), _vm.isWordLimitVisible ? _c("span", {
    staticClass: "el-input__count"
  }, [_c("span", {
    staticClass: "el-input__count-inner"
  }, [_vm._v("\n            " + _vm._s(_vm.textLength) + "/" + _vm._s(_vm.upperLimit) + "\n          ")])]) : _vm._e()], 2), _vm._v(" "), _vm.validateState ? _c("i", {
    staticClass: "el-input__icon",
    class: ["el-input__validateIcon", _vm.validateIcon]
  }) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.$slots.append ? _c("div", {
    staticClass: "el-input-group__append"
  }, [_vm._t("append")], 2) : _vm._e()] : _c("textarea", _vm._b({
    ref: "textarea",
    staticClass: "el-textarea__inner",
    style: _vm.textareaStyle,
    attrs: {
      tabindex: _vm.tabindex,
      disabled: _vm.inputDisabled,
      readonly: _vm.readonly,
      autocomplete: _vm.autoComplete || _vm.autocomplete,
      "aria-label": _vm.label
    },
    on: {
      compositionstart: _vm.handleCompositionStart,
      compositionupdate: _vm.handleCompositionUpdate,
      compositionend: _vm.handleCompositionEnd,
      input: _vm.handleInput,
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      change: _vm.handleChange
    }
  }, "textarea", _vm.$attrs, false)), _vm._v(" "), _vm.isWordLimitVisible && _vm.type === "textarea" ? _c("span", {
    staticClass: "el-input__count"
  }, [_vm._v(_vm._s(_vm.textLength) + "/" + _vm._s(_vm.upperLimit))]) : _vm._e()], 2);
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
