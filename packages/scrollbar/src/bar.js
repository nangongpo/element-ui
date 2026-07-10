import { on, off } from 'element-ui/src/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },

  render(h) {
    const { size, move, bar } = this;

    return (
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler } >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  },

  methods: {
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.updateDragMetrics(e.currentTarget);
      this.startDrag(e);
      this[this.bar.axis] = (this._dragMetrics.thumbSize - (e[this.bar.client] - this._dragMetrics.thumbRectPosition));
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    updateDragMetrics(thumb) {
      const bar = this.bar;

      this._dragMetrics = {
        barRectPosition: this.$el.getBoundingClientRect()[bar.direction],
        barSize: this.$el[bar.offset],
        thumbRectPosition: thumb.getBoundingClientRect()[bar.direction],
        thumbSize: thumb[bar.offset],
        wrapScrollSize: this.wrap[bar.scrollSize]
      };
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];
      const metrics = this._dragMetrics;

      if (!prevPage || !metrics) return;

      const offset = ((metrics.barRectPosition - e[this.bar.client]) * -1);
      const thumbClickPosition = (metrics.thumbSize - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / metrics.barSize);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * metrics.wrapScrollSize / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      this._dragMetrics = null;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};
