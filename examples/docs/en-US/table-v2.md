## Virtualized Table

Table V2 uses `virtual-list` to render large datasets. These examples follow the Element Plus Table V2 feature organization and are written with the Vue 2 Options API. The legacy `el-table-column` child syntax is not supported; use the `columns` and `data` props.

### Basic usage

The following example renders 10 columns and 1000 rows.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() {
    const columns = Array.from({ length: 10 }, (_, index) => ({ key: 'column-' + index, dataKey: 'column-' + index, title: 'Column ' + index, width: 150 }));
    const data = Array.from({ length: 1000 }, (_, rowIndex) => {
      const row = { id: 'row-' + rowIndex };
      columns.forEach((column, columnIndex) => { row[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex; });
      return row;
    });
    return { columns, data };
  }
};
</script>
```
:::

### Auto-sized container

This repository does not include Element Plus `el-auto-resizer`. This Vue 2 example measures a fixed-height container and passes its size to Table V2.

:::demo
```html
<template><div ref="container" style="height: 400px"><el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed /></div></template>
<script>
export default {
  data() { return { width: 700, height: 400, columns: this.createColumns(), data: this.createData() }; },
  mounted() { this.updateSize(); window.addEventListener('resize', this.updateSize); },
  beforeDestroy() { window.removeEventListener('resize', this.updateSize); },
  methods: {
    createColumns() { return Array.from({ length: 10 }, (_, index) => ({ key: 'c' + index, dataKey: 'c' + index, title: 'Column ' + index, width: 150 })); },
    createData() { return Array.from({ length: 200 }, (_, id) => ({ id, c0: 'Row ' + id + ' - Col 0', c1: 'Row ' + id + ' - Col 1' })); },
    updateSize() { this.width = this.$refs.container.clientWidth; this.height = this.$refs.container.clientHeight; }
  }
};
</script>
```
:::

### Customize cell renderer

Use the `cell` scoped slot, or `cellRenderer` on a column. This example uses Vue 2 scoped-slot syntax for operation buttons.

:::demo
```html
<template>
  <el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed>
    <template slot="cell" slot-scope="scope"><span v-if="scope.column.key === 'operation'"><el-button size="mini" @click="edit(scope.rowData)">Edit</el-button><el-button size="mini" type="danger" @click="remove(scope.rowData)">Delete</el-button></span><span v-else>{{ scope.cellData }}</span></template>
  </el-table-v2>
</template>
<script>
export default {
  data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Name', width: 180 }, { key: 'date', dataKey: 'date', title: 'Date', width: 180 }, { key: 'operation', title: 'Operations', width: 220 }], data: Array.from({ length: 20 }, (_, id) => ({ id, name: 'Tom', date: '2020/10/01' })) }; },
  methods: { edit(row) { this.$message('Edit ' + row.name); }, remove(row) { this.$message('Delete ' + row.name); } }
};
</script>
```
:::

### Table with selections

Use the `cell` and `header-cell` slots to implement row selection.

:::demo
```html
<template>
  <el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed>
    <template slot="header-cell" slot-scope="scope"><el-checkbox v-if="scope.column.key === 'selection'" :value="allSelected" :indeterminate="someSelected" @change="toggleAll" /><span v-else>{{ scope.column.title }}</span></template>
    <template slot="cell" slot-scope="scope"><el-checkbox v-if="scope.column.key === 'selection'" v-model="scope.rowData.checked" /><span v-else>{{ scope.cellData }}</span></template>
  </el-table-v2>
