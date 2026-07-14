## TableV2 虚拟表格

用于大数据列表展示的虚拟表格。`TableV2` 复用 `el-table-column` 的声明方式，但内部不使用 `table` 相关标签，也不依赖 `position: sticky`；固定列通过独立覆盖层同步渲染。

### 基础用法

基础虚拟表格用于展示结构化数据。不设置 `height` 时，表格会按照 `row-height` 和数据行数撑开。

:::demo 设置 `data` 后，可以通过 `el-table-column` 的 `prop` 和 `label` 定义列。
```html
<template>
  <el-table-v2
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    }
  };
</script>
```
:::

### 带斑马纹表格

使用带斑马纹的虚拟表格，可以更容易区分出不同行的数据。

:::demo `stripe`属性可以创建带斑马纹的虚拟表格。
```html
<template>
  <el-table-v2
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    }
  };
</script>
```
:::

### 带边框表格

:::demo 默认情况下，TableV2 组件不具有竖直方向的边框，如果需要，可以使用`border`属性。
```html
<template>
  <el-table-v2
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    }
  };
</script>
```
:::

### 带状态表格

可将虚拟表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。

:::demo 可以通过指定 TableV2 组件的 `row-class-name` 属性来为某一行添加 class。
```html
<template>
  <el-table-v2
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<style>
  .el-table-v2 .warning-row {
    background: oldlace;
  }

  .el-table-v2 .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  export default {
    methods: {
      tableRowClassName({ rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    },
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    }
  };
</script>
```
:::

### 固定表头

纵向内容过多时，可选择固定表头。

:::demo 在`el-table-v2`元素中定义了`height`属性，即可实现固定表头。
```html
<template>
  <el-table-v2
    :data="tableData"
    height="250"
    row-key="id"
    border
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return { tableData };
    }
  };
</script>
```
:::

### 固定列

横向内容过多时，可选择固定列。TableV2 固定列不使用 sticky，而是渲染左、右固定层，并与主滚动区域共享同一批可视行。

:::demo 固定列需要使用`fixed`属性，它接受 Boolean 值或者`left` `right`。
```html
<template>
  <el-table-v2
    :data="tableData"
    height="250"
    row-key="id"
    border
    style="width: 100%">
    <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
    <el-table-column prop="province" label="省份" width="120"></el-table-column>
    <el-table-column prop="city" label="市区" width="120"></el-table-column>
    <el-table-column prop="address" label="地址" width="300"></el-table-column>
    <el-table-column fixed="right" prop="zip" label="邮编" width="120"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄',
          zip: 200333
        });
      }
      return { tableData };
    }
  };
</script>
```
:::

### 固定列和表头

横纵内容过多时，可选择固定列和表头。

:::demo 固定列和表头可以同时使用，只需要将上述两个属性分别设置好即可。
```html
<template>
  <el-table-v2
    :data="tableData"
    style="width: 100%"
    height="250">
    <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
    <el-table-column prop="province" label="省份" width="120"></el-table-column>
    <el-table-column prop="city" label="市区" width="120"></el-table-column>
    <el-table-column prop="address" label="地址" width="300"></el-table-column>
    <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      };
    }
  };
</script>
```
:::

### 单选

:::demo TableV2 提供了单选的支持，只需要配置`highlight-current-row`属性即可实现单选。之后由`current-change`事件来管理选中时触发的事件，它会传入`currentRow`，`oldCurrentRow`。如果需要显示索引，可以增加一列`el-table-column`，设置`type`属性为`index`即可显示从 1 开始的索引号。
```html
<template>
  <div>
    <el-table-v2
      ref="singleTable"
      :data="tableData"
      height="250"
      row-key="id"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="date"
        label="日期"
        width="120">
      </el-table-column>
      <el-table-column
        property="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="address"
        label="地址">
      </el-table-column>
    </el-table-v2>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">选中第二行</el-button>
      <el-button @click="setCurrent(tableData[19])">选中第二十行</el-button>
      <el-button @click="setCurrent()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return {
        tableData,
        currentRow: null
      };
    },
    methods: {
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      }
    }
  };
</script>
```
:::

