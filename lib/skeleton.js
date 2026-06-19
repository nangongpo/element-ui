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
  name: 'ElSkeleton',
  props: {
    animated: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 1
    },
    rows: {
      type: Number,
      default: 4
    },
    loading: {
      type: Boolean,
      default: true
    },
    throttle: {
      type: Number,
      default: 0
    }
  },
  watch: {
    loading: {
      handler: function handler(loading) {
        var _this = this;
        if (this.throttle <= 0) {
          this.uiLoading = loading;
          return;
        }
        if (loading) {
          clearTimeout(this.timeoutHandle);
          this.timeoutHandle = setTimeout(function () {
            _this.uiLoading = _this.loading;
          }, this.throttle);
        } else {
          this.uiLoading = loading;
        }
      },
      immediate: true
    }
  },
  data: function data() {
    return {
      uiLoading: this.throttle <= 0 ? this.loading : false
    };
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [_vm.uiLoading ? [_c("div", _vm._b({
    class: ["el-skeleton", _vm.animated ? "is-animated" : ""]
  }, "div", _vm.$attrs, false), [_vm._l(_vm.count, function (i) {
    return [_vm.loading ? _vm._t("template", _vm._l(_vm.rows, function (item) {
      return _c("el-skeleton-item", {
        key: i + "-" + item,
        class: {
          "el-skeleton__paragraph": item !== 1,
          "is-first": item === 1,
          "is-last": item === _vm.rows && _vm.rows > 1
        },
        attrs: {
          variant: "p"
        }
      });
    })) : _vm._e()];
  })], 2)] : [_vm._t("default", null, null, _vm.$attrs)]], 2);
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
