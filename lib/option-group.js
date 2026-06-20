import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

//
var script = {
  mixins: [emitter],
  name: 'ElOptionGroup',
  componentName: 'ElOptionGroup',
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: true
    };
  },
  watch: {
    disabled(val) {
      this.broadcast('ElOption', 'handleGroupDisabled', val);
    }
  },
  methods: {
    queryChange() {
      this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(option => option.visible === true);
    }
  },
  created() {
    this.$on('queryChange', this.queryChange);
  },
  mounted() {
    if (this.disabled) {
      this.broadcast('ElOption', 'handleGroupDisabled', this.disabled);
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
  return _c("ul", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-select-group__wrap"
  }, [_c("li", {
    staticClass: "el-select-group__title"
  }, [_vm._v(_vm._s(_vm.label))]), _vm._v(" "), _c("li", [_c("ul", {
    staticClass: "el-select-group"
  }, [_vm._t("default")], 2)])]);
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
