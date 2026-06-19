import ElInput from 'element-ui/lib/input';
import Focus from 'element-ui/lib/mixins/focus';
import RepeatClick from 'element-ui/lib/directives/repeat-click';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

//
var script = {
  name: 'ElInputNumber',
  mixins: [Focus('input')],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    ElInput: ElInput
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator: function validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    }
  },
  data: function data() {
    return {
      currentValue: 0,
      userInput: null
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler(value) {
        var newVal = value === undefined ? value : Number(value);
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return;
          }
          if (this.stepStrictly) {
            var stepPrecision = this.getPrecision(this.step);
            var precisionFactor = Math.pow(10, stepPrecision);
            newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor;
          }
          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision);
          }
        }
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.userInput = null;
        this.$emit('input', newVal);
      }
    }
  },
  computed: {
    minDisabled: function minDisabled() {
      return this._decrease(this.value, this.step) < this.min;
    },
    maxDisabled: function maxDisabled() {
      return this._increase(this.value, this.step) > this.max;
    },
    numPrecision: function numPrecision() {
      var value = this.value,
        step = this.step,
        getPrecision = this.getPrecision,
        precision = this.precision;
      var stepPrecision = getPrecision(step);
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn('[Element Warn][InputNumber]precision should not be less than the decimal places of step');
        }
        return precision;
      } else {
        return Math.max(getPrecision(value), stepPrecision);
      }
    },
    controlsAtRight: function controlsAtRight() {
      return this.controls && this.controlsPosition === 'right';
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    inputNumberSize: function inputNumberSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputNumberDisabled: function inputNumberDisabled() {
      return this.disabled || !!(this.elForm || {}).disabled;
    },
    displayValue: function displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      }
      var currentValue = this.currentValue;
      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          var stepPrecision = this.getPrecision(this.step);
          var precisionFactor = Math.pow(10, stepPrecision);
          currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor;
        }
        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }
      }
      return currentValue;
    }
  },
  methods: {
    toPrecision: function toPrecision(num, precision) {
      if (precision === undefined) precision = this.numPrecision;
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
    },
    getPrecision: function getPrecision(value) {
      if (value === undefined) return 0;
      var valueString = value.toString();
      var dotPosition = valueString.indexOf('.');
      var precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase: function _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;
      var precisionFactor = Math.pow(10, this.numPrecision);
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },
    _decrease: function _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;
      var precisionFactor = Math.pow(10, this.numPrecision);
      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },
    increase: function increase() {
      if (this.inputNumberDisabled || this.maxDisabled) return;
      var value = this.value || 0;
      var newVal = this._increase(value, this.step);
      this.setCurrentValue(newVal);
    },
    decrease: function decrease() {
      if (this.inputNumberDisabled || this.minDisabled) return;
      var value = this.value || 0;
      var newVal = this._decrease(value, this.step);
      this.setCurrentValue(newVal);
    },
    handleBlur: function handleBlur(event) {
      this.$emit('blur', event);
    },
    handleFocus: function handleFocus(event) {
      this.$emit('focus', event);
    },
    setCurrentValue: function setCurrentValue(newVal) {
      var oldVal = this.currentValue;
      if (typeof newVal === 'number' && this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision);
      }
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) return;
      this.userInput = null;
      this.$emit('input', newVal);
      this.$emit('change', newVal, oldVal);
      this.currentValue = newVal;
    },
    handleInput: function handleInput(value) {
      this.userInput = value;
    },
    handleInputChange: function handleInputChange(value) {
      var newVal = value === '' ? undefined : Number(value);
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal);
      }
      this.userInput = null;
    },
    select: function select() {
      this.$refs.input.select();
    }
  },
  mounted: function mounted() {
    var innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('role', 'spinbutton');
    innerInput.setAttribute('aria-valuemax', this.max);
    innerInput.setAttribute('aria-valuemin', this.min);
    innerInput.setAttribute('aria-valuenow', this.currentValue);
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
  },
  updated: function updated() {
    if (!this.$refs || !this.$refs.input) return;
    var innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('aria-valuenow', this.currentValue);
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
    class: ["el-input-number", _vm.inputNumberSize ? "el-input-number--" + _vm.inputNumberSize : "", {
      "is-disabled": _vm.inputNumberDisabled
    }, {
      "is-without-controls": !_vm.controls
    }, {
      "is-controls-right": _vm.controlsAtRight
    }],
    on: {
      dragstart: function dragstart($event) {
        $event.preventDefault();
      }
    }
  }, [_vm.controls ? _c("span", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.decrease,
      expression: "decrease"
    }],
    staticClass: "el-input-number__decrease",
    class: {
      "is-disabled": _vm.minDisabled
    },
    attrs: {
      role: "button"
    },
    on: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.decrease($event);
      }
    }
  }, [_c("i", {
    class: "el-icon-" + (_vm.controlsAtRight ? "arrow-down" : "minus")
  })]) : _vm._e(), _vm._v(" "), _vm.controls ? _c("span", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.increase,
      expression: "increase"
    }],
    staticClass: "el-input-number__increase",
    class: {
      "is-disabled": _vm.maxDisabled
    },
    attrs: {
      role: "button"
    },
    on: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.increase($event);
      }
    }
  }, [_c("i", {
    class: "el-icon-" + (_vm.controlsAtRight ? "arrow-up" : "plus")
  })]) : _vm._e(), _vm._v(" "), _c("el-input", {
    ref: "input",
    attrs: {
      value: _vm.displayValue,
      placeholder: _vm.placeholder,
      disabled: _vm.inputNumberDisabled,
      size: _vm.inputNumberSize,
      max: _vm.max,
      min: _vm.min,
      name: _vm.name,
      label: _vm.label
    },
    on: {
      blur: _vm.handleBlur,
      focus: _vm.handleFocus,
      input: _vm.handleInput,
      change: _vm.handleInputChange
    },
    nativeOn: {
      keydown: [function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }
        $event.preventDefault();
        return _vm.increase($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }
        $event.preventDefault();
        return _vm.decrease($event);
      }]
    }
  })], 1);
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
