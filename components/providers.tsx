'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import theme from '@/lib/theme';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
