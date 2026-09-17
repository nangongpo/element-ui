import { hasOwn } from 'element-ui/src/utils/util.js';

export function isVNode(node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions');
};

// Vue 2 does not expose cloneVNode publicly. Recreate a VNode while
// preserving the component/element data used by the renderer.
export const cloneVNode = (h, vnode, patch = {}) => {
  const data = vnode.data || {};
  const componentOptions = vnode.componentOptions;
  if (componentOptions && componentOptions.Ctor) {
    const props = componentOptions.propsData || {};
    return h(componentOptions.Ctor, {
      key: vnode.key,
      props: Object.assign({}, props, {
        style: Object.assign({}, props.style, patch.style || {})
      }),
      attrs: data.attrs,
      domProps: data.domProps,
      on: data.on,
      nativeOn: data.nativeOn,
      class: data.class,
      style: data.style,
      scopedSlots: data.scopedSlots
    });
  }
  return h(vnode.tag, Object.assign({}, data, patch, {
    key: vnode.key,
    style: Object.assign({}, data.style, patch.style || {})
  }), vnode.children);
};
