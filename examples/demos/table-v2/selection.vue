<template
  ><el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed
/></template>
<script lang="jsx">
import ElCheckbox from 'element-ui/packages/checkbox';

const generateColumns = (length = 10) => Array.from({ length }).map((_, i) => ({ key: 'column-' + i, dataKey: 'column-' + i, title: 'Column ' + i, width: 150 }));
const generateData = (columns, length = 200) => Array.from({ length }).map((_, rowIndex) => columns.reduce((row, column, columnIndex) => { row[column.dataKey] = 'Row ' + rowIndex + ' - Col ' + columnIndex; return row; }, { id: 'row-' + rowIndex, checked: false, parentId: null }));
export default { data() { const columns = generateColumns(); columns.unshift({ key: 'selection', width: 50, fixed: 'left', cellRenderer: ({ rowData }) => <ElCheckbox value={rowData.checked} onChange={value => { rowData.checked = value; }} />, headerCellRenderer: () => { const all = this.data.length > 0 && this.data.every(row => row.checked); const some = this.data.some(row => row.checked) && !all; return <ElCheckbox value={all} indeterminate={some} onChange={value => this.data.forEach(row => { row.checked = value; })} />; } }); return { columns, data: generateData(columns) }; } };
</script>
