import { t } from '../locale/index.js';
import '../locale/lang/zh-CN.js';
import 'vue';
import '../locale/format.js';
import '../utils/util.js';
import '../utils/types.js';

var Locale = {
  methods: {
    t(...args) {
      return t.apply(this, args);
    }
  }
};

export { Locale as default };
