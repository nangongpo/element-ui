import Emitter from 'element-ui/lib/mixins/emitter';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElRadioButton',
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    label: {},
    disabled: Boolean,
    name: String
  },
  data: function data() {
    return {
      focus: false
    };
  },
  computed: {
    value: {
      get: function get() {
        return this._radioGroup.value;
      },
      set: function set(value) {
        this._radioGroup.$emit('input', value);
      }
    },
    _radioGroup: function _radioGroup() {
      var parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElRadioGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },
    activeStyle: function activeStyle() {
      return {
        backgroundColor: this._radioGroup.fill || '',
        borderColor: this._radioGroup.fill || '',
        boxShadow: this._radioGroup.fill ? "-1px 0 0 0 ".concat(this._radioGroup.fill) : '',
        color: this._radioGroup.textColor || ''
      };
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    size: function size() {
      return this._radioGroup.radioGroupSize || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    isDisabled: function isDisabled() {
      return this.disabled || this._radioGroup.disabled || (this.elForm || {}).disabled;
    },
    tabIndex: function tabIndex() {
      return this.isDisabled || this._radioGroup && this.value !== this.label ? -1 : 0;
    }
  },
  methods: {
    handleChange: function handleChange() {
      var _this = this;
      this.$nextTick(function () {
        _this.dispatch('ElRadioGroup', 'handleChange', _this.value);
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
    staticClass: "el-radio-button",
    class: [_vm.size ? "el-radio-button--" + _vm.size : "", {
      "is-active": _vm.value === _vm.label
    }, {
      "is-disabled": _vm.isDisabled
    }, {
      "is-focus": _vm.focus
    }],
    attrs: {
      role: "radio",
      "aria-checked": _vm.value === _vm.label,
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
        _vm.value = _vm.isDisabled ? _vm.value : _vm.label;
      }
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.value,
      expression: "value"
    }],
    staticClass: "el-radio-button__orig-radio",
    attrs: {
      type: "radio",
      name: _vm.name,
      disabled: _vm.isDisabled,
      tabindex: "-1",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.label,
      checked: _vm._q(_vm.value, _vm.label)
    },
    on: {
      change: [function ($event) {
        _vm.value = _vm.label;
      }, _vm.handleChange],
      focus: function focus($event) {
        _vm.focus = true;
      },
      blur: function blur($event) {
        _vm.focus = false;
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "el-radio-button__inner",
    style: _vm.value === _vm.label ? _vm.activeStyle : null,
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
