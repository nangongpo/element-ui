<template>
  <div
    class="el-select"
    :class="[selectSize ? 'el-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose">
    <div
      v-if="multiple"
      ref="tags"
      class="el-select__tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }">
      <span v-if="collapseTags && selectedOptions.length">
        <el-tag
          v-for="item in shownSelectedOptions"
          :key="getOptionKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="hitOptionKey === getOptionKey(item)"
          :type="tagType"
          :effect="tagEffect"
          disable-transitions
          @close="deleteTag($event, item)">
          <span class="el-select__tags-text">{{ getOptionLabel(item) }}</span>
        </el-tag>
        <el-tag
          v-if="collapsedOptionCount > 0"
          :closable="false"
          :size="collapseTagSize"
          :type="tagType"
          :effect="tagEffect"
          disable-transitions>
          <span class="el-select__tags-text">+ {{ collapsedOptionCount }}</span>
        </el-tag>
      </span>
      <span v-else>
        <el-tag
          v-for="item in selectedOptions"
          :key="getOptionKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="hitOptionKey === getOptionKey(item)"
          :type="tagType"
          :effect="tagEffect"
          disable-transitions
          @close="deleteTag($event, item)">
          <span class="el-select__tags-text">{{ getOptionLabel(item) }}</span>
        </el-tag>
      </span>
      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        type="text"
        class="el-select__input"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :autocomplete="autocomplete"
        :tabindex="normalizedTabindex"
        :style="multipleInputStyle"
        @focus="handleFocus"
        @blur="softFocus = false"
        @input="handleQueryInput"
        @keydown="resetInputState"
        @keydown.down.prevent="handleNavigate('next')"
        @keydown.up.prevent="handleNavigate('prev')"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition">
    </div>

    <el-input
      ref="reference"
      v-model="displayLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : normalizedTabindex"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleReferenceInput"
      @keydown.native.down.stop.prevent="handleNavigate('next')"
      @keydown.native.up.stop.prevent="handleNavigate('prev')"
      @keydown.native.enter.prevent="selectHighlighted"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false">
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i
          v-show="!showClose && showArrow"
          :class="['el-select__caret', 'el-input__icon', suffixIcon, { 'is-reverse': visible }]">
        </i>
        <i
          v-if="showClose"
          :class="['el-select__caret', 'el-input__icon', clearIcon]"
          @click.stop="clearSelection">
        </i>
      </template>
    </el-input>

    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="destroyDropdown">
      <el-select-dropdown
        v-if="persistent || visible"
        ref="popper"
        v-show="visible && emptyText !== false"
        :append-to-body="popperAppendToBody"
        :data="displayRows"
        :loading="loading"
        :empty-text="emptyText"
        :height="popupHeight"
        :item-height="itemHeight"
        :estimated-option-height="estimatedOptionHeight"
        :overscan="overscan"
        :scrollbar-always-on="scrollbarAlwaysOn"
        :content-id="selectContentId"
        :hovering-index="hoveringIndex"
        :placement="placement"
        :visible-arrow="showArrow"
        :popper-options="popperOptions"
        @end-reached="$emit('end-reached', $event)">
        <template v-if="$slots.header" slot="header">
          <slot name="header"></slot>
        </template>
        <template v-if="$scopedSlots.default || $slots.default" slot="option" slot-scope="scope">
          <slot
            :item="scope.item"
            :index="scope.index"
            :selected="scope.selected"
            :disabled="scope.disabled">
          </slot>
        </template>
        <template v-if="$slots.empty" slot="empty">
          <slot name="empty"></slot>
        </template>
        <template v-if="$slots.loading" slot="loading">
          <slot name="loading"></slot>
        </template>
        <template v-if="$slots.footer" slot="footer">
          <slot name="footer"></slot>
        </template>
      </el-select-dropdown>
    </transition>
  </div>
</template>

