import { render, within, fireEvent, act } from '@testing-library/react';
import _ from 'lodash';
import { Column } from 'react-table';

import Table from '..';
import { getTestData } from '../getTestData';
import { TablePropTypes } from '../types';

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
  },
  {
    Header: 'Gross Sales Ledger',
    accessor: 'grossSalesLedger',
  },
  {
    Header: 'Approved Sales Ledger',
    accessor: 'approvedSalesLedger',
  },
  {
    Header: 'Current Balance',
    accessor: 'currentBalance',
  },
];

describe('DynamicTable', () => {
  beforeEach(() => {
    global['E2E'] = true;
  });

  const setup = <T extends Record<string, unknown>>(
    tableProps: Partial<TablePropTypes<T>> = {}
  ) => {
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

  describe('rendering with default props', () => {
    test('should render a table with data', () => {
      const { renderResult } = setup();
      expect(
        within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole('row')
      ).toHaveLength(10);
    });

    test('should not render rows if the data property is an empty array', () => {
      const { renderResult } = setup({ data: [] });
      expect(renderResult.getAllByRole('rowgroup')[1]).toBeUndefined();
    });

    test('should no render a TableHead if the columns prop is an empty array', () => {
      const { renderResult } = setup({
        columns: [],
        data: [],
      });
      expect(renderResult.container.querySelector('thead')).toBeNull();
    });

    test(`should not show footer`, () => {
      const { renderResult } = setup();
      expect(renderResult.queryByText(`Total`)).toBeNull();
    });

    test(`should show footer`, () => {
      const { renderResult } = setup({
        columns: _.cloneDeep(columns).map((column) => {
          if (
            [
              'facilityLimit',
              'grossSalesLedger',
              'approvedSalesLedger',
              'currentBalance',
            ].includes(column.accessor.toString())
          )
            column.showTotal = true;
          return column;
        }),
      });

      expect(renderResult.getByText(`Total`)).toBeTruthy();
    });

    test(`should calculate proper value `, () => {
      const { renderResult } = setup({
        columns: _.cloneDeep(columns).map((column) => {
          if (
            [
              'facilityLimit',
              'grossSalesLedger',
              'approvedSalesLedger',
              'currentBalance',
            ].includes(column.accessor.toString())
          )
            column.showTotal = true;
          return column;
        }),
      });

      const rowGroups = renderResult.queryAllByRole('rowgroup');
      const footer = rowGroups[2];
      const totalRow = within(footer).queryByRole('row');

      expect(within(totalRow).getByText(`360199.87`)).toBeTruthy();
    });

    test(`should calculate new total values when page is changed `, async () => {
      const { renderResult } = setup({
        columns: _.cloneDeep(columns).map((column) => {
          if (
            [
              'facilityLimit',
              'grossSalesLedger',
              'approvedSalesLedger',
              'currentBalance',
            ].includes(column.accessor.toString())
          )
            column.showTotal = true;
          return column;
        }),
      });
      const navigation = renderResult.queryByTestId('pagination');
      const secondPageButton = within(navigation).getByText('2');

      act(() => {
        fireEvent.click(secondPageButton);
      });

      const rowGroups = renderResult.queryAllByRole('rowgroup');
      const footer = rowGroups[2];
      const totalRow = within(footer).queryByRole('row');

      expect(within(totalRow).getByText(`827610.81`)).toBeTruthy();
    });

    test('should be able to change the order of the columns', () => {
      const columns: Column<any>[] = [
        {
          id: 'clientName',
          Header: 'Client Name',
          accessor: 'clientName',
        },
        {
          id: 'desc',
          Header: 'Description',
          accessor: 'desc',
        },
      ];

      const data = [
        {
          clientName: 'Client 1',
          desc: 'bbb',
        },
        {
          clientName: 'Client 2',
          desc: 'ccc',
        },
      ];

      const { renderResult } = setup({ data, columns });

      const dragColumn = renderResult.getByTestId('--head--drag-icon-desc');
      const dropTargets = renderResult.getAllByRole('columnheader');
      const dropSquare = dropTargets[0];

      act(() => {
        fireEvent.dragStart(dragColumn);
        fireEvent.drop(dropSquare);
      });

      expect(renderResult.getAllByRole('columnheader')[0]).toHaveTextContent(
        'Description'
      );
      expect(renderResult.getAllByRole('columnheader')[1]).toHaveTextContent(
        'Client Name'
      );
    });
  });

  describe('props', () => {
    describe('#emptyView', () => {
      test('should render a message when the prop is provided ', () => {
        const { renderResult } = setup({
          data: [],
          emptyView: <div>The table is empty and this is the empty view</div>,
        });
        expect(
          renderResult.getByText(
            'The table is empty and this is the empty view'
          )
        ).toBeInTheDocument();
      });

      test('should not render a message when the prop is not provided ', () => {
        const { renderResult } = setup({
          columns: [],
          data: [],
        });
        expect(
          renderResult.queryByTestId('dynamic-table--empty-view')
        ).toBeNull();
      });

      test('should not render a message when there is data', () => {
        const { renderResult } = setup();
        expect(
          renderResult.queryByTestId('dynamic-table--empty-view')
        ).toBeNull();
      });

      test('should not render a TableHead when there is no data', () => {
        const { renderResult } = setup({
          data: [],
        });
        expect(renderResult.container.querySelector('thead')).toBeNull();
      });
    });

    describe('#rowsPerPage', () => {
      test('should render the number of rows set in the prop is provided', () => {
        const { renderResult } = setup({
          rowsPerPage: 5,
        });
        expect(
          within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole('row')
        ).toHaveLength(5);
      });

      test('should render the default number of rows if the prop is not provided', () => {
        const { renderResult } = setup();
        expect(
          within(renderResult.getAllByRole('rowgroup')[1]).getAllByRole('row')
        ).toHaveLength(10);
      });
    });

    describe('#isLoading', () => {
      test('should render a loading container if the props is set to true', () => {
        const { renderResult } = setup({ isLoading: true });
        expect(
          renderResult.getByTestId('dynamic-table--loading')
        ).toBeInTheDocument();
      });
    });

    describe('#label', () => {
      test('should render a label if the prop is set', () => {
        const { renderResult } = setup({ label: 'Test Label' });
        const table = renderResult.getByRole('table');
        expect(table).toHaveAttribute('aria-label', 'Test Label');
      });
    });

    describe('#sortBy', () => {
      test('should sort the data by the object passed as prop', () => {
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

        const defaultSortBy = { id: 'clientName' };
        const { renderResult } = setup({
          data,
          columns,
          defaultSortBy,
        });
        const rows = within(
          renderResult.getAllByRole('rowgroup')[1]
        ).getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Client 1');
        expect(rows[1]).toHaveTextContent('Client 2');
        expect(rows[2]).toHaveTextContent('Client 3');
      });

      test('should sort the data by the clientName in DESC direction', () => {
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

        const defaultSortBy = { id: 'clientName', desc: true };
        const { renderResult } = setup({
          data,
          columns,
          defaultSortBy,
        });
        const rows = within(
          renderResult.getAllByRole('rowgroup')[1]
        ).getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Client 3');
        expect(rows[1]).toHaveTextContent('Client 2');
        expect(rows[2]).toHaveTextContent('Client 1');
      });
    });

    describe('#onSort', () => {
      test('should call the onSort prop when the sort order has changed', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
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

        const onSortSpy = jest.fn();
        const { renderResult } = setup({ data, columns, onSort: onSortSpy });
        fireEvent.click(
          (
            renderResult.getAllByRole('rowgroup')[0]
              .firstElementChild as HTMLElement
          ).firstElementChild as HTMLElement
        );
        expect(onSortSpy).toHaveBeenCalledWith([
          { id: 'clientName', desc: false },
        ]);
      });
    });

    describe('#manualSortBy', () => {
      test('should disable sorting if the prop is set to true', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
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

        const { renderResult } = setup({ data, columns, manualSortBy: true });
        fireEvent.click(
          (
            renderResult.getAllByRole('rowgroup')[0]
              .firstElementChild as HTMLElement
          ).firstElementChild as HTMLElement
        );
        const rows = within(
          renderResult.getAllByRole('rowgroup')[1]
        ).getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Client 3');
        expect(rows[1]).toHaveTextContent('Client 1');
        expect(rows[2]).toHaveTextContent('Client 2');
      });

      test('should enable sorting if the prop is set to false', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
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

        const { renderResult } = setup({ data, columns, manualSortBy: false });
        fireEvent.click(
          (
            renderResult.getAllByRole('rowgroup')[0]
              .firstElementChild as HTMLElement
          ).firstElementChild as HTMLElement
        );
        const rows = within(
          renderResult.getAllByRole('rowgroup')[1]
        ).getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Client 1');
        expect(rows[1]).toHaveTextContent('Client 2');
        expect(rows[2]).toHaveTextContent('Client 3');
      });

      test('should enable sorting if the prop is set to false', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
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

        const { renderResult } = setup({ data, columns });
        fireEvent.click(
          (
            renderResult.getAllByRole('rowgroup')[0]
              .firstElementChild as HTMLElement
          ).firstElementChild as HTMLElement
        );
        const rows = within(
          renderResult.getAllByRole('rowgroup')[1]
        ).getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Client 1');
        expect(rows[1]).toHaveTextContent('Client 2');
        expect(rows[2]).toHaveTextContent('Client 3');
      });
    });

    describe('#columnDirection horizontal', () => {
      it('should render cells using horizontal direction', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
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

        const { renderResult } = setup({
          data,
          columns,
          columnDirection: 'horizontal',
        });
        const cells = renderResult.getAllByRole('cell');
        const rows = renderResult.getAllByRole('row');
        const header = renderResult.getByText('Client Name');
        expect(header).toBeInTheDocument();
        expect(rows.length).toEqual(2);
        expect(cells[0]).toHaveTextContent('Client 3');
        expect(cells[1]).toHaveTextContent('Client 1');
        expect(cells[2]).toHaveTextContent('Client 2');
      });
    });

    describe('#tooltip', () => {
      it('should render info icon on last two columns', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
          },
          {
            Header: 'Client Reference',
            accessor: 'clientReference',
            isSortable: true,
            tooltip: 'Test tooltip 1',
          },
          {
            Header: 'Facility Type',
            accessor: 'facilityType',
            isSortable: true,
            tooltip: 'Test tooltip 2',
          },
        ];

        const data = [
          {
            clientName: 'Client 1',
            clientReference: 'Reference 1',
            facilityType: 'Facility 1',
          },
          {
            clientName: 'Client 2',
            clientReference: 'Reference 2',
            facilityType: 'Facility 2',
          },
          {
            clientName: 'Client 3',
            clientReference: 'Reference 2',
            facilityType: 'Facility 2',
          },
        ];

        const { renderResult } = setup({
          data,
          columns,
        });

        const firstTooltip = renderResult.getByTestId(
          'dynamic-table--head--tooltip-icon-1'
        );
        const secondTooltip = renderResult.getByTestId(
          'dynamic-table--head--tooltip-icon-2'
        );

        expect(firstTooltip).toBeInTheDocument();
        expect(secondTooltip).toBeInTheDocument();
      });
      it('shouldnt render any tooltip icons', () => {
        const columns: Column<any>[] = [
          {
            Header: 'Client Name',
            accessor: 'clientName',
            isSortable: true,
          },
          {
            Header: 'Client Reference',
            accessor: 'clientReference',
            isSortable: true,
          },
          {
            Header: 'Facility Type',
            accessor: 'facilityType',
            isSortable: true,
          },
        ];

        const data = [
          {
            clientName: 'Client 1',
            clientReference: 'Reference 1',
            facilityType: 'Facility 1',
          },
          {
            clientName: 'Client 2',
            clientReference: 'Reference 2',
            facilityType: 'Facility 2',
          },
          {
            clientName: 'Client 3',
            clientReference: 'Reference 2',
            facilityType: 'Facility 2',
          },
        ];

        const { renderResult } = setup({
          data,
          columns,
        });

        const tooltipIcons = renderResult.queryAllByTestId(
          /dynamic-table--head--tooltip-icon-*/
        );

        expect(tooltipIcons).toHaveLength(0);
      });
    });
  });
});
