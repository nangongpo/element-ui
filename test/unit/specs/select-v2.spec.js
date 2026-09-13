import sinon from 'sinon';
import SelectV2 from 'element-ui/packages/select-v2/src/select';
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

  it('controls whether clicking outside closes the dropdown', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(3),
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await vm.$nextTick();
    triggerEvent(document, 'mousedown');
    triggerEvent(document, 'mouseup');
    expect(vm.visible).to.false;

    destroyVM(vm);
    vm = null;
    vm = createTest(SelectV2, {
      value: '',
      options: getOptions(3),
      closeOnClickOutside: false,
      popperAppendToBody: false
    }, true);

    vm.visible = true;
    await vm.$nextTick();
    triggerEvent(document, 'mousedown');
    triggerEvent(document, 'mouseup');
    expect(vm.visible).to.true;
  });

  it('keeps filterable selects closed after clearing', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: `
        <div>
          <select-v2 ref="single" v-model="singleValue" :options="options" filterable clearable></select-v2>
          <select-v2 ref="multiple" v-model="multipleValue" :options="options" multiple filterable clearable></select-v2>
        </div>
      `,
      data() {
        return {
          options: getOptions(3),
          singleValue: 1,
          multipleValue: [1, 2]
        };
      }
    }, true);

    const single = vm.$refs.single;
    const multiple = vm.$refs.multiple;
    single.inputHovering = multiple.inputHovering = true;
    await vm.$nextTick();

    triggerEvent(single.$el.querySelector('.el-icon-circle-close'), 'click');
    triggerEvent(multiple.$el.querySelector('.el-icon-circle-close'), 'click');
    await vm.$nextTick();

    expect(vm.singleValue).to.equal('');
    expect(vm.multipleValue).to.deep.equal([]);
    expect(single.visible).to.false;
    expect(multiple.visible).to.false;
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

  it('measures rendered option heights when estimated option height is provided', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: `
        <select-v2
          ref="select"
          v-model="value"
          :options="options"
          :height="120"
          :estimated-option-height="40"
          :popper-append-to-body="false">
          <template slot-scope="scope">
            <div class="dynamic-option" :style="{ height: scope.item.height + 'px' }">
              {{ scope.item.label }}
            </div>
          </template>
        </select-v2>
      `,
      data() {
        return {
          value: '',
          options: [
            { value: 1, label: 'Tall option', height: 58 },
            { value: 2, label: 'Short option', height: 46 }
          ]
        };
      }
    }, true);

    vm.$refs.select.visible = true;
    await wait(50);

    const dropdown = vm.$refs.select.$refs.popper;
    const items = dropdown.$el.querySelectorAll('.el-select-dropdown__item');
    expect(dropdown.$refs.list.$options.name).to.equal('ElDynamicSizeList');
    expect(dropdown.$refs.list.getItemSize(0)).to.equal(58);
    expect(dropdown.$refs.list.getItemSize(1)).to.equal(46);
    expect(items[1].style.top).to.equal('58px');
  });

  it('supports custom field keys with object values', () => {
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

  it('reopens the large persistent dropdown after selecting a later option', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: `
        <select-v2
          ref="select"
          v-model="value"
          :options="options"
          :height="274"
          :item-height="34"
          :overscan="3"
          filterable>
        </select-v2>
      `,
      data() {
        return {
          value: '',
          options: getOptions(10000)
        };
      }
    }, true);
    const select = vm.$refs.select;

    triggerEvent(select.$el, 'click');
    await wait(50);
    const list = select.$refs.popper.$refs.list;
    list.$refs.window.scrollTop = 8000 * 34;
    triggerEvent(list.$refs.window, 'scroll');
    await select.$nextTick();
    const laterOption = select.$refs.popper.$el.querySelector(
      '[data-option-index="8000"]'
    );
    expect(laterOption).to.exist;
    triggerEvent(laterOption, 'click');
    await wait(300);
    expect(vm.value).to.equal(8000);
    expect(select.visible).to.false;

    triggerEvent(select.$el, 'click');
    await wait(50);
    const selected = select.$refs.popper.$el.querySelector('.el-select-dropdown__item.selected');
    expect(selected).to.exist;
    expect(selected.getAttribute('data-option-index')).to.equal('8000');
    expect(list.scrollOffset).to.be.above(0);
    expect(list.$refs.window.scrollTop).to.equal(list.scrollOffset);
  });

  it('opens at a selected option loaded after the initial value', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: '<select-v2 ref="select" v-model="value" :options="options"></select-v2>',
      data() {
        return {
          value: 8000,
          options: []
        };
      }
    }, true);
    const select = vm.$refs.select;

    vm.options = getOptions(10000);
    await vm.$nextTick();
    triggerEvent(select.$el, 'click');
    await wait(50);

    const list = select.$refs.popper.$refs.list;
    const selected = select.$refs.popper.$el.querySelector('.el-select-dropdown__item.selected');
    expect(selected).to.exist;
    expect(selected.getAttribute('data-option-index')).to.equal('8000');
    expect(list.$refs.window.scrollTop).to.equal(list.scrollOffset);
  });

  it('aligns an open dropdown when delayed options arrive', async() => {
    vm = createVue({
      components: { SelectV2 },
      template: '<select-v2 ref="select" v-model="value" :options="options"></select-v2>',
      data() {
        return {
          value: 8000,
          options: []
        };
      }
    }, true);
    const select = vm.$refs.select;

    select.visible = true;
    await wait(50);
    vm.options = getOptions(10000);
    await wait(50);

    const list = select.$refs.popper.$refs.list;
    const selected = select.$refs.popper.$el.querySelector('.el-select-dropdown__item.selected');
    expect(selected).to.exist;
    expect(selected.getAttribute('data-option-index')).to.equal('8000');
    expect(list.$refs.window.scrollTop).to.equal(list.scrollOffset);
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
    vm.dropdownContentWidth = 260;
    expect(vm.dropdownStyle).to.deep.equal({ width: '260px' });

    vm.dropdownContentWidth = 120;
    expect(vm.dropdownStyle).to.deep.equal({ width: '180px' });

    vm.fitInputWidth = 320;
    expect(vm.dropdownStyle).to.deep.equal({
      width: '320px'
    });
  });

  it('measures labels efficiently without ellipsis when fit input width is false', async() => {
    const pureChineseLabel = '这是一条内容很长、在固定宽度下会自动显示省略号的选项';
    const baselineLength = pureChineseLabel.length;
    const mixedChineseLabel = ('SelectV2' + pureChineseLabel).slice(0, baselineLength);
    const pureEnglishLabel = new Array(baselineLength + 1).join('W');
    const baselineLabels = [pureChineseLabel, mixedChineseLabel, pureEnglishLabel];
    const options = getOptions(10000);
    baselineLabels.forEach((label, index) => {
      options[index] = { value: `baseline-${index}`, label };
    });
    for (let index = baselineLabels.length; index < options.length; index++) {
      const randomLength = (index * 17 + 11) % (baselineLength - 1) + 1;
      options[index].label = baselineLabels[index % baselineLabels.length].slice(0, randomLength);
    }

    expect(baselineLabels.map(label => label.length)).to.deep.equal([
      baselineLength,
      baselineLength,
      baselineLength
    ]);
    expect(options.slice(baselineLabels.length)
      .every(option => option.label.length < baselineLength)).to.true;
    vm = createVue({
      components: { SelectV2 },
      template: `
        <select-v2
          ref="select"
          v-model="value"
          :options="options"
          :fit-input-width="false"
          :popper-append-to-body="false"
          style="width: 180px;">
        </select-v2>
      `,
      data() {
        return {
          value: '',
          options
        };
      }
    }, true);
    const select = vm.$refs.select;
    select.visible = true;
    await wait(50);

    expect(select.fitInputWidth).to.false;
    expect(parseFloat(select.$refs.popper.$el.style.width)).to.be.above(180);
    expect(select.$refs.popper.$el.style.width).to.equal(select.dropdownStyle.width);
    expect(select.findWidestEstimatedLabels(1)[0]).to.equal(pureChineseLabel);
    expect(Object.keys(select._labelWidthCache)).to.have.length(3);
    select.findWidestEstimatedLabels(3).forEach(label => {
      expect(select._labelWidthCache).to.have.property(label);
    });

    const measureText = sinon.spy(select._labelMeasureContext, 'measureText');
    select.calculateLabelMaxWidth();
    expect(measureText.called).to.false;

    const findWidestLabels = sinon.spy(select, 'findWidestEstimatedLabels');
    select.requestLayoutSync();
    select.requestLayoutSync();
    await wait(50);
    expect(findWidestLabels.called).to.false;

    select.invalidateLabelWidth();
    select.requestLayoutSync();
    select.requestLayoutSync();
    await wait(50);
    expect(findWidestLabels.calledOnce).to.true;
    expect(select._labelWidthDirty).to.false;

    const broadcast = sinon.spy(select, 'broadcast');
    select.requestPopperUpdate();
    select.requestPopperUpdate();
    await wait(50);
    expect(broadcast.withArgs('ElSelectDropdown', 'updatePopper').calledOnce).to.true;
    const item = select.$refs.popper.$el.querySelector('.el-select-dropdown__item');
    const content = item.querySelector('span');

    expect(item.textContent.trim()).to.equal(pureChineseLabel);
    expect(content.scrollWidth).to.be.at.most(content.clientWidth);
    expect(item.hasAttribute('title')).to.false;
  });

  it('measures alternate candidates when Chinese brackets skew the estimate', async() => {
    const bracketLabel = '摩托罗拉系统（中国）电子有限公司';
    const wideLatinLabel = 'WWWWWWWWWWWWWWWWW';
    vm = createTest(SelectV2, {
      value: '',
      options: [
        { value: 'brackets', label: bracketLabel },
        { value: 'latin', label: wideLatinLabel }
      ],
      fitInputWidth: false,
      popperAppendToBody: false
    }, true);
    vm.visible = true;
    await wait(50);

    expect(vm.estimateLabelWidth(bracketLabel)).to.be.above(vm.estimateLabelWidth(wideLatinLabel));
    expect(vm.findWidestEstimatedLabels(1)[0]).to.equal(bracketLabel);
    expect(vm._labelWidthCache).to.have.property(bracketLabel);
    expect(vm._labelWidthCache).to.have.property(wideLatinLabel);
    expect(vm._labelWidthCache[wideLatinLabel]).to.be.above(vm._labelWidthCache[bracketLabel]);

    const items = vm.$refs.popper.$el.querySelectorAll('.el-select-dropdown__item span');
    expect(items[0].scrollWidth).to.be.at.most(items[0].clientWidth);
    expect(items[1].scrollWidth).to.be.at.most(items[1].clientWidth);
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
    await wait(30);
    expect(input.style.height).to.equal('76px');

    heightStub.returns({ height: 34 });
    vm.syncInputHeightImmediately();
    await wait(30);
    expect(input.style.height).to.equal('40px');
  });

  it('keeps the multiple search input width stable', () => {
    vm = createTest(SelectV2, {
      value: [],
      options: [],
      multiple: true,
      filterable: true
    }, true);

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
    await wait(30);

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
    await wait(30);

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
    await wait(30);

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

    const visibleItem = dropdown.$el.querySelector('.el-select-dropdown__item');
    triggerEvent(visibleItem, 'mousemove');
    await vm.$nextTick();
    expect(vm.hoveringIndex).to.equal(Number(visibleItem.getAttribute('data-option-index')));
    expect(visibleItem.classList.contains('hover')).to.true;
  });

  it('coalesces layout updates in the DOM scheduler', async() => {
    vm = createTest(SelectV2, {
      value: '',
      options: []
    }, true);
    await wait(30);
    vm.cancelLayoutSync();
    const readSpy = sinon.spy(vm, 'readLayoutMetrics');
    const writeSpy = sinon.spy(vm, 'writeLayoutMetrics');

    vm.requestLayoutSync();
    vm.requestLayoutSync();
    await wait(30);

    expect(readSpy.calledOnce).to.true;
    expect(writeSpy.calledOnce).to.true;
  });
});

