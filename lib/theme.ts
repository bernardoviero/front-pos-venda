import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'Trebuchet MS', sans-serif",
    body: "'Segoe UI', sans-serif",
  },
  colors: {
    brand: {
      50: '#eef8ff',
      100: '#d6ecff',
      200: '#add8ff',
      300: '#7dc1ff',
      400: '#4da9ff',
      500: '#188fff',
      600: '#0f70cc',
      700: '#0a5296',
      800: '#063560',
      900: '#031a31',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'transparent',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
});

export default theme;
