import Vue from 'vue';
import { expect } from 'chai';
import RemoteSelect from 'packages/remote-select';
import cache, { RemoteSelectCache } from 'packages/remote-select/src/cache/index';
import { serialize, write } from 'packages/remote-select/src/cache/cache-storage';
import { createTest, createVue, destroyVM } from '../util';

Vue.component(RemoteSelect.name, RemoteSelect);

describe('RemoteSelect', () => {
  let vm;
  afterEach(() => { if (vm) destroyVM(vm); vm = null; cache.clear(); });
  const mount = propsData => { vm = createTest(RemoteSelect, { cache: true, remote: true, ...propsData }, true); return vm; };

  describe('Select compatibility', () => {
    it('renders local options and echoes the default value', async() => {
      const component = createTest(RemoteSelect, {
        value: 'sh',
        options: [{ value: 'sh', label: '上海' }]
      }, true);
      vm = component;
      await Vue.nextTick();
      expect(component.remote).to.equal(false);
      expect(component.filterable).to.equal(false);
      expect(component.renderedOptions[0].label).to.equal('上海');
    });

    it('forwards select props and supports filterable mode', async() => {
      const component = createTest(RemoteSelect, {
        filterable: true,
        multiple: true,
        options: [{ value: 'sh', label: '上海' }]
      }, true);
      vm = component;
      await Vue.nextTick();
      expect(component.filterable).to.equal(true);
      expect(component.multiple).to.equal(true);
      expect(component.$refs.select).to.exist;
    });

    it('forwards select events and renders option and empty slots', async() => {
      const events = [];
      const host = createVue({
        components: { RemoteSelect },
        data: () => ({ selected: '', remoteMethod: () => [] }),
        template: '<el-remote-select ref="remote" v-model="selected" filterable @focus="onFocus"><template slot="option" slot-scope="scope"><span class="custom-option">{{ scope.option.label }}</span></template><template slot="empty"><span class="custom-empty">empty</span></template></el-remote-select>',
        methods: { onFocus() { events.push('focus'); } }
      }, true);
      vm = host;
      host.$refs.remote.remoteOptions = [{ value: 'a', label: 'A' }];
      await Vue.nextTick();
      expect(host.$el.querySelector('.custom-option')).to.exist;
      host.$refs.remote.$emit('focus');
      expect(events).to.deep.equal(['focus']);
    });

    it('forwards select methods', () => {
      const component = createTest(RemoteSelect, {}, true);
      vm = component;
      expect(component.focus()).to.equal(undefined);
    });
  });

  describe('RemoteSelect features', () => {

    it('normalizes queries and synchronous remote options', async() => {
      let calls = 0;
      const component = mount({ cacheKey: 'sync', remoteMethod: query => { calls++; return [{ value: query, label: 1 }]; } });
      await component.search(123);
      expect(calls).to.equal(1);
      expect(component.remoteOptions[0].label).to.equal('1');
      await component.search(null);
      expect(component.lastQuery).to.equal('');
    });

    it('keeps the input empty when the bound value is an empty string', async() => {
      const component = mount({
        value: '',
        cacheKey: 'empty-value',
        filterable: true,
        remoteMethod: () => [{ value: 1, label: '选项1' }]
      });
      expect(component.value).to.equal('');
      expect(component.$refs.select.selectedLabel).to.equal('');
      expect(component.$refs.select.$refs.reference.$el.querySelector('input').value)
        .to.equal('');
      await component.search('');
      await Vue.nextTick();
      expect(component.$refs.select.selectedLabel).to.equal('');
      expect(component.$refs.select.$refs.reference.$el.querySelector('input').value)
        .to.equal('');
    });

    it('keeps an empty form value when rendered inside el-form', async() => {
      const host = createVue({
        data: () => ({
          form: { value: '' },
          options: []
        }),
        methods: {
          remoteMethod: () => Promise.resolve([{ value: 1, label: '选项1' }])
        },
        template: `
          <el-form :model="form">
            <el-form-item prop="value">
              <el-remote-select
                ref="select"
                v-model="form.value"
                :options="options"
                cache
                cache-key="form-value"
                remote
                filterable
                :remote-method="remoteMethod"
              />
            </el-form-item>
          </el-form>
        `
      }, true);
      vm = host;
      await Vue.nextTick();
      expect(host.form.value).to.equal('');
      expect(host.$refs.select.$refs.select.selectedLabel).to.equal('');
      expect(host.$el.querySelector('input').value).to.equal('');
    });

    it('fully disables cache reads, writes and cache-change events when cache is false', async() => {
      const shared = new RemoteSelectCache();
      shared.set('cache-disabled', 'q', [{ value: 'cached', label: 'Cached' }], 20, 'value');
      let calls = 0;
      const component = mount({ cache: false, cacheKey: 'cache-disabled', remoteMethod: () => { calls++; return [{ value: 'fresh', label: 'Fresh' }]; } });
      let cacheChanges = 0;
      component.$on('cache-change', () => { cacheChanges++; });
      await component.search('q');
      expect(calls).to.equal(1);
      expect(component.remoteOptions[0].value).to.equal('fresh');
      expect(component.getCacheStats()).to.deep.equal({ size: 0, querySize: 0, resolvedSize: 0 });
      expect(component.getCacheList()).to.deep.equal([]);
      shared.set('cache-disabled', 'other', [{ value: 'other', label: 'Other' }], 20, 'value');
      await Vue.nextTick();
      expect(cacheChanges).to.equal(0);
      expect(component.invalidateCache('q')).to.equal(false);
      expect(component.invalidateOption('fresh')).to.equal(false);
    });

    it('does not read or write the empty query cache by default', async() => {
      const component = mount({ cacheKey: 'empty-default', remoteMethod: () => [{ value: 'all', label: 'All' }] });
      cache.set('empty-default', '', [{ value: 'cached', label: 'Cached' }], 20, 'value');
      await component.search('');
      expect(component.remoteOptions[0].value).to.equal('all');
      expect(component.getCacheList().some(item => item.query === '')).to.equal(true);
      expect(component.getCacheList().find(item => item.query === '').options[0].value).to.equal('cached');
    });

    it('reads and writes the empty query cache when enabled', async() => {
      let calls = 0;
      const component = mount({ cacheKey: 'empty-enabled', cacheEmptyQuery: true, remoteMethod: () => { calls++; return [{ value: 'all', label: 'All' }]; } });
      await component.search('');
      await component.search('');
      expect(calls).to.equal(1);
      expect(component.remoteOptions[0].value).to.equal('all');
    });

    it('allows cache=false without cacheKey but throws when cache=true has no cacheKey', async() => {
      const component = mount({ cache: false, remoteMethod: () => [{ value: 'fresh', label: 'Fresh' }] });
      await component.search('q');
      expect(component.remoteOptions[0].value).to.equal('fresh');
      let error;
      const previousHandler = Vue.config.errorHandler;
      Vue.config.errorHandler = exception => { error = exception; };
      try {
        createTest(RemoteSelect, { cache: true, remoteMethod: () => [] }, true);
      } catch (exception) {
        error = exception;
      }
      Vue.config.errorHandler = previousHandler;
      expect(error.message).to.contain('cacheKey is required when cache is true');
    });

    it('supports Promise methods and rejects invalid options', async() => {
      const component = mount({ cacheKey: 'promise', remoteMethod: () => Promise.resolve([{ value: 'a', label: 'A' }]) });
      await component.search('a');
      expect(component.remoteOptions).to.have.length(1);
      const invalid = mount({ cacheKey: 'invalid', remoteMethod: () => [{ label: 'missing value' }] });
      await invalid.search('a');
      expect(invalid.error).to.equal(true);
    });

    it('resolves missing bound values and uses options first', async() => {
      const calls = [];
      const component = mount({
        value: ['1', '2'],
        multiple: true,
        options: [
          { value: '1', label: 'one' },
          { value: '3', label: 'unused' }
        ],
        cacheKey: 'resolve',
        remoteMethod: () => [{ value: '4', label: 'search result' }],
        resolveValue: values => {
          calls.push(values);
          return Promise.resolve([{ value: '2', label: 'two' }]);
        }
      });
      await Vue.nextTick();
      await component.resolveRequest;
      expect(calls).to.deep.equal([['2']]);
      expect(component.remoteOptions.map(option => option.label)).to.include('two');

      await component.search('search');
      expect(component.renderedOptions.map(option => option.value))
        .to.have.members(['4', '1', '2']);
      expect(component.renderedOptions).to.have.length(3);
    });

    it('supports synchronous resolveValue and resolves all missing multiple values', async() => {
      const calls = [];
      const component = mount({ value: ['a', 'b'], multiple: true, cacheKey: 'resolve-sync', options: [], remoteMethod: () => [], resolveValue: values => { calls.push(values.slice()); return values.map(value => ({ value, label: value.toUpperCase() })); } });
      await Vue.nextTick();
      expect(calls).to.deep.equal([['a', 'b']]);
      expect(component.remoteOptions.map(option => option.value)).to.have.members(['a', 'b']);
      expect(component.resolveError).to.equal(false);
    });

    it('uses option cache before resolveValue and reindexes when valueKey changes', async() => {
      let calls = 0;
      const component = mount({ value: { id: 1 }, cacheKey: 'resolve-cache', valueKey: 'id', remoteMethod: () => [], resolveValue: () => { calls++; return [{ value: { id: 1 }, label: 'resolved' }]; } });
      await Vue.nextTick();
      expect(calls).to.equal(1);
      component.value = { id: 1 };
      await Vue.nextTick();
      expect(calls).to.equal(1);
      const local = new RemoteSelectCache();
      local.setOption('reindex', { value: { id: 1, code: 7 }, label: 'item' }, 'id', 20);
      local.reindex('reindex', 'code');
      expect(local.getOption('reindex', { code: 7 }, 'code').label).to.equal('item');
    });

    it('cancels stale resolve requests and accepts options that arrive later', async() => {
      let rejectOld;
      let calls = 0;
      const component = mount({ value: 'old', cacheKey: 'resolve-cancel', options: [], remoteMethod: () => [], resolveValue: values => { calls++; if (calls === 1) return new Promise((resolve, reject) => { rejectOld = reject; }); return [{ value: values[0], label: 'new' }]; } });
      await Vue.nextTick();
      component.value = 'new';
      await Vue.nextTick();
      expect(calls).to.equal(2);
      expect(component.remoteOptions.some(option => option.label === 'new')).to.equal(true);
      rejectOld(new Error('late failure'));
      await Vue.nextTick();
      expect(component.resolveError).to.equal(false);
      component.options = [{ value: 'missing', label: 'now local' }];
      component.value = 'missing';
      await Vue.nextTick();
      expect(component.resolveError).to.equal(false);
    });

    it('matches objects by valueKey and overwrites option cache entries', () => {
      const local = new RemoteSelectCache();
      local.setOption('objects', { value: { id: 1 }, label: 'old' }, 'id', 20);
      local.setOption('objects', { value: { id: 1 }, label: 'new' }, 'id', 20);
      expect(local.getOption('objects', { id: 1 }, 'id').label).to.equal('new');
      expect(local.stats('objects', 0).resolvedSize).to.equal(1);
    });

    it('keeps query and option capacities independent and preserves duplicates', () => {
      const local = new RemoteSelectCache();
      local.set('capacity', 'q', [{ value: 1, label: 'a' }, { value: 1, label: 'b' }], 1, 'value');
      local.setOption('capacity', { value: 2, label: 'resolved' }, 'value', 1);
      expect(local.peek('capacity', 'q', 0)).to.have.length(2);
      expect(local.stats('capacity', 0).querySize).to.equal(1);
      expect(local.stats('capacity', 0).resolvedSize).to.equal(1);
    });

    it('reports storage serialization and write results', () => {
      const snapshot = { queries: [], options: [] };
      const serialized = serialize(snapshot);
      expect(serialized.reason).to.equal(undefined);
      expect(serialized.bytes).to.be.above(0);
      expect(write('storage-result', snapshot).success).to.equal(true);

      const circular = {};
      circular.self = circular;
      expect(serialize(circular).reason).to.equal('serialize-failed');
    });

    it('enforces both capacities when limits change and releases expired query references', async() => {
      const local = new RemoteSelectCache();
      local.set('resize', 'a', [{ value: 'a', label: 'A' }], 20, 'value');
      local.set('resize', 'b', [{ value: 'b', label: 'B' }], 20, 'value');
      local.setOption('resize', { value: 'x', label: 'X' }, 'value', 20);
      local.setOption('resize', { value: 'y', label: 'Y' }, 'value', 20);
      local.enforce('resize', 1, 1);
      expect(local.stats('resize', 0).querySize).to.equal(1);
      expect(local.stats('resize', 0).resolvedSize).to.equal(1);
      await new Promise(resolve => setTimeout(resolve, 5));
      expect(local.peek('resize', 'b', 1)).to.equal(undefined);
      expect(local.getOption('resize', 'b', 'value')).to.equal(undefined);
    });

    it('isolates listener failures and invalidates query and option entries', () => {
      const local = new RemoteSelectCache();
      const events = [];
      local.subscribe('events', () => { throw new Error('listener'); });
      local.subscribe('events', change => events.push(change.type));
      local.set('events', 'q', [{ value: '1', label: 'one' }], 20, 'value');
      local.setOption('events', { value: '2', label: 'two' }, 'value', 20);
      expect(local.invalidate('events', 'q')).to.equal(true);
      expect(local.invalidateOption('events', '2', 'value')).to.equal(true);
      expect(events).to.include('set');
      expect(events).to.include('option-set');
      expect(events).to.include('invalidate');
      expect(events).to.include('option-invalidate');
    });

    it('keeps active cache subscriptions after clearing a namespace', () => {
      const events = [];
      const unsubscribe = cache.subscribe('clear-subscription', change => {
        events.push(change.type);
      });
      cache.set(
        'clear-subscription',
        'before-clear',
        [{ value: 'before', label: 'Before' }],
        20,
        'value'
      );
      cache.clear('clear-subscription');
      cache.set(
        'clear-subscription',
        'after-clear',
        [{ value: 'after', label: 'After' }],
        20,
        'value'
      );
      unsubscribe();
      expect(events).to.deep.equal(['set', 'clear', 'set']);
    });

    it('does not cache rejected requests and supports retry', async() => {
      let attempts = 0;
      const component = mount({ cacheKey: 'retry', remoteMethod: () => { attempts++; return attempts === 1 ? Promise.reject(new Error('network')) : [{ value: 'ok', label: 'OK' }]; } });
      await component.search('x');
      expect(component.error).to.equal(true);
      await component.retry();
      expect(component.error).to.equal(false);
      expect(component.remoteOptions[0].value).to.equal('ok');
    });

    it('normalizes boundary inputs and honors minQueryLength', async() => {
      const calls = [];
      const component = mount({ cacheKey: 'search-boundary', minQueryLength: 2, remoteMethod: (query, context) => { calls.push([query, context]); return [{ value: query, label: query }]; } });
      component.handleRemoteMethod(null);
      component.handleRemoteMethod(1);
      await Vue.nextTick();
      expect(calls).to.have.length(0);
      component.handleRemoteMethod({ toString: () => 'abc' });
      await Vue.nextTick();
      expect(calls).to.have.length(1);
      expect(calls[0][0]).to.equal('abc');
      expect(calls[0][1]).to.have.keys('cacheKey', 'valueKey', 'signal', 'cancelToken');
      expect(component.loading).to.equal(false);
    });

    it('allows only the newest request to update state and cache', async() => {
      const pending = {};
      const component = mount({ cacheKey: 'race', remoteMethod: query => new Promise(resolve => { pending[query] = resolve; }) });
      const oldRequest = component.search('old');
      const newRequest = component.search('new');
      pending.old([{ value: 'old', label: 'old' }]);
      await oldRequest;
      expect(component.remoteOptions).to.deep.equal([]);
      pending.new([{ value: 'new', label: 'new' }]);
      await newRequest;
      expect(component.remoteOptions[0].value).to.equal('new');
      expect(component.getCacheList().map(item => item.query)).to.deep.equal(['new']);
    });

    it('emits remote-error, keeps selected display and retries successfully', async() => {
      let fail = true;
      const errors = [];
      const component = mount({ value: 'selected', cacheKey: 'search-error', options: [{ value: 'selected', label: 'Selected' }], remoteMethod: () => fail ? Promise.reject(new Error('network')) : [{ value: 'result', label: 'Result' }] });
      component.$on('remote-error', (error, query) => errors.push([error.message, query]));
      await component.search('q');
      expect(component.error).to.equal(true);
      expect(component.renderedOptions.some(option => option.label === 'Selected')).to.equal(true);
      expect(component.getCacheStats().querySize).to.equal(0);
      fail = false;
      await component.retry();
      expect(errors[0]).to.deep.equal(['network', 'q']);
      expect(component.error).to.equal(false);
    });

    it('restores query and resolved-option caches in a new cache instance', () => {
      const first = new RemoteSelectCache();
      first.set('persist', 'query', [{ value: '1', label: 'one' }], 20, 'value');
      first.setOption('persist', { value: '2', label: 'two' }, 'value', 20);
      const restored = new RemoteSelectCache();
      expect(restored.peek('persist', 'query', 0)[0].label).to.equal('one');
      expect(restored.getOption('persist', '2', 'value').label).to.equal('two');
      restored.clear('persist');
    });

    it('switches cache namespaces and cancels the old request', async() => {
      const pending = [];
      const host = createVue({
        components: { RemoteSelect },
        data: () => ({ key: 'old' }),
        template: '<el-remote-select ref="remote" :cache-key="key" :remote-method="remoteMethod" />',
        methods: { remoteMethod: () => new Promise(resolve => pending.push(resolve)) }
      }, true);
      vm = host;
      const remote = host.$refs.remote;
      const request = remote.search('q');
      host.key = 'new';
      await Vue.nextTick();
      expect(remote.cacheKey).to.equal('new');
      expect(remote.getCacheStats().querySize).to.equal(0);
      pending[0]([{ value: 'old', label: 'old' }]);
      await request;
      expect(remote.remoteOptions).to.deep.equal([]);
    });

    it('ignores results that arrive after component destruction', async() => {
      let resolveRequest;
      const component = mount({ cacheKey: 'destroy', remoteMethod: () => new Promise(resolve => { resolveRequest = resolve; }) });
      const request = component.search('q');
      destroyVM(component);
      resolveRequest([{ value: 'late', label: 'late' }]);
      await request;
      expect(component.remoteOptions).to.deep.equal([]);
    });

    it('exposes cache controls', () => {
      const component = mount({ cacheKey: 'controls', remoteMethod: () => [] });
      expect(component.getCacheStats()).to.have.keys('size', 'querySize', 'resolvedSize');
      expect(component.getCacheList()).to.be.an('array');
    });

  });
});
