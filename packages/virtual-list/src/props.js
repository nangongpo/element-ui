import { DEFAULT_DYNAMIC_LIST_ITEM_SIZE, LTR, VERTICAL } from './defaults';

export const virtualizedProps = {
  className: { type: [String, Array, Object, Boolean], default: '' },
  containerElement: { type: [String, Object], default: 'div' },
  data: { type: Array, default: () => [] },
  direction: { type: String, default: LTR },
  height: { type: [Number, String], required: true },
  innerElement: { type: [String, Object], default: 'div' },
  innerProps: { type: Object, default: () => ({}) },
  innerWidth: [Number, String],
  perfMode: { type: Boolean, default: true },
  useIsScrolling: Boolean,
  width: [Number, String],
  scrollbarAlwaysOn: Boolean
};

export const virtualizedListProps = Object.assign({}, virtualizedProps, {
  cache: { type: Number, default: 2 },
  estimatedItemSize: { type: Number, default: DEFAULT_DYNAMIC_LIST_ITEM_SIZE },
  initScrollOffset: { type: Number, default: 0 },
  itemSize: { type: [Number, Function], required: true },
  layout: { type: String, default: VERTICAL },
  total: { type: Number, required: true }
});

export const virtualizedGridProps = Object.assign({}, virtualizedProps, {
  columnCache: { type: Number, default: 2 },
  columnWidth: { type: [Number, Function], required: true },
  estimatedColumnWidth: Number,
  estimatedRowHeight: Number,
  hScrollbarSize: { type: Number, default: 6 },
  initScrollLeft: { type: Number, default: 0 },
  initScrollTop: { type: Number, default: 0 },
  itemKey: { type: Function, default: ({ columnIndex, rowIndex }) => `${rowIndex}:${columnIndex}` },
  rowCache: { type: Number, default: 2 },
  rowHeight: { type: [Number, Function], required: true },
  role: String,
  scrollbarEndGap: { type: Number, default: 2 },
  scrollbarStartGap: { type: Number, default: 0 },
  totalColumn: { type: Number, required: true },
  totalRow: { type: Number, required: true },
  vScrollbarSize: { type: Number, default: 6 }
});

export const virtualizedScrollbarProps = {
  alwaysOn: Boolean,
  layout: { type: String, default: VERTICAL },
  total: Number,
  ratio: { type: Number, required: true },
  clientSize: { type: Number, required: true },
  scrollFrom: { type: Number, required: true },
  scrollbarSize: { type: Number, default: 6 },
  startGap: { type: Number, default: 0 },
  endGap: { type: Number, default: 2 },
  visible: Boolean
};
