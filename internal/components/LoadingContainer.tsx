import { ReactElement } from 'react';

import { Center, chakra, Spinner } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';

import { CSSProps } from '../../../../types';

interface LoadingContainerProps {
  isLoading?: boolean;
  testId?: string;
  children?: ReactElement;
  style?: CSSProps;
  loadingOpacity?: number;
}

function LoadingContainer({
  isLoading,
  testId,
  children,
  style,
  loadingOpacity = 0.75,
}: LoadingContainerProps) {
  const loadingOverlayStyle = {
    backgroundColor: `rgba(255, 255, 255, ${loadingOpacity})`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    ...style,
  };
  const containerStyle = (isLoading) => ({
    width: '100%',
    position: 'relative',
    ...(isLoading && { pointerEvents: 'none' }),
  });

  return (
    <chakra.div className="loading-container" sx={containerStyle(isLoading)}>
      {isLoading && (
        <Center
          sx={loadingOverlayStyle}
          {...setDataTestId(testId, '--loading')}
        >
          <Spinner thickness="4px" speed="1s" color="topblue70" size="xl" />
        </Center>
      )}
      {children}
    </chakra.div>
  );
}

export default LoadingContainer;
