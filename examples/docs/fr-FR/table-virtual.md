## TableVirtual

Table virtuelle pour les grands ensembles de données. `TableVirtual` réutilise la déclaration des colonnes avec `el-table-column`, mais ne rend pas d'éléments liés à `table` et ne dépend pas de `position: sticky`. Les colonnes fixes sont rendues par des couches synchronisées séparées.

### Utilisation de base

La table virtuelle de base sert à afficher des données structurées. Si `height` n'est pas défini, la table s'étend selon `row-height` et le nombre de lignes.

:::demo Après avoir défini `data`, utilisez `prop` et `label` sur `el-table-column` pour définir les colonnes.
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

### Colonnes fixes

Les colonnes fixes sont implémentées avec des couches superposées à gauche et à droite. Elles partagent les mêmes lignes visibles que la zone principale de scroll.

:::demo Utilisez `fixed` ou `fixed="right"` pour fixer les colonnes.
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
    <el-table-column prop="name" label="Nom" width="160"></el-table-column>
    <el-table-column prop="city" label="Ville" width="160"></el-table-column>
    <el-table-column fixed="right" prop="status" label="Statut" width="100"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 3000; i++) {
        data.push({
          id: i,
          name: 'Utilisateur ' + i,
          city: i % 2 === 0 ? 'Shanghai' : 'Hangzhou',
          address: 'Adresse longue ' + i + ' pour le scroll horizontal et le tooltip',
          status: i % 3 === 0 ? 'Actif' : 'En pause'
        });
      }
      return { tableData: data };
    }
  };
</script>
```
:::

### Contenu personnalisé

`TableVirtual` supporte le slot scoped par défaut et le slot d'en-tête dans `el-table-column`.

:::demo Le scope contient `row`, `column` et `$index`.
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
      <template slot="header">Nom / Index</template>
      <template slot-scope="scope">
        {{ scope.$index }} - {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column prop="score" label="Score" width="120"></el-table-column>
    <el-table-column prop="address" label="Adresse"></el-table-column>
  </el-table-virtual>
</template>

<script>
  export default {
    data() {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        data.push({
          id: i,
          name: 'Utilisateur ' + i,
          score: i,
          address: 'Adresse ' + i
        });
      }
      return {
        tableData: data
      };
    },

    methods: {
      handleRowClick(row) {
        this.$message('Cliqué : ' + row.name);
      }
    }
  };
</script>
```
:::

### Attributs de TableVirtual

| Attribut | Description | Type | Valeurs acceptées | Défaut |
|----------|-------------|------|-------------------|--------|
| data | Données de la table | array | — | — |
| height | Hauteur de la table, recommandé | string/number | — | — |
| max-height | Hauteur maximale de la table | string/number | — | — |
| row-height | Hauteur de ligne pour le scroll virtuel | number | — | 48 |
| overscan | Lignes supplémentaires rendues hors de la zone visible | number | — | 6 |
| stripe | Si la table est rayée | boolean | — | false |
| border | Si la table a des bordures verticales | boolean | — | false |
| size | Taille de la table | string | medium / small / mini | — |
| fit | Si les colonnes s'adaptent au conteneur | boolean | — | true |
| show-header | Si l'en-tête est visible | boolean | — | true |
| highlight-current-row | Si la ligne courante est mise en valeur | boolean | — | false |
| current-row-key | Clé de la ligne courante, propriété set-only | string/number | — | — |
| row-key | Clé des données de ligne | string/function | — | — |
| empty-text | Texte lorsque la table est vide | string | — | No Data |
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
|----------|-------------|------|-------------------|--------|
| prop | Nom du champ, alias de `property` | string | — | — |
| label | Texte d'en-tête | string | — | — |
| width | Largeur de colonne | string/number | — | — |
| min-width | Largeur minimale de colonne | string/number | — | 80 |
| fixed | Colonne fixe | boolean/string | true / left / right | — |
| align | Alignement | string | left / center / right | left |
| header-align | Alignement de l'en-tête | string | left / center / right | — |
| class-name | Classe de colonne | string | — | — |
| label-class-name | Classe d'en-tête | string | — | — |
| formatter | Formateur de cellule | function(row, column, cellValue, index) | — | — |
| render-header | Fonction de rendu de l'en-tête | function(h, scope) | — | — |
| sortable | Si la colonne est triable | boolean | — | false |
| sort-method | Méthode de tri | function(a, b) | — | — |
| sort-by | Champ de tri | string/function/array | — | — |
| sort-orders | Ordres de tri | array | ascending / descending / null | ['ascending', 'descending', null] |
| show-overflow-tooltip | Affiche un tooltip lorsque le contenu déborde | boolean | — | false |

### Évènements de TableVirtual

| Nom | Description | Paramètres |
|-----|-------------|------------|
| row-click | Se déclenche lors d'un clic sur une ligne | row, column, event |
| row-dblclick | Se déclenche lors d'un double clic sur une ligne | row, column, event |
| row-contextmenu | Se déclenche lors d'un clic droit sur une ligne | row, column, event |
| cell-click | Se déclenche lors d'un clic sur une cellule | row, column, cell, event |
| cell-dblclick | Se déclenche lors d'un double clic sur une cellule | row, column, cell, event |
| cell-mouse-enter | Se déclenche lorsque la souris entre dans une cellule | row, column, cell, event |
| cell-mouse-leave | Se déclenche lorsque la souris quitte une cellule | row, column, cell, event |
| header-click | Se déclenche lors d'un clic sur l'en-tête | column, event |
| header-contextmenu | Se déclenche lors d'un clic droit sur l'en-tête | column, event |
| current-change | Se déclenche lorsque la ligne courante change | currentRow, oldCurrentRow |
| sort-change | Se déclenche lorsque le tri change | { column, prop, order } |
| scroll | Se déclenche lors du scroll | { scrollTop, scrollLeft } |

### Méthodes de TableVirtual

| Méthode | Description | Paramètres |
|---------|-------------|------------|
| doLayout | Recalcule le layout | — |
| scrollTo | Scroll vers une position verticale | scrollTop |
| setCurrentRow | Définit la ligne courante | row |
| sort | Trie manuellement la table | prop, order |
| clearSort | Efface le tri | — |

### Slots de TableVirtual

| Nom | Description |
|-----|-------------|
| — | Slot par défaut pour déclarer `el-table-column` |
| empty | Contenu affiché lorsque la table est vide |
| append | Contenu inséré après la table |

### Scoped Slot de Column

| Nom | Description |
|-----|-------------|
| — | Contenu personnalisé de colonne. Le scope est `{ row, column, $index }` |
| header | Contenu personnalisé d'en-tête. Le scope est `{ column, $index }` |
