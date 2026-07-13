## Select V2 Virtualized Selector

When the option list is large, virtual scrolling reduces the number of DOM nodes rendered. Select V2 keeps the main Select interactions and receives the complete option data through `options`.

:::tip
Select V2 uses fixed-height virtual scrolling. Each option should match `item-height`; multiline custom options are not recommended.
:::

### Basic usage

Use it for a basic single selection.

:::demo `v-model` is the selected option value. Select V2 receives options directly through `options`, so no `el-option` declarations are needed.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'Option 1',
          label: 'Golden cake'
        }, {
          value: 'Option 2',
          label: 'Double-layer milk'
        }, {
          value: 'Option 3',
          label: 'Oyster omelet'
        }, {
          value: 'Option 4',
          label: 'Dragon beard noodles'
        }, {
          value: 'Option 5',
          label: 'Beijing roast duck'
        }],
        value: ''
      };
    }
  };
</script>
```
:::

### Large data sets

Select V2 renders only visible and overscan options, making it suitable for tens of thousands of items.

:::demo `height` sets the maximum list height, `item-height` sets each fixed row height, and `overscan` adds buffered items above and below the viewport.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    :height="274"
    :item-height="34"
    :overscan="3"
    filterable
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      const options = [];
      for (let index = 0; index < 10000; index++) {
        options.push({
          value: index,
          label: `Option ${index}`
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

### Disabled option

:::demo Set `disabled: true` on an option to disable it. Keyboard navigation automatically skips disabled options.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'Option 1',
          label: 'Golden cake'
        }, {
          value: 'Option 2',
          label: 'Double-layer milk',
          disabled: true
        }, {
          value: 'Option 3',
          label: 'Oyster omelet'
        }],
        value: ''
      };
    }
  };
</script>
```
:::

### Disabled select

:::demo Set `disabled` on `el-select-v2` to disable the entire selector.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    disabled
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: 'Option 1', label: 'Golden cake' }],
        value: ''
      };
    }
  };
</script>
```
:::

### Clearable single select

:::demo Set `clearable` to show a clear button when the selector is hovered.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    clearable
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: 'Option 1', label: 'Golden cake' },
          { value: 'Option 2', label: 'Double-layer milk' },
          { value: 'Option 3', label: 'Oyster omelet' }],
        value: 'Option 1'
      };
    }
  };
</script>
```
:::

### Basic multiple select

Selected options are displayed as tags.

:::demo Set `multiple` to enable multiple selection; `v-model` is then an array. Set `collapse-tags` to collapse selected tags.
```html
<template>
  <div>
    <el-select-v2
      v-model="value1"
      :options="options"
      multiple
      placeholder="Select">
    </el-select-v2>

    <el-select-v2
      v-model="value2"
      :options="options"
      multiple
      collapse-tags
      style="margin-left: 20px;"
      placeholder="Select">
    </el-select-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: 'Option 1', label: 'Golden cake' },
          { value: 'Option 2', label: 'Double-layer milk' },
          { value: 'Option 3', label: 'Oyster omelet' },
          { value: 'Option 4', label: 'Dragon beard noodles' },
          { value: 'Option 5', label: 'Beijing roast duck' }],
        value1: [],
        value2: []
      };
    }
  };
</script>
```
:::

### Custom option content

Use the default scoped slot to customize visible options.

:::demo The slot exposes `item`, `index`, `selected`, and `disabled`. Custom content should remain single-line and fixed-height.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="cities"
    placeholder="Select">
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
        cities: [{ value: 'Beijing', label: 'Beijing' },
          { value: 'Shanghai', label: 'Shanghai' },
          { value: 'Nanjing', label: 'Nanjing' },
          { value: 'Chengdu', label: 'Chengdu' },
          { value: 'Shenzhen', label: 'Shenzhen' },
          { value: 'Guangzhou', label: 'Guangzhou' }],
        value: ''
      };
    }
  };
