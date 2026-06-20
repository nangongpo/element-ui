import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { isFunction } from './utils/types.js';
import 'vue';

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var DescriptionsRow = {
  name: 'ElDescriptionsRow',
  props: {
    row: {
      type: Array
    }
  },
  inject: ['elDescriptions'],
  render(h) {
    var elDescriptions = this.elDescriptions;
    var row = (this.row || []).map(item => {
      return _objectSpread$1(_objectSpread$1({}, item), {}, {
        label: item.slots.label || item.props.label
      }, ['labelClassName', 'contentClassName', 'labelStyle', 'contentStyle'].reduce((res, key) => {
        res[key] = item.props[key] || elDescriptions[key];
        return res;
      }, {}));
    });
    if (elDescriptions.direction === 'vertical') {
      return h("tbody", [h("tr", {
        "class": "el-descriptions-row"
      }, [row.map(item => {
        return h("th", {
          "class": {
            'el-descriptions-item__cell': true,
            'el-descriptions-item__label': true,
            'has-colon': elDescriptions.border ? false : elDescriptions.colon,
            'is-bordered-label': elDescriptions.border,
            [item.labelClassName]: true
          },
          "style": item.labelStyle,
          "attrs": {
            "colSpan": item.props.span
          }
        }, [item.label]);
      })]), h("tr", {
        "class": "el-descriptions-row"
      }, [row.map(item => {
        return h("td", {
          "class": ['el-descriptions-item__cell', 'el-descriptions-item__content', item.contentClassName],
          "style": item.contentStyle,
          "attrs": {
            "colSpan": item.props.span
          }
        }, [item.slots.default]);
      })])]);
    }
    if (elDescriptions.border) {
      return h("tbody", [h("tr", {
        "class": "el-descriptions-row"
      }, [row.map(item => {
        return [h("th", {
          "class": {
            'el-descriptions-item__cell': true,
            'el-descriptions-item__label': true,
            'is-bordered-label': elDescriptions.border,
            [item.labelClassName]: true
          },
          "style": item.labelStyle,
          "attrs": {
            "colSpan": "1"
          }
        }, [item.label]), h("td", {
          "class": ['el-descriptions-item__cell', 'el-descriptions-item__content', item.contentClassName],
          "style": item.contentStyle,
          "attrs": {
            "colSpan": item.props.span * 2 - 1
          }
        }, [item.slots.default])];
      })])]);
    }
    return h("tbody", [h("tr", {
      "class": "el-descriptions-row"
    }, [row.map(item => {
      return h("td", {
        "class": "el-descriptions-item el-descriptions-item__cell",
        "attrs": {
          "colSpan": item.props.span
        }
      }, [h("div", {
        "class": "el-descriptions-item__container"
      }, [h("span", {
        "class": {
          'el-descriptions-item__label': true,
          'has-colon': elDescriptions.colon,
          [item.labelClassName]: true
        },
        "style": item.labelStyle
      }, [item.label]), h("span", {
        "class": ['el-descriptions-item__content', item.contentClassName],
        "style": item.contentStyle
      }, [item.slots.default])])]);
    })])]);
  }
};

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Descriptions = {
  name: 'ElDescriptions',
  components: {
    [DescriptionsRow.name]: DescriptionsRow
  },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    column: {
      type: Number,
      default: 3
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    size: {
      type: String
      // validator: isValidComponentSize,
    },
    title: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    },
    labelStyle: {
      type: Object
    },
    contentStyle: {
      type: Object
    },
    labelClassName: {
      type: String,
      default: ''
    },
    contentClassName: {
      type: String,
      default: ''
    },
    colon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    descriptionsSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  provide() {
    return {
      elDescriptions: this
    };
  },
  methods: {
    getOptionProps(vnode) {
      if (vnode.componentOptions) {
        var componentOptions = vnode.componentOptions;
        var _componentOptions$pro = componentOptions.propsData,
          propsData = _componentOptions$pro === void 0 ? {} : _componentOptions$pro,
          _componentOptions$Cto = componentOptions.Ctor,
          Ctor = _componentOptions$Cto === void 0 ? {} : _componentOptions$Cto;
        var props = (Ctor.options || {}).props || {};
        var res = {};
        for (var k in props) {
          var v = props[k];
          var defaultValue = v.default;
          if (defaultValue !== undefined) {
            res[k] = isFunction(defaultValue) ? defaultValue.call(vnode) : defaultValue;
          }
        }
        return _objectSpread(_objectSpread({}, res), propsData);
      }
      return {};
    },
    getSlots(vnode) {
      var componentOptions = vnode.componentOptions || {};
      var children = vnode.children || componentOptions.children || [];
      var slots = {};
      children.forEach(child => {
        if (!this.isEmptyElement(child)) {
          var name = child.data && child.data.slot || 'default';
          slots[name] = slots[name] || [];
          if (child.tag === 'template') {
            slots[name].push(child.children);
          } else {
            slots[name].push(child);
          }
        }
      });
      return _objectSpread({}, slots);
    },
    isEmptyElement(c) {
      return !(c.tag || c.text && c.text.trim() !== '');
    },
    filledNode(node, span, count, isLast = false) {
      if (!node.props) {
        node.props = {};
      }
      if (span > count) {
        node.props.span = count;
      }
      if (isLast) {
        // set the max span, cause of the last td
        node.props.span = count;
      }
      return node;
    },
    getRows() {
      var children = (this.$slots.default || []).filter(vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElDescriptionsItem');
      var nodes = children.map(vnode => {
        return {
          props: this.getOptionProps(vnode),
          slots: this.getSlots(vnode),
          vnode
        };
      });
      var rows = [];
      var temp = [];
      var count = this.column;
      nodes.forEach((node, index) => {
        var span = node.props.span || 1;
        if (index === children.length - 1) {
          temp.push(this.filledNode(node, span, count, true));
          rows.push(temp);
          return;
        }
        if (span < count) {
          count -= span;
          temp.push(node);
        } else {
          temp.push(this.filledNode(node, span, count));
          rows.push(temp);
          count = this.column;
          temp = [];
        }
      });
      return rows;
    }
  },
  render() {
    var h = arguments[0];
    var title = this.title,
      extra = this.extra,
      border = this.border,
      descriptionsSize = this.descriptionsSize,
      $slots = this.$slots;
    var rows = this.getRows();
    return h("div", {
      "class": "el-descriptions"
    }, [title || extra || $slots.title || $slots.extra ? h("div", {
      "class": "el-descriptions__header"
    }, [h("div", {
      "class": "el-descriptions__title"
    }, [$slots.title ? $slots.title : title]), h("div", {
      "class": "el-descriptions__extra"
    }, [$slots.extra ? $slots.extra : extra])]) : null, h("div", {
      "class": "el-descriptions__body"
    }, [h("table", {
      "class": ['el-descriptions__table', {
        'is-bordered': border
      }, descriptionsSize ? `el-descriptions--${descriptionsSize}` : '']
    }, [rows.map(row => h(DescriptionsRow, {
      "attrs": {
        "row": row
      }
    }))])])]);
  }
};

/* istanbul ignore next */
Descriptions.install = function install(Vue) {
  Vue.component(Descriptions.name, Descriptions);
};

export { Descriptions as default };
