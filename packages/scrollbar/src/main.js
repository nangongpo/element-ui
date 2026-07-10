// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { cancelFrame, requestFrame, toObject } from 'element-ui/src/utils/util';
import Bar from './bar';

/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  created() {
    this._scrollbarUpdateId = null;
    this._wrapMetrics = {
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollWidth: 0
    };
  },

  render(h) {
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;

    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: 'el-scrollbar' }, nodes);
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;
      const { clientHeight, clientWidth } = this._wrapMetrics;

      this.moveY = clientHeight ? ((wrap.scrollTop * 100) / clientHeight) : 0;
      this.moveX = clientWidth ? ((wrap.scrollLeft * 100) / clientWidth) : 0;
    },

    update() {
      if (this._scrollbarUpdateId !== null) return;

      this._scrollbarUpdateId = requestFrame(() => {
        this._scrollbarUpdateId = null;
        this.doUpdate();
      });
    },

    getWrapMetrics() {
      const wrap = this.wrap;
      if (!wrap) return null;

      return {
        clientHeight: wrap.clientHeight,
        clientWidth: wrap.clientWidth,
        scrollHeight: wrap.scrollHeight,
        scrollWidth: wrap.scrollWidth
      };
    },

    updateWrapMetrics() {
      const metrics = this.getWrapMetrics();

      if (metrics) {
        this._wrapMetrics = metrics;
      }
      return metrics;
    },

    updateBarSize(metrics) {
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = metrics;
      const heightPercentage = scrollHeight ? (clientHeight * 100 / scrollHeight) : 0;
      const widthPercentage = scrollWidth ? (clientWidth * 100 / scrollWidth) : 0;

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    },

    doUpdate() {
      const metrics = this.updateWrapMetrics();
      if (!metrics) return;

      this.updateBarSize(metrics);
      this.handleScroll();
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    if (!this.noresize) {
      addResizeListener(this.$refs.resize, this.update);
      addResizeListener(this.$refs.wrap, this.update);
    }
  },

  beforeDestroy() {
    if (this.native) return;
    if (this._scrollbarUpdateId !== null) {
      cancelFrame(this._scrollbarUpdateId);
      this._scrollbarUpdateId = null;
    }
    if (!this.noresize) {
      removeResizeListener(this.$refs.resize, this.update);
      removeResizeListener(this.$refs.wrap, this.update);
    }
  }
};
