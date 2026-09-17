# Remote Select 实现需求

本文档以当前 `remote-select` 的公开行为为准，用于指导组件重写、维护和测试。

## 1. 组件定位

`el-remote-select` 是基于 Element UI Vue 2 `el-select` 封装的选择器组件。

组件默认表现为本地 `el-select`，只有显式开启 `remote` 后才启用远程关键词搜索。组件负责：

- 选项规范化和默认值回显；
- 远程搜索请求状态、取消和竞态保护；
- `resolveValue` 默认值解析；
- 查询缓存、解析选项缓存和 `sessionStorage` 持久化；
- 错误展示和失败重试；
- Element UI `el-select` 的属性、事件、插槽和常用实例方法透传。

接口参数组装、业务字段转换、关键词过滤、排序、分页和去重由业务方法负责。

组件只兼容 Element UI，不兼容 Element Plus，不提供分页或大数据虚拟滚动能力。

## 2. 目录和代码边界

推荐目录结构：

```text
packages/remote-select/
├── index.js
├── README.md
├── REQUIREMENTS.md
└── src/
    ├── remote-select.vue
    ├── remote-select/
    │   ├── cache-mixin.js
    │   ├── option-mixin.js
    │   └── request-mixin.js
    ├── cache/
    │   ├── index.js
    │   ├── cache-store.js
    │   ├── cache-entry.js
    │   ├── cache-storage.js
    │   ├── cache-utils.js
    │   └── cache-notifier.js
    └── request/
        ├── index.js
        ├── request-controller.js
        └── request-error.js
```

约束：

1. 不再保留或引用 `packages/remote-select/src/cache.js`。
2. 不再保留 `cache-lru.js`；LRU 逻辑由 `cache-store.js` 实现。
3. 组件和测试只能通过 `src/cache/index.js` 的公开 API 使用缓存，不得直接操作内部 `Map`、`Set` 或 `sessionStorage`。
4. `axios` 是外部依赖，不得被打包进组件产物；它只用于创建取消上下文和识别取消错误。
5. 组件不得包含内联 `<style>`。组件样式必须放在 `packages/theme-chalk/src/remote-select.scss`，并通过 `components.json` 和 theme-chalk 的入口参与构建。

## 3. 全局注册和模块导出

`packages/remote-select/index.js` 默认导出组件，并提供 Vue 插件安装方法：

```js
import RemoteSelect from 'packages/remote-select';

Vue.use(RemoteSelect);
```

安装时注册组件名 `ElRemoteSelect`，模板中使用：

```html
<el-remote-select />
```

组件还必须被加入 `components.json`，使 Element UI 主入口可以全局注册它。examples 已通过 Element 全局注册使用，不得再次单独 `import` 或 `Vue.use(RemoteSelect)`。

## 4. Props

| Prop | 类型 | 默认值 | 行为 |
| --- | --- | --- | --- |
| `value` | 任意 | — | `v-model` 值；多选时应为数组 |
| `options` | Array | `[]` | 本地选项，同时承担默认值回显职责 |
| `remote` | Boolean | `false` | 是否启用远程搜索 |
| `filterable` | Boolean | `false` | 是否允许输入过滤 |
| `remoteMethod` | Function | `null` | 远程搜索方法；`remote=true` 时必填 |
| `resolveValue` | Function | `null` | 根据绑定值解析缺失选项的方法 |
| `multiple` | Boolean | `false` | 是否多选 |
| `valueKey` | String | `'value'` | 对象值的比较字段 |
| `cache` | Boolean | `false` | 是否启用缓存 |
| `cacheKey` | String | `''` | 缓存命名空间；`cache=true` 时必填 |
| `cacheEmptyQuery` | Boolean | `false` | 是否读写空查询缓存 |
| `cacheTtl` | Number | `300000` | 查询缓存有效期，单位毫秒；`0` 表示不过期 |
| `cacheSize` | Number | `20` | 每个命名空间的查询缓存数量上限 |
| `cacheOptionSize` | Number | `20` | 每个命名空间的独立解析选项缓存数量上限 |
| `minQueryLength` | Number | `0` | 小于该长度时不发起远程请求 |
| `errorText` | String | `'加载失败'` | 远程搜索错误提示 |
| `retryText` | String | `'重试'` | 远程搜索重试按钮文字 |
| `resolveErrorText` | String | `'默认值加载失败'` | 默认值解析错误提示 |
| `resolveRetryText` | String | `'重试'` | 默认值解析重试按钮文字 |
| `noDataText` | String | `'暂无数据'` | 无数据提示 |