</template>
<script>
export default {
  data() { return { columns: [{ key: 'selection', title: '', width: 50, fixed: 'left' }, { key: 'name', dataKey: 'name', title: 'Name', width: 180 }, { key: 'address', dataKey: 'address', title: 'Address', width: 360 }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', address: 'Shanghai, Jinshajiang Road 1518', checked: false })) }; },
  computed: { allSelected() { return this.data.length > 0 && this.data.every(row => row.checked); }, someSelected() { return this.data.some(row => row.checked) && !this.allSelected; } },
  methods: { toggleAll(value) { this.data.forEach(row => { row.checked = value; }); } }
};
</script>
```
:::

### Inline editing

An `el-input` can be placed in the cell slot to edit `rowData` directly.

### Table with status and cross hovering

Use `row-class` to apply status classes. The hover row state is shared by the main table and fixed columns.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" :row-class="rowClass" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 120, fixed: 'left' }, { key: 'name', dataKey: 'name', title: 'Name', width: 220 }, { key: 'status', dataKey: 'status', title: 'Status', width: 180 }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', status: id % 10 === 0 ? 'success' : 'normal' })) }; },
  methods: { rowClass({ rowData }) { return rowData.status === 'success' ? 'table-row-success' : ''; } }
};
</script>
```
:::

### Sticky rows

`fixed-data` renders rows below the header while the main content remains virtualized.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :fixed-data="fixedData" :width="700" :height="400" fixed @scroll="onScroll" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 150 }, { key: 'name', dataKey: 'name', title: 'Name', width: 180 }, { key: 'address', dataKey: 'address', title: 'Address', width: 360 }], fixedData: [{ id: 'fixed', name: 'Sticky row', address: 'Remains below the header' }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', address: 'Row ' + id })) }; },
  methods: { onScroll(value) { this.lastScroll = value; } }
};
</script>
```
:::

### Fixed columns

Column `fixed` supports `true`, `left`, and `right`. Fixed columns use independent virtual lists and synchronize vertical scrolling with the main table.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 100, fixed: 'left' }, { key: 'name', dataKey: 'name', title: 'Name', width: 180 }, { key: 'address', dataKey: 'address', title: 'Address', width: 360 }, { key: 'operation', title: 'Operations', width: 120, fixed: 'right' }], data: Array.from({ length: 500 }, (_, id) => ({ id, name: 'Tom', address: 'Shanghai, Jinshajiang Road 1518' })) }; }
};
</script>
```
:::

### Grouping header

Use `children` to configure multi-level headers.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'user', title: 'User', children: [{ key: 'name', dataKey: 'name', title: 'Name', width: 150 }, { key: 'age', dataKey: 'age', title: 'Age', width: 100 }] }, { key: 'contact', title: 'Contact', children: [{ key: 'phone', dataKey: 'phone', title: 'Phone', width: 180 }, { key: 'email', dataKey: 'email', title: 'Email', width: 220 }] }], data: [{ id: 1, name: 'Tom', age: 28, phone: '13800000000', email: 'tom@example.com' }] }; }
};
</script>
```
:::

### Filter and sortable

Use a header slot for filters; sortable columns emit `column-sort`, allowing the parent to update the data and `sort-by` state.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" :sort-by="sortBy" @column-sort="sort" /></template>
<script>
export default {
  data() { return { sortBy: {}, columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 150, sortable: true }, { key: 'name', dataKey: 'name', title: 'Name', width: 200, sortable: true }], data: Array.from({ length: 100 }, (_, id) => ({ id, name: 'Name ' + (100 - id) })) }; },
  methods: { sort({ key, order }) { this.sortBy = { key, order }; this.data.sort((a, b) => order === 'asc' ? a[key] - b[key] : b[key] - a[key]); } }
};
</script>
```
:::

### Controlled sort

For multiple sortable columns, pass `sort-state` as controlled state and update it from `column-sort`.

:::demo
```html
<el-table-v2 :columns="columns" :data="data" :sort-state="sortState" @column-sort="onSort" :width="700" :height="400" />
<script>
export default { data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Name', width: 240 }, { key: 'age', dataKey: 'age', title: 'Age', width: 160 }], data: [{ id: 1, name: 'Tom', age: 28 }], sortState: {} }; }, methods: { onSort(value) { this.sortState = { [value.key]: value.order }; } } };
</script>
```
:::

### Colspan, rowspan and combined spans

