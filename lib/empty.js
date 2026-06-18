import { t } from 'element-ui/lib/locale';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

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

var id = 0;
var script$1 = {
  name: 'ImgEmpty',
  data: function data() {
    return {
      id: ++id
    };
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("svg", {
    attrs: {
      viewBox: "0 0 79 86",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink"
    }
  }, [_c("defs", [_c("linearGradient", {
    attrs: {
      id: "linearGradient-1-" + _vm.id,
      x1: "38.8503086%",
      y1: "0%",
      x2: "61.1496914%",
      y2: "100%"
    }
  }, [_c("stop", {
    attrs: {
      "stop-color": "#FCFCFD",
      offset: "0%"
    }
  }), _vm._v(" "), _c("stop", {
    attrs: {
      "stop-color": "#EEEFF3",
      offset: "100%"
    }
  })], 1), _vm._v(" "), _c("linearGradient", {
    attrs: {
      id: "linearGradient-2-" + _vm.id,
      x1: "0%",
      y1: "9.5%",
      x2: "100%",
      y2: "90.5%"
    }
  }, [_c("stop", {
    attrs: {
      "stop-color": "#FCFCFD",
      offset: "0%"
    }
  }), _vm._v(" "), _c("stop", {
    attrs: {
      "stop-color": "#E9EBEF",
      offset: "100%"
    }
  })], 1), _vm._v(" "), _c("rect", {
    attrs: {
      id: "path-3-" + _vm.id,
      x: "0",
      y: "0",
      width: "17",
      height: "36"
    }
  })], 1), _vm._v(" "), _c("g", {
    attrs: {
      id: "Illustrations",
      stroke: "none",
      "stroke-width": "1",
      fill: "none",
      "fill-rule": "evenodd"
    }
  }, [_c("g", {
    attrs: {
      id: "B-type",
      transform: "translate(-1268.000000, -535.000000)"
    }
  }, [_c("g", {
    attrs: {
      id: "Group-2",
      transform: "translate(1268.000000, 535.000000)"
    }
  }, [_c("path", {
    attrs: {
      id: "Oval-Copy-2",
      d: "M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z",
      fill: "#F7F8FC"
    }
  }), _vm._v(" "), _c("polygon", {
    attrs: {
      id: "Rectangle-Copy-14",
      fill: "#E5E7E9",
      transform: "translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) ",
      points: "13 58 53 58 42 45 2 45"
    }
  }), _vm._v(" "), _c("g", {
    attrs: {
      id: "Group-Copy",
      transform: "translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"
    }
  }, [_c("polygon", {
    attrs: {
      id: "Rectangle-Copy-10",
      fill: "#E5E7E9",
      transform: "translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) ",
      points: "2.84078316e-14 3 18 3 23 7 5 7"
    }
  }), _vm._v(" "), _c("polygon", {
    attrs: {
      id: "Rectangle-Copy-11",
      fill: "#EDEEF2",
      points: "-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"
    }
  }), _vm._v(" "), _c("rect", {
    attrs: {
      id: "Rectangle-Copy-12",
      fill: "url(#linearGradient-1-" + _vm.id + ")",
      transform: "translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) ",
      x: "38",
      y: "7",
      width: "17",
      height: "36"
    }
  }), _vm._v(" "), _c("polygon", {
    attrs: {
      id: "Rectangle-Copy-13",
      fill: "#F8F9FB",
      transform: "translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) ",
      points: "24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"
    }
  })]), _vm._v(" "), _c("rect", {
    attrs: {
      id: "Rectangle-Copy-15",
      fill: "url(#linearGradient-2-" + _vm.id + ")",
      x: "13",
      y: "45",
      width: "40",
      height: "36"
    }
  }), _vm._v(" "), _c("g", {
    attrs: {
      id: "Rectangle-Copy-17",
      transform: "translate(53.000000, 45.000000)"
    }
  }, [_c("mask", {
    attrs: {
      id: "mask-4-" + _vm.id,
      fill: "white"
    }
  }, [_c("use", {
    attrs: {
      "xlink:href": "#path-3-" + _vm.id
    }
  })]), _vm._v(" "), _c("use", {
    attrs: {
      id: "Mask",
      fill: "#E0E3E9",
      transform: "translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) ",
      "xlink:href": "#path-3-" + _vm.id
    }
  }), _vm._v(" "), _c("polygon", {
    attrs: {
      id: "Rectangle-Copy",
      fill: "#D5D7DE",
      mask: "url(#mask-4-" + _vm.id + ")",
      transform: "translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) ",
      points: "7 0 24 0 20 18 -1.70530257e-13 16"
    }
  })]), _vm._v(" "), _c("polygon", {
    attrs: {
      id: "Rectangle-Copy-18",
      fill: "#F8F9FB",
      transform: "translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) ",
      points: "62 45 79 45 70 58 53 58"
    }
  })])])])]);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var script = {
  name: 'ElEmpty',
  components: _defineProperty({}, __vue_component__$1.name, __vue_component__$1),
  props: {
    image: {
      type: String,
      default: ''
    },
    imageSize: Number,
    description: {
      type: String,
      default: ''
    }
  },
  computed: {
    emptyDescription: function emptyDescription() {
      return this.description || t('el.empty.description');
    },
    imageStyle: function imageStyle() {
      return {
        width: this.imageSize ? "".concat(this.imageSize, "px") : ''
      };
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
    staticClass: "el-empty"
  }, [_c("div", {
    staticClass: "el-empty__image",
    style: _vm.imageStyle
  }, [_vm.image ? _c("img", {
    attrs: {
      src: _vm.image,
      ondragstart: "return false"
    }
  }) : _vm._t("image", [_c("img-empty")])], 2), _vm._v(" "), _c("div", {
    staticClass: "el-empty__description"
  }, [_vm.$slots.description ? _vm._t("description") : _c("p", [_vm._v(_vm._s(_vm.emptyDescription))])], 2), _vm._v(" "), _vm.$slots.default ? _c("div", {
    staticClass: "el-empty__bottom"
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
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
