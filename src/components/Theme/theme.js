import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#388e3c',
      main: '#2e7d32',
      dark: '#1b5e20',
    },
    secondary: {
      light: '#f57c00',
      main: '#ef6c00',
      dark: '#e65100',
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Quicksand, Roboto, Helvetica',
  },
});

export default theme;
