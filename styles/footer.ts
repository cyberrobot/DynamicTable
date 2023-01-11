import { createStyles } from '../../../helpers';

export const useStyles = createStyles(({ table, font }) => ({
  tdCommon: {
    borderColor: table.FOOTER_BORDER_COLOR,
    color: table.FOOTER_TEXT,
    fontWeight: font.WEIGHT_SEMIBOLD,
    fontSize: table.FOOTER_FONT_SIZE,
    gridArea: 'ft',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    paddingTop: table.FOOTER_SPACING_TOP,
    paddingBottom: table.FOOTER_SPACING_BOTTOM,
  },
  tdVertical: {
    borderRight: table.HEAD_BORDER_SHORTHAND,
    borderBottom: 'none',
    ['&:last-child']: {
      borderRight: 'none',
    },
  },
  tdHorizontal: {
    borderLeft: table.HEAD_BORDER_SHORTHAND,
    borderBottom: table.HEAD_BORDER_SHORTHAND,
    borderRight: 'none',
    ['span:empty::after']: {
      content: '"."',
      visibility: 'hidden',
      speak: 'none',
    },
  },
  tFoot: {
    backgroundColor: table.FOOTER_BACKGROUND_COLOR,
  },
}));
