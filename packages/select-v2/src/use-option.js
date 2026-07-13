import { getValueByPath } from 'element-ui/src/utils/util';

export function createOptionAdapter(vm, propsAdapter) {
  const getValueKey = value => {
    if (value !== null && typeof value === 'object') {
      return getValueByPath(value, vm.valueKey);
    }
    return value;
  };

  return {
    getValueKey,
    getOptionKey(option) {
      return option && option.__selectV2Key
        ? option.__selectV2Key
        : getValueKey(propsAdapter.getValue(option));
    },
    isSameValue(left, right) {
      return getValueKey(left) === getValueKey(right);
    },
    getValueIndex(values, value) {
      const key = getValueKey(value);
      return values.findIndex(item => getValueKey(item) === key);
    }
  };
}
