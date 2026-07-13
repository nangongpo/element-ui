<template>
  <li ref="group" class="el-select-group__title" :style="groupStyle">{{ label }}</li>
</template>

<script type="text/babel">
  export default {
    name: 'ElOptionGroup',

    props: {
      label: [String, Number],
      index: Number,
      dynamic: Boolean,
      itemHeight: {
        type: Number,
        default: 34
      }
    },

    computed: {
      groupStyle() {
        return {
          height: this.dynamic ? null : this.itemHeight + 'px',
          minHeight: this.itemHeight + 'px',
          lineHeight: this.itemHeight + 'px',
          listStyle: 'none',
          boxSizing: 'border-box'
        };
      }
    },

    mounted() {
      this.reportHeight();
    },

    updated() {
      this.reportHeight();
    },

    methods: {
      reportHeight() {
        if (!this.dynamic) return;
        this.$nextTick(() => {
          if (this.$el) this.$emit('resize', this.index, this.$el.offsetHeight);
        });
      }
    }
  };
</script>
