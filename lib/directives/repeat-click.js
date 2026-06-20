import { on, once } from '../utils/dom.js';
import { isMac } from '../utils/util.js';
import 'vue';
import '../utils/types.js';

var RepeatClick = {
  bind(el, binding, vnode) {
    var interval = null;
    var startTime;
    var maxIntervals = isMac() ? 100 : 200;
    var handler = () => vnode.context[binding.expression].apply();
    var clear = () => {
      if (Date.now() - startTime < maxIntervals) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };
    on(el, 'mousedown', e => {
      if (e.button !== 0) return;
      startTime = Date.now();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handler, maxIntervals);
    });
  }
};

export { RepeatClick as default };
