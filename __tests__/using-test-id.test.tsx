import { render } from '@testing-library/react';
import { Column } from 'react-table';

import Table from '../DynamicTable';
import { getTestData } from '../getTestData';
import { TablePropTypes } from '../types';

describe('Pagination should be found by data-testid', () => {
  beforeEach(() => {
    global['E2E'] = true;
  });

  const setup = <T extends Record<string, unknown>>(
    tableProps: Partial<TablePropTypes<T>> = {}
  ) => {
    const columns: Column<any>[] = [
      {
        Header: 'Client Name',
        accessor: 'clientName',
      },
      {
        Header: 'Client Reference',
        accessor: 'clientReference',
      },
      {
        Header: 'Facility Type',
        accessor: 'facilityType',
      },
      {
        Header: 'Facility Limit',
        accessor: 'facilityLimit',
        showTotal: true,
      },
      {
        Header: 'Gross Sales Ledger',
        accessor: 'grossSalesLedger',
        showTotal: true,
      },
      {
        Header: 'Approved Sales Ledger',
        accessor: 'approvedSalesLedger',
        showTotal: true,
      },
      {
        Header: 'Current Balance',
        accessor: 'currentBalance',
        showTotal: true,
      },
    ];
    const data = getTestData();

    const props = {
      data: data as any[],
      columns: columns,
      testId: 'dynamic-table',
    };

    const renderResult = render(<Table<T> {...props} {...tableProps} />);

    return {
      renderResult,
      props,
    };
  };

  it('Table element is accessible via data-testid', () => {
    const { renderResult, props } = setup();

    expect(renderResult.getByTestId(`${props.testId}`)).toBeTruthy();
  });

  it('TableHead element is accessible via data-testid', () => {
    const { renderResult, props } = setup();

    expect(renderResult.getByTestId(`${props.testId}--head`)).toBeTruthy();
  });

  it('TableHead th elements are accessible via data-testid', () => {
    const { renderResult, props } = setup();

    const multipleTestIds = [
      `${props.testId}--head--cell-1`,
      `${props.testId}--body--cell-0`,
      `${props.testId}--body--cell-1`,
      `${props.testId}--body--cell-2`,
      `${props.testId}--body--cell-3`,
      `${props.testId}--body--cell-4`,
    ];

    multipleTestIds.forEach((testId) => {
      expect(renderResult.getAllByTestId(testId)).toBeTruthy();
    });
  });

  it('TableBody element is accessible via data-testid', () => {
    const { renderResult, props } = setup();

    expect(renderResult.getByTestId(`${props.testId}--body`)).toBeTruthy();
  });

  it('TableFooter element is accessible via data-testid', () => {
    const { renderResult, props } = setup();

    expect(renderResult.getByTestId(`${props.testId}--footer`)).toBeTruthy();
  });
});
