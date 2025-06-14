import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        'primary': {
          50: { value: '#f8f9fb' },
          100: { value: '#f1f3f6' },
          200: { value: '#e3e7ed' },
          300: { value: '#d0d6e0' },
          400: { value: '#b8c2d1' },
          500: { value: '#9dabc2' },
          600: { value: '#7d8ca8' },
          700: { value: '#646f8a' },
          800: { value: '#525b72' },
          900: { value: '#464c5f' },
          950: { value: '#02060e' },
        },
        'secondary': {
          50: { value: '#f0f1ff' },
          100: { value: '#e4e6ff' },
          200: { value: '#cdd0ff' },
          300: { value: '#a6abff' },
          400: { value: '#7b82ff' },
          500: { value: '#646cff' },
          600: { value: '#4d54f5' },
          700: { value: '#3f45e1' },
          800: { value: '#3339be' },
          900: { value: '#2e3396' },
          950: { value: '#1c1f5a' },
        },
        'accent': {
          50: { value: '#eff0ff' },
          100: { value: '#e2e4ff' },
          200: { value: '#c7ccff' },
          300: { value: '#a5acff' },
          400: { value: '#8087ff' },
          500: { value: '#535bf2' },
          600: { value: '#3d44e8' },
          700: { value: '#2f35d4' },
          800: { value: '#262bab' },
          900: { value: '#252987' },
          950: { value: '#16184f' },
        },
        'bg': {
          value: {
            base: { value: 'primary.50' },
            _dark: { value: 'primary.950' },
          },
        },
        'bg.muted': {
          value: {
            base: { value: 'primary.100' },
            _dark: { value: 'primary.900' },
          },
        },
        'fg': {
          value: {
            base: { value: 'primary.950' },
            _dark: { value: 'primary.50' },
          },
        },
        'fg.muted': {
          value: {
            base: { value: 'primary.700' },
            _dark: { value: 'primary.300' },
          },
        },
        'border': {
          value: {
            base: { value: 'primary.200' },
            _dark: { value: 'primary.800' },
          },
        },
      },
      radii: {
        sm: { value: '0.25rem' },
        md: { value: '0.5rem' },
        lg: { value: '0.75rem' },
        xl: { value: '1rem' },
      },
      shadows: {
        sm: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
        md: {
          value:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        lg: {
          value:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: {
              base: '{colors.primary.50}',
              _dark: '{colors.primary.950}',
            },
          },
          muted: {
            value: {
              base: '{colors.primary.100}',
              _dark: '{colors.primary.900}',
            },
          },
          subtle: {
            value: {
              base: '{colors.primary.200}',
              _dark: '{colors.primary.800}',
            },
          },
        },
        fg: {
          DEFAULT: {
            value: {
              base: '{colors.primary.950}',
              _dark: '{colors.primary.50}',
            },
          },
          muted: {
            value: {
              base: '{colors.primary.700}',
              _dark: '{colors.primary.300}',
            },
          },
          subtle: {
            value: {
              base: '{colors.primary.600}',
              _dark: '{colors.primary.400}',
            },
          },
        },
        border: {
          DEFAULT: {
            value: {
              base: '{colors.primary.200}',
              _dark: '{colors.primary.800}',
            },
          },
          muted: {
            value: {
              base: '{colors.primary.300}',
              _dark: '{colors.primary.700}',
            },
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
