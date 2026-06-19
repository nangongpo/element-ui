import Vue from 'vue';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Popper from 'element-ui/lib/utils/vue-popper.js';
import Locale from 'element-ui/lib/mixins/locale.js';
import ElInput from 'element-ui/lib/input.js';
import ElButton from 'element-ui/lib/button.js';
import Clickoutside from 'element-ui/lib/utils/clickoutside.js';
import Emitter from 'element-ui/lib/mixins/emitter.js';

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
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
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var hsv2hsl = function hsv2hsl(hue, sat, val) {
  return [hue, sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) || 0, hue / 2];
};

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
var isOnePointZero = function isOnePointZero(n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
};
var isPercentage = function isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
};

// Take input from [0, n] and return it as [0, 1]
var bound01 = function bound01(value, max) {
  if (isOnePointZero(value)) value = '100%';
  var processPercent = isPercentage(value);
  value = Math.min(max, Math.max(0, parseFloat(value)));

  // Automatically convert percentage into number
  if (processPercent) {
    value = parseInt(value * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(value - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return value % max / parseFloat(max);
};
var INT_HEX_MAP = {
  10: 'A',
  11: 'B',
  12: 'C',
  13: 'D',
  14: 'E',
  15: 'F'
};
var toHex = function toHex(_ref) {
  var r = _ref.r,
    g = _ref.g,
    b = _ref.b;
  var hexOne = function hexOne(value) {
    value = Math.min(Math.round(value), 255);
    var high = Math.floor(value / 16);
    var low = value % 16;
    return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
  };
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
  return '#' + hexOne(r) + hexOne(g) + hexOne(b);
};
var HEX_INT_MAP = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15
};
var parseHexChannel = function parseHexChannel(hex) {
  if (hex.length === 2) {
    return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
  }
  return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
};
var hsl2hsv = function hsl2hsv(hue, sat, light) {
  sat = sat / 100;
  light = light / 100;
  var smin = sat;
  var lmin = Math.max(light, 0.01);
  var sv;
  var v;
  light *= 2;
  sat *= light <= 1 ? light : 2 - light;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  v = (light + sat) / 2;
  sv = light === 0 ? 2 * smin / (lmin + smin) : 2 * sat / (light + sat);
  return {
    h: hue,
    s: sv * 100,
    v: v * 100
  };
};

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
var rgb2hsv = function rgb2hsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s;
  var v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h * 360,
    s: s * 100,
    v: v * 100
  };
};

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
var hsv2rgb = function hsv2rgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};
var Color = /*#__PURE__*/function () {
  function Color(options) {
    _classCallCheck(this, Color);
    this._hue = 0;
    this._saturation = 100;
    this._value = 100;
    this._alpha = 100;
    this.enableAlpha = false;
    this.format = 'hex';
    this.value = '';
    options = options || {};
    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    this.doOnChange();
  }
  return _createClass(Color, [{
    key: "set",
    value: function set(prop, value) {
      if (arguments.length === 1 && _typeof(prop) === 'object') {
        for (var p in prop) {
          if (prop.hasOwnProperty(p)) {
            this.set(p, prop[p]);
          }
        }
        return;
      }
      this['_' + prop] = value;
      this.doOnChange();
    }
  }, {
    key: "get",
    value: function get(prop) {
      return this['_' + prop];
    }
  }, {
    key: "toRgb",
    value: function toRgb() {
      return hsv2rgb(this._hue, this._saturation, this._value);
    }
  }, {
    key: "fromString",
    value: function fromString(value) {
      var _this = this;
      if (!value) {
        this._hue = 0;
        this._saturation = 100;
        this._value = 100;
        this.doOnChange();
        return;
      }
      var fromHSV = function fromHSV(h, s, v) {
        _this._hue = Math.max(0, Math.min(360, h));
        _this._saturation = Math.max(0, Math.min(100, s));
        _this._value = Math.max(0, Math.min(100, v));
        _this.doOnChange();
      };
      if (value.indexOf('hsl') !== -1) {
        var parts = value.replace(/hsla|hsl|\(|\)/gm, '').split(/\s|,/g).filter(function (val) {
          return val !== '';
        }).map(function (val, index) {
          return index > 2 ? parseFloat(val) : parseInt(val, 10);
        });
        if (parts.length === 4) {
          this._alpha = Math.floor(parseFloat(parts[3]) * 100);
        } else if (parts.length === 3) {
          this._alpha = 100;
        }
        if (parts.length >= 3) {
          var _hsl2hsv = hsl2hsv(parts[0], parts[1], parts[2]),
            h = _hsl2hsv.h,
            s = _hsl2hsv.s,
            v = _hsl2hsv.v;
          fromHSV(h, s, v);
        }
      } else if (value.indexOf('hsv') !== -1) {
        var _parts = value.replace(/hsva|hsv|\(|\)/gm, '').split(/\s|,/g).filter(function (val) {
          return val !== '';
        }).map(function (val, index) {
          return index > 2 ? parseFloat(val) : parseInt(val, 10);
        });
        if (_parts.length === 4) {
          this._alpha = Math.floor(parseFloat(_parts[3]) * 100);
        } else if (_parts.length === 3) {
          this._alpha = 100;
        }
        if (_parts.length >= 3) {
          fromHSV(_parts[0], _parts[1], _parts[2]);
        }
      } else if (value.indexOf('rgb') !== -1) {
        var _parts2 = value.replace(/rgba|rgb|\(|\)/gm, '').split(/\s|,/g).filter(function (val) {
          return val !== '';
        }).map(function (val, index) {
          return index > 2 ? parseFloat(val) : parseInt(val, 10);
        });
        if (_parts2.length === 4) {
          this._alpha = Math.floor(parseFloat(_parts2[3]) * 100);
        } else if (_parts2.length === 3) {
          this._alpha = 100;
        }
        if (_parts2.length >= 3) {
          var _rgb2hsv = rgb2hsv(_parts2[0], _parts2[1], _parts2[2]),
            _h = _rgb2hsv.h,
            _s = _rgb2hsv.s,
            _v = _rgb2hsv.v;
          fromHSV(_h, _s, _v);
        }
      } else if (value.indexOf('#') !== -1) {
        var hex = value.replace('#', '').trim();
        if (!/^(?:[0-9a-fA-F]{3}){1,2}|[0-9a-fA-F]{8}$/.test(hex)) return;
        var r, g, b;
        if (hex.length === 3) {
          r = parseHexChannel(hex[0] + hex[0]);
          g = parseHexChannel(hex[1] + hex[1]);
          b = parseHexChannel(hex[2] + hex[2]);
        } else if (hex.length === 6 || hex.length === 8) {
          r = parseHexChannel(hex.substring(0, 2));
          g = parseHexChannel(hex.substring(2, 4));
          b = parseHexChannel(hex.substring(4, 6));
        }
        if (hex.length === 8) {
          this._alpha = Math.floor(parseHexChannel(hex.substring(6)) / 255 * 100);
        } else if (hex.length === 3 || hex.length === 6) {
          this._alpha = 100;
        }
        var _rgb2hsv2 = rgb2hsv(r, g, b),
          _h2 = _rgb2hsv2.h,
          _s2 = _rgb2hsv2.s,
          _v2 = _rgb2hsv2.v;
        fromHSV(_h2, _s2, _v2);
      }
    }
  }, {
    key: "compare",
    value: function compare(color) {
      return Math.abs(color._hue - this._hue) < 2 && Math.abs(color._saturation - this._saturation) < 1 && Math.abs(color._value - this._value) < 1 && Math.abs(color._alpha - this._alpha) < 1;
    }
  }, {
    key: "doOnChange",
    value: function doOnChange() {
      var _hue = this._hue,
        _saturation = this._saturation,
        _value = this._value,
        _alpha = this._alpha,
        format = this.format;
      if (this.enableAlpha) {
        switch (format) {
          case 'hsl':
            var hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
            this.value = "hsla(".concat(_hue, ", ").concat(Math.round(hsl[1] * 100), "%, ").concat(Math.round(hsl[2] * 100), "%, ").concat(_alpha / 100, ")");
            break;
          case 'hsv':
            this.value = "hsva(".concat(_hue, ", ").concat(Math.round(_saturation), "%, ").concat(Math.round(_value), "%, ").concat(_alpha / 100, ")");
            break;
          default:
            var _hsv2rgb = hsv2rgb(_hue, _saturation, _value),
              r = _hsv2rgb.r,
              g = _hsv2rgb.g,
              b = _hsv2rgb.b;
            this.value = "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(_alpha / 100, ")");
        }
      } else {
        switch (format) {
          case 'hsl':
            var _hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
            this.value = "hsl(".concat(_hue, ", ").concat(Math.round(_hsl[1] * 100), "%, ").concat(Math.round(_hsl[2] * 100), "%)");
            break;
          case 'hsv':
            this.value = "hsv(".concat(_hue, ", ").concat(Math.round(_saturation), "%, ").concat(Math.round(_value), "%)");
            break;
          case 'rgb':
            var _hsv2rgb2 = hsv2rgb(_hue, _saturation, _value),
              _r = _hsv2rgb2.r,
              _g = _hsv2rgb2.g,
              _b = _hsv2rgb2.b;
            this.value = "rgb(".concat(_r, ", ").concat(_g, ", ").concat(_b, ")");
            break;
          default:
            this.value = toHex(hsv2rgb(_hue, _saturation, _value));
        }
      }
    }
  }]);
}();