所有其他 `$attrs` 和 `el-select` 事件都必须继续透传。

参数校验：

- `cache=false` 时 `cacheKey` 可以为空，组件不得因为缺少 `cacheKey` 报错，也不得读写缓存或触发缓存事件。
- `cache=true` 时 `cacheKey` 必须是去除首尾空白后仍非空的字符串，否则创建或启用缓存时抛出错误。
- `remote=true` 时 `remoteMethod` 必须是函数，否则创建或启用远程模式时抛出错误。
- `cacheTtl` 必须是大于等于 0 的有限数值；无效值回退为 5 分钟。
- `cacheSize` 和 `cacheOptionSize` 必须是正整数；无效值回退为 20。
- `minQueryLength` 必须是大于等于 0 的有限数值。

`cache=false` 只表示禁用缓存，不等于降级为原生 `el-select`。`remote` 和 `filterable` 是否启用仍由各自参数决定。

## 5. 选项模型和匹配规则

远程方法、解析方法、`options` 和缓存中的每个选项都必须经过统一规范化：

```js
{
  value: any,       // 必填，不能为 null 或 undefined
  label: String,    // 组件统一转换为字符串
  disabled?: Boolean,
  ...其他业务字段
}
```

规则：

1. 返回值必须是数组；同步返回数组和 Promise 返回数组都必须支持。
2. `value` 缺失、为 `null` 或 `undefined` 时视为非法选项，进入错误处理，不得静默过滤。
3. `label` 使用 `String(option.label)` 转换，包括 `undefined` 也必须按 JavaScript 字符串规则处理。
4. 基础类型值直接比较；对象值按 `valueKey` 对应字段比较。
5. 不使用 `label` 匹配，不依赖对象引用。
6. `valueKey` 变化后必须重建缓存索引并重新执行默认值匹配。
7. 查询结果保留业务方法返回的完整顺序和重复项，组件不负责排序或去重。
8. 独立解析选项缓存按 `valueKey` 建立索引，同一索引后写入的选项覆盖旧选项。

## 6. 本地模式和远程模式

### 6.1 本地模式

当 `remote=false` 时：

- 不调用 `remoteMethod`；
- `remoteMethod` 可以为空；
- 使用 `options` 作为本地选项；
- 保留已经通过 `resolveValue` 或缓存恢复的选中选项；
- 其余行为与 `el-select` 一致。

### 6.2 远程模式

当 `remote=true` 时：

- 由内部 `el-select` 触发远程搜索；
- 输入防抖使用 `el-select` 自带机制，组件不再提供 `debounce-delay`；
- 每次有效查询只显示当前查询结果；
- 为保证已选值可显示，当前绑定值对应的选项可以附加在查询结果之后；
- `options` 中未选中的本地选项不得混入远程查询结果；
- `resolveValue` 解析出的非当前绑定值不得显示在当前下拉列表中。

选项显示规则：

```text
本地模式：options + 已解析选项
远程模式：当前查询结果 + 当前已选项
```

搜索结果更新时必须清理上一次查询的非选中结果，但不能清理当前绑定值所需的显示选项。

## 7. 默认值回显

组件创建、`value` 变化、`options` 变化、`valueKey` 变化以及缓存相关选项更新时，都要尝试恢复当前绑定值。

每个绑定值按以下顺序查找：

```text
当前绑定值
  -> options
  -> 选项缓存
  -> resolveValue
  -> 显示当前绑定值对应选项
```

