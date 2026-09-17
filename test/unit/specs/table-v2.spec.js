import Vue from 'vue';
import TableV2 from 'element-ui/packages/table-v2/src/table';
import { createVue, destroyVM, triggerEvent, wait } from '../util';

Vue.component(TableV2.name, TableV2);

const generateColumns = (length = 10, prefix = 'column-', props) =>
  Array.from({ length }).map((_, columnIndex) => Object.assign({}, props, {
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }));

const generateData = (columns, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => columns.reduce((rowData, column, columnIndex) => {
    rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
    return rowData;
  }, {
    id: `${prefix}${rowIndex}`,
    parentId: null
  }));

const columns = generateColumns(2);

describe('TableV2', () => {
  let vm;

  afterEach(() => {
    if (vm) destroyVM(vm);
    vm = null;
  });

  it('renders the Element Plus style columns/data API with virtualization', async() => {
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="200" :row-height="40" />',
      data: () => ({ columns, data: generateData(columns, 1000) })
    }, true);
    await wait(50);
    expect(vm.$el.querySelectorAll('.el-table-v2__row').length).to.be.below(40);
    expect(vm.$el.querySelector('.el-table-v2__header-cell').textContent).to.contain('Column 0');
    expect(vm.$el.textContent).to.contain('Row 0 - Col 0');
  });

  it('renders left and right fixed columns as independent grids', async() => {
    const fixedColumns = [
      { key: 'id', dataKey: 'id', title: 'ID', width: 80, fixed: 'left' },
      { key: 'name', dataKey: 'name', title: 'Name', width: 180 },
      { key: 'action', dataKey: 'action', title: 'Action', width: 80, fixed: 'right' }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="220" :height="200" />',
      data: () => ({ columns: fixedColumns, data: generateData(fixedColumns, 50) })
    }, true);
    await wait(50);
    expect(vm.$el.querySelector('.el-table-v2__fixed-left')).to.exist;
    expect(vm.$el.querySelector('.el-table-v2__fixed-right')).to.exist;
    expect(vm.$el.querySelector('.el-table-v2__header-fixed-left .el-table-v2__header-cell').textContent).to.contain('ID');
    expect(vm.$el.querySelector('.el-table-v2__header-fixed-right .el-table-v2__header-cell').textContent).to.contain('Action');
    expect(vm.$el.querySelectorAll('.el-table-v2__fixed-body .el-table-v2__row').length).to.be.above(0);
  });

  it('keeps the main scrollbar at the far right when both sides are fixed', async() => {
    const fixedColumns = [
      { key: 'left', dataKey: 'left', title: 'Left', width: 80, fixed: 'left' },
      { key: 'middle', dataKey: 'middle', title: 'Middle', width: 180 },
      { key: 'right', dataKey: 'right', title: 'Right', width: 80, fixed: 'right' }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="340" :height="200" />',
      data: () => ({ columns: fixedColumns, data: generateData(fixedColumns, 50) })
    }, true);
    await wait(50);
    const mainArea = vm.$el.querySelector('.el-table-v2__body-main').parentNode;
    const rightArea = vm.$el.querySelector('.el-table-v2__fixed-right');
    expect(mainArea.style.width).to.equal('340px');
    expect(mainArea.style.left).to.equal('0px');
    expect(rightArea.style.width).to.equal('80px');
    expect(mainArea.querySelector('.el-vl__window > div').style.marginLeft).to.equal('80px');
    expect(mainArea.querySelector('.el-virtual-scrollbar')).to.exist;
    expect(rightArea.querySelectorAll('.el-virtual-scrollbar').length).to.equal(2);
  });

  it('synchronizes vertical scrolling between all grids', async() => {
    const fixedColumns = [
      { key: 'id', dataKey: 'id', title: 'ID', width: 80, fixed: 'left' },
      { key: 'name', dataKey: 'name', title: 'Name', width: 180 }
    ];
    vm = createVue({
      template: '<el-table-v2 ref="table" :columns="columns" :data="data" :width="220" :height="200" />',
      data: () => ({ columns: fixedColumns, data: generateData(fixedColumns, 100) })
    }, true);
    await wait(50);
    vm.$refs.table.scrollToTop(300);
    await wait(30);
    expect(vm.$refs.table.scrollTop).to.equal(300);
    expect(vm.$refs.table.$refs.leftGrid.$refs.grid.state.scrollTop).to.equal(300);
  });

  it('updates cross-grid hover state', async() => {
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="200" />',
      data: () => ({ columns, data: generateData(columns, 20) })
    }, true);
    await wait(50);
    const row = vm.$el.querySelector('.el-table-v2__body-main .el-table-v2__row');
    triggerEvent(row, 'mouseenter');
    await wait(0);
    expect(vm.$el.querySelectorAll('.el-table-v2__row.hover-row').length).to.be.above(0);
    triggerEvent(row, 'mouseleave');
    await wait(0);
    expect(vm.$el.querySelectorAll('.el-table-v2__row.hover-row').length).to.equal(0);
  });

  it('supports dynamic row height and row-height estimation', async() => {
    const dynamicColumns = [{ key: 'name', dataKey: 'name', title: 'Name', width: 300 }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="200" :estimated-row-height="32" />',
      data: () => ({ columns: dynamicColumns, data: generateData(dynamicColumns, 20) })
    }, true);
    await wait(50);
    expect(vm.$refs).to.exist;
    expect(vm.$el.querySelectorAll('.el-table-v2__row').length).to.be.above(0);
  });

  it('expands tree rows and emits expanded-rows-change', async() => {
    const treeColumns = [{ key: 'name', dataKey: 'name', title: 'Name', width: 160 }];
    const tree = [{ id: 1, name: 'parent', children: [{ id: 2, name: 'child' }] }];
    let expanded;
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="200" expand-column-key="name" @expanded-rows-change="onExpand" />',
      data: () => ({ columns: treeColumns, data: tree }),
      methods: { onExpand(value) { expanded = value; } }
    }, true);
    await wait(50);
    const cell = vm.$el.querySelector('.el-table-v2__expand-icon');
    expect(cell).to.exist;
    triggerEvent(cell, 'click');
    await wait(30);
    expect(expanded).to.deep.equal([1]);
    expect(vm.$el.textContent).to.contain('child');
  });

  it('exposes scroll methods and emits rows-rendered', async() => {
    let rendered;
    vm = createVue({
      template: '<el-table-v2 ref="table" :columns="columns" :data="data" :width="320" :height="200" @rows-rendered="onRendered" />',
      data: () => ({ columns, data: generateData(columns, 100) }),
      methods: { onRendered(value) { rendered = value; } }
    }, true);
    await wait(50);
    vm.$refs.table.scrollToRow(10, 'start');
    await wait(30);
    expect(vm.$refs.table.scrollTop).to.be.above(0);
    expect(rendered).to.have.keys('rowCacheStart', 'rowCacheEnd', 'rowVisibleStart', 'rowVisibleEnd');
  });

  it('supports a custom cell renderer and passes the cell scope', async() => {
    let scope;
    const rendererColumns = [
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 160,
        cellRenderer(value) {
          scope = value;
          return `custom:${value.cellData}`;
        }
      }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="240" :height="160" />',
      data: () => ({ columns: rendererColumns, data: [{ id: 1, name: 'Alice' }] })
    }, true);
    await wait(50);
    expect(vm.$el.textContent).to.contain('custom:Alice');
    expect(scope.column.key).to.equal('name');
    expect(scope.rowIndex).to.equal(0);
    expect(scope.rowData.name).to.equal('Alice');
  });

  it('renders custom cell content in the fixed column grid', async() => {
    const rendererColumns = [
      {
        key: 'date',
        dataKey: 'date',
        title: 'Date',
        width: 150,
        fixed: 'left',
        cellRenderer: ({ cellData }) => `date:${cellData}`
      },
      { key: 'name', dataKey: 'name', title: 'Name', width: 160 }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="160" fixed />',
      data: () => ({ columns: rendererColumns, data: [{ id: 1, date: '2020-10-1', name: 'Alice' }] })
    }, true);
    await wait(50);
    const fixedLeftHeader = vm.$el.querySelector('.el-table-v2__header-fixed-left');
    const fixedLeft = vm.$el.querySelector('.el-table-v2__fixed-left');
    expect(fixedLeftHeader).to.exist;
    expect(fixedLeftHeader.textContent).to.contain('Date');
    expect(fixedLeft.textContent).to.contain('date:2020-10-1');
    expect(vm.$el.querySelector('.el-table-v2__body-main').textContent).to.contain('Alice');
  });

  it('renders VNode content from cellRenderer in a fixed date column', async() => {
    const rendererColumns = [{
      key: 'date',
      dataKey: 'date',
      title: 'Date',
      width: 150,
      fixed: 'left',
      cellRenderer: {
        functional: true,
        props: { cellData: String },
        render(h, context) {
          return h('span', { class: 'date-cell' }, [context.props.cellData]);
        }
      }
    }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="220" :height="160" />',
      data: () => ({ columns: rendererColumns, data: [{ id: 1, date: '2020-10-1' }] })
    }, true);
    await wait(50);
    const fixedLeft = vm.$el.querySelector('.el-table-v2__fixed-left');
    expect(fixedLeft).to.exist;
    expect(fixedLeft.textContent).to.contain('2020-10-1');
  });

  it('supports a custom header cell renderer and passes the header scope', async() => {
    let scope;
    const rendererColumns = [{
      key: 'name',
      dataKey: 'name',
      title: 'Name',
      width: 160,
      headerCellRenderer(value) {
        scope = value;
        return 'Custom Header';
      }
    }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="240" :height="160" />',
      data: () => ({ columns: rendererColumns, data: [{ id: 1, name: 'Alice' }] })
    }, true);
    await wait(50);
    expect(vm.$el.querySelector('.el-table-v2__header-cell').textContent).to.contain('Custom Header');
    expect(scope.column.key).to.equal('name');
    expect(scope.columnIndex).to.equal(0);
    expect(scope.headerIndex).to.equal(0);
  });

  it('passes the complete row scope to the row slot', async() => {
    let scope;
    vm = createVue({
      data: () => ({ columns, data: [{ id: 1, 'column-0': 'Alice' }] }),
      render(h) {
        return h('el-table-v2', {
          props: { columns: this.columns, data: this.data, width: 240, height: 160 },
          scopedSlots: {
            row: value => {
              scope = value;
              return h('div', { class: 'custom-row-slot' }, value.cells);
            }
          }
        });
      }
    }, true);
    await wait(30);
    expect(vm.$el.querySelector('.custom-row-slot')).to.exist;
    expect(scope.rowData.id).to.equal(1);
    expect(scope.rowIndex).to.equal(0);
    expect(scope.data).to.equal(scope.rowData);
    expect(scope.cells).to.have.length(columns.length);
  });

  it('passes the complete header scope to the header slot', async() => {
    let scope;
    vm = createVue({
      data: () => ({ columns, data: [{ id: 1, 'column-0': 'Alice' }] }),
      render(h) {
        return h('el-table-v2', {
          props: { columns: this.columns, data: this.data, width: 240, height: 160 },
          scopedSlots: {
            header: value => {
              scope = value;
              return h('div', { class: 'custom-header-slot' }, value.cells);
            }
          }
        });
      }
    }, true);
    await wait(30);
    expect(vm.$el.querySelector('.custom-header-slot')).to.exist;
    expect(scope.headerIndex).to.equal(0);
    expect(scope.columns.map(column => column.key)).to.deep.equal(columns.map(column => column.key));
    expect(scope.cells).to.have.length(columns.length);
  });

  it('supports empty and overlay scoped slots', async() => {
    vm = createVue({
      data: () => ({ columns, data: [] }),
      render(h) {
        return h('el-table-v2', {
          props: { columns: this.columns, data: this.data, width: 240, height: 160 },
          scopedSlots: {
            empty: () => [h('span', { class: 'custom-empty' }, ['No records'])],
            overlay: () => [h('span', { class: 'custom-overlay' }, ['Loading'])]
          }
        });
      }
    }, true);
    await wait(30);
    expect(vm.$el.querySelector('.custom-empty').textContent).to.equal('No records');
    expect(vm.$el.querySelector('.custom-overlay').textContent).to.equal('Loading');
    expect(vm.$el.querySelector('.el-empty')).to.not.exist;
  });

  it('supports fixed data rendered above the virtualized rows', async() => {
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :fixed-data="fixedData" :width="320" :height="180" />',
      data: () => ({
        columns,
        data: generateData(columns, 100),
        fixedData: [{ id: 'summary', 'column-0': 'Summary' }]
      })
    }, true);
    await wait(50);
    const fixedRow = vm.$el.querySelector('.el-table-v2__fixed-data .el-table-v2__row');
    expect(fixedRow).to.exist;
    expect(fixedRow.textContent).to.contain('Summary');
  });

  it('moves main fixed data with horizontal scrolling', async() => {
    const stickyColumns = [
      { key: 'first', dataKey: 'first', title: 'First', width: 180 },
      { key: 'second', dataKey: 'second', title: 'Second', width: 180 }
    ];
    vm = createVue({
      template: '<el-table-v2 ref="table" :columns="columns" :data="data" :fixed-data="fixedData" :width="240" :height="180" />',
      data: () => ({
        columns: stickyColumns,
        data: generateData(stickyColumns, 100),
        fixedData: [{ id: 'summary', first: 'Summary' }]
      })
    }, true);
    await wait(50);
    vm.$refs.table.scrollToLeft(60);
    await wait(30);
    const fixedRow = vm.$el.querySelector('.el-table-v2__main .el-table-v2__fixed-data .el-table-v2__row');
    expect(fixedRow).to.exist;
    expect(fixedRow.style.transform).to.equal('translateX(-60px)');
  });

  it('applies row class, row props, cell props and row event handlers', async() => {
    let clicked;
    const row = { id: 1, name: 'Alice' };
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="320" :height="160" :row-class="rowClass" :row-props="rowProps" :cell-props="cellProps" :row-event-handlers="rowEventHandlers" />',
      data: () => ({
        columns,
        data: [row],
        rowClass: ({ rowData }) => rowData.id === 1 ? 'custom-row' : '',
        rowProps: ({ rowData }) => ({ style: { backgroundColor: rowData.id === 1 ? 'red' : '' } }),
        cellProps: ({ column }) => ({ class: column.key === 'column-1' ? 'custom-cell' : '' }),
        rowEventHandlers: { onClick: payload => { clicked = payload; } }
      })
    }, true);
    await wait(50);
    const rowElement = vm.$el.querySelector('.el-table-v2__body-main .el-table-v2__row');
    expect(rowElement.classList.contains('custom-row')).to.equal(true);
    expect(rowElement.style.backgroundColor).to.equal('red');
    expect(vm.$el.querySelector('.custom-cell')).to.exist;
    triggerEvent(rowElement, 'click');
    expect(clicked.rowKey).to.equal(1);
    expect(clicked.rowData).to.equal(row);
  });

  it('emits column-sort and exposes sort state on sortable headers', async() => {
    let sort;
    const sortableColumns = [{ key: 'name', dataKey: 'name', title: 'Name', width: 160, sortable: true }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :sort-by="sortBy" :width="240" :height="160" @column-sort="onSort" />',
      data: () => ({ columns: sortableColumns, data: [{ id: 1, name: 'Alice' }], sortBy: { key: 'name', order: 'asc' } }),
      methods: { onSort(value) { sort = value; } }
    }, true);
    await wait(30);
    const header = vm.$el.querySelector('.el-table-v2__header-cell.is-sortable');
    expect(header).to.exist;
    expect(header.getAttribute('aria-sort')).to.equal('asc');
    expect(vm.$el.querySelector('.el-table-v2__sort-icon')).to.exist;
    triggerEvent(header, 'click');
    expect(sort.key).to.equal('name');
    expect(sort.order).to.equal('desc');
  });

  it('honors column flexGrow and flexShrink styles', async() => {
    const styledColumns = [
      { key: 'first', dataKey: 'first', title: 'First', width: 120, flexGrow: 1, flexShrink: 0 },
      { key: 'second', dataKey: 'second', title: 'Second', width: 120, flexShrink: 0 }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="300" :height="160" />',
      data: () => ({ columns: styledColumns, data: [{ id: 1, first: 'A', second: 'B' }] })
    }, true);
    await wait(30);
    const cells = vm.$el.querySelectorAll('.el-table-v2__row .el-table-v2__cell');
    expect(cells[0].style.flexGrow).to.equal('1');
    expect(cells[0].style.flexShrink).to.equal('0');
    expect(cells[1].style.flexShrink).to.equal('0');
  });

  it('does not enable tree indentation unless expand-column-key matches', async() => {
    const noExpandKeyColumns = [
      { key: 'first', title: 'First', width: 120, cellRenderer: ({ rowIndex }) => String(rowIndex) },
      { key: 'expand', title: 'Expand', width: 120, cellRenderer: ({ rowIndex }) => String(rowIndex) }
    ];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :width="300" :height="160" />',
      data: () => ({ columns: noExpandKeyColumns, data: [{ id: 1, first: 'A', children: [{ id: 2, first: 'B' }] }] })
    }, true);
    await wait(30);
    expect(vm.$el.querySelector('.el-table-v2__expand-icon')).to.not.exist;
  });

  it('supports nested data keys through dataGetter', async() => {
    const getterColumns = [{ key: 'name', dataKey: 'name', title: 'Name', width: 160 }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" :data-getter="dataGetter" :width="240" :height="160" />',
      data: () => ({
        columns: getterColumns,
        data: [{ id: 1, profile: { name: 'Alice' } }],
        dataGetter: ({ rowData }) => rowData.profile.name
      })
    }, true);
    await wait(30);
    expect(vm.$el.textContent).to.contain('Alice');
  });

  it('keeps horizontal scroll position when scrolling to a row', async() => {
    const scrollEvents = [];
    vm = createVue({
      template: '<el-table-v2 ref="table" :columns="columns" :data="data" :width="220" :height="160" @scroll="onScroll" />',
      data: () => ({ columns: [{ key: 'name', dataKey: 'name', title: 'Name', width: 400 }], data: generateData([{ key: 'name', dataKey: 'name', title: 'Name', width: 400 }], 100) }),
      methods: { onScroll(value) { scrollEvents.push(value); } }
    }, true);
    await wait(50);
    vm.$refs.table.scrollToLeft(80);
    vm.$refs.table.scrollToRow(20);
    await wait(30);
    expect(vm.$refs.table.scrollLeft).to.equal(80);
    expect(scrollEvents.length).to.be.above(0);
  });

  it('renders accessible expand and sort controls', async() => {
    const accessibleColumns = [{ key: 'name', dataKey: 'name', title: 'Name', width: 160, sortable: true }];
    vm = createVue({
      template: '<el-table-v2 :columns="columns" :data="data" expand-column-key="name" :sort-by="sortBy" :width="240" :height="160" />',
      data: () => ({
        columns: accessibleColumns,
        data: [{ id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] }],
        sortBy: { key: 'name', order: 'asc' }
      })
    }, true);
    await wait(30);
    const expand = vm.$el.querySelector('.el-table-v2__expand-icon');
    const header = vm.$el.querySelector('.el-table-v2__header-cell.is-sortable');
    expect(expand.getAttribute('role')).to.equal('button');
    expect(expand.getAttribute('aria-expanded')).to.equal('false');
    expect(header.getAttribute('role')).to.equal('columnheader');
    expect(header.getAttribute('aria-sort')).to.equal('asc');
  });
});
