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

var script = {
  name: 'ElTabPane',
  componentName: 'ElTabPane',
  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },
  data() {
    return {
      index: null,
      loaded: false
    };
  },
  computed: {
    isClosable() {
      return this.closable || this.$parent.closable;
    },
    active() {
      var active = this.$parent.currentName === (this.name || this.index);
      if (active) {
        this.loaded = true;
      }
      return active;
    },
    paneName() {
      return this.name || this.index;
    }
  },
  updated() {
    this.$parent.$emit('tab-nav-update');
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return !_vm.lazy || _vm.loaded || _vm.active ? _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.active,
      expression: "active"
    }],
    staticClass: "el-tab-pane",
    attrs: {
      role: "tabpanel",
      "aria-hidden": !_vm.active,
      id: "pane-" + _vm.paneName,
      "aria-labelledby": "tab-" + _vm.paneName
    }
  }, [_vm._t("default")], 2) : _vm._e();
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
