import emitter from './mixins/emitter.js';
import Migrating from './mixins/migrating.js';
import Menu from './utils/menu/aria-menubar.js';
import { addClass, removeClass, hasClass } from './utils/dom.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './utils/util.js';
import 'vue';
import './utils/types.js';
import './utils/menu/aria-menuitem.js';
import './utils/aria-utils.js';
import './utils/menu/aria-submenu.js';

var script = {
  name: 'ElMenu',
  render(h) {
    var component = h("ul", {
      "attrs": {
        "role": "menubar"
      },
      "key": +this.collapse,
      "style": {
        backgroundColor: this.backgroundColor || ''
      },
      "class": {
        'el-menu--horizontal': this.mode === 'horizontal',
        'el-menu--collapse': this.collapse,
        "el-menu": true
      }
    }, [this.$slots.default]);
    if (this.collapseTransition) {
      return h("el-menu-collapse-transition", [component]);
    } else {
      return component;
    }
  },
  componentName: 'ElMenu',
  mixins: [emitter, Migrating],
  provide() {
    return {
      rootMenu: this
    };
  },
  components: {
    'el-menu-collapse-transition': {
      functional: true,
      render(createElement, context) {
        var data = {
          props: {
            mode: 'out-in'
          },
          on: {
            beforeEnter(el) {
              el.style.opacity = 0.2;
            },
            enter(el) {
              addClass(el, 'el-opacity-transition');
              el.style.opacity = 1;
            },
            afterEnter(el) {
              removeClass(el, 'el-opacity-transition');
              el.style.opacity = '';
            },
            beforeLeave(el) {
              if (!el.dataset) el.dataset = {};
              if (hasClass(el, 'el-menu--collapse')) {
                removeClass(el, 'el-menu--collapse');
                el.dataset.oldOverflow = el.style.overflow;
                el.dataset.scrollWidth = el.clientWidth;
                addClass(el, 'el-menu--collapse');
              } else {
                addClass(el, 'el-menu--collapse');
                el.dataset.oldOverflow = el.style.overflow;
                el.dataset.scrollWidth = el.clientWidth;
                removeClass(el, 'el-menu--collapse');
              }
              el.style.width = el.scrollWidth + 'px';
              el.style.overflow = 'hidden';
            },
            leave(el) {
              addClass(el, 'horizontal-collapse-transition');
              el.style.width = el.dataset.scrollWidth + 'px';
            }
          }
        };
        return createElement('transition', data, context.children);
      }
    }
  },
  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    collapse: Boolean,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeIndex: this.defaultActive,
      openedMenus: this.defaultOpeneds && !this.collapse ? this.defaultOpeneds.slice(0) : [],
      items: {},
      submenus: {}
    };
  },
  computed: {
    hoverBackground() {
      return this.backgroundColor ? this.mixColor(this.backgroundColor, 0.2) : '';
    },
    isMenuPopup() {
      return this.mode === 'horizontal' || this.mode === 'vertical' && this.collapse;
    }
  },
  watch: {
    defaultActive(value) {
      if (!this.items[value]) {
        this.activeIndex = null;
      }
      this.updateActiveIndex(value);
    },
    defaultOpeneds(value) {
      if (!this.collapse) {
        this.openedMenus = value;
      }
    },
    collapse(value) {
      if (value) this.openedMenus = [];
      this.broadcast('ElSubmenu', 'toggle-collapse', value);
    }
  },
  methods: {
    updateActiveIndex(val) {
      var item = this.items[val] || this.items[this.activeIndex] || this.items[this.defaultActive];
      if (item) {
        this.activeIndex = item.index;
        this.initOpenedMenu();
      } else {
        this.activeIndex = null;
      }
    },
    getMigratingConfig() {
      return {
        props: {
          'theme': 'theme is removed.'
        }
      };
    },
    getColorChannels(color) {
      color = color.replace('#', '');
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        color = color.split('');
        for (var i = 2; i >= 0; i--) {
          color.splice(i, 0, color[i]);
        }
        color = color.join('');
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16)
        };
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255
        };
      }
    },
    mixColor(color, percent) {
      var _this$getColorChannel = this.getColorChannels(color),
        red = _this$getColorChannel.red,
        green = _this$getColorChannel.green,
        blue = _this$getColorChannel.blue;
      if (percent > 0) {
        // shade given color
        red *= 1 - percent;
        green *= 1 - percent;
        blue *= 1 - percent;
      } else {
        // tint given color
        red += (255 - red) * percent;
        green += (255 - green) * percent;
        blue += (255 - blue) * percent;
      }
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
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
    openMenu(index, indexPath) {
      var openedMenus = this.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (this.uniqueOpened) {
        this.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1;
        });
      }
      this.openedMenus.push(index);
    },
    closeMenu(index) {
      var i = this.openedMenus.indexOf(index);
      if (i !== -1) {
        this.openedMenus.splice(i, 1);
      }
    },
    handleSubmenuClick(submenu) {
      var index = submenu.index,
        indexPath = submenu.indexPath;
      var isOpened = this.openedMenus.indexOf(index) !== -1;
      if (isOpened) {
        this.closeMenu(index);
        this.$emit('close', index, indexPath);
      } else {
        this.openMenu(index, indexPath);
        this.$emit('open', index, indexPath);
      }
    },
    handleItemClick(item) {
      var index = item.index,
        indexPath = item.indexPath;
      var oldActiveIndex = this.activeIndex;
      var hasIndex = item.index !== null;
      if (hasIndex) {
        this.activeIndex = item.index;
      }
      this.$emit('select', index, indexPath, item);
      if (this.mode === 'horizontal' || this.collapse) {
        this.openedMenus = [];
      }
      if (this.router && hasIndex) {
        this.routeToItem(item, error => {
          this.activeIndex = oldActiveIndex;
          if (error) {
            // vue-router 3.1.0+ push/replace cause NavigationDuplicated error 
            // https://github.com/ElemeFE/element/issues/17044
            if (error.name === 'NavigationDuplicated') return;
            console.error(error);
          }
        });
      }
    },
    // 初始化展开菜单
    // initialize opened menu
    initOpenedMenu() {
      var index = this.activeIndex;
      var activeItem = this.items[index];
      if (!activeItem || this.mode === 'horizontal' || this.collapse) return;
      var indexPath = activeItem.indexPath;

      // 展开该菜单项的路径上所有子菜单
      // expand all submenus of the menu item
      indexPath.forEach(index => {
        var submenu = this.submenus[index];
        submenu && this.openMenu(index, submenu.indexPath);
      });
    },
    routeToItem(item, onError) {
      var route = item.route || item.index;
      try {
        this.$router.push(route, () => {}, onError);
      } catch (e) {
        console.error(e);
      }
    },
    open(index) {
      var indexPath = this.submenus[index.toString()].indexPath;
      indexPath.forEach(i => this.openMenu(i, indexPath));
    },
    close(index) {
      this.closeMenu(index);
    }
  },
  mounted() {
    this.initOpenedMenu();
    this.$on('item-click', this.handleItemClick);
    this.$on('submenu-click', this.handleSubmenuClick);
    if (this.mode === 'horizontal') {
      new Menu(this.$el); // eslint-disable-line
    }
    this.$watch('items', this.updateActiveIndex);
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
