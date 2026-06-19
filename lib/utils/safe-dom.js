// 判断当前是否是 Node.js / SSR 环境
var isServer = typeof window === 'undefined' || typeof document === 'undefined';

// 打造一个纯净的空函数，用来平替所有 DOM 事件监听
var noop = function noop() {};

// 当在 Node 环境下运行时，用这个安全 Mock 对象顶替 document，防止读取属性时 ReferenceError
var mockDocument = {
  childNodes: [],
  documentMode: undefined,
  documentElement: {
    style: {},
    classList: {
      add: noop,
      remove: noop,
      contains: function contains() {
        return false;
      }
    }
  },
  body: {
    style: {}
  },
  addEventListener: noop,
  removeEventListener: noop,
  createElement: function createElement() {
    return {
      style: {},
      appendChild: noop
    };
  },
  getElementsByTagName: function getElementsByTagName() {
    return [];
  },
  querySelector: function querySelector() {
    return null;
  },
  querySelectorAll: function querySelectorAll() {
    return [];
  }
};

// 顺便把 window 也保护起来，以后肯定用得着
var mockWindow = {
  addEventListener: noop,
  removeEventListener: noop,
  getComputedStyle: function getComputedStyle() {
    return {};
  },
  navigator: {
    userAgent: ''
  }
};
var safeDocument = isServer ? mockDocument : document;
var safeWindow = isServer ? mockWindow : window;

export { safeDocument, safeWindow };