var isDragging = false;
function draggable (element, options) {
  if (Vue.prototype.$isServer) return;
  var moveFn = function moveFn(event) {
    if (options.drag) {
      options.drag(event);
    }
  };
  var _upFn = function upFn(event) {
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('mouseup', _upFn);
    document.onselectstart = null;
    document.ondragstart = null;
    isDragging = false;
    if (options.end) {
      options.end(event);
    }
  };
  element.addEventListener('mousedown', function (event) {
    if (isDragging) return;
    document.onselectstart = function () {
      return false;
    };
    document.ondragstart = function () {
      return false;
    };
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', _upFn);
    isDragging = true;
    if (options.start) {
      options.start(event);
    }
  });
}

//
var script$5 = {
  name: 'el-sl-panel',
  props: {
    color: {
      required: true
    }
  },
  computed: {
    colorValue: function colorValue() {
      var hue = this.color.get('hue');
      var value = this.color.get('value');
      return {
        hue: hue,
        value: value
      };
    }
  },
  watch: {
    colorValue: function colorValue() {
      this.update();
    }
  },
  methods: {
    update: function update() {
      var saturation = this.color.get('saturation');
      var value = this.color.get('value');
      var el = this.$el;
      var width = el.clientWidth,
        height = el.clientHeight;
      this.cursorLeft = saturation * width / 100;
      this.cursorTop = (100 - value) * height / 100;
      this.background = 'hsl(' + this.color.get('hue') + ', 100%, 50%)';
    },
    handleDrag: function handleDrag(event) {
      var el = this.$el;
      var rect = el.getBoundingClientRect();
      var left = event.clientX - rect.left;
      var top = event.clientY - rect.top;
      left = Math.max(0, left);
      left = Math.min(left, rect.width);
      top = Math.max(0, top);
      top = Math.min(top, rect.height);
      this.cursorLeft = left;
      this.cursorTop = top;
      this.color.set({
        saturation: left / rect.width * 100,
        value: 100 - top / rect.height * 100
      });
    }
  },
  mounted: function mounted() {
    var _this = this;
    draggable(this.$el, {
      drag: function drag(event) {
        _this.handleDrag(event);
      },
      end: function end(event) {
        _this.handleDrag(event);
      }
    });
    this.update();
  },
  data: function data() {
    return {
      cursorTop: 0,
      cursorLeft: 0,
      background: 'hsl(0, 100%, 50%)'
    };
  }
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-color-svpanel",
    style: {
      backgroundColor: _vm.background
    }
  }, [_c("div", {
    staticClass: "el-color-svpanel__white"
  }), _vm._v(" "), _c("div", {
    staticClass: "el-color-svpanel__black"
  }), _vm._v(" "), _c("div", {
    staticClass: "el-color-svpanel__cursor",
    style: {
      top: _vm.cursorTop + "px",
      left: _vm.cursorLeft + "px"
    }
  }, [_c("div")])]);
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

