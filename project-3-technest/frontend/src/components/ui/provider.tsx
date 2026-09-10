"use client";

import {
  ChakraProvider,
  defaultSystem,
} from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

interface ProviderProps {
  children?: React.ReactNode;
}

export function Provider(props: ProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}