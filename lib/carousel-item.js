import { autoprefixer } from './utils/util.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import 'vue';
import './utils/types.js';

//
var CARD_SCALE = 0.83;
var script = {
  name: 'ElCarouselItem',
  props: {
    name: String,
    label: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      hover: false,
      translate: 0,
      scale: 1,
      active: false,
      ready: false,
      inStage: false,
      animating: false
    };
  },
  methods: {
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1;
      } else if (activeIndex === length - 1 && index === 0) {
        return length;
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1;
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2;
      }
      return index;
    },
    calcCardTranslate(index, activeIndex) {
      var parentWidth = this.$parent.$el.offsetWidth;
      if (this.inStage) {
        return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
      } else if (index < activeIndex) {
        return -(1 + CARD_SCALE) * parentWidth / 4;
      } else {
        return (3 + CARD_SCALE) * parentWidth / 4;
      }
    },
    calcTranslate(index, activeIndex, isVertical) {
      var distance = this.$parent.$el[isVertical ? 'offsetHeight' : 'offsetWidth'];
      return distance * (index - activeIndex);
    },
    translateItem(index, activeIndex, oldIndex) {
      var parentType = this.$parent.type;
      var parentDirection = this.parentDirection;
      var length = this.$parent.items.length;
      if (parentType !== 'card' && oldIndex !== undefined) {
        this.animating = index === activeIndex || index === oldIndex;
      }
      if (index !== activeIndex && length > 2 && this.$parent.loop) {
        index = this.processIndex(index, activeIndex, length);
      }
      if (parentType === 'card') {
        if (parentDirection === 'vertical') {
          console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
        }
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
        this.active = index === activeIndex;
        this.translate = this.calcCardTranslate(index, activeIndex);
        this.scale = this.active ? 1 : CARD_SCALE;
      } else {
        this.active = index === activeIndex;
        var isVertical = parentDirection === 'vertical';
        this.translate = this.calcTranslate(index, activeIndex, isVertical);
        this.scale = 1;
      }
      this.ready = true;
    },
    handleItemClick() {
      var parent = this.$parent;
      if (parent && parent.type === 'card') {
        var index = parent.items.indexOf(this);
        parent.setActiveItem(index);
      }
    }
  },
  computed: {
    parentDirection() {
      return this.$parent.direction;
    },
    itemStyle() {
      var translateType = this.parentDirection === 'vertical' ? 'translateY' : 'translateX';
      var value = `${translateType}(${this.translate}px) scale(${this.scale})`;
      var style = {
        transform: value
      };
      return autoprefixer(style);
    }
  },
  created() {
    this.$parent && this.$parent.updateItems();
  },
  destroyed() {
    this.$parent && this.$parent.updateItems();
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
      name: "show",
      rawName: "v-show",
      value: _vm.ready,
      expression: "ready"
    }],
    staticClass: "el-carousel__item",
    class: {
      "is-active": _vm.active,
      "el-carousel__item--card": _vm.$parent.type === "card",
      "is-in-stage": _vm.inStage,
      "is-hover": _vm.hover,
      "is-animating": _vm.animating
    },
    style: _vm.itemStyle,
    on: {
      click: _vm.handleItemClick
    }
  }, [_vm.$parent.type === "card" ? _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.active,
      expression: "!active"
    }],
    staticClass: "el-carousel__mask"
  }) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
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
