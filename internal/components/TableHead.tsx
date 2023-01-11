import { useState } from 'react';

import { chakra, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { setDataTestId, useDebouncedCallback } from '@satago/utils';
import { useDrag, useDrop } from 'react-dnd';
import { ColumnInstance } from 'react-table';

import { spacing, table } from '../../../../helpers/theme';
import {
  InfoIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  DragIcon,
} from '../../../Icons';
import { useStyles as commonUseStyles } from '../../styles/common';
import { useStyles as headUseStyles } from '../../styles/head';
import {
  TableHeadPropTypes,
  DraggableColumnHeaderPropTypes,
} from '../../types';

const reorderColumn = (draggedColumnId, targetColumnId, columnOrder) => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
  );
  return [...columnOrder];
};

function DraggableColumnHeader<T extends Record<string, unknown>>({
  columnOrder,
  onColumnOrderChange,
  isColumnDirectionVertical,
  testId,
  isCondensed,
  column,
  thIndex,
}: DraggableColumnHeaderPropTypes<T>) {
  const commonStyles = commonUseStyles();
  const headStyles = headUseStyles();

  const debouncedSetIsDropTargetFalse = useDebouncedCallback(() => {
    setIsDropTarget(false);
  }, 100);

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: ColumnInstance) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      );
      onColumnOrderChange(newColumnOrder);
    },
    hover: () => {
      setIsDropTarget(true);
      debouncedSetIsDropTargetFalse();
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  const [isDropTarget, setIsDropTarget] = useState(false);

  const thStyle = {
    ...headStyles.thCommon,
    ...headStyles.th,
    ...(isCondensed && headStyles.thCondensed),
    ...(!isColumnDirectionVertical && headStyles.thHorizontal),
    opacity: isDragging ? 0.3 : 1,
    ...(isDropTarget && {
      ...(isColumnDirectionVertical
        ? headStyles.thDropTarget
        : headStyles.thDropTargetHorizontal),
    }),
  };

  return (
    <Th
      {...column.getHeaderProps(column.getSortByToggleProps())}
      title={null}
      sx={thStyle}
      isNumeric={isColumnDirectionVertical && column.isNumeric}
      {...setDataTestId(testId, `--head--cell-${thIndex}`)}
      ref={dropRef}
      key={column.id || thIndex}
    >
      <chakra.span ref={previewRef}>
        <chakra.span ref={dragRef}>
          <chakra.span
            sx={headStyles.dragIconContainer}
            {...setDataTestId(`--head--drag-icon-${column.id}`)}
          >
            <DragIcon
              color={table.HEAD_ICON_SORTING_COLOR_DEFAULT}
              height={4}
              width={3}
            />
          </chakra.span>
          {column.render('Header')}
        </chakra.span>
      </chakra.span>
      {column.tooltip && (
        <chakra.span pl={spacing.SPACE_2}>
          <Tooltip
            label={column.tooltip}
            {...setDataTestId(testId, `--head--tooltip-${thIndex}`)}
          >
            <InfoIcon
              color={table.HEAD_ICON_TOOLTIP_COLOR_DEFAULT}
              height={3}
              width={3}
              {...setDataTestId(testId, `--head--tooltip-icon-${thIndex}`)}
            />
          </Tooltip>
        </chakra.span>
      )}
      {column.canSort && (
        <chakra.span
          pl={spacing.SPACE_2}
          {...setDataTestId(testId, `--head--sorting`)}
          sx={commonStyles.sortingContainerStyle}
        >
          <TriangleUpIcon
            color={
              column.isSorted && !column.isSortedDesc
                ? table.HEAD_ICON_SORTING_COLOR_ACTIVE
                : table.HEAD_ICON_SORTING_COLOR_DEFAULT
            }
            w={table.HEAD_ICON_SORTING_SIZE}
            h={table.HEAD_ICON_SORTING_SIZE}
            aria-label="sorted ascending"
            {...setDataTestId(testId, `--head--sorting-icon--asc`)}
            mb={spacing.SPACE_PX}
          />
          <TriangleDownIcon
            color={
              column.isSorted && column.isSortedDesc
                ? table.HEAD_ICON_SORTING_COLOR_ACTIVE
                : table.HEAD_ICON_SORTING_COLOR_DEFAULT
            }
            w={table.HEAD_ICON_SORTING_SIZE}
            h={table.HEAD_ICON_SORTING_SIZE}
            aria-label="sorted descending"
            {...setDataTestId(testId, `--head--sorting-icon--desc`)}
          />
        </chakra.span>
      )}
    </Th>
  );
}

function TableHead<T extends Record<string, unknown>>({
  headerGroups,
  testId,
  isColumnDirectionVertical,
  ...props
}: TableHeadPropTypes<T>) {
  const commonStyles = commonUseStyles();
  const headStyles = headUseStyles();
  return (
    <Thead sx={headStyles.tHead} {...setDataTestId(testId, '--head')}>
      {headerGroups.map((headerGroup, index) => (
        <Tr
          {...headerGroup.getHeaderGroupProps()}
          sx={!isColumnDirectionVertical && commonStyles.trHorizontal}
          key={index}
        >
          {headerGroup.headers.map((column: ColumnInstance<T>, thIndex) => (
            <DraggableColumnHeader
              column={column}
              thIndex={thIndex}
              isColumnDirectionVertical={isColumnDirectionVertical}
              headerGroups={headerGroups}
              headerGroup={headerGroup}
              testId={testId}
              {...props}
              key={column.id || thIndex}
            />
          ))}
        </Tr>
      ))}
    </Thead>
  );
}

export default TableHead;
