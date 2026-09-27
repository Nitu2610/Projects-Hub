import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

import { colors } from "./colors";
import { typography } from "./typography";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: colors.light.background },
          100: { value: "#DBEAFE" },
          200: { value: "#BFDBFE" },
          300: { value: "#93C5FD" },
          400: { value: "#60A5FA" },
          500: { value: colors.light.primary },
          600: { value: colors.light.primaryHover },
          700: { value: "#1E40AF" },
          800: { value: "#1E3A8A" },
          900: { value: "#172554" },
        },
      },

      fonts: {
        heading: {
          value: typography.fonts.heading,
        },
        body: {
          value: typography.fonts.body,
        },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: {
              _light: colors.light.background,
              _dark: colors.dark.background,
            },
          },

          panel: {
            value: {
              _light: colors.light.surface,
              _dark: colors.dark.surface,
            },
          },

          muted: {
            value: {
              _light: colors.light.surfaceMuted,
              _dark: colors.dark.surfaceMuted,
            },
          },
        },

        fg: {
          DEFAULT: {
            value: {
              _light: colors.light.text,
              _dark: colors.dark.text,
            },
          },

          muted: {
            value: {
              _light: colors.light.textMuted,
              _dark: colors.dark.textMuted,
            },
          },
        },

        border: {
          DEFAULT: {
            value: {
              _light: colors.light.border,
              _dark: colors.dark.border,
            },
          },
        },

        primary: {
          DEFAULT: {
            value: {
              _light: colors.light.primary,
              _dark: colors.dark.primary,
            },
          },

          hover: {
            value: {
              _light: colors.light.primaryHover,
              _dark: colors.dark.primaryHover,
            },
          },
        },

        success: {
          DEFAULT: {
            value: {
              _light: colors.light.success,
              _dark: colors.dark.success,
            },
          },
        },

        warning: {
          DEFAULT: {
            value: {
              _light: colors.light.warning,
              _dark: colors.dark.warning,
            },
          },
        },

        error: {
          DEFAULT: {
            value: {
              _light: colors.light.error,
              _dark: colors.dark.error,
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);