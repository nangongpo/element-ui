import Vue from 'vue';
import { n as normalizeComponent } from './normalize-component-01820469.js';
import merge from '../utils/merge.js';
import PopupManager from '../utils/popup/popup-manager.js';
import '../utils/dom.js';
import { isVNode } from '../utils/vdom.js';

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
      title: '',
      message: '',
      duration: 4500,
      type: '',
      showClose: true,
      customClass: '',
      iconClass: '',
      onClose: null,
      onClick: null,
      closed: false,
      verticalOffset: 0,
      timer: null,
      dangerouslyUseHTMLString: false,
      position: 'top-right'
    };
  },
  computed: {
    typeClass() {
      return this.type && typeMap[this.type] ? `el-icon-${typeMap[this.type]}` : '';
    },
    horizontalClass() {
      return this.position.indexOf('right') > -1 ? 'right' : 'left';
    },
    verticalProperty() {
      return /^top-/.test(this.position) ? 'top' : 'bottom';
    },
    positionStyle() {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`
      };
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      }
    }
  },
  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    click() {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose();
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
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer(); // detele 取消倒计时
      } else if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      } else {
        this.startTimer(); // 恢复倒计时
      }
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close();
        }
      }, this.duration);
    }
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
      name: "el-notification-fade"
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    class: ["el-notification", _vm.customClass, _vm.horizontalClass],
    style: _vm.positionStyle,
    attrs: {
      role: "alert"
    },
    on: {
      mouseenter: function mouseenter($event) {
        _vm.clearTimer();
      },
      mouseleave: function mouseleave($event) {
        _vm.startTimer();
      },
      click: _vm.click
    }
  }, [_vm.type || _vm.iconClass ? _c("i", {
    staticClass: "el-notification__icon",
    class: [_vm.typeClass, _vm.iconClass]
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-notification__group",
    class: {
      "is-with-icon": _vm.typeClass || _vm.iconClass
    }
  }, [_c("h2", {
    staticClass: "el-notification__title",
    domProps: {
      textContent: _vm._s(_vm.title)
    }
  }), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.message,
      expression: "message"
    }],
    staticClass: "el-notification__content"
  }, [_vm._t("default", [!_vm.dangerouslyUseHTMLString ? _c("p", [_vm._v(_vm._s(_vm.message))]) : _c("p", {
    domProps: {
      innerHTML: _vm._s(_vm.message)
    }
  })])], 2), _vm._v(" "), _vm.showClose ? _c("div", {
    staticClass: "el-notification__closeBtn el-icon-close",
    on: {
      click: function click($event) {
        $event.stopPropagation();
        return _vm.close($event);
      }
    }
  }) : _vm._e()])])]);
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

var NotificationConstructor = Vue.extend(__vue_component__);
var instance;
var instances = [];
var seed = 1;
var _Notification = function Notification(options) {
  if (Vue.prototype.$isServer) return;
  options = merge({}, options);
  var userOnClose = options.onClose;
  var id = 'notification_' + seed++;
  var position = options.position || 'top-right';
  options.onClose = function () {
    _Notification.close(id, userOnClose);
  };
  instance = new NotificationConstructor({
    data: options
  });
  if (isVNode(options.message)) {
    instance.$slots.default = [options.message];
    options.message = 'REPLACED_BY_VNODE';
  }
  instance.id = id;
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible = true;
  instance.dom = instance.$el;
  instance.dom.style.zIndex = PopupManager.nextZIndex();
  var verticalOffset = options.offset || 0;
  instances.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  verticalOffset += 16;
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
  return instance;
};
['success', 'warning', 'info', 'error'].forEach(type => {
  _Notification[type] = options => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options
      };
    }
    options.type = type;
    return _Notification(options);
  };
});
_Notification.close = function (id, userOnClose) {
  var index = -1;
  var len = instances.length;
  var instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i;
      return true;
    }
    return false;
  })[0];
  if (!instance) return;
  if (typeof userOnClose === 'function') {
    userOnClose(instance);
  }
  instances.splice(index, 1);
  if (len <= 1) return;
  var position = instance.position;
  var removedHeight = instance.dom.offsetHeight;
  for (var i = index; i < len - 1; i++) {
    if (instances[i].position === position) {
      instances[i].dom.style[instance.verticalProperty] = parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
    }
  }
};
_Notification.closeAll = function () {
  for (var i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export { _Notification as _ };
