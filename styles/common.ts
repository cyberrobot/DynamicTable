import { createStyles } from '../../../helpers';

export const useStyles = createStyles(({ table, spacing, font, border }) => ({
  tableContainerWithBorders: {
    borderRadius: table.BORDER_RADIUS,
    border: table.HEAD_BORDER_SHORTHAND,
  },
  tableBodyContainer: {
    overflowX: 'auto',
    backgroundColor: table.BACKGROUND_COLOR,
  },
  borderTopRadius: {
    borderTopLeftRadius: table.BORDER_RADIUS,
    borderTopRightRadius: table.BORDER_RADIUS,
  },
  borderBottomRadius: {
    borderBottomLeftRadius: table.BORDER_RADIUS,
    borderBottomRightRadius: table.BORDER_RADIUS,
  },
  borderRadius: {
    borderRadius: table.BORDER_RADIUS,
  },
  tableHorizontalGrid: {
    display: 'grid',
    gridTemplateAreas: `"hd main ft"`,
  },
  paginationContainer: {
    paddingTop: table.PAGINATION_PADDING_TOP,
    paddingBottom: table.PAGINATION_PADDING_BOTTOM,
    borderTop: '2px solid var(--chakra-colors-topblue8)',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: table.BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paddingHorizontal: {
    paddingLeft: table.PAGINATION_PADDING_LEFT,
    paddingRight: table.PAGINATION_PADDING_RIGHT,
  },
  chevronRightIcon: {
    marginRight: spacing.SPACE_1,
    ['path']: {
      strokeWidth: '4px',
    },
  },
  dropdownIcon: {
    marginRight: spacing.SPACE_2,
    ['path']: {
      strokeWidth: '5px',
    },
  },
  sortingContainerStyle: {
    display: 'inline-flex',
    flexDirection: 'column',
    verticalAlign: 'middle',
  },
  trHorizontal: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));
