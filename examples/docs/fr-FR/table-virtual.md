## TableVirtual

Table virtuelle pour les grands ensembles de données. `TableVirtual` réutilise la déclaration des colonnes avec `el-table-column`, mais ne rend pas d'éléments liés à `table` et ne dépend pas de `position: sticky`. Les colonnes fixes sont rendues par des couches synchronisées séparées. Lorsque les données sont nombreuses, définissez `height` pour activer un rendu virtuel stable.

### Utilisation de base

La table virtuelle de base sert à afficher des données structurées. Utilisez `prop` et `label` sur `el-table-column` pour définir les colonnes.

:::demo
```html
<template>
  <el-table-virtual
    :data="tableData"
    style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
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

### Table rayée

`stripe` affiche des lignes rayées.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
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

### Table avec bordure

`border` affiche les bordures verticales.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
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

### Table avec statut

Utilisez `row-class-name` pour ajouter des classes de statut aux lignes.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
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

### En-tête fixe

Définissez `height` pour fixer l'en-tête et activer le scroll virtuel.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
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

### Colonne fixe

Utilisez `fixed` ou `fixed="right"` pour fixer des colonnes.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150"></el-table-column>
    <el-table-column prop="name" label="Nom" width="120"></el-table-column>
    <el-table-column prop="province" label="Province" width="120"></el-table-column>
    <el-table-column prop="city" label="Ville" width="120"></el-table-column>
    <el-table-column prop="address" label="Adresse" width="300"></el-table-column>
    <el-table-column fixed="right" prop="zip" label="Code postal" width="120"></el-table-column>
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

### Colonne et en-tête fixes

Les colonnes fixes et l'en-tête fixe peuvent être utilisés ensemble.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" border style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150"></el-table-column>
    <el-table-column prop="name" label="Nom" width="120"></el-table-column>
    <el-table-column prop="province" label="Province" width="120"></el-table-column>
    <el-table-column prop="city" label="Ville" width="120"></el-table-column>
    <el-table-column prop="address" label="Adresse" width="300"></el-table-column>
    <el-table-column prop="zip" label="Code postal" width="120"></el-table-column>
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

### Ligne courante

Utilisez `highlight-current-row` pour mettre en valeur la ligne courante. Utilisez `setCurrentRow` pour la définir manuellement.

:::demo
```html
<template>
  <div>
    <el-table-virtual ref="singleTable" :data="tableData" height="250" row-key="id" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="date" label="Date" width="120"></el-table-column>
      <el-table-column property="name" label="Nom" width="120"></el-table-column>
      <el-table-column property="address" label="Adresse"></el-table-column>
    </el-table-virtual>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Définir la deuxième ligne</el-button>
      <el-button @click="setCurrent()">Effacer la ligne courante</el-button>
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

### Sélection multiple

Ajoutez une colonne avec `type="selection"` pour activer la sélection multiple. Vous pouvez utiliser `toggleRowSelection` et `clearSelection` pour contrôler les lignes sélectionnées.

:::demo
```html
<template>
  <div>
    <el-table-virtual ref="multipleTable" :data="tableData" height="250" row-key="id" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="Date" width="120"><template slot-scope="scope">{{ scope.row.date }}</template></el-table-column>
      <el-table-column prop="name" label="Nom" width="120"></el-table-column>
      <el-table-column prop="address" label="Adresse" show-overflow-tooltip></el-table-column>
    </el-table-virtual>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">Basculer la sélection des deuxième et troisième lignes</el-button>
      <el-button @click="toggleSelection()">Effacer la sélection</el-button>
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

### Tri

Définissez `sortable` sur une colonne pour trier selon celle-ci. Utilisez `default-sort` pour définir le tri initial.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
    <el-table-column prop="date" label="Date" sortable width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="score" label="Score" sortable width="120"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', score: 1000 - i, address: 'Grove St ' + i }); return { tableData }; } };
</script>
```
:::

### Filtre

Définissez `filters` et `filter-method` sur une colonne pour activer le filtrage. `filter-method` reçoit `value`, `row` et `column`.

