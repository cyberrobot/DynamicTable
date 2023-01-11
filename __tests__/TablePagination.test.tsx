import { fireEvent, render, within } from '@testing-library/react';
import { Column } from 'react-table';

import Table from '..';
import { TablePropTypes } from '../types';

describe('TablePagination', () => {
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
      {
        clientName: 'Client 4',
      },
      {
        clientName: 'Client 5',
      },
      {
        clientName: 'Client 6',
      },
      {
        clientName: 'Client 7',
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

  describe('Pagination', () => {
    test('if pagination left navigator control is present', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      expect(
        renderResult.getByTestId('pagination--left-navigator')
      ).toBeInTheDocument();
    });

    test('if pagination right navigator control is present', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      expect(
        renderResult.getByTestId('pagination--right-navigator')
      ).toBeInTheDocument();
    });

    test('if the number of pages is correct', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toBeInTheDocument();
      expect(renderResult.getAllByTestId(/pagination--page-*/)).toHaveLength(2);
    });

    test('if the current page is correct', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toHaveTextContent('1');
    });

    test('if the current page is correct after clicking on the right navigator', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      fireEvent.click(renderResult.getByTestId('pagination--right-navigator'));
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toHaveTextContent('2');
    });

    test('if the current page is correct after clicking on the left navigator', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      fireEvent.click(renderResult.getByTestId('pagination--left-navigator'));
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toHaveTextContent('1');
    });

    test('if the current page is correct after clicking on the page number', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      fireEvent.click(renderResult.getByTestId(/pagination--page-1/));
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toHaveTextContent('2');
      fireEvent.click(renderResult.getByTestId(/pagination--page-0/));
      expect(
        renderResult.getByTestId(/pagination--current-page-*/)
      ).toHaveTextContent('1');
    });

    test('if current page rows are correct', () => {
      const { renderResult } = setup({ rowsPerPage: 3 });
      let rows = within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole(
        'row'
      );
      expect(rows).toHaveLength(3);
      expect(rows[0]).toHaveTextContent('Client 3');
      expect(rows[1]).toHaveTextContent('Client 1');
      expect(rows[2]).toHaveTextContent('Client 2');
      fireEvent.click(renderResult.getByTestId(/pagination--page-1/));
      rows = within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole(
        'row'
      );
      expect(rows[0]).toHaveTextContent('Client 4');
      expect(rows[1]).toHaveTextContent('Client 5');
      expect(rows[2]).toHaveTextContent('Client 6');
      fireEvent.click(renderResult.getByTestId(/pagination--page-2/));
      rows = within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole(
        'row'
      );
      expect(rows[0]).toHaveTextContent('Client 7');
    });

    test('if pagination controls are not visible if the number of pages is 1', () => {
      const { renderResult } = setup({ rowsPerPage: 7 });
      expect(renderResult.queryByTestId('pagination')).toBeNull();
    });
  });

  describe('Select number of items per page', () => {
    test('rows per page selector is rendered', () => {
      const { renderResult } = setup({
        rowsPerPage: 3,
        rowsPerPageSelect: [3, 5],
      });
      const selector = renderResult.queryByTestId(
        'dynamic-table--rows-per-page-selector'
      );
      expect(selector).toBeInTheDocument();
      expect(selector).toHaveTextContent('3');
    });

    test('rows per page selector select how many items are displayed on page', () => {
      const { renderResult } = setup({
        rowsPerPage: 3,
        rowsPerPageSelect: [3, 5],
      });
      const selector = renderResult.queryByTestId(
        'dynamic-table--rows-per-page-selector'
      );
      fireEvent.click(selector);
      const fiveRowsPerPage = renderResult.queryByTestId(
        'dynamic-table--rows-per-page-selector--item-1'
      );
      expect(fiveRowsPerPage).toBeInTheDocument();
      fireEvent.click(fiveRowsPerPage);
      expect(
        within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole('row')
      ).toHaveLength(5);
    });
  });
});
