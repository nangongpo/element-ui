import Vue from 'vue';
import { safeDocument } from 'element-ui/lib/utils/safe-dom.js';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

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
var isFunction = function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
if (typeof /./ !== 'function' && (typeof Int8Array === "undefined" ? "undefined" : _typeof(Int8Array)) !== 'object' && (Vue.prototype.$isServer || typeof safeDocument.childNodes !== 'function')) {
  isFunction = function isFunction(obj) {
    return typeof obj === 'function' || false;
  };
}
var isUndefined = function isUndefined(val) {
  return val === void 0;
};
var isDefined = function isDefined(val) {
  return val !== undefined && val !== null;
};

export { isDefined, isFunction, isHtmlElement, isObject, isString, isUndefined };
