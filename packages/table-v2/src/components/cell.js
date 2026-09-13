import { columnAlignClass, renderValue } from '../utils';

export default {
  name: 'TableV2Cell',
  functional: true,
  props: {
    column: Object,
    value: null,
    style: Object,
    className: [String, Array, Object],
    cellRenderer: [Object, Function],
    scope: Object,
    prefix: [Object, Array]
  },
  render(h, context) {
    const p = context.props;
    const scoped = context.slots && context.slots().default;
    let custom = null;
    if (typeof p.cellRenderer === 'function') custom = p.cellRenderer(p.scope);
    else if (p.cellRenderer) custom = h(p.cellRenderer, { props: p.scope });
    const content = custom || scoped || [h('span', { class: 'el-table-v2__cell-text' }, [renderValue(h, p.value)])];
    return h('div', {
      class: ['el-table-v2__cell', columnAlignClass(p.column && p.column.align), p.className],
      style: p.style,
      attrs: Object.assign({ role: 'cell' }, context.data.attrs || {}),
      domProps: context.data.domProps,
      on: context.data.on
    }, (Array.isArray(p.prefix) ? p.prefix : [p.prefix]).filter(Boolean).concat(Array.isArray(content) ? content : [content]));
  }
};
