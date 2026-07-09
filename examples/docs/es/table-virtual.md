## TableVirtual

Tabla virtual para grandes conjuntos de datos. `TableVirtual` reutiliza la forma de declarar columnas con `el-table-column`, pero internamente no renderiza elementos relacionados con `table` ni depende de `position: sticky`. Las columnas fijas se renderizan con capas sincronizadas independientes. Cuando los datos son numerosos, configure `height` para activar un renderizado virtual estable.

### Uso básico

La tabla virtual básica se usa para mostrar datos estructurados. Use `prop` y `label` en `el-table-column` para definir columnas.

:::demo
```html
<template>
  <el-table-virtual
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
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

### Tabla con franjas

`stripe` muestra filas con franjas.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
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

### Tabla con borde

`border` muestra bordes verticales.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
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

### Tabla con estado

Use `row-class-name` para añadir clases de estado a las filas.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
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

### Cabecera fija

Configure `height` para fijar la cabecera y activar el scroll virtual.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
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

### Columna fija

Use `fixed` o `fixed="right"` para fijar columnas.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Fecha" width="150"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="120"></el-table-column>
    <el-table-column prop="province" label="Provincia" width="120"></el-table-column>
    <el-table-column prop="city" label="Ciudad" width="120"></el-table-column>
    <el-table-column prop="address" label="Dirección" width="300"></el-table-column>
    <el-table-column fixed="right" prop="zip" label="Código postal" width="120"></el-table-column>
  </el-table-virtual>
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

### Columna fija y cabecera

Las columnas fijas y la cabecera fija pueden usarse juntas.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Fecha" width="150"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="120"></el-table-column>
    <el-table-column prop="province" label="Provincia" width="120"></el-table-column>
    <el-table-column prop="city" label="Ciudad" width="120"></el-table-column>
    <el-table-column prop="address" label="Dirección" width="300"></el-table-column>
    <el-table-column prop="zip" label="Código postal" width="120"></el-table-column>
  </el-table-virtual>
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

### Fila actual

Use `highlight-current-row` para resaltar la fila actual. Use `setCurrentRow` para definirla manualmente.

:::demo
```html
<template>
  <div>
    <el-table-virtual ref="singleTable" :data="tableData" height="250" row-key="id" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="date" label="Fecha" width="120"></el-table-column>
      <el-table-column property="name" label="Nombre" width="120"></el-table-column>
      <el-table-column property="address" label="Dirección"></el-table-column>
    </el-table-virtual>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Seleccionar segunda fila</el-button>
      <el-button @click="setCurrent()">Limpiar fila actual</el-button>
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

### Selección múltiple

Añada una columna con `type="selection"` para activar la selección múltiple. Puede usar `toggleRowSelection` y `clearSelection` para controlar las filas seleccionadas.

:::demo
```html
<template>
  <div>
    <el-table-virtual ref="multipleTable" :data="tableData" height="250" row-key="id" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="Fecha" width="120"><template slot-scope="scope">{{ scope.row.date }}</template></el-table-column>
      <el-table-column prop="name" label="Nombre" width="120"></el-table-column>
      <el-table-column prop="address" label="Dirección" show-overflow-tooltip></el-table-column>
    </el-table-virtual>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">Cambiar selección de la segunda y tercera fila</el-button>
      <el-button @click="toggleSelection()">Limpiar selección</el-button>
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

### Ordenación

Use `sortable` en una columna para ordenar por ella. Use `default-sort` para definir la ordenación inicial.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
    <el-table-column prop="date" label="Fecha" sortable width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="score" label="Puntuación" sortable width="120"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', score: 1000 - i, address: 'Grove St ' + i }); return { tableData }; } };
</script>
```
:::

### Filtro

Use `filters` y `filter-method` en una columna para activar filtros. `filter-method` recibe `value`, `row` y `column`.

