## TableVirtual

Tabla virtual para grandes conjuntos de datos. `TableVirtual` reutiliza la forma de declarar columnas con `el-table-column`, pero internamente no renderiza elementos relacionados con `table` ni depende de `position: sticky`. Las columnas fijas se renderizan con capas sincronizadas independientes.

### Uso básico

La tabla virtual básica se usa para mostrar datos estructurados. Si `height` no está definido, la tabla crece según `row-height` y la cantidad de filas.

:::demo Después de configurar `data`, use `prop` y `label` en `el-table-column` para definir columnas.
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

### Columnas fijas

Las columnas fijas se implementan con capas superpuestas a la izquierda y a la derecha. Comparten las mismas filas visibles con el área principal de scroll.

:::demo Use `fixed` o `fixed="right"` para fijar columnas.
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
    <el-table-column prop="name" label="Nombre" width="160"></el-table-column>
    <el-table-column prop="city" label="Ciudad" width="160"></el-table-column>
    <el-table-column fixed="right" prop="status" label="Estado" width="100"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 3000; i++) {
        data.push({
          id: i,
          name: 'Usuario ' + i,
          city: i % 2 === 0 ? 'Shanghai' : 'Hangzhou',
          address: 'Dirección larga ' + i + ' para scroll horizontal y tooltip',
          status: i % 3 === 0 ? 'Activo' : 'Pausado'
        });
      }
      return { tableData: data };
    }
  };
</script>
```
:::

### Contenido personalizado

`TableVirtual` soporta el slot con scope por defecto y el slot de cabecera en `el-table-column`.

:::demo El scope contiene `row`, `column` y `$index`.
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
      <template slot="header">Nombre / Índice</template>
      <template slot-scope="scope">
        {{ scope.$index }} - {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column prop="score" label="Puntuación" width="120"></el-table-column>
    <el-table-column prop="address" label="Dirección"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        data.push({
          id: i,
          name: 'Usuario ' + i,
          score: i,
          address: 'Dirección ' + i
        });
      }
      return {
        tableData: data
      };
    },

    methods: {
      handleRowClick(row) {
        this.$message('Click: ' + row.name);
      }
    }
  };
</script>
```
:::

### Atributos de TableVirtual

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
|----------|-------------|------|-------------------|-------------|
| data | Datos de la tabla | array | — | — |
| height | Altura de la tabla, recomendado | string/number | — | — |
| max-height | Altura máxima de la tabla | string/number | — | — |
| row-height | Altura de fila para el scroll virtual | number | — | 48 |
| overscan | Filas extra renderizadas fuera del área visible | number | — | 6 |
| stripe | Si la tabla tiene franjas | boolean | — | false |
| border | Si la tabla tiene bordes verticales | boolean | — | false |
| size | Tamaño de la tabla | string | medium / small / mini | — |
| fit | Si las columnas se ajustan al contenedor | boolean | — | true |
| show-header | Si se muestra la cabecera | boolean | — | true |
| highlight-current-row | Si se resalta la fila actual | boolean | — | false |
| current-row-key | Key de la fila actual, propiedad solo set | string/number | — | — |
| row-key | Key de los datos de fila | string/function | — | — |
| empty-text | Texto cuando no hay datos | string | — | No Data |
| tooltip-effect | Tema del tooltip | string | dark / light | dark |
| default-sort | Ordenación por defecto | object | — | — |
| row-class-name | Callback o string para class de fila | function/string | — | — |
| row-style | Callback u objeto para style de fila | function/object | — | — |
| cell-class-name | Callback o string para class de celda | function/string | — | — |
| cell-style | Callback u objeto para style de celda | function/object | — | — |
| header-row-class-name | Callback o string para class de fila de cabecera | function/string | — | — |
| header-row-style | Callback u objeto para style de fila de cabecera | function/object | — | — |
| header-cell-class-name | Callback o string para class de celda de cabecera | function/string | — | — |
| header-cell-style | Callback u objeto para style de celda de cabecera | function/object | — | — |

### Atributos de Column

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
|----------|-------------|------|-------------------|-------------|
| prop | Nombre del campo, alias de `property` | string | — | — |
| label | Texto de cabecera | string | — | — |
| width | Ancho de columna | string/number | — | — |
| min-width | Ancho mínimo de columna | string/number | — | 80 |
| fixed | Columna fija | boolean/string | true / left / right | — |
| align | Alineación | string | left / center / right | left |
| header-align | Alineación de cabecera | string | left / center / right | — |
| class-name | Class de columna | string | — | — |
| label-class-name | Class de cabecera | string | — | — |
| formatter | Formateador de celda | function(row, column, cellValue, index) | — | — |
| render-header | Función de render de cabecera | function(h, scope) | — | — |
| sortable | Si la columna es ordenable | boolean | — | false |
| sort-method | Método de ordenación | function(a, b) | — | — |
| sort-by | Campo de ordenación | string/function/array | — | — |
| sort-orders | Ordenes de ordenación | array | ascending / descending / null | ['ascending', 'descending', null] |
| show-overflow-tooltip | Muestra tooltip cuando el contenido desborda | boolean | — | false |

### Eventos de TableVirtual

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| row-click | Se dispara al hacer click en una fila | row, column, event |
| row-dblclick | Se dispara al hacer doble click en una fila | row, column, event |
| row-contextmenu | Se dispara al hacer click derecho en una fila | row, column, event |
| cell-click | Se dispara al hacer click en una celda | row, column, cell, event |
| cell-dblclick | Se dispara al hacer doble click en una celda | row, column, cell, event |
| cell-mouse-enter | Se dispara al entrar con el mouse en una celda | row, column, cell, event |
| cell-mouse-leave | Se dispara al salir con el mouse de una celda | row, column, cell, event |
| header-click | Se dispara al hacer click en la cabecera | column, event |
| header-contextmenu | Se dispara al hacer click derecho en la cabecera | column, event |
| current-change | Se dispara cuando cambia la fila actual | currentRow, oldCurrentRow |
| sort-change | Se dispara cuando cambia la ordenación | { column, prop, order } |
| scroll | Se dispara al hacer scroll | { scrollTop, scrollLeft } |

### Métodos de TableVirtual

| Método | Descripción | Parámetros |
|--------|-------------|------------|
| doLayout | Recalcula el layout | — |
| scrollTo | Hace scroll a una posición vertical | scrollTop |
| setCurrentRow | Define la fila actual | row |
| sort | Ordena manualmente | prop, order |
| clearSort | Limpia la ordenación | — |

### Slots de TableVirtual

| Nombre | Descripción |
|--------|-------------|
| — | Slot por defecto para declarar `el-table-column` |
| empty | Contenido cuando no hay datos |
| append | Contenido insertado después de la tabla |

### Scoped Slot de Column

| Nombre | Descripción |
|--------|-------------|
| — | Contenido personalizado de columna. El scope es `{ row, column, $index }` |
| header | Contenido personalizado de cabecera. El scope es `{ column, $index }` |
