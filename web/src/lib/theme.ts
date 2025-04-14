import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
};

const styles = {
  global: () => ({
    'html, body': {
      backgroundColor: 'gray.900',
      color: 'white',
      minHeight: '100vh',
    },
    '*::placeholder': {
      color: 'whiteAlpha.400',
    },
    '*, *::before, &::after': {
      borderColor: 'whiteAlpha.200',
    },
  }),
};

const components = {
  Heading: {
    defaultProps: {
      color: 'gray.100',
    },
  },
  Text: {
    defaultProps: {
      color: 'gray.300',
    },
  },
  Button: {
    defaultProps: {
      colorScheme: 'brand',
      variant: 'solid',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
        _active: {
          bg: 'brand.700',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.400',
        _hover: {
          bg: 'brand.500',
          color: 'white',
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'gray.800',
        borderColor: 'whiteAlpha.100',
        boxShadow: 'xl',
      },
      header: {
        color: 'gray.100',
      },
      body: {
        color: 'gray.300',
      },
      overlay: {
        backdropFilter: 'blur(4px)',
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          borderColor: 'whiteAlpha.100',
          color: 'gray.300',
          fontWeight: 'medium',
        },
        td: {
          borderColor: 'whiteAlpha.100',
          color: 'gray.300',
        },
        tbody: {
          tr: {
            transition: 'all 0.2s',
            _hover: {
              bg: 'gray.800',
            },
          },
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'brand.500',
    },
    variants: {
      outline: {
        field: {
          bg: 'gray.800',
          borderColor: 'whiteAlpha.200',
          color: 'gray.100',
          _hover: {
            borderColor: 'brand.400',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
  Container: {
    baseStyle: {
      maxW: 'container.xl',
      px: { base: 4, md: 8 },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
});

export default theme;