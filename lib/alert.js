import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var TYPE_CLASSES_MAP = {
  'success': 'el-icon-success',
  'warning': 'el-icon-warning',
  'error': 'el-icon-error'
};
var script = {
  name: 'ElAlert',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ''
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function validator(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    }
  },
  data: function data() {
    return {
      visible: true
    };
  },
  methods: {
    close: function close() {
      this.visible = false;
      this.$emit('close');
    }
  },
  computed: {
    typeClass: function typeClass() {
      return "el-alert--".concat(this.type);
    },
    iconClass: function iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
    },
    isBigIcon: function isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : '';
    },
    isBoldTitle: function isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : '';
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
  return _c("transition", {
    attrs: {
      name: "el-alert-fade"
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-alert",
    class: [_vm.typeClass, _vm.center ? "is-center" : "", "is-" + _vm.effect],
    attrs: {
      role: "alert"
    }
  }, [_vm.showIcon ? _c("i", {
    staticClass: "el-alert__icon",
    class: [_vm.iconClass, _vm.isBigIcon]
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-alert__content"
  }, [_vm.title || _vm.$slots.title ? _c("span", {
    staticClass: "el-alert__title",
    class: [_vm.isBoldTitle]
  }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2) : _vm._e(), _vm._v(" "), _vm.$slots.default && !_vm.description ? _c("p", {
    staticClass: "el-alert__description"
  }, [_vm._t("default")], 2) : _vm._e(), _vm._v(" "), _vm.description && !_vm.$slots.default ? _c("p", {
    staticClass: "el-alert__description"
  }, [_vm._v(_vm._s(_vm.description))]) : _vm._e(), _vm._v(" "), _c("i", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.closable,
      expression: "closable"
    }],
    staticClass: "el-alert__closebtn",
    class: {
      "is-customed": _vm.closeText !== "",
      "el-icon-close": _vm.closeText === ""
    },
    on: {
      click: function click($event) {
        _vm.close();
      }
    }
  }, [_vm._v(_vm._s(_vm.closeText))])])])]);
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