具体规则：

1. `options` 已有匹配项时直接回显，不调用 `resolveValue`。
2. 缓存中已有匹配项时直接回显，不重复调用 `resolveValue`。
3. 只有仍然缺失的值才传给 `resolveValue`。
4. 单选也必须以数组形式传参，例如 `['id']`。
5. 多选只传递缺失值，并按绑定数组去重。
6. `resolveValue` 返回的所有合法选项都可以写入独立选项缓存，但当前列表只显示与当前绑定值匹配的结果。
7. 已选项在远程搜索刷新后仍须保留，以便 `el-select` 正确显示 label。
8. 绑定值变为空、变化或组件销毁时，旧解析请求必须取消；旧结果不得覆盖新状态。
9. 解析失败时显示独立的解析错误区域，不覆盖远程搜索错误状态。
10. 后续 `options` 出现匹配项时，清除解析错误并更新显示。

`resolveValue` 只负责根据绑定值查详情，不参与关键词搜索。

## 8. remoteMethod

调用形式：

```js
remoteMethod(query, context)
```

其中 `query` 一定是字符串：

- `null`、`undefined` 转换为 `''`；
- 数字、对象等值转换为 `String(value)`。

`context` 至少包含：

```js
{
  signal,
  cancelToken,
  cacheKey,
  valueKey
}
```

要求：

1. 支持同步数组和 Promise 数组。
2. 查询长度小于 `minQueryLength` 时取消当前请求、清空当前远程结果、清除查询错误并且不调用 `remoteMethod`。
3. 新查询开始前取消旧请求。
4. 旧请求即使晚于新请求返回，也不能更新选项、错误、loading 或缓存。
5. 成功后设置当前查询结果并触发 `success`。
6. 失败或同步抛错时清空当前查询结果、保留已选显示项、设置查询错误并触发错误事件。
7. 取消属于正常控制流程，不得显示错误或写入错误缓存。
8. 支持通过 `retry()` 重试最近一次查询。

组件不对 `remoteMethod` 返回条数做限制，前 10 条等业务限制由 `remoteMethod` 自行实现。

## 9. resolveValue

调用形式：

```js
resolveValue(values, context)
```

`values` 始终是缺失绑定值组成的数组，`context` 至少包含：

```js
{
  cacheKey,
  valueKey,
  signal,
  cancelToken
}
```

要求：

- 支持同步数组和 Promise 数组；
- 只接收当前缺失值；
- 成功后将所有合法结果写入选项缓存（启用缓存时）；
- 只有当前绑定值匹配的结果加入显示选项；
- 绑定值变化时取消旧请求；
- 旧请求结果不能覆盖新绑定值的结果；
- 失败触发 `resolve-error` 并显示解析错误；
- 支持 `retryResolve()` 重试最近一次解析。

## 10. 请求控制和 loading

请求控制器由 `request-controller.js` 创建：

- 优先创建原生 `AbortController` 的 `signal`；
- 使用 `axios.CancelToken.source()` 创建 `cancelToken`（可用时）；
- `cancel()` 同时取消两种请求上下文。

取消错误需要识别：

- `axios.isCancel(error)`；
- `ERR_CANCELED`；
- `CanceledError`；
- `AbortError`。

组件至少维护两类请求：当前关键词请求和当前默认值解析请求。

`loading` 在任一请求存在时为 `true`，两类请求都结束或取消后才恢复为 `false`。组件销毁后到达的异步结果不得更新组件或触发业务事件。

## 11. 查询缓存

### 11.1 开关规则

只有 `cache=true` 时才允许读取查询缓存、写入查询缓存、读写解析选项缓存、订阅缓存变化，以及触发 `cache-hit` 和 `cache-change`。

`cache=false` 时上述操作全部禁用，`cacheKey` 不要求传入。

### 11.2 查询键和数据

查询缓存结构：

```text
cacheKey + query -> options[]
```

查询使用规范化后的字符串作为键。缓存保存远程方法成功返回的完整数组，包括空数组和重复项。

