export default {
  name: 'ElAutoResizer',
  inheritAttrs: false,
  props: { disableWidth: Boolean, disableHeight: Boolean },
  data() { return { width: 0, height: 0, observer: null }; },
  mounted() { this.updateSize(); if (typeof ResizeObserver !== 'undefined') { this.observer = new ResizeObserver(() => this.updateSize()); this.observer.observe(this.$el.parentNode || this.$el); } },
  beforeDestroy() { if (this.observer) this.observer.disconnect(); },
  methods: { updateSize() { const target = this.$el.parentNode || this.$el; this.width = target.clientWidth; this.height = target.clientHeight; } },
  render(h) {
    const slot = this.$scopedSlots.default;
    const vnodeData = this.$vnode && this.$vnode.data || {};
    const attrs = this.$attrs || {};
    return h('div', {
      attrs,
      class: ['el-auto-resizer', vnodeData.class],
      style: Object.assign({ width: '100%', height: '100%' }, vnodeData.style || {}, attrs.style || {})
    }, slot ? slot({ width: this.disableWidth ? undefined : this.width, height: this.disableHeight ? undefined : this.height }) : []);
  }
};