</script>
```
:::

### Filterable

Use filtering to find options quickly.

:::demo Set `filterable` to enable local filtering. By default it matches the field configured by `label-key`.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    filterable
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: 'Option 1', label: 'Golden cake' },
          { value: 'Option 2', label: 'Double-layer milk' },
          { value: 'Option 3', label: 'Oyster omelet' },
          { value: 'Option 4', label: 'Dragon beard noodles' },
          { value: 'Option 5', label: 'Beijing roast duck' }],
        value: ''
      };
    }
  };
</script>
```
:::

### Remote search

Search data from a remote server by entering a keyword.

:::demo Set `filterable`, `remote`, and `remote-method`. The remote method receives the query and updates `options` with results.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="Enter a keyword"
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

### Create new options

Create and select entries that are not present in the option list.

:::demo Set `allow-create` together with `filterable`. With `default-first-option`, press Enter to select the first match. The second selector sets `reserve-keyword=false` and clears the query after selection.
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
      placeholder="Keep keyword by default">
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
      placeholder="Do not keep keyword">
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

### Dropdown width and overflow

Control dropdown width with `fit-input-width`. Overflowing visible options are ellipsized and receive a native `title`.

:::demo `true` matches the input width, `false` uses it as the minimum width, and a number sets a fixed pixel width.
```html
<template>
  <div>
    <el-select-v2
      v-model="value1"
      :options="options"
      :fit-input-width="220"
      placeholder="Fixed 220px">
    </el-select-v2>

    <el-select-v2
      v-model="value2"
      :options="options"
      :fit-input-width="false"
      style="margin-left: 20px; width: 180px;"
      placeholder="Minimum width 180px">
    </el-select-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 1,
          label: 'This long option is automatically ellipsized at a fixed width'
        }, {
          value: 2,
          label: 'Short option'
        }],
        value1: '',
        value2: ''
      };
    }
  };
</script>
```
:::

### Custom fields and object values

Use `label-key`, `disabled-key`, and `value-key` with custom data structures.

:::demo When an option `value` is an object, `value-key` identifies the unique field used for comparison.
```html
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    value-key="id"
    label-key="name"
    disabled-key="unavailable"
    placeholder="Select">
  </el-select-v2>
</template>

<script>
  export default {
    data() {
      return {
        options: [{ value: { id: 1 }, name: 'Shanghai', unavailable: false },
          { value: { id: 2 }, name: 'Beijing', unavailable: true },
          { value: { id: 3 }, name: 'Guangzhou', unavailable: false }],
        value: { id: 1 }
      };
    }
  };
</script>
```
:::

### Select V2 Attributes

