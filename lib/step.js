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
  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    };
  },
  beforeCreate() {
    this.$parent.steps.push(this);
  },
  beforeDestroy() {
    var steps = this.$parent.steps;
    var index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },
  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      var prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple() {
      return this.$parent.simple;
    },
    isLast() {
      var parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
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
    updateStatus(val) {
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
    calcProgress(status) {
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
  mounted() {
    var unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, {
        immediate: true
      });
      this.$watch('$parent.processStatus', () => {
        var activeIndex = this.$parent.active;
        this.updateStatus(activeIndex);
      }, {
        immediate: true
      });
      unwatch();
    });
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
