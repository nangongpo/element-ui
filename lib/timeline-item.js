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

var script = {
  name: 'ElTimelineItem',
  inject: ['timeline'],
  props: {
    timestamp: String,
    hideTimestamp: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    type: String,
    color: String,
    size: {
      type: String,
      default: 'normal'
    },
    icon: String
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
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("li", {
    staticClass: "el-timeline-item"
  }, [_c("div", {
    staticClass: "el-timeline-item__tail"
  }), _vm._v(" "), !_vm.$slots.dot ? _c("div", {
    staticClass: "el-timeline-item__node",
    class: ["el-timeline-item__node--" + (_vm.size || ""), "el-timeline-item__node--" + (_vm.type || "")],
    style: {
      backgroundColor: _vm.color
    }
  }, [_vm.icon ? _c("i", {
    staticClass: "el-timeline-item__icon",
    class: _vm.icon
  }) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.$slots.dot ? _c("div", {
    staticClass: "el-timeline-item__dot"
  }, [_vm._t("dot")], 2) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-timeline-item__wrapper"
  }, [!_vm.hideTimestamp && _vm.placement === "top" ? _c("div", {
    staticClass: "el-timeline-item__timestamp is-top"
  }, [_vm._v("\n      " + _vm._s(_vm.timestamp) + "\n    ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-timeline-item__content"
  }, [_vm._t("default")], 2), _vm._v(" "), !_vm.hideTimestamp && _vm.placement === "bottom" ? _c("div", {
    staticClass: "el-timeline-item__timestamp is-bottom"
  }, [_vm._v("\n      " + _vm._s(_vm.timestamp) + "\n    ")]) : _vm._e()])]);
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
