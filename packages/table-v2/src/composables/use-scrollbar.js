export default {
  methods: {
    doScroll(position) {
      const main = this.$refs.mainGrid;
      const left = this.$refs.leftGrid;
      const right = this.$refs.rightGrid;
      if (main) main.scrollTo(position);
      if (position && position.scrollTop != null) {
        if (left) left.scrollToTop(position.scrollTop);
        if (right) right.scrollToTop(position.scrollTop);
      }
    },
    scrollTo(position) {
      const next = Object.assign({ scrollLeft: this.scrollLeft, scrollTop: this.scrollTop }, position || {});
      this.scrollLeft = next.scrollLeft;
      this.scrollTop = next.scrollTop;
      this.doScroll(next);
    },
    setVerticalScroll(value) {
      this.scrollToTop(value);
    },
    scrollToTop(value) {
      const scrollTop = Number(value) || 0;
      this.scrollTop = scrollTop;
      this.scrollTo({ scrollTop });
    },
    scrollToLeft(value) {
      const scrollLeft = Number(value) || 0;
      this.scrollLeft = scrollLeft;
      this.scrollTo({ scrollLeft });
    },
    scrollToRow(index, strategy) {
      const grid = this.$refs.mainGrid || this.$refs.leftGrid || this.$refs.rightGrid;
      if (grid) grid.scrollToRow(index, strategy || 'auto');
    }
  }
};
