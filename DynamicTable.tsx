import { PropsWithChildren, ReactElement, useEffect } from 'react';

import { chakra, Flex, Table } from '@chakra-ui/react';
import { isUndefined, setDataTestId } from '@satago/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  useTable,
  useColumnOrder,
  useSortBy,
  usePagination,
  useExpanded,
} from 'react-table';

import { table } from '../../helpers/theme';
import ControlledPagination from './internal/components/ControlledPagination';
import EmptyView from './internal/components/EmptyView';
import LoadingContainer from './internal/components/LoadingContainer';
import { RowsPerPageSelector } from './internal/components/RowsPerPageSelector';
import TableBody from './internal/components/TableBody';
import TableFooter from './internal/components/TableFooter';
import TableHead from './internal/components/TableHead';
import {
  useGetControlledState,
  useGetInitialState,
  useGetNormalisedColumns,
} from './internal/utils/helpers';
import { useStyles } from './styles/common';
import { TablePropTypes } from './types';

function DynamicTable<T extends Record<string, unknown>>({
  defaultSortBy,
  columns,
  defaultColumnOrder,
  onColumnOrderSet,
  data,
  testId = 'table',
  emptyView,
  rowsPerPage,
  isLoading,
  label,
  onSort,
  manualSortBy,
  onPageSet: onPageSetControlled,
  manualPagination,
  autoResetPage,
  pageCount,
  page: pageControlled,
  defaultPage = 0,
  showPages = true,
  rowsPerPageSelect = null,
  onRowsPerPageSet: onRowsPerPageControlled,
  getSubRows,
  variant = ['borderless'],
  columnDirection = 'vertical',
}: PropsWithChildren<TablePropTypes<T>>): ReactElement {
  if (manualPagination) {
    isUndefined(pageCount) &&
      console.warn('pageCount is required when manualPagination is true');
  }

  const isColumnDirectionVertical = columnDirection === 'vertical';

  const styles = useStyles();
  const normalisedColumns = useGetNormalisedColumns(columns);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    pageOptions,
    gotoPage,
    setPageSize,
    state: { pageIndex, sortBy, pageSize, columnOrder },
    setColumnOrder,
  } = useTable<T>(
    {
      columns: normalisedColumns,
      data,
      initialState: {
        ...useGetInitialState({
          sortBy: defaultSortBy,
          pageIndex: defaultPage,
          pageSize: rowsPerPage,
        }),
        columnOrder:
          defaultColumnOrder || normalisedColumns.map((col) => col.id),
      },
      useControlledState: (state) =>
        useGetControlledState(state, pageControlled),
      manualSortBy,
      ...(!isUndefined(manualPagination) && {
        manualPagination: manualPagination,
      }),
      ...(!isUndefined(autoResetPage) && {
        autoResetPage: autoResetPage,
      }),
      ...(!isUndefined(pageCount) && { pageCount: pageCount }),
      getSubRows,
      paginateExpandedRows: false,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useColumnOrder
  );
  const columnLength = columns && columns.length;
  const rowLength = page && page.length;
  const rowsExist = rowLength > 0;
  const hasPages = pageOptions.length > 1;

  /**
   * TODO: Commented out due to DEV-11459. See explanation in clients.tsx.
   * This is a temporary fix until the issue is resolved.
   */
  useEffect(() => {
    onSort && onSort(sortBy);
  }, [onSort, sortBy]);
  // useEffect(() => {
  // if (!onSort) return;
  // if (!sortBy?.length && defaultSortBy) {
  //   onSort([defaultSortBy]);
  //   return;
  // }
  // if (sortBy?.length) {
  //   onSort(sortBy);
  // }
  // }, [onSort, sortBy, defaultSortBy]);

  const onColumnOrderChange = (columnIds) => {
    if (onColumnOrderSet) {
      onColumnOrderSet(columnIds);
    }
    setColumnOrder(columnIds);
  };

  const onPageSet = (pageIndex: number) => {
    onPageSetControlled && onPageSetControlled(pageIndex - 1);
    gotoPage(pageIndex - 1);
  };

  const onRowsPerPageSet = (rowsPerPage: number) => {
    onRowsPerPageControlled && onRowsPerPageControlled(rowsPerPage);
    setPageSize(rowsPerPage);
  };

  const hasAnyShowTotal = Boolean(columns.find((column) => column.showTotal));

  const isBorderVisible = !variant.includes('borderless');
  const isCondensed = variant.includes('condensed');
  const isHighlighted = variant.includes('highlighted');
  const hasHeader = Boolean(columns.find((column) => column.Header));

  return (
    <DndProvider backend={HTML5Backend}>
      <LoadingContainer testId={testId} isLoading={isLoading}>
        <>
          {columnLength && (
            <chakra.div
              sx={isBorderVisible && styles.tableContainerWithBorders}
            >
              <chakra.div sx={isBorderVisible && styles.borderRadius}>
                <chakra.div
                  sx={{
                    ...styles.tableBodyContainer,
                    ...(isBorderVisible && styles.borderTopRadius),
                    ...(!hasPages &&
                      isBorderVisible &&
                      styles.borderBottomRadius),
                  }}
                >
                  <Table
                    {...getTableProps()}
                    {...setDataTestId(testId)}
                    aria-label={label}
                    sx={
                      !isColumnDirectionVertical && styles.tableHorizontalGrid
                    }
                  >
                    {hasHeader && rowsExist && (
                      <TableHead
                        headerGroups={headerGroups}
                        testId={testId}
                        isCondensed={isCondensed}
                        isColumnDirectionVertical={isColumnDirectionVertical}
                        columnOrder={columnOrder}
                        onColumnOrderChange={onColumnOrderChange}
                      />
                    )}
                    <TableBody
                      getTableBodyProps={getTableBodyProps}
                      prepareRow={prepareRow}
                      pageRows={page}
                      testId={testId}
                      showTotal={hasAnyShowTotal}
                      isCondensed={isCondensed}
                      isHighlighted={isHighlighted}
                      isColumnDirectionVertical={isColumnDirectionVertical}
                      headerGroups={headerGroups}
                    />
                    {hasAnyShowTotal && rowsExist && (
                      <TableFooter
                        footerGroups={footerGroups}
                        pageRows={page}
                        testId={testId}
                        isCondensed={isCondensed}
                        isColumnDirectionVertical={isColumnDirectionVertical}
                      />
                    )}
                  </Table>
                  {!rowsExist && emptyView && (
                    <EmptyView testId={testId} columnLength={columnLength}>
                      {emptyView}
                    </EmptyView>
                  )}
                </chakra.div>
                {hasPages && (
                  <Flex
                    sx={{
                      ...styles.paginationContainer,
                      ...(isBorderVisible && {
                        ...styles.borderBottomRadius,
                        ...styles.paddingHorizontal,
                      }),
                    }}
                  >
                    <chakra.div />
                    <ControlledPagination
                      currentPage={pageIndex}
                      pages={pageOptions}
                      showPages={showPages}
                      onChange={(_, pageIndex) => onPageSet(pageIndex)}
                    />
                    {rowsPerPageSelect && (
                      <RowsPerPageSelector
                        items={rowsPerPageSelect}
                        selected={pageSize}
                        onChange={(n) => onRowsPerPageSet(n)}
                        testId={`${testId}--rows-per-page-selector`}
                      />
                    )}
                  </Flex>
                )}
              </chakra.div>
            </chakra.div>
          )}
        </>
      </LoadingContainer>
    </DndProvider>
  );
}

export default DynamicTable;