### 11.3 空查询

```js
const canCacheQuery = cache && (
  query !== '' || cacheEmptyQuery
);
```

默认情况下，空查询不读缓存，成功结果不写缓存；删除关键词后仍按正常逻辑请求远程方法。设置 `cacheEmptyQuery=true` 后，空查询与普通关键词一样读写缓存。

### 11.4 查询缓存流程

```text
规范化 query
  -> 检查 minQueryLength
  -> 取消旧请求
  -> cache=true 且允许缓存时读取缓存
  -> 命中则直接显示并触发 cache-hit
  -> 未命中则调用 remoteMethod
  -> 成功后写入缓存并触发 success
```

规则：

- 查询缓存受 `cacheTtl` 控制，`0` 表示不过期；
- 命中查询会更新查询 LRU 顺序；
- `peek`、`list`、统计等只读操作不得更新 LRU；
- 查询失败、取消、非法返回和过期请求不得写入错误结果；
- 过期查询从内存和持久化数据中删除，并释放对选项的引用。

## 12. 独立解析选项缓存

查询缓存和独立解析选项缓存分别使用：

```text
cacheKey + query -> options[]
cacheKey + valueKey 对应值 -> option
```

规则：

1. 独立选项缓存只由 `resolveValue` 成功结果产生。
2. 同一 `valueKey` 对应值后写入的选项覆盖旧选项，不增加数量。
3. 选项缓存不受 `cacheTtl` 影响，只受 `cacheOptionSize` 控制。
4. 查询缓存引用的选项不能因为独立选项容量淘汰而直接删除。
5. 只有与当前绑定值匹配的选项才参与默认值回显和远程结果补充。
6. 本地 `options` 不创建新的独立解析缓存项，只更新已经存在的同值缓存项。
7. 支持按值失效和清空命名空间。

## 13. 缓存容量和 LRU

两类容量必须独立：

```text
cacheSize       -> 查询缓存数量
cacheOptionSize -> 独立解析选项数量
```

禁止使用“查询数量 + 解析选项数量 <= cacheSize”的合计规则。

查询缓存超过 `cacheSize` 时淘汰最旧查询，并释放该查询对选项的引用。

独立解析选项超过 `cacheOptionSize` 时淘汰最旧的、未被查询引用的独立选项。若所有独立选项都被查询引用，可以暂时超过容量，直到出现可淘汰项。

动态修改两个容量参数后必须立即执行对应类型的容量约束，并持久化变化和发送缓存变化通知。

## 14. sessionStorage 持久化

每个缓存命名空间独立存储：

```text
el-remote-select:${cacheKey}
```

持久化数据至少包含查询缓存、查询创建时间、查询 LRU、独立解析选项、选项 LRU 和查询与选项之间的引用关系。

要求：

1. 创建缓存命名空间时自动尝试恢复持久化数据。
2. `sessionStorage` 不可用时继续使用内存缓存。
3. 读取数据解析失败时删除损坏数据，不能阻断组件工作。
4. 写入失败不能影响查询、解析和显示。
5. 遇到存储配额错误时，按“最旧查询 -> 最旧可淘汰解析选项”的顺序释放空间并重试。
6. 清理、失效和容量淘汰后必须同步更新持久化数据。
7. 支持清空单个命名空间，也支持清空所有 `el-remote-select:` 前缀数据。

## 15. 缓存公开 API

`src/cache/index.js` 提供统一缓存入口，至少包含：

