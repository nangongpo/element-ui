import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition.js';
import Emitter from 'element-ui/lib/mixins/emitter.js';
import Popper from 'element-ui/lib/utils/vue-popper.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var menuMixin = {
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

var poperMixins = {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: false
    },
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  data: Popper.data,
  methods: Popper.methods,
  beforeDestroy: Popper.beforeDestroy,
  deactivated: Popper.deactivated
};
var script = {
  name: 'ElSubmenu',
  componentName: 'ElSubmenu',
  mixins: [menuMixin, Emitter, poperMixins],
  components: {
    ElCollapseTransition: ElCollapseTransition
  },
  props: {
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperClass: String,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    }
  },
  data: function data() {
    return {
      popperJS: null,
      timeout: null,
      items: {},
      submenus: {},
      mouseInChild: false
    };
  },
  watch: {
    opened: function opened(val) {
      var _this = this;
      if (this.isMenuPopup) {
        this.$nextTick(function (_) {
          _this.updatePopper();
        });
      }
    }
  },
  computed: {
    // popper option
    appendToBody: function appendToBody() {
      return this.popperAppendToBody === undefined ? this.isFirstLevel : this.popperAppendToBody;
    },
    menuTransitionName: function menuTransitionName() {
      return this.rootMenu.collapse ? 'el-zoom-in-left' : 'el-zoom-in-top';
    },
    opened: function opened() {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1;
    },
    active: function active() {
      var isActive = false;
      var submenus = this.submenus;
      var items = this.items;
      Object.keys(items).forEach(function (index) {
        if (items[index].active) {
          isActive = true;
        }
      });
      Object.keys(submenus).forEach(function (index) {
        if (submenus[index].active) {
          isActive = true;
        }
      });
      return isActive;
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
    isMenuPopup: function isMenuPopup() {
      return this.rootMenu.isMenuPopup;
    },
    titleStyle: function titleStyle() {
      if (this.mode !== 'horizontal') {
        return {
          color: this.textColor
        };
      }
      return {
        borderBottomColor: this.active ? this.rootMenu.activeTextColor ? this.activeTextColor : '' : 'transparent',
        color: this.active ? this.activeTextColor : this.textColor
      };
    },
    isFirstLevel: function isFirstLevel() {
      var isFirstLevel = true;
      var parent = this.$parent;
      while (parent && parent !== this.rootMenu) {
        if (['ElSubmenu', 'ElMenuItemGroup'].indexOf(parent.$options.componentName) > -1) {
          isFirstLevel = false;
          break;
        } else {
          parent = parent.$parent;
        }
      }
      return isFirstLevel;
    }
  },
  methods: {
    handleCollapseToggle: function handleCollapseToggle(value) {
      if (value) {
        this.initPopper();
      } else {
        this.doDestroy();
      }
    },
    addItem: function addItem(item) {
      this.$set(this.items, item.index, item);
    },
    removeItem: function removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu: function addSubmenu(item) {
      this.$set(this.submenus, item.index, item);
    },
    removeSubmenu: function removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    handleClick: function handleClick() {
      var rootMenu = this.rootMenu,
        disabled = this.disabled;
      if (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal' || rootMenu.collapse && rootMenu.mode === 'vertical' || disabled) {
        return;
      }
      this.dispatch('ElMenu', 'submenu-click', this);
    },
    handleMouseenter: function handleMouseenter(event) {
      var _this2 = this;
      var showTimeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.showTimeout;
      if (!('ActiveXObject' in window) && event.type === 'focus' && !event.relatedTarget) {
        return;
      }
      var rootMenu = this.rootMenu,
        disabled = this.disabled;
      if (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal' || !rootMenu.collapse && rootMenu.mode === 'vertical' || disabled) {
        return;
      }
      this.dispatch('ElSubmenu', 'mouse-enter-child');
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this2.rootMenu.openMenu(_this2.index, _this2.indexPath);
      }, showTimeout);
      if (this.appendToBody) {
        this.$parent.$el.dispatchEvent(new MouseEvent('mouseenter'));
      }
    },
    handleMouseleave: function handleMouseleave() {
      var _this3 = this;
      var deepDispatch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var rootMenu = this.rootMenu;
      if (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal' || !rootMenu.collapse && rootMenu.mode === 'vertical') {
        return;
      }
      this.dispatch('ElSubmenu', 'mouse-leave-child');
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        !_this3.mouseInChild && _this3.rootMenu.closeMenu(_this3.index);
      }, this.hideTimeout);
      if (this.appendToBody && deepDispatch) {
        if (this.$parent.$options.name === 'ElSubmenu') {
          this.$parent.handleMouseleave(true);
        }
      }
    },
    handleTitleMouseenter: function handleTitleMouseenter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      var title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.hoverBackground);
    },
    handleTitleMouseleave: function handleTitleMouseleave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      var title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.backgroundColor || '');
    },
    updatePlacement: function updatePlacement() {
      this.currentPlacement = this.mode === 'horizontal' && this.isFirstLevel ? 'bottom-start' : 'right-start';
    },
    initPopper: function initPopper() {
      this.referenceElm = this.$el;
      this.popperElm = this.$refs.menu;
      this.updatePlacement();
    }
  },
  created: function created() {
    var _this4 = this;
    this.$on('toggle-collapse', this.handleCollapseToggle);
    this.$on('mouse-enter-child', function () {
      _this4.mouseInChild = true;
      clearTimeout(_this4.timeout);
    });
    this.$on('mouse-leave-child', function () {
      _this4.mouseInChild = false;
      clearTimeout(_this4.timeout);
    });
  },
  mounted: function mounted() {
    this.parentMenu.addSubmenu(this);
    this.rootMenu.addSubmenu(this);
    this.initPopper();
  },
  beforeDestroy: function beforeDestroy() {
    this.parentMenu.removeSubmenu(this);
    this.rootMenu.removeSubmenu(this);
  },
  render: function render(h) {
    var _this5 = this;
    var active = this.active,
      opened = this.opened,
      paddingStyle = this.paddingStyle,
      titleStyle = this.titleStyle,
      backgroundColor = this.backgroundColor,
      rootMenu = this.rootMenu,
      currentPlacement = this.currentPlacement,
      menuTransitionName = this.menuTransitionName,
      mode = this.mode,
      disabled = this.disabled,
      popperClass = this.popperClass,
      $slots = this.$slots,
      isFirstLevel = this.isFirstLevel;
    var popupMenu = h("transition", {
      "attrs": {
        "name": menuTransitionName
      }
    }, [h("div", {
      "ref": "menu",
      "directives": [{
        name: "show",
        value: opened
      }],
      "class": ["el-menu--".concat(mode), popperClass],
      "on": {
        "mouseenter": function mouseenter($event) {
          return _this5.handleMouseenter($event, 100);
        },
        "mouseleave": function mouseleave() {
          return _this5.handleMouseleave(true);
        },
        "focus": function focus($event) {
          return _this5.handleMouseenter($event, 100);
        }
      }
    }, [h("ul", {
      "attrs": {
        "role": "menu"
      },
      "class": ['el-menu el-menu--popup', "el-menu--popup-".concat(currentPlacement)],
      "style": {
        backgroundColor: rootMenu.backgroundColor || ''
      }
    }, [$slots.default])])]);
    var inlineMenu = h("el-collapse-transition", [h("ul", {
      "attrs": {
        "role": "menu"
      },
      "class": "el-menu el-menu--inline",
      "directives": [{
        name: "show",
        value: opened
      }],
      "style": {
        backgroundColor: rootMenu.backgroundColor || ''
      }
    }, [$slots.default])]);
    var submenuTitleIcon = rootMenu.mode === 'horizontal' && isFirstLevel || rootMenu.mode === 'vertical' && !rootMenu.collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-right';
    return h("li", {
      "class": {
        'el-submenu': true,
        'is-active': active,
        'is-opened': opened,
        'is-disabled': disabled
      },
      "attrs": {
        "role": "menuitem",
        "aria-haspopup": "true",
        "aria-expanded": opened
      },
      "on": {
        "mouseenter": this.handleMouseenter,
        "mouseleave": function mouseleave() {
          return _this5.handleMouseleave(false);
        },
        "focus": this.handleMouseenter
      }
    }, [h("div", {
      "class": "el-submenu__title",
      "ref": "submenu-title",
      "on": {
        "click": this.handleClick,
        "mouseenter": this.handleTitleMouseenter,
        "mouseleave": this.handleTitleMouseleave
      },
      "style": [paddingStyle, titleStyle, {
        backgroundColor: backgroundColor
      }]
    }, [$slots.title, h("i", {
      "class": ['el-submenu__icon-arrow', submenuTitleIcon]
    })]), this.isMenuPopup ? popupMenu : inlineMenu]);
  }
};

/* script */
var __vue_script__ = script;

/* template */

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