:::demo
```html
<template>
  <div>
    <el-button @click="resetDateFilter">Limpiar filtro de fecha</el-button>
    <el-button @click="clearFilter">Limpiar todos los filtros</el-button>
    <el-table-virtual ref="filterTable" :data="tableData" height="250" row-key="id" style="width: 100%">
      <el-table-column prop="date" label="Fecha" sortable width="180" column-key="date" :filters="dateFilters" :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
      <el-table-column prop="address" label="Dirección" :formatter="formatter"></el-table-column>
      <el-table-column prop="tag" label="Etiqueta" width="100" :filters="[{ text: 'Casa', value: 'Casa' }, { text: 'Oficina', value: 'Oficina' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope"><el-tag :type="scope.row.tag === 'Casa' ? 'primary' : 'success'" disable-transitions>{{ scope.row.tag }}</el-tag></template>
      </el-table-column>
    </el-table-virtual>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) { const day = '2016-05-0' + ((i % 4) + 1); tableData.push({ id: i, date: day, name: 'Tom', address: 'Grove St ' + i, tag: i % 2 === 0 ? 'Casa' : 'Oficina' }); }
      return { tableData, dateFilters: [{ text: '2016-05-01', value: '2016-05-01' }, { text: '2016-05-02', value: '2016-05-02' }, { text: '2016-05-03', value: '2016-05-03' }, { text: '2016-05-04', value: '2016-05-04' }] };
    },
    methods: { resetDateFilter() { this.$refs.filterTable.clearFilter('date'); }, clearFilter() { this.$refs.filterTable.clearFilter(); }, formatter(row) { return row.address; }, filterTag(value, row) { return row.tag === value; }, filterHandler(value, row, column) { const property = column['property']; return row[property] === value; } }
  };
</script>
```
:::

### Plantilla personalizada de columna

Use scoped slots para acceder a `row`, `column`, `$index` y `store`.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Fecha" width="180"><template slot-scope="scope"><i class="el-icon-time"></i><span style="margin-left: 10px">{{ scope.row.date }}</span></template></el-table-column>
    <el-table-column label="Nombre" width="180"><template slot-scope="scope"><el-popover trigger="hover" placement="top"><p>Nombre: {{ scope.row.name }}</p><p>Dirección: {{ scope.row.address }}</p><div slot="reference" class="name-wrapper" style="display: inline-block"><el-tag size="medium">{{ scope.row.name }}</el-tag></div></el-popover></template></el-table-column>
    <el-table-column label="Operaciones"><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Editar</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Eliminar</el-button></template></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { return { tableData: [{ id: 1, date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 2, date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 3, date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 4, date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }] }; }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### Cabecera personalizada

Use el scoped slot `header` para personalizar la cabecera.

:::demo
```html
<template>
  <el-table-virtual :data="filteredTableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Fecha" prop="date"></el-table-column>
    <el-table-column label="Nombre" prop="name"></el-table-column>
    <el-table-column align="right"><template slot="header" slot-scope="scope"><el-input v-model="search" size="mini" placeholder="Introduzca una palabra clave del nombre para buscar"/></template><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Editar</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Eliminar</el-button></template></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom ' + i, address: 'Grove St ' + i }); return { tableData, search: '' }; }, computed: { filteredTableData() { const search = this.search && this.search.toLowerCase(); if (!search) return this.tableData; return this.tableData.filter(data => data.name.toLowerCase().indexOf(search) > -1); } }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### Índice personalizado

Pase la prop `index` a una columna `type="index"` para personalizar el índice. Puede ser un número o una función que recibe el índice desde cero.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column type="index" :index="indexMethod"></el-table-column>
    <el-table-column prop="date" label="Fecha" width="180"></el-table-column>
    <el-table-column prop="name" label="Nombre" width="180"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i }); return { tableData }; }, methods: { indexMethod(index) { return index * 2; } } };
</script>
```
:::

### Altura fluida

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Cabecera agrupada

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Fila expandible

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Datos en árbol y carga perezosa

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Fila de resumen

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Combinar filas o columnas

El ejemplo se añadirá cuando TableVirtual soporte esta función.

### Renderizado de grandes datos