### 多选

选择多行数据时使用 Checkbox。虚拟表格展示大量数据时建议设置 `height`，以启用稳定的可视区渲染。

:::demo 实现多选非常简单：手动添加一个`el-table-column`，设`type`属性为`selection`即可。可以通过 `toggleRowSelection` 和 `clearSelection` 方法控制选中项。
```html
<template>
  <div>
    <el-table-v2
      ref="multipleTable"
      :data="tableData"
      height="250"
      row-key="id"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
    </el-table-v2>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return {
        tableData,
        multipleSelection: []
      };
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  };
</script>
```
:::

### 排序

对虚拟表格进行排序，可快速查找或对比数据。

:::demo 在列中设置`sortable`属性即可实现以该列为基准的排序，可以通过`default-sort`属性设置默认的排序列和排序顺序。
```html
<template>
  <el-table-v2
    :data="tableData"
    height="250"
    row-key="id"
    :default-sort="{ prop: 'date', order: 'descending' }"
    style="width: 100%">
    <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="score" label="分数" sortable width="120"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          score: 1000 - i,
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return { tableData };
    }
  };
</script>
```
:::

### 筛选

对虚拟表格进行筛选，可快速查找到自己想看的数据。数据量较大时，记得设置 `height`。

:::demo 在列中设置`filters` `filter-method`属性即可开启该列的筛选，filters 是一个数组，`filter-method`是一个方法，它用于决定某些数据是否显示，会传入三个参数：`value`、`row` 和 `column`。
```html
<template>
  <div>
    <el-button @click="resetDateFilter">清除日期过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table-v2
      ref="filterTable"
      :data="tableData"
      height="250"
      row-key="id"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
        column-key="date"
        :filters="dateFilters"
        :filter-method="filterHandler">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="100"
        :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '家' ? 'primary' : 'success'"
            disable-transitions>{{ scope.row.tag }}</el-tag>
        </template>
      </el-table-column>
    </el-table-v2>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        const day = '2016-05-0' + ((i % 4) + 1);
        tableData.push({
          id: i,
          date: day,
          name: '王小虎',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄',
          tag: i % 2 === 0 ? '家' : '公司'
        });
      }
      return {
        tableData,
        dateFilters: [
          { text: '2016-05-01', value: '2016-05-01' },
          { text: '2016-05-02', value: '2016-05-02' },
          { text: '2016-05-03', value: '2016-05-03' },
          { text: '2016-05-04', value: '2016-05-04' }
        ]
      };
    },
    methods: {
      resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }
    }
  };
</script>
```
:::

### 自定义列模板

自定义列的显示内容，可组合其他组件使用。虚拟表格展示大量数据时建议设置 `height`。

:::demo 通过 `Scoped slot` 可以获取到 `row`、`column`、`$index` 和 `store` 的数据，用法参考 demo。
```html
<template>
  <el-table-v2
    :data="tableData"
    height="250"
    row-key="id"
    style="width: 100%">
    <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper" style="display: inline-block">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  };
</script>
```
:::

### 自定义表头

表头支持自定义。虚拟表格展示大量数据时建议设置 `height`。

