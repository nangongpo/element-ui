import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

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

var script = {
  name: 'ElBadge',
  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
      }
    }
  },
  computed: {
    content() {
      if (this.isDot) return;
      var value = this.value;
      var max = this.max;
      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }
      return value;
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
    staticClass: "el-badge"
  }, [_vm._t("default"), _vm._v(" "), _c("transition", {
    attrs: {
      name: "el-zoom-in-center"
    }
  }, [_c("sup", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.hidden && (_vm.content || _vm.content === 0 || _vm.isDot),
      expression: "!hidden && (content || content === 0 || isDot)"
    }],
    staticClass: "el-badge__content",
    class: [_vm.type ? "el-badge__content--" + _vm.type : null, {
      "is-fixed": _vm.$slots.default,
      "is-dot": _vm.isDot
    }],
    domProps: {
      textContent: _vm._s(_vm.content)
    }
  })])], 2);
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

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
