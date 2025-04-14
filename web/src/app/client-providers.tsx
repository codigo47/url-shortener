'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Providers } from './providers';
import { AuthProvider } from '../lib/auth-context';
import theme from '../lib/theme';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </ChakraProvider>
    </>
  );
}