## Tabla virtualizada

Table V2 usa `virtual-list` para grandes volúmenes de datos. Estos ejemplos siguen la organización funcional de Element Plus Table V2 y están escritos con la API Options de Vue 2. La sintaxis antigua con hijos `el-table-column` ya no es compatible; use las propiedades `columns` y `data`.

### Uso básico

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() {
    const columns = [{ key: 'id', dataKey: 'id', title: 'ID', width: 120 }, { key: 'name', dataKey: 'name', title: 'Nombre', width: 180 }, { key: 'address', dataKey: 'address', title: 'Dirección', width: 360 }];
    return { columns, data: Array.from({ length: 1000 }, (_, id) => ({ id, name: 'Tom', address: 'Shanghai, Jinshajiang Road 1518' })) };
  }
};
</script>
```
:::

### Columnas fijas y filas fijas

`fixed` en una columna acepta `true`, `left` o `right`. `fixed-data` muestra filas por debajo del encabezado y las listas virtuales sincronizan el desplazamiento vertical.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :fixed-data="fixedData" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 100, fixed: 'left' }, { key: 'name', dataKey: 'name', title: 'Nombre', width: 180 }, { key: 'address', dataKey: 'address', title: 'Dirección', width: 360 }, { key: 'action', title: 'Acción', width: 120, fixed: 'right' }], fixedData: [{ id: 'fixed', name: 'Fila fija', address: 'Permanece bajo el encabezado' }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', address: 'Fila ' + id })) }; }
};
</script>
```
:::

### Encabezado agrupado

Use `children` en `columns` para crear encabezados de varios niveles.

### Datos de árbol y carga diferida

Use `children` para los nodos anidados, `expand-column-key` para indicar la columna expandible y `row-expand` para cargar hijos de forma diferida.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" expand-column-key="name" :width="700" :height="400" @row-expand="loadChildren" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Nombre', width: 260 }, { key: 'value', dataKey: 'value', title: 'Valor', width: 200 }], data: [{ id: 1, name: 'Nodo 1', value: 'raíz', children: [{ id: 2, name: 'Nodo 1-1', value: 'hijo' }] }, { id: 3, name: 'Nodo 2', value: 'carga', hasChildren: true }] }; },
  methods: { loadChildren({ expanded, rowData }) { if (expanded && rowData.hasChildren && !rowData.children) this.$set(rowData, 'children', [{ id: '3-1', name: 'Hijo cargado', value: 'loaded' }]); } }
};
</script>
```
:::

### Altura dinámica

La altura fija es el valor predeterminado. Pase `estimated-row-height` para medir la altura real de cada fila.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :estimated-row-height="50" :width="700" :height="400" fixed /></template>
<script>
export default { data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Nombre', width: 150 }, { key: 'description', dataKey: 'description', title: 'Descripción', width: 500 }], data: Array.from({ length: 100 }, (_, id) => ({ id, name: 'Tom', description: id % 2 ? 'Texto corto.' : 'Texto largo para demostrar la altura dinámica de las filas. '.repeat(3) })) }; } };
</script>
```
:::

### Renderizado personalizado, estado y selección

Use los slots `cell` y `header-cell` para botones, controles de selección y filtros. Use `row-class` para aplicar clases según el estado de una fila.

### Pie, estado vacío y overlay

Use los slots `footer`, `empty` y `overlay`; `footer-height` participa en el cálculo de la altura de la tabla.

:::demo
```html
<el-table-v2 :columns="columns" :data="data" :width="700" :height="400" :footer-height="50">
  <div slot="footer">Filas: {{ data.length }}</div>
  <el-empty slot="empty" description="Sin datos" />
  <div slot="overlay">Cargando...</div>
</el-table-v2>
<script>
export default { data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 180 }], data: [] }; } };
</script>
```
:::

### Desplazamiento manual

Con un `ref`, use `scrollTo`, `scrollToLeft`, `scrollToTop` y `scrollToRow`.

### API

Los atributos, columnas, slots, eventos y métodos siguen [Element Plus TableV2](https://element-plus.org/es/component/table-v2.html). `width` y `height` son obligatorios. Este repositorio no incluye `el-auto-resizer`; el ejemplo de tamaño automático usa un listener `resize` de Vue 2.