The virtualized table is not a native `table` element. Return a `span` configuration from `cell-props` for merged cells; use the `row` slot for more complex row layouts.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :cell-props="cellProps" :width="700" :height="400" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'a', dataKey: 'a', title: 'A', width: 200 }, { key: 'b', dataKey: 'b', title: 'B', width: 200 }, { key: 'c', dataKey: 'c', title: 'C', width: 200 }], data: Array.from({ length: 20 }, (_, id) => ({ id, a: 'A-' + id, b: 'B-' + id, c: 'C-' + id })) }; },
  methods: { cellProps({ rowIndex, columnIndex }) { return rowIndex === 0 && columnIndex === 0 ? { span: { colSpan: 2 } } : {}; } }
};
</script>
```
:::

### Tree data and lazy loading

The `children` property represents nested rows and `expand-column-key` selects the column with the expand icon. Lazy children can be requested in `row-expand` and assigned to `children`.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" expand-column-key="name" :default-expanded-row-keys="[1]" :width="700" :height="400" @row-expand="onExpand" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Name', width: 260 }, { key: 'value', dataKey: 'value', title: 'Value', width: 200 }], data: [{ id: 1, name: 'Node 1', value: 'root', children: [{ id: 2, name: 'Node 1-1', value: 'child' }] }, { id: 3, name: 'Node 2', value: 'lazy', hasChildren: true }] }; },
  methods: { onExpand({ expanded, rowData }) { if (expanded && rowData.hasChildren && !rowData.children) this.$set(rowData, 'children', [{ id: rowData.id + '-1', name: 'Loaded child', value: 'loaded' }]); } }
};
</script>
```
:::

### Dynamic height rows

Pass `estimated-row-height` to enable dynamic row heights. Each rendered row is measured by the virtual list.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :estimated-row-height="50" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Name', width: 150 }, { key: 'description', dataKey: 'description', title: 'Description', width: 500 }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', description: id % 3 === 0 ? 'This is a longer description used to demonstrate dynamic row height. '.repeat(3) : 'Short text.' })) }; }
};
</script>
```
:::

### Detail view

Dynamic-height rendering can also be used for detail content. Use the `row` slot to add a detail area; its content participates in row measurement.

### Customized footer, empty renderer and overlay

Use the `footer`, `empty`, and `overlay` slots. `footer-height` participates in the table height calculation.

:::demo
```html
<el-table-v2 :columns="columns" :data="data" :width="700" :height="400" :footer-height="50">
  <div slot="footer" class="table-v2-footer">{{ data.length }} rows</div>
  <el-empty slot="empty" description="No data" />
  <div slot="overlay" class="table-v2-overlay">Loading...</div>