| 方法 | 说明 |
| --- | --- |
| `peek(namespace, query, ttl)` | 读取查询但不更新 LRU |
| `get(namespace, query, ttl)` | 读取查询并更新 LRU |
| `set(namespace, query, options, size, valueKey)` | 写入查询结果 |
| `setOption(namespace, option, valueKey, size)` | 写入解析选项 |
| `getOption(namespace, value, valueKey)` | 读取解析选项 |
| `updateOptions(namespace, options, valueKey)` | 更新已建立索引的本地选项 |
| `reindex(namespace, valueKey)` | `valueKey` 变化后重建索引 |
| `enforce(namespace, size, optionSize)` | 执行两类容量约束 |
| `subscribe(namespace, listener)` | 订阅缓存变化并返回取消订阅函数 |
| `clear(namespace?)` | 清空单个或全部命名空间 |
| `invalidate(namespace, query)` | 失效一个查询 |
| `invalidateOption(namespace, value, valueKey)` | 失效一个解析选项 |
| `stats(namespace, ttl)` | 获取查询数和独立解析选项数 |
| `list(namespace, ttl)` | 获取查询列表及其选项 |

缓存 listener 抛错必须被隔离，不能阻断缓存写入、其他 listener 或组件主流程。

## 16. 错误和重试

### 16.1 远程搜索错误

- 清空当前查询的非选中结果；
- 保留已选项显示；
- 设置 `error=true`；
- 显示 `errorText` 和 `retryText`；
- 触发 `remote-error(error, query)` 和兼容的 `error(error, query)`；
- 不写入错误缓存；
- `retry()` 成功后清除错误并显示新结果。

### 16.2 默认值解析错误

- 设置 `resolveError=true`；
- 显示独立的 `resolveErrorText` 和 `resolveRetryText`；
- 触发 `resolve-error(error, values)`；
- 不覆盖远程查询错误状态；
- `retryResolve()` 成功后清除解析错误；
- 后续 `options` 出现匹配项时清除解析错误。

### 16.3 非法返回值

以下情况必须进入错误流程：返回值不是数组、选项不是对象、缺少 `value`、`value` 为 `null` 或 `undefined`、同步方法抛错或 Promise reject。

## 17. Events

组件必须支持并透传：

- `input(value)`；
- `change(value)`；
- `visible-change(visible)`；
- `clear()`；
- `blur(event)`；
- `focus(event)`。

组件新增事件：

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `success` | `query, options` | 远程搜索成功 |
| `cache-hit` | `query, options` | 命中查询缓存 |
| `remote-error` | `error, query` | 远程搜索失败 |
| `resolve-success` | `values, options` | 默认值解析成功 |
| `resolve-error` | `error, values` | 默认值解析失败 |
| `cache-change` | `change` | 当前缓存命名空间发生变化 |
| `retry` | `query` | 用户点击远程搜索重试 |

缓存变化类型至少包括：`set`、`option-set`、`options-update`、`expire`、`invalidate`、`option-invalidate`、`resize` 和 `clear`。

`cache=false` 时不得触发 `cache-hit` 或 `cache-change`。

## 18. Slots

### option

作用域参数为 `{ option }`，用于自定义选项内容。

### empty

无数据时使用。发生远程搜索错误时，内置错误信息和重试按钮优先于自定义空状态显示。

## 19. 实例方法

必须支持：

| 方法 | 说明 |
| --- | --- |
| `search(query)` | 主动执行一次远程搜索 |
| `focus()` | 聚焦内部 `el-select` |
| `blur()` | 使内部 `el-select` 失焦 |
| `toggleMenu()` | 切换下拉菜单 |
| `selectOption()` | 选择当前高亮选项 |
| `handleClose()` | 关闭下拉菜单 |
| `clearCache()` | 清空当前缓存命名空间 |
| `invalidateCache(query)` | 失效一个查询缓存 |
| `invalidateOption(value)` | 失效一个解析选项缓存 |
| `getCacheStats()` | 获取缓存统计 |
| `getCacheList()` | 获取查询缓存列表 |
| `retry()` | 重试最近一次远程查询 |
| `retryResolve()` | 重试最近一次默认值解析 |
| `cancelResolve()` | 取消当前默认值解析请求 |

当缓存关闭时，缓存控制方法不得产生缓存读写或缓存事件；统计方法返回空统计，失效方法返回 `false`。

## 20. 生命周期和动态参数

### cache 切换

