import fecha from 'element-ui/lib/utils/date';
import { t } from 'element-ui/lib/locale';

var weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
var newArray = function newArray(start, end) {
  var result = [];
  for (var i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
var getI18nSettings = function getI18nSettings() {
  return {
    dayNamesShort: weeks.map(function (week) {
      return t("el.datepicker.weeks.".concat(week));
    }),
    dayNames: weeks.map(function (week) {
      return t("el.datepicker.weeks.".concat(week));
    }),
    monthNamesShort: months.map(function (month) {
      return t("el.datepicker.months.".concat(month));
    }),
    monthNames: months.map(function (month, index) {
      return t("el.datepicker.month".concat(index + 1));
    }),
    amPm: ['am', 'pm']
  };
};
var toDate = function toDate(date) {
  return isDate(date) ? new Date(date) : null;
};
var isDate = function isDate(date) {
  if (date === null || date === undefined) return false;
  if (isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
};
var isDateObject = function isDateObject(val) {
  return val instanceof Date;
};
var formatDate = function formatDate(date, format) {
  date = toDate(date);
  if (!date) return '';
  return fecha.format(date, format || 'yyyy-MM-dd', getI18nSettings());
};
var parseDate = function parseDate(string, format) {
  return fecha.parse(string, format || 'yyyy-MM-dd', getI18nSettings());
};
var getDayCountOfMonth = function getDayCountOfMonth(year, month) {
  if (isNaN(+month)) return 31;
  return new Date(year, +month + 1, 0).getDate();
};
var getDayCountOfYear = function getDayCountOfYear(year) {
  var isLeapYear = year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
  return isLeapYear ? 366 : 365;
};
var getFirstDayOfMonth = function getFirstDayOfMonth(date) {
  var temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
};

// see: https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
// {prev, next} Date should work for Daylight Saving Time
// Adding 24 * 60 * 60 * 1000 does not work in the above scenario
var prevDate = function prevDate(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
};
var nextDate = function nextDate(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
};
var getStartDateOfMonth = function getStartDateOfMonth(year, month) {
  var result = new Date(year, month, 1);
  var day = result.getDay();
  if (day === 0) {
    return prevDate(result, 7);
  } else {
    return prevDate(result, day);
  }
};
var getWeekNumber = function getWeekNumber(src) {
  if (!isDate(src)) return null;
  var date = new Date(src.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};
var getRangeHours = function getRangeHours(ranges) {
  var hours = [];
  var disabledHours = [];
  (ranges || []).forEach(function (range) {
    var value = range.map(function (date) {
      return date.getHours();
    });
    disabledHours = disabledHours.concat(newArray(value[0], value[1]));
  });
  if (disabledHours.length) {
    for (var i = 0; i < 24; i++) {
      hours[i] = disabledHours.indexOf(i) === -1;
    }
  } else {
    for (var _i = 0; _i < 24; _i++) {
      hours[_i] = false;
    }
  }
  return hours;
};
var getPrevMonthLastDays = function getPrevMonthLastDays(date, amount) {
  if (amount <= 0) return [];
  var temp = new Date(date.getTime());
  temp.setDate(0);
  var lastDay = temp.getDate();
  return range(amount).map(function (_, index) {
    return lastDay - (amount - index - 1);
  });
};
var getMonthDays = function getMonthDays(date) {
  var temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var days = temp.getDate();
  return range(days).map(function (_, index) {
    return index + 1;
  });
};
function setRangeData(arr, start, end, value) {
  for (var i = start; i < end; i++) {
    arr[i] = value;
  }
}
var getRangeMinutes = function getRangeMinutes(ranges, hour) {
  var minutes = new Array(60);
  if (ranges.length > 0) {
    ranges.forEach(function (range) {
      var start = range[0];
      var end = range[1];
      var startHour = start.getHours();
      var startMinute = start.getMinutes();
      var endHour = end.getHours();
      var endMinute = end.getMinutes();
      if (startHour === hour && endHour !== hour) {
        setRangeData(minutes, startMinute, 60, true);
      } else if (startHour === hour && endHour === hour) {
        setRangeData(minutes, startMinute, endMinute + 1, true);
      } else if (startHour !== hour && endHour === hour) {
        setRangeData(minutes, 0, endMinute + 1, true);
      } else if (startHour < hour && endHour > hour) {
        setRangeData(minutes, 0, 60, true);
      }
    });
  } else {
    setRangeData(minutes, 0, 60, true);
  }
  return minutes;
};
var range = function range(n) {
  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, {
    length: n
  }).map(function (_, n) {
    return n;
  });
};
var modifyDate = function modifyDate(date, y, m, d) {
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};
var modifyTime = function modifyTime(date, h, m, s) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds());
};
var modifyWithTimeString = function modifyWithTimeString(date, time) {
  if (date == null || !time) {
    return date;
  }
  time = parseDate(time, 'HH:mm:ss');
  return modifyTime(date, time.getHours(), time.getMinutes(), time.getSeconds());
};
var clearTime = function clearTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
var clearMilliseconds = function clearMilliseconds(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
};
var limitTimeRange = function limitTimeRange(date, ranges) {
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HH:mm:ss';
  // TODO: refactory a more elegant solution
  if (ranges.length === 0) return date;
  var normalizeDate = function normalizeDate(date) {
    return fecha.parse(fecha.format(date, format), format);
  };
  var ndate = normalizeDate(date);
  var nranges = ranges.map(function (range) {
    return range.map(normalizeDate);
  });
  if (nranges.some(function (nrange) {
    return ndate >= nrange[0] && ndate <= nrange[1];
  })) return date;
  var minDate = nranges[0][0];
  var maxDate = nranges[0][0];
  nranges.forEach(function (nrange) {
    minDate = new Date(Math.min(nrange[0], minDate));
    maxDate = new Date(Math.max(nrange[1], minDate));
  });
  var ret = ndate < minDate ? minDate : maxDate;
  // preserve Year/Month/Date
  return modifyDate(ret, date.getFullYear(), date.getMonth(), date.getDate());
};
var timeWithinRange = function timeWithinRange(date, selectableRange, format) {
  var limitedDate = limitTimeRange(date, selectableRange, format);
  return limitedDate.getTime() === date.getTime();
};
var changeYearMonthAndClampDate = function changeYearMonthAndClampDate(date, year, month) {
  // clamp date to the number of days in `year`, `month`
  // eg: (2010-1-31, 2010, 2) => 2010-2-28
  var monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};
var prevMonth = function prevMonth(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  return month === 0 ? changeYearMonthAndClampDate(date, year - 1, 11) : changeYearMonthAndClampDate(date, year, month - 1);
};
var nextMonth = function nextMonth(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  return month === 11 ? changeYearMonthAndClampDate(date, year + 1, 0) : changeYearMonthAndClampDate(date, year, month + 1);
};
var prevYear = function prevYear(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var year = date.getFullYear();
  var month = date.getMonth();
  return changeYearMonthAndClampDate(date, year - amount, month);
};
var nextYear = function nextYear(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var year = date.getFullYear();
  var month = date.getMonth();
  return changeYearMonthAndClampDate(date, year + amount, month);
};
var extractDateFormat = function extractDateFormat(format) {
  return format.replace(/\W?m{1,2}|\W?ZZ/g, '').replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, '').trim();
};
var extractTimeFormat = function extractTimeFormat(format) {
  return format.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?y{2,4}/g, '').trim();
};
var validateRangeInOneMonth = function validateRangeInOneMonth(start, end) {
  return start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
};

export { changeYearMonthAndClampDate, clearMilliseconds, clearTime, extractDateFormat, extractTimeFormat, formatDate, getDayCountOfMonth, getDayCountOfYear, getFirstDayOfMonth, getI18nSettings, getMonthDays, getPrevMonthLastDays, getRangeHours, getRangeMinutes, getStartDateOfMonth, getWeekNumber, isDate, isDateObject, limitTimeRange, modifyDate, modifyTime, modifyWithTimeString, nextDate, nextMonth, nextYear, parseDate, prevDate, prevMonth, prevYear, range, timeWithinRange, toDate, validateRangeInOneMonth };
