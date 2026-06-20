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
    style() {
      var ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    }
  },
  render(h) {
    return h(this.tag, {
      class: ['el-row', this.justify !== 'start' ? `is-justify-${this.justify}` : '', this.align ? `is-align-${this.align}` : '', {
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