/* style */
var __vue_inject_styles__$5 = undefined;
/* scoped */
var __vue_scope_id__$5 = undefined;
/* module identifier */
var __vue_module_identifier__$5 = undefined;
/* functional template */
var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
var script$4 = {
  name: 'el-color-hue-slider',
  props: {
    color: {
      required: true
    },
    vertical: Boolean
  },
  data: function data() {
    return {
      thumbLeft: 0,
      thumbTop: 0
    };
  },
  computed: {
    hueValue: function hueValue() {
      var hue = this.color.get('hue');
      return hue;
    }
  },
  watch: {
    hueValue: function hueValue() {
      this.update();
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      var thumb = this.$refs.thumb;
      var target = event.target;
      if (target !== thumb) {
        this.handleDrag(event);
      }
    },
    handleDrag: function handleDrag(event) {
      var rect = this.$el.getBoundingClientRect();
      var thumb = this.$refs.thumb;
      var hue;
      if (!this.vertical) {
        var left = event.clientX - rect.left;
        left = Math.min(left, rect.width - thumb.offsetWidth / 2);
        left = Math.max(thumb.offsetWidth / 2, left);
        hue = Math.round((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 360);
      } else {
        var top = event.clientY - rect.top;
        top = Math.min(top, rect.height - thumb.offsetHeight / 2);
        top = Math.max(thumb.offsetHeight / 2, top);
        hue = Math.round((top - thumb.offsetHeight / 2) / (rect.height - thumb.offsetHeight) * 360);
      }
      this.color.set('hue', hue);
    },
    getThumbLeft: function getThumbLeft() {
      if (this.vertical) return 0;
      var el = this.$el;
      var hue = this.color.get('hue');
      if (!el) return 0;
      var thumb = this.$refs.thumb;
      return Math.round(hue * (el.offsetWidth - thumb.offsetWidth / 2) / 360);
    },
    getThumbTop: function getThumbTop() {
      if (!this.vertical) return 0;
      var el = this.$el;
      var hue = this.color.get('hue');
      if (!el) return 0;
      var thumb = this.$refs.thumb;
      return Math.round(hue * (el.offsetHeight - thumb.offsetHeight / 2) / 360);
    },
    update: function update() {
      this.thumbLeft = this.getThumbLeft();
      this.thumbTop = this.getThumbTop();
    }
  },
  mounted: function mounted() {
    var _this = this;
    var _this$$refs = this.$refs,
      bar = _this$$refs.bar,
      thumb = _this$$refs.thumb;
    var dragConfig = {
      drag: function drag(event) {
        _this.handleDrag(event);
      },
      end: function end(event) {
        _this.handleDrag(event);
      }
    };
    draggable(bar, dragConfig);
    draggable(thumb, dragConfig);
    this.update();
  }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-color-hue-slider",
    class: {
      "is-vertical": _vm.vertical
    }
  }, [_c("div", {
    ref: "bar",
    staticClass: "el-color-hue-slider__bar",
    on: {
      click: _vm.handleClick
    }
  }), _vm._v(" "), _c("div", {
    ref: "thumb",
    staticClass: "el-color-hue-slider__thumb",
    style: {
      left: _vm.thumbLeft + "px",
      top: _vm.thumbTop + "px"
    }
  })]);
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

