import Popup from './utils/popup/index.js';
import Migrating from './mixins/migrating.js';
import emitter from './mixins/emitter.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import 'vue';
import './utils/merge.js';
import './utils/popup/popup-manager.js';
import './utils/dom.js';
import './utils/scrollbar-width.js';
import './utils/util.js';
import './utils/types.js';

//
var script = {
  name: 'ElDialog',
  mixins: [Popup, emitter, Migrating],
  props: {
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: Boolean
  },
  data() {
    return {
      closed: false,
      key: 0
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    }
  },
  computed: {
    style() {
      var style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'size': 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
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
      name: "dialog-fade"
    },
    on: {
      "after-enter": _vm.afterEnter,
      "after-leave": _vm.afterLeave
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-dialog__wrapper",
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) {
          return null;
        }
        return _vm.handleWrapperClick($event);
      }
    }
  }, [_c("div", {
    key: _vm.key,
    ref: "dialog",
    class: ["el-dialog", {
      "is-fullscreen": _vm.fullscreen,
      "el-dialog--center": _vm.center
    }, _vm.customClass],
    style: _vm.style,
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": _vm.title || "dialog"
    }
  }, [_c("div", {
    staticClass: "el-dialog__header"
  }, [_vm._t("title", [_c("span", {
    staticClass: "el-dialog__title"
  }, [_vm._v(_vm._s(_vm.title))])]), _vm._v(" "), _vm.showClose ? _c("button", {
    staticClass: "el-dialog__headerbtn",
    attrs: {
      type: "button",
      "aria-label": "Close"
    },
    on: {
      click: _vm.handleClose
    }
  }, [_c("i", {
    staticClass: "el-dialog__close el-icon el-icon-close"
  })]) : _vm._e()], 2), _vm._v(" "), _vm.rendered ? _c("div", {
    staticClass: "el-dialog__body"
  }, [_vm._t("default")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.footer ? _c("div", {
    staticClass: "el-dialog__footer"
  }, [_vm._t("footer")], 2) : _vm._e()])])]);
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

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
