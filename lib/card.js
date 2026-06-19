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

var script = {
  name: 'ElCard',
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String
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
    staticClass: "el-card",
    class: _vm.shadow ? "is-" + _vm.shadow + "-shadow" : "is-always-shadow"
  }, [_vm.$slots.header || _vm.header ? _c("div", {
    staticClass: "el-card__header"
  }, [_vm._t("header", [_vm._v(_vm._s(_vm.header))])], 2) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-card__body",
    style: _vm.bodyStyle
  }, [_vm._t("default")], 2)]);
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
