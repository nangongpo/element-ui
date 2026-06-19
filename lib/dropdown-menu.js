import Popper from 'element-ui/lib/utils/vue-popper.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElDropdownMenu',
  componentName: 'ElDropdownMenu',
  mixins: [Popper],
  props: {
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      size: this.dropdown.dropdownSize
    };
  },
  inject: ['dropdown'],
  created: function created() {
    var _this = this;
    this.$on('updatePopper', function () {
      if (_this.showPopper) _this.updatePopper();
    });
    this.$on('visible', function (val) {
      _this.showPopper = val;
    });
  },
  mounted: function mounted() {
    this.dropdown.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.dropdown.$el;
    // compatible with 2.6 new v-slot syntax
    // issue link https://github.com/ElemeFE/element/issues/14345
    this.dropdown.initDomOperation();
  },
  watch: {
    'dropdown.placement': {
      immediate: true,
      handler: function handler(val) {
        this.currentPlacement = val;
      }
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
      name: "el-zoom-in-top"
    },
    on: {
      "after-leave": _vm.doDestroy
    }
  }, [_c("ul", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showPopper,
      expression: "showPopper"
    }],
    staticClass: "el-dropdown-menu el-popper",
    class: [_vm.size && "el-dropdown-menu--" + _vm.size]
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
