<template>
  <div class="remote-select-error-demo">
    <el-remote-select
      :key="selectKey"
      ref="citySelect"
      v-model="cityId"
      cache-key="remote-select-error"
      cache
      remote
      filterable
      placeholder="输入任意关键词查看错误状态"
      :remote-method="remoteMethod">
    </el-remote-select>
    <el-button @click="reset">重置</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityId: '',
      requestCount: 0,
      selectKey: 0
    };
  },
  methods: {
    remoteMethod(query) {
      this.requestCount++;
      if (this.requestCount === 1) {
        throw new Error('模拟请求失败');
      }
      return [
        { value: 'sh', label: '上海' },
        { value: 'bj', label: '北京' },
        { value: 'gz', label: '广州' }
      ].filter(item => item.label.indexOf(query) > -1);
    },
    reset() {
      this.requestCount = 0;
      this.cityId = '';
      this.$refs.citySelect.clearCache();
      this.selectKey++;
    }
  }
};
</script>

<style>
.remote-select-error-demo {
  display: flex;
  align-items: center;
}

.remote-select-error-demo .el-button {
  margin-left: 10px;
}
</style>
