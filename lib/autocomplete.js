import { d as debounce } from './shared/debounce-e5482a73.js';
import __vue_component__$2 from './input.js';
import Clickoutside from './utils/clickoutside.js';
import Popper from './utils/vue-popper.js';
import emitter from './mixins/emitter.js';
import Scrollbar from './scrollbar.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import Migrating from './mixins/migrating.js';
import { generateId } from './utils/util.js';
import Focus from './mixins/focus.js';
import './shared/throttle-54b44d30.js';
import './utils/merge.js';
import './utils/shared.js';
import 'vue';
import './utils/dom.js';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './shared/resize-event-51726919.js';
import './utils/scrollbar-width.js';
import './utils/types.js';

//
var script$1 = {
  components: {
    ElScrollbar: Scrollbar
  },
  mixins: [Popper, emitter],
  componentName: 'ElAutocompleteSuggestions',
  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },
  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },
  methods: {
    select(item) {
      this.dispatch('ElAutocomplete', 'item-click', item);
    }
  },
  updated() {
    this.$nextTick(_ => {
      this.popperJS && this.updatePopper();
    });
  },
  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
    this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  },
  created() {
    this.$on('visible', (val, inputWidth) => {
      this.dropdownWidth = inputWidth + 'px';
      this.showPopper = val;
    });
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      name: "el-zoom-in-top"
    },
    on: {
      "after-leave": _vm.doDestroy
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showPopper,
      expression: "showPopper"
    }],
    staticClass: "el-autocomplete-suggestion el-popper",
    class: {
      "is-loading": !_vm.parent.hideLoading && _vm.parent.loading
    },
    style: {
      width: _vm.dropdownWidth
    },
    attrs: {
      role: "region"
    }
  }, [_c("el-scrollbar", {
    attrs: {
      tag: "ul",
      "wrap-class": "el-autocomplete-suggestion__wrap",
      "view-class": "el-autocomplete-suggestion__list"
    }
  }, [!_vm.parent.hideLoading && _vm.parent.loading ? _c("li", [_c("i", {
    staticClass: "el-icon-loading"
  })]) : _vm._t("default")], 2)], 1)]);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: 'ElAutocomplete',
  mixins: [emitter, Focus('input'), Migrating],
  inheritAttrs: false,
  componentName: 'ElAutocomplete',
  components: {
    ElInput: __vue_component__$2,
    ElAutocompleteSuggestions: __vue_component__$1
  },
  directives: {
    Clickoutside
  },
  props: {
    valueKey: {
      type: String,
      default: 'value'
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false
    };
  },
  computed: {
    suggestionVisible() {
      var suggestions = this.suggestions;
      var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      return (isValidData || this.loading) && this.activated;
    },
    id() {
      return `el-autocomplete-${generateId()}`;
    }
  },
  watch: {
    suggestionVisible(val) {
      var $input = this.getInput();
      if ($input) {
        this.broadcast('ElAutocompleteSuggestions', 'visible', [val, $input.offsetWidth]);
      }
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'custom-item': 'custom-item is removed, use scoped slot instead.',
          'props': 'props is removed, use value-key instead.'
        }
      };
    },
    getData(queryString) {
      if (this.suggestionDisabled) {
        return;
      }
      this.loading = true;
      this.fetchSuggestions(queryString, suggestions => {
        this.loading = false;
        if (this.suggestionDisabled) {
          return;
        }
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
          this.highlightedIndex = this.highlightFirstItem ? 0 : -1;
        } else {
          console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array');
        }
      });
    },
    handleInput(value) {
      this.$emit('input', value);
      this.suggestionDisabled = false;
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true;
        this.suggestions = [];
        return;
      }
      this.debouncedGetData(value);
    },
    handleChange(value) {
      this.$emit('change', value);
    },
    handleFocus(event) {
      this.activated = true;
      this.$emit('focus', event);
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value);
      }
    },
    handleBlur(event) {
      this.$emit('blur', event);
    },
    handleClear() {
      this.activated = false;
      this.$emit('clear');
    },
    close(e) {
      this.activated = false;
    },
    handleKeyEnter(e) {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault();
        this.select(this.suggestions[this.highlightedIndex]);
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', {
          value: this.value
        });
        this.$nextTick(_ => {
          this.suggestions = [];
          this.highlightedIndex = -1;
        });
      }
    },
    select(item) {
      this.$emit('input', item[this.valueKey]);
      this.$emit('select', item);
      this.$nextTick(_ => {
        this.suggestions = [];
        this.highlightedIndex = -1;
      });
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) {
        return;
      }
      if (index < 0) {
        this.highlightedIndex = -1;
        return;
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1;
      }
      var suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap');
      var suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li');
      var highlightItem = suggestionList[index];
      var scrollTop = suggestion.scrollTop;
      var offsetTop = highlightItem.offsetTop;
      if (offsetTop + highlightItem.scrollHeight > scrollTop + suggestion.clientHeight) {
        suggestion.scrollTop += highlightItem.scrollHeight;
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight;
      }
      this.highlightedIndex = index;
      var $input = this.getInput();
      $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`);
    },
    getInput() {
      return this.$refs.input.getInput();
    }
  },
  mounted() {
    this.debouncedGetData = debounce(this.debounce, this.getData);
    this.$on('item-click', item => {
      this.select(item);
    });
    var $input = this.getInput();
    $input.setAttribute('role', 'textbox');
    $input.setAttribute('aria-autocomplete', 'list');
    $input.setAttribute('aria-controls', 'id');
    $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`);
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy();
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.close,
      expression: "close"
    }],
    staticClass: "el-autocomplete",
    attrs: {
      "aria-haspopup": "listbox",
      role: "combobox",
      "aria-expanded": _vm.suggestionVisible,
      "aria-owns": _vm.id
    }
  }, [_c("el-input", _vm._b({
    ref: "input",
    on: {
      input: _vm.handleInput,
      change: _vm.handleChange,
      focus: _vm.handleFocus,
      blur: _vm.handleBlur,
      clear: _vm.handleClear
    },
    nativeOn: {
      keydown: [function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }
        $event.preventDefault();
        _vm.highlight(_vm.highlightedIndex - 1);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }
        $event.preventDefault();
        _vm.highlight(_vm.highlightedIndex + 1);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }
        return _vm.handleKeyEnter($event);
      }, function ($event) {
        if (!("button" in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
          return null;
        }
        return _vm.close($event);
      }]
    }
  }, "el-input", [_vm.$props, _vm.$attrs], false), [_vm.$slots.prepend ? _c("template", {
    slot: "prepend"
  }, [_vm._t("prepend")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.append ? _c("template", {
    slot: "append"
  }, [_vm._t("append")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.prefix ? _c("template", {
    slot: "prefix"
  }, [_vm._t("prefix")], 2) : _vm._e(), _vm._v(" "), _vm.$slots.suffix ? _c("template", {
    slot: "suffix"
  }, [_vm._t("suffix")], 2) : _vm._e()], 2), _vm._v(" "), _c("el-autocomplete-suggestions", {
    ref: "suggestions",
    class: [_vm.popperClass ? _vm.popperClass : ""],
    attrs: {
      "visible-arrow": "",
      "popper-options": _vm.popperOptions,
      "append-to-body": _vm.popperAppendToBody,
      placement: _vm.placement,
      id: _vm.id
    }
  }, _vm._l(_vm.suggestions, function (item, index) {
    return _c("li", {
      key: index,
      class: {
        highlighted: _vm.highlightedIndex === index
      },
      attrs: {
        id: _vm.id + "-item-" + index,
        role: "option",
        "aria-selected": _vm.highlightedIndex === index
      },
      on: {
        click: function click($event) {
          _vm.select(item);
        }
      }
    }, [_vm._t("default", [_vm._v("\n        " + _vm._s(item[_vm.valueKey]) + "\n      ")], {
      item: item
    })], 2);
  }), 0)], 1);
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
