import TableV2 from './src/table';
import AutoResizer from './src/auto-resizer';
import { FixedDir, Alignment, SortOrder, ScrollStrategy, TableV2Placeholder } from './src/constants';

TableV2.AutoResizer = AutoResizer;
TableV2.FixedDir = FixedDir;
TableV2.Alignment = Alignment;
TableV2.SortOrder = SortOrder;
TableV2.ScrollStrategy = ScrollStrategy;
TableV2.TableV2Placeholder = TableV2Placeholder;

/* istanbul ignore next */
TableV2.install = function(Vue) {
  Vue.component(TableV2.name, TableV2);
  Vue.component(AutoResizer.name, AutoResizer);
};

export { AutoResizer, FixedDir, Alignment, SortOrder, ScrollStrategy, TableV2Placeholder };
export default TableV2;
