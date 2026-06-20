import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import Vue from 'vue';
import { n as normalizeComponent } from './normalize-component-01820469.js';
import PopupManager from '../utils/popup/popup-manager.js';
import '../utils/dom.js';
import { isVNode } from '../utils/vdom.js';
import { isObject } from '../utils/types.js';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};
var script = {
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    };
  },
  computed: {
    typeClass() {
      return this.type && !this.iconClass ? `el-message__icon el-icon-${typeMap[this.type]}` : '';
    },
    positionStyle() {
      return {
        'top': `${this.verticalOffset}px`
      };
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    }
  },
  methods: {
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    }
  },
  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      name: "el-message-fade"
    },
    on: {
      "after-leave": _vm.handleAfterLeave
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    class: ["el-message", _vm.type && !_vm.iconClass ? "el-message--" + _vm.type : "", _vm.center ? "is-center" : "", _vm.showClose ? "is-closable" : "", _vm.customClass],
    style: _vm.positionStyle,
    attrs: {
      role: "alert"
    },
    on: {
      mouseenter: _vm.clearTimer,
      mouseleave: _vm.startTimer
    }
  }, [_vm.iconClass ? _c("i", {
    class: _vm.iconClass
  }) : _c("i", {
    class: _vm.typeClass
  }), _vm._v(" "), _vm._t("default", [!_vm.dangerouslyUseHTMLString ? _c("p", {
    staticClass: "el-message__content"
  }, [_vm._v(_vm._s(_vm.message))]) : _c("p", {
    staticClass: "el-message__content",
    domProps: {
      innerHTML: _vm._s(_vm.message)
    }
  })]), _vm._v(" "), _vm.showClose ? _c("i", {
    staticClass: "el-message__closeBtn el-icon-close",
    on: {
      click: _vm.close
    }
  }) : _vm._e()], 2)]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var MessageConstructor = Vue.extend(__vue_component__);
var instance;
var instances = [];
var seed = 1;
var _Message = function Message(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  var userOnClose = options.onClose;
  var id = 'message_' + seed++;
  options.onClose = function () {
    _Message.close(id, userOnClose);
  };
  instance = new MessageConstructor({
    data: options
  });
  instance.id = id;
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message];
    instance.message = null;
  }
  instance.$mount();
  document.body.appendChild(instance.$el);
  var verticalOffset = options.offset || 20;
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instance.$el.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  return instance;
};
['success', 'warning', 'info', 'error'].forEach(type => {
  _Message[type] = options => {
    if (isObject(options) && !isVNode(options)) {
      return _Message(_objectSpread(_objectSpread({}, options), {}, {
        type
      }));
    }
    return _Message({
      type,
      message: options
    });
  };
});
_Message.close = function (id, userOnClose) {
  var len = instances.length;
  var index = -1;
  var removedHeight;
  for (var i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return;
  for (var _i = index; _i < len - 1; _i++) {
    var dom = instances[_i].$el;
    dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
  }
};
_Message.closeAll = function () {
  for (var i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export { _Message as _ };
