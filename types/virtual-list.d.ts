import { ElementUIComponent } from './component'

interface VirtualListComponent extends ElementUIComponent {
  data: any[]
  items: any[]
  total: number
  height: number | string
  width: number | string
  estimatedItemSize: number
  overscan: number
  cache: number
  viewClass: string | string[] | object
  className: string
  direction: 'ltr' | 'rtl'
  layout: 'horizontal' | 'vertical'
  containerElement: string | object
  innerElement: string | object
  innerProps: object
  innerWidth: number | string
  scrollbarAlwaysOn: boolean
  scrollTo (scrollTop: number): void
  scrollToIndex (index: number): void
  scrollToItem (index: number, alignment?: 'auto' | 'smart' | 'start' | 'center' | 'end'): void
  resetScrollTop (): void
  getItemStyleCache (...args: any[]): object
  resetAfterIndex (index: number, forceUpdate?: boolean): void
}

/** Internal fixed-size virtual list component. */
export declare class ElFixedSizeList extends VirtualListComponent {
  itemSize: number
}

/** Internal dynamic-size virtual list component. */
export declare class ElDynamicSizeList extends VirtualListComponent {
  itemSize: (index: number) => number
  clearCacheAfterIndex (index: number, forceUpdate?: boolean): void
}