:::demo
```html
<template>
  <div>
    <el-button @click="resetDateFilter">Effacer le filtre de date</el-button>
    <el-button @click="clearFilter">Effacer tous les filtres</el-button>
    <el-table-virtual ref="filterTable" :data="tableData" height="250" row-key="id" style="width: 100%">
      <el-table-column prop="date" label="Date" sortable width="180" column-key="date" :filters="dateFilters" :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="name" label="Nom" width="180"></el-table-column>
      <el-table-column prop="address" label="Adresse" :formatter="formatter"></el-table-column>
      <el-table-column prop="tag" label="Tag" width="100" :filters="[{ text: 'Maison', value: 'Maison' }, { text: 'Bureau', value: 'Bureau' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope"><el-tag :type="scope.row.tag === 'Maison' ? 'primary' : 'success'" disable-transitions>{{ scope.row.tag }}</el-tag></template>
      </el-table-column>
    </el-table-virtual>
  </div>
</template>

<script>
  export default {
    data() {
      const tableData = [];
      for (let i = 0; i < 1000; i++) { const day = '2016-05-0' + ((i % 4) + 1); tableData.push({ id: i, date: day, name: 'Tom', address: 'Grove St ' + i, tag: i % 2 === 0 ? 'Maison' : 'Bureau' }); }
      return { tableData, dateFilters: [{ text: '2016-05-01', value: '2016-05-01' }, { text: '2016-05-02', value: '2016-05-02' }, { text: '2016-05-03', value: '2016-05-03' }, { text: '2016-05-04', value: '2016-05-04' }] };
    },
    methods: { resetDateFilter() { this.$refs.filterTable.clearFilter('date'); }, clearFilter() { this.$refs.filterTable.clearFilter(); }, formatter(row) { return row.address; }, filterTag(value, row) { return row.tag === value; }, filterHandler(value, row, column) { const property = column['property']; return row[property] === value; } }
  };
</script>
```
:::

### Template de colonne personnalisé

Utilisez les scoped slots pour accéder à `row`, `column`, `$index` et `store`.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Date" width="180"><template slot-scope="scope"><i class="el-icon-time"></i><span style="margin-left: 10px">{{ scope.row.date }}</span></template></el-table-column>
    <el-table-column label="Nom" width="180"><template slot-scope="scope"><el-popover trigger="hover" placement="top"><p>Nom: {{ scope.row.name }}</p><p>Adresse: {{ scope.row.address }}</p><div slot="reference" class="name-wrapper" style="display: inline-block"><el-tag size="medium">{{ scope.row.name }}</el-tag></div></el-popover></template></el-table-column>
    <el-table-column label="Opérations"><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Modifier</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Supprimer</el-button></template></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { return { tableData: [{ id: 1, date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 2, date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 3, date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }, { id: 4, date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }] }; }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### En-tête personnalisé

Utilisez le scoped slot `header` pour personnaliser l'en-tête.

:::demo
```html
<template>
  <el-table-virtual :data="filteredTableData" height="250" row-key="id" style="width: 100%">
    <el-table-column label="Date" prop="date"></el-table-column>
    <el-table-column label="Name" prop="name"></el-table-column>
    <el-table-column align="right"><template slot="header" slot-scope="scope"><el-input v-model="search" size="mini" placeholder="Saisissez pour rechercher"/></template><template slot-scope="scope"><el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button><el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button></template></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i }); return { tableData, search: '' }; }, computed: { filteredTableData() { const search = this.search && this.search.toLowerCase(); if (!search) return this.tableData; return this.tableData.filter(data => data.name.toLowerCase().indexOf(search) > -1); } }, methods: { handleEdit(index, row) { console.log(index, row); }, handleDelete(index, row) { console.log(index, row); } } };
</script>
```
:::

### Index personnalisé

Passez la prop `index` à une colonne `type="index"` pour personnaliser l'index. Elle peut être un nombre ou une fonction recevant l'index à partir de zéro.

