var Row = {
  name: 'ElRow',
  componentName: 'ElRow',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: String
  },
  computed: {
    style: function style() {
      var ret = {};
      if (this.gutter) {
        ret.marginLeft = "-".concat(this.gutter / 2, "px");
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    }
  },
  render: function render(h) {
    return h(this.tag, {
      class: ['el-row', this.justify !== 'start' ? "is-justify-".concat(this.justify) : '', this.align ? "is-align-".concat(this.align) : '', {
        'el-row--flex': this.type === 'flex'
      }],
      style: this.style
    }, this.$slots.default);
  }
};

/* istanbul ignore next */
Row.install = function (Vue) {
  Vue.component(Row.name, Row);
};

export { Row as default };
