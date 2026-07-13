import { BAR_MAP } from 'element-ui/packages/scrollbar/src/util';
import {
  HORIZONTAL,
  SCROLLBAR_MIN_SIZE,
  ScrollbarDirKey,
  ScrollbarSizeKey,
  VERTICAL
} from './defaults';

export default {
  name: 'ElVirtualScrollbar',

  props: {
    alwaysOn: Boolean,
    layout: {
      type: String,
      default: VERTICAL,
      validator: value => [HORIZONTAL, VERTICAL].indexOf(value) > -1
    },
    total: Number,
    ratio: {
      type: Number,
      required: true
    },
    clientSize: {
      type: Number,
      required: true
    },
    scrollFrom: {
      type: Number,
      required: true
    },
    scrollbarSize: {
      type: Number,
      default: 6
    },
    startGap: {
      type: Number,
      default: 0
    },
    endGap: {
      type: Number,
      default: 2
    },
    visible: Boolean
  },

  data() {
    return {
      isDragging: false,
      traveled: 0,
      dragOffset: 0
    };
  },

  computed: {
    bar() {
      return BAR_MAP[this.layout];
    },
    trackSize() {
      return Math.max(0, this.clientSize - this.startGap - this.endGap);
    },
    thumbSize() {
      if (this.ratio >= 100 || !this.total) return Infinity;
      if (this.ratio >= 50) return this.ratio * this.trackSize / 100;
      return Math.floor(Math.min(
        Math.max(this.ratio * this.trackSize / 100, SCROLLBAR_MIN_SIZE),
        this.trackSize / 3
      ));
    },
    totalSteps() {
      return Math.max(0, Math.ceil(this.trackSize - this.thumbSize));
    },
    trackStyle() {
      const horizontal = this.layout === HORIZONTAL;
      return {
        position: 'absolute',
        width: (horizontal ? this.trackSize : this.scrollbarSize) + 'px',
        height: (horizontal ? this.scrollbarSize : this.trackSize) + 'px',
        [ScrollbarDirKey[this.layout]]: '2px',
        right: '2px',
        bottom: '2px',
        [ScrollbarSizeKey[this.layout]]: this.scrollbarSize + 'px',
        borderRadius: '4px'
      };
    },
    thumbStyle() {
      if (!isFinite(this.thumbSize)) return { display: 'none' };
      const style = {};
      style[this.bar.size] = this.thumbSize + 'px';
      style[this.layout === HORIZONTAL ? 'height' : 'width'] = '100%';
      style.transform = `translate${this.bar.axis}(${this.traveled}px)`;
      return style;
    }
  },

  watch: {
    scrollFrom: {
      immediate: true,
      handler(value) {
        if (!this.isDragging) this.traveled = Math.ceil((value || 0) * this.totalSteps);
      }
    }
  },

  beforeDestroy() {
    this.detachEvents();
  },

  methods: {
    attachEvents() {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    detachEvents() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    },
    handleThumbMouseDown(event) {
      if (event.ctrlKey || event.button === 1 || event.button === 2) return;
      event.stopImmediatePropagation();
      this.isDragging = true;
      this.dragOffset = event.currentTarget[this.bar.offset] -
        (event[this.bar.client] - event.currentTarget.getBoundingClientRect()[this.bar.direction]);
      this.$emit('start-move');
      this.attachEvents();
    },
    handleMouseMove(event) {
      if (!this.isDragging || !this.$refs.track) return;
      const pointerOffset = event[this.bar.client] -
        this.$refs.track.getBoundingClientRect()[this.bar.direction];
      const distance = pointerOffset - (this.thumbSize - this.dragOffset);
      this.updateTravel(distance);
    },
    handleMouseUp() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.dragOffset = 0;
      this.$emit('stop-move');
      this.detachEvents();
    },
    handleTrackMouseDown(event) {
      if (event.target !== event.currentTarget) return;
      const offset = Math.abs(
        event.currentTarget.getBoundingClientRect()[this.bar.direction] - event[this.bar.client]
      );
      this.updateTravel(offset - this.thumbSize / 2);
    },
    updateTravel(distance) {
      this.traveled = Math.max(0, Math.min(distance, this.totalSteps));
      this.$emit('scroll', this.traveled, this.totalSteps);
    }
  },

  render(h) {
    return h('div', {
      ref: 'track',
      attrs: { role: 'presentation' },
      class: [
        'el-virtual-scrollbar',
        (this.alwaysOn || this.isDragging) && 'always-on'
      ],
      style: this.trackStyle,
      on: { mousedown: this.handleTrackMouseDown }
    }, [
      h('div', {
        ref: 'thumb',
        class: 'el-scrollbar__thumb',
        style: this.thumbStyle,
        on: { mousedown: this.handleThumbMouseDown }
      })
    ]);
  }
};
