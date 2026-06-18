import ElSelect from 'element-ui/packages/select';
import ElOption from 'element-ui/packages/option';
import ElInput from 'element-ui/packages/input';
import Locale from 'element-ui/lib/mixins/locale';
import { valueEquals } from 'element-ui/lib/utils/util';

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

var script = {
  name: 'ElPager',
  props: {
    currentPage: Number,
    pageCount: Number,
    pagerCount: Number,
    disabled: Boolean
  },
  watch: {
    showPrevMore: function showPrevMore(val) {
      if (!val) this.quickprevIconClass = 'el-icon-more';
    },
    showNextMore: function showNextMore(val) {
      if (!val) this.quicknextIconClass = 'el-icon-more';
    }
  },
  methods: {
    onPagerClick: function onPagerClick(event) {
      var target = event.target;
      if (target.tagName === 'UL' || this.disabled) {
        return;
      }
      var newPage = Number(event.target.textContent);
      var pageCount = this.pageCount;
      var currentPage = this.currentPage;
      var pagerCountOffset = this.pagerCount - 2;
      if (target.className.indexOf('more') !== -1) {
        if (target.className.indexOf('quickprev') !== -1) {
          newPage = currentPage - pagerCountOffset;
        } else if (target.className.indexOf('quicknext') !== -1) {
          newPage = currentPage + pagerCountOffset;
        }
      }

      /* istanbul ignore if */
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }
        if (newPage > pageCount) {
          newPage = pageCount;
        }
      }
      if (newPage !== currentPage) {
        this.$emit('change', newPage);
      }
    },
    onMouseenter: function onMouseenter(direction) {
      if (this.disabled) return;
      if (direction === 'left') {
        this.quickprevIconClass = 'el-icon-d-arrow-left';
      } else {
        this.quicknextIconClass = 'el-icon-d-arrow-right';
      }
    }
  },
  computed: {
    pagers: function pagers() {
      var pagerCount = this.pagerCount;
      var halfPagerCount = (pagerCount - 1) / 2;
      var currentPage = Number(this.currentPage);
      var pageCount = Number(this.pageCount);
      var showPrevMore = false;
      var showNextMore = false;
      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }
      var array = [];
      if (showPrevMore && !showNextMore) {
        var startPage = pageCount - (pagerCount - 2);
        for (var i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (var _i = 2; _i < pagerCount; _i++) {
          array.push(_i);
        }
      } else if (showPrevMore && showNextMore) {
        var offset = Math.floor(pagerCount / 2) - 1;
        for (var _i2 = currentPage - offset; _i2 <= currentPage + offset; _i2++) {
          array.push(_i2);
        }
      } else {
        for (var _i3 = 2; _i3 < pageCount; _i3++) {
          array.push(_i3);
        }
      }
      this.showPrevMore = showPrevMore;
      this.showNextMore = showNextMore;
      return array;
    }
  },
  data: function data() {
    return {
      current: null,
      showPrevMore: false,
      showNextMore: false,
      quicknextIconClass: 'el-icon-more',
      quickprevIconClass: 'el-icon-more'
    };
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("ul", {
    staticClass: "el-pager",
    on: {
      click: _vm.onPagerClick
    }
  }, [_vm.pageCount > 0 ? _c("li", {
    staticClass: "number",
    class: {
      active: _vm.currentPage === 1,
      disabled: _vm.disabled
    }
  }, [_vm._v("1")]) : _vm._e(), _vm._v(" "), _vm.showPrevMore ? _c("li", {
    staticClass: "el-icon more btn-quickprev",
    class: [_vm.quickprevIconClass, {
      disabled: _vm.disabled
    }],
    on: {
      mouseenter: function mouseenter($event) {
        _vm.onMouseenter("left");
      },
      mouseleave: function mouseleave($event) {
        _vm.quickprevIconClass = "el-icon-more";
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.pagers, function (pager) {
    return _c("li", {
      key: pager,
      staticClass: "number",
      class: {
        active: _vm.currentPage === pager,
        disabled: _vm.disabled
      }
    }, [_vm._v(_vm._s(pager))]);
  }), _vm._v(" "), _vm.showNextMore ? _c("li", {
    staticClass: "el-icon more btn-quicknext",
    class: [_vm.quicknextIconClass, {
      disabled: _vm.disabled
    }],
    on: {
      mouseenter: function mouseenter($event) {
        _vm.onMouseenter("right");
      },
      mouseleave: function mouseleave($event) {
        _vm.quicknextIconClass = "el-icon-more";
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.pageCount > 1 ? _c("li", {
    staticClass: "number",
    class: {
      active: _vm.currentPage === _vm.pageCount,
      disabled: _vm.disabled
    }
  }, [_vm._v(_vm._s(_vm.pageCount))]) : _vm._e()], 2);
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

var Pagination = {
  name: 'ElPagination',
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    small: Boolean,
    total: Number,
    pageCount: Number,
    pagerCount: {
      type: Number,
      validator: function validator(value) {
        return (value | 0) === value && value > 4 && value < 22 && value % 2 === 1;
      },
      default: 7
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      default: 'prev, pager, next, jumper, ->, total'
    },
    pageSizes: {
      type: Array,
      default: function _default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    popperClass: String,
    prevText: String,
    nextText: String,
    background: Boolean,
    disabled: Boolean,
    hideOnSinglePage: Boolean
  },
  data: function data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0,
      lastEmittedPage: -1,
      userChangePageSize: false
    };
  },
  render: function render(h) {
    var layout = this.layout;
    if (!layout) return null;
    if (this.hideOnSinglePage && (!this.internalPageCount || this.internalPageCount === 1)) return null;
    var template = h("div", {
      "class": ['el-pagination', {
        'is-background': this.background,
        'el-pagination--small': this.small
      }]
    });
    var TEMPLATE_MAP = {
      prev: h("prev"),
      jumper: h("jumper"),
      pager: h("pager", {
        "attrs": {
          "currentPage": this.internalCurrentPage,
          "pageCount": this.internalPageCount,
          "pagerCount": this.pagerCount,
          "disabled": this.disabled
        },
        "on": {
          "change": this.handleCurrentChange
        }
      }),
      next: h("next"),
      sizes: h("sizes", {
        "attrs": {
          "pageSizes": this.pageSizes
        }
      }),
      slot: h("slot", [this.$slots.default ? this.$slots.default : '']),
      total: h("total")
    };
    var components = layout.split(',').map(function (item) {
      return item.trim();
    });
    var rightWrapper = h("div", {
      "class": "el-pagination__rightwrapper"
    });
    var haveRightWrapper = false;
    template.children = template.children || [];
    rightWrapper.children = rightWrapper.children || [];
    components.forEach(function (compo) {
      if (compo === '->') {
        haveRightWrapper = true;
        return;
      }
      if (!haveRightWrapper) {
        template.children.push(TEMPLATE_MAP[compo]);
      } else {
        rightWrapper.children.push(TEMPLATE_MAP[compo]);
      }
    });
    if (haveRightWrapper) {
      template.children.unshift(rightWrapper);
    }
    return template;
  },
  components: {
    Prev: {
      render: function render(h) {
        return h("button", {
          "attrs": {
            "type": "button",
            "disabled": this.$parent.disabled || this.$parent.internalCurrentPage <= 1
          },
          "class": "btn-prev",
          "on": {
            "click": this.$parent.prev
          }
        }, [this.$parent.prevText ? h("span", [this.$parent.prevText]) : h("i", {
          "class": "el-icon el-icon-arrow-left"
        })]);
      }
    },
    Next: {
      render: function render(h) {
        return h("button", {
          "attrs": {
            "type": "button",
            "disabled": this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0
          },
          "class": "btn-next",
          "on": {
            "click": this.$parent.next
          }
        }, [this.$parent.nextText ? h("span", [this.$parent.nextText]) : h("i", {
          "class": "el-icon el-icon-arrow-right"
        })]);
      }
    },
    Sizes: {
      mixins: [Locale],
      props: {
        pageSizes: Array
      },
      watch: {
        pageSizes: {
          immediate: true,
          handler: function handler(newVal, oldVal) {
            if (valueEquals(newVal, oldVal)) return;
            if (Array.isArray(newVal)) {
              this.$parent.internalPageSize = newVal.indexOf(this.$parent.pageSize) > -1 ? this.$parent.pageSize : this.pageSizes[0];
            }
          }
        }
      },
      render: function render(h) {
        var _this = this;
        return h("span", {
          "class": "el-pagination__sizes"
        }, [h("el-select", {
          "attrs": {
            "value": this.$parent.internalPageSize,
            "popperClass": this.$parent.popperClass || '',
            "size": "mini",
            "disabled": this.$parent.disabled
          },
          "on": {
            "input": this.handleChange
          }
        }, [this.pageSizes.map(function (item) {
          return h("el-option", {
            "attrs": {
              "value": item,
              "label": item + _this.t('el.pagination.pagesize')
            }
          });
        })])]);
      },
      components: {
        ElSelect: ElSelect,
        ElOption: ElOption
      },
      methods: {
        handleChange: function handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.userChangePageSize = true;
            this.$parent.$emit('update:pageSize', val);
            this.$parent.$emit('size-change', val);
          }
        }
      }
    },
    Jumper: {
      mixins: [Locale],
      components: {
        ElInput: ElInput
      },
      data: function data() {
        return {
          userInput: null
        };
      },
      watch: {
        '$parent.internalCurrentPage': function $parentInternalCurrentPage() {
          this.userInput = null;
        }
      },
      methods: {
        handleKeyup: function handleKeyup(_ref) {
          var keyCode = _ref.keyCode,
            target = _ref.target;
          // Chrome, Safari, Firefox triggers change event on Enter
          // Hack for IE: https://github.com/ElemeFE/element/issues/11710
          // Drop this method when we no longer supports IE
          if (keyCode === 13) {
            this.handleChange(target.value);
          }
        },
        handleInput: function handleInput(value) {
          this.userInput = value;
        },
        handleChange: function handleChange(value) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
          this.$parent.emitChange();
          this.userInput = null;
        }
      },
      render: function render(h) {
        return h("span", {
          "class": "el-pagination__jump"
        }, [this.t('el.pagination.goto'), h("el-input", {
          "class": "el-pagination__editor is-in-pagination",
          "attrs": {
            "min": 1,
            "max": this.$parent.internalPageCount,
            "value": this.userInput !== null ? this.userInput : this.$parent.internalCurrentPage,
            "type": "number",
            "disabled": this.$parent.disabled
          },
          "nativeOn": {
            "keyup": this.handleKeyup
          },
          "on": {
            "input": this.handleInput,
            "change": this.handleChange
          }
        }), this.t('el.pagination.pageClassifier')]);
      }
    },
    Total: {
      mixins: [Locale],
      render: function render(h) {
        return typeof this.$parent.total === 'number' ? h("span", {
          "class": "el-pagination__total"
        }, [this.t('el.pagination.total', {
          total: this.$parent.total
        })]) : '';
      }
    },
    Pager: __vue_component__
  },
  methods: {
    handleCurrentChange: function handleCurrentChange(val) {
      this.internalCurrentPage = this.getValidCurrentPage(val);
      this.userChangePageSize = true;
      this.emitChange();
    },
    prev: function prev() {
      if (this.disabled) return;
      var newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('prev-click', this.internalCurrentPage);
      this.emitChange();
    },
    next: function next() {
      if (this.disabled) return;
      var newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('next-click', this.internalCurrentPage);
      this.emitChange();
    },
    getValidCurrentPage: function getValidCurrentPage(value) {
      value = parseInt(value, 10);
      var havePageCount = typeof this.internalPageCount === 'number';
      var resetValue;
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1;
      } else {
        if (value < 1) {
          resetValue = 1;
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount;
        }
      }
      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1;
      } else if (resetValue === 0) {
        resetValue = 1;
      }
      return resetValue === undefined ? value : resetValue;
    },
    emitChange: function emitChange() {
      var _this2 = this;
      this.$nextTick(function () {
        if (_this2.internalCurrentPage !== _this2.lastEmittedPage || _this2.userChangePageSize) {
          _this2.$emit('current-change', _this2.internalCurrentPage);
          _this2.lastEmittedPage = _this2.internalCurrentPage;
          _this2.userChangePageSize = false;
        }
      });
    }
  },
  computed: {
    internalPageCount: function internalPageCount() {
      if (typeof this.total === 'number') {
        return Math.max(1, Math.ceil(this.total / this.internalPageSize));
      } else if (typeof this.pageCount === 'number') {
        return Math.max(1, this.pageCount);
      }
      return null;
    }
  },
  watch: {
    currentPage: {
      immediate: true,
      handler: function handler(val) {
        this.internalCurrentPage = this.getValidCurrentPage(val);
      }
    },
    pageSize: {
      immediate: true,
      handler: function handler(val) {
        this.internalPageSize = isNaN(val) ? 10 : val;
      }
    },
    internalCurrentPage: {
      immediate: true,
      handler: function handler(newVal) {
        this.$emit('update:currentPage', newVal);
        this.lastEmittedPage = -1;
      }
    },
    internalPageCount: function internalPageCount(newVal) {
      /* istanbul ignore if */
      var oldPage = this.internalCurrentPage;
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1;
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        this.userChangePageSize && this.emitChange();
      }
      this.userChangePageSize = false;
    }
  }
};

/* istanbul ignore next */
Pagination.install = function (Vue) {
  Vue.component(Pagination.name, Pagination);
};

export { Pagination as default };
