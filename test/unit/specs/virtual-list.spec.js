import sinon from 'sinon';
import {
  FixedSizeList,
  DynamicSizeList,
  FixedSizeGrid,
  DynamicSizeGrid
} from 'element-ui/packages/virtual-list';
import VirtualScrollbar from 'element-ui/packages/virtual-list/src/components/scrollbar';
import { createTest, createVue, destroyVM, triggerEvent } from '../util';

const makeData = count => Array.from({ length: count }, (_, index) => ({ id: index, label: `Item ${index}` }));

describe('VirtualList', () => {
  describe('fixed size list', () => {
    let vm;

    afterEach(() => {
      if (vm) destroyVM(vm);
      vm = null;
    });

    it('renders the Element Plus list structure and only the cached range', () => {
      vm = createVue({
        components: { FixedSizeList },
        template: `
          <fixed-size-list
            ref="list"
            :data="rows"
            :total="rows.length"
            :height="100"
            :width="200"
            :item-size="20"
            :cache="1"
            inner-element="ul">
            <template slot-scope="scope">
              <span class="item">{{ scope.item.label }}</span>
            </template>
          </fixed-size-list>
        `,
        data() { return { rows: makeData(100) }; }
      }, true);

      const list = vm.$refs.list;
      expect(list.$el.classList.contains('el-vl__wrapper')).to.true;
      expect(list.$refs.window.classList.contains('el-vl__window')).to.true;
      expect(list.$refs.window.style.overflowY).to.equal('scroll');
      expect(list.$el.querySelectorAll('.item').length).to.equal(6);
      expect(list.$refs.window.querySelector('ul > .item')).to.exist;
      expect(list.$refs.window.querySelector('ul > div')).to.not.exist;
      expect(list.itemsToRender).to.deep.equal([0, 1, 2, 3, 4, 5]);
    });

    it('supports programmatic scrolling and emits the official scroll payload', async() => {
      vm = createTest(FixedSizeList, {
        data: makeData(50),
        total: 50,
        height: 100,
        width: 200,
        itemSize: 20
      }, true);
      const scroll = sinon.spy();
      vm.$on('scroll', scroll);

      vm.scrollToItem(20, 'start');
      expect(vm.state.scrollOffset).to.equal(400);
      expect(scroll.lastCall.args).to.deep.equal(['forward', 400, true]);
      await vm.$nextTick();
      expect(vm.$refs.window.scrollTop).to.equal(400);

      vm.$refs.window.scrollTop = 200;
      triggerEvent(vm.$refs.window, 'scroll');
      expect(vm.state.scrollOffset).to.equal(200);
      expect(scroll.lastCall.args).to.deep.equal(['backward', 200, false]);
    });
  });

  describe('dynamic size list', () => {
    let vm;

    afterEach(() => {
      if (vm) destroyVM(vm);
      vm = null;
    });

    it('renders dynamic item positions and applies resetAfterIndex', async() => {
      const sizes = [20, 30, 40, 50, 60];
      vm = createVue({
        components: { DynamicSizeList },
        template: `
          <dynamic-size-list ref="list" :data="rows" :total="rows.length" :height="100" :width="200"
            :item-size="itemSize" :estimated-item-size="40">
            <template slot-scope="scope">
              <span class="item" :data-index="scope.index">{{ scope.item.label }}</span>
            </template>
          </dynamic-size-list>
        `,
        data() { return { rows: makeData(sizes.length), itemSize: index => sizes[index] }; }
      }, true);
      await vm.$nextTick();

      expect(vm.$el.querySelector('[data-index="3"]').style.top).to.equal('90px');
      expect(vm.$el.querySelector('[data-index="3"]').style.height).to.equal('50px');

      sizes[2] = 80;
      vm.$refs.list.resetAfterIndex(2, false);
      await vm.$nextTick();
      expect(vm.$el.querySelector('[data-index="3"]').style.top).to.equal('130px');
    });
  });

  describe('fixed size grid', () => {
    let vm;

    afterEach(() => {
      if (vm) destroyVM(vm);
      vm = null;
    });

    it('renders two-dimensional visible cells and reports both scroll axes', () => {
      vm = createVue({
        components: { FixedSizeGrid },
        template: `
          <fixed-size-grid
            ref="grid"
            :data="rows"
            :total-row="rows.length"
            :total-column="columns"
            :width="100"
            :height="60"
            :column-width="50"
            :row-height="20">
            <template slot-scope="scope">
              <span class="cell">{{ scope.rowIndex }}-{{ scope.columnIndex }}</span>
            </template>
          </fixed-size-grid>
        `,
        data() { return { rows: makeData(20), columns: 10 }; }
      }, true);

      const grid = vm.$refs.grid;
      expect(grid.estimatedTotalWidth).to.equal(500);
      expect(grid.estimatedTotalHeight).to.equal(400);
      expect(grid.$el.querySelectorAll('.cell').length).to.equal(20);

      const scroll = sinon.spy();
      grid.$on('scroll', scroll);
      grid.scrollTo({ scrollLeft: 100, scrollTop: 40 });
      expect(scroll.lastCall.args[0]).to.include({ scrollLeft: 100, scrollTop: 40, updateRequested: true });
      expect(grid.state.xAxisScrollDir).to.equal('forward');
      expect(grid.state.yAxisScrollDir).to.equal('forward');
    });
  });

  describe('dynamic size grid', () => {
    let vm;

    afterEach(() => {
      if (vm) destroyVM(vm);
      vm = null;
    });

    it('renders independent row and column positions after reset', async() => {
      const columnSizes = [40, 50, 60];
      const rowSizes = [20, 25, 30, 35];
      vm = createVue({
        components: { DynamicSizeGrid },
        template: `
          <dynamic-size-grid ref="grid" :data="rows" :total-row="rows.length" :total-column="3"
            :width="100" :height="100" :column-width="columnWidth" :row-height="rowHeight"
            :estimated-column-width="50" :estimated-row-height="30">
            <template slot-scope="scope">
              <span class="cell" :data-cell="scope.rowIndex + ':' + scope.columnIndex"
                :style="{ height: rowHeight(scope.rowIndex) + 'px' }">
                {{ scope.rowIndex }}-{{ scope.columnIndex }}
              </span>
            </template>
          </dynamic-size-grid>
        `,
        data() {
          return {
            rows: makeData(rowSizes.length),
            columnWidth: index => columnSizes[index],
            rowHeight: index => rowSizes[index]
          };
        }
      }, true);
      await vm.$nextTick();

      expect(vm.$el.querySelector('[data-cell="3:2"]').style.left).to.equal('90px');
      const initialTop = vm.$el.querySelector('[data-cell="3:2"]').style.top;
      expect(initialTop).to.match(/^\d+px$/);

      columnSizes[1] = 80;
      rowSizes[2] = 50;
      vm.$refs.grid.resetAfter(1, 2);
      await vm.$nextTick();
      expect(vm.$el.querySelector('[data-cell="3:2"]').style.left).to.equal('120px');
      expect(vm.$el.querySelector('[data-cell="3:2"]').style.top).to.not.equal(initialTop);
    });
  });

  describe('scrollbar', () => {
    let vm;

    afterEach(() => {
      if (vm) destroyVM(vm);
      vm = null;
    });

    it('keeps the Element Plus scrollbar props and horizontal geometry', () => {
      vm = createTest(VirtualScrollbar, {
        layout: 'horizontal',
        total: 100,
        ratio: 20,
        clientSize: 100,
        scrollFrom: 0
      }, true);

      expect(Object.keys(VirtualScrollbar.props)).to.deep.equal([
        'alwaysOn',
        'layout',
        'total',
        'ratio',
        'clientSize',
        'scrollFrom',
        'scrollbarSize',
        'startGap',
        'endGap',
        'visible'
      ]);
      expect(vm.$el.style.width).to.equal('98px');
      expect(vm.$refs.thumb.style.height).to.equal('100%');
    });
  });
});
