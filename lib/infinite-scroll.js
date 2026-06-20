import { d as debounce } from './shared/debounce-e5482a73.js';
import { isHtmlElement, isUndefined, isDefined, isFunction } from './utils/types.js';
import { getScrollContainer } from './utils/dom.js';
import './shared/throttle-54b44d30.js';
import 'vue';

var getStyleComputedProperty = (element, property) => {
  if (element === window) {
    element = document.documentElement;
  }
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
};
var entries = obj => {
  return Object.keys(obj || {}).map(key => [key, obj[key]]);
};
var getPositionSize = (el, prop) => {
  return el === window || el === document ? document.documentElement[prop] : el[prop];
};
var getOffsetHeight = el => {
  return getPositionSize(el, 'offsetHeight');
};
var getClientHeight = el => {
  return getPositionSize(el, 'clientHeight');
};
var scope = 'ElInfiniteScroll';
var attributes = {
  delay: {
    type: Number,
    default: 200
  },
  distance: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  }
};
var getScrollOptions = (el, vm) => {
  if (!isHtmlElement(el)) return {};
  return entries(attributes).reduce((map, [key, option]) => {
    var type = option.type,
      defaultValue = option.default;
    var value = el.getAttribute(`infinite-scroll-${key}`);
    value = isUndefined(vm[value]) ? value : vm[value];
    switch (type) {
      case Number:
        value = Number(value);
        value = Number.isNaN(value) ? defaultValue : value;
        break;
      case Boolean:
        value = isDefined(value) ? value === 'false' ? false : Boolean(value) : defaultValue;
        break;
      default:
        value = type(value);
    }
    map[key] = value;
    return map;
  }, {});
};
var getElementTop = el => el.getBoundingClientRect().top;
var handleScroll = function handleScroll(cb) {
  var _this$scope = this[scope],
    el = _this$scope.el,
    vm = _this$scope.vm,
    container = _this$scope.container,
    observer = _this$scope.observer;
  var _getScrollOptions = getScrollOptions(el, vm),
    distance = _getScrollOptions.distance,
    disabled = _getScrollOptions.disabled;
  if (disabled) return;
  var containerInfo = container.getBoundingClientRect();
  if (!containerInfo.width && !containerInfo.height) return;
  var shouldTrigger = false;
  if (container === el) {
    // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height
    var scrollBottom = container.scrollTop + getClientHeight(container);
    shouldTrigger = container.scrollHeight - scrollBottom <= distance;
  } else {
    var heightBelowTop = getOffsetHeight(el) + getElementTop(el) - getElementTop(container);
    var offsetHeight = getOffsetHeight(container);
    var borderBottom = Number.parseFloat(getStyleComputedProperty(container, 'borderBottomWidth'));
    shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance;
  }
  if (shouldTrigger && isFunction(cb)) {
    cb.call(vm);
  } else if (observer) {
    observer.disconnect();
    this[scope].observer = null;
  }
};
var InfiniteScroll = {
  name: 'InfiniteScroll',
  inserted(el, binding, vnode) {
    var cb = binding.value;
    var vm = vnode.context;
    // only include vertical scroll
    var container = getScrollContainer(el, true);
    var _getScrollOptions2 = getScrollOptions(el, vm),
      delay = _getScrollOptions2.delay,
      immediate = _getScrollOptions2.immediate;
    var onScroll = debounce(delay, handleScroll.bind(el, cb));
    el[scope] = {
      el,
      vm,
      container,
      onScroll
    };
    if (container) {
      container.addEventListener('scroll', onScroll);
      if (immediate) {
        var observer = el[scope].observer = new MutationObserver(onScroll);
        observer.observe(container, {
          childList: true,
          subtree: true
        });
        onScroll();
      }
    }
  },
  unbind(el) {
    var _el$scope = el[scope],
      container = _el$scope.container,
      onScroll = _el$scope.onScroll;
    if (container) {
      container.removeEventListener('scroll', onScroll);
    }
  }
};

/* istanbul ignore next */
InfiniteScroll.install = function (Vue) {
  Vue.directive(InfiniteScroll.name, InfiniteScroll);
};

export { InfiniteScroll as default };
