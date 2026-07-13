<template>
  <li
    :id="contentId ? contentId + '-' + index : null"
    role="option"
    :aria-selected="String(selected)"
    :aria-disabled="disabled || undefined"
    class="el-select-dropdown__item"
    :class="{
      selected: selected,
      'is-disabled': disabled,
      'is-created': created,
      hover: hovering
    }"
    :style="itemStyle"
    :data-option-index="index"
    @mousemove="$emit('hover', index)"
    @mousedown="handleMousedown"
    @click.stop="handleClick">
    <span
      ref="content"
      style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      <slot>{{ label }}</slot>
    </span>
  </li>
</template>

<script type="text/babel">
  import { optionProps } from './defaults';

  export default {
    name: 'ElOptionItem',

    props: optionProps,

    computed: {
      itemStyle() {
        if (this.dynamic) {
          return {
            minHeight: this.itemHeight + 'px'
          };
        }
        return {
          height: this.itemHeight + 'px'
        };
      }
    },

    watch: {
      label() {
        this.requestOverflowCheck();
      }
    },

    mounted() {
      this._overflowScheduled = false;
      this.requestOverflowCheck();
    },

    updated() {
      this.requestOverflowCheck();
      this.reportHeight();
    },

    beforeDestroy() {
      this._overflowScheduled = false;
    },

    methods: {
      handleClick() {
        if (!this.disabled) this.$emit('select', this.index);
      },
      handleMousedown(event) {
        let target = event.target;
        const selector = 'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';
        while (target && target !== this.$el) {
          if (target.matches && target.matches(selector)) return;
          target = target.parentNode;
        }
        event.preventDefault();
      },
      reportHeight() {
        if (!this.dynamic) return;
        this.$nextTick(() => {
          if (this.$el) this.$emit('resize', this.index, this.$el.offsetHeight);
        });
      },
      requestOverflowCheck() {
        if (this._overflowScheduled) return;
        this._overflowScheduled = true;
        this.$nextTick(() => {
          if (!this._overflowScheduled) return;
          this.writeOverflow(this.readOverflow());
          this.reportHeight();
        });
      },
      readOverflow() {
        const content = this.$refs.content;
        if (!content) return null;
        return {
          overflowed: content.scrollWidth > content.clientWidth,
          title: content.textContent.trim()
        };
      },
      writeOverflow(metrics) {
        this._overflowScheduled = false;
        if (!this.$el) return;
        if (metrics && metrics.overflowed && metrics.title) {
          this.$el.setAttribute('title', metrics.title);
        } else {
          this.$el.removeAttribute('title');
        }
      }
    }
  };
</script>
