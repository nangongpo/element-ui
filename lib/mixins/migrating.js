import { kebabCase } from 'element-ui/lib/utils/util.js';

/**
 * Show migrating guide in browser console.
 *
 * Usage:
 * import Migrating from 'element-ui/lib/mixins/migrating';
 *
 * mixins: [Migrating]
 *
 * add getMigratingConfig method for your component.
 *  getMigratingConfig() {
 *    return {
 *      props: {
 *        'allow-no-selection': 'allow-no-selection is removed.',
 *        'selection-mode': 'selection-mode is removed.'
 *      },
 *      events: {
 *        selectionchange: 'selectionchange is renamed to selection-change.'
 *      }
 *    };
 *  },
 */
var migrating = {
  mounted: function mounted() {
    if (process.env.NODE_ENV === 'production') return;
    if (!this.$vnode) return;
    var _this$getMigratingCon = this.getMigratingConfig(),
      _this$getMigratingCon2 = _this$getMigratingCon.props,
      props = _this$getMigratingCon2 === void 0 ? {} : _this$getMigratingCon2,
      _this$getMigratingCon3 = _this$getMigratingCon.events,
      events = _this$getMigratingCon3 === void 0 ? {} : _this$getMigratingCon3;
    var _this$$vnode = this.$vnode,
      data = _this$$vnode.data,
      componentOptions = _this$$vnode.componentOptions;
    var definedProps = data.attrs || {};
    var definedEvents = componentOptions.listeners || {};
    for (var propName in definedProps) {
      propName = kebabCase(propName); // compatible with camel case
      if (props[propName]) {
        console.warn("[Element Migrating][".concat(this.$options.name, "][Attribute]: ").concat(props[propName]));
      }
    }
    for (var eventName in definedEvents) {
      eventName = kebabCase(eventName); // compatible with camel case
      if (events[eventName]) {
        console.warn("[Element Migrating][".concat(this.$options.name, "][Event]: ").concat(events[eventName]));
      }
    }
  },
  methods: {
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {},
        events: {}
      };
    }
  }
};

export { migrating as default };
