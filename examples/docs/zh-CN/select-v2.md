## Select V2 虚拟化选择器

当选项数量较多时，使用虚拟滚动减少实际渲染的 DOM 数量。Select V2 保持 Select 的主要交互方式，通过 `options` 属性接收完整选项数据。

:::tip
Select V2 使用固定高度虚拟滚动。每个选项的实际高度应与 `item-height` 保持一致，不建议在自定义选项中使用多行内容。
:::

### 基础用法

适用于基础单选。

:::demo `v-model` 的值为当前选中项的 `value`。Select V2 直接通过 `options` 接收选项，不需要声明 `el-option`。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      };
    }
  };
</script>
```
:::

### 大数据虚拟滚动

Select V2 只渲染可视区域及缓冲区域内的选项，适合展示万级数据。

:::demo `height` 设置下拉列表最大高度，`item-height` 设置每个选项的固定高度，`overscan` 设置可视区域上下额外渲染的选项数量。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    :height="274"
    :item-height="34"
    :overscan="3"
    filterable
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      const options = [];
      for (let index = 0; index < 10000; index++) {
        options.push({
          value: index,
          label: `选项 ${index}`
        });
      }

      return {
        options,
        value: ''
      };
    }
  };
</script>
```
:::

### 有禁用选项

:::demo 在选项数据中设置 `disabled: true` 即可禁用该选项。键盘导航会自动跳过禁用项。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶',
          disabled: true
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }],
        value: ''
      };
    }
  };
</script>
```
:::

### 禁用状态

:::demo 为 `el-select-v2` 设置 `disabled`，整个选择器将不可用。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    disabled
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: '选项1', label: '黄金糕' }],
        value: ''
      };
    }
  };
</script>
```
:::

### 可清空单选

:::demo 设置 `clearable` 后，鼠标移入选择器时会显示清空按钮。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    clearable
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: '选项1', label: '黄金糕' },
          { value: '选项2', label: '双皮奶' },
          { value: '选项3', label: '蚵仔煎' }],
        value: '选项1'
      };
    }
  };
</script>
```
:::

### 基础多选

使用 Tag 展示已选项。

:::demo 设置 `multiple` 启用多选，此时 `v-model` 为选中值组成的数组。设置 `collapse-tags` 可以折叠已选标签。
```html
<template>
  <div>
    <el-select-v2
      v-model="value1"
      :options="options"
      multiple
      placeholder="请选择">
    </el-select-v2>

    <el-select-v2
      v-model="value2"
      :options="options"
      multiple
      collapse-tags
      style="margin-left: 20px;"
      placeholder="请选择">
    </el-select-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: '选项1', label: '黄金糕' },
          { value: '选项2', label: '双皮奶' },
          { value: '选项3', label: '蚵仔煎' },
          { value: '选项4', label: '龙须面' },
          { value: '选项5', label: '北京烤鸭' }],
        value1: [],
        value2: []
      };
    }
  };
</script>
```
:::

### 自定义选项内容

可以使用默认作用域插槽自定义可视选项。

:::demo 插槽参数包含 `item`、`index`、`selected` 和 `disabled`。自定义内容仍应保持单行和固定高度。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="cities"
    placeholder="请选择">
    <template slot-scope="{ item }">
      <span style="float: left">{{ item.label }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">
        {{ item.value }}
      </span>
    </template>
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        cities: [{ value: 'Beijing', label: '北京' },
          { value: 'Shanghai', label: '上海' },
          { value: 'Nanjing', label: '南京' },
          { value: 'Chengdu', label: '成都' },
          { value: 'Shenzhen', label: '深圳' },
          { value: 'Guangzhou', label: '广州' }],
        value: ''
      };
    }
  };
</script>
```
:::

### 可搜索

可以利用搜索功能快速查找选项。

:::demo 设置 `filterable` 启用本地搜索。默认匹配 `label-key` 对应字段中包含输入内容的选项。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    filterable
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: '选项1', label: '黄金糕' },
          { value: '选项2', label: '双皮奶' },
          { value: '选项3', label: '蚵仔煎' },
          { value: '选项4', label: '龙须面' },
          { value: '选项5', label: '北京烤鸭' }],
        value: ''
      };
    }
  };
