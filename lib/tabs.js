import { arrayFind } from 'element-ui/lib/utils/util';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

//
var script$2 = {
  name: 'TabBar',
  props: {
    tabs: Array
  },
  inject: ['rootTabs'],
  computed: {
    barStyle: {
      get: function get() {
        var _this = this;
        var style = {};
        var offset = 0;
        var tabSize = 0;
        var sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
        var sizeDir = sizeName === 'width' ? 'x' : 'y';
        var firstUpperCase = function firstUpperCase(str) {
          return str.toLowerCase().replace(/( |^)[a-z]/g, function (L) {
            return L.toUpperCase();
          });
        };
        this.tabs.every(function (tab, index) {
          var $el = arrayFind(_this.$parent.$refs.tabs || [], function (t) {
            return t.id.replace('tab-', '') === tab.paneName;
          });
          if (!$el) {
            return false;
          }
          if (!tab.active) {
            offset += $el["client".concat(firstUpperCase(sizeName))];
            return true;
          } else {
            tabSize = $el["client".concat(firstUpperCase(sizeName))];
            var tabStyles = window.getComputedStyle($el);
            if (sizeName === 'width' && _this.tabs.length > 1) {
              tabSize -= parseFloat(tabStyles.paddingLeft) + parseFloat(tabStyles.paddingRight);
            }
            if (sizeName === 'width') {
              offset += parseFloat(tabStyles.paddingLeft);
            }
            return false;
          }
        });
        var transform = "translate".concat(firstUpperCase(sizeDir), "(").concat(offset, "px)");
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

var __vue_component__$2 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

function noop() {}
var firstUpperCase = function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, function (L) {
    return L.toUpperCase();
  });
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
  data: function data() {
    return {
      scrollable: false,
      navOffset: 0,
      isFocus: false,
      focusable: true
    };
  },
  computed: {
    navStyle: function navStyle() {
      var dir = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'X' : 'Y';
      return {
        transform: "translate".concat(dir, "(-").concat(this.navOffset, "px)")
      };
    },
    sizeName: function sizeName() {
      return ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
    }
  },
  methods: {
    scrollPrev: function scrollPrev() {
      var containerSize = this.$refs.navScroll["offset".concat(firstUpperCase(this.sizeName))];
      var currentOffset = this.navOffset;
      if (!currentOffset) return;
      var newOffset = currentOffset > containerSize ? currentOffset - containerSize : 0;
      this.navOffset = newOffset;
    },
    scrollNext: function scrollNext() {
      var navSize = this.$refs.nav["offset".concat(firstUpperCase(this.sizeName))];
      var containerSize = this.$refs.navScroll["offset".concat(firstUpperCase(this.sizeName))];
      var currentOffset = this.navOffset;
      if (navSize - currentOffset <= containerSize) return;
      var newOffset = navSize - currentOffset > containerSize * 2 ? currentOffset + containerSize : navSize - containerSize;
      this.navOffset = newOffset;
    },
    scrollToActiveTab: function scrollToActiveTab() {
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
    update: function update() {
      if (!this.$refs.nav) return;
      var sizeName = this.sizeName;
      var navSize = this.$refs.nav["offset".concat(firstUpperCase(sizeName))];
      var containerSize = this.$refs.navScroll["offset".concat(firstUpperCase(sizeName))];
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
    changeTab: function changeTab(e) {
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
    setFocus: function setFocus() {
      if (this.focusable) {
        this.isFocus = true;
      }
    },
    removeFocus: function removeFocus() {
      this.isFocus = false;
    },
    visibilityChangeHandler: function visibilityChangeHandler() {
      var _this = this;
      var visibility = document.visibilityState;
      if (visibility === 'hidden') {
        this.focusable = false;
      } else if (visibility === 'visible') {
        setTimeout(function () {
          _this.focusable = true;
        }, 50);
      }
    },
    windowBlurHandler: function windowBlurHandler() {
      this.focusable = false;
    },
    windowFocusHandler: function windowFocusHandler() {
      var _this2 = this;
      setTimeout(function () {
        _this2.focusable = true;
      }, 50);
    }
  },
  updated: function updated() {
    this.update();
  },
  render: function render(h) {
    var _this3 = this;
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
    var tabs = this._l(panes, function (pane, index) {
      var tabName = pane.name || pane.index || index;
      var closable = pane.isClosable || editable;
      pane.index = "".concat(index);
      var btnClose = closable ? h("span", {
        "class": "el-icon-close",
        "on": {
          "click": function click(ev) {
            onTabRemove(pane, ev);
          }
        }
      }) : null;
      var tabLabelContent = pane.$slots.label || pane.label;
      var tabindex = pane.active ? 0 : -1;
      return h("div", {
        "class": _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
          'el-tabs__item': true
        }, "is-".concat(_this3.rootTabs.tabPosition), true), 'is-active', pane.active), 'is-disabled', pane.disabled), 'is-closable', closable), 'is-focus', _this3.isFocus),
        "attrs": {
          "id": "tab-".concat(tabName),
          "aria-controls": "pane-".concat(tabName),
          "role": "tab",
          "aria-selected": pane.active,
          "tabindex": tabindex
        },
        "key": "tab-".concat(tabName),
        "ref": "tabs",
        "refInFor": true,
        "on": {
          "focus": function focus() {
            setFocus();
          },
          "blur": function blur() {
            removeFocus();
          },
          "click": function click(ev) {
            removeFocus();
            onTabClick(pane, tabName, ev);
          },
          "keydown": function keydown(ev) {
            if (closable && (ev.keyCode === 46 || ev.keyCode === 8)) {
              onTabRemove(pane, ev);
            }
          }
        }
      }, [tabLabelContent, btnClose]);
    });
    return h("div", {
      "class": ['el-tabs__nav-wrap', scrollable ? 'is-scrollable' : '', "is-".concat(this.rootTabs.tabPosition)]
    }, [scrollBtn, h("div", {
      "class": ['el-tabs__nav-scroll'],
      "ref": "navScroll"
    }, [h("div", {
      "class": ['el-tabs__nav', "is-".concat(this.rootTabs.tabPosition), stretch && ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'is-stretch' : ''],
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
  mounted: function mounted() {
    var _this4 = this;
    addResizeListener(this.$el, this.update);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('focus', this.windowFocusHandler);
    setTimeout(function () {
      _this4.scrollToActiveTab();
    }, 0);
  },
  beforeDestroy: function beforeDestroy() {
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

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
  provide: function provide() {
    return {
      rootTabs: this
    };
  },
  data: function data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    };
  },
  watch: {
    activeName: function activeName(value) {
      this.setCurrentName(value);
    },
    value: function value(_value) {
      this.setCurrentName(_value);
    },
    currentName: function currentName(value) {
      var _this = this;
      if (this.$refs.nav) {
        this.$nextTick(function () {
          _this.$refs.nav.$nextTick(function (_) {
            _this.$refs.nav.scrollToActiveTab();
          });
        });
      }
    }
  },
  methods: {
    calcPaneInstances: function calcPaneInstances() {
      var _this2 = this;
      var isForceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.$slots.default) {
        var paneSlots = this.$slots.default.filter(function (vnode) {
          return vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElTabPane';
        });
        // update indeed
        var panes = paneSlots.map(function (_ref) {
          var componentInstance = _ref.componentInstance;
          return componentInstance;
        });
        var panesChanged = !(panes.length === this.panes.length && panes.every(function (pane, index) {
          return pane === _this2.panes[index];
        }));
        if (isForceUpdate || panesChanged) {
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
    handleTabClick: function handleTabClick(tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit('tab-click', tab, event);
    },
    handleTabRemove: function handleTabRemove(pane, ev) {
      if (pane.disabled) return;
      ev.stopPropagation();
      this.$emit('edit', pane.name, 'remove');
      this.$emit('tab-remove', pane.name);
    },
    handleTabAdd: function handleTabAdd() {
      this.$emit('edit', null, 'add');
      this.$emit('tab-add');
    },
    setCurrentName: function setCurrentName(value) {
      var _this3 = this;
      var changeCurrentName = function changeCurrentName() {
        _this3.currentName = value;
        _this3.$emit('input', value);
      };
      if (this.currentName !== value && this.beforeLeave) {
        var before = this.beforeLeave(value, this.currentName);
        if (before && before.then) {
          before.then(function () {
            changeCurrentName();
            _this3.$refs.nav && _this3.$refs.nav.removeFocus();
          }, function () {
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
  render: function render(h) {
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
        "keydown": function keydown(ev) {
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
        currentName: currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable: editable,
        type: type,
        panes: panes,
        stretch: stretch
      },
      ref: 'nav'
    };
    var header = h("div", {
      "class": ['el-tabs__header', "is-".concat(tabPosition)]
    }, [newButton, h("tab-nav", helper([{}, navData]))]);
    var panels = h("div", {
      "class": "el-tabs__content"
    }, [this.$slots.default]);
    return h("div", {
      "class": _defineProperty(_defineProperty({
        'el-tabs': true,
        'el-tabs--card': type === 'card'
      }, "el-tabs--".concat(tabPosition), true), 'el-tabs--border-card', type === 'border-card')
    }, [tabPosition !== 'bottom' ? [header, panels] : [panels, header]]);
  },
  created: function created() {
    if (!this.currentName) {
      this.setCurrentName('0');
    }
    this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true));
  },
  mounted: function mounted() {
    this.calcPaneInstances();
  },
  updated: function updated() {
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
