import { fireEvent, render, screen } from '@testing-library/react';
import { Column } from 'react-table';

import { readTableRows } from '../../../../../utils/src/test-utils/test-utils';
import DynamicTable from '../DynamicTable';
import { TablePropTypes } from '../types';

describe('sub rows', () => {
  const tableTestId = 'test-sub-rows-table';
  beforeEach(() => (global['E2E'] = true));

  const setup = <T extends Record<string, unknown>>(
    tableProps: Partial<TablePropTypes<T>> = {}
  ) => {
    const props = {
      data: [],
      columns: [],
      testId: tableTestId,
    };
    render(<DynamicTable<T> {...props} {...tableProps} />);
  };

  it('toggle sub rows', () => {
    const expandedRowId = `${tableTestId}--expanded-row-1`;
    const columns = [
      {
        Header: 'header 1',
        accessor: 'value',
        Cell: ({ cell, row }) => (
          <span data-testid={row.original.id}>{cell.value}</span>
        ),
      },
    ] as Column<any>[];
    const data = [
      {
        id: expandedRowId,
        value: 'row 1',
      },
    ];
    const getSubRows = (r) => {
      return r?.id === expandedRowId
        ? [
            {
              value: 'row 1.1',
            },
            {
              value: 'row 1.2',
            },
          ]
        : undefined;
    };
    setup({ columns, data, getSubRows });
    expect(readTableRows(tableTestId)).toEqual([['row 1']]);
    fireEvent.click(screen.queryByTestId(expandedRowId));
    expect(readTableRows(tableTestId)).toEqual([
      ['row 1'],
      ['row 1.1'],
      ['row 1.2'],
    ]);
    fireEvent.click(screen.queryByTestId(expandedRowId));
    expect(readTableRows(tableTestId)).toEqual([['row 1']]);
  });
});
