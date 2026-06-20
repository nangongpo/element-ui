import { _ as __vue_component__$9 } from './shared/picker-45e61d51.js';
import { isDate, range, nextDate, getDayCountOfYear, getDayCountOfMonth, getStartDateOfMonth, getFirstDayOfMonth, getWeekNumber, prevDate, clearTime, clearMilliseconds, prevMonth, nextMonth, prevYear, nextYear, modifyTime, modifyWithTimeString, modifyDate, changeYearMonthAndClampDate, parseDate, timeWithinRange, formatDate, extractTimeFormat, extractDateFormat } from './utils/date-util.js';
import Clickoutside from './utils/clickoutside.js';
import Locale from './mixins/locale.js';
import __vue_component__$7 from './input.js';
import __vue_component__$8 from './button.js';
import { _ as __vue_component__$6 } from './shared/time-01d74179.js';
import { hasClass } from './utils/dom.js';
import { arrayFindIndex, coerceTruthyValueToArray, arrayFind } from './utils/util.js';
import { n as normalizeComponent } from './shared/normalize-component-01820469.js';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import 'vue';
import './utils/vue-popper.js';
import './shared/popper-c5560701.js';
import './utils/popup/popup-manager.js';
import './mixins/emitter.js';
import './utils/merge.js';
import './utils/date.js';
import 'dayjs';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/advancedFormat.js';
import './locale/index.js';
import './locale/lang/zh-CN.js';
import './locale/format.js';
import './mixins/migrating.js';
import './utils/shared.js';
import './utils/types.js';
import './scrollbar.js';
import './shared/resize-event-51726919.js';
import './shared/throttle-54b44d30.js';
import './shared/debounce-e5482a73.js';
import './utils/scrollbar-width.js';
import './directives/repeat-click.js';

//
var datesInYear = year => {
  var numOfDays = getDayCountOfYear(year);
  var firstDay = new Date(year, 0, 1);
  return range(numOfDays).map(n => nextDate(firstDay, n));
};
var script$5 = {
  props: {
    disabledDate: {},
    value: {},
    defaultValue: {
      validator(val) {
        // null or valid Date Object
        return val === null || val instanceof Date && isDate(val);
      }
    },
    date: {},
    selectionMode: {}
  },
  computed: {
    startYear() {
      return Math.floor(this.date.getFullYear() / 10) * 10;
    }
  },
  methods: {
    getCellStyle(year) {
      var style = {};
      var today = new Date();
      style.disabled = typeof this.disabledDate === 'function' ? datesInYear(year).every(this.disabledDate) : false;
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), date => date.getFullYear() === year) >= 0;
      style.today = today.getFullYear() === year;
      style.default = this.defaultValue && this.defaultValue.getFullYear() === year;
      return style;
    },
    handleYearTableClick(event) {
      var target = event.target;
      if (target.tagName === 'A') {
        if (hasClass(target.parentNode, 'disabled')) return;
        var year = target.textContent || target.innerText;
        if (this.selectionMode === 'years') {
          var value = this.value || [];
          var idx = arrayFindIndex(value, date => date.getFullYear() === Number(year));
          var newValue = idx > -1 ? [...value.slice(0, idx), ...value.slice(idx + 1)] : [...value, new Date(year)];
          this.$emit('pick', newValue);
        } else {
          this.$emit('pick', Number(year));
        }
      }
    }
  }
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", {
    staticClass: "el-year-table",
    on: {
      click: _vm.handleYearTableClick
    }
  }, [_c("tbody", [_c("tr", [_c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 0)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 1)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 1))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 2)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 2))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 3)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 3))])])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 4)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 4))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 5)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 5))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 6)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 6))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 7)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 7))])])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 8)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 8))])]), _vm._v(" "), _c("td", {
    staticClass: "available",
    class: _vm.getCellStyle(_vm.startYear + 9)
  }, [_c("a", {
    staticClass: "cell"
  }, [_vm._v(_vm._s(_vm.startYear + 9))])]), _vm._v(" "), _c("td"), _vm._v(" "), _c("td")])])]);
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

/* style */
var __vue_inject_styles__$5 = undefined;
/* scoped */
var __vue_scope_id__$5 = undefined;
/* module identifier */
var __vue_module_identifier__$5 = undefined;
/* functional template */
var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
var datesInMonth = (year, month) => {
  var numOfDays = getDayCountOfMonth(year, month);
  var firstDay = new Date(year, month, 1);
  return range(numOfDays).map(n => nextDate(firstDay, n));
};
var clearDate = date => {
  return new Date(date.getFullYear(), date.getMonth());
};
var getMonthTimestamp = function getMonthTimestamp(time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return clearDate(new Date(time)).getTime();
  } else if (time instanceof Date) {
    return clearDate(time).getTime();
  } else {
    return NaN;
  }
};

// remove the first element that satisfies `pred` from arr
// return a new array if modification occurs
// return the original array otherwise
var removeFromArray$1 = function removeFromArray(arr, pred) {
  var idx = typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred);
  return idx >= 0 ? [...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr;
};
var script$4 = {
  props: {
    disabledDate: {},
    value: {},
    selectionMode: {
      default: 'month'
    },
    minDate: {},
    maxDate: {},
    defaultValue: {
      validator(val) {
        // null or valid Date Object
        return val === null || isDate(val) || Array.isArray(val) && val.every(isDate);
      }
    },
    date: {},
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  mixins: [Locale],
  watch: {
    'rangeState.endDate'(newVal) {
      this.markRange(this.minDate, newVal);
    },
    minDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    },
    maxDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  data() {
    return {
      months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      tableRows: [[], [], []],
      lastRow: null,
      lastColumn: null
    };
  },
  methods: {
    cellMatchesDate(cell, date) {
      var value = new Date(date);
      return this.date.getFullYear() === value.getFullYear() && Number(cell.text) === value.getMonth();
    },
    getCellStyle(cell) {
      var style = {};
      var year = this.date.getFullYear();
      var today = new Date();
      var month = cell.text;
      var defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];
      style.disabled = typeof this.disabledDate === 'function' ? datesInMonth(year, month).every(this.disabledDate) : false;
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), date => date.getFullYear() === year && date.getMonth() === month) >= 0;
      style.today = today.getFullYear() === year && today.getMonth() === month;
      style.default = defaultValue.some(date => this.cellMatchesDate(cell, date));
      if (cell.inRange) {
        style['in-range'] = true;
        if (cell.start) {
          style['start-date'] = true;
        }
        if (cell.end) {
          style['end-date'] = true;
        }
      }
      return style;
    },
    getMonthOfCell(month) {
      var year = this.date.getFullYear();
      return new Date(year, month, 1);
    },
    markRange(minDate, maxDate) {
      minDate = getMonthTimestamp(minDate);
      maxDate = getMonthTimestamp(maxDate) || minDate;
      var _ref = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];
      minDate = _ref[0];
      maxDate = _ref[1];
      var rows = this.rows;
      for (var i = 0, k = rows.length; i < k; i++) {
        var row = rows[i];
        for (var j = 0, l = row.length; j < l; j++) {
          var cell = row[j];
          var index = i * 4 + j;
          var time = new Date(this.date.getFullYear(), index).getTime();
          cell.inRange = minDate && time >= minDate && time <= maxDate;
          cell.start = minDate && time === minDate;
          cell.end = maxDate && time === maxDate;
        }
      }
    },
    handleMouseMove(event) {
      if (!this.rangeState.selecting) return;
      var target = event.target;
      if (target.tagName === 'A') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      var row = target.parentNode.rowIndex;
      var column = target.cellIndex;
      // can not select disabled date
      if (this.rows[row][column].disabled) return;

      // only update rangeState when mouse moves to a new cell
      // this avoids frequent Date object creation and improves performance
      if (row !== this.lastRow || column !== this.lastColumn) {
        this.lastRow = row;
        this.lastColumn = column;
        this.$emit('changerange', {
          minDate: this.minDate,
          maxDate: this.maxDate,
          rangeState: {
            selecting: true,
            endDate: this.getMonthOfCell(row * 4 + column)
          }
        });
      }
    },
    handleMonthTableClick(event) {
      var target = event.target;
      if (target.tagName === 'A') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      if (hasClass(target, 'disabled')) return;
      var column = target.cellIndex;
      var row = target.parentNode.rowIndex;
      var month = row * 4 + column;
      var newDate = this.getMonthOfCell(month);
      if (this.selectionMode === 'range') {
        if (!this.rangeState.selecting) {
          this.$emit('pick', {
            minDate: newDate,
            maxDate: null
          });
          this.rangeState.selecting = true;
        } else {
          if (newDate >= this.minDate) {
            this.$emit('pick', {
              minDate: this.minDate,
              maxDate: newDate
            });
          } else {
            this.$emit('pick', {
              minDate: newDate,
              maxDate: this.minDate
            });
          }
          this.rangeState.selecting = false;
        }
      } else if (this.selectionMode === 'months') {
        var value = this.value || [];
        var year = this.date.getFullYear();
        var newValue = arrayFindIndex(value, date => date.getFullYear() === year && date.getMonth() === month) >= 0 ? removeFromArray$1(value, date => date.getTime() === newDate.getTime()) : [...value, newDate];
        this.$emit('pick', newValue);
      } else {
        this.$emit('pick', month);
      }
    }
  },
  computed: {
    rows() {
      var _this = this;
      // TODO: refactory rows / getCellClasses
      var rows = this.tableRows;
      var disabledDate = this.disabledDate;
      var selectedDate = [];
      var now = getMonthTimestamp(new Date());
      for (var i = 0; i < 3; i++) {
        var row = rows[i];
        var _loop = function _loop() {
          var cell = row[j];
          if (!cell) {
            cell = {
              row: i,
              column: j,
              type: 'normal',
              inRange: false,
              start: false,
              end: false
            };
          }
          cell.type = 'normal';
          var index = i * 4 + j;
          var time = new Date(_this.date.getFullYear(), index).getTime();
          cell.inRange = time >= getMonthTimestamp(_this.minDate) && time <= getMonthTimestamp(_this.maxDate);
          cell.start = _this.minDate && time === getMonthTimestamp(_this.minDate);
          cell.end = _this.maxDate && time === getMonthTimestamp(_this.maxDate);
          var isToday = time === now;
          if (isToday) {
            cell.type = 'today';
          }
          cell.text = index;
          var cellDate = new Date(time);
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate);
          cell.selected = arrayFind(selectedDate, date => date.getTime() === cellDate.getTime());
          _this.$set(row, j, cell);
        };
        for (var j = 0; j < 4; j++) {
          _loop();
        }
      }
      return rows;
    }
  }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", {
    staticClass: "el-month-table",
    on: {
      click: _vm.handleMonthTableClick,
      mousemove: _vm.handleMouseMove
    }
  }, [_c("tbody", _vm._l(_vm.rows, function (row, key) {
    return _c("tr", {
      key: key
    }, _vm._l(row, function (cell, key) {
      return _c("td", {
        key: key,
        class: _vm.getCellStyle(cell)
      }, [_c("div", [_c("a", {
        staticClass: "cell"
      }, [_vm._v(_vm._s(_vm.t("el.datepicker.months." + _vm.months[cell.text])))])])]);
    }), 0);
  }), 0)]);
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

