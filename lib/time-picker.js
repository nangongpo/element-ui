import { _ as __vue_component__$2 } from './shared/picker-45e61d51.js';
import { a as __vue_component__$1, _ as __vue_component__$3 } from './shared/time-01d74179.js';
import { parseDate, clearMilliseconds, limitTimeRange, timeWithinRange, modifyDate } from './utils/date-util.js';
import Locale from './mixins/locale.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import 'vue';
import './utils/clickoutside.js';
import './utils/dom.js';
import './utils/vue-popper.js';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './mixins/emitter.js';
import './input.js';
import './mixins/migrating.js';
import './utils/util.js';
import './utils/types.js';
import './utils/merge.js';
import './utils/shared.js';
import './scrollbar.js';
import './shared/resize-event-51726919.js';
import './shared/throttle-54b44d30.js';
import './shared/debounce-e5482a73.js';
import './utils/scrollbar-width.js';
import './directives/repeat-click.js';
import './utils/date.js';
import 'dayjs';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/advancedFormat.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';

//
var MIN_TIME = parseDate('00:00:00', 'HH:mm:ss');
var MAX_TIME = parseDate('23:59:59', 'HH:mm:ss');
var minTimeOfDay = function minTimeOfDay(date) {
  return modifyDate(MIN_TIME, date.getFullYear(), date.getMonth(), date.getDate());
};
var maxTimeOfDay = function maxTimeOfDay(date) {
  return modifyDate(MAX_TIME, date.getFullYear(), date.getMonth(), date.getDate());
};

