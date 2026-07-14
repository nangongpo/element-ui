## TableV2

Virtual table for large datasets. `TableV2` reuses the `el-table-column` declaration style, but it does not render `table` related elements and does not depend on `position: sticky`. Fixed columns are rendered by separated synchronized layers. When the dataset is large, set `height` to enable stable virtual rendering.

### Basic Usage

Basic virtual table is used to display structured data. Use `prop` and `label` on `el-table-column` to define columns.

:::demo
```html
<template>
  <el-table-v2
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }]
      };
    }
  };
</script>
```
:::

### Striped Table

`stripe` displays striped rows.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }] }; } };
</script>
```
:::

### Table With Border

`border` displays vertical borders.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }] }; } };
</script>
```
:::

### Table With Status

Use `row-class-name` to add status classes to rows.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    methods: {
      tableRowClassName({ rowIndex }) {
        if (rowIndex === 1) return 'warning-row';
        if (rowIndex === 3) return 'success-row';
        return '';
      }
    },
    data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }] }; }
  };
</script>
```
:::

### Fixed Header

Set `height` to fix the header and enable virtual scrolling.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i });
      }
      return { tableData };
    }
  };
</script>
```
:::

### Fixed Column

Set `fixed` or `fixed="right"` to fix columns.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150"></el-table-column>
    <el-table-column prop="name" label="Name" width="120"></el-table-column>
    <el-table-column prop="province" label="Province" width="120"></el-table-column>
    <el-table-column prop="city" label="City" width="120"></el-table-column>
    <el-table-column prop="address" label="Address" width="300"></el-table-column>
    <el-table-column fixed="right" prop="zip" label="Zip" width="120"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }] }; } };
</script>
```
:::

### Fixed Column and Header

Fixed columns and fixed header can be used together.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150"></el-table-column>
    <el-table-column prop="name" label="Name" width="120"></el-table-column>
    <el-table-column prop="province" label="Province" width="120"></el-table-column>
    <el-table-column prop="city" label="City" width="120"></el-table-column>
    <el-table-column prop="address" label="Address" width="300"></el-table-column>
    <el-table-column prop="zip" label="Zip" width="120"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }] }; } };
</script>
```
:::

### Current Row

Set `highlight-current-row` to highlight the current row. Use `setCurrentRow` to set it manually.

:::demo
```html
<template>
  <div>
    <el-table-v2 ref="singleTable" :data="tableData" height="250" row-key="id" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="date" label="Date" width="120"></el-table-column>
      <el-table-column property="name" label="Name" width="120"></el-table-column>
      <el-table-column property="address" label="Address"></el-table-column>
    </el-table-v2>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Set second row current</el-button>
      <el-button @click="setCurrent()">Clear current row</el-button>
    </div>
  </div>
</template>

<script>
  export default { data() { return { tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: 'Tom',
          province: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 200333
        }], currentRow: null }; }, methods: { setCurrent(row) { this.$refs.singleTable.setCurrentRow(row); }, handleCurrentChange(val) { this.currentRow = val; } } };
</script>
```
:::

### Multiple Selection

Add a column with `type="selection"` to enable multiple selection. You can use `toggleRowSelection` and `clearSelection` to control selected rows.

:::demo
```html
<template>
  <div>
    <el-table-v2 ref="multipleTable" :data="tableData" height="250" row-key="id" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="Date" width="120"><template slot-scope="scope">{{ scope.row.date }}</template></el-table-column>
      <el-table-column prop="name" label="Name" width="120"></el-table-column>
      <el-table-column prop="address" label="Address" show-overflow-tooltip></el-table-column>
    </el-table-v2>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">Toggle second and third rows</el-button>
      <el-button @click="toggleSelection()">Clear selection</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i });
      return { tableData, multipleSelection: [] };
    },
    methods: {
      toggleSelection(rows) { if (rows) rows.forEach(row => { this.$refs.multipleTable.toggleRowSelection(row); }); else this.$refs.multipleTable.clearSelection(); },
      handleSelectionChange(val) { this.multipleSelection = val; }
    }
  };
</script>
```
:::

### Sorting

Set `sortable` on a column to sort by that column. Use `default-sort` to set the initial sorting.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
    <el-table-column prop="date" label="Date" sortable width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="score" label="Score" sortable width="120"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', score: 1000 - i, address: 'Grove St ' + i }); return { tableData }; } };
