import { h as helper } from './shared/helper-cd11baf0.js';
import { arrayFind } from './utils/util.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import { a as addResizeListener, r as removeResizeListener } from './shared/resize-event-51726919.js';
import 'vue';
import './utils/types.js';
import './shared/throttle-54b44d30.js';
import './shared/debounce-e5482a73.js';

//
var script$2 = {
  name: 'TabBar',
  props: {
    tabs: Array
  },
  inject: ['rootTabs'],
  computed: {
    barStyle: {
      get() {
        var style = {};
        var offset = 0;
        var tabSize = 0;
        var sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
        var sizeDir = sizeName === 'width' ? 'x' : 'y';
        var firstUpperCase = str => {
          return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
        };
        this.tabs.every((tab, index) => {
          var $el = arrayFind(this.$parent.$refs.tabs || [], t => t.id.replace('tab-', '') === tab.paneName);
          if (!$el) {
            return false;
          }
          if (!tab.active) {
            offset += $el[`client${firstUpperCase(sizeName)}`];
            return true;
          } else {
            tabSize = $el[`client${firstUpperCase(sizeName)}`];
            var tabStyles = window.getComputedStyle($el);
            if (sizeName === 'width' && this.tabs.length > 1) {
              tabSize -= parseFloat(tabStyles.paddingLeft) + parseFloat(tabStyles.paddingRight);
            }
            if (sizeName === 'width') {
              offset += parseFloat(tabStyles.paddingLeft);
            }
            return false;
          }
        });
        var transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
        style[sizeName] = tabSize + 'px';
        style.transform = transform;
        style.msTransform = transform;
        style.webkitTransform = transform;
        return style;
      }
    }
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-tabs__active-bar",
    class: "is-" + _vm.rootTabs.tabPosition,
    style: _vm.barStyle
  });
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

