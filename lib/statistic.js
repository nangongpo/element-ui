import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import { isNumber, reduce, chain, multiply, padStart } from 'lodash-es';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

var script = {
  name: 'ElStatistic',
  data() {
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
  created() {
    this.branch();
  },
  watch: {
    value: function value() {
      this.branch();
    },
    groupSeparator() {
      this.dispose();
    },
    mulriple() {
      this.dispose();
    }
  },
  methods: {
    branch() {
      var timeIndices = this.timeIndices,
        countDown = this.countDown,
        dispose = this.dispose;
      if (timeIndices) {
        countDown(this.value.valueOf() || this.value);
      } else {
        dispose();
      }
    },
    magnification(num, mulriple = 1000, groupSeparator = ',') {
      // magnification factor
      var level = String(mulriple).length;
      return num.replace(new RegExp(`(\\d)(?=(\\d{${level - 1}})+$)`, 'g'), `$1${groupSeparator}`);
    },
    dispose() {
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
      var result = `${integer}${decimal ? this.decimalSeparator + decimal : ''}`;
      this.disposeValue = result;
      return result;
    },
    diffDate(minuend, subtrahend) {
      return Math.max(minuend - subtrahend, 0);
    },
    suspend(isStop) {
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
      var keepList = (format.match(escapeRegex) || []).map(str => str.slice(1, -1));
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
      var formatText = reduce(timeUnits, (con, item) => {
        var name = item[0];
        return con.replace(new RegExp(`${name}+`, 'g'), match => {
          var sum = chain(time).divide(item[1]).floor(0).value();
          time -= multiply(sum, item[1]);
          return padStart(String(sum), String(match).length, 0);
        });
      }, format);
      var index = 0;
      return formatText.replace(escapeRegex, () => {
        var match = keepList[index];
        index += 1;
        return match;
      });
    },
    stopTime(time) {
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
    countDown(timeVlaue) {
      var REFRESH_INTERVAL = this.REFRESH_INTERVAL,
        timeTask = this.timeTask,
        diffDate = this.diffDate,
        formatTimeStr = this.formatTimeStr,
        stopTime = this.stopTime,
        suspend = this.suspend;
      if (timeTask) return;
      var than = this;
      this.timeTask = setInterval(() => {
        var diffTiem = diffDate(timeVlaue, Date.now());
        than.disposeValue = formatTimeStr(diffTiem);
        stopTime(diffTiem);
      }, REFRESH_INTERVAL);
      this.$once('hook:beforeDestroy', () => {
        suspend(true);
      });
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
