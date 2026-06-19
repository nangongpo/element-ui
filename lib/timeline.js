import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var script = {
  name: 'ElTimeline',
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  provide: function provide() {
    return {
      timeline: this
    };
  },
  render: function render() {
    var h = arguments[0];
    var reverse = this.reverse;
    var classes = {
      'el-timeline': true,
      'is-reverse': reverse
    };
    var slots = this.$slots.default || [];
    if (reverse) {
      slots = slots.reverse();
    }
    return h("ul", {
      "class": classes
    }, [slots]);
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