</script>
```
:::

### Filter

Set `filters` and `filter-method` on a column to enable filtering. `filter-method` receives `value`, `row` and `column`.

:::demo
```html
<template>
  <div>
    <el-button @click="resetDateFilter">Clear date filter</el-button>
    <el-button @click="clearFilter">Clear all filters</el-button>
    <el-table-v2 ref="filterTable" :data="tableData" height="250" row-key="id" style="width: 100%">
      <el-table-column prop="date" label="Date" sortable width="180" column-key="date" :filters="dateFilters" :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address" :formatter="formatter"></el-table-column>
      <el-table-column prop="tag" label="Tag" width="100" :filters="[{ text: 'Home', value: 'Home' }, { text: 'Office', value: 'Office' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope"><el-tag :type="scope.row.tag === 'Home' ? 'primary' : 'success'" disable-transitions>{{ scope.row.tag }}</el-tag></template>
      </el-table-column>
    </el-table-v2>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) { const day = '2016-05-0' + ((i % 4) + 1); tableData.push({ id: i, date: day, name: 'Tom', address: 'Grove St ' + i, tag: i % 2 === 0 ? 'Home' : 'Office' }); }
      return { tableData, dateFilters: [{ text: '2016-05-01', value: '2016-05-01' }, { text: '2016-05-02', value: '2016-05-02' }, { text: '2016-05-03', value: '2016-05-03' }, { text: '2016-05-04', value: '2016-05-04' }] };
    },
    methods: { resetDateFilter() { this.$refs.filterTable.clearFilter('date'); }, clearFilter() { this.$refs.filterTable.clearFilter(); }, formatter(row) { return row.address; }, filterTag(value, row) { return row.tag === value; }, filterHandler(value, row, column) { const property = column['property']; return row[property] === value; } }
  };
</script>
```
:::

### Custom Column Template

Use scoped slots to access `row`, `column`, `$index` and `store`.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Date" width="180"><template slot-scope="scope"><i class="el-icon-time"></i><span style="margin-left: 10px">{{ scope.row.date }}</span></template></el-table-column>
    <el-table-column label="Name" width="180"><template slot-scope="scope"><el-popover trigger="hover" placement="top"><p>Name: {{ scope.row.name }}</p><p>Address: {{ scope.row.address }}</p><div slot="reference" class="name-wrapper" style="display: inline-block"><el-tag size="medium">{{ scope.row.name }}</el-tag></div></el-popover></template></el-table-column>
    <el-table-column label="Operations"><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button></template></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { return { tableData: [{ id: 1, date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 2, date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 3, date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 4, date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }] }; }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### Custom Header

Use the `header` scoped slot to customize header content.

:::demo
```html
<template>
  <el-table-v2 :data="filteredTableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Date" prop="date"></el-table-column>
    <el-table-column label="Name" prop="name"></el-table-column>
    <el-table-column align="right"><template slot="header" slot-scope="scope"><el-input v-model="search" size="mini" placeholder="Enter name keyword to search"/></template><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button></template></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom ' + i, address: 'Grove St ' + i }); return { tableData, search: '' }; }, computed: { filteredTableData() { const search = this.search && this.search.toLowerCase(); if (!search) return this.tableData; return this.tableData.filter(data => data.name.toLowerCase().indexOf(search) > -1); } }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### Custom Index

Pass the `index` prop to a `type="index"` column to customize index values. It can be a number or a function receiving the zero-based index.

:::demo
```html
<template>
  <el-table-v2 :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column type="index" :index="indexMethod"></el-table-column>
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Name" width="180"></el-table-column>
    <el-table-column prop="address" label="Address"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i }); return { tableData }; }, methods: { indexMethod(index) { return index * 2; } } };
</script>
```
:::

### Fluid Height

Example will be added after TableV2 supports this feature.

### Group Header

Example will be added after TableV2 supports this feature.

### Expand Row

Example will be added after TableV2 supports this feature.

### Tree Data and Lazy Loading

Example will be added after TableV2 supports this feature.

### Summary Row

Example will be added after TableV2 supports this feature.

### Rowspan and Colspan

Example will be added after TableV2 supports this feature.

### Big Data Rendering

When the dataset is very large, use `reloadData` to load data into the component's internal non-reactive data source and avoid observing the whole dataset with Vue reactivity. Sorting, filtering and selection methods can still be used. The following example loads big data with `reloadData` and controls table state with `sort`, `filter`, `toggleRowSelection` and `clearSelection`.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 10px">
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(10000)">Load 10000 rows</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(200000)">Load 200000 rows</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(1000000)">Load 1000000 rows</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="sortByScore">Sort score ascending</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="filterActive">Filter active status</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearFilter">Clear filters</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="toggleSelection">Select two active rows</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearSelection">Clear selection</el-button>
      </span>
    </div>
    <div style="margin-bottom: 12px">Selected {{ selectedCount }} rows</div>
    <el-table-v2
      ref="largeTable"
      height="250"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="Name" width="120"></el-table-column>
      <el-table-column prop="score" label="Score" sortable width="120"></el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        column-key="status"
        width="120"
        :filters="[{ text: 'Active', value: 'active' }, { text: 'Disabled', value: 'disabled' }]"
        :filter-method="filterStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" disable-transitions>
            {{ scope.row.status === 'active' ? 'Active' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Address" min-width="300" show-overflow-tooltip></el-table-column>
    </el-table-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedCount: 0
      };
    },
    mounted() {
      this.reloadLargeData(10000);
    },
    methods: {
      createData(count) {
        const data = [];
        for (let i = 0; i < count; i++) {
          data.push({
            id: i,
            name: 'User ' + i,
            score: count - i,
            status: i % 3 === 0 ? 'disabled' : 'active',
            address: 'No. ' + (1516 + i) + ', Grove St, Los Angeles'
          });
        }
        return data;
      },
      reloadLargeData(count) {
        this._largeData = this.createData(count);
        this.selectedCount = 0;
        this.$refs.largeTable.reloadData(this._largeData);
      },
      sortByScore() {
        this.$refs.largeTable.sort('score', 'ascending');
      },
      filterActive() {
        this.$refs.largeTable.filter('status', ['active']);
      },
      toggleSelection() {
        this.$refs.largeTable.toggleRowSelection(this._largeData[1], true);
        this.$refs.largeTable.toggleRowSelection(this._largeData[2], true);
      },
      clearSelection() {
        this.$refs.largeTable.clearSelection();
      },
      clearFilter() {
        this.$refs.largeTable.clearFilter();
      },
      filterStatus(value, row) {
        return row.status === value;
      },
      handleSelectionChange(val) {
        this._multipleSelection = val;
        this.selectedCount = val.length;
      }
    }
  };
