## Remote Select 选择器

基于 `el-select` 封装的选择器组件，默认按本地 `el-select` 工作，也可以通过 `remote` 开启远程关键词搜索，并按需启用缓存。

组件负责选项规范化、请求状态、请求取消、竞态保护、默认值回显和缓存；输入框搜索防抖由内部 `el-select` 提供，接口参数组装和数据筛选逻辑由业务方法负责。

### 常规用法

默认情况下组件与 `el-select` 一致，使用 `options` 提供本地选项，不开启远程搜索和缓存。

:::demo remote-select/select
:::

### 基础用法

使用 `remote-method` 获取远程选项。`remote-method` 可以同步返回数组，也可以返回 Promise。

:::demo remote-select/basic
:::

### 默认值和 `resolve-value`

当绑定值已有选项时，直接通过 `options` 提供；当默认值只有 ID、没有 label 时，使用 `resolve-value` 根据值获取选项。`resolve-value` 不参与关键词搜索。

解析结果会加入当前选项，并按 `cache-key` 和选项值写入缓存。单选和多选都建议让接口支持批量值查询。

`options` 同时承担本地选项和默认选项职责，会在首次渲染时直接作为可见选项，不会触发请求。

:::demo remote-select/default-value
:::

### 多选和对象值

多选场景支持对象值，通过 `value-key` 判断选项是否相同。

:::demo remote-select/multiple
:::

### 缓存

按 `cache-key` 缓存关键词查询结果，并通过实例方法清理缓存和查看统计。

:::demo remote-select/cache
:::

缓存按 `cache-key` 隔离，并持久化在当前浏览器标签页的 `sessionStorage` 中。同一缓存键、同一关键词再次搜索时会直接使用缓存结果；默认值解析结果也会写入同一缓存键缓存。关闭标签页后缓存会被浏览器清除。

通过 `cache`、`cache-ttl` 和 `cache-size` 控制缓存；也可以通过实例方法清理和查看缓存：

```js
this.$refs.citySelect.clearCache();
this.$refs.citySelect.getCacheStats();
this.$refs.citySelect.getCacheList();
```

### 自定义选项和空状态

使用 `option` 和 `empty` 插槽自定义下拉选项及无数据内容。

:::demo remote-select/slot
:::

`option` 插槽参数为 `{ option }`；`empty` 插槽用于无数据状态。请求失败时组件显示内置错误信息和重试按钮。

### 错误处理和重试

`remote-method` 抛出同步异常时，组件显示错误状态和重试按钮；Promise rejected 的处理方式相同。点击“重试”后返回正常选项，点击“重置”可恢复到失败状态，方便反复测试。

:::demo remote-select/error
:::

关键词搜索失败触发 `error` 事件，默认值解析失败触发 `resolve-error` 事件。两类错误分别通过 `retry()` 和 `retryResolve()` 重试。

### Remote Select Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值；多选时为数组 | any | — |
| cache-key | `cache=true` 时的缓存标识，必须稳定且唯一；`cache=false` 时可省略 | string | '' |
| remote-method | `remote=true` 时的关键词搜索方法；本地模式可省略。 | Function(query, { signal, cancelToken }) | null |
| remote | 是否开启远程搜索；设置为 `true` 后需要提供 `remote-method`。 | boolean | false |
| filterable | 是否允许输入过滤。 | boolean | false |
| resolve-value | 默认值解析方法，只负责根据默认绑定值解析选项。 | Function(values, { cacheKey, valueKey, signal, cancelToken }) | — |
| multiple | 是否多选 | boolean | false |
| options | 本地选项 | array | [] |
| value-key | 对象值比较字段 | string | value |
| cache | 是否启用缓存 | boolean | false |
| cache-empty-query | 是否缓存空查询；默认为 `false`，开启后才会读写空查询结果 | boolean | false |
| cache-ttl | 缓存有效期，单位毫秒，`0` 表示不过期 | number | 300000 |
| cache-size | 每个缓存键最多缓存的总缓存记录数量，必须为正整数 | number | 20 |
| min-query-length | 最小搜索长度 | number | 0 |
| error-text | 搜索失败提示 | string | 加载失败 |
| retry-text | 重试按钮文字 | string | 重试 |
| resolve-error-text | 默认值解析失败提示 | string | 默认值加载失败 |
| resolve-retry-text | 默认值解析重试按钮文字 | string | 重试 |
| no-data-text | 无数据提示 | string | 暂无数据 |

其他 `el-select` 属性会继续透传，例如 `clearable`、`disabled`、`collapse-tags`、`multiple-limit`、`placeholder` 和 `popper-class`。组件默认按本地 `el-select` 工作，开启 `remote` 后才进行远程关键词搜索。

### Remote Select Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| input | 绑定值变化 | value |
| success | 关键词搜索成功 | query, options |
| cache-hit | 命中关键词缓存 | query, options |
| error | 关键词搜索失败 | error, query |
| resolve-success | 默认值解析成功 | values, options |
| resolve-error | 默认值解析失败 | error, values |
| retry | 点击重试 | query |
| cache-change | 当前 `cache-key` 的缓存发生变化 | change |

`focus`、`blur`、`change`、`clear`、`remove-tag`、`visible-change` 等 `el-select` 事件会继续透传。

### Remote Select Slots

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| option | 自定义选项内容 | `{ option }` |
| empty | 无数据时的内容 | — |

### Remote Select Methods

| 方法 | 说明 |
| --- | --- |
| clearCache | 清除当前 `cache-key` 的缓存 |
| invalidateCache | 清除当前 `cache-key` 指定关键词的缓存 |
| getCacheStats | 获取当前 `cache-key` 的缓存统计 |
| getCacheList | 获取当前 `cache-key` 的关键词缓存列表 |
| focus | 聚焦选择器输入框 |
| blur | 取消输入框聚焦 |
| toggleMenu | 打开或关闭下拉菜单 |
| selectOption | 选择当前高亮选项 |
| handleClose | 关闭下拉菜单 |
| retryResolve | 重试默认值解析 |
| cancelResolve | 取消默认值解析请求 |

### 注意事项

- `remote-method` 只负责关键词搜索，不用于根据默认值查询详情。
- `remote-method` 和 `resolve-value` 可以同步返回数组，也可以返回 Promise。
- 返回值必须是数组；每个选项必须是对象并包含有效的 `value`。组件只将 `label` 转换为字符串，不负责业务字段转换、去重或排序。
- 默认值没有 label 时，应使用 `options` 或 `resolve-value`。
- `cache-key` 必须稳定且唯一，不同业务字段不要共用。
- 空查询默认不读写缓存；如果删除关键词后的全量选项也需要缓存，请设置 `:cache-empty-query="true"`。
- 组件适合少量搜索结果，不提供分页和大数据列表能力。
