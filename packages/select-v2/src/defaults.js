export const DEFAULT_ITEM_HEIGHT = 34;
export const DEFAULT_HEIGHT = 274;
export const DEFAULT_DEBOUNCE = 300;
export const DEFAULT_OVERSCAN = 3;

const positiveNumber = value => value > 0;
const nonNegativeNumber = value => value >= 0;
const fitInputWidth = value => typeof value === 'boolean' ||
  (typeof value === 'number' && value > 0);

export const selectV2Props = {
  allowCreate: Boolean,
  autocomplete: {
    type: String,
    default: 'none'
  },
  automaticDropdown: Boolean,
  clearable: Boolean,
  clearIcon: {
    type: String,
    default: 'el-icon-circle-close'
  },
  effect: {
    type: String,
    default: 'light'
  },
  collapseTags: Boolean,
  collapseTagsTooltip: Boolean,
  tagTooltip: {
    type: Object,
    default() {
      return {};
    }
  },
  maxCollapseTags: {
    type: Number,
    default: 1
  },
  defaultFirstOption: Boolean,
  disabled: Boolean,
  estimatedOptionHeight: Number,
  filterable: Boolean,
  filterMethod: Function,
  height: {
    type: Number,
    default: DEFAULT_HEIGHT,
    validator: positiveNumber
  },
  itemHeight: {
    type: Number,
    default: DEFAULT_ITEM_HEIGHT,
    validator: positiveNumber
  },
  id: String,
  loading: Boolean,
  loadingText: String,
  value: {
    required: true
  },
  multiple: Boolean,
  multipleLimit: {
    type: Number,
    default: 0
  },
  name: String,
  noDataText: String,
  noMatchText: String,
  remoteMethod: Function,
  reserveKeyword: {
    type: Boolean,
    default: true
  },
  options: {
    type: Array,
    default() {
      return [];
    }
  },
  placeholder: String,
  popperAppendToBody: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: true
  },
  popperClass: String,
  popperStyle: [String, Object],
  popperOptions: {
    type: Object,
    default() {
      return { gpuAcceleration: false };
    }
  },
  remote: Boolean,
  debounce: {
    type: Number,
    default: DEFAULT_DEBOUNCE
  },
  size: String,
  valueKey: {
    type: String,
    default: 'value'
  },
  scrollbarAlwaysOn: Boolean,
  validateEvent: {
    type: Boolean,
    default: true
  },
  offset: {
    type: Number,
    default: 12
  },
  remoteShowSuffix: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  },
  placement: {
    type: String,
    default: 'bottom-start'
  },
  fallbackPlacements: {
    type: Array,
    default() {
      return ['bottom-start', 'top-start', 'right', 'left'];
    }
  },
  tagType: {
    type: String,
    default: 'info'
  },
  tagEffect: {
    type: String,
    default: 'light'
  },
  tabindex: {
    type: [String, Number],
    default: 0
  },
  appendTo: [String, Object],
  fitInputWidth: {
    type: [Boolean, Number],
    default: true,
    validator: fitInputWidth
  },
  suffixIcon: {
    type: String,
    default: 'el-icon-arrow-up'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function],
    default: ''
  },
  emptyValues: {
    type: Array,
    default() {
      return ['', undefined, null];
    }
  },
  ariaLabel: String,

  // Element UI compatibility props.
  labelKey: {
    type: String,
    default: 'label'
  },
  disabledKey: {
    type: String,
    default: 'disabled'
  },
  overscan: {
    type: Number,
    default: DEFAULT_OVERSCAN,
    validator: nonNegativeNumber
  }
};

export const optionProps = {
  data: Array,
  disabled: Boolean,
  hovering: Boolean,
  item: {
    type: Object,
    required: true
  },
  index: Number,
  selected: Boolean,
  created: Boolean,
  label: [String, Number],
  dynamic: Boolean,
  contentId: String,
  itemHeight: {
    type: Number,
    default: DEFAULT_ITEM_HEIGHT
  }
};

export const selectV2Emits = {
  input: () => true,
  change: () => true,
  'end-reached': direction => ['top', 'bottom', 'left', 'right'].indexOf(direction) > -1,
  'remove-tag': () => true,
  'visible-change': visible => typeof visible === 'boolean',
  focus: event => Boolean(event),
  blur: event => Boolean(event),
  clear: () => true
};

export const optionEmits = {
  hover: index => typeof index === 'number',
  select: () => true,
  resize: (index, height) => typeof index === 'number' && typeof height === 'number'
};
