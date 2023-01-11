import { Tbody, Td, Tr } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';
import { Cell, Row } from 'react-table';

import { spacing, table } from '../../../../helpers/theme';
import { DropdownIcon, ChevronRightIcon } from '../../../Icons';
import { useStyles } from '../../styles/common';
import { TableBodyPropTypes } from '../../types';

function TableBody<T extends Record<string, unknown>>({
  getTableBodyProps,
  prepareRow,
  pageRows,
  testId,
  showTotal,
  isCondensed,
  isHighlighted,
  isColumnDirectionVertical,
  headerGroups,
}: TableBodyPropTypes<T>) {
  const styles = useStyles();
  const tdStyle = (
    index,
    columns,
    isLastRow,
    isLastDeepRow,
    depth,
    isCondensed,
    canExpand
  ) => {
    const isBorderBottomPresent =
      !isLastRow || (isLastRow && showTotal && isColumnDirectionVertical);
    const getPaddingStart = () => {
      if (isCondensed) {
        return spacing.SPACE_1;
      }
      if (!index && depth) {
        return spacing.SPACE_10;
      }
      return table.BODY_SPACING_LEFT;
    };
    return {
      textTransform: 'none',
      paddingTop: isCondensed ? spacing.SPACE_1 : table.BODY_SPACING_TOP,
      paddingBottom: isCondensed ? spacing.SPACE_1 : table.BODY_SPACING_BOTTOM,
      paddingInlineStart: getPaddingStart(),
      paddingInlineEnd: isCondensed
        ? spacing.SPACE_1
        : table.BODY_SPACING_RIGHT,
      borderBottom: isBorderBottomPresent
        ? table.BODY_BORDER_SHORTHAND
        : 'none',
      borderBottomColor: isLastDeepRow && table.BODY_BORDER_COLOR,
      borderColor: depth ? 'transparent' : table.BODY_BORDER_COLOR,
      color: table.BODY_TEXT,
      fontSize: table.BODY_FONT_SIZE,
      whiteSpace: 'nowrap',
      borderRight:
        index === columns || depth ? 'none' : table.BODY_BORDER_SHORTHAND,
      backgroundColor: table.BODY_BACKGROUND_COLOR,
      cursor: canExpand ? 'pointer' : '',
    };
  };

  const tbodyStyle = {
    gridArea: 'main',
    ['tr:hover td']: {
      backgroundColor: isHighlighted && table.BODY_CELL_BACKGROUND_COLOR_HOVER,
    },
    ['tr .action-cell']: {
      opacity: '0%',
    },
    ['tr:hover .action-cell']: {
      opacity: '100%',
    },
  };

  const rowStyle = (isExpanded, depth) => ({
    gridArea: 'main',
    ['td']: {
      backgroundColor: isExpanded && table.BODY_BORDER_COLOR,
    },
    ['td:first-of-type']: {
      borderLeft: (isExpanded || depth) && table.BODY_BORDER_SHORTHAND,
    },
    ['td:last-of-type']: {
      borderRight: (isExpanded || depth) && table.BODY_BORDER_SHORTHAND,
    },
  });

  const renderHorizontalBody = () => {
    return headerGroups.map((headerGroup) => {
      return headerGroup.headers.map((header, headerIndex) => {
        const isLastRow = headerIndex === headerGroup.headers.length - 1;
        return (
          <Tr sx={rowStyle(false, 0)} key={headerIndex}>
            {pageRows.map((row, rowIndex) => {
              prepareRow(row);
              const filteredCells = row.cells.filter(
                (cell) => cell.column.Header === header.Header
              );
              return filteredCells.map((cell: Cell<T>, tdIndex) => {
                return (
                  <Td
                    {...cell.getCellProps()}
                    sx={tdStyle(
                      rowIndex,
                      pageRows.length - 1,
                      isLastRow,
                      false,
                      0,
                      isCondensed,
                      row.canExpand
                    )}
                    isNumeric={cell.column.isNumeric}
                    {...setDataTestId(testId, `--body--cell-${tdIndex}`)}
                  >
                    {cell.render('Cell')}
                  </Td>
                );
              });
            })}
          </Tr>
        );
      });
    });
  };

  const renderVerticalBody = () => {
    return pageRows.map((row: Row<T>, rowIndex) => {
      prepareRow(row);
      const isLastRow = rowIndex === pageRows.length - 1;
      const isLastDeepRow = row.depth && !pageRows[rowIndex + 1]?.depth;
      const handleOnClick = () => {
        row.toggleRowExpanded?.();
      };
      return (
        <Tr
          {...row.getRowProps()}
          sx={rowStyle(row.canExpand && row.isExpanded, row.depth)}
          onClick={handleOnClick}
        >
          {row.cells.map((cell: Cell<T>, tdIndex) => {
            return (
              <Td
                {...cell.getCellProps()}
                sx={tdStyle(
                  tdIndex,
                  row.cells.length - 1,
                  isLastRow,
                  isLastDeepRow,
                  row.depth,
                  isCondensed,
                  row.canExpand
                )}
                isNumeric={cell.column.isNumeric}
                {...setDataTestId(testId, `--body--cell-${tdIndex}`)}
              >
                {row.canExpand &&
                  !tdIndex &&
                  (row.isExpanded ? (
                    <DropdownIcon
                      width={2}
                      height={2}
                      props={{
                        sx: styles.dropdownIcon,
                      }}
                    />
                  ) : (
                    <ChevronRightIcon
                      width={3}
                      height={3}
                      sx={styles.chevronRightIcon}
                    />
                  ))}
                {cell.render('Cell')}
              </Td>
            );
          })}
        </Tr>
      );
    });
  };

  return (
    <Tbody
      {...getTableBodyProps()}
      {...setDataTestId(testId, '--body')}
      sx={tbodyStyle}
    >
      {isColumnDirectionVertical
        ? renderVerticalBody()
        : renderHorizontalBody()}
    </Tbody>
  );
}

export default TableBody;
