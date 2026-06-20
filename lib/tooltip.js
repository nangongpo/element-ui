import Popper from './utils/vue-popper.js';
import { d as debounce } from './shared/debounce-e5482a73.js';
import { on, addClass, removeClass, off } from './utils/dom.js';
import { generateId } from './utils/util.js';
import Vue from 'vue';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './shared/throttle-54b44d30.js';
import './utils/types.js';

var Tooltip = {
  name: 'ElTooltip',
  mixins: [Popper],
  props: {
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    enterable: {
      type: Boolean,
      default: true
    },
    hideAfter: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tooltipId: `el-tooltip-${generateId()}`,
      timeoutPending: null,
      focusing: false
    };
  },
  beforeCreate() {
    if (this.$isServer) return;
    this.popperVM = new Vue({
      data: {
        node: ''
      },
      render(h) {
        return this.node;
      }
    }).$mount();
    this.debounceClose = debounce(200, () => this.handleClosePopper());
  },
  render(h) {
    if (this.popperVM) {
      this.popperVM.node = h("transition", {
        "attrs": {
          "name": this.transition
        },
        "on": {
          "afterLeave": this.doDestroy
        }
      }, [h("div", {
        "on": {
          "mouseleave": () => {
            this.setExpectedState(false);
            this.debounceClose();
          },
          "mouseenter": () => {
            this.setExpectedState(true);
          }
        },
        "ref": "popper",
        "attrs": {
          "role": "tooltip",
          "id": this.tooltipId,
          "aria-hidden": this.disabled || !this.showPopper ? 'true' : 'false'
        },
        "directives": [{
          name: "show",
          value: !this.disabled && this.showPopper
        }],
        "class": ['el-tooltip__popper', 'is-' + this.effect, this.popperClass]
      }, [this.$slots.content || this.content])]);
    }
    var firstElement = this.getFirstElement();
    if (!firstElement) return null;
    var data = firstElement.data = firstElement.data || {};
    data.staticClass = this.addTooltipClass(data.staticClass);
    return firstElement;
  },
  mounted() {
    this.referenceElm = this.$el;
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId);
      this.$el.setAttribute('tabindex', this.tabindex);
      on(this.referenceElm, 'mouseenter', this.show);
      on(this.referenceElm, 'mouseleave', this.hide);
      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus();
          return;
        }
        var instance = this.$slots.default[0].componentInstance;
        if (instance && instance.focus) {
          instance.focus();
        } else {
          this.handleFocus();
        }
      });
      on(this.referenceElm, 'blur', this.handleBlur);
      on(this.referenceElm, 'click', this.removeFocusing);
    }
    // fix issue https://github.com/ElemeFE/element/issues/14424
    if (this.value && this.popperVM) {
      this.popperVM.$nextTick(() => {
        if (this.value) {
          this.updatePopper();
        }
      });
    }
  },
  watch: {
    focusing(val) {
      if (val) {
        addClass(this.referenceElm, 'focusing');
      } else {
        removeClass(this.referenceElm, 'focusing');
      }
    }
  },
  methods: {
    show() {
      this.setExpectedState(true);
      this.handleShowPopper();
    },
    hide() {
      this.setExpectedState(false);
      this.debounceClose();
    },
    handleFocus() {
      this.focusing = true;
      this.show();
    },
    handleBlur() {
      this.focusing = false;
      this.hide();
    },
    removeFocusing() {
      this.focusing = false;
    },
    addTooltipClass(prev) {
      if (!prev) {
        return 'el-tooltip';
      } else {
        return 'el-tooltip ' + prev.replace('el-tooltip', '');
      }
    },
    handleShowPopper() {
      if (!this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);
      if (this.hideAfter > 0) {
        this.timeoutPending = setTimeout(() => {
          this.showPopper = false;
        }, this.hideAfter);
      }
    },
    handleClosePopper() {
      if (this.enterable && this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending);
      }
      this.showPopper = false;
      if (this.disabled) {
        this.doDestroy();
      }
    },
    setExpectedState(expectedState) {
      if (expectedState === false) {
        clearTimeout(this.timeoutPending);
      }
      this.expectedState = expectedState;
    },
    getFirstElement() {
      var slots = this.$slots.default;
      if (!Array.isArray(slots)) return null;
      var element = null;
      for (var index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index];
          break;
        }
      }
      return element;
    }
  },
  beforeDestroy() {
    this.popperVM && this.popperVM.$destroy();
  },
  destroyed() {
    var reference = this.referenceElm;
    if (reference.nodeType === 1) {
      off(reference, 'mouseenter', this.show);
      off(reference, 'mouseleave', this.hide);
      off(reference, 'focus', this.handleFocus);
      off(reference, 'blur', this.handleBlur);
      off(reference, 'click', this.removeFocusing);
    }
  }
};

/* istanbul ignore next */
Tooltip.install = function (Vue) {
  Vue.component(Tooltip.name, Tooltip);
};

export { Tooltip as default };
