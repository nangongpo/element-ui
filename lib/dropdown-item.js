import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

//
var script = {
  name: 'ElDropdownItem',
  mixins: [emitter],
  props: {
    command: {},
    disabled: Boolean,
    divided: Boolean,
    icon: String
  },
  methods: {
    handleClick(e) {
      this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);
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
  return _c("li", {
    staticClass: "el-dropdown-menu__item",
    class: {
      "is-disabled": _vm.disabled,
      "el-dropdown-menu__item--divided": _vm.divided
    },
    attrs: {
      "aria-disabled": _vm.disabled,
      tabindex: _vm.disabled ? null : -1
    },
    on: {
      click: _vm.handleClick
    }
  }, [_vm.icon ? _c("i", {
    class: _vm.icon
  }) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
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
