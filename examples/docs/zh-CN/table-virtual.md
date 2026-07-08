## TableVirtual 虚拟表格

用于大数据列表展示的虚拟表格。`TableVirtual` 复用 `el-table-column` 的声明方式，但内部不使用 `table` 相关标签，也不依赖 `position: sticky`；固定列通过独立覆盖层同步渲染。

### 基础用法

基础虚拟表格用于展示结构化数据。不设置 `height` 时，表格会按照 `row-height` 和数据行数撑开。

:::demo 设置 `data` 后，可以通过 `el-table-column` 的 `prop` 和 `label` 定义列。
```html
<template>
  <el-table-virtual
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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
  <el-table-virtual
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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

:::demo 默认情况下，TableVirtual 组件不具有竖直方向的边框，如果需要，可以使用`border`属性。
```html
<template>
  <el-table-virtual
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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

:::demo 可以通过指定 TableVirtual 组件的 `row-class-name` 属性来为某一行添加 class。
```html
<template>
  <el-table-virtual
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
</template>

<style>
  .el-table-virtual .warning-row {
    background: oldlace;
  }

  .el-table-virtual .success-row {
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

:::demo 在`el-table-virtual`元素中定义了`height`属性，即可实现固定表头。
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="250"
    row-key="id"
    border
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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

横向内容过多时，可选择固定列。TableVirtual 固定列不使用 sticky，而是渲染左、右固定层，并与主滚动区域共享同一批可视行。

:::demo 固定列需要使用`fixed`属性，它接受 Boolean 值或者`left` `right`。
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="300"
    row-key="id"
    border
    style="width: 100%">
    <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
    <el-table-column prop="province" label="省份" width="120"></el-table-column>
    <el-table-column prop="city" label="市区" width="120"></el-table-column>
    <el-table-column prop="address" label="地址" width="300"></el-table-column>
    <el-table-column fixed="right" prop="zip" label="邮编" width="120"></el-table-column>
  </el-table-virtual>
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
  <el-table-virtual
    :data="tableData"
    style="width: 100%"
    height="250">
    <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
    <el-table-column prop="province" label="省份" width="120"></el-table-column>
    <el-table-column prop="city" label="市区" width="120"></el-table-column>
    <el-table-column prop="address" label="地址" width="300"></el-table-column>
    <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
  </el-table-virtual>
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

:::demo TableVirtual 提供了单选的支持，只需要配置`highlight-current-row`属性即可实现单选。之后由`current-change`事件来管理选中时触发的事件，它会传入`currentRow`，`oldCurrentRow`。如果需要显示索引，可以增加一列`el-table-column`，设置`type`属性为`index`即可显示从 1 开始的索引号。
```html
<template>
  <div>
    <el-table-virtual
      ref="singleTable"
      :data="tableData"
      height="260"
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
    </el-table-virtual>
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

待 TableVirtual 支持 `type="selection"` 后补充示例。

### 排序

对虚拟表格进行排序，可快速查找或对比数据。

:::demo 在列中设置`sortable`属性即可实现以该列为基准的排序，可以通过`default-sort`属性设置默认的排序列和排序顺序。
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="300"
    row-key="id"
    :default-sort="{ prop: 'date', order: 'descending' }"
    style="width: 100%">
    <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="score" label="分数" sortable width="120"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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

待 TableVirtual 支持 `filters` 和 `filter-method` 后补充示例。

### 自定义列模板

可以通过 Scoped slot 自定义列内容。

:::demo 作用域参数包含 `row`、`column` 和 `$index`。
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="260"
    row-key="id"
    style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column label="地址">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.address }}</span>
      </template>
    </el-table-column>
  </el-table-virtual>
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

### 自定义表头

可以通过 Scoped slot 自定义表头。

:::demo 通过设置 `slot="header"` 来自定义表头内容。
```html
<template>
  <el-table-virtual
    :data="tableData"
    height="260"
    row-key="id"
    style="width: 100%">
    <el-table-column prop="date" width="180">
      <template slot="header">
        日期
      </template>
    </el-table-column>
    <el-table-column prop="name" width="180">
      <template slot="header">
        姓名
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table-virtual>
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

### 自定义索引

待 TableVirtual 支持 `type="index"` 和 `index` 属性后补充示例。

### 流体高度

待 TableVirtual 完善后补充示例。

### 多级表头

待 TableVirtual 完善后补充示例。

### 展开行

待 TableVirtual 完善后补充示例。

### 树形数据与懒加载

待 TableVirtual 完善后补充示例。

### 表尾合计行

待 TableVirtual 完善后补充示例。

### 合并行或列

待 TableVirtual 完善后补充示例。

### TableVirtual Attributes

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

### TableVirtual Column Attributes

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
| sortable | 是否排序 | boolean | — | false |
| sort-method | 排序方法 | function(a, b) | — | — |
| sort-by | 指定排序字段 | string/function/array | — | — |
| sort-orders | 排序顺序 | array | ascending / descending / null | ['ascending', 'descending', null] |
| show-overflow-tooltip | 内容过长时显示 tooltip | boolean | — | false |

### TableVirtual Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| row-click | 点击行时触发 | row, column, event |
| row-dblclick | 双击行时触发 | row, column, event |
| row-contextmenu | 右键点击行时触发 | row, column, event |
| cell-click | 点击单元格时触发 | row, column, cell, event |
| cell-dblclick | 双击单元格时触发 | row, column, cell, event |
| cell-mouse-enter | hover 进入单元格时触发 | row, column, cell, event |
| cell-mouse-leave | hover 离开单元格时触发 | row, column, cell, event |
| header-click | 点击表头时触发 | column, event |
| header-contextmenu | 右键点击表头时触发 | column, event |
| current-change | 当前行变化时触发 | currentRow, oldCurrentRow |
| sort-change | 排序变化时触发 | { column, prop, order } |
| scroll | 滚动时触发 | { scrollTop, scrollLeft } |

### TableVirtual Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| doLayout | 重新计算布局 | — |
| scrollTo | 滚动到指定纵向位置 | scrollTop |
| setCurrentRow | 设置当前行 | row |
| sort | 手动排序 | prop, order |
| clearSort | 清空排序 | — |

### TableVirtual Slots

| 名称 | 说明 |
|------|------|
| — | 默认插槽，用于声明 `el-table-column` |
| empty | 空数据时显示的内容 |
| append | 插入到表格内容之后的内容 |

### TableVirtual Column Scoped Slot

| 名称 | 说明 |
|------|------|
| — | 自定义列内容，参数为 `{ row, column, $index }` |
| header | 自定义表头内容，参数为 `{ column, $index }` |
