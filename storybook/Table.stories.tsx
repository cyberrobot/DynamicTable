import React, { useState } from 'react';

import { HStack } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import _ from 'lodash';

import Table from '..';
import { theme } from '../../../helpers';
import { Button } from '../../Button';
import { Widget } from '../../Widget';
import { getTestData } from '../getTestData';

export default {
  title: 'Satago/DynamicTable',
  component: Table,
} as ComponentMeta<typeof Table>;

const { spacing } = theme;

const columns = [
  {
    Header: 'Client Name',
    accessor: 'clientName',
  },
  {
    Header: 'Client Reference',
    accessor: 'clientReference',
    isNumeric: true,
    showTotal: false,
  },
  {
    Header: 'Facility Type',
    accessor: 'facilityType',
    isSortable: true,
    showTotal: false,
  },
  {
    Header: 'Facility Limit',
    accessor: 'facilityLimit',
    isNumeric: true,
    isSortable: true,
    showTotal: false,
  },
  {
    Header: 'Gross Sales Ledger',
    accessor: 'grossSalesLedger',
    isNumeric: true,
    isSortable: true,
  },
  {
    Header: 'Approved Sales Ledger',
    accessor: 'approvedSalesLedger',
    isNumeric: true,
    isSortable: true,
    showTotal: false,
    tooltip: 'This is an example tooltip 1',
  },
  {
    Header: 'Current Balance',
    accessor: 'currentBalance',
    isNumeric: true,
    isSortable: true,
    tooltip: 'This is an example tooltip 2',
  },
];

const data = getTestData();
const handleRowsPerPageSet = (rowsPerPage) => ({ rowsPerPage: rowsPerPage });

const Template: ComponentStory<typeof Table> = (args) => {
  return (
    <div style={{ backgroundColor: '#eee', padding: spacing.SPACE_6 }}>
      <Widget>
        <Table {...args} />
      </Widget>
    </div>
  );
};

const TemplateNoBg: ComponentStory<typeof Table> = (args) => {
  return <Table {...args} />;
};

export const Default: ComponentStory<typeof Table> = TemplateNoBg.bind({});

Default.args = {
  label: 'Test label',
  testId: 'dynamic-table',
  columns: columns,
  data: data,
  variant: [],
};

export const Borderless: ComponentStory<typeof Table> = Template.bind({});

Borderless.args = {
  columns: columns,
  data: data,
};

export const WithTotalFooter: ComponentStory<typeof Table> = Template.bind({});

WithTotalFooter.args = {
  label: 'Test label',
  testId: 'dynamic-table',
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
  data: data,
};

export const EmptyView: ComponentStory<typeof Table> = Template.bind({});

EmptyView.args = {
  emptyView: <div>The table is empty and this is the empty view</div>,
  columns: columns,
  data: [],
};

export const NoData: ComponentStory<typeof Table> = Template.bind({});

NoData.args = {
  columns: [],
  data: [],
  testId: 'dynamic-table',
};

export const RowsPerPage: ComponentStory<typeof Table> = Template.bind({});

RowsPerPage.args = {
  rowsPerPage: 3,
  testId: 'dynamic-table',
  columns: columns,
  data: data,
  onRowsPerPageSet: handleRowsPerPageSet,
};

export const RowsPerPageSelect: ComponentStory<typeof Table> = Template.bind(
  {}
);

RowsPerPageSelect.args = {
  rowsPerPage: 5,
  rowsPerPageSelect: [5, 10, 15, 30],
  testId: 'dynamic-table',
  columns: columns,
  data: data,
  onRowsPerPageSet: handleRowsPerPageSet,
};

export const LoadingState: ComponentStory<typeof Table> = Template.bind({});

LoadingState.args = {
  isLoading: true,
  columns: columns,
  data: data,
  onRowsPerPageSet: handleRowsPerPageSet,
};

export const SubRows: ComponentStory<typeof Table> = Template.bind({});
SubRows.args = {
  columns: [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ cell: { value } }) => (
        <span style={{ whiteSpace: 'normal' }}>{value}</span>
      ),
    },
    { Header: 'Type', accessor: 'type' },
    {
      Header: 'Occurrence',
      accessor: 'occurrence',
      Cell: ({ cell: { value } }) => (
        <span style={{ whiteSpace: 'normal' }}>{value}</span>
      ),
    },
  ],
  data: [
    {
      name: 'Drawdown Fees (CHAPS, FPS, BACS etc.)',
      description:
        'Amount charged at the time of drawing down money from their facility. This will differ per payment type (e.g. BACS £25, FPS £5)',
      type: 'Fixed £ per method',
      occurrence: 'At drawdown',
      children: [
        {
          name: 'CHAPS',
          description: '',
          type: 'Fixed £ per method',
          occurrence: 'At drawdown',
        },
        {
          name: 'FPS',
          description: '',
          type: 'Fixed £ per method',
          occurrence: 'At drawdown',
        },
        {
          name: 'BACS',
          description: '',
          type: 'Fixed £ per method',
          occurrence: 'At drawdown',
        },
      ],
    },
    {
      name: 'Discount Charge',
      description: 'The amount charged against the current account balance',
      type: '%',
      occurrence:
        'Accrued daily, charged monthly. Charged on top of base rate (or minimum base rate if the current base rate is lower than the base rate at the time the client signed up)',
      VAT: false,
      automatic: true,
    },
  ],

  getSubRows: (row) => {
    return row.children as Record<string, unknown>[];
  },

  testId: 'dynamic-table',
};