从 `false` 切换为 `true` 时校验 `cacheKey`、订阅当前命名空间并按当前容量执行约束。切换为 `false` 时解除订阅，但不删除已有外部缓存，后续不再读写缓存或触发缓存事件。

### cacheKey 变化

必须解除旧命名空间订阅、订阅新命名空间、取消旧查询和解析请求、清空旧远程查询结果和查询错误、重新恢复当前绑定值，并停止接收旧命名空间通知。

### remote 切换

开启 `remote` 时校验 `remoteMethod`。关闭 `remote` 时取消当前远程请求并更新 loading，但不得改变 `options`、绑定值或缓存数据。

### 组件销毁

组件销毁前必须解除缓存订阅、取消查询请求和解析请求，并忽略之后到达的异步结果，避免状态更新和内存泄露。

## 21. 样式和构建

组件的基本渲染结构必须保持为一个包装容器和内部 `el-select`：

```html
<div class="el-remote-select">
  <el-select>
    <el-option
      v-for="option in renderedOptions"
      :value="option.value"
      :label="option.label"
      :disabled="option.disabled"
    />
  </el-select>
  <div class="el-remote-select__resolve-error" />
</div>
```

远程查询错误通过 `el-select` 的 empty 状态展示：

```html
<div class="el-remote-select__error">
  <i class="el-icon-warning-outline" />
  <span>{{ errorText }}</span>
  <el-button type="text" size="mini">{{ retryText }}</el-button>
</div>
```

组件必须使用 `inheritAttrs: false`，将 `$attrs` 和除 `input` 以外的 `$listeners` 传给内部 `el-select`，并单独转发 `input` 事件。

组件错误区域样式必须位于：

```text
packages/theme-chalk/src/remote-select.scss
```

样式入口必须满足：

1. `components.json` 注册 `remote-select`。
2. `packages/theme-chalk/src/index.scss` 引入 `remote-select.scss`。
3. `npm run dist` 能生成 `lib/theme-chalk/remote-select.css`。
4. `remote-select.vue` 不包含 `<style>`，避免 Rollup 将虚拟 CSS 模块交给 Babel 解析。

## 22. 测试要求

测试必须分为两组：

### 第一组：Select compatibility

保证 `remote-select` 能通过 `el-select` 原有能力测试，至少覆盖本地模式、默认值显示、`multiple`、`filterable`、属性和事件透传、`option`/`empty` 插槽，以及 `focus`、`blur`、`toggleMenu`、`selectOption`、`handleClose` 方法。

### 第二组：RemoteSelect features

至少覆盖：

- 同步和 Promise 形式的 `remoteMethod`、`resolveValue`；
- 查询参数规范化和 `minQueryLength`；
- 默认值优先从 `options`、选项缓存、`resolveValue` 恢复；
- 回显完成后重新搜索时，只显示查询结果和当前已选项；
- 单选、多选和多缺失值解析；
- `valueKey` 对象匹配和索引重建；
- 查询缓存命中、写入、过期、失效、重复结果和空查询策略；
- `cache=false` 时不读写缓存、不触发缓存事件，且 `cacheKey` 可省略；
- `cache=true` 时缺少 `cacheKey` 报错；
- 查询缓存和解析选项缓存的独立容量及 LRU；
- `sessionStorage` 恢复、不可用、损坏数据、写入失败和配额不足；
- 请求取消、竞态保护、组件销毁和 loading；
- 远程搜索错误、解析错误和重试；
- 缓存命名空间切换和缓存订阅释放；
- axios 取消上下文和取消错误识别；
- 全局注册、主题样式构建和 CSS 产物。

运行 RemoteSelect 专项测试：

```bash
./node_modules/.bin/cross-env CI_ENV=/dev/ BABEL_ENV=test \
./node_modules/.bin/karma start test/unit/karma.conf.js \
--single-run --client.mocha.grep=RemoteSelect
```

运行全部测试：

```bash
npm test
```

组件或缓存实现发生变化后，必须先通过 RemoteSelect 两组测试，再运行完整测试套件。所有需求完成后，完整测试必须通过。
