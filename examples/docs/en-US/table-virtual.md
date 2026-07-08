## TableVirtual

Virtual table for large datasets. `TableVirtual` reuses the `el-table-column` declaration style, but it does not render `table` related elements and does not depend on `position: sticky`. Fixed columns are rendered by separated synchronized layers.

### Basic Usage

Basic virtual table is used to display structured data. When `height` is not set, the table expands by `row-height` and row count.

:::demo After setting `data`, use `prop` and `label` on `el-table-column` to define columns.
```html
<template>
  <el-table-virtual
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }]
      };
    }
  };
</script>
```
:::

### Fixed Columns

Fixed columns are implemented with left and right overlay layers. They share the same visible rows with the main scroll area.

:::demo Use `fixed` or `fixed="right"` to fix columns.
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="320"
    row-key="id"
    :row-height="44"
    border
    style="width: 100%">
    <el-table-column fixed prop="id" label="ID" width="80"></el-table-column>
    <el-table-column prop="name" label="Name" width="160"></el-table-column>
    <el-table-column prop="city" label="City" width="160"></el-table-column>
    <el-table-column fixed="right" prop="status" label="Status" width="100"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 3000; i++) {
        data.push({
          id: i,
          name: 'User ' + i,
          city: i % 2 === 0 ? 'Shanghai' : 'Hangzhou',
          address: 'Long address ' + i + ' for horizontal scroll and tooltip',
          status: i % 3 === 0 ? 'Active' : 'Paused'
        });
      }
      return { tableData: data };
    }
  };
</script>
```
:::

### Custom Content

`TableVirtual` supports default scoped slots and header slots in `el-table-column`.

:::demo The scope contains `row`, `column` and `$index`.
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="260"
    row-key="id"
    :row-height="44"
    highlight-current-row
    @row-click="handleRowClick">
    <el-table-column prop="name" width="180">
      <template slot="header">Name / Index</template>
      <template slot-scope="scope">
        {{ scope.$index }} - {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column prop="score" label="Score" width="120"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        data.push({
          id: i,
          name: 'User ' + i,
          score: i,
          address: 'Address ' + i
        });
      }
      return {
        tableData: data
      };
    },

    methods: {
      handleRowClick(row) {
        this.$message('Clicked: ' + row.name);
      }
    }
  };
</script>
```
:::

### TableVirtual Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|---------|
| data | Table data | array | — | — |
| height | Table height, recommended | string/number | — | — |
| max-height | Table max height | string/number | — | — |
| row-height | Row height for virtual scrolling | number | — | 48 |
| overscan | Extra rows rendered outside the visible area | number | — | 6 |
| stripe | Whether Table is striped | boolean | — | false |
| border | Whether Table has vertical borders | boolean | — | false |
| size | Size of Table | string | medium / small / mini | — |
| fit | Whether columns fit the container | boolean | — | true |
| show-header | Whether Table header is visible | boolean | — | true |
| highlight-current-row | Whether current row is highlighted | boolean | — | false |
| current-row-key | Key of current row, a set only prop | string/number | — | — |
| row-key | Key of row data | string/function | — | — |
| empty-text | Empty text | string | — | No Data |
| tooltip-effect | Tooltip effect | string | dark / light | dark |
| default-sort | Default sort | object | — | — |
| row-class-name | Row class callback or string | function/string | — | — |
| row-style | Row style callback or object | function/object | — | — |
| cell-class-name | Cell class callback or string | function/string | — | — |
| cell-style | Cell style callback or object | function/object | — | — |
| header-row-class-name | Header row class callback or string | function/string | — | — |
| header-row-style | Header row style callback or object | function/object | — | — |
| header-cell-class-name | Header cell class callback or string | function/string | — | — |
| header-cell-style | Header cell style callback or object | function/object | — | — |

### TableVirtual Column Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|---------|
| prop | Field name, alias of `property` | string | — | — |
| label | Header label | string | — | — |
| width | Column width | string/number | — | — |
| min-width | Minimum column width | string/number | — | 80 |
| fixed | Fixed column | boolean/string | true / left / right | — |
| align | Alignment | string | left / center / right | left |
| header-align | Header alignment | string | left / center / right | — |
| class-name | Column class name | string | — | — |
| label-class-name | Header class name | string | — | — |
| formatter | Cell formatter | function(row, column, cellValue, index) | — | — |
| render-header | Header render function | function(h, scope) | — | — |
| sortable | Whether column is sortable | boolean | — | false |
| sort-method | Sort method | function(a, b) | — | — |
| sort-by | Sort field | string/function/array | — | — |
| sort-orders | Sort orders | array | ascending / descending / null | ['ascending', 'descending', null] |
| show-overflow-tooltip | Show tooltip when content overflows | boolean | — | false |

### TableVirtual Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| row-click | Triggers when clicking a row | row, column, event |
| row-dblclick | Triggers when double clicking a row | row, column, event |
| row-contextmenu | Triggers when right clicking a row | row, column, event |
| cell-click | Triggers when clicking a cell | row, column, cell, event |
| cell-dblclick | Triggers when double clicking a cell | row, column, cell, event |
| cell-mouse-enter | Triggers when hovering into a cell | row, column, cell, event |
| cell-mouse-leave | Triggers when hovering out of a cell | row, column, cell, event |
| header-click | Triggers when clicking a header cell | column, event |
| header-contextmenu | Triggers when right clicking a header cell | column, event |
| current-change | Triggers when current row changes | currentRow, oldCurrentRow |
| sort-change | Triggers when sorting changes | { column, prop, order } |
| scroll | Triggers when body scrolls | { scrollTop, scrollLeft } |

### TableVirtual Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| doLayout | Recalculate layout | — |
| scrollTo | Scroll to vertical position | scrollTop |
| setCurrentRow | Set current row | row |
| sort | Sort table manually | prop, order |
| clearSort | Clear sorting | — |

### TableVirtual Slots

| Name | Description |
|------|-------------|
| — | Default slot for `el-table-column` declarations |
| empty | Content displayed when data is empty |
| append | Content inserted after table content |

### TableVirtual Column Scoped Slot

| Name | Description |
|------|-------------|
| — | Custom column content. Scope is `{ row, column, $index }` |
| header | Custom header content. Scope is `{ column, $index }` |
