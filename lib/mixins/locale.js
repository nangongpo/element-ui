import { t } from 'element-ui/lib/locale/index.js';

var locale = {
  methods: {
    t: function t$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return t.apply(this, args);
    }
  }
};

export { locale as default };
