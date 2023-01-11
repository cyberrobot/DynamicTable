import { ReactElement } from 'react';

import './react-table-config';

import { HeaderGroup, TableOptions, ColumnInstance } from 'react-table';

/**
 * @param {Array<Object>} columns - The core columns configuration object for the entire table.
 * - Required
 * - Must be memoized
 * - Supports nested columns arrays via the column's columns key, eg. [{ Header: 'My Group', columns: [...] }]
 * - https://react-table.tanstack.com/docs/api/useTable#column-options
 * @param {string[]} defaultColumnOrder - an array of column ids
 * @param {(columns: string[]) => void} onColumnOrderSet - callback function. Useful for eg. saving the column order
 * @param {Array<Object>} data - The data array that you want to display on the table.
 * - Required
 * - Must be memoized
 * @param {string} testId - A testId prop is provided for specified elements,
 * which is a unique string that appears as a data attribute data-testid in the
 * rendered code, serving as a hook for automated tests.
 * @param {ReactElement} emptyView - Shown when the table has no content.
 * @param {number} rowsPerPage - The number of rows per page
 * @param {boolean} isLoading - Whether the table is loading
 * @param {string} label - Used to provide a better description of the table for
 * users with assistive technologies. Rather than a screen reader speaking
 * "Entering table", passing in a label allows a custom message like
 * "Entering Sample Numerical Data table".
 * @param {Object} defaultSortBy
 * @param {string} id - Column key that the rows should be sorted by.
 * Corresponds to the accessor's defined in the columns prop. Useful when
 * wanting to control dynamic table.
 * @param {boolean} desc - Column sort order. Useful when wanting to
 * control dynamic table.
 * @param {() => void} onSort - Callback function to be called when the
 * table is sorted. Useful when wanting to control dynamic table. The automatic
 * sorting is disabled.
 * @param {boolean} manualSorting - Whether the table is sorted manually. Useful
 * when wanting to control dynamic table.
 * @param {() => void} onPageSet - Callback function to be called when the
 * table is paged. Useful when wanting to control dynamic table.
 * @param {boolean} manualPagination - Whether the table is paged manually. Useful
 * when wanting to control dynamic table.
 * @param {number} pageCount - Required if manualPagination is set to true. If
 * manualPagination is true, then this value used to determine the amount of
 * pages available. This amount is then used to materialize the pageOptions and
 * also compute the canNextPage values on the table instance.
 * @param {boolean} autoResetPage - When false, the pageIndex state will not
 * automatically reset on data change. Useful when wanting to control dynamic
 * table.
 * @param {number} page - Zero-based. Page the table should show. Will update on
 * every render. Useful when wanting to control dynamic table.
 * @param {number} defaultPage - Zero-based. The default page the table should
 * show. Will not update on every render.
 * @param {boolean} showPages - When false, the buttons to access pages by index
 * are not shown.
 * @param {number[]} rowsPerPageSelect - Array of numbers to be used to select
 * how many rows per page are displayed.
 * @param {() => void} onRowsPerPageSet - Callback function to be called when
 * number of rows per page is changed.
 * @param {(row: T) => T[]} getSubRows - Function to retrieve sub-rows
 * @param {string[]} variant - it defines additonal custom styles for the table
 *
 * @export
 * @interface TablePropTypes
 * @template T
 */
export interface TablePropTypes<T extends Record<string, unknown>> {
  columns: TableOptions<T>['columns'];
  defaultColumnOrder?: string[];
  onColumnOrderSet?: (columnIds: string[]) => void;
  data: TableOptions<T>['data'];
  defaultSortBy?: {
    id: string;
    desc?: boolean;
  };
  emptyView?: ReactElement | null;
  rowsPerPage?: number;
  isLoading?: boolean;
  label?: string;
  onSort?: (sortBy) => void;
  manualSortBy?: boolean;
  onPageSet?: (pageIndex) => void;
  manualPagination?: boolean;
  autoResetPage?: boolean;
  pageCount?: number;
  page?: number;
  defaultPage?: number;
  showPages?: boolean;
  rowsPerPageSelect?: number[];
  onRowsPerPageSet?: (rowsPerPage: number) => void;
  getSubRows?: (row: T) => T[];
  testId?: string;
  variant?: string[];
  columnDirection?: string;
}

