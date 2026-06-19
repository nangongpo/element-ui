import Vue from 'vue';
import Popup from 'element-ui/lib/utils/popup';
import Locale from 'element-ui/lib/mixins/locale';
import ElInput from 'element-ui/lib/input';
import ElButton from 'element-ui/lib/button';
import { addClass, removeClass } from 'element-ui/lib/utils/dom';
import { t } from 'element-ui/lib/locale';
import Dialog from 'element-ui/lib/utils/aria-dialog';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import merge from 'element-ui/lib/utils/merge';
import { isVNode } from 'element-ui/lib/utils/vdom';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

//
var messageBox;
var typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};
var script = {
  mixins: [Popup, Locale],
  props: {
    modal: {
      default: true
    },
    lockScroll: {
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    },
    closeOnHashChange: {
      default: true
    },
    center: {
      default: false,
      type: Boolean
    },
    roundButton: {
      default: false,
      type: Boolean
    }
  },
  components: {
    ElInput: ElInput,
    ElButton: ElButton
  },
  computed: {
    icon: function icon() {
      var type = this.type,
        iconClass = this.iconClass;
      return iconClass || (type && typeMap[type] ? "el-icon-".concat(typeMap[type]) : '');
    },
    confirmButtonClasses: function confirmButtonClasses() {
      return "el-button--primary ".concat(this.confirmButtonClass);
    },
    cancelButtonClasses: function cancelButtonClasses() {
      return "".concat(this.cancelButtonClass);
    }
  },
  methods: {
    getSafeClose: function getSafeClose() {
      var _this = this;
      var currentId = this.uid;
      return function () {
        _this.$nextTick(function () {
          if (currentId === _this.uid) _this.doClose();
        });
      };
    },
    doClose: function doClose() {
      var _this2 = this;
      if (!this.visible) return;
      this.visible = false;
      this._closing = true;
      this.onClose && this.onClose();
      messageBox.closeDialog(); // 解绑
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200);
      }
      this.opened = false;
      this.doAfterClose();
      setTimeout(function () {
        if (_this2.action) _this2.callback(_this2.action, _this2);
      });
    },
    handleWrapperClick: function handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel');
      }
    },
    handleInputEnter: function handleInputEnter() {
      if (this.inputType !== 'textarea') {
        return this.handleAction('confirm');
      }
    },
    handleAction: function handleAction(action) {
      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
        return;
      }
      this.action = action;
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose();
        this.beforeClose(action, this, this.close);
      } else {
        this.doClose();
      }
    },
    validate: function validate() {
      if (this.$type === 'prompt') {
        var inputPattern = this.inputPattern;
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
          addClass(this.getInputElement(), 'invalid');
          return false;
        }
        var inputValidator = this.inputValidator;
        if (typeof inputValidator === 'function') {
          var validateResult = inputValidator(this.inputValue);
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
            addClass(this.getInputElement(), 'invalid');
            return false;
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult;
            addClass(this.getInputElement(), 'invalid');
            return false;
          }
        }
      }
      this.editorErrorMessage = '';
      removeClass(this.getInputElement(), 'invalid');
      return true;
    },
    getFirstFocus: function getFirstFocus() {
      var btn = this.$el.querySelector('.el-message-box__btns .el-button');
      var title = this.$el.querySelector('.el-message-box__btns .el-message-box__title');
      return btn || title;
    },
    getInputElement: function getInputElement() {
      var inputRefs = this.$refs.input.$refs;
      return inputRefs.input || inputRefs.textarea;
    },
    handleClose: function handleClose() {
      this.handleAction('close');
    }
  },
  watch: {
    inputValue: {
      immediate: true,
      handler: function handler(val) {
        var _this3 = this;
        this.$nextTick(function (_) {
          if (_this3.$type === 'prompt' && val !== null) {
            _this3.validate();
          }
        });
      }
    },
    visible: function visible(val) {
      var _this4 = this;
      if (val) {
        this.uid++;
        if (this.$type === 'alert' || this.$type === 'confirm') {
          this.$nextTick(function () {
            _this4.$refs.confirm.$el.focus();
          });
        }
        this.focusAfterClosed = document.activeElement;
        messageBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus());
      }

      // prompt
      if (this.$type !== 'prompt') return;
      if (val) {
        setTimeout(function () {
          if (_this4.$refs.input && _this4.$refs.input.$el) {
            _this4.getInputElement().focus();
          }
        }, 500);
      } else {
        this.editorErrorMessage = '';
        removeClass(this.getInputElement(), 'invalid');
      }
    }
  },
  mounted: function mounted() {
    var _this5 = this;
    this.$nextTick(function () {
      if (_this5.closeOnHashChange) {
        window.addEventListener('hashchange', _this5.close);
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close);
    }
    setTimeout(function () {
      messageBox.closeDialog();
    });
  },
  data: function data() {
    return {
      uid: 1,
      title: undefined,
      message: '',
      type: '',
      iconClass: '',
      customClass: '',
      showInput: false,
      inputValue: null,
      inputPlaceholder: '',
      inputType: 'text',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancelButton: false,
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      editorErrorMessage: null,
      callback: null,
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null,
      isOnComposition: false,
      distinguishCancelAndClose: false
    };
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
      name: "msgbox-fade"
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-message-box__wrapper",
    attrs: {
      tabindex: "-1",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": _vm.title || "dialog"
    },
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) {
          return null;
        }
        return _vm.handleWrapperClick($event);
      }
    }
  }, [_c("div", {
    staticClass: "el-message-box",
    class: [_vm.customClass, _vm.center && "el-message-box--center"]
  }, [_vm.title !== null ? _c("div", {
    staticClass: "el-message-box__header"
  }, [_c("div", {
    staticClass: "el-message-box__title"
  }, [_vm.icon && _vm.center ? _c("div", {
    class: ["el-message-box__status", _vm.icon]
  }) : _vm._e(), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.title))])]), _vm._v(" "), _vm.showClose ? _c("button", {
    staticClass: "el-message-box__headerbtn",
    attrs: {
      type: "button",
      "aria-label": "Close"
    },
    on: {
      click: function click($event) {
        _vm.handleAction(_vm.distinguishCancelAndClose ? "close" : "cancel");
      },
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        _vm.handleAction(_vm.distinguishCancelAndClose ? "close" : "cancel");
      }
    }
  }, [_c("i", {
    staticClass: "el-message-box__close el-icon-close"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-message-box__content"
  }, [_c("div", {
    staticClass: "el-message-box__container"
  }, [_vm.icon && !_vm.center && _vm.message !== "" ? _c("div", {
    class: ["el-message-box__status", _vm.icon]
  }) : _vm._e(), _vm._v(" "), _vm.message !== "" ? _c("div", {
    staticClass: "el-message-box__message"
  }, [_vm._t("default", [!_vm.dangerouslyUseHTMLString ? _c("p", [_vm._v(_vm._s(_vm.message))]) : _c("p", {
    domProps: {
      innerHTML: _vm._s(_vm.message)
    }
  })])], 2) : _vm._e()]), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showInput,
      expression: "showInput"
    }],
    staticClass: "el-message-box__input"
  }, [_c("el-input", {
    ref: "input",
    attrs: {
      type: _vm.inputType,
      placeholder: _vm.inputPlaceholder
    },
    nativeOn: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.handleInputEnter($event);
      }
    },
    model: {
      value: _vm.inputValue,
      callback: function callback($$v) {
        _vm.inputValue = $$v;
      },
      expression: "inputValue"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "el-message-box__errormsg",
    style: {
      visibility: !!_vm.editorErrorMessage ? "visible" : "hidden"
    }
  }, [_vm._v(_vm._s(_vm.editorErrorMessage))])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "el-message-box__btns"
  }, [_vm.showCancelButton ? _c("el-button", {
    class: [_vm.cancelButtonClasses],
    attrs: {
      loading: _vm.cancelButtonLoading,
      round: _vm.roundButton,
      size: "small"
    },
    on: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        _vm.handleAction("cancel");
      }
    },
    nativeOn: {
      click: function click($event) {
        _vm.handleAction("cancel");
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.cancelButtonText || _vm.t("el.messagebox.cancel")) + "\n        ")]) : _vm._e(), _vm._v(" "), _c("el-button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showConfirmButton,
      expression: "showConfirmButton"
    }],
    ref: "confirm",
    class: [_vm.confirmButtonClasses],
    attrs: {
      loading: _vm.confirmButtonLoading,
      round: _vm.roundButton,
      size: "small"
    },
    on: {
      keydown: function keydown($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        _vm.handleAction("confirm");
      }
    },
    nativeOn: {
      click: function click($event) {
        _vm.handleAction("confirm");
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.confirmButtonText || _vm.t("el.messagebox.confirm")) + "\n        ")])], 1)])])]);
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var defaults = {
  title: null,
  message: '',
  type: '',
  iconClass: '',
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  inputValue: null,
  inputPlaceholder: '',
  inputType: 'text',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: '',
  cancelButtonText: '',
  confirmButtonClass: '',
  cancelButtonClass: '',
  customClass: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  center: false,
  roundButton: false,
  distinguishCancelAndClose: false
};
var MessageBoxConstructor = Vue.extend(__vue_component__);
var currentMsg, instance;
var msgQueue = [];
var defaultCallback = function defaultCallback(action) {
  if (currentMsg) {
    var callback = currentMsg.callback;
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.showInput) {
          currentMsg.resolve({
            value: instance.inputValue,
            action: action
          });
        } else {
          currentMsg.resolve(action);
        }
      } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
        currentMsg.reject(action);
      }
    }
  }
};
var initInstance = function initInstance() {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  });
  instance.callback = defaultCallback;
};
var _showNextMsg = function showNextMsg() {
  if (!instance) {
    initInstance();
  }
  instance.action = '';
  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();
      var options = currentMsg.options;
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }
      var oldCb = instance.callback;
      instance.callback = function (action, instance) {
        oldCb(action, instance);
        _showNextMsg();
      };
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message];
        instance.message = null;
      } else {
        delete instance.$slots.default;
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(function (prop) {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });
      document.body.appendChild(instance.$el);
      Vue.nextTick(function () {
        instance.visible = true;
      });
    }
  }
};
var _MessageBox = function MessageBox(options, callback) {
  if (Vue.prototype.$isServer) return;
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options
    };
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }
  if (typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, _MessageBox.defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });
      _showNextMsg();
    });
  } else {
    msgQueue.push({
      options: merge({}, defaults, _MessageBox.defaults, options),
      callback: callback
    });
    _showNextMsg();
  }
};
_MessageBox.setDefaults = function (defaults) {
  _MessageBox.defaults = defaults;
};
_MessageBox.alert = function (message, title, options) {
  if (_typeof(title) === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  return _MessageBox(merge({
    title: title,
    message: message,
    $type: 'alert',
    closeOnPressEscape: false,
    closeOnClickModal: false
  }, options));
};
_MessageBox.confirm = function (message, title, options) {
  if (_typeof(title) === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  return _MessageBox(merge({
    title: title,
    message: message,
    $type: 'confirm',
    showCancelButton: true
  }, options));
};
_MessageBox.prompt = function (message, title, options) {
  if (_typeof(title) === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  return _MessageBox(merge({
    title: title,
    message: message,
    showCancelButton: true,
    showInput: true,
    $type: 'prompt'
  }, options));
};
_MessageBox.close = function () {
  instance.doClose();
  instance.visible = false;
  msgQueue = [];
  currentMsg = null;
};

export { _MessageBox as default };
