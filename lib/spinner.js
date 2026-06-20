import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

//
//
//
//
//
//
//

var script = {
  name: 'ElSpinner',
  props: {
    type: String,
    radius: {
      type: Number,
      default: 100
    },
    strokeWidth: {
      type: Number,
      default: 5
    },
    strokeColor: {
      type: String,
      default: '#efefef'
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
  return _c("span", {
    staticClass: "el-spinner"
  }, [_c("svg", {
    staticClass: "el-spinner-inner",
    style: {
      width: _vm.radius / 2 + "px",
      height: _vm.radius / 2 + "px"
    },
    attrs: {
      viewBox: "0 0 50 50"
    }
  }, [_c("circle", {
    staticClass: "path",
    attrs: {
      cx: "25",
      cy: "25",
      r: "20",
      fill: "none",
      stroke: _vm.strokeColor,
      "stroke-width": _vm.strokeWidth
    }
  })])]);
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