:::demo
```html
<template>
  <el-table-virtual :data="tableData" height="250" row-key="id" style="width: 100%">
    <el-table-column type="index" :index="indexMethod"></el-table-column>
    <el-table-column prop="date" label="Date" width="180"></el-table-column>
    <el-table-column prop="name" label="Nom" width="180"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default { data() { const tableData = []; for (let i = 0; i < 1000; i++) tableData.push({ id: i, date: '2016-05-' + ((i % 28) + 1), name: 'Tom', address: 'Grove St ' + i }); return { tableData }; }, methods: { indexMethod(index) { return index * 2; } } };
</script>
```
:::

### Hauteur fluide

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### En-tête groupé

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### Ligne extensible

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### Données arborescentes et chargement paresseux

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### Ligne de résumé

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### Fusion de lignes ou colonnes

L'exemple sera ajouté lorsque TableVirtual supportera cette fonctionnalité.

### Attributs de TableVirtual

| Attribut | Description | Type | Valeurs acceptées | Défaut |
|---|---|---|---|---|
| data | Données de la table | array | — | — |
| height | Hauteur de la table, recommandée pour de grands volumes de données | string/number | — | — |
| max-height | Hauteur maximale de la table | string/number | — | — |
| row-height | Hauteur de ligne pour le scroll virtuel | number | — | 48 |
| overscan | Lignes supplémentaires rendues hors de la zone visible | number | — | 6 |
| stripe | Si la table est rayée | boolean | — | false |
| border | Si la table affiche des bordures verticales | boolean | — | false |
| size | Taille de la table | string | medium / small / mini | — |
| fit | Si les colonnes s'adaptent au conteneur | boolean | — | true |
| show-header | Si l'en-tête de table est visible | boolean | — | true |
| highlight-current-row | Si la ligne courante est mise en évidence | boolean | — | false |
| current-row-key | Clé de la ligne courante, propriété en écriture seule | string/number | — | — |
| row-key | Clé des données de ligne | string/function | — | — |
| empty-text | Texte affiché lorsqu'il n'y a pas de données | string | — | Aucune donnée |
| tooltip-effect | Thème du tooltip | string | dark / light | dark |
| default-sort | Tri par défaut | object | — | — |
| row-class-name | Callback ou chaîne pour la classe de ligne | function/string | — | — |
| row-style | Callback ou objet pour le style de ligne | function/object | — | — |
| cell-class-name | Callback ou chaîne pour la classe de cellule | function/string | — | — |
| cell-style | Callback ou objet pour le style de cellule | function/object | — | — |
| header-row-class-name | Callback ou chaîne pour la classe de ligne d'en-tête | function/string | — | — |
| header-row-style | Callback ou objet pour le style de ligne d'en-tête | function/object | — | — |
| header-cell-class-name | Callback ou chaîne pour la classe de cellule d'en-tête | function/string | — | — |
| header-cell-style | Callback ou objet pour le style de cellule d'en-tête | function/object | — | — |

### Attributs de Column

