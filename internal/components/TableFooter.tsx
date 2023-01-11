import { chakra, Td, Tfoot, Tr } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';
import { ColumnInstance } from 'react-table';

import { useStyles as commonUseStyles } from '../../styles/common';
import { useStyles as footerUseStyles } from '../../styles/footer';
import { useStyles as headUseStyles } from '../../styles/head';
import { TableFooterPropTypes } from '../../types';
import { getTotalValue } from '../utils/helpers';

function TableFooter<T extends Record<string, unknown>>({
  pageRows,
  footerGroups,
  testId,
  isCondensed,
  isColumnDirectionVertical,
}: TableFooterPropTypes<T>) {
  const commonStyles = commonUseStyles();
  const footerStyles = footerUseStyles();
  const headStyles = headUseStyles();
  return (
    <Tfoot sx={footerStyles.tFoot} {...setDataTestId(testId, '--footer')}>
      {footerGroups.map((footerGroup) => (
        <Tr
          {...footerGroup.getFooterGroupProps()}
          sx={!isColumnDirectionVertical && commonStyles.trHorizontal}
        >
          {footerGroup.headers.map((column: ColumnInstance<T>, thIndex) => (
            <Td
              {...column.getFooterProps()}
              sx={{
                ...footerStyles.tdCommon,
                ...footerStyles.tdVertical,
                ...(isCondensed && headStyles.thCondensed),
                ...(!isColumnDirectionVertical && {
                  ...headStyles.thHorizontal,
                  ...footerStyles.tdHorizontal,
                }),
              }}
              isNumeric={column.isNumeric}
              {...setDataTestId(testId, `--footer--cell-${thIndex}`)}
            >
              <chakra.span>
                {thIndex === 0 ? 'Total' : getTotalValue(column, pageRows)}
              </chakra.span>
            </Td>
          ))}
        </Tr>
      ))}
    </Tfoot>
  );
}

export default TableFooter;
