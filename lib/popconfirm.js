import ElPopover from 'element-ui/lib/popover.js';
import ElButton from 'element-ui/lib/button.js';
import { t } from 'element-ui/lib/locale/index.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElPopconfirm',
  props: {
    title: {
      type: String
    },
    confirmButtonText: {
      type: String
    },
    cancelButtonText: {
      type: String
    },
    confirmButtonType: {
      type: String,
      default: 'primary'
    },
    cancelButtonType: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: 'el-icon-question'
    },
    iconColor: {
      type: String,
      default: '#f90'
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElPopover: ElPopover,
    ElButton: ElButton
  },
  data: function data() {
    return {
      visible: false
    };
  },
  computed: {
    displayConfirmButtonText: function displayConfirmButtonText() {
      return this.confirmButtonText || t('el.popconfirm.confirmButtonText');
    },
    displayCancelButtonText: function displayCancelButtonText() {
      return this.cancelButtonText || t('el.popconfirm.cancelButtonText');
    }
  },
  methods: {
    confirm: function confirm() {
      this.visible = false;
      this.$emit('confirm');
    },
    cancel: function cancel() {
      this.visible = false;
      this.$emit('cancel');
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
  return _c("el-popover", _vm._b({
    attrs: {
      trigger: "click"
    },
    model: {
      value: _vm.visible,
      callback: function callback($$v) {
        _vm.visible = $$v;
      },
      expression: "visible"
    }
  }, "el-popover", _vm.$attrs, false), [_c("div", {
    staticClass: "el-popconfirm"
  }, [_c("p", {
    staticClass: "el-popconfirm__main"
  }, [!_vm.hideIcon ? _c("i", {
    staticClass: "el-popconfirm__icon",
    class: _vm.icon,
    style: {
      color: _vm.iconColor
    }
  }) : _vm._e(), _vm._v("\n      " + _vm._s(_vm.title) + "\n    ")]), _vm._v(" "), _c("div", {
    staticClass: "el-popconfirm__action"
  }, [_c("el-button", {
    attrs: {
      size: "mini",
      type: _vm.cancelButtonType
    },
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("\n        " + _vm._s(_vm.displayCancelButtonText) + "\n      ")]), _vm._v(" "), _c("el-button", {
    attrs: {
      size: "mini",
      type: _vm.confirmButtonType
    },
    on: {
      click: _vm.confirm
    }
  }, [_vm._v("\n        " + _vm._s(_vm.displayConfirmButtonText) + "\n      ")])], 1)]), _vm._v(" "), _vm._t("reference", null, {
    slot: "reference"
  })], 2);
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