/* style */
var __vue_inject_styles__$4 = undefined;
/* scoped */
var __vue_scope_id__$4 = undefined;
/* module identifier */
var __vue_module_identifier__$4 = undefined;
/* functional template */
var __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

//
var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var getDateTimestamp = function getDateTimestamp(time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return clearTime(new Date(time)).getTime();
  } else if (time instanceof Date) {
    return clearTime(time).getTime();
  } else {
    return NaN;
  }
};

// remove the first element that satisfies `pred` from arr
// return a new array if modification occurs
// return the original array otherwise
var removeFromArray = function removeFromArray(arr, pred) {
  var idx = typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred);
  return idx >= 0 ? [...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr;
};
var script$3 = {
  mixins: [Locale],
  props: {
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    value: {},
    defaultValue: {
      validator(val) {
        // either: null, valid Date object, Array of valid Date objects
        return val === null || isDate(val) || Array.isArray(val) && val.every(isDate);
      }
    },
    date: {},
    selectionMode: {
      default: 'day'
    },
    showWeekNumber: {
      type: Boolean,
      default: false
    },
    disabledDate: {},
    cellClassName: {},
    minDate: {},
    maxDate: {},
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  computed: {
    offsetDay() {
      var week = this.firstDayOfWeek;
      // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
      return week > 3 ? 7 - week : -week;
    },
    WEEKS() {
      var week = this.firstDayOfWeek;
      return WEEKS.concat(WEEKS).slice(week, week + 7);
    },
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },
    rows() {
      var _this = this;
      // TODO: refactory rows / getCellClasses
      var date = new Date(this.year, this.month, 1);
      var day = getFirstDayOfMonth(date); // day of first day
      var dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
      var dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);
      day = day === 0 ? 7 : day;
      var offset = this.offsetDay;
      var rows = this.tableRows;
      var count = 1;
      var startDate = this.startDate;
      var disabledDate = this.disabledDate;
      var cellClassName = this.cellClassName;
      var selectedDate = this.selectionMode === 'dates' ? coerceTruthyValueToArray(this.value) : [];
      var now = getDateTimestamp(new Date());
      for (var i = 0; i < 6; i++) {
        var row = rows[i];
        if (this.showWeekNumber) {
          if (!row[0]) {
            row[0] = {
              type: 'week',
              text: getWeekNumber(nextDate(startDate, i * 7 + 1))
            };
          }
        }
        var _loop = function _loop() {
          var cell = row[_this.showWeekNumber ? j + 1 : j];
          if (!cell) {
            cell = {
              row: i,
              column: j,
              type: 'normal',
              inRange: false,
              start: false,
              end: false
            };
          }
          cell.type = 'normal';
          var index = i * 7 + j;
          var time = nextDate(startDate, index - offset).getTime();
          cell.inRange = time >= getDateTimestamp(_this.minDate) && time <= getDateTimestamp(_this.maxDate);
          cell.start = _this.minDate && time === getDateTimestamp(_this.minDate);
          cell.end = _this.maxDate && time === getDateTimestamp(_this.maxDate);
          var isToday = time === now;
          if (isToday) {
            cell.type = 'today';
          }
          if (i >= 0 && i <= 1) {
            var numberOfDaysFromPreviousMonth = day + offset < 0 ? 7 + day + offset : day + offset;
            if (j + i * 7 >= numberOfDaysFromPreviousMonth) {
              cell.text = count++;
            } else {
              cell.text = dateCountOfLastMonth - (numberOfDaysFromPreviousMonth - j % 7) + 1 + i * 7;
              cell.type = 'prev-month';
            }
          } else {
            if (count <= dateCountOfMonth) {
              cell.text = count++;
            } else {
              cell.text = count++ - dateCountOfMonth;
              cell.type = 'next-month';
            }
          }
          var cellDate = new Date(time);
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate);
          cell.selected = arrayFind(selectedDate, date => date.getTime() === cellDate.getTime());
          cell.customClass = typeof cellClassName === 'function' && cellClassName(cellDate);
          _this.$set(row, _this.showWeekNumber ? j + 1 : j, cell);
        };
        for (var j = 0; j < 7; j++) {
          _loop();
        }
        if (this.selectionMode === 'week') {
          var start = this.showWeekNumber ? 1 : 0;
          var end = this.showWeekNumber ? 7 : 6;
          var isWeekActive = this.isWeekActive(row[start + 1]);
          row[start].inRange = isWeekActive;
          row[start].start = isWeekActive;
          row[end].inRange = isWeekActive;
          row[end].end = isWeekActive;
        }
      }
      return rows;
    }
  },
  watch: {
    'rangeState.endDate'(newVal) {
      this.markRange(this.minDate, newVal);
    },
    minDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    },
    maxDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  data() {
    return {
      tableRows: [[], [], [], [], [], []],
      lastRow: null,
      lastColumn: null
    };
  },
  methods: {
    cellMatchesDate(cell, date) {
      var value = new Date(date);
      return this.year === value.getFullYear() && this.month === value.getMonth() && Number(cell.text) === value.getDate();
    },
    getCellClasses(cell) {
      var selectionMode = this.selectionMode;
      var defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];
      var classes = [];
      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
        classes.push('available');
        if (cell.type === 'today') {
          classes.push('today');
        }
      } else {
        classes.push(cell.type);
      }
      if (cell.type === 'normal' && defaultValue.some(date => this.cellMatchesDate(cell, date))) {
        classes.push('default');
      }
      if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
        classes.push('current');
      }
      if (cell.inRange && (cell.type === 'normal' || cell.type === 'today' || this.selectionMode === 'week')) {
        classes.push('in-range');
        if (cell.start) {
          classes.push('start-date');
        }
        if (cell.end) {
          classes.push('end-date');
        }
      }
      if (cell.disabled) {
        classes.push('disabled');
      }
      if (cell.selected) {
        classes.push('selected');
      }
      if (cell.customClass) {
        classes.push(cell.customClass);
      }
      return classes.join(' ');
    },
    getDateOfCell(row, column) {
      var offsetFromStart = row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },
    isWeekActive(cell) {
      if (this.selectionMode !== 'week') return false;
      var newDate = new Date(this.year, this.month, 1);
      var year = newDate.getFullYear();
      var month = newDate.getMonth();
      if (cell.type === 'prev-month') {
        newDate.setMonth(month === 0 ? 11 : month - 1);
        newDate.setFullYear(month === 0 ? year - 1 : year);
      }
      if (cell.type === 'next-month') {
        newDate.setMonth(month === 11 ? 0 : month + 1);
        newDate.setFullYear(month === 11 ? year + 1 : year);
      }
      newDate.setDate(parseInt(cell.text, 10));
      if (isDate(this.value)) {
        var dayOffset = (this.value.getDay() - this.firstDayOfWeek + 7) % 7 - 1;
        var weekDate = prevDate(this.value, dayOffset);
        return weekDate.getTime() === newDate.getTime();
      }
      return false;
    },
    markRange(minDate, maxDate) {
      minDate = getDateTimestamp(minDate);
      maxDate = getDateTimestamp(maxDate) || minDate;
      var _ref = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];
      minDate = _ref[0];
      maxDate = _ref[1];
      var startDate = this.startDate;
      var rows = this.rows;
      for (var i = 0, k = rows.length; i < k; i++) {
        var row = rows[i];
        for (var j = 0, l = row.length; j < l; j++) {
          if (this.showWeekNumber && j === 0) continue;
          var cell = row[j];
          var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
          var time = nextDate(startDate, index - this.offsetDay).getTime();
          cell.inRange = minDate && time >= minDate && time <= maxDate;
          cell.start = minDate && time === minDate;
          cell.end = maxDate && time === maxDate;
        }
      }
    },
    handleMouseMove(event) {
      if (!this.rangeState.selecting) return;
      var target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      var row = target.parentNode.rowIndex - 1;
      var column = target.cellIndex;

      // can not select disabled date
      if (this.rows[row][column].disabled) return;

      // only update rangeState when mouse moves to a new cell
      // this avoids frequent Date object creation and improves performance
      if (row !== this.lastRow || column !== this.lastColumn) {
        this.lastRow = row;
        this.lastColumn = column;
        this.$emit('changerange', {
          minDate: this.minDate,
          maxDate: this.maxDate,
          rangeState: {
            selecting: true,
            endDate: this.getDateOfCell(row, column)
          }
        });
      }
    },
    handleClick(event) {
      var target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      var row = target.parentNode.rowIndex - 1;
      var column = this.selectionMode === 'week' ? 1 : target.cellIndex;
      var cell = this.rows[row][column];
      if (cell.disabled || cell.type === 'week') return;
      var newDate = this.getDateOfCell(row, column);
      if (this.selectionMode === 'range') {
        if (!this.rangeState.selecting) {
          this.$emit('pick', {
            minDate: newDate,
            maxDate: null
          });
          this.rangeState.selecting = true;
        } else {
          if (newDate >= this.minDate) {
            this.$emit('pick', {
              minDate: this.minDate,
              maxDate: newDate
            });
          } else {
            this.$emit('pick', {
              minDate: newDate,
              maxDate: this.minDate
            });
          }
          this.rangeState.selecting = false;
        }
      } else if (this.selectionMode === 'day') {
        this.$emit('pick', newDate);
      } else if (this.selectionMode === 'week') {
        var weekNumber = getWeekNumber(newDate);
        var value = newDate.getFullYear() + 'w' + weekNumber;
        this.$emit('pick', {
          year: newDate.getFullYear(),
          week: weekNumber,
          value: value,
          date: newDate
        });
      } else if (this.selectionMode === 'dates') {
        var _value = this.value || [];
        var newValue = cell.selected ? removeFromArray(_value, date => date.getTime() === newDate.getTime()) : [..._value, newDate];
        this.$emit('pick', newValue);
      }
    }
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", {
    staticClass: "el-date-table",
    class: {
      "is-week-mode": _vm.selectionMode === "week"
    },
    attrs: {
      cellspacing: "0",
      cellpadding: "0"
    },
    on: {
      click: _vm.handleClick,
      mousemove: _vm.handleMouseMove
    }
  }, [_c("tbody", [_c("tr", [_vm.showWeekNumber ? _c("th", [_vm._v(_vm._s(_vm.t("el.datepicker.week")))]) : _vm._e(), _vm._v(" "), _vm._l(_vm.WEEKS, function (week, key) {
    return _c("th", {
      key: key
    }, [_vm._v(_vm._s(_vm.t("el.datepicker.weeks." + week)))]);
  })], 2), _vm._v(" "), _vm._l(_vm.rows, function (row, key) {
    return _c("tr", {
      key: key,
      staticClass: "el-date-table__row",
      class: {
        current: _vm.isWeekActive(row[1])
      }
    }, _vm._l(row, function (cell, key) {
      return _c("td", {
        key: key,
        class: _vm.getCellClasses(cell)
      }, [_c("div", [_c("span", [_vm._v("\n          " + _vm._s(cell.text) + "\n        ")])])]);
    }), 0);
  })], 2)]);
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

