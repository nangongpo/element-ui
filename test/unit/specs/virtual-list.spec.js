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
      expect(list.$refs.window.querySelector('ul > li')).to.exist;
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

    it('calculates offsets from itemSize and resets metadata', () => {
      const sizes = [20, 30, 40, 50, 60];
      vm = createTest(DynamicSizeList, {
        data: makeData(sizes.length),
        total: sizes.length,
        height: 100,
        width: 200,
        itemSize: index => sizes[index],
        estimatedItemSize: 40
      }, true);

      expect(vm.itemCache.items[3].offset).to.equal(90);
      expect(vm.itemCache.items[3].size).to.equal(50);
      expect(vm.estimatedTotalSize).to.equal(200);

      sizes[2] = 80;
      vm.resetAfterIndex(2, false);
      expect(vm.itemCache.items[3].offset).to.equal(130);
      expect(vm.itemCache.lastVisitedIndex).to.equal(4);
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

    it('calculates independent row and column metadata', () => {
      vm = createTest(DynamicSizeGrid, {
        data: makeData(4),
        totalRow: 4,
        totalColumn: 3,
        width: 100,
        height: 100,
        columnWidth: index => 40 + index * 10,
        rowHeight: index => 20 + index * 5,
        estimatedColumnWidth: 50,
        estimatedRowHeight: 30
      }, true);

      expect(vm.itemCache.columns[2].offset).to.equal(90);
      expect(vm.itemCache.rows[3].offset).to.equal(75);
      expect(vm.estimatedTotalWidth).to.equal(150);
      expect(vm.estimatedTotalHeight).to.equal(110);

      vm.resetAfter(1, 2);
      expect(vm.itemCache.lastVisitedColumnIndex).to.equal(0);
      expect(vm.itemCache.lastVisitedRowIndex).to.equal(1);
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
