import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Emitter from 'element-ui/lib/mixins/emitter';
import { generateId } from 'element-ui/lib/utils/util';

//
var script = {
  name: 'ElCollapseItem',
  componentName: 'ElCollapseItem',
  mixins: [Emitter],
  components: {
    ElCollapseTransition: ElCollapseTransition
  },
  data: function data() {
    return {
      contentWrapStyle: {
        height: 'auto',
        display: 'block'
      },
      contentHeight: 0,
      focusing: false,
      isClick: false,
      id: generateId()
    };
  },
  inject: ['collapse'],
  props: {
    title: String,
    name: {
      type: [String, Number],
      default: function _default() {
        return this._uid;
      }
    },
    disabled: Boolean
  },
  computed: {
    isActive: function isActive() {
      return this.collapse.activeNames.indexOf(this.name) > -1;
    }
  },
  methods: {
    handleFocus: function handleFocus() {
      var _this = this;
      setTimeout(function () {
        if (!_this.isClick) {
          _this.focusing = true;
        } else {
          _this.isClick = false;
        }
      }, 50);
    },
    handleHeaderClick: function handleHeaderClick() {
      if (this.disabled) return;
      this.dispatch('ElCollapse', 'item-click', this);
      this.focusing = false;
      this.isClick = true;
    },
    handleEnterClick: function handleEnterClick() {
      this.dispatch('ElCollapse', 'item-click', this);
    }
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
  return _c("div", {
    staticClass: "el-collapse-item",
    class: {
      "is-active": _vm.isActive,
      "is-disabled": _vm.disabled
    }
  }, [_c("div", {
    attrs: {
      role: "tab",
      "aria-expanded": _vm.isActive,
      "aria-controls": "el-collapse-content-" + _vm.id,
      "aria-describedby": "el-collapse-content-" + _vm.id
    }
  }, [_c("div", {
    staticClass: "el-collapse-item__header",
    class: {
      focusing: _vm.focusing,
      "is-active": _vm.isActive
    },
    attrs: {
      role: "button",
      id: "el-collapse-head-" + _vm.id,
      tabindex: _vm.disabled ? undefined : 0
    },
    on: {
      click: _vm.handleHeaderClick,
      keyup: function keyup($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"]) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        $event.stopPropagation();
        return _vm.handleEnterClick($event);
      },
      focus: _vm.handleFocus,
      blur: function blur($event) {
        _vm.focusing = false;
      }
    }
  }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c("i", {
    staticClass: "el-collapse-item__arrow el-icon-arrow-right",
    class: {
      "is-active": _vm.isActive
    }
  })], 2)]), _vm._v(" "), _c("el-collapse-transition", [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.isActive,
      expression: "isActive"
    }],
    staticClass: "el-collapse-item__wrap",
    attrs: {
      role: "tabpanel",
      "aria-hidden": !_vm.isActive,
      "aria-labelledby": "el-collapse-head-" + _vm.id,
      id: "el-collapse-content-" + _vm.id
    }
  }, [_c("div", {
    staticClass: "el-collapse-item__content"
  }, [_vm._t("default")], 2)])])], 1);
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
