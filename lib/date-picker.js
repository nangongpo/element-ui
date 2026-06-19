import Vue from 'vue';
import Clickoutside from 'element-ui/lib/utils/clickoutside';
import { isDateObject, getWeekNumber, formatDate, parseDate, getRangeHours, getRangeMinutes, modifyTime, limitTimeRange, isDate, clearMilliseconds, timeWithinRange, getDayCountOfYear, range, nextDate, getDayCountOfMonth, getStartDateOfMonth, getFirstDayOfMonth, prevDate, clearTime, prevMonth, nextMonth, prevYear, nextYear, modifyWithTimeString, modifyDate, changeYearMonthAndClampDate, extractTimeFormat, extractDateFormat } from 'element-ui/lib/utils/date-util';
import Popper from 'element-ui/lib/utils/vue-popper';
import Emitter from 'element-ui/lib/mixins/emitter';
import ElInput from 'element-ui/lib/input';
import merge from 'element-ui/lib/utils/merge';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Locale from 'element-ui/lib/mixins/locale';
import ElButton from 'element-ui/lib/button';
import ElScrollbar from 'element-ui/lib/scrollbar';
import RepeatClick from 'element-ui/lib/directives/repeat-click';
import { hasClass } from 'element-ui/lib/utils/dom';
import { arrayFindIndex, coerceTruthyValueToArray, arrayFind } from 'element-ui/lib/utils/util';

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

var NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset,
    transformOrigin: Popper.props.transformOrigin
  },
  methods: Popper.methods,
  data: function data() {
    return merge({
      visibleArrow: true
    }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy
};
var DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  months: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy',
  years: 'yyyy'
};
var HAVE_TRIGGER_TYPES = ['date', 'datetime', 'time', 'time-select', 'week', 'month', 'year', 'daterange', 'monthrange', 'timerange', 'datetimerange', 'dates', 'months', 'years'];
var DATE_FORMATTER = function DATE_FORMATTER(value, format) {
  if (format === 'timestamp') return value.getTime();
  return formatDate(value, format);
};
var DATE_PARSER = function DATE_PARSER(text, format) {
  if (format === 'timestamp') return new Date(Number(text));
  return parseDate(text, format);
};
var RANGE_FORMATTER = function RANGE_FORMATTER(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    var start = value[0];
    var end = value[1];
    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
    }
  }
  return '';
};
var RANGE_PARSER = function RANGE_PARSER(array, format, separator) {
  if (!Array.isArray(array)) {
    array = array.split(separator);
  }
  if (array.length === 2) {
    var range1 = array[0];
    var range2 = array[1];
    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
  }
  return [];
};
var TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter: function formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser: function parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  week: {
    formatter: function formatter(value, format) {
      var week = getWeekNumber(value);
      var month = value.getMonth();
      var trueDate = new Date(value);
      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0);
        trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7);
      }
      var date = formatDate(trueDate, format);
      date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week);
      return date;
    },
    parser: function parser(text, format) {
      // parse as if a normal date
      return TYPE_VALUE_RESOLVER_MAP.date.parser(text, format);
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  monthrange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter: function formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser: function parser(text) {
      var result = Number(text);
      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    }
  },
  dates: {
    formatter: function formatter(value, format) {
      return value.map(function (date) {
        return DATE_FORMATTER(date, format);
      });
    },
    parser: function parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map(function (date) {
        return date instanceof Date ? date : DATE_PARSER(date, format);
      });
    }
  },
  months: {
    formatter: function formatter(value, format) {
      return value.map(function (date) {
        return DATE_FORMATTER(date, format);
      });
    },
    parser: function parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map(function (date) {
        return date instanceof Date ? date : DATE_PARSER(date, format);
      });
    }
  },
  years: {
    formatter: function formatter(value, format) {
      return value.map(function (date) {
        return DATE_FORMATTER(date, format);
      });
    },
    parser: function parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map(function (date) {
        return date instanceof Date ? date : DATE_PARSER(date, format);
      });
    }
  }
};
var PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom',
  right: 'bottom-end'
};
var parseAsFormatAndType = function parseAsFormatAndType(value, customFormat, type) {
  var rangeSeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
  if (!value) return null;
  var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
  var format = customFormat || DEFAULT_FORMATS[type];
  return parser(value, format, rangeSeparator);
};
var formatAsFormatAndType = function formatAsFormatAndType(value, customFormat, type) {
  if (!value) return null;
  var formatter = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
  var format = customFormat || DEFAULT_FORMATS[type];
  return formatter(value, format);
};

/*
 * Considers:
 *   1. Date object
 *   2. date string
 *   3. array of 1 or 2
 */
