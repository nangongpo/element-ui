import sinon from 'sinon';
import SelectV2 from 'element-ui/packages/select-v2/src/select';
import OptionItem from 'element-ui/packages/select-v2/src/option-item';
import { FixedSizeList, DynamicSizeList } from 'element-ui/packages/virtual-list';
import VirtualScrollbar from 'element-ui/packages/virtual-list/src/scrollbar';
import { selectV2Props, optionProps, selectV2Emits, optionEmits } from 'element-ui/packages/select-v2/src/defaults';
import { createTest, createVue, destroyVM, triggerEvent, wait } from '../util';

const getOptions = count => {
  const options = [];
  for (let index = 0; index < count; index++) {
    options.push({
      value: index,
      label: 'Option ' + index,
      disabled: false
    });
  }
  return options;
};

describe('SelectV2', () => {
  let vm;

  afterEach(() => {
    if (vm) destroyVM(vm);
    vm = null;
  });

  it('centralizes the complete props and emits contracts', () => {
    expect(selectV2Props.estimatedOptionHeight).to.exist;
    expect(selectV2Props.maxCollapseTags.default).to.equal(1);
    expect(selectV2Props.persistent.default).to.true;
    expect(selectV2Props.fitInputWidth.default).to.true;
    expect(selectV2Props.emptyValues.default()).to.deep.equal(['', undefined, null]);
    expect(optionProps.item.required).to.true;
    expect(selectV2Emits['end-reached']('bottom')).to.true;
    expect(optionEmits.resize(0, 34)).to.true;
  });

  it('renders only the virtualized option range', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(10000),
      height: 204,
      itemHeight: 34,
      overscan: 2,
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await wait(50);

    const items = vm.$el.querySelectorAll('.el-select-dropdown__item');
    expect(items.length).to.be.above(0);
    expect(items.length).to.be.below(20);
    expect(items[0].textContent.trim()).to.equal('Option 0');
    expect(items[0].parentNode.tagName).to.equal('UL');
    expect(items[0].parentNode.parentNode.classList.contains('el-select-dropdown__list')).to.true;
    expect(items[0].style.position).to.equal('absolute');
    expect(items[0].style.top).to.equal('0px');
    expect(items[0].style.height).to.equal('34px');
    expect(items[0].style.lineHeight).to.equal('');
    expect(items[1].style.top).to.equal('34px');
    expect(vm.$refs.popper.$el.querySelector(
      '.el-vl__window.el-select-dropdown__list'
    )).to.exist;
    expect(vm.$refs.popper.$refs.list.$refs.inner.tagName).to.equal('UL');
    expect(vm.$refs.popper.$refs.list.$refs.inner.getAttribute('aria-orientation')).to.equal('vertical');
    const windowEl = vm.$refs.popper.$refs.list.$refs.window;
    const windowStyle = window.getComputedStyle(windowEl);
    expect(windowEl.style.position).to.equal('relative');
    expect(windowEl.style.overflowY).to.equal('scroll');
    expect(windowEl.style.willChange).to.equal('transform');
    expect(windowEl.style.direction).to.equal('ltr');
    expect(windowEl.style.height).to.equal('204px');
    expect(windowEl.style.width).to.equal('100%');
    expect(windowStyle.marginTop).to.equal('6px');
    expect(windowStyle.marginBottom).to.equal('6px');
    expect(windowStyle.paddingTop).to.equal('0px');
    expect(vm.$refs.popper.$refs.list.totalSize).to.equal(340000);
  });

  it('uses a dynamic list when estimated option height is provided', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(100),
      height: 120,
      itemHeight: 34,
      estimatedOptionHeight: 40,
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await wait(50);

    const dropdown = vm.$refs.popper;
    expect(dropdown.$refs.list.$options.name).to.equal('ElDynamicSizeList');
    dropdown.handleItemResize(0, 58);
    expect(dropdown.cachedHeights[0]).to.equal(58);
    expect(dropdown.$refs.list.getItemSize(0)).to.equal(58);
  });

  it('supports label and disabled field keys', () => {
    vm = createTest(SelectV2, {
      value: 1,
      options: [{ value: 1, text: 'Aliased', inactive: true }],
      labelKey: 'text',
      disabledKey: 'inactive'
    }, true);

    expect(vm.displayLabel).to.equal('Aliased');
    expect(vm.isOptionDisabled(vm.options[0])).to.true;
  });

  it('supports label and disabled key compatibility props with object values', () => {
    const options = [
      { value: { id: 1 }, name: 'Shanghai', unavailable: false },
      { value: { id: 2 }, name: 'Beijing', unavailable: true }
    ];
    vm = createTest(SelectV2, {
      value: { id: 1 },
      options,
      valueKey: 'id',
      labelKey: 'name',
      disabledKey: 'unavailable'
    }, true);

    expect(vm.displayLabel).to.equal('Shanghai');
    expect(vm.isOptionDisabled(options[1])).to.true;
  });

  it('renders options again when the dropdown is reopened', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(20),
      filterable: true
    }, true);

    vm.visible = true;
    await wait(50);
    expect(vm.$refs.popper.$el.querySelectorAll('.el-select-dropdown__item').length).to.be.above(0);

    vm.visible = false;
    await wait(300);
    vm.visible = true;
    await wait(50);

    expect(vm.$refs.popper.data.length).to.equal(20);
    expect(vm.$refs.popper.$refs.list.itemsToRender.length).to.be.above(0);
    expect(document.body.contains(vm.$refs.popper.$el)).to.true;
    expect(vm.$refs.popper.$el.querySelectorAll('.el-select-dropdown__item').length).to.be.above(0);
  });

  it('resets the offset to the first option when reopening without a value', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(100),
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await wait(50);
    vm.$refs.popper.scrollToIndex(63);
    expect(vm.$refs.popper.$refs.list.scrollOffset).to.be.above(0);

    vm.visible = false;
    await wait(300);
    vm.visible = true;
    await wait(50);

    const firstItem = vm.$refs.popper.$el.querySelector('.el-select-dropdown__item');
    expect(vm.$refs.popper.$refs.list.scrollOffset).to.equal(0);
    expect(vm.$refs.popper.$refs.list.$refs.window.scrollTop).to.equal(0);
    expect(firstItem.getAttribute('data-option-index')).to.equal('0');
    expect(firstItem.style.top).to.equal('0px');
  });

  it('recreates virtualized options when persistent is false', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(20),
      persistent: false,
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await wait(50);
    expect(vm.$refs.popper.$refs.list.itemsToRender.length).to.be.above(0);

    vm.visible = false;
    await wait(300);
    expect(vm.$refs.popper).to.not.exist;

    vm.visible = true;
    await wait(50);
    expect(vm.$refs.popper.$refs.list.itemsToRender.length).to.be.above(0);
  });

  it('renders a custom option slot again when the dropdown is reopened', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: `
        <select-v2 ref="select" v-model="value" :options="options">
          <template slot-scope="scope">
            <span class="custom-option">custom {{ scope.item.label }}</span>
          </template>
        </select-v2>
      `,
      data() {
        return {
          value: '',
          options: getOptions(20)
        };
      }
    }, true);

    vm.$refs.select.visible = true;
    await wait(50);
    expect(vm.$refs.select.$refs.popper.$el.querySelector('.custom-option').textContent.trim())
      .to.equal('custom Option 0');

    vm.$refs.select.visible = false;
    await wait(300);
    vm.$refs.select.visible = true;
    await wait(50);

    expect(vm.$refs.select.$refs.popper.$el.querySelector('.custom-option').textContent.trim())
      .to.equal('custom Option 0');
  });

  it('selects immediately', () => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(5),
      popperAppendToBody: false
    }, true);
    const emitted = [];
    vm.$on('input', value => emitted.push(value));

    vm.handleOptionSelect(2);

    expect(emitted).to.deep.equal([2]);
  });

  it('navigates over disabled options and scrolls synchronously', () => {
    const options = getOptions(100);
    options[1].disabled = true;
    vm = createTest(SelectV2, {
      value: '',
      options,
      height: 102,
      itemHeight: 34,
      popperAppendToBody: false
    }, true);
    vm.visible = true;
    const scrollSpy = sinon.spy();
    vm.$refs.popper.scrollToIndex = scrollSpy;

    vm.handleNavigate('next');
    vm.handleNavigate('next');

    expect(vm.hoveringIndex).to.equal(2);
    expect(scrollSpy.lastCall.args[0]).to.equal(2);
  });

  it('supports input, content and fixed dropdown width modes', () => {
    vm = createTest(SelectV2, {
      value: '',
      options: [],
      fitInputWidth: true
    }, true);
    vm.inputWidth = 180;
    expect(vm.dropdownStyle).to.deep.equal({
      width: '180px'
    });

    vm.fitInputWidth = false;
    expect(vm.dropdownStyle).to.deep.equal({ minWidth: '180px' });

    vm.fitInputWidth = 320;
    expect(vm.dropdownStyle).to.deep.equal({
      width: '320px'
    });
  });

  it('supports multiple selection and its limit', () => {
    vm = createTest(SelectV2, {
      value: [0],
      options: getOptions(3),
      multiple: true,
      multipleLimit: 2,
      popperAppendToBody: false
    }, true);
    const emitted = [];
    vm.$on('input', value => emitted.push(value));

    vm.handleOptionSelect(1);
    vm.value = [0, 1];
    vm.handleOptionSelect(2);

    expect(emitted[0]).to.deep.equal([0, 1]);
    expect(emitted.length).to.equal(1);
    expect(vm.isOptionDisabled(vm.options[2])).to.true;
  });

  it('respects max collapse tags', () => {
    vm = createTest(SelectV2, {
      value: [0, 1, 2, 3],
      options: getOptions(5),
      multiple: true,
      collapseTags: true,
      maxCollapseTags: 2
    }, true);

    expect(vm.shownSelectedOptions.length).to.equal(2);
    expect(vm.collapsedOptionCount).to.equal(2);
  });

  it('hides the multiple input placeholder as soon as text is entered', () => {
    vm = createTest(SelectV2, {
      value: [],
      options: getOptions(3),
      multiple: true,
      filterable: true,
      placeholder: 'Select an option'
    }, true);

    vm.handleQueryInput({ target: { value: 'Opt' } });
    expect(vm.currentPlaceholder).to.equal('');

    vm.handleQueryInput({ target: { value: '' } });
    expect(vm.currentPlaceholder).to.equal('Select an option');
  });

  it('keeps the multiple input placeholder hidden when options update', async() => {
    vm = createTest(SelectV2, {
      value: [],
      options: getOptions(3),
      multiple: true,
      filterable: true,
      placeholder: 'Select an option'
    }, true);

    vm.query = 'Option';
    vm.handleQueryInput({ target: { value: 'Option' } });
    vm.options = getOptions(5);
    await vm.$nextTick();

    expect(vm.currentPlaceholder).to.equal('');
  });

  it('updates multiple input height immediately when tags return to one line', async() => {
    vm = createTest(SelectV2, {
      value: [0, 1],
      options: getOptions(3),
      multiple: true,
      filterable: true
    }, true);
    const input = vm.$refs.reference.$el.querySelector('input');
    vm.initialInputHeight = 40;
    const heightStub = sinon.stub(vm.$refs.tags, 'getBoundingClientRect');
    heightStub.returns({ height: 70 });

    vm.syncInputHeightImmediately();
    await vm.$nextTick();
    expect(input.style.height).to.equal('76px');

    heightStub.returns({ height: 34 });
    vm.syncInputHeightImmediately();
    await vm.$nextTick();
    expect(input.style.height).to.equal('40px');
  });

  it('observes tag container size changes', () => {
    vm = createTest(SelectV2, {
      value: [],
      options: [],
      multiple: true,
      filterable: true
    }, true);

    expect(vm.$refs.tags.__resizeListeners__).to.include(vm.syncInputHeightImmediately);
  });

  it('uses flex layout without tracking input length', () => {
    vm = createTest(SelectV2, {
      value: [],
      options: [],
      multiple: true,
      filterable: true
    }, true);

    expect(vm.inputLength).to.equal(undefined);
    expect(vm.multipleInputStyle.width).to.equal('20px');
    vm.query = 'A long search keyword';
    expect(vm.multipleInputStyle.width).to.equal('20px');
  });

  it('updates input height immediately after selecting a created option', async() => {
    vm = createTest(SelectV2, {
      value: [],
      options: [],
      multiple: true,
      filterable: true,
      allowCreate: true
    }, true);
    const input = vm.$refs.reference.$el.querySelector('input');
    vm.initialInputHeight = 40;
    vm.query = 'A created option that wraps onto another line';
    input.style.height = '76px';
    sinon.stub(vm.$refs.tags, 'getBoundingClientRect').returns({ height: 34 });

    vm.handleOptionSelect(0);
    await vm.$nextTick();
    await vm.$nextTick();

    expect(vm.query).to.equal('');
    expect(input.style.height).to.equal('40px');
  });

  it('resets input width and updates height when deleting a created option', async() => {
    vm = createTest(SelectV2, {
      value: [],
      options: [],
      multiple: true,
      filterable: true,
      allowCreate: true
    }, true);
    vm.$on('input', value => { vm.value = value; });
    for (const label of ['HTML', 'CSS', 'JavaScript']) {
      vm.query = label;
      vm.handleOptionSelect(0);
      await vm.$nextTick();
    }

    const keys = vm.selectedOptions.map(vm.getOptionKey);
    expect(new Set(keys).size).to.equal(3);
    expect(keys).to.deep.equal(['HTML', 'CSS', 'JavaScript']);
    expect(vm.getOptionKey(vm.createFallbackOption('JavaScript'))).to.equal(keys[2]);

    const input = vm.$refs.reference.$el.querySelector('input');
    vm.initialInputHeight = 40;
    input.style.height = '76px';
    sinon.stub(vm.$refs.tags, 'getBoundingClientRect').returns({ height: 34 });

    vm.deleteTag({ stopPropagation() {} }, vm.selectedOptions[2]);
    await vm.$nextTick();
    expect(vm.$refs.tags.querySelectorAll('.el-tag').length).to.equal(2);
    await vm.$nextTick();

    expect(vm.value).to.deep.equal(['HTML', 'CSS']);
    expect(input.style.height).to.equal('40px');
  });

  it('removes a created tag before the parent updates value', async() => {
    vm = createTest(SelectV2, {
      value: ['HTML', 'CSS', 'JavaScript'],
      options: [],
      multiple: true,
      filterable: true,
      allowCreate: true
    }, true);
    vm.createdOptions = ['HTML', 'CSS', 'JavaScript'].map(value => ({
      value,
      label: value,
      created: true,
      __created: true
    }));
    vm.syncSelectedOptions();
    await vm.$nextTick();
    const input = vm.$refs.reference.$el.querySelector('input');
    vm.initialInputHeight = 40;
    input.style.height = '76px';
    sinon.stub(vm.$refs.tags, 'getBoundingClientRect').returns({ height: 34 });

    vm.deleteTag({ stopPropagation() {} }, vm.selectedOptions[2]);
    await vm.$nextTick();

    expect(vm.value).to.deep.equal(['HTML', 'CSS', 'JavaScript']);
    expect(vm.selectedOptions.map(option => vm.getOptionValue(option))).to.deep.equal(['HTML', 'CSS']);
    expect(vm.$refs.tags.querySelectorAll('.el-tag').length).to.equal(2);
    expect(input.style.height).to.equal('40px');
  });

  it('filters local options and creates an option from the query', () => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(20),
      filterable: true,
      allowCreate: true
    }, true);

    vm.query = 'Option 12';
    expect(vm.displayOptions.length).to.equal(1);
    expect(vm.getOptionValue(vm.displayOptions[0])).to.equal(12);

    vm.query = 'New option';
    expect(vm.displayOptions.length).to.equal(1);
    expect(vm.displayOptions[0].__created).to.true;
  });

  it('shows all local options when opening a filterable single select', async() => {
    vm = createTest(SelectV2, {
      value: 2,
      options: getOptions(5),
      filterable: true,
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await vm.$nextTick();

    expect(vm.query).to.equal('');
    expect(vm.displayOptions.length).to.equal(5);
    expect(vm.currentPlaceholder).to.equal('Option 2');
  });

  it('compares object values through value key', () => {
    const options = [{
      value: { id: 1, code: 'first' },
      label: 'First option'
    }];
    vm = createTest(SelectV2, {
      value: { id: 1, code: 'selected' },
      valueKey: 'id',
      options
    }, true);

    expect(vm.isOptionSelected(options[0])).to.true;
    expect(vm.displayLabel).to.equal('First option');
  });

  it('requires two backspaces to remove the last multiple tag', () => {
    vm = createTest(SelectV2, {
      value: [0, 1],
      options: getOptions(3),
      multiple: true
    }, true);
    const emitted = [];
    const event = { target: { value: '' } };
    vm.$on('input', value => emitted.push(value));

    vm.deletePrevTag(event);
    expect(emitted.length).to.equal(0);
    expect(vm.hitOptionKey).to.equal(1);

    vm.deletePrevTag(event);
    expect(emitted[0]).to.deep.equal([0]);
  });

  it('renders option groups and disables grouped options', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: [{
        label: '热门城市',
        disabled: true,
        options: [{ value: 'Shanghai', label: '上海' }]
      }, {
        label: '其他城市',
        options: [{ value: 'Beijing', label: '北京' }]
      }],
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await wait(50);

    expect(vm.$el.querySelectorAll('.el-select-group__title').length).to.equal(2);
    expect(vm.displayRows.length).to.equal(4);
    expect(vm.isRowDisabled(vm.displayRows[1])).to.true;
    expect(vm.isRowDisabled(vm.displayRows[3])).to.false;
  });

  it('renders custom dropdown header and footer slots', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: `
        <select-v2
          ref="select"
          v-model="value"
          :options="options"
          :popper-append-to-body="false">
          <div slot="header" class="custom-header">Header</div>
          <div slot="footer" class="custom-footer">Footer</div>
        </select-v2>
      `,
      data() {
        return {
          value: '',
          options: getOptions(3)
        };
      }
    }, true);
    vm.$refs.select.visible = true;
    await wait(50);

    const header = vm.$el.querySelector('.el-select-dropdown__header');
    const footer = vm.$el.querySelector('.el-select-dropdown__footer');
    const headerStyle = window.getComputedStyle(header);
    const footerStyle = window.getComputedStyle(footer);

    expect(header.querySelector('.custom-header').textContent).to.equal('Header');
    expect(footer.querySelector('.custom-footer').textContent).to.equal('Footer');
    expect(headerStyle.padding).to.equal('10px');
    expect(headerStyle.borderBottomWidth).to.equal('1px');
    expect(headerStyle.borderBottomStyle).to.equal('solid');
    expect(footerStyle.padding).to.equal('10px');
    expect(footerStyle.borderTopWidth).to.equal('1px');
    expect(footerStyle.borderTopStyle).to.equal('solid');
  });

  it('styles the default dropdown loading state', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: [],
      loading: true,
      popperAppendToBody: false
    }, true);
    vm.visible = true;
    await wait(50);

    const loading = vm.$el.querySelector('.el-select-dropdown__loading');
    const loadingStyle = window.getComputedStyle(loading);

    expect(loadingStyle.padding).to.equal('10px 0px');
    expect(loadingStyle.margin).to.equal('0px');
    expect(loadingStyle.textAlign).to.equal('center');
    expect(loadingStyle.color).to.equal('rgb(153, 153, 153)');
    expect(loadingStyle.fontSize).to.equal('14px');
  });

  it('uses hovering index as the single hover state', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(20)
    }, true);

    vm.handleOptionHover(2);
    expect(vm.hoveringIndex).to.equal(2);
    await vm.$nextTick();
    expect(vm.$refs.popper.isItemHovering(2)).to.true;
    expect(vm.$refs.popper.isItemHovering(3)).to.false;

    vm.handleOptionHover(4);
    expect(vm.hoveringIndex).to.equal(4);

    vm.options[3].disabled = true;
    vm.handleOptionHover(3);
    expect(vm.hoveringIndex).to.equal(4);
  });

  it('only restores visible hover after the mouse moves following a scroll', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(100),
      height: 102,
      itemHeight: 34,
      overscan: 1,
      popperAppendToBody: false
    }, true);
    vm.visible = true;
    await wait(50);

    const dropdown = vm.$refs.popper;
    const firstItem = dropdown.$el.querySelector('[data-option-index="0"]');
    expect(dropdown.$el.classList.contains('el-select-dropdown--v2')).to.true;

    triggerEvent(firstItem, 'mousemove');
    await vm.$nextTick();
    expect(vm.hoveringIndex).to.equal(0);
    expect(firstItem.classList.contains('hover')).to.true;

    const windowEl = dropdown.$refs.list.$refs.window;
    windowEl.scrollTop = 680;
    triggerEvent(windowEl, 'scroll');
    await wait(20);

    expect(vm.hoveringIndex).to.equal(0);
    expect(dropdown.$el.querySelector('[data-option-index="0"]')).to.not.exist;
    expect(dropdown.$el.querySelector('.el-select-dropdown__item.hover')).to.not.exist;

    await wait(20);
    expect(dropdown.$el.querySelector('.el-select-dropdown__item.hover')).to.not.exist;

    const visibleItem = dropdown.$el.querySelector('.el-select-dropdown__item');
    triggerEvent(visibleItem, 'mousemove');
    await vm.$nextTick();
    expect(vm.hoveringIndex).to.equal(Number(visibleItem.getAttribute('data-option-index')));
    expect(visibleItem.classList.contains('hover')).to.true;
  });

  it('updates layout after the Vue render cycle', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: []
    }, true);
    const readSpy = sinon.spy(vm, 'readLayoutMetrics');
    const writeSpy = sinon.spy(vm, 'writeLayoutMetrics');

    vm.requestLayoutSync();
    await vm.$nextTick();

    expect(readSpy.called).to.true;
    expect(writeSpy.called).to.true;
  });
});