</script>
```
:::

### 远程搜索

从服务器搜索数据，输入关键字进行查找。

:::demo 同时设置 `filterable`、`remote` 和 `remote-method`。远程方法接收当前输入值，并通过更新 `options` 展示搜索结果。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [],
        value: [],
        loading: false,
        states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
          'California', 'Colorado', 'Connecticut', 'Delaware',
          'Florida', 'Georgia', 'Hawaii', 'Idaho']
      };
    },
    methods: {
      remoteMethod(query) {
        if (query === '') {
          this.options = [];
          return;
        }

        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.states
            .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) > -1)
            .map(item => ({ value: item, label: item }));
        }, 200);
      }
    }
  };
</script>
```
:::

### 创建条目

可以创建并选中选项中不存在的条目。

:::demo 设置 `allow-create` 允许创建条目，必须配合 `filterable` 使用。设置 `default-first-option` 后，可以按 Enter 直接选择第一个匹配项。第二个选择器设置 `reserve-keyword=false`，选中后会清空当前搜索词。
```html
<template>
  <div>
    <el-select-v2
      v-model="value1"
      :options="options"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="默认保留搜索词">
    </el-select-v2>

    <el-select-v2
      v-model="value2"
      :options="options"
      multiple
      filterable
      allow-create
      default-first-option
      :reserve-keyword="false"
      style="margin-left: 20px;"
      placeholder="不保留搜索词">
    </el-select-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [
          { value: 'HTML', label: 'H5' },
          { value: 'CSS', label: 'CSS' },
          { value: 'JavaScript', label: 'JS' }
        ],
        value1: [],
        value2: []
      };
    }
  };
</script>
```
:::

### 下拉框宽度与内容溢出

通过 `fit-input-width` 控制下拉框宽度。选项内容超过可用宽度时显示省略号，组件只检测当前可视区域内的选项，并为实际溢出的选项添加原生 `title`。

:::demo `true` 表示下拉框与输入框同宽，`false` 表示以输入框宽度为最小宽度，数字表示固定像素宽度。
```html
<template>
  <div>
    <el-select-v2
      v-model="value1"
      :options="options"
      :fit-input-width="220"
      placeholder="固定 220px">
    </el-select-v2>

    <el-select-v2
      v-model="value2"
      :options="options"
      :fit-input-width="false"
      style="margin-left: 20px; width: 180px;"
      placeholder="最小宽度 180px">
    </el-select-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 1,
          label: '这是一条内容很长、在固定宽度下会自动显示省略号的选项'
        }, {
          value: 2,
          label: '短选项'
        }],
        value1: '',
        value2: ''
      };
    }
  };
</script>
```
:::

### 自定义字段与对象值

可以通过 `label-key`、`disabled-key` 和 `value-key` 适配不同的数据结构。

:::demo 当选项的 `value` 为对象时，`value-key` 用于指定比较对象的唯一标识。
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    value-key="id"
    label-key="name"
    disabled-key="unavailable"
    placeholder="请选择">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: { id: 1 }, name: '上海', unavailable: false },
          { value: { id: 2 }, name: '北京', unavailable: true },
          { value: { id: 3 }, name: '广州', unavailable: false }],
        value: { id: 1 }
      };
    }
  };
