import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

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
  name: 'ElProgress',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: val => ['line', 'circle', 'dashboard'].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    status: {
      type: String,
      validator: val => ['success', 'exception', 'warning'].indexOf(val) > -1
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeLinecap: {
      type: String,
      default: 'round'
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: [String, Array, Function],
      default: ''
    },
    defineBackColor: {
      type: [String, Array, Function],
      default: '#ebeef5'
    },
    textColor: {
      type: [String, Array, Function],
      default: '#606266'
    },
    format: Function
  },
  computed: {
    barStyle() {
      var style = {};
      style.width = this.percentage + '%';
      style.backgroundColor = this.getCurrentColor(this.percentage);
      return style;
    },
    relativeStrokeWidth() {
      return (this.strokeWidth / this.width * 100).toFixed(1);
    },
    radius() {
      if (this.type === 'circle' || this.type === 'dashboard') {
        return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
      } else {
        return 0;
      }
    },
    trackPath() {
      var radius = this.radius;
      var isDashboard = this.type === 'dashboard';
      return `
        M 50 50
        m 0 ${isDashboard ? '' : '-'}${radius}
        a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
        a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
        `;
    },
    perimeter() {
      return 2 * Math.PI * this.radius;
    },
    rate() {
      return this.type === 'dashboard' ? 0.75 : 1;
    },
    strokeDashoffset() {
      var offset = -1 * this.perimeter * (1 - this.rate) / 2;
      return `${offset}px`;
    },
    trailPathStyle() {
      return {
        strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset
      };
    },
    circlePathStyle() {
      return {
        strokeDasharray: `${this.perimeter * this.rate * (this.percentage / 100)}px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
      };
    },
    stroke() {
      var ret;
      if (this.color) {
        ret = this.getCurrentColor(this.percentage);
      } else {
        switch (this.status) {
          case 'success':
            ret = '#13ce66';
            break;
          case 'exception':
            ret = '#ff4949';
            break;
          case 'warning':
            ret = '#e6a23c';
            break;
          default:
            ret = '#20a0ff';
        }
      }
      return ret;
    },
    iconClass() {
      if (this.status === 'warning') {
        return 'el-icon-warning';
      }
      if (this.type === 'line') {
        return this.status === 'success' ? 'el-icon-circle-check' : 'el-icon-circle-close';
      } else {
        return this.status === 'success' ? 'el-icon-check' : 'el-icon-close';
      }
    },
    progressTextSize() {
      return this.type === 'line' ? 12 + this.strokeWidth * 0.4 : this.width * 0.111111 + 2;
    },
    content() {
      if (typeof this.format === 'function') {
        return this.format(this.percentage) || '';
      } else {
        return `${this.percentage}%`;
      }
    }
  },
  methods: {
    getCurrentColor(percentage) {
      if (typeof this.color === 'function') {
        return this.color(percentage);
      } else if (typeof this.color === 'string') {
        return this.color;
      } else {
        return this.getLevelColor(percentage);
      }
    },
    getLevelColor(percentage) {
      var colorArray = this.getColorArray().sort((a, b) => a.percentage - b.percentage);
      for (var i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    },
    getColorArray() {
      var color = this.color;
      var span = 100 / color.length;
      return color.map((seriesColor, index) => {
        if (typeof seriesColor === 'string') {
          return {
            color: seriesColor,
            percentage: (index + 1) * span
          };
        }
        return seriesColor;
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
    staticClass: "el-progress",
    class: ["el-progress--" + _vm.type, _vm.status ? "is-" + _vm.status : "", {
      "el-progress--without-text": !_vm.showText,
      "el-progress--text-inside": _vm.textInside
    }],
    attrs: {
      role: "progressbar",
      "aria-valuenow": _vm.percentage,
      "aria-valuemin": "0",
      "aria-valuemax": "100"
    }
  }, [_vm.type === "line" ? _c("div", {
    staticClass: "el-progress-bar"
  }, [_c("div", {
    staticClass: "el-progress-bar__outer",
    style: {
      height: _vm.strokeWidth + "px",
      backgroundColor: _vm.defineBackColor
    }
  }, [_c("div", {
    staticClass: "el-progress-bar__inner",
    style: _vm.barStyle
  }, [_vm.showText && _vm.textInside ? _c("div", {
    staticClass: "el-progress-bar__innerText",
    style: {
      color: _vm.textColor
    }
  }, [_vm._v(_vm._s(_vm.content))]) : _vm._e()])])]) : _c("div", {
    staticClass: "el-progress-circle",
    style: {
      height: _vm.width + "px",
      width: _vm.width + "px"
    }
  }, [_c("svg", {
    attrs: {
      viewBox: "0 0 100 100"
    }
  }, [_c("path", {
    staticClass: "el-progress-circle__track",
    style: _vm.trailPathStyle,
    attrs: {
      d: _vm.trackPath,
      stroke: _vm.defineBackColor,
      "stroke-width": _vm.relativeStrokeWidth,
      fill: "none"
    }
  }), _vm._v(" "), _c("path", {
    staticClass: "el-progress-circle__path",
    style: _vm.circlePathStyle,
    attrs: {
      d: _vm.trackPath,
      stroke: _vm.stroke,
      fill: "none",
      "stroke-linecap": _vm.strokeLinecap,
      "stroke-width": _vm.percentage ? _vm.relativeStrokeWidth : 0
    }
  })])]), _vm._v(" "), _vm.showText && !_vm.textInside ? _c("div", {
    staticClass: "el-progress__text",
    style: {
      fontSize: _vm.progressTextSize + "px",
      color: _vm.textColor
    }
  }, [!_vm.status ? [_vm._v(_vm._s(_vm.content))] : _c("i", {
    class: _vm.iconClass
  })], 2) : _vm._e()]);
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
