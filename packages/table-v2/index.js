import ElTableV2 from './src/table';

/* istanbul ignore next */
ElTableV2.install = function(Vue) {
  Vue.component(ElTableV2.name, ElTableV2);
};

export default ElTableV2;