</script>
```
:::

### TableV2 Attributes

| Attribute | Description | Type | Accepted Values | Default |
|---|---|---|---|---|
| data | Table data | array | — | — |
| height | Table height, recommended for large data | string/number | — | — |
| max-height | Table max height | string/number | — | — |
| row-height | Row height for virtual scrolling | number | — | 48 |
| overscan | Extra rows rendered outside the visible area | number | — | 6 |
| stripe | Whether Table is striped | boolean | — | false |
| border | Whether Table has vertical borders | boolean | — | false |
| size | Size of Table | string | medium / small / mini | — |
| fit | Whether columns fit the container | boolean | — | true |
| show-header | Whether Table header is visible | boolean | — | true |
| highlight-current-row | Whether current row is highlighted | boolean | — | false |
| current-row-key | Key of current row, a set-only prop | string/number | — | — |
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

### TableV2 Column Attributes

| Attribute | Description | Type | Accepted Values | Default |
|---|---|---|---|---|
| type | Column type | string | selection / index | — |
| index | Custom index for `type="index"` | number/function(index) | — | — |
| column-key | Column key, required for filter-change identification | string | — | — |
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
| show-overflow-tooltip | Show tooltip when content overflows | boolean | — | false |
| selectable | Whether row can be selected | function(row, index) | — | — |
| reserve-selection | Reserve selection after data refresh, requires `row-key` | boolean | — | false |
| sortable | Whether column is sortable | boolean/string | true / false / custom | false |
| sort-method | Sort method | function(a, b) | — | — |
| sort-by | Sort field | string/function/array | — | — |
| sort-orders | Sort orders | array | ascending / descending / null | ['ascending', 'descending', null] |
| filters | Filter options | array | — | — |
| filter-method | Filter method | function(value, row, column) | — | — |
| filter-multiple | Whether filters support multiple selection | boolean | — | true |
| filtered-value | Selected filter values | array | — | — |
| filter-placement | Filter panel placement | string | same as Tooltip placement | — |

### TableV2 Events

| Event Name | Description | Parameters |
|---|---|---|
| row-click | Triggers when clicking a row | row, column, event |
| row-dblclick | Triggers when double clicking a row | row, column, event |
| row-contextmenu | Triggers when right clicking a row | row, column, event |
| cell-click | Triggers when clicking a cell | row, column, cell, event |
| cell-dblclick | Triggers when double clicking a cell | row, column, cell, event |
| cell-contextmenu | Triggers when right clicking a cell | row, column, cell, event |
| cell-mouse-enter | Triggers when hovering into a cell | row, column, cell, event |
| cell-mouse-leave | Triggers when hovering out of a cell | row, column, cell, event |
| header-click | Triggers when clicking a header cell | column, event |
| header-contextmenu | Triggers when right clicking a header cell | column, event |
| current-change | Triggers when current row changes | currentRow, oldCurrentRow |
| sort-change | Triggers when sorting changes | { column, prop, order } |
| select | Triggers when user changes selection of a row | selection, row |
| select-all | Triggers when user clicks select-all checkbox | selection |
| selection-change | Triggers when selection changes | selection |
| filter-change | Triggers when filters change | filters |
| scroll | Triggers when body scrolls | { scrollTop, scrollLeft } |

### TableV2 Methods

| Method | Description | Parameters |
|---|---|---|
| doLayout | Recalculate layout | — |
| scrollTo | Scroll to vertical position | scrollTop |
| reloadData | Reload data through an internal non-reactive data source, useful for very large datasets | data |
| setCurrentRow | Set current row | row |
| clearSelection | Clear selection | — |
| toggleRowSelection | Toggle or set selection state of a row | row, selected |
| toggleAllSelection | Toggle all selectable rows | — |
| sort | Sort table manually | prop, order |
| clearSort | Clear sorting | — |
| filter | Set filter values for a column | columnKey, values |
| clearFilter | Clear filters | columnKeys |

### TableV2 Slots

| Name | Description |
|---|---|
| — | Default slot for `el-table-column` declarations |
| empty | Content displayed when data is empty |
| append | Content inserted after table content |

### TableV2 Column Scoped Slot

| Name | Description |
|---|---|
| — | Custom column content. Scope is `{ row, column, $index, store }` |
| header | Custom header content. Scope is `{ column, $index }` |
