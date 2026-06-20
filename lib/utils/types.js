import Vue from 'vue';

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

/**
 *  - Inspired:
 *    https://github.com/jashkenas/underscore/blob/master/modules/isFunction.js
 */
var isFunction = functionToCheck => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
if (typeof /./ !== 'function' && typeof Int8Array !== 'object' && (Vue.prototype.$isServer || typeof document.childNodes !== 'function')) {
  isFunction = function isFunction(obj) {
    return typeof obj === 'function' || false;
  };
}
var isUndefined = val => {
  return val === void 0;
};
var isDefined = val => {
  return val !== undefined && val !== null;
};

export { isDefined, isFunction, isHtmlElement, isObject, isString, isUndefined };
