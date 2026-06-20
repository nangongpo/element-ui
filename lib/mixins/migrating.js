import { kebabCase } from '../utils/util.js';
import 'vue';
import '../utils/types.js';

/**
 * Show migrating guide in browser console.
 *
 * Usage:
 * import Migrating from 'element-ui/src/mixins/migrating';
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
var Migrating = {
  mounted() {
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
        console.warn(`[Element Migrating][${this.$options.name}][Attribute]: ${props[propName]}`);
      }
    }
    for (var eventName in definedEvents) {
      eventName = kebabCase(eventName); // compatible with camel case
      if (events[eventName]) {
        console.warn(`[Element Migrating][${this.$options.name}][Event]: ${events[eventName]}`);
      }
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {},
        events: {}
      };
    }
  }
};

export { Migrating as default };