/* style */
var __vue_inject_styles__$4 = undefined;
/* scoped */
var __vue_scope_id__$4 = undefined;
/* module identifier */
var __vue_module_identifier__$4 = undefined;
/* functional template */
var __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'el-color-alpha-slider',
  props: {
    color: {
      required: true
    },
    vertical: Boolean
  },
  watch: {
    'color._alpha': function color_alpha() {
      this.update();
    },
    'color.value': function colorValue() {
      this.update();
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      var thumb = this.$refs.thumb;
      var target = event.target;
      if (target !== thumb) {
        this.handleDrag(event);
      }
    },
    handleDrag: function handleDrag(event) {
      var rect = this.$el.getBoundingClientRect();
      var thumb = this.$refs.thumb;
      if (!this.vertical) {
        var left = event.clientX - rect.left;
        left = Math.max(thumb.offsetWidth / 2, left);
        left = Math.min(left, rect.width - thumb.offsetWidth / 2);
        this.color.set('alpha', Math.round((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 100));
      } else {
        var top = event.clientY - rect.top;
        top = Math.max(thumb.offsetHeight / 2, top);
        top = Math.min(top, rect.height - thumb.offsetHeight / 2);
        this.color.set('alpha', Math.round((top - thumb.offsetHeight / 2) / (rect.height - thumb.offsetHeight) * 100));
      }
    },
    getThumbLeft: function getThumbLeft() {
      if (this.vertical) return 0;
      var el = this.$el;
      var alpha = this.color._alpha;
      if (!el) return 0;
      var thumb = this.$refs.thumb;
      return Math.round(alpha * (el.offsetWidth - thumb.offsetWidth / 2) / 100);
    },
    getThumbTop: function getThumbTop() {
      if (!this.vertical) return 0;
      var el = this.$el;
      var alpha = this.color._alpha;
      if (!el) return 0;
      var thumb = this.$refs.thumb;
      return Math.round(alpha * (el.offsetHeight - thumb.offsetHeight / 2) / 100);
    },
    getBackground: function getBackground() {
      if (this.color && this.color.value) {
        var _this$color$toRgb = this.color.toRgb(),
          r = _this$color$toRgb.r,
          g = _this$color$toRgb.g,
          b = _this$color$toRgb.b;
        return "linear-gradient(to right, rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", 0) 0%, rgba(").concat(r, ", ").concat(g, ", ").concat(b, ", 1) 100%)");
      }
      return null;
    },
    update: function update() {
      this.thumbLeft = this.getThumbLeft();
      this.thumbTop = this.getThumbTop();
      this.background = this.getBackground();
    }
  },
  data: function data() {
    return {
      thumbLeft: 0,
      thumbTop: 0,
      background: null
    };
  },
  mounted: function mounted() {
    var _this = this;
    var _this$$refs = this.$refs,
      bar = _this$$refs.bar,
      thumb = _this$$refs.thumb;
    var dragConfig = {
      drag: function drag(event) {
        _this.handleDrag(event);
      },
      end: function end(event) {
        _this.handleDrag(event);
      }
    };
    draggable(bar, dragConfig);
    draggable(thumb, dragConfig);
    this.update();
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-color-alpha-slider",
    class: {
      "is-vertical": _vm.vertical
    }
  }, [_c("div", {
    ref: "bar",
    staticClass: "el-color-alpha-slider__bar",
    style: {
      background: _vm.background
    },
    on: {
      click: _vm.handleClick
    }
  }), _vm._v(" "), _c("div", {
    ref: "thumb",
    staticClass: "el-color-alpha-slider__thumb",
    style: {
      left: _vm.thumbLeft + "px",
      top: _vm.thumbTop + "px"
    }
  })]);
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