function noop() {}
var firstUpperCase = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
};
var script$1 = {
  name: 'TabNav',
  components: {
    TabBar: __vue_component__$2
  },
  inject: ['rootTabs'],
  props: {
    panes: Array,
    currentName: String,
    editable: Boolean,
    onTabClick: {
      type: Function,
      default: noop
    },
    onTabRemove: {
      type: Function,
      default: noop
    },
    type: String,
    stretch: Boolean
  },
  data() {
    return {
      scrollable: false,
      navOffset: 0,
      isFocus: false,
      focusable: true
    };
  },
  computed: {
    navStyle() {
      var dir = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'X' : 'Y';
      return {
        transform: `translate${dir}(-${this.navOffset}px)`
      };
    },
    sizeName() {
      return ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
    }
  },
  methods: {
    scrollPrev() {
      var containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      var currentOffset = this.navOffset;
      if (!currentOffset) return;
      var newOffset = currentOffset > containerSize ? currentOffset - containerSize : 0;
      this.navOffset = newOffset;
    },
    scrollNext() {
      var navSize = this.$refs.nav[`offset${firstUpperCase(this.sizeName)}`];
      var containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      var currentOffset = this.navOffset;
      if (navSize - currentOffset <= containerSize) return;
      var newOffset = navSize - currentOffset > containerSize * 2 ? currentOffset + containerSize : navSize - containerSize;
      this.navOffset = newOffset;
    },
    scrollToActiveTab() {
      if (!this.scrollable) return;
      var nav = this.$refs.nav;
      var activeTab = this.$el.querySelector('.is-active');
      if (!activeTab) return;
      var navScroll = this.$refs.navScroll;
      var isHorizontal = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1;
      var activeTabBounding = activeTab.getBoundingClientRect();
      var navScrollBounding = navScroll.getBoundingClientRect();
      var maxOffset = isHorizontal ? nav.offsetWidth - navScrollBounding.width : nav.offsetHeight - navScrollBounding.height;
      var currentOffset = this.navOffset;
      var newOffset = currentOffset;
      if (isHorizontal) {
        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
        }
      } else {
        if (activeTabBounding.top < navScrollBounding.top) {
          newOffset = currentOffset - (navScrollBounding.top - activeTabBounding.top);
        }
        if (activeTabBounding.bottom > navScrollBounding.bottom) {
          newOffset = currentOffset + (activeTabBounding.bottom - navScrollBounding.bottom);
        }
      }
      newOffset = Math.max(newOffset, 0);
      this.navOffset = Math.min(newOffset, maxOffset);
    },
    update() {
      if (!this.$refs.nav) return;
      var sizeName = this.sizeName;
      var navSize = this.$refs.nav[`offset${firstUpperCase(sizeName)}`];
      var containerSize = this.$refs.navScroll[`offset${firstUpperCase(sizeName)}`];
      var currentOffset = this.navOffset;
      if (containerSize < navSize) {
        var _currentOffset = this.navOffset;
        this.scrollable = this.scrollable || {};
        this.scrollable.prev = _currentOffset;
        this.scrollable.next = _currentOffset + containerSize < navSize;
        if (navSize - _currentOffset < containerSize) {
          this.navOffset = navSize - containerSize;
        }
      } else {
        this.scrollable = false;
        if (currentOffset > 0) {
          this.navOffset = 0;
        }
      }
    },
    changeTab(e) {
      var keyCode = e.keyCode;
      var nextIndex;
      var currentIndex, tabList;
      if ([37, 38, 39, 40].indexOf(keyCode) !== -1) {
        // 左右上下键更换tab
        tabList = e.currentTarget.querySelectorAll('[role=tab]');
        currentIndex = Array.prototype.indexOf.call(tabList, e.target);
      } else {
        return;
      }
      if (keyCode === 37 || keyCode === 38) {
        // left
        if (currentIndex === 0) {
          // first
          nextIndex = tabList.length - 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      } else {
        // right
        if (currentIndex < tabList.length - 1) {
          // not last
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = 0;
        }
      }
      tabList[nextIndex].focus(); // 改变焦点元素
      tabList[nextIndex].click(); // 选中下一个tab
      this.setFocus();
    },
    setFocus() {
      if (this.focusable) {
        this.isFocus = true;
      }
    },
    removeFocus() {
      this.isFocus = false;
    },
    visibilityChangeHandler() {
      var visibility = document.visibilityState;
      if (visibility === 'hidden') {
        this.focusable = false;
      } else if (visibility === 'visible') {
        setTimeout(() => {
          this.focusable = true;
        }, 50);
      }
    },
    windowBlurHandler() {
      this.focusable = false;
    },
    windowFocusHandler() {
      setTimeout(() => {
        this.focusable = true;
      }, 50);
    }
  },
  updated() {
    this.update();
  },
  render(h) {
    var type = this.type,
      panes = this.panes,
      editable = this.editable,
      stretch = this.stretch,
      onTabClick = this.onTabClick,
      onTabRemove = this.onTabRemove,
      navStyle = this.navStyle,
      scrollable = this.scrollable,
      scrollNext = this.scrollNext,
      scrollPrev = this.scrollPrev,
      changeTab = this.changeTab,
      setFocus = this.setFocus,
      removeFocus = this.removeFocus;
    var scrollBtn = scrollable ? [h("span", {
      "class": ['el-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled'],
      "on": {
        "click": scrollPrev
      }
    }, [h("i", {
      "class": "el-icon-arrow-left"
    })]), h("span", {
      "class": ['el-tabs__nav-next', scrollable.next ? '' : 'is-disabled'],
      "on": {
        "click": scrollNext
      }
    }, [h("i", {
      "class": "el-icon-arrow-right"
    })])] : null;
    var tabs = this._l(panes, (pane, index) => {
      var tabName = pane.name || pane.index || index;
      var closable = pane.isClosable || editable;
      pane.index = `${index}`;
      var btnClose = closable ? h("span", {
        "class": "el-icon-close",
        "on": {
          "click": ev => {
            onTabRemove(pane, ev);
          }
        }
      }) : null;
      var tabLabelContent = pane.$slots.label || pane.label;
      var tabindex = pane.active ? 0 : -1;
      return h("div", {
        "class": {
          'el-tabs__item': true,
          [`is-${this.rootTabs.tabPosition}`]: true,
          'is-active': pane.active,
          'is-disabled': pane.disabled,
          'is-closable': closable,
          'is-focus': this.isFocus
        },
        "attrs": {
          "id": `tab-${tabName}`,
          "aria-controls": `pane-${tabName}`,
          "role": "tab",
          "aria-selected": pane.active,
          "tabindex": tabindex
        },
        "key": `tab-${tabName}`,
        "ref": "tabs",
        "refInFor": true,
        "on": {
          "focus": () => {
            setFocus();
          },
          "blur": () => {
            removeFocus();
          },
          "click": ev => {
            removeFocus();
            onTabClick(pane, tabName, ev);
          },
          "keydown": ev => {
            if (closable && (ev.keyCode === 46 || ev.keyCode === 8)) {
              onTabRemove(pane, ev);
            }
          }
        }
      }, [tabLabelContent, btnClose]);
    });
    return h("div", {
      "class": ['el-tabs__nav-wrap', scrollable ? 'is-scrollable' : '', `is-${this.rootTabs.tabPosition}`]
    }, [scrollBtn, h("div", {
      "class": ['el-tabs__nav-scroll'],
      "ref": "navScroll"
    }, [h("div", {
      "class": ['el-tabs__nav', `is-${this.rootTabs.tabPosition}`, stretch && ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'is-stretch' : ''],
      "ref": "nav",
      "style": navStyle,
      "attrs": {
        "role": "tablist"
      },
      "on": {
        "keydown": changeTab
      }
    }, [!type ? h("tab-bar", {
      "attrs": {
        "tabs": panes
      }
    }) : null, tabs])])]);
  },
  mounted() {
    addResizeListener(this.$el, this.update);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('focus', this.windowFocusHandler);
    setTimeout(() => {
      this.scrollToActiveTab();
    }, 0);
  },
  beforeDestroy() {
    if (this.$el && this.update) removeResizeListener(this.$el, this.update);
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    window.removeEventListener('blur', this.windowBlurHandler);
    window.removeEventListener('focus', this.windowFocusHandler);
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var script = {
  name: 'ElTabs',
  components: {
    TabNav: __vue_component__$1
  },
  props: {
    type: String,
    activeName: String,
    closable: Boolean,
    addable: Boolean,
    value: {},
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean
  },
  provide() {
    return {
      rootTabs: this
    };
  },
  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    };
  },
  watch: {
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    currentName(value) {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          this.$refs.nav.$nextTick(_ => {
            this.$refs.nav.scrollToActiveTab();
          });
        });
      }
    }
  },
  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        var paneSlots = this.$slots.default.filter(vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElTabPane');
        // update indeed
        var panes = paneSlots.map(({
          componentInstance
        }) => componentInstance);
        var panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]));
        if (isForceUpdate || panesChanged) {
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit('tab-click', tab, event);
    },
    handleTabRemove(pane, ev) {
      if (pane.disabled) return;
      ev.stopPropagation();
      this.$emit('edit', pane.name, 'remove');
      this.$emit('tab-remove', pane.name);
    },
    handleTabAdd() {
      this.$emit('edit', null, 'add');
      this.$emit('tab-add');
    },
    setCurrentName(value) {
      var changeCurrentName = () => {
        this.currentName = value;
        this.$emit('input', value);
      };
      if (this.currentName !== value && this.beforeLeave) {
        var before = this.beforeLeave(value, this.currentName);
        if (before && before.then) {
          before.then(() => {
            changeCurrentName();
            this.$refs.nav && this.$refs.nav.removeFocus();
          }, () => {
            // https://github.com/ElemeFE/element/pull/14816
            // ignore promise rejection in `before-leave` hook
          });
        } else if (before !== false) {
          changeCurrentName();
        }
      } else {
        changeCurrentName();
      }
    }
  },
  render(h) {
    var type = this.type,
      handleTabClick = this.handleTabClick,
      handleTabRemove = this.handleTabRemove,
      handleTabAdd = this.handleTabAdd,
      currentName = this.currentName,
      panes = this.panes,
      editable = this.editable,
      addable = this.addable,
      tabPosition = this.tabPosition,
      stretch = this.stretch;
    var newButton = editable || addable ? h("span", {
      "class": "el-tabs__new-tab",
      "on": {
        "click": handleTabAdd,
        "keydown": ev => {
          if (ev.keyCode === 13) {
            handleTabAdd();
          }
        }
      },
      "attrs": {
        "tabindex": "0"
      }
    }, [h("i", {
      "class": "el-icon-plus"
    })]) : null;
    var navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch
      },
      ref: 'nav'
    };
    var header = h("div", {
      "class": ['el-tabs__header', `is-${tabPosition}`]
    }, [newButton, h("tab-nav", helper([{}, navData]))]);
    var panels = h("div", {
      "class": "el-tabs__content"
    }, [this.$slots.default]);
    return h("div", {
      "class": {
        'el-tabs': true,
        'el-tabs--card': type === 'card',
        [`el-tabs--${tabPosition}`]: true,
        'el-tabs--border-card': type === 'border-card'
      }
    }, [tabPosition !== 'bottom' ? [header, panels] : [panels, header]]);
  },
  created() {
    if (!this.currentName) {
      this.setCurrentName('0');
    }
    this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true));
  },
  mounted() {
    this.calcPaneInstances();
  },
  updated() {
    this.calcPaneInstances();
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
