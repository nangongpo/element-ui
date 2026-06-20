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

var script = {
  name: 'ElDivider',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    },
    contentPosition: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].indexOf(val) !== -1;
      }
    }
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__(_h, _vm) {
  var _c = _vm._c;
  return _c("div", _vm._g(_vm._b({
    class: [_vm.data.staticClass, "el-divider", "el-divider--" + _vm.props.direction]
  }, "div", _vm.data.attrs, false), _vm.listeners), [_vm.slots().default && _vm.props.direction !== "vertical" ? _c("div", {
    class: ["el-divider__text", "is-" + _vm.props.contentPosition]
  }, [_vm._t("default")], 2) : _vm._e()]);
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
var __vue_is_functional_template__ = true;
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
