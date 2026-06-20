var DescriptionsItem = {
  name: 'ElDescriptionsItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    span: {
      type: Number,
      default: 1
    },
    contentClassName: {
      type: String,
      default: ''
    },
    contentStyle: {
      type: Object
    },
    labelClassName: {
      type: String,
      default: ''
    },
    labelStyle: {
      type: Object
    }
  },
  render() {
    return null;
  }
};

/* istanbul ignore next */
DescriptionsItem.install = function install(Vue) {
  Vue.component(DescriptionsItem.name, DescriptionsItem);
};

export { DescriptionsItem as default };
