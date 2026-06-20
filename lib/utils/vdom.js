import { hasOwn } from './util.js';
import 'vue';
import './types.js';

function isVNode(node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions');
}

export { isVNode };
