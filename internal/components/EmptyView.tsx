import { ReactElement } from 'react';

import { Center } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';

function EmptyView({
  testId,
  children,
}: {
  testId?: string;
  columnLength: number;
  children?: ReactElement;
}) {
  return (
    <Center
      h="100px"
      fontSize="md"
      textColor="topblue60"
      backgroundColor="white"
      width="100%"
      {...setDataTestId(testId, '--empty-body')}
    >
      {children}
    </Center>
  );
}

export default EmptyView;
