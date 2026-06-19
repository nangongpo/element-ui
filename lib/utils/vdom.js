import { hasOwn } from 'element-ui/lib/utils/util.js';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function isVNode(node) {
  return node !== null && _typeof(node) === 'object' && hasOwn(node, 'componentOptions');
}

export { isVNode };
