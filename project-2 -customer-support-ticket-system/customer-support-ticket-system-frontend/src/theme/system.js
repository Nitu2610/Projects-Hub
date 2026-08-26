import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#EFF6FF" },
          100: { value: "#DBEAFE" },
          200: { value: "#BFDBFE" },
          300: { value: "#93C5FD" },
          400: { value: "#60A5FA" },
          500: { value: "#2563EB" },
          600: { value: "#1D4ED8" },
          700: { value: "#1E40AF" },
          800: { value: "#1E3A8A" },
          900: { value: "#172554" },
        },
      },
    },

    semanticTokens: {
      colors: {
        support: {
          background: {
            value: {
              base: "#F8FAFC",
              _dark: "#0F172A",
            },
          },

          surface: {
            value: {
              base: "#FFFFFF",
              _dark: "#1E293B",
            },
          },

          border: {
            value: {
              base: "#E2E8F0",
              _dark: "#334155",
            },
          },

          text: {
            value: {
              base: "#0F172A",
              _dark: "#F8FAFC",
            },
          },

          muted: {
            value: {
              base: "#64748B",
              _dark: "#94A3B8",
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
