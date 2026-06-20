import { M as Menu } from './shared/menu-mixin-b9a16157.js';
import Tooltip from './tooltip.js';
import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './utils/vue-popper.js';
import './shared/popper-c5560701.js';
import 'vue';
import './utils/popup/popup-manager.js';
import './utils/dom.js';
import './shared/debounce-e5482a73.js';
import './shared/throttle-54b44d30.js';
import './utils/util.js';
import './utils/types.js';

//
var script = {
  name: 'ElMenuItem',
  componentName: 'ElMenuItem',
  mixins: [Menu, emitter],
  components: {
    ElTooltip: Tooltip
  },
  props: {
    index: {
      default: null,
      validator: val => typeof val === 'string' || val === null
    },
    route: [String, Object],
    disabled: Boolean
  },
  computed: {
    active() {
      return this.index === this.rootMenu.activeIndex;
    },
    hoverBackground() {
      return this.rootMenu.hoverBackground;
    },
    backgroundColor() {
      return this.rootMenu.backgroundColor || '';
    },
    activeTextColor() {
      return this.rootMenu.activeTextColor || '';
    },
    textColor() {
      return this.rootMenu.textColor || '';
    },
    mode() {
      return this.rootMenu.mode;
    },
    itemStyle() {
      var style = {
        color: this.active ? this.activeTextColor : this.textColor
      };
      if (this.mode === 'horizontal' && !this.isNested) {
        style.borderBottomColor = this.active ? this.rootMenu.activeTextColor ? this.activeTextColor : '' : 'transparent';
      }
      return style;
    },
    isNested() {
      return this.parentMenu !== this.rootMenu;
    }
  },
  methods: {
    onMouseEnter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.hoverBackground;
    },
    onMouseLeave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.backgroundColor;
    },
    handleClick() {
      if (!this.disabled) {
        this.dispatch('ElMenu', 'item-click', this);
        this.$emit('click', this);
      }
    }
  },
  mounted() {
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeDestroy() {
    this.parentMenu.removeItem(this);
    this.rootMenu.removeItem(this);
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("li", {
    staticClass: "el-menu-item",
    class: {
      "is-active": _vm.active,
      "is-disabled": _vm.disabled
    },
    style: [_vm.paddingStyle, _vm.itemStyle, {
      backgroundColor: _vm.backgroundColor
    }],
    attrs: {
      role: "menuitem",
      tabindex: "-1"
    },
    on: {
      click: _vm.handleClick,
      mouseenter: _vm.onMouseEnter,
      focus: _vm.onMouseEnter,
      blur: _vm.onMouseLeave,
      mouseleave: _vm.onMouseLeave
    }
  }, [_vm.parentMenu.$options.componentName === "ElMenu" && _vm.rootMenu.collapse && _vm.$slots.title ? _c("el-tooltip", {
    attrs: {
      effect: "dark",
      placement: "right"
    }
  }, [_c("div", {
    attrs: {
      slot: "content"
    },
    slot: "content"
  }, [_vm._t("title")], 2), _vm._v(" "), _c("div", {
    staticStyle: {
      position: "absolute",
      left: "0",
      top: "0",
      height: "100%",
      width: "100%",
      display: "inline-block",
      "box-sizing": "border-box",
      padding: "0 20px"
    }
  }, [_vm._t("default")], 2)]) : [_vm._t("default"), _vm._v(" "), _vm._t("title")]], 2);
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
