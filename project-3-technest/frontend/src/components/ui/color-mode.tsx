"use client";

import {
  ClientOnly,
  IconButton,
  Skeleton,
  Span,
} from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

interface ColorModeProviderProps {
  children?: ReactNode;
}

export function ColorModeProvider({
  children,
}: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();

  const colorMode = forcedTheme || resolvedTheme;

  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

type ColorModeButtonProps = ComponentPropsWithoutRef<
  typeof IconButton
>;

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

type ModeProps = ComponentPropsWithoutRef<typeof Span>;

export const LightMode = forwardRef<
  HTMLSpanElement,
  ModeProps
>(function LightMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      ref={ref}
      {...props}
    />
  );
});

export const DarkMode = forwardRef<
  HTMLSpanElement,
  ModeProps
>(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  );
});