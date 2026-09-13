export default {
  name: 'TableV2ExpandIcon',
  functional: true,
  props: { expanded: Boolean, size: Number, expandable: Boolean },
  render(h, context) {
    const p = context.props;
    return h('span', {
      class: ['el-table-v2__expand-icon', p.expanded ? 'el-table-v2__expand-icon--expanded' : ''],
      style: { width: `${p.size || 12}px`, height: `${p.size || 12}px` },
      attrs: {
        role: p.expandable ? 'button' : undefined,
        tabindex: p.expandable ? 0 : undefined,
        'aria-expanded': p.expandable ? String(p.expanded) : undefined
      },
      on: context.data.on
    }, [h('i', { class: 'el-icon-arrow-right' })]);
  }
};
