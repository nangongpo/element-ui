// 判断当前是否是 Node.js / SSR 环境
const isServer = typeof window === 'undefined' || typeof document === 'undefined';

// 打造一个纯净的空函数，用来平替所有 DOM 事件监听
const noop = () => {};

// 当在 Node 环境下运行时，用这个安全 Mock 对象顶替 document，防止读取属性时 ReferenceError
const mockDocument = {
  childNodes: [],
  documentMode: undefined,
  documentElement: {
    style: {},
    classList: { add: noop, remove: noop, contains: () => false }
  },
  body: {
    style: {}
  },
  addEventListener: noop,
  removeEventListener: noop,
  createElement: () => ({ style: {}, appendChild: noop }),
  getElementsByTagName: () => [],
  querySelector: () => null,
  querySelectorAll: () => []
};

// 顺便把 window 也保护起来，以后肯定用得着
const mockWindow = {
  addEventListener: noop,
  removeEventListener: noop,
  getComputedStyle: () => ({}),
  navigator: { userAgent: '' }
};

export const safeDocument = isServer ? mockDocument : document;
export const safeWindow = isServer ? mockWindow : window;