var valueEquals = function valueEquals(a, b) {
  // considers Date object and string
  var dateEquals = function dateEquals(a, b) {
    var aIsDate = a instanceof Date;
    var bIsDate = b instanceof Date;
    if (aIsDate && bIsDate) {
      return a.getTime() === b.getTime();
    }
    if (!aIsDate && !bIsDate) {
      return a === b;
    }
    return false;
  };
  var aIsArray = a instanceof Array;
  var bIsArray = b instanceof Array;
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every(function (item, index) {
      return dateEquals(item, b[index]);
    });
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b);
  }
  return false;
};
var isString = function isString(val) {
  return typeof val === 'string' || val instanceof String;
};
var validator = function validator(val) {
  // either: String, Array of String, null / undefined
  return val === null || val === undefined || isString(val) || Array.isArray(val) && val.length === 2 && val.every(isString);
};
var script$8 = {
  mixins: [Emitter, NewPopper],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    size: String,
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close'
    },
    name: {
      default: '',
      validator: validator
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    id: {
      default: '',
      validator: validator
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'left'
    },
    value: {},
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
      default: '-'
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ElInput: ElInput
  },
  directives: {
    Clickoutside: Clickoutside
  },
  data: function data() {
    return {
      pickerVisible: false,
      showClose: false,
      userInput: null,
      valueOnOpen: null,
      // value when picker opens, used to determine whether to emit change
      unwatchPickerOptions: null
    };
  },
  watch: {
    pickerVisible: function pickerVisible(val) {
      if (this.readonly || this.pickerDisabled) return;
      if (val) {
        this.showPicker();
        this.valueOnOpen = Array.isArray(this.value) ? _toConsumableArray(this.value) : this.value;
      } else {
        this.hidePicker();
        this.emitChange(this.value);
        this.userInput = null;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur');
        }
        this.$emit('blur', this);
        this.blur();
      }
    },
    parsedValue: {
      immediate: true,
      handler: function handler(val) {
        if (this.picker) {
          this.picker.value = val;
        }
      }
    },
    defaultValue: function defaultValue(val) {
      // NOTE: should eventually move to jsx style picker + panel ?
      if (this.picker) {
        this.picker.defaultValue = val;
      }
    },
    value: function value(val, oldVal) {
      if (!valueEquals(val, oldVal) && !this.pickerVisible && this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', val);
      }
    }
  },
  computed: {
    ranged: function ranged() {
      return this.type.indexOf('range') > -1;
    },
    reference: function reference() {
      var reference = this.$refs.reference;
      return reference.$el || reference;
    },
    refInput: function refInput() {
      if (this.reference) {
        return [].slice.call(this.reference.querySelectorAll('input'));
      }
      return [];
    },
    valueIsEmpty: function valueIsEmpty() {
      var val = this.value;
      if (Array.isArray(val)) {
        for (var i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else {
        if (val) {
          return false;
        }
      }
      return true;
    },
    triggerClass: function triggerClass() {
      return this.prefixIcon || (this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date');
    },
    selectionMode: function selectionMode() {
      if (this.type === 'week') {
        return 'week';
      } else if (this.type === 'month') {
        return 'month';
      } else if (this.type === 'year') {
        return 'year';
      } else if (this.type === 'dates') {
        return 'dates';
      } else if (this.type === 'months') {
        return 'months';
      } else if (this.type === 'years') {
        return 'years';
      }
      return 'day';
    },
    haveTrigger: function haveTrigger() {
      if (typeof this.showTrigger !== 'undefined') {
        return this.showTrigger;
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },
    displayValue: function displayValue() {
      var formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator);
      if (Array.isArray(this.userInput)) {
        return [this.userInput[0] || formattedValue && formattedValue[0] || '', this.userInput[1] || formattedValue && formattedValue[1] || ''];
      } else if (this.userInput !== null) {
        return this.userInput;
      } else if (formattedValue) {
        return this.type === 'dates' || this.type === 'years' || this.type === 'months' ? formattedValue.join(', ') : formattedValue;
      } else {
        return '';
      }
    },
    parsedValue: function parsedValue() {
      if (!this.value) return this.value; // component value is not set
      if (this.type === 'time-select') return this.value; // time-select does not require parsing, this might change in next major version

      var valueIsDateObject = isDateObject(this.value) || Array.isArray(this.value) && this.value.every(isDateObject);
      if (valueIsDateObject) {
        return this.value;
      }
      if (this.valueFormat) {
        return parseAsFormatAndType(this.value, this.valueFormat, this.type, this.rangeSeparator) || this.value;
      }

      // NOTE: deal with common but incorrect usage, should remove in next major version
      // user might provide string / timestamp without value-format, coerce them into date (or array of date)
      return Array.isArray(this.value) ? this.value.map(function (val) {
        return new Date(val);
      }) : new Date(this.value);
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    pickerSize: function pickerSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    pickerDisabled: function pickerDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    firstInputId: function firstInputId() {
      var obj = {};
      var id;
      if (this.ranged) {
        id = this.id && this.id[0];
      } else {
        id = this.id;
      }
      if (id) obj.id = id;
      return obj;
    },
    secondInputId: function secondInputId() {
      var obj = {};
      var id;
      if (this.ranged) {
        id = this.id && this.id[1];
      }
      if (id) obj.id = id;
      return obj;
    }
  },
  created: function created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
    this.$on('fieldReset', this.handleFieldReset);
  },
  methods: {
    focus: function focus() {
      if (!this.ranged) {
        this.$refs.reference.focus();
      } else {
        this.handleFocus();
      }
    },
    blur: function blur() {
      this.refInput.forEach(function (input) {
        return input.blur();
      });
    },
    // {parse, formatTo} Value deals maps component value with internal Date
    parseValue: function parseValue(value) {
      var isParsed = isDateObject(value) || Array.isArray(value) && value.every(isDateObject);
      if (this.valueFormat && !isParsed) {
        return parseAsFormatAndType(value, this.valueFormat, this.type, this.rangeSeparator) || value;
      } else {
        return value;
      }
    },
    formatToValue: function formatToValue(date) {
      var isFormattable = isDateObject(date) || Array.isArray(date) && date.every(isDateObject);
      if (this.valueFormat && isFormattable) {
        return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator);
      } else {
        return date;
      }
    },
    // {parse, formatTo} String deals with user input
    parseString: function parseString(value) {
      var type = Array.isArray(value) ? this.type : this.type.replace('range', '');
      return parseAsFormatAndType(value, this.format, type);
    },
    formatToString: function formatToString(value) {
      var type = Array.isArray(value) ? this.type : this.type.replace('range', '');
      return formatAsFormatAndType(value, this.format, type);
    },
    handleMouseEnter: function handleMouseEnter() {
      if (this.readonly || this.pickerDisabled) return;
      if (!this.valueIsEmpty && this.clearable) {
        this.showClose = true;
      }
    },
    handleChange: function handleChange() {
      if (this.userInput) {
        var value = this.parseString(this.displayValue);
        if (value) {
          this.picker.value = value;
          if (this.isValidValue(value)) {
            this.emitInput(value);
            this.userInput = null;
          }
        }
      }
      if (this.userInput === '') {
        this.emitInput(null);
        this.emitChange(null);
        this.userInput = null;
      }
    },
    handleStartInput: function handleStartInput(event) {
      if (this.userInput) {
        this.userInput = [event.target.value, this.userInput[1]];
      } else {
        this.userInput = [event.target.value, null];
      }
    },
    handleEndInput: function handleEndInput(event) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], event.target.value];
      } else {
        this.userInput = [null, event.target.value];
      }
    },
    handleStartChange: function handleStartChange(event) {
      var value = this.parseString(this.userInput && this.userInput[0]);
      if (value) {
        this.userInput = [this.formatToString(value), this.displayValue[1]];
        var newValue = [value, this.picker.value && this.picker.value[1]];
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },
    handleEndChange: function handleEndChange(event) {
      var value = this.parseString(this.userInput && this.userInput[1]);
      if (value) {
        this.userInput = [this.displayValue[0], this.formatToString(value)];
        var newValue = [this.picker.value && this.picker.value[0], value];
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },
    handleClickIcon: function handleClickIcon(event) {
      if (this.readonly || this.pickerDisabled) return;
      if (this.showClose) {
        this.valueOnOpen = this.value;
        event.stopPropagation();
        this.emitInput(null);
        this.emitChange(null);
        this.showClose = false;
        if (this.picker && typeof this.picker.handleClear === 'function') {
          this.picker.handleClear();
        }
      } else {
        this.pickerVisible = !this.pickerVisible;
      }
    },
    handleClose: function handleClose() {
      if (!this.pickerVisible) return;
      this.pickerVisible = false;
      if (this.type === 'dates' || this.type === 'years' || this.type === 'months') {
        // restore to former value
        var oldValue = parseAsFormatAndType(this.valueOnOpen, this.valueFormat, this.type, this.rangeSeparator) || this.valueOnOpen;
        this.emitInput(oldValue);
      }
    },
    handleFieldReset: function handleFieldReset(initialValue) {
      this.userInput = initialValue === '' ? null : initialValue;
    },
    handleFocus: function handleFocus() {
      var type = this.type;
      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit('focus', this);
    },
    handleKeydown: function handleKeydown(event) {
      var _this = this;
      var keyCode = event.keyCode;

      // ESC
      if (keyCode === 27) {
        this.pickerVisible = false;
        event.stopPropagation();
        return;
      }

      // Tab
      if (keyCode === 9) {
        if (!this.ranged) {
          this.handleChange();
          this.pickerVisible = this.picker.visible = false;
          this.blur();
          event.stopPropagation();
        } else {
          // user may change focus between two input
          setTimeout(function () {
            if (_this.refInput.indexOf(document.activeElement) === -1) {
              _this.pickerVisible = false;
              _this.blur();
              event.stopPropagation();
            }
          }, 0);
        }
        return;
      }

      // Enter
      if (keyCode === 13) {
        if (this.userInput === '' || this.isValidValue(this.parseString(this.displayValue))) {
          this.handleChange();
          this.pickerVisible = this.picker.visible = false;
          this.blur();
        }
        event.stopPropagation();
        return;
      }

      // if user is typing, do not let picker handle key input
      if (this.userInput) {
        event.stopPropagation();
        return;
      }

      // delegate other keys to panel
      if (this.picker && this.picker.handleKeydown) {
        this.picker.handleKeydown(event);
      }
    },
    handleRangeClick: function handleRangeClick() {
      var type = this.type;
      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit('focus', this);
    },
    hidePicker: function hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView();
        this.pickerVisible = this.picker.visible = false;
        this.destroyPopper();
      }
    },
    showPicker: function showPicker() {
      var _this2 = this;
      if (this.$isServer) return;
      if (!this.picker) {
        this.mountPicker();
      }
      this.pickerVisible = this.picker.visible = true;
      this.updatePopper();
      this.picker.value = this.parsedValue;
      this.picker.resetView && this.picker.resetView();
      this.$nextTick(function () {
        _this2.picker.adjustSpinners && _this2.picker.adjustSpinners();
      });
    },
    mountPicker: function mountPicker() {
      var _this3 = this;
      this.picker = new Vue(this.panel).$mount();
      this.picker.defaultValue = this.defaultValue;
      this.picker.defaultTime = this.defaultTime;
      this.picker.popperClass = this.popperClass;
      this.popperElm = this.picker.$el;
      this.picker.width = this.reference.getBoundingClientRect().width;
      this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
      this.picker.selectionMode = this.selectionMode;
      this.picker.unlinkPanels = this.unlinkPanels;
      this.picker.arrowControl = this.arrowControl || this.timeArrowControl || false;
      this.$watch('format', function (format) {
        _this3.picker.format = format;
      });
      var updateOptions = function updateOptions() {
        var options = _this3.pickerOptions;
        if (options && options.selectableRange) {
          var ranges = options.selectableRange;
          var parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
          var format = DEFAULT_FORMATS.timerange;
          ranges = Array.isArray(ranges) ? ranges : [ranges];
          _this3.picker.selectableRange = ranges.map(function (range) {
            return parser(range, format, _this3.rangeSeparator);
          });
        }
        for (var option in options) {
          if (options.hasOwnProperty(option) &&
          // 忽略 time-picker 的该配置项
          option !== 'selectableRange') {
            _this3.picker[option] = options[option];
          }
        }

        // main format must prevail over undocumented pickerOptions.format
        if (_this3.format) {
          _this3.picker.format = _this3.format;
        }
      };
      updateOptions();
      this.unwatchPickerOptions = this.$watch('pickerOptions', function () {
        return updateOptions();
      }, {
        deep: true
      });
      this.$el.appendChild(this.picker.$el);
      this.picker.resetView && this.picker.resetView();
      this.picker.$on('dodestroy', this.doDestroy);
      this.picker.$on('pick', function () {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var visible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        _this3.userInput = null;
        _this3.pickerVisible = _this3.picker.visible = visible;
        _this3.emitInput(date);
        _this3.picker.resetView && _this3.picker.resetView();
      });
      this.picker.$on('select-range', function (start, end, pos) {
        if (_this3.refInput.length === 0) return;
        if (!pos || pos === 'min') {
          _this3.refInput[0].setSelectionRange(start, end);
          _this3.refInput[0].focus();
        } else if (pos === 'max') {
          _this3.refInput[1].setSelectionRange(start, end);
          _this3.refInput[1].focus();
        }
      });
    },
    unmountPicker: function unmountPicker() {
      if (this.picker) {
        this.picker.$destroy();
        this.picker.$off();
        if (typeof this.unwatchPickerOptions === 'function') {
          this.unwatchPickerOptions();
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el);
      }
    },
    emitChange: function emitChange(val) {
      // determine user real change only
      if (!valueEquals(val, this.valueOnOpen)) {
        this.$emit('change', val);
        this.valueOnOpen = val;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', val);
        }
      }
    },
    emitInput: function emitInput(val) {
      var formatted = this.formatToValue(val);
      if (!valueEquals(this.value, formatted)) {
        this.$emit('input', formatted);
      }
    },
    isValidValue: function isValidValue(value) {
      if (!this.picker) {
        this.mountPicker();
      }
      if (this.picker.isValidValue) {
        return value && this.picker.isValidValue(value);
      } else {
        return true;
      }
    }
  }
};

