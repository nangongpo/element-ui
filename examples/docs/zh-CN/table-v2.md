## 虚拟化表格 ^(beta)

在前端开发领域，表格一直都是一个高频出现的组件，尤其是在中后台和数据分析场景。但是，对于 Table V1 来说，当一屏里超过 1000 条数据记录时，就会出现卡顿等性能问题，体验不是很好。

通过虚拟化表格组件，超大数据渲染将不再是一个头疼的问题。

:::tip

该组件仍在测试中，生产环境使用可能有风险。若您发现了 bug 或问题，请于 GitHub 报告给我们以便修复。同时，有一些 API 并未在此文档中提及，因为部分还没有开发完全，因此我们不在此提及。

即使虚拟化表格是高效的，但是当数据负载过大时，网络和内存容量也会成为应用的瓶颈。因此请牢记，虚拟化表格永远不是最完美的解决方案，请考虑数据分页、过滤器等优化方案。

:::

### 基础用法

让我们演示虚拟化表的性能，用10列和1 000行渲染一个基本示例。

:::demo table-v2/basic
:::

### 自动调整大小

如果不想手动向表格传递 `width` 和 `height` 属性，可以使用 `AutoResizer` 对表格组件进行封装。这会自动为你更新宽度和高度。

尝试调整您的浏览器大小来看看它是如何工作的。

:::tip

由于 `AutoResizer` 组件的默认高度是 100%，所以请确保该组件的父元素拥有固定的高度值。或者，您可以通过将 `style` 属性传递到 `AutoResizer` 来定义它。

:::

:::demo table-v2/auto-resizer
:::

### 自定义单元格渲染器

当然，您可以根据您的需要呈现表格单元格。这是如何自定义您的单元格的简单例子。

:::demo table-v2/custom-renderer
:::

### 带有选择的表格

使用自定义的单元格渲染来给表格组件添加选择的能力。

:::demo table-v2/selection
:::

### 可编辑单元格

类似上面添加选择框的方法，我们可以用同样的方法实现可编辑单元格。

:::demo table-v2/inline-editing
:::

### 带状态的表格

可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。

要自定义行的外观，请使用 `row-class-name` 属性。举个例子，每10行会自动添加 `bg-blue-200` 类名，每5行会添加 `bg-red-100` 类名。

:::demo table-v2/row-class
:::

### 表格行的粘性布局

你可以使用 `fixed-data` 属性将某些行固定到表格顶部。也可以根据滚动事件动态设置固定行。

:::demo table-v2/sticky-rows
:::

### 固定列表格

如果您想要有列粘贴左侧或右侧的某种原因。您可以通过向表中添加特殊属性来实现这一点。

您可以设置该列的 `fixed` 属性为 `true`（代表左侧）、`left` 或 `right`。

:::demo table-v2/fixed-columns
:::

### 表头分组

通过自定义表头渲染器可以实现多级表头。

:::demo table-v2/grouping-header
:::

### 过滤器

虚拟化表格提供自定义表头渲染器，可以利用它们渲染过滤器。

:::demo table-v2/filter
:::

### 可排序表格

您可以使用排序状态来对表格进行排序。

:::demo table-v2/sort
:::

### 受控的排序

您可以在需要时定义多个可排序的列。请记住，当您在定义了多个可排序的列时，UI 可能会显得有些奇怪，因为用户不知道哪一列被排序。

:::demo table-v2/controlled-sort
:::

### 高亮显示鼠标悬停单元格

当处理一个大的列表时，很容易丢失当前行的轨迹和您正在访问的一列。在这种情况下，使用这个功能可能很有帮助。

:::demo table-v2/cross-hovering
:::

### 横跨列

虚拟化表格不使用内置的 `table` 元素，因此 `colspan` 和 `rowspan` 与 Table V1 的行为略有不同。不过，通过自定义行渲染器仍然可以实现这些功能。

:::demo table-v2/colspan
:::

### 纵跨行

横跨列之后，还可以实现纵跨行。它与横跨列略有不同，但基本思路相同。

:::demo table-v2/rowspan
:::

### 同时跨行和跨列

可以组合 `rowSpan` 和 `colSpan` 来满足业务需求。

:::demo table-v2/spans
:::

### 树形数据

虚拟化表格也可以渲染树形数据。点击箭头图标即可展开或折叠树节点。

:::demo table-v2/tree-data
:::

### 动态高度行

虚拟化表格可以渲染动态高度的行。如果无法确定内容尺寸，可以使用此功能让行高根据内容自动调整。传入 `estimated-row-height` 属性即可启用动态行高，预估高度越接近实际高度，渲染越流畅。

:::demo table-v2/dynamic-height
:::

### 可展开的附加信息

使用动态高度渲染，您也可以在表格中显示详细的视图。

:::demo table-v2/detailed-view
:::

### 自定义页脚

需要显示总结信息时，可以渲染自定义页脚。

:::demo table-v2/footer
:::

### 自定义空元素渲染器