</script>
```
:::

### Select V2 Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | string / number / boolean / object / array | — | — |
| options | 完整选项数据 | array | — | [] |
| multiple | 是否多选 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| value-key | 对象 value 的唯一标识 | string | — | value |
| label-key | 选项标签字段 | string | — | label |
| disabled-key | 选项禁用状态字段 | string | — | disabled |
| size | 输入框尺寸 | string | medium / small / mini | — |
| clearable | 是否可以清空 | boolean | — | false |
| clear-icon | 清空按钮图标 | string | — | el-icon-circle-close |
| suffix-icon | 下拉箭头图标 | string | — | el-icon-arrow-up |
| collapse-tags | 多选时是否折叠已选标签 | boolean | — | false |
| collapse-tags-tooltip | 折叠标签时是否显示完整标签提示 | boolean | — | false |
| tag-tooltip | 折叠标签 Tooltip 配置 | object | — | {} |
| max-collapse-tags | 折叠标签时最多显示的标签数量 | number | — | 1 |
| tag-type | 已选标签类型 | string | success / info / warning / danger | info |
| tag-effect | 已选标签主题 | string | dark / light / plain | light |
| effect | Tooltip 主题 | string | dark / light | light |
| multiple-limit | 多选时最多可选数量，0 表示不限制 | number | — | 0 |
| name | select input 的 name 属性 | string | — | — |
| id | select input 的 id 属性 | string | — | — |
| autocomplete | select input 的 autocomplete 属性 | string | — | none |
| placeholder | 占位符 | string | — | 请选择 |
| filterable | 是否可搜索 | boolean | — | false |
| allow-create | 是否允许创建新条目，需配合 `filterable` 使用 | boolean | — | false |
| filter-method | 自定义搜索方法，参数为当前输入值；调用后应更新 `options` | function | — | — |
| remote | 是否为远程搜索 | boolean | — | false |
| remote-method | 远程搜索方法，参数为当前输入值 | function | — | — |
| loading | 是否正在加载远程数据 | boolean | — | false |
| loading-text | 加载时显示的文字 | string | — | 加载中 |
| no-match-text | 搜索条件无匹配时显示的文字 | string | — | 无匹配数据 |
| no-data-text | 选项为空时显示的文字 | string | — | 无数据 |
| popper-class | Select 下拉框的类名 | string | — | — |
| popper-style | Select 下拉框的样式 | string / object | — | — |
| popper-options | Popper.js 配置 | object | — | `{ gpuAcceleration: false }` |
| placement | 下拉框出现位置 | string | bottom-start / top-start 等 | bottom-start |
| fallback-placements | Popper 备选位置 | array | — | bottom-start / top-start / right / left |
| offset | 下拉框与输入框的偏移量 | number | — | 12 |
| show-arrow | 是否显示下拉箭头 | boolean | — | true |
| remote-show-suffix | 远程搜索时是否显示后缀图标 | boolean | — | false |
| persistent | 下拉框关闭时是否保留 DOM | boolean | — | true |
| reserve-keyword | 多选且可搜索时，选中后是否保留搜索关键词 | boolean | — | true |
| default-first-option | 按 Enter 时选择第一个匹配项，需配合 `filterable` 或 `remote` 使用 | boolean | — | false |
| popper-append-to-body | 是否将弹出框插入 body | boolean | — | true |
| automatic-dropdown | 不可搜索时，获得焦点后是否自动打开下拉框 | boolean | — | false |
| height | 下拉列表可视区域最大高度，单位 px | number | — | 274 |
| item-height | 每个选项的固定高度，单位 px | number | — | 34 |
| estimated-option-height | 动态高度选项的预估高度；设置后使用动态尺寸虚拟列表 | number | — | — |
| overscan | 可视区域上下额外渲染的选项数量 | number | — | 3 |
| scrollbar-always-on | 是否始终显示虚拟列表滚动条 | boolean | — | false |
| fit-input-width | 下拉框宽度策略；数字表示固定像素宽度 | boolean / number | — | true |
| debounce | 远程搜索防抖时间，单位 ms | number | — | 300 |
| value-on-clear | 清空时返回的值，也可为返回该值的函数 | string / number / boolean / function | — | '' |
| empty-values | 判定为空值的值列表 | array | — | ['', undefined, null] |
| validate-event | 值变化时是否触发表单校验 | boolean | — | true |
| tabindex | 输入框 tabindex | string / number | — | 0 |
| aria-label | 输入框 aria-label | string | — | — |

### Select V2 Events

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| change | 选中值发生变化时触发 | 当前选中值 |
| visible-change | 下拉框出现或隐藏时触发 | 出现为 true，隐藏为 false |
| remove-tag | 多选模式下移除 Tag 时触发 | 被移除的值 |
| clear | 点击清空按钮时触发 | — |
| blur | input 失去焦点时触发 | event: Event |
| focus | input 获得焦点时触发 | event: Event |
| end-reached | 虚拟列表滚动到边界时触发 | top / bottom / left / right |

### Select V2 Slots

| name | 说明 |
|------|------|
| — | 自定义选项内容，作用域参数为 `{ item, index, selected, disabled }` |
| prefix | Select 输入框头部内容 |
| empty | 无选项时的列表内容 |
| loading | 加载状态下拉内容 |
| header | 下拉菜单头部内容 |
| footer | 下拉菜单底部内容 |

### Options 数据字段

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 选项值 | string / number / boolean / object | — |
| label | 选项标签 | string / number | — |
| disabled | 是否禁用 | boolean | false |
| options | 分组的子选项数组 | array | — |

选项值固定使用 `value` 字段；可通过 `label-key` 和 `disabled-key` 配置标签与禁用状态字段。

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使 input 获得焦点 | — |
| blur | 使 input 失去焦点并隐藏下拉框 | — |
| scrollToIndex | 将指定索引的选项滚动到可视区域 | index: number |
