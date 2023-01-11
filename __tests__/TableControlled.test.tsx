import { fireEvent, render, within } from '@testing-library/react';
import { Column } from 'react-table';

import DynamicTable from '../DynamicTable';
import { TablePropTypes } from '../types';

describe('Controlled DynamicTable', () => {
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

    const renderResult = render(<DynamicTable<T> {...props} {...tableProps} />);

    return {
      renderResult,
      props,
    };
  };

  describe('Paging', () => {
    test('Should call onPageSetControlled when the page is changed', () => {
      const onPageSetControlledSpy = jest.fn();
      const { renderResult } = setup({
        rowsPerPage: 3,
        onPageSet: onPageSetControlledSpy,
      });
      fireEvent.click(renderResult.getByTestId('pagination--page-1'));
      // Zero based index
      expect(onPageSetControlledSpy).toHaveBeenCalledWith(1);
    });

    test('Should not change page if the manualPaging is enabled', () => {
      const { renderResult } = setup({
        manualPagination: true,
        pageCount: -1,
      });
      expect(renderResult.queryByTestId('pagination')).toBeNull();
    });

    test('Should set the number of pages according to the pageCount property', () => {
      const { renderResult } = setup({
        pageCount: 2,
        manualPagination: true,
      });
      expect(renderResult.getAllByTestId(/-page-*/)).toHaveLength(2);
    });

    test('Should not reset paging if data property has changed', () => {
      const { renderResult, props } = setup({
        manualPagination: true,
        pageCount: 2,
        autoResetPage: false,
      });
      expect(renderResult.getAllByTestId(/-page-*/)).toHaveLength(2);
      fireEvent.click(renderResult.getByTestId('pagination--page-1'));
      expect(renderResult.getByTestId(/-current-page-*/)).toHaveTextContent(
        '2'
      );
      const newData = [
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
      const newProps = {
        ...props,
        data: newData as any[],
      };
      renderResult.rerender(<DynamicTable {...newProps} />);
      expect(renderResult.getByTestId(/-current-page-*/)).toHaveTextContent(
        '2'
      );
      const rows = within(
        renderResult.getAllByRole('rowgroup')[1]
      ).getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Client 4');
    });

    test('Should set selected page to the page property', () => {
      const { renderResult } = setup({
        page: 1,
        pageCount: 2,
        manualPagination: true,
      });
      expect(renderResult.getByTestId(/-current-page-*/)).toHaveTextContent(
        '2'
      );
    });
  });
});
