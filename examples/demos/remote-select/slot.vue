<template>
  <el-remote-select
    v-model="cityId"
    cache-key="remote-select-slot"
    cache
    placeholder="自定义选项和空状态"
    remote
    filterable
    :remote-method="remoteMethod">
    <template slot="option" slot-scope="{ option }">
      <span>{{ option.label }}</span>
      <small v-if="option.description" style="margin-left: 8px; color: #999;">
        {{ option.description }}
      </small>
    </template>
    <template slot="empty">
      <div class="remote-select-empty">
        <i class="el-icon-search"></i>
        <span>没有找到匹配的城市</span>
      </div>
    </template>
  </el-remote-select>
</template>

<script>
export default {
  data() {
    return { cityId: '' };
  },
  methods: {
    remoteMethod(query) {
      return [
        { value: 'sh', label: '上海', description: '华东' },
        { value: 'bj', label: '北京', description: '华北' },
        { value: 'gz', label: '广州', description: '华南' }
      ].filter(item => item.label.indexOf(query) > -1);
    }
  }
};
</script>

<style>
.remote-select-empty {
  padding: 10px 0;
  color: #909399;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}

.remote-select-empty i {
  margin-right: 5px;
}
</style>
