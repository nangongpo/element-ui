import { RTL_OFFSET_NAG, RTL_OFFSET_POS_DESC, RTL_OFFSET_POS_ASC } from './defaults';

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const getScrollDir = (prev, next) => next > prev ? 'forward' : 'backward';

export const isRTL = direction => direction === 'rtl';

export const getRTLOffsetType = () => {
  if (typeof document === 'undefined') return RTL_OFFSET_POS_ASC;
  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.dir = 'rtl';
  outer.style.width = '4px';
  outer.style.height = '1px';
  outer.style.overflow = 'scroll';
  inner.style.width = '8px';
  inner.style.height = '1px';
  outer.appendChild(inner);
  document.body.appendChild(outer);
  if (outer.scrollLeft > 0) {
    document.body.removeChild(outer);
    return RTL_OFFSET_POS_DESC;
  }
  outer.scrollLeft = 1;
  const type = outer.scrollLeft === 0 ? RTL_OFFSET_NAG : RTL_OFFSET_POS_ASC;
  document.body.removeChild(outer);
  return type;
};

export const normalizeRTLScrollLeft = (value, direction, element) => {
  if (direction !== 'rtl') return value;
  const type = getRTLOffsetType();
  if (type === RTL_OFFSET_NAG) return -value;
  if (type === RTL_OFFSET_POS_DESC) return element.scrollWidth - element.clientWidth - value;
  return value;
};
