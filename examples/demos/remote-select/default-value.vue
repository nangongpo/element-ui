<template>
  <div class="remote-select-default-demo">
    <div class="remote-select-default-demo__item">
      <p>使用 options 直接回显：</p>
      <el-remote-select
        v-model="cityId"
        cache-key="remote-select-default-value"
        cache
        placeholder="默认选项直接回显"
        remote
        filterable
        :options="options"
        :remote-method="remoteMethod">
      </el-remote-select>
    </div>
    <div class="remote-select-default-demo__item">
      <p>使用 resolve-value 查询回显：</p>
      <el-remote-select
        v-model="userId"
        cache-key="remote-select-resolve-value"
        cache
        placeholder="通过 resolve-value 回显默认值"
        remote
        filterable
        :resolve-value="resolveValue"
        :remote-method="remoteMethod">
      </el-remote-select>
    </div>
  </div>
</template>

<script>
const users = [
  { value: '1', label: '张三' },
  { value: '2', label: '李四' }
];

export default {
  data() {
    return {
      cityId: 'sh',
      userId: '2',
      options: [{ value: 'sh', label: '上海' }]
    };
  },
  methods: {
    remoteMethod(query) {
      return users.filter(user => user.label.indexOf(query) > -1);
    },
    resolveValue(values) {
      return users.filter(user => values.indexOf(user.value) > -1);
    }
  }
};
</script>

<style>
.remote-select-default-demo__item + .remote-select-default-demo__item {
  margin-top: 20px;
}

.remote-select-default-demo__item p {
  margin: 0 0 8px;
}
</style>
