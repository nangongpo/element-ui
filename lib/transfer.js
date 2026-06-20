import __vue_component__$5 from './button.js';
import emitter from './mixins/emitter.js';
import Locale from './mixins/locale.js';
import __vue_component__$2 from './checkbox-group.js';
import __vue_component__$3 from './checkbox.js';
import __vue_component__$4 from './input.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import Migrating from './mixins/migrating.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import 'vue';
import './locale/format.js';
import './utils/util.js';
import './utils/types.js';
import './utils/merge.js';
import './utils/shared.js';

//
var script$1 = {
  mixins: [Locale],
  name: 'ElTransferPanel',
  componentName: 'ElTransferPanel',
  components: {
    ElCheckboxGroup: __vue_component__$2,
    ElCheckbox: __vue_component__$3,
    ElInput: __vue_component__$4,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        var getParent = vm => {
          if (vm.$options.componentName === 'ElTransferPanel') {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        var panel = getParent(this);
        var transfer = panel.$parent || panel;
        return panel.renderContent ? panel.renderContent(h, this.option) : transfer.$scopedSlots.default ? transfer.$scopedSlots.default({
          option: this.option
        }) : h("span", [this.option[panel.labelProp] || this.option[panel.keyProp]]);
      }
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object
  },
  data() {
    return {
      checked: [],
      allChecked: false,
      query: '',
      inputHover: false,
      checkChangeByUser: true
    };
  },
  watch: {
    checked(val, oldVal) {
      this.updateAllChecked();
      if (this.checkChangeByUser) {
        var movedKeys = val.concat(oldVal).filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit('checked-change', val, movedKeys);
      } else {
        this.$emit('checked-change', val);
        this.checkChangeByUser = true;
      }
    },
    data() {
      var checked = [];
      var filteredDataKeys = this.filteredData.map(item => item[this.keyProp]);
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item);
        }
      });
      this.checkChangeByUser = false;
      this.checked = checked;
    },
    checkableData() {
      this.updateAllChecked();
    },
    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (oldVal && val.length === oldVal.length && val.every(item => oldVal.indexOf(item) > -1)) return;
        var checked = [];
        var checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    }
  },
  computed: {
    filteredData() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, item);
        } else {
          var label = item[this.labelProp] || item[this.keyProp].toString();
          return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }
      });
    },
    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },
    checkedSummary() {
      var checkedLength = this.checked.length;
      var dataLength = this.data.length;
      var _this$format = this.format,
        noChecked = _this$format.noChecked,
        hasChecked = _this$format.hasChecked;
      if (noChecked && hasChecked) {
        return checkedLength > 0 ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength) : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },
    isIndeterminate() {
      var checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },
    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },
    inputIcon() {
      return this.query.length > 0 && this.inputHover ? 'circle-close' : 'search';
    },
    labelProp() {
      return this.props.label || 'label';
    },
    keyProp() {
      return this.props.key || 'key';
    },
    disabledProp() {
      return this.props.disabled || 'disabled';
    },
    hasFooter() {
      return !!this.$slots.default;
    }
  },
  methods: {
    updateAllChecked() {
      var checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
      this.allChecked = checkableDataKeys.length > 0 && checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },
    handleAllCheckedChange(value) {
      this.checked = value ? this.checkableData.map(item => item[this.keyProp]) : [];
    },
    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-transfer-panel"
  }, [_c("p", {
    staticClass: "el-transfer-panel__header"
  }, [_c("el-checkbox", {
    attrs: {
      indeterminate: _vm.isIndeterminate
    },
    on: {
      change: _vm.handleAllCheckedChange
    },
    model: {
      value: _vm.allChecked,
      callback: function callback($$v) {
        _vm.allChecked = $$v;
      },
      expression: "allChecked"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.title) + "\n      "), _c("span", [_vm._v(_vm._s(_vm.checkedSummary))])])], 1), _vm._v(" "), _c("div", {
    class: ["el-transfer-panel__body", _vm.hasFooter ? "is-with-footer" : ""]
  }, [_vm.filterable ? _c("el-input", {
    staticClass: "el-transfer-panel__filter",
    attrs: {
      size: "small",
      placeholder: _vm.placeholder
    },
    nativeOn: {
      mouseenter: function mouseenter($event) {
        _vm.inputHover = true;
      },
      mouseleave: function mouseleave($event) {
        _vm.inputHover = false;
      }
    },
    model: {
      value: _vm.query,
      callback: function callback($$v) {
        _vm.query = $$v;
      },
      expression: "query"
    }
  }, [_c("i", {
    class: ["el-input__icon", "el-icon-" + _vm.inputIcon],
    attrs: {
      slot: "prefix"
    },
    on: {
      click: _vm.clearQuery
    },
    slot: "prefix"
  })]) : _vm._e(), _vm._v(" "), _c("el-checkbox-group", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.hasNoMatch && _vm.data.length > 0,
      expression: "!hasNoMatch && data.length > 0"
    }],
    staticClass: "el-transfer-panel__list",
    class: {
      "is-filterable": _vm.filterable
    },
    model: {
      value: _vm.checked,
      callback: function callback($$v) {
        _vm.checked = $$v;
      },
      expression: "checked"
    }
  }, _vm._l(_vm.filteredData, function (item) {
    return _c("el-checkbox", {
      key: item[_vm.keyProp],
      staticClass: "el-transfer-panel__item",
      attrs: {
        label: item[_vm.keyProp],
        disabled: item[_vm.disabledProp]
      }
    }, [_c("option-content", {
      attrs: {
        option: item
      }
    })], 1);
  }), 1), _vm._v(" "), _c("p", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.hasNoMatch,
      expression: "hasNoMatch"
    }],
    staticClass: "el-transfer-panel__empty"
  }, [_vm._v(_vm._s(_vm.t("el.transfer.noMatch")))]), _vm._v(" "), _c("p", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.data.length === 0 && !_vm.hasNoMatch,
      expression: "data.length === 0 && !hasNoMatch"
    }],
    staticClass: "el-transfer-panel__empty"
  }, [_vm._v(_vm._s(_vm.t("el.transfer.noData")))])], 1), _vm._v(" "), _vm.hasFooter ? _c("p", {
    staticClass: "el-transfer-panel__footer"
  }, [_vm._t("default")], 2) : _vm._e()]);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: 'ElTransfer',
  mixins: [emitter, Locale, Migrating],
  components: {
    TransferPanel: __vue_component__$1,
    ElButton: __vue_component__$5
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    titles: {
      type: Array,
      default() {
        return [];
      }
    },
    buttonTexts: {
      type: Array,
      default() {
        return [];
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    format: {
      type: Object,
      default() {
        return {};
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        };
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },
  data() {
    return {
      leftChecked: [],
      rightChecked: []
    };
  },
  computed: {
    dataObj() {
      var key = this.props.key;
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    },
    sourceData() {
      return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1);
    },
    targetData() {
      if (this.targetOrder === 'original') {
        return this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1);
      } else {
        return this.value.reduce((arr, cur) => {
          var val = this.dataObj[cur];
          if (val) {
            arr.push(val);
          }
          return arr;
        }, []);
      }
    },
    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    }
  },
  watch: {
    value(val) {
      this.dispatch('ElFormItem', 'el.form.change', val);
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      };
    },
    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('left-check-change', val, movedKeys);
    },
    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('right-check-change', val, movedKeys);
    },
    addToLeft() {
      var currentValue = this.value.slice();
      this.rightChecked.forEach(item => {
        var index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
        }
      });
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'left', this.rightChecked);
    },
    addToRight() {
      var currentValue = this.value.slice();
      var itemsToBeMoved = [];
      var key = this.props.key;
      this.data.forEach(item => {
        var itemKey = item[key];
        if (this.leftChecked.indexOf(itemKey) > -1 && this.value.indexOf(itemKey) === -1) {
          itemsToBeMoved.push(itemKey);
        }
      });
      currentValue = this.targetOrder === 'unshift' ? itemsToBeMoved.concat(currentValue) : currentValue.concat(itemsToBeMoved);
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'right', this.leftChecked);
    },
    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = '';
      } else if (which === 'right') {
        this.$refs.rightPanel.query = '';
      }
    }
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-transfer"
  }, [_c("transfer-panel", _vm._b({
    ref: "leftPanel",
    attrs: {
      data: _vm.sourceData,
      title: _vm.titles[0] || _vm.t("el.transfer.titles.0"),
      "default-checked": _vm.leftDefaultChecked,
      placeholder: _vm.filterPlaceholder || _vm.t("el.transfer.filterPlaceholder")
    },
    on: {
      "checked-change": _vm.onSourceCheckedChange
    }
  }, "transfer-panel", _vm.$props, false), [_vm._t("left-footer")], 2), _vm._v(" "), _c("div", {
    staticClass: "el-transfer__buttons"
  }, [_c("el-button", {
    class: ["el-transfer__button", _vm.hasButtonTexts ? "is-with-texts" : ""],
    attrs: {
      type: "primary",
      disabled: _vm.rightChecked.length === 0
    },
    nativeOn: {
      click: function click($event) {
        return _vm.addToLeft($event);
      }
    }
  }, [_c("i", {
    staticClass: "el-icon-arrow-left"
  }), _vm._v(" "), _vm.buttonTexts[0] !== undefined ? _c("span", [_vm._v(_vm._s(_vm.buttonTexts[0]))]) : _vm._e()]), _vm._v(" "), _c("el-button", {
    class: ["el-transfer__button", _vm.hasButtonTexts ? "is-with-texts" : ""],
    attrs: {
      type: "primary",
      disabled: _vm.leftChecked.length === 0
    },
    nativeOn: {
      click: function click($event) {
        return _vm.addToRight($event);
      }
    }
  }, [_vm.buttonTexts[1] !== undefined ? _c("span", [_vm._v(_vm._s(_vm.buttonTexts[1]))]) : _vm._e(), _vm._v(" "), _c("i", {
    staticClass: "el-icon-arrow-right"
  })])], 1), _vm._v(" "), _c("transfer-panel", _vm._b({
    ref: "rightPanel",
    attrs: {
      data: _vm.targetData,
      title: _vm.titles[1] || _vm.t("el.transfer.titles.1"),
      "default-checked": _vm.rightDefaultChecked,
      placeholder: _vm.filterPlaceholder || _vm.t("el.transfer.filterPlaceholder")
    },
    on: {
      "checked-change": _vm.onTargetCheckedChange
    }
  }, "transfer-panel", _vm.$props, false), [_vm._t("right-footer")], 2)], 1);
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
