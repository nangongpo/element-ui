import { t as throttle } from './shared/throttle-54b44d30.js';
import { a as addResizeListener, r as removeResizeListener } from './shared/resize-event-51726919.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './shared/debounce-e5482a73.js';

//
var script = {
  name: 'ElCarousel',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    height: String,
    trigger: {
      type: String,
      default: 'hover'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    indicatorPosition: String,
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: String,
      default: 'hover'
    },
    type: String,
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    }
  },
  data() {
    return {
      items: [],
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false
    };
  },
  computed: {
    arrowDisplay() {
      return this.arrow !== 'never' && this.direction !== 'vertical';
    },
    hasLabel() {
      return this.items.some(item => item.label.toString().length > 0);
    },
    carouselClasses() {
      var classes = ['el-carousel', 'el-carousel--' + this.direction];
      if (this.type === 'card') {
        classes.push('el-carousel--card');
      }
      return classes;
    },
    indicatorsClasses() {
      var classes = ['el-carousel__indicators', 'el-carousel__indicators--' + this.direction];
      if (this.hasLabel) {
        classes.push('el-carousel__indicators--labels');
      }
      if (this.indicatorPosition === 'outside' || this.type === 'card') {
        classes.push('el-carousel__indicators--outside');
      }
      return classes;
    }
  },
  watch: {
    items(val) {
      if (val.length > 0) this.setActiveItem(this.initialIndex);
    },
    activeIndex(val, oldVal) {
      this.resetItemPosition(oldVal);
      if (oldVal > -1) {
        this.$emit('change', val, oldVal);
      }
    },
    autoplay(val) {
      val ? this.startTimer() : this.pauseTimer();
    },
    loop() {
      this.setActiveItem(this.activeIndex);
    },
    interval() {
      this.pauseTimer();
      this.startTimer();
    }
  },
  methods: {
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },
    handleMouseLeave() {
      this.hover = false;
      this.startTimer();
    },
    itemInStage(item, index) {
      var length = this.items.length;
      if (index === length - 1 && item.inStage && this.items[0].active || item.inStage && this.items[index + 1] && this.items[index + 1].active) {
        return 'left';
      } else if (index === 0 && item.inStage && this.items[length - 1].active || item.inStage && this.items[index - 1] && this.items[index - 1].active) {
        return 'right';
      }
      return false;
    },
    handleButtonEnter(arrow) {
      if (this.direction === 'vertical') return;
      this.items.forEach((item, index) => {
        if (arrow === this.itemInStage(item, index)) {
          item.hover = true;
        }
      });
    },
    handleButtonLeave() {
      if (this.direction === 'vertical') return;
      this.items.forEach(item => {
        item.hover = false;
      });
    },
    updateItems() {
      this.items = this.$children.filter(child => child.$options.name === 'ElCarouselItem');
    },
    resetItemPosition(oldIndex) {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex, oldIndex);
      });
    },
    playSlides() {
      if (this.activeIndex < this.items.length - 1) {
        this.activeIndex++;
      } else if (this.loop) {
        this.activeIndex = 0;
      }
    },
    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.playSlides, this.interval);
    },
    resetTimer() {
      this.pauseTimer();
      this.startTimer();
    },
    setActiveItem(index) {
      if (typeof index === 'string') {
        var filteredItems = this.items.filter(item => item.name === index);
        if (filteredItems.length > 0) {
          index = this.items.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn('[Element Warn][Carousel]index must be an integer.');
        return;
      }
      var length = this.items.length;
      var oldIndex = this.activeIndex;
      if (index < 0) {
        this.activeIndex = this.loop ? length - 1 : 0;
      } else if (index >= length) {
        this.activeIndex = this.loop ? 0 : length - 1;
      } else {
        this.activeIndex = index;
      }
      if (oldIndex === this.activeIndex) {
        this.resetItemPosition(oldIndex);
      }
      this.resetTimer();
    },
    prev() {
      this.setActiveItem(this.activeIndex - 1);
    },
    next() {
      this.setActiveItem(this.activeIndex + 1);
    },
    handleIndicatorClick(index) {
      this.activeIndex = index;
    },
    handleIndicatorHover(index) {
      if (this.trigger === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    }
  },
  created() {
    this.throttledArrowClick = throttle(300, true, index => {
      this.setActiveItem(index);
    });
    this.throttledIndicatorHover = throttle(300, index => {
      this.handleIndicatorHover(index);
    });
  },
  mounted() {
    this.updateItems();
    this.$nextTick(() => {
      addResizeListener(this.$el, this.resetItemPosition);
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex;
      }
      this.startTimer();
    });
  },
  beforeDestroy() {
    if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    this.pauseTimer();
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
    class: _vm.carouselClasses,
    on: {
      mouseenter: function mouseenter($event) {
        $event.stopPropagation();
        return _vm.handleMouseEnter($event);
      },
      mouseleave: function mouseleave($event) {
        $event.stopPropagation();
        return _vm.handleMouseLeave($event);
      }
    }
  }, [_c("div", {
    staticClass: "el-carousel__container",
    style: {
      height: _vm.height
    }
  }, [_vm.arrowDisplay ? _c("transition", {
    attrs: {
      name: "carousel-arrow-left"
    }
  }, [_c("button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.arrow === "always" || _vm.hover) && (_vm.loop || _vm.activeIndex > 0),
      expression: "(arrow === 'always' || hover) && (loop || activeIndex > 0)"
    }],
    staticClass: "el-carousel__arrow el-carousel__arrow--left",
    attrs: {
      type: "button"
    },
    on: {
      mouseenter: function mouseenter($event) {
        _vm.handleButtonEnter("left");
      },
      mouseleave: _vm.handleButtonLeave,
      click: function click($event) {
        $event.stopPropagation();
        _vm.throttledArrowClick(_vm.activeIndex - 1);
      }
    }
  }, [_c("i", {
    staticClass: "el-icon-arrow-left"
  })])]) : _vm._e(), _vm._v(" "), _vm.arrowDisplay ? _c("transition", {
    attrs: {
      name: "carousel-arrow-right"
    }
  }, [_c("button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.arrow === "always" || _vm.hover) && (_vm.loop || _vm.activeIndex < _vm.items.length - 1),
      expression: "(arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)"
    }],
    staticClass: "el-carousel__arrow el-carousel__arrow--right",
    attrs: {
      type: "button"
    },
    on: {
      mouseenter: function mouseenter($event) {
        _vm.handleButtonEnter("right");
      },
      mouseleave: _vm.handleButtonLeave,
      click: function click($event) {
        $event.stopPropagation();
        _vm.throttledArrowClick(_vm.activeIndex + 1);
      }
    }
  }, [_c("i", {
    staticClass: "el-icon-arrow-right"
  })])]) : _vm._e(), _vm._v(" "), _vm._t("default")], 2), _vm._v(" "), _vm.indicatorPosition !== "none" ? _c("ul", {
    class: _vm.indicatorsClasses
  }, _vm._l(_vm.items, function (item, index) {
    return _c("li", {
      key: index,
      class: ["el-carousel__indicator", "el-carousel__indicator--" + _vm.direction, {
        "is-active": index === _vm.activeIndex
      }],
      on: {
        mouseenter: function mouseenter($event) {
          _vm.throttledIndicatorHover(index);
        },
        click: function click($event) {
          $event.stopPropagation();
          _vm.handleIndicatorClick(index);
        }
      }
    }, [_c("button", {
      staticClass: "el-carousel__button"
    }, [_vm.hasLabel ? _c("span", [_vm._v(_vm._s(item.label))]) : _vm._e()])]);
  }), 0) : _vm._e()]);
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
