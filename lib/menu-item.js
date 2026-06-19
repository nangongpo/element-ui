import ElTooltip from 'element-ui/lib/tooltip';
import Emitter from 'element-ui/lib/mixins/emitter';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var Menu = {
  inject: ['rootMenu'],
  computed: {
    indexPath: function indexPath() {
      var path = [this.index];
      var parent = this.$parent;
      while (parent.$options.componentName !== 'ElMenu') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    parentMenu: function parentMenu() {
      var parent = this.$parent;
      while (parent && ['ElMenu', 'ElSubmenu'].indexOf(parent.$options.componentName) === -1) {
        parent = parent.$parent;
      }
      return parent;
    },
    paddingStyle: function paddingStyle() {
      if (this.rootMenu.mode !== 'vertical') return {};
      var padding = 20;
      var parent = this.$parent;
      if (this.rootMenu.collapse) {
        padding = 20;
      } else {
        while (parent && parent.$options.componentName !== 'ElMenu') {
          if (parent.$options.componentName === 'ElSubmenu') {
            padding += 20;
          }
          parent = parent.$parent;
        }
      }
      return {
        paddingLeft: padding + 'px'
      };
    }
  }
};

//
var script = {
  name: 'ElMenuItem',
  componentName: 'ElMenuItem',
  mixins: [Menu, Emitter],
  components: {
    ElTooltip: ElTooltip
  },
  props: {
    index: {
      default: null,
      validator: function validator(val) {
        return typeof val === 'string' || val === null;
      }
    },
    route: [String, Object],
    disabled: Boolean
  },
  computed: {
    active: function active() {
      return this.index === this.rootMenu.activeIndex;
    },
    hoverBackground: function hoverBackground() {
      return this.rootMenu.hoverBackground;
    },
    backgroundColor: function backgroundColor() {
      return this.rootMenu.backgroundColor || '';
    },
    activeTextColor: function activeTextColor() {
      return this.rootMenu.activeTextColor || '';
    },
    textColor: function textColor() {
      return this.rootMenu.textColor || '';
    },
    mode: function mode() {
      return this.rootMenu.mode;
    },
    itemStyle: function itemStyle() {
      var style = {
        color: this.active ? this.activeTextColor : this.textColor
      };
      if (this.mode === 'horizontal' && !this.isNested) {
        style.borderBottomColor = this.active ? this.rootMenu.activeTextColor ? this.activeTextColor : '' : 'transparent';
      }
      return style;
    },
    isNested: function isNested() {
      return this.parentMenu !== this.rootMenu;
    }
  },
  methods: {
    onMouseEnter: function onMouseEnter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.hoverBackground;
    },
    onMouseLeave: function onMouseLeave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.backgroundColor;
    },
    handleClick: function handleClick() {
      if (!this.disabled) {
        this.dispatch('ElMenu', 'item-click', this);
        this.$emit('click', this);
      }
    }
  },
  mounted: function mounted() {
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeDestroy: function beforeDestroy() {
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
