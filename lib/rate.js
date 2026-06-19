import { hasClass } from 'element-ui/lib/utils/dom';
import { isObject } from 'element-ui/lib/utils/types';
import Migrating from 'element-ui/lib/mixins/migrating';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

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

var script = {
  name: 'ElRate',
  mixins: [Migrating],
  inject: {
    elForm: {
      default: ''
    }
  },
  data: function data() {
    return {
      pointerAtLeftHalf: true,
      currentValue: this.value,
      hoverIndex: -1
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    lowThreshold: {
      type: Number,
      default: 2
    },
    highThreshold: {
      type: Number,
      default: 4
    },
    max: {
      type: Number,
      default: 5
    },
    colors: {
      type: [Array, Object],
      default: function _default() {
        return ['#F7BA2A', '#F7BA2A', '#F7BA2A'];
      }
    },
    voidColor: {
      type: String,
      default: '#C6D1DE'
    },
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7'
    },
    iconClasses: {
      type: [Array, Object],
      default: function _default() {
        return ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on'];
      }
    },
    voidIconClass: {
      type: String,
      default: 'el-icon-star-off'
    },
    disabledVoidIconClass: {
      type: String,
      default: 'el-icon-star-on'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: '#1f2d3d'
    },
    texts: {
      type: Array,
      default: function _default() {
        return ['极差', '失望', '一般', '满意', '惊喜'];
      }
    },
    scoreTemplate: {
      type: String,
      default: '{value}'
    }
  },
  computed: {
    text: function text() {
      var result = '';
      if (this.showScore) {
        result = this.scoreTemplate.replace(/\{\s*value\s*\}/, this.rateDisabled ? this.value : this.currentValue);
      } else if (this.showText) {
        result = this.texts[Math.ceil(this.currentValue) - 1];
      }
      return result;
    },
    decimalStyle: function decimalStyle() {
      var width = '';
      if (this.rateDisabled) {
        width = "".concat(this.valueDecimal, "%");
      } else if (this.allowHalf) {
        width = '50%';
      }
      return {
        color: this.activeColor,
        width: width
      };
    },
    valueDecimal: function valueDecimal() {
      return this.value * 100 - Math.floor(this.value) * 100;
    },
    classMap: function classMap() {
      return Array.isArray(this.iconClasses) ? _defineProperty(_defineProperty(_defineProperty({}, this.lowThreshold, this.iconClasses[0]), this.highThreshold, {
        value: this.iconClasses[1],
        excluded: true
      }), this.max, this.iconClasses[2]) : this.iconClasses;
    },
    decimalIconClass: function decimalIconClass() {
      return this.getValueFromMap(this.value, this.classMap);
    },
    voidClass: function voidClass() {
      return this.rateDisabled ? this.disabledVoidIconClass : this.voidIconClass;
    },
    activeClass: function activeClass() {
      return this.getValueFromMap(this.currentValue, this.classMap);
    },
    colorMap: function colorMap() {
      return Array.isArray(this.colors) ? _defineProperty(_defineProperty(_defineProperty({}, this.lowThreshold, this.colors[0]), this.highThreshold, {
        value: this.colors[1],
        excluded: true
      }), this.max, this.colors[2]) : this.colors;
    },
    activeColor: function activeColor() {
      return this.getValueFromMap(this.currentValue, this.colorMap);
    },
    classes: function classes() {
      var result = [];
      var i = 0;
      var threshold = this.currentValue;
      if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
        threshold--;
      }
      for (; i < threshold; i++) {
        result.push(this.activeClass);
      }
      for (; i < this.max; i++) {
        result.push(this.voidClass);
      }
      return result;
    },
    rateDisabled: function rateDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
      this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
    }
  },
  methods: {
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'text-template': 'text-template is renamed to score-template.'
        }
      };
    },
    getValueFromMap: function getValueFromMap(value, map) {
      var matchedKeys = Object.keys(map).filter(function (key) {
        var val = map[key];
        var excluded = isObject(val) ? val.excluded : false;
        return excluded ? value < key : value <= key;
      }).sort(function (a, b) {
        return a - b;
      });
      var matchedValue = map[matchedKeys[0]];
      return isObject(matchedValue) ? matchedValue.value : matchedValue || '';
    },
    showDecimalIcon: function showDecimalIcon(item) {
      var showWhenDisabled = this.rateDisabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
      /* istanbul ignore next */
      var showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && item - 0.5 <= this.currentValue && item > this.currentValue;
      return showWhenDisabled || showWhenAllowHalf;
    },
    getIconStyle: function getIconStyle(item) {
      var voidColor = this.rateDisabled ? this.disabledVoidColor : this.voidColor;
      return {
        color: item <= this.currentValue ? this.activeColor : voidColor
      };
    },
    selectValue: function selectValue(value) {
      if (this.rateDisabled) {
        return;
      }
      if (this.allowHalf && this.pointerAtLeftHalf) {
        this.$emit('input', this.currentValue);
        this.$emit('change', this.currentValue);
      } else {
        this.$emit('input', value);
        this.$emit('change', value);
      }
    },
    handleKey: function handleKey(e) {
      if (this.rateDisabled) {
        return;
      }
      var currentValue = this.currentValue;
      var keyCode = e.keyCode;
      if (keyCode === 38 || keyCode === 39) {
        // left / down
        if (this.allowHalf) {
          currentValue += 0.5;
        } else {
          currentValue += 1;
        }
        e.stopPropagation();
        e.preventDefault();
      } else if (keyCode === 37 || keyCode === 40) {
        if (this.allowHalf) {
          currentValue -= 0.5;
        } else {
          currentValue -= 1;
        }
        e.stopPropagation();
        e.preventDefault();
      }
      currentValue = currentValue < 0 ? 0 : currentValue;
      currentValue = currentValue > this.max ? this.max : currentValue;
      this.$emit('input', currentValue);
      this.$emit('change', currentValue);
    },
    setCurrentValue: function setCurrentValue(value, event) {
      if (this.rateDisabled) {
        return;
      }
      /* istanbul ignore if */
      if (this.allowHalf) {
        var target = event.target;
        if (hasClass(target, 'el-rate__item')) {
          target = target.querySelector('.el-rate__icon');
        }
        if (hasClass(target, 'el-rate__decimal')) {
          target = target.parentNode;
        }
        this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
        this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
      } else {
        this.currentValue = value;
      }
      this.hoverIndex = value;
    },
    resetCurrentValue: function resetCurrentValue() {
      if (this.rateDisabled) {
        return;
      }
      if (this.allowHalf) {
        this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
      }
      this.currentValue = this.value;
      this.hoverIndex = -1;
    }
  },
  created: function created() {
    if (!this.value) {
      this.$emit('input', 0);
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
    staticClass: "el-rate",
    attrs: {
      role: "slider",
      "aria-valuenow": _vm.currentValue,
      "aria-valuetext": _vm.text,
      "aria-valuemin": "0",
      "aria-valuemax": _vm.max,
      tabindex: "0"
    },
    on: {
      keydown: _vm.handleKey
    }
  }, [_vm._l(_vm.max, function (item, key) {
    return _c("span", {
      key: key,
      staticClass: "el-rate__item",
      style: {
        cursor: _vm.rateDisabled ? "auto" : "pointer"
      },
      on: {
        mousemove: function mousemove($event) {
          _vm.setCurrentValue(item, $event);
        },
        mouseleave: _vm.resetCurrentValue,
        click: function click($event) {
          _vm.selectValue(item);
        }
      }
    }, [_c("i", {
      staticClass: "el-rate__icon",
      class: [_vm.classes[item - 1], {
        hover: _vm.hoverIndex === item
      }],
      style: _vm.getIconStyle(item)
    }, [_vm.showDecimalIcon(item) ? _c("i", {
      staticClass: "el-rate__decimal",
      class: _vm.decimalIconClass,
      style: _vm.decimalStyle
    }) : _vm._e()])]);
  }), _vm._v(" "), _vm.showText || _vm.showScore ? _c("span", {
    staticClass: "el-rate__text",
    style: {
      color: _vm.textColor
    }
  }, [_vm._v(_vm._s(_vm.text))]) : _vm._e()], 2);
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