/* script */
var __vue_script__$8 = script$8;

/* template */
var __vue_render__$8 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return !_vm.ranged ? _c("el-input", _vm._b({
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleClose,
      expression: "handleClose"
    }],
    ref: "reference",
    staticClass: "el-date-editor",
    class: "el-date-editor--" + _vm.type,
    attrs: {
      readonly: !_vm.editable || _vm.readonly || _vm.type === "dates" || _vm.type === "week" || _vm.type === "years" || _vm.type === "months",
      disabled: _vm.pickerDisabled,
      size: _vm.pickerSize,
      name: _vm.name,
      placeholder: _vm.placeholder,
      value: _vm.displayValue,
      validateEvent: false
    },
    on: {
      focus: _vm.handleFocus,
      input: function input(value) {
        return _vm.userInput = value;
      },
      change: _vm.handleChange
    },
    nativeOn: {
      keydown: function keydown($event) {
        return _vm.handleKeydown($event);
      },
      mouseenter: function mouseenter($event) {
        return _vm.handleMouseEnter($event);
      },
      mouseleave: function mouseleave($event) {
        _vm.showClose = false;
      }
    }
  }, "el-input", _vm.firstInputId, false), [_c("i", {
    staticClass: "el-input__icon",
    class: _vm.triggerClass,
    attrs: {
      slot: "prefix"
    },
    on: {
      click: _vm.handleFocus
    },
    slot: "prefix"
  }), _vm._v(" "), _vm.haveTrigger ? _c("i", {
    staticClass: "el-input__icon",
    class: [_vm.showClose ? "" + _vm.clearIcon : ""],
    attrs: {
      slot: "suffix"
    },
    on: {
      click: _vm.handleClickIcon
    },
    slot: "suffix"
  }) : _vm._e()]) : _c("div", {
    directives: [{
      name: "clickoutside",
      rawName: "v-clickoutside",
      value: _vm.handleClose,
      expression: "handleClose"
    }],
    ref: "reference",
    staticClass: "el-date-editor el-range-editor el-input__inner",
    class: ["el-date-editor--" + _vm.type, _vm.pickerSize ? "el-range-editor--" + _vm.pickerSize : "", _vm.pickerDisabled ? "is-disabled" : "", _vm.pickerVisible ? "is-active" : ""],
    on: {
      click: _vm.handleRangeClick,
      mouseenter: _vm.handleMouseEnter,
      mouseleave: function mouseleave($event) {
        _vm.showClose = false;
      },
      keydown: _vm.handleKeydown
    }
  }, [_c("i", {
    class: ["el-input__icon", "el-range__icon", _vm.triggerClass]
  }), _vm._v(" "), _c("input", _vm._b({
    staticClass: "el-range-input",
    attrs: {
      autocomplete: "off",
      placeholder: _vm.startPlaceholder,
      disabled: _vm.pickerDisabled,
      readonly: !_vm.editable || _vm.readonly,
      name: _vm.name && _vm.name[0]
    },
    domProps: {
      value: _vm.displayValue && _vm.displayValue[0]
    },
    on: {
      input: _vm.handleStartInput,
      change: _vm.handleStartChange,
      focus: _vm.handleFocus
    }
  }, "input", _vm.firstInputId, false)), _vm._v(" "), _vm._t("range-separator", [_c("span", {
    staticClass: "el-range-separator"
  }, [_vm._v(_vm._s(_vm.rangeSeparator))])]), _vm._v(" "), _c("input", _vm._b({
    staticClass: "el-range-input",
    attrs: {
      autocomplete: "off",
      placeholder: _vm.endPlaceholder,
      disabled: _vm.pickerDisabled,
      readonly: !_vm.editable || _vm.readonly,
      name: _vm.name && _vm.name[1]
    },
    domProps: {
      value: _vm.displayValue && _vm.displayValue[1]
    },
    on: {
      input: _vm.handleEndInput,
      change: _vm.handleEndChange,
      focus: _vm.handleFocus
    }
  }, "input", _vm.secondInputId, false)), _vm._v(" "), _vm.haveTrigger ? _c("i", {
    staticClass: "el-input__icon el-range__close-icon",
    class: [_vm.showClose ? "" + _vm.clearIcon : ""],
    on: {
      click: _vm.handleClickIcon
    }
  }) : _vm._e()], 2);
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

/* style */
var __vue_inject_styles__$8 = undefined;
/* scoped */
var __vue_scope_id__$8 = undefined;
/* module identifier */
var __vue_module_identifier__$8 = undefined;
/* functional template */
var __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$8 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);