export const SubRowsWithRowsPerPage: ComponentStory<typeof Table> =
  Template.bind({});
SubRowsWithRowsPerPage.args = {
  columns: [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ cell: { value } }) => (
        <span style={{ whiteSpace: 'normal' }}>{value}</span>
      ),
    },
    { Header: 'Type', accessor: 'type' },
    {
      Header: 'Occurrence',
      accessor: 'occurrence',
      Cell: ({ cell: { value } }) => (
        <span style={{ whiteSpace: 'normal' }}>{value}</span>
      ),
    },
  ],
  data: [
    {
      name: 'Test Name',
      description: 'The description',
      type: 'Test type',
      occurrence: 'Test occurence',
      VAT: false,
      automatic: true,
    },
    {
      name: 'Test Name 2',
      description: 'The description 2',
      type: 'Test type 2',
      occurrence: 'Test occurence 2',
      VAT: false,
      automatic: true,
    },
    {
      name: 'Test Name 3',
      description: 'The description 3',
      type: 'Test type 3',
      occurrence: 'Test occurence 3',
      VAT: false,
      automatic: true,
    },
    {
      name: 'Test Name 4',
      description: 'The description 4',
      type: 'Test type 4',
      occurrence: 'Test occurence 4',
      VAT: false,
      automatic: true,
      children: [
        {
          name: 'Test child 1',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
        {
          name: 'Test child 2',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
        {
          name: 'Test child 3',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
      ],
    },
    {
      name: 'Test Name 5',
      description: 'The description 5',
      type: 'Test type 5',
      occurrence: 'Test occurence 5',
      VAT: false,
      automatic: true,
      children: [
        {
          name: 'Test child 1',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
        {
          name: 'Test child 2',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
        {
          name: 'Test child 3',
          description: '',
          type: 'Test type',
          occurrence: 'Test occurence',
        },
      ],
    },
    {
      name: 'Test Name 5',
      description: 'The description 5',
      type: 'Test type 5',
      occurrence: 'Test occurence 5',
      VAT: false,
      automatic: true,
    },
  ],
  rowsPerPage: 5,
  rowsPerPageSelect: [5, 10, 15, 30],
  getSubRows: (row) => {
    return row.children as Record<string, unknown>[];
  },
  testId: 'dynamic-table',
};

export const ControlledState: ComponentStory<typeof Table> = (args) => {
  const rowsPerPage = 5;
  const originalData = React.useMemo(() => getTestData(), []);
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState(
    React.useMemo(() => getTestData().slice(0, rowsPerPage), [])
  );
  const onPageSet = (newPageIndex: number) => {
    if (
      newPageIndex >= 0 &&
      newPageIndex < Math.ceil(originalData.length / rowsPerPage)
    ) {
      setPageIndex(newPageIndex);
      setData(
        getTestData().slice(
          newPageIndex * rowsPerPage,
          (newPageIndex + 1) * rowsPerPage
        )
      );
    }
  };
  const columns = React.useMemo(
    () => [
      {
        Header: 'Client Name',
        accessor: 'clientName',
      },
      {
        Header: 'Client Reference',
        accessor: 'clientReference',
        isNumeric: true,
      },
      {
        Header: 'Facility Type',
        accessor: 'facilityType',
      },
      {
        Header: 'Facility Limit',
        accessor: 'facilityLimit',
        isNumeric: true,
      },
      {
        Header: 'Gross Sales Ledger',
        accessor: 'grossSalesLedger',
        isNumeric: true,
      },
      {
        Header: 'Approved Sales Ledger',
        accessor: 'approvedSalesLedger',
        isNumeric: true,
      },
      {
        Header: 'Current Balance',
        accessor: 'currentBalance',
        isNumeric: true,
      },
    ],
    []
  );

  return (
    <>
      <HStack spacing="2" mb="2">
        <Button onClick={() => onPageSet(pageIndex - 1)}>Previous page</Button>
        <Button onClick={() => onPageSet(pageIndex + 1)}>Next page</Button>
      </HStack>
      <Table
        {...args}
        page={pageIndex}
        columns={columns}
        data={data}
        manualPagination={true}
        autoResetPage={false}
        pageCount={Math.ceil(originalData.length / rowsPerPage)}
        onPageSet={onPageSet}
      />
    </>
  );
};

ControlledState.args = {};

export const HorizontalColumnDirection: ComponentStory<typeof Table> =
  Template.bind({});

HorizontalColumnDirection.args = {
  label: 'Test label',
  testId: 'dynamic-table',
  columns,
  data,
  columnDirection: 'horizontal',
};

export const HorizontalColumnDirectionWithTotalRow: ComponentStory<
  typeof Table
> = Template.bind({});

HorizontalColumnDirectionWithTotalRow.args = {
  label: 'Test label',
  testId: 'dynamic-table',
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
  data,
  columnDirection: 'horizontal',
};

export const Condensed: ComponentStory<typeof Table> = Template.bind({});

Condensed.args = {
  label: 'Test label',
  testId: 'dynamic-table',
  columns,
  data,
  variant: ['borderless', 'condensed'],
};

export const Highlighted: ComponentStory<typeof Table> = Template.bind({});

Highlighted.args = {
  label: 'Test label',
  testId: 'dynamic-table',
  columns,
  data,
  variant: ['borderless', 'highlighted'],
};

export const HighlightedCondensed: ComponentStory<typeof Table> = Template.bind(
  {}
);

HighlightedCondensed.args = {
  label: 'Test label',
  testId: 'dynamic-table',
  columns,
  data,
  variant: ['borderless', 'condensed', 'highlighted'],
};
