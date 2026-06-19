import Locale from 'element-ui/lib/mixins/locale.js';
import fecha from 'element-ui/lib/utils/date.js';
import ElButton from 'element-ui/lib/button.js';
import ElButtonGroup from 'element-ui/lib/button-group.js';
import { validateRangeInOneMonth, range, getI18nSettings, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays } from 'element-ui/lib/utils/date-util.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var script$1 = {
  props: {
    selectedDay: String,
    // formated date yyyy-MM-dd
    range: {
      type: Array,
      validator: function validator(val) {
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
    toNestedArr: function toNestedArr(days) {
      return range(days.length / 7).map(function (_, index) {
        var start = index * 7;
        return days.slice(start, start + 7);
      });
    },
    getFormateDate: function getFormateDate(day, type) {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type');
      }
      var prefix = this.curMonthDatePrefix;
      if (type === 'prev') {
        prefix = this.prevMonthDatePrefix;
      } else if (type === 'next') {
        prefix = this.nextMonthDatePrefix;
      }
      day = "00".concat(day).slice(-2);
      return "".concat(prefix, "-").concat(day);
    },
    getCellClass: function getCellClass(_ref) {
      var text = _ref.text,
        type = _ref.type;
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
    pickDay: function pickDay(_ref2) {
      var text = _ref2.text,
        type = _ref2.type;
      var date = this.getFormateDate(text, type);
      this.$emit('pick', date);
    },
    cellRenderProxy: function cellRenderProxy(_ref3) {
      var text = _ref3.text,
        type = _ref3.type;
      var h = this.$createElement;
      var render = this.elCalendar.$scopedSlots.dateCell;
      if (!render) return h("span", [text]);
      var day = this.getFormateDate(text, type);
      var date = new Date(day);
      var data = {
        isSelected: this.selectedDay === day,
        type: "".concat(type, "-month"),
        day: day
      };
      return render({
        date: date,
        data: data
      });
    }
  },
  computed: {
    WEEK_DAYS: function WEEK_DAYS() {
      return getI18nSettings().dayNames;
    },
    prevMonthDatePrefix: function prevMonthDatePrefix() {
      var temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },
    curMonthDatePrefix: function curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },
    nextMonthDatePrefix: function nextMonthDatePrefix() {
      var temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },
    formatedToday: function formatedToday() {
      return this.elCalendar.formatedToday;
    },
    isInRange: function isInRange() {
      return this.range && this.range.length;
    },
    rows: function rows() {
      var days = [];
      // if range exists, should render days in range.
      if (this.isInRange) {
        var _this$range = _slicedToArray(this.range, 2),
          start = _this$range[0],
          end = _this$range[1];
        var currentMonthRange = range(end.getDate() - start.getDate() + 1).map(function (_, index) {
          return {
            text: start.getDate() + index,
            type: 'current'
          };
        });
        var remaining = currentMonthRange.length % 7;
        remaining = remaining === 0 ? 0 : 7 - remaining;
        var nextMonthRange = range(remaining).map(function (_, index) {
          return {
            text: index + 1,
            type: 'next'
          };
        });
        days = currentMonthRange.concat(nextMonthRange);
      } else {
        var date = this.date;
        var firstDay = getFirstDayOfMonth(date);
        firstDay = firstDay === 0 ? 7 : firstDay;
        var firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1;
        var offset = (7 + firstDay - firstDayOfWeek) % 7;
        var prevMonthDays = getPrevMonthLastDays(date, offset).map(function (day) {
          return {
            text: day,
            type: 'prev'
          };
        });
        var currentMonthDays = getMonthDays(date).map(function (day) {
          return {
            text: day,
            type: 'current'
          };
        });
        days = [].concat(_toConsumableArray(prevMonthDays), _toConsumableArray(currentMonthDays));
        var nextMonthDays = range(42 - days.length).map(function (_, index) {
          return {
            text: index + 1,
            type: 'next'
          };
        });
        days = days.concat(nextMonthDays);
      }
      return this.toNestedArr(days);
    },
    weekDays: function weekDays() {
      var start = this.firstDayOfWeek;
      var WEEK_DAYS = this.WEEK_DAYS;
      if (typeof start !== 'number' || start === 0) {
        return WEEK_DAYS.slice();
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
      }
    }
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    var thead = this.hideHeader ? null : h("thead", [this.weekDays.map(function (day) {
      return h("th", {
        "key": day
      }, [day]);
    })]);
    return h("table", {
      "class": {
        'el-calendar-table': true,
        'is-range': this.isInRange
      },
      "attrs": {
        "cellspacing": "0",
        "cellpadding": "0"
      }
    }, [thead, h("tbody", [this.rows.map(function (row, index) {
      return h("tr", {
        "class": {
          'el-calendar-table__row': true,
          'el-calendar-table__row--hide-border': index === 0 && _this.hideHeader
        },
        "key": index
      }, [row.map(function (cell, key) {
        return h("td", {
          "key": key,
          "class": _this.getCellClass(cell),
          "on": {
            "click": _this.pickDay.bind(_this, cell)
          }
        }, [h("div", {
          "class": "el-calendar-day"
        }, [_this.cellRenderProxy(cell)])]);
      })]);
    })])]);
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var validTypes = ['prev-month', 'today', 'next-month'];
var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var oneDay = 86400000;
var script = {
  name: 'ElCalendar',
  mixins: [Locale],
  components: {
    DateTable: __vue_component__$1,
    ElButton: ElButton,
    ElButtonGroup: ElButtonGroup
  },
  props: {
    value: [Date, String, Number],
    range: {
      type: Array,
      validator: function validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(function (item) {
            return typeof item === 'string' || typeof item === 'number' || item instanceof Date;
          });
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
  provide: function provide() {
    return {
      elCalendar: this
    };
  },
  methods: {
    pickDay: function pickDay(day) {
      this.realSelectedDay = day;
    },
    selectDate: function selectDate(type) {
      if (validTypes.indexOf(type) === -1) {
        throw new Error("invalid type ".concat(type));
      }
      var day = '';
      if (type === 'prev-month') {
        day = "".concat(this.prevMonthDatePrefix, "-01");
      } else if (type === 'next-month') {
        day = "".concat(this.nextMonthDatePrefix, "-01");
      } else {
        day = this.formatedToday;
      }
      if (day === this.formatedDate) return;
      this.pickDay(day);
    },
    toDate: function toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    rangeValidator: function rangeValidator(date, isStart) {
      var firstDayOfWeek = this.realFirstDayOfWeek;
      var expected = isStart ? firstDayOfWeek : firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      var message = "".concat(isStart ? 'start' : 'end', " of range should be ").concat(weekDays[expected], ".");
      if (date.getDay() !== expected) {
        console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
        return false;
      }
      return true;
    }
  },
  computed: {
    prevMonthDatePrefix: function prevMonthDatePrefix() {
      var temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },
    curMonthDatePrefix: function curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },
    nextMonthDatePrefix: function nextMonthDatePrefix() {
      var temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },
    formatedDate: function formatedDate() {
      return fecha.format(this.date, 'yyyy-MM-dd');
    },
    i18nDate: function i18nDate() {
      var year = this.date.getFullYear();
      var month = this.date.getMonth() + 1;
      return "".concat(year, " ").concat(this.t('el.datepicker.year'), " ").concat(this.t('el.datepicker.month' + month));
    },
    formatedToday: function formatedToday() {
      return fecha.format(this.now, 'yyyy-MM-dd');
    },
    realSelectedDay: {
      get: function get() {
        if (!this.value) return this.selectedDay;
        return this.formatedDate;
      },
      set: function set(val) {
        this.selectedDay = val;
        var date = new Date(val);
        this.$emit('input', date);
      }
    },
    date: function date() {
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
    validatedRange: function validatedRange() {
      var _this = this;
      var range = this.range;
      if (!range) return [];
      range = range.reduce(function (prev, val, index) {
        var date = _this.toDate(val);
        if (_this.rangeValidator(date, index === 0)) {
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
    realFirstDayOfWeek: function realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    }
  },
  data: function data() {
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
