function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var ElCol = {
  name: 'ElCol',
  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },
  computed: {
    gutter: function gutter() {
      var parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  },
  render: function render(h) {
    var _this = this;
    var classList = [];
    var style = {};
    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }
    ['span', 'offset', 'pull', 'push'].forEach(function (prop) {
      if (_this[prop] || _this[prop] === 0) {
        classList.push(prop !== 'span' ? "el-col-".concat(prop, "-").concat(_this[prop]) : "el-col-".concat(_this[prop]));
      }
    });
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(function (size) {
      if (typeof _this[size] === 'number') {
        classList.push("el-col-".concat(size, "-").concat(_this[size]));
      } else if (_typeof(_this[size]) === 'object') {
        var props = _this[size];
        Object.keys(props).forEach(function (prop) {
          classList.push(prop !== 'span' ? "el-col-".concat(size, "-").concat(prop, "-").concat(props[prop]) : "el-col-".concat(size, "-").concat(props[prop]));
        });
      }
    });
    return h(this.tag, {
      class: ['el-col', classList],
      style: style
    }, this.$slots.default);
  }
};

/* istanbul ignore next */
ElCol.install = function (Vue) {
  Vue.component(ElCol.name, ElCol);
};

export { ElCol as default };
