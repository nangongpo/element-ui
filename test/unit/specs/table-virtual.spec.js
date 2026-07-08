import Vue from 'vue';
import TableVirtual from 'element-ui/packages/table-virtual/src/table-virtual';
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

  describe('rendering and layout', () => {
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
      expect(vm.$refs.natural.$el.style.height).to.equal('168px');
      expect(vm.$refs.border.$el.style.height).to.equal('168px');
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

  });

  describe('state methods', () => {
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

  describe('fixed columns and sizing', () => {
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
      expect(vm.$el.querySelector('.el-table-virtual__fixed-body .el-table-virtual__rows').style.transform).to.contain('translateY');
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
      Object.defineProperty(body, 'clientWidth', { configurable: true, value: 500 });
      Object.defineProperty(body, 'clientHeight', { configurable: true, value: 192 });
      table.resizeState.width = 500;
      table.resizeState.height = 240;
      table.doLayout();
      const oldWidth = table.columns[2].realWidth;

      Object.defineProperty(table.$el, 'offsetWidth', { configurable: true, value: 700 });
      Object.defineProperty(body, 'clientWidth', { configurable: true, value: 700 });
      table.resizeListener();

      expect(table.resizeState.width).to.equal(700);
      expect(table.columns[2].realWidth).to.be.above(oldWidth);
    });

  });

  describe('columns, slots and events', () => {
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

    it('supports column attributes', async() => {
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
      expect(bodyCell.hasAttribute('title')).to.false;
      expect(bodyCell.hasAttribute('attrs')).to.false;
    });

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

    it('supports table events', async() => {
      const spies = {
        cellClick: sinon.spy(),
        cellDblclick: sinon.spy(),
        rowClick: sinon.spy(),
        rowDblclick: sinon.spy(),
        rowContextmenu: sinon.spy(),
        cellMouseEnter: sinon.spy(),
        cellMouseLeave: sinon.spy(),
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
      const row = vm.$el.querySelector('.el-table-virtual__body-wrapper .el-table-virtual__row');
      const headerCell = vm.$el.querySelector('.el-table-virtual__header-wrapper .el-table-virtual__cell');
      const body = vm.$refs.table.$refs.body;

      triggerEvent(cell, 'mouseenter', true, false);
      triggerEvent(cell, 'mouseleave', true, false);
      triggerEvent(cell, 'click', true, false);
      triggerEvent(cell, 'dblclick', true, false);
      triggerEvent(row, 'contextmenu', true, false);
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
      expect(spies.rowContextmenu.calledOnce).to.true;
      expect(spies.headerClick.calledOnce).to.true;
      expect(spies.headerContextmenu.calledOnce).to.true;
      expect(spies.scroll.calledOnce).to.true;
      expect(spies.scroll.args[0][0].scrollTop).to.equal(80);
    });

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

  describe('overflow title and tooltip', () => {
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

  describe('destroy cleanup', () => {
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
      Object.defineProperty(cellContent, 'scrollWidth', { configurable: true, value: 200 });
      Object.defineProperty(cellContent, 'clientWidth', { configurable: true, value: 80 });

      triggerEvent(cell, 'mouseenter', true, false);
      await wait(50);
      body.scrollTop = 80;
      triggerEvent(body, 'scroll', true, false);
      table.setCurrentRow(vm.tableData[1]);

      expect(table.scrollFrame).to.equal(12345);
      expect(tooltip.referenceElm).to.equal(cell);
      expect(table.currentRow).to.equal(vm.tableData[1]);
      expect(table.hoverRow).to.equal(table.visibleRows[0]);
      expect(table.columns.length).to.be.above(0);
      expect(table.store.states.data).to.equal(vm.tableData);
      expect(table.$el.__resizeListeners__).to.include(table.resizeListener);

      destroyVM(vm);
      vm = null;

      expect(cancelSpy.calledWith(12345)).to.true;
      expect(table.scrollFrame).to.equal(null);
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
