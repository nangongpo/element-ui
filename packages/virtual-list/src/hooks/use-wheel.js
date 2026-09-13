import { HORIZONTAL } from '../defaults';

export default function useWheel(vm, callback) {
  return event => {
    let deltaX = event.deltaX || 0;
    let deltaY = event.deltaY || 0;
    if (event.shiftKey && deltaY !== 0) {
      deltaX = deltaY;
      deltaY = 0;
    }
    const x = vm.layout === HORIZONTAL ? deltaX : deltaX;
    const y = vm.layout === HORIZONTAL ? deltaY : deltaY;
    if (x || y) {
      event.preventDefault();
      callback(x, y);
    }
  };
}
