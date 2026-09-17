<template>
  <el-remote-select
    v-model="users"
    cache-key="remote-select-multiple"
    placeholder="请选择用户"
    multiple
    collapse-tags
    value-key="id"
    cache
    remote
    filterable
    :resolve-value="resolveValue"
    :remote-method="remoteMethod">
  </el-remote-select>
</template>

<script>
/* global Promise */
export default {
  data() {
    return {
      users: [{ id: 1 }]
    };
  },
  methods: {
    remoteMethod(query) {
      return Promise.resolve([
        { value: { id: 1 }, label: '张三' },
        { value: { id: 2 }, label: '李四' },
        { value: { id: 3 }, label: '王五' }
      ].filter(item => item.label.indexOf(query) > -1));
    },
    resolveValue(values) {
      return values.map(value => ({
        value: { id: value.id },
        label: value.id === 1 ? '张三' : '未知用户'
      }));
    }
  }
};
</script>
