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

var script = {
  name: 'ElStep',
  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },
  data: function data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    };
  },
  beforeCreate: function beforeCreate() {
    this.$parent.steps.push(this);
  },
  beforeDestroy: function beforeDestroy() {
    var steps = this.$parent.steps;
    var index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },
  computed: {
    currentStatus: function currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus: function prevStatus() {
      var prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isCenter: function isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical: function isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple: function isSimple() {
      return this.$parent.simple;
    },
    isLast: function isLast() {
      var parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount: function stepsCount() {
      return this.$parent.steps.length;
    },
    space: function space() {
      var isSimple = this.isSimple,
        space = this.$parent.space;
      return isSimple ? '' : space;
    },
    style: function style() {
      var style = {};
      var parent = this.$parent;
      var len = parent.steps.length;
      var space = typeof this.space === 'number' ? this.space + 'px' : this.space ? this.space : 100 / (len - (this.isCenter ? 0 : 1)) + '%';
      style.flexBasis = space;
      if (this.isVertical) return style;
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + '%';
      } else {
        style.marginRight = -this.$parent.stepOffset + 'px';
      }
      return style;
    }
  },
  methods: {
    updateStatus: function updateStatus(val) {
      var prevChild = this.$parent.$children[this.index - 1];
      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }
      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },
    calcProgress: function calcProgress(status) {
      var step = 100;
      var style = {};
      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = -150 * this.index + 'ms';
      }
      style.borderWidth = step && !this.isSimple ? '1px' : 0;
      this.$parent.direction === 'vertical' ? style.height = step + '%' : style.width = step + '%';
      this.lineStyle = style;
    }
  },
  mounted: function mounted() {
    var _this = this;
    var unwatch = this.$watch('index', function (val) {
      _this.$watch('$parent.active', _this.updateStatus, {
        immediate: true
      });
      _this.$watch('$parent.processStatus', function () {
        var activeIndex = _this.$parent.active;
        _this.updateStatus(activeIndex);
      }, {
        immediate: true
      });
      unwatch();
    });
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
    staticClass: "el-step",
    class: [!_vm.isSimple && "is-" + _vm.$parent.direction, _vm.isSimple && "is-simple", _vm.isLast && !_vm.space && !_vm.isCenter && "is-flex", _vm.isCenter && !_vm.isVertical && !_vm.isSimple && "is-center"],
    style: _vm.style
  }, [_c("div", {
    staticClass: "el-step__head",
    class: "is-" + _vm.currentStatus
  }, [_c("div", {
    staticClass: "el-step__line",
    style: _vm.isLast ? "" : {
      marginRight: _vm.$parent.stepOffset + "px"
    }
  }, [_c("i", {
    staticClass: "el-step__line-inner",
    style: _vm.lineStyle
  })]), _vm._v(" "), _c("div", {
    staticClass: "el-step__icon",
    class: "is-" + (_vm.icon ? "icon" : "text")
  }, [_vm.currentStatus !== "success" && _vm.currentStatus !== "error" ? _vm._t("icon", [_vm.icon ? _c("i", {
    staticClass: "el-step__icon-inner",
    class: [_vm.icon]
  }) : _vm._e(), _vm._v(" "), !_vm.icon && !_vm.isSimple ? _c("div", {
    staticClass: "el-step__icon-inner"
  }, [_vm._v(_vm._s(_vm.index + 1))]) : _vm._e()]) : _c("i", {
    staticClass: "el-step__icon-inner is-status",
    class: ["el-icon-" + (_vm.currentStatus === "success" ? "check" : "close")]
  })], 2)]), _vm._v(" "), _c("div", {
    staticClass: "el-step__main"
  }, [_c("div", {
    ref: "title",
    staticClass: "el-step__title",
    class: ["is-" + _vm.currentStatus]
  }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2), _vm._v(" "), _vm.isSimple ? _c("div", {
    staticClass: "el-step__arrow"
  }) : _c("div", {
    staticClass: "el-step__description",
    class: ["is-" + _vm.currentStatus]
  }, [_vm._t("description", [_vm._v(_vm._s(_vm.description))])], 2)])]);
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
