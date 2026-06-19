import { on, once } from 'element-ui/lib/utils/dom.js';
import { isMac } from 'element-ui/lib/utils/util.js';

var repeatClick = {
  bind: function bind(el, binding, vnode) {
    var interval = null;
    var startTime;
    var maxIntervals = isMac() ? 100 : 200;
    var handler = function handler() {
      return vnode.context[binding.expression].apply();
    };
    var clear = function clear() {
      if (Date.now() - startTime < maxIntervals) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };
    on(el, 'mousedown', function (e) {
      if (e.button !== 0) return;
      startTime = Date.now();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handler, maxIntervals);
    });
  }
};

export { repeatClick as default };
