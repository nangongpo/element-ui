import Emitter from 'element-ui/lib/mixins/emitter.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElRadio',
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  componentName: 'ElRadio',
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },
  data: function data() {
    return {
      focus: false
    };
  },
  computed: {
    isGroup: function isGroup() {
      var parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElRadioGroup') {
          parent = parent.$parent;
        } else {
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },
    model: {
      get: function get() {
        return this.isGroup ? this._radioGroup.value : this.value;
      },
      set: function set(val) {
        if (this.isGroup) {
          this.dispatch('ElRadioGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
      }
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    radioSize: function radioSize() {
      var temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      return this.isGroup ? this._radioGroup.radioGroupSize || temRadioSize : temRadioSize;
    },
    isDisabled: function isDisabled() {
      return this.isGroup ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled : this.disabled || (this.elForm || {}).disabled;
    },
    tabIndex: function tabIndex() {
      return this.isDisabled || this.isGroup && this.model !== this.label ? -1 : 0;
    }
  },
  methods: {
    handleInputFocus: function handleInputFocus(e) {
      // 关键：当内部 input 误触 focus 时，强行把焦点转移给外层的 label
      if (this.$el && typeof this.$el.focus === 'function') {
        this.$el.focus();
      }
      this.focus = true;
    },
    handleChange: function handleChange() {
      var _this = this;
      this.$nextTick(function () {
        _this.$emit('change', _this.model);
        _this.isGroup && _this.dispatch('ElRadioGroup', 'handleChange', _this.model);
      });
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
  return _c("label", {
    staticClass: "el-radio",
    class: [_vm.border && _vm.radioSize ? "el-radio--" + _vm.radioSize : "", {
      "is-disabled": _vm.isDisabled
    }, {
      "is-focus": _vm.focus
    }, {
      "is-bordered": _vm.border
    }, {
      "is-checked": _vm.model === _vm.label
    }],
    attrs: {
      role: "radio",
      "aria-checked": _vm.model === _vm.label,
      "aria-disabled": _vm.isDisabled,
      tabindex: _vm.tabIndex
    },
    on: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
          return null;
        }
        $event.stopPropagation();
        $event.preventDefault();
        _vm.model = _vm.isDisabled ? _vm.model : _vm.label;
      }
    }
  }, [_c("span", {
    staticClass: "el-radio__input",
    class: {
      "is-disabled": _vm.isDisabled,
      "is-checked": _vm.model === _vm.label
    }
  }, [_c("span", {
    staticClass: "el-radio__inner"
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.model,
      expression: "model"
    }],
    ref: "radio",
    staticClass: "el-radio__original",
    attrs: {
      type: "radio",
      "aria-hidden": "true",
      name: _vm.name,
      disabled: _vm.isDisabled,
      tabindex: "-1",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.label,
      checked: _vm._q(_vm.model, _vm.label)
    },
    on: {
      focus: _vm.handleInputFocus,
      blur: function blur($event) {
        _vm.focus = false;
      },
      change: [function ($event) {
        _vm.model = _vm.label;
      }, _vm.handleChange]
    }
  })]), _vm._v(" "), _c("span", {
    staticClass: "el-radio__label",
    on: {
      keydown: function keydown($event) {
        $event.stopPropagation();
      }
    }
  }, [_vm._t("default"), _vm._v(" "), !_vm.$slots.default ? [_vm._v(_vm._s(_vm.label))] : _vm._e()], 2)]);
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