describe('SelectV2 VirtualList', () => {
  let vm;

  afterEach(() => {
    if (vm) destroyVM(vm);
    vm = null;
  });

  it('uses the Element Plus virtual list structure and renders only the visible range', () => {
    vm = createTest(FixedSizeList, {
      items: getOptions(1000),
      height: 102,
      itemSize: 34,
      overscan: 1
    }, true);
    expect(vm.$el.classList.contains('el-vl__wrapper')).to.true;
    expect(vm.$refs.window.classList.contains('el-vl__window')).to.true;
    expect(vm.$el.querySelector('.el-virtual-scrollbar')).to.exist;
    expect(vm.$el.querySelector('.el-virtual-scrollbar .el-scrollbar__thumb').style.width)
      .to.equal('100%');
    expect(vm.itemsToRender.length).to.be.below(vm.items.length);
  });

  it('disables option pointer events during a native scroll render cycle', async() => {
    vm = createTest(FixedSizeList, {
      items: getOptions(20),
      height: 102,
      itemSize: 34,
      overscan: 1
    }, true);
    const resetCallbacks = [];
    const nextTickStub = sinon.stub(vm, '$nextTick').callsFake(callback => {
      if (callback) resetCallbacks.push(callback);
    });

    vm.handleScroll({
      target: {
        scrollTop: 34,
        scrollHeight: 680,
        clientHeight: 102
      }
    });

    expect(vm.isScrolling).to.true;
    nextTickStub.restore();
    await vm.$nextTick();
    expect(vm.$refs.inner.style.pointerEvents).to.equal('none');

    resetCallbacks[0]();
    await vm.$nextTick();
    expect(vm.isScrolling).to.false;
    expect(vm.$refs.inner.style.pointerEvents).to.equal('');
  });

  it('uses BAR_MAP fields for horizontal scrollbar layout', () => {
    vm = createTest(VirtualScrollbar, {
      layout: 'horizontal',
      total: 1000,
      ratio: 10,
      clientSize: 100,
      scrollFrom: 0
    }, true);

    expect(vm.bar.scroll).to.equal('scrollLeft');
    expect(vm.$el.style.width).to.equal('98px');
    expect(vm.$el.classList.contains('el-virtual-scrollbar')).to.true;
    expect(vm.$refs.thumb.classList.contains('el-scrollbar__thumb')).to.true;
    expect(vm.$refs.thumb.style.height).to.equal('100%');
  });

  it('matches the Element Plus virtual scrollbar props contract', () => {
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
    expect(VirtualScrollbar.props.ratio.required).to.true;
    expect(VirtualScrollbar.props.clientSize.required).to.true;
    expect(VirtualScrollbar.props.scrollFrom.required).to.true;
    expect(VirtualScrollbar.props.scrollbarSize.default).to.equal(6);
    expect(VirtualScrollbar.props.startGap.default).to.equal(0);
    expect(VirtualScrollbar.props.endGap.default).to.equal(2);
  });

  it('adds title only when an option label overflows', () => {
    vm = createTest(OptionItem, {
      index: 0,
      item: { value: 1, label: 'Long option' },
      label: 'Long option',
      itemHeight: 34
    }, true);
    Object.defineProperty(vm.$refs.content, 'scrollWidth', { value: 200 });
    Object.defineProperty(vm.$refs.content, 'clientWidth', { value: 100 });
    const metrics = vm.readOverflow();
    vm.writeOverflow(metrics);
    expect(vm.$el.getAttribute('title')).to.equal('Long option');

    vm.writeOverflow({ overflowed: false, title: 'Long option' });
    expect(vm.$el.hasAttribute('title')).to.false;
  });

  it('scrolls to an index immediately using fixed item height', () => {
    vm = createTest(FixedSizeList, {
      items: getOptions(100),
      height: 102,
      itemSize: 34,
      overscan: 1
    }, true);

    vm.scrollToIndex(20);

    expect(vm.scrollOffset).to.equal(612);
    expect(vm.$refs.window.scrollTop).to.equal(612);
    expect(vm.startIndex).to.be.above(0);
  });

  it('supports dynamic item sizes and resets metadata after an index', () => {
    const sizes = getOptions(100).map((_, index) => 20 + index % 3 * 10);
    vm = createTest(DynamicSizeList, {
      items: getOptions(100),
      height: 100,
      itemSize: index => sizes[index],
      estimatedItemSize: 30,
      overscan: 2
    }, true);
    const expectedOffset = sizes.slice(0, 50).reduce((total, size) => total + size, 0);

    vm.scrollToItem(50, 'start');
    expect(vm.scrollOffset).to.equal(expectedOffset);
    expect(vm.startIndex).to.equal(50);

    sizes[20] = 80;
    vm.resetAfterIndex(20, false);
    expect(vm._itemMetadata.lastVisitedIndex).to.equal(19);
    expect(vm.getItemMetadata(20).size).to.equal(80);
  });

  it('supports the Element Plus data scope and horizontal layout', async() => {
    vm = createVue({
      components: { FixedSizeList },
      template: `
        <fixed-size-list
          ref="list"
          :data="rows"
          :total="rows.length"
          :height="40"
          :width="100"
          :item-size="20"
          layout="horizontal">
          <template slot-scope="scope">
            <span class="horizontal-item">{{ scope.data[scope.index].label }}</span>
          </template>
        </fixed-size-list>
      `,
      data() {
        return { rows: getOptions(20) };
      }
    }, true);
    await vm.$nextTick();
    const list = vm.$refs.list;

    expect(list.totalSize).to.equal(400);
    expect(list.$refs.window.style.overflowX).to.equal('scroll');
    expect(list.$refs.inner.style.width).to.equal('400px');
    expect(list.$el.querySelector('.horizontal-item').textContent).to.equal('Option 0');

    list.scrollToItem(19, 'center');
    expect(list.scrollOffset).to.equal(300);
    expect(list.$refs.window.scrollLeft).to.equal(300);
  });

  it('emits end reached and supports wheel and resetScrollTop', () => {
    vm = createTest(FixedSizeList, {
      data: getOptions(20),
      total: 20,
      height: 100,
      itemSize: 20
    }, true);
    const reached = [];
    vm.$on('end-reached', direction => reached.push(direction));
    const wheelEvent = {
      deltaX: 0,
      deltaY: 40,
      preventDefault: sinon.spy()
    };

    vm.handleWheel(wheelEvent);
    expect(vm.scrollOffset).to.equal(40);
    expect(wheelEvent.preventDefault.called).to.true;

    vm.scrollTo(vm.maxOffset);
    expect(reached).to.deep.equal(['bottom']);
    vm.resetScrollTop();
    expect(vm.scrollOffset).to.equal(0);
  });
});
