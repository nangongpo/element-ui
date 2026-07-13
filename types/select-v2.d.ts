import { ElSelect } from './select'

export interface SelectV2Option {
  [key: string]: any
}

/** Virtualized Dropdown Select Component */
export declare class ElSelectV2 extends ElSelect {
  /** Complete option data */
  options: SelectV2Option[]

  /** Maximum dropdown viewport height */
  height: number

  /** Fixed option height */
  itemHeight: number

  /** Estimated option height; enables dynamic-size virtualization when set */
  estimatedOptionHeight?: number

  /** Keep the virtual scrollbar visible */
  scrollbarAlwaysOn: boolean

  /** Preserve the dropdown DOM after it is closed */
  persistent: boolean

  /** Maximum number of tags shown when tags are collapsed */
  maxCollapseTags: number

  /** Type applied to selected tags */
  tagType: string

  /** Effect applied to selected tags */
  tagEffect: string

  /** Whether the dropdown arrow is displayed */
  showArrow: boolean

  /** Dropdown placement */
  placement: string

  /** Popper.js options */
  popperOptions: Record<string, any>

  /** Extra options rendered before and after the visible range */
  overscan: number

  /** Option label field */
  labelKey: string

  /** Option disabled field */
  disabledKey: string

  /** Match input width, use content width, or set a fixed pixel width */
  fitInputWidth: boolean | number

  /** Scroll an option into the viewport */
  scrollToIndex (index: number): void

  focus (): void

  blur (): void
}
