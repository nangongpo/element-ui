# Remote Select

基于 `el-select` 的选择器组件，默认按本地 `el-select` 工作，也可以通过 `remote` 开启远程关键词搜索，并按需启用缓存。组件负责选项规范化、搜索状态、请求取消、竞态保护、默认值回显和缓存，缓存默认持久化在当前标签页的 `sessionStorage` 中；接口参数组装和数据筛选逻辑由业务方法负责。

```vue
<el-remote-select
  v-model="value"
  remote
  cache-key="city"
  :remote-method="remoteMethod"
/>
```

支持单选、多选、同步或异步方法、字段级查询缓存和默认值回显：

```vue
<el-remote-select
  v-model="cityIds"
  remote
  cache-key="city"
  multiple
  collapse-tags
  :options="[{ value: 'sh', label: '上海' }]"
  :remote-method="remoteMethod"
/>
```

## remoteMethod

```js
function remoteMethod(query, { signal, cancelToken }) {
  return axios.get('/city', {
    params: { keyword: query },
    signal,
    cancelToken
  }).then(response => response.data.list.map(item => ({
    value: item.id,
    label: item.name
  })))
}
```

普通搜索返回选项数组，也可以直接同步返回数组：

```js
const remoteMethod = query => query ? [
  { value: 'sh', label: '上海' }
] : [];
```

组件会在新查询、重试和销毁时取消旧请求，同时兼容 Axios 的 `signal` 与 `cancelToken`。

## resolveValue

`remoteMethod` 只负责关键词搜索，不能用于根据默认绑定值查询详情。默认值没有对应选项时，使用 `resolveValue`：

```js
function resolveValue(values, { cacheKey, valueKey, signal, cancelToken }) {
  return cityApi.getByIds(values, {
    cacheKey,
    valueKey,
    signal,
    cancelToken
  }).then(list => list.map(item => ({
    value: item.id,
    label: item.name
  })));
}
```

`values` 是待解析的默认值数组；返回值可以是选项数组，也可以是解析为选项数组的 Promise。

## 插槽

组件提供 `option` 和 `empty` 两个 Vue 2 插槽：

```vue
<el-remote-select cache-key="city" :remote-method="remoteMethod">
  <template slot="option" slot-scope="{ option }">
    <span>{{ option.label }}</span>
    <small>{{ option.description }}</small>
  </template>
  <template slot="empty">
    <span>没有匹配结果</span>
  </template>
</el-remote-select>
```

`option` 插槽参数为 `{ option }`。请求失败时，`empty` 插槽不会覆盖内置错误信息和重试按钮。

## API

除以下属性外，其他 `el-select` 属性和事件会继续透传。组件默认按本地 `el-select` 工作；开启 `remote` 后才进行远程关键词搜索。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cache-key | String | '' | `cache=true` 时必填且必须稳定唯一；`cache=false` 时可省略 |
| remote-method | Function(query, { signal, cancelToken }) | null | `remote=true` 时的关键词搜索方法；本地模式可省略 |
| remote | Boolean | false | 是否开启远程搜索；设置为 true 后需要提供 remote-method |
| filterable | Boolean | false | 是否允许输入过滤；透传给 el-select |
| resolve-value | Function(values, { cacheKey, valueKey, signal, cancelToken }) | — | 默认值解析方法 |
| options | Array | [] | 本地选项，同时用于默认值回显 |
| cache-option-size | Number | 20 | 每个缓存键最多缓存的独立解析选项数量，必须为正整数 |
| value-key | String | value | 对象值比较字段 |
| cache | Boolean | false | 是否启用缓存 |
| cache-empty-query | Boolean | false | 是否缓存空查询；默认不读写空查询缓存，设置为 true 后缓存空查询结果 |
| cache-ttl | Number | 300000 | 缓存有效期，单位毫秒，0 表示不过期 |
| cache-size | Number | 20 | 每个缓存键最多缓存的关键词查询数量，必须为正整数 |
| min-query-length | Number | 0 | 最小搜索长度 |
| error-text | String | 加载失败 | 关键词搜索失败提示 |
| retry-text | String | 重试 | 关键词搜索重试按钮文字 |
| resolve-error-text | String | 默认值加载失败 | 默认值解析失败提示 |
| resolve-retry-text | String | 重试 | 默认值解析重试按钮文字 |
| no-data-text | String | 暂无数据 | 无数据提示 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| remote-error | error, query | 关键词搜索失败 |
| resolve-success | values, options | 默认值解析成功 |
| resolve-error | error, values | 默认值解析失败 |
| cache-change | change | 当前缓存发生变化 |

`input`、`change`、`visible-change`、`clear`、`blur` 和 `focus` 等
`el-select` 事件以及其他 `el-select` 属性会继续透传。

实例方法：`search(query)` 发起搜索；`clearCache()` 清除当前缓存；`invalidateCache(query)` 清除指定关键词缓存；`invalidateOption(value)` 清除指定解析选项缓存；`getCacheStats()` 获取当前缓存统计；`getCacheList()` 获取关键词缓存列表；`focus()`、`blur()`、`toggleMenu()`、`selectOption()` 和 `handleClose()` 代理 `el-select` 的对应方法。解析失败时可用 `retryResolve()` 重试，必要时可用 `cancelResolve()` 取消解析请求。

请求失败时清空本次查询选项，保留已选值回显；历史缓存不删除，也不会直接作为本次失败查询的结果展示。

该组件目前只提供包内直接引用，不加入 `src/index.js` 和 `components.json`：

```js
import RemoteSelect from 'packages/remote-select'
```
