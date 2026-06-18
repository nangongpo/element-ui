import { isNumber, reduce, chain, multiply, padStart } from 'element-ui/lib/utils/lodash';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var script = {
  name: 'ElStatistic',
  data: function data() {
    return {
      disposeValue: '',
      timeTask: null,
      REFRESH_INTERVAL: 1000 / 30
    };
  },
  props: {
    decimalSeparator: {
      type: String,
      default: '.'
    },
    groupSeparator: {
      type: String,
      default: ''
    },
    precision: {
      type: Number,
      default: null
    },
    value: {
      type: [String, Number, Date],
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    title: {
      type: [String, Number],
      default: ''
    },
    timeIndices: {
      type: Boolean,
      default: false
    },
    valueStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    format: {
      type: String,
      default: 'HH:mm:ss:SSS'
    },
    rate: {
      type: Number,
      default: 1000
    }
  },
  created: function created() {
    this.branch();
  },
  watch: {
    value: function value() {
      this.branch();
    },
    groupSeparator: function groupSeparator() {
      this.dispose();
    },
    mulriple: function mulriple() {
      this.dispose();
    }
  },
  methods: {
    branch: function branch() {
      var timeIndices = this.timeIndices,
        countDown = this.countDown,
        dispose = this.dispose;
      if (timeIndices) {
        countDown(this.value.valueOf() || this.value);
      } else {
        dispose();
      }
    },
    magnification: function magnification(num) {
      var mulriple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
      var groupSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
      // magnification factor
      var level = String(mulriple).length;
      return num.replace(new RegExp("(\\d)(?=(\\d{".concat(level - 1, "})+$)"), 'g'), "$1".concat(groupSeparator));
    },
    dispose: function dispose() {
      var value = this.value,
        rate = this.rate,
        groupSeparator = this.groupSeparator;
      if (!isNumber(value)) return false;
      if (this.precision) {
        value = value.toFixed(this.precision);
      }
      var _String$split = String(value).split('.'),
        _String$split2 = _slicedToArray(_String$split, 2),
        integer = _String$split2[0],
        decimal = _String$split2[1];
      // 1000 multiplying power
      if (groupSeparator) {
        integer = this.magnification(integer, rate, groupSeparator);
      }
      var result = "".concat(integer).concat(decimal ? this.decimalSeparator + decimal : '');
      this.disposeValue = result;
      return result;
    },
    diffDate: function diffDate(minuend, subtrahend) {
      return Math.max(minuend - subtrahend, 0);
    },
    suspend: function suspend(isStop) {
      if (isStop) {
        if (this.timeTask) {
          clearInterval(this.timeTask);
          this.timeTask = null;
        }
      } else {
        this.branch();
      }
      return this.disposeValue;
    },
    formatTimeStr: function formatTimeStr(time) {
      var format = this.format;
      var escapeRegex = /\[[^\]]*]/g;
      var keepList = (format.match(escapeRegex) || []).map(function (str) {
        return str.slice(1, -1);
      });
      var timeUnits = [['Y', 1000 * 60 * 60 * 24 * 365],
      // years
      ['M', 1000 * 60 * 60 * 24 * 30],
      // months
      ['D', 1000 * 60 * 60 * 24],
      // days
      ['H', 1000 * 60 * 60],
      // hours
      ['m', 1000 * 60],
      // minutes
      ['s', 1000],
      // seconds
      ['S', 1] // million seconds
      ];
      var formatText = reduce(timeUnits, function (con, item) {
        var name = item[0];
        return con.replace(new RegExp("".concat(name, "+"), 'g'), function (match) {
          var sum = chain(time).divide(item[1]).floor(0).value();
          time -= multiply(sum, item[1]);
          return padStart(String(sum), String(match).length, 0);
        });
      }, format);
      var index = 0;
      return formatText.replace(escapeRegex, function () {
        var match = keepList[index];
        index += 1;
        return match;
      });
    },
    stopTime: function stopTime(time) {
      var result = true; // stop
      if (time) {
        this.$emit('change', time);
        result = false;
      } else {
        result = true;
        this.suspend(true);
        this.$emit('finish', true);
      }
      return result;
    },
    countDown: function countDown(timeVlaue) {
      var REFRESH_INTERVAL = this.REFRESH_INTERVAL,
        timeTask = this.timeTask,
        diffDate = this.diffDate,
        formatTimeStr = this.formatTimeStr,
        stopTime = this.stopTime,
        suspend = this.suspend;
      if (timeTask) return;
      var than = this;
      this.timeTask = setInterval(function () {
        var diffTiem = diffDate(timeVlaue, Date.now());
        than.disposeValue = formatTimeStr(diffTiem);
        stopTime(diffTiem);
      }, REFRESH_INTERVAL);
      this.$once('hook:beforeDestroy', function () {
        suspend(true);
      });
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
    staticClass: "el-statistic"
  }, [_vm.title || _vm.$slots.title ? _c("div", {
    staticClass: "head"
  }, [_vm._t("title", [_c("span", {
    staticClass: "title"
  }, [_vm._v("\n        " + _vm._s(_vm.title) + "\n      ")])])], 2) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "con"
  }, [_vm.prefix || _vm.$slots.prefix ? _c("span", {
    staticClass: "prefix"
  }, [_vm._t("prefix", [_vm._v("\n        " + _vm._s(_vm.prefix) + "\n      ")])], 2) : _vm._e(), _vm._v(" "), _c("span", {
    staticClass: "number",
    style: _vm.valueStyle
  }, [_vm._t("formatter", [_vm._v(" " + _vm._s(_vm.disposeValue))])], 2), _vm._v(" "), _vm.suffix || _vm.$slots.suffix ? _c("span", {
    staticClass: "suffix"
  }, [_vm._t("suffix", [_vm._v("\n        " + _vm._s(_vm.suffix) + "\n      ")])], 2) : _vm._e()])]);
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
