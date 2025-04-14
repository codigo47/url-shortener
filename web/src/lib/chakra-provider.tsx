// lib/chakra-provider.tsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

const theme = extendTheme({
  // Add any theme customization here
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default function Chakra({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
