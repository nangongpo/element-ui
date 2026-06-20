import { n as normalizeComponent } from './shared/normalize-component-01820469.js';

var script = {
  name: 'ElTag',
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1;
      }
    }
  },
  methods: {
    handleClose(event) {
      event.stopPropagation();
      this.$emit('close', event);
    },
    handleClick(event) {
      this.$emit('click', event);
    }
  },
  computed: {
    tagSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  render(h) {
    var type = this.type,
      tagSize = this.tagSize,
      hit = this.hit,
      effect = this.effect;
    var classes = ['el-tag', type ? `el-tag--${type}` : '', tagSize ? `el-tag--${tagSize}` : '', effect ? `el-tag--${effect}` : '', hit && 'is-hit'];
    var tagEl = h("span", {
      "class": classes,
      "style": {
        backgroundColor: this.color
      },
      "on": {
        "click": this.handleClick
      }
    }, [this.$slots.default, this.closable && h("i", {
      "class": "el-tag__close el-icon-close",
      "on": {
        "click": this.handleClose
      }
    })]);
    return this.disableTransitions ? tagEl : h("transition", {
      "attrs": {
        "name": "el-zoom-in-center"
      }
    }, [tagEl]);
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
