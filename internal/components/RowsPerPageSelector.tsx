import { useMemo } from 'react';

import { table } from '../../../../helpers/theme';
import Menu from '../../../Menu';

export interface RowsPerPageProps {
  items: number[];
  selected: number;
  onChange: (number) => void;
  testId: string;
}

export const RowsPerPageSelector = ({
  onChange,
  items,
  selected,
  testId,
}: RowsPerPageProps) => {
  const options = items.map((n) => ({
    value: String(n),
    label: `${n} rows`,
    selected: n === selected,
  }));

  return (
    <Menu
      buttonHeight={table.ROWS_PER_PAGE_SELECTOR_HEIGHT}
      items={useMemo(() => options, [options])}
      onOptionSelect={(selectedOptions) =>
        onChange(Number(selectedOptions[0].value))
      }
      testId={testId}
      showSelectedItems={true}
    />
  );
};
