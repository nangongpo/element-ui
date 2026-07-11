import domScheduler from 'element-ui/src/utils/dom-scheduler';

export default {
  methods: {
    requestDomSync() {
      if (this._domSyncScheduled) return;
      this._domSyncScheduled = true;
      domScheduler.register({
        vm: this,
        read: () => {
          const reference = this.$refs.reference;
          const referenceEl = reference && reference.$el;
          const tagsEl = this.$refs.tags;

          if (!referenceEl) return null;
          const inputEl = referenceEl.querySelector('input');

          return {
            referenceWidth: referenceEl.getBoundingClientRect().width,
            tagsHeight: tagsEl ? tagsEl.getBoundingClientRect().height : 0,
            inputHeight: inputEl ? inputEl.getBoundingClientRect().height : 0,
            inputEl
          };
        },
        write: (metrics) => {
          this._domSyncScheduled = false;
          if (!metrics) return;
          this.domMetrics = metrics;
          this.inputWidth = metrics.referenceWidth;
          if (!this.initialInputHeight) {
            this.initialInputHeight = metrics.inputHeight || this._inputHeightFallback;
          }
          this.alignLayoutByMetrics(metrics);
        }
      });
    },

    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return;
      this.requestDomSync();
    },

    alignLayoutByMetrics(metrics = this.domMetrics) {
      if (!this.multiple || this._tagLeaving) return;

      const tagsHeight = metrics.tagsHeight;
      const initialHeight = this.initialInputHeight;

      const height = this.selected.length === 0
        ? initialHeight
        : Math.max(tagsHeight + (tagsHeight > initialHeight ? 6 : 0), initialHeight);

      if (metrics.inputEl) {
        metrics.inputEl.style.height = height + 'px';
      }

      if (this.visible && this.emptyText !== false) {
        this.requestPopperUpdate();
      }
    },

    requestPopperUpdate() {
      const popper = this.$refs.popper;
      if (!popper) return;

      // Popper needs the height written above. Running it in the next frame
      // avoids forcing layout immediately after that style mutation.
      domScheduler.register({
        vm: popper,
        read: () => true,
        write: () => {
          if (this.visible && this.emptyText !== false) {
            this.broadcast('ElSelectDropdown', 'updatePopper');
          }
        }
      });
    },

    handleResize() {
      this.requestDomSync();
    },

    handleTagBeforeLeave() {
      this._tagLeaving = true;
    },

    handleTagAfterLeave() {
      this._tagLeaving = false;
      this.resetInputHeight();
    }
  },

  created() {
    const sizeMap = {
      default: 40,
      medium: 36,
      small: 32,
      mini: 28
    };
    this._inputHeightFallback = sizeMap[this.selectSize || 'default'];
    this._domSyncScheduled = false;
    this._tagLeaving = false;
    this.domMetrics = null;
  }
};
