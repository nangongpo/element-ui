## Tableau virtualisé

Table V2 utilise `virtual-list` pour afficher de grands volumes de données. Ces exemples suivent l'organisation fonctionnelle de Element Plus Table V2 et utilisent l'API Options de Vue 2. L'ancienne syntaxe avec des enfants `el-table-column` n'est plus supportée : utilisez `columns` et `data`.

### Utilisation de base

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 120 }, { key: 'name', dataKey: 'name', title: 'Nom', width: 180 }, { key: 'address', dataKey: 'address', title: 'Adresse', width: 360 }], data: Array.from({ length: 1000 }, (_, id) => ({ id, name: 'Tom', address: 'Shanghai, Jinshajiang Road 1518' })) }; }
};
</script>
```
:::

### Colonnes et lignes fixes

La propriété `fixed` d'une colonne accepte `true`, `left` ou `right`. `fixed-data` affiche des lignes sous l'en-tête et les listes virtuelles synchronisent le défilement vertical.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :fixed-data="fixedData" :width="700" :height="400" fixed /></template>
<script>
export default {
  data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 100, fixed: 'left' }, { key: 'name', dataKey: 'name', title: 'Nom', width: 180 }, { key: 'address', dataKey: 'address', title: 'Adresse', width: 360 }, { key: 'action', title: 'Action', width: 120, fixed: 'right' }], fixedData: [{ id: 'fixed', name: 'Ligne fixe', address: 'Reste sous l\'en-tête' }], data: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Tom', address: 'Ligne ' + id })) }; }
};
</script>
```
:::

### En-tête groupé

Utilisez `children` dans `columns` pour créer des en-têtes à plusieurs niveaux.

### Données arborescentes et chargement différé

Utilisez `children` pour les nœuds imbriqués, `expand-column-key` pour la colonne extensible et `row-expand` pour charger les enfants de manière différée.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" expand-column-key="name" :width="700" :height="400" @row-expand="loadChildren" /></template>
<script>
export default {
  data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Nom', width: 260 }, { key: 'value', dataKey: 'value', title: 'Valeur', width: 200 }], data: [{ id: 1, name: 'Nœud 1', value: 'racine', children: [{ id: 2, name: 'Nœud 1-1', value: 'enfant' }] }, { id: 3, name: 'Nœud 2', value: 'différé', hasChildren: true }] }; },
  methods: { loadChildren({ expanded, rowData }) { if (expanded && rowData.hasChildren && !rowData.children) this.$set(rowData, 'children', [{ id: '3-1', name: 'Enfant chargé', value: 'loaded' }]); } }
};
</script>
```
:::

### Hauteur dynamique

La hauteur fixe est utilisée par défaut. Passez `estimated-row-height` pour mesurer la hauteur réelle de chaque ligne.

:::demo
```html
<template><el-table-v2 :columns="columns" :data="data" :estimated-row-height="50" :width="700" :height="400" fixed /></template>
<script>
export default { data() { return { columns: [{ key: 'name', dataKey: 'name', title: 'Nom', width: 150 }, { key: 'description', dataKey: 'description', title: 'Description', width: 500 }], data: Array.from({ length: 100 }, (_, id) => ({ id, name: 'Tom', description: id % 2 ? 'Texte court.' : 'Texte long pour démontrer la hauteur dynamique des lignes. '.repeat(3) })) }; } };
</script>
```
:::

### Rendu personnalisé, état et sélection

Utilisez les slots `cell` et `header-cell` pour les boutons, contrôles de sélection et filtres. Utilisez `row-class` pour appliquer une classe selon l'état de la ligne.

### Pied, état vide et overlay

Utilisez les slots `footer`, `empty` et `overlay`; `footer-height` participe au calcul de la hauteur du tableau.

:::demo
```html
<el-table-v2 :columns="columns" :data="data" :width="700" :height="400" :footer-height="50">
  <div slot="footer">Lignes : {{ data.length }}</div>
  <el-empty slot="empty" description="Aucune donnée" />
  <div slot="overlay">Chargement...</div>
</el-table-v2>
<script>
export default { data() { return { columns: [{ key: 'id', dataKey: 'id', title: 'ID', width: 180 }], data: [] }; } };
</script>
```
:::

### Défilement manuel

Avec un `ref`, utilisez `scrollTo`, `scrollToLeft`, `scrollToTop` et `scrollToRow`.

### API

Les attributs, colonnes, slots, événements et méthodes suivent [Element Plus TableV2](https://element-plus.org/fr-FR/component/table-v2.html). `width` et `height` sont obligatoires. Ce dépôt ne fournit pas `el-auto-resizer`; l'exemple de taille automatique utilise un listener `resize` de Vue 2.