// increase time by amount of milliseconds, but within the range of day
var advanceTime = function advanceTime(date, amount) {
  return new Date(Math.min(date.getTime() + amount, maxTimeOfDay(date).getTime()));
};
var script = {
  mixins: [Locale],
  components: {
    TimeSpinner: __vue_component__$1
  },
  computed: {
    showSeconds() {
      return (this.format || '').indexOf('ss') !== -1;
    },
    offset() {
      return this.showSeconds ? 11 : 8;
    },
    spinner() {
      return this.selectionRange[0] < this.offset ? this.$refs.minSpinner : this.$refs.maxSpinner;
    },
    btnDisabled() {
      return this.minDate.getTime() > this.maxDate.getTime();
    },
    amPmMode() {
      if ((this.format || '').indexOf('A') !== -1) return 'A';
      if ((this.format || '').indexOf('a') !== -1) return 'a';
      return '';
    }
  },
  data() {
    return {
      popperClass: '',
      minDate: new Date(),
      maxDate: new Date(),
      value: [],
      oldValue: [new Date(), new Date()],
      defaultValue: null,
      format: 'HH:mm:ss',
      visible: false,
      selectionRange: [0, 2],
      arrowControl: false
    };
  },
  watch: {
    value(value) {
      if (Array.isArray(value)) {
        this.minDate = new Date(value[0]);
        this.maxDate = new Date(value[1]);
      } else {
        if (Array.isArray(this.defaultValue)) {
          this.minDate = new Date(this.defaultValue[0]);
          this.maxDate = new Date(this.defaultValue[1]);
        } else if (this.defaultValue) {
          this.minDate = new Date(this.defaultValue);
          this.maxDate = advanceTime(new Date(this.defaultValue), 60 * 60 * 1000);
        } else {
          this.minDate = new Date();
          this.maxDate = advanceTime(new Date(), 60 * 60 * 1000);
        }
      }
    },
    visible(val) {
      if (val) {
        this.oldValue = this.value;
        this.$nextTick(() => this.$refs.minSpinner.emitSelectRange('hours'));
      }
    }
  },
  methods: {
    handleClear() {
      this.$emit('pick', null);
    },
    handleCancel() {
      this.$emit('pick', this.oldValue);
    },
    handleMinChange(date) {
      this.minDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleMaxChange(date) {
      this.maxDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleChange() {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$refs.minSpinner.selectableRange = [[minTimeOfDay(this.minDate), this.maxDate]];
        this.$refs.maxSpinner.selectableRange = [[this.minDate, maxTimeOfDay(this.maxDate)]];
        this.$emit('pick', [this.minDate, this.maxDate], true);
      }
    },
    setMinSelectionRange(start, end) {
      this.$emit('select-range', start, end, 'min');
      this.selectionRange = [start, end];
    },
    setMaxSelectionRange(start, end) {
      this.$emit('select-range', start, end, 'max');
      this.selectionRange = [start + this.offset, end + this.offset];
    },
    handleConfirm(visible = false) {
      var minSelectableRange = this.$refs.minSpinner.selectableRange;
      var maxSelectableRange = this.$refs.maxSpinner.selectableRange;
      this.minDate = limitTimeRange(this.minDate, minSelectableRange, this.format);
      this.maxDate = limitTimeRange(this.maxDate, maxSelectableRange, this.format);
      this.$emit('pick', [this.minDate, this.maxDate], visible);
    },
    adjustSpinners() {
      this.$refs.minSpinner.adjustSpinners();
      this.$refs.maxSpinner.adjustSpinners();
    },
    changeSelectionRange(step) {
      var list = this.showSeconds ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11];
      var mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : []);
      var index = list.indexOf(this.selectionRange[0]);
      var next = (index + step + list.length) % list.length;
      var half = list.length / 2;
      if (next < half) {
        this.$refs.minSpinner.emitSelectRange(mapping[next]);
      } else {
        this.$refs.maxSpinner.emitSelectRange(mapping[next - half]);
      }
    },
    isValidValue(date) {
      return Array.isArray(date) && timeWithinRange(this.minDate, this.$refs.minSpinner.selectableRange) && timeWithinRange(this.maxDate, this.$refs.maxSpinner.selectableRange);
    },
    handleKeydown(event) {
      var keyCode = event.keyCode;
      var mapping = {
        38: -1,
        40: 1,
        37: -1,
        39: 1
      };

      // Left or Right
      if (keyCode === 37 || keyCode === 39) {
        var step = mapping[keyCode];
        this.changeSelectionRange(step);
        event.preventDefault();
        return;
      }

      // Up or Down
      if (keyCode === 38 || keyCode === 40) {
        var _step = mapping[keyCode];
        this.spinner.scrollDown(_step);
        event.preventDefault();
        return;
      }
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
    staticClass: "el-time-range-picker el-picker-panel el-popper",
    class: _vm.popperClass
  }, [_c("div", {
    staticClass: "el-time-range-picker__content"
  }, [_c("div", {
    staticClass: "el-time-range-picker__cell"
  }, [_c("div", {
    staticClass: "el-time-range-picker__header"
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.startTime")))]), _vm._v(" "), _c("div", {
    staticClass: "el-time-range-picker__body el-time-panel__content",
    class: {
      "has-seconds": _vm.showSeconds,
      "is-arrow": _vm.arrowControl
    }
  }, [_c("time-spinner", {
    ref: "minSpinner",
    attrs: {
      "show-seconds": _vm.showSeconds,
      "am-pm-mode": _vm.amPmMode,
      "arrow-control": _vm.arrowControl,
      date: _vm.minDate
    },
    on: {
      change: _vm.handleMinChange,
      "select-range": _vm.setMinSelectionRange
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "el-time-range-picker__cell"
  }, [_c("div", {
    staticClass: "el-time-range-picker__header"
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.endTime")))]), _vm._v(" "), _c("div", {
    staticClass: "el-time-range-picker__body el-time-panel__content",
    class: {
      "has-seconds": _vm.showSeconds,
      "is-arrow": _vm.arrowControl
    }
  }, [_c("time-spinner", {
    ref: "maxSpinner",
    attrs: {
      "show-seconds": _vm.showSeconds,
      "am-pm-mode": _vm.amPmMode,
      "arrow-control": _vm.arrowControl,
      date: _vm.maxDate
    },
    on: {
      change: _vm.handleMaxChange,
      "select-range": _vm.setMaxSelectionRange
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "el-time-panel__footer"
  }, [_c("button", {
    staticClass: "el-time-panel__btn cancel",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.handleCancel();
      }
    }
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "el-time-panel__btn confirm",
    attrs: {
      type: "button",
      disabled: _vm.btnDisabled
    },
    on: {
      click: function click($event) {
        _vm.handleConfirm();
      }
    }
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.confirm")))])])])]);
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

var TimePicker = {
  mixins: [__vue_component__$2],
  name: 'ElTimePicker',
  props: {
    isRange: Boolean,
    arrowControl: Boolean
  },
  data() {
    return {
      type: ''
    };
  },
  watch: {
    isRange(isRange) {
      if (this.picker) {
        this.unmountPicker();
        this.type = isRange ? 'timerange' : 'time';
        this.panel = isRange ? __vue_component__ : __vue_component__$3;
        this.mountPicker();
      } else {
        this.type = isRange ? 'timerange' : 'time';
        this.panel = isRange ? __vue_component__ : __vue_component__$3;
      }
    }
  },
  created() {
    this.type = this.isRange ? 'timerange' : 'time';
    this.panel = this.isRange ? __vue_component__ : __vue_component__$3;
  }
};

/* istanbul ignore next */
TimePicker.install = function (Vue) {
  Vue.component(TimePicker.name, TimePicker);
};

export { TimePicker as default };
