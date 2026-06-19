import { t } from 'element-ui/lib/locale';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElPageHeader',
  props: {
    title: {
      type: String,
      default: function _default() {
        return t('el.pageHeader.title');
      }
    },
    content: String
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
    staticClass: "el-page-header"
  }, [_c("div", {
    staticClass: "el-page-header__left",
    on: {
      click: function click($event) {
        _vm.$emit("back");
      }
    }
  }, [_c("i", {
    staticClass: "el-icon-back"
  }), _vm._v(" "), _c("div", {
    staticClass: "el-page-header__title"
  }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2)]), _vm._v(" "), _c("div", {
    staticClass: "el-page-header__content"
  }, [_vm._t("content", [_vm._v(_vm._s(_vm.content))])], 2)]);
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
