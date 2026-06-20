import CollapseTransition from './transitions/collapse-transition.js';
import { M as Menu } from './shared/menu-mixin-b9a16157.js';
import emitter from './mixins/emitter.js';
import Popper from './utils/vue-popper.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './utils/dom.js';
import 'vue';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';

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
  mixins: [Menu, emitter, poperMixins],
  components: {
    ElCollapseTransition: CollapseTransition
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
  data() {
    return {
      popperJS: null,
      timeout: null,
      items: {},
      submenus: {},
      mouseInChild: false
    };
  },
  watch: {
    opened(val) {
      if (this.isMenuPopup) {
        this.$nextTick(_ => {
          this.updatePopper();
        });
      }
    }
  },
  computed: {
    // popper option
    appendToBody() {
      return this.popperAppendToBody === undefined ? this.isFirstLevel : this.popperAppendToBody;
    },
    menuTransitionName() {
      return this.rootMenu.collapse ? 'el-zoom-in-left' : 'el-zoom-in-top';
    },
    opened() {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1;
    },
    active() {
      var isActive = false;
      var submenus = this.submenus;
      var items = this.items;
      Object.keys(items).forEach(index => {
        if (items[index].active) {
          isActive = true;
        }
      });
      Object.keys(submenus).forEach(index => {
        if (submenus[index].active) {
          isActive = true;
        }
      });
      return isActive;
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
    isMenuPopup() {
      return this.rootMenu.isMenuPopup;
    },
    titleStyle() {
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
    isFirstLevel() {
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
    handleCollapseToggle(value) {
      if (value) {
        this.initPopper();
      } else {
        this.doDestroy();
      }
    },
    addItem(item) {
      this.$set(this.items, item.index, item);
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      this.$set(this.submenus, item.index, item);
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    handleClick() {
      var rootMenu = this.rootMenu,
        disabled = this.disabled;
      if (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal' || rootMenu.collapse && rootMenu.mode === 'vertical' || disabled) {
        return;
      }
      this.dispatch('ElMenu', 'submenu-click', this);
    },
    handleMouseenter(event, showTimeout = this.showTimeout) {
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
      this.timeout = setTimeout(() => {
        this.rootMenu.openMenu(this.index, this.indexPath);
      }, showTimeout);
      if (this.appendToBody) {
        this.$parent.$el.dispatchEvent(new MouseEvent('mouseenter'));
      }
    },
    handleMouseleave(deepDispatch = false) {
      var rootMenu = this.rootMenu;
      if (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal' || !rootMenu.collapse && rootMenu.mode === 'vertical') {
        return;
      }
      this.dispatch('ElSubmenu', 'mouse-leave-child');
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        !this.mouseInChild && this.rootMenu.closeMenu(this.index);
      }, this.hideTimeout);
      if (this.appendToBody && deepDispatch) {
        if (this.$parent.$options.name === 'ElSubmenu') {
          this.$parent.handleMouseleave(true);
        }
      }
    },
    handleTitleMouseenter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      var title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.hoverBackground);
    },
    handleTitleMouseleave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      var title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.backgroundColor || '');
    },
    updatePlacement() {
      this.currentPlacement = this.mode === 'horizontal' && this.isFirstLevel ? 'bottom-start' : 'right-start';
    },
    initPopper() {
      this.referenceElm = this.$el;
      this.popperElm = this.$refs.menu;
      this.updatePlacement();
    }
  },
  created() {
    this.$on('toggle-collapse', this.handleCollapseToggle);
    this.$on('mouse-enter-child', () => {
      this.mouseInChild = true;
      clearTimeout(this.timeout);
    });
    this.$on('mouse-leave-child', () => {
      this.mouseInChild = false;
      clearTimeout(this.timeout);
    });
  },
  mounted() {
    this.parentMenu.addSubmenu(this);
    this.rootMenu.addSubmenu(this);
    this.initPopper();
  },
  beforeDestroy() {
    this.parentMenu.removeSubmenu(this);
    this.rootMenu.removeSubmenu(this);
  },
  render(h) {
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
      "class": [`el-menu--${mode}`, popperClass],
      "on": {
        "mouseenter": $event => this.handleMouseenter($event, 100),
        "mouseleave": () => this.handleMouseleave(true),
        "focus": $event => this.handleMouseenter($event, 100)
      }
    }, [h("ul", {
      "attrs": {
        "role": "menu"
      },
      "class": ['el-menu el-menu--popup', `el-menu--popup-${currentPlacement}`],
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
        "mouseleave": () => this.handleMouseleave(false),
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
        backgroundColor
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

var __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
