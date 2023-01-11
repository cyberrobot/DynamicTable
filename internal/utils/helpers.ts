import { useMemo } from 'react';

import { isUndefined, BigNumber } from '@satago/utils';
import { get, set } from 'lodash';

import { TablePropTypes } from '../../types';

/**
 * Map columns to react-table columns
 *
 * @export
 * @param {*} columns - The core columns configuration object for the entire table.
 * @return {*}
 */
export function useGetNormalisedColumns(columns) {
  return useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        id: column.id || column.accessor,
        disableSortBy: !column.isSortable,
      })),
    []
  );
}

/**
 * Return rowsPerPage or default value
 *
 * @export
 * @param {*} rowsPerPage - The number of rows per page
 * @return {*}
 */
export function useGetRowsPerPage(rowsPerPage) {
  const defaultRowsPerPage = 10;
  return useMemo(
    () => (rowsPerPage ? rowsPerPage : defaultRowsPerPage),
    [rowsPerPage]
  );
}

/**
 * Return sortBy configuration
 *
 * @export
 * @param {*} sortBy - Object the rows should be sorted by.
 * ```js
 * {
 *  id: 'name',
 *  desc: true, - optional
 * }
 * ```
 * @return {*}
 */
export function useGetSortBy(sortBy) {
  return useMemo(() => (sortBy ? [sortBy] : []), [sortBy]);
}

/**
 * If you need to control part of the table state, this is the place to do it.
 *
 * @export
 * @param {any} state - The current state of the table.
 * @param {*} pageControlled - The page controlled by the user.
 * @return {*}
 */
export function useGetControlledState(state: any, pageControlled: number) {
  const inject = [!isUndefined(pageControlled) && pageControlled];
  return useMemo(
    () => ({
      ...state,
      ...(!isUndefined(pageControlled) && { pageIndex: pageControlled }),
    }),
    [state, ...inject]
  );
}

/**
 * Returns the initial table state
 *
 * @template T
 * @param {{
 *   sortBy: TablePropTypes<T>['defaultSortBy'],
 *   pageIndex: TablePropTypes<T>['defaultPage'],
 *   pageSize: TablePropTypes<T>['rowsPerPage'],
 * }} {
 *   sortBy,
 *   pageIndex,
 *   pageSize
 * }
 */
export const useGetInitialState = <T extends Record<string, unknown>>({
  sortBy,
  pageIndex,
  pageSize,
}: {
  sortBy: TablePropTypes<T>['defaultSortBy'];
  pageIndex: TablePropTypes<T>['defaultPage'];
  pageSize: TablePropTypes<T>['rowsPerPage'];
}) => ({
  sortBy: useGetSortBy(sortBy),
  pageIndex,
  pageSize: useGetRowsPerPage(pageSize),
});

/**
 * Return total value of a column
 *
 * @export
 * @param {*} column - The columns configuration processed object
 * @param {*} pageRows - Row data
 * @return {*}
 */
export const getTotalValue = (column, pageRows: any[]) => {
  const { id, showTotal, accessor } = column;
  const key = id || accessor;
  if (showTotal) {
    const total = pageRows.reduce((sum, row) => {
      const value = get(row.original, key) || get(row.values, key);
      if (value) {
        return sum.plus(
          BigNumber(value).decimalPlaces(2, BigNumber.ROUND_FLOOR)
        );
      }
      return sum;
    }, BigNumber(0));
    return accessor(set({}, key, total.toString()));
  }
};
