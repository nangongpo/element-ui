import { FixedSizeGrid, DynamicSizeGrid } from 'element-ui/packages/virtual-list';
import RowRenderer from './renderers/row';
import { columnWidth } from './common';

export default {
  name: 'TableV2Grid',
  components: { FixedSizeGrid, DynamicSizeGrid },
  props: { table: Object, columns: Array, width: Number, height: Number, fixed: String, data: Array, fixedData: Array },
  computed: {
    // A fixed-size grid can only represent a uniform column width.  Keep the
    // default row height fixed, but use the dynamic grid when column widths
    // differ (which is the common Table V2 case).
    gridComponent() {
      if (this.table.dynamicRows) return 'dynamic-size-grid';
      const widths = this.columns.map(column => columnWidth(column));
      return widths.length && widths.every(value => value === widths[0]) ? 'fixed-size-grid' : 'dynamic-size-grid';
    },
    columnWidth() { return index => columnWidth(this.columns[index]); },
    fixedRowHeight() {
      if (!this.fixedData || !this.fixedData.length) return 0;
      return this.fixedData.length * this.table.rowHeightOf();
    },
    bodyHeight() {
      return Math.max(0, this.height - this.fixedRowHeight);
    },
    rowHeight() {
      if (this.gridComponent === 'dynamic-size-grid') {
        return index => this.table.dynamicRows ? this.table.rowHeightOf(index) : this.table.rowHeight;
      }
      return this.table.rowHeight;
    },
    fixedColumnWidth() { return this.columns.length ? columnWidth(this.columns[0]) : 0; },
    contentWidth() { return this.columns.reduce((total, column) => total + columnWidth(column), 0); },
    innerWidth() {
      if (this.table.fixed) return Math.max(this.width, this.contentWidth);
      return this.width;
    },
    innerProps() {
      if (this.fixed) return {};
      return { style: { marginLeft: `${this.table.leftWidth}px` } };
    },
    fixedRowStyle() {
      const style = { height: `${this.table.rowHeightOf()}px` };
      if (!this.fixed) {
        style.marginLeft = `${this.table.leftWidth}px`;
        style.transform = `translateX(-${this.table.scrollLeft || 0}px)`;
      }
      return style;
    },
    gridClass() { return ['el-table-v2__grid', this.fixed ? `el-table-v2__fixed-${this.fixed}` : 'el-table-v2__body-main', this.fixed ? 'el-table-v2__fixed-body' : '']; }
  },
  methods: {
    scrollTo(position) {
      if (this.$refs.grid) this.$refs.grid.scrollTo(position || {});
    },
    scrollToTop(scrollTop) {
      this.scrollTo({ scrollTop: Number(scrollTop) || 0 });
    },
    scrollToRow(row, strategy) {
      if (this.$refs.grid) this.$refs.grid.scrollToItem(row, 0, strategy || 'auto');
    },
    renderRow(h, scope) {
      // Grid passes the backing data in the slot scope.  Use it as the source
      // of truth as well as the prop; this keeps the renderer correct when a
      // virtual-list implementation reuses a slot scope during range updates.
      const rows = scope && scope.data ? scope.data : (this.data || []);
      const entry = rows[scope.rowIndex];
      if (!entry) return null;
      return h(RowRenderer, {
        key: entry.key || scope.rowIndex,
        props: {
          columns: this.columns,
          entry,
          rowIndex: scope.rowIndex,
          table: this.table,
          fixed: this.fixed,
          fixedLayout: this.table.fixed,
          isScrolling: scope.isScrolling,
          rowSlot: this.$scopedSlots.row
        },
        scopedSlots: this.$scopedSlots.row ? {
          default: rowScope => this.$scopedSlots.row(rowScope)
        } : undefined
      });
    },
    renderFixedRows(h) {
      if (!this.fixedData || !this.fixedData.length) return null;
      return h('div', { class: 'el-table-v2__fixed-data' }, this.fixedData.map((entry, index) => h(RowRenderer, {
        key: entry.key || `fixed-${index}`,
        props: {
          columns: this.columns,
          entry,
          rowIndex: -index - 1,
          table: this.table,
          fixed: this.fixed,
          fixedLayout: this.table.fixed,
          isScrolling: false,
          rowClass: ['el-table-v2__fixed-header-row', 'is-fixed'],
          rowSlot: this.$scopedSlots.row
        },
        style: this.fixedRowStyle,
        scopedSlots: this.$scopedSlots.row ? {
          default: rowScope => this.$scopedSlots.row(rowScope)
        } : undefined
      })));
    }
  },
  render(h) {
    const Grid = this.gridComponent;
    const rows = this.data || [];
    const grid = h(Grid, {
      ref: 'grid',
      class: this.gridClass,
      props: {
        data: rows,
        width: this.width,
        height: this.bodyHeight,
        innerWidth: this.innerWidth,
        innerProps: this.innerProps,
        totalRow: rows.length,
        totalColumn: 1,
        rowHeight: this.rowHeight,
        columnWidth: this.gridComponent === 'fixed-size-grid' ? this.width : (() => this.width),
        estimatedRowHeight: this.table.estimatedRowHeight,
        estimatedColumnWidth: this.columns.length ? columnWidth(this.columns[0]) : 100,
        scrollbarAlwaysOn: this.table.scrollbarAlwaysOn,
        hScrollbarSize: this.table.hScrollbarSize,
        vScrollbarSize: this.table.vScrollbarSize,
        useIsScrolling: true
      },
      on: {
        scroll: value => this.$emit('scroll', value),
        'item-rendered': value => this.$emit('rows-rendered', value),
        'end-reached': value => this.$emit('end-reached', value)
      },
      scopedSlots: { default: scope => this.renderRow(h, scope) }
    });
    // Keep the outer area absolutely positioned by table-v2. The virtual-list
    // grid itself remains relative so its translated rows can be positioned
    // inside the area. Applying the grid class to both layers makes the
    // relative positioning override the area's absolute positioning, which
    // breaks fixed columns and places them in normal document flow.
    return h('div', { class: ['el-table-v2__area', this.fixed ? `el-table-v2__fixed-${this.fixed}` : ''], style: { width: `${this.width}px`, height: `${this.height}px`, overflow: 'hidden' } }, [grid, this.renderFixedRows(h)]);
  }
};
