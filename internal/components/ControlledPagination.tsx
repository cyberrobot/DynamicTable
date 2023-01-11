import { forwardRef, ReactElement } from 'react';

import { Button } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';

import { ArrowLeftIcon, ArrowRightIcon } from '../../../Icons';
import Pagination from '../../../Pagination';

interface ControlledPaginationPropTypes<T> {
  currentPage: number;
  pages: T[];
  showPages: boolean;
  onChange: (event: React.SyntheticEvent, pageIndex: number) => void;
  rowsPerPageComponent?: ReactElement | null;
}

function ControlledPagination<T>({
  currentPage,
  pages,
  showPages,
  onChange,
  rowsPerPageComponent,
}: ControlledPaginationPropTypes<T>) {
  const offsetPages = pages.map((_, index) => index + 1);
  const selectedIndex = currentPage;
  const navigatorStyle = (isPrevious) => ({
    marginRight: isPrevious && 'var(--chakra-space-1)',
    paddingInlineStart: '1',
    paddingInlineEnd: '1',
  });
  const pageStyle = {
    marginRight: 'var(--chakra-space-1)',
    paddingInlineStart: '1',
    paddingInlineEnd: '1',
  };
  const Navigator = (props, ref: React.Ref<HTMLButtonElement>) => {
    const { testId, className, children, ...rest } = props;
    const ariaLabel = props['aria-label'];
    const isPrevious = ariaLabel === 'previous';
    return (
      <Button
        {...rest}
        {...setDataTestId(testId)}
        aria-label={ariaLabel}
        ref={ref}
        leftIcon={
          isPrevious ? (
            <ArrowLeftIcon color="topblue70" w="4" h="4" />
          ) : (
            <ArrowRightIcon color="topblue70" w="4" h="4" />
          )
        }
        variant="outline"
        size="sm"
        iconSpacing="0"
        sx={navigatorStyle(isPrevious)}
      ></Button>
    );
  };
  const Page = (props, ref: React.Ref<HTMLButtonElement>) => {
    const { testId, className, children, ...rest } = props;
    return (
      <Button
        {...rest}
        {...setDataTestId(props.testId)}
        ref={ref}
        variant="outline"
        size="sm"
        iconSpacing="0"
        sx={pageStyle}
      >
        {children}
      </Button>
    );
  };

  return (
    <Pagination
      selectedIndex={selectedIndex}
      pages={offsetPages}
      onChange={onChange}
      testId="pagination"
      showPages={showPages}
      components={{
        Previous: forwardRef(Navigator),
        Next: forwardRef(Navigator),
        Page: forwardRef(Page),
      }}
      rowsPerPageComponent={rowsPerPageComponent}
    />
  );
}

export default ControlledPagination;
