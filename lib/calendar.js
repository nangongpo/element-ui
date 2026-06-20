import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import Locale from './mixins/locale.js';
import { fecha } from './utils/date.js';
import __vue_component__$2 from './button.js';
import __vue_component__$3 from './button-group.js';
import { validateRangeInOneMonth, range, getI18nSettings, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays } from './utils/date-util.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import 'vue';
import './locale/format.js';
import './utils/util.js';
import './utils/types.js';
import 'dayjs';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/advancedFormat.js';

var script$1 = {
  props: {
    selectedDay: String,
    // formated date yyyy-MM-dd
    range: {
      type: Array,
      validator(val) {
        if (!(val && val.length)) return true;
        var _val = _slicedToArray(val, 2),
          start = _val[0],
          end = _val[1];
        return validateRangeInOneMonth(start, end);
      }
    },
    date: Date,
    hideHeader: Boolean,
    firstDayOfWeek: Number
  },
  inject: ['elCalendar'],
  methods: {
    toNestedArr(days) {
      return range(days.length / 7).map((_, index) => {
        var start = index * 7;
        return days.slice(start, start + 7);
      });
    },
    getFormateDate(day, type) {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type');
      }
      var prefix = this.curMonthDatePrefix;
      if (type === 'prev') {
        prefix = this.prevMonthDatePrefix;
      } else if (type === 'next') {
        prefix = this.nextMonthDatePrefix;
      }
      day = `00${day}`.slice(-2);
      return `${prefix}-${day}`;
    },
    getCellClass({
      text,
      type
    }) {
      var classes = [type];
      if (type === 'current') {
        var date = this.getFormateDate(text, type);
        if (date === this.selectedDay) {
          classes.push('is-selected');
        }
        if (date === this.formatedToday) {
          classes.push('is-today');
        }
      }
      return classes;
    },
    pickDay({
      text,
      type
    }) {
      var date = this.getFormateDate(text, type);
      this.$emit('pick', date);
    },
    cellRenderProxy({
      text,
      type
    }) {
      var h = this.$createElement;
      var render = this.elCalendar.$scopedSlots.dateCell;
      if (!render) return h("span", [text]);
      var day = this.getFormateDate(text, type);
      var date = new Date(day);
      var data = {
        isSelected: this.selectedDay === day,
        type: `${type}-month`,
        day
      };
      return render({
        date,
        data
      });
    }
  },
  computed: {
    WEEK_DAYS() {
      return getI18nSettings().dayNames;
    },
    prevMonthDatePrefix() {
      var temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },
    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },
    nextMonthDatePrefix() {
      var temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },
    formatedToday() {
      return this.elCalendar.formatedToday;
    },
    isInRange() {
      return this.range && this.range.length;
    },
    rows() {
      var days = [];
      // if range exists, should render days in range.
      if (this.isInRange) {
        var _this$range = _slicedToArray(this.range, 2),
          start = _this$range[0],
          end = _this$range[1];
        var currentMonthRange = range(end.getDate() - start.getDate() + 1).map((_, index) => ({
          text: start.getDate() + index,
          type: 'current'
        }));
        var remaining = currentMonthRange.length % 7;
        remaining = remaining === 0 ? 0 : 7 - remaining;
        var nextMonthRange = range(remaining).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }));
        days = currentMonthRange.concat(nextMonthRange);
      } else {
        var date = this.date;
        var firstDay = getFirstDayOfMonth(date);
        firstDay = firstDay === 0 ? 7 : firstDay;
        var firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1;
        var offset = (7 + firstDay - firstDayOfWeek) % 7;
        var prevMonthDays = getPrevMonthLastDays(date, offset).map(day => ({
          text: day,
          type: 'prev'
        }));
        var currentMonthDays = getMonthDays(date).map(day => ({
          text: day,
          type: 'current'
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        var nextMonthDays = range(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }));
        days = days.concat(nextMonthDays);
      }
      return this.toNestedArr(days);
    },
    weekDays() {
      var start = this.firstDayOfWeek;
      var WEEK_DAYS = this.WEEK_DAYS;
      if (typeof start !== 'number' || start === 0) {
        return WEEK_DAYS.slice();
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
      }
    }
  },
  render() {
    var h = arguments[0];
    var thead = this.hideHeader ? null : h("thead", [this.weekDays.map(day => h("th", {
      "key": day
    }, [day]))]);
    return h("table", {
      "class": {
        'el-calendar-table': true,
        'is-range': this.isInRange
      },
      "attrs": {
        "cellspacing": "0",
        "cellpadding": "0"
      }
    }, [thead, h("tbody", [this.rows.map((row, index) => h("tr", {
      "class": {
        'el-calendar-table__row': true,
        'el-calendar-table__row--hide-border': index === 0 && this.hideHeader
      },
      "key": index
    }, [row.map((cell, key) => h("td", {
      "key": key,
      "class": this.getCellClass(cell),
      "on": {
        "click": this.pickDay.bind(this, cell)
      }
    }, [h("div", {
      "class": "el-calendar-day"
    }, [this.cellRenderProxy(cell)])]))]))])]);
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var validTypes = ['prev-month', 'today', 'next-month'];
var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var oneDay = 86400000;
var script = {
  name: 'ElCalendar',
  mixins: [Locale],
  components: {
    DateTable: __vue_component__$1,
    ElButton: __vue_component__$2,
    ElButtonGroup: __vue_component__$3
  },
  props: {
    value: [Date, String, Number],
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(item => typeof item === 'string' || typeof item === 'number' || item instanceof Date);
        } else {
          return true;
        }
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    }
  },
  provide() {
    return {
      elCalendar: this
    };
  },
  methods: {
    pickDay(day) {
      this.realSelectedDay = day;
    },
    selectDate(type) {
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      var day = '';
      if (type === 'prev-month') {
        day = `${this.prevMonthDatePrefix}-01`;
      } else if (type === 'next-month') {
        day = `${this.nextMonthDatePrefix}-01`;
      } else {
        day = this.formatedToday;
      }
      if (day === this.formatedDate) return;
      this.pickDay(day);
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    rangeValidator(date, isStart) {
      var firstDayOfWeek = this.realFirstDayOfWeek;
      var expected = isStart ? firstDayOfWeek : firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      var message = `${isStart ? 'start' : 'end'} of range should be ${weekDays[expected]}.`;
      if (date.getDay() !== expected) {
        console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
        return false;
      }
      return true;
    }
  },
  computed: {
    prevMonthDatePrefix() {
      var temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },
    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },
    nextMonthDatePrefix() {
      var temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },
    formatedDate() {
      return fecha.format(this.date, 'yyyy-MM-dd');
    },
    i18nDate() {
      var year = this.date.getFullYear();
      var month = this.date.getMonth() + 1;
      return `${year} ${this.t('el.datepicker.year')} ${this.t('el.datepicker.month' + month)}`;
    },
    formatedToday() {
      return fecha.format(this.now, 'yyyy-MM-dd');
    },
    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.formatedDate;
      },
      set(val) {
        this.selectedDay = val;
        var date = new Date(val);
        this.$emit('input', date);
      }
    },
    date() {
      if (!this.value) {
        if (this.realSelectedDay) {
          var d = this.selectedDay.split('-');
          return new Date(d[0], d[1] - 1, d[2]);
        } else if (this.validatedRange.length) {
          return this.validatedRange[0][0];
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },
    // if range is valid, we get a two-digit array
    validatedRange() {
      var range = this.range;
      if (!range) return [];
      range = range.reduce((prev, val, index) => {
        var date = this.toDate(val);
        if (this.rangeValidator(date, index === 0)) {
          prev = prev.concat(date);
        }
        return prev;
      }, []);
      if (range.length === 2) {
        var _range = range,
          _range2 = _slicedToArray(_range, 2),
          start = _range2[0],
          end = _range2[1];
        if (start > end) {
          console.warn('[ElementCalendar]end time should be greater than start time');
          return [];
        }
        // start time and end time in one month
        if (validateRangeInOneMonth(start, end)) {
          return [[start, end]];
        }
        var data = [];
        var startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        var lastDay = this.toDate(startDay.getTime() - oneDay);
        if (!validateRangeInOneMonth(startDay, end)) {
          console.warn('[ElementCalendar]start time and end time interval must not exceed two months');
          return [];
        }
        // 第一个月的时间范围
        data.push([start, lastDay]);
        // 下一月的时间范围，需要计算一下该月的第一个周起始日
        var firstDayOfWeek = this.realFirstDayOfWeek;
        var nextMontFirstDay = startDay.getDay();
        var interval = 0;
        if (nextMontFirstDay !== firstDayOfWeek) {
          if (firstDayOfWeek === 0) {
            interval = 7 - nextMontFirstDay;
          } else {
            interval = firstDayOfWeek - nextMontFirstDay;
            interval = interval > 0 ? interval : 7 + interval;
          }
        }
        startDay = this.toDate(startDay.getTime() + interval * oneDay);
        if (startDay.getDate() < end.getDate()) {
          data.push([startDay, end]);
        }
        return data;
      }
      return [];
    },
    realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    }
  },
  data() {
    return {
      selectedDay: '',
      now: new Date()
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
  return _c("div", {
    staticClass: "el-calendar"
  }, [_c("div", {
    staticClass: "el-calendar__header"
  }, [_c("div", {
    staticClass: "el-calendar__title"
  }, [_vm._v("\n      " + _vm._s(_vm.i18nDate) + "\n    ")]), _vm._v(" "), _vm.validatedRange.length === 0 ? _c("div", {
    staticClass: "el-calendar__button-group"
  }, [_c("el-button-group", [_c("el-button", {
    attrs: {
      type: "plain",
      size: "mini"
    },
    on: {
      click: function click($event) {
        _vm.selectDate("prev-month");
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.t("el.datepicker.prevMonth")) + "\n        ")]), _vm._v(" "), _c("el-button", {
    attrs: {
      type: "plain",
      size: "mini"
    },
    on: {
      click: function click($event) {
        _vm.selectDate("today");
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.t("el.datepicker.today")) + "\n        ")]), _vm._v(" "), _c("el-button", {
    attrs: {
      type: "plain",
      size: "mini"
    },
    on: {
      click: function click($event) {
        _vm.selectDate("next-month");
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.t("el.datepicker.nextMonth")) + "\n        ")])], 1)], 1) : _vm._e()]), _vm._v(" "), _vm.validatedRange.length === 0 ? _c("div", {
    key: "no-range",
    staticClass: "el-calendar__body"
  }, [_c("date-table", {
    attrs: {
      date: _vm.date,
      "selected-day": _vm.realSelectedDay,
      "first-day-of-week": _vm.realFirstDayOfWeek
    },
    on: {
      pick: _vm.pickDay
    }
  })], 1) : _c("div", {
    key: "has-range",
    staticClass: "el-calendar__body"
  }, _vm._l(_vm.validatedRange, function (range, index) {
    return _c("date-table", {
      key: index,
      attrs: {
        date: range[0],
        "selected-day": _vm.realSelectedDay,
        range: range,
        "hide-header": index !== 0,
        "first-day-of-week": _vm.realFirstDayOfWeek
      },
      on: {
        pick: _vm.pickDay
      }
    });
  }), 1)]);
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