:::demo 通过设置 [Scoped slot](https://v2.cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD) 来自定义表头。
```html
<template>
  <el-table-v2
    :data="filteredTableData"
    height="250"
    row-key="id"
    style="width: 100%">
    <el-table-column
      label="日期"
      prop="date">
    </el-table-column>
    <el-table-column
      label="姓名"
      prop="name">
    </el-table-column>
    <el-table-column align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="请输入姓名关键词搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎 ' + i,
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return {
        tableData,
        search: ''
      };
    },
    computed: {
      filteredTableData() {
        const search = this.search && this.search.toLowerCase();
        if (!search) return this.tableData;
        return this.tableData.filter(data => data.name.toLowerCase().indexOf(search) > -1);
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  };
</script>
```
:::

### 自定义索引

自定义 `type=index` 列的行号。虚拟表格在大数据下请设置 `height`。

:::demo 通过给 `type=index` 的列传入 `index` 属性，可以自定义索引。该属性传入数字时，将作为索引的起始值。也可以传入一个方法，它提供当前行的行号（从 `0` 开始）作为参数，返回值将作为索引展示。
```html
<template>
  <el-table-v2
    :data="tableData"
    height="250"
    row-key="id"
    style="width: 100%">
    <el-table-column
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table-v2>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) {
        tableData.push({
          id: i,
          date: '2016-05-' + ((i % 28) + 1),
          name: '王小虎',
          address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
        });
      }
      return { tableData };
    },
    methods: {
      indexMethod(index) {
        return index * 2;
      }
    }
  };
</script>
```
:::

### 流体高度

待 TableV2 完善后补充示例。

### 多级表头

待 TableV2 完善后补充示例。

### 展开行

待 TableV2 完善后补充示例。

### 树形数据与懒加载

待 TableV2 完善后补充示例。

### 表尾合计行

待 TableV2 完善后补充示例。

### 合并行或列

待 TableV2 完善后补充示例。

### 大数据渲染

当数据量很大时，可以通过 `reloadData` 将数据加载到组件内部的非响应式数据源，避免整批数据进入 Vue 响应式观测。排序、筛选和选择方法仍可继续使用。下面示例使用 `reloadData` 加载大数据，并使用 `sort`、`filter`、`toggleRowSelection` 和 `clearSelection` 控制表格状态。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 10px">
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(10000)">加载 10000 条</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(200000)">加载 200000 条</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(1000000)">加载 1000000 条</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="sortByScore">按分数升序</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="filterActive">筛选启用状态</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearFilter">清空筛选</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="toggleSelection">选中两条启用数据</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearSelection">清空选中</el-button>
      </span>
    </div>
    <div style="margin-bottom: 12px">已选中 {{ selectedCount }} 条</div>
    <el-table-v2
      ref="largeTable"
      height="250"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="score" label="分数" sortable width="120"></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        column-key="status"
        width="120"
        :filters="[{ text: '启用', value: 'active' }, { text: '停用', value: 'disabled' }]"
        :filter-method="filterStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" disable-transitions>
            {{ scope.row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="300" show-overflow-tooltip></el-table-column>
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
            name: '用户 ' + i,
            score: count - i,
            status: i % 3 === 0 ? 'disabled' : 'active',
            address: '上海市普陀区金沙江路 ' + (1516 + i) + ' 弄'
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

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 显示的数据 | array | — | — |
| height | 表格高度，建议设置 | string/number | — | — |
| max-height | 表格最大高度 | string/number | — | — |
| row-height | 行高，用于虚拟滚动计算 | number | — | 48 |
| overscan | 可视区外额外渲染的行数 | number | — | 6 |
| stripe | 是否为斑马纹表格 | boolean | — | false |
| border | 是否带有纵向边框 | boolean | — | false |
| size | 表格尺寸 | string | medium / small / mini | — |
| fit | 列宽是否自撑开 | boolean | — | true |
| show-header | 是否显示表头 | boolean | — | true |
| highlight-current-row | 是否高亮当前行 | boolean | — | false |
| current-row-key | 当前行 key，只写属性 | string/number | — | — |
| row-key | 行数据的 key | string/function | — | — |
| empty-text | 空数据文本 | string | — | 暂无数据 |
| tooltip-effect | tooltip 主题 | string | dark / light | dark |
| default-sort | 默认排序 | object | — | — |
| row-class-name | 行 className 回调或字符串 | function/string | — | — |
| row-style | 行 style 回调或对象 | function/object | — | — |
| cell-class-name | 单元格 className 回调或字符串 | function/string | — | — |
| cell-style | 单元格 style 回调或对象 | function/object | — | — |
| header-row-class-name | 表头行 className 回调或字符串 | function/string | — | — |
| header-row-style | 表头行 style 回调或对象 | function/object | — | — |
| header-cell-class-name | 表头单元格 className 回调或字符串 | function/string | — | — |
| header-cell-style | 表头单元格 style 回调或对象 | function/object | — | — |

### TableV2 Column Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| prop | 字段名，别名 `property` | string | — | — |
| label | 表头文本 | string | — | — |
| width | 列宽 | string/number | — | — |
| min-width | 最小列宽 | string/number | — | 80 |
| fixed | 固定列 | boolean/string | true / left / right | — |
| align | 对齐方式 | string | left / center / right | left |
| header-align | 表头对齐方式 | string | left / center / right | — |
| class-name | 列 className | string | — | — |
| label-class-name | 表头 className | string | — | — |
| formatter | 单元格格式化方法 | function(row, column, cellValue, index) | — | — |
| render-header | 表头渲染函数 | function(h, scope) | — | — |
| type | 列类型 | string | selection / index | — |
| index | `type="index"` 的自定义索引 | number/function(index) | — | — |
| selectable | 行是否可选 | function(row, index) | — | — |
| reserve-selection | 数据更新后保留选中项，需指定 `row-key` | boolean | — | false |
| sortable | 是否排序 | boolean/string | true / false / custom | false |
| sort-method | 排序方法 | function(a, b) | — | — |
| sort-by | 指定排序字段 | string/function/array | — | — |
| sort-orders | 排序顺序 | array | ascending / descending / null | ['ascending', 'descending', null] |
| filters | 筛选选项 | array | — | — |
| filter-method | 筛选方法 | function(value, row, column) | — | — |
| filter-multiple | 筛选是否支持多选 | boolean | — | true |
| filtered-value | 已选中的筛选值 | array | — | — |
| column-key | `filter-change` 的列标识 | string | — | — |
| show-overflow-tooltip | 内容过长时显示 tooltip | boolean | — | false |

### TableV2 Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| row-click | 点击行时触发 | row, column, event |
| row-dblclick | 双击行时触发 | row, column, event |
| row-contextmenu | 右键点击行时触发 | row, column, event |
| cell-click | 点击单元格时触发 | row, column, cell, event |
| cell-dblclick | 双击单元格时触发 | row, column, cell, event |
| cell-contextmenu | 右键点击单元格时触发 | row, column, cell, event |
| cell-mouse-enter | hover 进入单元格时触发 | row, column, cell, event |
| cell-mouse-leave | hover 离开单元格时触发 | row, column, cell, event |
| header-click | 点击表头时触发 | column, event |
| header-contextmenu | 右键点击表头时触发 | column, event |
| current-change | 当前行变化时触发 | currentRow, oldCurrentRow |
| select | 勾选或取消勾选某一行时触发 | selection, row |
| select-all | 点击表头全选框时触发 | selection |
| selection-change | 选中项变化时触发 | selection |
| sort-change | 排序变化时触发 | { column, prop, order } |
| filter-change | 筛选条件变化时触发 | filters |
| scroll | 滚动时触发 | { scrollTop, scrollLeft } |

### TableV2 Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| doLayout | 重新计算布局 | — |
| scrollTo | 滚动到指定纵向位置 | scrollTop |
| reloadData | 通过组件内部非响应式数据源重新加载数据，适合超大数据场景 | data |
| setCurrentRow | 设置当前行 | row |
| clearSelection | 清空选中项 | — |
| toggleRowSelection | 切换或设置某行选中状态 | row, selected |
| toggleAllSelection | 切换所有可选行 | — |
| sort | 手动排序 | prop, order |
| clearSort | 清空排序 | — |
| filter | 设置某列筛选值 | columnKey, values |
| clearFilter | 清空筛选 | columnKeys |

### TableV2 Slots

| 名称 | 说明 |
|------|------|
| — | 默认插槽，用于声明 `el-table-column` |
| empty | 空数据时显示的内容 |
| append | 插入到表格内容之后的内容 |

### TableV2 Column Scoped Slot

| 名称 | 说明 |
|------|------|
| — | 自定义列内容，参数为 `{ row, column, $index }` |
| header | 自定义表头内容，参数为 `{ column, $index }` |