/* style */
var __vue_inject_styles__$3 = undefined;
/* scoped */
var __vue_scope_id__$3 = undefined;
/* module identifier */
var __vue_module_identifier__$3 = undefined;
/* functional template */
var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
var script$2 = {
  mixins: [Locale],
  directives: {
    Clickoutside
  },
  watch: {
    showTime(val) {
      /* istanbul ignore if */
      if (!val) return;
      this.$nextTick(_ => {
        var inputElm = this.$refs.input.$el;
        if (inputElm) {
          this.pickerWidth = inputElm.getBoundingClientRect().width + 10;
        }
      });
    },
    value(val) {
      if (this.selectionMode === 'dates' && this.value) return;
      if (this.selectionMode === 'months' && this.value) return;
      if (this.selectionMode === 'years' && this.value) return;
      if (isDate(val)) {
        this.date = new Date(val);
      } else {
        this.date = this.getDefaultValue();
      }
    },
    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    },
    timePickerVisible(val) {
      if (val) this.$nextTick(() => this.$refs.timepicker.adjustSpinners());
    },
    selectionMode(newVal) {
      if (newVal === 'month') {
        /* istanbul ignore next */
        if (this.currentView !== 'year' || this.currentView !== 'month') {
          this.currentView = 'month';
        }
      } else if (newVal === 'dates') {
        this.currentView = 'date';
      } else if (newVal === 'years') {
        this.currentView = 'year';
      } else if (newVal === 'months') {
        this.currentView = 'month';
      }
    }
  },
  methods: {
    proxyTimePickerDataProperties() {
      var format = timeFormat => {
        this.$refs.timepicker.format = timeFormat;
      };
      var value = value => {
        this.$refs.timepicker.value = value;
      };
      var date = date => {
        this.$refs.timepicker.date = date;
      };
      var selectableRange = selectableRange => {
        this.$refs.timepicker.selectableRange = selectableRange;
      };
      this.$watch('value', value);
      this.$watch('date', date);
      this.$watch('selectableRange', selectableRange);
      format(this.timeFormat);
      value(this.value);
      date(this.date);
      selectableRange(this.selectableRange);
    },
    handleClear() {
      this.date = this.getDefaultValue();
      this.$emit('pick', null);
    },
    emit(value, ...args) {
      if (!value) {
        this.$emit('pick', value, ...args);
      } else if (Array.isArray(value)) {
        var dates = value.map(date => this.showTime ? clearMilliseconds(date) : clearTime(date));
        this.$emit('pick', dates, ...args);
      } else {
        this.$emit('pick', this.showTime ? clearMilliseconds(value) : clearTime(value), ...args);
      }
      this.userInputDate = null;
      this.userInputTime = null;
    },
    // resetDate() {
    //   this.date = new Date(this.date);
    // },

    showMonthPicker() {
      this.currentView = 'month';
    },
    showYearPicker() {
      this.currentView = 'year';
    },
    // XXX: 没用到
    // handleLabelClick() {
    //   if (this.currentView === 'date') {
    //     this.showMonthPicker();
    //   } else if (this.currentView === 'month') {
    //     this.showYearPicker();
    //   }
    // },

    prevMonth() {
      this.date = prevMonth(this.date);
    },
    nextMonth() {
      this.date = nextMonth(this.date);
    },
    prevYear() {
      if (this.currentView === 'year') {
        this.date = prevYear(this.date, 10);
      } else {
        this.date = prevYear(this.date);
      }
    },
    nextYear() {
      if (this.currentView === 'year') {
        this.date = nextYear(this.date, 10);
      } else {
        this.date = nextYear(this.date);
      }
    },
    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    handleTimePick(value, visible, first) {
      if (isDate(value)) {
        var newDate = this.value ? modifyTime(this.value, value.getHours(), value.getMinutes(), value.getSeconds()) : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
        this.date = newDate;
        this.emit(this.date, true);
      } else {
        this.emit(value, true);
      }
      if (!first) {
        this.timePickerVisible = visible;
      }
    },
    handleTimePickClose() {
      this.timePickerVisible = false;
    },
    handleMonthPick(month) {
      if (this.selectionMode === 'month') {
        this.date = modifyDate(this.date, this.year, month, 1);
        this.emit(this.date);
      } else if (this.selectionMode === 'months') {
        this.emit(month, true);
      } else {
        this.date = changeYearMonthAndClampDate(this.date, this.year, month);
        // TODO: should emit intermediate value ??
        // this.emit(this.date);
        this.currentView = 'date';
      }
    },
    handleDatePick(value) {
      if (this.selectionMode === 'day') {
        var newDate = this.value ? modifyDate(this.value, value.getFullYear(), value.getMonth(), value.getDate()) : modifyWithTimeString(value, this.defaultTime);
        // change default time while out of selectableRange
        if (!this.checkDateWithinRange(newDate)) {
          newDate = modifyDate(this.selectableRange[0][0], value.getFullYear(), value.getMonth(), value.getDate());
        }
        this.date = newDate;
        this.emit(this.date, this.showTime);
      } else if (this.selectionMode === 'week') {
        this.emit(value.date);
      } else if (this.selectionMode === 'dates') {
        this.emit(value, true); // set false to keep panel open
      }
    },
    handleYearPick(year) {
      if (this.selectionMode === 'year') {
        this.date = modifyDate(this.date, year, 0, 1);
        this.emit(this.date);
      } else if (this.selectionMode === 'years') {
        this.emit(year, true);
      } else {
        this.date = changeYearMonthAndClampDate(this.date, year, this.month);
        // TODO: should emit intermediate value ??
        // this.emit(this.date, true);
        this.currentView = 'month';
      }
    },
    changeToNow() {
      // NOTE: not a permanent solution
      //       consider disable "now" button in the future
      if ((!this.disabledDate || !this.disabledDate(new Date())) && this.checkDateWithinRange(new Date())) {
        this.date = new Date();
        this.emit(this.date);
      }
    },
    confirm() {
      if (this.selectionMode === 'dates' || this.selectionMode === 'months' || this.selectionMode === 'years') {
        this.emit(this.value);
      } else {
        // value were emitted in handle{Date,Time}Pick, nothing to update here
        // deal with the scenario where: user opens the picker, then confirm without doing anything
        var value = this.value ? this.value : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
        this.date = new Date(value); // refresh date
        this.emit(value);
      }
    },
    resetView() {
      if (this.selectionMode === 'month' || this.selectionMode === 'months') {
        this.currentView = 'month';
      } else if (this.selectionMode === 'year' || this.selectionMode === 'years') {
        this.currentView = 'year';
      } else {
        this.currentView = 'date';
      }
    },
    handleEnter() {
      document.body.addEventListener('keydown', this.handleKeydown);
    },
    handleLeave() {
      this.$emit('dodestroy');
      document.body.removeEventListener('keydown', this.handleKeydown);
    },
    handleKeydown(event) {
      var keyCode = event.keyCode;
      var list = [38, 40, 37, 39];
      if (this.visible && !this.timePickerVisible) {
        if (list.indexOf(keyCode) !== -1) {
          this.handleKeyControl(keyCode);
          event.stopPropagation();
          event.preventDefault();
        }
        if (keyCode === 13 && this.userInputDate === null && this.userInputTime === null) {
          // Enter
          this.emit(this.date, false);
        }
      }
    },
    handleKeyControl(keyCode) {
      var mapping = {
        'year': {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setFullYear(date.getFullYear() + step)
        },
        'month': {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setMonth(date.getMonth() + step)
        },
        'week': {
          38: -1,
          40: 1,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step * 7)
        },
        'day': {
          38: -7,
          40: 7,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step)
        }
      };
      var mode = this.selectionMode;
      var year = 3.1536e10;
      var now = this.date.getTime();
      var newDate = new Date(this.date.getTime());
      while (Math.abs(now - newDate.getTime()) <= year) {
        var map = mapping[mode];
        map.offset(newDate, map[keyCode]);
        if (typeof this.disabledDate === 'function' && this.disabledDate(newDate)) {
          continue;
        }
        this.date = newDate;
        this.$emit('pick', newDate, true);
        break;
      }
    },
    handleVisibleTimeChange(value) {
      var time = parseDate(value, this.timeFormat);
      if (time && this.checkDateWithinRange(time)) {
        this.date = modifyDate(time, this.year, this.month, this.monthDate);
        this.userInputTime = null;
        this.$refs.timepicker.value = this.date;
        this.timePickerVisible = false;
        this.emit(this.date, true);
      }
    },
    handleVisibleDateChange(value) {
      var date = parseDate(value, this.dateFormat);
      if (date) {
        if (typeof this.disabledDate === 'function' && this.disabledDate(date)) {
          return;
        }
        this.date = modifyTime(date, this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
        this.userInputDate = null;
        this.resetView();
        this.emit(this.date, true);
      }
    },
    isValidValue(value) {
      return value && !isNaN(value) && (typeof this.disabledDate === 'function' ? !this.disabledDate(value) : true) && this.checkDateWithinRange(value);
    },
    getDefaultValue() {
      // if default-value is set, return it
      // otherwise, return now (the moment this method gets called)
      return this.defaultValue ? new Date(this.defaultValue) : new Date();
    },
    checkDateWithinRange(date) {
      return this.selectableRange.length > 0 ? timeWithinRange(date, this.selectableRange, this.format || 'HH:mm:ss') : true;
    }
  },
  components: {
    TimePicker: __vue_component__$6,
    YearTable: __vue_component__$5,
    MonthTable: __vue_component__$4,
    DateTable: __vue_component__$3,
    ElInput: __vue_component__$7,
    ElButton: __vue_component__$8
  },
  data() {
    return {
      popperClass: '',
      date: new Date(),
      value: '',
      defaultValue: null,
      // use getDefaultValue() for time computation
      defaultTime: null,
      showTime: false,
      selectionMode: 'day',
      shortcuts: '',
      visible: false,
      currentView: 'date',
      disabledDate: '',
      cellClassName: '',
      selectableRange: [],
      firstDayOfWeek: 7,
      showWeekNumber: false,
      timePickerVisible: false,
      format: '',
      arrowControl: false,
      userInputDate: null,
      userInputTime: null
    };
  },
  computed: {
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    week() {
      return getWeekNumber(this.date);
    },
    monthDate() {
      return this.date.getDate();
    },
    footerVisible() {
      return this.showTime || this.selectionMode === 'dates' || this.selectionMode === 'months' || this.selectionMode === 'years';
    },
    visibleTime() {
      if (this.userInputTime !== null) {
        return this.userInputTime;
      } else {
        return formatDate(this.value || this.defaultValue, this.timeFormat);
      }
    },
    visibleDate() {
      if (this.userInputDate !== null) {
        return this.userInputDate;
      } else {
        return formatDate(this.value || this.defaultValue, this.dateFormat);
      }
    },
    yearLabel() {
      var yearTranslation = this.t('el.datepicker.year');
      if (this.currentView === 'year') {
        var startYear = Math.floor(this.year / 10) * 10;
        if (yearTranslation) {
          return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
        }
        return startYear + ' - ' + (startYear + 9);
      }
      return this.year + ' ' + yearTranslation;
    },
    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return 'HH:mm:ss';
      }
    },
    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return 'yyyy-MM-dd';
      }
    }
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      name: "el-zoom-in-top"
    },
    on: {
      "after-enter": _vm.handleEnter,
      "after-leave": _vm.handleLeave
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.visible,
      expression: "visible"
    }],
    staticClass: "el-picker-panel el-date-picker el-popper",
    class: [{
      "has-sidebar": _vm.$slots.sidebar || _vm.shortcuts,
      "has-time": _vm.showTime
    }, _vm.popperClass]
  }, [_c("div", {
    staticClass: "el-picker-panel__body-wrapper"
  }, [_vm._t("sidebar"), _vm._v(" "), _vm.shortcuts ? _c("div", {
    staticClass: "el-picker-panel__sidebar"
  }, _vm._l(_vm.shortcuts, function (shortcut, key) {
    return _c("button", {
      key: key,
      staticClass: "el-picker-panel__shortcut",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          _vm.handleShortcutClick(shortcut);
        }
      }
    }, [_vm._v(_vm._s(shortcut.text))]);
  }), 0) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__body"
  }, [_vm.showTime ? _c("div", {
    staticClass: "el-date-picker__time-header"
  }, [_c("span", {
    staticClass: "el-date-picker__editor-wrap"
  }, [_c("el-input", {
    attrs: {
      placeholder: _vm.t("el.datepicker.selectDate"),
      value: _vm.visibleDate,
      size: "small"
    },
    on: {
      input: function input(val) {
        return _vm.userInputDate = val;
      },
      change: _vm.handleVisibleDateChange
    }
  })], 1), _vm._v(" "), _c("span", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleTimePickClose,
      expression: "handleTimePickClose"
    }],
    staticClass: "el-date-picker__editor-wrap"
  }, [_c("el-input", {
    ref: "input",
    attrs: {
      placeholder: _vm.t("el.datepicker.selectTime"),
      value: _vm.visibleTime,
      size: "small"
    },
    on: {
      focus: function focus($event) {
        _vm.timePickerVisible = true;
      },
      input: function input(val) {
        return _vm.userInputTime = val;
      },
      change: _vm.handleVisibleTimeChange
    }
  }), _vm._v(" "), _c("time-picker", {
    ref: "timepicker",
    attrs: {
      "time-arrow-control": _vm.arrowControl,
      visible: _vm.timePickerVisible
    },
    on: {
      pick: _vm.handleTimePick,
      mounted: _vm.proxyTimePickerDataProperties
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView !== "time",
      expression: "currentView !== 'time'"
    }],
    staticClass: "el-date-picker__header",
    class: {
      "el-date-picker__header--bordered": _vm.currentView === "year" || _vm.currentView === "month"
    }
  }, [_c("button", {
    staticClass: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left",
    attrs: {
      type: "button",
      "aria-label": _vm.t("el.datepicker.prevYear")
    },
    on: {
      click: _vm.prevYear
    }
  }), _vm._v(" "), _c("button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "date",
      expression: "currentView === 'date'"
    }],
    staticClass: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left",
    attrs: {
      type: "button",
      "aria-label": _vm.t("el.datepicker.prevMonth")
    },
    on: {
      click: _vm.prevMonth
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "el-date-picker__header-label",
    attrs: {
      role: "button"
    },
    on: {
      click: _vm.showYearPicker
    }
  }, [_vm._v(_vm._s(_vm.yearLabel))]), _vm._v(" "), _c("span", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "date",
      expression: "currentView === 'date'"
    }],
    staticClass: "el-date-picker__header-label",
    class: {
      active: _vm.currentView === "month"
    },
    attrs: {
      role: "button"
    },
    on: {
      click: _vm.showMonthPicker
    }
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.month" + (_vm.month + 1))))]), _vm._v(" "), _c("button", {
    staticClass: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right",
    attrs: {
      type: "button",
      "aria-label": _vm.t("el.datepicker.nextYear")
    },
    on: {
      click: _vm.nextYear
    }
  }), _vm._v(" "), _c("button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "date",
      expression: "currentView === 'date'"
    }],
    staticClass: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right",
    attrs: {
      type: "button",
      "aria-label": _vm.t("el.datepicker.nextMonth")
    },
    on: {
      click: _vm.nextMonth
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__content"
  }, [_c("date-table", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "date",
      expression: "currentView === 'date'"
    }],
    attrs: {
      "selection-mode": _vm.selectionMode,
      "first-day-of-week": _vm.firstDayOfWeek,
      value: _vm.value,
      "default-value": _vm.defaultValue ? new Date(_vm.defaultValue) : null,
      date: _vm.date,
      "cell-class-name": _vm.cellClassName,
      "disabled-date": _vm.disabledDate
    },
    on: {
      pick: _vm.handleDatePick
    }
  }), _vm._v(" "), _c("year-table", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "year",
      expression: "currentView === 'year'"
    }],
    attrs: {
      "selection-mode": _vm.selectionMode,
      value: _vm.value,
      "default-value": _vm.defaultValue ? new Date(_vm.defaultValue) : null,
      date: _vm.date,
      "disabled-date": _vm.disabledDate
    },
    on: {
      pick: _vm.handleYearPick
    }
  }), _vm._v(" "), _c("month-table", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentView === "month",
      expression: "currentView === 'month'"
    }],
    attrs: {
      "selection-mode": _vm.selectionMode,
      value: _vm.value,
      "default-value": _vm.defaultValue ? new Date(_vm.defaultValue) : null,
      date: _vm.date,
      "disabled-date": _vm.disabledDate
    },
    on: {
      pick: _vm.handleMonthPick
    }
  })], 1)])], 2), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.footerVisible && (_vm.currentView === "date" || _vm.currentView === "month" || _vm.currentView === "year"),
      expression: "footerVisible && (currentView === 'date' || currentView === 'month' || currentView === 'year')"
    }],
    staticClass: "el-picker-panel__footer"
  }, [_c("el-button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.selectionMode !== "dates" && _vm.selectionMode !== "months" && _vm.selectionMode !== "years",
      expression: "selectionMode !== 'dates' && selectionMode !== 'months' && selectionMode !== 'years'"
    }],
    staticClass: "el-picker-panel__link-btn",
    attrs: {
      size: "mini",
      type: "text"
    },
    on: {
      click: _vm.changeToNow
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.datepicker.now")) + "\n      ")]), _vm._v(" "), _c("el-button", {
    staticClass: "el-picker-panel__link-btn",
    attrs: {
      plain: "",
      size: "mini"
    },
    on: {
      click: _vm.confirm
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.datepicker.confirm")) + "\n      ")])], 1)])]);
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var calcDefaultValue$1 = defaultValue => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), nextDate(new Date(defaultValue), 1)];
  } else {
    return [new Date(), nextDate(new Date(), 1)];
  }
};
var script$1 = {
  mixins: [Locale],
  directives: {
    Clickoutside
  },
  computed: {
    btnDisabled() {
      return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
    },
    leftLabel() {
      return this.leftDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`);
    },
    rightLabel() {
      return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`);
    },
    leftYear() {
      return this.leftDate.getFullYear();
    },
    leftMonth() {
      return this.leftDate.getMonth();
    },
    leftMonthDate() {
      return this.leftDate.getDate();
    },
    rightYear() {
      return this.rightDate.getFullYear();
    },
    rightMonth() {
      return this.rightDate.getMonth();
    },
    rightMonthDate() {
      return this.rightDate.getDate();
    },
    minVisibleDate() {
      if (this.dateUserInput.min !== null) return this.dateUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.dateFormat);
      return '';
    },
    maxVisibleDate() {
      if (this.dateUserInput.max !== null) return this.dateUserInput.max;
      if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.dateFormat);
      return '';
    },
    minVisibleTime() {
      if (this.timeUserInput.min !== null) return this.timeUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.timeFormat);
      return '';
    },
    maxVisibleTime() {
      if (this.timeUserInput.max !== null) return this.timeUserInput.max;
      if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.timeFormat);
      return '';
    },
    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return 'HH:mm:ss';
      }
    },
    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return 'yyyy-MM-dd';
      }
    },
    enableMonthArrow() {
      var nextMonth = (this.leftMonth + 1) % 12;
      var yearOffset = this.leftMonth + 1 >= 12 ? 1 : 0;
      return this.unlinkPanels && new Date(this.leftYear + yearOffset, nextMonth) < new Date(this.rightYear, this.rightMonth);
    },
    enableYearArrow() {
      return this.unlinkPanels && this.rightYear * 12 + this.rightMonth - (this.leftYear * 12 + this.leftMonth + 1) >= 12;
    }
  },
  data() {
    return {
      popperClass: '',
      value: [],
      defaultValue: null,
      defaultTime: null,
      minDate: '',
      maxDate: '',
      leftDate: new Date(),
      rightDate: nextMonth(new Date()),
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      showTime: false,
      shortcuts: '',
      visible: '',
      disabledDate: '',
      cellClassName: '',
      firstDayOfWeek: 7,
      minTimePickerVisible: false,
      maxTimePickerVisible: false,
      format: '',
      arrowControl: false,
      unlinkPanels: false,
      dateUserInput: {
        min: null,
        max: null
      },
      timeUserInput: {
        min: null,
        max: null
      }
    };
  },
  watch: {
    minDate(val) {
      this.dateUserInput.min = null;
      this.timeUserInput.min = null;
      this.$nextTick(() => {
        if (this.$refs.maxTimePicker && this.maxDate && this.maxDate < this.minDate) {
          var format = 'HH:mm:ss';
          this.$refs.maxTimePicker.selectableRange = [[parseDate(formatDate(this.minDate, format), format), parseDate('23:59:59', format)]];
        }
      });
      if (val && this.$refs.minTimePicker) {
        this.$refs.minTimePicker.date = val;
        this.$refs.minTimePicker.value = val;
      }
    },
    maxDate(val) {
      this.dateUserInput.max = null;
      this.timeUserInput.max = null;
      if (val && this.$refs.maxTimePicker) {
        this.$refs.maxTimePicker.date = val;
        this.$refs.maxTimePicker.value = val;
      }
    },
    minTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.minTimePicker.date = this.minDate;
          this.$refs.minTimePicker.value = this.minDate;
          this.$refs.minTimePicker.adjustSpinners();
        });
      }
    },
    maxTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.maxTimePicker.date = this.maxDate;
          this.$refs.maxTimePicker.value = this.maxDate;
          this.$refs.maxTimePicker.adjustSpinners();
        });
      }
    },
    value(newVal) {
      if (!newVal) {
        this.minDate = null;
        this.maxDate = null;
      } else if (Array.isArray(newVal)) {
        this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
        this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.unlinkPanels && this.maxDate) {
            var minDateYear = this.minDate.getFullYear();
            var minDateMonth = this.minDate.getMonth();
            var maxDateYear = this.maxDate.getFullYear();
            var maxDateMonth = this.maxDate.getMonth();
            this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? nextMonth(this.maxDate) : this.maxDate;
          } else {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.leftDate = calcDefaultValue$1(this.defaultValue)[0];
          this.rightDate = nextMonth(this.leftDate);
        }
      }
    },
    defaultValue(val) {
      if (!Array.isArray(this.value)) {
        var _calcDefaultValue = calcDefaultValue$1(val),
          _calcDefaultValue2 = _slicedToArray(_calcDefaultValue, 2),
          left = _calcDefaultValue2[0],
          right = _calcDefaultValue2[1];
        this.leftDate = left;
        this.rightDate = val && val[1] && this.unlinkPanels ? right : nextMonth(this.leftDate);
      }
    }
  },
  methods: {
    handleClear() {
      this.minDate = null;
      this.maxDate = null;
      this.leftDate = calcDefaultValue$1(this.defaultValue)[0];
      this.rightDate = nextMonth(this.leftDate);
      this.$emit('pick', null);
    },
    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleDateInput(value, type) {
      this.dateUserInput[type] = value;
      if (value.length !== this.dateFormat.length) return;
      var parsedValue = parseDate(value, this.dateFormat);
      if (parsedValue) {
        if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(parsedValue))) {
          return;
        }
        if (type === 'min') {
          this.minDate = modifyDate(this.minDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
          this.leftDate = new Date(parsedValue);
          if (!this.unlinkPanels) {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.maxDate = modifyDate(this.maxDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
          this.rightDate = new Date(parsedValue);
          if (!this.unlinkPanels) {
            this.leftDate = prevMonth(parsedValue);
          }
        }
      }
    },
    handleDateChange(value, type) {
      var parsedValue = parseDate(value, this.dateFormat);
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyDate(this.minDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate;
          }
        } else {
          this.maxDate = modifyDate(this.maxDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate;
          }
        }
      }
    },
    handleTimeInput(value, type) {
      this.timeUserInput[type] = value;
      if (value.length !== this.timeFormat.length) return;
      var parsedValue = parseDate(value, this.timeFormat);
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          this.$nextTick(_ => this.$refs.minTimePicker.adjustSpinners());
        } else {
          this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          this.$nextTick(_ => this.$refs.maxTimePicker.adjustSpinners());
        }
      }
    },
    handleTimeChange(value, type) {
      var parsedValue = parseDate(value, this.timeFormat);
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate;
          }
          this.$refs.minTimePicker.value = this.minDate;
          this.minTimePickerVisible = false;
        } else {
          this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate;
          }
          this.$refs.maxTimePicker.value = this.minDate;
          this.maxTimePickerVisible = false;
        }
      }
    },
    handleRangePick(val, close = true) {
      var defaultTime = this.defaultTime || [];
      var minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
      var maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);
      if (this.maxDate === maxDate && this.minDate === minDate) {
        return;
      }
      this.onPick && this.onPick(val);
      this.maxDate = maxDate;
      this.minDate = minDate;

      // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
      setTimeout(() => {
        this.maxDate = maxDate;
        this.minDate = minDate;
      }, 10);
      if (!close || this.showTime) return;
      this.handleConfirm();
    },
    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    handleMinTimePick(value, visible, first) {
      this.minDate = this.minDate || new Date();
      if (value) {
        this.minDate = modifyTime(this.minDate, value.getHours(), value.getMinutes(), value.getSeconds());
      }
      if (!first) {
        this.minTimePickerVisible = visible;
      }
      if (!this.maxDate || this.maxDate && this.maxDate.getTime() < this.minDate.getTime()) {
        this.maxDate = new Date(this.minDate);
      }
    },
    handleMinTimeClose() {
      this.minTimePickerVisible = false;
    },
    handleMaxTimePick(value, visible, first) {
      if (this.maxDate && value) {
        this.maxDate = modifyTime(this.maxDate, value.getHours(), value.getMinutes(), value.getSeconds());
      }
      if (!first) {
        this.maxTimePickerVisible = visible;
      }
      if (this.maxDate && this.minDate && this.minDate.getTime() > this.maxDate.getTime()) {
        this.minDate = new Date(this.maxDate);
      }
    },
    handleMaxTimeClose() {
      this.maxTimePickerVisible = false;
    },
    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear() {
      this.leftDate = prevYear(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },
    leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },
    rightNextYear() {
      if (!this.unlinkPanels) {
        this.leftDate = nextYear(this.leftDate);
        this.rightDate = nextMonth(this.leftDate);
      } else {
        this.rightDate = nextYear(this.rightDate);
      }
    },
    rightNextMonth() {
      if (!this.unlinkPanels) {
        this.leftDate = nextMonth(this.leftDate);
        this.rightDate = nextMonth(this.leftDate);
      } else {
        this.rightDate = nextMonth(this.rightDate);
      }
    },
    // leftNext*, rightPrev* are called when `unlinkPanels` is true
    leftNextYear() {
      this.leftDate = nextYear(this.leftDate);
    },
    leftNextMonth() {
      this.leftDate = nextMonth(this.leftDate);
    },
    rightPrevYear() {
      this.rightDate = prevYear(this.rightDate);
    },
    rightPrevMonth() {
      this.rightDate = prevMonth(this.rightDate);
    },
    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      }
    },
    isValidValue(value) {
      return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
    },
    resetView() {
      // NOTE: this is a hack to reset {min, max}Date on picker open.
      // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
      //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
      if (this.minDate && this.maxDate == null) this.rangeState.selecting = false;
      this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
      this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;
    }
  },
  components: {
    TimePicker: __vue_component__$6,
    DateTable: __vue_component__$3,
    ElInput: __vue_component__$7,
    ElButton: __vue_component__$8
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
    staticClass: "el-picker-panel el-date-range-picker el-popper",
    class: [{
      "has-sidebar": _vm.$slots.sidebar || _vm.shortcuts,
      "has-time": _vm.showTime
    }, _vm.popperClass]
  }, [_c("div", {
    staticClass: "el-picker-panel__body-wrapper"
  }, [_vm._t("sidebar"), _vm._v(" "), _vm.shortcuts ? _c("div", {
    staticClass: "el-picker-panel__sidebar"
  }, _vm._l(_vm.shortcuts, function (shortcut, key) {
    return _c("button", {
      key: key,
      staticClass: "el-picker-panel__shortcut",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          _vm.handleShortcutClick(shortcut);
        }
      }
    }, [_vm._v(_vm._s(shortcut.text))]);
  }), 0) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__body"
  }, [_vm.showTime ? _c("div", {
    staticClass: "el-date-range-picker__time-header"
  }, [_c("span", {
    staticClass: "el-date-range-picker__editors-wrap"
  }, [_c("span", {
    staticClass: "el-date-range-picker__time-picker-wrap"
  }, [_c("el-input", {
    ref: "minInput",
    staticClass: "el-date-range-picker__editor",
    attrs: {
      size: "small",
      disabled: _vm.rangeState.selecting,
      placeholder: _vm.t("el.datepicker.startDate"),
      value: _vm.minVisibleDate
    },
    on: {
      input: function input(val) {
        return _vm.handleDateInput(val, "min");
      },
      change: function change(val) {
        return _vm.handleDateChange(val, "min");
      }
    }
  })], 1), _vm._v(" "), _c("span", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleMinTimeClose,
      expression: "handleMinTimeClose"
    }],
    staticClass: "el-date-range-picker__time-picker-wrap"
  }, [_c("el-input", {
    staticClass: "el-date-range-picker__editor",
    attrs: {
      size: "small",
      disabled: _vm.rangeState.selecting,
      placeholder: _vm.t("el.datepicker.startTime"),
      value: _vm.minVisibleTime
    },
    on: {
      focus: function focus($event) {
        _vm.minTimePickerVisible = true;
      },
      input: function input(val) {
        return _vm.handleTimeInput(val, "min");
      },
      change: function change(val) {
        return _vm.handleTimeChange(val, "min");
      }
    }
  }), _vm._v(" "), _c("time-picker", {
    ref: "minTimePicker",
    attrs: {
      "time-arrow-control": _vm.arrowControl,
      visible: _vm.minTimePickerVisible
    },
    on: {
      pick: _vm.handleMinTimePick,
      mounted: function mounted($event) {
        _vm.$refs.minTimePicker.format = _vm.timeFormat;
      }
    }
  })], 1)]), _vm._v(" "), _c("span", {
    staticClass: "el-icon-arrow-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "el-date-range-picker__editors-wrap is-right"
  }, [_c("span", {
    staticClass: "el-date-range-picker__time-picker-wrap"
  }, [_c("el-input", {
    staticClass: "el-date-range-picker__editor",
    attrs: {
      size: "small",
      disabled: _vm.rangeState.selecting,
      placeholder: _vm.t("el.datepicker.endDate"),
      value: _vm.maxVisibleDate,
      readonly: !_vm.minDate
    },
    on: {
      input: function input(val) {
        return _vm.handleDateInput(val, "max");
      },
      change: function change(val) {
        return _vm.handleDateChange(val, "max");
      }
    }
  })], 1), _vm._v(" "), _c("span", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleMaxTimeClose,
      expression: "handleMaxTimeClose"
    }],
    staticClass: "el-date-range-picker__time-picker-wrap"
  }, [_c("el-input", {
    staticClass: "el-date-range-picker__editor",
    attrs: {
      size: "small",
      disabled: _vm.rangeState.selecting,
      placeholder: _vm.t("el.datepicker.endTime"),
      value: _vm.maxVisibleTime,
      readonly: !_vm.minDate
    },
    on: {
      focus: function focus($event) {
        _vm.minDate && (_vm.maxTimePickerVisible = true);
      },
      input: function input(val) {
        return _vm.handleTimeInput(val, "max");
      },
      change: function change(val) {
        return _vm.handleTimeChange(val, "max");
      }
    }
  }), _vm._v(" "), _c("time-picker", {
    ref: "maxTimePicker",
    attrs: {
      "time-arrow-control": _vm.arrowControl,
      visible: _vm.maxTimePickerVisible
    },
    on: {
      pick: _vm.handleMaxTimePick,
      mounted: function mounted($event) {
        _vm.$refs.maxTimePicker.format = _vm.timeFormat;
      }
    }
  })], 1)])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__content el-date-range-picker__content is-left"
  }, [_c("div", {
    staticClass: "el-date-range-picker__header"
  }, [_c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-left",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.leftPrevYear
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-arrow-left",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.leftPrevMonth
    }
  }), _vm._v(" "), _vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-right",
    class: {
      "is-disabled": !_vm.enableYearArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableYearArrow
    },
    on: {
      click: _vm.leftNextYear
    }
  }) : _vm._e(), _vm._v(" "), _vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-arrow-right",
    class: {
      "is-disabled": !_vm.enableMonthArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableMonthArrow
    },
    on: {
      click: _vm.leftNextMonth
    }
  }) : _vm._e(), _vm._v(" "), _c("div", [_vm._v(_vm._s(_vm.leftLabel))])]), _vm._v(" "), _c("date-table", {
    attrs: {
      "selection-mode": "range",
      date: _vm.leftDate,
      "default-value": _vm.defaultValue,
      "min-date": _vm.minDate,
      "max-date": _vm.maxDate,
      "range-state": _vm.rangeState,
      "disabled-date": _vm.disabledDate,
      "cell-class-name": _vm.cellClassName,
      "first-day-of-week": _vm.firstDayOfWeek
    },
    on: {
      changerange: _vm.handleChangeRange,
      pick: _vm.handleRangePick
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__content el-date-range-picker__content is-right"
  }, [_c("div", {
    staticClass: "el-date-range-picker__header"
  }, [_vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-left",
    class: {
      "is-disabled": !_vm.enableYearArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableYearArrow
    },
    on: {
      click: _vm.rightPrevYear
    }
  }) : _vm._e(), _vm._v(" "), _vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-arrow-left",
    class: {
      "is-disabled": !_vm.enableMonthArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableMonthArrow
    },
    on: {
      click: _vm.rightPrevMonth
    }
  }) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.rightNextYear
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-arrow-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.rightNextMonth
    }
  }), _vm._v(" "), _c("div", [_vm._v(_vm._s(_vm.rightLabel))])]), _vm._v(" "), _c("date-table", {
    attrs: {
      "selection-mode": "range",
      date: _vm.rightDate,
      "default-value": _vm.defaultValue,
      "min-date": _vm.minDate,
      "max-date": _vm.maxDate,
      "range-state": _vm.rangeState,
      "disabled-date": _vm.disabledDate,
      "cell-class-name": _vm.cellClassName,
      "first-day-of-week": _vm.firstDayOfWeek
    },
    on: {
      changerange: _vm.handleChangeRange,
      pick: _vm.handleRangePick
    }
  })], 1)])], 2), _vm._v(" "), _vm.showTime ? _c("div", {
    staticClass: "el-picker-panel__footer"
  }, [_c("el-button", {
    staticClass: "el-picker-panel__link-btn",
    attrs: {
      size: "mini",
      type: "text"
    },
    on: {
      click: _vm.handleClear
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.datepicker.clear")) + "\n      ")]), _vm._v(" "), _c("el-button", {
    staticClass: "el-picker-panel__link-btn",
    attrs: {
      plain: "",
      size: "mini",
      disabled: _vm.btnDisabled
    },
    on: {
      click: function click($event) {
        _vm.handleConfirm(false);
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.t("el.datepicker.confirm")) + "\n      ")])], 1) : _vm._e()])]);
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