<script type="text/babel">
  import Emitter from 'element-ui/src/mixins/emitter';
  import Focus from 'element-ui/src/mixins/focus';
  import Locale from 'element-ui/src/mixins/locale';
  import ElInput from 'element-ui/packages/input';
  import ElTag from 'element-ui/packages/tag';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import debounce from 'throttle-debounce/debounce';
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
  import { valueEquals, isIE, isEdge } from 'element-ui/src/utils/util';
  import ElSelectDropdown from './select-dropdown';
  import { selectV2Props } from './defaults';
  import { createPropsAdapter } from './use-props';
  import { createOptionAdapter } from './use-option';
  import { createAllowCreate } from './use-allow-create';
  import selectMethods from './use-select';

  let selectIdSeed = 0;

  export default {
    name: 'ElSelectV2',

    componentName: 'ElSelectV2',

    mixins: [Emitter, Locale, Focus('reference')],

    inject: {
      elForm: { default: '' },
      elFormItem: { default: '' }
    },

    components: {
      ElInput,
      ElTag,
      ElSelectDropdown
    },

    directives: { Clickoutside },

    props: selectV2Props,

    data() {
      return {
        visible: false,
        query: '',
        displayLabel: '',
        hoveringIndex: -1,
        inputHovering: false,
        softFocus: false,
        isOnComposition: false,
        isSilentBlur: false,
        inputWidth: 0,
        initialInputHeight: 0,
        currentPlaceholder: '',
        menuVisibleOnFocus: false,
        appliedDropdownStyle: {},
        hitOptionKey: null,
        createdOptions: [],
        cachedSelectedOptions: [],
        selectContentId: this.id || `el-select-v2-${++selectIdSeed}`
      };
    },

    computed: {
      selectSize() {
        return this.size || (this.elFormItem || {}).elFormItemSize || (this.$ELEMENT || {}).size;
      },
      selectDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      normalizedTabindex() {
        return String(this.tabindex);
      },
      readonly() {
        return !this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible);
      },
      collapseTagSize() {
        return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small';
      },
      propPlaceholder() {
        return typeof this.placeholder !== 'undefined'
          ? this.placeholder
          : this.t('el.select.placeholder');
      },
      aliasProps() {
        return this._propsAdapter.getAliasProps();
      },
      showClose() {
        const hasValue = this.multiple
          ? Array.isArray(this.value) && this.value.length > 0
          : !this.isEmptyValue(this.value);
        return this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
      },
      debounceDelay() {
        return this.remote ? this.debounce : 0;
      },
      createdOption() {
        return this._allowCreate.createNewOption(this.query);
      },
      sourceRows() {
        const rows = [];
        this.options.forEach((entry, groupIndex) => {
          if (this.isOptionGroup(entry)) {
            rows.push({
              type: 'group',
              key: `${groupIndex}_${this.getOptionLabel(entry)}`,
              label: this.getOptionLabel(entry),
              group: entry
            });
            this.getOptionChildren(entry).forEach((option, optionIndex) => {
              rows.push({
                type: 'option',
                key: `${groupIndex}_${optionIndex}_${this.getOptionKey(option)}`,
                option,
                groupDisabled: this._propsAdapter.getDisabled(entry)
              });
            });
          } else {
            rows.push({
              type: 'option',
              key: `option_${groupIndex}_${this.getOptionKey(entry)}`,
              option: entry,
              groupDisabled: false
            });
          }
        });
        return rows;
      },
      filteredRows() {
        if (this.remote || typeof this.filterMethod === 'function' || !this.filterable || !this.query) {
          return this.sourceRows.slice();
        }
        const query = this.query.toLowerCase();
        const rows = [];
        let pendingGroup = null;
        this.sourceRows.forEach(row => {
          if (row.type === 'group') {
            pendingGroup = row;
          } else if (String(this.getOptionLabel(row.option)).toLowerCase().indexOf(query) > -1) {
            if (pendingGroup) rows.push(pendingGroup);
            pendingGroup = null;
            rows.push(row);
          }
        });
        return rows;
      },
      displayRows() {
        const rows = this.filteredRows.slice();
        if (this.createdOption) {
          rows.unshift({
            type: 'option',
            key: this.getOptionKey(this.createdOption),
            option: this.createdOption,
            groupDisabled: false
          });
        }
        return rows;
      },
      displayOptions() {
        return this.displayRows
          .filter(row => row.type === 'option')
          .map(row => row.option);
      },
      allOptions() {
        return this.createdOptions.concat(this.sourceRows
          .filter(row => row.type === 'option')
          .map(row => row.option));
      },
      selectedOptions() {
        return this.cachedSelectedOptions;
      },
      shownSelectedOptions() {
        return this.collapseTags
          ? this.selectedOptions.slice(0, Math.max(1, this.maxCollapseTags))
          : this.selectedOptions;
      },
      collapsedOptionCount() {
        return Math.max(0, this.selectedOptions.length - this.shownSelectedOptions.length);
      },
      popupHeight() {
        return Math.min(this.height, this.displayRows.length * this.itemHeight);
      },
      emptyText() {
        if (this.loading) return this.loadingText || this.t('el.select.loading');
        if (this.remote && this.query === '' && this.options.length === 0) return false;
        if (this.filterable && this.query && this.displayOptions.length === 0) {
          return this.noMatchText || this.t('el.select.noMatch');
        }
        if (this.displayOptions.length === 0) return this.noDataText || this.t('el.select.noData');
        return null;
      },
      dropdownStyle() {
        if (typeof this.fitInputWidth === 'number') {
          const width = this.fitInputWidth + 'px';
          return { width };
        }
        if (this.fitInputWidth) {
          const width = this.inputWidth + 'px';
          return { width };
        }
        return { minWidth: this.inputWidth + 'px' };
      },
      multipleInputStyle() {
        return {
          'flex-grow': '1',
          width: '20px',
          'max-width': Math.max(0, this.inputWidth - 42) + 'px'
        };
      }
    },

    watch: {
      propPlaceholder(value) {
        this.currentPlaceholder = this.multiple && (this.query || this.selectedOptions.length)
          ? ''
          : value;
      },
      value(value, oldValue) {
        this.syncSelectedOptions();
        this.syncDisplayLabel();
        this.syncInputHeightImmediately();
        this.requestLayoutSync();
        if (this.validateEvent && !valueEquals(value, oldValue)) {
          this.dispatch('ElFormItem', 'el.form.change', value);
        }
      },
      options() {
        this.syncSelectedOptions();
        this.syncDisplayLabel();
        this.ensureHoverIndex();
        this.requestLayoutSync();
      },
      displayOptions() {
        this.hoveringIndex = -1;
        this.$nextTick(() => {
          const list = this.$refs.popper;
          if (list) list.scrollTo(0);
          if (this.defaultFirstOption) this.highlightFirstOption();
          this.requestLayoutSync();
        });
      },
      visible(value) {
        if (value) {
          this.openMenu();
        } else {
          this.closeMenu();
        }
        this.$emit('visible-change', value);
      },
      fitInputWidth() {
        this.requestLayoutSync();
      },
      height() {
        this.requestLayoutSync();
      }
    },

    beforeCreate() {
      this._propsAdapter = createPropsAdapter(this);
      this._optionAdapter = createOptionAdapter(this, this._propsAdapter);
      this._allowCreate = createAllowCreate(this, this._propsAdapter, this._optionAdapter);
    },

    created() {
      this._layoutScheduled = false;
      this.syncSelectedOptions();
      this.currentPlaceholder = this.propPlaceholder;
      if (this.multiple && !Array.isArray(this.value)) this.$emit('input', []);
      if (!this.multiple && Array.isArray(this.value)) this.$emit('input', '');
      this.debouncedRemoteQuery = debounce(this.debounceDelay, query => {
        if (typeof this.remoteMethod === 'function') this.remoteMethod(query);
      });
    },

    mounted() {
      this.syncDisplayLabel();
      addResizeListener(this.$el, this.requestLayoutSync);
      if (this.$refs.tags) addResizeListener(this.$refs.tags, this.syncInputHeightImmediately);
      this.requestLayoutSync();
    },

    beforeDestroy() {
      this._layoutScheduled = false;
      if (this.$el) removeResizeListener(this.$el, this.requestLayoutSync);
      if (this.$refs.tags) removeResizeListener(this.$refs.tags, this.syncInputHeightImmediately);
    },

    methods: selectMethods
  };
</script>
