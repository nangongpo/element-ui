import { getRangeHours, getRangeMinutes, modifyTime, limitTimeRange, isDate, clearMilliseconds, timeWithinRange } from '../utils/date-util.js';
import Locale from '../mixins/locale.js';
import Scrollbar from '../scrollbar.js';
import RepeatClick from '../directives/repeat-click.js';
import { n as normalizeComponent } from './normalize-component-01820469.js';

//
var script$1 = {
  components: {
    ElScrollbar: Scrollbar
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
    hours() {
      return this.date.getHours();
    },
    minutes() {
      return this.date.getMinutes();
    },
    seconds() {
      return this.date.getSeconds();
    },
    hoursList() {
      return getRangeHours(this.selectableRange);
    },
    minutesList() {
      return getRangeMinutes(this.selectableRange, this.hours);
    },
    arrowHourList() {
      var hours = this.hours;
      return [hours > 0 ? hours - 1 : undefined, hours, hours < 23 ? hours + 1 : undefined];
    },
    arrowMinuteList() {
      var minutes = this.minutes;
      return [minutes > 0 ? minutes - 1 : undefined, minutes, minutes < 59 ? minutes + 1 : undefined];
    },
    arrowSecondList() {
      var seconds = this.seconds;
      return [seconds > 0 ? seconds - 1 : undefined, seconds, seconds < 59 ? seconds + 1 : undefined];
    }
  },
  data() {
    return {
      selectableRange: [],
      currentScrollbar: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      !this.arrowControl && this.bindScrollEvent();
    });
  },
  methods: {
    increase() {
      this.scrollDown(1);
    },
    decrease() {
      this.scrollDown(-1);
    },
    modifyDateField(type, value) {
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
    handleClick(type, {
      value,
      disabled
    }) {
      if (!disabled) {
        this.modifyDateField(type, value);
        this.emitSelectRange(type);
        this.adjustSpinner(type, value);
      }
    },
    emitSelectRange(type) {
      if (type === 'hours') {
        this.$emit('select-range', 0, 2);
      } else if (type === 'minutes') {
        this.$emit('select-range', 3, 5);
      } else if (type === 'seconds') {
        this.$emit('select-range', 6, 8);
      }
      this.currentScrollbar = type;
    },
    bindScrollEvent() {
      var bindFunction = type => {
        this.$refs[type].wrap.onscroll = e => {
          // TODO: scroll is emitted when set scrollTop programatically
          // should find better solutions in the future!
          this.handleScroll(type, e);
        };
      };
      bindFunction('hours');
      bindFunction('minutes');
      bindFunction('seconds');
    },
    handleScroll(type) {
      var value = Math.min(Math.round((this.$refs[type].wrap.scrollTop - (this.scrollBarHeight(type) * 0.5 - 10) / this.typeItemHeight(type) + 3) / this.typeItemHeight(type)), type === 'hours' ? 23 : 59);
      this.modifyDateField(type, value);
    },
    // NOTE: used by datetime / date-range panel
    //       renamed from adjustScrollTop
    //       should try to refactory it
    adjustSpinners() {
      this.adjustSpinner('hours', this.hours);
      this.adjustSpinner('minutes', this.minutes);
      this.adjustSpinner('seconds', this.seconds);
    },
    adjustCurrentSpinner(type) {
      this.adjustSpinner(type, this[type]);
    },
    adjustSpinner(type, value) {
      if (this.arrowControl) return;
      var el = this.$refs[type].wrap;
      if (el) {
        el.scrollTop = Math.max(0, value * this.typeItemHeight(type));
      }
    },
    scrollDown(step) {
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
      this.$nextTick(() => this.emitSelectRange(this.currentScrollbar));
    },
    amPm(hour) {
      var shouldShowAmPm = this.amPmMode.toLowerCase() === 'a';
      if (!shouldShowAmPm) return '';
      var isCapital = this.amPmMode === 'A';
      var content = hour < 12 ? ' am' : ' pm';
      if (isCapital) content = content.toUpperCase();
      return content;
    },
    typeItemHeight(type) {
      return this.$refs[type].$el.querySelector('li').offsetHeight;
    },
    scrollBarHeight(type) {
      return this.$refs[type].$el.offsetHeight;
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
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
  mixins: [Locale],
  components: {
    TimeSpinner: __vue_component__$1
  },
  props: {
    visible: Boolean,
    timeArrowControl: Boolean
  },
  watch: {
    visible(val) {
      if (val) {
        this.oldValue = this.value;
        this.$nextTick(() => this.$refs.spinner.emitSelectRange('hours'));
      } else {
        this.needInitAdjust = true;
      }
    },
    value(newVal) {
      var date;
      if (newVal instanceof Date) {
        date = limitTimeRange(newVal, this.selectableRange, this.format);
      } else if (!newVal) {
        date = this.defaultValue ? new Date(this.defaultValue) : new Date();
      }
      this.date = date;
      if (this.visible && this.needInitAdjust) {
        this.$nextTick(_ => this.adjustSpinners());
        this.needInitAdjust = false;
      }
    },
    selectableRange(val) {
      this.$refs.spinner.selectableRange = val;
    },
    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    }
  },
  data() {
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
    showSeconds() {
      return (this.format || '').indexOf('ss') !== -1;
    },
    useArrow() {
      return this.arrowControl || this.timeArrowControl || false;
    },
    amPmMode() {
      if ((this.format || '').indexOf('A') !== -1) return 'A';
      if ((this.format || '').indexOf('a') !== -1) return 'a';
      return '';
    }
  },
  methods: {
    handleCancel() {
      this.$emit('pick', this.oldValue, false);
    },
    handleChange(date) {
      // this.visible avoids edge cases, when use scrolls during panel closing animation
      if (this.visible) {
        this.date = clearMilliseconds(date);
        // if date is out of range, do not emit
        if (this.isValidValue(this.date)) {
          this.$emit('pick', this.date, true);
        }
      }
    },
    setSelectionRange(start, end) {
      this.$emit('select-range', start, end);
      this.selectionRange = [start, end];
    },
    handleConfirm(visible = false, first) {
      if (first) return;
      var date = clearMilliseconds(limitTimeRange(this.date, this.selectableRange, this.format));
      this.$emit('pick', date, visible, first);
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
        this.$refs.spinner.scrollDown(_step);
        event.preventDefault();
        return;
      }
    },
    isValidValue(date) {
      return timeWithinRange(date, this.selectableRange, this.format);
    },
    adjustSpinners() {
      return this.$refs.spinner.adjustSpinners();
    },
    changeSelectionRange(step) {
      var list = [0, 3].concat(this.showSeconds ? [6] : []);
      var mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : []);
      var index = list.indexOf(this.selectionRange[0]);
      var next = (index + step + list.length) % list.length;
      this.$refs.spinner.emitSelectRange(mapping[next]);
    }
  },
  mounted() {
    this.$nextTick(() => this.handleConfirm(true, true));
    this.$emit('mounted');
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

export { __vue_component__ as _, __vue_component__$1 as a };
