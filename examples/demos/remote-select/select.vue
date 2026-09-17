<template>
  <div class="remote-select-local-demo">
    <el-remote-select
      v-model="city"
      placeholder="请选择城市"
      clearable
      :options="cities">
    </el-remote-select>
    <el-remote-select
      v-model="selectedCities"
      placeholder="请选择多个城市"
      multiple
      collapse-tags
      :options="cities">
    </el-remote-select>
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
      cities,
      city: 'sh',
      selectedCities: ['bj']
    };
  }
};
</script>

<style>
.remote-select-local-demo {
  display: flex;
  align-items: center;
}

.remote-select-local-demo .el-remote-select + .el-remote-select {
  margin-left: 12px;
}
</style>
