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

var script = {
  name: 'ElBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  data: function data() {
    return {
      separator: '',
      separatorClass: ''
    };
  },
  inject: ['elBreadcrumb'],
  mounted: function mounted() {
    var _this = this;
    this.separator = this.elBreadcrumb.separator;
    this.separatorClass = this.elBreadcrumb.separatorClass;
    var link = this.$refs.link;
    link.setAttribute('role', 'link');
    link.addEventListener('click', function (_) {
      var to = _this.to,
        $router = _this.$router;
      if (!to || !$router) return;
      _this.replace ? $router.replace(to) : $router.push(to);
    });
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("span", {
    staticClass: "el-breadcrumb__item"
  }, [_c("span", {
    ref: "link",
    class: ["el-breadcrumb__inner", _vm.to ? "is-link" : ""],
    attrs: {
      role: "link"
    }
  }, [_vm._t("default")], 2), _vm._v(" "), _vm.separatorClass ? _c("i", {
    staticClass: "el-breadcrumb__separator",
    class: _vm.separatorClass
  }) : _c("span", {
    staticClass: "el-breadcrumb__separator",
    attrs: {
      role: "presentation"
    }
  }, [_vm._v(_vm._s(_vm.separator))])]);
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
