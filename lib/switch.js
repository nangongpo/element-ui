import emitter from 'element-ui/lib/mixins/emitter.js';
import Focus from 'element-ui/lib/mixins/focus.js';
import Migrating from 'element-ui/lib/mixins/migrating.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElSwitch',
  mixins: [Focus('input'), Migrating, emitter],
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String
  },
  data: function data() {
    return {
      coreWidth: this.width
    };
  },
  created: function created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue);
    }
  },
  computed: {
    checked: function checked() {
      return this.value === this.activeValue;
    },
    switchDisabled: function switchDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    checked: function checked() {
      this.$refs.input.checked = this.checked;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      }
    }
  },
  methods: {
    handleChange: function handleChange(event) {
      var _this = this;
      var val = this.checked ? this.inactiveValue : this.activeValue;
      this.$emit('input', val);
      this.$emit('change', val);
      this.$nextTick(function () {
        // set input's checked property
        // in case parent refuses to change component's value
        if (_this.$refs.input) {
          _this.$refs.input.checked = _this.checked;
        }
      });
    },
    setBackgroundColor: function setBackgroundColor() {
      var newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue: function switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'on-color': 'on-color is renamed to active-color.',
          'off-color': 'off-color is renamed to inactive-color.',
          'on-text': 'on-text is renamed to active-text.',
          'off-text': 'off-text is renamed to inactive-text.',
          'on-value': 'on-value is renamed to active-value.',
          'off-value': 'off-value is renamed to inactive-value.',
          'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
          'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
        }
      };
    }
  },
  mounted: function mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
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
    staticClass: "el-switch",
    class: {
      "is-disabled": _vm.switchDisabled,
      "is-checked": _vm.checked
    },
    attrs: {
      role: "switch",
      "aria-checked": _vm.checked,
      "aria-disabled": _vm.switchDisabled
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.switchValue($event);
      }
    }
  }, [_c("input", {
    ref: "input",
    staticClass: "el-switch__input",
    attrs: {
      type: "checkbox",
      id: _vm.id,
      name: _vm.name,
      "true-value": _vm.activeValue,
      "false-value": _vm.inactiveValue,
      disabled: _vm.switchDisabled
    },
    on: {
      change: _vm.handleChange,
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.switchValue($event);
      }
    }
  }), _vm._v(" "), _vm.inactiveIconClass || _vm.inactiveText ? _c("span", {
    class: ["el-switch__label", "el-switch__label--left", !_vm.checked ? "is-active" : ""]
  }, [_vm.inactiveIconClass ? _c("i", {
    class: [_vm.inactiveIconClass]
  }) : _vm._e(), _vm._v(" "), !_vm.inactiveIconClass && _vm.inactiveText ? _c("span", {
    attrs: {
      "aria-hidden": _vm.checked
    }
  }, [_vm._v(_vm._s(_vm.inactiveText))]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("span", {
    ref: "core",
    staticClass: "el-switch__core",
    style: {
      width: _vm.coreWidth + "px"
    }
  }), _vm._v(" "), _vm.activeIconClass || _vm.activeText ? _c("span", {
    class: ["el-switch__label", "el-switch__label--right", _vm.checked ? "is-active" : ""]
  }, [_vm.activeIconClass ? _c("i", {
    class: [_vm.activeIconClass]
  }) : _vm._e(), _vm._v(" "), !_vm.activeIconClass && _vm.activeText ? _c("span", {
    attrs: {
      "aria-hidden": !_vm.checked
    }
  }, [_vm._v(_vm._s(_vm.activeText))]) : _vm._e()]) : _vm._e()]);
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
