import ElTableVirtual from './src/table-virtual';

/* istanbul ignore next */
ElTableVirtual.install = function(Vue) {
  Vue.component(ElTableVirtual.name, ElTableVirtual);
};

export default ElTableVirtual;