//
var script$7 = {
  components: {
    ElScrollbar: ElScrollbar
  },
  directives: {
    repeatClick: RepeatClick
  },
  props: {
    date: {},
    defaultValue: {},
    // reserved for future use
    showSeconds: {
      type: Boolean,
      default: true
    },
    arrowControl: Boolean,
    amPmMode: {
      type: String,
      default: '' // 'a': am/pm; 'A': AM/PM
    }
  },
  computed: {
    hours: function hours() {
      return this.date.getHours();
    },
    minutes: function minutes() {
      return this.date.getMinutes();
    },
    seconds: function seconds() {
      return this.date.getSeconds();
    },
    hoursList: function hoursList() {
      return getRangeHours(this.selectableRange);
    },
    minutesList: function minutesList() {
      return getRangeMinutes(this.selectableRange, this.hours);
    },
    arrowHourList: function arrowHourList() {
      var hours = this.hours;
      return [hours > 0 ? hours - 1 : undefined, hours, hours < 23 ? hours + 1 : undefined];
    },
    arrowMinuteList: function arrowMinuteList() {
      var minutes = this.minutes;
      return [minutes > 0 ? minutes - 1 : undefined, minutes, minutes < 59 ? minutes + 1 : undefined];
    },
    arrowSecondList: function arrowSecondList() {
      var seconds = this.seconds;
      return [seconds > 0 ? seconds - 1 : undefined, seconds, seconds < 59 ? seconds + 1 : undefined];
    }
  },
  data: function data() {
    return {
      selectableRange: [],
      currentScrollbar: null
    };
  },
  mounted: function mounted() {
    var _this = this;
    this.$nextTick(function () {
      !_this.arrowControl && _this.bindScrollEvent();
    });
  },
  methods: {
    increase: function increase() {
      this.scrollDown(1);
    },
    decrease: function decrease() {
      this.scrollDown(-1);
    },
    modifyDateField: function modifyDateField(type, value) {
      switch (type) {
        case 'hours':
          this.$emit('change', modifyTime(this.date, value, this.minutes, this.seconds));
          break;
        case 'minutes':
          this.$emit('change', modifyTime(this.date, this.hours, value, this.seconds));
          break;
        case 'seconds':
          this.$emit('change', modifyTime(this.date, this.hours, this.minutes, value));
          break;
      }
    },
    handleClick: function handleClick(type, _ref) {
      var value = _ref.value,
        disabled = _ref.disabled;
      if (!disabled) {
        this.modifyDateField(type, value);
        this.emitSelectRange(type);
        this.adjustSpinner(type, value);
      }
    },
    emitSelectRange: function emitSelectRange(type) {
      if (type === 'hours') {
        this.$emit('select-range', 0, 2);
      } else if (type === 'minutes') {
        this.$emit('select-range', 3, 5);
      } else if (type === 'seconds') {
        this.$emit('select-range', 6, 8);
      }
      this.currentScrollbar = type;
    },
    bindScrollEvent: function bindScrollEvent() {
      var _this2 = this;
      var bindFunction = function bindFunction(type) {
        _this2.$refs[type].wrap.onscroll = function (e) {
          // TODO: scroll is emitted when set scrollTop programatically
          // should find better solutions in the future!
          _this2.handleScroll(type, e);
        };
      };
      bindFunction('hours');
      bindFunction('minutes');
      bindFunction('seconds');
    },
    handleScroll: function handleScroll(type) {
      var value = Math.min(Math.round((this.$refs[type].wrap.scrollTop - (this.scrollBarHeight(type) * 0.5 - 10) / this.typeItemHeight(type) + 3) / this.typeItemHeight(type)), type === 'hours' ? 23 : 59);
      this.modifyDateField(type, value);
    },
    // NOTE: used by datetime / date-range panel
    //       renamed from adjustScrollTop
    //       should try to refactory it
    adjustSpinners: function adjustSpinners() {
      this.adjustSpinner('hours', this.hours);
      this.adjustSpinner('minutes', this.minutes);
      this.adjustSpinner('seconds', this.seconds);
    },
    adjustCurrentSpinner: function adjustCurrentSpinner(type) {
      this.adjustSpinner(type, this[type]);
    },
    adjustSpinner: function adjustSpinner(type, value) {
      if (this.arrowControl) return;
      var el = this.$refs[type].wrap;
      if (el) {
        el.scrollTop = Math.max(0, value * this.typeItemHeight(type));
      }
    },
    scrollDown: function scrollDown(step) {
      var _this3 = this;
      if (!this.currentScrollbar) {
        this.emitSelectRange('hours');
      }
      var label = this.currentScrollbar;
      var hoursList = this.hoursList;
      var now = this[label];
      if (this.currentScrollbar === 'hours') {
        var total = Math.abs(step);
        step = step > 0 ? 1 : -1;
        var length = hoursList.length;
        while (length-- && total) {
          now = (now + step + hoursList.length) % hoursList.length;
          if (hoursList[now]) {
            continue;
          }
          total--;
        }
        if (hoursList[now]) return;
      } else {
        now = (now + step + 60) % 60;
      }
      this.modifyDateField(label, now);
      this.adjustSpinner(label, now);
      this.$nextTick(function () {
        return _this3.emitSelectRange(_this3.currentScrollbar);
      });
    },
    amPm: function amPm(hour) {
      var shouldShowAmPm = this.amPmMode.toLowerCase() === 'a';
      if (!shouldShowAmPm) return '';
      var isCapital = this.amPmMode === 'A';
      var content = hour < 12 ? ' am' : ' pm';
      if (isCapital) content = content.toUpperCase();
      return content;
    },
    typeItemHeight: function typeItemHeight(type) {
      return this.$refs[type].$el.querySelector('li').offsetHeight;
    },
    scrollBarHeight: function scrollBarHeight(type) {
      return this.$refs[type].$el.offsetHeight;
    }
  }
};

/* script */
var __vue_script__$7 = script$7;

/* template */
var __vue_render__$7 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-time-spinner",
    class: {
      "has-seconds": _vm.showSeconds
    }
  }, [!_vm.arrowControl ? [_c("el-scrollbar", {
    ref: "hours",
    staticClass: "el-time-spinner__wrapper",
    attrs: {
      "wrap-style": "max-height: inherit;",
      "view-class": "el-time-spinner__list",
      noresize: "",
      tag: "ul"
    },
    nativeOn: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("hours");
      },
      mousemove: function mousemove($event) {
        _vm.adjustCurrentSpinner("hours");
      }
    }
  }, _vm._l(_vm.hoursList, function (disabled, hour) {
    return _c("li", {
      key: hour,
      staticClass: "el-time-spinner__item",
      class: {
        active: hour === _vm.hours,
        disabled: disabled
      },
      on: {
        click: function click($event) {
          _vm.handleClick("hours", {
            value: hour,
            disabled: disabled
          });
        }
      }
    }, [_vm._v(_vm._s(("0" + (_vm.amPmMode ? hour % 12 || 12 : hour)).slice(-2)) + _vm._s(_vm.amPm(hour)))]);
  }), 0), _vm._v(" "), _c("el-scrollbar", {
    ref: "minutes",
    staticClass: "el-time-spinner__wrapper",
    attrs: {
      "wrap-style": "max-height: inherit;",
      "view-class": "el-time-spinner__list",
      noresize: "",
      tag: "ul"
    },
    nativeOn: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("minutes");
      },
      mousemove: function mousemove($event) {
        _vm.adjustCurrentSpinner("minutes");
      }
    }
  }, _vm._l(_vm.minutesList, function (enabled, key) {
    return _c("li", {
      key: key,
      staticClass: "el-time-spinner__item",
      class: {
        active: key === _vm.minutes,
        disabled: !enabled
      },
      on: {
        click: function click($event) {
          _vm.handleClick("minutes", {
            value: key,
            disabled: false
          });
        }
      }
    }, [_vm._v(_vm._s(("0" + key).slice(-2)))]);
  }), 0), _vm._v(" "), _c("el-scrollbar", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showSeconds,
      expression: "showSeconds"
    }],
    ref: "seconds",
    staticClass: "el-time-spinner__wrapper",
    attrs: {
      "wrap-style": "max-height: inherit;",
      "view-class": "el-time-spinner__list",
      noresize: "",
      tag: "ul"
    },
    nativeOn: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("seconds");
      },
      mousemove: function mousemove($event) {
        _vm.adjustCurrentSpinner("seconds");
      }
    }
  }, _vm._l(60, function (second, key) {
    return _c("li", {
      key: key,
      staticClass: "el-time-spinner__item",
      class: {
        active: key === _vm.seconds
      },
      on: {
        click: function click($event) {
          _vm.handleClick("seconds", {
            value: key,
            disabled: false
          });
        }
      }
    }, [_vm._v(_vm._s(("0" + key).slice(-2)))]);
  }), 0)] : _vm._e(), _vm._v(" "), _vm.arrowControl ? [_c("div", {
    staticClass: "el-time-spinner__wrapper is-arrow",
    on: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("hours");
      }
    }
  }, [_c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.decrease,
      expression: "decrease"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-up"
  }), _vm._v(" "), _c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.increase,
      expression: "increase"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-down"
  }), _vm._v(" "), _c("ul", {
    ref: "hours",
    staticClass: "el-time-spinner__list"
  }, _vm._l(_vm.arrowHourList, function (hour, key) {
    return _c("li", {
      key: key,
      staticClass: "el-time-spinner__item",
      class: {
        active: hour === _vm.hours,
        disabled: _vm.hoursList[hour]
      }
    }, [_vm._v(_vm._s(hour === undefined ? "" : ("0" + (_vm.amPmMode ? hour % 12 || 12 : hour)).slice(-2) + _vm.amPm(hour)))]);
  }), 0)]), _vm._v(" "), _c("div", {
    staticClass: "el-time-spinner__wrapper is-arrow",
    on: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("minutes");
      }
    }
  }, [_c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.decrease,
      expression: "decrease"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-up"
  }), _vm._v(" "), _c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.increase,
      expression: "increase"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-down"
  }), _vm._v(" "), _c("ul", {
    ref: "minutes",
    staticClass: "el-time-spinner__list"
  }, _vm._l(_vm.arrowMinuteList, function (minute, key) {
    return _c("li", {
      key: key,
      staticClass: "el-time-spinner__item",
      class: {
        active: minute === _vm.minutes
      }
    }, [_vm._v("\n          " + _vm._s(minute === undefined ? "" : ("0" + minute).slice(-2)) + "\n        ")]);
  }), 0)]), _vm._v(" "), _vm.showSeconds ? _c("div", {
    staticClass: "el-time-spinner__wrapper is-arrow",
    on: {
      mouseenter: function mouseenter($event) {
        _vm.emitSelectRange("seconds");
      }
    }
  }, [_c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.decrease,
      expression: "decrease"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-up"
  }), _vm._v(" "), _c("i", {
    directives: [{
      name: "repeat-click",
      rawName: "v-repeat-click",
      value: _vm.increase,
      expression: "increase"
    }],
    staticClass: "el-time-spinner__arrow el-icon-arrow-down"
  }), _vm._v(" "), _c("ul", {
    ref: "seconds",
    staticClass: "el-time-spinner__list"
  }, _vm._l(_vm.arrowSecondList, function (second, key) {
    return _c("li", {
      key: key,
      staticClass: "el-time-spinner__item",
      class: {
        active: second === _vm.seconds
      }
    }, [_vm._v("\n          " + _vm._s(second === undefined ? "" : ("0" + second).slice(-2)) + "\n        ")]);
  }), 0)]) : _vm._e()] : _vm._e()], 2);
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