Cuando el conjunto de datos es muy grande, puede usar `reloadData` para cargar los datos en la fuente interna no reactiva del componente y evitar que Vue observe todo el conjunto de datos. Los métodos de ordenación, filtrado y selección siguen estando disponibles. El siguiente ejemplo usa `reloadData` para cargar grandes datos y usa `sort`, `filter`, `toggleRowSelection` y `clearSelection` para controlar el estado de la tabla.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 10px">
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(10000)">Cargar 10000 filas</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(200000)">Cargar 200000 filas</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="reloadLargeData(1000000)">Cargar 1000000 filas</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="sortByScore">Ordenar puntuación ascendente</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="filterActive">Filtrar estado activo</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearFilter">Limpiar filtros</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="toggleSelection">Seleccionar dos filas activas</el-button>
      </span>
      <span style="display: inline-block; margin: 0 10px 10px 0">
        <el-button @click="clearSelection">Limpiar selección</el-button>
      </span>
    </div>
    <div style="margin-bottom: 12px">Seleccionadas {{ selectedCount }} filas</div>
    <el-table-virtual
      ref="largeTable"
      height="250"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="Nombre" width="120"></el-table-column>
      <el-table-column prop="score" label="Puntuación" sortable width="120"></el-table-column>
      <el-table-column
        prop="status"
        label="Estado"
        column-key="status"
        width="120"
        :filters="[{ text: 'Activo', value: 'active' }, { text: 'Deshabilitado', value: 'disabled' }]"
        :filter-method="filterStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" disable-transitions>
            {{ scope.row.status === 'active' ? 'Activo' : 'Deshabilitado' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Dirección" min-width="300" show-overflow-tooltip></el-table-column>
    </el-table-virtual>
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
            name: 'Usuario ' + i,
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

### Atributos de TableVirtual

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
|---|---|---|---|---|
| data | Datos de la tabla | array | — | — |
| height | Altura de la tabla, recomendada para grandes cantidades de datos | string/number | — | — |
| max-height | Altura máxima de la tabla | string/number | — | — |
| row-height | Altura de fila para el scroll virtual | number | — | 48 |
| overscan | Filas adicionales renderizadas fuera del área visible | number | — | 6 |
| stripe | Si la tabla muestra filas con franjas | boolean | — | false |
| border | Si la tabla muestra bordes verticales | boolean | — | false |
| size | Tamaño de la tabla | string | medium / small / mini | — |
| fit | Si las columnas se ajustan al contenedor | boolean | — | true |
| show-header | Si se muestra la cabecera de la tabla | boolean | — | true |
| highlight-current-row | Si se resalta la fila actual | boolean | — | false |
| current-row-key | Clave de la fila actual, propiedad solo de escritura | string/number | — | — |
| row-key | Clave de los datos de fila | string/function | — | — |
| empty-text | Texto mostrado cuando no hay datos | string | — | Sin datos |
| tooltip-effect | Tema del tooltip | string | dark / light | dark |
| default-sort | Ordenación por defecto | object | — | — |
| row-class-name | Callback o cadena para la clase de fila | function/string | — | — |
| row-style | Callback u objeto para el estilo de fila | function/object | — | — |
| cell-class-name | Callback o cadena para la clase de celda | function/string | — | — |
| cell-style | Callback u objeto para el estilo de celda | function/object | — | — |
| header-row-class-name | Callback o cadena para la clase de fila de cabecera | function/string | — | — |
| header-row-style | Callback u objeto para el estilo de fila de cabecera | function/object | — | — |
| header-cell-class-name | Callback o cadena para la clase de celda de cabecera | function/string | — | — |
| header-cell-style | Callback u objeto para el estilo de celda de cabecera | function/object | — | — |

### Atributos de Column

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
|---|---|---|---|---|
| type | Tipo de columna | string | selection / index | — |
| index | Índice personalizado para `type="index"` | number/function(index) | — | — |
| column-key | Clave de columna, necesaria para identificar `filter-change` | string | — | — |
| prop | Nombre del campo, alias de `property` | string | — | — |
| label | Etiqueta de la cabecera | string | — | — |
| width | Ancho de columna | string/number | — | — |
| min-width | Ancho mínimo de columna | string/number | — | 80 |
| fixed | Columna fija | boolean/string | true / left / right | — |
| align | Alineación | string | left / center / right | left |
| header-align | Alineación de la cabecera | string | left / center / right | — |
| class-name | Clase de columna | string | — | — |
| label-class-name | Clase de cabecera | string | — | — |
| formatter | Formateador de celda | function(row, column, cellValue, index) | — | — |
| render-header | Función de renderizado de cabecera | function(h, scope) | — | — |
| show-overflow-tooltip | Muestra tooltip cuando el contenido desborda | boolean | — | false |
| selectable | Si la fila se puede seleccionar | function(row, index) | — | — |
| reserve-selection | Conserva la selección después de actualizar los datos, requiere `row-key` | boolean | — | false |
| sortable | Si la columna se puede ordenar | boolean/string | true / false / custom | false |
| sort-method | Método de ordenación | function(a, b) | — | — |
| sort-by | Campo de ordenación | string/function/array | — | — |
| sort-orders | Órdenes de ordenación | array | ascending / descending / null | ['ascending', 'descending', null] |
| filters | Opciones de filtro | array | — | — |
| filter-method | Método de filtro | function(value, row, column) | — | — |
| filter-multiple | Si el filtro admite selección múltiple | boolean | — | true |
| filtered-value | Valores filtrados seleccionados | array | — | — |
| filter-placement | Posición del panel de filtro | string | igual que Tooltip placement | — |

### Eventos de TableVirtual

| Evento | Descripción | Parámetros |
|---|---|---|
| row-click | Se dispara al hacer clic en una fila | row, column, event |
| row-dblclick | Se dispara al hacer doble clic en una fila | row, column, event |
| row-contextmenu | Se dispara al hacer clic derecho en una fila | row, column, event |
| cell-click | Se dispara al hacer clic en una celda | row, column, cell, event |
| cell-dblclick | Se dispara al hacer doble clic en una celda | row, column, cell, event |
| cell-contextmenu | Se dispara al hacer clic derecho en una celda | row, column, cell, event |
| cell-mouse-enter | Se dispara cuando el mouse entra en una celda | row, column, cell, event |
| cell-mouse-leave | Se dispara cuando el mouse sale de una celda | row, column, cell, event |
| header-click | Se dispara al hacer clic en una celda de cabecera | column, event |
| header-contextmenu | Se dispara al hacer clic derecho en una celda de cabecera | column, event |
| current-change | Se dispara cuando cambia la fila actual | currentRow, oldCurrentRow |
| sort-change | Se dispara cuando cambia la ordenación | { column, prop, order } |
| select | Se dispara cuando el usuario cambia la selección de una fila | selection, row |
| select-all | Se dispara cuando el usuario hace clic en el checkbox de seleccionar todo | selection |
| selection-change | Se dispara cuando cambia la selección | selection |
| filter-change | Se dispara cuando cambian los filtros | filters |
| scroll | Se dispara cuando se desplaza el cuerpo de la tabla | { scrollTop, scrollLeft } |

### Métodos de TableVirtual

| Método | Descripción | Parámetros |
|---|---|---|
| doLayout | Recalcula el layout | — |
| scrollTo | Desplaza a una posición vertical | scrollTop |
| reloadData | Recarga datos mediante una fuente interna no reactiva, útil para conjuntos de datos muy grandes | data |
| setCurrentRow | Define la fila actual | row |
| clearSelection | Limpia la selección | — |
| toggleRowSelection | Alterna o define el estado de selección de una fila | row, selected |
| toggleAllSelection | Alterna todas las filas seleccionables | — |
| sort | Ordena la tabla manualmente | prop, order |
| clearSort | Limpia la ordenación | — |
| filter | Define valores de filtro para una columna | columnKey, values |
| clearFilter | Limpia filtros | columnKeys |

### Slots de TableVirtual

| Nombre | Descripción |
|---|---|
| — | Slot por defecto para declarar `el-table-column` |
| empty | Contenido mostrado cuando no hay datos |
| append | Contenido insertado después del contenido de la tabla |

### Scoped Slot de Column

| Nombre | Descripción |
|---|---|
| — | Contenido personalizado de columna. El scope es `{ row, column, $index, store }` |
| header | Contenido personalizado de cabecera. El scope es `{ column, $index }` |
