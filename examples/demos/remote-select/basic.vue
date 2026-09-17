<template>
  <el-remote-select
    v-model="city"
    cache-key="remote-select-basic"
    cache
    placeholder="请输入城市"
    clearable
    remote
    filterable
    :remote-method="remoteMethod">
  </el-remote-select>
</template>

<script>
const cities = [
  { value: 'sh', label: '上海', keywords: 'shanghai sh' },
  { value: 'bj', label: '北京', keywords: 'beijing bj' },
  { value: 'gz', label: '广州', keywords: 'guangzhou gz' }
];

export default {
  data() {
    return { city: '' };
  },
  methods: {
    remoteMethod(query) {
      const keyword = query.toLowerCase();
      return cities.filter((item) => {
        return (
          item.label.indexOf(query) > -1 || item.keywords.indexOf(keyword) > -1
        );
      });
    }
  }
};
</script>
