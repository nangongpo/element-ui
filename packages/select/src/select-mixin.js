import domScheduler from 'element-ui/src/utils/dom-scheduler';

export default {
  methods: {
    readDomMetrics() {
      const reference = this.$refs.reference;
      const referenceEl = reference && reference.$el;

      if (!referenceEl) return null;
      const inputEl = referenceEl.querySelector('input');

      return {
        referenceWidth: referenceEl.getBoundingClientRect().width,
        inputHeight: inputEl ? inputEl.getBoundingClientRect().height : 0
      };
    },

    writeDomMetrics(metrics) {
      this._domSyncScheduled = false;
      if (!metrics) return;
      this.domMetrics = metrics;
      this.inputWidth = metrics.referenceWidth;
      if (!this.initialInputHeight) {
        this.initialInputHeight = metrics.inputHeight || this._inputHeightFallback;
      }
    },

    requestDomSync() {
      if (this._domSyncScheduled) return;
      this._domSyncScheduled = true;
      domScheduler.register({
        vm: this,
        read: this.readDomMetrics,
        write: this.writeDomMetrics
      });
    },

    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return;
      this.$nextTick(() => {
        this.syncInputHeight();
      });
    },

    syncInputHeight() {
      if (!this.multiple) return;
      const reference = this.$refs.reference;
      const referenceEl = reference && reference.$el;
      if (!referenceEl) return;

      const inputEl = referenceEl.querySelector('input');
      const tagsEl = this.$refs.tags;
      const tagsHeight = tagsEl ? Math.round(tagsEl.getBoundingClientRect().height) : 0;
      const initialHeight = this.initialInputHeight || this._inputHeightFallback;

      if (!inputEl) return;

      const height = this.selected.length === 0
        ? initialHeight
        : Math.max(tagsHeight + (tagsHeight > initialHeight ? 6 : 0), initialHeight);

      inputEl.style.height = height + 'px';

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
    this.domMetrics = null;
  }
};
