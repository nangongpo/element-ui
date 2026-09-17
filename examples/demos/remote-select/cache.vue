<template>
  <div>
    <el-remote-select
      ref="citySelect"
      v-model="cityId"
      cache-key="remote-select-cache"
      cache
      :cache-empty-query="true"
      remote
      filterable
      placeholder="搜索城市"
      :remote-method="remoteMethod"
      @success="updateCacheStats"
      @cache-hit="updateCacheStats">
    </el-remote-select>
    <el-button type="text" @click="clearCache">清除缓存</el-button>
    <span>当前缓存 {{ cacheSize }} 条关键词</span>
    <ul v-if="cacheList.length" class="remote-select-cache-list">
      <li v-for="item in cacheList" :key="item.query">
        <span class="remote-select-cache-list__query">关键词：{{ item.query }}</span>
        <span>选项：{{ item.options.map(option => option.label).join('、') || '无' }}</span>
      </li>
    </ul>
    <div v-else class="remote-select-cache-list__empty">暂无缓存</div>
  </div>
</template>

<script>
const cities = [
  { value: 'sh', label: '上海' },
  { value: 'bj', label: '北京' },
  { value: 'gz', label: '广州' },
  { value: 'sz', label: '深圳' }
];

export default {
  data() {
    return {
      cityId: '',
      cacheSize: 0,
      cacheList: []
    };
  },
  methods: {
    remoteMethod(query) {
      return cities.filter(item => item.label.indexOf(query) > -1);
    },
    updateCacheStats() {
      this.cacheSize = this.$refs.citySelect.getCacheStats().size;
      this.cacheList = this.$refs.citySelect.getCacheList();
    },
    clearCache() {
      this.$refs.citySelect.clearCache();
      this.updateCacheStats();
    }
  }
};
</script>

<style>
.remote-select-cache-list {
  margin: 10px 0 0;
  padding-left: 20px;
  color: #606266;
  font-size: 13px;
  line-height: 24px;
}

.remote-select-cache-list__query {
  display: inline-block;
  min-width: 120px;
  color: #303133;
}

.remote-select-cache-list__empty {
  margin-top: 10px;
  color: #909399;
  font-size: 13px;
}
</style>
