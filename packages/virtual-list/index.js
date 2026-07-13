import buildList from './src/build-list';
import fixedSizeList from './src/fixed-size-list';
import dynamicSizeList from './src/dynamic-size-list';

const FixedSizeList = buildList(fixedSizeList);
const DynamicSizeList = buildList(dynamicSizeList);

export { FixedSizeList, DynamicSizeList };
