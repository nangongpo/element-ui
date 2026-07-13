import Vue from 'vue';
import TableVirtual from 'element-ui/packages/table-virtual/src/table-virtual';
import domScheduler from 'element-ui/src/utils/dom-scheduler';
import { createVue, destroyVM, triggerEvent, wait, waitImmediate } from '../util';

const getData = function(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      name: 'Name ' + i,
      score: count - i,
      address: 'Address ' + i
    });
  }
  return data;
};

describe('TableVirtual', () => {
  let vm;
  let oldElement;
  let oldRequestAnimationFrame;
  let oldCancelAnimationFrame;

  afterEach(() => {
    if (vm) {
      destroyVM(vm);
      vm = null;
    }
    Vue.prototype.$ELEMENT = oldElement;
    if (oldRequestAnimationFrame) {
      window.requestAnimationFrame = oldRequestAnimationFrame;
      oldRequestAnimationFrame = null;
    }
    if (oldCancelAnimationFrame) {
      window.cancelAnimationFrame = oldCancelAnimationFrame;
      oldCancelAnimationFrame = null;
    }
  });

  describe('Milestone 1: table props and virtual layout', () => {
    it('renders only visible rows', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column prop="address" label="Address" width="240" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      const rows = vm.$el.querySelectorAll('.el-table-virtual__body-wrapper .el-table-virtual__row');
      expect(rows.length).to.be.above(0);
      expect(rows.length).to.be.below(40);
      expect(vm.$el.textContent).to.contain('Name 0');
    });

    it('reloads data through a non-reactive internal data source', async() => {
      const tableData = getData(1000);
      vm = createVue({
        template: `
        <el-table-virtual ref="table" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `
      }, true);

      await wait(50);
      vm.$refs.table.reloadData(tableData);
      await wait(50);

      const table = vm.$refs.table;
      const rows = vm.$el.querySelectorAll('.el-table-virtual__body-wrapper .el-table-virtual__row');
      expect(table.useInternalData).to.true;
      expect(table.tableData).to.equal(tableData);
      expect(table.totalHeight).to.equal(40000);
      expect(rows.length).to.be.above(0);
      expect(rows.length).to.be.below(40);
      expect(vm.$el.textContent).to.contain('Name 0');
      expect(tableData.__ob__).to.equal(undefined);
      expect(tableData[0].__ob__).to.equal(undefined);

      table.scrollTo(400);
      await wait(50);
      expect(table.start).to.be.above(0);
      table.reloadData(getData(10));
      await wait(50);
      expect(table.scrollTop).to.equal(0);
      expect(table.start).to.equal(0);
      expect(table.totalHeight).to.equal(400);
    });

    it('uses height prop or row height natural size', async() => {
      vm = createVue({
        template: `
        <div>
          <el-table-virtual ref="fixed" :data="tableData" height="240" row-key="id" :row-height="40">
            <el-table-column prop="id" label="ID" width="80" />
          </el-table-virtual>
          <el-table-virtual ref="natural" :data="smallData" row-key="id" :row-height="40">
            <el-table-column prop="id" label="ID" width="80" />
          </el-table-virtual>
          <el-table-virtual ref="border" :data="smallData" row-key="id" :row-height="40" border>
            <el-table-column prop="id" label="ID" width="80" />
          </el-table-virtual>
        </div>
      `,
        data() {
          return {
            tableData: getData(100),
            smallData: getData(3)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$refs.fixed.$el.style.height).to.equal('240px');
      expect(vm.$refs.natural.$el.style.height).to.equal(vm.$refs.natural.naturalHeight + 'px');
      expect(vm.$refs.border.$el.style.height).to.equal(vm.$refs.border.naturalHeight + 'px');
      expect(vm.$refs.border.hasVerticalScroll).to.false;
    });

    it('keeps border left line while body scrolls', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="120" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const body = vm.$el.querySelector('.el-table-virtual__body-wrapper');
      body.scrollTop = 200;
      triggerEvent(body, 'scroll');
      await wait(50);
      expect(window.getComputedStyle(body).borderLeftWidth).to.equal('1px');
    });

    it('applies stripe classes', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40" stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$el.classList.contains('el-table-virtual--striped')).to.true;
      expect(vm.$el.querySelectorAll('.el-table__row--striped').length).to.be.above(0);
    });

    it('uses global size when size is not set', async() => {
      oldElement = Vue.prototype.$ELEMENT;
      Vue.prototype.$ELEMENT = { size: 'small' };
      vm = createVue({
        template: `
        <div>
          <el-table-virtual ref="global" :data="tableData" height="240" row-key="id" :row-height="40">
            <el-table-column prop="id" label="ID" width="80" />
          </el-table-virtual>
          <el-table-virtual ref="local" :data="tableData" height="240" row-key="id" :row-height="40" size="mini">
            <el-table-column prop="id" label="ID" width="80" />
          </el-table-virtual>
        </div>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$refs.global.$el.classList.contains('el-table--small')).to.true;
      expect(vm.$refs.global.$el.classList.contains('el-table-virtual--small')).to.true;
      expect(vm.$refs.local.$el.classList.contains('el-table--mini')).to.true;
      expect(vm.$refs.local.$el.classList.contains('el-table-virtual--mini')).to.true;
    });

    it('applies style and class callback props', async() => {
      vm = createVue({
        template: `
        <el-table-virtual
          :data="tableData"
          height="240"
          max-height="320"
          row-key="id"
          :row-height="40"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :cell-class-name="cellClassName"
          :cell-style="cellStyle"
          :header-row-class-name="headerRowClassName"
          :header-row-style="headerRowStyle"
          :header-cell-class-name="headerCellClassName"
          :header-cell-style="headerCellStyle">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        },
        methods: {
          rowClassName({ rowIndex }) {
            return rowIndex === 0 ? 'row-api-class' : '';
          },
          rowStyle() {
            return { color: 'rgb(1, 2, 3)' };
          },
          cellClassName({ columnIndex }) {
            return columnIndex === 0 ? 'cell-api-class' : '';
          },
          cellStyle() {
            return { backgroundColor: 'rgb(4, 5, 6)' };
          },
          headerRowClassName() {
            return 'header-row-api-class';
          },
          headerRowStyle() {
            return { color: 'rgb(7, 8, 9)' };
          },
          headerCellClassName({ columnIndex }) {
            return columnIndex === 0 ? 'header-cell-api-class' : '';
          },
          headerCellStyle() {
            return { backgroundColor: 'rgb(10, 11, 12)' };
          }
        }
      }, true);

      await wait(50);
      expect(vm.$el.style.maxHeight).to.equal('320px');
      expect(vm.$el.querySelector('.row-api-class').style.color).to.equal('rgb(1, 2, 3)');
      expect(vm.$el.querySelector('.cell-api-class').style.backgroundColor).to.equal('rgb(4, 5, 6)');
      expect(vm.$el.querySelector('.header-row-api-class').style.color).to.equal('rgb(7, 8, 9)');
      expect(vm.$el.querySelector('.header-cell-api-class').style.backgroundColor).to.equal('rgb(10, 11, 12)');
    });

    it('supports empty and append slots and hidden header', async() => {
      vm = createVue({
        template: `
        <div>
          <el-table-virtual ref="empty" :data="[]" height="160" empty-text="No rows" :show-header="false">
            <el-table-column prop="name" label="Name" width="160" />
            <template slot="empty">Custom empty</template>
          </el-table-virtual>
          <el-table-virtual ref="append" :data="tableData" height="180" row-key="id">
            <el-table-column prop="name" label="Name" width="160" />
            <template slot="append"><div class="append-api-slot">Append slot</div></template>
          </el-table-virtual>
        </div>
      `,
        data() {
          return {
            tableData: getData(3)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$refs.empty.$el.querySelector('.el-table-virtual__header-wrapper')).to.not.exist;
      expect(vm.$refs.empty.$el.textContent).to.contain('Custom empty');
      expect(vm.$refs.append.$el.querySelector('.append-api-slot').textContent).to.equal('Append slot');
    });

    it('updates visible range when scrollTo is called', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      vm.$refs.table.scrollTo(400);
      await wait(50);
      expect(vm.$refs.table.start).to.equal(4);
      expect(vm.$el.textContent).to.contain('Name 4');
    });

    it('updates layout when doLayout is called', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="name" label="Name" width="100" />
          <el-table-column prop="address" label="Address" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      Object.defineProperty(body, 'offsetWidth', { configurable: true, value: 640 });
      Object.defineProperty(body, 'offsetHeight', { configurable: true, value: 160 });
      table.doLayout();
      expect(table.bodyWidth).to.equal(640 - table.scrollbarWidth);
      expect(table.bodyHeight).to.equal(160);
      expect(table.end).to.be.above(table.start);
    });

    it('coalesces scheduled layout reads through dom scheduler', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const registerSpy = sinon.spy(domScheduler, 'register');
      try {
        table.scheduleLayout();
        table.scheduleLayout();
        await table.$nextTick();

        expect(registerSpy).to.have.been.calledOnce;
        expect(registerSpy.firstCall.args[0].vm).to.equal(table);
        expect(registerSpy.firstCall.args[0].read).to.equal(table.readLayoutMetrics);
        expect(registerSpy.firstCall.args[0].write).to.equal(table.applyScheduledLayout);
      } finally {
        registerSpy.restore();
      }
    });

    it('keeps auto-height resize-only layout optimization', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(2)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      table.resizeState = { width: 500, height: 120 };
      table.layoutForce = false;
      const layoutSpy = sinon.spy(table, 'doLayout');
      try {
        table.applyScheduledLayout({
          bodyWidth: 500,
          bodyHeight: 80,
          width: 500,
          height: 160
        });

        expect(layoutSpy).not.to.have.been.called;
        expect(table.resizeState.height).to.equal(160);
      } finally {
        layoutSpy.restore();
      }
    });

  });

  describe('Milestone 1: current row methods and events', () => {
    it('supports current row key and setCurrentRow method', async() => {
      const currentChange = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual
          ref="table"
          :data="tableData"
          height="240"
          :row-key="getRowKey"
          current-row-key="row-2"
          highlight-current-row
          @current-change="currentChange">
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        },
        methods: {
          getRowKey(row) {
            return 'row-' + row.id;
          },
          currentChange
        }
      }, true);

      await wait(50);
      expect(vm.$refs.table.currentRow.id).to.equal(2);
      vm.$refs.table.setCurrentRow(vm.tableData[3]);
      await wait(50);
      expect(vm.$refs.table.currentRow.id).to.equal(3);
      expect(currentChange.calledOnce).to.true;
      expect(currentChange.args[0][0].id).to.equal(3);
      expect(currentChange.args[0][1].id).to.equal(2);
    });

  });

  describe('Milestone 1: fixed columns and sizing', () => {
    it('renders fixed columns in separated layers', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" border>
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table-virtual__fixed-left')).to.exist;
      expect(vm.$el.querySelector('.el-table-virtual__fixed-right')).to.exist;
      expect(window.getComputedStyle(vm.$el.querySelector('.el-table-virtual__fixed-body.el-table-virtual__fixed-left')).borderLeftWidth).to.equal('1px');
      vm.$refs.table.scrollTo(400);
      await wait(50);
      expect(vm.$el.querySelector('.el-table-virtual__fixed-body .el-table-virtual__rows').style.transform).to.contain('translate');
    });

    it('keeps vertical scrollbar outside right fixed columns', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      const body = vm.$el.querySelector('.el-table-virtual__body-wrapper');
      const fixedRight = vm.$el.querySelector('.el-table-virtual__fixed-body.el-table-virtual__fixed-right');
      expect(body.style.right).to.equal('');
      expect(fixedRight.style.right).to.equal(vm.$refs.table.scrollbarWidth + 'px');
    });

    it('keeps horizontal scrollbar when right fixed columns reserve scroll space', async() => {
      vm = createVue({
        template: `
        <div style="width: 500px;">
          <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" border>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
            <el-table-column fixed="right" prop="score" label="Score" width="100" />
          </el-table-virtual>
        </div>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const phantom = vm.$el.querySelector('.el-table-virtual__phantom');
      expect(table.hasHorizontalScroll).to.true;
      expect(phantom.style.width).to.equal(table.mainWidth + table.fixedRightWidth + 'px');
    });

    it('covers right fixed header gutter when vertical scrollbar is visible', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(1000)
          };
        }
      }, true);

      await wait(50);
      const gutter = vm.$el.querySelector('.el-table-virtual__fixed-right-gutter');
      if (vm.$refs.table.scrollbarWidth) {
        expect(gutter).to.exist;
        expect(gutter.style.width).to.equal(vm.$refs.table.scrollbarWidth + 'px');
      } else {
        expect(gutter).to.not.exist;
      }
    });

    it('expands columns without width instead of forcing them to 80px', async() => {
      vm = createVue({
        template: `
        <div style="width: 500px;">
          <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="name" label="Name" width="100" />
            <el-table-column prop="address" label="Address" />
          </el-table-virtual>
        </div>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const column = vm.$refs.table.columns[2];
      expect(column.realWidth).to.be.above(80);
    });

    it('updates flex column width when table element resizes', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="name" label="Name" width="100" />
          <el-table-column prop="address" label="Address" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      Object.defineProperty(table.$el, 'offsetWidth', { configurable: true, value: 500 });
      Object.defineProperty(table.$el, 'offsetHeight', { configurable: true, value: 240 });
      Object.defineProperty(body, 'offsetWidth', { configurable: true, value: 500 });
      Object.defineProperty(body, 'offsetHeight', { configurable: true, value: 192 });
      table.resizeState.width = 500;
      table.resizeState.height = 240;
      table.doLayout();
      const oldWidth = table.columns[2].realWidth;

      Object.defineProperty(table.$el, 'offsetWidth', { configurable: true, value: 700 });
      Object.defineProperty(body, 'offsetWidth', { configurable: true, value: 700 });
      table.resizeListener();
      await wait(50);

      expect(table.resizeState.width).to.equal(700);
      expect(table.columns[2].realWidth).to.be.above(oldWidth);
    });

  });

  describe('Milestone 1: column props and scoped slots', () => {
    it('supports column scoped slot and row events', async() => {
      const rowClick = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40" @row-click="rowClick">
          <el-table-column prop="name" label="Name" width="160">
            <template slot-scope="scope">Custom {{ scope.row.name }}</template>
          </el-table-column>
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        },
        methods: {
          rowClick
        }
      }, true);

      await wait(50);
      expect(vm.$el.textContent).to.contain('Custom Name 0');
      triggerEvent(vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell'), 'click', true, false);
      expect(rowClick.calledOnce).to.true;
      expect(rowClick.args[0][0].name).to.equal('Name 0');
    });

    it('passes visible zero-based $index to column scoped slot', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="120" row-key="id" :row-height="40" :overscan="0">
          <el-table-column prop="name" label="Name" width="160">
            <template slot-scope="scope">{{ scope.$index }}:{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column type="index" label="#" width="80" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell').textContent).to.contain('0:Name 0');

      vm.$refs.table.scrollTo(120);
      await waitImmediate();
      const cells = vm.$el.querySelectorAll('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      expect(cells[0].textContent).to.contain('0:Name 3');
      expect(cells[1].textContent).to.contain('4');
    });

    it('supports column attributes', async() => {
      const warnStub = sinon.stub(console, 'warn');
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40" :render-header="renderHeader">
          <el-table-column
            prop="score"
            label="Score"
            width="120"
            align="right"
            header-align="center"
            class-name="score-column-class"
            label-class-name="score-header-class"
            :formatter="formatter"
            :render-header="renderHeader" />
          <el-table-column prop="address" label="Address" min-width="180" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        },
        methods: {
          formatter(row, column, value) {
            return 'Score: ' + value;
          },
          renderHeader(h, { column }) {
            return h('span', 'Rendered ' + column.property);
          }
        }
      }, true);

      await wait(50);
      const headerCell = vm.$el.querySelector('.el-table-virtual__header-wrapper .el-table-virtual__cell');
      const bodyCell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      expect(headerCell.classList.contains('is-center')).to.true;
      expect(headerCell.classList.contains('score-header-class')).to.true;
      expect(headerCell.textContent).to.contain('Rendered score');
      expect(bodyCell.classList.contains('is-right')).to.true;
      expect(bodyCell.classList.contains('score-column-class')).to.true;
      expect(bodyCell.textContent).to.contain('Score: 20');
      expect(warnStub.calledWith(
        '[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.'
      )).to.true;
      warnStub.restore();
      expect(bodyCell.hasAttribute('title')).to.false;
      expect(bodyCell.hasAttribute('attrs')).to.false;
    });

  });

  describe('Milestone 2: index column', () => {
    it('renders index column with index prop', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column type="index" label="#" width="80" :index="indexMethod" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        },
        methods: {
          indexMethod(index) {
            return index + 10;
          }
        }
      }, true);

      await wait(50);
      const headerCell = vm.$el.querySelector('.el-table-virtual__header-wrapper .el-table-virtual__cell');
      const firstBodyCell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      expect(headerCell.textContent).to.contain('#');
      expect(firstBodyCell.textContent).to.contain('10');
    });

  });

  describe('Milestone 1: row, cell and header events', () => {
    it('supports table events', async() => {
      const spies = {
        cellClick: sinon.spy(),
        cellDblclick: sinon.spy(),
        rowClick: sinon.spy(),
        rowDblclick: sinon.spy(),
        rowContextmenu: sinon.spy(),
        cellMouseEnter: sinon.spy(),
        cellMouseLeave: sinon.spy(),
        cellContextmenu: sinon.spy(),
        headerClick: sinon.spy(),
        headerContextmenu: sinon.spy(),
        scroll: sinon.spy()
      };
      vm = createVue({
        template: `
        <el-table-virtual
          ref="table"
          :data="tableData"
          height="240"
          row-key="id"
          :row-height="40"
          @cell-click="cellClick"
          @cell-dblclick="cellDblclick"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @row-contextmenu="rowContextmenu"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @cell-contextmenu="cellContextmenu"
          @header-click="headerClick"
          @header-contextmenu="headerContextmenu"
          @scroll="scroll">
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        },
        methods: spies
      }, true);

      await wait(50);
      const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      const headerCell = vm.$el.querySelector('.el-table-virtual__header-wrapper .el-table-virtual__cell');
      const body = vm.$refs.table.$refs.body;

      triggerEvent(cell, 'mouseenter', true, false);
      triggerEvent(cell, 'mouseleave', true, false);
      triggerEvent(cell, 'click', true, false);
      triggerEvent(cell, 'dblclick', true, false);
      triggerEvent(cell, 'contextmenu', true, false);
      triggerEvent(headerCell, 'click', true, false);
      triggerEvent(headerCell, 'contextmenu', true, false);
      body.scrollTop = 80;
      triggerEvent(body, 'scroll', true, false);
      await wait(50);

      expect(spies.cellMouseEnter.calledOnce).to.true;
      expect(spies.cellMouseLeave.calledOnce).to.true;
      expect(spies.cellClick.calledOnce).to.true;
      expect(spies.rowClick.calledOnce).to.true;
      expect(spies.cellDblclick.calledOnce).to.true;
      expect(spies.rowDblclick.calledOnce).to.true;
      expect(spies.cellContextmenu.calledOnce).to.true;
      expect(spies.rowContextmenu.calledOnce).to.true;
      expect(spies.cellContextmenu.args[0][1].property).to.equal('name');
      expect(spies.rowContextmenu.args[0][1].property).to.equal('name');
      expect(spies.headerClick.calledOnce).to.true;
      expect(spies.headerContextmenu.calledOnce).to.true;
      expect(spies.scroll.calledOnce).to.true;
      expect(spies.scroll.args[0][0].scrollTop).to.equal(80);
    });

    it('clears hover row classes when body scrolls', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');

      triggerEvent(cell, 'mouseenter', true, false);
      await waitImmediate();
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(3);

      table.lastMouseClientX = null;
      table.lastMouseClientY = null;
      body.scrollTop = 160;
      triggerEvent(body, 'scroll', true, false);
      await wait(50);

      expect(table.hoverRow).to.equal(null);
      expect(table.hoverRowVisibleIndex).to.equal(null);
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(0);
    });

    it('syncs fixed rows immediately and settles hover when scroll frame is pending', async() => {
      oldRequestAnimationFrame = window.requestAnimationFrame;
      window.requestAnimationFrame = function() {
        return 23456;
      };

      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      const fixedRows = vm.$el.querySelectorAll('.el-table-virtual__fixed-body .el-table-virtual__rows');
      Object.defineProperty(body, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 0, bottom: 240, left: 0, right: 400 };
        }
      });

      triggerEvent(cell, 'mouseenter', true, false);
      await waitImmediate();
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(3);

      table.handleBodyMouseMove({ clientX: 120, clientY: 20 });
      expect(table.hoverRow.id).to.equal(0);
      body.scrollTop = 160;
      triggerEvent(body, 'scroll', true, false);

      expect(table.scrollFrame).to.equal(23456);
      expect(table.hoverRow).to.equal(null);
      expect(table.hoverRowVisibleIndex).to.equal(null);
      expect(fixedRows[0].style.transform).to.contain('-160px');
      expect(fixedRows[1].style.transform).to.contain('-160px');
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(0);

      await wait(160);

      expect(table.hoverRow.id).to.equal(4);
      expect(table.hoverRowVisibleIndex).to.equal(4);
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(3);
    });

    it('tracks fixed row position on wheel after native scroll updates', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const fixedRows = vm.$el.querySelectorAll('.el-table-virtual__fixed-body .el-table-virtual__rows');
      Object.defineProperty(body, 'scrollHeight', { configurable: true, value: 4000 });
      Object.defineProperty(body, 'clientHeight', { configurable: true, value: 240 });
      body.scrollTop = 40;

      table.handleBodyWheel({ deltaY: 80, deltaMode: 0 });
      body.scrollTop = 120;
      await wait(50);

      expect(fixedRows[0].style.transform).to.contain('-120px');
      expect(fixedRows[1].style.transform).to.contain('-120px');
    });

    it('does not start fixed scroll sync outside the visible body area', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const fixedRows = vm.$el.querySelectorAll('.el-table-virtual__fixed-body .el-table-virtual__rows');
      Object.defineProperty(body, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 40, bottom: 240, left: 0, right: 400 };
        }
      });
      Object.defineProperty(body, 'scrollHeight', { configurable: true, value: 4000 });
      Object.defineProperty(body, 'clientHeight', { configurable: true, value: 200 });
      body.scrollTop = 40;

      const isClientInBodyArea = table.isClientInBodyArea;
      table.isClientInBodyArea = function() {
        return false;
      };
      table.handleBodyWheel({ deltaY: 80, deltaMode: 0, clientX: 120, clientY: 20 });
      table.isClientInBodyArea = isClientInBodyArea;

      expect(table.fixedScrollFrame).to.equal(null);
      expect(table.fixedScrollTimer).to.equal(null);
      expect(fixedRows[0].style.transform).to.not.contain('-120px');
      expect(fixedRows[1].style.transform).to.not.contain('-120px');
    });

    it('syncs fixed hover classes while body scrolls under pointer', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      Object.defineProperty(body, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 0, bottom: 240, left: 0, right: 400 };
        }
      });

      table.handleBodyMouseMove({ clientX: 120, clientY: 20 });
      body.scrollTop = 160;
      triggerEvent(body, 'scroll', true, false);
      await wait(160);

      expect(table.hoverRow.id).to.equal(4);
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(3);
    });

    it('syncs hover classes after scrolling while pointer stays over fixed columns', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column fixed prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column fixed="right" prop="score" label="Score" width="100" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const fixedLeft = vm.$el.querySelector('.el-table-virtual__fixed-body.el-table-virtual__fixed-left');
      Object.defineProperty(body, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 0, bottom: 240, left: 80, right: 400 };
        }
      });
      Object.defineProperty(fixedLeft, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 0, bottom: 240, left: 0, right: 80 };
        }
      });

      table.handleBodyMouseMove({ clientX: 40, clientY: 20 });
      body.scrollTop = 160;
      triggerEvent(body, 'scroll', true, false);
      await wait(160);

      expect(table.hoverRow.id).to.equal(4);
      expect(table.hoverRowVisibleIndex).to.equal(4);
      expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.equal(3);
    });

  });

  describe('Milestone 2: sorting', () => {
    it('supports sorting props and methods', async() => {
      const sortChange = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual
          ref="table"
          :data="tableData"
          height="240"
          row-key="id"
          :default-sort="{ prop: 'score', order: 'ascending' }"
          @sort-change="sortChange">
          <el-table-column
            prop="score"
            label="Score"
            width="120"
            sortable
            :sort-method="sortMethod"
            :sort-orders="['descending', null]" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(5)
          };
        },
        methods: {
          sortMethod(a, b) {
            return a.score - b.score;
          },
          sortChange
        }
      }, true);

      await wait(50);
      expect(vm.$refs.table.visibleRows[0].score).to.equal(1);
      sortChange.resetHistory();
      vm.$refs.table.sort('score', 'descending');
      await wait(50);
      expect(vm.$refs.table.visibleRows[0].score).to.equal(5);
      expect(sortChange.calledOnce).to.true;
      expect(sortChange.args[0][0].prop).to.equal('score');
      expect(sortChange.args[0][0].order).to.equal('descending');
      vm.$refs.table.clearSort();
      await wait(50);
      expect(vm.$refs.table.sortOrder).to.equal(null);
      expect(sortChange.calledTwice).to.true;
    });

    it('keeps custom sorting external', async() => {
      const sortChange = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" @sort-change="sortChange">
          <el-table-column prop="score" label="Score" width="120" sortable="custom" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(5)
          };
        },
        methods: {
          sortChange
        }
      }, true);

      await wait(50);
      vm.$refs.table.sort('score', 'ascending');
      await wait(50);
      expect(vm.$refs.table.visibleRows[0].score).to.equal(5);
      expect(sortChange.calledOnce).to.true;
      expect(sortChange.args[0][0].order).to.equal('ascending');
    });

    it('does not rerun sorting while scrolling cached data', async() => {
      const sortMethod = sinon.spy((a, b) => a.score - b.score);
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" :default-sort="{ prop: 'score', order: 'ascending' }">
          <el-table-column prop="score" label="Score" width="120" sortable :sort-method="sortMethod" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        },
        methods: {
          sortMethod
        }
      }, true);

      await wait(50);
      const callCount = sortMethod.callCount;
      vm.$refs.table.scrollTo(400);
      await wait(50);
      expect(sortMethod.callCount).to.equal(callCount);
    });

  });

  describe('Milestone 2: selection', () => {
    it('supports selection methods, selectable and events', async() => {
      const select = sinon.spy();
      const selectAll = sinon.spy();
      const selectionChange = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual
          ref="table"
          :data="tableData"
          height="240"
          row-key="id"
          @select="select"
          @select-all="selectAll"
          @selection-change="selectionChange">
          <el-table-column type="selection" width="48" :selectable="selectable" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(4)
          };
        },
        methods: {
          selectable(row) {
            return row.id % 2 === 0;
          },
          select,
          selectAll,
          selectionChange
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table-column--selection')).to.exist;

      vm.$refs.table.toggleRowSelection(vm.tableData[1], true);
      await waitImmediate();
      expect(vm.$refs.table.selection.length).to.equal(0);

      vm.$refs.table.toggleRowSelection(vm.tableData[0], true);
      await waitImmediate();
      expect(select.calledOnce).to.true;
      expect(selectionChange.calledOnce).to.true;
      expect(vm.$refs.table.selection.map(row => row.id)).to.eql([0]);
      expect(vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-column--selection .el-checkbox__input').className).to.contain('is-checked');

      vm.$refs.table.toggleAllSelection();
      await waitImmediate();
      expect(selectAll.calledOnce).to.true;
      expect(vm.$refs.table.selection.map(row => row.id)).to.eql([0, 2]);
      expect(vm.$refs.table.isAllSelected).to.true;

      vm.$refs.table.clearSelection();
      await waitImmediate();
      expect(vm.$refs.table.selection.length).to.equal(0);
      expect(vm.$refs.table.isAllSelected).to.false;
      expect(vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-column--selection .el-checkbox__input').className).to.not.contain('is-checked');

      vm.$refs.table.toggleRowSelection(vm.tableData[0], true);
      await waitImmediate();
      vm.$refs.table.toggleRowSelection(vm.tableData[0], false);
      await waitImmediate();
      expect(vm.$refs.table.selection.length).to.equal(0);
    });

    it('keeps selection storage non-reactive after select all', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id">
          <el-table-column type="selection" width="48" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      vm.$refs.table.toggleAllSelection();
      await waitImmediate();

      expect(vm.$refs.table.selection).to.have.length(100);
      expect(vm.$refs.table.selection.__ob__).to.equal(undefined);
      expect(vm.$refs.table.selectionMapCache[0]).to.equal(vm.tableData[0]);
      expect(vm.$refs.table.isSelected(vm.tableData[50])).to.true;
    });

    it('reserves selection by row key when data changes', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id">
          <el-table-column type="selection" reserve-selection width="48" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(4)
          };
        }
      }, true);

      await wait(50);
      vm.$refs.table.toggleRowSelection(vm.tableData[2], true);
      await waitImmediate();
      vm.tableData = [
        { id: 2, name: 'Updated Name 2', score: 10, address: 'Updated Address 2' },
        { id: 5, name: 'Name 5', score: 1, address: 'Address 5' }
      ];
      await wait(50);

      expect(vm.$refs.table.selection.length).to.equal(1);
      expect(vm.$refs.table.selection[0].name).to.equal('Updated Name 2');
    });

  });

  describe('Milestone 2: filtering', () => {
    it('supports filter method, clearFilter and filter events', async() => {
      const filterChange = sinon.spy();
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" @filter-change="filterChange">
          <el-table-column
            column-key="score"
            prop="score"
            label="Score"
            width="120"
            :filters="[{ text: 'High', value: 'high' }]"
            :filter-method="filterMethod" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(5)
          };
        },
        methods: {
          filterMethod(value, row) {
            return value === 'high' ? row.score >= 4 : true;
          },
          filterChange
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table__column-filter-trigger')).to.exist;

      vm.$refs.table.columns[0].filteredValue = ['high'];
      await wait(50);
      expect(vm.$refs.table.sortedData.length).to.equal(5);
      expect(filterChange.called).to.false;

      vm.$refs.table.filter('score', ['high']);
      await wait(50);
      expect(vm.$refs.table.sortedData.length).to.equal(2);
      expect(vm.$refs.table.visibleRows.map(row => row.score)).to.eql([5, 4]);
      expect(filterChange.calledOnce).to.true;
      expect(filterChange.args[0][0].score).to.eql(['high']);

      vm.$refs.table.clearFilter();
      await wait(50);
      expect(vm.$refs.table.sortedData.length).to.equal(5);
      expect(filterChange.calledTwice).to.true;
      expect(filterChange.args[1][0].score).to.eql([]);
    });

    it('does not rerun filtering while scrolling cached data', async() => {
      const filterMethod = sinon.spy((value, row) => row.score >= value);
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column
            column-key="score"
            prop="score"
            label="Score"
            width="120"
            :filters="[{ text: 'High', value: 50 }]"
            :filter-method="filterMethod" />
          <el-table-column prop="name" label="Name" width="160" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        },
        methods: {
          filterMethod
        }
      }, true);

      await wait(50);
      vm.$refs.table.filter('score', [50]);
      await wait(50);
      const callCount = filterMethod.callCount;
      vm.$refs.table.scrollTo(400);
      await wait(50);
      expect(filterMethod.callCount).to.equal(callCount);
    });

  });

  describe('Milestone 1 and 2: typed array state diagnostics', () => {
    it('reports named array state when array state is invalid', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id">
          <el-table-column type="selection" width="48" />
          <el-table-column
            column-key="score"
            prop="score"
            label="Score"
            width="120"
            :filters="[{ text: 'High', value: 'high' }]"
            :filter-method="filterMethod" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(5)
          };
        },
        methods: {
          filterMethod(value, row) {
            return value === 'high' ? row.score >= 4 : true;
          }
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const column = table.columns[1];

      table.selection = null;
      expect(() => table.clearSelection()).to.throw(TypeError, 'selection must be an array');
      table.selection = [];

      table.activeFilters.score = null;
      expect(() => table.getFilterValues(column)).to.throw(TypeError, 'activeFilters.score must be an array');
      table.activeFilters.score = [];
      expect(() => table.filterChange({ column, values: null, silent: true })).to.throw(TypeError, 'filterChange.values must be an array');

      table.columns = null;
      expect(() => table.updateColumns()).to.throw(TypeError, 'columns must be an array');
      table.columns = [];
    });

  });

  describe('Milestone 1: header slots', () => {
    it('renders column header slot', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="name" width="160">
            <template slot="header" slot-scope="scope">Custom {{ scope.column.property }}</template>
          </el-table-column>
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table-virtual__header-wrapper').textContent).to.contain('Custom name');
    });

    it('renders column header slot without scope', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="name" width="160">
            <template slot="header">Plain Header</template>
          </el-table-column>
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      expect(vm.$el.querySelector('.el-table-virtual__header-wrapper').textContent).to.contain('Plain Header');
    });

  });

  describe('Milestone 1: show-overflow-tooltip', () => {
    it('shows tooltip when overflow cell is hovered', async() => {
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="address" label="Address" width="120" show-overflow-tooltip />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const tooltip = vm.$refs.table.$refs.tooltip;
      const showSpy = sinon.spy(tooltip, 'handleShowPopper');
      const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      const cellContent = cell.querySelector('.cell');
      Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 200 });
      Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 80 });

      triggerEvent(cell, 'mouseenter', true, false);
      await wait(50);
      expect(showSpy.calledOnce).to.true;
      expect(cell.getAttribute('title')).to.equal(cellContent.textContent);
      showSpy.restore();
    });

    it('only adds native title when cell content is ellipsized', async() => {
      vm = createVue({
        template: `
        <el-table-virtual :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="address" label="Address" width="120" />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      await wait(50);
      const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
      const cellContent = cell.querySelector('.cell');
      Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 80 });
      Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 120 });

      triggerEvent(cell, 'mouseenter', true, false);
      await waitImmediate();
      expect(cell.hasAttribute('title')).to.false;

      Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 200 });
      Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 80 });
      triggerEvent(cell, 'mouseenter', true, false);
      await waitImmediate();
      expect(cell.getAttribute('title')).to.equal(cellContent.textContent);
    });

    it('does not rerender when overflow tooltip cell is hovered', async() => {
      const renderSpy = sinon.spy(TableVirtual, 'render');
      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40">
          <el-table-column prop="address" label="Address" width="120" show-overflow-tooltip />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(20)
          };
        }
      }, true);

      try {
        await wait(50);
        const table = vm.$refs.table;
        const cell = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__cell');
        const cellContent = cell.querySelector('.cell');
        Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 200 });
        Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 80 });
        renderSpy.resetHistory();

        triggerEvent(cell, 'mouseenter', true, false);
        await waitImmediate();
        expect(renderSpy.callCount).to.equal(0);
        expect(table.hoverRow).to.equal(table.visibleRows[0]);
        expect(vm.$el.querySelectorAll('.el-table-virtual__row.hover-row').length).to.be.above(0);
      } finally {
        renderSpy.restore();
      }
    });

  });

  describe('TableVirtual robustness and cleanup', () => {
    it('cleans pending frames, tooltip and retained references on destroy', async() => {
      oldRequestAnimationFrame = window.requestAnimationFrame;
      oldCancelAnimationFrame = window.cancelAnimationFrame;
      const cancelSpy = sinon.spy();
      window.requestAnimationFrame = function() {
        return 12345;
      };
      window.cancelAnimationFrame = cancelSpy;

      vm = createVue({
        template: `
        <el-table-virtual ref="table" :data="tableData" height="240" row-key="id" :row-height="40" :default-sort="{ prop: 'score', order: 'ascending' }">
          <el-table-column prop="name" label="Name" width="160" />
          <el-table-column prop="address" label="Address" width="120" show-overflow-tooltip />
          <el-table-column prop="score" label="Score" width="120" sortable />
        </el-table-virtual>
      `,
        data() {
          return {
            tableData: getData(100)
          };
        }
      }, true);

      await wait(50);
      const table = vm.$refs.table;
      const body = table.$refs.body;
      const tooltip = table.$refs.tooltip;
      const cell = vm.$el.querySelectorAll('.el-table-virtual__body-wrapper .el-table-virtual__cell')[1];
      const cellContent = cell.querySelector('.cell');
      Object.defineProperty(body, 'getBoundingClientRect', {
        configurable: true,
        value() {
          return { top: 0, bottom: 240, left: 0, right: 400 };
        }
      });
      Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 200 });
      Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 80 });

      triggerEvent(cell, 'mouseenter', true, false);
      await wait(50);
      table.handleBodyMouseMove({ clientX: 120, clientY: 20 });
      body.scrollTop = 80;
      triggerEvent(body, 'scroll', true, false);
      table.setCurrentRow(vm.tableData[1]);

      expect(table.scrollFrame).to.equal(12345);
      expect(table.hoverScrollTimer).to.not.equal(null);
      expect(table.hoverScrolling).to.equal(true);
      expect(tooltip.referenceElm).to.equal(cell);
      expect(table.currentRow).to.equal(vm.tableData[1]);
      expect(table.hoverRow).to.equal(null);
      expect(table.columns.length).to.be.above(0);
      expect(table.store.states.data).to.equal(table.sortedData);
      expect(table.$el.__resizeListeners__).to.include(table.resizeListener);

      destroyVM(vm);
      vm = null;

      expect(cancelSpy.calledWith(12345)).to.true;
      expect(table.scrollFrame).to.equal(null);
      expect(table.hoverScrollTimer).to.equal(null);
      expect(table.hoverScrolling).to.equal(false);
      expect(table.fixedScrollFrame).to.equal(null);
      expect(table.fixedScrollTimer).to.equal(null);
      expect(table.pendingScrollTop).to.equal(null);
      expect(table.pendingScrollLeft).to.equal(null);
      expect(tooltip.referenceElm).to.equal(null);
      expect(tooltip.$slots.content).to.equal(null);
      expect(table.columns.length).to.equal(0);
      expect(table.hoverRow).to.equal(null);
      expect(table.currentRow).to.equal(null);
      expect(table.sortingColumn).to.equal(null);
      expect(table.store).to.equal(null);
      expect(table.$el.__resizeListeners__).to.have.length(0);
    });
  });
});