| Attribut | Description | Type | Valeurs acceptées | Défaut |
|---|---|---|---|---|
| type | Type de colonne | string | selection / index | — |
| index | Index personnalisé pour `type="index"` | number/function(index) | — | — |
| column-key | Clé de colonne, requise pour identifier `filter-change` | string | — | — |
| prop | Nom du champ, alias de `property` | string | — | — |
| label | Libellé de l'en-tête | string | — | — |
| width | Largeur de colonne | string/number | — | — |
| min-width | Largeur minimale de colonne | string/number | — | 80 |
| fixed | Colonne fixe | boolean/string | true / left / right | — |
| align | Alignement | string | left / center / right | left |
| header-align | Alignement de l'en-tête | string | left / center / right | — |
| class-name | Classe de colonne | string | — | — |
| label-class-name | Classe d'en-tête | string | — | — |
| formatter | Formateur de cellule | function(row, column, cellValue, index) | — | — |
| render-header | Fonction de rendu de l'en-tête | function(h, scope) | — | — |
| show-overflow-tooltip | Affiche un tooltip lorsque le contenu déborde | boolean | — | false |
| selectable | Si la ligne peut être sélectionnée | function(row, index) | — | — |
| reserve-selection | Conserve la sélection après actualisation des données, requiert `row-key` | boolean | — | false |
| sortable | Si la colonne peut être triée | boolean/string | true / false / custom | false |
| sort-method | Méthode de tri | function(a, b) | — | — |
| sort-by | Champ de tri | string/function/array | — | — |
| sort-orders | Ordres de tri | array | ascending / descending / null | ['ascending', 'descending', null] |
| filters | Options de filtre | array | — | — |
| filter-method | Méthode de filtre | function(value, row, column) | — | — |
| filter-multiple | Si le filtre supporte la sélection multiple | boolean | — | true |
| filtered-value | Valeurs de filtre sélectionnées | array | — | — |
| filter-placement | Placement du panneau de filtre | string | identique à Tooltip placement | — |

### Évènements de TableVirtual

| Nom | Description | Paramètres |
|---|---|---|
| row-click | Se déclenche lors d'un clic sur une ligne | row, column, event |
| row-dblclick | Se déclenche lors d'un double clic sur une ligne | row, column, event |
| row-contextmenu | Se déclenche lors d'un clic droit sur une ligne | row, column, event |
| cell-click | Se déclenche lors d'un clic sur une cellule | row, column, cell, event |
| cell-dblclick | Se déclenche lors d'un double clic sur une cellule | row, column, cell, event |
| cell-contextmenu | Se déclenche lors d'un clic droit sur une cellule | row, column, cell, event |
| cell-mouse-enter | Se déclenche lorsque la souris entre dans une cellule | row, column, cell, event |
| cell-mouse-leave | Se déclenche lorsque la souris quitte une cellule | row, column, cell, event |
| header-click | Se déclenche lors d'un clic sur une cellule d'en-tête | column, event |
| header-contextmenu | Se déclenche lors d'un clic droit sur une cellule d'en-tête | column, event |
| current-change | Se déclenche lorsque la ligne courante change | currentRow, oldCurrentRow |
| sort-change | Se déclenche lorsque le tri change | { column, prop, order } |
| select | Se déclenche lorsque l'utilisateur change la sélection d'une ligne | selection, row |
| select-all | Se déclenche lorsque l'utilisateur clique sur la case de sélection globale | selection |
| selection-change | Se déclenche lorsque la sélection change | selection |
| filter-change | Se déclenche lorsque les filtres changent | filters |
| scroll | Se déclenche lors du scroll du corps de la table | { scrollTop, scrollLeft } |

### Méthodes de TableVirtual

| Méthode | Description | Paramètres |
|---|---|---|
| doLayout | Recalcule le layout | — |
| scrollTo | Fait défiler vers une position verticale | scrollTop |
| reloadData | Recharge les données via une source interne non réactive, utile pour les très grands volumes de données | data |
| setCurrentRow | Définit la ligne courante | row |
| clearSelection | Efface la sélection | — |
| toggleRowSelection | Bascule ou définit l'état de sélection d'une ligne | row, selected |
| toggleAllSelection | Bascule toutes les lignes sélectionnables | — |
| sort | Trie manuellement la table | prop, order |
| clearSort | Efface le tri | — |
| filter | Définit les valeurs de filtre pour une colonne | columnKey, values |
| clearFilter | Efface les filtres | columnKeys |

### Slots de TableVirtual

| Nom | Description |
|---|---|
| — | Slot par défaut pour déclarer `el-table-column` |
| empty | Contenu affiché lorsqu'il n'y a pas de données |
| append | Contenu inséré après le contenu de la table |

### Scoped Slot de Column

| Nom | Description |
|---|---|
| — | Contenu personnalisé de colonne. Le scope est `{ row, column, $index, store }` |
| header | Contenu personnalisé d'en-tête. Le scope est `{ column, $index }` |