/* style */
var __vue_inject_styles__$7 = undefined;
/* scoped */
var __vue_scope_id__$7 = undefined;
/* module identifier */
var __vue_module_identifier__$7 = undefined;
/* functional template */
var __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$7 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);

//
var script$6 = {
  mixins: [Locale],
  components: {
    TimeSpinner: __vue_component__$7
  },
  props: {
    visible: Boolean,
    timeArrowControl: Boolean
  },
  watch: {
    visible: function visible(val) {
      var _this = this;
      if (val) {
        this.oldValue = this.value;
        this.$nextTick(function () {
          return _this.$refs.spinner.emitSelectRange('hours');
        });
      } else {
        this.needInitAdjust = true;
      }
    },
    value: function value(newVal) {
      var _this2 = this;
      var date;
      if (newVal instanceof Date) {
        date = limitTimeRange(newVal, this.selectableRange, this.format);
      } else if (!newVal) {
        date = this.defaultValue ? new Date(this.defaultValue) : new Date();
      }
      this.date = date;
      if (this.visible && this.needInitAdjust) {
        this.$nextTick(function (_) {
          return _this2.adjustSpinners();
        });
        this.needInitAdjust = false;
      }
    },
    selectableRange: function selectableRange(val) {
      this.$refs.spinner.selectableRange = val;
    },
    defaultValue: function defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    }
  },
  data: function data() {
    return {
      popperClass: '',
      format: 'HH:mm:ss',
      value: '',
      defaultValue: null,
      date: new Date(),
      oldValue: new Date(),
      selectableRange: [],
      selectionRange: [0, 2],
      disabled: false,
      arrowControl: false,
      needInitAdjust: true
    };
  },
  computed: {
    showSeconds: function showSeconds() {
      return (this.format || '').indexOf('ss') !== -1;
    },
    useArrow: function useArrow() {
      return this.arrowControl || this.timeArrowControl || false;
    },
    amPmMode: function amPmMode() {
      if ((this.format || '').indexOf('A') !== -1) return 'A';
      if ((this.format || '').indexOf('a') !== -1) return 'a';
      return '';
    }
  },
  methods: {
    handleCancel: function handleCancel() {
      this.$emit('pick', this.oldValue, false);
    },
    handleChange: function handleChange(date) {
      // this.visible avoids edge cases, when use scrolls during panel closing animation
      if (this.visible) {
        this.date = clearMilliseconds(date);
        // if date is out of range, do not emit
        if (this.isValidValue(this.date)) {
          this.$emit('pick', this.date, true);
        }
      }
    },
    setSelectionRange: function setSelectionRange(start, end) {
      this.$emit('select-range', start, end);
      this.selectionRange = [start, end];
    },
    handleConfirm: function handleConfirm() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var first = arguments.length > 1 ? arguments[1] : undefined;
      if (first) return;
      var date = clearMilliseconds(limitTimeRange(this.date, this.selectableRange, this.format));
      this.$emit('pick', date, visible, first);
    },
    handleKeydown: function handleKeydown(event) {
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
        this.$refs.spinner.scrollDown(_step);
        event.preventDefault();
        return;
      }
    },
    isValidValue: function isValidValue(date) {
      return timeWithinRange(date, this.selectableRange, this.format);
    },
    adjustSpinners: function adjustSpinners() {
      return this.$refs.spinner.adjustSpinners();
    },
    changeSelectionRange: function changeSelectionRange(step) {
      var list = [0, 3].concat(this.showSeconds ? [6] : []);
      var mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : []);
      var index = list.indexOf(this.selectionRange[0]);
      var next = (index + step + list.length) % list.length;
      this.$refs.spinner.emitSelectRange(mapping[next]);
    }
  },
  mounted: function mounted() {
    var _this3 = this;
    this.$nextTick(function () {
      return _this3.handleConfirm(true, true);
    });
    this.$emit('mounted');
  }
};

/* script */
var __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function __vue_render__() {
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
    staticClass: "el-time-panel el-popper",
    class: _vm.popperClass
  }, [_c("div", {
    staticClass: "el-time-panel__content",
    class: {
      "has-seconds": _vm.showSeconds
    }
  }, [_c("time-spinner", {
    ref: "spinner",
    attrs: {
      "arrow-control": _vm.useArrow,
      "show-seconds": _vm.showSeconds,
      "am-pm-mode": _vm.amPmMode,
      date: _vm.date
    },
    on: {
      change: _vm.handleChange,
      "select-range": _vm.setSelectionRange
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "el-time-panel__footer"
  }, [_c("button", {
    staticClass: "el-time-panel__btn cancel",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.handleCancel
    }
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "el-time-panel__btn",
    class: {
      confirm: !_vm.disabled
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.handleConfirm();
      }
    }
  }, [_vm._v(_vm._s(_vm.t("el.datepicker.confirm")))])])])]);
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

/* style */
var __vue_inject_styles__$6 = undefined;
/* scoped */
var __vue_scope_id__$6 = undefined;
/* module identifier */
var __vue_module_identifier__$6 = undefined;
/* functional template */
var __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$6 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

