import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

//
var keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
});
var script = {
  name: 'ElRadioGroup',
  componentName: 'ElRadioGroup',
  inject: {
    elFormItem: {
      default: ''
    }
  },
  mixins: [emitter],
  props: {
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    _elTag() {
      var tag = (this.$vnode.data || {}).tag;
      if (!tag || tag === 'component') tag = 'div';
      return tag;
    },
    radioGroupSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    }
  },
  created() {
    this.$on('handleChange', value => {
      this.$emit('change', value);
    });
  },
  mounted() {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航
    var radios = this.$el.querySelectorAll('[type=radio]');
    var firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  },
  methods: {
    handleKeydown(e) {
      // 左右上下按键 可以在radio组内切换不同选项
      var target = e.target;
      var className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
      var radios = this.$el.querySelectorAll(className);
      var length = radios.length;
      var index = [].indexOf.call(radios, target);
      var roleRadios = this.$el.querySelectorAll('[role=radio]');
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation();
          e.preventDefault();
          if (index === 0) {
            roleRadios[length - 1].click();
            roleRadios[length - 1].focus();
          } else {
            roleRadios[index - 1].click();
            roleRadios[index - 1].focus();
          }
          break;
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === length - 1) {
            e.stopPropagation();
            e.preventDefault();
            roleRadios[0].click();
            roleRadios[0].focus();
          } else {
            roleRadios[index + 1].click();
            roleRadios[index + 1].focus();
          }
          break;
      }
    }
  },
  watch: {
    value(value) {
      this.dispatch('ElFormItem', 'el.form.change', [this.value]);
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
  return _c(_vm._elTag, {
    tag: "component",
    staticClass: "el-radio-group",
    attrs: {
      role: "radiogroup"
    },
    on: {
      keydown: _vm.handleKeydown
    }
  }, [_vm._t("default")], 2);
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