var calcDefaultValue = defaultValue => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), nextMonth(new Date(defaultValue))];
  } else {
    return [new Date(), nextMonth(new Date())];
  }
};
var script = {
  mixins: [Locale],
  directives: {
    Clickoutside
  },
  computed: {
    btnDisabled() {
      return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
    },
    leftLabel() {
      return this.leftDate.getFullYear() + ' ' + this.t('el.datepicker.year');
    },
    rightLabel() {
      return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year');
    },
    leftYear() {
      return this.leftDate.getFullYear();
    },
    rightYear() {
      return this.rightDate.getFullYear() === this.leftDate.getFullYear() ? this.leftDate.getFullYear() + 1 : this.rightDate.getFullYear();
    },
    enableYearArrow() {
      return this.unlinkPanels && this.rightYear > this.leftYear + 1;
    }
  },
  data() {
    return {
      popperClass: '',
      value: [],
      defaultValue: null,
      defaultTime: null,
      minDate: '',
      maxDate: '',
      leftDate: new Date(),
      rightDate: nextYear(new Date()),
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      shortcuts: '',
      visible: '',
      disabledDate: '',
      format: '',
      arrowControl: false,
      unlinkPanels: false
    };
  },
  watch: {
    value(newVal) {
      if (!newVal) {
        this.minDate = null;
        this.maxDate = null;
      } else if (Array.isArray(newVal)) {
        this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
        this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.unlinkPanels && this.maxDate) {
            var minDateYear = this.minDate.getFullYear();
            var maxDateYear = this.maxDate.getFullYear();
            this.rightDate = minDateYear === maxDateYear ? nextYear(this.maxDate) : this.maxDate;
          } else {
            this.rightDate = nextYear(this.leftDate);
          }
        } else {
          this.leftDate = calcDefaultValue(this.defaultValue)[0];
          this.rightDate = nextYear(this.leftDate);
        }
      }
    },
    defaultValue(val) {
      if (!Array.isArray(this.value)) {
        var _calcDefaultValue = calcDefaultValue(val),
          _calcDefaultValue2 = _slicedToArray(_calcDefaultValue, 2),
          left = _calcDefaultValue2[0],
          right = _calcDefaultValue2[1];
        this.leftDate = left;
        this.rightDate = val && val[1] && left.getFullYear() !== right.getFullYear() && this.unlinkPanels ? right : nextYear(this.leftDate);
      }
    }
  },
  methods: {
    handleClear() {
      this.minDate = null;
      this.maxDate = null;
      this.leftDate = calcDefaultValue(this.defaultValue)[0];
      this.rightDate = nextYear(this.leftDate);
      this.$emit('pick', null);
    },
    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleRangePick(val, close = true) {
      var defaultTime = this.defaultTime || [];
      var minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
      var maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);
      if (this.maxDate === maxDate && this.minDate === minDate) {
        return;
      }
      this.onPick && this.onPick(val);
      this.maxDate = maxDate;
      this.minDate = minDate;

      // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
      setTimeout(() => {
        this.maxDate = maxDate;
        this.minDate = minDate;
      }, 10);
      if (!close) return;
      this.handleConfirm();
    },
    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear() {
      this.leftDate = prevYear(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = prevYear(this.rightDate);
      }
    },
    rightNextYear() {
      if (!this.unlinkPanels) {
        this.leftDate = nextYear(this.leftDate);
      }
      this.rightDate = nextYear(this.rightDate);
    },
    // leftNext*, rightPrev* are called when `unlinkPanels` is true
    leftNextYear() {
      this.leftDate = nextYear(this.leftDate);
    },
    rightPrevYear() {
      this.rightDate = prevYear(this.rightDate);
    },
    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      }
    },
    isValidValue(value) {
      return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
    },
    resetView() {
      // NOTE: this is a hack to reset {min, max}Date on picker open.
      // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
      //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
      this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
      this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;
    }
  },
  components: {
    MonthTable: __vue_component__$4,
    ElInput: __vue_component__$7,
    ElButton: __vue_component__$8
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
    staticClass: "el-picker-panel el-date-range-picker el-popper",
    class: [{
      "has-sidebar": _vm.$slots.sidebar || _vm.shortcuts
    }, _vm.popperClass]
  }, [_c("div", {
    staticClass: "el-picker-panel__body-wrapper"
  }, [_vm._t("sidebar"), _vm._v(" "), _vm.shortcuts ? _c("div", {
    staticClass: "el-picker-panel__sidebar"
  }, _vm._l(_vm.shortcuts, function (shortcut, key) {
    return _c("button", {
      key: key,
      staticClass: "el-picker-panel__shortcut",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          _vm.handleShortcutClick(shortcut);
        }
      }
    }, [_vm._v(_vm._s(shortcut.text))]);
  }), 0) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__body"
  }, [_c("div", {
    staticClass: "el-picker-panel__content el-date-range-picker__content is-left"
  }, [_c("div", {
    staticClass: "el-date-range-picker__header"
  }, [_c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-left",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.leftPrevYear
    }
  }), _vm._v(" "), _vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-right",
    class: {
      "is-disabled": !_vm.enableYearArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableYearArrow
    },
    on: {
      click: _vm.leftNextYear
    }
  }) : _vm._e(), _vm._v(" "), _c("div", [_vm._v(_vm._s(_vm.leftLabel))])]), _vm._v(" "), _c("month-table", {
    attrs: {
      "selection-mode": "range",
      date: _vm.leftDate,
      "default-value": _vm.defaultValue,
      "min-date": _vm.minDate,
      "max-date": _vm.maxDate,
      "range-state": _vm.rangeState,
      "disabled-date": _vm.disabledDate
    },
    on: {
      changerange: _vm.handleChangeRange,
      pick: _vm.handleRangePick
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "el-picker-panel__content el-date-range-picker__content is-right"
  }, [_c("div", {
    staticClass: "el-date-range-picker__header"
  }, [_vm.unlinkPanels ? _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-left",
    class: {
      "is-disabled": !_vm.enableYearArrow
    },
    attrs: {
      type: "button",
      disabled: !_vm.enableYearArrow
    },
    on: {
      click: _vm.rightPrevYear
    }
  }) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.rightNextYear
    }
  }), _vm._v(" "), _c("div", [_vm._v(_vm._s(_vm.rightLabel))])]), _vm._v(" "), _c("month-table", {
    attrs: {
      "selection-mode": "range",
      date: _vm.rightDate,
      "default-value": _vm.defaultValue,
      "min-date": _vm.minDate,
      "max-date": _vm.maxDate,
      "range-state": _vm.rangeState,
      "disabled-date": _vm.disabledDate
    },
    on: {
      changerange: _vm.handleChangeRange,
      pick: _vm.handleRangePick
    }
  })], 1)])], 2)])]);
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

var getPanel = function getPanel(type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return __vue_component__$1;
  } else if (type === 'monthrange') {
    return __vue_component__;
  }
  return __vue_component__$2;
};
var DatePicker = {
  mixins: [__vue_component__$9],
  name: 'ElDatePicker',
  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean
  },
  watch: {
    type(type) {
      if (this.picker) {
        this.unmountPicker();
        this.panel = getPanel(type);
        this.mountPicker();
      } else {
        this.panel = getPanel(type);
      }
    }
  },
  created() {
    this.panel = getPanel(this.type);
  }
};

/* istanbul ignore next */
DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

export { DatePicker as default };
