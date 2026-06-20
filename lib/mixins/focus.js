function Focus (ref) {
  return {
    methods: {
      focus() {
        this.$refs[ref].focus();
      }
    }
  };
}

export { Focus as default };
