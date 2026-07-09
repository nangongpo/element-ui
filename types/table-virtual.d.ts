import { ElTable } from './table'

/** Virtual Table Component */
export declare class ElTableVirtual extends ElTable {
  /** Fixed row height in pixels */
  rowHeight: number

  /** Extra rows rendered before and after the visible range */
  overscan: number

  /** Scroll body to a vertical offset */
  scrollTo (scrollTop: number): void

  /** Reload data through an internal non-reactive data source */
  reloadData (data: any[]): void
}
