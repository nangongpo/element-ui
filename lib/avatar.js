import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

var script = {
  name: 'ElAvatar',
  props: {
    size: {
      type: [Number, String],
      validator: function validator(val) {
        if (typeof val === 'string') {
          return ['large', 'medium', 'small'].includes(val);
        }
        return typeof val === 'number';
      }
    },
    shape: {
      type: String,
      default: 'circle',
      validator: function validator(val) {
        return ['circle', 'square'].includes(val);
      }
    },
    icon: String,
    src: String,
    alt: String,
    srcSet: String,
    error: Function,
    fit: {
      type: String,
      default: 'cover'
    }
  },
  data: function data() {
    return {
      isImageExist: true
    };
  },
  computed: {
    avatarClass: function avatarClass() {
      var size = this.size,
        icon = this.icon,
        shape = this.shape;
      var classList = ['el-avatar'];
      if (size && typeof size === 'string') {
        classList.push("el-avatar--".concat(size));
      }
      if (icon) {
        classList.push('el-avatar--icon');
      }
      if (shape) {
        classList.push("el-avatar--".concat(shape));
      }
      return classList.join(' ');
    }
  },
  methods: {
    handleError: function handleError() {
      var error = this.error;
      var errorFlag = error ? error() : undefined;
      if (errorFlag !== false) {
        this.isImageExist = false;
      }
    },
    renderAvatar: function renderAvatar() {
      var h = this.$createElement;
      var icon = this.icon,
        src = this.src,
        alt = this.alt,
        isImageExist = this.isImageExist,
        srcSet = this.srcSet,
        fit = this.fit;
      if (isImageExist && src) {
        return h("img", {
          "attrs": {
            "src": src,
            "alt": alt,
            "srcSet": srcSet
          },
          "on": {
            "error": this.handleError
          },
          "style": {
            'object-fit': fit
          }
        });
      }
      if (icon) {
        return h("i", {
          "class": icon
        });
      }
      return this.$slots.default;
    }
  },
  render: function render() {
    var h = arguments[0];
    var avatarClass = this.avatarClass,
      size = this.size;
    var sizeStyle = typeof size === 'number' ? {
      height: "".concat(size, "px"),
      width: "".concat(size, "px"),
      lineHeight: "".concat(size, "px")
    } : {};
    return h("span", {
      "class": avatarClass,
      "style": sizeStyle
    }, [this.renderAvatar()]);
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
