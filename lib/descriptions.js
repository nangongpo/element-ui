import { isFunction } from 'element-ui/lib/utils/types.js';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var DescriptionsRow = {
  name: 'ElDescriptionsRow',
  props: {
    row: {
      type: Array
    }
  },
  inject: ['elDescriptions'],
  render: function render(h) {
    var elDescriptions = this.elDescriptions;
    var row = (this.row || []).map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        label: item.slots.label || item.props.label
      }, ['labelClassName', 'contentClassName', 'labelStyle', 'contentStyle'].reduce(function (res, key) {
        res[key] = item.props[key] || elDescriptions[key];
        return res;
      }, {}));
    });
    if (elDescriptions.direction === 'vertical') {
      return h("tbody", [h("tr", {
        "class": "el-descriptions-row"
      }, [row.map(function (item) {
        return h("th", {
          "class": _defineProperty({
            'el-descriptions-item__cell': true,
            'el-descriptions-item__label': true,
            'has-colon': elDescriptions.border ? false : elDescriptions.colon,
            'is-bordered-label': elDescriptions.border
          }, item.labelClassName, true),
          "style": item.labelStyle,
          "attrs": {
            "colSpan": item.props.span
          }
        }, [item.label]);
      })]), h("tr", {
        "class": "el-descriptions-row"
      }, [row.map(function (item) {
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
      }, [row.map(function (item) {
        return [h("th", {
          "class": _defineProperty({
            'el-descriptions-item__cell': true,
            'el-descriptions-item__label': true,
            'is-bordered-label': elDescriptions.border
          }, item.labelClassName, true),
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
    }, [row.map(function (item) {
      return h("td", {
        "class": "el-descriptions-item el-descriptions-item__cell",
        "attrs": {
          "colSpan": item.props.span
        }
      }, [h("div", {
        "class": "el-descriptions-item__container"
      }, [h("span", {
        "class": _defineProperty({
          'el-descriptions-item__label': true,
          'has-colon': elDescriptions.colon
        }, item.labelClassName, true),
        "style": item.labelStyle
      }, [item.label]), h("span", {
        "class": ['el-descriptions-item__content', item.contentClassName],
        "style": item.contentStyle
      }, [item.slots.default])])]);
    })])]);
  }
};

var Descriptions = {
  name: 'ElDescriptions',
  components: _defineProperty({}, DescriptionsRow.name, DescriptionsRow),
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
    descriptionsSize: function descriptionsSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  provide: function provide() {
    return {
      elDescriptions: this
    };
  },
  methods: {
    getOptionProps: function getOptionProps(vnode) {
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
        return _objectSpread2(_objectSpread2({}, res), propsData);
      }
      return {};
    },
    getSlots: function getSlots(vnode) {
      var _this = this;
      var componentOptions = vnode.componentOptions || {};
      var children = vnode.children || componentOptions.children || [];
      var slots = {};
      children.forEach(function (child) {
        if (!_this.isEmptyElement(child)) {
          var name = child.data && child.data.slot || 'default';
          slots[name] = slots[name] || [];
          if (child.tag === 'template') {
            slots[name].push(child.children);
          } else {
            slots[name].push(child);
          }
        }
      });
      return _objectSpread2({}, slots);
    },
    isEmptyElement: function isEmptyElement(c) {
      return !(c.tag || c.text && c.text.trim() !== '');
    },
    filledNode: function filledNode(node, span, count) {
      var isLast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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
    getRows: function getRows() {
      var _this2 = this;
      var children = (this.$slots.default || []).filter(function (vnode) {
        return vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElDescriptionsItem';
      });
      var nodes = children.map(function (vnode) {
        return {
          props: _this2.getOptionProps(vnode),
          slots: _this2.getSlots(vnode),
          vnode: vnode
        };
      });
      var rows = [];
      var temp = [];
      var count = this.column;
      nodes.forEach(function (node, index) {
        var span = node.props.span || 1;
        if (index === children.length - 1) {
          temp.push(_this2.filledNode(node, span, count, true));
          rows.push(temp);
          return;
        }
        if (span < count) {
          count -= span;
          temp.push(node);
        } else {
          temp.push(_this2.filledNode(node, span, count));
          rows.push(temp);
          count = _this2.column;
          temp = [];
        }
      });
      return rows;
    }
  },
  render: function render() {
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
      }, descriptionsSize ? "el-descriptions--".concat(descriptionsSize) : '']
    }, [rows.map(function (row) {
      return h(DescriptionsRow, {
        "attrs": {
          "row": row
        }
      });
    })])])]);
  }
};

/* istanbul ignore next */
Descriptions.install = function install(Vue) {
  Vue.component(Descriptions.name, Descriptions);
};

export { Descriptions as default };
