export function createAllowCreate(vm, propsAdapter, optionAdapter) {
  const findCreatedIndex = option => vm.createdOptions.findIndex(item =>
    optionAdapter.isSameValue(propsAdapter.getValue(item), propsAdapter.getValue(option)));

  return {
    createNewOption(query) {
      if (!vm.allowCreate || !vm.filterable || !query) return null;
      const exists = vm.allOptions.some(option => propsAdapter.getLabel(option) === query);
      if (exists) return null;
      const aliases = propsAdapter.getAliasProps();
      return {
        [aliases.value]: query,
        [aliases.label]: query,
        created: true,
        __created: true
      };
    },
    selectNewOption(option) {
      if (!option || !option.created || findCreatedIndex(option) > -1) return;
      vm.createdOptions.push(option);
    },
    removeNewOption(option) {
      if (!option || !option.created) return;
      const index = findCreatedIndex(option);
      if (index > -1) vm.createdOptions.splice(index, 1);
    },
    clearAllNewOption() {
      vm.createdOptions = [];
    }
  };
}