var datesInYear = function datesInYear(year) {
  var numOfDays = getDayCountOfYear(year);
  var firstDay = new Date(year, 0, 1);
  return range(numOfDays).map(function (n) {
    return nextDate(firstDay, n);
  });
};
var script$5 = {
  props: {
    disabledDate: {},
    value: {},
    defaultValue: {
      validator: function validator(val) {
        // null or valid Date Object
        return val === null || val instanceof Date && isDate(val);
      }
    },
    date: {},
    selectionMode: {}
  },
  computed: {
    startYear: function startYear() {
      return Math.floor(this.date.getFullYear() / 10) * 10;
    }
  },
  methods: {
    getCellStyle: function getCellStyle(year) {
      var style = {};
      var today = new Date();
      style.disabled = typeof this.disabledDate === 'function' ? datesInYear(year).every(this.disabledDate) : false;
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), function (date) {
        return date.getFullYear() === year;
      }) >= 0;
      style.today = today.getFullYear() === year;
      style.default = this.defaultValue && this.defaultValue.getFullYear() === year;
      return style;
    },
    handleYearTableClick: function handleYearTableClick(event) {
      var target = event.target;
      if (target.tagName === 'A') {
        if (hasClass(target.parentNode, 'disabled')) return;
        var year = target.textContent || target.innerText;
        if (this.selectionMode === 'years') {
          var value = this.value || [];
          var idx = arrayFindIndex(value, function (date) {
            return date.getFullYear() === Number(year);
          });
          var newValue = idx > -1 ? [].concat(_toConsumableArray(value.slice(0, idx)), _toConsumableArray(value.slice(idx + 1))) : [].concat(_toConsumableArray(value), [new Date(year)]);
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

var __vue_component__$5 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

var datesInMonth = function datesInMonth(year, month) {
  var numOfDays = getDayCountOfMonth(year, month);
  var firstDay = new Date(year, month, 1);
  return range(numOfDays).map(function (n) {
    return nextDate(firstDay, n);
  });
};
var clearDate = function clearDate(date) {
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
  return idx >= 0 ? [].concat(_toConsumableArray(arr.slice(0, idx)), _toConsumableArray(arr.slice(idx + 1))) : arr;
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
      validator: function validator(val) {
        // null or valid Date Object
        return val === null || isDate(val) || Array.isArray(val) && val.every(isDate);
      }
    },
    date: {},
    rangeState: {
      default: function _default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  mixins: [Locale],
  watch: {
    'rangeState.endDate': function rangeStateEndDate(newVal) {
      this.markRange(this.minDate, newVal);
    },
    minDate: function minDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    },
    maxDate: function maxDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  data: function data() {
    return {
      months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      tableRows: [[], [], []],
      lastRow: null,
      lastColumn: null
    };
  },
  methods: {
    cellMatchesDate: function cellMatchesDate(cell, date) {
      var value = new Date(date);
      return this.date.getFullYear() === value.getFullYear() && Number(cell.text) === value.getMonth();
    },
    getCellStyle: function getCellStyle(cell) {
      var _this = this;
      var style = {};
      var year = this.date.getFullYear();
      var today = new Date();
      var month = cell.text;
      var defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];
      style.disabled = typeof this.disabledDate === 'function' ? datesInMonth(year, month).every(this.disabledDate) : false;
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), function (date) {
        return date.getFullYear() === year && date.getMonth() === month;
      }) >= 0;
      style.today = today.getFullYear() === year && today.getMonth() === month;
      style.default = defaultValue.some(function (date) {
        return _this.cellMatchesDate(cell, date);
      });
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
    getMonthOfCell: function getMonthOfCell(month) {
      var year = this.date.getFullYear();
      return new Date(year, month, 1);
    },
    markRange: function markRange(minDate, maxDate) {
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
    handleMouseMove: function handleMouseMove(event) {
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
    handleMonthTableClick: function handleMonthTableClick(event) {
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
        var newValue = arrayFindIndex(value, function (date) {
          return date.getFullYear() === year && date.getMonth() === month;
        }) >= 0 ? removeFromArray$1(value, function (date) {
          return date.getTime() === newDate.getTime();
        }) : [].concat(_toConsumableArray(value), [newDate]);
        this.$emit('pick', newValue);
      } else {
        this.$emit('pick', month);
      }
    }
  },
  computed: {
    rows: function rows() {
      var _this2 = this;
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
          var time = new Date(_this2.date.getFullYear(), index).getTime();
          cell.inRange = time >= getMonthTimestamp(_this2.minDate) && time <= getMonthTimestamp(_this2.maxDate);
          cell.start = _this2.minDate && time === getMonthTimestamp(_this2.minDate);
          cell.end = _this2.maxDate && time === getMonthTimestamp(_this2.maxDate);
          var isToday = time === now;
          if (isToday) {
            cell.type = 'today';
          }
          cell.text = index;
          var cellDate = new Date(time);
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate);
          cell.selected = arrayFind(selectedDate, function (date) {
            return date.getTime() === cellDate.getTime();
          });
          _this2.$set(row, j, cell);
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

var __vue_component__$4 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

var _WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
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
  return idx >= 0 ? [].concat(_toConsumableArray(arr.slice(0, idx)), _toConsumableArray(arr.slice(idx + 1))) : arr;
};
var script$3 = {
  mixins: [Locale],
  props: {
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: function validator(val) {
        return val >= 1 && val <= 7;
      }
    },
    value: {},
    defaultValue: {
      validator: function validator(val) {
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
      default: function _default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  computed: {
    offsetDay: function offsetDay() {
      var week = this.firstDayOfWeek;
      // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
      return week > 3 ? 7 - week : -week;
    },
    WEEKS: function WEEKS() {
      var week = this.firstDayOfWeek;
      return _WEEKS.concat(_WEEKS).slice(week, week + 7);
    },
    year: function year() {
      return this.date.getFullYear();
    },
    month: function month() {
      return this.date.getMonth();
    },
    startDate: function startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },
    rows: function rows() {
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
          cell.selected = arrayFind(selectedDate, function (date) {
            return date.getTime() === cellDate.getTime();
          });
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
    'rangeState.endDate': function rangeStateEndDate(newVal) {
      this.markRange(this.minDate, newVal);
    },
    minDate: function minDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    },
    maxDate: function maxDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  data: function data() {
    return {
      tableRows: [[], [], [], [], [], []],
      lastRow: null,
      lastColumn: null
    };
  },
  methods: {
    cellMatchesDate: function cellMatchesDate(cell, date) {
      var value = new Date(date);
      return this.year === value.getFullYear() && this.month === value.getMonth() && Number(cell.text) === value.getDate();
    },
    getCellClasses: function getCellClasses(cell) {
      var _this2 = this;
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
      if (cell.type === 'normal' && defaultValue.some(function (date) {
        return _this2.cellMatchesDate(cell, date);
      })) {
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
    getDateOfCell: function getDateOfCell(row, column) {
      var offsetFromStart = row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },
    isWeekActive: function isWeekActive(cell) {
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
    markRange: function markRange(minDate, maxDate) {
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
    handleMouseMove: function handleMouseMove(event) {
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
    handleClick: function handleClick(event) {
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
        var newValue = cell.selected ? removeFromArray(_value, function (date) {
          return date.getTime() === newDate.getTime();
        }) : [].concat(_toConsumableArray(_value), [newDate]);
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

var __vue_component__$3 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
var script$2 = {
  mixins: [Locale],
  directives: {
    Clickoutside: Clickoutside
  },
  watch: {
    showTime: function showTime(val) {
      var _this = this;
      /* istanbul ignore if */
      if (!val) return;
      this.$nextTick(function (_) {
        var inputElm = _this.$refs.input.$el;
        if (inputElm) {
          _this.pickerWidth = inputElm.getBoundingClientRect().width + 10;
        }
      });
    },
    value: function value(val) {
      if (this.selectionMode === 'dates' && this.value) return;
      if (this.selectionMode === 'months' && this.value) return;
      if (this.selectionMode === 'years' && this.value) return;
      if (isDate(val)) {
        this.date = new Date(val);
      } else {
        this.date = this.getDefaultValue();
      }
    },
    defaultValue: function defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    },
    timePickerVisible: function timePickerVisible(val) {
      var _this2 = this;
      if (val) this.$nextTick(function () {
        return _this2.$refs.timepicker.adjustSpinners();
      });
    },
    selectionMode: function selectionMode(newVal) {
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
    proxyTimePickerDataProperties: function proxyTimePickerDataProperties() {
      var _this3 = this;
      var format = function format(timeFormat) {
        _this3.$refs.timepicker.format = timeFormat;
      };
      var value = function value(_value) {
        _this3.$refs.timepicker.value = _value;
      };
      var date = function date(_date) {
        _this3.$refs.timepicker.date = _date;
      };
      var selectableRange = function selectableRange(_selectableRange) {
        _this3.$refs.timepicker.selectableRange = _selectableRange;
      };
      this.$watch('value', value);
      this.$watch('date', date);
      this.$watch('selectableRange', selectableRange);
      format(this.timeFormat);
      value(this.value);
      date(this.date);
      selectableRange(this.selectableRange);
    },
    handleClear: function handleClear() {
      this.date = this.getDefaultValue();
      this.$emit('pick', null);
    },
    emit: function emit(value) {
      var _this4 = this;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (!value) {
        this.$emit.apply(this, ['pick', value].concat(args));
      } else if (Array.isArray(value)) {
        var dates = value.map(function (date) {
          return _this4.showTime ? clearMilliseconds(date) : clearTime(date);
        });
        this.$emit.apply(this, ['pick', dates].concat(args));
      } else {
        this.$emit.apply(this, ['pick', this.showTime ? clearMilliseconds(value) : clearTime(value)].concat(args));
      }
      this.userInputDate = null;
      this.userInputTime = null;
    },
    // resetDate() {
    //   this.date = new Date(this.date);
    // },
    showMonthPicker: function showMonthPicker() {
      this.currentView = 'month';
    },
    showYearPicker: function showYearPicker() {
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
    prevMonth: function prevMonth$1() {
      this.date = prevMonth(this.date);
    },
    nextMonth: function nextMonth$1() {
      this.date = nextMonth(this.date);
    },
    prevYear: function prevYear$1() {
      if (this.currentView === 'year') {
        this.date = prevYear(this.date, 10);
      } else {
        this.date = prevYear(this.date);
      }
    },
    nextYear: function nextYear$1() {
      if (this.currentView === 'year') {
        this.date = nextYear(this.date, 10);
      } else {
        this.date = nextYear(this.date);
      }
    },
    handleShortcutClick: function handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    handleTimePick: function handleTimePick(value, visible, first) {
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
    handleTimePickClose: function handleTimePickClose() {
      this.timePickerVisible = false;
    },
    handleMonthPick: function handleMonthPick(month) {
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
    handleDatePick: function handleDatePick(value) {
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
    handleYearPick: function handleYearPick(year) {
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
    changeToNow: function changeToNow() {
      // NOTE: not a permanent solution
      //       consider disable "now" button in the future
      if ((!this.disabledDate || !this.disabledDate(new Date())) && this.checkDateWithinRange(new Date())) {
        this.date = new Date();
        this.emit(this.date);
      }
    },
    confirm: function confirm() {
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
    resetView: function resetView() {
      if (this.selectionMode === 'month' || this.selectionMode === 'months') {
        this.currentView = 'month';
      } else if (this.selectionMode === 'year' || this.selectionMode === 'years') {
        this.currentView = 'year';
      } else {
        this.currentView = 'date';
      }
    },
    handleEnter: function handleEnter() {
      document.body.addEventListener('keydown', this.handleKeydown);
    },
    handleLeave: function handleLeave() {
      this.$emit('dodestroy');
      document.body.removeEventListener('keydown', this.handleKeydown);
    },
    handleKeydown: function handleKeydown(event) {
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
    handleKeyControl: function handleKeyControl(keyCode) {
      var mapping = {
        'year': {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: function offset(date, step) {
            return date.setFullYear(date.getFullYear() + step);
          }
        },
        'month': {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: function offset(date, step) {
            return date.setMonth(date.getMonth() + step);
          }
        },
        'week': {
          38: -1,
          40: 1,
          37: -1,
          39: 1,
          offset: function offset(date, step) {
            return date.setDate(date.getDate() + step * 7);
          }
        },
        'day': {
          38: -7,
          40: 7,
          37: -1,
          39: 1,
          offset: function offset(date, step) {
            return date.setDate(date.getDate() + step);
          }
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
    handleVisibleTimeChange: function handleVisibleTimeChange(value) {
      var time = parseDate(value, this.timeFormat);
      if (time && this.checkDateWithinRange(time)) {
        this.date = modifyDate(time, this.year, this.month, this.monthDate);
        this.userInputTime = null;
        this.$refs.timepicker.value = this.date;
        this.timePickerVisible = false;
        this.emit(this.date, true);
      }
    },
    handleVisibleDateChange: function handleVisibleDateChange(value) {
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
    isValidValue: function isValidValue(value) {
      return value && !isNaN(value) && (typeof this.disabledDate === 'function' ? !this.disabledDate(value) : true) && this.checkDateWithinRange(value);
    },
    getDefaultValue: function getDefaultValue() {
      // if default-value is set, return it
      // otherwise, return now (the moment this method gets called)
      return this.defaultValue ? new Date(this.defaultValue) : new Date();
    },
    checkDateWithinRange: function checkDateWithinRange(date) {
      return this.selectableRange.length > 0 ? timeWithinRange(date, this.selectableRange, this.format || 'HH:mm:ss') : true;
    }
  },
  components: {
    TimePicker: __vue_component__$6,
    YearTable: __vue_component__$5,
    MonthTable: __vue_component__$4,
    DateTable: __vue_component__$3,
    ElInput: ElInput,
    ElButton: ElButton
  },
  data: function data() {
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
    year: function year() {
      return this.date.getFullYear();
    },
    month: function month() {
      return this.date.getMonth();
    },
    week: function week() {
      return getWeekNumber(this.date);
    },
    monthDate: function monthDate() {
      return this.date.getDate();
    },
    footerVisible: function footerVisible() {
      return this.showTime || this.selectionMode === 'dates' || this.selectionMode === 'months' || this.selectionMode === 'years';
    },
    visibleTime: function visibleTime() {
      if (this.userInputTime !== null) {
        return this.userInputTime;
      } else {
        return formatDate(this.value || this.defaultValue, this.timeFormat);
      }
    },
    visibleDate: function visibleDate() {
      if (this.userInputDate !== null) {
        return this.userInputDate;
      } else {
        return formatDate(this.value || this.defaultValue, this.dateFormat);
      }
    },
    yearLabel: function yearLabel() {
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
    timeFormat: function timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return 'HH:mm:ss';
      }
    },
    dateFormat: function dateFormat() {
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

var __vue_component__$2 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var calcDefaultValue$1 = function calcDefaultValue(defaultValue) {
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
    Clickoutside: Clickoutside
  },
  computed: {
    btnDisabled: function btnDisabled() {
      return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
    },
    leftLabel: function leftLabel() {
      return this.leftDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t("el.datepicker.month".concat(this.leftDate.getMonth() + 1));
    },
    rightLabel: function rightLabel() {
      return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t("el.datepicker.month".concat(this.rightDate.getMonth() + 1));
    },
    leftYear: function leftYear() {
      return this.leftDate.getFullYear();
    },
    leftMonth: function leftMonth() {
      return this.leftDate.getMonth();
    },
    leftMonthDate: function leftMonthDate() {
      return this.leftDate.getDate();
    },
    rightYear: function rightYear() {
      return this.rightDate.getFullYear();
    },
    rightMonth: function rightMonth() {
      return this.rightDate.getMonth();
    },
    rightMonthDate: function rightMonthDate() {
      return this.rightDate.getDate();
    },
    minVisibleDate: function minVisibleDate() {
      if (this.dateUserInput.min !== null) return this.dateUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.dateFormat);
      return '';
    },
    maxVisibleDate: function maxVisibleDate() {
      if (this.dateUserInput.max !== null) return this.dateUserInput.max;
      if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.dateFormat);
      return '';
    },
    minVisibleTime: function minVisibleTime() {
      if (this.timeUserInput.min !== null) return this.timeUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.timeFormat);
      return '';
    },
    maxVisibleTime: function maxVisibleTime() {
      if (this.timeUserInput.max !== null) return this.timeUserInput.max;
      if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.timeFormat);
      return '';
    },
    timeFormat: function timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return 'HH:mm:ss';
      }
    },
    dateFormat: function dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return 'yyyy-MM-dd';
      }
    },
    enableMonthArrow: function enableMonthArrow() {
      var nextMonth = (this.leftMonth + 1) % 12;
      var yearOffset = this.leftMonth + 1 >= 12 ? 1 : 0;
      return this.unlinkPanels && new Date(this.leftYear + yearOffset, nextMonth) < new Date(this.rightYear, this.rightMonth);
    },
    enableYearArrow: function enableYearArrow() {
      return this.unlinkPanels && this.rightYear * 12 + this.rightMonth - (this.leftYear * 12 + this.leftMonth + 1) >= 12;
    }
  },
  data: function data() {
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
    minDate: function minDate(val) {
      var _this = this;
      this.dateUserInput.min = null;
      this.timeUserInput.min = null;
      this.$nextTick(function () {
        if (_this.$refs.maxTimePicker && _this.maxDate && _this.maxDate < _this.minDate) {
          var format = 'HH:mm:ss';
          _this.$refs.maxTimePicker.selectableRange = [[parseDate(formatDate(_this.minDate, format), format), parseDate('23:59:59', format)]];
        }
      });
      if (val && this.$refs.minTimePicker) {
        this.$refs.minTimePicker.date = val;
        this.$refs.minTimePicker.value = val;
      }
    },
    maxDate: function maxDate(val) {
      this.dateUserInput.max = null;
      this.timeUserInput.max = null;
      if (val && this.$refs.maxTimePicker) {
        this.$refs.maxTimePicker.date = val;
        this.$refs.maxTimePicker.value = val;
      }
    },
    minTimePickerVisible: function minTimePickerVisible(val) {
      var _this2 = this;
      if (val) {
        this.$nextTick(function () {
          _this2.$refs.minTimePicker.date = _this2.minDate;
          _this2.$refs.minTimePicker.value = _this2.minDate;
          _this2.$refs.minTimePicker.adjustSpinners();
        });
      }
    },
    maxTimePickerVisible: function maxTimePickerVisible(val) {
      var _this3 = this;
      if (val) {
        this.$nextTick(function () {
          _this3.$refs.maxTimePicker.date = _this3.maxDate;
          _this3.$refs.maxTimePicker.value = _this3.maxDate;
          _this3.$refs.maxTimePicker.adjustSpinners();
        });
      }
    },
    value: function value(newVal) {
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
    defaultValue: function defaultValue(val) {
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
    handleClear: function handleClear() {
      this.minDate = null;
      this.maxDate = null;
      this.leftDate = calcDefaultValue$1(this.defaultValue)[0];
      this.rightDate = nextMonth(this.leftDate);
      this.$emit('pick', null);
    },
    handleChangeRange: function handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleDateInput: function handleDateInput(value, type) {
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
    handleDateChange: function handleDateChange(value, type) {
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
    handleTimeInput: function handleTimeInput(value, type) {
      var _this4 = this;
      this.timeUserInput[type] = value;
      if (value.length !== this.timeFormat.length) return;
      var parsedValue = parseDate(value, this.timeFormat);
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          this.$nextTick(function (_) {
            return _this4.$refs.minTimePicker.adjustSpinners();
          });
        } else {
          this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
          this.$nextTick(function (_) {
            return _this4.$refs.maxTimePicker.adjustSpinners();
          });
        }
      }
    },
    handleTimeChange: function handleTimeChange(value, type) {
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
    handleRangePick: function handleRangePick(val) {
      var _this5 = this;
      var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
      setTimeout(function () {
        _this5.maxDate = maxDate;
        _this5.minDate = minDate;
      }, 10);
      if (!close || this.showTime) return;
      this.handleConfirm();
    },
    handleShortcutClick: function handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    handleMinTimePick: function handleMinTimePick(value, visible, first) {
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
    handleMinTimeClose: function handleMinTimeClose() {
      this.minTimePickerVisible = false;
    },
    handleMaxTimePick: function handleMaxTimePick(value, visible, first) {
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
    handleMaxTimeClose: function handleMaxTimeClose() {
      this.maxTimePickerVisible = false;
    },
    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear: function leftPrevYear() {
      this.leftDate = prevYear(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },
    leftPrevMonth: function leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },
    rightNextYear: function rightNextYear() {
      if (!this.unlinkPanels) {
        this.leftDate = nextYear(this.leftDate);
        this.rightDate = nextMonth(this.leftDate);
      } else {
        this.rightDate = nextYear(this.rightDate);
      }
    },
    rightNextMonth: function rightNextMonth() {
      if (!this.unlinkPanels) {
        this.leftDate = nextMonth(this.leftDate);
        this.rightDate = nextMonth(this.leftDate);
      } else {
        this.rightDate = nextMonth(this.rightDate);
      }
    },
    // leftNext*, rightPrev* are called when `unlinkPanels` is true
    leftNextYear: function leftNextYear() {
      this.leftDate = nextYear(this.leftDate);
    },
    leftNextMonth: function leftNextMonth() {
      this.leftDate = nextMonth(this.leftDate);
    },
    rightPrevYear: function rightPrevYear() {
      this.rightDate = prevYear(this.rightDate);
    },
    rightPrevMonth: function rightPrevMonth() {
      this.rightDate = prevMonth(this.rightDate);
    },
    handleConfirm: function handleConfirm() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      }
    },
    isValidValue: function isValidValue(value) {
      return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
    },
    resetView: function resetView() {
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
    ElInput: ElInput,
    ElButton: ElButton
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

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var calcDefaultValue = function calcDefaultValue(defaultValue) {
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
    Clickoutside: Clickoutside
  },
  computed: {
    btnDisabled: function btnDisabled() {
      return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
    },
    leftLabel: function leftLabel() {
      return this.leftDate.getFullYear() + ' ' + this.t('el.datepicker.year');
    },
    rightLabel: function rightLabel() {
      return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year');
    },
    leftYear: function leftYear() {
      return this.leftDate.getFullYear();
    },
    rightYear: function rightYear() {
      return this.rightDate.getFullYear() === this.leftDate.getFullYear() ? this.leftDate.getFullYear() + 1 : this.rightDate.getFullYear();
    },
    enableYearArrow: function enableYearArrow() {
      return this.unlinkPanels && this.rightYear > this.leftYear + 1;
    }
  },
  data: function data() {
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
    value: function value(newVal) {
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
    defaultValue: function defaultValue(val) {
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
    handleClear: function handleClear() {
      this.minDate = null;
      this.maxDate = null;
      this.leftDate = calcDefaultValue(this.defaultValue)[0];
      this.rightDate = nextYear(this.leftDate);
      this.$emit('pick', null);
    },
    handleChangeRange: function handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleRangePick: function handleRangePick(val) {
      var _this = this;
      var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
      setTimeout(function () {
        _this.maxDate = maxDate;
        _this.minDate = minDate;
      }, 10);
      if (!close) return;
      this.handleConfirm();
    },
    handleShortcutClick: function handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear: function leftPrevYear() {
      this.leftDate = prevYear(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = prevYear(this.rightDate);
      }
    },
    rightNextYear: function rightNextYear() {
      if (!this.unlinkPanels) {
        this.leftDate = nextYear(this.leftDate);
      }
      this.rightDate = nextYear(this.rightDate);
    },
    // leftNext*, rightPrev* are called when `unlinkPanels` is true
    leftNextYear: function leftNextYear() {
      this.leftDate = nextYear(this.leftDate);
    },
    rightPrevYear: function rightPrevYear() {
      this.rightDate = prevYear(this.rightDate);
    },
    handleConfirm: function handleConfirm() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      }
    },
    isValidValue: function isValidValue(value) {
      return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
    },
    resetView: function resetView() {
      // NOTE: this is a hack to reset {min, max}Date on picker open.
      // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
      //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
      this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
      this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;
    }
  },
  components: {
    MonthTable: __vue_component__$4,
    ElInput: ElInput,
    ElButton: ElButton
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

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
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
  mixins: [__vue_component__$8],
  name: 'ElDatePicker',
  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean
  },
  watch: {
    type: function type(_type) {
      if (this.picker) {
        this.unmountPicker();
        this.panel = getPanel(_type);
        this.mountPicker();
      } else {
        this.panel = getPanel(_type);
      }
    }
  },
  created: function created() {
    this.panel = getPanel(this.type);
  }
};

/* istanbul ignore next */
DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

export { DatePicker as default };
