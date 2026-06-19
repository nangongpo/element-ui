import Emitter from 'element-ui/lib/mixins/emitter.js';
import { getValueByPath, escapeRegexpString } from 'element-ui/lib/utils/util.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var script = {
  mixins: [Emitter],
  name: 'ElOption',
  componentName: 'ElOption',
  inject: ['select'],
  props: {
    value: {
      required: true
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false
    };
  },
  computed: {
    isObject: function isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
    },
    currentLabel: function currentLabel() {
      return this.label || (this.isObject ? '' : this.value);
    },
    currentValue: function currentValue() {
      return this.value || this.label || '';
    },
    itemSelected: function itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.value);
      } else {
        return this.contains(this.select.value, this.value);
      }
    },
    limitReached: function limitReached() {
      if (this.select.multiple) {
        return !this.itemSelected && (this.select.value || []).length >= this.select.multipleLimit && this.select.multipleLimit > 0;
      } else {
        return false;
      }
    }
  },
  watch: {
    currentLabel: function currentLabel() {
      if (!this.created && !this.select.remote) this.dispatch('ElSelect', 'setSelected');
    },
    value: function value(val, oldVal) {
      var _this$select = this.select,
        remote = _this$select.remote,
        valueKey = _this$select.valueKey;
      if (!this.created && !remote) {
        if (valueKey && _typeof(val) === 'object' && _typeof(oldVal) === 'object' && val[valueKey] === oldVal[valueKey]) {
          return;
        }
        this.dispatch('ElSelect', 'setSelected');
      }
    }
  },
  methods: {
    isEqual: function isEqual(a, b) {
      if (!this.isObject) {
        return a === b;
      } else {
        var valueKey = this.select.valueKey;
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
      }
    },
    contains: function contains() {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var target = arguments.length > 1 ? arguments[1] : undefined;
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1;
      } else {
        var valueKey = this.select.valueKey;
        return arr && arr.some(function (item) {
          return getValueByPath(item, valueKey) === getValueByPath(target, valueKey);
        });
      }
    },
    handleGroupDisabled: function handleGroupDisabled(val) {
      this.groupDisabled = val;
    },
    hoverItem: function hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.select.options.indexOf(this);
      }
    },
    selectOptionClick: function selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', [this, true]);
      }
    },
    queryChange: function queryChange(query) {
      this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created;
      if (!this.visible) {
        this.select.filteredOptionsCount--;
      }
    }
  },
  created: function created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;
    this.$on('queryChange', this.queryChange);
    this.$on('handleGroupDisabled', this.handleGroupDisabled);
  },
  beforeDestroy: function beforeDestroy() {
    var _this$select2 = this.select,
      selected = _this$select2.selected,
      multiple = _this$select2.multiple;
    var selectedOptions = multiple ? selected : [selected];
    var index = this.select.cachedOptions.indexOf(this);
    var selectedIndex = selectedOptions.indexOf(this);

    // if option is not selected, remove it from cache
    if (index > -1 && selectedIndex < 0) {
      this.select.cachedOptions.splice(index, 1);
    }
    this.select.onOptionDestroy(this.select.options.indexOf(this));
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
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-select-dropdown__item",
    class: {
      selected: _vm.itemSelected,
      "is-disabled": _vm.disabled || _vm.groupDisabled || _vm.limitReached,
      hover: _vm.hover
    },
    on: {
      mouseenter: _vm.hoverItem,
      click: function click($event) {
        $event.stopPropagation();
        return _vm.selectOptionClick($event);
      }
    }
  }, [_vm._t("default", [_c("span", [_vm._v(_vm._s(_vm.currentLabel))])])], 2);
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