/**
 * @type {HeaderGroup<T>} headerGroups - The react-table HeaderGroup interface.
 * @type {boolean} isCondensed - if true reduce paddings
 * @type {string} testId - A testId prop is provided for specified elements,
 * which is a unique string that appears as a data attribute data-testid in the
 * rendered code, serving as a hook for automated tests.
 * @type {boolean} isColumnDirectionVertical - switch styles from vertical to horizontal based on this value
 * @type {string[]} columnOrder - an array of column ids
 * @type {() => any} onColumnOrderChange
 *
 * @export
 * @interface TableHeadPropTypes
 * @template T
 */
export interface TableHeadPropTypes<T extends Record<string, unknown>> {
  headerGroups: HeaderGroup<T>[];
  isCondensed: boolean;
  testId?: string;
  isColumnDirectionVertical: boolean;
  columnOrder?: string[];
  onColumnOrderChange?: (columnIds: string[]) => void;
}

/**
 * @type {HeaderGroup<T>} the react-table HeaderGroup interface.
 * @type {thIndex} index of the th element
 * @type {ColumnInstance<T>} columnInstance
 *
 * @export
 * @interface DraggableColumnHeaderPropTypes
 * @template T
 */

export interface DraggableColumnHeaderPropTypes<
  T extends Record<string, unknown>
> extends TableHeadPropTypes<T> {
  headerGroup: HeaderGroup<T>;
  thIndex: number;
  column: ColumnInstance<T>;
}

/**
 * @type {() => any} getTableBodyProps - Get react-table body props
 * @type {(row: any) => any} prepareRow - Get react-table body props
 * @type {any[]} pageRows - Row data
 * @type {boolean} isCondensed - if true reduce paddings
 * @type {boolean} isHighlighted - whether it should highlight rows on mouse hover
 * @type {string} testId - A testId prop is provided for specified elements,
 * @type {boolean} showTotal
 * @type {boolean} isColumnDirectionVertical - whether we should render table body
 * with vertical column direction
 * @type {HeaderGroup<T>} headerGroups - The react-table headerGroups interface
 * which is a unique string that appears as a data attribute data-testid in the
 * rendered code, serving as a hook for automated tests.
 *
 * @export
 * @interface TableBodyPropTypes
 */
export interface TableBodyPropTypes<T extends Record<string, unknown>> {
  getTableBodyProps: () => any;
  prepareRow: (row: any) => any;
  pageRows: any[];
  isCondensed: boolean;
  isHighlighted: boolean;
  testId?: string;
  showTotal: boolean;
  isColumnDirectionVertical: boolean;
  headerGroups?: HeaderGroup<T>[];
}

/**
 * @type {HeaderGroup<T>} footerGroups - The react-table FooterGroup interface.
 * @type {any[]} pageRows - Row data
 * @type {boolean} isCondensed - if true reduce paddings
 * @type {string} testId - A testId prop is provided for specified elements,
 * which is a unique string that appears as a data attribute data-testid in the
 * rendered code, serving as a hook for automated tests.
 * @type {boolean} isColumnDirectionVertical - switch styles from vertical to horizontal based on this value
 *
 * @export
 * @interface TableFooterPropTypes
 * @template T
 */
export interface TableFooterPropTypes<T extends Record<string, unknown>> {
  footerGroups: any[];
  pageRows: any[];
  isCondensed: boolean;
  testId?: string;
  isColumnDirectionVertical: boolean;
}

export { Column, CellProps } from 'react-table';