需要显示自定义空内容时，可以使用 `empty` 插槽。

:::demo table-v2/empty
:::

### 浮动遮罩层

需要显示加载状态或其他内容时，可以使用 `overlay` 插槽在表格上方渲染遮罩层。

:::demo table-v2/overlay
:::

### 手动滚动

使用 Table V2 暴露的方法可以进行手动或编程式的滚动到指定的偏移量或者行。

:::tip

`scrollToRow` 的第二个参数代表滚动策略，计算了要滚动的位置，其默认值是 `auto`。如果你想要滚动到某个特定位置，你可以自己定义策略。可用的选项是 `"auto" | "center" | "end" | "start" | "smart"`。

`smart` 和 `auto` 之间的区别是，`auto` 是 `smart` 滚动策略的子集。

:::

:::demo table-v2/manual-scroll
:::

## TableV2 API

### TableV2 Attributes

| 属性名                    | 描述说明                                                           | 类型                           | 默认值    |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------ | --------- |
| cache                     | 为了更好的渲染效果预先多加载的行数                                 | `number`                       | 2         |
| estimated-row-height      | 渲染动态的单元格的预估高度                                         | `number`                       | —         |
| header-class              | header 部分的自定义 class 名                                       | `string` / Function            | —         |
| header-props              | header 部分的自定义 props 名                                       | `object` / Function            | —         |
| header-cell-props         | header cell 部分的自定义 props 名                                  | `object` / Function            | —         |
| header-height             | Header 的高度由 `height` 设置。传入数组时，header row 等于数组长度 | `number` / `number[]`          | 50        |
| footer-height             | Footer 部分的高度，传入值时会计算入 table 的高度                   | `number`                       | 0         |
| row-class                 | row wrapper 部分的自定义 class 名                                  | `string` / Function            | —         |
| row-key                   | 每行的 key 值，不提供时使用行索引                                  | `string` / `Symbol` / `number` | id        |
| row-props                 | row component 部分的自定义 props                                   | `object` / Function            | —         |
| row-height                | 每行的高度，用于计算表格的总高度                                   | `number`                       | 50        |
| row-event-handlers        | 添加到每行的一系列事件处理器                                       | `object`                       | —         |
| cell-props                | 每个单元格的自定义 props（header cell 除外）                       | `object` / Function            | —         |
| columns                   | 列 column 的配置数组                                               | `Column[]`                     | —         |
| data                      | 要在表中渲染的数据数组                                             | `Data[]`                       | []        |
| data-getter               | 从数据源获取数据的自定义方法                                       | Function                       | —         |
| fixed-data                | 渲染在表格主内容上方、header 下方区域的数据                        | `Data[]`                       | —         |
| expand-column-key         | 标记可展开行的列 key                                               | `string`                       | —         |
| expanded-row-keys         | 存放行展开状态 key 的数组，可以和 `v-model` 搭配使用               | `KeyType[]`                    | —         |
| default-expanded-row-keys | 默认展开行的 key 数组，数据不是响应式的                            | `KeyType[]`                    | —         |
| class                     | 表格类名，应用于左、右、主三个表格                                 | `string` / `array` / `object`  | —         |
| fixed                     | 单元格宽度是自适应还是固定                                         | `boolean`                      | false     |
| width                     | 表格宽度，必填                                                     | `number`                       | —         |
| height                    | 表格高度，必填                                                     | `number`                       | —         |
| max-height                | 表格最大高度                                                       | `number`                       | —         |
| indent-size               | 树形表的水平缩进                                                   | `number`                       | 12        |
| h-scrollbar-size          | 水平滚动条大小，防止水平和垂直滚动条重叠                           | `number`                       | 6         |
| v-scrollbar-size          | 垂直滚动条大小，防止水平和垂直滚动条重叠                           | `number`                       | 6         |
| scrollbar-always-on       | 是否始终显示滚动条                                                 | `boolean`                      | false     |
| sort-by                   | 排序方式                                                           | `object`                       | {}        |
| sort-state                | 多个排序状态                                                       | `object`                       | undefined |

### TableV2 Slots

| 插槽名      | 作用域参数            |
| ----------- | --------------------- |
| cell        | `CellSlotProps`       |
| header      | `HeaderSlotProps`     |
| header-cell | `HeaderCellSlotProps` |
| row         | `RowSlotProps`        |
| footer      | —                     |
| empty       | —                     |
| overlay     | —                     |

### TableV2 Events

| 事件名               | 描述                                 | 参数                       |
| -------------------- | ------------------------------------ | -------------------------- |
| column-sort          | 列排序时调用                         | `ColumnSortParam`          |
| expanded-rows-change | 行展开状态改变时触发                 | `KeyType[]`                |
| end-reached          | 到达表格末尾时触发，回调包含剩余距离 | `Function(remainDistance)` |
| scroll               | 表格被用户滚动后触发                 | `ScrollParams`             |
| rows-rendered        | 行被渲染后触发                       | `RowsRenderedParams`       |
| row-expand           | 点击箭头图标展开或折叠树节点时触发   | `RowExpandParams`          |

