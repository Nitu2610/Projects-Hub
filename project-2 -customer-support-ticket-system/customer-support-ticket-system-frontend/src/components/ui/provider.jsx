import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import { system } from "../../theme/system.js";

export function Provider(props) {
  return (
    <ChakraProvider value={system}> {/* Chakra UI configuration */}
      <ColorModeProvider {...props} /> {/*  Light/dark mode */}
    </ChakraProvider>
  );
}
