import { fireEvent, render, within } from '@testing-library/react';
import { Column } from 'react-table';

import Table from '..';
import { TablePropTypes } from '../types';

describe('TableSorting', () => {
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
    ];

    const data = [
      {
        clientName: 'Client 3',
      },
      {
        clientName: 'Client 1',
      },
      {
        clientName: 'Client 2',
      },
    ];

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

  describe('If column sorting is disabled', () => {
    test('Column data is not sorted', () => {
      const { renderResult } = setup();
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      const rows = within(
        renderResult.getAllByRole('rowgroup')[1]
      ).getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Client 3');
      expect(rows[1]).toHaveTextContent('Client 1');
      expect(rows[2]).toHaveTextContent('Client 2');
    });

    test('Column header should not have sorting indicator', () => {
      const { renderResult } = setup();
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      expect(
        renderResult.queryByTestId('dynamic-table--head--sorting')
      ).toBeNull();
    });
  });

  describe('If column sorting is enabled', () => {
    test('Column data is sorted asc', () => {
      const columns: Column<any>[] = [
        {
          Header: 'Client Name',
          accessor: 'clientName',
          isSortable: true,
        },
      ];
      const { renderResult } = setup({ columns });
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      const rows = within(
        renderResult.getAllByRole('rowgroup')[1]
      ).getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Client 1');
      expect(rows[1]).toHaveTextContent('Client 2');
      expect(rows[2]).toHaveTextContent('Client 3');
    });

    test('Column data is sorted desc', () => {
      const columns: Column<any>[] = [
        {
          Header: 'Client Name',
          accessor: 'clientName',
          isSortable: true,
        },
      ];
      const { renderResult } = setup({ columns });
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      const rows = within(
        renderResult.getAllByRole('rowgroup')[1]
      ).getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Client 3');
      expect(rows[1]).toHaveTextContent('Client 2');
      expect(rows[2]).toHaveTextContent('Client 1');
    });

    test('Sorting arrow up icon is visible', () => {
      const columns: Column<any>[] = [
        {
          Header: 'Client Name',
          accessor: 'clientName',
          isSortable: true,
        },
      ];
      const { renderResult } = setup({ columns });
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      expect(
        renderResult.getByTestId('dynamic-table--head--sorting-icon--asc')
      ).toBeInTheDocument();
    });

    test('Sorting arrow down icon is visible', () => {
      const columns: Column<any>[] = [
        {
          Header: 'Client Name',
          accessor: 'clientName',
          isSortable: true,
        },
      ];
      const { renderResult } = setup({ columns });
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      fireEvent.click(
        renderResult.getAllByRole('rowgroup')[0].firstElementChild
          .firstElementChild
      );
      expect(
        renderResult.getByTestId('dynamic-table--head--sorting-icon--desc')
      ).toBeInTheDocument();
    });
  });
});
