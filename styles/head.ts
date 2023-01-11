import { createStyles } from '../../../helpers';

export const useStyles = createStyles(({ table, spacing, font }) => ({
  tHead: {
    backgroundColor: table.HEAD_BACKGROUND_COLOR,
    gridArea: 'hd',
  },
  th: {
    paddingTop: table.HEAD_SPACING_TOP,
    paddingBottom: table.HEAD_SPACING_BOTTOM,
    paddingInlineStart: table.HEAD_SPACING_LEFT,
    paddingInlineEnd: table.HEAD_SPACING_RIGHT,
    borderRight: table.HEAD_BORDER_SHORTHAND,
    borderBottomWidth: table.HEAD_BORDER_WIDTH,
    fontSize: table.HEAD_FONT_SIZE,
    fontWeight: font.WEIGHT_SEMIBOLD,
    ['&:last-child']: {
      borderRight: 'none',
    },
  },
  thCondensed: {
    paddingTop: spacing.SPACE_1,
    paddingBottom: spacing.SPACE_1,
    paddingInlineStart: spacing.SPACE_1,
    paddingInlineEnd: spacing.SPACE_1,
  },
  thHorizontal: {
    paddingTop: table.BODY_SPACING_TOP,
    paddingBottom: table.BODY_SPACING_BOTTOM,
    paddingInlineStart: table.BODY_SPACING_LEFT,
    paddingInlineEnd: table.BODY_SPACING_RIGHT,
    fontSize: table.BODY_FONT_SIZE,
    lineHeight: spacing.SPACE_5,
    width: '100%',
    ['&:last-child']: {
      borderBottom: 'none',
    },
  },
  thDropTarget: {
    borderRightColor: table.HEAD_ICON_SORTING_COLOR_ACTIVE,
  },
  thDropTargetHorizontal: {
    borderBottomColor: table.HEAD_ICON_SORTING_COLOR_ACTIVE,
    ['&:last-child']: {
      borderBottomWidth: table.HEAD_BORDER_WIDTH,
      borderBottomColor: table.HEAD_ICON_SORTING_COLOR_ACTIVE,
    },
  },
  thCommon: {
    borderColor: table.HEAD_BORDER_COLOR,
    color: table.HEAD_TEXT,
    fontWeight: font.WEIGHT_SEMIBOLD,
    gridArea: 'hd',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    [':drop']: {
      borderRight: '1px solid #000',
    },
  },
  dragIconContainer: {
    cursor: 'grab',
    paddingRight: '0.5rem',
  },
}));