### TableV2 Exposes

| 方法         | 描述                         | 参数                                                                        |
| ------------ | ---------------------------- | --------------------------------------------------------------------------- |
| scrollTo     | 滚动到给定位置               | `{ scrollLeft?: number, scrollTop?: number }`                               |
| scrollToLeft | 滚动到给定水平位置           | `scrollLeft: number`                                                        |
| scrollToTop  | 滚动到给定垂直位置           | `scrollTop: number`                                                         |
| scrollToRow  | 使用给定滚动策略滚动至指定行 | `row: number, strategy?: 'auto' \| 'center' \| 'end' \| 'start' \| 'smart'` |

请注意：这些是 JavaScript 对象，不能使用短横线命名法（kebab-case）调用实例方法。

### Column Attribute

| 属性名             | 描述                                   | 类型                         | 默认值 |
| ------------------ | -------------------------------------- | ---------------------------- | ------ |
| align              | 表格单元格内容对齐方式                 | `left` / `center` / `right`  | left   |
| class              | 列的类名                               | `string`                     | —      |
| key                | 唯一标志                               | `KeyType`                    | —      |
| dataKey            | data 的唯一标志符                      | `KeyType`                    | —      |
| fixed              | 固定列位置                             | `boolean` / `left` / `right` | false  |
| flexGrow           | CSS flex grow，非固定表时生效          | `number`                     | 0      |
| flexShrink         | CSS flex shrink，非固定表时生效        | `number`                     | 1      |
| headerClass        | 自定义 header 头部类名                 | `string`                     | —      |
| hidden             | 此列是否不可见                         | `boolean`                    | —      |
| style              | 自定义列单元格样式，与 grid 单元格合并 | `object`                     | —      |
| sortable           | 是否可排序                             | `boolean`                    | —      |
| title              | header 单元格中的默认文本              | `string`                     | —      |
| maxWidth           | 列最大宽度                             | `number`                     | —      |
| minWidth           | 列最小宽度                             | `number`                     | —      |
| width              | 列宽度，必填                           | `number`                     | —      |
| cellRenderer       | 自定义单元格渲染器                     | `VueComponent` / Function    | —      |
| headerCellRenderer | 自定义头部渲染器                       | `VueComponent` / Function    | —      |

### 类型说明

以下类型用于说明回调函数和插槽参数。Vue 2 示例使用普通 JavaScript 对象，不需要额外安装 TypeScript。

| 类型 | 说明 |
| ---- | ---- |
| `KeyType` | `string` / `number` / `symbol`，用于行和列的唯一标识 |
| `Data` | 任意对象，可选包含 `children` 数组表示树形子节点 |
| `FixedData` | 与 `Data` 相同，用于固定行数据 |
| `SortOrder` | `'asc'` 或 `'desc'` |
| `SortBy` | `{ key: KeyType, order: SortOrder }` |
| `ColumnSortParam` | `{ column, key, order }` |
| `RowsRenderedParams` | `{ rowCacheStart, rowCacheEnd, rowVisibleStart, rowVisibleEnd }` |
| `ScrollParams` | `{ xAxisScrollDir, scrollLeft, yAxisScrollDir, scrollTop }` |

### 回调参数

| 回调 | 参数 |
| ---- | ---- |
| `rowClass` | `{ columns, rowData, rowIndex }` |
| `rowProps` | `{ columns, rowData, rowIndex }` |
| `cellProps` | `{ column, columns, columnIndex, cellData, rowData, rowIndex }` |
| `dataGetter` | `{ columns, column, columnIndex, rowData, rowIndex }` |
| `headerClass` | `{ columns, headerIndex }` |
| `headerProps` | `{ columns, headerIndex }` |
| `headerCellProps` | `{ column, columns, columnIndex, headerIndex, style }` |

### 插槽参数

| 插槽 | 参数 |
| ---- | ---- |
| `cell` | `{ column, columns, columnIndex, depth, style, rowData, rowIndex, isScrolling }` |
| `header` | `{ cells, columns, headerIndex }` |
| `header-cell` | `{ column, columns, columnIndex, headerIndex, style, sortBy }` |
| `row` | `{ columns, rowData, rowIndex, data, key, isScrolling, style }` |

### FAQ

#### 如何在第一列中渲染带复选框的列表？

由于可以自己定义单元格渲染器，可以参考“自定义单元格渲染”示例渲染 `checkbox`，并自行管理其状态。

#### 为什么虚拟化表提供的功能较 TableV1 少？

对于虚拟化表格，我们打算减少一些功能，让用户根据需求自行实现。整合过多功能会让组件代码变得难以维护，对于大多数用户来说基础功能已经足够。一些主要功能尚未开发完成。

> 如果项目没有全局注册 `ElAutoResizer`，可以使用“自动调整大小”示例中的 Vue 2 `resize` 监听方式作为替代。