/*
 * Virtual list coverage lives in virtual-list.spec.js. The old SelectV2-local
 * tests targeted the removed pre-Element-Plus API and must not be executed.
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

  it('syncs programmatic scrolling without overriding native scrolling', async() => {
    vm = createTest(FixedSizeList, {
      items: getOptions(100),
      height: 102,
      itemSize: 34,
      overscan: 1
    }, true);

    vm.scrollToIndex(20);

    expect(vm.scrollOffset).to.equal(612);
    expect(vm.startIndex).to.be.above(0);
    expect(vm.updateRequested).to.true;
    await vm.$nextTick();
    expect(vm.$refs.window.scrollTop).to.equal(612);

    vm.$refs.window.scrollTop = 340;
    triggerEvent(vm.$refs.window, 'scroll');
    await vm.$nextTick();
    expect(vm.scrollOffset).to.equal(340);
    expect(vm.updateRequested).to.false;
    expect(vm.$refs.window.scrollTop).to.equal(340);
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
    await list.$nextTick();
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
    const scrollEvents = [];
    vm.$on('end-reached', direction => reached.push(direction));
    vm.$on('scroll', (...args) => scrollEvents.push(args));
    const wheelEvent = {
      deltaX: 0,
      deltaY: 40,
      preventDefault: sinon.spy()
    };

    vm.handleWheel(wheelEvent);
    expect(vm.scrollOffset).to.equal(40);
    expect(scrollEvents[0]).to.deep.equal(['forward', 40, true]);
    expect(wheelEvent.preventDefault.called).to.true;

    vm.scrollTo(vm.maxOffset);
    expect(reached).to.deep.equal(['bottom']);
    vm.resetScrollTop();
    expect(vm.scrollOffset).to.equal(0);
  });
});
*/
