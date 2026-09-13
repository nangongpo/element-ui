export default {
  name: 'TableV2SortIcon',
  functional: true,
  props: { order: String, label: String },
  render(h, context) {
    const p = context.props;
    return h('span', {
      class: ['el-table-v2__sort-icon', p.order ? 'is-sorting' : '', p.order ? `is-${p.order}` : ''],
      attrs: { 'aria-label': `Sort by ${p.label || ''}` }
    }, [h('i', { class: p.order === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up' })]);
  }
};
