import { _ as __vue_component__$1 } from './shared/picker-45e61d51.js';
import Scrollbar from './scrollbar.js';
import scrollIntoView from './utils/scroll-into-view.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import 'vue';
import './utils/clickoutside.js';
import './utils/dom.js';
import './utils/date-util.js';
import './utils/date.js';
import 'dayjs';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/advancedFormat.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';
import './utils/util.js';
import './utils/types.js';
import './utils/vue-popper.js';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './mixins/emitter.js';
import './input.js';
import './mixins/migrating.js';
import './utils/merge.js';
import './utils/shared.js';
import './shared/resize-event-51726919.js';
import './shared/throttle-54b44d30.js';
import './shared/debounce-e5482a73.js';
import './utils/scrollbar-width.js';

//
var parseTime = function parseTime(time) {
  var values = (time || '').split(':');
  if (values.length >= 2) {
    var hours = parseInt(values[0], 10);
    var minutes = parseInt(values[1], 10);
    return {
      hours,
      minutes
    };
  }
  /* istanbul ignore next */
  return null;
};
var compareTime = function compareTime(time1, time2) {
  var value1 = parseTime(time1);
  var value2 = parseTime(time2);
  var minutes1 = value1.minutes + value1.hours * 60;
  var minutes2 = value2.minutes + value2.hours * 60;
  if (minutes1 === minutes2) {
    return 0;
  }
  return minutes1 > minutes2 ? 1 : -1;
};
var formatTime = function formatTime(time) {
  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
};
var nextTime = function nextTime(time, step) {
  var timeValue = parseTime(time);
  var stepValue = parseTime(step);
  var next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes
  };
  next.minutes += stepValue.minutes;
  next.hours += stepValue.hours;
  next.hours += Math.floor(next.minutes / 60);
  next.minutes = next.minutes % 60;
  return formatTime(next);
};
var script = {
  components: {
    ElScrollbar: Scrollbar
  },
  watch: {
    value(val) {
      if (!val) return;
      this.$nextTick(() => this.scrollToOption());
    }
  },
  methods: {
    handleClick(item) {
      if (!item.disabled) {
        this.$emit('pick', item.value);
      }
    },
    handleClear() {
      this.$emit('pick', null);
    },
    scrollToOption(selector = '.selected') {
      var menu = this.$refs.popper.querySelector('.el-picker-panel__content');
      scrollIntoView(menu, menu.querySelector(selector));
    },
    handleMenuEnter() {
      var selected = this.items.map(item => item.value).indexOf(this.value) !== -1;
      var hasDefault = this.items.map(item => item.value).indexOf(this.defaultValue) !== -1;
      var option = selected && '.selected' || hasDefault && '.default' || '.time-select-item:not(.disabled)';
      this.$nextTick(() => this.scrollToOption(option));
    },
    scrollDown(step) {
      var items = this.items;
      var length = items.length;
      var total = items.length;
      var index = items.map(item => item.value).indexOf(this.value);
      while (total--) {
        index = (index + step + length) % length;
        if (!items[index].disabled) {
          this.$emit('pick', items[index].value, true);
          return;
        }
      }
    },
    isValidValue(date) {
      return this.items.filter(item => !item.disabled).map(item => item.value).indexOf(date) !== -1;
    },
    handleKeydown(event) {
      var keyCode = event.keyCode;
      if (keyCode === 38 || keyCode === 40) {
        var mapping = {
          40: 1,
          38: -1
        };
        var offset = mapping[keyCode.toString()];
        this.scrollDown(offset);
        event.stopPropagation();
        return;
      }
    }
  },
  data() {
    return {
      popperClass: '',
      start: '09:00',
      end: '18:00',
      step: '00:30',
      value: '',
      defaultValue: '',
      visible: false,
      minTime: '',
      maxTime: '',
      width: 0
    };
  },
  computed: {
    items() {
      var start = this.start;
      var end = this.end;
      var step = this.step;
      var result = [];
      if (start && end && step) {
        var current = start;
        while (compareTime(current, end) <= 0) {
          result.push({
            value: current,
            disabled: compareTime(current, this.minTime || '-1:-1') <= 0 || compareTime(current, this.maxTime || '100:100') >= 0
          });
          current = nextTime(current, step);
        }
      }
      return result;
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
      name: "el-zoom-in-top"
    },
    on: {
      "before-enter": _vm.handleMenuEnter,
      "after-leave": function afterLeave($event) {
        _vm.$emit("dodestroy");
      }
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    ref: "popper",
    staticClass: "el-picker-panel time-select el-popper",
    class: _vm.popperClass,
    style: {
      width: _vm.width + "px"
    }
  }, [_c("el-scrollbar", {
    attrs: {
      noresize: "",
      "wrap-class": "el-picker-panel__content"
    }
  }, _vm._l(_vm.items, function (item) {
    return _c("div", {
      key: item.value,
      staticClass: "time-select-item",
      class: {
        selected: _vm.value === item.value,
        disabled: item.disabled,
        default: item.value === _vm.defaultValue
      },
      attrs: {
        disabled: item.disabled
      },
      on: {
        click: function click($event) {
          _vm.handleClick(item);
        }
      }
    }, [_vm._v(_vm._s(item.value))]);
  }), 0)], 1)]);
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

var TimeSelect = {
  mixins: [__vue_component__$1],
  name: 'ElTimeSelect',
  componentName: 'ElTimeSelect',
  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },
  beforeCreate() {
    this.panel = __vue_component__;
  }
};

/* istanbul ignore next */
TimeSelect.install = function (Vue) {
  Vue.component(TimeSelect.name, TimeSelect);
};

export { TimeSelect as default };