</el-table-v2>
<script>
export default { data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 180 }], data: [] }; } };
</script>
```
:::

### Manual scrolling

Call `scrollTo`, `scrollToLeft`, `scrollToTop`, and `scrollToRow` through a component ref.

:::demo
```html
<template><div><el-button @click="scroll">Scroll to row 100</el-button><el-table-v2 ref="table" :columns="columns" :data="data" :width="700" :height="400" /></div></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 150 }, { key: 'name', dataKey: 'name', title: 'Name', width: 300 }], data: Array.from({ length: 1000 }, (_, id) => ({ id, name: 'Tom ' + id })) }; },
  methods: { scroll() { this.$refs.table.scrollToRow(100, 'center'); } }
};
</script>
```
:::

## TableV2 API

### TableV2 Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| cache | Number of rows rendered in advance to boost performance | `number` | 2 |
| estimated-row-height | Estimated row height for dynamic height rows | `number` | — |
| header-class | Custom class passed to the header wrapper | `string` / Function | — |
| header-props | Custom props passed to the header component | `object` / Function | — |
| header-cell-props | Custom props passed to the header cell component | `object` / Function | — |
| header-height | Header height; an array renders the same number of header rows | `number` / `number[]` | 50 |
| footer-height | Footer height included in the table height calculation | `number` | 0 |
| row-class | Custom class passed to the row wrapper | `string` / Function | — |
| row-key | Row key; the row index is used when it is not provided | `string` / `Symbol` / `number` | id |
| row-props | Custom props passed to the row component | `object` / Function | — |
| row-height | Row height used to calculate the total table height | `number` | 50 |
| row-event-handlers | Collection of handlers attached to each row | `object` | — |
| cell-props | Extra props passed to each cell except header cells | `object` / Function | — |
| columns | Array of column definitions | `Column[]` | — |
| data | Array of data rendered in the table | `Data[]` | [] |
| data-getter | Custom method for fetching data from the data source | Function | — |
| fixed-data | Data rendered above the main content and below the header | `object` | — |
| expand-column-key | Column key that indicates expandable rows | `string` | — |
| expanded-row-keys | Keys of expanded rows; can be used with `v-model` | `KeyType[]` | — |
| default-expanded-row-keys | Keys of default expanded rows; non-reactive | `KeyType[]` | — |
| class | Class applied to the left, right, and main tables | `string` / `array` / `object` | — |
| fixed | Whether column widths are fixed or flexible | `boolean` | false |
| width | Table width, required | `number` | — |
| height | Table height, required | `number` | — |
| max-height | Maximum table height | `number` | — |
| indent-size | Horizontal indentation of the tree table | `number` | 12 |
| h-scrollbar-size | Horizontal scrollbar size | `number` | 6 |
| v-scrollbar-size | Vertical scrollbar size | `number` | 6 |
| scrollbar-always-on | Whether the scrollbar is always shown | `boolean` | false |
| sort-by | Sort indicator | `object` | {} |
| sort-state | Multiple sort indicator | `object` | undefined |

### TableV2 Slots

| Name | Type |
| --- | --- |
| cell | `CellSlotProps` |
| header | `HeaderSlotProps` |
| header-cell | `HeaderCellSlotProps` |
| row | `RowSlotProps` |
| footer | — |
| empty | — |
| overlay | — |

### TableV2 Events

| Name | Description | Parameters |
| --- | --- | --- |
| column-sort | Invoked when a column is sorted | `ColumnSortParam` |
| expanded-rows-change | Invoked when expanded rows change | `KeyType[]` |
| end-reached | Invoked when the end of the table is reached | `Function(remainDistance)` |
| scroll | Invoked after scrolling | `ScrollParams` |
| rows-rendered | Invoked when rows are rendered | `RowsRenderedParams` |
| row-expand | Invoked when a tree node is expanded or collapsed | `RowExpandParams` |

### TableV2 Exposes

| Method | Description | Parameters |
| --- | --- | --- |
| scrollTo | Scroll to a given position | `{ scrollLeft?: number, scrollTop?: number }` |
| scrollToLeft | Scroll to a given horizontal position | `scrollLeft: number` |
| scrollToTop | Scroll to a given vertical position | `scrollTop: number` |
| scrollToRow | Scroll to a row with a specified strategy | `row: number, strategy?: 'auto' \| 'center' \| 'end' \| 'start' \| 'smart'` |

Note that these are JavaScript objects, so kebab-case cannot be used for instance methods.

### Column Attribute

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| align | Alignment of table cell content | `left` / `center` / `right` | left |
| class | Class name for the column | `string` | — |
| key | Unique identification | `KeyType` | — |
| dataKey | Unique identification of data | `KeyType` | — |
| fixed | Fixed direction of the column | `boolean` / `left` / `right` | false |
| flexGrow | CSS flex grow for non-fixed tables | `number` | 0 |
| flexShrink | CSS flex shrink for non-fixed tables | `number` | 1 |
| headerClass | Header column class | `string` | — |
| hidden | Whether the column is invisible | `boolean` | — |
| style | Custom column cell style merged with the grid cell | `object` | — |
| sortable | Whether the column is sortable | `boolean` | — |
| title | Default text rendered in the header cell | `string` | — |
| maxWidth | Maximum column width | `number` | — |
| minWidth | Minimum column width | `number` | — |
| width | Column width, required | `number` | — |
| cellRenderer | Custom cell renderer | `VueComponent` / Function | — |
| headerCellRenderer | Custom header renderer | `VueComponent` / Function | — |

### FAQs

#### How do I render a list with a checkbox in the first column?

You can define your own cell renderer as shown in the Customize Cell Renderer example and maintain the selection state yourself.

#### Why does the virtualized table provide fewer features than TableV1?

Virtualized Table intentionally provides a smaller feature set so users can implement only what their business needs. Integrating too many features makes the component harder to maintain, while the basic features are enough for most users.

> This repository does not include `el-auto-resizer`, so the auto-sized example uses a Vue 2 `resize` listener.
