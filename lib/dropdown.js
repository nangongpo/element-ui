import Clickoutside from 'element-ui/lib/utils/clickoutside.js';
import Emitter from 'element-ui/lib/mixins/emitter.js';
import Migrating from 'element-ui/lib/mixins/migrating.js';
import ElButton from 'element-ui/lib/button.js';
import ElButtonGroup from 'element-ui/lib/button-group.js';
import { generateId } from 'element-ui/lib/utils/util.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var script = {
  name: 'ElDropdown',
  componentName: 'ElDropdown',
  mixins: [Emitter, Migrating],
  directives: {
    Clickoutside: Clickoutside
  },
  components: {
    ElButton: ElButton,
    ElButtonGroup: ElButtonGroup
  },
  provide: function provide() {
    return {
      dropdown: this
    };
  },
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    type: String,
    size: {
      type: String,
      default: ''
    },
    splitButton: Boolean,
    hideOnClick: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom-end'
    },
    visibleArrow: {
      default: true
    },
    showTimeout: {
      type: Number,
      default: 250
    },
    hideTimeout: {
      type: Number,
      default: 150
    },
    tabindex: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      timeout: null,
      visible: false,
      triggerElm: null,
      menuItems: null,
      menuItemsArray: null,
      dropdownElm: null,
      focusing: false,
      listId: "dropdown-menu-".concat(generateId())
    };
  },
  computed: {
    dropdownSize: function dropdownSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  mounted: function mounted() {
    this.$on('menu-item-click', this.handleMenuItemClick);
  },
  watch: {
    visible: function visible(val) {
      this.broadcast('ElDropdownMenu', 'visible', val);
      this.$emit('visible-change', val);
    },
    focusing: function focusing(val) {
      var selfDefine = this.$el.querySelector('.el-dropdown-selfdefine');
      if (selfDefine) {
        // 自定义
        if (val) {
          selfDefine.className += ' focusing';
        } else {
          selfDefine.className = selfDefine.className.replace('focusing', '');
        }
      }
    }
  },
  methods: {
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'menu-align': 'menu-align is renamed to placement.'
        }
      };
    },
    show: function show() {
      var _this = this;
      if (this.disabled) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this.visible = true;
      }, this.trigger === 'click' ? 0 : this.showTimeout);
    },
    hide: function hide() {
      var _this2 = this;
      if (this.disabled) return;
      this.removeTabindex();
      if (this.tabindex >= 0) {
        this.resetTabindex(this.triggerElm);
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this2.visible = false;
      }, this.trigger === 'click' ? 0 : this.hideTimeout);
    },
    handleClick: function handleClick() {
      if (this.disabled) return;
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    handleTriggerKeyDown: function handleTriggerKeyDown(ev) {
      var keyCode = ev.keyCode;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up/down
        this.removeTabindex();
        this.resetTabindex(this.menuItems[0]);
        this.menuItems[0].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) {
        // space enter选中
        this.handleClick();
      } else if ([9, 27].indexOf(keyCode) > -1) {
        // tab || esc
        this.hide();
      }
    },
    handleItemKeyDown: function handleItemKeyDown(ev) {
      var keyCode = ev.keyCode;
      var target = ev.target;
      var currentIndex = this.menuItemsArray.indexOf(target);
      var max = this.menuItemsArray.length - 1;
      var nextIndex;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up/down
        if (keyCode === 38) {
          // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        } else {
          // down
          nextIndex = currentIndex < max ? currentIndex + 1 : max;
        }
        this.removeTabindex();
        this.resetTabindex(this.menuItems[nextIndex]);
        this.menuItems[nextIndex].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) {
        // enter选中
        this.triggerElmFocus();
        target.click();
        if (this.hideOnClick) {
          // click关闭
          this.visible = false;
        }
      } else if ([9, 27].indexOf(keyCode) > -1) {
        // tab // esc
        this.hide();
        this.triggerElmFocus();
      }
    },
    resetTabindex: function resetTabindex(ele) {
      // 下次tab时组件聚焦元素
      this.removeTabindex();
      ele.setAttribute('tabindex', '0'); // 下次期望的聚焦元素
    },
    removeTabindex: function removeTabindex() {
      this.triggerElm.setAttribute('tabindex', '-1');
      this.menuItemsArray.forEach(function (item) {
        item.setAttribute('tabindex', '-1');
      });
    },
    initAria: function initAria() {
      this.dropdownElm.setAttribute('id', this.listId);
      this.triggerElm.setAttribute('aria-haspopup', 'list');
      this.triggerElm.setAttribute('aria-controls', this.listId);
      if (!this.splitButton) {
        // 自定义
        this.triggerElm.setAttribute('role', 'button');
        this.triggerElm.setAttribute('tabindex', this.tabindex);
        this.triggerElm.setAttribute('class', (this.triggerElm.getAttribute('class') || '') + ' el-dropdown-selfdefine'); // 控制
      }
    },
    initEvent: function initEvent() {
      var _this3 = this;
      var trigger = this.trigger,
        show = this.show,
        hide = this.hide,
        handleClick = this.handleClick,
        splitButton = this.splitButton,
        handleTriggerKeyDown = this.handleTriggerKeyDown,
        handleItemKeyDown = this.handleItemKeyDown;
      this.triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;
      var dropdownElm = this.dropdownElm;
      this.triggerElm.addEventListener('keydown', handleTriggerKeyDown); // triggerElm keydown
      dropdownElm.addEventListener('keydown', handleItemKeyDown, true); // item keydown
      // 控制自定义元素的样式
      if (!splitButton) {
        this.triggerElm.addEventListener('focus', function () {
          _this3.focusing = true;
        });
        this.triggerElm.addEventListener('blur', function () {
          _this3.focusing = false;
        });
        this.triggerElm.addEventListener('click', function () {
          _this3.focusing = false;
        });
      }
      if (trigger === 'hover') {
        this.triggerElm.addEventListener('mouseenter', show);
        this.triggerElm.addEventListener('mouseleave', hide);
        dropdownElm.addEventListener('mouseenter', show);
        dropdownElm.addEventListener('mouseleave', hide);
      } else if (trigger === 'click') {
        this.triggerElm.addEventListener('click', handleClick);
      }
    },
    handleMenuItemClick: function handleMenuItemClick(command, instance) {
      if (this.hideOnClick) {
        this.visible = false;
      }
      this.$emit('command', command, instance);
    },
    triggerElmFocus: function triggerElmFocus() {
      this.triggerElm.focus && this.triggerElm.focus();
    },
    initDomOperation: function initDomOperation() {
      this.dropdownElm = this.popperElm;
      this.menuItems = this.dropdownElm.querySelectorAll("[tabindex='-1']");
      this.menuItemsArray = [].slice.call(this.menuItems);
      this.initEvent();
      this.initAria();
    }
  },
  render: function render(h) {
    var _this4 = this;
    var hide = this.hide,
      splitButton = this.splitButton,
      type = this.type,
      dropdownSize = this.dropdownSize,
      disabled = this.disabled;
    var handleMainButtonClick = function handleMainButtonClick(event) {
      _this4.$emit('click', event);
      hide();
    };
    var triggerElm = null;
    if (splitButton) {
      triggerElm = h("el-button-group", [h("el-button", {
        "attrs": {
          "type": type,
          "size": dropdownSize,
          "disabled": disabled
        },
        "nativeOn": {
          "click": handleMainButtonClick
        }
      }, [this.$slots.default]), h("el-button", {
        "ref": "trigger",
        "attrs": {
          "type": type,
          "size": dropdownSize,
          "disabled": disabled
        },
        "class": "el-dropdown__caret-button"
      }, [h("i", {
        "class": "el-dropdown__icon el-icon-arrow-down"
      })])]);
    } else {
      triggerElm = this.$slots.default;
      var vnodeData = triggerElm[0].data || {};
      var _vnodeData$attrs = vnodeData.attrs,
        attrs = _vnodeData$attrs === void 0 ? {} : _vnodeData$attrs;
      if (disabled && !attrs.disabled) {
        attrs.disabled = true;
        vnodeData.attrs = attrs;
      }
    }
    var menuElm = disabled ? null : this.$slots.dropdown;
    return h("div", {
      "class": "el-dropdown",
      "directives": [{
        name: "clickoutside",
        value: hide
      }],
      "attrs": {
        "aria-disabled": disabled
      }
    }, [triggerElm, menuElm]);
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
