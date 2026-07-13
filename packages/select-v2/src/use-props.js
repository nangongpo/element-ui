import { getValueByPath } from 'element-ui/src/utils/util';

export function createPropsAdapter(vm) {
  const getAliasProps = () => ({
    value: 'value',
    label: vm.labelKey,
    disabled: vm.disabledKey,
    options: 'options'
  });

  const getField = (option, field) => {
    if (!option) return undefined;
    return getValueByPath(option, getAliasProps()[field]);
  };

  return {
    getAliasProps,
    getLabel(option) {
      const label = getField(option, 'label');
      return label === undefined || label === null ? '' : label;
    },
    getValue(option) {
      return getField(option, 'value');
    },
    getDisabled(option) {
      return Boolean(getField(option, 'disabled'));
    },
    getOptions(option) {
      return getField(option, 'options');
    }
  };
}
