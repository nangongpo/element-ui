import {
  arrayFind,
  getValueByPath,
  looseEqual
} from 'element-ui/src/utils/util';

export default {
  computed: {
    selectedValues() {
      const values = this.multiple
        ? (Array.isArray(this.value) ? this.value : [])
        : [this.value];
      return values.filter(item => {
        return item !== undefined && item !== null && item !== '';
      });
    },
    renderedOptions() {
      const options = (this.remote
        ? this.remoteOptions
        : this.optionsNormalized.concat(this.remoteOptions)
      ).map(option => ({ ...option }));
      const availableOptions = this.remoteOptions.concat(this.optionsNormalized);

      this.selectedValues.forEach(value => {
        if (arrayFind(options, option => this.sameValue(option.value, value))) {
          return;
        }
        const selectedOption = arrayFind(
          availableOptions,
          option => this.sameValue(option.value, value)
        );
        if (selectedOption) options.push({ ...selectedOption });
      });

      return options.filter(option => option && option.value !== undefined);
    }
  },
  methods: {
    /** Return the value used by el-select for an option. */
    getOptionValue(option) {
      return option ? this.getValue(option.value) : undefined;
    },

    /** Extract a primitive or valueKey field from a bound value. */
    getValue(value) {
      return value && typeof value === 'object'
        ? getValueByPath(value, this.valueKey)
        : value;
    },

    /** Compare values using the active valueKey without matching missing object fields. */
    sameValue(a, b) {
      const left = this.getValue(a);
      const right = this.getValue(b);
      const hasObjectValue = (
        a && typeof a === 'object' || b && typeof b === 'object'
      );
      if (hasObjectValue && (left === undefined || right === undefined)) {
        return false;
      }
      return looseEqual(left, right);
    },

    /** Normalize options synchronously and throw for invalid entries. */
    normalizeOptions(options, source) {
      if (!Array.isArray(options)) throw new Error(`${source} must return an option array`);
      return options.map((option, index) => {
        if (
          !option ||
          typeof option !== 'object' ||
          option.value === undefined ||
          option.value === null
        ) {
          throw new Error(`${source} returned an invalid option at index ${index}`);
        }
        return { ...option, label: String(option.label) };
      });
    },

    /** Build a stable Vue key for an option row. */
    optionKey(option, index) {
      return `${this.cacheKey}-${index}-${String(this.getOptionValue(option))}`;
    },

    /** Return whether a selected value is present in an option list. */
    hasSelectedOption(options, value) {
      return !!arrayFind(options, option => this.sameValue(option.value, value));
    }
  }
};