| Parameters | Description | Type | Accepted values | Default |
|------|------|------|--------|--------|
| value / v-model | Binding value | string / number / boolean / object / array | — | — |
| options | Complete option data | array | — | [] |
| multiple | Whether multiple selection is enabled | boolean | — | false |
| disabled | Whether disabled | boolean | — | false |
| value-key | Unique identity key for object values | string | — | value |
| label-key | Option label field | string | — | label |
| disabled-key | Option disabled field | string | — | disabled |
| size | Input size | string | medium / small / mini | — |
| clearable | Whether clearable | boolean | — | false |
| clear-icon | Clear icon | string | — | el-icon-circle-close |
| suffix-icon | Suffix icon | string | — | el-icon-arrow-up |
| collapse-tags | Whether to collapse tags in multiple mode | boolean | — | false |
| collapse-tags-tooltip | Whether to show collapsed tags in a tooltip | boolean | — | false |
| tag-tooltip | Collapsed-tag tooltip configuration | object | — | {} |
| max-collapse-tags | Maximum visible tags when collapsed | number | — | 1 |
| tag-type | Selected tag type | string | success / info / warning / danger | info |
| tag-effect | Selected tag effect | string | dark / light / plain | light |
| effect | Tooltip effect | string | dark / light | light |
| multiple-limit | Maximum selections in multiple mode; 0 means unlimited | number | — | 0 |
| name | Native name attribute of the select input | string | — | — |
| id | Native id attribute of the select input | string | — | — |
| autocomplete | Native autocomplete attribute of the select input | string | — | none |
| placeholder | Placeholder | string | — | Select |
| filterable | Whether filterable | boolean | — | false |
| allow-create | Whether new options can be created; requires `filterable` | boolean | — | false |
| filter-method | Custom filter method; update `options` after it runs | function | — | — |
| remote | Whether remote search is enabled | boolean | — | false |
| remote-method | Remote search method receiving the query | function | — | — |
| loading | Whether remote data is loading | boolean | — | false |
| loading-text | Text shown while loading | string | — | Loading |
| no-match-text | Text shown when no options match | string | — | No matching data |
| no-data-text | Text shown when there are no options | string | — | No data |
| popper-class | Dropdown class name | string | — | — |
| popper-style | Dropdown style | string / object | — | — |
| popper-options | Popper.js configuration | object | — | `{ gpuAcceleration: false }` |
| placement | Dropdown placement | string | bottom-start / top-start / etc. | bottom-start |
| fallback-placements | Popper fallback placements | array | — | bottom-start / top-start / right / left |
| offset | Dropdown offset | number | — | 12 |
| show-arrow | Whether to show the dropdown arrow | boolean | — | true |
| remote-show-suffix | Whether to show the suffix during remote search | boolean | — | false |
| persistent | Whether to preserve dropdown DOM when closed | boolean | — | true |
| reserve-keyword | Whether to preserve the query after selection | boolean | — | true |
| default-first-option | Select the first matching option on Enter; requires `filterable` or `remote` | boolean | — | false |
| popper-append-to-body | Whether to append the dropdown to body | boolean | — | true |
| automatic-dropdown | Whether to open automatically on focus when not filterable | boolean | — | false |
| height | Maximum dropdown viewport height in px | number | — | 274 |
| item-height | Fixed option height in px | number | — | 34 |
| estimated-option-height | Estimated option height; enables dynamic-size virtualization | number | — | — |
| overscan | Extra rendered options above and below the viewport | number | — | 3 |
| scrollbar-always-on | Whether the virtual scrollbar is always visible | boolean | — | false |
| fit-input-width | Dropdown width strategy; a number is a fixed pixel width | boolean / number | — | true |
| debounce | Remote search debounce in ms | number | — | 300 |
| value-on-clear | Value returned on clear, or a function returning it | string / number / boolean / function | — | '' |
| empty-values | Values treated as empty | array | — | ['', undefined, null] |
| validate-event | Whether to trigger form validation on value changes | boolean | — | true |
| tabindex | Input tabindex | string / number | — | 0 |
| aria-label | Input aria-label | string | — | — |

### Select V2 Events

| Event name | Description | Parameters |
|----------|------|----------|
| change | Triggers when the selected value changes | Current value |
| visible-change | Triggers when the dropdown appears or hides | true when shown, false when hidden |
| remove-tag | Triggers when a tag is removed in multiple mode | Removed value |
| clear | Triggers when the clear button is clicked | — |
| blur | Triggers when the input loses focus | event: Event |
| focus | Triggers when the input gains focus | event: Event |
| end-reached | Triggers when the virtual list reaches an edge | top / bottom / left / right |

### Select V2 Slots

| name | Description |
|------|------|
| — | Custom option content; scope parameters are `{ item, index, selected, disabled }` |
| prefix | Select input prefix |
| empty | Content when there are no options |
| loading | Dropdown content while loading |
| header | Dropdown header content |
| footer | Dropdown footer content |

### Option fields

| Field | Description | Type | Default |
|------|------|------|--------|
| value | Option value | string / number / boolean / object | — |
| label | Option label | string / number | — |
| disabled | Whether disabled | boolean | false |
| options | Child options for an option group | array | — |

Option values always use `value`; configure label and disabled fields with `label-key` and `disabled-key`.

### Methods

| Method | Description | Parameters |
|--------|------|------|
| focus | Focus the input | — |
| blur | Blur the input and hide the dropdown | — |
| scrollToIndex | Scroll an option index into view | index: number |
