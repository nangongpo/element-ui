<template>
  <div class="el-remote-select">
    <el-select
      ref="select"
      v-bind="$attrs"
      :value="value"
      :value-key="valueKey"
      :multiple="multiple"
      :remote="remote"
      :filterable="filterable"
      :loading="loading"
      :remote-method="handleRemoteMethod"
      :no-data-text="error ? errorText : noDataText"
      v-on="forwardedListeners"
      @input="handleInput">
      <el-option
        v-for="(option, index) in renderedOptions"
        :key="optionKey(option, index)"
        :value="option.value"
        :label="option.label"
        :disabled="option.disabled">
        <slot name="option" :option="option"></slot>
      </el-option>
      <template slot="empty" v-if="error || $slots.empty">
        <div v-if="error" class="el-remote-select__error">
          <i class="el-icon-warning-outline"></i>
          <span>{{ errorText }}</span>
          <el-button type="text" size="mini" @click.stop="retry">{{ retryText }}</el-button>
        </div>
        <slot v-else name="empty"></slot>
      </template>
    </el-select>
    <div v-if="resolveError" class="el-remote-select__resolve-error" role="alert">
      <i class="el-icon-warning-outline"></i>
      <span>{{ resolveErrorText }}</span>
      <el-button type="text" size="mini" @click.stop="retryResolve">{{ resolveRetryText }}</el-button>
    </div>
  </div>
</template>

<script>
import Select from 'element-ui/packages/select';
import Option from 'element-ui/packages/select/src/option.vue';
import optionMixin from './remote-select/option-mixin';
import cacheMixin from './remote-select/cache-mixin';
import requestMixin from './remote-select/request-mixin';

export default {
  name: 'ElRemoteSelect',
  inheritAttrs: false,
  components: { ElSelect: Select, ElOption: Option },
  mixins: [optionMixin, cacheMixin, requestMixin],
  props: {
    value: {},
    cache: { type: Boolean, default: false },
    cacheEmptyQuery: { type: Boolean, default: false },
    remote: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    cacheKey: {
      type: String,
      default: '',
      validator: value => !value || value.trim().length > 0
    },
    remoteMethod: { type: Function, default: null },
    resolveValue: { type: Function, default: null },
    multiple: { type: Boolean, default: false },
    options: { type: Array, default: () => [] },
    valueKey: { type: String, default: 'value' },
    cacheTtl: { type: Number, default: 5 * 60 * 1000, validator: value => isFinite(value) && value >= 0 },
    cacheSize: { type: Number, default: 20, validator: value => isFinite(value) && value > 0 && value % 1 === 0 },
    cacheOptionSize: { type: Number, default: 20, validator: value => isFinite(value) && value > 0 && value % 1 === 0 },
    minQueryLength: { type: Number, default: 0, validator: value => isFinite(value) && value >= 0 },
    errorText: { type: String, default: '加载失败' },
    retryText: { type: String, default: '重试' },
    resolveErrorText: { type: String, default: '默认值加载失败' },
    resolveRetryText: { type: String, default: '重试' },
    noDataText: { type: String, default: '暂无数据' }
  },
  data() {
    return {
      remoteOptions: [],
      loading: false,
      error: false,
      requestId: 0,
      requestController: null,
      lastQuery: '',
      resolveRequest: null,
      pendingResolve: false,
      resolveValues: [],
      resolveError: false,
      optionsNormalized: [],
      optionsReady: false
    };
  },
  computed: {
    forwardedListeners() {
      const listeners = { ...this.$listeners };
      delete listeners.input;
      return listeners;
    }
  },
  created() {
    if (this.remote) this.assertRemoteMethod();
    if (this.cache) {
      this.assertCacheKey();
      this.subscribeCache();
      this.resizeCache();
    }
  },
  methods: {
    /** Forward v-model input from the wrapped el-select. */
    handleInput(value) { this.$emit('input', value); },
    /** Proxy focus to el-select. */
    focus() { return this.$refs.select.focus(); },
    /** Proxy blur to el-select. */
    blur() { return this.$refs.select.blur(); },
    /** Proxy toggleMenu to el-select. */
    toggleMenu() { return this.$refs.select.toggleMenu(); },
    /** Proxy selectOption to el-select. */
    selectOption() { return this.$refs.select.selectOption(); },
    /** Proxy handleClose to el-select. */
    handleClose() { return this.$refs.select.handleClose(); }
  },
  beforeDestroy() {
    this.unsubscribeCache();
    this.requestId++;
    this.abortRequest();
    this.cancelResolveRequest();
  }
};
</script>