/* style */
var __vue_inject_styles__$3 = undefined;
/* scoped */
var __vue_scope_id__$3 = undefined;
/* module identifier */
var __vue_module_identifier__$3 = undefined;
/* functional template */
var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
var script$2 = {
  props: {
    colors: {
      type: Array,
      required: true
    },
    color: {
      required: true
    }
  },
  data: function data() {
    return {
      rgbaColors: this.parseColors(this.colors, this.color)
    };
  },
  methods: {
    handleSelect: function handleSelect(index) {
      this.color.fromString(this.colors[index]);
    },
    parseColors: function parseColors(colors, color) {
      return colors.map(function (value) {
        var c = new Color();
        c.enableAlpha = true;
        c.format = 'rgba';
        c.fromString(value);
        c.selected = c.value === color.value;
        return c;
      });
    }
  },
  watch: {
    '$parent.currentColor': function $parentCurrentColor(val) {
      var color = new Color();
      color.fromString(val);
      this.rgbaColors.forEach(function (item) {
        item.selected = color.compare(item);
      });
    },
    colors: function colors(newVal) {
      this.rgbaColors = this.parseColors(newVal, this.color);
    },
    color: function color(newVal) {
      this.rgbaColors = this.parseColors(this.colors, newVal);
    }
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-color-predefine"
  }, [_c("div", {
    staticClass: "el-color-predefine__colors"
  }, _vm._l(_vm.rgbaColors, function (item, index) {
    return _c("div", {
      key: _vm.colors[index],
      staticClass: "el-color-predefine__color-selector",
      class: {
        selected: item.selected,
        "is-alpha": item._alpha < 100
      },
      on: {
        click: function click($event) {
          _vm.handleSelect(index);
        }
      }
    }, [_c("div", {
      style: {
        "background-color": item.value
      }
    })]);
  }), 0)]);
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//
var script$1 = {
  name: 'el-color-picker-dropdown',
  mixins: [Popper, Locale],
  components: {
    SvPanel: __vue_component__$5,
    HueSlider: __vue_component__$4,
    AlphaSlider: __vue_component__$3,
    ElInput: ElInput,
    ElButton: ElButton,
    Predefine: __vue_component__$2
  },
  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array
  },
  data: function data() {
    return {
      customInput: ''
    };
  },
  computed: {
    currentColor: function currentColor() {
      var parent = this.$parent;
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value;
    }
  },
  methods: {
    confirmValue: function confirmValue() {
      this.$emit('pick');
    },
    handleConfirm: function handleConfirm() {
      this.color.fromString(this.customInput);
    }
  },
  mounted: function mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },
  watch: {
    showPopper: function showPopper(val) {
      var _this = this;
      if (val === true) {
        this.$nextTick(function () {
          var _this$$refs = _this.$refs,
            sl = _this$$refs.sl,
            hue = _this$$refs.hue,
            alpha = _this$$refs.alpha;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },
    currentColor: {
      immediate: true,
      handler: function handler(val) {
        this.customInput = val;
      }
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
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
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showPopper,
      expression: "showPopper"
    }],
    staticClass: "el-color-dropdown"
  }, [_c("div", {
    staticClass: "el-color-dropdown__main-wrapper"
  }, [_c("hue-slider", {
    ref: "hue",
    staticStyle: {
      float: "right"
    },
    attrs: {
      color: _vm.color,
      vertical: ""
    }
  }), _vm._v(" "), _c("sv-panel", {
    ref: "sl",
    attrs: {
      color: _vm.color
    }
  })], 1), _vm._v(" "), _vm.showAlpha ? _c("alpha-slider", {
    ref: "alpha",
    attrs: {
      color: _vm.color
    }
  }) : _vm._e(), _vm._v(" "), _vm.predefine ? _c("predefine", {
    attrs: {
      color: _vm.color,
      colors: _vm.predefine
    }
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-color-dropdown__btns"
  }, [_c("span", {
    staticClass: "el-color-dropdown__value"
  }, [_c("el-input", {
    attrs: {
      "validate-event": false,
      size: "mini"
    },
    on: {
      blur: _vm.handleConfirm
    },
    nativeOn: {
      keyup: function keyup($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.handleConfirm($event);
      }
    },
    model: {
      value: _vm.customInput,
      callback: function callback($$v) {
        _vm.customInput = $$v;
      },
      expression: "customInput"
    }
  })], 1), _vm._v(" "), _c("el-button", {
    staticClass: "el-color-dropdown__link-btn",
    attrs: {
      size: "mini",
      type: "text"
    },
    on: {
      click: function click($event) {
        _vm.$emit("clear");
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.colorpicker.clear")) + "\n      ")]), _vm._v(" "), _c("el-button", {
    staticClass: "el-color-dropdown__btn",
    attrs: {
      plain: "",
      size: "mini"
    },
    on: {
      click: _vm.confirmValue
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.colorpicker.confirm")) + "\n      ")])], 1)], 1)]);
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: 'ElColorPicker',
  mixins: [Emitter],
  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  directives: {
    Clickoutside: Clickoutside
  },
  computed: {
    displayedColor: function displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent';
      }
      return this.displayedRgb(this.color, this.showAlpha);
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    colorSize: function colorSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    colorDisabled: function colorDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    value: function value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler: function handler() {
        this.showPanelColor = true;
      }
    },
    displayedColor: function displayedColor(val) {
      if (!this.showPicker) return;
      var currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);
      var currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha);
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val);
      }
    }
  },
  methods: {
    handleTrigger: function handleTrigger() {
      if (this.colorDisabled) return;
      this.showPicker = !this.showPicker;
    },
    confirmValue: function confirmValue() {
      var value = this.color.value;
      this.$emit('input', value);
      this.$emit('change', value);
      this.dispatch('ElFormItem', 'el.form.change', value);
      this.showPicker = false;
    },
    clearValue: function clearValue() {
      this.$emit('input', null);
      this.$emit('change', null);
      if (this.value !== null) {
        this.dispatch('ElFormItem', 'el.form.change', null);
      }
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
    },
    hide: function hide() {
      this.showPicker = false;
      this.resetColor();
    },
    resetColor: function resetColor() {
      var _this = this;
      this.$nextTick(function (_) {
        if (_this.value) {
          _this.color.fromString(_this.value);
        } else {
          _this.showPanelColor = false;
        }
      });
    },
    displayedRgb: function displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class');
      }
      var _color$toRgb = color.toRgb(),
        r = _color$toRgb.r,
        g = _color$toRgb.g,
        b = _color$toRgb.b;
      return showAlpha ? "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(color.get('alpha') / 100, ")") : "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    }
  },
  mounted: function mounted() {
    var value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    this.popperElm = this.$refs.dropdown.$el;
  },
  data: function data() {
    var color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });
    return {
      color: color,
      showPicker: false,
      showPanelColor: false
    };
  },
  components: {
    PickerDropdown: __vue_component__$1
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
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.hide,
      expression: "hide"
    }],
    class: ["el-color-picker", _vm.colorDisabled ? "is-disabled" : "", _vm.colorSize ? "el-color-picker--" + _vm.colorSize : ""]
  }, [_vm.colorDisabled ? _c("div", {
    staticClass: "el-color-picker__mask"
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-color-picker__trigger",
    on: {
      click: _vm.handleTrigger
    }
  }, [_c("span", {
    staticClass: "el-color-picker__color",
    class: {
      "is-alpha": _vm.showAlpha
    }
  }, [_c("span", {
    staticClass: "el-color-picker__color-inner",
    style: {
      backgroundColor: _vm.displayedColor
    }
  }), _vm._v(" "), !_vm.value && !_vm.showPanelColor ? _c("span", {
    staticClass: "el-color-picker__empty el-icon-close"
  }) : _vm._e()]), _vm._v(" "), _c("span", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.value || _vm.showPanelColor,
      expression: "value || showPanelColor"
    }],
    staticClass: "el-color-picker__icon el-icon-arrow-down"
  })]), _vm._v(" "), _c("picker-dropdown", {
    ref: "dropdown",
    class: ["el-color-picker__panel", _vm.popperClass || ""],
    attrs: {
      color: _vm.color,
      "show-alpha": _vm.showAlpha,
      predefine: _vm.predefine
    },
    on: {
      pick: _vm.confirmValue,
      clear: _vm.clearValue
    },
    model: {
      value: _vm.showPicker,
      callback: function callback($$v) {
        _vm.showPicker = $$v;
      },
      expression: "showPicker"
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
